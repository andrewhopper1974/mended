"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import { vibrate } from "@/lib/quizData";
import MendedLogo from "@/components/MendedLogo";

interface QuizItem {
  type: "question" | "open-ended";
  id: number;
  question: string;
  options?: string[];
  emojis?: (string | null)[];
  placeholder?: string;
  multiline?: boolean;
  inputMode?: "text" | "numeric" | "decimal";
}

interface Props {
  item: QuizItem;
  questionNumber: number;
  totalQuestions: number;
  progress: number;
  savedAnswers: string[];
  onAdvance: (questionId: number, selected: string[]) => void;
  onBack: () => void;
  direction: 1 | -1;
  allAnswers: Record<number, string[]>;
}

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

// Fallback emoji lookup (only used when no emojis array is provided)
function getEmojiForAnswer(answer: string): string {
  const lower = answer.toLowerCase();

  // Daily/frequency
  if (lower.includes("every day")) return "📅";
  if (lower.includes("weekend")) return "🎉";
  if (lower.includes("binge")) return "🍷";
  if (lower.includes("morning")) return "☀️";
  if (lower.includes("night")) return "🌙";

  // Reasons/triggers
  if (lower.includes("stress") || lower.includes("anxiety")) return "😰";
  if (lower.includes("bored")) return "😐";
  if (lower.includes("social")) return "👥";
  if (lower.includes("loneliness")) return "🏝️";
  if (lower.includes("confident")) return "💪";
  if (lower.includes("calm")) return "🧘";
  if (lower.includes("numb") || lower.includes("pain")) return "💔";
  if (lower.includes("happy") || lower.includes("feel")) return "😊";
  if (lower.includes("sleep")) return "😴";

  // Effects/consequences
  if (lower.includes("weight")) return "⚖️";
  if (lower.includes("relationship")) return "💔";
  if (lower.includes("work") || lower.includes("performance")) return "📉";
  if (lower.includes("money") || lower.includes("spending")) return "💸";
  if (lower.includes("health")) return "❤️";
  if (lower.includes("mental")) return "🧠";
  if (lower.includes("sleep")) return "😴";
  if (lower.includes("shake") || lower.includes("physical")) return "🤕";
  if (lower.includes("irritable") || lower.includes("anxious")) return "😤";

  // Goals/aspirations
  if (lower.includes("rested") || lower.includes("clear")) return "✨";
  if (lower.includes("energy")) return "⚡";
  if (lower.includes("proud")) return "🏆";
  if (lower.includes("relationships")) return "💝";
  if (lower.includes("healthier") || lower.includes("body")) return "💪";
  if (lower.includes("money")) return "💰";
  if (lower.includes("calm") || lower.includes("quiet")) return "🧘";
  if (lower.includes("myself")) return "🪞";

  // Attempts/struggles
  if (lower.includes("succeeded")) return "✅";
  if (lower.includes("relapse")) return "📊";
  if (lower.includes("craving")) return "😞";
  if (lower.includes("failed")) return "⚠️";
  if (lower.includes("tried many")) return "💪";
  if (lower.includes("never tried")) return "🤷";
  if (lower.includes("actively")) return "🔥";

  // Worries/concerns
  if (lower.includes("withdrawal")) return "⚠️";
  if (lower.includes("fail")) return "😟";
  if (lower.includes("miss")) return "💭";
  if (lower.includes("judgment")) return "👀";

  // Methods/solutions
  if (lower.includes("hypnosis")) return "🧠";
  if (lower.includes("therapy")) return "👨‍⚕️";
  if (lower.includes("support group")) return "👥";
  if (lower.includes("medication")) return "💊";
  if (lower.includes("willpower")) return "💪";
  if (lower.includes("structure")) return "📋";

  // Default
  return "💜";
}

// Q9 inline hint
const Q9_HINT =
  "This is exactly what our program is designed to give you.";
// Q21 hypnosis hint
const Q21_HYPNOSIS_OPTION = "Subconscious reprogramming through hypnosis";
const Q21_HINT = "Hypnosis is the core of your program — perfect.";

