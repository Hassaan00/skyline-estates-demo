export default function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto w-[280px] rounded-[48px] border border-white/15 bg-gradient-to-b from-[#2a2a31] to-[#111115] p-[10px] shadow-[0_50px_120px_-30px_rgba(0,0,0,.9),inset_0_1px_0_rgba(255,255,255,.15)] ${className}`}>
      <div className="relative h-[580px] overflow-hidden rounded-[39px] bg-ink-950">
        <div className="absolute left-1/2 top-2.5 z-20 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
        <div className="flex items-center justify-between px-7 pb-1 pt-3.5 text-[11px] font-semibold text-white"><span>9:41</span><span className="flex items-center gap-1"><span className="h-2 w-3.5 rounded-[2px] border border-white/80" /></span></div>
        {children}
      </div>
    </div>
  );
}
