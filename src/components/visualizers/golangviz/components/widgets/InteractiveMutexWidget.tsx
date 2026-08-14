'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Lock, Play, RotateCcw, ShieldCheck, Zap } from 'lucide-react';

export function InteractiveMutexWidget() {
  const [counter, setCounter] = useState<number>(0);
  const [useMutex, setUseMutex] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [log, setLog] = useState<string>('Select Mutex mode and click "Spawn 100 Goroutines"');

  const runSimulation = () => {
    setIsRunning(true);
    setCounter(0);

    if (useMutex) {
      // Safe execution: always finishes at exact count
      setLog('🔒 Mutex active: Acquiring lock before every increment. Data races prevented!');
      let current = 0;
      const interval = setInterval(() => {
        current += 10;
        setCounter(current);
        if (current >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setLog('✅ SUCCESS: All 100 goroutine increments accounted for (Final: 100).');
        }
      }, 50);
    } else {
      // Unsafe race condition simulation: misses updates
      setLog('⚠️ NO MUTEX: Concurrent goroutines overwriting memory concurrently!');
      let current = 0;
      const interval = setInterval(() => {
        current += 7; // lost increments due to race condition
        setCounter(current);
        if (current >= 73) {
          clearInterval(interval);
          setIsRunning(false);
          setLog('❌ RACE CONDITION BUG: Expected 100 increments, but got 73 due to conflicting reads/writes!');
        }
      }, 50);
    }
  };

  const reset = () => {
    setCounter(0);
    setIsRunning(false);
    setLog('Select Mutex mode and click "Spawn 100 Goroutines"');
  };

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 space-y-4 shadow-sm my-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
            Interactive Mutex vs Data Race Simulator
          </h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono font-bold">
          Thread Safety
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[var(--muted)]">
        Toggle between <code>sync.Mutex</code> protection and unprotected access to see how data races corrupt shared memory:
      </p>

      {/* Simulator Display */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Toggle Mode */}
        <div className="p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] space-y-3">
          <span className="text-xs font-mono font-bold text-[var(--muted)] block">Protection Mode:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setUseMutex(true)}
              className={`flex-1 p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                useMutex
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'border-[var(--panel-border)] opacity-60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>With sync.Mutex</span>
            </button>
            <button
              onClick={() => setUseMutex(false)}
              className={`flex-1 p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                !useMutex
                  ? 'border-rose-500 bg-rose-500/20 text-rose-700 dark:text-rose-300 shadow-sm'
                  : 'border-[var(--panel-border)] opacity-60'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>No Mutex (Unsafe)</span>
            </button>
          </div>
        </div>

        {/* Counter Display */}
        <div className="p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)]">
            <span>Shared Memory Counter:</span>
            <span>Target: 100</span>
          </div>
          <div className="text-3xl font-mono font-extrabold text-blue-600 dark:text-blue-400 my-1">
            {counter}
          </div>
          <div className="text-[11px] font-mono text-[var(--muted)]">
            {useMutex ? 'mu.Lock() -> counter++ -> mu.Unlock()' : 'counter++ (unprotected read-modify-write)'}
          </div>
        </div>
      </div>

      {/* Log Output */}
      <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800">
        <span className="text-amber-400 font-bold">Execution Log:</span> {log}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 pt-2 border-t border-[var(--panel-border)]">
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Spawn 100 Concurrent Goroutines</span>
        </button>

        <button
          onClick={reset}
          className="p-2 rounded-xl border border-[var(--panel-border)] hover:bg-[var(--panel)] text-[var(--muted)]"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
