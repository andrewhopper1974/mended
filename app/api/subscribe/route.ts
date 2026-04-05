import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const res = await fetch(
      `https://api.mailerlite.com/api/v2/groups/${process.env.MAILERLITE_GROUP_ID}/subscribers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-MailerLite-ApiKey": process.env.MAILERLITE_API_KEY!,
        },
        body: JSON.stringify({ email, resubscribe: true }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("MailerLite error:", text);
      return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
