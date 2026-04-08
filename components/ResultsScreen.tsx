"use client";

import { motion } from "framer-motion";
import { PROFILES, type Profile, vibrate } from "@/lib/quizData";
import MendedLogo from "@/components/MendedLogo";

interface Props {
  profile: Profile;
  answers?: Record<number, string[]>;
  onSeeProgram: () => void;
}

const RECOVERY_MILESTONES = [
  { label: "Week 1",  desc: "Sleep deepens and morning anxiety starts to lift" },
  { label: "Week 4",  desc: "Cravings noticeably weaker, energy steadily returning" },
  { label: "Week 8",  desc: "Mental clarity sharpens and emotional regulation improves" },
  { label: "Week 12", desc: "Sobriety begins to feel like your natural state" },
];

const WEEK_PLAN = [
  { week: "Weeks 1–2",  desc: "CBT foundations — mapping your triggers and the thoughts that drive them" },
  { week: "Weeks 3–5",  desc: "Mindfulness and urge surfing — learning to ride cravings without acting on them" },
  { week: "Weeks 6–8",  desc: "Building new evening, social, and stress-relief rituals that don't involve alcohol" },
  { week: "Weeks 9–10", desc: "Stoic practice — the pause between trigger and response" },
  { week: "Weeks 11–12", desc: "Reinforcement and integration — making your new identity feel permanent" },
];

const PROFILE_REMOVALS: Record<Profile, { trigger: string; belief: string; habit: string }> = {
  "stress-escapist": {
    trigger: "Stress & anxiety drinking",
    belief: '"I need alcohol to cope with pressure"',
    habit: "Reaching for a drink the moment tension rises",
  },
  "habitual-drinker": {
    trigger: "Automatic evening routine drinking",
    belief: '"I can\'t unwind without it"',
    habit: "The unconscious ritual that runs on autopilot",
  },
  "social-chameleon": {
    trigger: "Social pressure & people-pleasing",
    belief: '"I\'m not myself without a drink in hand"',
    habit: "Using alcohol as a social confidence crutch",
  },
};

const TESTIMONIALS = [
  {
    text: "\"I'd been white-knuckling it for years. The CBT trigger work showed me I'd been fighting the wrong thing the whole time. Twelve weeks in and 5pm doesn't own me anymore.\"",
    name: "Rachel K., 36",
    tag: "12 weeks sober",
  },
  {
    text: "\"Urge surfing sounded fluffy until I actually tried it. Sitting with a craving for ninety seconds and watching it pass — that changed everything for me.\"",
    name: "Daniel P., 42",
    tag: "3 months sober",
  },
  {
    text: "\"The Stoic 'pause' practice gave me a space between feeling the urge and acting on it that I genuinely didn't know I had. Ten weeks in and I feel like myself again.\"",
    name: "Aisha N., 31",
    tag: "10 weeks sober",
  },
];

