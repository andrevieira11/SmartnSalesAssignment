"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField, inputClass } from "@/components/ui/FormField";
import { login, registerUser } from "@/lib/client-api";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res =
      mode === "login"
        ? await login(username, password)
        : await registerUser(username, email, password);
    setPending(false);
    if (res.ok) {
      router.push("/board");
      router.refresh();
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.detail || Object.values(data).flat().join(" ") || "Something went wrong.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Username" htmlFor="username">
        <input id="username" className={inputClass} value={username}
          onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
      </FormField>
      {mode === "register" && (
        <FormField label="Email" htmlFor="email">
          <input id="email" type="email" className={inputClass} value={email}
            onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </FormField>
      )}
      <FormField label="Password" htmlFor="password">
        <input id="password" type="password" className={inputClass} value={password}
          onChange={(e) => setPassword(e.target.value)} required
          autoComplete={mode === "login" ? "current-password" : "new-password"} />
      </FormField>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}