// Context cards shown below open-ended inputs
const OPEN_ENDED_CONTEXT: Record<number, { icon: string; color: string; title: string; body: string }> = {
  28: {
    icon: "🎯",
    color: "#8A5EFF",
    title: "Personalising your program",
    body: "Your age helps us calibrate session intensity and set realistic milestones tailored specifically to you.",
  },
  29: {
    icon: "📊",
    color: "#34CBBF",
    title: "Building your profile",
    body: "We use your physical stats to personalise the body recovery aspects of your program — no two programs are the same.",
  },
  30: {
    icon: "⚖️",
    color: "#4675FF",
    title: "You'll likely lose weight too",
    body: "Alcohol is full of empty calories. Most Mended members naturally drop weight as a side effect of sobriety — without trying.",
  },
  31: {
    icon: "🏆",
    color: "#34CBBF",
    title: "Goals make freedom real",
    body: "People with a concrete target are 43% more likely to achieve lasting sobriety and the lifestyle transformation that comes with it.",
  },
  25: {
    icon: "🔒",
    color: "#8A5EFF",
    title: "This is just for you",
    body: "Your honesty here directly shapes your hypnosis sessions. The more real you are with yourself, the more powerful your program becomes.",
  },
  26: {
    icon: "💜",
    color: "#c4afff",
    title: "This takes real courage",
    body: "Naming what alcohol has truly cost you is one of the most powerful things you can do. Most people never get this honest with themselves.",
  },
  27: {
    icon: "✨",
    color: "#34CBBF",
    title: "Visualisation is already working",
    body: "Writing your future self into existence is a core technique used in your sessions. What you're doing right now is part of your program.",
  },
};

