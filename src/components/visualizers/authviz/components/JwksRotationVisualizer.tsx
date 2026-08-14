'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Key, Lock, RefreshCw, RotateCcw, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export function JwksRotationVisualizer() {
  const [activeKid, setActiveKid] = useState<'key_2026_q1' | 'key_2026_q2'>('key_2026_q1');
  const [rotated, setRotated] = useState<boolean>(false);
  const [log, setLog] = useState<string>('API Gateway caching JWKS public key set from auth.corp.io/.well-known/jwks.json.');

  const handleRotate = () => {
    setActiveKid('key_2026_q2');
    setRotated(true);
    setLog('⚡ KEY ROTATION EXECUTED: IdP generated new RS256 keypair (kid: "key_2026_q2"). API Gateway fetched new public key from JWKS endpoint and verified token with ZERO downtime!');
  };

  const handleReset = () => {
    setActiveKid('key_2026_q1');
    setRotated(false);
    setLog('Reset JWKS key rotation.');
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Enterprise Identity Federation
            </div>
            <h3 className="text-xl font-bold text-foreground">
              OIDC Discovery &amp; JWKS Public Key Rotation Simulator
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Active IdP Key: {activeKid}
        </span>
      </div>

      {/* JWKS JSON View */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* /.well-known/jwks.json */}
        <div className="p-4 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <span className="text-emerald-400 font-bold block">auth.corp.io/.well-known/jwks.json:</span>
          <pre className="text-[11px] text-emerald-300 whitespace-pre leading-relaxed overflow-x-auto">
{`{
  "keys": [
    {
      "kty": "RSA",
      "kid": "key_2026_q1",
      "alg": "RS256",
      "use": "sig",
      "n": "u1g...q1_modulus..."
    }${rotated ? `,\n    {\n      "kty": "RSA",\n      "kid": "key_2026_q2",\n      "alg": "RS256",\n      "use": "sig",\n      "n": "v8f...q2_modulus..."\n    }` : ''}
  ]
}`}
          </pre>
        </div>

        {/* Incoming JWT Header Resolution */}
        <div className="p-4 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <span className="text-sky-400 font-bold block">Incoming JWT Header (API Gateway):</span>
          <pre className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-sky-300 whitespace-pre leading-relaxed">
{`{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "${activeKid}"
}`}
          </pre>
          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
            ✅ Gateway matched kid="{activeKid}" in local JWKS cache. Token verified!
          </div>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-emerald-400 font-bold">Gateway Log:</span>
        <p className="text-slate-300 leading-relaxed text-[11px]">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          onClick={handleRotate}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Rotate IdP Signing Key (Zero-Downtime)</span>
        </button>
      </div>
    </div>
  );
}
