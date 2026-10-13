"use client";
import { useEffect, useState } from "react";
import { CalendarCheck2, Loader2 } from "lucide-react";
export default function ViewingForm({ propertyId, title }: { propertyId: string; title: string }) {
  const days = Array.from({ length: 10 }).map((_, i) => new Date(Date.now() + (i + 1) * 864e5).toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" }));
  const [date, setDate] = useState(days[0]); const [free, setFree] = useState<string[] | null>(null); const [time, setTime] = useState("");
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [busy, setBusy] = useState(false); const [done, setDone] = useState<any>(null); const [err, setErr] = useState("");
  useEffect(() => { setFree(null); setTime(""); fetch(`/api/availability?property=${propertyId}&date=${date}`).then((r) => r.json()).then((j) => setFree(j.free || [])); }, [date, propertyId, done]);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/viewings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ propertyId, date, time, name, phone, sessionId: sessionStorage.getItem("sky-session") }) });
    const j = await r.json(); setBusy(false); if (j.ok) setDone(j.viewing); else setErr(j.error); }
  if (done) return <div className="rounded-3xl border border-accent-300/30 bg-accent-400/10 p-6"><CalendarCheck2 className="text-accent-300" /><p className="mt-3 font-display text-2xl text-white">Viewing confirmed</p><p className="mt-1 text-sm text-white/60">{title} · {done.date} at {done.time}. Ref <span className="font-mono text-accent-200">{done.ref}</span></p></div>;
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">{days.map((d) => { const dt = new Date(d + "T12:00:00"); return (
        <button type="button" key={d} onClick={() => setDate(d)} aria-pressed={date === d} className={`w-16 shrink-0 rounded-2xl border py-2.5 text-center transition ${date === d ? "border-accent-300 bg-accent-400 text-ink-950" : "border-white/10 text-white/70 hover:border-white/30"}`}>
          <span className="block text-[10px] uppercase tracking-widest opacity-70">{dt.toLocaleDateString("en-US", { weekday: "short" })}</span><span className="block text-lg font-semibold">{dt.getDate()}</span></button>); })}</div>
      <div className="grid grid-cols-3 gap-2" aria-live="polite">{free === null ? <p className="col-span-3 text-sm text-white/40">Checking live availability…</p> : free.length ? free.map((t) => <button type="button" key={t} onClick={() => setTime(t)} aria-pressed={time === t} className={`rounded-xl border py-2 text-[13px] transition ${time === t ? "border-accent-300 bg-accent-400/15 text-accent-100" : "border-white/10 text-white/70 hover:border-white/30"}`}>{t}</button>) : <p className="col-span-3 text-sm text-white/50">Fully booked, try another day.</p>}</div>
      <div className="grid gap-2 sm:grid-cols-2"><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" aria-label="Full name" className="field" /><input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone / WhatsApp" aria-label="Phone" className="field" /></div>
      {err && <p className="text-sm text-rose-300">{err}</p>}
      <button disabled={!time || busy} className="btn-gold w-full disabled:opacity-40">{busy ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck2 size={16} />}Book private viewing</button>
    </form>
  );
}