export default function QuizScreen({
  item,
  questionNumber,
  totalQuestions,
  progress,
  savedAnswers,
  onAdvance,
  onBack,
  direction,
  allAnswers,
}: Props) {
  const [selected, setSelected] = useState<string[]>(savedAnswers);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setSelected(savedAnswers);
    setShowHint(false);
  }, [item.id, savedAnswers]);

  // Check hints after selection changes
  useEffect(() => {
    if (item.id === 9 && selected.length > 0) {
      setShowHint(true);
    } else if (
      item.id === 21 &&
      selected.includes(Q21_HYPNOSIS_OPTION)
    ) {
      setShowHint(true);
    } else {
      setShowHint(false);
    }
  }, [selected, item.id]);

  const toggleOption = (opt: string) => {
    const isRemoving = selected.includes(opt);
    vibrate(isRemoving ? 15 : 25);
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleTextChange = (text: string) => {
    setSelected(text ? [text] : []);
  };

  const canContinue =
    item.type === "open-ended"
      ? item.multiline === false
        ? selected.length > 0 && selected[0].trim().length >= 1   // stat fields: just needs a value
        : selected.length > 0 && selected[0].trim().length >= 3   // reflective: needs real text
      : selected.length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    vibrate([40, 15, 40]);
    onAdvance(item.id, selected);
  };

  const handleBack = () => {
    vibrate(20);
    onBack();
  };

  return (
    <motion.div
      key={item.id}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
      className="flex flex-col min-h-screen"
      style={{ background: "#07001c" }}
    >
      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-50"
        style={{ background: "#07001c" }}
      >
        {/* Logo */}
        <div className="flex justify-center pt-3 pb-1">
          <MendedLogo size="sm" />
        </div>
        {/* Nav row */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
          <span
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {questionNumber} of {totalQuestions}
          </span>
        </div>
        {/* Progress bar */}
        <ProgressBar progress={progress} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-32">
        <h2
          className="text-xl font-bold mb-6 leading-snug"
          style={{ color: "#ffffff" }}
        >
          {item.question}
        </h2>

        {/* Hint after Q9 */}
        {showHint && item.id === 9 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(52,203,191,0.12)",
              border: "1px solid rgba(52,203,191,0.3)",
              color: "#34CBBF",
            }}
          >
            ✨ {Q9_HINT}
          </motion.div>
        )}

        {/* Hint after Q21 hypnosis selected */}
        {showHint && item.id === 21 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(138,94,255,0.12)",
              border: "1px solid rgba(138,94,255,0.3)",
              color: "#c4afff",
            }}
          >
            🧠 {Q21_HINT}
          </motion.div>
        )}

        {item.type === "open-ended" ? (
          /* ── Open-ended text input ── */
          <div>
            <div className="relative">
              {item.multiline !== false ? (
                /* Multi-line textarea for reflective questions */
                <textarea
                  value={selected[0] || ""}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={item.placeholder || "Type your answer here..."}
                  rows={6}
                  className="w-full rounded-2xl px-4 py-4 text-sm leading-relaxed resize-none outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: (selected[0]?.trim().length ?? 0) >= 3
                      ? "1.5px solid rgba(52,203,191,0.6)"
                      : "1.5px solid rgba(255,255,255,0.12)",
                    color: "#ffffff",
                    caretColor: "#34CBBF",
                    transition: "border-color 0.2s",
                  }}
                />
              ) : (
                /* Single-line input for stats (age, height, weight, etc.) */
                <input
                  type="text"
                  inputMode={item.inputMode ?? "text"}
                  value={selected[0] || ""}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={item.placeholder || "Type your answer here..."}
                  className="w-full rounded-2xl px-4 outline-none"
                  style={{
                    height: "60px",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.05)",
                    border: (selected[0]?.trim().length ?? 0) >= 1
                      ? "1.5px solid rgba(52,203,191,0.6)"
                      : "1.5px solid rgba(255,255,255,0.12)",
                    color: "#ffffff",
                    caretColor: "#34CBBF",
                    transition: "border-color 0.2s",
                  }}
                />
              )}
              {/* Character count */}
              <div
                className="mt-2 text-xs text-right"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {item.multiline !== false && (selected[0] || "").length > 0 &&
                  `${(selected[0] || "").length} characters`}
              </div>
            </div>

            {/* ── Context card ── */}
            {OPEN_ENDED_CONTEXT[item.id] && (() => {
              const ctx = OPEN_ENDED_CONTEXT[item.id];
              return (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                  className="mt-6 rounded-2xl p-5 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(138,94,255,0.1) 0%, rgba(52,203,191,0.06) 100%)",
                    border: `1px solid rgba(138,94,255,0.2)`,
                  }}
                >
                  {/* Subtle corner glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{
                    background: `radial-gradient(ellipse at top right, ${ctx.color}22 0%, transparent 70%)`,
                  }} />
                  <div className="flex items-start gap-3 relative z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${ctx.color}18`, border: `1px solid ${ctx.color}30` }}
                    >
                      {ctx.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: ctx.color }}>
                        {ctx.title}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {ctx.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* ── Decorative ambient area ── */}
            <div className="relative mt-8 pointer-events-none" style={{ height: 160 }}>
              {/* Floating particles — scattered, varied sizes/speeds/drift */}
              {[
                { x: "4%",  y: "12%", size: 2,   color: "#8A5EFF", delay: 0,    dur: 3.2, driftX: 4  },
                { x: "83%", y: "5%",  size: 1.5, color: "#34CBBF", delay: 0.7,  dur: 4.0, driftX: -3 },
                { x: "47%", y: "52%", size: 5,   color: "#8A5EFF", delay: 1.2,  dur: 3.6, driftX: 2  },
                { x: "18%", y: "78%", size: 2,   color: "#34CBBF", delay: 0.3,  dur: 5.0, driftX: -4 },
                { x: "91%", y: "48%", size: 3,   color: "#4675FF", delay: 0.9,  dur: 3.8, driftX: -2 },
                { x: "33%", y: "22%", size: 1.5, color: "#c4afff", delay: 0.5,  dur: 4.5, driftX: 3  },
                { x: "62%", y: "82%", size: 4,   color: "#34CBBF", delay: 1.6,  dur: 3.3, driftX: -3 },
                { x: "11%", y: "40%", size: 2,   color: "#4675FF", delay: 1.1,  dur: 4.2, driftX: 5  },
                { x: "96%", y: "20%", size: 1.5, color: "#c4afff", delay: 0.2,  dur: 3.9, driftX: -2 },
                { x: "57%", y: "92%", size: 3,   color: "#8A5EFF", delay: 0.8,  dur: 4.7, driftX: 3  },
                { x: "26%", y: "8%",  size: 1.5, color: "#34CBBF", delay: 1.4,  dur: 5.2, driftX: -4 },
                { x: "74%", y: "35%", size: 2.5, color: "#8A5EFF", delay: 0.6,  dur: 3.5, driftX: 2  },
                { x: "42%", y: "68%", size: 2,   color: "#4675FF", delay: 1.8,  dur: 4.1, driftX: -3 },
                { x: "7%",  y: "60%", size: 3,   color: "#c4afff", delay: 0.4,  dur: 3.7, driftX: 4  },
                { x: "68%", y: "15%", size: 2,   color: "#34CBBF", delay: 1.0,  dur: 4.8, driftX: -2 },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{ left: p.x, top: p.y, width: p.size, height: p.size, background: p.color }}
                  animate={{
                    y: [-7, 7, -7],
                    x: [0, p.driftX, 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.4, 1],
                  }}
                  transition={{ repeat: Infinity, duration: p.dur, delay: p.delay, ease: "easeInOut" }}
                />
              ))}

              {/* Glow auras — spread across different vertical positions */}
              <div className="absolute" style={{
                left: "-5%", top: "5%",
                width: 140, height: 140,
                background: "radial-gradient(ellipse, rgba(138,94,255,0.18) 0%, transparent 70%)",
                filter: "blur(30px)",
              }} />
              <div className="absolute" style={{
                right: "-5%", top: "40%",
                width: 120, height: 120,
                background: "radial-gradient(ellipse, rgba(52,203,191,0.15) 0%, transparent 70%)",
                filter: "blur(24px)",
              }} />
              <div className="absolute" style={{
                left: "30%", top: "55%",
                width: 160, height: 90,
                background: "radial-gradient(ellipse, rgba(70,117,255,0.13) 0%, transparent 70%)",
                filter: "blur(32px)",
              }} />
              <div className="absolute" style={{
                right: "15%", top: "10%",
                width: 100, height: 100,
                background: "radial-gradient(ellipse, rgba(196,175,255,0.11) 0%, transparent 70%)",
                filter: "blur(20px)",
              }} />
            </div>
          </div>
        ) : (
          /* ── Multiple choice options ── */
          <div className="space-y-3">
            {item.options?.map((opt, i) => {
              const isSelected = selected.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  className={`answer-card w-full flex items-center gap-3 px-4 py-4 text-left ${
                    isSelected ? "selected" : ""
                  }`}
                >
                  {/* Emoji icon — only show if emoji is defined for this question */}
                  {item.emojis && item.emojis[i] && (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{
                        background: isSelected
                          ? "rgba(52,203,191,0.15)"
                          : "rgba(255,255,255,0.06)",
                      }}
                    >
                      {item.emojis[i]}
                    </div>
                  )}

                  {/* Text */}
                  <span
                    className="flex-1 text-sm font-medium leading-snug"
                    style={{
                      color: isSelected
                        ? "#ffffff"
                        : "rgba(255,255,255,0.82)",
                    }}
                  >
                    {opt}
                  </span>

                  {/* Checkbox */}
                  <div
                    className={`answer-checkbox ${isSelected ? "checked" : ""}`}
                  >
                    {isSelected && (
                      <svg
                        width="12"
                        height="10"
                        viewBox="0 0 12 10"
                        fill="none"
                      >
                        <path
                          d="M1 5L4.5 8.5L11 1.5"
                          stroke="#07001c"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed Continue button */}
      {canContinue && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 z-50"
          style={{
            background: "linear-gradient(to top, #07001c 60%, transparent)",
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          <button
            onClick={handleContinue}
            className="btn-cta w-full py-4 text-base font-semibold"
            style={{ borderRadius: "14px" }}
          >
            Continue
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
