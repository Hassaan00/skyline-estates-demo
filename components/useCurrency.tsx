"use client";
import { useEffect, useState } from "react";
export type Cur = "AED" | "USD";
export function useCurrency(): [Cur, (c: Cur) => void] {
  const [c, setC] = useState<Cur>("AED");
  useEffect(() => { const v = localStorage.getItem("cur") as Cur; if (v) setC(v); const f = () => setC((localStorage.getItem("cur") as Cur) || "AED"); window.addEventListener("cur", f); return () => window.removeEventListener("cur", f); }, []);
  return [c, (v: Cur) => { localStorage.setItem("cur", v); window.dispatchEvent(new Event("cur")); }];
}
export function CurrencyToggle({ className = "" }: { className?: string }) {
  const [c, set] = useCurrency();
  return <div className={`flex rounded-full border border-white/15 p-0.5 text-[11px] font-semibold ${className}`} role="group" aria-label="Currency">
    {(["AED", "USD"] as Cur[]).map((x) => <button key={x} aria-pressed={c === x} onClick={() => set(x)} className={`rounded-full px-2.5 py-1 transition ${c === x ? "bg-accent-400 text-ink-950" : "text-white/60 hover:text-white"}`}>{x}</button>)}
  </div>;
}
