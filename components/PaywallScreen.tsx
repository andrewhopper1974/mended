"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PROFILES, type Profile, vibrate } from "@/lib/quizData";
import MendedLogo from "@/components/MendedLogo";

interface Props {
  profile: Profile;
  email: string;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  priceId: string;
  badge?: string;
  valueNote?: string;
}

const PLANS: Plan[] = [
  {
    id: "30day",
    name: "30-Day Program",
    price: "$49",
    description: "The full 30-day program. One-time payment.",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_30DAY || "price_1TJHvGPFMDEDuyb3WI3dKHVF",
  },
  {
    id: "90day",
    name: "90-Day Program",
    price: "$79",
    description: "30-day foundation plus 60 days of application and integration. One-time payment.",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_90DAY || "price_1TJHvdPFMDEDuyb3FMVrNxEY",
    badge: "Best Value",
    valueNote: "Save $68 — less than $1/day",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    text: "I'd tried AA, medication, and sheer willpower. Nothing worked until this. By session 3 I stopped wanting a drink at 5pm. It's been 4 months.",
    stars: 5,
  },
  {
    name: "James T.",
    text: "I was drinking a bottle of wine every night. I did the first session completely skeptical. Woke up the next morning and just didn't want it. Still don't.",
    stars: 5,
  },
];

