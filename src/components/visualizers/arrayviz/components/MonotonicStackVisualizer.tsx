'use client';

import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Layers, RefreshCw, RotateCcw, Sparkles, TrendingUp, Zap } from 'lucide-react';

export function MonotonicStackVisualizer() {
  const temps = [73, 74, 75, 71, 69, 72, 76];
  const [currIdx, setCurrIdx] = useState<number>(0);
  const [stack, setStack] = useState<number[]>([]);
  const [result, setResult] = useState<number[]>(new Array(7).fill(0));
  const [log, setLog] = useState<string>('Ready to find Daily Temperatures Next Greater Day.');

  const handleNext = () => {
    if (currIdx < temps.length) {
      const currentTemp = temps[currIdx];
      const nextStack = [...stack];
      const nextResult = [...result];

      // Pop while stack is not empty and current temp > temp at stack top
      while (nextStack.length > 0 && currentTemp > temps[nextStack[nextStack.length - 1]]) {
        const prevIdx = nextStack.pop()!;
        nextResult[prevIdx] = currIdx - prevIdx;
      }

      nextStack.push(currIdx);
      setStack(nextStack);
      setResult(nextResult);
      setLog(`Processed index ${currIdx} (${currentTemp}°F). Resolved pending warmer days on stack.`);
      setCurrIdx((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrIdx(0);
    setStack([]);
    setResult(new Array(7).fill(0));
    setLog('Reset to initial state.');
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Monotonic Data Structure Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Monotonic Decreasing Stack (Next Greater Element)
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Time: Strictly O(N) Linear (Each element pushed/popped at most once)
        </span>
      </div>

      {/* Temperatures & Result Grid */}
      <div className="grid md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Array View */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-emerald-400 font-bold">Input Temperatures:</span>
            <span className="text-slate-400">Days to Warmer Temp</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {temps.map((t, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border transition-all ${
                  currIdx - 1 === idx
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-bold scale-105'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                <div className="text-[10px] text-slate-500">[{idx}]</div>
                <div className="text-sm font-extrabold py-0.5">{t}°</div>
                <div className="text-xs font-bold text-emerald-400">+{result[idx]}d</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monotonic Stack View */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-sky-400 font-bold">Monotonic Decreasing Stack:</span>
            <span className="text-slate-400">{stack.length} elements waiting</span>
          </div>

          <div className="min-h-[80px] flex items-center gap-2 overflow-x-auto">
            {stack.length === 0 ? (
              <span className="text-slate-600 py-4 block">[ Stack Empty ]</span>
            ) : (
              stack.map((itemIdx) => (
                <div
                  key={itemIdx}
                  className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-200 font-bold text-center"
                >
                  <div className="text-[10px] opacity-70">Idx {itemIdx}</div>
                  <div>{temps[itemIdx]}°F</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currIdx >= temps.length}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Step Next Temperature ({currIdx}/{temps.length})</span>
        </button>
      </div>
    </div>
  );
}
