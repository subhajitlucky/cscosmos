'use client';

import React, { useState } from 'react';
import { Activity, Play, RotateCcw, ArrowRight, Zap, Box, Server, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';

interface Instruction {
  op: string;
  arg?: number;
  desc: string;
}

const PROGRAM_PRESETS: { [name: string]: Instruction[] } = {
  'Hypotenuse (3^2 + 4^2)': [
    { op: 'i32.const', arg: 3, desc: 'Push 3 onto stack' },
    { op: 'i32.const', arg: 3, desc: 'Push 3 onto stack' },
    { op: 'i32.mul', desc: 'Pop 3, 3 -> push 9' },
    { op: 'i32.const', arg: 4, desc: 'Push 4 onto stack' },
    { op: 'i32.const', arg: 4, desc: 'Push 4 onto stack' },
    { op: 'i32.mul', desc: 'Pop 4, 4 -> push 16' },
    { op: 'i32.add', desc: 'Pop 16, 9 -> push 25 (Result)' },
  ],
  'Linear Memory Store & Load': [
    { op: 'i32.const', arg: 0x00, desc: 'Push memory address 0x00' },
    { op: 'i32.const', arg: 42, desc: 'Push value 42' },
    { op: 'i32.store', desc: 'Store 42 at address 0x00 in Linear Memory' },
    { op: 'i32.const', arg: 0x00, desc: 'Push memory address 0x00' },
    { op: 'i32.load', desc: 'Load integer from 0x00 -> push 42 onto stack' },
  ],
  'Bitwise Shift & Mask': [
    { op: 'i32.const', arg: 0b00001111, desc: 'Push binary 15 (0x0F)' },
    { op: 'i32.const', arg: 4, desc: 'Push shift count 4' },
    { op: 'i32.shl', desc: 'Shift left by 4 -> push 240 (0xF0)' },
    { op: 'i32.const', arg: 0b11110000, desc: 'Push mask 240' },
    { op: 'i32.and', desc: 'Bitwise AND -> push 240' },
  ],
};

export function StackLab() {
  const [selectedPreset, setSelectedPreset] = useState<string>('Hypotenuse (3^2 + 4^2)');
  const [program, setProgram] = useState<Instruction[]>(PROGRAM_PRESETS['Hypotenuse (3^2 + 4^2)']);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [stackHistory, setStackHistory] = useState<number[][]>([[]]);
  const [memory, setMemory] = useState<{ [address: number]: number }>({});
  const [logs, setLogs] = useState<string[]>([
    '[INIT] WebAssembly Virtual Stack Machine initialized.',
    '[READY] Click "Step Forward" to execute bytecode instructions.'
  ]);

  const resetProgram = (presetName: string) => {
    setSelectedPreset(presetName);
    const newProg = PROGRAM_PRESETS[presetName];
    setProgram(newProg);
    setStepIndex(0);
    setStackHistory([[]]);
    setMemory({});
    setLogs([`[LOAD] Preset "${presetName}" loaded. Stack reset.`]);
  };

  const stepForward = () => {
    if (stepIndex >= program.length) return;
    const currentStack = [...stackHistory[stepIndex]];
    const instr = program[stepIndex];
    let newLog = '';

    if (instr.op === 'i32.const') {
      currentStack.push(instr.arg ?? 0);
      newLog = `[STEP ${stepIndex + 1}] i32.const ${instr.arg} -> Stack: [${currentStack.join(', ')}]`;
    } else if (instr.op === 'i32.add') {
      const b = currentStack.pop() ?? 0;
      const a = currentStack.pop() ?? 0;
      const res = a + b;
      currentStack.push(res);
      newLog = `[STEP ${stepIndex + 1}] i32.add: ${a} + ${b} = ${res}`;
    } else if (instr.op === 'i32.mul') {
      const b = currentStack.pop() ?? 0;
      const a = currentStack.pop() ?? 0;
      const res = a * b;
      currentStack.push(res);
      newLog = `[STEP ${stepIndex + 1}] i32.mul: ${a} * ${b} = ${res}`;
    } else if (instr.op === 'i32.shl') {
      const shift = currentStack.pop() ?? 0;
      const val = currentStack.pop() ?? 0;
      const res = val << shift;
      currentStack.push(res);
      newLog = `[STEP ${stepIndex + 1}] i32.shl: ${val} << ${shift} = ${res}`;
    } else if (instr.op === 'i32.and') {
      const b = currentStack.pop() ?? 0;
      const a = currentStack.pop() ?? 0;
      const res = a & b;
      currentStack.push(res);
      newLog = `[STEP ${stepIndex + 1}] i32.and: ${a} & ${b} = ${res}`;
    } else if (instr.op === 'i32.store') {
      const val = currentStack.pop() ?? 0;
      const addr = currentStack.pop() ?? 0;
      setMemory(prev => ({ ...prev, [addr]: val }));
      newLog = `[STEP ${stepIndex + 1}] i32.store: wrote ${val} to memory address 0x${addr.toString(16).padStart(2, '0').toUpperCase()}`;
    } else if (instr.op === 'i32.load') {
      const addr = currentStack.pop() ?? 0;
      const val = memory[addr] ?? 0;
      currentStack.push(val);
      newLog = `[STEP ${stepIndex + 1}] i32.load: read ${val} from 0x${addr.toString(16).padStart(2, '0').toUpperCase()}`;
    }

    setStackHistory(prev => [...prev, currentStack]);
    setStepIndex(s => s + 1);
    setLogs(prev => [newLog, ...prev.slice(0, 6)]);
  };

  const currentStack = stackHistory[stepIndex] || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--wasm-primary)]/30 bg-[var(--wasm-primary)]/10 text-[var(--wasm-primary)] text-xs font-mono">
          <Activity className="w-3.5 h-3.5" /> Virtual Stack Machine Emulator
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--wasm-text)]">
          Stack Machine <span className="text-[var(--wasm-primary)] wasm-glow">&amp; Memory Lab</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--wasm-muted)] max-w-2xl leading-relaxed">
          Step through WebAssembly bytecode instruction by instruction. Observe the evaluation stack push/pop cycle and inspect 64KB Linear Memory cell mutations.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-[var(--wasm-muted)]">Program Preset:</span>
        {Object.keys(PROGRAM_PRESETS).map((name) => (
          <button
            key={name}
            onClick={() => resetProgram(name)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedPreset === name
                ? 'bg-[var(--wasm-primary)] text-white font-bold shadow-md'
                : 'border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] text-[var(--wasm-muted)] hover:text-[var(--wasm-text)]'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Instruction Timeline */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--wasm-border)] bg-[var(--wasm-surface)] p-6 space-y-6 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[var(--wasm-border-subtle)] pb-4">
            <span className="text-[var(--wasm-primary)] uppercase tracking-wider font-bold">
              Bytecode Instruction Stream
            </span>
            <span className="text-[10px] text-[var(--wasm-muted)]">
              Step {stepIndex} of {program.length}
            </span>
          </div>

          {/* Instruction Sequence List */}
          <div className="space-y-2">
            {program.map((instr, idx) => {
              const isCurrent = stepIndex === idx;
              const isPast = stepIndex > idx;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'border-[var(--wasm-primary)] bg-[var(--wasm-primary)]/10 text-[var(--wasm-text)] shadow-md'
                      : isPast
                      ? 'border-[var(--wasm-border-subtle)] bg-[var(--wasm-bg)] text-[var(--wasm-muted)] opacity-60'
                      : 'border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface-2)] text-[var(--wasm-muted)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isCurrent ? 'bg-[var(--wasm-primary)] text-white' : 'bg-[var(--wasm-bg)] text-[var(--wasm-muted)]'
                    }`}>
                      0{idx + 1}
                    </span>
                    <span className="font-bold text-[var(--wasm-text)]">
                      {instr.op} {instr.arg !== undefined ? instr.arg : ''}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--wasm-muted)] truncate max-w-[150px]">
                    {instr.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stepping Controls */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={stepForward}
              disabled={stepIndex >= program.length}
              className="py-3 rounded-lg bg-[var(--wasm-primary)] text-white font-bold text-xs hover:bg-[var(--wasm-primary-hover)] transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Step Forward
            </button>
            <button
              onClick={() => resetProgram(selectedPreset)}
              className="py-3 rounded-lg border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface-2)] text-[var(--wasm-text)] text-xs hover:border-[var(--wasm-primary)] transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
          </div>
        </div>

        {/* Right Evaluation Stack & Linear Memory */}
        <div className="lg:col-span-7 space-y-6 font-mono text-xs">
          {/* Virtual Stack Stage */}
          <div className="rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--wasm-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Virtual Evaluation Stack (LIFO)
              </span>
              <span className="text-[10px] text-[var(--wasm-muted)]">
                {currentStack.length} values on stack
              </span>
            </div>

            <div className="p-6 rounded-xl bg-[var(--wasm-bg)] border border-[var(--wasm-border-subtle)] min-h-[160px] flex flex-col-reverse items-center justify-center gap-2.5">
              {currentStack.map((val, idx) => {
                const isTop = idx === currentStack.length - 1;
                return (
                  <div
                    key={idx}
                    className={`w-full max-w-sm py-2 px-6 rounded-lg text-center font-bold border transition-all flex items-center justify-between ${
                      isTop
                        ? 'border-[var(--wasm-primary)] bg-[var(--wasm-primary)]/20 text-[var(--wasm-text)] shadow-[0_0_20px_rgba(101,79,240,0.3)] animate-pulse'
                        : 'border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface-2)] text-[var(--wasm-muted)]'
                    }`}
                  >
                    <span>Slot #{idx}</span>
                    <span className="text-base text-[var(--wasm-text)]">{val}</span>
                    <span className="text-[10px] text-[var(--wasm-primary)]">{isTop ? 'TOP' : ''}</span>
                  </div>
                );
              })}
              {currentStack.length === 0 && (
                <span className="text-xs text-[var(--wasm-muted)]">Stack Empty — Ready for i32.const</span>
              )}
            </div>
          </div>

          {/* Linear Memory Grid */}
          <div className="rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--wasm-cyan)] uppercase tracking-wider font-bold flex items-center gap-2">
                <Box className="w-4 h-4" /> Linear Memory (Page 0: 0x0000 - 0xFFFF)
              </span>
              <span className="text-[10px] text-[var(--wasm-muted)]">
                MUTABLE ARRAYBUFFER
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-[10px]">
              {[
                0x00, 0x04, 0x08, 0x0c, 0x10, 0x14, 0x18, 0x1c
              ].map((addr) => {
                const val = memory[addr];
                const hasValue = val !== undefined;
                return (
                  <div
                    key={addr}
                    className={`p-2.5 rounded-lg border transition-all ${
                      hasValue
                        ? 'border-[var(--wasm-emerald)]/50 bg-[var(--wasm-emerald)]/10 text-[var(--wasm-emerald)] font-bold shadow-sm'
                        : 'border-[var(--wasm-border-subtle)] bg-[var(--wasm-bg)] text-[var(--wasm-muted)]'
                    }`}
                  >
                    <div className="text-[9px] opacity-70">0x{addr.toString(16).padStart(2, '0').toUpperCase()}</div>
                    <div className="text-sm text-[var(--wasm-text)] mt-1">{hasValue ? val : '0'}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execution Log */}
          <div className="p-4 rounded-xl bg-[var(--wasm-bg)] border border-[var(--wasm-border-subtle)] space-y-1.5 text-[11px] max-h-32 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="text-[var(--wasm-muted)] leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
