'use client';

import React, { useState } from 'react';
import { ArrowRight, ChevronRight, LayoutGrid, RefreshCw, RotateCcw, Sparkles, Zap } from 'lucide-react';

export function SlidingWindowVisualizer() {
  const [windowSize, setWindowSize] = useState<number>(3);
  const [startIndex, setStartIndex] = useState<number>(0);

  const arr = [2, 1, 5, 1, 3, 2, 8, 4];

  const currentWindow = arr.slice(startIndex, startIndex + windowSize);
  const currentSum = currentWindow.reduce((a, b) => a + b, 0);

  const handleNext = () => {
    if (startIndex + windowSize < arr.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setStartIndex(0);
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Algorithmic Two-Pointer Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Sliding Window Subarray Stepper (Size K = {windowSize})
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Running Window Sum: {currentSum}
        </span>
      </div>

      {/* Array Elements with Highlighted Window */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Contiguous Window [{startIndex} .. {startIndex + windowSize - 1}]</span>
          <span className="text-emerald-400 font-bold">O(1) Step Update: +{arr[startIndex + windowSize - 1] || 0} -{arr[startIndex - 1] || 0}</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {arr.map((num, idx) => {
            const inWindow = idx >= startIndex && idx < startIndex + windowSize;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  inWindow
                    ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200 font-extrabold shadow-lg scale-105 ring-2 ring-emerald-400'
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                <div className="text-[10px] opacity-70">[{idx}]</div>
                <div className="text-base font-extrabold">{num}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Window</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={startIndex + windowSize >= arr.length}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <span>Slide Window Right</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
