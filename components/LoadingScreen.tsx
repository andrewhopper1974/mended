"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { icon: "🔍", label: "Analyzing your drinking patterns" },
  { icon: "🧩", label: "Mapping your personal triggers" },
  { icon: "🧠", label: "Identifying your thought patterns" },
  { icon: "✨", label: "Building your CBT and mindfulness protocol" },
];

interface Props {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const totalDuration = 10000;
    const stepDuration = totalDuration / STEPS.length;
    const tickInterval = 60;
    let elapsed = 0;

    const tick = setInterval(() => {
      elapsed += tickInterval;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setBarWidth(pct);

      const newStep = Math.min(Math.floor(elapsed / stepDuration), STEPS.length - 1);
      if (newStep > stepIndex) {
        setCompletedSteps((prev) => [...prev, newStep - 1]);
      }
      setStepIndex(newStep);

      if (elapsed >= totalDuration) {
        clearInterval(tick);
        setCompletedSteps([0, 1, 2, 3]);
        setTimeout(onDone, 400);
      }
    }, tickInterval);

    return () => clearInterval(tick);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col min-h-screen px-6 pt-16 pb-10 relative overflow-hidden"
      style={{ background: "#07001c" }}
    >
      {/* Background radial blooms */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(138,94,255,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "10%",
          right: "-20%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,203,191,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Animated orbital rings */}
      <div className="flex justify-center mb-10 relative" style={{ height: 180 }}>
        {/* Outer ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 170,
            height: 170,
            border: "1px solid rgba(138,94,255,0.2)",
            top: 5,
            left: "50%",
            marginLeft: -85,
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        >
          {/* Orbiting dot on outer ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 7,
              height: 7,
              background: "linear-gradient(90deg, #8A5EFF, #34CBBF)",
              top: -3.5,
              left: "50%",
              marginLeft: -3.5,
              boxShadow: "0 0 8px rgba(138,94,255,0.8)",
            }}
          />
        </motion.div>

        {/* Middle ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 122,
            height: 122,
            border: "1px solid rgba(52,203,191,0.25)",
            top: 29,
            left: "50%",
            marginLeft: -61,
          }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        >
          {/* Orbiting dot on middle ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 6,
              height: 6,
              background: "#34CBBF",
              bottom: -3,
              left: "50%",
              marginLeft: -3,
              boxShadow: "0 0 8px rgba(52,203,191,0.9)",
            }}
          />
        </motion.div>

        {/* Inner pulsing core */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: 76,
            height: 76,
            top: 52,
            left: "50%",
            marginLeft: -38,
            background: "linear-gradient(135deg, rgba(138,94,255,0.3), rgba(52,203,191,0.2))",
            border: "1.5px solid rgba(138,94,255,0.5)",
          }}
          animate={{ scale: [1, 1.08, 1], boxShadow: ["0 0 16px rgba(138,94,255,0.3)", "0 0 32px rgba(138,94,255,0.6)", "0 0 16px rgba(138,94,255,0.3)"] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <span style={{ fontSize: 28 }}>🧠</span>
        </motion.div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2
          className="text-2xl font-bold mb-1.5"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Building Your Program
        </h2>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Personalizing based on your answers
        </p>
      </div>

      {/* Step cards */}
      <div className="space-y-2.5 mb-8">
        {STEPS.map((step, i) => {
          const isDone = completedSteps.includes(i);
          const isActive = i === stepIndex && !isDone;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: isActive || isDone ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{
                background: isActive
                  ? "linear-gradient(90deg, rgba(138,94,255,0.15), rgba(52,203,191,0.08))"
                  : isDone
                  ? "rgba(52,203,191,0.06)"
                  : "rgba(255,255,255,0.03)",
                border: isActive
                  ? "1px solid rgba(138,94,255,0.35)"
                  : isDone
                  ? "1px solid rgba(52,203,191,0.2)"
                  : "1px solid rgba(255,255,255,0.05)",
                transition: "all 0.4s ease",
              }}
            >
              {/* Icon / status */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                style={{
                  background: isDone
                    ? "rgba(52,203,191,0.15)"
                    : isActive
                    ? "rgba(138,94,255,0.15)"
                    : "rgba(255,255,255,0.05)",
                }}
              >
                {isDone ? (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="#34CBBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      border: "2px solid rgba(138,94,255,0.3)",
                      borderTopColor: "#8A5EFF",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 14 }}>{step.icon}</span>
                )}
              </div>

              <span
                className="text-sm font-medium"
                style={{
                  color: isDone
                    ? "rgba(52,203,191,0.9)"
                    : isActive
                    ? "#ffffff"
                    : "rgba(255,255,255,0.35)",
                }}
              >
                {step.label}
              </span>

              {isActive && (
                <motion.span
                  className="ml-auto text-xs font-semibold"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  style={{ color: "#8A5EFF" }}
                >
                  Running...
                </motion.span>
              )}
              {isDone && (
                <span className="ml-auto text-xs" style={{ color: "rgba(52,203,191,0.6)" }}>
                  Done
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            Analyzing
          </span>
          <span className="text-sm font-bold countdown" style={{ color: "#c4afff" }}>
            {Math.round(barWidth)}%
          </span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 6, background: "rgba(255,255,255,0.07)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${barWidth}%`,
              background: "linear-gradient(90deg, #8A5EFF 0%, #4675FF 50%, #34CBBF 100%)",
              boxShadow: "0 0 10px rgba(138,94,255,0.6)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
