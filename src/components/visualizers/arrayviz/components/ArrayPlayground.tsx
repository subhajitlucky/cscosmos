'use client';

import React, { useState } from 'react';
import { LayoutGrid, Play, RotateCcw, Sparkles, Terminal, Zap } from 'lucide-react';

export function ArrayPlayground() {
  const [arrayInput, setArrayInput] = useState<string>('5, 12, 8, 3, 19, 7');
  const [operation, setOperation] = useState<string>('prefix-sum');
  const [result, setResult] = useState<string>('[5, 17, 25, 28, 47, 54]');

  const handleExecute = () => {
    const nums = arrayInput.split(',').map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));

    if (operation === 'prefix-sum') {
      const pSum: number[] = [];
      let sum = 0;
      for (const n of nums) {
        sum += n;
        pSum.push(sum);
      }
      setResult(JSON.stringify(pSum));
    } else if (operation === 'reverse') {
      setResult(JSON.stringify([...nums].reverse()));
    } else if (operation === 'sort') {
      setResult(JSON.stringify([...nums].sort((a, b) => a - b)));
    } else if (operation === 'max-subarray') {
      let maxSoFar = nums[0] || 0;
      let currMax = nums[0] || 0;
      for (let i = 1; i < nums.length; i++) {
        currMax = Math.max(nums[i], currMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currMax);
      }
      setResult(`Kadane's Max Subarray Sum: ${maxSoFar}`);
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Interactive Algorithm Sandbox
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Array &amp; String DSA Playground
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Linear Time O(N) Engine
        </span>
      </div>

      {/* Input & Selector */}
      <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-muted-foreground block">Comma-Separated Array Input:</label>
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs border border-border focus:border-emerald-500 outline-none shadow-inner"
          />
        </div>

        <div className="space-y-1">
          <label className="text-muted-foreground block">Select Algorithm:</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 text-foreground font-mono text-xs border border-border focus:border-emerald-500 outline-none shadow-inner"
          >
            <option value="prefix-sum">1. Prefix Sum Array</option>
            <option value="reverse">2. In-Place Reverse</option>
            <option value="sort">3. Dual-Pivot QuickSort</option>
            <option value="max-subarray">4. Kadane&apos;s Max Subarray</option>
          </select>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExecute}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Execute Algorithm</span>
        </button>
      </div>

      {/* Output Display */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs shadow-inner">
        <span className="text-emerald-400 font-bold block">Algorithm Result:</span>
        <div className="text-base font-extrabold text-emerald-200">{result}</div>
      </div>
    </div>
  );
}
