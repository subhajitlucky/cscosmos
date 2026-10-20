"use client";

import { type FormEvent, useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(payload.error || "Could not send the sign-in link.");
        return;
      }

      setStatus("success");
      setMessage(payload.message || "Check your inbox for a sign-in link.");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none"
          autoComplete="email"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-foreground px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {status === "loading" ? "Sending…" : "Email me a sign-in link"}
      </button>

      {message && (
        <p className={`text-sm ${status === "success" ? "text-emerald-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        No password. The link expires in 15 minutes and can be used once. Signing in syncs
        progress, bookmarks, and notes across devices.
      </p>
    </form>
  );
}