function useCountdown(initialSeconds: number, key: string) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const resetRef = useRef(key);

  useEffect(() => {
    // Reset if key changes (user navigated back and returned)
    if (resetRef.current !== key) {
      resetRef.current = key;
      setTimeLeft(initialSeconds);
    }
  }, [key, initialSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  return { mins, secs };
}

export default function PaywallScreen({ profile, email }: Props) {
  const profileData = PROFILES[profile];
  const { mins, secs } = useCountdown(14 * 60 + 59, `${profile}-${email}`);
  const [glowing, setGlowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("90day");
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // Start glow after 8s inactivity
  const resetInactivity = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    setGlowing(false);
    inactivityTimer.current = setTimeout(() => setGlowing(true), 8000);
  };

  useEffect(() => {
    vibrate([20, 15, 40, 15, 80]);
    resetInactivity();
    const events = ["touchstart", "mousemove", "scroll", "keydown"];
    const handler = () => resetInactivity();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = async () => {
    vibrate([60, 20, 60]);
    setLoading(true);
    setCheckoutError("");
    try {
      const selectedPlanObj = PLANS.find((p) => p.id === selectedPlan);
      const priceId = selectedPlanObj?.priceId || "";

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, profile, priceId, plan: selectedPlan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      setCheckoutError(err?.message || "Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col min-h-screen px-5 pt-10 pb-12"
      style={{ background: "#07001c" }}
    >
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <MendedLogo size="md" />
      </div>

      {/* Urgency timer */}
      <div
        className="rounded-xl px-4 py-3 mb-6 flex items-center justify-between"
        style={{
          background: "rgba(255,77,77,0.1)",
          border: "1px solid rgba(255,77,77,0.25)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">⏱</span>
          <span className="text-sm font-medium" style={{ color: "#ff9090" }}>
            Offer expires in
          </span>
        </div>
        <span
          className="text-lg font-bold countdown"
          style={{ color: "#ff6b6b" }}
        >
          {mins}:{secs}
        </span>
      </div>

      {/* Headline */}
      <h1
        className="text-2xl font-bold mb-2 leading-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {profileData.name}
        <br />
        Hypnosis Program Is Ready
      </h1>

      <p
        className="text-sm mb-6 leading-relaxed"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        Designed specifically for how your mind uses alcohol — not a generic
        quit plan.
      </p>

      {/* Pricing plans */}
      <div className="mb-6">
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          CHOOSE YOUR PLAN
        </h3>
        <div className="space-y-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => { vibrate(30); setSelectedPlan(plan.id); }}
              className="relative w-full text-left rounded-2xl p-4 transition-all"
              style={{
                background:
                  selectedPlan === plan.id
                    ? "linear-gradient(135deg, #1e2045 0%, #16142e 100%)"
                    : "linear-gradient(135deg, #1a1535 0%, #0f0a2e 100%)",
                border:
                  selectedPlan === plan.id
                    ? "2px solid #34CBBF"
                    : "1px solid rgba(138,94,255,0.3)",
              }}
            >
              {plan.badge && (
                <div
                  className="absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(52,203,191,0.2)",
                    border: "1px solid rgba(52,203,191,0.4)",
                    color: "#34CBBF",
                  }}
                >
                  {plan.badge}
                </div>
              )}
              <div className="flex items-start justify-between mb-1.5">
                <h4
                  className="text-base font-bold"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {plan.name}
                </h4>
                <span
                  className="text-xl font-bold ml-3 flex-shrink-0"
                  style={{
                    background: "linear-gradient(90deg, #8A5EFF, #34CBBF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {plan.price}
                </span>
              </div>
              <p className="text-xs leading-snug mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
                {plan.description}
              </p>
              {plan.valueNote && (
                <div
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg mb-2"
                  style={{
                    background: "rgba(52,203,191,0.15)",
                    border: "1px solid rgba(52,203,191,0.35)",
                    color: "#34CBBF",
                  }}
                >
                  🎯 {plan.valueNote}
                </div>
              )}
              {selectedPlan === plan.id && (
                <div
                  className="text-xs font-semibold"
                  style={{ color: "#34CBBF" }}
                >
                  ✓ Selected
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: "rgba(138,94,255,0.08)",
          border: "1px solid rgba(138,94,255,0.2)",
        }}
      >
        <p
          className="text-xs font-semibold mb-3"
          style={{ color: "rgba(196,175,255,0.7)" }}
        >
          YOUR PROGRAM INCLUDES
        </p>
        <div className="space-y-2.5">
          {[
            "Guided hypnosis sessions that eliminate cravings at the subconscious level",
            "Your personalized trigger map and subconscious reprogramming protocol",
            "30-day step-by-step plan built around your specific answers",
          ].map((b, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-xs flex-shrink-0" style={{ color: "#34CBBF" }}>
                ✓
              </span>
              <p className="text-xs leading-snug" style={{ color: "rgba(255,255,255,0.7)" }}>
                {b}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`btn-cta w-full py-4 text-base font-semibold mb-3 ${
          glowing ? "paywall-glow" : ""
        }`}
        style={{
          borderRadius: "14px",
          opacity: loading ? 0.75 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {loading
          ? "Redirecting..."
          : selectedPlan === "30day"
          ? "Start the 30-day program →"
          : "Start the 90-day program →"}
      </button>

      {checkoutError && (
        <p className="text-center text-sm mb-3" style={{ color: "#ff6b6b" }}>
          {checkoutError}
        </p>
      )}

      <p
        className="text-center text-xs mb-8"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        🔒 Secure checkout · 30-day money-back guarantee
      </p>

      {/* Testimonials */}
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        WHAT PEOPLE ARE SAYING
      </h3>

      <div className="space-y-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
            className="p-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 text-sm">
                {"★".repeat(t.stars)}
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {t.name}
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              &ldquo;{t.text}&rdquo;
            </p>
          </motion.div>
        ))}
      </div>

      {/* Trust row */}
      <div className="flex items-center justify-center gap-5 mt-8 mb-8">
        {[
          { icon: "🔒", label: "SSL Secure" },
          { icon: "↩️", label: "30-day refund" },
          { icon: "⭐", label: "94K+ users" },
        ].map((t) => (
          <div
            key={t.label}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-lg">{t.icon}</span>
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {t.label}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="border-t flex justify-center gap-4 flex-wrap text-center pt-6 text-xs"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)",
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
        <a href="/manage" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80">
          Manage Subscription
        </a>
        <span>·</span>
        <a href="/refund" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80">
          Refund Policy
        </a>
      </div>
    </motion.div>
  );
}
