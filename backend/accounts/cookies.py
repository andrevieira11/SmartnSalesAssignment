import secrets

from django.conf import settings


def _lifetime_seconds(key):
    return int(settings.SIMPLE_JWT[key].total_seconds())


def _common_flags():
    return dict(
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        domain=settings.AUTH_COOKIE_DOMAIN,
        path="/",
    )


def set_auth_cookies(response, access, refresh):
    """Set HttpOnly JWT cookies plus a readable double-submit CSRF cookie."""
    flags = _common_flags()
    response.set_cookie(
        settings.AUTH_COOKIE_ACCESS, access, httponly=True,
        max_age=_lifetime_seconds("ACCESS_TOKEN_LIFETIME"), **flags,
    )
    response.set_cookie(
        settings.AUTH_COOKIE_REFRESH, refresh, httponly=True,
        max_age=_lifetime_seconds("REFRESH_TOKEN_LIFETIME"), **flags,
    )
    response.set_cookie(
        settings.CSRF_DS_COOKIE, secrets.token_urlsafe(32), httponly=False,
        max_age=_lifetime_seconds("REFRESH_TOKEN_LIFETIME"), **flags,
    )
    return response


def clear_auth_cookies(response):
    for name in (settings.AUTH_COOKIE_ACCESS, settings.AUTH_COOKIE_REFRESH, settings.CSRF_DS_COOKIE):
        response.delete_cookie(
            name, path="/", domain=settings.AUTH_COOKIE_DOMAIN,
            samesite=settings.AUTH_COOKIE_SAMESITE,
        )
    return response
