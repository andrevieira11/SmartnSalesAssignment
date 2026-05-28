from django.conf import settings
from django.http import JsonResponse

UNSAFE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
# Bootstrap routes that cannot carry a CSRF token yet (no cookie issued).
EXEMPT_PREFIXES = ("/api/auth/login", "/api/auth/register")


class CsrfDoubleSubmitMiddleware:
    """Stateless double-submit CSRF guard for cookie-JWT API routes.

    A mutation must send the CSRF cookie value back in a header; an attacker's
    cross-site request can ride the cookie but cannot read or set the header.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if self._requires_check(request):
            cookie = request.COOKIES.get(settings.CSRF_DS_COOKIE)
            header = request.headers.get(settings.CSRF_DS_HEADER)
            if not cookie or header != cookie:
                return JsonResponse({"detail": "CSRF token missing or invalid."}, status=403)
        return self.get_response(request)

    @staticmethod
    def _requires_check(request):
        path = request.path
        if not path.startswith("/api/") or request.method not in UNSAFE_METHODS:
            return False
        return not any(path.startswith(p) for p in EXEMPT_PREFIXES)
