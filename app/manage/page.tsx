"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ManagePage() {
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
        Manage Your Subscription
      </h1>

      {/* Content */}
      <div className="space-y-8 max-w-2xl">
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#ffffff" }}>
            Change Your Plan
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            Want to upgrade to a higher tier or downgrade to save money? You can change your plan at any time.
            The new price will be applied to your next billing cycle, and we'll handle any adjustments to your
            current payment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#ffffff" }}>
            Pause Your Subscription
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            If you need a break from the program, you can pause your subscription for up to 3 months without
            losing access to your materials. You'll be able to resume whenever you're ready.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#ffffff" }}>
            Cancel Your Subscription
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            If you decide the program isn't for you, you can cancel anytime. You'll retain access through the
            end of your current billing period, and you won't be charged again. If you cancel within 30 days,
            you're still eligible for a full refund.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#ffffff" }}>
            How to Make Changes
          </h2>
          <div className="bg-opacity-10 rounded-2xl p-6 mb-4" style={{ background: "rgba(138,94,255,0.1)" }}>
            <p className="font-semibold mb-3" style={{ color: "#c4afff" }}>
              Email our support team:
            </p>
            <a
              href="mailto:support@quitwithhypnosis.com"
              className="text-lg font-bold"
              style={{ color: "#34CBBF" }}
            >
              support@quitwithhypnosis.com
            </a>
            <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.6)" }}>
              Include your email address and let us know what change you'd like to make (change plan, pause,
              or cancel). We'll process your request within 24 hours.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#ffffff" }}>
            Billing Questions
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            If you have questions about your billing, charges, or payment method, our support team is here to help.
            We typically respond to emails within 24 hours.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "#ffffff" }}>
            Still Have Questions?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            Check out our{" "}
            <Link href="/terms" style={{ color: "#34CBBF" }}>
              Terms & Conditions
            </Link>
            {" "}or{" "}
            <Link href="/refund" style={{ color: "#34CBBF" }}>
              Refund Policy
            </Link>
            {" "}for more details. You can also{" "}
            <Link href="/contact" style={{ color: "#34CBBF" }}>
              contact us
            </Link>
            {" "}anytime.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
