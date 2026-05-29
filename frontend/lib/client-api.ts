import { CSRF_COOKIE, CSRF_HEADER, PUBLIC_API_URL } from "./config";

function readCookie(name: string): string {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

function request(path: string, options: RequestInit): Promise<Response> {
  return fetch(`${PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      [CSRF_HEADER]: readCookie(CSRF_COOKIE),
      ...(options.headers || {}),
    },
  });
}

// Mutations retry once through a token refresh before giving up.
export async function apiMutate(path: string, method: string, body?: unknown): Promise<Response> {
  const init: RequestInit = { method, body: body ? JSON.stringify(body) : undefined };
  let res = await request(path, init);
  if (res.status === 401) {
    const refreshed = await request("/auth/refresh/", { method: "POST" });
    if (refreshed.ok) res = await request(path, init);
  }
  return res;
}

export function login(username: string, password: string): Promise<Response> {
  return request("/auth/login/", { method: "POST", body: JSON.stringify({ username, password }) });
}

export function registerUser(username: string, email: string, password: string): Promise<Response> {
  return request("/auth/register/", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function logout(): Promise<Response> {
  return apiMutate("/auth/logout/", "POST");
}
