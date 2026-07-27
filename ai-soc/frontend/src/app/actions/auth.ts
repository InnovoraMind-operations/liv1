"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getApiUrl = () => process.env.API_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Input validation helpers (server-side — not a replacement for backend
// validation, but prevents malformed requests ever reaching the network)
// ---------------------------------------------------------------------------

function sanitizeInput(value: string, maxLength = 128): string {
  return value.trim().slice(0, maxLength);
}

function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_\-]{3,32}$/.test(username);
}

// ---------------------------------------------------------------------------
// loginUser — called by the login form via useActionState
// ---------------------------------------------------------------------------

export async function loginUser(prevState: any, formData: FormData) {
  const raw_username = formData.get("username")?.toString() || "";
  const raw_password = formData.get("password")?.toString() || "";

  const username = sanitizeInput(raw_username);
  const password = sanitizeInput(raw_password, 256);

  // ── Server-side pre-validation ────────────────────────────────────────
  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  if (!isValidUsername(username)) {
    return {
      error: "Username must be 3–32 characters and contain only letters, digits, underscores, or hyphens.",
    };
  }

  if (password.length < 12) {
    return { error: "Password must be at least 12 characters." };
  }

  // ── Call backend ──────────────────────────────────────────────────────
  try {
    const res = await fetch(`${getApiUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    if (!res.ok) {
      return { error: "Invalid credentials. Access denied." };
    }

    const data = await res.json();
    const token = data.access_token;

    if (!token) {
      return { error: "No session token received from backend." };
    }

    const IS_PROD = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();

    cookieStore.set(
      // __Secure- prefix: browser rejects this cookie unless connection is HTTPS
      IS_PROD ? "__Secure-soc_session" : "soc_session",
      token,
      {
        httpOnly: true,               // Not accessible from JS
        secure: IS_PROD,              // HTTPS only in production
        sameSite: "strict",           // CSRF protection
        path: "/",
        maxAge: 60 * 30,              // 30 minutes — matches backend JWT expiry
      }
    );

    return { success: true };
  } catch {
    return { error: "Connection to backend failed. Is the server running?" };
  }
}

// ---------------------------------------------------------------------------
// logoutUser — called by the Terminate Session button
// ---------------------------------------------------------------------------

export async function logoutUser() {
  const cookieStore = await cookies();
  const IS_PROD = process.env.NODE_ENV === "production";
  const cookieName = IS_PROD ? "__Secure-soc_session" : "soc_session";
  cookieStore.delete(cookieName);
  redirect("/login");
}
