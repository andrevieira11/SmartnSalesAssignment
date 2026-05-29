import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { INTERNAL_API_URL } from "./config";

// Server-side GET: forwards the browser's cookies to Django, never caches.
export async function serverGet<T>(path: string): Promise<T> {
  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const res = await fetch(`${INTERNAL_API_URL}${path}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`Request to ${path} failed with ${res.status}`);
  return res.json() as Promise<T>;
}
