'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Fingerprint, KeyRound, Lock, RefreshCw, RotateCcw, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export function OAuthPkceVisualizer() {
  const [step, setStep] = useState<number>(0);
  const [log, setLog] = useState<string>('Single Page Application (SPA) ready to start OAuth 2.0 PKCE flow.');

  const steps = [
    {
      title: '1. Generate Code Verifier & Challenge',
      desc: 'Browser generates 64-byte high-entropy Code Verifier in memory, then computes SHA-256 hash (Code Challenge).'
    },
    {
      title: '2. Redirect to Authorization Server',
      desc: 'Browser redirects user to IdP /authorize with client_id, redirect_uri, and code_challenge (method=S256).'
    },
    {
      title: '3. User Logs In & Gets Auth Code',
      desc: 'IdP authenticates user (e.g. via MFA) and redirects back to client callback with a one-time Authorization Code.'
    },
    {
      title: '4. Token Exchange (POST /token)',
      desc: 'Client sends Auth Code + original plain-text Code Verifier to IdP /oauth/token in a direct POST request.'
    },
    {
      title: '5. PKCE Verification & Token Issue',
      desc: 'IdP hashes received Code Verifier. Hash matches stored Code Challenge! IdP issues signed JWT Access & ID tokens.'
    }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setLog(steps[step].desc);
      setStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setLog('Reset PKCE flow.');
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Modern Delegated Authentication
            </div>
            <h3 className="text-xl font-bold text-foreground">
              OAuth 2.0 Authorization Code Flow with PKCE Stepper
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Step {Math.min(step, 5)} of 5
        </span>
      </div>

      {/* Interactive Cryptographic State Cards */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Client Browser Side */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-emerald-400 font-bold">Client Browser Memory (Private):</span>
            <span className="text-slate-500">Origin: localhost:3000</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div>
              <span className="text-slate-500">Code Verifier: </span>
              <span className={step >= 1 ? 'text-amber-300 font-bold' : 'text-slate-600'}>
                {step >= 1 ? 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk' : '[ Not generated ]'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Code Challenge (S256): </span>
              <span className={step >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {step >= 1 ? 'E9Melhoa2OwvFrGMTJguCH5rtG6479bPWSMN' : '[ Not computed ]'}
              </span>
            </div>
          </div>
        </div>

        {/* Authorization Server Side */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-sky-400 font-bold">Authorization Server (IdP):</span>
            <span className="text-slate-500">auth.company.io</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div>
              <span className="text-slate-500">Stored Challenge: </span>
              <span className={step >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {step >= 2 ? 'E9Melhoa2OwvFrGMTJguCH5rtG6479bPWSMN' : '[ None ]'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Auth Code Issued: </span>
              <span className={step >= 3 ? 'text-amber-300 font-bold' : 'text-slate-600'}>
                {step >= 3 ? 'splat_code_8842 (Single-Use)' : '[ None ]'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Tokens Emitted: </span>
              <span className={step >= 5 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {step >= 5 ? '✅ JWT Access Token + ID Token' : '[ Pending ]'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-emerald-400 font-bold">Protocol Trace:</span>
        <p className="text-slate-300 leading-relaxed text-[11px]">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Flow</span>
        </button>

        <button
          onClick={handleNext}
          disabled={step >= 5}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Execute Next Step ({step}/5)</span>
        </button>
      </div>
    </div>
  );
}
