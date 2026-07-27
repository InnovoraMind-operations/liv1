"""
Security Headers Middleware
===========================
Injects a hardened set of HTTP security headers on every response.

Headers applied:
  - X-Content-Type-Options     → Prevent MIME-type sniffing
  - X-Frame-Options            → Prevent clickjacking
  - X-XSS-Protection           → Legacy XSS filter (belt-and-suspenders)
  - Strict-Transport-Security  → Enforce HTTPS (HSTS)
  - Content-Security-Policy    → Allowlist trusted sources only
  - Referrer-Policy            → Limit referrer information leakage
  - Permissions-Policy         → Disable dangerous browser features
  - Cache-Control              → Prevent caching of sensitive API responses
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Append security-hardening headers to every HTTP response."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        # ── Prevent MIME sniffing ──────────────────────────────────────────
        response.headers["X-Content-Type-Options"] = "nosniff"

        # ── Clickjacking protection ────────────────────────────────────────
        response.headers["X-Frame-Options"] = "DENY"

        # ── Legacy XSS filter (still respected by some older browsers) ─────
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # ── HTTP Strict Transport Security (2-year max-age) ────────────────
        # Tells browsers to ONLY contact this server over HTTPS.
        response.headers["Strict-Transport-Security"] = (
            "max-age=63072000; includeSubDomains; preload"
        )

        # ── Content Security Policy ────────────────────────────────────────
        # API-only backend: no pages, no scripts — lock everything down.
        response.headers["Content-Security-Policy"] = (
            "default-src 'none'; "
            "frame-ancestors 'none';"
        )

        # ── Referrer Policy ────────────────────────────────────────────────
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # ── Permissions Policy ─────────────────────────────────────────────
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), "
            "payment=(), usb=(), interest-cohort=()"
        )

        # ── Cache control — API responses must never be cached ─────────────
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
        response.headers["Pragma"] = "no-cache"

        # ── Remove server fingerprinting headers if present ────────────────
        for header in ("Server", "X-Powered-By"):
            try:
                del response.headers[header]
            except KeyError:
                pass

        return response
