'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Zap,
  Play,
  RotateCcw,
  ArrowLeft,
  Terminal,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Code2,
} from 'lucide-react';

export function PythonAiLab() {
  const [activeTab, setActiveTab] = useState<'memory' | 'async' | 'pydantic'>('async');

  /* -------------------------------------------------------------------------- */
  /*                          MODE 1: ASYNC CONCURRENCY                         */
  /* -------------------------------------------------------------------------- */
  const [totalRequests, setTotalRequests] = useState<number>(12);
  const [semaphoreCap, setSemaphoreCap] = useState<number>(4);
  const [latencyMs, setLatencyMs] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [tasks, setTasks] = useState<{ id: number; status: 'queued' | 'active' | 'done'; progress: number }[]>([]);

  const runAsyncSimulation = () => {
    setIsRunning(true);
    const initialTasks = Array.from({ length: totalRequests }, (_, i) => ({
      id: i + 1,
      status: 'queued' as const,
      progress: 0,
    }));
    setTasks(initialTasks);

    let completedCount = 0;

    const interval = setInterval(() => {
      setTasks((prevTasks) => {
        let activeNow = prevTasks.filter((t) => t.status === 'active').length;
        const nextTasks = prevTasks.map((t) => {
          if (t.status === 'queued' && activeNow < semaphoreCap) {
            activeNow++;
            return { ...t, status: 'active' as const, progress: 10 };
          }
          if (t.status === 'active') {
            const nextProgress = t.progress + Math.floor(100 / (latencyMs / 60));
            if (nextProgress >= 100) {
              activeNow--;
              completedCount++;
              return { ...t, status: 'done' as const, progress: 100 };
            }
            return { ...t, progress: nextProgress };
          }
          return t;
        });

        if (completedCount >= totalRequests) {
          clearInterval(interval);
          setIsRunning(false);
        }
        return nextTasks;
      });
    }, 60);
  };

  const resetAsyncSimulation = () => {
    setIsRunning(false);
    setTasks([]);
  };

  /* -------------------------------------------------------------------------- */
  /*                         MODE 2: MEMORY PROFILING                           */
  /* -------------------------------------------------------------------------- */
  const [itemCount, setItemCount] = useState<number>(1000000);
  const pythonListBytes = itemCount * 32;
  const numpyFloat32Bytes = itemCount * 4;
  const numpyInt8Bytes = itemCount * 1;

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  /* -------------------------------------------------------------------------- */
  /*                      MODE 3: PYDANTIC SCHEMA REPAIR                        */
  /* -------------------------------------------------------------------------- */
  const [repairStep, setRepairStep] = useState<number>(0);

  const stepExplanations = [
    {
      title: 'Step 1: Raw LLM Output Received',
      desc: 'The model returns text with markdown code fences and a missing required field.',
      payload: '```json\n{\n  "query": "vector latency",\n  "confidence": "high"\n}\n```',
      status: 'UNPARSED'
    },
    {
      title: 'Step 2: Pydantic v2 Rust Validation Fails',
      desc: 'Rust pydantic-core strips markdown fences, detects confidence is a string instead of float, and flags missing is_urgent field.',
      payload: 'ValidationError: 2 validation errors for ExtractionResult\n- confidence: Input should be a valid number, unable to parse string as a number\n- is_urgent: Field required',
      status: 'VALIDATION_ERROR'
    },
    {
      title: 'Step 3: Self-Healing Repair Injection',
      desc: 'System automatically prompts the model with the exact validation trace for single-shot repair.',
      payload: 'PROMPT: "Your previous JSON failed validation with errors:\n1. confidence must be float (0.0 to 1.0)\n2. is_urgent is required bool.\nFix the JSON payload."',
      status: 'REPAIR_PROMPT'
    },
    {
      title: 'Step 4: Repaired Output Conforms 100%',
      desc: 'Model outputs valid JSON; Pydantic parses into a verified Python dataclass instance with zero runtime errors.',
      payload: '{\n  "query": "vector latency",\n  "confidence": 0.95,\n  "is_urgent": true\n}\n--> ExtractionResult(query="vector latency", confidence=0.95, is_urgent=True)',
      status: 'SUCCESS'
    }
  ];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/aicosmos/learn/python-for-ai-engineering"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-text)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Python AI Curriculum
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-xs font-semibold text-blue-400">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Interactive Workbench // Subject 02
            </div>
            <h1 className="text-3xl font-black text-[var(--ai-text)] tracking-tight mt-2">
              The Python AI Memory & Async Execution Studio
            </h1>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-1.5">
            <button
              onClick={() => setActiveTab('async')}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                activeTab === 'async'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
              }`}
            >
              Async LLM Concurrency
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                activeTab === 'memory'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
              }`}
            >
              Memory & Cache Stride
            </button>
            <button
              onClick={() => setActiveTab('pydantic')}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                activeTab === 'pydantic'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
              }`}
            >
              Pydantic Self-Healing
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ASYNC CONCURRENCY WORKBENCH */}
      {activeTab === 'async' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-5 space-y-4">
              <h2 className="text-sm font-bold font-mono text-[var(--ai-text)] flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-400" />
                Concurrency Controls
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-[var(--ai-muted)]">
                  <span>Total Tasks:</span>
                  <span className="text-[var(--ai-text)] font-bold">{totalRequests}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="2"
                  value={totalRequests}
                  onChange={(e) => setTotalRequests(Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-[var(--ai-muted)]">
                  <span>Semaphore Limit (asyncio.Semaphore):</span>
                  <span className="text-amber-400 font-bold">{semaphoreCap}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={semaphoreCap}
                  onChange={(e) => setSemaphoreCap(Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-[var(--ai-muted)]">
                  Max simultaneous active sockets permitted by rate-limiting bouncer.
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-[var(--ai-muted)]">
                  <span>Per-Call Latency:</span>
                  <span className="text-[var(--ai-text)] font-bold">{latencyMs} ms</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="800"
                  step="50"
                  value={latencyMs}
                  onChange={(e) => setLatencyMs(Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={runAsyncSimulation}
                  disabled={isRunning}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5" />
                  {isRunning ? 'Executing Event Loop...' : 'Dispatch Batch'}
                </button>
                <button
                  onClick={resetAsyncSimulation}
                  disabled={isRunning}
                  className="rounded-xl border border-[var(--ai-border)] bg-[var(--ai-bg)] p-2.5 text-xs text-[var(--ai-muted)] hover:text-[var(--ai-text)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Live Queue & Sockets Monitor */}
            <div className="md:col-span-2 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--ai-border)] pb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--ai-text)]">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  Event Loop Micro-Task Grid
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-zinc-500">Queued</span>
                  <span className="text-amber-400">Active (Max {semaphoreCap})</span>
                  <span className="text-emerald-400">Done</span>
                </div>
              </div>

              {tasks.length === 0 ? (
                <div className="p-12 text-center text-xs font-mono text-[var(--ai-muted)] border border-dashed border-[var(--ai-border)] rounded-xl">
                  Click &ldquo;Dispatch Batch&rdquo; to simulate cooperative asyncio task scheduling across semaphores.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`rounded-lg border p-3 font-mono text-xs space-y-2 transition-all ${
                        task.status === 'active'
                          ? 'border-amber-500/50 bg-amber-500/10 shadow-sm shadow-amber-500/10'
                          : task.status === 'done'
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-[var(--ai-border)] bg-[var(--ai-bg)] opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold">Req #{task.id}</span>
                        <span className={`uppercase font-bold ${
                          task.status === 'active' ? 'text-amber-400' : task.status === 'done' ? 'text-emerald-400' : 'text-zinc-500'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-black/30 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-75 ${
                            task.status === 'done' ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Event Loop Code Insight */}
              <div className="rounded-lg border border-[var(--ai-border)] bg-black/30 p-3 font-mono text-xs text-[var(--ai-muted)] space-y-1">
                <div className="text-blue-400 font-semibold">// Python Production Pattern:</div>
                <div>sem = asyncio.Semaphore({semaphoreCap})</div>
                <div>async with sem: # Throttles fan-out without 429 penalties</div>
                <div>&nbsp;&nbsp;response = await client.post(&quot;https://api.openai.com/...&quot;)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEMORY PROFILING WORKBENCH */}
      {activeTab === 'memory' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--ai-muted)]">
                <span>Vector Dimension / Element Count:</span>
                <span className="text-[var(--ai-text)] font-bold">{itemCount.toLocaleString()} numbers</span>
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="200000"
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--ai-muted)]">
                <span>100,000</span>
                <span>5,000,000</span>
                <span>10,000,000</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5 space-y-2">
                <div className="text-xs font-mono font-bold text-rose-400">Python list[float]</div>
                <div className="text-3xl font-black font-mono text-[var(--ai-text)]">
                  {formatSize(pythonListBytes)}
                </div>
                <div className="text-xs text-[var(--ai-muted)] leading-relaxed">
                  Consists of {itemCount.toLocaleString()} scattered PyFloatObject structs (24B) plus 8-byte pointer array. Zero CPU cache locality.
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-2">
                <div className="text-xs font-mono font-bold text-blue-400">NumPy float32 Tensor</div>
                <div className="text-3xl font-black font-mono text-[var(--ai-text)]">
                  {formatSize(numpyFloat32Bytes)}
                </div>
                <div className="text-xs text-[var(--ai-muted)] leading-relaxed">
                  Single continuous memory block of IEEE-754 single precision floats. Exact 8x RAM compression compared to native Python.
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-400">Quantized int8 Tensor</div>
                <div className="text-3xl font-black font-mono text-[var(--ai-text)]">
                  {formatSize(numpyInt8Bytes)}
                </div>
                <div className="text-xs text-[var(--ai-muted)] leading-relaxed">
                  Scaled 8-bit integers for quantized LLM weights. 32x smaller than native Python lists, fits into GPU L2 cache.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PYDANTIC REPAIR WORKBENCH */}
      {activeTab === 'pydantic' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--ai-border)] pb-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[var(--ai-text)]">
                  Self-Healing Structured Output Loop
                </h2>
                <p className="text-xs text-[var(--ai-muted)]">
                  Observe how production agent frameworks automatically repair invalid LLM outputs using Pydantic v2 validation errors.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRepairStep((prev) => Math.max(0, prev - 1))}
                  disabled={repairStep === 0}
                  className="rounded-lg border border-[var(--ai-border)] px-3 py-1.5 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-text)] disabled:opacity-30"
                >
                  Prev Step
                </button>
                <button
                  onClick={() => setRepairStep((prev) => Math.min(stepExplanations.length - 1, prev + 1))}
                  disabled={repairStep === stepExplanations.length - 1}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-mono font-semibold text-white hover:bg-blue-500 disabled:opacity-30"
                >
                  Next Step
                </button>
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {stepExplanations.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setRepairStep(idx)}
                  className={`rounded-lg border p-3 text-left font-mono transition-all ${
                    repairStep === idx
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-bold'
                      : 'border-[var(--ai-border)] text-[var(--ai-muted)] hover:border-blue-500/30'
                  }`}
                >
                  <div className="text-[10px]">STEP 0{idx + 1}</div>
                  <div className="text-xs truncate">{step.title.split(':')[1]}</div>
                </button>
              ))}
            </div>

            {/* Active Step Display */}
            <div className="rounded-xl border border-[var(--ai-border)] bg-[var(--ai-bg)] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--ai-text)]">
                  {stepExplanations[repairStep].title}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  stepExplanations[repairStep].status === 'SUCCESS'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : stepExplanations[repairStep].status === 'VALIDATION_ERROR'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {stepExplanations[repairStep].status}
                </span>
              </div>

              <p className="text-xs text-[var(--ai-muted)]">
                {stepExplanations[repairStep].desc}
              </p>

              <pre className="rounded-lg border border-[var(--ai-border)] bg-black/40 p-4 font-mono text-xs text-[var(--ai-text)] overflow-x-auto whitespace-pre-wrap">
                {stepExplanations[repairStep].payload}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
