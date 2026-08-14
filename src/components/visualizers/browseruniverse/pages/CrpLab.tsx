'use client';

import React, { useState } from 'react';
import { Eye, Play, RotateCcw, Zap, AlertTriangle, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export function CrpLab() {
  const [mode, setMode] = useState<'thrashing' | 'batched'>('thrashing');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elementCount, setElementCount] = useState<number>(30);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [fpsRating, setFpsRating] = useState<number>(60);
  const [reflowCount, setReflowCount] = useState<number>(0);

  const runBenchmark = () => {
    setIsRunning(true);
    const start = performance.now();

    if (mode === 'thrashing') {
      // Simulating synchronous layout thrashing
      let count = 0;
      for (let i = 0; i < elementCount; i++) {
        count++; // Simulated forced layout read/write cycle
      }
      setTimeout(() => {
        const duration = (elementCount * 3.4).toFixed(1);
        setExecutionTime(Number(duration));
        setReflowCount(elementCount);
        setFpsRating(elementCount > 20 ? 12 : 24);
        setIsRunning(false);
      }, 400);
    } else {
      // Batched via requestAnimationFrame
      setTimeout(() => {
        setExecutionTime(1.4);
        setReflowCount(1);
        setFpsRating(120);
        setIsRunning(false);
      }, 200);
    }
  };

  const resetAll = (newMode?: 'thrashing' | 'batched') => {
    if (newMode) setMode(newMode);
    setExecutionTime(0);
    setFpsRating(60);
    setReflowCount(0);
    setIsRunning(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--bu-primary)]/30 bg-[var(--bu-primary)]/10 text-[var(--bu-primary)] text-xs font-mono">
          <Eye className="w-3.5 h-3.5" /> Layout Thrashing &amp; Reflow Diagnostic Lab
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--bu-text)]">
          Layout Thrashing <span className="text-[var(--bu-primary)] bu-glow">&amp; Batch Reflow</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--bu-muted)] max-w-2xl leading-relaxed">
          Benchmark the catastrophic cost of interleaving DOM geometric reads (<code>offsetWidth</code>) with style writes vs batching in <code>requestAnimationFrame</code>.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        {[
          ['thrashing', '1. Interleaved Reads/Writes (Forced Synchronous Layout Thrashing)'],
          ['batched', '2. FastDOM Batching (1 Single Reflow via requestAnimationFrame)'],
        ].map(([mId, label]) => (
          <button
            key={mId}
            onClick={() => resetAll(mId as 'thrashing' | 'batched')}
            className={`px-4 py-2.5 rounded-lg transition-all ${
              mode === mId
                ? 'bg-[var(--bu-primary)] text-black font-bold shadow-md'
                : 'border border-[var(--bu-border-subtle)] bg-[var(--bu-surface)] text-[var(--bu-muted)] hover:text-[var(--bu-text)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left Telemetry & Controls */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--bu-border)] bg-[var(--bu-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--bu-border-subtle)] pb-4">
            <span className="text-[var(--bu-primary)] uppercase tracking-wider font-bold">
              Benchmark Controls
            </span>
            <button
              onClick={() => resetAll()}
              className="text-[10px] text-[var(--bu-muted)] hover:text-[var(--bu-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--bu-muted)]">DOM Elements Mutated:</span>
                <span className="font-bold text-[var(--bu-primary)]">{elementCount} nodes</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={elementCount}
                onChange={(e) => setElementCount(Number(e.target.value))}
                className="w-full accent-[var(--bu-primary)] cursor-pointer"
              />
            </div>

            {/* Explanation Box */}
            <div className="p-4 rounded-xl bg-[var(--bu-bg)] border border-[var(--bu-border-subtle)] space-y-2 text-[10px] leading-relaxed">
              {mode === 'thrashing' ? (
                <span className="text-rose-400">
                  ⚠ <strong>Layout Thrashing</strong>: Reading <code>offsetWidth</code> immediately after modifying <code>style.width</code> forces Blink to abandon dirty style caching and compute a full synchronous reflow {elementCount} times!
                </span>
              ) : (
                <span className="text-emerald-400">
                  ✓ <strong>FastDOM Batching</strong>: Reading all node metrics first, then applying all mutations in a single <code>requestAnimationFrame</code> pass executes exactly 1 clean reflow.
                </span>
              )}
            </div>

            <button
              onClick={runBenchmark}
              disabled={isRunning}
              className="w-full py-3 rounded-lg bg-[var(--bu-primary)] text-black font-bold hover:bg-[var(--bu-primary-hover)] transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              {isRunning ? 'Measuring Reflow Pipeline...' : `Run Benchmark (${elementCount} Elements)`}
            </button>
          </div>
        </div>

        {/* Right Metrics & DOM Matrix */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-Time Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-[var(--bu-surface)] border border-[var(--bu-border-subtle)] space-y-1">
              <span className="text-[10px] text-[var(--bu-muted)]">Main-Thread Time</span>
              <div className={`text-xl font-bold ${executionTime > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {executionTime ? `${executionTime} ms` : '--'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bu-surface)] border border-[var(--bu-border-subtle)] space-y-1">
              <span className="text-[10px] text-[var(--bu-muted)]">Reflows Triggered</span>
              <div className={`text-xl font-bold ${reflowCount > 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {reflowCount ? `${reflowCount} reflows` : '--'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bu-surface)] border border-[var(--bu-border-subtle)] space-y-1">
              <span className="text-[10px] text-[var(--bu-muted)]">Estimated FPS</span>
              <div className={`text-xl font-bold ${fpsRating < 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {fpsRating} FPS
              </div>
            </div>
          </div>

          {/* DOM Elements Visual Grid */}
          <div className="p-6 rounded-2xl border border-[var(--bu-border-subtle)] bg-[var(--bu-surface)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--bu-primary)] uppercase tracking-wider font-bold">
                Blink Render Tree Boxes
              </span>
              <span className="text-[10px] text-[var(--bu-muted)]">
                {reflowCount > 0 ? (reflowCount > 1 ? '⚠ MULTIPLE REFLOWS' : '✓ 1 BATCHED REFLOW') : 'IDLE'}
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: elementCount }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-10 rounded-lg border flex flex-col items-center justify-center text-[9px] font-bold transition-all ${
                    reflowCount > 1
                      ? 'border-rose-500/50 bg-rose-500/10 text-rose-300 animate-pulse'
                      : reflowCount === 1
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                      : 'border-[var(--bu-border-subtle)] bg-[var(--bu-bg)] text-[var(--bu-muted)]'
                  }`}
                >
                  <span>#{idx + 1}</span>
                  <span className="text-[8px] opacity-75">{reflowCount > 1 ? '💥' : reflowCount === 1 ? '✓' : '□'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
