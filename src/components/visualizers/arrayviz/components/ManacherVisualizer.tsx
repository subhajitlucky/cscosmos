'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, LayoutGrid, RefreshCw, Search, Sparkles, Zap } from 'lucide-react';

export function ManacherVisualizer() {
  const original = 'babad';
  const transformed = ['#', 'b', '#', 'a', '#', 'b', '#', 'a', '#', 'd', '#'];
  const pArray = [0, 1, 0, 3, 0, 3, 0, 1, 0, 1, 0];
  const [activeIdx, setActiveIdx] = useState<number>(3); // index of '#a#' (radius 3)

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Optimal Palindromic Substring Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Manacher&apos;s Algorithm O(N) Palindrome Finder
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Radius P[{activeIdx}] = {pArray[activeIdx]} (Length: {pArray[activeIdx]} chars)
        </span>
      </div>

      {/* Transformed String Grid */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Original: &quot;{original}&quot; ➔ Delimited: &quot;{transformed.join('')}&quot;</span>
          <span className="text-emerald-400 font-bold">Unifies Even &amp; Odd Palindromes</span>
        </div>

        <div className="grid grid-cols-11 gap-1.5 text-center">
          {transformed.map((char, idx) => {
            const isCenter = activeIdx === idx;
            const radius = pArray[activeIdx];
            const inRange = idx >= activeIdx - radius && idx <= activeIdx + radius;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`p-3 rounded-xl border transition-all ${
                  isCenter
                    ? 'border-amber-400 bg-amber-500 text-slate-950 font-bold scale-110 shadow-lg ring-2 ring-amber-300'
                    : inRange
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-emerald-500'
                }`}
              >
                <div className="text-[9px] opacity-70">[{idx}]</div>
                <div className="text-base font-extrabold py-0.5">{char}</div>
                <div className="text-[10px] text-emerald-400">P:{pArray[idx]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Box */}
      <div className="p-4 rounded-2xl bg-card border border-border font-mono text-xs space-y-1 shadow-sm">
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Palindrome Radius Analysis:</span>
        <p className="text-foreground leading-relaxed">
          Centered at index {activeIdx} (<code>&apos;{transformed[activeIdx]}&apos;</code>), the palindrome expands {pArray[activeIdx]} steps in both directions.
          By inserting virtual <code>#</code> delimiters, odd palindromes (like <code>&quot;aba&quot;</code>) and even palindromes (like <code>&quot;abba&quot;</code>) are handled with a single unified algorithm in linear <strong>O(N) time</strong>.
        </p>
      </div>
    </div>
  );
}
