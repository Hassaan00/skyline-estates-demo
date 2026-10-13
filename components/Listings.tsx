"use client";
import { useMemo, useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { properties, areas, AED_PER_USD } from "@/lib/data";
import PropertyCard from "./PropertyCard";
import { useCurrency } from "./useCurrency";
export default function Listings({ init = {} as Record<string, string>, limit }: { init?: Record<string, string>; limit?: number }) {
  const [cur] = useCurrency();
  const [purpose, setPurpose] = useState(init.purpose || "all");
  const [area, setArea] = useState(init.area || "all");
  const [beds, setBeds] = useState(init.beds || "0");
  const [max, setMax] = useState(init.max || "0");
  const [status, setStatus] = useState(init.status || "all");
  const [q, setQ] = useState("");
  const rate = cur === "USD" ? AED_PER_USD : 1;
  const maxOpts = purpose === "rent" ? [150_000, 250_000, 500_000] : [2_000_000, 5_000_000, 15_000_000, 50_000_000];
  const list = useMemo(() => properties.filter((p) => (purpose === "all" || p.purpose === purpose) && (area === "all" || p.area === area) && p.beds >= +beds && (max === "0" || p.price <= +max) && (status === "all" || p.status === status) && (!q || (p.title + p.area + p.community + p.view).toLowerCase().includes(q.toLowerCase()))), [purpose, area, beds, max, status, q]);
  const fmt = (n: number) => { const v = n / rate; return (cur === "USD" ? "$" : "AED ") + (v >= 1e6 ? +(v / 1e6).toFixed(1) + "M" : Math.round(v / 1000) + "K"); };
  return (
    <div>
      <div className="glass flex flex-col gap-3 rounded-3xl p-3 lg:flex-row lg:items-center" role="search">
        <div className="flex rounded-full bg-white/5 p-1 text-sm" role="group" aria-label="Buy or rent">
          {[["all", "All"], ["buy", "Buy"], ["rent", "Rent"]].map(([v, l]) => <button key={v} aria-pressed={purpose === v} onClick={() => { setPurpose(v); setMax("0"); }} className={`flex-1 rounded-full px-5 py-2 transition lg:flex-none ${purpose === v ? "bg-white text-ink-950" : "text-white/60 hover:text-white"}`}>{l}</button>)}
        </div>
        <label className="relative flex-1"><span className="sr-only">Search</span><Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search community, view…" className="field !rounded-full pl-10" /></label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex">
          <select aria-label="Area" value={area} onChange={(e) => setArea(e.target.value)} className="field !rounded-full lg:w-44"><option value="all">All areas</option>{areas.map((a) => <option key={a}>{a}</option>)}</select>
          <select aria-label="Bedrooms" value={beds} onChange={(e) => setBeds(e.target.value)} className="field !rounded-full lg:w-32"><option value="0">Any beds</option>{[1, 2, 3, 4, 5, 6].map((b) => <option key={b} value={b}>{b}+ beds</option>)}</select>
          <select aria-label="Max price" value={max} onChange={(e) => setMax(e.target.value)} className="field !rounded-full lg:w-40"><option value="0">Any price</option>{maxOpts.map((m) => <option key={m} value={m}>Up to {fmt(m)}{purpose === "rent" ? "/yr" : ""}</option>)}</select>
          <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="field !rounded-full lg:w-36"><option value="all">Ready & off-plan</option><option>Ready</option><option>Off-plan</option></select>
        </div>
      </div>
      <p className="mt-6 flex items-center gap-2 text-sm text-white/50"><SlidersHorizontal size={14} />{list.length} {list.length === 1 ? "residence" : "residences"} · prices in {cur}</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{(limit ? list.slice(0, limit) : list).map((p) => <PropertyCard key={p.id} p={p} />)}</div>
      {!list.length && <div className="mt-6 rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/60">No exact matches. <button onClick={() => window.dispatchEvent(new CustomEvent("open-chat", { detail: "Nothing matched my filters, can you suggest something close?" }))} className="text-accent-200 underline underline-offset-4">Ask Layla for the closest options</button>.</div>}
    </div>
  );
}
