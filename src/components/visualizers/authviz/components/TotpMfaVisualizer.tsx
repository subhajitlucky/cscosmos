'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Key, Lock, RefreshCw, RotateCcw, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export function TotpMfaVisualizer() {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(18);
  const [totpCode, setTotpCode] = useState<string>('849 201');
  const [counter, setCounter] = useState<number>(57455000);

  const handleRefresh = () => {
    const randomCode = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
    setTotpCode(randomCode);
    setCounter((prev) => prev + 1);
    setSecondsRemaining(30);
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Multi-Factor Authentication (MFA)
            </div>
            <h3 className="text-xl font-bold text-foreground">
              TOTP RFC 6238 30-Second Timestep &amp; HMAC-SHA1 Visualizer
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          {secondsRemaining}s Remaining
        </span>
      </div>

      {/* Interactive TOTP Dial */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Live Authenticator Display */}
        <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 shadow-inner flex flex-col justify-between items-center text-center">
          <span className="text-slate-400 text-xs">Google / 1Password Authenticator:</span>
          
          <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-widest py-2 font-mono">
            {totpCode}
          </div>

          <div className="w-full space-y-1">
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000 rounded-full"
                style={{ width: `${(secondsRemaining / 30) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Rotating every 30 seconds</span>
          </div>
        </div>

        {/* RFC 6238 Math Breakdown */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1">
            RFC 6238 Algorithmic Derivation:
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div><strong>1. Secret Key:</strong> <span className="text-slate-400">JBSWY3DPEHPK3PXP (Base32)</span></div>
            <div><strong>2. 30s Time Counter (T):</strong> <span className="text-amber-300">{counter}</span></div>
            <div><strong>3. HMAC-SHA1(K, T):</strong> <span className="text-sky-300">1f4a9b...20-byte hash</span></div>
            <div><strong>4. Dynamic Truncation:</strong> <span className="text-slate-400">Offset = hash[19] &amp; 0x0F</span></div>
            <div><strong>5. Modulo 10^6:</strong> <span className="text-emerald-400 font-bold">{totpCode}</span></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <span className="text-xs text-muted-foreground font-mono">
          Shared secret stored offline in client and server
        </span>

        <button
          onClick={handleRefresh}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Advance 30-Second Timestep</span>
        </button>
      </div>
    </div>
  );
}
