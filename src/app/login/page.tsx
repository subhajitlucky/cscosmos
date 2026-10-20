import type { Metadata } from "next";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { getSessionUser } from "@/lib/auth-server";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in - CSCosmos",
  description: "Passwordless sign-in for CSCosmos learning sync.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [user, params] = await Promise.all([getSessionUser(), searchParams]);
  const error =
    params.error === "expired"
      ? "That sign-in link expired or was already used."
      : params.error
        ? "That sign-in link is invalid."
        : null;

  return (
    <div className="py-16 md:py-24">
      <div className="page-container max-w-lg space-y-8">
        <header className="space-y-3">
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
            Account
          </p>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Sync your learning.
          </h1>
          <p className="text-muted-foreground">
            Passwordless email links. Progress, bookmarks, and notes follow you across
            devices.
          </p>
        </header>

        <div className="glass-card rounded-2xl border p-6">
          {user ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="text-lg font-semibold text-foreground">{user.email}</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/progress"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-4 text-xs font-semibold text-background"
                >
                  Open progress
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-xs font-semibold text-foreground hover:bg-secondary/40"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                  {error}
                </p>
              )}
              <LoginForm />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
