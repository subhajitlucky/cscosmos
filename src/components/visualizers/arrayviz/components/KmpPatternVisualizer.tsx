'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, LayoutGrid, RotateCcw, Search, Sparkles, Zap } from 'lucide-react';

export function KmpPatternVisualizer() {
  const [pattern] = useState<string>('ABABCABAB');
  const lps = [0, 0, 1, 2, 0, 1, 2, 3, 4];
  const [activeIdx, setActiveIdx] = useState<number>(3);

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Linear String Pattern Matching
            </div>
            <h3 className="text-xl font-bold text-foreground">
              KMP Longest Prefix Suffix (LPS) Array Builder
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Search Time: O(N + M) Zero Backtracking
        </span>
      </div>

      {/* Pattern & LPS Table */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Pattern String: &quot;{pattern}&quot;</span>
          <span className="text-emerald-400 font-bold">LPS[{activeIdx}] = {lps[activeIdx]}</span>
        </div>

        <div className="grid grid-cols-9 gap-2 text-center">
          {pattern.split('').map((char, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`p-3 rounded-xl border transition-all ${
                activeIdx === idx
                  ? 'border-emerald-500 bg-emerald-500/30 text-emerald-200 font-extrabold scale-105 shadow-md ring-2 ring-emerald-400'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-emerald-500'
              }`}
            >
              <div className="text-[10px] opacity-70">[{idx}]</div>
              <div className="text-base font-extrabold text-amber-300 py-0.5">{char}</div>
              <div className="text-xs font-bold text-emerald-400">LPS: {lps[idx]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation Box */}
      <div className="p-4 rounded-2xl bg-card border border-border font-mono text-xs space-y-1 shadow-sm">
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">LPS Analysis for index {activeIdx}:</span>
        <p className="text-foreground leading-relaxed">
          Prefix substring: <code>&quot;{pattern.slice(0, activeIdx + 1)}&quot;</code>.
          The longest proper prefix that is also a suffix is of length <strong>{lps[activeIdx]}</strong>.
          If mismatch occurs at index {activeIdx + 1}, KMP skips directly to index {lps[activeIdx]} without rewinding the text pointer!
        </p>
      </div>
    </div>
  );
}
