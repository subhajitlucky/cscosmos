'use client';

import React, { useState } from 'react';
import { ArrowRight, Cpu, Play, RotateCcw, Sparkles } from 'lucide-react';

export function InteractivePointerWidget() {
  const [val, setVal] = useState<number>(42);
  const [hasPointer, setHasPointer] = useState<boolean>(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const address = '0x10f48a0';

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 p-6 space-y-4 shadow-sm my-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
            Live Memory &amp; Pointer Simulator
          </h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-mono font-bold">
          Interactive RAM
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[var(--muted)]">
        Interact with the buttons below to see how Go stores variable values and pointers in memory addresses.
      </p>

      {/* Memory Grid */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2">
        {/* Variable Box */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 ${
            highlighted === 'var'
              ? 'border-blue-500 bg-blue-500/10 scale-105 shadow-md'
              : 'border-[var(--panel-border)] bg-[var(--panel)]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[var(--muted)] border-b border-[var(--panel-border)] pb-2 mb-2 font-mono">
            <span>Variable: <strong>x</strong> (int)</span>
            <span className="text-blue-500">Address: {address}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--muted)]">Stored Value:</span>
            <span className="text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
              {val}
            </span>
          </div>
        </div>

        {/* Pointer Box */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 ${
            hasPointer
              ? highlighted === 'ptr'
                ? 'border-purple-500 bg-purple-500/10 scale-105 shadow-md'
                : 'border-purple-500/40 bg-purple-500/5'
              : 'border-dashed border-[var(--panel-border)] bg-transparent opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[var(--muted)] border-b border-[var(--panel-border)] pb-2 mb-2 font-mono">
            <span>Pointer: <strong>p</strong> (*int)</span>
            <span>Address: 0x10f48b8</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--muted)]">Points to address:</span>
            <span className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400">
              {hasPointer ? address : '(not declared)'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--panel-border)]">
        {!hasPointer ? (
          <button
            onClick={() => {
              setHasPointer(true);
              setHighlighted('ptr');
            }}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
          >
            Declare Pointer: <code>p := &amp;x</code>
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setVal((prev) => prev + 10);
                setHighlighted('ptr');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
            >
              Mutate via Pointer: <code>*p += 10</code>
            </button>
            <button
              onClick={() => {
                setVal(100);
                setHighlighted('var');
              }}
              className="px-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--panel-border)] hover:border-blue-500 text-xs font-bold transition"
            >
              Direct Assign: <code>x = 100</code>
            </button>
            <button
              onClick={() => {
                setHasPointer(false);
                setVal(42);
                setHighlighted(null);
              }}
              className="p-1.5 rounded-lg border border-[var(--panel-border)] hover:bg-[var(--panel)] text-[var(--muted)]"
              title="Reset Simulator"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
