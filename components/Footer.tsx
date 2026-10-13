import Link from "next/link";
import Logo from "./Logo";
import { brand, areas } from "@/lib/data";
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950" id="privacy">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2"><Logo /><p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">Prime residential brokerage across Dubai and Abu Dhabi. Licensed by the Dubai Land Department, {brand.rera}. Your data is handled under GDPR and the UAE PDPL; we never sell it.</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-[.25em] text-accent-300">Areas</p><ul className="mt-4 space-y-2 text-sm text-white/60">{areas.slice(0, 6).map((a) => <li key={a}><Link href={`/properties?area=${encodeURIComponent(a)}`} className="hover:text-white">{a}</Link></li>)}</ul></div>
        <div><p className="text-xs font-semibold uppercase tracking-[.25em] text-accent-300">Contact</p><ul className="mt-4 space-y-2 text-sm text-white/60"><li>{brand.address}</li><li>{brand.phone}</li><li>{brand.email}</li><li><a href={brand.waLink} className="text-accent-200 hover:text-white">WhatsApp us</a></li></ul></div>
      </div>
      <div className="container-x flex flex-col justify-between gap-2 border-t border-white/10 py-6 text-xs text-white/35 sm:flex-row"><p>© {new Date().getFullYear()} Skyline Estates. Demo concept, listings are illustrative.</p><p><Link href="/app" className="hover:text-white">Mobile app</Link> · <Link href="/admin" className="hover:text-white">Agent dashboard</Link></p></div>
    </footer>
  );
}
