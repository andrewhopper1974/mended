"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
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
        Terms & Conditions
      </h1>

      {/* Content */}
      <div className="space-y-8 max-w-2xl">
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Service Description
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            The Mended Program is a digital subscription service providing guided sessions
            grounded in Cognitive Behavioral Therapy (CBT), Mindfulness-Based Relapse Prevention
            (MBRP), and Stoic practice, along with personalized assessment tools and step-by-step
            recovery protocols designed to help users reduce or eliminate alcohol consumption.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Subscription Terms
          </h2>
          <ul className="space-y-2" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            <li>• Subscriptions renew automatically on a weekly, monthly, or quarterly basis</li>
            <li>• You can cancel your subscription at any time by emailing support@mended.health</li>
            <li>• Billing occurs on the date of purchase each renewal period</li>
            <li>• All prices are in USD and subject to applicable taxes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            30-Day Money-Back Guarantee
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            If you are not satisfied with your purchase within 30 days, you are eligible for a full refund.
            Simply email support@mended.health with your request, and we will process your refund within 5 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Limitation of Liability
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            This program is not a substitute for professional medical treatment, therapy, or addiction counseling.
            While designed to support recovery, individual results vary. Users should consult with healthcare providers
            for medical or psychiatric concerns. We are not liable for any indirect or consequential damages related to
            use of this service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            User Responsibilities
          </h2>
          <ul className="space-y-2" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            <li>• You agree to use this service only for your personal, non-commercial benefit</li>
            <li>• You are responsible for maintaining the confidentiality of your account</li>
            <li>• You agree not to share your account access with others</li>
            <li>• You will not reverse-engineer, copy, or redistribute program content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Changes to Terms
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            We reserve the right to update these terms at any time. Continued use of the service following changes
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Contact
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            For questions about these terms, please contact us at support@mended.health
          </p>
        </section>
      </div>
    </motion.div>
  );
}
