import type { NextConfig } from "next";
import path from "path";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // ---------------------------------------------------------------------------
  // Turbopack root — fixes workspace-detection warning when parent dirs
  // contain other package-lock.json files.
  // ---------------------------------------------------------------------------
  turbopack: {
    root: path.resolve(__dirname),
  },

  // ---------------------------------------------------------------------------
  // API Rewrites
  // Proxies /api/* from the Next.js dev server to the FastAPI backend.
  // This means the frontend can call /api/health without CORS issues even
  // if NEXT_PUBLIC_API_URL is not set.
  // ---------------------------------------------------------------------------
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },

  // ---------------------------------------------------------------------------
  // Security Headers
  // Applied to every response by the Next.js server layer.
  // ---------------------------------------------------------------------------
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Clickjacking protection
          { key: "X-Frame-Options", value: "DENY" },

          // Legacy XSS filter (belt-and-suspenders for older browsers)
          { key: "X-XSS-Protection", value: "1; mode=block" },

          // HSTS — 2-year max-age, include subdomains, preload
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // Referrer policy — don't leak full URL to third parties
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // Permissions policy — disable dangerous browser features
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "interest-cohort=()",
            ].join(", "),
          },

          // Content Security Policy
          // Strict in production; relaxed only for local dev (Next.js HMR needs eval)
          {
            key: "Content-Security-Policy",
            value: IS_PRODUCTION
              ? [
                  "default-src 'self'",
                  "script-src 'self'",
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                  "font-src 'self' https://fonts.gstatic.com",
                  "img-src 'self' data: blob:",
                  "connect-src 'self' http://localhost:8000",
                  "frame-ancestors 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                ].join("; ")
              : [
                  "default-src 'self'",
                  // Allow eval for Next.js dev HMR / React Fast Refresh
                  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                  "font-src 'self' https://fonts.gstatic.com",
                  "img-src 'self' data: blob:",
                  "connect-src 'self' http://localhost:8000 ws://localhost:*",
                  "frame-ancestors 'none'",
                ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
