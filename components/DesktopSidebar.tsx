"use client";

import { useState, useEffect } from "react";

const TESTIMONIALS = [
  {
    name: "Sarah M., 34",
    tag: "6 months sober",
    text: "I'd tried AA and sheer willpower. Nothing worked until this. By session 3 I stopped wanting a drink at 5pm. Now I'm 6 months sober and feeling alive again.",
    avatar: "S",
    color: "#8A5EFF",
  },
  {
    name: "James T., 41",
    tag: "Alcohol-free",
    text: "I was drinking every night. Did the first session completely skeptical. Woke up the next morning and just didn't want it. Changed my life completely.",
    avatar: "J",
    color: "#34CBBF",
  },
  {
    name: "Michelle L., 28",
    tag: "3 months free",
    text: "Started with anxiety and alcohol dependence. After the second hypnosis session, I felt a shift. Three months later, completely transformed.",
    avatar: "M",
    color: "#4675FF",
  },
  {
    name: "David R., 52",
    tag: "1 year sober",
    text: "After 20 years of heavy drinking I'd given up hope. Mended was my last attempt. One year on and I genuinely don't miss it. My family has me back.",
    avatar: "D",
    color: "#c4afff",
  },
];

const TRUST_BADGES = [
  { icon: "🔬", label: "Science-backed", sub: "Clinically validated hypnosis" },
  { icon: "🔒", label: "SSL Secure", sub: "256-bit encryption" },
  { icon: "↩️", label: "30-day guarantee", sub: "Full refund, no questions" },
  { icon: "⭐", label: "4.9/5 rating", sub: "From 2,847 reviews" },
];

export default function DesktopSidebar() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % TESTIMONIALS.length);
        setFading(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = TESTIMONIALS[current];

  return (
    <div
      className="sticky top-0 h-screen flex flex-col justify-center px-10 py-12 overflow-hidden"
      style={{ background: "#07001c" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 60% 40%, rgba(138,94,255,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 0,
          right: 0,
          width: 400,
          height: 400,
          background: "radial-gradient(ellipse, rgba(52,203,191,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-sm">

        {/* Big stat */}
        <div className="mb-10">
          <div
            className="text-6xl font-bold mb-2 leading-none"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              background: "linear-gradient(135deg, #c4afff 0%, #8A5EFF 40%, #34CBBF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            94,000+
          </div>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
            people have broken free from alcohol using Mended
          </p>
        </div>

        {/* Rotating testimonial */}
        <div
          className="rounded-2xl p-6 mb-8 transition-all duration-400"
          style={{
            background: "linear-gradient(135deg, rgba(138,94,255,0.12) 0%, rgba(52,203,191,0.06) 100%)",
            border: "1px solid rgba(138,94,255,0.25)",
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          {/* Stars */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-sm">★★★★★</span>
            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
              Verified purchase
            </span>
          </div>

          <p
            className="text-sm leading-relaxed mb-5"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            &ldquo;{t.text}&rdquo;
          </p>

          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: t.color, color: "#fff" }}
            >
              {t.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(52,203,191,0.12)",
                  border: "1px solid rgba(52,203,191,0.3)",
                  color: "#34CBBF",
                }}
              >
                {t.tag}
              </span>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-1.5 mb-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: i === current
                  ? "linear-gradient(90deg, #8A5EFF, #34CBBF)"
                  : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3">
          {TRUST_BADGES.map((b) => (
            <div
              key={b.label}
              className="rounded-xl p-3 flex items-start gap-2.5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span className="text-lg flex-shrink-0">{b.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white">{b.label}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
