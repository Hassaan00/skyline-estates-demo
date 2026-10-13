import { Search, Heart, BellRing, CalendarDays, Home as HomeIcon, User, Sparkles, MapPin, SlidersHorizontal, Apple, Play, Check } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Phone from "@/components/Phone";
import Thumb from "@/components/Thumb";
import Reveal from "@/components/Reveal";
import { properties } from "@/lib/data";
export const metadata = { title: "The Skyline app", description: "Saved searches, instant new-listing alerts, viewing schedule and Layla, our AI advisor, in a branded iOS and Android app." };
const m = (n: number) => (n >= 1e6 ? `AED ${+(n / 1e6).toFixed(2)}M` : `AED ${Math.round(n / 1000)}K`);
function Tab({ a }: { a: number }) {
  return <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-white/10 bg-ink-950/95 px-4 pb-6 pt-3 backdrop-blur">{[HomeIcon, Search, Heart, CalendarDays, User].map((I, i) => <I key={i} size={19} className={i === a ? "text-accent-300" : "text-white/35"} />)}</div>;
}
export default function AppPage() {
  const p = properties;
  return (<><Nav /><main id="main" className="overflow-hidden pb-24 pt-32">
    <section className="container-x text-center">
      <Reveal><p className="eyebrow justify-center">iOS · Android · White-label</p><h1 className="h2 mx-auto mt-5 max-w-3xl">Your brokerage,<br /><em className="gold-text">on their home screen.</em></h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">A native app in your brand: live listings, saved searches, instant alerts, one-tap viewings and Layla built in. Clients who install it enquire 3.4× more often.</p>
        <div className="mt-8 flex justify-center gap-3">{[[Apple, "App Store"], [Play, "Google Play"]].map(([I, l]: any) => <span key={l} className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[.04] px-5 py-2.5 text-left"><I size={22} /><span><span className="block text-[9px] uppercase tracking-widest text-white/50">Download on</span><span className="block text-sm font-semibold">{l}</span></span></span>)}</div></Reveal>
    </section>
    <section className="relative mt-20">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/15 blur-[120px]" />
      <div className="container-x relative grid justify-items-center gap-14 md:grid-cols-2 xl:grid-cols-4">
        {/* Listings */}
        <Reveal><figure><Phone>
          <div className="px-5 pt-2"><p className="text-[11px] text-white/45">Good evening, Sara</p><p className="font-display text-[26px] leading-tight text-white">Discover</p>
            <div className="mt-3 flex items-center gap-2 rounded-full bg-white/[.07] px-3 py-2 text-[11px] text-white/40"><Search size={13} />Palm, Marina, Downtown…<SlidersHorizontal size={13} className="ml-auto" /></div>
            <div className="mt-3 flex gap-1.5 text-[10px]">{["Buy", "Rent", "Off-plan", "Villas"].map((c, i) => <span key={c} className={`rounded-full px-2.5 py-1 ${i === 0 ? "bg-accent-400 text-ink-950" : "bg-white/[.07] text-white/60"}`}>{c}</span>)}</div></div>
          <div className="mt-3 space-y-3 px-4">{[p[1], p[0]].map((x) => <div key={x.id} className="overflow-hidden rounded-2xl border border-white/10"><div className="relative h-32"><Thumb art={x.art} id={x.id} /><Heart size={15} className="absolute right-3 top-3 fill-accent-300 text-accent-300" /></div><div className="bg-white/[.04] p-2.5"><p className="text-[12px] font-semibold text-white">{x.title}</p><p className="flex justify-between text-[10px] text-white/50"><span>{x.area} · {x.beds} bd</span><span className="font-semibold text-accent-200">{m(x.price)}</span></p></div></div>)}</div>
          <Tab a={0} /></Phone><figcaption className="mt-6 text-center"><p className="font-semibold">Live listings</p><p className="text-sm text-white/50">Synced from your CRM in real time</p></figcaption></figure></Reveal>
        {/* Saved searches */}
        <Reveal delay={0.08}><figure><Phone>
          <div className="px-5 pt-2"><p className="font-display text-[26px] text-white">Saved searches</p><p className="text-[11px] text-white/45">We'll alert you the moment a match lists</p></div>
          <div className="mt-4 space-y-2.5 px-4">{[["Palm villa, 5+ bd", "Buy · up to AED 45M", 3, true], ["Downtown 2BR, Burj view", "Buy · AED 3–4.5M", 1, true], ["Marina rental, sea view", "Rent · ≤ AED 450K/yr", 6, false], ["Golden Visa investments", "Buy · AED 2M+", 9, true]].map(([t, s, n, on]: any) => <div key={t} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-400/15 text-accent-300"><MapPin size={15} /></div><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-white">{t}</p><p className="text-[10px] text-white/45">{s} · <span className="text-accent-200">{n} new</span></p></div><span className={`h-5 w-9 rounded-full p-0.5 ${on ? "bg-accent-400" : "bg-white/15"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${on ? "translate-x-4" : ""}`} /></span></div>)}
            <div className="rounded-2xl border border-dashed border-white/15 p-3 text-center text-[11px] text-white/50">+ Create a search with Layla</div></div>
          <Tab a={2} /></Phone><figcaption className="mt-6 text-center"><p className="font-semibold">Saved searches</p><p className="text-sm text-white/50">Clients build them by just talking to Layla</p></figcaption></figure></Reveal>
        {/* Alerts lock screen */}
        <Reveal delay={0.16}><figure><Phone>
          <div className="absolute inset-0"><Thumb art={{ sky: ["#05060f", "#2a2150", "#e0a35e"], kind: "waterfront" }} id="lock" /></div><div className="absolute inset-0 bg-ink-950/40" />
          <div className="relative pt-6 text-center text-white"><p className="text-sm">Thursday, 14 October</p><p className="font-display text-7xl font-light">21:08</p></div>
          <div className="relative mt-6 space-y-2 px-3">{[["New listing · 3 min ago", "Emirates Hills mansion just listed, matches “Palm villa, 5+ bd”", BellRing], ["Price drop · 1 h ago", "Burj Vista 2BR now AED 3.85M (−4%)", Sparkles], ["Viewing tomorrow", "Signature Villa, Frond K · 11:30 AM with Noor", CalendarDays]].map(([t, b, I]: any) => <div key={t} className="flex gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur-xl"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-950 text-accent-300"><I size={14} /></div><div><p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Skyline · {t}</p><p className="text-[12px] leading-snug text-white">{b}</p></div></div>)}</div>
        </Phone><figcaption className="mt-6 text-center"><p className="font-semibold">New-listing alerts</p><p className="text-sm text-white/50">Push within 60 seconds of going live</p></figcaption></figure></Reveal>
        {/* Viewing schedule */}
        <Reveal delay={0.24}><figure><Phone>
          <div className="px-5 pt-2"><p className="font-display text-[26px] text-white">My viewings</p><div className="mt-3 flex justify-between text-center text-[10px]">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className={`w-8 rounded-xl py-1.5 ${i === 3 ? "bg-accent-400 text-ink-950" : "text-white/50"}`}>{d}<span className="block text-[13px] font-semibold">{11 + i}</span></span>)}</div></div>
          <div className="mt-4 space-y-3 px-4">{[[p[1], "11:30 AM", "Noor Al Hashimi", true], [p[2], "4:00 PM", "Noor Al Hashimi", true], [p[8], "Sat 10:00 AM", "James Whitford", false]].map(([x, t, a, c]: any) => <div key={x.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-2.5"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl"><Thumb art={x.art} id={x.id} /></div><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold text-accent-200">{t}</p><p className="truncate text-[12px] font-semibold text-white">{x.title}</p><p className="flex items-center gap-1 text-[10px] text-white/45">{c ? <Check size={10} className="text-emerald-400" /> : null}{c ? "Confirmed" : "Pending"} · {a}</p></div></div>)}
            <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-400/20 to-transparent p-3 text-[11px] text-accent-100"><Sparkles size={14} />Layla: “Want me to add a Dubai Hills villa to Saturday?”</div></div>
          <Tab a={3} /></Phone><figcaption className="mt-6 text-center"><p className="font-semibold">Viewing schedule</p><p className="text-sm text-white/50">Reminders, directions & agent chat</p></figcaption></figure></Reveal>
      </div>
    </section>
    <section className="container-x mt-28 grid gap-5 md:grid-cols-3">{[["Your brand, not ours", "Custom icon, colours and domain. Published under your developer account."], ["Built on your data", "Connects to your CRM, Property Finder & Bayut feeds, and the Layla lead desk."], ["Launch in 6 weeks", "Design, build, store approval and analytics, done for you."]].map(([t, d]) => <div key={t} className="rounded-[22px] border border-white/10 bg-white/[.03] p-7"><p className="font-display text-2xl text-white">{t}</p><p className="mt-2 text-sm leading-relaxed text-white/55">{d}</p></div>)}</section>
  </main><Footer /></>);
}
