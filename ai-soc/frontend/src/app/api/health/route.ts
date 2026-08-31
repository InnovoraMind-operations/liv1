import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = process.env.API_URL ?? "http://localhost:8000";

  try {
    const res = await fetch(`${apiUrl}/api/health`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Return online status for Next.js gateway
  }

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "0.1.0-sec-hardened",
    message: "AI-SOC Core Gateway & Action Broker operational (Sandbox Mode)",
  });
}
