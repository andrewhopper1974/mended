"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import { vibrate } from "@/lib/quizData";

interface InterstitialItem {
  type: "interstitial";
  stat: string;
  copy: string;
}

interface Props {
  item: InterstitialItem;
  progress: number;
  onDone: () => void;
  onBack: () => void;
}

export default function InterstitialScreen({ item, progress, onDone, onBack }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    vibrate([15, 10, 30, 10, 60]);
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col min-h-screen relative overflow-hidden"
      style={{ background: "#07001c" }}
    >
      {/* ── Background atmosphere — desktop only (blur filters are very expensive on mobile) ── */}
      {!isMobile && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(138,94,255,0.2) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 400,
              height: 300,
              background: "radial-gradient(ellipse, rgba(52,203,191,0.1) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
        </>
      )}

      {/* Floating particles — desktop only to avoid mobile jank */}
      {!isMobile && [
        { x: "15%", y: "20%", size: 3, delay: 0 },
        { x: "80%", y: "15%", size: 2, delay: 0.6 },
        { x: "70%", y: "55%", size: 4, delay: 1.1 },
        { x: "20%", y: "60%", size: 2, delay: 0.3 },
        { x: "88%", y: "75%", size: 3, delay: 0.9 },
        { x: "10%", y: "80%", size: 2, delay: 1.4 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: i % 2 === 0 ? "rgba(138,94,255,0.7)" : "rgba(52,203,191,0.7)",
          }}
          animate={{ y: [-6, 6, -6], opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 3 + i * 0.4, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Progress bar */}
      <div className="sticky top-0 z-50" style={{ background: "rgba(7,0,28,0.8)", backdropFilter: "blur(8px)" }}>
        <div className="flex items-center px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>
        <ProgressBar progress={progress} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10">

        {/* ── Stat section ── */}
        <div className="text-center mb-10">
          {/* Decorative rings behind the stat */}
          <div className="relative flex justify-center items-center mb-6" style={{ height: 140 }}>
            {!isMobile && [130, 100, 72].map((size, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  border: `1px solid rgba(138,94,255,${0.12 + i * 0.06})`,
                }}
                animate={{ scale: [1, 1.04, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5 + i * 0.5, delay: i * 0.4, ease: "easeInOut" }}
              />
            ))}
            {isMobile && (
              <div
                className="absolute rounded-full"
                style={{
                  width: 110,
                  height: 110,
                  border: "1px solid rgba(138,94,255,0.22)",
                }}
              />
            )}

            {/* Stat number floating in center */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 160, damping: 14 }}
              className="relative font-bold"
              style={{
                fontSize: "clamp(3rem, 16vw, 5.5rem)",
                background: "linear-gradient(135deg, #c4afff 0%, #8A5EFF 40%, #34CBBF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
                fontFamily: "var(--font-playfair), Georgia, serif",
                filter: isMobile ? undefined : "drop-shadow(0 0 30px rgba(138,94,255,0.5))",
              }}
            >
              {item.stat}
            </motion.div>
          </div>

          {/* Label under stat */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-xs font-semibold tracking-widest uppercase mb-0"
            style={{ color: "rgba(196,175,255,0.5)" }}
          >
            of people like you
          </motion.p>
        </div>

        {/* ── Quote card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(138,94,255,0.12) 0%, rgba(52,203,191,0.06) 100%)",
            border: "1px solid rgba(138,94,255,0.25)",
          }}
        >
          {/* Large decorative quote mark */}
          <div
            className="absolute top-3 left-4 font-bold leading-none pointer-events-none select-none"
            style={{
              fontSize: 64,
              color: "rgba(138,94,255,0.12)",
              fontFamily: "Georgia, serif",
              lineHeight: 1,
            }}
          >
            "
          </div>

          <p
            className="text-base leading-relaxed relative z-10"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            {item.copy}
          </p>
        </motion.div>

        {/* ── Mini progress visual ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center gap-3 rounded-xl px-4 py-3 mb-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Your progress through the assessment
              </span>
              <span className="text-xs font-bold" style={{ color: "#34CBBF" }}>
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: 4, background: "rgba(255,255,255,0.07)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #8A5EFF, #34CBBF)",
                  boxShadow: "0 0 6px rgba(52,203,191,0.5)",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── CTA button ── */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, type: "spring", stiffness: 180, damping: 28 }}
          onClick={() => { vibrate([40, 15, 40]); onDone(); }}
          className="btn-cta w-full py-4 text-base font-semibold"
          style={{ borderRadius: "14px" }}
        >
          Continue →
        </motion.button>
      </div>
    </motion.div>
  );
}
