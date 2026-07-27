// ---------------------------------------------------------------------------
// AI-SOC API Client
//
// Uses relative /api/* paths so that:
//   - In the browser: requests hit Next.js proxy → FastAPI (no CORS issues)
//   - In server components: uses the absolute NEXT_PUBLIC_API_URL env var
//     (falls back to http://localhost:8000 for local dev)
// ---------------------------------------------------------------------------

import type { AlertsResponse, HealthResponse } from "@/types";

// Server-side needs the full URL; client-side uses relative path via proxy.
const getBase = () =>
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
    : "";

/**
 * Fetch the backend health status.
 * Used by the Header Status Bar component (client component).
 */
export async function fetchHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${getBase()}/api/health`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<HealthResponse>;
  } catch {
    return null;
  }
}

/**
 * Fetch the current security alert queue.
 * Used by the Inbound Alert Queue section (client component).
 */
export async function fetchAlerts(): Promise<AlertsResponse | null> {
  try {
    const res = await fetch(`${getBase()}/api/alerts`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<AlertsResponse>;
  } catch {
    return null;
  }
}

export async function login(username: string, password: string): Promise<string | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token;
  } catch {
    return null;
  }
}
