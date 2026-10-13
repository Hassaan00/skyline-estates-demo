"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, CalendarCheck2, Mic } from "lucide-react";
import Thumb from "./Thumb";
import { properties } from "@/lib/data";
const p = properties[2];
const steps = [
  { who: "u", t: "Looking for a 2-bed with a Burj view, budget around 4M. Moving in 2 months." },
  { who: "a", t: "Lovely brief. Burj Vista 2BR is AED 3.85M, high floor, facing the fountain. Shall I show you this week?" },
];
export default function HeroLayla() {
  const reduce = useReducedMotion();
  const v = (d: number) => ({ initial: { opacity: 0, y: reduce ? 0 : 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: reduce ? 0 : d, duration: reduce ? 0.01 : 0.6, ease: [0.22, 1, 0.36, 1] } });
  return (
    <div className="relative">
      <motion.div {...v(0.3)} className="relative w-full max-w-[400px] rounded-[28px] border border-white/15 bg-ink-950/70 p-4 shadow-[0_50px_120px_-30px_rgba(0,0,0,.9)] backdrop-blur-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent-200 to-accent-600 text-ink-950"><Sparkles size={16} /><span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink-950 bg-emerald-400" /></div>
          <div className="flex-1"><p className="text-sm font-semibold text-white">Layla</p><p className="text-[11px] text-white/50">AI property advisor · replies in 3s</p></div>
          <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/60">EN · عربي · RU</span>
        </div>
        <div className="space-y-2.5 py-3">
          {steps.map((s, i) => <motion.p key={i} {...v(0.8 + i * 0.9)} className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${s.who === "u" ? "ml-auto rounded-br-md bg-accent-400 text-ink-950" : "rounded-bl-md bg-white/[.07] text-white/90"}`}>{s.t}</motion.p>)}
          <motion.div {...v(2.4)} className="flex gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-2">
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl"><Thumb art={p.art} id={p.id} /></div>
            <div className="min-w-0 py-0.5"><p className="truncate text-[13px] font-semibold text-white">{p.title}</p><p className="text-[11px] text-white/50">Downtown · 2 bd · 1,540 sqft</p><p className="mt-1 text-[13px] font-semibold text-accent-200">AED 3.85M</p></div>
          </motion.div>
          <motion.div {...v(3.2)} className="flex items-center gap-3 rounded-2xl border border-accent-300/30 bg-accent-400/10 px-3 py-2.5">
            <CalendarCheck2 size={16} className="text-accent-300" /><p className="flex-1 text-[12.5px] text-white">Viewing booked · Thu 4:00 PM</p><span className="font-mono text-[11px] text-accent-200">SKY-7Q2LM</span>
          </motion.div>
        </div>
        <button onClick={() => window.dispatchEvent(new Event("open-voice"))} className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-2.5 text-[13px] font-semibold text-ink-950 transition hover:bg-accent-100"><Mic size={14} />Talk to Layla now</button>
      </motion.div>
      <motion.div {...v(3.8)} className="absolute -bottom-8 -left-12 hidden rounded-2xl border border-white/10 bg-ink-900/90 px-4 py-3 backdrop-blur-xl xl:block">
        <p className="text-[10px] uppercase tracking-[.2em] text-white/40">Lead score</p><p className="flex items-baseline gap-1 text-2xl font-semibold text-white">92<span className="text-xs font-medium text-emerald-400">HOT</span></p>
      </motion.div>
    </div>
  );
}
