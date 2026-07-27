"use client";

import { useActionState, useEffect } from "react";
import { loginUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const initialState = {
  error: "",
  success: false,
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state?.success, router]);

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 font-mono"
      style={{ backgroundColor: "#0A1F15", color: "#F5F0E8" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-md rounded-lg border p-8 shadow-2xl backdrop-blur-md"
        style={{
          borderColor: "rgba(212,175,55,0.18)",
          backgroundColor: "rgba(15,42,28,0.75)",
          boxShadow: "0 0 60px -15px rgba(212,175,55,0.12)",
        }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded ring-1"
            style={{
              backgroundColor: "rgba(212,175,55,0.08)",
              ringColor: "rgba(212,175,55,0.30)",
            }}
          >
            <svg
              className="h-6 w-6"
              style={{ color: "#D4AF37" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest uppercase" style={{ color: "#F5F0E8" }}>
              AI<span style={{ color: "#D4AF37" }}>-SOC</span>
            </h1>
            <p className="text-xs tracking-wider uppercase" style={{ color: "rgba(212,175,55,0.55)" }}>
              Secure Gateway
            </p>
          </div>
        </div>

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-5">
          {/* Operator ID */}
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#8A9E8E" }}
            >
              Operator ID
            </label>
            <input
              type="text"
              name="username"
              className="w-full font-mono rounded border px-3 py-2 text-sm outline-none transition-all duration-200"
              style={{
                borderColor: "#1E4530",
                backgroundColor: "rgba(10,31,21,0.7)",
                color: "#F5F0E8",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)";
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(212,175,55,0.3)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#1E4530";
                e.currentTarget.style.boxShadow = "";
              }}
              placeholder="admin"
              required
            />
          </div>

          {/* Passcode */}
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#8A9E8E" }}
            >
              Passcode
            </label>
            <input
              type="password"
              name="password"
              className="w-full font-mono rounded border px-3 py-2 text-sm outline-none transition-all duration-200"
              style={{
                borderColor: "#1E4530",
                backgroundColor: "rgba(10,31,21,0.7)",
                color: "#F5F0E8",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)";
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(212,175,55,0.3)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#1E4530";
                e.currentTarget.style.boxShadow = "";
              }}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Error */}
          {state?.error && (
            <div
              className="rounded border p-2 text-center text-xs"
              style={{
                borderColor: "rgba(244,63,94,0.3)",
                backgroundColor: "rgba(244,63,94,0.08)",
                color: "#f87171",
              }}
            >
              {state.error}
            </div>
          )}

          {/* Gold submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded py-2.5 text-sm font-bold tracking-widest transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{
              backgroundColor: isPending ? "rgba(212,175,55,0.4)" : "#D4AF37",
              color: "#0A1F15",
              boxShadow: "0 0 20px -5px rgba(212,175,55,0.4)",
            }}
          >
            {isPending ? "INITIALIZING..." : "INITIALIZE SESSION"}
          </button>
        </form>
      </div>
    </div>
  );
}
