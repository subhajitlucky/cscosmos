'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Server, Activity, Layers, ArrowUpRight, CheckCircle2, RotateCcw, Play, Zap, Cpu, GitFork, ShieldCheck } from 'lucide-react';
import { fastApiTopics } from '../data/topics';

const PIPELINE_STAGES = [
  { id: 'socket', name: '1. Uvicorn Socket Listener', desc: 'libuv event loop accepts TCP connection', time: '0.12 ms' },
  { id: 'asgi', name: '2. ASGI Scope Construction', desc: 'Builds HTTP scope dictionary {type, path, headers}', time: '0.08 ms' },
  { id: 'middleware', name: '3. Middleware Pipeline', desc: 'CORS, GZip, Request ID header injection', time: '0.15 ms' },
  { id: 'pydantic', name: '4. Pydantic V2 Validation', desc: 'Rust pydantic-core parses & validates JSON body', time: '0.24 ms' },
  { id: 'di', name: '5. Depends() DAG Resolver', desc: 'Executes get_db() -> get_current_user() memoized', time: '0.35 ms' },
  { id: 'handler', name: '6. async def Handler Execution', desc: 'Awaits database query without blocking loop', time: '1.20 ms' },
  { id: 'response', name: '7. Response Serialization', desc: 'Serializes response_model to JSON stream bytes', time: '0.18 ms' },
];

