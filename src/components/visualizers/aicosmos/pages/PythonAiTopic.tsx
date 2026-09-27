'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  pythonAiSubtopics,
  getPythonAiSubtopic,
  type PythonAiSubtopic,
} from '../data/python-ai';
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Copy,
  Check,
  Cpu,
  AlertTriangle,
  Lightbulb,
  Layers,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  ShieldAlert,
  Server,
  Terminal,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                        INTERACTIVE VISUALIZER WIDGETS                      */
/* -------------------------------------------------------------------------- */

function PyObjectMemoryWidget() {
  const [count, setCount] = useState<number>(1000000);

  const pythonListBytes = count * 32; // 8 bytes pointer + 24 bytes PyFloatObject
  const numpyFloat32Bytes = count * 4; // 4 bytes contiguous
  const numpyInt8Bytes = count * 1; // 1 byte contiguous
  const savingsFactor = (pythonListBytes / numpyFloat32Bytes).toFixed(1);

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  return (
    <div className="space-y-4 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-5">
      <div className="flex items-center justify-between border-b border-[var(--ai-border)] pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-blue-400" />
          <span className="font-mono text-xs font-semibold text-[var(--ai-text)] uppercase tracking-wider">
            Live Memory Allocation Inspector: PyObject vs Contiguous Buffer
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-emerald-400">
          {savingsFactor}x Memory Reduction
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--ai-muted)]">
          <span>Array Element Count (Floats):</span>
          <span className="text-[var(--ai-text)] font-bold">{count.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="10000"
          max="5000000"
          step="50000"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-[var(--ai-muted)]">
          <span>10,000</span>
          <span>1,000,000</span>
          <span>5,000,000</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 space-y-1">
          <div className="text-[11px] font-mono text-rose-400">Standard Python list[float]</div>
          <div className="text-xl font-bold font-mono text-[var(--ai-text)]">
            {formatBytes(pythonListBytes)}
          </div>
          <div className="text-[10px] text-[var(--ai-muted)]">
            32 bytes/item (pointer chasing + boxed PyFloat)
          </div>
        </div>

        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 space-y-1">
          <div className="text-[11px] font-mono text-blue-400">NumPy / PyTorch float32</div>
          <div className="text-xl font-bold font-mono text-[var(--ai-text)]">
            {formatBytes(numpyFloat32Bytes)}
          </div>
          <div className="text-[10px] text-[var(--ai-muted)]">
            4 bytes/item (contiguous C array, SIMD ready)
          </div>
        </div>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-1">
          <div className="text-[11px] font-mono text-emerald-400">Quantized int8 Tensor</div>
          <div className="text-xl font-bold font-mono text-[var(--ai-text)]">
            {formatBytes(numpyInt8Bytes)}
          </div>
          <div className="text-[10px] text-[var(--ai-muted)]">
            1 byte/item (32x smaller than native Python)
          </div>
        </div>
      </div>
    </div>
  );
}

