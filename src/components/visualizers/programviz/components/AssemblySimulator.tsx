'use client';

import React, { useReducer } from 'react';
import { Cpu, RotateCcw, SkipForward } from 'lucide-react';
import {
  INITIAL_MACHINE_STATE,
  PROGRAM,
  assemblyReducer,
} from '../lib/assemblyMachine';

export function AssemblySimulator() {
  const [machine, dispatch] = useReducer(assemblyReducer, INITIAL_MACHINE_STATE);
  const { pc, r0, r1, acc, ram0x10, ramStored, stage, halted, log } = machine;

  const handleKeys = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      dispatch({ type: 'step' });
    } else if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      dispatch({ type: 'reset' });
    }
  };

  return (
    <div
      className="rounded-3xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      tabIndex={0}
      role="region"
      aria-label="8-bit assembly step-through simulator. Press the right arrow to step and R to reset."
      onKeyDown={handleKeys}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-blue-600 dark:text-blue-400">
              Interactive 8-Bit Assembly Simulator
            </div>
            <h3 className="text-xl font-bold text-foreground">
              CPU Hardware Registers &amp; Machine Stepper
            </h3>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold">
          Cycle Stage: {stage}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Assembly Instructions in ROM */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            ROM Instruction Memory:
          </span>
          <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 overflow-hidden shadow-inner p-2 font-mono text-xs space-y-1">
            {PROGRAM.map((instruction, index) => {
              const isCurrent = halted ? index === PROGRAM.length - 1 : pc === index;
              return (
                <div
                  key={instruction.addr}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="opacity-60">{instruction.addr}</span>
                    <span>{instruction.asm}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] uppercase tracking-widest animate-pulse">
                      ◀ CURRENT PC
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Each click performs one full fetch → decode → execute pass for the highlighted line.
          </p>
        </div>

        {/* Right: CPU Register File & Memory */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Hardware Register File &amp; RAM:
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">PC (Program Counter)</span>
              <div className="text-lg font-mono font-extrabold text-blue-500">
                {halted ? '—' : PROGRAM[pc]?.addr}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">ACC (Accumulator)</span>
              <div className="text-lg font-mono font-extrabold text-purple-500">{acc}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">R0 Register</span>
              <div className="text-lg font-mono font-extrabold text-emerald-500">{r0}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">R1 Register</span>
              <div className="text-lg font-mono font-extrabold text-emerald-500">{r1}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between font-mono text-xs">
            <span className="text-muted-foreground">RAM Address [0x10]:</span>
            <span className="font-bold text-amber-500 text-sm">
              {ramStored ? `${ram0x10} (Stored!)` : '0x00'}
            </span>
          </div>
        </div>
      </div>

      {/* Execution Log */}
      <div
        role="status"
        aria-live="polite"
        className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800"
      >
        <span className="text-blue-400 font-bold">Hardware Trace:</span> {log}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-blue-500/20">
        <button
          type="button"
          onClick={() => dispatch({ type: 'step' })}
          disabled={halted}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-md flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <SkipForward className="w-4 h-4" />
          <span>Step Instruction Cycle</span>
        </button>

        <button
          type="button"
          onClick={() => dispatch({ type: 'reset' })}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset CPU</span>
        </button>

        <span className="text-[11px] text-muted-foreground">
          Tip: click here, then use <kbd className="font-mono">→</kbd> to step and{' '}
          <kbd className="font-mono">R</kbd> to reset.
        </span>
      </div>
    </div>
  );
}
