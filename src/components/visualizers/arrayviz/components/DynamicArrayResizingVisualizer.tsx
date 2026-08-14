'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, HardDrive, Plus, RefreshCw, Sparkles, Zap } from 'lucide-react';

export function DynamicArrayResizingVisualizer() {
  const [elements, setElements] = useState<number[]>([10, 20]);
  const [capacity, setCapacity] = useState<number>(2);
  const [log, setLog] = useState<string>('Dynamic array initialized with size: 2, capacity: 2.');

  const handlePush = () => {
    const nextVal = Math.floor(Math.random() * 90) + 10;
    if (elements.length >= capacity) {
      const nextCap = capacity * 2;
      setCapacity(nextCap);
      setElements((prev) => [...prev, nextVal]);
      setLog(`⚡ GEOMETRIC DOUBLING TRIGGERED: Capacity exceeded! Allocated new buffer in RAM (${capacity} -> ${nextCap}), copied ${elements.length} elements, and inserted ${nextVal}. (Amortized Cost: O(1)).`);
    } else {
      setElements((prev) => [...prev, nextVal]);
      setLog(`Inserted ${nextVal} directly into existing allocated buffer slot. (Instant O(1)).`);
    }
  };

  const handleReset = () => {
    setElements([10, 20]);
    setCapacity(2);
    setLog('Reset to size: 2, capacity: 2.');
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Memory Management Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Dynamic Array Capacity Doubling &amp; Amortized O(1)
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Size: {elements.length} / Capacity: {capacity}
        </span>
      </div>

      {/* Array Buffer Grid */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Contiguous Buffer in Virtual Memory:</span>
          <span className="text-emerald-400 font-bold">Amortized Push: O(1)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: capacity }).map((_, idx) => {
            const hasVal = idx < elements.length;
            return (
              <div
                key={idx}
                className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  hasVal
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md font-bold'
                    : 'border-slate-800 bg-slate-900/50 text-slate-600 border-dashed'
                }`}
              >
                <div className="text-[10px] opacity-70">[{idx}]</div>
                <div className="text-xs font-extrabold">{hasVal ? elements[idx] : '-'}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-emerald-400 font-bold">Allocation Engine Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Array</span>
        </button>

        <button
          onClick={handlePush}
          disabled={capacity >= 32}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Push Random Element (push_back)</span>
        </button>
      </div>
    </div>
  );
}
