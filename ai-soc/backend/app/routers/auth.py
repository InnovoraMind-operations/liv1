"""
AI-SOC Auth Router — /api/auth
================================
Security hardening applied:
  - Rate limiting: 5 attempts/minute on /login and /signup (brute-force protection)
  - Password strength validation on /signup
  - Username format validation on /signup
  - Generic error response on /login (prevents username enumeration)
  - Consistent timing via bcrypt (prevents timing-based user enumeration)
"""

import uuid
from fastapi import APIRouter, HTTPException, Request, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
    validate_password_strength,
    validate_username,
)
from app.database import get_db
from app.db_models import User as DBUser

# Import the shared limiter from main — avoids circular import by lazy-loading app state
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(tags=["Auth"])
security = HTTPBearer()

# ---------------------------------------------------------------------------
# Dependency: resolve current user from JWT
# ---------------------------------------------------------------------------

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> DBUser:
    """Decode the Bearer JWT and return the corresponding DB user."""
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    username: str | None = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    result = await db.execute(select(DBUser).where(DBUser.username == username))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class AuthRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# ---------------------------------------------------------------------------
# POST /signup
# ---------------------------------------------------------------------------

@router.post("/signup", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def signup(request: Request, user: AuthRequest, db: AsyncSession = Depends(get_db)):
    """
    Register a new operator account.

    Rate limited to 5 attempts per minute per IP.
    Password must meet complexity requirements.
    """
    # ── Input validation ──────────────────────────────────────────────────
    username_errors = validate_username(user.username)
    if username_errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"field": "username", "violations": username_errors},
        )

    password_errors = validate_password_strength(user.password)
    if password_errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"field": "password", "violations": password_errors},
        )

    # ── Duplicate check ───────────────────────────────────────────────────
    result = await db.execute(select(DBUser).where(DBUser.username == user.username))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    # ── Create user ───────────────────────────────────────────────────────
    new_user = DBUser(
        id=str(uuid.uuid4()),
        username=user.username,
        hashed_password=get_password_hash(user.password),
    )
    db.add(new_user)
    await db.commit()

    return {"message": "Operator account created successfully"}


# ---------------------------------------------------------------------------
# POST /login
# ---------------------------------------------------------------------------

_GENERIC_AUTH_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid credentials",  # Generic — does not reveal whether user exists
    headers={"WWW-Authenticate": "Bearer"},
)


@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
async def login(request: Request, user: AuthRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticate an operator and return a signed RS256 JWT.

    Rate limited to 5 attempts per minute per IP.
    Returns a generic error regardless of whether the username exists
    (prevents username enumeration attacks).
    """
    result = await db.execute(select(DBUser).where(DBUser.username == user.username))
    db_user = result.scalars().first()

    # IMPORTANT: always call verify_password even when user is not found.
    # This ensures consistent timing so an attacker cannot enumerate valid
    # usernames by measuring response latency.
    dummy_hash = "$2b$12$notarealthashjustpaddingtomaintaintiming0000000000000"
    password_ok = verify_password(
        user.password,
        db_user.hashed_password if db_user else dummy_hash,
    )

    if not db_user or not password_ok:
        raise _GENERIC_AUTH_ERROR

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


# ---------------------------------------------------------------------------
# DELETE /me — permanently remove the authenticated account
# ---------------------------------------------------------------------------

@router.delete("/me", status_code=status.HTTP_200_OK, summary="Delete current user account")
async def delete_account(
    current_user: DBUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Permanently delete the authenticated user's record from the database."""
    await db.delete(current_user)
    await db.commit()
    return {"message": f"Account '{current_user.username}' has been permanently deleted."}
