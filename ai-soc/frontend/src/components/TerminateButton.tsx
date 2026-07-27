"use client";

// ---------------------------------------------------------------------------
// TerminateButton — extracted client sub-component
// Logout / session termination trigger. Relocated from HeaderStatusBar into
// the Command Dashboard title row. Owns its own useTransition for pending state.
// Forest Green × Gold executive theme.
// ---------------------------------------------------------------------------

import { useTransition } from "react";
import { logoutUser } from "@/app/actions/auth";

export function TerminateButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logoutUser();
    });
  };

  return (
    <button
      id="terminate-session-btn"
      onClick={handleLogout}
      disabled={isPending}
      className="rounded border px-3 py-1.5 font-mono text-[10px] tracking-wider transition-all duration-300 ease-in-out disabled:opacity-40 active:scale-95"
      style={{
        borderColor: "rgba(244,63,94,0.25)",
        backgroundColor: "rgba(244,63,94,0.06)",
        color: "rgba(244,63,94,0.55)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(244,63,94,0.18)";
        (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(244,63,94,0.45)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px -4px rgba(244,63,94,0.30)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(244,63,94,0.06)";
        (e.currentTarget as HTMLButtonElement).style.color = "rgba(244,63,94,0.55)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(244,63,94,0.25)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
      }}
    >
      {isPending ? "TERMINATING…" : "TERMINATE SESSION"}
    </button>
  );
}
