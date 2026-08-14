'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Database, Layers, RefreshCw, ShieldAlert, ShieldCheck, Sparkles, TrendingDown, Zap } from 'lucide-react';

type LoaderMode = 'naive' | 'dataloader';

export function DataLoaderVisualizer() {
  const [mode, setMode] = useState<LoaderMode>('naive');

  return (
    <div className="rounded-3xl border border-pink-500/30 bg-pink-500/5 dark:bg-pink-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-md">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-400">
              Query Optimization Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              The N+1 Problem &amp; DataLoader Batching Simulator
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          mode === 'dataloader'
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
        }`}>
          {mode === 'dataloader' ? '⚡ DATALOADER: STRICTLY 2 SQL QUERIES' : '🚨 NAIVE: 11 SQL QUERIES (N+1 DISASTER)'}
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <button
          onClick={() => setMode('naive')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            mode === 'naive'
              ? 'bg-rose-600 text-white font-bold shadow-md border-rose-500'
              : 'bg-card border-border text-foreground hover:border-pink-500'
          }`}
        >
          <div className="font-bold">1. Naive Resolvers (N+1 Problem)</div>
          <div className={`text-[10px] ${mode === 'naive' ? 'text-rose-100' : 'text-muted-foreground'}`}>
            10 posts = 11 separate SQL queries
          </div>
        </button>

        <button
          onClick={() => setMode('dataloader')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            mode === 'dataloader'
              ? 'bg-emerald-600 text-white font-bold shadow-md border-emerald-500'
              : 'bg-card border-border text-foreground hover:border-pink-500'
          }`}
        >
          <div className="font-bold">2. DataLoader (Batching &amp; Caching)</div>
          <div className={`text-[10px] ${mode === 'dataloader' ? 'text-emerald-100' : 'text-muted-foreground'}`}>
            Batches WHERE id IN (...) in 1 microtask tick
          </div>
        </button>
      </div>

      {/* SQL Queries Trace */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400">Database Query Log:</span>
          <span className={mode === 'dataloader' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            Total SQL Queries Fired: {mode === 'dataloader' ? '2' : '11'}
          </span>
        </div>

        {mode === 'naive' ? (
          <div className="space-y-1.5 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-900 text-amber-300 font-bold">1. SELECT * FROM posts LIMIT 10;</div>
            <div className="p-2 rounded-xl bg-slate-900/60 text-rose-300">2. SELECT * FROM users WHERE id = 1;</div>
            <div className="p-2 rounded-xl bg-slate-900/60 text-rose-300">3. SELECT * FROM users WHERE id = 2;</div>
            <div className="p-2 rounded-xl bg-slate-900/60 text-rose-300">4. SELECT * FROM users WHERE id = 3;</div>
            <div className="text-[10px] text-slate-500 text-center py-1">... +7 more redundant queries for remaining authors!</div>
          </div>
        ) : (
          <div className="space-y-1.5 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-900 text-amber-300 font-bold">
              1. SELECT * FROM posts LIMIT 10;
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold">
              2. SELECT * FROM users WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
            </div>
            <div className="p-2 rounded-xl bg-slate-900/40 text-slate-400 text-[10px]">
              ⚡ All 10 user IDs batched in a single tick! 0 duplicate queries.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
