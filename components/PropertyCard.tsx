"use client";
import Link from "next/link";
import { BedDouble, Bath, Maximize2, ArrowUpRight, Heart } from "lucide-react";
import { useState } from "react";
import Thumb from "./Thumb";
import { useCurrency } from "./useCurrency";
import { priceLabel, type Property } from "@/lib/data";
export default function PropertyCard({ p, big = false }: { p: Property; big?: boolean }) {
  const [cur] = useCurrency(); const [fav, setFav] = useState(false);
  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-ink-900 transition duration-500 hover:-translate-y-1 hover:border-accent-300/40 hover:shadow-[0_30px_80px_-30px_rgba(212,168,83,.35)]">
      <Link href={`/properties/${p.id}`} className="absolute inset-0 z-10" aria-label={`${p.title}, ${priceLabel(p, cur)}`} />
      <div className={`relative overflow-hidden ${big ? "h-72" : "h-56"}`}>
        <div className="h-full w-full transition duration-700 group-hover:scale-[1.06]"><Thumb art={p.art} id={p.id} /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-ink-950/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.2em] text-white backdrop-blur">{p.purpose === "rent" ? "For rent" : p.status === "Off-plan" ? "Off-plan" : "For sale"}</span>
          {p.tag && <span className="rounded-full bg-accent-400/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.2em] text-ink-950">{p.tag}</span>}
        </div>
        <button onClick={() => setFav(!fav)} aria-pressed={fav} aria-label="Save listing" className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-ink-950/60 text-white backdrop-blur transition hover:bg-ink-950"><Heart size={15} className={fav ? "fill-accent-300 text-accent-300" : ""} /></button>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-accent-300/90">{p.area}</p>
        <h3 className="mt-1.5 font-display text-2xl leading-tight text-white">{p.title}</h3>
        <div className="mt-4 flex items-center gap-4 text-[12.5px] text-white/55">
          <span className="flex items-center gap-1.5"><BedDouble size={14} />{p.beds} bd</span><span className="flex items-center gap-1.5"><Bath size={14} />{p.baths} ba</span><span className="flex items-center gap-1.5"><Maximize2 size={13} />{p.sqft.toLocaleString()} sqft</span>
        </div>
        <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
          <p className="text-lg font-semibold tracking-tight text-white">{priceLabel(p, cur)}</p>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition group-hover:border-accent-300 group-hover:bg-accent-400 group-hover:text-ink-950"><ArrowUpRight size={16} /></span>
        </div>
      </div>
    </article>
  );
}
