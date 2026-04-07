import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });
  try {
    const { email, profile, priceId, plan, promo } = await req.json();

    // Normalize plan id ("30day" / "90day") into an explicit integer program
    // length so every downstream system (webhook, verify-purchase, profile
    // write, dashboard) can rely on a single, unambiguous value.
    const programLength = plan === "90day" ? 90 : plan === "30day" ? 30 : 0;

    // Map promo flags to Stripe promotion code IDs (managed in Stripe dashboard,
    // injected via env so we can change discount amounts without redeploying).
    const promoIds: Record<string, string | undefined> = {
      exit_intent: process.env.STRIPE_PROMO_ID_EXIT_INTENT,
    };
    const promoId = promo ? promoIds[promo] : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      line_items: [
        {
          price: priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_90DAY!,
          quantity: 1,
        },
      ],
      ...(promoId && {
        discounts: [{ promotion_code: promoId }],
      }),
      success_url: `https://app.mended.health/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/?paywall=true&profile=${encodeURIComponent(profile || "")}&email=${encodeURIComponent(email || "")}&plan=${encodeURIComponent(plan || "")}`,
      metadata: {
        profile: profile || "",
        email: email || "",
        plan: plan || "",
        program_length: programLength ? String(programLength) : "",
        promo: promo || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err?.message, err?.type, err?.code);
    return NextResponse.json(
      { error: err?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
