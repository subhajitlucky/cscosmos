'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Gauge, RefreshCw, RotateCcw, ShieldAlert, ShieldCheck, Sparkles, Zap } from 'lucide-react';

type LimiterAlgo = 'token-bucket' | 'leaky-bucket' | 'sliding-window';

export function RateLimiterVisualizer() {
  const [algo, setAlgo] = useState<LimiterAlgo>('token-bucket');
  const [tokens, setTokens] = useState<number>(8); // out of 10
  const [queue, setQueue] = useState<number>(2); // out of 5
  const [windowReqs, setWindowReqs] = useState<number>(7); // out of 10
  const [log, setLog] = useState<string>('Rate Limiter running. Token bucket has 8/10 tokens available.');

  const handleSendRequest = () => {
    if (algo === 'token-bucket') {
      if (tokens > 0) {
        setTokens((prev) => prev - 1);
        setLog(`HTTP 200 OK: 1 token consumed. ${tokens - 1} tokens remaining in bucket.`);
      } else {
        setLog(`🚨 HTTP 429 TOO MANY REQUESTS: Token bucket empty! Request throttled.`);
      }
    } else if (algo === 'leaky-bucket') {
      if (queue < 5) {
        setQueue((prev) => prev + 1);
        setLog(`HTTP 200 OK: Request buffered in FIFO queue (${queue + 1}/5). Leaking at 1 req/sec.`);
      } else {
        setLog(`🚨 HTTP 429 TOO MANY REQUESTS: Leaky bucket buffer overflow! Request dropped.`);
      }
    } else {
      if (windowReqs < 10) {
        setWindowReqs((prev) => prev + 1);
        setLog(`HTTP 200 OK: Sliding window counter incremented to ${windowReqs + 1}/10 req/min.`);
      } else {
        setLog(`🚨 HTTP 429 TOO MANY REQUESTS: Sliding window rate limit exceeded (10 req/min)!`);
      }
    }
  };

  const handleRefill = () => {
    setTokens(10);
    setQueue(0);
    setWindowReqs(0);
    setLog('Reset counters and refilled capacity.');
  };

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              API Gateway Traffic Shaping
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Distributed Rate Limiter Simulator
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          {algo.toUpperCase()} ALGORITHM
        </span>
      </div>

      {/* Algorithm Selector */}
      <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
        <button
          onClick={() => setAlgo('token-bucket')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            algo === 'token-bucket'
              ? 'bg-indigo-600 text-white font-bold shadow-md border-indigo-500'
              : 'bg-card border-border text-foreground hover:border-indigo-500'
          }`}
        >
          <div className="font-bold">1. Token Bucket</div>
          <div className={`text-[10px] ${algo === 'token-bucket' ? 'text-indigo-100' : 'text-muted-foreground'}`}>
            Supports bursts + constant refill
          </div>
        </button>

        <button
          onClick={() => setAlgo('leaky-bucket')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            algo === 'leaky-bucket'
              ? 'bg-indigo-600 text-white font-bold shadow-md border-indigo-500'
              : 'bg-card border-border text-foreground hover:border-indigo-500'
          }`}
        >
          <div className="font-bold">2. Leaky Bucket</div>
          <div className={`text-[10px] ${algo === 'leaky-bucket' ? 'text-indigo-100' : 'text-muted-foreground'}`}>
            Strict constant smoothed output
          </div>
        </button>

        <button
          onClick={() => setAlgo('sliding-window')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            algo === 'sliding-window'
              ? 'bg-indigo-600 text-white font-bold shadow-md border-indigo-500'
              : 'bg-card border-border text-foreground hover:border-indigo-500'
          }`}
        >
          <div className="font-bold">3. Sliding Window Counter</div>
          <div className={`text-[10px] ${algo === 'sliding-window' ? 'text-indigo-100' : 'text-muted-foreground'}`}>
            Eliminates 2x boundary spikes
          </div>
        </button>
      </div>

      {/* Visual Capacity Meter */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400">Current Gateway Capacity Utilization:</span>
          <span className="text-indigo-400 font-bold">
            {algo === 'token-bucket'
              ? `${tokens} / 10 Tokens Available`
              : algo === 'leaky-bucket'
              ? `${queue} / 5 In Queue`
              : `${windowReqs} / 10 Requests In Window`}
          </span>
        </div>

        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
            style={{
              width: `${
                algo === 'token-bucket'
                  ? (tokens / 10) * 100
                  : algo === 'leaky-bucket'
                  ? (queue / 5) * 100
                  : (windowReqs / 10) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-indigo-400 font-bold">Traffic Gateway Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleRefill}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refill / Reset</span>
        </button>

        <button
          onClick={handleSendRequest}
          className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Send API Request (Fire HTTP Call)</span>
        </button>
      </div>
    </div>
  );
}
