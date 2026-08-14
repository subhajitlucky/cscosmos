'use client';

import React, { useState } from 'react';
import { Activity, Play, RotateCcw, Zap, AlertTriangle, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';

export function AsyncLab() {
  const [mode, setMode] = useState<'async' | 'threadpool' | 'blocking'>('async');
  const [taskCount, setTaskCount] = useState<number>(20);
  const [running, setRunning] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  const runBenchmark = () => {
    setRunning(true);
    setCompletedTasks(0);
    setElapsedMs(0);

    const startTime = Date.now();
    let done = 0;

    const timerInterval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 50);

    if (mode === 'async') {
      // All 20 tasks suspend cooperatively, finish in ~1000ms
      setTimeout(() => {
        setCompletedTasks(taskCount);
        clearInterval(timerInterval);
        setElapsedMs(1050);
        setRunning(false);
      }, 1050);
    } else if (mode === 'threadpool') {
      // 5 threads in pool -> 4 batches of 5 = 4000ms
      let batch = 0;
      const batchInterval = setInterval(() => {
        batch++;
        done += 5;
        setCompletedTasks(Math.min(taskCount, done));
        if (done >= taskCount) {
          clearInterval(batchInterval);
          clearInterval(timerInterval);
          setRunning(false);
        }
      }, 750);
    } else {
      // Blocking bug: sequential execution freezes everything!
      let count = 0;
      const seqInterval = setInterval(() => {
        count++;
        done += 1;
        setCompletedTasks(done);
        if (done >= Math.min(taskCount, 5)) {
          clearInterval(seqInterval);
          clearInterval(timerInterval);
          setRunning(false);
        }
      }, 800);
    }
  };

  const resetAll = (newMode?: 'async' | 'threadpool' | 'blocking') => {
    if (newMode) setMode(newMode);
    setRunning(false);
    setCompletedTasks(0);
    setElapsedMs(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--fastapi-sky)]/30 bg-[var(--fastapi-sky)]/10 text-[var(--fastapi-sky)] text-xs font-mono">
          <Activity className="w-3.5 h-3.5" /> AsyncIO Concurrency Benchmark
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--fastapi-text)]">
          Async Event Loop <span className="text-[var(--fastapi-teal)] fastapi-glow">vs ThreadPool Offload</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--fastapi-muted)] max-w-2xl leading-relaxed">
          Simulate 20 concurrent I/O-bound requests. Observe the speed of cooperative coroutines (<code>async def</code>) vs worker threadpool queues (<code>def</code>) vs event loop starvation bugs.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-[var(--fastapi-muted)]">Execution Strategy:</span>
        {[
          ['async', '1. async def + await asyncio.sleep(1) (Non-blocking Event Loop)'],
          ['threadpool', '2. def + time.sleep(1) (AnyIO Worker ThreadPool)'],
          ['blocking', '3. async def + time.sleep(1) (EVENT LOOP STARVATION BUG)'],
        ].map(([mId, label]) => (
          <button
            key={mId}
            onClick={() => resetAll(mId as 'async' | 'threadpool' | 'blocking')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              mode === mId
                ? 'bg-[var(--fastapi-primary)] text-white font-bold shadow-md'
                : 'border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] text-[var(--fastapi-muted)] hover:text-[var(--fastapi-text)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left Telemetry & Controls */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--fastapi-border)] bg-[var(--fastapi-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--fastapi-border-subtle)] pb-4">
            <span className="text-[var(--fastapi-teal)] uppercase tracking-wider font-bold">
              Benchmark Controls
            </span>
            <button
              onClick={() => resetAll()}
              className="text-[10px] text-[var(--fastapi-muted)] hover:text-[var(--fastapi-teal)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--fastapi-muted)]">Concurrent Requests</span>
                <span className="font-bold text-[var(--fastapi-teal)]">{taskCount} requests</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={taskCount}
                onChange={(e) => setTaskCount(Number(e.target.value))}
                className="w-full accent-[var(--fastapi-teal)] cursor-pointer"
              />
            </div>

            {/* Strategy Explanations */}
            <div className="p-4 rounded-xl bg-[var(--fastapi-bg)] border border-[var(--fastapi-border-subtle)] space-y-2 text-[10px] leading-relaxed">
              {mode === 'async' && (
                <span className="text-emerald-400">
                  ✓ <strong>Cooperative Coroutine</strong>: When coroutines await I/O, the event loop switches instantly with zero thread context-switch overhead. All {taskCount} tasks complete in ~1.05 seconds.
                </span>
              )}
              {mode === 'threadpool' && (
                <span className="text-sky-400">
                  ℹ <strong>ThreadPool Offload</strong>: FastAPI safely runs sync <code>def</code> in an AnyIO thread pool (pool size: 5). Tasks queue up in batches, taking ~{(taskCount / 5) * 0.75}s.
                </span>
              )}
              {mode === 'blocking' && (
                <span className="text-rose-400">
                  ⚠ <strong>Event Loop Starvation</strong>: Calling synchronous blocking functions inside <code>async def</code> freezes the single event loop thread, locking all incoming requests!
                </span>
              )}
            </div>

            <button
              onClick={runBenchmark}
              disabled={running}
              className="w-full py-3 rounded-lg bg-[var(--fastapi-primary)] text-white font-bold hover:bg-[var(--fastapi-primary-hover)] transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {running ? 'Running Benchmark...' : `Execute ${taskCount} Concurrent Requests`}
            </button>
          </div>
        </div>

        {/* Right Task Progress Grid & Metrics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-Time Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-[var(--fastapi-surface)] border border-[var(--fastapi-border-subtle)] space-y-1">
              <span className="text-[10px] text-[var(--fastapi-muted)]">Completed Tasks</span>
              <div className="text-xl font-bold text-emerald-400">
                {completedTasks} / {taskCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--fastapi-surface)] border border-[var(--fastapi-border-subtle)] space-y-1">
              <span className="text-[10px] text-[var(--fastapi-muted)]">Elapsed Wall Clock</span>
              <div className="text-xl font-bold text-[var(--fastapi-sky)]">
                {(elapsedMs / 1000).toFixed(2)} s
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--fastapi-surface)] border border-[var(--fastapi-border-subtle)] space-y-1">
              <span className="text-[10px] text-[var(--fastapi-muted)]">Loop Starvation</span>
              <div className={`text-xl font-bold ${mode === 'blocking' ? 'text-rose-400' : 'text-emerald-400'}`}>
                {mode === 'blocking' ? 'STARVED' : 'HEALTHY'}
              </div>
            </div>
          </div>

          {/* Task Grid Visualizer */}
          <div className="p-6 rounded-2xl border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--fastapi-teal)] uppercase tracking-wider font-bold">
                Concurrent Task Execution Matrix
              </span>
              <span className="text-[10px] text-[var(--fastapi-muted)]">
                {completedTasks === taskCount ? 'ALL FINISHED' : running ? 'PROCESSING' : 'IDLE'}
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: taskCount }).map((_, idx) => {
                const isDone = idx < completedTasks;
                const isCurrent = running && !isDone && (mode === 'async' || idx < completedTasks + 5);

                return (
                  <div
                    key={idx}
                    className={`h-10 rounded-lg border flex flex-col items-center justify-center text-[9px] font-bold transition-all ${
                      isDone
                        ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                        : isCurrent
                        ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 animate-pulse'
                        : 'border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-bg)] text-[var(--fastapi-muted)]'
                    }`}
                  >
                    <span>#{idx + 1}</span>
                    <span className="text-[8px] opacity-80">{isDone ? '✓' : isCurrent ? '⚡' : '⏳'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
