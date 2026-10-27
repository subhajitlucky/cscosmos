'use client';

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, KeyRound, RotateCcw, ShieldAlert, User } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

/**
 * Login CSRF / OAuth state-binding flow.
 *
 * Deliberately generic: an attacker-controlled third-party app session, a
 * victim browser, and an identity provider. No real product or company is
 * named, because this pattern is a class of bug, not one vendor's incident.
 */
const STEPS = [
  {
    title: "The attacker gets a claim ticket",
    detail:
      "The attacker starts a login in their own app session. The server returns a signed link that names the attacker's session: /authorize?session_id=ATTACKER. The signature proves the server made the link, not who will open it.",
    packet: "signed /authorize?session_id=ATTACKER",
    active: "attacker",
    attacker: "Starts login",
    victim: "Not involved yet",
    app: "session_id = ATTACKER",
    tone: "info" as const,
  },
  {
    title: "The attacker forwards the link",
    detail:
      "The link points at the real service, so it looks trustworthy. The attacker sends it to the victim. Nothing in the URL says the session belongs to the attacker.",
    packet: "real login link → victim",
    active: "victim",
    attacker: "Sends the link",
    victim: "Sees a real domain",
    app: "session_id = ATTACKER",
    tone: "info" as const,
  },
  {
    title: "The victim logs in normally",
    detail:
      "The victim authenticates with the identity provider. The provider redirects back to /callback with a one-time request_token and the session_id that was forwarded as redirect_params.",
    packet: "request_token + redirect_params → /callback",
    active: "victim",
    attacker: "Waits",
    victim: "Logs in with MFA",
    app: "exchanges request_token",
    tone: "info" as const,
  },
  {
    title: "The token lands on the attacker's session",
    detail:
      "The callback verifies the HMAC, then attaches the victim's access token to the session named in the URL. That session is the attacker's. The server never checks that the browser finishing the login is the browser that started it.",
    packet: "victim access token → session ATTACKER",
    active: "app",
    attacker: "Now holds a valid token",
    victim: "Thinks login succeeded",
    app: "session_id = ATTACKER + victim token",
    tone: "bad" as const,
  },
  {
    title: "The attacker reuses the session",
    detail:
      "The attacker sends requests with the same session ID and calls the app's tools: read profile, read holdings, place an order. No password was stolen. The authorization was simply attached to the wrong session.",
    packet: "profile + holdings + order",
    active: "attacker",
    attacker: "Reads and acts as the victim",
    victim: "Unaffected browser",
    app: "serves the attacker's session",
    tone: "bad" as const,
  },
  {
    title: "Fix: bind state to the browser",
    detail:
      "On /authorize, set a random state nonce in an HttpOnly cookie and send the same value to the provider. On /callback, require the cookie and compare it constant-time with the returned state. Make it single-use and rotate the session ID after login.",
    packet: "state cookie ↔ callback state",
    active: "app",
    attacker: "Stale link fails",
    victim: "Only their own login completes",
    app: "state mismatch → reject",
    tone: "good" as const,
  },
];

const toneClasses = {
  info: "border-sky-500/40 bg-sky-500/5",
  bad: "border-rose-500/40 bg-rose-500/5",
  good: "border-emerald-500/40 bg-emerald-500/5",
};

export function LoginCsrfFlow() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const reset = () => setStep(0);
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));

  return (
    <div className={`border rounded-xl p-6 sm:p-8 space-y-6 ${toneClasses[current.tone]}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <ShieldAlert className="h-4 w-4" />
          VISUALIZATION: LOGIN CSRF / OAUTH STATE
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div
          className={`rounded-xl border p-4 transition-all ${
            current.active === "attacker"
              ? "border-rose-500 bg-rose-500/10 shadow-sm"
              : "border-border/70 bg-background/60"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <span className="text-xl">😈</span> Attacker
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{current.attacker}</p>
        </div>

        <div
          className={`rounded-xl border p-4 transition-all ${
            current.active === "victim"
              ? "border-sky-500 bg-sky-500/10 shadow-sm"
              : "border-border/70 bg-background/60"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            <User className="h-4 w-4" /> Victim browser
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{current.victim}</p>
        </div>

        <div
          className={`rounded-xl border p-4 transition-all ${
            current.active === "app"
              ? "border-amber-500 bg-amber-500/10 shadow-sm"
              : "border-border/70 bg-background/60"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <KeyRound className="h-4 w-4" /> App + IdP
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{current.app}</p>
        </div>
      </div>

      {current.packet && (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background/70 px-3 py-2 text-center text-[11px] font-mono text-muted-foreground"
        >
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          {current.packet}
        </motion.div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-foreground">{current.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{current.detail}</p>
      </div>

      {current.tone === "good" && (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            A signed session ID is not a CSRF token: the attacker can legitimately obtain a
            signed URL for their own session. Bind the OAuth state to the browser, make it
            single-use, and rotate the session after login.
          </span>
        </div>
      )}

      {current.tone === "bad" && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            The victim&apos;s token is now attached to the attacker&apos;s session. Every tool
            the app exposes — read profile, holdings, orders, even trades — is available to
            the attacker.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border/60 pt-4">
        <Button onClick={reset} variant="outline" disabled={step === 0} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button onClick={next} disabled={step === STEPS.length - 1} className="gap-2">
          {step === STEPS.length - 2 ? "Show the fix" : step === STEPS.length - 1 ? "Done" : "Next step"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
