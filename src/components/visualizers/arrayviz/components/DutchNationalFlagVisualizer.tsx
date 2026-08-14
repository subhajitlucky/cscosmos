'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, LayoutGrid, RefreshCw, RotateCcw, Sparkles, Zap } from 'lucide-react';

export function DutchNationalFlagVisualizer() {
  const [arr, setArr] = useState<number[]>([2, 0, 2, 1, 1, 0]);
  const [low, setLow] = useState<number>(0);
  const [mid, setMid] = useState<number>(0);
  const [high, setHigh] = useState<number>(5);
  const [log, setLog] = useState<string>('Ready to partition array with 3 pointers: low=0, mid=0, high=5.');

  const handleStep = () => {
    if (mid <= high) {
      const nextArr = [...arr];
      if (nextArr[mid] === 0) {
        // Swap arr[low] and arr[mid]
        const temp = nextArr[low];
        nextArr[low] = nextArr[mid];
        nextArr[mid] = temp;
        setArr(nextArr);
        setLow((prev) => prev + 1);
        setMid((prev) => prev + 1);
        setLog(`arr[mid] == 0: Swapped arr[low] and arr[mid]. Incremented low (${low}->${low+1}) and mid (${mid}->${mid+1}).`);
      } else if (nextArr[mid] === 1) {
        setMid((prev) => prev + 1);
        setLog(`arr[mid] == 1: 1 is in correct middle bucket. Incremented mid (${mid}->${mid+1}).`);
      } else {
        // arr[mid] === 2: Swap arr[mid] and arr[high]
        const temp = nextArr[mid];
        nextArr[mid] = nextArr[high];
        nextArr[high] = temp;
        setArr(nextArr);
        setHigh((prev) => prev - 1);
        setLog(`arr[mid] == 2: Swapped arr[mid] and arr[high]. Decremented high (${high}->${high-1}). Mid pointer stays to evaluate swapped element.`);
      }
    }
  };

  const handleReset = () => {
    setArr([2, 0, 2, 1, 1, 0]);
    setLow(0);
    setMid(0);
    setHigh(5);
    setLog('Reset to initial array [2, 0, 2, 1, 1, 0].');
  };

  const isSorted = mid > high;

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              In-Place 3-Way Partitioning
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Dutch National Flag Algorithm (0s, 1s, 2s Sort)
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          isSorted
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
        }`}>
          {isSorted ? '✅ 3-WAY PARTITION COMPLETE (O(N) Time, O(1) Space)' : 'PARTITIONING IN PROGRESS'}
        </span>
      </div>

      {/* Array Elements with 3 Pointers */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Pointers: Low={low} • Mid={mid} • High={high}</span>
          <span className="text-emerald-400 font-bold">Single-Pass O(N)</span>
        </div>

        <div className="grid grid-cols-6 gap-3 text-center">
          {arr.map((val, idx) => {
            const isLow = low === idx;
            const isMid = mid === idx;
            const isHigh = high === idx;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  val === 0
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300 font-bold'
                    : val === 1
                    ? 'border-slate-500 bg-slate-500/20 text-slate-200 font-bold'
                    : 'border-blue-500 bg-blue-500/20 text-blue-300 font-bold'
                }`}
              >
                <div className="text-[10px] opacity-70">[{idx}]</div>
                <div className="text-xl font-extrabold py-1">{val}</div>
                <div className="text-[10px] space-x-1 pt-1 font-mono">
                  {isLow && <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold">LOW</span>}
                  {isMid && <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">MID</span>}
                  {isHigh && <span className="px-1.5 py-0.5 rounded bg-blue-500 text-white font-bold">HIGH</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-emerald-400 font-bold">Step Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Array</span>
        </button>

        <button
          onClick={handleStep}
          disabled={isSorted}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Step Next Swap</span>
        </button>
      </div>
    </div>
  );
}
