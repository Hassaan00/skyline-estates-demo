"use client";
import { useState } from "react";
import { useCurrency } from "./useCurrency";
import { AED_PER_USD } from "@/lib/data";
function S({ label, v, set, min, max, step, show }: any) { return (
    <label className="block"><span className="flex justify-between text-sm"><span className="text-white/60">{label}</span><span className="font-semibold text-white">{show}</span></span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(+e.target.value)} className="mt-3 w-full accent-[#d4a853]" /></label>); }

export default function Mortgage({ price: p0 = 3_850_000 }: { price?: number }) {
  const [cur] = useCurrency(); const r8 = cur === "USD" ? AED_PER_USD : 1;
  const [price, setPrice] = useState(p0); const [down, setDown] = useState(p0 > 5e6 ? 30 : 20); const [rate, setRate] = useState(4.25); const [years, setYears] = useState(25);
  const loan = price * (1 - down / 100); const m = rate / 1200; const n = years * 12; const pay = m ? (loan * m) / (1 - Math.pow(1 + m, -n)) : loan / n;
  const fees = price * 0.04 + price * 0.02 + 4580 + loan * 0.0025; const f = (v: number) => (cur === "USD" ? "$" : "AED ") + Math.round(v / r8).toLocaleString("en-US");
  const minDown = price > 5e6 ? 30 : 20;
  return (
    <div className="grid gap-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[.06] to-white/[.02] p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-7">
        <S label="Property price" v={price} set={(v: number) => { setPrice(v); if (down < (v > 5e6 ? 30 : 20)) setDown(v > 5e6 ? 30 : 20); }} min={500000} max={80000000} step={50000} show={f(price)} />
        <S label={`Down payment (min ${minDown}% for expats)`} v={down} set={(v: number) => setDown(Math.max(minDown, v))} min={20} max={80} step={5} show={`${down}% · ${f(price * down / 100)}`} />
        <S label="Interest rate" v={rate} set={setRate} min={2.5} max={7} step={0.05} show={`${rate.toFixed(2)}%`} />
        <S label="Term" v={years} set={setYears} min={5} max={25} step={1} show={`${years} years`} />
      </div>
      <div className="flex flex-col justify-between rounded-3xl bg-ink-950/60 p-7 ring-1 ring-white/10">
        <div><p className="text-xs font-semibold uppercase tracking-[.25em] text-accent-300">Estimated monthly</p><p className="mt-3 font-display text-5xl text-white sm:text-6xl">{f(pay)}</p><p className="mt-2 text-sm text-white/50">Loan {f(loan)} over {years} yrs</p></div>
        <dl className="mt-8 space-y-2.5 border-t border-white/10 pt-6 text-sm">
          <div className="flex justify-between"><dt className="text-white/50">DLD transfer fee (4%)</dt><dd className="text-white">{f(price * 0.04)}</dd></div>
          <div className="flex justify-between"><dt className="text-white/50">Agency fee (2%)</dt><dd className="text-white">{f(price * 0.02)}</dd></div>
          <div className="flex justify-between"><dt className="text-white/50">Registration & mortgage reg.</dt><dd className="text-white">{f(4580 + loan * 0.0025)}</dd></div>
          <div className="flex justify-between border-t border-white/10 pt-2.5 font-semibold"><dt className="text-white/80">Cash needed upfront</dt><dd className="text-accent-200">{f(price * down / 100 + fees)}</dd></div>
        </dl>
        <button onClick={() => window.dispatchEvent(new CustomEvent("open-chat", { detail: `I'd like mortgage pre-approval for a property around AED ${Math.round(price).toLocaleString()}` }))} className="btn-gold mt-6">Get pre-approved with Layla</button>
      </div>
    </div>
  );
}
