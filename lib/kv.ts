import { put, list, get } from "@vercel/blob";
const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
export const storageName = hasBlob ? "vercel-blob" : "memory";
const mem: Map<string, string> = (globalThis as any).__kvMem || ((globalThis as any).__kvMem = new Map());
export class Exists extends Error {}

/** Atomic create: throws Exists if the path is already taken (used for no-double-booking). */
export async function putNew(path: string, obj: unknown) {
  if (!hasBlob) { if (mem.has(path)) throw new Exists(); mem.set(path, JSON.stringify(obj)); return; }
  try { await put(path, JSON.stringify(obj), { access: "private", addRandomSuffix: false, allowOverwrite: false, contentType: "application/json" }); }
  catch (e: any) { if (/exist/i.test(String(e?.message))) throw new Exists(); throw e; }
}
export async function putAny(path: string, obj: unknown) {
  if (!hasBlob) { mem.set(path, JSON.stringify(obj)); return; }
  await put(path, JSON.stringify(obj), { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
}
export async function keys(prefix: string): Promise<string[]> {
  if (!hasBlob) return [...mem.keys()].filter((k) => k.startsWith(prefix));
  const out: string[] = []; let cursor: string | undefined;
  do { const r = await list({ prefix, cursor, limit: 1000 }); out.push(...r.blobs.map((b) => b.pathname)); cursor = r.hasMore ? r.cursor : undefined; } while (cursor);
  return out;
}
export async function readOne<T>(path: string): Promise<T | null> {
  if (!hasBlob) { const v = mem.get(path); return v ? JSON.parse(v) : null; }
  try { const r = await get(path, { access: "private" }); if (r && r.statusCode === 200) return JSON.parse(await new Response(r.stream).text()); } catch {}
  return null;
}
export async function readAll<T>(prefix: string): Promise<T[]> {
  const ks = await keys(prefix);
  const out = await Promise.all(ks.map((k) => readOne<T>(k)));
  return out.filter(Boolean) as T[];
}
