"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import RecoveryChart from "@/components/RecoveryChart";
import MendedLogo from "@/components/MendedLogo";
import {
  PROFILES,
  extractAnswerInsights,
  vibrate,
  type Profile,
} from "@/lib/quizData";

interface Props {
  profile: Profile;
  answers: Record<number, string[]>;
  onEmailSubmit: (email: string) => void;
}

const RECOVERY_MILESTONES = [
  { label: "Week 1", desc: "Sleep deepens and morning anxiety starts to lift" },
  { label: "Week 4", desc: "Cravings noticeably weaker, energy steadily returning" },
  { label: "Week 8", desc: "Mental clarity sharpens and emotional regulation improves" },
  { label: "Week 12", desc: "Sobriety begins to feel like your natural state" },
];

export default function ResultsPreviewScreen({ profile, answers, onEmailSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState("");

  const data = PROFILES[profile];
  const insights = extractAnswerInsights(answers);

  const isValidEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      vibrate([80, 20, 80]);
      return;
    }
    setError("");
    setLoading(true);
    vibrate([40, 15, 40, 15, 80]);

    try {
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), website }),
      }).catch(() => {});
    } catch (_) {}

    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
    onEmailSubmit(email.trim());
  };

  const personalizationCards = [
    insights.triggerLabel && {
      label: "Your primary trigger",
      value: insights.triggerLabel,
      icon: "⚡",
      color: "#8A5EFF",
    },
    insights.alcoholCost && {
      label: "What alcohol costs you",
      value: insights.alcoholCost,
      icon: "💔",
      color: "#ff6b8a",
    },
    insights.motivation && {
      label: "What matters most",
      value: insights.motivation,
      icon: "🎯",
      color: "#34CBBF",
    },
  ].filter(Boolean) as { label: string; value: string; icon: string; color: string }[];

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
        {/* Profile headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "rgba(196,175,255,0.55)" }}
          >
            YOUR RESULTS ARE READY
          </p>
          <h1
            className="text-2xl font-bold leading-tight mb-2"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {data.name}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {data.headline}
          </p>
        </motion.div>

        {/* Recovery chart — visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
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

          {/* First 2 milestones visible, last 2 blurred */}
          <div className="mt-4 pt-4 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {RECOVERY_MILESTONES.slice(0, 2).map((m, i) => {
              const t = i / 3;
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
            {/* Blurred milestones with Get started overlay */}
            <div className="relative">
              <div style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none" }}>
                {RECOVERY_MILESTONES.slice(2).map((m, i) => {
                  const t = (i + 2) / 3;
                  const r = Math.round(138 + (52 - 138) * t);
                  const g = Math.round(94 + (203 - 94) * t);
                  const b = Math.round(255 + (191 - 255) * t);
                  const color = `rgb(${r},${g},${b})`;
                  return (
                    <div key={i} className="flex items-center gap-3 mb-2.5">
                      <div className="w-16 flex-shrink-0">
                        <span className="text-xs font-bold" style={{ color }}>{m.label}</span>
                      </div>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{m.desc}</span>
                    </div>
                  );
                })}
              </div>
              <div className="absolute inset-0 flex items-end justify-center pb-1">
                <button
                  onClick={() => document.getElementById("email-capture")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn-cta px-6 py-3 text-sm font-semibold"
                  style={{ borderRadius: "12px" }}
                >
                  Get started →
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personalization proof — visible */}
        {personalizationCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="space-y-2.5"
          >
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
              BASED ON YOUR ANSWERS
            </p>
            {personalizationCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl px-4 py-3 flex items-start gap-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${card.color}33`,
                }}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{card.icon}</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: card.color }}>
                    {card.label}
                  </p>
                  <p className="text-sm font-medium leading-snug" style={{ color: "rgba(255,255,255,0.88)" }}>
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Blurred teaser of full results ── */}
        <div className="relative">
          <div
            style={{
              filter: "blur(8px)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {/* Fake plan card outline */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-base font-bold mb-3 text-center">Your 12-week recovery plan</p>
              <div className="space-y-3">
                {["Weeks 1–2: CBT foundations", "Weeks 3–5: Mindfulness and urge surfing", "Weeks 6–8: Building new rituals"].map((t) => (
                  <div key={t} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full" style={{ background: "rgba(138,94,255,0.15)" }} />
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fake profile card */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, #1a1535 0%, #0f0a2e 100%)",
                border: "1px solid rgba(138,94,255,0.25)",
              }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: "rgba(196,175,255,0.55)" }}>YOUR DRINKER PROFILE</p>
              <p className="text-lg font-bold mb-2">{data.name}</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.58)" }}>
                {data.description.slice(0, 120)}...
              </p>
            </div>
          </div>

          {/* Gradient fade overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(7,0,28,0.2) 0%, rgba(7,0,28,0.9) 70%)",
            }}
          />
        </div>

        {/* ── Email capture form ── */}
        <motion.div
          id="email-capture"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Honeypot */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-4 rounded-2xl text-base outline-none"
              style={{
                background: "#1a1535",
                border: `1.5px solid ${error ? "#ff4d4d" : "#2d2850"}`,
                color: "#ffffff",
                fontSize: "16px",
              }}
            />
            {error && (
              <p className="text-sm mt-2" style={{ color: "#ff6b6b" }}>
                {error}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-cta w-full py-4 text-base font-semibold mb-3"
            style={{ borderRadius: "14px", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Unlocking..." : (
              <span className="flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
                Unlock my plan
              </span>
            )}
          </button>

          <p
            className="text-center text-xs mb-4 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            🔒 No spam. By continuing you agree to our{" "}
            <a href="/privacy" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "underline" }}>
              Privacy Policy
            </a>
            . Unsubscribe anytime.
          </p>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "✨", label: "Fully personalised" },
              { icon: "🔒", label: "Private & secure" },
              { icon: "🧠", label: "Clinically researched" },
            ].map((b) => (
              <div
                key={b.label}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span className="text-xl">{b.icon}</span>
                <span
                  className="text-xs text-center"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
