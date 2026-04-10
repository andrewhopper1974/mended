"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import MendedLogo from "@/components/MendedLogo";
import {
  vibrate,
  getTriggerLabel,
  PROFILES,
  type Profile,
} from "@/lib/quizData";

interface Props {
  onSubmit: (email: string) => void;
  onBack?: () => void;
  answers: Record<number, string[]>;
  profile: Profile;
  progress: number;
}

export default function EmailScreen({
  onSubmit,
  onBack,
  answers,
  profile,
  progress,
}: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // SECURITY: honeypot — visually hidden, only bots fill it. The server
  // pretends success when populated so bots can't tell they were caught.
  const [website, setWebsite] = useState("");

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

    // Fire-and-forget MailerLite subscribe (honeypot value forwarded)
    try {
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), website }),
      }).catch(() => {});
    } catch (_) {}

    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
    onSubmit(email.trim());
  };

  // Build personalization chips — only show what we can trust
  const triggerLabel = getTriggerLabel(answers, profile);
  const profileName = PROFILES[profile].name;

  const chips: { label: string; value: string; color: string }[] = [];
  if (triggerLabel) {
    chips.push({ label: "Your trigger", value: triggerLabel, color: "#8A5EFF" });
  }
  chips.push({ label: "Your profile", value: profileName, color: "#34CBBF" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col min-h-screen"
      style={{ background: "#07001c" }}
    >
      {/* Sticky progress */}
      <div className="sticky top-0 z-50" style={{ background: "#07001c" }}>
        <div className="flex justify-center pt-3 pb-1">
          <MendedLogo size="sm" />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          ) : (
            <span />
          )}
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(138,94,255,0.15)",
              border: "1px solid rgba(138,94,255,0.25)",
              color: "rgba(196,175,255,0.9)",
            }}
          >
            Saving your progress
          </span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <div className="flex-1 px-5 pt-8 pb-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: "linear-gradient(135deg, #8A5EFF22 0%, #34CBBF22 100%)",
              border: "1px solid rgba(138,94,255,0.3)",
            }}
          >
            🔒
          </div>
        </div>

        <h1
          className="text-2xl font-bold text-center mb-2 leading-tight"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Lock in your results
        </h1>

        <p
          className="text-center text-sm mb-6 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          You&rsquo;re more than halfway through. Save your progress so you
          can come back to your personalized plan — even if you close this
          tab.
        </p>

        {/* Personalization chips — proof we're actually using their answers */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-6 space-y-2"
        >
          {chips.map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${chip.color}33`,
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                style={{ color: chip.color, letterSpacing: "0.08em" }}
              >
                {chip.label}
              </span>
              <span
                className="text-sm font-medium leading-snug truncate"
                style={{ color: "rgba(255,255,255,0.88)" }}
              >
                {chip.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Honeypot — visually hidden + aria-hidden + tabindex=-1 */}
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

        {/* Email input */}
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
          {loading ? "Saving..." : (
            <span className="flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
              Save my progress
            </span>
          )}
        </button>

        {/* Consent fine print — no checkbox required */}
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
        <div className="mt-8 grid grid-cols-3 gap-3">
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
      </div>
    </motion.div>
  );
}
