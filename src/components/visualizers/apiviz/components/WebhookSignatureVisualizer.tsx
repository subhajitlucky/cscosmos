'use client';

import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Lock, RefreshCw, RotateCcw, ShieldAlert, ShieldCheck, Sparkles, XCircle, Zap } from 'lucide-react';

export function WebhookSignatureVisualizer() {
  const [tampered, setTampered] = useState<boolean>(false);
  const [replayed, setReplayed] = useState<boolean>(false);
  const [log, setLog] = useState<string>('Webhook receiver endpoint listening. Ready to evaluate signature.');

  const handleValid = () => {
    setTampered(false);
    setReplayed(false);
    setLog('✅ HTTP 200 OK: HMAC-SHA256 signature verified with timingSafeEqual() & timestamp is 30s fresh. Payload queued for background async worker!');
  };

  const handleTamper = () => {
    setTampered(true);
    setReplayed(false);
    setLog('🚨 HTTP 401 UNAUTHORIZED: Signature mismatch! Attacker altered payload from "$100" to "$10,000". Webhook rejected immediately.');
  };

  const handleReplay = () => {
    setTampered(false);
    setReplayed(true);
    setLog('🚨 HTTP 400 BAD REQUEST: Timestamp expired (> 300 seconds old)! Replay attack blocked.');
  };

  const handleReset = () => {
    setTampered(false);
    setReplayed(false);
    setLog('Reset webhook verification simulator.');
  };

  return (
    <div className="rounded-3xl border border-pink-500/30 bg-pink-500/5 dark:bg-pink-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-md">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-400">
              API Security &amp; Webhook Integrity
            </div>
            <h3 className="text-xl font-bold text-foreground">
              HMAC-SHA256 Signature Verification &amp; Replay Defense
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          tampered || replayed
            ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
            : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
        }`}>
          {tampered ? '🚨 TAMPERED (401)' : replayed ? '🚨 REPLAY ATTACK (400)' : '✅ AUTHENTICATED (200)'}
        </span>
      </div>

      {/* Header & Body Visualizer */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Webhook Headers */}
        <div className="p-4 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <span className="text-pink-400 font-bold block">HTTP Headers:</span>
          <div className="space-y-1 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Stripe-Signature: </span>
              <span className={tampered ? 'text-rose-400' : 'text-emerald-300'}>
                t=1723650000,v1=9e8b7c6d5e4f...
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500">Timestamp Age: </span>
              <span className={replayed ? 'text-rose-400 font-bold' : 'text-emerald-300'}>
                {replayed ? '600 seconds (EXPIRED)' : '30 seconds (FRESH)'}
              </span>
            </div>
          </div>
        </div>

        {/* Payload */}
        <div className="p-4 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <span className="text-pink-400 font-bold block">Webhook JSON Payload:</span>
          <pre className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
{`{
  "event": "charge.succeeded",
  "amount": ${tampered ? 1000000 : 10000},
  "customer": "cus_9281a"
}`}
          </pre>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-pink-400 font-bold">Verification Result:</span>
        <p className="text-slate-300 leading-relaxed text-[11px]">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTamper}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md"
          >
            Simulate Payload Tampering
          </button>

          <button
            onClick={handleReplay}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md"
          >
            Simulate 10m Replay Attack
          </button>

          <button
            onClick={handleValid}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Send Authentic Webhook (200 OK)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
