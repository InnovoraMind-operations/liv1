#!/usr/bin/env python3
"""
AI-SOC RSA Key Generator
========================
Run once before first launch to generate the RSA-4096 key pair used for
JWT RS256 signing.

Usage:
    cd backend
    python generate_keys.py

Output:
    backend/keys/private.pem   ← NEVER commit this file
    backend/keys/public.pem    ← Safe to share / commit if needed

After running, copy these lines into backend/.env:
    JWT_PRIVATE_KEY_PATH=keys/private.pem
    JWT_PUBLIC_KEY_PATH=keys/public.pem
"""

import os
import stat
from pathlib import Path

try:
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.primitives import serialization
except ImportError:
    raise SystemExit(
        "\n[ERROR] 'cryptography' package not found.\n"
        "Install it with:  pip install cryptography\n"
        "Or run:           pip install -r requirements.txt\n"
    )

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

KEYS_DIR = Path(__file__).parent / "keys"
PRIVATE_KEY_PATH = KEYS_DIR / "private.pem"
PUBLIC_KEY_PATH = KEYS_DIR / "public.pem"
KEY_SIZE = 4096  # RSA-4096 — enterprise grade

# ---------------------------------------------------------------------------
# Safety check: refuse to overwrite existing keys without explicit flag
# ---------------------------------------------------------------------------

if PRIVATE_KEY_PATH.exists() or PUBLIC_KEY_PATH.exists():
    print("\n[WARNING] Key files already exist:")
    if PRIVATE_KEY_PATH.exists():
        print(f"  {PRIVATE_KEY_PATH}")
    if PUBLIC_KEY_PATH.exists():
        print(f"  {PUBLIC_KEY_PATH}")
    answer = input("\nOverwrite? This will INVALIDATE all existing JWT tokens. [y/N]: ").strip().lower()
    if answer != "y":
        print("Aborted. Existing keys preserved.")
        raise SystemExit(0)

# ---------------------------------------------------------------------------
# Generate RSA-4096 private key
# ---------------------------------------------------------------------------

KEYS_DIR.mkdir(parents=True, exist_ok=True)

print(f"\n[*] Generating RSA-{KEY_SIZE} key pair — this may take a moment...")

private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=KEY_SIZE,
)
public_key = private_key.public_key()

# ---------------------------------------------------------------------------
# Serialize and write private key (PEM, unencrypted — keep file permissions tight)
# ---------------------------------------------------------------------------

private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption(),
)

PRIVATE_KEY_PATH.write_bytes(private_pem)

# Restrict to owner-read-only (chmod 600) on POSIX systems
if os.name != "nt":
    PRIVATE_KEY_PATH.chmod(stat.S_IRUSR | stat.S_IWUSR)

# ---------------------------------------------------------------------------
# Serialize and write public key
# ---------------------------------------------------------------------------

public_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo,
)

PUBLIC_KEY_PATH.write_bytes(public_pem)

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------

print("\n[OK] Keys generated successfully:")
print(f"    Private: {PRIVATE_KEY_PATH.resolve()}")
print(f"    Public:  {PUBLIC_KEY_PATH.resolve()}")
print("\n[!] IMPORTANT: The private key must NEVER be committed to Git.")
print("    It is already covered by backend/keys/ in .gitignore.")
print("\n[*] Add these lines to your backend/.env:")
print("    JWT_PRIVATE_KEY_PATH=keys/private.pem")
print("    JWT_PUBLIC_KEY_PATH=keys/public.pem")
print("\n[*] Also generate a random Postgres password:")
print("    python -c \"import secrets; print(secrets.token_urlsafe(32))\"")
print("    and set it in BOTH .env and docker-compose.yml (via POSTGRES_PASSWORD).\n")
