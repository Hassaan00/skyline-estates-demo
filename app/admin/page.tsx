"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Users, CalendarCheck2, Gauge, RefreshCw, LayoutDashboard, Building2, MessageSquare, Settings, Mic, MessageCircle, FileText, Database, Moon } from "lucide-react";
import Logo from "@/components/Logo";
import { fmtAED } from "@/lib/data";
type Lead = { id: string; name?: string; email?: string; phone?: string; purpose?: string; budgetAED?: number; areas?: string; beds?: number; timeline?: string; financing?: string; interested?: string[]; viewings?: string[]; score: number; source: string; updatedAt: string; sample?: boolean };
type V = { ref: string; propertyTitle: string; date: string; time: string; name: string; phone?: string; email?: string; source: string; createdAt: string; sample?: boolean };
const samples: Lead[] = [
  { id: "x1", name: "Omar Al Mansouri", purpose: "buy", budgetAED: 40e6, areas: "Palm Jumeirah", beds: 6, timeline: "1-3 months", financing: "cash", score: 88, source: "voice", updatedAt: "", sample: true, phone: "+97•••12" },
  { id: "x2", name: "Hannah Becker", purpose: "rent", budgetAED: 450000, areas: "Bluewaters", beds: 3, timeline: "this month", financing: "", score: 71, source: "chat", updatedAt: "", sample: true, email: "ha•••@gmail.com" },
  { id: "x3", name: "Arjun Mehta", purpose: "invest", budgetAED: 1.8e6, areas: "Creek Harbour", beds: 1, timeline: "6 months", financing: "mortgage", score: 46, source: "chat", updatedAt: "", sample: true },
];
const sampleV: V[] = [{ ref: "SKY-4KD8P", propertyTitle: "Signature Villa, Frond K", date: "Sample", time: "11:30 AM", name: "Omar Al Mansouri", source: "voice", createdAt: "", sample: true }];
const tone = (s: number) => (s >= 70 ? "text-rose-300 bg-rose-500/10 ring-rose-400/30" : s >= 45 ? "text-amber-200 bg-amber-400/10 ring-amber-300/30" : "text-sky-200 bg-sky-400/10 ring-sky-300/30");
const label = (s: number) => (s >= 70 ? "Hot" : s >= 45 ? "Warm" : "Cold");
export default function Admin() {
  const [d, setD] = useState<{ storage: string; leads: Lead[]; viewings: V[] } | null>(null); const [t, setT] = useState("");
  const load = () => fetch("/api/admin", { cache: "no-store" }).then((r) => r.json()).then((j) => { setD(j); setT(new Date().toLocaleTimeString()); });
  useEffect(() => { load(); const i = setInterval(load, 8000); return () => clearInterval(i); }, []);
  const leads = [...(d?.leads || []), ...samples]; const views = [...(d?.viewings || []), ...sampleV];
  const hot = leads.filter((l) => l.score >= 70); const pipeline = leads.reduce((s, l) => s + (l.purpose !== "rent" ? l.budgetAED || 0 : 0), 0);
  const kpi = [[Users, "Leads captured", leads.length, "+38% vs last week"], [Flame, "Hot leads", hot.length, "score ≥ 70"], [CalendarCheck2, "Viewings booked", views.length, "by Layla & web"], [Gauge, "Buyer pipeline", fmtAED(pipeline), "qualified budget"]] as const;
  const hours = [2, 1, 1, 0, 0, 1, 2, 4, 6, 7, 8, 7, 6, 7, 8, 9, 10, 11, 13, 14, 12, 10, 7, 4];
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-white/10 bg-ink-950 p-5 lg:flex">
        <Logo /><nav className="mt-10 space-y-1 text-sm">{[[LayoutDashboard, "Overview", true], [Users, "Leads"], [CalendarCheck2, "Viewings"], [Building2, "Listings"], [MessageSquare, "Conversations"], [FileText, "Offers"], [Settings, "Settings"]].map(([I, l, a]: any) => <a key={l} href="#" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${a ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}><I size={16} />{l}</a>)}</nav>
        <div className="mt-auto rounded-2xl border border-accent-300/20 bg-accent-400/10 p-4 text-xs text-accent-100"><p className="font-semibold">Layla is live</p><p className="mt-1 text-accent-100/70">Answering chat & voice 24/7 in 4 languages.</p></div>
      </aside>
      <main className="lg:pl-60">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b0b0f]/80 px-6 py-4 backdrop-blur-xl">
          <div><h1 className="text-lg font-semibold">Good evening, Noor</h1><p className="text-xs text-white/45">AI lead desk · live data from {d?.storage === "vercel-blob" ? "Vercel Blob" : d?.storage || "…"}{t && ` · updated ${t}`}</p></div>
          <div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300 sm:flex"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Live</span><button onClick={load} className="rounded-full border border-white/15 p-2 hover:bg-white/5" aria-label="Refresh"><RefreshCw size={15} /></button><Link href="/" className="rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5">View site</Link></div>
        </header>
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpi.map(([I, l, v, s]: any) => <div key={l} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="flex items-center justify-between text-white/50"><p className="text-xs uppercase tracking-[.18em]">{l}</p><I size={16} className="text-accent-300" /></div><p className="mt-3 text-3xl font-semibold tracking-tight">{v}</p><p className="mt-1 text-xs text-white/40">{s}</p></div>)}</div>

          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <section className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
              <div className="flex items-center justify-between"><h2 className="font-semibold">Enquiries by hour</h2><span className="flex items-center gap-1.5 text-xs text-white/45"><Moon size={12} />62% arrive outside office hours</span></div>
              <div className="mt-6 flex h-40 items-end gap-1.5">{hours.map((h, i) => <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1"><div className={`w-full rounded-t ${i < 9 || i > 20 ? "bg-accent-400" : "bg-white/20"}`} style={{ height: `${(h / 14) * 100}%` }} title={`${i}:00 · ${h}`} /><span className="text-[9px] text-white/30">{i % 3 === 0 ? i : ""}</span></div>)}</div>
              <p className="mt-3 flex items-center gap-4 text-xs text-white/45"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-accent-400" />Handled only by Layla</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-white/20" />Office hours</span></p>
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
              <h2 className="flex items-center gap-2 font-semibold"><Flame size={16} className="text-rose-300" />Hot leads, call first</h2>
              <ul className="mt-4 space-y-3">{hot.slice(0, 4).map((l) => <li key={l.id} className="flex items-center gap-3 rounded-xl bg-white/[.04] p-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-rose-500/15 font-semibold text-rose-200">{l.score}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{l.name || "Anonymous visitor"}{l.sample && <span className="ml-2 text-[10px] text-white/35">sample</span>}</p><p className="truncate text-xs text-white/45">{[l.purpose, l.budgetAED && fmtAED(l.budgetAED), l.areas, l.timeline].filter(Boolean).join(" · ")}</p></div></li>)}{!hot.length && <li className="text-sm text-white/45">No hot leads yet.</li>}</ul>
            </section>
          </div>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]">
            <div className="flex items-center justify-between p-5"><h2 className="font-semibold">Leads · qualified by Layla</h2><span className="text-xs text-white/40">{leads.length} total</span></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-sm"><thead className="border-y border-white/10 text-left text-[11px] uppercase tracking-[.15em] text-white/40"><tr>{["Lead", "Score", "Intent", "Budget", "Area · beds", "Timeline", "Finance", "Channel"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead>
              <tbody>{leads.map((l) => <tr key={l.id} className="border-b border-white/5 hover:bg-white/[.02]">
                <td className="px-5 py-3.5"><p className="font-medium">{l.name || "Anonymous visitor"}{l.sample && <span className="ml-2 text-[10px] text-white/35">sample</span>}</p><p className="text-xs text-white/40">{l.email || l.phone || "no contact yet"}</p></td>
                <td className="px-5 py-3.5"><span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone(l.score)}`}>{l.score}<span className="font-normal opacity-80">{label(l.score)}</span></span><div className="mt-1.5 h-1 w-20 rounded-full bg-white/10"><div className="h-1 rounded-full bg-gradient-to-r from-accent-500 to-rose-400" style={{ width: `${l.score}%` }} /></div></td>
                <td className="px-5 py-3.5 capitalize text-white/75">{l.purpose || "–"}</td><td className="px-5 py-3.5 text-white/75">{l.budgetAED ? fmtAED(l.budgetAED) : "–"}</td><td className="px-5 py-3.5 text-white/75">{l.areas || "–"}{l.beds ? ` · ${l.beds} BR` : ""}</td><td className="px-5 py-3.5 text-white/75">{l.timeline || "–"}</td><td className="px-5 py-3.5 capitalize text-white/75">{l.financing || "–"}</td>
                <td className="px-5 py-3.5"><span className="inline-flex items-center gap-1.5 text-xs text-white/60">{l.source === "voice" ? <Mic size={12} /> : <MessageCircle size={12} />}{l.source}{l.viewings?.length ? <span className="ml-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-emerald-300">viewing</span> : null}</span></td></tr>)}</tbody></table></div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]">
            <div className="flex items-center justify-between p-5"><h2 className="font-semibold">Viewings diary</h2><span className="flex items-center gap-1.5 text-xs text-white/40"><Database size={12} />no double-booking, enforced at storage level</span></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="border-y border-white/10 text-left text-[11px] uppercase tracking-[.15em] text-white/40"><tr>{["Ref", "Property", "When", "Client", "Contact", "Booked via"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead>
              <tbody>{views.map((v) => <tr key={v.ref} className="border-b border-white/5"><td className="px-5 py-3.5 font-mono text-xs text-accent-200">{v.ref}</td><td className="px-5 py-3.5">{v.propertyTitle}</td><td className="px-5 py-3.5 text-white/75">{v.date} · {v.time}</td><td className="px-5 py-3.5">{v.name}{v.sample && <span className="ml-2 text-[10px] text-white/35">sample</span>}</td><td className="px-5 py-3.5 text-white/50">{v.phone || v.email || "–"}</td><td className="px-5 py-3.5"><span className="rounded-full bg-white/10 px-2.5 py-1 text-xs capitalize">{v.source === "form" ? "website" : `Layla · ${v.source}`}</span></td></tr>)}</tbody></table></div>
          </section>
        </div>
      </main>
    </div>
  );
}
