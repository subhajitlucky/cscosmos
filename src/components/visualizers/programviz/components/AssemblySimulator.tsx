'use client';

import React, { useReducer } from 'react';
import { Cpu, RotateCcw, SkipForward, Play, ListOrdered } from 'lucide-react';
import {
  INITIAL_MACHINE_STATE,
  PRESETS,
  type PresetKey,
  assemblyReducer,
} from '../lib/assemblyMachine';

export function AssemblySimulator() {
  const [machine, dispatch] = useReducer(assemblyReducer, INITIAL_MACHINE_STATE);
  const { pc, r0, r1, acc, ram0x10, ramStored, stage, halted, log, preset } = machine;

  const currentPresetKey: PresetKey = preset ?? 'addition';
  const activePreset = PRESETS[currentPresetKey];
  const program = activePreset.program;

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
      className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      tabIndex={0}
      role="region"
      aria-label="8-bit assembly step-through simulator. Press the right arrow to step and R to reset."
      onKeyDown={handleKeys}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 font-bold flex items-center justify-center shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Interactive 8-Bit Assembly Simulator
            </div>
            <h3 className="text-xl font-bold text-foreground">
              CPU Hardware Registers &amp; Machine Stepper
            </h3>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold">
          Cycle Stage: {stage}
        </span>
      </div>

      {/* Program Preset Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Select Assembly Program:</span>
          </span>
          <span className="text-[11px] font-mono text-amber-500 font-bold">
            {activePreset.badge}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
            const p = PRESETS[key];
            const isSelected = currentPresetKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => dispatch({ type: 'setPreset', preset: key })}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 font-bold border-amber-500 shadow-md'
                    : 'bg-card border-border hover:border-slate-400 dark:hover:border-slate-700 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div>{p.title}</div>
                <div
                  className={`text-[10px] font-normal truncate ${
                    isSelected ? 'text-amber-100' : 'text-muted-foreground'
                  }`}
                >
                  {p.badge}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
          {activePreset.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Assembly Instructions in ROM */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            ROM Instruction Memory ({program.length} instructions):
          </span>
          <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 overflow-hidden shadow-inner p-2 font-mono text-xs space-y-1">
            {program.map((instruction, index) => {
              const isCurrent = halted ? index === program.length - 1 : pc === index;
              return (
                <div
                  key={instruction.addr}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-md font-bold'
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
              <div className="text-lg font-mono font-extrabold text-amber-500">
                {halted ? '—' : program[pc]?.addr ?? '—'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">IR (Instruction Register)</span>
              <div className="text-sm font-mono font-extrabold text-zinc-300 truncate" title={halted ? 'HALT' : program[pc]?.asm ?? '—'}>
                {halted ? 'HALT' : program[pc]?.asm ?? '—'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">ACC (Accumulator)</span>
              <div className="text-lg font-mono font-extrabold text-emerald-500">{acc}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">R0 Register</span>
              <div className="text-lg font-mono font-extrabold text-emerald-500">{r0}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">R1 Register</span>
              <div className="text-lg font-mono font-extrabold text-emerald-500">{r1}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">RAM [0x10]</span>
              <div className="text-lg font-mono font-extrabold text-amber-500">
                {ramStored ? `${ram0x10}` : '0x00'}
              </div>
            </div>
          </div>

          {/* Educational Syntax Callout */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground space-y-1 leading-relaxed">
            <div>
              <strong className="text-foreground">MOV = COPY:</strong> <code className="font-mono">MOV R0, 15</code> copies 15 into R0. It does not erase 15.
            </div>
            <div>
              <strong className="text-foreground">[0x10] = Address:</strong> Square brackets mean &quot;look inside RAM address 0x10&quot;.
            </div>
          </div>
        </div>
      </div>

      {/* Execution Log */}
      <div
        role="status"
        aria-live="polite"
        className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800"
      >
        <span className="text-amber-400 font-bold">Hardware Trace:</span> {log}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-amber-500/20">
        <button
          type="button"
          onClick={() => dispatch({ type: 'step' })}
          disabled={halted}
          className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-md flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <SkipForward className="w-4 h-4" />
          <span>Step Instruction Cycle</span>
        </button>

        <button
          type="button"
          onClick={() => dispatch({ type: 'reset' })}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
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
