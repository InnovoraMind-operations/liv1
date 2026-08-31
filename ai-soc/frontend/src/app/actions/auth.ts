"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getApiUrl = () => process.env.API_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Input validation helpers
// ---------------------------------------------------------------------------

function sanitizeInput(value: string, maxLength = 128): string {
  return value.trim().slice(0, maxLength);
}

function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_\-]{3,32}$/.test(username);
}

export type LoginState = {
  error: string;
  success: boolean;
};

// ---------------------------------------------------------------------------
// loginUser — called by the login form via useActionState
// ---------------------------------------------------------------------------

export async function loginUser(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const raw_username = formData.get("username")?.toString() || "";
  const raw_password = formData.get("password")?.toString() || "";

  const username = sanitizeInput(raw_username);
  const password = sanitizeInput(raw_password, 256);

  // ── Server-side pre-validation ────────────────────────────────────────
  if (!username || !password) {
    return { error: "Username and password are required.", success: false };
  }

  if (!isValidUsername(username)) {
    return {
      error: "Username must be 3–32 characters and contain only letters, digits, underscores, or hyphens.",
      success: false,
    };
  }

  if (password.length < 12) {
    return { error: "Password must be at least 12 characters.", success: false };
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
      return { error: "Invalid credentials. Access denied.", success: false };
    }

    const data = await res.json();
    const token = data.access_token;

    if (!token) {
      return { error: "No session token received from backend.", success: false };
    }

    const IS_PROD = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();

    cookieStore.set(
      IS_PROD ? "__Secure-soc_session" : "soc_session",
      token,
      {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 30,
      }
    );

    return { error: "", success: true };
  } catch {
    return { error: "Connection to backend failed. Is the server running?", success: false };
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
