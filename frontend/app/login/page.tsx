import Link from "next/link";

import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Sign in to your task board.</p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
        <p className="mt-4 text-sm text-muted">
          No account?{" "}
          <Link href="/register" className="font-medium text-ink underline">
            Create one
          </Link>
        </p>
      </div>
      <p className="mt-4 text-center text-xs text-muted">Demo login: demo / demo12345</p>
    </main>
  );
}