function RecoveryChart() {
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
  // curve goes UP: y_start = bottom, y_end = top
  const yStart = padT + chartH - 6;
  const yEnd   = padT + 6;
  const yWillpower = padT + chartH * 0.5; // willpower plateaus halfway
  const yBottom = padT + chartH;

  // Mended: S-curve rising steeply from bottom-left to top-right
  const mendedPath = `M ${x0} ${yStart} C ${x0 + chartW * 0.3} ${yStart}, ${x0 + chartW * 0.7} ${yEnd}, ${x1} ${yEnd}`;
  const mendedFill = `${mendedPath} L ${x1} ${yBottom} L ${x0} ${yBottom} Z`;

  // Willpower: rises a little then plateaus much lower
  const compPath = `M ${x0} ${yStart} C ${x0 + chartW * 0.35} ${yStart - 10}, ${x0 + chartW * 0.65} ${yWillpower + 10}, ${x1} ${yWillpower}`;

  // 3-month / 12-week timeline labels
  const xLabels = ["Start", "Week 4", "Week 8", "Week 12"];

  // Pill geometry — both pills share the same dark + gradient-stroke style
  const startPillW = 54;
  const endPillW   = 84;
  const pillH      = 19;

  // Clamp pill x so it never overflows the viewBox
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
        {/* Soft aura halo for the alcohol-free pill */}
        <radialGradient id="rEndPillAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c4afff" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#8A5EFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8A5EFF" stopOpacity="0" />
        </radialGradient>
        <filter id="rEndPillGlow" x="-60%" y="-200%" width="220%" height="500%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={padL} y1={padT + chartH * t} x2={padL + chartW} y2={padT + chartH * t}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
      ))}

      {/* Baseline */}
      <line x1={padL} y1={yBottom} x2={padL + chartW} y2={yBottom}
        stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

      {/* Fill under Mended curve */}
      <path d={mendedFill} fill="url(#rFillGrad)" />

      {/* Willpower dashed line */}
      <path d={compPath} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="6 4" />

      {/* Mended line */}
      <path d={mendedPath} fill="none" stroke="url(#rLineGrad)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Start dot — bottom left */}
      <circle cx={x0} cy={yStart} r="4" fill="#8A5EFF" />
      <rect x={startPillX} y={yStart - 31} width={startPillW} height={pillH} rx={pillH / 2}
        fill="#1e1245" stroke="url(#rStartPillStroke)" strokeWidth="1.3" />
      <text x={startTextX} y={yStart - 18}
        textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="600"
        fontFamily="var(--font-playfair), Georgia, serif"
        fontStyle="italic" letterSpacing="0.4">Today</text>

      {/* End dot — top right */}
      <circle cx={x1} cy={yEnd} r="4.5" fill="#8A5EFF" />
      {/* Soft aura behind the alcohol-free pill */}
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

      {/* X-axis tick marks + labels */}
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

function CtaButton({ onClick, delay = 0 }: { onClick: () => void; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <button
        onClick={onClick}
        className="btn-cta w-full py-4 text-base font-semibold"
        style={{ borderRadius: "14px" }}
      >
        Get started →
      </button>
      <p className="text-center text-xs mt-2" style={{ color: "rgba(255,255,255,0.28)" }}>
        Built on the clinical research that actually works
      </p>
    </motion.div>
  );
}

