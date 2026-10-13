export class Busy extends Error {}
export const MODEL = "openai/gpt-oss-20b";
export async function groq(key: string, messages: any[], tools: any[], retried = 0, deadline = Date.now() + 45000): Promise<any> {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 800, temperature: 0.3, reasoning_effort: "low", messages, tools, tool_choice: "auto" }), signal: AbortSignal.timeout(20000),
  });
  if (r.status === 429 || r.status >= 500) {
    const ra = Math.min(15, parseFloat(r.headers.get("retry-after") || "3") || 3);
    if (retried < 2 && Date.now() + ra * 1000 < deadline) { await new Promise((ok) => setTimeout(ok, ra * 1000)); return groq(key, messages, tools, retried + 1, deadline); }
    throw new Busy();
  }
  if (!r.ok) {
    const t = await r.text();
    // tool-call generation hiccup: retry once
    if (r.status === 400 && /tool|function|generat/i.test(t) && retried < 2) return groq(key, messages, tools, retried + 1, deadline);
    throw new Error("groq " + r.status + " " + t.slice(0, 200));
  }
  return (await r.json()).choices?.[0]?.message;
}
export const CONFIRM_RE = /\b(yes|yeah|yep|sure|ok|okay|confirm\w*|correct|perfect|great|book it|go ahead|please do|sounds good|s[ií]|claro|vale|perfecto|confirm[oa]|ja|genau|passt|best[äa]tig\w*|oui|d'accord|parfait|да|конечно|подтвержда\w*)\b|نعم|أكد|اكد|تمام|موافق|ايوه|أيوه/i;
export function dayList(tz: string, closedDow: string[] = [], n = 28) {
  const now = new Date(); const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() + i * 864e5);
    const ymd = d.toLocaleDateString("en-CA", { timeZone: tz }); const dow = d.toLocaleDateString("en-US", { timeZone: tz, weekday: "long" });
    const tag = i === 0 ? "today" : i === 1 ? "tomorrow" : i < 7 ? "this week" : "next week";
    out.push(`${dow} ${ymd} (${tag}${closedDow.includes(dow.slice(0, 3)) ? ", CLOSED" : ""})`);
  }
  return out.join("; ") + `. "Next <weekday>" means the first matching weekday labelled next week. Always double-check the weekday of the date you use.`;
}
export const weekday = (ymd: string) => new Date(ymd + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
export function normTime(t: string, TIMES: string[]) {
  const s = String(t || "").trim().toUpperCase().replace(/\s+/g, " ").replace(/\./g, "");
  const exact = TIMES.find((x) => x.toUpperCase() === s); if (exact) return exact;
  const m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/); if (!m) return null;
  let h = +m[1]; const min = m[2] || "00"; let ap = m[3];
  if (!ap) { if (h >= 13) { h -= 12; ap = "PM"; } else ap = h >= 8 && h < 12 ? "AM" : "PM"; }
  if (h === 0) h = 12;
  return TIMES.find((x) => x === `${h}:${min} ${ap}`) || null;
}
export const ref = (p: string) => p + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();

const DOWS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
/** Accepts YYYY-MM-DD or natural phrases ("tomorrow", "next wednesday", "this sat", "Oct 21") and returns YYYY-MM-DD in tz. */
export function resolveDate(input: string, tz: string): string {
  const s = String(input || "").trim().toLowerCase();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const todayYmd = new Date().toLocaleDateString("en-CA", { timeZone: tz });
  const base = new Date(todayYmd + "T12:00:00Z"); const add = (n: number) => new Date(base.getTime() + n * 864e5).toISOString().slice(0, 10);
  if (/\btoday\b/.test(s)) return todayYmd;
  if (/day after tomorrow/.test(s)) return add(2);
  if (/\btomorrow\b/.test(s)) return add(1);
  const di = DOWS.findIndex((d) => new RegExp(`\\b${d.slice(0, 3)}`).test(s));
  if (di >= 0) { let n = (di - base.getUTCDay() + 7) % 7 || 7; if (/\bnext\b/.test(s) && n <= 3) n += 7; return add(n); }
  const t = Date.parse(s + " " + todayYmd.slice(0, 4) + " 12:00 UTC"); if (!isNaN(t)) { let d = new Date(t).toISOString().slice(0, 10); if (d < todayYmd) d = (+d.slice(0, 4) + 1) + d.slice(4); return d; }
  return s.slice(0, 10);
}