function VectorVsLoopWidget() {
  const [arraySize, setArraySize] = useState<number>(100000);
  const [running, setRunning] = useState<boolean>(false);
  const [executed, setExecuted] = useState<boolean>(false);

  const pythonLoopTimeMs = (arraySize * 0.0006).toFixed(1);
  const numpyVectorTimeMs = (arraySize * 0.000007).toFixed(3);
  const speedup = (Number(pythonLoopTimeMs) / Math.max(0.001, Number(numpyVectorTimeMs))).toFixed(0);

  const runBenchmark = () => {
    setRunning(true);
    setExecuted(false);
    setTimeout(() => {
      setRunning(false);
      setExecuted(true);
    }, 400);
  };

  return (
    <div className="space-y-4 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-5">
      <div className="flex items-center justify-between border-b border-[var(--ai-border)] pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="font-mono text-xs font-semibold text-[var(--ai-text)] uppercase tracking-wider">
            Vectorized SIMD Kernel vs Interpreted Bytecode Loop
          </span>
        </div>
        <button
          onClick={runBenchmark}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50"
        >
          <Play className="h-3 w-3" />
          {running ? 'Benchmarking...' : 'Simulate Benchmark'}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--ai-muted)]">
          <span>Array Size:</span>
          <span className="text-[var(--ai-text)] font-bold">{arraySize.toLocaleString()} elements</span>
        </div>
        <input
          type="range"
          min="10000"
          max="500000"
          step="20000"
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-rose-400">Pure Python for-loop</span>
            <span className="font-bold text-[var(--ai-text)]">
              {executed ? `~${pythonLoopTimeMs} ms` : '--'}
            </span>
          </div>
          <div className="font-mono text-[11px] text-[var(--ai-muted)] bg-black/20 p-2 rounded">
            for x in array:<br />
            &nbsp;&nbsp;total += x * 2.0
          </div>
          <div className="text-[10px] text-[var(--ai-muted)]">
            Per-element PyObject type checks, pointer dereferencing, and evaluation loop overhead.
          </div>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400">NumPy Vectorized Kernel</span>
            <span className="font-bold text-[var(--ai-text)]">
              {executed ? `~${numpyVectorTimeMs} ms` : '--'}
            </span>
          </div>
          <div className="font-mono text-[11px] text-[var(--ai-muted)] bg-black/20 p-2 rounded">
            total = array * 2.0 # AVX-512 SIMD
          </div>
          <div className="text-[10px] text-[var(--ai-muted)]">
            Single C kernel call executing 8-16 parallel floating-point operations per CPU clock cycle.
          </div>
        </div>
      </div>

      {executed && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-center font-mono text-xs text-emerald-400 font-semibold">
          Hardware Speedup: ~{speedup}x Faster Execution
        </div>
      )}
    </div>
  );
}

