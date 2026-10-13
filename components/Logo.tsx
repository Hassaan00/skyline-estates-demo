import Link from "next/link";
export default function Logo() {
  return <Link href="/" className="flex items-center gap-2.5" aria-label="Skyline Estates home">
    <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden><path d="M8 52h48M16 52V32h7v20M28 52V14l5-6 5 6v38M43 52V26h7v26" stroke="#d4a853" strokeWidth="3.2" fill="none" strokeLinejoin="round" /></svg>
    <span className="leading-none"><span className="block font-display text-xl tracking-wide text-white">Skyline</span><span className="block text-[9px] font-semibold uppercase tracking-[.42em] text-accent-300">Estates</span></span>
  </Link>;
}
