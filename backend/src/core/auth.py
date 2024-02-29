import re

from fastapi import Depends, HTTPException, Request
from jose import jwt

from src.core.config import Settings, get_settings


def get_jwt_from_cookies(request: Request):
    pattern = re.compile(r"CognitoIdentityServiceProvider\..+\.idToken")

    for cookie_name, cookie_value in request.cookies.items():
        if pattern.match(cookie_name):
            return cookie_value

    raise HTTPException(status_code=401, detail="JWT token not found in cookies")


def get_current_user(request: Request, settings: Settings = Depends(get_settings)):
    if settings.env == "local":
        return "local-user"

    jwt_token = get_jwt_from_cookies(request)

    try:
        decoded_token = jwt.decode(
            jwt_token,
            key=settings.cognito_public_key,
            algorithms=["RS256"],
            audience=settings.cognito_user_pool_client_id,
            options={"verify_signature": True, "verify_at_hash": False},
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = decoded_token.get("sub")

    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found in the token")

    return user_id
