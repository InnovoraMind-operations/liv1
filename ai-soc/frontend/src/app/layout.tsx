import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// ---------------------------------------------------------------------------
// Root Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: "AI-SOC | Security Operations Center",
    template: "%s | AI-SOC",
  },
  description:
    "AI-powered Security Operations Center — autonomous threat detection, incident triage, and remediation.",
  metadataBase: new URL("http://localhost:3000"),
};

// ---------------------------------------------------------------------------
// Root Layout — Deep Forest Black × Metallic Gold
//
// Background stack (bottom → top):
//   1. body bg: #041009  (near-black forest)
//   2. Fixed Golden Ratio spiral SVG  (pointer-events-none, z-0, opacity ~4%)
//   3. Fixed radial vignette          (pointer-events-none, z-0)
//   4. All page content               (z-1)
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        className="min-h-full antialiased flex flex-col relative bg-[#041009]"
        style={{ color: "#F5F0E8" }}
      >
        {/* ── Layer 0-a: Viewport-spanning Golden Ratio Spiral ──────────────
            A mathematically accurate Fibonacci spiral rendered as a fixed
            background SVG. Stroked at opacity 0.05 — visible only as a ghost
            architectural watermark to anchor visual weight.
            pointer-events-none ensures zero UX interference.
        ─────────────────────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
        >
          <svg
            className="w-full h-full opacity-10"
            viewBox="236 118 618 618"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/*
              True Fibonacci Golden Spiral
              ─────────────────────────────
              Each arc is a quarter-circle whose radius is the next Fibonacci
              number (scaled). Anchor: center-right at (618, 500).

              Radii (scaled ×1):  r1=382, r2=236, r3=146, r4=90, r5=56, r6=34
              Centres shift by the previous radius in alternating axes.

              Arc sweep directions follow the canonical clockwise spiral.
            */}

            {/* Arc 1 — r=382, centre (618,118), sweep from (618,500) → (236,118) */}
            <path
              d="M 618 500 A 382 382 0 0 0 618 118"
              stroke="#D4AF37"
              strokeWidth="1"
            />
            {/* Arc 2 — r=236, centre (382,118), sweep → (236,354) */}
            <path
              d="M 618 118 A 236 236 0 0 0 382 354"
              stroke="#D4AF37"
              strokeWidth="1"
            />
            {/* Arc 3 — r=146, centre (382,500), sweep → (528,354) */}
            <path
              d="M 382 354 A 146 146 0 0 0 528 500"
              stroke="#D4AF37"
              strokeWidth="1"
            />
            {/* Arc 4 — r=90, centre (528,410), sweep → (618,500) */}
            <path
              d="M 528 500 A 90 90 0 0 0 618 410"
              stroke="#D4AF37"
              strokeWidth="1"
            />
            {/* Arc 5 — r=56, centre (562,410), sweep → (562,354) */}
            <path
              d="M 618 410 A 56 56 0 0 0 562 354"
              stroke="#D4AF37"
              strokeWidth="1"
            />
            {/* Arc 6 — r=34, centre (562,388), sweep → (528,388) */}
            <path
              d="M 562 354 A 34 34 0 0 0 528 388"
              stroke="#D4AF37"
              strokeWidth="1"
            />

            {/* ── Fibonacci grid rectangles ── */}
            {/* Outer square: 618×618 anchored at (236,118) */}
            <rect
              x="236" y="118" width="618" height="618"
              stroke="#D4AF37" strokeOpacity="0.6" strokeWidth="0.6" rx="1"
            />
            {/* 382×382 top-right */}
            <rect
              x="472" y="118" width="382" height="382"
              stroke="#D4AF37" strokeOpacity="0.5" strokeWidth="0.5" rx="1"
            />
            {/* 236×236 top-left */}
            <rect
              x="236" y="118" width="236" height="236"
              stroke="#D4AF37" strokeOpacity="0.5" strokeWidth="0.5" rx="1"
            />
            {/* 146×146 bottom-left */}
            <rect
              x="236" y="354" width="146" height="146"
              stroke="#D4AF37" strokeOpacity="0.4" strokeWidth="0.4" rx="1"
            />
            {/* 90×90 inner */}
            <rect
              x="382" y="354" width="90" height="90"
              stroke="#D4AF37" strokeOpacity="0.4" strokeWidth="0.4" rx="1"
            />
          </svg>
        </div>

        {/* ── Layer 0-b: Radial vignette — darkens the corners ─────────────
            Adds depth so text content reads cleanly above the spiral.
        ─────────────────────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(4,16,9,0.75) 100%)",
          }}
        />

        {/* ── Layer 1: Page content ─────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col min-h-full">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
