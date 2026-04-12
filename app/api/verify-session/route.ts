import { NextResponse } from "next/server";

// Shutdown: session verification disabled
export async function GET() {
  return NextResponse.json(
    { paid: false, error: "Mended is no longer active." },
    { status: 410 }
  );
}
