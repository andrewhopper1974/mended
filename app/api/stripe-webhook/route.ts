import { NextResponse } from "next/server";

// Shutdown: webhook disabled
export async function POST() {
  return NextResponse.json(
    { error: "Mended is no longer active." },
    { status: 410 }
  );
}
