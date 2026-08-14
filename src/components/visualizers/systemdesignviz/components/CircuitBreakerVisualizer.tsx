'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Flame, RefreshCw, RotateCcw, ShieldAlert, ShieldCheck, Sparkles, Zap } from 'lucide-react';

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export function CircuitBreakerVisualizer() {
  const [state, setState] = useState<CircuitState>('CLOSED');
  const [failureCount, setFailureCount] = useState<number>(0);
  const failureThreshold = 5;
  const [log, setLog] = useState<string>('Circuit Breaker is CLOSED (Normal healthy operation). Traffic flowing to downstream DB.');

  const handleSuccess = () => {
    if (state === 'HALF_OPEN') {
      setState('CLOSED');
      setFailureCount(0);
      setLog('✅ CANARY PROBE SUCCESSFUL: Downstream service recovered! Circuit transitioned from HALF-OPEN back to CLOSED.');
    } else if (state === 'CLOSED') {
      setFailureCount(0);
      setLog('HTTP 200 OK: Downstream database responded successfully in 12ms.');
    } else {
      setLog('🚨 FAST FAIL: Circuit is OPEN! Request blocked immediately at API Gateway (0ms latency, zero load on DB).');
    }
  };

  const handleFailure = () => {
    if (state === 'CLOSED') {
      const nextFail = failureCount + 1;
      setFailureCount(nextFail);
      if (nextFail >= failureThreshold) {
        setState('OPEN');
        setLog(`🚨 CIRCUIT TRIPPED TO OPEN: ${failureThreshold} consecutive database timeouts detected! All subsequent traffic will fast-fail to protect database from total collapse.`);
      } else {
        setLog(`HTTP 504 Gateway Timeout: Failure #${nextFail}/${failureThreshold} recorded.`);
      }
    } else if (state === 'HALF_OPEN') {
      setState('OPEN');
      setLog('🚨 CANARY PROBE FAILED: Downstream service is still down! Circuit immediately tripped back to OPEN.');
    } else {
      setLog('🚨 FAST FAIL: Circuit is OPEN. Request rejected in 0ms without hitting failing database.');
    }
  };

  const handleTimeoutCooldown = () => {
    if (state === 'OPEN') {
      setState('HALF_OPEN');
      setLog('⏳ 10-SECOND SLEEP WINDOW EXPIRED: Circuit transitioned to HALF-OPEN. Ready to send a single canary probe request to test recovery.');
    }
  };

  const handleReset = () => {
    setState('CLOSED');
    setFailureCount(0);
    setLog('Reset Circuit Breaker to CLOSED.');
  };

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Resilience &amp; Fault Tolerance
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Circuit Breaker &amp; Cascading Failure Prevention Stepper
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 ${
          state === 'CLOSED'
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : state === 'OPEN'
            ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
        }`}>
          {state === 'CLOSED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : state === 'OPEN' ? <ShieldAlert className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          STATE: {state}
        </span>
      </div>

      {/* 3 State Cards */}
      <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
          state === 'CLOSED'
            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-100 ring-2 ring-emerald-400 font-bold scale-105 shadow-md'
            : 'border-slate-800 bg-slate-900 text-slate-500'
        }`}>
          <div className="font-extrabold">1. CLOSED (Normal)</div>
          <p className="text-[10px] text-slate-300">All traffic passes through. Failures counted: {failureCount}/{failureThreshold}</p>
        </div>

        <div className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
          state === 'OPEN'
            ? 'border-rose-500 bg-rose-500/20 text-rose-100 ring-2 ring-rose-400 font-bold scale-105 shadow-md'
            : 'border-slate-800 bg-slate-900 text-slate-500'
        }`}>
          <div className="font-extrabold">2. OPEN (Fast-Fail)</div>
          <p className="text-[10px] text-slate-300">100% traffic rejected immediately. DB given breathing room.</p>
        </div>

        <div className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
          state === 'HALF_OPEN'
            ? 'border-amber-500 bg-amber-500/20 text-amber-100 ring-2 ring-amber-400 font-bold scale-105 shadow-md'
            : 'border-slate-800 bg-slate-900 text-slate-500'
        }`}>
          <div className="font-extrabold">3. HALF-OPEN (Canary)</div>
          <p className="text-[10px] text-slate-300">Sends 1 trial probe request to test backend recovery.</p>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-indigo-400 font-bold">Circuit Event Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Circuit</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {state === 'OPEN' && (
            <button
              onClick={handleTimeoutCooldown}
              className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition shadow-md"
            >
              Simulate 10s Sleep Expiry (➔ HALF-OPEN)
            </button>
          )}

          <button
            onClick={handleFailure}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Simulate DB Failure (Timeout)</span>
          </button>

          <button
            onClick={handleSuccess}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Simulate DB Success (200 OK)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
