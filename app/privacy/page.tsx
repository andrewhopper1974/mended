"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPage() {
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
        Privacy Policy
      </h1>

      {/* Content */}
      <div className="space-y-8 max-w-2xl">
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Data We Collect
          </h2>
          <ul className="space-y-2" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            <li>• Email address (for account and communication purposes)</li>
            <li>• Quiz responses and answers (to personalize your program)</li>
            <li>• Payment information (processed securely through Stripe)</li>
            <li>• Account activity and engagement metrics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            How We Use Your Data
          </h2>
          <ul className="space-y-2" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            <li>• To provide and customize your personalized hypnosis program</li>
            <li>• To send email updates, program materials, and support resources</li>
            <li>• To improve our service through usage analytics</li>
            <li>• To process payments and manage your subscription</li>
            <li>• To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Third-Party Services
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            We use the following services to provide our program:
          </p>
          <ul className="space-y-2 mt-2" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            <li>
              <strong>Stripe:</strong> Payment processing (see{" "}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#34CBBF" }}>
                Stripe Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Supabase:</strong> Data storage and management (see{" "}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#34CBBF" }}>
                Supabase Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>MailerLite:</strong> Email communications (see{" "}
              <a href="https://www.mailerlite.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#34CBBF" }}>
                MailerLite Privacy Policy
              </a>
              )
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Email Communications
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            When you sign up, we add your email to our list for program delivery and support communications.
            You can unsubscribe from promotional emails at any time by clicking the unsubscribe link in any email.
            We will never share your email with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Data Security
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            We use industry-standard encryption (SSL/TLS) to protect your data in transit. Payment information
            is processed through Stripe and never stored on our servers. However, no method of transmission over
            the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Your Rights
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            Depending on your location, you may have the right to access, modify, or delete your personal data.
            To exercise these rights, please email support@mended.health. We will respond to requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Changes to This Policy
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            We may update this privacy policy periodically. We will notify you of significant changes via email.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Contact Us
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
            For privacy-related questions, please contact support@mended.health
          </p>
        </section>
      </div>
    </motion.div>
  );
}
