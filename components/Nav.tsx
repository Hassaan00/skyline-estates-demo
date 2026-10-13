"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import Logo from "./Logo";
import { CurrencyToggle } from "./useCurrency";
const links = [["Buy", "/properties?purpose=buy"], ["Rent", "/properties?purpose=rent"], ["Off-plan", "/properties?status=Off-plan"], ["Mortgage", "/#mortgage"], ["App", "/app"]];
export default function Nav() {
  const [s, setS] = useState(false); const [m, setM] = useState(false);
  useEffect(() => { const f = () => setS(window.scrollY > 20); f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${s ? "border-b border-white/10 bg-ink-950/80 backdrop-blur-xl" : ""}`}>
      <nav className="container-x flex h-20 items-center justify-between" aria-label="Main">
        <Logo />
        <div className="hidden items-center gap-8 lg:flex">{links.map(([l, h]) => <Link key={l} href={h} className="text-[13px] tracking-wide text-white/70 transition hover:text-white">{l}</Link>)}</div>
        <div className="flex items-center gap-3">
          <CurrencyToggle className="hidden sm:flex" />
          <button onClick={() => window.dispatchEvent(new Event("open-chat"))} className="hidden items-center gap-2 rounded-full border border-accent-300/40 bg-accent-400/10 px-4 py-2 text-[13px] font-medium text-accent-100 transition hover:bg-accent-400/20 md:flex"><Sparkles size={14} />Ask Layla</button>
          <button className="rounded-full p-2 text-white lg:hidden" aria-label="Menu" aria-expanded={m} onClick={() => setM(!m)}>{m ? <X /> : <Menu />}</button>
        </div>
      </nav>
      {m && <div className="border-t border-white/10 bg-ink-950/95 px-5 pb-6 pt-2 backdrop-blur-xl lg:hidden">{links.map(([l, h]) => <Link key={l} href={h} onClick={() => setM(false)} className="block border-b border-white/5 py-3 text-white/80">{l}</Link>)}<CurrencyToggle className="mt-4 w-fit" /></div>}
    </header>
  );
}
