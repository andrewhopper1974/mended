"use client";

import { motion } from "framer-motion";
import { vibrate, TOTAL_QUESTIONS } from "@/lib/quizData";
import MendedLogo from "@/components/MendedLogo";

interface Props {
  onStart: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const SARAH = {
  text: "I'd white-knuckled it for years. Learning to actually notice my triggers and surf the urges instead of fighting them changed everything. Six months in and 5pm doesn't own me anymore.",
  name: "Sarah M., 34",
  tag: "6 months sober",
};

const OTHER_TESTIMONIALS = [
  {
    text: "Drinking every night. The CBT exercises around challenging the automatic thoughts felt almost too simple — but within a couple of weeks the evening pull just lost its grip on me.",
    name: "James T., 41",
    tag: "4 months sober",
  },
  {
    text: "Started with anxiety and alcohol dependence. The mindfulness work and the Stoic 'pause' practice gave me a space I never knew I had. Three months in, completely transformed.",
    name: "Michelle L., 28",
    tag: "3 months free",
  },
];

function TestimonialCard({ text, name, tag }: { text: string; name: string; tag: string }) {
  return (
    <div
      className="p-4 rounded-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(138,94,255,0.1) 0%, rgba(52,203,191,0.06) 100%)",
        border: "1px solid rgba(52,203,191,0.25)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-xs">★★★★★</span>
          <span className="text-xs font-semibold" style={{ color: "#34CBBF" }}>{name}</span>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(52,203,191,0.12)",
            color: "#34CBBF",
            border: "1px solid rgba(52,203,191,0.25)",
          }}
        >
          {tag}
        </span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#ffffff" }}>
        &ldquo;{text}&rdquo;
      </p>
    </div>
  );
}

export default function IntroScreen({ onStart }: Props) {
  const handleStart = () => {
    vibrate([30, 10, 60]);
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, pointerEvents: "auto" as const }}
      exit={{ opacity: 0, y: -20, pointerEvents: "none" as const }}
      transition={{ duration: 0.35 }}
      className="flex flex-col min-h-screen px-5 pt-8 pb-10"
      style={{ background: "#07001c" }}
    >
      {/* Logo centered */}
      <div className="flex items-center justify-center mb-5">
        <MendedLogo size="lg" />
      </div>

      {/* Sign-in pinned to the true viewport right corner, with a short
          "Already have an account?" prefix so brand-new visitors don't
          mistake it for a social-login shortcut (Google/Apple/etc). */}
      <div
        className="fixed top-5 right-5 z-50 flex items-center gap-2"
        style={{
          background: "rgba(7,0,28,0.78)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(138,94,255,0.35)",
          borderRadius: "9999px",
          padding: "6px 10px 6px 14px",
        }}
      >
        <span
          className="text-[11px] font-medium hidden sm:inline"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Already have an account?
        </span>
        <a
          href="https://app.mended.health/login"
          className="text-xs font-semibold px-3 py-1 rounded-full transition hover:opacity-90"
          style={{
            color: "#ffffff",
            background: "linear-gradient(90deg, #8A5EFF 0%, #34CBBF 100%)",
            letterSpacing: "0.02em",
          }}
        >
          Sign in
        </a>
      </div>

      {/* Divider */}
      <div
        className="mb-7 mx-auto"
        style={{
          width: "60%", height: 1,
          background: "linear-gradient(90deg, transparent 0%, #8A5EFF 40%, #34CBBF 60%, transparent 100%)",
        }}
      />

      {/* Hook headline — above the fold */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5 }}
        className="mb-6 text-center"
      >
        <h1
          className="text-2xl font-bold leading-tight mb-2"
          style={{ color: "#ffffff", letterSpacing: "-0.01em" }}
        >
          The{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #8A5EFF 0%, #34CBBF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            clinical techniques
          </span>
          {" "}that actually work — in a daily program.
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.01em" }}>
          Skills-based. Self-paced. Private.
        </p>
      </motion.div>

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="w-full lg:max-w-[680px] lg:mx-auto rounded-2xl mb-7 overflow-hidden"
        style={{
          border: "3px solid rgba(52,203,191,0.5)",
          boxShadow: "0 10px 30px rgba(52,203,191,0.15)",
        }}
      >
        <img
          src="/images/hero.png"
          alt="Break free from alcohol"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </motion.div>

      {/* CTA — single start button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="mb-4"
      >
        <button
          onClick={handleStart}
          className="btn-cta w-full py-5 text-base font-semibold intro-pulse"
          style={{ borderRadius: "14px" }}
        >
          Take the free quiz →
        </button>

        {/* Risk reversal */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[`${TOTAL_QUESTIONS} questions`, "3 minutes", "Free"].map((item, i) => (
            <span key={item} className="flex items-center gap-2">
              {i > 0 && (
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>●</span>
              )}
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                {item}
              </span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── The research behind Mended ─────────────────────────────────── */}
      <motion.div {...fadeUp(0.05)} className="mb-8 mt-4">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(138,94,255,0.1) 0%, rgba(52,203,191,0.06) 100%)",
            border: "1px solid rgba(138,94,255,0.25)",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-wider mb-3"
            style={{
              background: "linear-gradient(90deg, #8A5EFF 0%, #34CBBF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.12em",
            }}
          >
            The research behind mended
          </p>
          <h3
            className="text-base font-bold mb-3 leading-snug"
            style={{ color: "#ffffff" }}
          >
            Built on Mindfulness-Based Relapse Prevention.
          </h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.78)" }}>
            MBRP was developed by Bowen, Chawla, and Marlatt at the University
            of Washington. In their 2014 randomized controlled trial
            (<em style={{ color: "rgba(255,255,255,0.9)" }}>JAMA Psychiatry</em>),
            participants in the MBRP program showed significantly fewer heavy
            drinking days at 6 and 12 month follow-ups compared to standard
            treatment.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
            Mended takes those same techniques — urge surfing, body-based
            awareness, the <em style={{ color: "rgba(255,255,255,0.9)" }}>&ldquo;pause&rdquo;</em>{" "}
            practice — and packages them into a 4- or 12-week self-paced daily
            program.
          </p>
        </div>
      </motion.div>

      {/* Featured testimonial — pulled above the fold */}
      <motion.div {...fadeUp(0.1)} className="mb-8">
        <TestimonialCard {...SARAH} />
      </motion.div>

      {/* Remaining testimonials */}
      <div className="space-y-4">
        {OTHER_TESTIMONIALS.map((t, i) => (
          <motion.div key={t.name} {...fadeUp(i * 0.1)}>
            <TestimonialCard {...t} />
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        {...fadeUp(0)}
        className="border-t mt-12 pt-10 flex flex-col items-start gap-8"
        style={{ borderColor: "rgba(255,255,255,0.15)" }}
      >
        <MendedLogo size="sm" />

        <div className="flex flex-col items-start gap-2 text-xs">
          {[
            { label: "Terms & Conditions", href: "/terms" },
            { label: "Privacy", href: "/privacy" },
            { label: "Contact", href: "/contact" },
            { label: "Manage Subscription", href: "/manage" },
            { label: "Reviews", href: "/reviews" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:opacity-80 transition-opacity font-medium"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2 pb-2">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            © 2026 Mended. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            Results may vary from person to person.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
