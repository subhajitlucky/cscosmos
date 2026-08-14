'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Play, RotateCcw, Zap, AlertTriangle, CheckCircle2, ShieldCheck, Clock, Activity } from 'lucide-react';

export function CircuitLab() {
  const [state, setState] = useState<'CLOSED' | 'OPEN' | 'HALF_OPEN'>('CLOSED');
  const [recentCalls, setRecentCalls] = useState<('SUCCESS' | 'FAILURE')[]>([]);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Circuit Breaker initialized in CLOSED state.',
    '[CONFIG] Threshold: 3 failures in sliding window -> trips OPEN for 5s cooldown.'
  ]);

  // Handle OPEN cooldown timer
  useEffect(() => {
    if (state === 'OPEN' && cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining(c => {
          if (c <= 1) {
            setState('HALF_OPEN');
            setLogs(prev => ['[STATE CHANGE] Cooldown expired -> Circuit entered HALF_OPEN (Canary mode)', ...prev.slice(0, 5)]);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, cooldownRemaining]);

  const sendCall = (isSuccess: boolean) => {
    if (state === 'OPEN') {
      setLogs(prev => ['[FAST FAIL] Request rejected immediately in 0ms (Fallback returned)', ...prev.slice(0, 5)]);
      return;
    }

    if (state === 'HALF_OPEN') {
      if (isSuccess) {
        setState('CLOSED');
        setRecentCalls(['SUCCESS']);
        setLogs(prev => ['[RECOVERY] Canary request succeeded -> Circuit CLOSED (Normal operation restored)', ...prev.slice(0, 5)]);
      } else {
        setState('OPEN');
        setCooldownRemaining(5);
        setLogs(prev => ['[TRIP] Canary request failed -> Circuit tripped back to OPEN for 5s', ...prev.slice(0, 5)]);
      }
      return;
    }

    // In CLOSED state
    const newCalls = [...recentCalls.slice(-4), isSuccess ? 'SUCCESS' : 'FAILURE'] as ('SUCCESS' | 'FAILURE')[];
    setRecentCalls(newCalls);

    const failures = newCalls.filter(c => c === 'FAILURE').length;
    if (failures >= 3) {
      setState('OPEN');
      setCooldownRemaining(5);
      setLogs(prev => [
        `[TRIP] Failure threshold exceeded (3/5 failed) -> Circuit tripped to OPEN for 5s!`,
        ...prev.slice(0, 5)
      ]);
    } else {
      setLogs(prev => [
        `[CALL] HTTP Request returned ${isSuccess ? '200 OK' : '500 ERROR'} (Failures in window: ${failures}/3)`,
        ...prev.slice(0, 5)
      ]);
    }
  };

  const resetCircuit = () => {
    setState('CLOSED');
    setRecentCalls([]);
    setCooldownRemaining(0);
    setLogs(['[RESET] Circuit breaker reset to CLOSED healthy state.']);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ms-rose)]/30 bg-[var(--ms-rose)]/10 text-[var(--ms-rose)] text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5" /> Fault Tolerance &amp; Blast Radius Control
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ms-text)]">
          Circuit Breaker <span className="text-[var(--ms-primary)] ms-glow">State Machine</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--ms-muted)] max-w-2xl leading-relaxed">
          Simulate downstream failure cascades. Observe the 3-state lifecycle (<code>CLOSED</code> &rarr; <code>OPEN</code> &rarr; <code>HALF_OPEN</code>) preventing thread exhaustion.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left State Machine Visualization */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--ms-border)] bg-[var(--ms-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--ms-border-subtle)] pb-4">
            <span className="text-[var(--ms-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Circuit Breaker Lifecycle
            </span>
            <button
              onClick={resetCircuit}
              className="text-[10px] text-[var(--ms-muted)] hover:text-[var(--ms-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* 3-State Nodes Diagram */}
          <div className="grid grid-cols-3 gap-3">
            {/* CLOSED */}
            <div className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
              state === 'CLOSED'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'border-[var(--ms-border-subtle)] bg-[var(--ms-bg)] text-[var(--ms-muted)] opacity-50'
            }`}>
              <div className="text-[10px] uppercase font-bold">1. CLOSED</div>
              <div className="text-base font-bold">Healthy</div>
              <div className="text-[9px] opacity-75">Passes all RPCs</div>
            </div>

            {/* OPEN */}
            <div className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
              state === 'OPEN'
                ? 'border-rose-500 bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                : 'border-[var(--ms-border-subtle)] bg-[var(--ms-bg)] text-[var(--ms-muted)] opacity-50'
            }`}>
              <div className="text-[10px] uppercase font-bold">2. OPEN</div>
              <div className="text-base font-bold">Tripped</div>
              <div className="text-[9px] opacity-75">
                {cooldownRemaining > 0 ? `Cooldown (${cooldownRemaining}s)` : 'Fast-fails RPCs'}
              </div>
            </div>

            {/* HALF_OPEN */}
            <div className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
              state === 'HALF_OPEN'
                ? 'border-amber-500 bg-amber-500/20 text-amber-300 ring-2 ring-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                : 'border-[var(--ms-border-subtle)] bg-[var(--ms-bg)] text-[var(--ms-muted)] opacity-50'
            }`}>
              <div className="text-[10px] uppercase font-bold">3. HALF-OPEN</div>
              <div className="text-base font-bold">Canary Trial</div>
              <div className="text-[9px] opacity-75">Probing recovery</div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => sendCall(true)}
              className="py-3 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Send 200 OK (Success)
            </button>
            <button
              onClick={() => sendCall(false)}
              className="py-3 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> Send 500 Error (Failure)
            </button>
          </div>
        </div>

        {/* Right Telemetry & Sliding Window Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sliding Window */}
          <div className="p-6 rounded-2xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] space-y-3">
            <span className="text-[var(--ms-primary)] uppercase tracking-wider font-bold text-[10px]">
              Sliding Window (Last 5 Calls)
            </span>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, idx) => {
                const call = recentCalls[idx];
                return (
                  <div
                    key={idx}
                    className={`flex-1 h-10 rounded-lg border flex items-center justify-center font-bold text-[9px] ${
                      call === 'SUCCESS'
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                        : call === 'FAILURE'
                        ? 'border-rose-500/40 bg-rose-500/20 text-rose-300'
                        : 'border-[var(--ms-border-subtle)] bg-[var(--ms-bg)] text-[var(--ms-muted)]'
                    }`}
                  >
                    {call || 'EMPTY'}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-[var(--ms-muted)]">
              Failures in current window: <strong>{recentCalls.filter(c => c === 'FAILURE').length} / 3 threshold</strong>
            </p>
          </div>

          {/* Logs */}
          <div className="p-4 rounded-xl bg-[var(--ms-bg)] border border-[var(--ms-border-subtle)] space-y-1.5 text-[11px] max-h-48 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="text-[var(--ms-muted)] leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
