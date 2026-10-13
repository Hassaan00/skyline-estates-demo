import { NextResponse } from "next/server";
import { brand, properties, areas, agents, VIEW_TIMES, TZ, getProperty, fmtAED, fmtUSD, AED_PER_USD } from "@/lib/data";
import { fallback, detectLang, busy } from "@/lib/fallback";
import { groq, Busy, CONFIRM_RE, dayList, weekday } from "@/lib/groq";
import { availability, createViewing, SlotTaken, upsertLead, type Viewing } from "@/lib/store";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const catalog = properties.map((p) => `${p.id}: ${p.area}, ${p.beds}BR ${p.type}, ${p.purpose === "rent" ? "rent " + fmtAED(p.price) + "/yr" : fmtAED(p.price)}${p.status === "Off-plan" ? ", off-plan" : ""}`).join("\n");

const system = () => `You are Layla, the elegant AI property advisor for ${brand.name}, a luxury Dubai brokerage. Office ${brand.address}, phone ${brand.phone}.
LISTINGS (only these exist; get details with search_properties):
${catalog}
FACTS: 1 USD = ${AED_PER_USD} AED. Fees: DLD 4%, agency 2%. Expat mortgages up to 80% LTV under AED 5M (70% above), 25 yrs, ~4-4.5%. AED 2M+ property can qualify for the 10-year Golden Visa. Rent is paid yearly in 1-4 cheques.
DATES (Asia/Dubai): ${dayList(TZ, [], 14)}. Viewing times daily: ${VIEW_TIMES.join(", ")}.
RULES: Always answer the question first (e.g. search and name matching homes) and only ask for name/contact when booking. Learn buy/rent, budget, area, beds, timeline, cash or mortgage (max 1-2 questions at a time). Call save_lead whenever you learn any of these or name/contact. Use search_properties to recommend 1-3 real matches by name and price. Before offering or accepting a viewing time ALWAYS call check_availability (pass the user's day words, e.g. "next wednesday", as date; it returns the exact date and weekday). Collect full name and phone or email, summarise and ask to confirm; only after a clear yes call create_viewing, then give the reference. Never say a viewing is booked unless create_viewing returned ok.
STYLE: reply in the user's language (English, Arabic, Russian, French...). 1-3 short spoken-style sentences, plain text, no markdown, lists or URLs. Prices in AED.`;

const tools = [
  { type: "function", function: { name: "search_properties", description: "Search listings", parameters: { type: "object", properties: {
    purpose: { type: "string", enum: ["buy", "rent"] }, area: { type: "string" }, minBeds: { type: "number" },
    maxPriceAED: { type: "number" }, minPriceAED: { type: "number" }, type: { type: "string", enum: ["Apartment", "Penthouse", "Villa", "Townhouse", "Mansion"] }, offPlan: { type: "boolean" } } } } },
  { type: "function", function: { name: "check_availability", description: "Free viewing times", parameters: { type: "object", properties: { propertyId: { type: "string", enum: properties.map((p) => p.id) }, date: { type: "string", description: "YYYY-MM-DD, or the user's own words e.g. next wednesday, tomorrow, saturday" } }, required: ["propertyId", "date"] } } },
  { type: "function", function: { name: "create_viewing", description: "Book viewing after explicit confirmation", parameters: { type: "object", properties: { propertyId: { type: "string", enum: properties.map((p) => p.id) }, date: { type: "string", description: "exact YYYY-MM-DD returned by check_availability" }, time: { type: "string", enum: VIEW_TIMES }, name: { type: "string" }, phone: { type: "string" }, email: { type: "string" }, notes: { type: "string" } }, required: ["propertyId", "date", "time", "name"] } } },
  { type: "function", function: { name: "save_lead", description: "Save client requirements", parameters: { type: "object", properties: { purpose: { type: "string", enum: ["buy", "rent", "invest"] }, budgetAED: { type: "number" }, areas: { type: "string" }, beds: { type: "number" }, timeline: { type: "string" }, financing: { type: "string" }, name: { type: "string" }, phone: { type: "string" }, email: { type: "string" }, notes: { type: "string" } } } } },
];

function search(a: any) {
  const area = String(a.area || "").toLowerCase();
  let r = properties.filter((p) => (!a.purpose || p.purpose === a.purpose) && (!a.type || p.type === a.type) && (!a.minBeds || p.beds >= a.minBeds)
    && (!a.maxPriceAED || p.price <= a.maxPriceAED * 1.1) && (!a.minPriceAED || p.price >= a.minPriceAED * 0.9) && (a.offPlan === undefined || (p.status === "Off-plan") === a.offPlan)
    && (!area || p.area.toLowerCase().includes(area) || p.community.toLowerCase().includes(area) || area.includes(p.area.toLowerCase().split(",")[0])));
  return r.slice(0, 4);
}

