"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function RefundPage() {
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
        className="text-3xl font-bold mb-6 leading-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        30-Day Money-Back Guarantee
      </h1>

      {/* Content */}
      <div className="space-y-8 max-w-2xl">
        <section>
          <div
            className="rounded-2xl p-6 mb-8"
            style={{
              background: "rgba(52,203,191,0.1)",
              border: "1px solid rgba(52,203,191,0.3)",
            }}
          >
            <p className="text-lg font-semibold" style={{ color: "#34CBBF" }}>
              We're confident you'll see results. If you don't, we'll refund 100% of your money.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            How the Guarantee Works
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            You have 30 days from your purchase date to try the full Mended Hypnosis Program.
            Complete at least the first hypnosis session and work through the program materials. If you
            don't feel it's working for you, simply request a refund within 30 days of purchase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            How to Request a Refund
          </h2>
          <ol className="space-y-3" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            <li>
              <strong>1. Email Support</strong>
              <p className="mt-1">
                Send an email to support@quitwithhypnosis.com with your request. Include your email address and
                the email address you used to make the purchase.
              </p>
            </li>
            <li>
              <strong>2. Confirmation</strong>
              <p className="mt-1">
                We'll confirm your refund request and verify your eligibility (within the 30-day window
                and having accessed the program).
              </p>
            </li>
            <li>
              <strong>3. Processing</strong>
              <p className="mt-1">
                Once approved, your refund will be processed back to your original payment method within
                5 business days.
              </p>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            What This Guarantee Covers
          </h2>
          <ul className="space-y-2" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            <li>✓ All hypnosis session audio files</li>
            <li>✓ Your personalized trigger map and protocol</li>
            <li>✓ 30-day step-by-step recovery plan</li>
            <li>✓ Email support and resources</li>
            <li>✓ Full refund of your subscription fee</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Refund Eligibility
          </h2>
          <ul className="space-y-2" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            <li>• Request must be made within 30 days of purchase</li>
            <li>• You must have accessed the program at least once</li>
            <li>• The request must be submitted by the original account holder</li>
            <li>• Refunds are processed to the original payment method</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Our Commitment
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            This guarantee reflects our confidence in the program's effectiveness and our commitment to
            your satisfaction. We believe hypnosis-based recovery works, and we're willing to back that
            belief with your money. No questions asked if you decide it's not right for you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Questions?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            Contact us at{" "}
            <a href="mailto:support@quitwithhypnosis.com" style={{ color: "#34CBBF" }}>
              support@quitwithhypnosis.com
            </a>
            {" "}and we'll be happy to answer any questions about this guarantee.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
