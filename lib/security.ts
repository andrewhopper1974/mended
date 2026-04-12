// ─────────────────────────────────────────────────────────────────────────────
// Security helpers used by every API route. Single file so the audit surface
// stays small. Includes:
//   • Strict email validation (RFC-ish, length-bounded)
//   • Profile enum validation
//   • Quiz answers shape + size validation
//   • In-memory IP rate limiter (no Redis required)
//   • Hard service-role Supabase client (refuses to fall back to anon)
//   • Production-safe logger that strips PII
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── Validators ─────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAIL_LEN = 254; // RFC 5321

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string"
    && value.length > 0
    && value.length <= MAX_EMAIL_LEN
    && EMAIL_RE.test(value);
}

export const VALID_PROFILES = [
  "stress-escapist",
  "habitual-drinker",
  "social-chameleon",
] as const;
export type ValidProfile = (typeof VALID_PROFILES)[number];

export function isValidProfile(value: unknown): value is ValidProfile {
  return typeof value === "string" && (VALID_PROFILES as readonly string[]).includes(value);
}

const MAX_ANSWERS_BYTES = 10_000;
export function isValidAnswers(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  try {
    const json = JSON.stringify(value);
    if (json.length > MAX_ANSWERS_BYTES) return false;
  } catch {
    return false;
  }
  return true;
}

// ─── Rate limiter (in-memory, per-IP, sliding window) ───────────────────────
//
// Lives in module scope. Resets on cold start, which is fine for serverless —
// the worst case is an attacker gets one extra burst per cold start. For real
// scale move to Upstash later. Keys: `${routeId}:${ip}`.

interface Bucket {
  hits: number[];
  blockedUntil?: number;
}
const buckets = new Map<string, Bucket>();

export interface RateLimitOpts {
  /** Unique route id (e.g. "save-lead") */
  routeId: string;
  /** Max requests per window */
  max: number;
  /** Window length in ms */
  windowMs: number;
  /** Optional block duration after exceed; defaults to windowMs */
  blockMs?: number;
}

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function rateLimit(req: NextRequest, opts: RateLimitOpts): NextResponse | null {
  const ip = getClientIp(req);
  const key = `${opts.routeId}:${ip}`;
  const now = Date.now();
  let b = buckets.get(key);
  if (!b) {
    b = { hits: [] };
    buckets.set(key, b);
  }

  if (b.blockedUntil && now < b.blockedUntil) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((b.blockedUntil - now) / 1000)) } }
    );
  }

  // Prune old hits
  b.hits = b.hits.filter((t) => now - t < opts.windowMs);
  if (b.hits.length >= opts.max) {
    b.blockedUntil = now + (opts.blockMs ?? opts.windowMs);
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((opts.blockMs ?? opts.windowMs) / 1000)) } }
    );
  }
  b.hits.push(now);

  // Opportunistic GC — keep the map from growing forever
  if (buckets.size > 5000) {
    for (const [k, v] of Array.from(buckets)) {
      if (v.hits.length === 0 && (!v.blockedUntil || v.blockedUntil < now)) buckets.delete(k);
    }
  }
  return null;
}

// ─── Supabase service-role client (hard requirement) ───────────────────────
//
// Used by every API route that writes. Refuses to fall back to the anon key —
// silent fallback was the previous footgun. If service role isn't set we fail
// closed in production and log a clear error in development.
export function getServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set — refusing to use anon key for server writes");
  return createClient(url, key, { auth: { persistSession: false } });
}

// ─── PII-safe logger ───────────────────────────────────────────────────────
//
// Use this instead of console.error for anything that may contain user data.
// In production, emails are hashed to a short tag (`a1b2…@…`) and full bodies
// are dropped. In development, full content is logged.

export function maskEmail(value: unknown): string {
  if (typeof value !== "string") return "<not-email>";
  const m = value.match(/^([^@]+)@(.+)$/);
  if (!m) return "<invalid>";
  const local = m[1]!;
  const domain = m[2]!;
  const head = local.slice(0, 2);
  return `${head}${"•".repeat(Math.max(0, local.length - 2))}@${domain}`;
}

const isProd = () => process.env.NODE_ENV === "production";

export function logSafe(tag: string, payload?: Record<string, unknown>) {
  if (!payload) return console.log(`[${tag}]`);
  if (!isProd()) return console.log(`[${tag}]`, payload);
  // Production: only log keys + masked email if present
  const safe: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (k === "email") safe[k] = maskEmail(v);
    else if (k === "error" || k === "code" || k === "status" || k === "type") safe[k] = v;
    // Drop everything else by default — logging surface stays small
  }
  console.log(`[${tag}]`, safe);
}

export function logError(tag: string, err: unknown, extra?: Record<string, unknown>) {
  const message = err instanceof Error ? err.message : String(err);
  logSafe(tag, { error: message, ...(extra || {}) });
}

// ─── Honeypot helper ────────────────────────────────────────────────────────
//
// EmailScreen renders a hidden `website` input. Bots fill it; humans don't.
// Routes call this to reject submissions where it's non-empty.
export function isBotHoneypot(body: Record<string, unknown>): boolean {
  const v = body["website"];
  return typeof v === "string" && v.length > 0;
}
