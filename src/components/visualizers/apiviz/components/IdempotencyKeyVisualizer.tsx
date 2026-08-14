'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, DollarSign, Lock, RefreshCw, RotateCcw, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export function IdempotencyKeyVisualizer() {
  const [key, setKey] = useState<string>('pay_req_8923a');
  const [balance, setBalance] = useState<number>(1000);
  const [cachedKeys, setCachedKeys] = useState<Map<string, string>>(new Map());
  const [log, setLog] = useState<string>('Ready to initiate payment. Idempotency Key: pay_req_8923a.');

  const handleCharge = (targetKey: string) => {
    if (cachedKeys.has(targetKey)) {
      setLog(`⚡ IDEMPOTENT REPLAY: Key "${targetKey}" found in Redis cache! Safely returned previous transaction response. Customer balance NOT charged again! ✅`);
    } else {
      setBalance((prev) => prev - 100);
      setCachedKeys((prev) => new Map(prev).set(targetKey, JSON.stringify({ status: 'succeeded', amount: 100, txId: 'tx_99' })));
      setLog(`💳 FIRST-TIME CHARGE: Key "${targetKey}" processed. $100 charged. Result cached in Redis with 24-hour TTL.`);
    }
  };

  const handleReset = () => {
    setBalance(1000);
    setCachedKeys(new Map());
    setKey('pay_req_8923a');
    setLog('Reset balances and cleared Redis idempotency cache.');
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
              Payment &amp; Mutation Resilience
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Idempotency Key &amp; Safe Retries Engine
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Account Balance: ${balance}
        </span>
      </div>

      {/* Request Header Input */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-2 font-mono text-xs shadow-sm">
        <span className="text-muted-foreground block font-bold">HTTP Request Header:</span>
        <div className="flex gap-2">
          <div className="px-3 py-2.5 rounded-xl bg-slate-900 text-slate-400 font-bold">
            Idempotency-Key:
          </div>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 text-pink-300 font-mono text-xs border border-border outline-none shadow-inner"
          />
        </div>
      </div>

      {/* Redis Cache & Log View */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Redis Idempotency Store */}
        <div className="p-4 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <span className="text-pink-400 font-bold block">Redis Idempotency Store (24h TTL):</span>
          <div className="space-y-1">
            {cachedKeys.size === 0 ? (
              <span className="text-slate-600">[ No cached keys yet ]</span>
            ) : (
              Array.from(cachedKeys.entries()).map(([k, v]) => (
                <div key={k} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px]">
                  <div className="text-emerald-300 font-bold">{k}</div>
                  <div className="text-slate-400">{v}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Execution Log */}
        <div className="p-4 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-2 shadow-inner">
          <span className="text-pink-400 font-bold block">Gateway Log:</span>
          <p className="text-slate-300 leading-relaxed text-[11px]">{log}</p>
        </div>
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
            onClick={() => handleCharge(key)}
            className="px-6 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Send $100 Payment (POST /charges)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
