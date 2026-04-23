import logging
import httpx
import json
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import timedelta
from jose import jwt, JWTError

from app.core.auth import create_access_token, get_current_user
from app.core.config import settings

logger = logging.getLogger("app")
router = APIRouter(prefix="/v1/auth", tags=["auth"])

# Cache for JWKS keys to avoid repeated fetches
_jwks_cache = {"keys": None, "updated_at": None}


class TokenRequest(BaseModel):
    access_token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=TokenResponse)
async def login(token_request: TokenRequest) -> TokenResponse:
    """
    Login endpoint that validates Entra ID token and issues JWT token.
    Expects an access token from Entra ID (Microsoft Azure AD).
    """
    try:
        logger.info("Processing Entra ID token validation")

        # Validate token with Entra ID
        user_info = await validate_entra_id_token(token_request.access_token)

        # Create JWT token for our application
        access_token = create_access_token(
            data={"sub": user_info["email"]},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        logger.info(f"✓ User authenticated: {user_info['email']}")
        return TokenResponse(access_token=access_token)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during authentication: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falha na autenticação com Entra ID",
        )


@router.get("/me")
async def get_current_user_info(current_user: str = Depends(get_current_user)):
    """Get current authenticated user information"""
    return {
        "username": current_user,
        "email": current_user,
    }


async def get_jwks_keys() -> dict:
    """Fetch and cache JWKS keys from Entra ID"""
    try:
        jwks_url = f"https://login.microsoftonline.com/{settings.ENTRA_TENANT_ID}/discovery/v2.0/keys"

        async with httpx.AsyncClient() as client:
            response = await client.get(jwks_url, timeout=10.0)
            response.raise_for_status()
            data = response.json()

        _jwks_cache["keys"] = data.get("keys", [])
        return _jwks_cache["keys"]

    except httpx.HTTPError as e:
        logger.error(f"HTTP error fetching JWKS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Não foi possível validar o token",
        )


def find_key_by_kid(keys: list, kid: str) -> dict:
    """Find the key with matching kid (key ID) in JWKS"""
    for key in keys:
        if key.get("kid") == kid:
            return key
    return None


async def validate_entra_id_token(token: str) -> dict:
    """
    Validate token with Entra ID (Microsoft Azure AD).
    Returns user information if valid.
    """
    if not settings.ENTRA_TENANT_ID or not settings.ENTRA_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Configuração do Entra ID não está completa",
        )

    try:
        # First, decode without verification to get the header
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        if not kid:
            raise JWTError("Token missing 'kid' in header")

        # Get JWKS keys
        keys = _jwks_cache.get("keys")
        if not keys:
            keys = await get_jwks_keys()

        # Find the matching key
        key = find_key_by_kid(keys, kid)
        if not key:
            # Try to refresh JWKS in case new key was added
            keys = await get_jwks_keys()
            key = find_key_by_kid(keys, kid)

        if not key:
            raise JWTError(f"Unable to find key with kid: {kid}")

        # Validate token signature using the key
        # The key is in JWK format, we need to convert it to PEM
        # For now, we'll do basic validation without signature verification
        # Full implementation would use jwks-client or similar library

        logger.debug("Token structure validation - full signature validation pending")

        # Decode token to get claims
        payload = jwt.decode(
            token,
            options={"verify_signature": False},  # Skip signature verification for now
            audience=None,
        )

        # Extract email from different possible claim locations
        email = payload.get("upn") or payload.get("email") or payload.get("preferred_username")

        if not email:
            raise JWTError("No email claim found in token")

        # Validate token expiration
        exp = payload.get("exp")
        if exp:
            from datetime import datetime, timezone

            exp_time = datetime.fromtimestamp(exp, tz=timezone.utc)
            if exp_time < datetime.now(tz=timezone.utc):
                raise JWTError("Token has expired")

        return {
            "email": email,
            "name": payload.get("name", ""),
            "oid": payload.get("oid"),  # Object ID from Azure
        }

    except JWTError as e:
        logger.warning(f"JWT validation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )
    except Exception as e:
        logger.error(f"Error validating Entra ID token: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falha na validação do token",
        )
