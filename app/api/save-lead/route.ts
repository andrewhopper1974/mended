import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { email, answers, profile } = await req.json();

    const { error } = await supabase.from("leads").insert({
      email,
      score: profile,
      source: "quit-alcohol-quiz",
      answers,
    });

    if (error) {
      console.error("[save-lead] Insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[save-lead] Exception:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
