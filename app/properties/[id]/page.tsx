import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BedDouble, Bath, Maximize2, Eye, Check, Sparkles, MessageCircle, BadgeCheck, CalendarClock } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Thumb from "@/components/Thumb";
import ViewingForm from "@/components/ViewingForm";
import Mortgage from "@/components/Mortgage";
import PropertyCard from "@/components/PropertyCard";
import OpenChat from "@/components/OpenChat";
import Price from "@/components/Price";
import { properties, getProperty, agents, brand, fmtAED } from "@/lib/data";
export function generateStaticParams() { return properties.map((p) => ({ id: p.id })); }
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = getProperty(params.id); if (!p) return {};
  return { title: `${p.title}, ${p.area}`, description: `${p.beds}-bed ${p.type.toLowerCase()} ${p.purpose === "rent" ? "for rent" : "for sale"} in ${p.area}, ${fmtAED(p.price)}. ${p.blurb}` };
}
export default function Page({ params }: { params: { id: string } }) {
  const p = getProperty(params.id); if (!p) notFound();
  const a = agents.find((x) => x.id === p.agent)!;
  const similar = properties.filter((x) => x.id !== p.id && x.purpose === p.purpose).slice(0, 3);
  const ld = { "@context": "https://schema.org", "@type": "Residence", name: p.title, address: { "@type": "PostalAddress", addressLocality: p.area, addressCountry: "AE" }, numberOfRooms: p.beds, floorSize: { "@type": "QuantitativeValue", value: p.sqft, unitCode: "FTK" }, offers: { "@type": "Offer", price: p.price, priceCurrency: "AED" } };
  return (<><Nav /><main id="main" className="pb-24 pt-24">
    <div className="container-x"><Link href="/properties" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white"><ArrowLeft size={15} />All residences</Link></div>
    <div className="container-x mt-6 grid gap-3 lg:grid-cols-[2fr_1fr]">
      <div className="relative h-[52vh] min-h-[340px] overflow-hidden rounded-[28px] border border-white/10"><Thumb art={p.art} id={p.id} /><div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
        <div className="absolute bottom-6 left-6 flex gap-2"><span className="rounded-full bg-ink-950/70 px-3 py-1 text-[11px] uppercase tracking-[.2em] text-white backdrop-blur">{p.status}{p.handover ? ` · ${p.handover}` : ""}</span><span className="rounded-full bg-ink-950/70 px-3 py-1 text-[11px] uppercase tracking-[.2em] text-white backdrop-blur">Virtual tour</span></div></div>
      <div className="hidden grid-rows-2 gap-3 lg:grid">
        <div className="overflow-hidden rounded-[28px] border border-white/10"><Thumb art={{ sky: [p.art.sky[0], p.art.sky[2], "#fff1d6"], kind: p.art.kind === "tower" ? "waterfront" : "tower" }} id={p.id + "b"} /></div>
        <div className="overflow-hidden rounded-[28px] border border-white/10"><Thumb art={{ sky: ["#06070d", p.art.sky[1], p.art.sky[1]], kind: p.art.kind }} id={p.id + "c"} /></div>
      </div>
    </div>
    <div className="container-x mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <p className="eyebrow">{p.area} · {p.community}</p>
        <h1 className="mt-4 font-display text-5xl font-light leading-tight text-white sm:text-6xl">{p.title}</h1>
        <Price p={p} />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[[BedDouble, `${p.beds} Bedrooms`], [Bath, `${p.baths} Bathrooms`], [Maximize2, `${p.sqft.toLocaleString()} sqft`], [Eye, p.view]].map(([I, t]: any) => <div key={t} className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><I size={18} className="text-accent-300" /><p className="mt-3 text-sm text-white">{t}</p></div>)}
        </div>
        <p className="mt-10 font-display text-2xl leading-relaxed text-white/85">{p.blurb}</p>
        <h2 className="mt-12 text-xs font-semibold uppercase tracking-[.25em] text-accent-300">Highlights</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">{[...p.features, "Freehold for all nationalities", p.price >= 2e6 && p.purpose === "buy" ? "Golden Visa eligible" : "DEWA & Ejari assistance"].map((f) => <li key={f} className="flex items-center gap-3 text-white/75"><Check size={16} className="text-accent-300" />{f}</li>)}</ul>
      </div>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[28px] border border-white/10 bg-ink-900 p-6">
          <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-accent-200 to-accent-600 font-display text-xl text-ink-950">{a.name[0]}</div><div><p className="flex items-center gap-1.5 font-semibold text-white">{a.name}<BadgeCheck size={15} className="text-accent-300" /></p><p className="text-xs text-white/50">{a.role} · {a.langs}</p></div></div>
          <h2 className="mt-6 flex items-center gap-2 font-display text-2xl text-white"><CalendarClock size={20} className="text-accent-300" />Book a private viewing</h2>
          <p className="mb-5 mt-1 text-sm text-white/50">Live diary. Slots update in real time.</p>
          <ViewingForm propertyId={p.id} title={p.title} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <OpenChat msg={`I'm interested in ${p.title}. Can you tell me more and book a viewing?`} className="btn-line !px-3 !py-2.5 text-[13px]"><Sparkles size={14} />Ask Layla</OpenChat>
            <a href={`${brand.waLink}?text=${encodeURIComponent("Hi, I'm interested in " + p.title)}`} className="btn-line !px-3 !py-2.5 text-[13px]"><MessageCircle size={14} />WhatsApp</a>
          </div>
        </div>
      </aside>
    </div>
    {p.purpose === "buy" && <div className="container-x mt-20"><h2 className="font-display text-4xl text-white">Mortgage estimate</h2><div className="mt-6"><Mortgage price={p.price} /></div></div>}
    <div className="container-x mt-24"><h2 className="font-display text-4xl text-white">You may also like</h2><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((s) => <PropertyCard key={s.id} p={s} />)}</div></div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
  </main><Footer /></>);
}
