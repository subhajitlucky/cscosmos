'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, Activity, Layers, Binary, ArrowUpRight, CheckCircle2, RotateCcw, Play, Zap, Box, Server } from 'lucide-react';
import { wasmTopics } from '../data/topics';

export function Home() {
  const [stack, setStack] = useState<number[]>([10, 32]);
  const [memory, setMemory] = useState<{ [address: number]: number }>({
    0x00: 42,
    0x04: 100,
    0x08: 255,
  });
  const [activeInstruction, setActiveInstruction] = useState<string>('i32.add');
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Virtual Stack Engine ready.',
    '[STACK] Initial values pushed: [10, 32]'
  ]);

  const pushVal = (val: number) => {
    if (stack.length >= 5) return;
    setStack(prev => [...prev, val]);
    setLogs(prev => [`[PUSH] i32.const ${val} -> Stack: [${[...stack, val].join(', ')}]`, ...prev.slice(0, 5)]);
  };

  const executeAdd = () => {
    if (stack.length < 2) return;
    const b = stack[stack.length - 1];
    const a = stack[stack.length - 2];
    const res = a + b;
    setStack(prev => [...prev.slice(0, -2), res]);
    setActiveInstruction('i32.add');
    setLogs(prev => [`[OP] i32.add popped (${a}, ${b}) -> pushed result ${res}`, ...prev.slice(0, 5)]);
  };

  const executeMul = () => {
    if (stack.length < 2) return;
    const b = stack[stack.length - 1];
    const a = stack[stack.length - 2];
    const res = a * b;
    setStack(prev => [...prev.slice(0, -2), res]);
    setActiveInstruction('i32.mul');
    setLogs(prev => [`[OP] i32.mul popped (${a}, ${b}) -> pushed result ${res}`, ...prev.slice(0, 5)]);
  };

  const executeStore = () => {
    if (stack.length < 1) return;
    const val = stack[stack.length - 1];
    const targetAddr = 0x0c;
    setMemory(prev => ({ ...prev, [targetAddr]: val }));
    setLogs(prev => [`[MEM] i32.store: wrote ${val} into 0x0C (Linear Memory)`, ...prev.slice(0, 5)]);
  };

  const resetMachine = () => {
    setStack([10, 32]);
    setActiveInstruction('i32.add');
    setLogs(['[RESET] Stack restored to [10, 32]']);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="wasm-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--wasm-primary)]/30 bg-[var(--wasm-primary)]/10 text-[var(--wasm-primary)] text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 animate-pulse text-[var(--wasm-primary)]" />
              Stack Machine &amp; Linear Memory Engine
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--wasm-text)]">
              Near-Native Speed.<br />
              <span className="text-[var(--wasm-primary)] wasm-glow">Predictable Execution.</span> Sandboxed Safety.
            </h1>

            <p className="text-base md:text-lg text-[var(--wasm-muted)] max-w-xl leading-relaxed">
              Deconstruct the WebAssembly virtual machine from raw bytecode opcodes to the evaluation stack, 64KB Linear Memory pages, and the language-agnostic Component Model.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/wasmcosmos/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--wasm-primary)] text-white font-semibold text-sm hover:bg-[var(--wasm-primary-hover)] transition-all shadow-[0_0_20px_rgba(101,79,240,0.35)] active:scale-95"
              >
                Explore Concept Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/wasmcosmos/stack-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--wasm-border)] bg-[var(--wasm-surface)] text-[var(--wasm-text)] font-mono text-sm hover:border-[var(--wasm-primary)] hover:text-[var(--wasm-primary)] transition-all"
              >
                <Activity className="w-4 h-4 text-[var(--wasm-primary)]" />
                Stack Machine Lab
              </Link>

              <Link
                href="/wasmcosmos/wat-compiler"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface-2)] text-[var(--wasm-muted)] font-mono text-sm hover:text-[var(--wasm-text)] transition-all"
              >
                <Binary className="w-4 h-4 text-[var(--wasm-magenta)]" />
                WAT Bytecode
              </Link>
            </div>
          </div>

          {/* Right Live Stack Machine Simulator */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--wasm-border)] bg-[var(--wasm-surface)] shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-[var(--wasm-muted)] ml-2">WasmVirtualVM::EvaluationStack</span>
                </div>
                <button
                  onClick={resetMachine}
                  className="text-[10px] font-mono text-[var(--wasm-muted)] hover:text-[var(--wasm-primary)] flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <div className="p-6 font-mono text-xs space-y-6">
                {/* Virtual Evaluation Stack Visualizer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[var(--wasm-muted)]">
                    <span>Virtual Evaluation Stack (LIFO)</span>
                    <span className="text-[var(--wasm-primary)] font-bold">{stack.length} items</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--wasm-bg)] border border-[var(--wasm-border-subtle)] min-h-[120px] flex flex-col-reverse gap-2 items-center justify-center">
                    {stack.map((val, idx) => {
                      const isTop = idx === stack.length - 1;
                      return (
                        <div
                          key={idx}
                          className={`w-full max-w-[200px] py-1.5 px-4 rounded-lg text-center font-bold border transition-all ${
                            isTop
                              ? 'border-[var(--wasm-primary)] bg-[var(--wasm-primary)]/20 text-[var(--wasm-text)] shadow-[0_0_15px_rgba(101,79,240,0.3)] animate-pulse'
                              : 'border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface-2)] text-[var(--wasm-muted)]'
                          }`}
                        >
                          i32.const {val} {isTop ? '(TOP)' : ''}
                        </div>
                      );
                    })}
                    {stack.length === 0 && (
                      <span className="text-[10px] text-[var(--wasm-muted)]">Stack Empty</span>
                    )}
                  </div>
                </div>

                {/* Linear Memory Bar (64KB Page preview) */}
                <div className="p-3 rounded-xl bg-[var(--wasm-bg)] border border-[var(--wasm-border-subtle)] space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-[var(--wasm-muted)]">
                    <span className="flex items-center gap-1">
                      <Box className="w-3 h-3 text-[var(--wasm-cyan)]" /> Linear Memory (Page 0 = 64 KiB)
                    </span>
                    <span className="text-[var(--wasm-emerald)] font-bold">ArrayBuffer [65536]</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                    {[0x00, 0x04, 0x08, 0x0c].map((addr) => (
                      <div
                        key={addr}
                        className="p-1.5 rounded bg-[var(--wasm-surface-2)] border border-[var(--wasm-border-subtle)] text-center space-y-0.5"
                      >
                        <div className="text-[var(--wasm-muted)]">0x{addr.toString(16).padStart(2, '0').toUpperCase()}</div>
                        <div className="font-bold text-[var(--wasm-text)]">{memory[addr] ?? 0}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instruction Execution Controls */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => pushVal(Math.floor(Math.random() * 50) + 1)}
                    className="py-2 px-3 rounded-lg border border-[var(--wasm-border)] bg-[var(--wasm-surface-2)] text-[var(--wasm-text)] text-[10px] hover:border-[var(--wasm-primary)] transition-all font-bold"
                  >
                    + i32.const
                  </button>
                  <button
                    onClick={executeAdd}
                    className="py-2 px-3 rounded-lg bg-[var(--wasm-primary)] text-white text-[10px] font-bold hover:bg-[var(--wasm-primary-hover)] transition-all shadow-md active:scale-95"
                  >
                    i32.add
                  </button>
                  <button
                    onClick={executeMul}
                    className="py-2 px-3 rounded-lg bg-[var(--wasm-magenta)] text-white text-[10px] font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
                  >
                    i32.mul
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: JavaScript V8 JIT vs WebAssembly */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--wasm-primary)] uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Execution Model Comparison
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--wasm-text)]">
            JavaScript Dynamic JIT vs WebAssembly AOT
          </h2>
          <p className="text-sm text-[var(--wasm-muted)]">
            Why WebAssembly delivers predictable, rock-solid 60 FPS computation without deoptimization spikes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* JavaScript V8 card */}
          <div className="p-8 rounded-2xl border border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--wasm-text)]">JavaScript (V8 / Ignition &amp; TurboFan)</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Dynamic JIT
              </span>
            </div>
            <p className="text-xs text-[var(--wasm-muted)] leading-relaxed">
              Source code must be downloaded, parsed into an AST, interpreted with bytecode profiling, and JIT-compiled at runtime. Hidden class mutations trigger slow deoptimization bailouts.
            </p>
            <div className="p-4 rounded-lg bg-[var(--wasm-bg)] font-mono text-[11px] text-[var(--wasm-muted)] space-y-2 border border-[var(--wasm-border-subtle)]">
              <div>• Heavy text parsing and AST compilation overhead</div>
              <div>• Dynamic type profiling with risk of JIT deoptimization</div>
              <div>• Non-deterministic Garbage Collection pauses (GC spikes)</div>
              <div>• Slower initial cold start warmup</div>
            </div>
          </div>

          {/* WebAssembly card */}
          <div className="p-8 rounded-2xl border-2 border-[var(--wasm-primary)]/40 bg-[var(--wasm-surface)] space-y-6 shadow-[0_0_30px_rgba(101,79,240,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--wasm-text)]">WebAssembly (AOT Compiled Wasm)</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--wasm-primary)]/10 text-[var(--wasm-primary)] border border-[var(--wasm-primary)]/30 font-bold">
                Near-Native AOT
              </span>
            </div>
            <p className="text-xs text-[var(--wasm-muted)] leading-relaxed">
              Compact binary format with direct single-pass streaming compilation. Types are statically checked, guaranteeing deterministic CPU performance with zero runtime deoptimizations.
            </p>
            <div className="p-4 rounded-lg bg-[var(--wasm-bg)] font-mono text-[11px] text-[var(--wasm-muted)] space-y-2 border border-[var(--wasm-primary)]/20">
              <div className="text-[var(--wasm-primary)]">• Instant linear streaming compilation from network stream</div>
              <div className="text-[var(--wasm-cyan)]">• Static types eliminate all JIT deoptimization bails</div>
              <div className="text-[var(--wasm-emerald)]">• Explicit linear memory management (0 Garbage Collection pauses)</div>
              <div className="text-[var(--wasm-text)]">• Native hardware SIMD vectorization support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--wasm-border-subtle)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--wasm-primary)] uppercase tracking-wider">
              Architecture Tracks
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--wasm-text)] mt-1">
              WebAssembly Modules
            </h2>
          </div>
          <Link
            href="/wasmcosmos/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--wasm-primary)] hover:underline"
          >
            View all 8 topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wasmTopics.slice(0, 6).map((topic) => (
            <Link
              key={topic.id}
              href={`/wasmcosmos/learn/${topic.id}`}
              className="wasm-card p-6 rounded-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--wasm-primary)]">
                  {topic.kicker}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--wasm-muted)] group-hover:text-[var(--wasm-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--wasm-text)] group-hover:text-[var(--wasm-primary)] transition-colors">
                {topic.title}
              </h3>

              <p className="text-xs text-[var(--wasm-muted)] leading-relaxed line-clamp-2">
                {topic.summary}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--wasm-border-subtle)] text-[var(--wasm-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--wasm-muted)]">
                  {topic.group}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
