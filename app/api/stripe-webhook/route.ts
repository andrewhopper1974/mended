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

  let event: Stripe.Event;

  if (webhookSecret) {
    // Production: verify Stripe signature
    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    // Dev/test: no webhook secret configured — parse body directly
    // WARNING: only acceptable for local testing; always set STRIPE_WEBHOOK_SECRET in production
    console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification (dev mode)");
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const { error } = await supabase.from("purchases").insert({
      email: session.customer_email || session.metadata?.email || "",
      stripe_customer_id: session.customer as string,
      stripe_session_id: session.id,
      status: "completed",
      profile: session.metadata?.profile || "",
      plan_type: session.metadata?.plan || "",
    });

    if (error) {
      console.error("Supabase purchases insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Purchase saved for:", session.customer_email || session.metadata?.email);
  }

  return NextResponse.json({ received: true });
}
