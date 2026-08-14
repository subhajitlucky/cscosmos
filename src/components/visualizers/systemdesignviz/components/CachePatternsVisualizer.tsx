'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Database, HardDrive, Layers, RefreshCw, Sparkles, Zap } from 'lucide-react';

type CachePattern = 'cache-aside' | 'write-through' | 'write-behind';

export function CachePatternsVisualizer() {
  const [pattern, setPattern] = useState<CachePattern>('cache-aside');

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Distributed Cache Strategy
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Cache-Aside vs Write-Through vs Write-Behind
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          {pattern.toUpperCase()}
        </span>
      </div>

      {/* Pattern Selector */}
      <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
        <button
          onClick={() => setPattern('cache-aside')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            pattern === 'cache-aside'
              ? 'bg-indigo-600 text-white font-bold shadow-md border-indigo-500'
              : 'bg-card border-border text-foreground hover:border-indigo-500'
          }`}
        >
          <div className="font-bold">1. Cache-Aside (Lazy)</div>
          <div className={`text-[10px] ${pattern === 'cache-aside' ? 'text-indigo-100' : 'text-muted-foreground'}`}>
            App checks cache; on miss loads DB
          </div>
        </button>

        <button
          onClick={() => setPattern('write-through')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            pattern === 'write-through'
              ? 'bg-indigo-600 text-white font-bold shadow-md border-indigo-500'
              : 'bg-card border-border text-foreground hover:border-indigo-500'
          }`}
        >
          <div className="font-bold">2. Write-Through</div>
          <div className={`text-[10px] ${pattern === 'write-through' ? 'text-indigo-100' : 'text-muted-foreground'}`}>
            Sync write to cache AND database
          </div>
        </button>

        <button
          onClick={() => setPattern('write-behind')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            pattern === 'write-behind'
              ? 'bg-indigo-600 text-white font-bold shadow-md border-indigo-500'
              : 'bg-card border-border text-foreground hover:border-indigo-500'
          }`}
        >
          <div className="font-bold">3. Write-Behind (Write-Back)</div>
          <div className={`text-[10px] ${pattern === 'write-behind' ? 'text-indigo-100' : 'text-muted-foreground'}`}>
            Fast write to cache; async DB flush
          </div>
        </button>
      </div>

      {/* Visual Flow Diagram */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2">
          Execution Flow Diagram:
        </div>

        <div className="grid sm:grid-cols-3 gap-4 items-center text-center">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-indigo-300 font-bold">
            1. Client Application
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 font-bold">
            2. Redis / Memcached
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-300 font-bold">
            3. PostgreSQL Database
          </div>
        </div>
      </div>
    </div>
  );
}