function GilConcurrencyWidget() {
  const [mode, setMode] = useState<'cpu' | 'gemm'>('cpu');

  return (
    <div className="space-y-4 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--ai-border)] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-purple-400" />
          <span className="font-mono text-xs font-semibold text-[var(--ai-text)] uppercase tracking-wider">
            CPython Global Interpreter Lock (GIL) Concurrency Engine
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMode('cpu')}
            className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition-all ${
              mode === 'cpu'
                ? 'bg-rose-600 text-white'
                : 'border border-[var(--ai-border)] text-[var(--ai-muted)]'
            }`}
          >
            Pure Python (GIL Held)
          </button>
          <button
            onClick={() => setMode('gemm')}
            className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition-all ${
              mode === 'gemm'
                ? 'bg-emerald-600 text-white'
                : 'border border-[var(--ai-border)] text-[var(--ai-muted)]'
            }`}
          >
            C/CUDA Tensor (GIL Released)
          </button>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="text-[var(--ai-muted)]">
          {mode === 'cpu'
            ? 'When running pure Python bytecode, only ONE thread holds the GIL at any instant. Other threads stall waiting for the lock:'
            : 'When running NumPy/PyTorch C-extensions (GEMM matrix multiply), the GIL is explicitly released via Py_BEGIN_ALLOW_THREADS:'}
        </div>

        {/* 4 Thread Timelines */}
        {[1, 2, 3, 4].map((t) => (
          <div key={t} className="flex items-center gap-3">
            <span className="w-16 text-[var(--ai-muted)] text-[11px]">Core #{t}</span>
            <div className="flex-1 h-6 rounded bg-[var(--ai-bg)] border border-[var(--ai-border)] flex overflow-hidden">
              {mode === 'cpu' ? (
                // Only 1 thread active at once
                t === 1 ? (
                  <div className="h-full w-full bg-rose-500/80 text-[10px] text-white flex items-center justify-center font-bold">
                    ACTIVE (Holding GIL)
                  </div>
                ) : (
                  <div className="h-full w-full bg-zinc-800/60 text-[10px] text-zinc-500 flex items-center justify-center">
                    BLOCKED (Waiting for GIL)
                  </div>
                )
              ) : (
                // All 4 threads running in parallel in C
                <div className="h-full w-full bg-emerald-500/80 text-[10px] text-white flex items-center justify-center font-bold">
                  ACTIVE 100% (OpenBLAS / CUDA Warp)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--ai-border)] bg-[var(--ai-bg)] p-3 text-xs font-mono flex items-center justify-between">
        <span className="text-[var(--ai-muted)]">Effective Multi-Core Scaling:</span>
        <span className={mode === 'cpu' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
          {mode === 'cpu' ? '1.0x (No multi-core speedup)' : '4.0x (Linear hardware scaling)'}
        </span>
      </div>
    </div>
  );
}

function StridesMemoryWidget() {
  const [layout, setLayout] = useState<'row' | 'col' | 'trans'>('row');

  return (
    <div className="space-y-4 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--ai-border)] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span className="font-mono text-xs font-semibold text-[var(--ai-text)] uppercase tracking-wider">
            2D Array Memory Strides & Zero-Copy Transpose
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLayout('row')}
            className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium ${
              layout === 'row' ? 'bg-cyan-600 text-white' : 'border border-[var(--ai-border)] text-[var(--ai-muted)]'
            }`}
          >
            C-Order (Row Major)
          </button>
          <button
            onClick={() => setLayout('trans')}
            className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium ${
              layout === 'trans' ? 'bg-purple-600 text-white' : 'border border-[var(--ai-border)] text-[var(--ai-muted)]'
            }`}
          >
            Transposed (.T)
          </button>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between bg-[var(--ai-bg)] p-3 rounded border border-[var(--ai-border)]">
          <div>
            <span className="text-[var(--ai-muted)]">Shape: </span>
            <span className="text-cyan-400 font-bold">{layout === 'trans' ? '(4, 3)' : '(3, 4)'}</span>
          </div>
          <div>
            <span className="text-[var(--ai-muted)]">Strides (Bytes): </span>
            <span className="text-purple-400 font-bold">{layout === 'trans' ? '(4, 16)' : '(16, 4)'}</span>
          </div>
          <div>
            <span className="text-[var(--ai-muted)]">Zero Copy View: </span>
            <span className="text-emerald-400 font-bold">YES (view.base is arr)</span>
          </div>
        </div>

        {/* 1D Physical Memory Buffer Representation */}
        <div className="space-y-1">
          <div className="text-[11px] text-[var(--ai-muted)]">Physical 1D Memory Buffer (Continuous Bytes in RAM):</div>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 text-center">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="rounded border border-[var(--ai-border)] bg-[var(--ai-bg)] p-2 text-xs font-bold text-[var(--ai-text)]"
              >
                <div className="text-[9px] text-[var(--ai-muted)]">+{i * 4}B</div>
                {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AsyncStreamerWidget() {
  const [streaming, setStreaming] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');
  const [tokensEmitted, setTokensEmitted] = useState<number>(0);

  const tokens = ['The', ' future', ' of', ' AI', ' engineering', ' demands', ' high-performance', ' Python', ' async', ' pipelines.'];

  const triggerStream = () => {
    setStreaming(true);
    setOutput('');
    setTokensEmitted(0);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < tokens.length) {
        setOutput((prev) => prev + tokens[idx]);
        setTokensEmitted(idx + 1);
        idx++;
      } else {
        clearInterval(interval);
        setStreaming(false);
      }
    }, 120);
  };

  return (
    <div className="space-y-4 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-5">
      <div className="flex items-center justify-between border-b border-[var(--ai-border)] pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="font-mono text-xs font-semibold text-[var(--ai-text)] uppercase tracking-wider">
            Token Streaming via Async Generator (async for)
          </span>
        </div>
        <button
          onClick={triggerStream}
          disabled={streaming}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
        >
          <Play className="h-3 w-3" />
          {streaming ? 'Streaming Chunks...' : 'Emit Stream'}
        </button>
      </div>

      <div className="rounded-lg border border-[var(--ai-border)] bg-black/40 p-4 font-mono text-sm text-emerald-400 min-h-[60px] flex items-center">
        {output || <span className="text-zinc-600">// Click "Emit Stream" to test async generator yielding...</span>}
        {streaming && <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />}
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-[var(--ai-muted)]">
        <span>Time to First Token (TTFT): <strong className="text-[var(--ai-text)]">~120ms</strong></span>
        <span>Tokens Emitted: <strong className="text-emerald-400">{tokensEmitted} / {tokens.length}</strong></span>
      </div>
    </div>
  );
}

function PydanticValidatorWidget() {
  const [selectedCase, setSelectedCase] = useState<'valid' | 'missing' | 'type_error'>('valid');

  const cases = {
    valid: {
      json: '{\n  "query": "vector index latency",\n  "confidence": 0.94,\n  "is_urgent": true\n}',
      status: 'VALID',
      detail: 'Parsed successfully by pydantic-core in 0.08ms'
    },
    missing: {
      json: '{\n  "query": "vector index latency",\n  "confidence": 0.94\n}',
      status: 'VALIDATION_ERROR',
      detail: 'Field required: [is_urgent] (type=missing)'
    },
    type_error: {
      json: '{\n  "query": "vector index latency",\n  "confidence": 1.45,\n  "is_urgent": "not_a_bool"\n}',
      status: 'VALIDATION_ERROR',
      detail: 'Value error: confidence must be <= 1.0; Input should be a valid boolean'
    }
  };

  const activeCase = cases[selectedCase];

  return (
    <div className="space-y-4 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--ai-border)] pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <span className="font-mono text-xs font-semibold text-[var(--ai-text)] uppercase tracking-wider">
            Pydantic v2 Core Rust Validation & Error Recovery
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedCase('valid')}
            className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium ${
              selectedCase === 'valid' ? 'bg-emerald-600 text-white' : 'border border-[var(--ai-border)] text-[var(--ai-muted)]'
            }`}
          >
            Valid JSON
          </button>
          <button
            onClick={() => setSelectedCase('missing')}
            className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium ${
              selectedCase === 'missing' ? 'bg-amber-600 text-white' : 'border border-[var(--ai-border)] text-[var(--ai-muted)]'
            }`}
          >
            Missing Key
          </button>
          <button
            onClick={() => setSelectedCase('type_error')}
            className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium ${
              selectedCase === 'type_error' ? 'bg-rose-600 text-white' : 'border border-[var(--ai-border)] text-[var(--ai-muted)]'
            }`}
          >
            Type Mismatch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-[var(--ai-muted)]">Raw LLM Output String:</div>
          <pre className="rounded-lg border border-[var(--ai-border)] bg-black/30 p-3 font-mono text-xs text-[var(--ai-text)] overflow-x-auto">
            {activeCase.json}
          </pre>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-mono text-[var(--ai-muted)]">Pydantic Core Parser Result:</div>
          <div className={`rounded-lg border p-3 font-mono text-xs space-y-2 ${
            activeCase.status === 'VALID'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
          }`}>
            <div className="font-bold">STATUS: {activeCase.status}</div>
            <div className="text-[11px] opacity-90">{activeCase.detail}</div>
            {activeCase.status !== 'VALID' && (
              <div className="pt-2 border-t border-rose-500/20 text-[10px] text-zinc-400">
                Self-Healing Action: Dispatch error path back to LLM context window for automatic repair.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                       MAIN SUBTOPIC DETAIL VIEW                            */
/* -------------------------------------------------------------------------- */

interface PythonAiTopicProps {
  topicId: string;
  basePath?: string;
}

export function PythonAiTopic({
  topicId,
  basePath = '/ai/python-for-ai-engineering',
}: PythonAiTopicProps) {
  const [copied, setCopied] = useState(false);
  const topic = getPythonAiSubtopic(topicId);

  if (!topic) {
    return (
      <div className="p-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-rose-400">Subtopic Not Found</h1>
        <p className="text-sm text-[var(--ai-muted)]">No Python for AI Engineering subtopic matching ID: {topicId}</p>
        <Link
          href={basePath}
          className="inline-flex items-center gap-2 text-sm text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Curriculum
        </Link>
      </div>
    );
  }

  const currentIndex = pythonAiSubtopics.findIndex((t) => t.id === topic.id);
  const previous = currentIndex > 0 ? pythonAiSubtopics[currentIndex - 1] : null;
  const next = currentIndex < pythonAiSubtopics.length - 1 ? pythonAiSubtopics[currentIndex + 1] : null;

  const copyCode = () => {
    navigator.clipboard.writeText(topic.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-[var(--ai-border)] pb-4">
        <Link
          href={basePath}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-text)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Python AI Curriculum
        </Link>
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--ai-muted)]">
          <span>Topic {topic.number} of {pythonAiSubtopics.length}</span>
          <span className="rounded-full bg-blue-500/10 text-blue-400 px-2 py-0.5 border border-blue-500/20">
            {topic.category}
          </span>
        </div>
      </div>

      {/* Title Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-xs font-semibold text-blue-400">
          <Cpu className="h-3.5 w-3.5" />
          Subtopic #{String(topic.number).padStart(2, '0')}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[var(--ai-text)] tracking-tight">
          {topic.title}
        </h1>
        <p className="text-lg text-[var(--ai-muted)] leading-relaxed font-normal">
          {topic.definition}
        </p>
      </div>

      {/* Embedded Visualizer Widget */}
      <section className="space-y-2">
        <div className="text-xs font-mono text-[var(--ai-muted)] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          Interactive Systems Visualizer
        </div>
        {topic.category === 'CPython & Memory' && <PyObjectMemoryWidget />}
        {topic.category === 'Vectorization & Numerics' && (
          topic.visualization === 'strides-slicing' ? <StridesMemoryWidget /> : <VectorVsLoopWidget />
        )}
        {topic.category === 'Async & LLM Services' && (
          topic.visualization === 'token-streamer' ? <AsyncStreamerWidget /> : <GilConcurrencyWidget />
        )}
        {topic.category === 'Typing & Structured Output' && <PydanticValidatorWidget />}
        {topic.category === 'Production & Concurrency' && <VectorVsLoopWidget />}
      </section>

      {/* Key Architectural Takeaways */}
      <section className="rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--ai-text)] flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-400" />
          Key Systems Engineering Principles
        </h2>
        <ul className="space-y-2.5">
          {topic.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--ai-muted)]">
              <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Mental Model Analogy */}
      <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Lightbulb className="h-4 w-4" />
          Mental Model Analogy
        </div>
        <p className="text-sm text-[var(--ai-muted)] leading-relaxed italic">
          &ldquo;{topic.analogy}&rdquo;
        </p>
      </section>

      {/* Production Pitfall Warning */}
      <section className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-rose-400">
          <AlertTriangle className="h-4 w-4" />
          Production Pitfall to Avoid
        </div>
        <p className="text-sm text-[var(--ai-muted)] leading-relaxed">
          {topic.pitfall}
        </p>
      </section>

      {/* Production Code Snippet */}
      <section className="rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] overflow-hidden space-y-0">
        <div className="flex items-center justify-between border-b border-[var(--ai-border)] bg-[var(--ai-bg)] px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--ai-muted)]">
            <Code2 className="h-3.5 w-3.5 text-blue-400" />
            <span>production_pattern.py</span>
          </div>
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ai-border)] bg-[var(--ai-card)] px-2.5 py-1 font-mono text-[11px] text-[var(--ai-muted)] transition-colors hover:text-[var(--ai-text)]"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>
        <pre className="p-4 font-mono text-xs leading-relaxed text-[var(--ai-text)] overflow-x-auto bg-black/40">
          <code>{topic.codeSnippet}</code>
        </pre>
      </section>

      {/* Bottom Navigation Previous / Next */}
      <div className="flex items-center justify-between border-t border-[var(--ai-border)] pt-6">
        {previous ? (
          <Link
            href={`${basePath}/learn/${previous.id}`}
            className="group flex flex-col items-start gap-1 text-left"
          >
            <span className="font-mono text-[11px] text-[var(--ai-muted)] flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Previous Subtopic
            </span>
            <span className="text-sm font-semibold text-[var(--ai-text)] group-hover:text-blue-400 transition-colors">
              #{previous.number} {previous.title}
            </span>
          </Link>
        ) : <div />}

        {next ? (
          <Link
            href={`${basePath}/learn/${next.id}`}
            className="group flex flex-col items-end gap-1 text-right"
          >
            <span className="font-mono text-[11px] text-[var(--ai-muted)] flex items-center gap-1">
              Next Subtopic <ArrowRight className="h-3 w-3" />
            </span>
            <span className="text-sm font-semibold text-[var(--ai-text)] group-hover:text-blue-400 transition-colors">
              #{next.number} {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href={`${basePath}/lab`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500"
          >
            Enter Studio Lab <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
