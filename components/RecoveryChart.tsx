"use client";

export default function RecoveryChart() {
  const W = 340;
  const H = 178;
  const padL = 30;
  const padR = 30;
  const padT = 44;
  const padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const x0 = padL;
  const x1 = padL + chartW;
  const yStart = padT + chartH - 6;
  const yEnd   = padT + 6;
  const yWillpower = padT + chartH * 0.5;
  const yBottom = padT + chartH;

  const mendedPath = `M ${x0} ${yStart} C ${x0 + chartW * 0.3} ${yStart}, ${x0 + chartW * 0.7} ${yEnd}, ${x1} ${yEnd}`;
  const mendedFill = `${mendedPath} L ${x1} ${yBottom} L ${x0} ${yBottom} Z`;
  const compPath = `M ${x0} ${yStart} C ${x0 + chartW * 0.35} ${yStart - 10}, ${x0 + chartW * 0.65} ${yWillpower + 10}, ${x1} ${yWillpower}`;

  const xLabels = ["Start", "Week 4", "Week 8", "Week 12"];

  const startPillW = 54;
  const endPillW   = 84;
  const pillH      = 19;

  const startPillX = Math.max(2, x0 - startPillW / 2);
  const endPillX   = Math.min(W - endPillW - 2, x1 - endPillW / 2);
  const startTextX = startPillX + startPillW / 2;
  const endTextX   = endPillX + endPillW / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 8}`} className="overflow-visible">
      <defs>
        <linearGradient id="rLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A5EFF" />
          <stop offset="100%" stopColor="#34CBBF" />
        </linearGradient>
        <linearGradient id="rFillGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#8A5EFF" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#34CBBF" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="rStartPillStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A5EFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8A5EFF" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="rEndPillStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A5EFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8A5EFF" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="rEndPillAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c4afff" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#8A5EFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8A5EFF" stopOpacity="0" />
        </radialGradient>
        <filter id="rEndPillGlow" x="-60%" y="-200%" width="220%" height="500%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={padL} y1={padT + chartH * t} x2={padL + chartW} y2={padT + chartH * t}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
      ))}

      <line x1={padL} y1={yBottom} x2={padL + chartW} y2={yBottom}
        stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

      <path d={mendedFill} fill="url(#rFillGrad)" />
      <path d={compPath} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="6 4" />
      <path d={mendedPath} fill="none" stroke="url(#rLineGrad)" strokeWidth="2.5" strokeLinecap="round" />

      <circle cx={x0} cy={yStart} r="4" fill="#8A5EFF" />
      <rect x={startPillX} y={yStart - 31} width={startPillW} height={pillH} rx={pillH / 2}
        fill="#1e1245" stroke="url(#rStartPillStroke)" strokeWidth="1.3" />
      <text x={startTextX} y={yStart - 18}
        textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="600"
        fontFamily="var(--font-playfair), Georgia, serif"
        fontStyle="italic" letterSpacing="0.4">Today</text>

      <circle cx={x1} cy={yEnd} r="4.5" fill="#8A5EFF" />
      <ellipse
        cx={endPillX + endPillW / 2}
        cy={yEnd - 31 + pillH / 2}
        rx={endPillW / 2 + 14}
        ry={pillH / 2 + 10}
        fill="url(#rEndPillAura)"
        filter="url(#rEndPillGlow)"
      />
      <rect x={endPillX} y={yEnd - 31} width={endPillW} height={pillH} rx={pillH / 2}
        fill="#1e1245" stroke="url(#rEndPillStroke)" strokeWidth="1.3" />
      <text x={endTextX} y={yEnd - 18}
        textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="600"
        fontFamily="var(--font-playfair), Georgia, serif"
        fontStyle="italic" letterSpacing="0.4">Alcohol-free</text>

      {xLabels.map((label, i) => {
        const total = xLabels.length - 1;
        const x = padL + (chartW / total) * i;
        const anchor = i === 0 ? "start" : i === total ? "end" : "middle";
        const tickX = i === 0 ? x + 0.5 : i === total ? x - 0.5 : x;
        return (
          <g key={label}>
            <line x1={tickX} y1={yBottom + 2} x2={tickX} y2={yBottom + 6}
              stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
            <text x={x} y={yBottom + 18}
              textAnchor={anchor} fill="rgba(255,255,255,0.6)" fontSize="9"
              fontWeight="700" letterSpacing="1.2"
              style={{ textTransform: "uppercase" }}>
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
