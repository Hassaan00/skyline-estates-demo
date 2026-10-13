import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles, Target, Home as HomeIcon, CalendarCheck2, Mic, Languages, Star, Smartphone, BellRing, ShieldCheck } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Thumb from "@/components/Thumb";
import Listings from "@/components/Listings";
import Mortgage from "@/components/Mortgage";
import HeroLayla from "@/components/HeroLayla";
import HeroSkyline from "@/components/HeroSkyline";
import Phone from "@/components/Phone";
import OpenChat from "@/components/OpenChat";
import { properties } from "@/lib/data";

const areaTiles = [
  { name: "Palm Jumeirah", stat: "AED 4,950 / sqft", yield: "5.1% yield", art: { sky: ["#071a2b", "#1f5f7a", "#f6c27a"], kind: "palm" } },
  { name: "Downtown Dubai", stat: "AED 3,100 / sqft", yield: "6.2% yield", art: { sky: ["#10142e", "#4b3b78", "#e889a1"], kind: "tower" } },
  { name: "Dubai Marina", stat: "AED 2,400 / sqft", yield: "6.8% yield", art: { sky: ["#0b1026", "#3b2a5a", "#f2a65a"], kind: "waterfront" } },
  { name: "Dubai Hills Estate", stat: "AED 2,050 / sqft", yield: "5.6% yield", art: { sky: ["#13213c", "#3a6b5c", "#f4c06a"], kind: "villa" } },
] as const;

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        {/* HERO */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0"><HeroSkyline /></div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent via-25% to-ink-950/50" />
          <div className="noise absolute inset-0" />
          <div className="container-x relative grid min-h-[100svh] items-center gap-12 pb-16 pt-28 lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
            <div>
              <Reveal><p className="eyebrow">Dubai · Abu Dhabi · Since 2009</p></Reveal>
              <Reveal delay={0.08}><h1 className="mt-6 font-display text-[3.3rem] font-light leading-[0.95] tracking-tight text-white sm:text-7xl xl:text-[6.2rem]">Live above<br /><em className="gold-text font-normal">the ordinary.</em></h1></Reveal>
              <Reveal delay={0.16}><p className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">Penthouses, beachfront villas and investment homes, matched to you by <span className="text-white">Layla</span>, our AI property advisor. She qualifies, recommends and books private viewings in seconds, in your language, 24/7.</p></Reveal>
              <Reveal delay={0.24}><div className="mt-9 flex flex-wrap gap-3"><Link href="/properties" className="btn-gold">Explore residences <ArrowRight size={16} /></Link><OpenChat className="btn-line"><Sparkles size={15} />Ask Layla</OpenChat></div></Reveal>
              <Reveal delay={0.32}>
                <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-7">
                  {[["AED 4.2B", "sold since 2019"], ["38 sec", "avg. response, 24/7"], ["12", "languages spoken"]].map(([a, b]) => <div key={b}><dt className="sr-only">{b}</dt><dd className="font-display text-2xl text-white sm:text-4xl">{a}</dd><p className="mt-1 text-xs text-white/45">{b}</p></div>)}
                </dl>
              </Reveal>
            </div>
            <div className="flex justify-center lg:justify-end"><HeroLayla /></div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="overflow-hidden border-y border-white/10 bg-ink-950 py-5" aria-hidden>
          <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-2xl italic text-white/30">
            {[...Array(2)].flatMap((_, k) => ["Palm Jumeirah", "Downtown", "Dubai Marina", "Emirates Hills", "Bluewaters", "Dubai Hills", "Creek Harbour", "Saadiyat Island", "JBR", "Business Bay"].map((a) => <span key={a + k} className="flex items-center gap-12">{a}<span className="text-accent-400">✦</span></span>))}
          </div>
        </div>

        {/* LISTINGS */}
        <section className="py-28" id="listings">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <Reveal><p className="eyebrow">The portfolio</p><h2 className="h2 mt-5">Exceptional homes,<br /><em className="text-accent-200">curated.</em></h2></Reveal>
              <Reveal delay={0.1}><Link href="/properties" className="btn-line">View all {properties.length} residences <ArrowUpRight size={15} /></Link></Reveal>
            </div>
            <div className="mt-12"><Listings limit={6} /></div>
          </div>
        </section>

        {/* LAYLA */}
        <section className="relative overflow-hidden border-y border-white/10 bg-[radial-gradient(ellipse_at_top,rgba(212,168,83,.12),transparent_60%)] py-28" id="layla">
          <div className="container-x grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Reveal><p className="eyebrow">Meet Layla</p><h2 className="h2 mt-5">Your best agent<br />never sleeps.</h2></Reveal>
              <Reveal delay={0.1}><p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">80% of property enquiries arrive after hours. Layla answers every one in seconds, by chat or voice, then hands your team a qualified, scored lead with a viewing already in the diary.</p></Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[[Target, "Qualifies every lead", "Budget, area, timeline and financing, scored 0–100 automatically."], [HomeIcon, "Recommends real listings", "Searches live inventory and shows matching homes as cards."], [CalendarCheck2, "Books real viewings", "Checks the agent diary, never double-books, confirms instantly."], [Languages, "Speaks their language", "English, Arabic, Russian, French and more, by text or voice."]].map(([I, t, d]: any, i) => (
                  <Reveal key={t} delay={i * 0.06}><div className="h-full rounded-2xl border border-white/10 bg-white/[.03] p-5"><I size={20} className="text-accent-300" /><p className="mt-4 font-semibold text-white">{t}</p><p className="mt-1.5 text-sm leading-relaxed text-white/50">{d}</p></div></Reveal>))}
              </div>
            </div>
            <Reveal delay={0.1}>
              <div className="relative mx-auto flex aspect-square max-w-md flex-col items-center justify-center rounded-full">
                <div className="absolute inset-0 rounded-full border border-white/10" /><div className="absolute inset-10 rounded-full border border-white/10" /><div className="absolute inset-20 rounded-full border border-accent-300/20" />
                <div className="absolute inset-24 rounded-full bg-accent-400/20 blur-3xl" />
                <OpenChat voice className="relative grid h-40 w-40 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_25%,#f5ebd3,#d4a853_45%,#6d4826)] text-ink-950 shadow-[0_0_120px_-10px_rgba(212,168,83,.7)] transition hover:scale-105" label="Talk to Layla by voice"><Mic size={44} /></OpenChat>
                <p className="relative mt-8 font-display text-2xl text-white">“Marhaba, how can I help?”</p>
                <p className="relative mt-2 text-sm text-white/45">Tap to talk · Chrome, Edge or Safari</p>
                {[["عربي", "left-2 top-16"], ["English", "right-0 top-24"], ["Русский", "bottom-20 left-0"], ["Français", "bottom-12 right-6"]].map(([l, c]) => <span key={l} className={`absolute ${c} rounded-full border border-white/10 bg-ink-900/80 px-3 py-1 text-xs text-white/70 backdrop-blur`}>{l}</span>)}
              </div>
            </Reveal>
          </div>
        </section>

        {/* AREAS */}
        <section className="py-28">
          <div className="container-x">
            <Reveal><p className="eyebrow">Neighbourhoods</p><h2 className="h2 mt-5">Where Dubai lives.</h2></Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {areaTiles.map((a, i) => (
                <Reveal key={a.name} delay={i * 0.06}>
                  <Link href={`/properties?area=${encodeURIComponent(a.name)}`} className="group relative block h-96 overflow-hidden rounded-[22px] border border-white/10">
                    <div className="absolute inset-0 transition duration-700 group-hover:scale-110"><Thumb art={a.art as any} id={"area" + a.name} /></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
                    <div className="absolute inset-x-5 bottom-5"><p className="font-display text-3xl text-white">{a.name}</p><p className="mt-2 flex justify-between text-xs text-white/60"><span>{a.stat}</span><span className="text-accent-200">{a.yield}</span></p></div>
                  </Link>
                </Reveal>))}
            </div>
          </div>
        </section>

        {/* MORTGAGE */}
        <section className="border-t border-white/10 py-28" id="mortgage">
          <div className="container-x">
            <Reveal><p className="eyebrow">Finance</p><h2 className="h2 mt-5">What it really costs.</h2><p className="mt-5 max-w-xl text-white/55">UAE mortgage maths with DLD and agency fees included. Rates indicative; Layla can connect you to a broker for pre-approval.</p></Reveal>
            <Reveal delay={0.1}><div className="mt-12"><Mortgage /></div></Reveal>
          </div>
        </section>

        {/* APP */}
        <section className="overflow-hidden border-t border-white/10 bg-gradient-to-b from-ink-900 to-ink-950 py-28">
          <div className="container-x grid items-center gap-16 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow">The Skyline app</p><h2 className="h2 mt-5">The market,<br />in your pocket.</h2>
              <p className="mt-6 max-w-lg text-lg text-white/60">A branded iOS and Android app for your clients: saved searches, instant new-listing alerts, one-tap viewings and Layla built in.</p>
              <ul className="mt-8 space-y-3 text-white/75">{[[BellRing, "New-listing alerts within 60 seconds of going live"], [CalendarCheck2, "Viewing schedule synced to their calendar"], [ShieldCheck, "Secure document vault for offers & NOCs"]].map(([I, t]: any) => <li key={t} className="flex items-center gap-3"><I size={18} className="text-accent-300" />{t}</li>)}</ul>
              <Link href="/app" className="btn-gold mt-10"><Smartphone size={16} />See the app</Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative flex justify-center">
                <div className="absolute inset-0 m-auto h-80 w-80 rounded-full bg-accent-500/25 blur-[100px]" />
                <Phone className="rotate-[-4deg]">
                  <div className="px-5 pt-3"><p className="text-[11px] text-white/50">Good evening, Sara</p><p className="font-display text-2xl text-white">3 new matches</p></div>
                  <div className="mt-3 space-y-3 px-4">{properties.slice(0, 3).map((p) => <div key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.04]"><div className="h-24"><Thumb art={p.art} id={p.id} /></div><div className="flex justify-between p-2.5"><div className="min-w-0"><p className="truncate text-[12px] font-semibold text-white">{p.title}</p><p className="text-[10px] text-white/50">{p.area}</p></div><p className="text-[11px] font-semibold text-accent-200">AED {(p.price / 1e6).toFixed(1)}M</p></div></div>)}</div>
                </Phone>
              </div>
            </Reveal>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-28">
          <div className="container-x">
            <Reveal><p className="eyebrow">Clients</p><h2 className="h2 mt-5">Quietly exceptional.</h2></Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[["I messaged at 1am from London. By 1:02 Layla had shortlisted three villas and booked a Saturday viewing. We bought the second one.", "Oliver & Sophie R.", "Palm Jumeirah buyers"], ["She replied to my mother in Arabic and to me in Russian in the same chat. Remarkable service from start to keys.", "Dmitri K.", "Investor, Creek Harbour"], ["We get three times more qualified viewings since Layla went live, and my agents only talk to serious buyers.", "Noor Al Hashimi", "Director, Skyline Estates"]].map(([q, n, r], i) => (
                <Reveal key={n} delay={i * 0.06}><figure className="flex h-full flex-col justify-between rounded-[22px] border border-white/10 bg-white/[.03] p-7"><div className="flex gap-0.5 text-accent-300">{[...Array(5)].map((_, k) => <Star key={k} size={14} fill="currentColor" />)}</div><blockquote className="mt-5 font-display text-xl leading-snug text-white/90">“{q}”</blockquote><figcaption className="mt-6 text-sm"><span className="text-white">{n}</span><span className="text-white/45"> · {r}</span></figcaption></figure></Reveal>))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-28">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 p-10 text-center sm:p-20">
              <div className="absolute inset-0"><HeroSkyline /></div>
              <div className="absolute inset-0 bg-ink-950/70" />
              <div className="relative"><h2 className="font-display text-4xl font-light text-white sm:text-6xl">Your next address<br /><em className="gold-text">is one message away.</em></h2>
                <div className="mt-9 flex flex-wrap justify-center gap-3"><OpenChat className="btn-gold"><Sparkles size={15} />Start with Layla</OpenChat><Link href="/properties" className="btn-line">Browse residences</Link></div></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
