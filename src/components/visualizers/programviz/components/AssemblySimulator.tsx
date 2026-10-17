'use client';

import React, { useState } from 'react';
import { Cpu, RotateCcw, SkipForward } from 'lucide-react';

interface Instruction {
  addr: string;
  asm: string;
  desc: string;
}

const PROGRAM: Instruction[] = [
  { addr: '0x00', asm: 'MOV R0, 15', desc: 'Put the value 15 into register R0' },
  { addr: '0x01', asm: 'MOV R1, 27', desc: 'Put the value 27 into register R1' },
  { addr: '0x02', asm: 'ADD R0, R1', desc: 'ALU computes R0 + R1 (42), stored in ACC and R0' },
  { addr: '0x03', asm: 'STORE [0x10], R0', desc: 'Write the value 42 into RAM address 0x10' },
  { addr: '0x04', asm: 'HALT', desc: 'Stop the fetch-execute cycle' },
];

const INITIAL_LOG =
  'Press “Step Instruction Cycle” (or the → key) to fetch and execute ROM[0x00].';

export function AssemblySimulator() {
  const [pc, setPc] = useState<number>(0);
  const [r0, setR0] = useState<number>(0);
  const [r1, setR1] = useState<number>(0);
  const [acc, setAcc] = useState<number>(0);
  const [ram0x10, setRam0x10] = useState<number>(0);
  const [stage, setStage] = useState<string>('READY');
  const [halted, setHalted] = useState<boolean>(false);
  const [log, setLog] = useState<string>(INITIAL_LOG);

  const step = () => {
    if (halted) return;
    if (pc === 0) {
      setR0(15);
      setPc(1);
      setStage('EXECUTE: MOV');
      setLog('Fetched ROM[0x00] “MOV R0, 15” → R0 = 15. PC moved to 0x01.');
    } else if (pc === 1) {
      setR1(27);
      setPc(2);
      setStage('EXECUTE: MOV');
      setLog('Fetched ROM[0x01] “MOV R1, 27” → R1 = 27. PC moved to 0x02.');
    } else if (pc === 2) {
      setAcc(42);
      setR0(42);
      setPc(3);
      setStage('EXECUTE: ALU ADD');
      setLog('Fetched ROM[0x02] “ADD R0, R1” → ALU: 15 + 27 = 42. ACC and R0 now hold 42. PC moved to 0x03.');
    } else if (pc === 3) {
      setRam0x10(42);
      setPc(4);
      setStage('WRITE-BACK: STORE');
      setLog('Fetched ROM[0x03] “STORE [0x10], R0” → RAM[0x10] = 42. PC moved to 0x04.');
    } else if (pc === 4) {
      setHalted(true);
      setStage('HALTED');
      setLog('Fetched ROM[0x04] “HALT” → the CPU stops fetching. Final state: RAM[0x10] holds 42. Press Reset (or R) to run again.');
    }
  };

  const reset = () => {
    setPc(0);
    setR0(0);
    setR1(0);
    setAcc(0);
    setRam0x10(0);
    setStage('READY');
    setHalted(false);
    setLog(INITIAL_LOG);
  };

  const handleKeys = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      reset();
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
            {PROGRAM.map((inst, idx) => {
              const isCurrent = halted ? idx === PROGRAM.length - 1 : pc === idx;
              return (
                <div
                  key={inst.addr}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="opacity-60">{inst.addr}</span>
                    <span>{inst.asm}</span>
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
              {ram0x10 > 0 ? `${ram0x10} (Stored!)` : '0x00'}
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
          onClick={step}
          disabled={halted}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-md flex items-center gap-2"
        >
          <SkipForward className="w-4 h-4" />
          <span>Step Instruction Cycle</span>
        </button>

        <button
          onClick={reset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset CPU</span>
        </button>

        <span className="text-[11px] text-muted-foreground">
          Tip: ← click here, then use <kbd className="font-mono">→</kbd> to step and{' '}
          <kbd className="font-mono">R</kbd> to reset.
        </span>
      </div>
    </div>
  );
}
