"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsPending(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        // Backend returns either a plain string or {field, violations:[...]}
        const detail = data.detail;
        if (detail && typeof detail === "object" && Array.isArray(detail.violations)) {
          setError(detail.violations.join(" "));
        } else {
          setError(typeof detail === "string" ? detail : "Registration failed.");
        }
        setIsPending(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Connection to backend failed.");
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-screen items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-emerald-500/10 ring-1 ring-emerald-500/30">
            <svg
              className="h-6 w-6 text-emerald-400"
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
            <h1 className="text-2xl font-bold tracking-widest text-slate-100 uppercase">
              AI-SOC
            </h1>
            <p className="text-xs tracking-wider text-emerald-500/70 uppercase">
              Operator Registration
            </p>
          </div>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full font-mono rounded border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
              placeholder="new_operator"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full font-mono rounded border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
              placeholder="operator@ai-soc.local"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full font-mono rounded border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full font-mono rounded border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="rounded border border-rose-500/30 bg-rose-500/10 p-2 text-center text-xs text-rose-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded bg-emerald-500/20 py-2.5 text-sm font-bold tracking-widest text-emerald-400 transition-colors hover:bg-emerald-500/30 active:bg-emerald-500/40 disabled:opacity-50"
          >
            {isPending ? "INITIALIZING..." : "CREATE OPERATOR ACCOUNT"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
          >
            Already have an authorization clearance? Log In.
          </Link>
        </div>
      </div>
    </div>
  );
}
