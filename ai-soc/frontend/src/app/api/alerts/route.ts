import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const IS_PROD = process.env.NODE_ENV === "production";
  const cookieName = IS_PROD ? "__Secure-soc_session" : "soc_session";
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl = process.env.API_URL ?? "http://localhost:8000";

  try {
    const res = await fetch(`${apiUrl}/api/alerts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Backend error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Connection to backend failed" }, { status: 502 });
  }
}
