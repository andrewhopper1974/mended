"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { vibrate } from "@/lib/quizData";
import MendedLogo from "@/components/MendedLogo";

interface Props {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | null>(null);

  const handleGenderSelect = (gender: "male" | "female") => {
    vibrate([40, 20, 40]);
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

      {/* Headline */}
      <div className="flex-1 flex flex-col justify-center">
        <h1
          className="text-3xl font-bold leading-tight mb-5"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Break free from
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #8A5EFF 0%, #34CBBF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            alcohol — for good.
          </span>
        </h1>

        {/* Hero image with simple border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full rounded-2xl mb-10 overflow-hidden"
          style={{
            minHeight: "280px",
            border: "3px solid rgba(52,203,191,0.5)",
            boxShadow: "0 10px 30px rgba(52,203,191,0.15)",
          }}
        >
          <img
            src="/images/hero.png"
            alt="Quit alcohol hypnosis"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </motion.div>

        <p
          className="text-base leading-relaxed mb-10"
          style={{ color: "#ffffff" }}
        >
          Answer 3 minutes of questions and Mended will build your
          personalised hypnosis program — free.
        </p>

        {/* Social proof strip */}
        <div className="flex items-center gap-3 mb-10">
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
        </div>

        {/* Gender Selection */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold mb-5 tracking-wide uppercase" style={{
            background: "linear-gradient(90deg, #34CBBF 0%, #8A5EFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Start by selecting your gender:
          </p>
          <div className="flex gap-3">
            <motion.button
              onClick={() => handleGenderSelect("male")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-5 text-2xl font-bold rounded-full transition-all"
              style={{
                background: "linear-gradient(135deg, #8A5EFF 0%, #34CBBF 100%)",
                border: selectedGender === "male" ? "3px solid rgba(255,255,255,0.8)" : "none",
                color: "#ffffff",
                boxShadow: "0 8px 25px rgba(52,203,191,0.3)",
                opacity: selectedGender === null || selectedGender === "male" ? 1 : 0.6,
              }}
            >
              Male
            </motion.button>
            <motion.button
              onClick={() => handleGenderSelect("female")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-5 text-2xl font-bold rounded-full transition-all"
              style={{
                background: "linear-gradient(135deg, #8A5EFF 0%, #34CBBF 100%)",
                border: selectedGender === "female" ? "3px solid rgba(255,255,255,0.8)" : "none",
                color: "#ffffff",
                boxShadow: "0 8px 25px rgba(52,203,191,0.3)",
                opacity: selectedGender === null || selectedGender === "female" ? 1 : 0.6,
              }}
            >
              Female
            </motion.button>
          </div>
        </div>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.15 }}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
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
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright + Disclaimer */}
        <div className="flex flex-col items-start gap-2 pb-2">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © 2026 Mended. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Results may vary from person to person.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
