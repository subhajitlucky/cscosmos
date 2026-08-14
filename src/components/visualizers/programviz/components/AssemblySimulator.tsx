'use client';

import React, { useState } from 'react';
import { Cpu, Play, RotateCcw, SkipForward, Sparkles, Terminal } from 'lucide-react';

interface Instruction {
  addr: string;
  asm: string;
  desc: string;
}

const PROGRAM: Instruction[] = [
  { addr: '0x00', asm: 'MOV R0, 15', desc: 'Load immediate value 15 into Register R0' },
  { addr: '0x01', asm: 'MOV R1, 27', desc: 'Load immediate value 27 into Register R1' },
  { addr: '0x02', asm: 'ADD R0, R1', desc: 'ALU adds R0 + R1 (15 + 27 = 42) into Accumulator' },
  { addr: '0x03', asm: 'STORE [0x10], R0', desc: 'Write value 42 from R0 into RAM address 0x10' },
  { addr: '0x04', asm: 'HALT', desc: 'Stop execution cycle' },
];

export function AssemblySimulator() {
  const [pc, setPc] = useState<number>(0);
  const [r0, setR0] = useState<number>(0);
  const [r1, setR1] = useState<number>(0);
  const [acc, setAcc] = useState<number>(0);
  const [ram0x10, setRam0x10] = useState<number>(0);
  const [stage, setStage] = useState<string>('FETCH');
  const [log, setLog] = useState<string>('Click "Step Instruction" to fetch and execute line 0x00.');

  const step = () => {
    if (pc >= PROGRAM.length - 1) {
      setLog('CPU is in HALT state. Click Reset to start again.');
      return;
    }

    const currentInst = PROGRAM[pc];
    if (pc === 0) {
      setR0(15);
      setStage('EXECUTE: MOV');
      setLog('Loaded 15 into R0. PC incremented to 0x01.');
      setPc(1);
    } else if (pc === 1) {
      setR1(27);
      setStage('EXECUTE: MOV');
      setLog('Loaded 27 into R1. PC incremented to 0x02.');
      setPc(2);
    } else if (pc === 2) {
      const sum = 15 + 27;
      setAcc(sum);
      setR0(sum);
      setStage('EXECUTE: ALU ADD');
      setLog('ALU calculated 15 + 27 = 42. R0 updated. PC incremented to 0x03.');
      setPc(3);
    } else if (pc === 3) {
      setRam0x10(42);
      setStage('WRITE-BACK: STORE');
      setLog('Stored value 42 into RAM address [0x10]. PC incremented to 0x04.');
      setPc(4);
    }
  };

  const reset = () => {
    setPc(0);
    setR0(0);
    setR1(0);
    setAcc(0);
    setRam0x10(0);
    setStage('FETCH');
    setLog('CPU Reset to initial state (PC = 0x00).');
  };

  return (
    <div className="rounded-3xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
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
              const isCurrent = pc === idx;
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
                  {isCurrent && <span className="text-[10px] uppercase tracking-widest animate-pulse">◀ CURRENT PC</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: CPU Register File & Memory */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Hardware Register File &amp; RAM:
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">PC (Program Counter)</span>
              <div className="text-lg font-mono font-extrabold text-blue-500">{PROGRAM[pc]?.addr}</div>
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
            <span className="font-bold text-amber-500 text-sm">{ram0x10 > 0 ? `${ram0x10} (Stored!)` : '0x00'}</span>
          </div>
        </div>
      </div>

      {/* Execution Log */}
      <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800">
        <span className="text-blue-400 font-bold">Hardware Trace:</span> {log}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 pt-2 border-t border-blue-500/20">
        <button
          onClick={step}
          disabled={pc >= PROGRAM.length - 1}
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
      </div>
    </div>
  );
}
