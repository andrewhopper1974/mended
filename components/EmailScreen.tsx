"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { vibrate } from "@/lib/quizData";

interface Props {
  onSubmit: (email: string) => void;
}

export default function EmailScreen({ onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [wantsReport, setWantsReport] = useState(true);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const isValidEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!agreedPrivacy) {
      setError("Please agree to the Privacy Policy to continue.");
      return;
    }
    setError("");
    setLoading(true);
    vibrate([40, 20, 40]);

    // Fire-and-forget MailerLite subscribe
    try {
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      }).catch(() => {});
    } catch (_) {}

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    onSubmit(email.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col min-h-screen px-5 pt-16 pb-10"
      style={{ background: "#07001c" }}
    >
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{
            background: "linear-gradient(135deg, #8A5EFF22 0%, #34CBBF22 100%)",
            border: "1px solid rgba(138,94,255,0.3)",
          }}
        >
          📋
        </div>
      </div>

      <h1
        className="text-2xl font-bold text-center mb-3 leading-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        Your Personalized
        <br />
        Quit-Alcohol Plan Is Ready
      </h1>

      <p
        className="text-center text-sm mb-8 leading-relaxed"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        Based on your specific answers — not a generic guide. We&apos;ll send
        it directly to you.
      </p>

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
            fontSize: "16px", // Prevent iOS zoom
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
        className="btn-cta w-full py-4 text-base font-semibold mb-4"
        style={{ borderRadius: "14px", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Unlocking..." : (
          <span className="flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
            Unlock My Program
          </span>
        )}
      </button>

      <p
        className="text-center text-xs mb-4"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        🔒 No spam. Unsubscribe anytime. Your data is private.
      </p>

      {/* Checkboxes */}
      <div className="space-y-3 mb-5">
        {/* Body data report opt-in */}
        <label className="flex items-start gap-3 cursor-pointer" onClick={() => setWantsReport(v => !v)}>
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            style={{
              background: wantsReport ? "linear-gradient(135deg, #8A5EFF, #34CBBF)" : "rgba(255,255,255,0.06)",
              border: wantsReport ? "none" : "1.5px solid rgba(255,255,255,0.2)",
            }}
          >
            {wantsReport && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            I'd like to receive my personalised body data & health report by email
          </span>
        </label>

        {/* Privacy policy */}
        <label className="flex items-start gap-3 cursor-pointer" onClick={() => { setAgreedPrivacy(v => !v); if (error) setError(""); }}>
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            style={{
              background: agreedPrivacy ? "linear-gradient(135deg, #8A5EFF, #34CBBF)" : "rgba(255,255,255,0.06)",
              border: agreedPrivacy ? "none" : `1.5px solid ${error && !agreedPrivacy ? "#ff4d4d" : "rgba(255,255,255,0.2)"}`,
            }}
          >
            {agreedPrivacy && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            I agree to the{" "}
            <a href="/privacy" onClick={e => e.stopPropagation()} style={{ color: "#34CBBF", textDecoration: "underline" }}>
              Privacy Policy
            </a>
          </span>
        </label>
      </div>

      {/* Trust badges */}
      <div className="mt-10 grid grid-cols-3 gap-3">
        {[
          { icon: "🔬", label: "Science-backed" },
          { icon: "🔒", label: "Private & secure" },
          { icon: "⭐", label: "94K+ users" },
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
  );
}