export async function POST(req: Request) {
  const t0 = Date.now();
  let messages: { role: "user" | "assistant"; content: string }[] = []; let channel: "chat" | "voice" = "chat"; let sessionId = "";
  try { const b = await req.json(); channel = b.channel === "voice" ? "voice" : "chat"; sessionId = String(b.sessionId || "").slice(0, 40);
    messages = (b.messages || []).slice(-12).map((m: any) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content).slice(0, 1500) })); } catch {}
  const last = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const key = process.env.GROQ_API_KEY;
  let booking: Viewing | undefined; let cards: string[] = [];
  const card = () => booking && { ref: booking.ref, title: "Viewing confirmed", href: `/properties/${booking.propertyId}`, lines: [["Property", booking.propertyTitle], ["When", `${weekday(booking.date).slice(0, 3)} ${booking.date} · ${booking.time}`], ["Client", booking.name], ["Agent", agents.find((x) => x.id === getProperty(booking!.propertyId)?.agent)?.name || "Skyline"]] };
  const items = () => [...new Set(cards)].slice(0, 3).map((id) => { const p = getProperty(id)!; return { id, title: p.title, sub: `${p.area} · ${p.beds} BR · ${p.sqft.toLocaleString()} sqft`, price: fmtAED(p.price) + (p.purpose === "rent" ? "/yr" : ""), alt: fmtUSD(p.price), href: `/properties/${id}`, art: p.art }; });
  const out = (reply: string, source: string) => NextResponse.json({ reply, source, booking: card(), items: items() });
  if (key) {
    try {
      const confirmed = CONFIRM_RE.test(last);
      const convo: any[] = [{ role: "system", content: system() }, ...messages]; let corrected = false; let pending: any = null;
      for (let i = 0; i < 6; i++) {
        const msg = await groq(key, convo, tools, 0, t0 + 52000);
        if (!msg) break;
        if (msg.tool_calls?.length) {
          convo.push({ role: "assistant", content: msg.content || "", tool_calls: msg.tool_calls });
          for (const tc of msg.tool_calls) {
            let result: any; let a: any = {};
            try { a = JSON.parse(tc.function.arguments || "{}"); } catch {}
            try {
              const n = tc.function.name;
              if (n === "search_properties") { const r = search(a); cards = r.map((p) => p.id); result = { count: r.length, results: r.map((p) => ({ id: p.id, title: p.title, area: p.area, price: fmtAED(p.price) + (p.purpose === "rent" ? "/yr" : ""), usd: fmtUSD(p.price), beds: p.beds, status: p.status, view: p.view })), note: r.length ? undefined : "No exact match. Suggest the closest from the listings." };
                if (sessionId && r.length) await upsertLead(sessionId, { interested: r.map((p) => p.id) }, channel).catch(() => {}); }
              else if (n === "check_availability") result = await availability(a.propertyId, a.date);
              else if (n === "save_lead") { const l = await upsertLead(sessionId, a, channel); result = { ok: true, score: l.score }; }
              else if (n === "create_viewing") {
                if (!confirmed) { pending = a; result = { ok: false, error: "needs_confirmation", message: "Not booked yet. Summarise the details and ask the user to confirm first." }; }
                else if (booking) result = { ok: true, ref: booking.ref, note: "already booked this turn" };
                else { booking = await createViewing({ ...a, source: channel, sessionId }); cards = [];
                  await upsertLead(sessionId, { name: a.name, phone: a.phone, email: a.email, viewings: [booking.ref], interested: [booking.propertyId] }, channel).catch(() => {});
                  result = { ok: true, ref: booking.ref, weekday: weekday(booking.date), viewing: booking }; }
              } else result = { error: "unknown tool" };
            } catch (e: any) { result = e instanceof SlotTaken ? { ok: false, error: "slot_taken", message: "That slot was just booked by someone else. Check availability again and offer alternatives." } : { ok: false, error: e?.message || "failed" }; }
            convo.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
          }
          continue;
        }
        const reply = (msg.content || "").trim();
        if (reply && !booking && pending && !/\?\s*$/.test(reply)) return out(`Just to confirm: a private viewing of ${getProperty(pending.propertyId)?.title || "the property"} on ${pending.date} at ${pending.time}, for ${pending.name}${pending.phone || pending.email ? " (" + (pending.phone || pending.email) + ")" : ""}. Shall I book it?`, "groq");
        if (reply && !booking && !corrected && /\b(confirmed|booked|is set|reserved|all set)\b|تم الحجز|تأكيد الحجز|подтвержд|réservée|confirmée/i.test(reply) && !/\?\s*$/.test(reply)) {
          corrected = true; convo.push({ role: "assistant", content: reply }, { role: "system", content: "Correction: nothing is booked yet (create_viewing has not succeeded). Do not claim a booking. Continue: check availability, collect full name and phone/email, summarise and ask the user to confirm." }); continue;
        }
        if (reply && !booking && corrected && /\b(confirmed|booked|reserved|all set)\b/i.test(reply) && !/\?\s*$/.test(reply)) return out("Perfect, I have everything I need. Shall I go ahead and confirm this viewing for you?", "groq");
        if (reply) return out(reply, "groq");
        break;
      }
      if (booking) return out(`You're confirmed! Your viewing reference is ${booking.ref}.`, "groq");
    } catch (e) { console.error("chat error", e); if (booking) return out(`You're confirmed! Your viewing reference is ${booking.ref}.`, "groq"); if (e instanceof Busy) return out(busy[detectLang(last)], "busy"); }
  }
  return out(fallback(last), "fallback");
}
