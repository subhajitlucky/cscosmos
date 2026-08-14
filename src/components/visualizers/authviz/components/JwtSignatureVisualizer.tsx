'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Key, Lock, RefreshCw, RotateCcw, ShieldAlert, ShieldCheck, Sparkles, XCircle } from 'lucide-react';

export function JwtSignatureVisualizer() {
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [alg, setAlg] = useState<'RS256' | 'none'>('RS256');
  const [tampered, setTampered] = useState<boolean>(false);

  const header = JSON.stringify({ alg, typ: 'JWT' }, null, 2);
  const payload = JSON.stringify(
    {
      sub: 'usr_42',
      name: 'Alice Johnson',
      role: role,
      exp: 1723650000,
      iss: 'https://auth.corp.io'
    },
    null,
    2
  );

  const isSignatureValid = alg === 'RS256' && !tampered;

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Cryptographic Token Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              JWT Header, Payload &amp; RS256 Signature Inspector
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          isSignatureValid
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
        }`}>
          {isSignatureValid ? '✅ SIGNATURE VALID (200 OK)' : '🚨 SIGNATURE INVALID / FORGED (401)'}
        </span>
      </div>

      {/* 3 JWT Sections */}
      <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Header */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/50 space-y-2 shadow-inner">
          <div className="text-rose-400 font-bold border-b border-slate-800 pb-1">
            1. Header (Algorithm &amp; Type):
          </div>
          <pre className="text-rose-300 text-[11px] leading-relaxed whitespace-pre">{header}</pre>
        </div>

        {/* Payload */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-sky-900/50 space-y-2 shadow-inner">
          <div className="text-sky-400 font-bold border-b border-slate-800 pb-1">
            2. Payload (Claims):
          </div>
          <pre className="text-sky-300 text-[11px] leading-relaxed whitespace-pre">{payload}</pre>
        </div>

        {/* Signature */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-900/50 space-y-2 shadow-inner">
          <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1">
            3. Digital Signature:
          </div>
          <div className="text-[11px] leading-relaxed text-slate-300">
            {alg === 'none' ? (
              <span className="text-rose-400 font-bold">[ Unsigned - alg: none ]</span>
            ) : tampered ? (
              <span className="text-rose-400 font-bold">
                RS256(tampered_payload, privateKey) ❌ Mismatch!
              </span>
            ) : (
              <span className="text-emerald-400 font-bold">
                RS256(header.payload, privateKey) ✅ Authentic!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Attack Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            setRole('USER');
            setAlg('RS256');
            setTampered(false);
          }}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Legitimate Token</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => {
              setRole('ADMIN');
              setTampered(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-md"
          >
            Tamper Role: USER ➔ ADMIN
          </button>

          <button
            onClick={() => {
              setAlg(alg === 'RS256' ? 'none' : 'RS256');
              setTampered(alg === 'RS256');
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-md"
          >
            Toggle "alg: none" Exploit
          </button>
        </div>
      </div>
    </div>
  );
}
