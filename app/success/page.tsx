"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function RedirectHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fire Meta Pixel Purchase event before redirecting
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Purchase");
    }

    const sessionId = searchParams.get("session_id");
    const destination = sessionId
      ? `https://app.mended.health/welcome?session_id=${sessionId}`
      : "https://app.mended.health/welcome";

    // Small delay so the Pixel request has a chance to flush before we navigate away
    const t = setTimeout(() => {
      window.location.href = destination;
    }, 300);
    return () => clearTimeout(t);
  }, [searchParams]);

  return null;
}

export default function SuccessPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col min-h-screen items-center justify-center px-6 text-center"
      style={{ background: "#07001c" }}
    >
      <Suspense fallback={null}>
        <RedirectHandler />
      </Suspense>

      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
        style={{
          background: "linear-gradient(135deg, #8A5EFF 0%, #34CBBF 100%)",
          boxShadow: "0 0 40px rgba(52,203,191,0.4)",
        }}
      >
        <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
          <path
            d="M3 16L14 27L37 3"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="text-4xl font-bold mb-4"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        You&apos;re in.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-base leading-relaxed mb-4"
        style={{ color: "rgba(255,255,255,0.6)", maxWidth: "320px" }}
      >
        Redirecting you to your program...
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-8 flex gap-2 mb-20"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            className="w-2 h-2 rounded-full"
            style={{
              background: "linear-gradient(90deg, #8A5EFF 0%, #34CBBF 100%)",
            }}
          />
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="fixed bottom-0 border-t flex justify-center gap-4 flex-wrap text-center p-6 text-xs"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)",
          background: "#07001c",
          width: "100%",
          maxWidth: "480px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <a href="/terms" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80">
          Terms & Conditions
        </a>
        <span>·</span>
        <a href="/privacy" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80">
          Privacy Policy
        </a>
        <span>·</span>
        <a href="/contact" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80">
          Contact Us
        </a>
        <span>·</span>
        <a href="/refund" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80">
          Refund Policy
        </a>
      </motion.div>
    </motion.div>
  );
}
