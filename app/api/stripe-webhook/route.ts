import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Fail closed: refuse to process webhooks in production without a secret.
  // The only exception is local development (NODE_ENV !== "production"),
  // where we allow parsing the body directly so you can test with the
  // Stripe CLI or curl. In production, a missing secret is a hard error.
  const isProd = process.env.NODE_ENV === "production";
  let event: Stripe.Event;

  if (webhookSecret) {
    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else if (!isProd) {
    // Local dev only — no secret set, parse body directly
    console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification (dev mode)");
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
  } else {
    // Production without a webhook secret — refuse to process anything
    console.error("STRIPE_WEBHOOK_SECRET is not set in production — rejecting webhook");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Normalize program length from metadata. Prefer the explicit
    // program_length integer string; fall back to parsing the legacy
    // "plan" string ("30day" / "90day") for older sessions.
    const rawProgramLength = session.metadata?.program_length;
    const rawPlan = session.metadata?.plan || "";
    let programLength: number | null = null;
    if (rawProgramLength && /^\d+$/.test(rawProgramLength)) {
      programLength = parseInt(rawProgramLength, 10);
    } else if (rawPlan.includes("90")) {
      programLength = 90;
    } else if (rawPlan.includes("30")) {
      programLength = 30;
    }

    const { error } = await supabase.from("purchases").insert({
      email: session.customer_email || session.metadata?.email || "",
      stripe_customer_id: session.customer as string,
      stripe_session_id: session.id,
      status: "completed",
      profile: session.metadata?.profile || "",
      plan_type: rawPlan,
      program_length: programLength,
    });

    if (error) {
      console.error("Supabase purchases insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Purchase saved for:", session.customer_email || session.metadata?.email);
  }

  return NextResponse.json({ received: true });
}
