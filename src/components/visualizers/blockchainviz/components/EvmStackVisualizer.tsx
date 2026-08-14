'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Cpu, HardDrive, Layers, RefreshCw, RotateCcw, Sparkles, Terminal, Zap } from 'lucide-react';

interface EvmStep {
  opcode: string;
  desc: string;
  gasCost: number;
  totalGas: number;
  stack: string[];
  memory: string;
  storage: { [slot: string]: string };
}

const EVM_STEPS: EvmStep[] = [
  {
    opcode: 'INITIAL STATE',
    desc: 'Transaction started with 3,000,000 Gas limit.',
    gasCost: 0,
    totalGas: 0,
    stack: [],
    memory: '0x0000000000000000000000000000000000000000000000000000000000000000',
    storage: { 'Slot 0x00': '0x0000000000000000' }
  },
  {
    opcode: 'PUSH1 0x05',
    desc: 'Pushes 1-byte integer 5 onto EVM stack.',
    gasCost: 3,
    totalGas: 3,
    stack: ['0x0000000000000000000000000000000000000000000000000000000000000005'],
    memory: '0x0000000000000000000000000000000000000000000000000000000000000000',
    storage: { 'Slot 0x00': '0x0000000000000000' }
  },
  {
    opcode: 'PUSH1 0x07',
    desc: 'Pushes 1-byte integer 7 onto top of stack.',
    gasCost: 3,
    totalGas: 6,
    stack: [
      '0x0000000000000000000000000000000000000000000000000000000000000007',
      '0x0000000000000000000000000000000000000000000000000000000000000005'
    ],
    memory: '0x0000000000000000000000000000000000000000000000000000000000000000',
    storage: { 'Slot 0x00': '0x0000000000000000' }
  },
  {
    opcode: 'ADD',
    desc: 'Pops 7 and 5, computes 7 + 5 = 12 (0x0C), and pushes sum back to stack.',
    gasCost: 3,
    totalGas: 9,
    stack: ['0x000000000000000000000000000000000000000000000000000000000000000c'],
    memory: '0x0000000000000000000000000000000000000000000000000000000000000000',
    storage: { 'Slot 0x00': '0x0000000000000000' }
  },
  {
    opcode: 'MSTORE 0x00',
    desc: 'Pops value 12 and writes 32 bytes to volatile Memory offset 0x00.',
    gasCost: 6,
    totalGas: 15,
    stack: [],
    memory: '0x000000000000000000000000000000000000000000000000000000000000000c',
    storage: { 'Slot 0x00': '0x0000000000000000' }
  },
  {
    opcode: 'SSTORE 0x00 (Cold Write)',
    desc: 'Persists value 12 into persistent state Storage Slot 0 on disk.',
    gasCost: 20000,
    totalGas: 20015,
    stack: [],
    memory: '0x000000000000000000000000000000000000000000000000000000000000000c',
    storage: { 'Slot 0x00': '0x000000000000000c (12 DEC)' }
  }
];

export function EvmStackVisualizer() {
  const [stepIdx, setStepIdx] = useState<number>(0);

  const cur = EVM_STEPS[stepIdx];

  const handleNext = () => {
    if (stepIdx < EVM_STEPS.length - 1) {
      setStepIdx((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setStepIdx(0);
  };

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Virtual Machine Bytecode Execution
            </div>
            <h3 className="text-xl font-bold text-foreground">
              EVM 256-Bit Stack Machine &amp; Gas Meter
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-current" /> Gas Used: {cur.totalGas.toLocaleString()} Gas
        </span>
      </div>

      {/* Opcode Stepper Banner */}
      <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between font-mono text-xs shadow-sm">
        <div>
          <span className="text-muted-foreground text-[10px] block">Current Instruction:</span>
          <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">{cur.opcode}</span>
          <p className="text-xs text-muted-foreground pt-0.5">{cur.desc}</p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
          +{cur.gasCost} Gas
        </span>
      </div>

      {/* 3 EVM Memory Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        {/* Stack (256-bit Words) */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> EVM Stack (LIFO)
            </span>
            <span className="text-[10px] text-slate-400">{cur.stack.length}/1024 words</span>
          </div>

          <div className="space-y-1.5 min-h-[140px] flex flex-col justify-end">
            {cur.stack.length === 0 ? (
              <span className="text-slate-600 text-center py-6 block">[ Empty Stack ]</span>
            ) : (
              cur.stack.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[10px] truncate"
                >
                  [{idx}] {item}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Volatile Memory */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-sky-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Volatile Memory
            </span>
            <span className="text-[10px] text-slate-400">Byte-Addressable</span>
          </div>

          <div className="min-h-[140px] flex items-center">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-[10px] break-all leading-relaxed">
              {cur.memory}
            </div>
          </div>
        </div>

        {/* Persistent Storage */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <HardDrive className="w-4 h-4" /> State Storage (20k Gas)
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">Disk Persisted</span>
          </div>

          <div className="min-h-[140px] flex items-center space-y-2">
            <div className="w-full space-y-1.5">
              {Object.entries(cur.storage).map(([k, v]) => (
                <div key={k} className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px]">
                  <div className="font-bold text-emerald-400">{k}:</div>
                  <div className="truncate">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Bytecode</span>
        </button>

        <button
          onClick={handleNext}
          disabled={stepIdx >= EVM_STEPS.length - 1}
          className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <span>Step Next Opcode</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
