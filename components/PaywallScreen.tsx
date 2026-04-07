"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  anchorPrice: string;
  perDay: string;
  description: string;
  priceId: string;
  badge?: string;
  valueNote?: string;
}

const PLANS: Plan[] = [
  {
    id: "30day",
    name: "4-Week Foundation",
    price: "$49",
    anchorPrice: "$99",
    perDay: "$1.75 / day",
    description: "The 4-week foundation program. One-time payment.",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_30DAY || "price_1TJHvGPFMDEDuyb3WI3dKHVF",
  },
  {
    id: "90day",
    name: "12-Week Complete Program",
    price: "$79",
    anchorPrice: "$129",
    perDay: "Less than $1 / day",
    description: "The full 12-week program: 4-week foundation plus 8 weeks of real-world application and integration. One-time payment.",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_90DAY || "price_1TJHvdPFMDEDuyb3FMVrNxEY",
    badge: "Best Value",
    valueNote: "Save $50 — the full path",
  },
];

// ─── Testimonials ────────────────────────────────────────────────────────────
// TODO (placeholder): replace `photo: null` with real headshot URLs in /public/testimonials/
const TESTIMONIALS = [
  {
    name: "Rachel K., 36",
    tag: "12 weeks sober",
    text: "I'd been white-knuckling it for years. The CBT trigger work showed me I'd been fighting the wrong thing the whole time. Twelve weeks in and 5pm doesn't own me anymore.",
    photo: null as string | null, // TODO: /testimonials/rachel.jpg
    stars: 5,
  },
  {
    name: "Daniel P., 42",
    tag: "3 months sober",
    text: "Urge surfing sounded fluffy until I actually tried it. Sitting with a craving for ninety seconds and watching it pass — that changed everything for me.",
    photo: null as string | null, // TODO: /testimonials/daniel.jpg
    stars: 5,
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ: { q: string; a: string }[] = [
  {
    q: "What if I fail again? I've tried before.",
    a: "Most people who come to Mended have tried to quit multiple times — that's the norm, not the exception. The difference here is that the program isn't based on willpower. CBT and urge-surfing retrain the automatic response at the level of the nervous system, so you're not fighting the urge, you're letting it pass. If it doesn't work for you in 30 days, you get every cent back.",
  },
  {
    q: "Is this right for my level of drinking?",
    a: "The program is designed for people who drink too much and want to stop or significantly reduce — from daily evening wine to weekend binging to anything in between. It's not a medical detox program. If you have severe physical withdrawal (shaking, seizures, hallucinations), please speak with a doctor first.",
  },
  {
    q: "Will I have withdrawal symptoms?",
    a: "Most people experience mild symptoms in the first few days — restlessness, irritability, disturbed sleep. These usually pass within a week. The daily audio practices are specifically designed to help your nervous system settle during this window. If you drink heavily every day, we recommend checking in with a doctor before starting.",
  },
  {
    q: "How is this different from AA or rehab?",
    a: "AA is a peer-support model built around community and the 12 steps. Rehab is inpatient clinical care. Mended is a structured, self-paced program built on two evidence-based techniques — Mindfulness-Based Relapse Prevention (urge surfing) and Stoic cognitive practice (the pause). It's private, you do it from home, and it's designed to build lasting skills rather than lifelong meeting attendance.",
  },
  {
    q: "What do I actually get?",
    a: "Daily lessons, guided audio practices (5–10 min each), a trigger map personalized to your answers, and a written maintenance plan you'll build over the course of the program. Everything is delivered through your private member area — no app download required.",
  },
];

// ─── Persistent countdown: 15-minute timer that doesn't reset on refresh ────
const COUNTDOWN_MS = 15 * 60 * 1000;
const COUNTDOWN_KEY = "paywall_countdown_start";

function useCountdown(email: string) {
  const [now, setNow] = useState(() => Date.now());
  const [start, setStart] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `${COUNTDOWN_KEY}:${email || "anon"}`;
    const stored = localStorage.getItem(key);
    let startTs: number;
    if (stored) {
      startTs = parseInt(stored, 10);
      // If stored timer expired long ago, restart it
      if (Date.now() - startTs > COUNTDOWN_MS) {
        startTs = Date.now();
        localStorage.setItem(key, String(startTs));
      }
    } else {
      startTs = Date.now();
      localStorage.setItem(key, String(startTs));
    }
    setStart(startTs);
  }, [email]);

  useEffect(() => {
    if (start == null) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [start]);

  const elapsed = start == null ? 0 : now - start;
  const remaining = Math.max(0, COUNTDOWN_MS - elapsed);
  const mins = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const secs = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
  return { mins, secs, remaining };
}

export default function PaywallScreen({ profile, email }: Props) {
  const profileData = PROFILES[profile];
  const { mins, secs } = useCountdown(email);
  const [glowing, setGlowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("90day");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const checkoutLockRef = useRef(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitShown, setExitShown] = useState(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const resetInactivity = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    setGlowing(false);
    inactivityTimer.current = setTimeout(() => setGlowing(true), 8000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
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

  // ─── Exit-intent: cursor leaves viewport top ─────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (exitShown) return;

    const trigger = () => {
      if (exitShown) return;
      setShowExitIntent(true);
      setExitShown(true);
    };

    // Desktop: mouseleave on document only fires when the cursor leaves the
    // viewport entirely (not when moving between child elements).
    const onMouseLeave = (e: MouseEvent) => {
      // Top of the viewport — they're heading for the address bar / tabs
      if (e.clientY <= 5) trigger();
    };

    // Mobile: pull-down past scroll-zero (rubber-band) OR back-button
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      if (window.scrollY <= 0 && y - startY > 100) trigger();
    };
    const onPopState = () => trigger();

    // Tab-switch / window-blur — common abandon signal
    const onVisibility = () => {
      if (document.visibilityState === "hidden") trigger();
    };

    // Time-on-paywall trigger — fires 10s after the paywall mounts, giving
    // users enough time to read the pricing before the discount popup lands.
    const dwellTimer: NodeJS.Timeout = setTimeout(trigger, 10000);

    // Idle fallback — 25s of zero interaction is also a strong abandon signal
    let idleTimer: NodeJS.Timeout = setTimeout(trigger, 25000);
    const resetIdle = () => {
      clearTimeout(idleTimer);
      if (!exitShown) idleTimer = setTimeout(trigger, 25000);
    };
    const idleEvents = ["mousemove", "scroll", "keydown", "touchstart", "click"];
    idleEvents.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("popstate", onPopState);
    document.addEventListener("visibilitychange", onVisibility);
    // Push a history state so back-button triggers our popstate handler first
    try { window.history.pushState({ paywall: true }, ""); } catch {}

    return () => {
      clearTimeout(dwellTimer);
      clearTimeout(idleTimer);
      idleEvents.forEach((e) => window.removeEventListener(e, resetIdle));
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [exitShown]);

  const handleCheckout = async (planOverride?: string, promo?: string) => {
    // Synchronous lock — prevents a double-click from firing two Stripe
    // checkout sessions. React state updates are async (a fast double-click
    // can slip in before `disabled={loading}` re-renders); a ref updates
    // immediately so the second call returns instantly.
    if (checkoutLockRef.current) return;
    checkoutLockRef.current = true;

    vibrate([60, 20, 60]);
    setLoading(true);
    setCheckoutError("");
    try {
      const planId = planOverride || selectedPlan;
      const selectedPlanObj = PLANS.find((p) => p.id === planId);
      const priceId = selectedPlanObj?.priceId || "";

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, profile, priceId, plan: planId, promo }),
      });
      const data = await res.json();
      if (data.url) {
        // Redirecting away — leave the lock engaged so the user can't
        // re-trigger checkout mid-navigation.
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        checkoutLockRef.current = false;
      }
    } catch (err: any) {
      setCheckoutError(err?.message || "Network error. Please try again.");
      setLoading(false);
      checkoutLockRef.current = false;
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
            Your price is held for
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
        Recovery Program Is Ready
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
                marginTop: plan.badge ? 14 : 0,
              }}
            >
              {plan.badge && (
                <div
                  className="absolute text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap"
                  style={{
                    top: -11,
                    left: 16,
                    background: "linear-gradient(90deg, #8A5EFF 0%, #34CBBF 100%)",
                    color: "#0a051e",
                    boxShadow: "0 4px 14px rgba(52,203,191,0.35)",
                    letterSpacing: "0.06em",
                  }}
                >
                  ★ {plan.badge}
                </div>
              )}
              <div className="flex items-start justify-between mb-1.5">
                <h4
                  className="text-base font-bold"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {plan.name}
                </h4>
                <div className="flex items-baseline gap-2 ml-3 flex-shrink-0">
                  <span
                    className="text-sm line-through"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {plan.anchorPrice}
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{
                      background: "linear-gradient(90deg, #8A5EFF, #34CBBF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {plan.price}
                  </span>
                </div>
              </div>
              <p className="text-[11px] font-semibold mb-1.5" style={{ color: "rgba(52,203,191,0.8)" }}>
                {plan.perDay}
              </p>
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
            "Guided CBT and mindfulness sessions that defuse cravings as they arise",
            "Your personalized trigger map and urge-surfing toolkit",
            "Step-by-step plan built around your specific answers",
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
        onClick={() => handleCheckout()}
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
          ? "Start the 4-week program →"
          : "Start the 12-week program →"}
      </button>

      {checkoutError && (
        <p className="text-center text-sm mb-3" style={{ color: "#ff6b6b" }}>
          {checkoutError}
        </p>
      )}

      <p
        className="text-center text-xs mb-4"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        🔒 Secure checkout · 30-day money-back guarantee
      </p>

      {/* ─── Payment method logos ─────────────────────────────────────────── */}
      {/* TODO: Replace these text logos with real SVG assets in /public/payments/ */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {["VISA", "MasterCard", "AMEX", "Apple Pay", "Google Pay", "Link"].map((p) => (
          <div
            key={p}
            className="text-[10px] font-bold px-2.5 py-1.5 rounded-md"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.04em",
            }}
          >
            {p}
          </div>
        ))}
      </div>

      {/* ─── Big money-back guarantee badge ───────────────────────────────── */}
      <div
        className="rounded-2xl p-5 mb-8 flex items-start gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(52,203,191,0.12), rgba(138,94,255,0.08))",
          border: "1.5px solid rgba(52,203,191,0.35)",
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-2xl"
          style={{
            background: "linear-gradient(135deg, #34CBBF, #8A5EFF)",
            boxShadow: "0 0 16px rgba(52,203,191,0.4)",
          }}
        >
          ↩️
        </div>
        <div>
          <p className="text-sm font-bold text-white mb-1">
            30-day money-back guarantee
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Try the program for 30 days. If it isn&rsquo;t working for you,
            click one button in your account and we&rsquo;ll refund every cent —
            no questions, no hoops.
          </p>
        </div>
      </div>

      {/* ─── Evidence-based credibility ──────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 mb-8"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p
          className="text-xs uppercase tracking-wider mb-3 font-semibold"
          style={{ color: "rgba(196,175,255,0.65)", letterSpacing: "0.08em" }}
        >
          Built on evidence-based methods
        </p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.78)" }}>
          Mended is grounded in <strong>Mindfulness-Based Relapse Prevention</strong>{" "}
          (Bowen, Chawla &amp; Marlatt) and Stoic cognitive practice. Both are
          peer-reviewed, evidence-supported approaches to substance use.
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          A self-paced education program — not medical treatment.
        </p>
      </div>
      {/* Testimonials */}
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        WHAT PEOPLE ARE SAYING
      </h3>

      <div className="space-y-3 mb-8">
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
            <div className="flex items-center gap-3 mb-2">
              {/* TODO: Replace this initial-circle with real <img src={t.photo} ... /> */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                style={{
                  background: t.photo
                    ? `url(${t.photo}) center/cover`
                    : "linear-gradient(135deg, #8A5EFF, #34CBBF)",
                  color: "#07001c",
                }}
              >
                {!t.photo && t.name[0]}
              </div>
              <div className="flex-1">
                <span
                  className="text-sm font-semibold block"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {t.name}
                </span>
                <span className="text-yellow-400 text-xs">
                  {"★".repeat(t.stars)}
                </span>
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-1 rounded-full"
                style={{
                  background: "rgba(52,203,191,0.12)",
                  color: "#34CBBF",
                  border: "1px solid rgba(52,203,191,0.25)",
                }}
              >
                {t.tag}
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

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        FREQUENTLY ASKED
      </h3>
      <div className="space-y-2 mb-8">
        {FAQ.map((item, i) => {
          const open = expandedFaq === i;
          return (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <button
                onClick={() => {
                  vibrate(15);
                  setExpandedFaq(open ? null : i);
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <span className="text-sm font-medium text-white leading-snug">
                  {item.q}
                </span>
                <span
                  className="text-lg flex-shrink-0 transition-transform"
                  style={{
                    color: "#34CBBF",
                    transform: open ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="px-4 pb-4 text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Final CTA */}
      <button
        onClick={() => handleCheckout()}
        disabled={loading}
        className="btn-cta w-full py-4 text-base font-semibold mb-3"
        style={{ borderRadius: "14px", opacity: loading ? 0.75 : 1 }}
      >
        {loading
          ? "Redirecting..."
          : selectedPlan === "30day"
          ? "Start the 4-week program →"
          : "Start the 12-week program →"}
      </button>

      {/* Medical disclaimer */}
      <p
        className="text-center text-[11px] leading-relaxed mt-6 mb-4 px-2"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        Mended is a self-paced educational program, not a substitute for medical
        or psychological treatment. If you experience severe withdrawal symptoms,
        contact a doctor immediately.
      </p>

      {/* Footer */}
      <div
        className="border-t flex justify-center gap-4 flex-wrap text-center pt-6 mt-2 text-xs"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        <a href="/terms" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80">
          Terms &amp; Conditions
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

      {/* ─── Exit-intent modal — triggers Stripe promo via env-managed code ── */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowExitIntent(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 relative"
              style={{
                background: "linear-gradient(155deg, #1a1042 0%, #0a0520 100%)",
                border: "1.5px solid rgba(138,94,255,0.4)",
                boxShadow: "0 20px 60px rgba(138,94,255,0.25)",
              }}
            >
              <button
                onClick={() => setShowExitIntent(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                ×
              </button>

              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{
                  background: "linear-gradient(90deg, #8A5EFF, #34CBBF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.08em",
                }}
              >
                Wait — one thing
              </p>
              <h3
                className="text-xl font-bold mb-3 leading-tight text-white"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Take $10 off if you start today
              </h3>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                We don&rsquo;t want price to be the reason you don&rsquo;t start.
                Use this one-time offer on the 12-week complete program.
              </p>

              <div
                className="rounded-xl px-4 py-3 mb-5 flex items-center justify-between"
                style={{
                  background: "rgba(52,203,191,0.1)",
                  border: "1px solid rgba(52,203,191,0.3)",
                }}
              >
                <div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                    12-Week Complete Program
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm line-through" style={{ color: "rgba(255,255,255,0.35)" }}>
                      $79
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{
                        background: "linear-gradient(90deg, #8A5EFF, #34CBBF)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      $69
                    </span>
                  </div>
                </div>
                <div
                  className="text-[10px] font-bold uppercase px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(52,203,191,0.2)",
                    color: "#34CBBF",
                    letterSpacing: "0.08em",
                  }}
                >
                  Save $10
                </div>
              </div>

              <button
                onClick={() => {
                  setShowExitIntent(false);
                  setSelectedPlan("90day");
                  // Stripe auto-applies the $10-off promotion code
                  // (configured via STRIPE_PROMO_ID_EXIT_INTENT env var)
                  handleCheckout("90day", "exit_intent");
                }}
                className="btn-cta w-full py-3.5 text-base font-semibold mb-2"
                style={{ borderRadius: "14px" }}
              >
                Claim my $10 off →
              </button>
              <button
                onClick={() => setShowExitIntent(false)}
                className="w-full text-center text-xs py-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                No thanks, I&rsquo;ll pass
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