export default function ResultsScreen({ profile, answers, onSeeProgram }: Props) {
  const data = PROFILES[profile];
  const removals = PROFILE_REMOVALS[profile];

  const handleSeeProgram = () => {
    vibrate([50, 20, 80]);
    onSeeProgram();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pb-10"
      style={{ background: "#07001c" }}
    >
      {/* Header */}
      <div className="flex justify-center pt-4 pb-4">
        <MendedLogo size="lg" />
      </div>

      <div className="px-5 space-y-5">

        {/* ── Forecast chart card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(145deg, #12093a 0%, #0a051e 100%)",
            border: "1px solid rgba(138,94,255,0.2)",
          }}
        >
          <p className="text-center text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
            Your projected 12-week recovery
          </p>
          <p className="text-center text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
            Based on outcomes from members with patterns like yours
          </p>

          <RecoveryChart />

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <div style={{
                width: 28, height: 3, borderRadius: 2, flexShrink: 0,
                background: "linear-gradient(90deg, #8A5EFF 0%, #34CBBF 100%)",
              }} />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                Projected progress with Mended
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="28" height="8" viewBox="0 0 28 8" style={{ flexShrink: 0 }}>
                <line x1="0" y1="4" x2="28" y2="4" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="5 3" />
              </svg>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
                Doing it alone (willpower only)
              </span>
            </div>
          </div>

          {/* Recovery milestones */}
          <div className="mt-4 pt-4 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {RECOVERY_MILESTONES.map((m, i) => {
              const t = i / (RECOVERY_MILESTONES.length - 1);
              const r = Math.round(138 + (52 - 138) * t);
              const g = Math.round(94 + (203 - 94) * t);
              const b = Math.round(255 + (191 - 255) * t);
              const color = `rgb(${r},${g},${b})`;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-16 flex-shrink-0">
                    <span className="text-xs font-bold" style={{ color }}>{m.label}</span>
                  </div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{m.desc}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── CTA #1 — right under chart ── */}
        <CtaButton onClick={handleSeeProgram} delay={0.3} />

        {/* ── Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1
            className="text-3xl font-bold leading-tight mb-2"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Based on your answers, you can rebuild your relationship with alcohol in{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #34CBBF 0%, #8A5EFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              12 weeks
            </span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Projection based on MBRP clinical outcomes (Bowen et al., <em>JAMA Psychiatry</em>, 2014) for patterns similar to yours.
          </p>
        </motion.div>

        {/* ── Plan card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-base font-bold mb-4 text-center">Your 12-week recovery plan</p>

          <div className="flex gap-3 mb-5">
            {[
              { label: "Goal", value: "Alcohol-free", color: "#34CBBF", bg: "rgba(52,203,191,0.12)" },
              { label: "Length", value: "12 weeks", color: "#8A5EFF", bg: "rgba(138,94,255,0.12)" },
            ].map((s, i) => (
              <div key={i} className="flex-1 flex items-center gap-3 rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                  {i === 0
                    ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H6L8 1Z" fill="#34CBBF" /></svg>
                    : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#8A5EFF" strokeWidth="1.5" /><path d="M8 4V8L10.5 9.5" stroke="#8A5EFF" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  }
                </div>
                <div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
                  <p className="text-sm font-semibold" style={{ color: s.color }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            {WEEK_PLAN.map((item, i) => {
              const isLast = i === WEEK_PLAN.length - 1;
              const t = i / (WEEK_PLAN.length - 1);
              const r = Math.round(138 + (52 - 138) * t);
              const g = Math.round(94 + (203 - 94) * t);
              const b = Math.round(255 + (191 - 255) * t);
              const color = `rgb(${r},${g},${b})`;
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center" style={{ width: 36 }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: color + "22", border: `1.5px solid ${color}` }}>
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {!isLast && <div className="w-px flex-1 mt-0.5 mb-0.5" style={{ background: "rgba(255,255,255,0.09)", minHeight: 20 }} />}
                  </div>
                  <div style={{ paddingTop: 4, paddingBottom: isLast ? 0 : 16 }}>
                    <p className="text-sm font-bold">{item.week}</p>
                    <p className="text-xs leading-snug mt-0.5" style={{ color: "rgba(255,255,255,0.48)" }}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── What Mended removes ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-3"
        >
          {[
            { label: "Eliminated trigger", value: removals.trigger, icon: "⚡" },
            { label: "Stopped pattern", value: removals.habit, icon: "🔄" },
            { label: "Removed limiting belief", value: removals.belief, icon: "💭" },
          ].map((card, i) => (
            <div key={i} className="rounded-2xl px-4 py-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs mb-1 flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                <span>{card.icon}</span>{card.label}
              </p>
              <p className="text-base font-bold leading-snug">{card.value}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Profile card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, #1a1535 0%, #0f0a2e 100%)",
            border: "1px solid rgba(138,94,255,0.25)",
          }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: "rgba(196,175,255,0.55)" }}>YOUR DRINKER PROFILE</p>
          <p className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>{data.name}</p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.58)" }}>{data.description}</p>
        </motion.div>

        {/* ── CTA #2 — mid-page ── */}
        <CtaButton onClick={handleSeeProgram} delay={0.75} />

        {/* ── Testimonials ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
            What people are saying
          </p>
          <div className="space-y-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-4 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(138,94,255,0.08) 0%, rgba(52,203,191,0.05) 100%)",
                  border: "1px solid rgba(138,94,255,0.18)",
                }}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xs">★★★★★</span>
                    <span className="text-xs font-semibold" style={{ color: "#34CBBF" }}>{t.name}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: "rgba(52,203,191,0.1)", color: "#34CBBF", border: "1px solid rgba(52,203,191,0.2)" }}>
                    {t.tag}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{t.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA #3 — bottom ── */}
        <div className="pt-2 pb-6">
          <CtaButton onClick={handleSeeProgram} delay={0.85} />
        </div>

      </div>
    </motion.div>
  );
}
