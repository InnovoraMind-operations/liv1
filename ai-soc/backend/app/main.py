"""
AI-SOC Core Engine — Backend Application Entry Point
=====================================================
Security hardening applied:
  - CORS locked to explicit origins, methods, and headers
  - /docs and /redoc disabled in production (APP_ENV=production)
  - slowapi rate limiting: 100 req/min global
  - SecurityHeadersMiddleware: full security header suite on every response
  - No wildcard allow_methods or allow_headers
"""

from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.routers import health, alerts, auth
from app.middleware.security_headers import SecurityHeadersMiddleware

# ---------------------------------------------------------------------------
# Rate Limiter — shared instance imported by routers
# ---------------------------------------------------------------------------

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

# ---------------------------------------------------------------------------
# Application Bootstrap
# ---------------------------------------------------------------------------

APP_ENV = os.getenv("APP_ENV", "development")
IS_PRODUCTION = APP_ENV == "production"

app = FastAPI(
    title="AI-SOC Core Engine",
    description=(
        "Phase 1 — Foundational REST layer for the AI Security Operations Center. "
        "Provides health telemetry and a mock alert queue consumed by the Next.js dashboard."
    ),
    version="0.1.0",
    # Disable interactive API docs in production — no attack surface for schema exploration
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)

# ---------------------------------------------------------------------------
# State — attach limiter to app state for slowapi
# ---------------------------------------------------------------------------

app.state.limiter = limiter

# ---------------------------------------------------------------------------
# Middleware (order matters — outermost middleware wraps innermost)
# ---------------------------------------------------------------------------

# 1. Security headers — applied to every response
app.add_middleware(SecurityHeadersMiddleware)

# 2. Rate limiting — global 100/minute default
app.add_middleware(SlowAPIMiddleware)

# 3. CORS — locked to explicit values, no wildcards
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    # Explicit method allowlist — no wildcard
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    # Explicit header allowlist — no wildcard
    allow_headers=["Authorization", "Content-Type", "Accept"],
    expose_headers=["X-Request-ID"],
)

# ---------------------------------------------------------------------------
# Exception Handlers
# ---------------------------------------------------------------------------

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(health.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")
