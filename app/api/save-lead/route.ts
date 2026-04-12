import { NextResponse } from "next/server";

// Shutdown: no longer accepting leads
export async function POST() {
  return NextResponse.json(
    { error: "Mended is no longer accepting new signups." },
    { status: 410 }
  );
}
