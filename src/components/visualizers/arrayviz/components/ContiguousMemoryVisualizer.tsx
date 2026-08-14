'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Cpu, HardDrive, LayoutGrid, Sparkles, Terminal, Zap } from 'lucide-react';

export function ContiguousMemoryVisualizer() {
  const [selectedIndex, setSelectedIndex] = useState<number>(2);
  const baseAddress = 0x1000;
  const elementSize = 4; // 4 bytes for 32-bit int

  const elements = [10, 25, 42, 99, 137, 256];

  const targetAddress = baseAddress + selectedIndex * elementSize;
  const hexAddress = `0x${targetAddress.toString(16).toUpperCase()}`;

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Hardware Architecture Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Contiguous RAM Layout &amp; O(1) Pointer Arithmetic
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Address = Base + (i × 4 Bytes)
        </span>
      </div>

      {/* Memory Grid Array */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
        {elements.map((val, idx) => {
          const addr = baseAddress + idx * elementSize;
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`p-4 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-md scale-105 font-bold ring-2 ring-emerald-500'
                  : 'bg-card border-border text-foreground hover:border-emerald-500'
              }`}
            >
              <div className="text-[10px] text-muted-foreground">Index [{idx}]</div>
              <div className="text-lg font-extrabold py-1">{val}</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400">0x{addr.toString(16).toUpperCase()}</div>
            </button>
          );
        })}
      </div>

      {/* Hardware Pointer Arithmetic Inspector */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>CPU Memory Management Unit (MMU) Calculation:</span>
          <span className="text-emerald-400 font-bold">Latency: 1 Clock Cycle (0.3ns)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-amber-400">
            Address(arr[{selectedIndex}]) = 0x1000 + ({selectedIndex} × 4 bytes) = <span className="text-emerald-300 text-sm font-extrabold">{hexAddress}</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            The CPU hardware executes a single <code>LEA</code> (Load Effective Address) opcode to compute the memory address without scanning preceding elements.
          </p>
        </div>
      </div>
    </div>
  );
}
