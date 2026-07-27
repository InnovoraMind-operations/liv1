"""
AI-SOC Authentication Utilities
================================
JWT signing:  RS256 (RSA-4096 asymmetric key pair)
  - Private key  → signs tokens (only the backend holds this)
  - Public key   → verifies tokens (safe to distribute)

Password hashing: bcrypt (cost factor 12)

Key loading: Both keys are loaded once at module import.
The application will refuse to start if either key path is missing
or the files cannot be read — there is NO insecure fallback.
"""

import os
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import jwt
from passlib.context import CryptContext

# ---------------------------------------------------------------------------
# RSA Key Loading — Hard fail if keys are missing
# ---------------------------------------------------------------------------

def _load_key(env_var: str, description: str) -> bytes:
    """Load a PEM key file from the path specified in an environment variable.

    Raises RuntimeError at startup if the variable is unset or the file is
    missing — intentionally halting the application with a clear message
    rather than falling back to an insecure default.
    """
    key_path_str = os.getenv(env_var)
    if not key_path_str:
        raise RuntimeError(
            f"CRITICAL: {env_var} is not set. "
            f"Run 'python generate_keys.py' from the backend/ directory, "
            f"then add {env_var}=keys/private.pem (or public.pem) to your .env file."
        )

    # Resolve relative paths from the backend/ directory
    key_path = Path(key_path_str)
    if not key_path.is_absolute():
        # Relative path: resolve from the backend/ directory (parent of app/)
        key_path = Path(__file__).parent.parent / key_path

    if not key_path.exists():
        raise RuntimeError(
            f"CRITICAL: {description} file not found at '{key_path.resolve()}'. "
            f"Run 'python generate_keys.py' to regenerate."
        )

    return key_path.read_bytes()


PRIVATE_KEY: bytes = _load_key("JWT_PRIVATE_KEY_PATH", "JWT RSA private key")
PUBLIC_KEY: bytes  = _load_key("JWT_PUBLIC_KEY_PATH",  "JWT RSA public key")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

ALGORITHM = "RS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ---------------------------------------------------------------------------
# Password Utilities
# ---------------------------------------------------------------------------

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# ---------------------------------------------------------------------------
# Password Strength Validator
# ---------------------------------------------------------------------------

_PASSWORD_MIN_LENGTH = 12
_PASSWORD_RULES = [
    (r"[A-Z]",        "at least one uppercase letter"),
    (r"[a-z]",        "at least one lowercase letter"),
    (r"[0-9]",        "at least one digit"),
    (r"[^A-Za-z0-9]", "at least one special character (e.g. !@#$%^&*)"),
]


def validate_password_strength(password: str) -> list[str]:
    """Return a list of violation messages. Empty list means password is valid."""
    violations: list[str] = []

    if len(password) < _PASSWORD_MIN_LENGTH:
        violations.append(
            f"Password must be at least {_PASSWORD_MIN_LENGTH} characters long "
            f"(got {len(password)})."
        )

    for pattern, description in _PASSWORD_RULES:
        if not re.search(pattern, password):
            violations.append(f"Password must contain {description}.")

    return violations


# ---------------------------------------------------------------------------
# Username Validator
# ---------------------------------------------------------------------------

_USERNAME_RE = re.compile(r"^[a-zA-Z0-9_\-]{3,32}$")


def validate_username(username: str) -> list[str]:
    """Return a list of violation messages. Empty list means username is valid."""
    violations: list[str] = []
    if not _USERNAME_RE.match(username):
        violations.append(
            "Username must be 3–32 characters and contain only letters, "
            "digits, underscores, or hyphens."
        )
    return violations


# ---------------------------------------------------------------------------
# JWT Utilities (RS256)
# ---------------------------------------------------------------------------

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Sign a JWT with the RSA private key using RS256."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, PRIVATE_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Verify a JWT using the RSA public key. Returns payload or None."""
    try:
        return jwt.decode(token, PUBLIC_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        return None
