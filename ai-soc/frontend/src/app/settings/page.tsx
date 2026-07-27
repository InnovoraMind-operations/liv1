"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Feedback = { type: "success" | "error" | "idle"; message: string };

// ---------------------------------------------------------------------------
// Input focus helpers -- plain gold ring on focus
// ---------------------------------------------------------------------------

function applyGoldFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "rgba(212,175,55,0.55)";
  e.currentTarget.style.boxShadow =
    "0 0 0 1px rgba(212,175,55,0.25), 0 0 12px -4px rgba(212,175,55,0.18)";
}

function removeGoldFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)";
  e.currentTarget.style.boxShadow = "";
}

// ---------------------------------------------------------------------------
// SectionCard
// ---------------------------------------------------------------------------

function SectionCard({
  children,
  danger = false,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      style={{
        borderRadius: 12,
        border: danger
          ? "1px solid rgba(153,27,27,0.50)"
          : "1px solid rgba(212,175,55,0.20)",
        backgroundColor: danger
          ? "rgba(10,4,4,0.65)"
          : "rgba(4,16,9,0.60)",
        backdropFilter: "blur(8px)",
        padding: 24,
        boxShadow: danger
          ? "0 4px 32px -8px rgba(153,27,27,0.15)"
          : "0 4px 32px -8px rgba(0,0,0,0.50)",
      }}
    >
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// SectionTitle
// ---------------------------------------------------------------------------

function SectionTitle({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          backgroundColor: "rgba(212,175,55,0.08)",
          border: "1px solid rgba(212,175,55,0.18)",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#F5F0E8",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "#3D5C46",
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FieldLabel
// ---------------------------------------------------------------------------

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#8A9E8E",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

// ---------------------------------------------------------------------------
// GoldInput
// ---------------------------------------------------------------------------

function GoldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const isDisabled = props.disabled;
  return (
    <input
      {...props}
      onFocus={isDisabled ? undefined : applyGoldFocus}
      onBlur={isDisabled ? undefined : removeGoldFocus}
      style={{
        width: "100%",
        borderRadius: 6,
        border: isDisabled
          ? "1px solid rgba(30,69,48,0.60)"
          : "1px solid rgba(212,175,55,0.15)",
        backgroundColor: isDisabled
          ? "rgba(6,20,12,0.55)"
          : "rgba(10,31,21,0.70)",
        color: isDisabled ? "#3D5C46" : "#F5F0E8",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        padding: "10px 12px",
        outline: "none",
        cursor: isDisabled ? "not-allowed" : "text",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// FeedbackBanner
// ---------------------------------------------------------------------------

function FeedbackBanner({ fb }: { fb: Feedback }) {
  if (fb.type === "idle") return null;
  const ok = fb.type === "success";
  return (
    <div
      style={{
        marginTop: 12,
        padding: "8px 12px",
        borderRadius: 6,
        border: ok
          ? "1px solid rgba(212,175,55,0.30)"
          : "1px solid rgba(244,63,94,0.30)",
        backgroundColor: ok
          ? "rgba(212,175,55,0.06)"
          : "rgba(244,63,94,0.08)",
        color: ok ? "#D4AF37" : "#f87171",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      }}
    >
      {ok ? "[OK] " : "[ERR] "}
      {fb.message}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GoldButton
// ---------------------------------------------------------------------------

function GoldButton({
  id,
  type = "submit",
  disabled,
  onClick,
  children,
}: {
  id: string;
  type?: "submit" | "button";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: 6,
        border: "none",
        backgroundColor: disabled
          ? "rgba(212,175,55,0.35)"
          : "#D4AF37",
        color: "#0A1F15",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "transform 0.15s, opacity 0.15s",
        boxShadow: "0 0 18px -5px rgba(212,175,55,0.40)",
      }}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Settings Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const router = useRouter();

  // Profile
  const [username, setUsername] = useState("operator");
  const [email, setEmail] = useState("operator@ai-soc.local");
  const [profileFb, setProfileFb] = useState<Feedback>({ type: "idle", message: "" });
  const [profilePending, setProfilePending] = useState(false);

  // Security
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [secFb, setSecFb] = useState<Feedback>({ type: "idle", message: "" });
  const [secPending, setSecPending] = useState(false);

  // Delete
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleProfileSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setProfilePending(true);
    await new Promise((r) => setTimeout(r, 700));
    setProfileFb({ type: "success", message: "Profile saved successfully." });
    setProfilePending(false);
    setTimeout(() => setProfileFb({ type: "idle", message: "" }), 4000);
  }, []);

  const handlePasswordSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSecPending(true);
      if (newPw.length < 8) {
        setSecFb({
          type: "error",
          message: "Password must be at least 8 characters.",
        });
        setSecPending(false);
        return;
      }
      if (newPw !== confirmPw) {
        setSecFb({ type: "error", message: "Passwords do not match." });
        setSecPending(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 700));
      setSecFb({
        type: "success",
        message: "Password updated. Re-authenticate on next login.",
      });
      setNewPw("");
      setConfirmPw("");
      setSecPending(false);
      setTimeout(() => setSecFb({ type: "idle", message: "" }), 5000);
    },
    [newPw, confirmPw]
  );

  const handleDelete = useCallback(async () => {
    const confirmed = window.confirm(
      "WARNING: This will permanently delete your operator account and cannot be undone. Proceed?"
    );
    if (!confirmed) return;

    setDeletePending(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail ?? "Server returned an error.");
      }
      router.push("/signup");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setDeleteError(msg);
      setDeletePending(false);
    }
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 16px 64px",
        color: "#F5F0E8",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Page heading */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                height: 1,
                width: 24,
                background: "linear-gradient(to right, #D4AF37, transparent)",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.60)",
              }}
            >
              Account Management
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 28,
              fontWeight: 700,
              color: "#F5F0E8",
              margin: 0,
            }}
          >
            Settings
          </h1>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#3D5C46",
              marginTop: 6,
              marginBottom: 0,
            }}
          >
            Manage operator profile, credentials, and platform preferences.
          </p>
        </div>

        {/* Card stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ---- Profile Configuration ---- */}
          <SectionCard>
            <SectionTitle
              title="Profile Configuration"
              sub="Identity and contact details"
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#D4AF37"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              }
            />
            <form
              onSubmit={handleProfileSave}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <FieldLabel htmlFor="cfg-username">Username</FieldLabel>
                <GoldInput
                  id="cfg-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="operator"
                  autoComplete="username"
                />
              </div>
              <div>
                <FieldLabel htmlFor="cfg-email">Email Address</FieldLabel>
                <GoldInput
                  id="cfg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@ai-soc.local"
                  autoComplete="email"
                />
              </div>
              <FeedbackBanner fb={profileFb} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                <GoldButton id="btn-save-profile" disabled={profilePending}>
                  {profilePending ? "Saving..." : "Save Changes"}
                </GoldButton>
              </div>
            </form>
          </SectionCard>

          {/* ---- Security ---- */}
          <SectionCard>
            <SectionTitle
              title="Security"
              sub="Credentials and access control"
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#D4AF37"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              }
            />
            <form
              onSubmit={handlePasswordSave}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <FieldLabel htmlFor="cfg-newpw">New Password</FieldLabel>
                <GoldInput
                  id="cfg-newpw"
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <FieldLabel htmlFor="cfg-confirmpw">Confirm Password</FieldLabel>
                <GoldInput
                  id="cfg-confirmpw"
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
              </div>
              <FeedbackBanner fb={secFb} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                <GoldButton id="btn-save-password" disabled={secPending}>
                  {secPending ? "Updating..." : "Update Password"}
                </GoldButton>
              </div>
            </form>
          </SectionCard>

          {/* ---- API Access ---- */}
          <SectionCard>
            <SectionTitle
              title="API Access"
              sub="Programmatic integration keys"
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#D4AF37"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                  />
                </svg>
              }
            />
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <FieldLabel htmlFor="cfg-apikey">API Key</FieldLabel>
                <span
                  style={{
                    display: "inline-block",
                    padding: "1px 8px",
                    borderRadius: 999,
                    border: "1px solid rgba(212,175,55,0.30)",
                    backgroundColor: "rgba(212,175,55,0.10)",
                    color: "#D4AF37",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Coming Soon
                </span>
              </div>
              <GoldInput
                id="cfg-apikey"
                type="text"
                value="sk-soc-placeholder-not-yet-active"
                disabled
                readOnly
              />
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "#2A4535",
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                API key generation is planned for a future platform release.
              </p>
            </div>
          </SectionCard>

          {/* ---- Danger Zone ---- */}
          <SectionCard danger>
            <SectionTitle
              title="Danger Zone"
              sub="Irreversible destructive operations"
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#f87171"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              }
            />

            {/* Warning box */}
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 8,
                border: "1px solid rgba(239,68,68,0.22)",
                backgroundColor: "rgba(239,68,68,0.06)",
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  lineHeight: 1.7,
                  color: "#fca5a5",
                  margin: 0,
                }}
              >
                <span
                  style={{ color: "#f87171", fontWeight: 700 }}
                >
                  WARNING:
                </span>{" "}
                Deleting your operator profile is permanent and irreversible. Your
                credentials, configuration, and session data will be erased
                immediately. Alert queue records are retained for compliance.
              </p>
            </div>

            {deleteError && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(244,63,94,0.30)",
                  backgroundColor: "rgba(244,63,94,0.08)",
                  color: "#f87171",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                }}
              >
                [ERR] {deleteError}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                id="btn-delete-account"
                type="button"
                onClick={handleDelete}
                disabled={deletePending}
                style={{
                  padding: "10px 20px",
                  borderRadius: 6,
                  border: "1px solid rgba(239,68,68,0.40)",
                  backgroundColor: deletePending
                    ? "rgba(220,38,38,0.35)"
                    : "rgba(220,38,38,0.85)",
                  color: "#fff",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: deletePending ? "not-allowed" : "pointer",
                  opacity: deletePending ? 0.55 : 1,
                  transition: "transform 0.15s, opacity 0.15s",
                  boxShadow: "0 0 18px -6px rgba(220,38,38,0.35)",
                }}
              >
                {deletePending ? "Deleting Profile..." : "Delete Operator Profile"}
              </button>
            </div>
          </SectionCard>

        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: "#1E4530",
            marginTop: 40,
          }}
        >
          AI-SOC Settings v0.1.0 -- All changes take effect immediately.
        </p>

      </div>
    </div>
  );
}
