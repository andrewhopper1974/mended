"use client";

import { motion } from "framer-motion";
import { PROFILES, type Profile, vibrate } from "@/lib/quizData";
import MendedLogo from "@/components/MendedLogo";

interface Props {
  profile: Profile;
  answers?: Record<number, string[]>;
  onSeeProgram: () => void;
}

function parseWeight(str: string | undefined): number | null {
  if (!str) return null;
  const match = str.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function getWeightUnit(str: string | undefined): string {
  if (!str) return "lbs";
  return str.toLowerCase().includes("kg") ? "kg" : "lbs";
}

const WEEK_PLAN = [
  { week: "Week 1", desc: "Deep subconscious reprogramming — rewiring your relationship with alcohol" },
  { week: "Week 2", desc: "Neutralising cravings at the root before they surface" },
  { week: "Week 3", desc: "Installing new evening, social, and stress-relief rituals" },
  { week: "Week 4", desc: "Dissolving the emotional dependency that willpower can't touch" },
  { week: "Week 5+", desc: "Reinforcing lasting freedom — making sobriety your natural state" },
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
    text: "\"I'd tried AA and sheer willpower. Nothing worked until this. By session 3 I stopped wanting a drink at 5pm. Now I'm 6 months sober and feeling alive again.\"",
    name: "Sarah M., 34",
    tag: "6 months sober",
  },
  {
    text: "\"I was drinking every night. Did the first session completely skeptical. Woke up the next morning and just didn't want it. Changed my life.\"",
    name: "James T., 41",
    tag: "Alcohol-free",
  },
  {
    text: "\"Three months in and I've lost 18 lbs too — turns out alcohol was behind so much. Completely transformed.\"",
    name: "Michelle L., 28",
    tag: "3 months free",
  },
];

function ForecastChart({
  startLabel,
  endLabel,
}: {
  startLabel: string;
  endLabel: string;
}) {
  const W = 340;
  const H = 160;
  const padL = 8;
  const padR = 8;
  const padT = 38;
  const padB = 16;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const x0 = padL;
  const y0 = padT + 6;
  const x1 = padL + chartW;
  const y1 = padT + chartH - 6;

  const mendedPath = `M ${x0} ${y0} C ${x0 + chartW * 0.35} ${y0}, ${x0 + chartW * 0.55} ${y1}, ${x1} ${y1}`;
  const mendedFill = `${mendedPath} L ${x1} ${H} L ${x0} ${H} Z`;
  const compY1 = padT + chartH * 0.12;
  const compPath = `M ${x0} ${y0} C ${x0 + chartW * 0.3} ${y0 - 6}, ${x0 + chartW * 0.6} ${compY1 - 10}, ${x1} ${compY1}`;

  const xLabels = ["Start", "Week 2", "Week 4", "Week 8"];

  // Measure start label width to position pill correctly
  const startPillW = Math.max(startLabel.length * 6 + 16, 52);
  const endPillW = Math.max(endLabel.length * 6 + 16, 52);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 24}`} className="overflow-visible">
      <defs>
        <linearGradient id="rLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A5EFF" />
          <stop offset="100%" stopColor="#34CBBF" />
        </linearGradient>
        <linearGradient id="rFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8A5EFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#34CBBF" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="rEndPill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A5EFF" />
          <stop offset="100%" stopColor="#34CBBF" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={padL} y1={padT + chartH * t} x2={padL + chartW} y2={padT + chartH * t}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
      ))}

      {/* Fill area */}
      <path d={mendedFill} fill="url(#rFillGrad)" />

      {/* Competitor dashed line */}
      <path d={compPath} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="6 4" />

      {/* Mended line */}
      <path d={mendedPath} fill="none" stroke="url(#rLineGrad)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Start dot */}
      <circle cx={x0} cy={y0} r="4.5" fill="#8A5EFF" />
      {/* Start pill — dark, above the dot */}
      <rect x={x0 - 4} y={y0 - 32} width={startPillW} height={20} rx="10" fill="#1e1245" stroke="rgba(138,94,255,0.4)" strokeWidth="1" />
      <text x={x0 - 4 + startPillW / 2} y={y0 - 18} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
        {startLabel}
      </text>

      {/* End dot */}
      <circle cx={x1} cy={y1} r="5" fill="#34CBBF" />
      {/* End pill — gradient, above the dot */}
      <rect x={x1 - endPillW + 4} y={y1 - 32} width={endPillW} height={20} rx="10" fill="url(#rEndPill)" />
      <text x={x1 - endPillW + 4 + endPillW / 2} y={y1 - 18} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
        {endLabel}
      </text>

      {/* X-axis labels */}
      {xLabels.map((label, i) => (
        <text key={label} x={padL + (chartW / (xLabels.length - 1)) * i} y={H + 18}
          textAnchor="middle" fill="rgba(255,255,255,0.38)" fontSize="10">
          {label}
        </text>
      ))}
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
        94,000+ people have already started their journey
      </p>
    </motion.div>
  );
}

export default function ResultsScreen({ profile, answers, onSeeProgram }: Props) {
  const data = PROFILES[profile];
  const removals = PROFILE_REMOVALS[profile];

  const currentWeight = parseWeight(answers?.[30]?.[0]);
  const targetWeight = parseWeight(answers?.[31]?.[0]);
  const unit = getWeightUnit(answers?.[30]?.[0]);
  const showWeightChart = currentWeight !== null && targetWeight !== null && currentWeight > targetWeight;
  const weightDiff = showWeightChart ? Math.round((currentWeight! - targetWeight!) * 10) / 10 : null;

  const startLabel = showWeightChart ? `${currentWeight} ${unit}` : "Today";
  const endLabel = showWeightChart ? `${targetWeight} ${unit}` : "Alcohol-free";

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
          <p className="text-center text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
            {showWeightChart ? "Your weight & sobriety forecast with Mended" : "Your sobriety forecast with Mended"}
          </p>

          <ForecastChart startLabel={startLabel} endLabel={endLabel} />

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <div style={{
                width: 28, height: 3, borderRadius: 2, flexShrink: 0,
                background: "linear-gradient(90deg, #8A5EFF 0%, #34CBBF 100%)",
              }} />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                Your progress using Mended
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
            Based on your answers, you can{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #34CBBF 0%, #8A5EFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {showWeightChart
                ? `lose ${weightDiff} ${unit} and be alcohol-free`
                : "be completely alcohol-free"}{" "}
              in 8 weeks
            </span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Based on what we've seen from 94,000+ users with drinking patterns and triggers like yours.
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
          <p className="text-base font-bold mb-4 text-center">Your recovery plan with hypnotherapy</p>

          <div className="flex gap-3 mb-5">
            {[
              { label: "Goal", value: "Alcohol-free", color: "#34CBBF", bg: "rgba(52,203,191,0.12)" },
              { label: "Success rate", value: "94%", color: "#34CBBF", bg: "rgba(138,94,255,0.12)" },
            ].map((s, i) => (
              <div key={i} className="flex-1 flex items-center gap-3 rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                  {i === 0
                    ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H6L8 1Z" fill="#34CBBF" /></svg>
                    : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#8A5EFF" strokeWidth="1.5" /><path d="M5 8.5L7 10.5L11 6" stroke="#8A5EFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
