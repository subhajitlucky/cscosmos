'use client';

import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Hash, RefreshCw, RotateCcw, Search, Sparkles, Zap } from 'lucide-react';

export function RabinKarpRollingHashVisualizer() {
  const text = 'ABCAABCA';
  const pattern = 'AAB';
  const [windowIdx, setWindowIdx] = useState<number>(0);

  const patternHash = 1428;
  const windowHashes = [1024, 1180, 1428, 1180, 1024, 1428];

  const currentWindow = text.slice(windowIdx, windowIdx + 3);
  const currentHash = windowHashes[windowIdx] || 1024;
  const isMatch = currentHash === patternHash && currentWindow === pattern;

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Modular Hash Matching Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Rabin-Karp Polynomial Rolling Hash Stepper
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          isMatch ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
        }`}>
          {isMatch ? '🎯 EXACT PATTERN MATCH FOUND!' : `Window Hash: ${currentHash}`}
        </span>
      </div>

      {/* Visual Window */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Target Pattern: &quot;{pattern}&quot; (Hash: {patternHash})</span>
          <span className="text-emerald-400 font-bold">Window [{windowIdx}..{windowIdx + 2}]: &quot;{currentWindow}&quot;</span>
        </div>

        <div className="grid grid-cols-8 gap-2 text-center">
          {text.split('').map((char, idx) => {
            const inWindow = idx >= windowIdx && idx < windowIdx + 3;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all ${
                  inWindow
                    ? isMatch
                      ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200 font-extrabold shadow-lg scale-105 ring-2 ring-emerald-400'
                      : 'border-amber-400 bg-amber-500/20 text-amber-200 font-extrabold scale-105'
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                <div className="text-[10px] opacity-70">[{idx}]</div>
                <div className="text-base font-extrabold py-0.5">{char}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setWindowIdx(0)}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Search</span>
        </button>

        <button
          onClick={() => setWindowIdx((prev) => (prev < text.length - 3 ? prev + 1 : 0))}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <span>Roll Hash Window Right</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
