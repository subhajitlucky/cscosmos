'use client';

import React, { useState } from 'react';
import { ArrowRight, Cpu, Layers, RefreshCw, Sparkles, TrendingDown, TrendingUp, Zap } from 'lucide-react';

type TraversalMode = 'row-major' | 'col-major';

export function CacheLocalityVisualizer() {
  const [mode, setMode] = useState<TraversalMode>('row-major');
  const [step, setStep] = useState<number>(0);

  const matrix = [
    [10, 20, 30, 40],
    [50, 60, 70, 80],
    [90, 100, 110, 120],
    [130, 140, 150, 160],
  ];

  const getActiveCoords = (s: number, m: TraversalMode): [number, number] => {
    const clamped = Math.min(15, Math.max(0, s));
    if (m === 'row-major') {
      return [Math.floor(clamped / 4), clamped % 4];
    } else {
      return [clamped % 4, Math.floor(clamped / 4)];
    }
  };

  const [activeRow, activeCol] = getActiveCoords(step, mode);

  const cacheMisses = mode === 'row-major' ? Math.floor(step / 4) + 1 : step + 1;
  const cacheHits = Math.max(0, (step + 1) - cacheMisses);

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Hardware Cache Performance Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              64-Byte CPU Cache Line &amp; Spatial Locality
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          mode === 'row-major'
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
        }`}>
          {mode === 'row-major' ? '⚡ 94% L1 CACHE HIT RATIO' : '🚨 CACHE THRASHING (MISS ON EVERY STEP)'}
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <button
          onClick={() => {
            setMode('row-major');
            setStep(0);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            mode === 'row-major'
              ? 'bg-emerald-600 text-white font-bold shadow-md border-emerald-500'
              : 'bg-card border-border text-foreground hover:border-emerald-500'
          }`}
        >
          <div className="font-bold">1. Row-Major Order (Fast)</div>
          <div className={`text-[10px] ${mode === 'row-major' ? 'text-emerald-100' : 'text-muted-foreground'}`}>
            matrix[i][j] sequential 64-byte prefetch
          </div>
        </button>

        <button
          onClick={() => {
            setMode('col-major');
            setStep(0);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            mode === 'col-major'
              ? 'bg-rose-600 text-white font-bold shadow-md border-rose-500'
              : 'bg-card border-border text-foreground hover:border-emerald-500'
          }`}
        >
          <div className="font-bold">2. Column-Major Order (100x Slower)</div>
          <div className={`text-[10px] ${mode === 'col-major' ? 'text-rose-100' : 'text-muted-foreground'}`}>
            matrix[j][i] strided cache invalidations
          </div>
        </button>
      </div>

      {/* 4x4 Grid Diagram */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Active Cell: matrix[{activeRow}][{activeCol}] = {matrix[activeRow][activeCol]}</span>
          <span className="text-emerald-400 font-bold">Step {step + 1} of 16</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
          {matrix.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isActive = activeRow === rIdx && activeCol === cIdx;
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                    isActive
                      ? 'border-amber-400 bg-amber-500 text-slate-950 scale-110 shadow-lg ring-2 ring-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  {val}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">L1 Cache Hits (0.5ns latency):</span>
          <span className="text-emerald-400 font-extrabold text-base">{cacheHits}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">L1 Cache Misses (RAM stall):</span>
          <span className={`font-extrabold text-base ${cacheMisses > 4 ? 'text-rose-400' : 'text-slate-300'}`}>
            {cacheMisses}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setStep(0)}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Traversal</span>
        </button>

        <button
          onClick={() => setStep((prev) => (prev < 15 ? prev + 1 : 0))}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Step Next Cell ({step + 1}/16)</span>
        </button>
      </div>
    </div>
  );
}
