// Server components talk to Django container-to-container; the browser goes via nginx.
export const INTERNAL_API_URL = process.env.INTERNAL_API_URL || "http://backend:8000";
export const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const ACCESS_COOKIE = "access_token";
export const CSRF_COOKIE = "csrf_token";
export const CSRF_HEADER = "X-CSRF-Token";
