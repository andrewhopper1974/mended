"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { vibrate } from "@/lib/quizData";
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
      <div className="mb-10 mx-auto" style={{ width: "60%", height: 1, background: "linear-gradient(90deg, transparent 0%, #8A5EFF 40%, #34CBBF 60%, transparent 100%)" }} />

      {/* Hero image */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full rounded-2xl mb-10 overflow-hidden"
          style={{
            border: "3px solid rgba(52,203,191,0.5)",
            boxShadow: "0 10px 30px rgba(52,203,191,0.15)",
          }}
        >
          <img
            src="/images/hero.png"
            alt="Break free from alcohol"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </motion.div>

        {/* Gender Selection */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <p className="text-xs font-semibold mb-4 tracking-wide uppercase text-center" style={{
            background: "linear-gradient(90deg, #34CBBF 0%, #8A5EFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Start by selecting your gender:
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
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center py-6 rounded-2xl transition-all"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(138,94,255,0.28) 0%, rgba(52,203,191,0.18) 100%)"
                      : "linear-gradient(135deg, rgba(138,94,255,0.1) 0%, rgba(52,203,191,0.06) 100%)",
                    border: isSelected
                      ? "1.5px solid rgba(52,203,191,0.85)"
                      : "1.5px solid rgba(138,94,255,0.35)",
                    boxShadow: isSelected
                      ? "0 0 28px rgba(52,203,191,0.25), 0 4px 16px rgba(138,94,255,0.2)"
                      : "0 4px 14px rgba(138,94,255,0.12)",
                  }}
                >
                  <span
                    className="text-3xl mb-2 leading-none"
                    style={{
                      background: "linear-gradient(135deg, #8A5EFF, #34CBBF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {symbol}
                  </span>
                  <span className="text-base font-semibold" style={{ color: "#ffffff" }}>
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          {...fadeUp(0.05)}
          className="text-base leading-relaxed mb-10"
          style={{ color: "#ffffff" }}
        >
          Answer 3 minutes of questions and Mended will build your
          personalised hypnosis program — free.
        </motion.p>

        {/* Social proof strip */}
        <motion.div {...fadeUp(0.1)} className="flex items-center gap-3 mb-10">
          <div className="flex -space-x-2">
            {["#8A5EFF", "#4675FF", "#34CBBF", "#c4afff"].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                style={{
                  background: color,
                  borderColor: "#07001c",
                  color: "#fff",
                }}
              >
                {["S", "M", "J", "A"][i]}
              </div>
            ))}
          </div>
          <p className="text-sm" style={{ color: "#ffffff" }}>
            <span className="font-semibold" style={{ color: "#c4afff" }}>
              94,000+
            </span>{" "}
            people broke free
          </p>
        </motion.div>
      </div>

      {/* Testimonials */}
      <div className="mt-12 space-y-4">
        {[
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
            text: "\"Started with anxiety and alcohol dependence. After the second hypnosis session, I felt a shift. Three months later, completely transformed. Worth every penny.\"",
            name: "Michelle L., 28",
            tag: "3 months free",
          },
        ].map((t, i) => (
          <motion.div
            key={i}
            {...fadeUp(i * 0.1)}
            className="p-4 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(138,94,255,0.1) 0%, rgba(52,203,191,0.06) 100%)",
              border: "1px solid rgba(52,203,191,0.25)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xs">★★★★★</span>
                <span className="text-xs font-semibold" style={{ color: "#34CBBF" }}>
                  {t.name}
                </span>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(52,203,191,0.12)",
                  color: "#34CBBF",
                  border: "1px solid rgba(52,203,191,0.25)",
                }}
              >
                {t.tag}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#ffffff" }}>
              {t.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        {...fadeUp(0)}
        className="border-t mt-12 pt-10 flex flex-col items-start gap-8"
        style={{ borderColor: "rgba(255,255,255,0.15)" }}
      >
        {/* Logo */}
        <MendedLogo size="sm" />

        {/* Links */}
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

        {/* Copyright + Disclaimer */}
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
