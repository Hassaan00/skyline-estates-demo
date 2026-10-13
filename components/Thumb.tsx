// Pure-SVG generative "photography" for each listing: dusk sky, skyline, water, villas, palms.
type Art = { sky: [string, string, string]; kind: "tower" | "villa" | "waterfront" | "palm" };
function rng(seed: string) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6d2b79f5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function Palm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} fill="#07070a"><path d="M0 0 C2 -20 1 -40 4 -58 L6 -58 C4 -40 5 -20 3 0Z" />{[-60, -25, 10, 40, 75, 110, 150].map((a, i) => <path key={i} transform={`translate(5 -58) rotate(${a})`} d="M0 0 C10 -4 22 -2 30 6 C20 2 10 2 0 2Z" />)}</g>;
}
export default function Thumb({ art, id, className = "", detail = false }: { art: Art; id: string; className?: string; detail?: boolean }) {
  const r = rng(id); const [a, b, c] = art.sky; const W = 400, H = 260; const k = art.kind; const g = "g" + id.replace(/[^a-z0-9]/gi, "");
  const horizon = k === "villa" ? 200 : k === "tower" ? 225 : 175;
  const towers: { x: number; w: number; h: number; spire: boolean }[] = [];
  if (k !== "villa") { let x = -10; const maxH = k === "tower" ? 190 : 120; while (x < W) { const w = 14 + r() * 26; const center = 1 - Math.abs(x - W * (0.35 + r() * 0.3)) / W; towers.push({ x, w, h: 30 + r() * maxH * (0.5 + center), spire: r() > 0.82 }); x += w + r() * 6; } }
  const sunX = 80 + r() * 240, sunY = horizon - 40 - r() * 50;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`} role="img" aria-label="Illustration of the property and its view">
      <defs>
        <linearGradient id={g + "s"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient>
        <radialGradient id={g + "sun"}><stop offset="0" stopColor="#fff6dc" /><stop offset=".25" stopColor={c} stopOpacity=".9" /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient>
        <linearGradient id={g + "w"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={b} stopOpacity=".9" /><stop offset="1" stopColor={a} /></linearGradient>
        <linearGradient id={g + "t"} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1b1b26" /><stop offset="1" stopColor="#0a0a10" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${g}s)`} />
      {Array.from({ length: 26 }).map((_, i) => <circle key={i} cx={r() * W} cy={r() * horizon * 0.5} r={r() * 0.9 + 0.2} fill="#fff" opacity={0.3 + r() * 0.5} />)}
      <circle cx={sunX} cy={sunY} r={70} fill={`url(#${g}sun)`} /><circle cx={sunX} cy={sunY} r={11} fill="#fff3d1" opacity=".9" />
      {towers.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={horizon - t.h} width={t.w} height={t.h} fill={`url(#${g}t)`} />
          {t.spire && <path d={`M${t.x + t.w / 2 - 2} ${horizon - t.h} L${t.x + t.w / 2} ${horizon - t.h - 30} L${t.x + t.w / 2 + 2} ${horizon - t.h}Z`} fill="#0d0d14" />}
          {Array.from({ length: Math.floor(t.h / 9) }).map((_, j) => r() > 0.72 && <rect key={j} x={t.x + 3 + r() * (t.w - 8)} y={horizon - t.h + 6 + j * 9} width={2.2} height={2.2} fill="#ffd89a" opacity={0.5 + r() * 0.5} />)}
        </g>))}
      {(k === "waterfront" || k === "palm") && <>
        <rect y={horizon} width={W} height={H - horizon} fill={`url(#${g}w)`} />
        {towers.map((t, i) => <rect key={i} x={t.x} y={horizon} width={t.w} height={t.h * 0.45} fill="#0a0a10" opacity=".35" />)}
        <rect x={sunX - 6} y={horizon + 4} width={12} height={H - horizon} fill="#ffe7b3" opacity=".25" />
        {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={r() * W} y={horizon + 6 + r() * (H - horizon)} width={20 + r() * 50} height={1} fill="#fff" opacity=".18" />)}
      </>}
      {(k === "villa" || k === "palm") && <g>
        {k === "palm" && <path d={`M0 ${H - 34} Q ${W / 2} ${H - 58} ${W} ${H - 34} L${W} ${H} L0 ${H}Z`} fill="#e6c48f" opacity=".85" />}
        <g transform={`translate(${k === "palm" ? 150 : 70} ${k === "palm" ? H - 96 : horizon - 70})`}>
          <rect x="0" y="30" width="230" height="44" fill="#f2ede4" /><rect x="50" y="0" width="150" height="34" fill="#e8e1d4" /><rect x="-12" y="26" width="254" height="6" fill="#fbfaf7" /><rect x="40" y="-4" width="170" height="5" fill="#fbfaf7" />
          <rect x="12" y="40" width="70" height="28" fill="#ffd28a" opacity=".85" /><rect x="96" y="40" width="54" height="28" fill="#ffcf80" opacity=".7" /><rect x="164" y="40" width="54" height="28" fill="#2b2b36" />
          <rect x="62" y="6" width="56" height="22" fill="#ffd897" opacity=".8" /><rect x="130" y="6" width="56" height="22" fill="#2d2d38" />
          {k === "villa" && <><rect x="-30" y="74" width="300" height="14" fill="#5fc3d6" opacity=".9" /><rect x="-30" y="74" width="300" height="2" fill="#bff1fa" /></>}
        </g>
        {k === "villa" && <rect y={horizon + 18} width={W} height={H - horizon} fill="#141a16" />}
        <Palm x={k === "palm" ? 70 : 30} y={k === "palm" ? H - 40 : horizon + 22} s={1.3} /><Palm x={k === "palm" ? 330 : 345} y={k === "palm" ? H - 42 : horizon + 22} s={1.1} /><Palm x={k === "palm" ? 115 : 315} y={k === "palm" ? H - 38 : horizon + 22} s={0.8} />
      </g>}
      {k === "tower" && <rect y={horizon} width={W} height={H - horizon} fill="#08080c" />}
      {detail && <rect width={W} height={H} fill="black" opacity=".05" />}
    </svg>
  );
}
