// Hand-tuned generative Dubai skyline at dusk, pure SVG.
function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
export default function HeroSkyline({ className = "" }: { className?: string }) {
  const W = 1600, H = 900, HZ = 640; const r = rng(42);
  const layer = (n: number, minH: number, maxH: number, wMin: number, wMax: number) => { const out: { x: number; w: number; h: number }[] = []; let x = -20; while (x < W) { const w = wMin + r() * (wMax - wMin); const c = 1 - Math.min(1, Math.abs(x - 1050) / 900); out.push({ x, w, h: minH + r() * (maxH - minH) * (0.45 + c * 0.8) }); x += w + r() * n; } return out; };
  const back = layer(4, 60, 260, 18, 46), front = layer(10, 40, 330, 22, 60);
  const burj = 1080;
  const stars = Array.from({ length: 90 }, () => [r() * W, r() * HZ * 0.6, r() * 1.1 + 0.2, 0.25 + r() * 0.6]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className={`h-full w-full ${className}`} aria-hidden>
      <defs>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05060f" /><stop offset=".45" stopColor="#171433" /><stop offset=".62" stopColor="#3b2752" /><stop offset=".7" stopColor="#8a4a5c" /><stop offset=".74" stopColor="#e0a35e" /></linearGradient>
        <radialGradient id="hs-sun" cx="0.66" cy="0.7" r="0.35"><stop offset="0" stopColor="#ffd9a0" stopOpacity=".55" /><stop offset=".4" stopColor="#e0a35e" stopOpacity=".18" /><stop offset="1" stopColor="#e0a35e" stopOpacity="0" /></radialGradient>
        <linearGradient id="hs-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2340" /><stop offset="1" stopColor="#3d2c4a" /></linearGradient>
        <linearGradient id="hs-f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0c0b14" /><stop offset=".6" stopColor="#121020" /><stop offset="1" stopColor="#0a0910" /></linearGradient>
        <linearGradient id="hs-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b1f33" /><stop offset=".3" stopColor="#0f0c18" /><stop offset="1" stopColor="#06060b" /></linearGradient>
        <linearGradient id="hs-burj" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1c1830" /><stop offset=".5" stopColor="#3a3150" /><stop offset="1" stopColor="#14121f" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#hs-sky)" />
      <rect width={W} height={H} fill="url(#hs-sun)" />
      {stars.map(([x, y, s, o], i) => <circle key={i} cx={x} cy={y} r={s} fill="#fff" opacity={o} />)}
      {back.map((t, i) => <rect key={i} x={t.x} y={HZ - t.h} width={t.w} height={t.h} fill="url(#hs-b)" opacity=".75" />)}
      {/* Burj */}
      <g>
        {[[0, 60, 240], [6, 48, 330], [12, 36, 420], [17, 26, 500], [21, 18, 560]].map(([dx, w, h], i) => <rect key={i} x={burj - w / 2 + (i % 2 ? dx / 3 : -dx / 3)} y={HZ - h} width={w} height={h} fill="url(#hs-burj)" />)}
        <path d={`M${burj - 4} ${HZ - 560} L${burj} ${HZ - 640} L${burj + 4} ${HZ - 560}Z`} fill="#3a3150" />
        <circle cx={burj} cy={HZ - 640} r="2.5" fill="#ff5a4a" />
        {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={burj - 14 + (i % 4) * 8} y={HZ - 540 + Math.floor(i / 4) * 52} width="2" height="2" fill="#ffd89a" opacity=".7" />)}
      </g>
      {front.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={HZ - t.h} width={t.w} height={t.h} fill="url(#hs-f)" />
          <rect x={t.x} y={HZ - t.h} width="1.5" height={t.h} fill="#e0a35e" opacity=".12" />
          {Array.from({ length: Math.floor(t.h / 14) * 2 }).map((_, j) => r() > 0.78 && <rect key={j} x={t.x + 4 + (j % 2) * (t.w / 2 - 2) + r() * (t.w / 2 - 8)} y={HZ - t.h + 8 + Math.floor(j / 2) * 14} width="3" height="2.4" fill="#ffd89a" opacity={0.35 + r() * 0.6} />)}
        </g>))}
      <rect y={HZ} width={W} height={H - HZ} fill="url(#hs-w)" />
      {front.map((t, i) => <rect key={i} x={t.x} y={HZ} width={t.w} height={t.h * 0.5} fill="#000" opacity=".25" />)}
      <rect x={burj - 30} y={HZ} width="60" height="260" fill="#e0a35e" opacity=".08" />
      {Array.from({ length: 50 }).map((_, i) => <rect key={i} x={r() * W} y={HZ + 6 + r() * (H - HZ)} width={20 + r() * 120} height="1.2" fill="#ffd9a0" opacity={0.05 + r() * 0.15} />)}
    </svg>
  );
}
