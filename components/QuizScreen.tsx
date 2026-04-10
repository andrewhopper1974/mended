"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import { vibrate } from "@/lib/quizData";
import MendedLogo from "@/components/MendedLogo";

interface QuizOption {
  text: string;
  emoji?: string;
}
interface QuizItem {
  type: "question" | "open-ended";
  id: number;
  question: string;
  options?: QuizOption[];
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

export default function QuizScreen({
  item,
  questionNumber,
  totalQuestions,
  progress,
  savedAnswers,
  onAdvance,
  onBack,
  direction,
}: Props) {
  const [selected, setSelected] = useState<string[]>(savedAnswers);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelected(savedAnswers);
    setIsAdvancing(false);
  }, [item.id, savedAnswers]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const selectOption = (opt: string) => {
    if (isAdvancing) return;
    vibrate(25);
    setSelected([opt]);
    setIsAdvancing(true);

    advanceTimer.current = setTimeout(() => {
      onAdvance(item.id, [opt]);
    }, 300);
  };

  const handleTextChange = (text: string) => {
    setSelected(text ? [text] : []);
  };

  const canContinue =
    item.type === "open-ended"
      ? item.multiline === false
        ? selected.length > 0 && selected[0].trim().length >= 1
        : selected.length > 0 && selected[0].trim().length >= 3
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
        <div className="flex justify-center pt-3 pb-1">
          <MendedLogo size="sm" />
        </div>
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
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(138,94,255,0.15)",
              border: "1px solid rgba(138,94,255,0.25)",
              color: "rgba(196,175,255,0.9)",
            }}
          >
            {questionNumber} / {totalQuestions}
          </span>
        </div>
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

        {item.type === "open-ended" ? (
          /* ── Open-ended text input ── */
          <div>
            <div className="relative">
              {item.multiline !== false ? (
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
            </div>
          </div>
        ) : (
          /* ── Single-select options ── */
          <div className="space-y-3">
            {item.options?.map((opt) => {
              const isSelected = selected.includes(opt.text);
              return (
                <motion.button
                  key={opt.text}
                  onClick={() => selectOption(opt.text)}
                  disabled={isAdvancing}
                  animate={isSelected ? {
                    scale: [1, 1.015, 1],
                    transition: { duration: 0.2 }
                  } : {}}
                  className="w-full flex items-center gap-3 px-4 text-left rounded-2xl min-h-[60px]"
                  style={{
                    background: isSelected ? "#1e2045" : "rgba(255,255,255,0.04)",
                    border: isSelected
                      ? "1.5px solid #34CBBF"
                      : "1.5px solid rgba(255,255,255,0.08)",
                    transition: "all 0.15s ease",
                    opacity: isAdvancing && !isSelected ? 0.5 : 1,
                  }}
                >
                  {opt.emoji && (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{
                        background: isSelected
                          ? "rgba(52,203,191,0.15)"
                          : "rgba(255,255,255,0.06)",
                      }}
                    >
                      {opt.emoji}
                    </div>
                  )}

                  <span
                    className="flex-1 text-[15px] font-medium leading-snug py-4"
                    style={{
                      color: isSelected
                        ? "#ffffff"
                        : "rgba(255,255,255,0.82)",
                    }}
                  >
                    {opt.text}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Continue button — only for open-ended questions */}
      {item.type === "open-ended" && canContinue && (
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
