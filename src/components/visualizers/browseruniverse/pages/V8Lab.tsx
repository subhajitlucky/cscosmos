'use client';

import React, { useState } from 'react';
import { Cpu, Play, RotateCcw, Zap, AlertTriangle, CheckCircle2, ShieldCheck, Code2, RefreshCw } from 'lucide-react';

export function V8Lab() {
  const [tier, setTier] = useState<'AST' | 'IGNITION' | 'TURBOFAN' | 'DEOPT'>('AST');
  const [callCount, setCallCount] = useState<number>(0);
  const [passedType, setPassedType] = useState<'monomorphic' | 'polymorphic'>('monomorphic');
  const [logs, setLogs] = useState<string[]>([
    '[INIT] V8 JavaScript Engine ready (Ignition + TurboFan).',
    '[READY] Click "Execute Function (1,000 calls)" to warm up JIT compiler.'
  ]);

  const executeWarmup = (isPoly: boolean) => {
    setPassedType(isPoly ? 'polymorphic' : 'monomorphic');
    const newCalls = callCount + 1000;
    setCallCount(newCalls);

    if (isPoly) {
      setTier('DEOPT');
      setLogs(prev => [
        `[DEOPT BAILOUT] Type feedback violated! Expected {x: number}, received {x: string, y: number}`,
        `[V8 JIT] TurboFan invalidated optimized assembly; bailing out to Ignition bytecode interpreter.`,
        ...prev.slice(0, 4)
      ]);
    } else if (newCalls >= 1000) {
      setTier('TURBOFAN');
      setLogs(prev => [
        `[HOT FUNCTION] Execution count > 1,000 with Monomorphic shape {x, y}`,
        `[TURBOFAN] Compiled to native x86-64 machine code with Inline Cache (IC) hit! (10x faster)`,
        ...prev.slice(0, 4)
      ]);
    } else {
      setTier('IGNITION');
      setLogs(prev => [
        `[IGNITION] Executing via register bytecode interpreter (Calls: ${newCalls})`,
        ...prev.slice(0, 4)
      ]);
    }
  };

  const resetAll = () => {
    setTier('AST');
    setCallCount(0);
    setPassedType('monomorphic');
    setLogs(['[RESET] V8 Engine profiler and JIT cache cleared.']);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--bu-v8-orange)]/30 bg-[var(--bu-v8-orange)]/10 text-[var(--bu-v8-orange)] text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" /> V8 Ignition Bytecode &amp; TurboFan JIT Lab
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--bu-text)]">
          V8 Engine <span className="text-[var(--bu-v8-orange)] bu-glow">JIT Tiering &amp; Deopt</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--bu-muted)] max-w-2xl leading-relaxed">
          Trace JavaScript execution from raw AST to Ignition bytecode, TurboFan native machine code compilation, and deoptimization bailouts.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left JIT Tier Diagram & Controls */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--bu-border)] bg-[var(--bu-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--bu-border-subtle)] pb-4">
            <span className="text-[var(--bu-v8-orange)] uppercase tracking-wider font-bold flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" /> V8 Execution Tier Hierarchy
            </span>
            <button
              onClick={resetAll}
              className="text-[10px] text-[var(--bu-muted)] hover:text-[var(--bu-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Tier Cards */}
          <div className="space-y-3">
            {/* AST */}
            <div className={`p-4 rounded-xl border transition-all ${
              tier === 'AST'
                ? 'border-blue-500/50 bg-blue-500/20 text-blue-300 ring-2 ring-blue-500/30'
                : 'border-[var(--bu-border-subtle)] bg-[var(--bu-bg)] text-[var(--bu-muted)]'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span>1. Parser &amp; AST (Abstract Syntax Tree)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40">COLD START</span>
              </div>
              <p className="text-[10px] opacity-80 mt-1">Parses tokens into AST node hierarchy</p>
            </div>

            {/* Ignition */}
            <div className={`p-4 rounded-xl border transition-all ${
              tier === 'IGNITION'
                ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 ring-2 ring-amber-500/30'
                : 'border-[var(--bu-border-subtle)] bg-[var(--bu-bg)] text-[var(--bu-muted)]'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span>2. Ignition Bytecode Interpreter</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40">FAST INTERPRETATION</span>
              </div>
              <p className="text-[10px] opacity-80 mt-1">LdaNamedProperty, Add, Star r0 (Low memory footprint)</p>
            </div>

            {/* TurboFan */}
            <div className={`p-4 rounded-xl border transition-all ${
              tier === 'TURBOFAN'
                ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'border-[var(--bu-border-subtle)] bg-[var(--bu-bg)] text-[var(--bu-muted)]'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span>3. TurboFan Optimizing JIT Compiler</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-emerald-300 font-bold">10X PEAK SPEED</span>
              </div>
              <p className="text-[10px] opacity-80 mt-1">Inlines functions &amp; compiles directly to native x86-64 machine code</p>
            </div>

            {/* Deopt */}
            <div className={`p-4 rounded-xl border transition-all ${
              tier === 'DEOPT'
                ? 'border-rose-500/60 bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/40'
                : 'border-[var(--bu-border-subtle)] bg-[var(--bu-bg)] text-[var(--bu-muted)]'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span>4. Deoptimization Bailout (Polymorphic Shape)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-rose-400">TYPE BAILOUT</span>
              </div>
              <p className="text-[10px] opacity-80 mt-1">Type assumption violated &rarr; falls back to Ignition interpreter</p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => executeWarmup(false)}
              className="py-3 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Call Monomorphic (Shape: &#123;x: int&#125;)
            </button>
            <button
              onClick={() => executeWarmup(true)}
              className="py-3 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Call Polymorphic (Violate Shape)
            </button>
          </div>
        </div>

        {/* Right Code & Telemetry Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Function Preview */}
          <div className="p-6 rounded-2xl border border-[var(--bu-border-subtle)] bg-[var(--bu-surface)] space-y-3">
            <span className="text-[var(--bu-v8-orange)] uppercase tracking-wider font-bold text-[10px]">
              V8 Monitored Function
            </span>
            <div className="p-4 rounded-xl bg-[var(--bu-bg)] border border-[var(--bu-border-subtle)] text-[11px] leading-relaxed">
              <pre className="text-white">
                <code>{`function addPoint(p1, p2) {
  return p1.x + p2.x; // Inline Cache site
}`}</code>
              </pre>
            </div>
            <div className="text-[10px] text-[var(--bu-muted)] flex justify-between">
              <span>Total Invocations: <strong>{callCount}</strong></span>
              <span>Active Tier: <strong className="text-[var(--bu-v8-orange)]">{tier}</strong></span>
            </div>
          </div>

          {/* Logs */}
          <div className="p-4 rounded-xl bg-[var(--bu-bg)] border border-[var(--bu-border-subtle)] space-y-1.5 text-[11px] max-h-48 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="text-[var(--bu-muted)] leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
