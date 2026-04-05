"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && message) {
      setSubmitted(true);
      // Fire-and-forget, no backend processing
      setTimeout(() => {
        setEmail("");
        setMessage("");
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col min-h-screen px-5 pt-10 pb-20"
      style={{ background: "#07001c" }}
    >
      {/* Back button */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm font-medium mb-8 w-fit"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </Link>

      {/* Title */}
      <h1
        className="text-3xl font-bold mb-3 leading-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        Contact Us
      </h1>

      <p className="mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
        Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you as soon as possible.
      </p>

      {/* Form or success message */}
      <div className="max-w-md w-full">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 text-center"
            style={{
              background: "rgba(52,203,191,0.1)",
              border: "1px solid rgba(52,203,191,0.3)",
            }}
          >
            <p className="text-lg font-semibold mb-2" style={{ color: "#34CBBF" }}>
              ✓ Message sent!
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)" }}>
              Thanks for reaching out. We'll respond within 24 hours.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-xl outline-none text-base"
                style={{
                  background: "#1a1535",
                  border: "1.5px solid #2d2850",
                  color: "#ffffff",
                  fontSize: "16px",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl outline-none text-base"
                style={{
                  background: "#1a1535",
                  border: "1.5px solid #2d2850",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  resize: "none",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-cta w-full py-4 text-base font-semibold"
              style={{ borderRadius: "14px" }}
            >
              Send Message
            </button>
          </form>
        )}
      </div>

      {/* Support email */}
      <div className="mt-12 max-w-md">
        <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
          Or email us directly:
        </p>
        <a
          href="mailto:support@mended.health"
          className="text-base font-semibold"
          style={{ color: "#34CBBF" }}
        >
          support@mended.health
        </a>
      </div>
    </motion.div>
  );
}