export function Home() {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Uvicorn ASGI server running on http://127.0.0.1:8000 (uvloop active)',
    '[READY] Click "Dispatch HTTP Request" to trace the ASGI lifecycle.'
  ]);

  const dispatchRequest = () => {
    setIsProcessing(true);
    setActiveStage(0);
    setLogs(['[HTTP] Incoming POST /api/v1/orders -> Host: cosmos.internal']);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < PIPELINE_STAGES.length) {
        setActiveStage(step);
        const stage = PIPELINE_STAGES[step];
        setLogs(prev => [`[${stage.name.split(' ')[1].toUpperCase()}] ${stage.desc} (${stage.time})`, ...prev.slice(0, 5)]);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setLogs(prev => ['[HTTP 201 Created] Total Round-Trip Time: 2.32 ms', ...prev.slice(0, 5)]);
      }
    }, 280);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="fastapi-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--fastapi-teal)]/30 bg-[var(--fastapi-teal)]/10 text-[var(--fastapi-teal)] text-xs font-mono">
              <Server className="w-3.5 h-3.5 animate-pulse text-[var(--fastapi-teal)]" />
              Python AsyncIO &bull; Pydantic V2 &bull; Dependency Injection
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--fastapi-text)]">
              50,000+ Req/Sec.<br />
              <span className="text-[var(--fastapi-teal)] fastapi-glow">Non-Blocking Async.</span> Rust Validation.
            </h1>

            <p className="text-base md:text-lg text-[var(--fastapi-muted)] max-w-xl leading-relaxed">
              Deconstruct the Python FastAPI backend engine from raw Uvicorn ASGI socket loops to Rust-compiled Pydantic V2 serialization and hierarchical Dependency Injection DAGs.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/fastapicosmos/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--fastapi-primary)] text-white font-semibold text-sm hover:bg-[var(--fastapi-primary-hover)] transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-95"
              >
                Explore Concept Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/fastapicosmos/di-graph"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--fastapi-border)] bg-[var(--fastapi-surface)] text-[var(--fastapi-text)] font-mono text-sm hover:border-[var(--fastapi-teal)] hover:text-[var(--fastapi-teal)] transition-all"
              >
                <GitFork className="w-4 h-4 text-[var(--fastapi-teal)]" />
                DI Graph Lab
              </Link>

              <Link
                href="/fastapicosmos/async-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface-2)] text-[var(--fastapi-muted)] font-mono text-sm hover:text-[var(--fastapi-text)] transition-all"
              >
                <Activity className="w-4 h-4 text-[var(--fastapi-sky)]" />
                AsyncIO Lab
              </Link>
            </div>
          </div>

          {/* Right Live ASGI Request Pipeline Simulator */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--fastapi-border)] bg-[var(--fastapi-surface)] shadow-2xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-3 border-b border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-[var(--fastapi-muted)] ml-2">FastAPI::ASGIPipeline</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  2.32 ms TOTAL
                </span>
              </div>

              <div className="p-6 space-y-6">
                {/* Pipeline Steps List */}
                <div className="space-y-2">
                  {PIPELINE_STAGES.map((stage, idx) => {
                    const isActive = activeStage === idx;
                    const isDone = activeStage !== null && activeStage > idx;
                    return (
                      <div
                        key={stage.id}
                        className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                          isActive
                            ? 'border-[var(--fastapi-teal)] bg-[var(--fastapi-teal)]/15 text-[var(--fastapi-text)] shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                            : isDone
                            ? 'border-emerald-500/30 bg-[var(--fastapi-bg)] text-emerald-400 opacity-90'
                            : 'border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface-2)] text-[var(--fastapi-muted)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            isActive ? 'bg-[var(--fastapi-teal)] animate-ping' : isDone ? 'bg-emerald-400' : 'bg-slate-700'
                          }`} />
                          <span className="font-bold">{stage.name}</span>
                        </div>
                        <span className="text-[10px] opacity-80">{stage.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Dispatch Trigger */}
                <button
                  onClick={dispatchRequest}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-lg bg-[var(--fastapi-primary)] text-white font-bold hover:bg-[var(--fastapi-primary-hover)] transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  {isProcessing ? 'Processing ASGI Scope...' : 'Dispatch HTTP POST /orders'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Sync WSGI vs Async ASGI */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--fastapi-teal)] uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Python Concurrency Comparison
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--fastapi-text)]">
            Sync WSGI (Flask/Django) vs Async ASGI (FastAPI)
          </h2>
          <p className="text-sm text-[var(--fastapi-muted)]">
            How asynchronous cooperative multitasking handles 50,000+ simultaneous connections with zero thread exhaustion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sync WSGI Card */}
          <div className="p-8 rounded-2xl border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--fastapi-text)]">Sync WSGI (Thread Worker)</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                1 Thread per Conn
              </span>
            </div>
            <p className="text-xs text-[var(--fastapi-muted)] leading-relaxed">
              Every concurrent HTTP request locks an entire OS thread. If 100 requests wait for slow database queries, all 100 worker threads freeze, rejecting incoming traffic with HTTP 504 Gateway Timeouts.
            </p>
            <div className="p-4 rounded-lg bg-[var(--fastapi-bg)] font-mono text-[11px] text-[var(--fastapi-muted)] space-y-2 border border-[var(--fastapi-border-subtle)]">
              <div>• Synchronous blocking I/O (time.sleep, requests.get)</div>
              <div>• Thread exhaustion under 500+ concurrent connections</div>
              <div>• Heavy OS thread context switching memory overhead</div>
              <div>• Incapable of native WebSockets or SSE streaming</div>
            </div>
          </div>

          {/* Async ASGI Card */}
          <div className="p-8 rounded-2xl border-2 border-[var(--fastapi-teal)]/40 bg-[var(--fastapi-surface)] space-y-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--fastapi-text)]">Async ASGI (FastAPI + uvloop)</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                50,000+ Conns
              </span>
            </div>
            <p className="text-xs text-[var(--fastapi-muted)] leading-relaxed">
              Single-thread event loop using cooperative coroutines. When a request awaits I/O (database, external API), the loop immediately processes hundreds of other requests without blocking.
            </p>
            <div className="p-4 rounded-lg bg-[var(--fastapi-bg)] font-mono text-[11px] text-[var(--fastapi-muted)] space-y-2 border border-[var(--fastapi-teal)]/20">
              <div className="text-[var(--fastapi-teal)]">• Cooperative async/await suspension on I/O boundaries</div>
              <div className="text-[var(--fastapi-sky)]">• Auto-offload sync "def" to ThreadPool without loop starvation</div>
              <div className="text-emerald-400">• Rust pydantic-core serialization at 20x faster speeds</div>
              <div className="text-[var(--fastapi-text)]">• Native Server-Sent Events (SSE) &amp; WebSocket support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--fastapi-border-subtle)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--fastapi-teal)] uppercase tracking-wider">
              Architecture Tracks
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--fastapi-text)] mt-1">
              FastAPI Core Modules
            </h2>
          </div>
          <Link
            href="/fastapicosmos/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--fastapi-teal)] hover:underline"
          >
            View all 5 topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fastApiTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/fastapicosmos/learn/${topic.id}`}
              className="fastapi-card p-6 rounded-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--fastapi-teal)]">
                  {topic.kicker}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--fastapi-muted)] group-hover:text-[var(--fastapi-teal)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--fastapi-text)] group-hover:text-[var(--fastapi-teal)] transition-colors">
                {topic.title}
              </h3>

              <p className="text-xs text-[var(--fastapi-muted)] leading-relaxed line-clamp-2">
                {topic.summary}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--fastapi-border-subtle)] text-[var(--fastapi-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--fastapi-muted)]">
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
