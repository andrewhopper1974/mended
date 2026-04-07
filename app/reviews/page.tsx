"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const REVIEWS = [
  {
    name: "Sarah M.",
    age: 34,
    tag: "6 months sober",
    stars: 5,
    text: "I'd tried plenty of things alongside white-knuckling it. The CBT trigger work and learning to actually surf the urges instead of fighting them is what finally clicked. Six months in and 5pm doesn't own me anymore.",
  },
  {
    name: "James T.",
    age: 41,
    tag: "4 months sober",
    stars: 5,
    text: "Drinking every night for 8 years. The CBT exercises around catching and challenging the automatic 'I deserve this' thoughts felt almost too simple — but within weeks the evening pull just lost its grip. Four months on and I'm still amazed.",
  },
  {
    name: "Michelle L.",
    age: 28,
    tag: "3 months free",
    stars: 5,
    text: "Started with crippling anxiety and alcohol dependence. The mindfulness practices and the Stoic 'pause' work gave me a space between feeling and reacting that I never knew I had. Three months later, completely transformed.",
  },
  {
    name: "Daniel R.",
    age: 37,
    tag: "Lost 22 lbs too",
    stars: 5,
    text: "Didn't expect the weight loss side effect. Turns out alcohol was behind so much of it. Down 22 lbs and haven't touched a drink in 5 months. My wife says she has her husband back.",
  },
  {
    name: "Karen H.",
    age: 52,
    tag: "Finally free",
    stars: 5,
    text: "I'd been drinking to cope with grief for 3 years. Mended helped me address the emotional root, not just the symptom. For the first time in years I feel like myself again. I can't thank this program enough.",
  },
  {
    name: "Tom W.",
    age: 44,
    tag: "Sober 7 months",
    stars: 5,
    text: "I was deeply skeptical. But the urge surfing technique — just watching the craving rise and fall without acting — actually worked. It's not willpower, it's a skill. 7 months later and I've never looked back.",
  },
  {
    name: "Priya S.",
    age: 31,
    tag: "No more hangxiety",
    stars: 5,
    text: "The hangxiety alone was ruining my life. Two days a week I was completely written off. Within 3 weeks of starting the program that was gone. I feel productive, present, and genuinely happy.",
  },
  {
    name: "Mark B.",
    age: 49,
    tag: "Best decision I made",
    stars: 5,
    text: "I'd tried a lot of things over the years. What worked for me here was the combination — the CBT structure, the mindfulness practice, and honestly the Stoic readings gave it a depth I didn't expect. Over a year sober now.",
  },
];

export default function ReviewsPage() {
  const avg = "4.9";
  const total = "2,847";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col min-h-screen px-5 pt-10 pb-20"
      style={{ background: "#07001c" }}
    >
      {/* Back */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm font-medium mb-8 w-fit"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      {/* Header */}
      <h1
        className="text-3xl font-bold mb-2 leading-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        Real Stories.<br />
        <span style={{
          background: "linear-gradient(90deg, #8A5EFF 0%, #34CBBF 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Real Results.
        </span>
      </h1>
      <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
        From people who were exactly where you are now.
      </p>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="rounded-2xl p-5 mb-8 flex items-center gap-5"
        style={{
          background: "linear-gradient(135deg, rgba(138,94,255,0.12) 0%, rgba(52,203,191,0.07) 100%)",
          border: "1px solid rgba(138,94,255,0.25)",
        }}
      >
        <div className="text-center">
          <p className="text-4xl font-bold" style={{
            background: "linear-gradient(90deg, #c4afff, #34CBBF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "var(--font-playfair), Georgia, serif",
          }}>
            {avg}
          </p>
          <div className="flex justify-center mt-1">
            {"★★★★★".split("").map((s, i) => (
              <span key={i} className="text-yellow-400 text-sm">{s}</span>
            ))}
          </div>
        </div>
        <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div>
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>verified reviews</p>
          <p className="text-xs mt-1" style={{ color: "rgba(52,203,191,0.8)" }}>94% would recommend</p>
        </div>
      </motion.div>

      {/* Review cards */}
      <div className="space-y-4">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(138,94,255,0.3), rgba(52,203,191,0.2))" }}
                >
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">{r.name}, {r.age}</p>
                  <div className="flex mt-0.5">
                    {"★".repeat(r.stars).split("").map((s, j) => (
                      <span key={j} className="text-yellow-400" style={{ fontSize: 10 }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(52,203,191,0.1)",
                  color: "#34CBBF",
                  border: "1px solid rgba(52,203,191,0.2)",
                }}
              >
                {r.tag}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
              "{r.text}"
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
