"use client";

import { useState } from "react";
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
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | null>(null);

  const handleGenderSelect = (gender: "male" | "female") => {
    vibrate([30, 10, 60]);
    setSelectedGender(gender);
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col min-h-screen px-5 pt-8 pb-10"
      style={{ background: "#07001c" }}
    >
      {/* Logo */}
      <div className="flex justify-center mb-5">
        <MendedLogo size="lg" />
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
          How{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #8A5EFF 0%, #34CBBF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            94,000 people
          </span>
          {" "}quit alcohol for good.
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

      {/* Gender selection — CTA zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="mb-4"
      >
        <p
          className="text-xs font-semibold mb-1 tracking-wide uppercase text-center"
          style={{
            background: "linear-gradient(90deg, #34CBBF 0%, #8A5EFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Start by selecting your gender:
        </p>
        <p className="text-xs text-center mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          So we can tailor your CBT and mindfulness program
        </p>

        <div className="grid grid-cols-2 gap-3">
          {([
            { gender: "male" as const, label: "Male", symbol: "♂" },
            { gender: "female" as const, label: "Female", symbol: "♀" },
          ]).map(({ gender, label, symbol }) => {
            const isSelected = selectedGender === gender;
            return (
              <motion.button
                key={gender}
                onClick={() => handleGenderSelect(gender)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                animate={!isSelected ? {
                  boxShadow: [
                    "0 0 12px rgba(138,94,255,0.2), 0 0 0px rgba(52,203,191,0.0)",
                    "0 0 40px rgba(138,94,255,0.65), 0 0 20px rgba(52,203,191,0.25)",
                    "0 0 12px rgba(138,94,255,0.2), 0 0 0px rgba(52,203,191,0.0)",
                  ],
                } : {
                  boxShadow: "0 0 40px rgba(52,203,191,0.45), 0 0 20px rgba(138,94,255,0.35)",
                }}
                transition={!isSelected ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : {}}
                className="flex flex-col items-center py-7 rounded-2xl relative overflow-hidden"
                style={{
                  background: isSelected
                    ? "linear-gradient(160deg, #221260 0%, #0f3030 100%)"
                    : "linear-gradient(160deg, #1a0e48 0%, #0c2828 100%)",
                  border: isSelected
                    ? "2px solid rgba(52,203,191,0.95)"
                    : "2px solid rgba(138,94,255,0.7)",
                }}
              >
                {/* Top gleam */}
                <div
                  className="absolute top-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: 1,
                    background: "linear-gradient(90deg, transparent 5%, rgba(196,175,255,0.45) 50%, transparent 95%)",
                  }}
                />
                <span
                  className="text-4xl mb-2 leading-none"
                  style={{
                    background: "linear-gradient(135deg, #a87fff, #34CBBF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 10px rgba(138,94,255,0.7))",
                  }}
                >
                  {symbol}
                </span>
                <span className="text-base font-semibold" style={{ color: "rgba(255,255,255,0.95)" }}>
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Risk reversal */}
        <div className="flex items-center justify-center gap-2 mt-3">
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

      {/* Social proof strip */}
      <motion.div {...fadeUp(0.05)} className="flex items-center gap-3 mb-6 mt-4">
        <div className="flex -space-x-2">
          {["#8A5EFF", "#4675FF", "#34CBBF", "#c4afff"].map((color, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
              style={{ background: color, borderColor: "#07001c", color: "#fff" }}
            >
              {["S", "M", "J", "A"][i]}
            </div>
          ))}
        </div>
        <p className="text-sm" style={{ color: "#ffffff" }}>
          <span className="font-semibold" style={{ color: "#c4afff" }}>94,000+</span>{" "}
          people broke free from alcohol
        </p>
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
