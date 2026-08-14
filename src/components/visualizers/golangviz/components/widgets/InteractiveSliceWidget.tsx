'use client';

import React, { useState } from 'react';
import { Database, Plus, RotateCcw, Sparkles } from 'lucide-react';

export function InteractiveSliceWidget() {
  const [elements, setElements] = useState<number[]>([10, 20]);
  const [capacity, setCapacity] = useState<number>(2);
  const [reallocated, setReallocated] = useState<boolean>(false);

  const appendElement = () => {
    const nextVal = (elements.length + 1) * 10;
    if (elements.length >= capacity) {
      // Reallocate doubling capacity
      const nextCap = capacity * 2;
      setCapacity(nextCap);
      setElements([...elements, nextVal]);
      setReallocated(true);
      setTimeout(() => setReallocated(false), 1200);
    } else {
      setElements([...elements, nextVal]);
    }
  };

  const reset = () => {
    setElements([10, 20]);
    setCapacity(2);
    setReallocated(false);
  };

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 space-y-4 shadow-sm my-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
            Interactive Slice Header &amp; Growth Simulator
          </h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
          Dynamic Growth
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[var(--muted)]">
        Click &ldquo;Append Element&rdquo; to watch how Go dynamically doubles backing array memory when <code>len == cap</code>!
      </p>

      {/* Slice 24-byte Header */}
      <div className="p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)]">
        <div className="text-xs font-mono font-bold text-[var(--muted)] border-b border-[var(--panel-border)] pb-2 mb-3">
          Slice Header (24 bytes in RAM): <code>reflect.SliceHeader</code>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <span className="text-[11px] text-[var(--muted)] block">Data Pointer</span>
            <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
              {reallocated ? '0x20a4 (New Array!)' : '0x10f0'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[11px] text-[var(--muted)] block">Length (len)</span>
            <span className="text-base font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
              {elements.length}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="text-[11px] text-[var(--muted)] block">Capacity (cap)</span>
            <span className="text-base font-mono font-extrabold text-amber-600 dark:text-amber-400">
              {capacity}
            </span>
          </div>
        </div>
      </div>

      {/* Backing Array Memory Visualization */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-[var(--muted)] font-semibold">
          Underlying Contiguous Backing Array in Memory:
        </span>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: capacity }).map((_, idx) => {
            const hasVal = idx < elements.length;
            return (
              <div
                key={idx}
                className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
                  hasVal
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm'
                    : 'border-dashed border-[var(--panel-border)] bg-transparent text-[var(--muted)]'
                }`}
              >
                <span className="text-[10px] opacity-70 font-mono">[{idx}]</span>
                <span className="text-sm font-mono font-extrabold">
                  {hasVal ? elements[idx] : 'empty'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-[var(--panel-border)]">
        <button
          onClick={appendElement}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Append: <code>s = append(s, {(elements.length + 1) * 10})</code></span>
        </button>

        <button
          onClick={reset}
          className="p-2 rounded-xl border border-[var(--panel-border)] hover:bg-[var(--panel)] text-[var(--muted)]"
          title="Reset Slice"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
