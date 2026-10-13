import { putNew, putAny, readAll, keys, Exists, storageName } from "./kv";
import { properties, getProperty, VIEW_TIMES, TZ } from "./data";
import { normTime, ref } from "./groq";
export { storageName };
export type Viewing = { ref: string; propertyId: string; propertyTitle: string; date: string; time: string; name: string; email?: string; phone?: string; notes?: string; source: "chat" | "voice" | "form"; sessionId?: string; createdAt: string };
export type Lead = { id: string; name?: string; email?: string; phone?: string; purpose?: string; budgetAED?: number; areas?: string; beds?: number; timeline?: string; financing?: string; notes?: string; interested?: string[]; viewings?: string[]; score: number; source: string; createdAt: string; updatedAt: string };
const V = "viewings/v1/", L = "leads/v1/";
const slot = (pid: string, date: string, time: string) => `${pid}_${time.replace(/[^0-9APM]/gi, "")}`;
export const today = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ });
export class SlotTaken extends Error {}

export async function availability(propertyId: string, date: string) {
  const p = getProperty(propertyId); date = String(date || "").slice(0, 10);
  if (!p) return { error: "unknown property id", validIds: properties.map((x) => x.id) };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "date must be YYYY-MM-DD" };
  if (date < today()) return { propertyId: p.id, date, free: [], note: "date is in the past" };
  const taken = new Set((await keys(V + date + "/")).map((k) => k.split("/").pop()!.replace(/\.json$/, "")));
  return { propertyId: p.id, property: p.title, date, free: VIEW_TIMES.filter((t) => !taken.has(slot(p.id, date, t))) };
}
export async function createViewing(i: Partial<Viewing>): Promise<Viewing> {
  const p = getProperty(i.propertyId || ""); const date = String(i.date || "").slice(0, 10); const time = normTime(i.time || "", VIEW_TIMES);
  if (!p || !time || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today()) throw new Error("Invalid property, date or time. Valid times: " + VIEW_TIMES.join(", "));
  if (!i.name || !(i.email || i.phone)) throw new Error("Name and phone or email are required");
  const v: Viewing = { ref: ref("SKY"), propertyId: p.id, propertyTitle: p.title, date, time, name: String(i.name).slice(0, 80), email: i.email?.slice(0, 120), phone: i.phone?.slice(0, 40), notes: i.notes?.slice(0, 400), source: i.source || "form", sessionId: i.sessionId, createdAt: new Date().toISOString() };
  try { await putNew(`${V}${date}/${slot(p.id, date, time)}.json`, v); } catch (e) { if (e instanceof Exists) throw new SlotTaken(); throw e; }
  return v;
}
export const listViewings = async () => (await readAll<Viewing>(V)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const listLeads = async () => (await readAll<Lead>(L)).sort((a, b) => b.score - a.score || b.updatedAt.localeCompare(a.updatedAt));

export function scoreLead(l: Partial<Lead>) {
  let s = 0;
  if (l.budgetAED) s += l.budgetAED >= 10e6 ? 25 : l.budgetAED >= 3e6 ? 20 : 15;
  if (l.areas) s += 10; if (l.beds) s += 5; if (l.purpose) s += 5;
  const t = (l.timeline || "").toLowerCase();
  if (/now|immediate|asap|this month|week|1 month|urgent|30 days/.test(t)) s += 25; else if (/\b[1-3]\s*month|quarter|soon/.test(t)) s += 18; else if (/[4-6]\s*month|half|6/.test(t)) s += 10; else if (t) s += 4;
  const f = (l.financing || "").toLowerCase();
  if (/cash/.test(f)) s += 15; else if (/pre-?approv|approved/.test(f)) s += 12; else if (/mortgage|finance/.test(f)) s += 6;
  if (l.name) s += 3; if (l.phone || l.email) s += 7;
  if (l.viewings?.length) s += 15;
  return Math.min(100, s);
}
export async function upsertLead(sessionId: string, patch: Partial<Lead>, source = "chat") {
  const id = (sessionId || ref("S")).replace(/[^a-zA-Z0-9-]/g, "").slice(0, 40);
  const cur = (await readAll<Lead>(L + id + ".json"))[0];
  const now = new Date().toISOString();
  const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined && v !== null && v !== "")) as Partial<Lead>;
  const merged: Lead = { ...(cur || { id, score: 0, source, createdAt: now }), ...clean, updatedAt: now } as Lead;
  if (cur?.interested || clean.interested) merged.interested = [...new Set([...(cur?.interested || []), ...(clean.interested || [])])].slice(0, 8);
  if (cur?.viewings || clean.viewings) merged.viewings = [...new Set([...(cur?.viewings || []), ...(clean.viewings || [])])];
  merged.score = scoreLead(merged);
  await putAny(L + id + ".json", merged);
  return merged;
}
