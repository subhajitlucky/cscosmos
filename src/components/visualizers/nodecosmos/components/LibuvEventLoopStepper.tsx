'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Clock, Cpu, RefreshCw, RotateCcw, Sparkles, Terminal, Zap } from 'lucide-react';

interface Phase {
  name: string;
  sub: string;
  handles: string[];
  color: string;
  description: string;
}

const PHASES: Phase[] = [
  {
    name: '1. Timers Phase',
    sub: 'setTimeout() & setInterval()',
    handles: ['setTimeout(cb, 100)', 'setInterval(tick, 1000)'],
    color: 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300',
    description: 'Executes expired timer threshold callbacks. Threshold represents the minimum delay, not exact guarantee.'
  },
  {
    name: '2. Pending Callbacks Phase',
    sub: 'I/O Callbacks (OS Errors)',
    handles: ['ECONNREFUSED socket errors', 'System I/O deferred retries'],
    color: 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300',
    description: 'Executes I/O callbacks deferred to the next loop iteration (e.g. TCP errors like ECONNREFUSED).'
  },
  {
    name: '3. Idle / Prepare Phase',
    sub: 'Libuv Internal Operations',
    handles: ['uv_idle_t', 'uv_prepare_t internal handles'],
    color: 'border-slate-500 bg-slate-500/10 text-slate-700 dark:text-slate-300',
    description: 'Used only internally by Libuv before the Poll phase begins.'
  },
  {
    name: '4. Poll Phase (The Engine Core)',
    sub: 'Incoming I/O & Connection Events',
    handles: ['Incoming HTTP Requests', 'fs.readFile data ready', 'TCP Socket Packets'],
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    description: 'Retrieves new I/O events from epoll/kqueue. If no timers are scheduled, Libuv will block and wait here for incoming I/O events.'
  },
  {
    name: '5. Check Phase',
    sub: 'setImmediate() Callbacks',
    handles: ['setImmediate(cb)', 'Immediate post-poll tasks'],
    color: 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    description: 'Executes setImmediate() callbacks immediately after the Poll phase finishes.'
  },
  {
    name: '6. Close Callbacks Phase',
    sub: 'Resource Teardown',
    handles: ['socket.on("close")', 'server.on("close")'],
    color: 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    description: 'Handles abrupt closures: e.g. socket.destroy() or connection reset events.'
  }
];

export function LibuvEventLoopStepper() {
  const [activePhaseIdx, setActivePhaseIdx] = useState<number>(0);
  const [microtaskPending, setMicrotaskPending] = useState<boolean>(true);

  const currentPhase = PHASES[activePhaseIdx];

  const handleNext = () => {
    setActivePhaseIdx((prev) => (prev < PHASES.length - 1 ? prev + 1 : 0));
    setMicrotaskPending(true);
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Libuv Asynchronous Runtime
            </div>
            <h3 className="text-xl font-bold text-foreground">
              The 6-Phase Libuv Event Loop &amp; Microtask Interleaving
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Phase {activePhaseIdx + 1} of 6: {currentPhase.name}
        </span>
      </div>

      {/* 6-Phase Circular Ring / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {PHASES.map((p, idx) => (
          <button
            key={p.name}
            onClick={() => {
              setActivePhaseIdx(idx);
              setMicrotaskPending(true);
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activePhaseIdx === idx
                ? `${p.color} font-bold shadow-md scale-105 border-2`
                : 'bg-card border-border text-foreground hover:border-emerald-500'
            }`}
          >
            <div className="text-[10px] font-mono opacity-70">Phase {idx + 1}</div>
            <div className="text-xs font-extrabold truncate">{p.name.split('. ')[1]}</div>
          </button>
        ))}
      </div>

      {/* VIP Microtask Checkpoint Interstitial Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-mono">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span><strong>VIP Microtask Checkpoint:</strong> process.nextTick &amp; Promise.then queues drain between every single phase!</span>
        </div>
        <button
          onClick={() => setMicrotaskPending(false)}
          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition font-mono ${
            microtaskPending
              ? 'bg-amber-500 text-slate-950 shadow-sm animate-pulse'
              : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          {microtaskPending ? '⚡ Drain Microtasks' : '✅ Microtasks Clean'}
        </button>
      </div>

      {/* Phase Details Card */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Active Phase Inspection:
          </span>
          <h4 className="text-xl font-extrabold text-foreground">{currentPhase.name}</h4>
          <p className="text-xs font-mono text-muted-foreground">{currentPhase.sub}</p>
        </div>

        <p className="text-xs sm:text-sm text-foreground leading-relaxed">
          {currentPhase.description}
        </p>

        <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs space-y-1">
          <span className="text-slate-400 text-[11px]">Representative Handles Processed:</span>
          <div className="text-emerald-400 font-bold">{currentPhase.handles.join(' • ')}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActivePhaseIdx(0)}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Timers</span>
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <span>Advance to Next Phase</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
