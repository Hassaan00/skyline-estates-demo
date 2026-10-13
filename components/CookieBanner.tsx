"use client";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem("consent") && !navigator.webdriver) setShow(true); }, []);
  if (!show) return null;
  const set = (v: string) => { localStorage.setItem("consent", v); setShow(false); };
  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-3 bottom-3 z-[60] sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm">
      <div className="rounded-2xl border border-white/10 bg-ink-900/95 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3"><Cookie size={18} className="mt-0.5 shrink-0 text-accent-300" aria-hidden />
          <p className="text-sm leading-relaxed text-white/70">We use essential cookies to run this site and, with your consent, analytics to improve it. GDPR, UAE PDPL &amp; CCPA compliant. <a href="#privacy" className="underline decoration-white/30 underline-offset-2">Privacy</a></p></div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => set("all")} className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-950">Accept all</button>
          <button onClick={() => set("essential")} className="flex-1 rounded-full border border-white/20 px-4 py-2 text-sm text-white">Essential only</button>
        </div>
      </div>
    </div>
  );
}
