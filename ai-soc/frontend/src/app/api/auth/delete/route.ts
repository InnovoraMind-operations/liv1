/**
 * Next.js API Route: DELETE /api/auth/delete
 *
 * Bridge between the client-side Settings page and the FastAPI backend.
 * Because the JWT is stored in an httpOnly cookie (`soc_session`), the
 * browser cannot read it in JavaScript. This route handler:
 *   1. Reads the token from the incoming request's cookies.
 *   2. Forwards a DELETE /api/auth/me request to FastAPI with the token
 *      in the Authorization header.
 *   3. On success, clears the soc_session cookie and returns 200.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL ?? "http://localhost:8000";

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("soc_session")?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "Not authenticated — no active session found." },
      { status: 401 }
    );
  }

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      const body = await backendRes.json().catch(() => ({}));
      return NextResponse.json(body, { status: backendRes.status });
    }

    // Clear the session cookie
    const response = NextResponse.json(
      { message: "Account deleted successfully." },
      { status: 200 }
    );
    response.cookies.delete("soc_session");
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Failed to connect to backend. Please try again." },
      { status: 502 }
    );
  }
}
