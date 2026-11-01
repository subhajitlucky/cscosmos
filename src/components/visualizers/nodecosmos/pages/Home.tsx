'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Flame,
  FlaskConical,
  HelpCircle,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Waves,
} from 'lucide-react';
import { NODE_TOPICS } from '../data/topics';
import { NODE_PROBLEMS } from '../data/problems';

export default function Home() {
  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Complete Node.js &amp; Libuv Runtime Visualizer
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          Master the <span className="text-emerald-600 dark:text-emerald-400">Node.js &amp; Libuv</span> Engine.
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Interactive visualizers for the 6-phase Libuv event loop, thread pool offloading, streams backpressure, V8 generational garbage collection, EventEmitter memory leaks, and clustering.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/nodecosmos/concepts"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore {NODE_TOPICS.length} Concepts
          </Link>
          <Link
            href="/nodecosmos/lab"
            className="px-6 py-3 rounded-2xl border border-emerald-500/30 bg-card hover:bg-emerald-500/10 text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <FlaskConical className="w-4 h-4 text-emerald-500" /> Simulation Lab
          </Link>
          <Link
            href="/nodecosmos/problems"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-muted text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Practice Challenges
          </Link>
        </div>

        {/* Engine Spec Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/60">
          <div className="p-4 rounded-2xl border border-border bg-card/60 text-left space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {NODE_TOPICS.length}
            </div>
            <div className="text-xs text-muted-foreground font-semibold">Architectural Lessons</div>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card/60 text-left space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              5
            </div>
            <div className="text-xs text-muted-foreground font-semibold">Simulation Engines</div>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card/60 text-left space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              6
            </div>
            <div className="text-xs text-muted-foreground font-semibold">Libuv Loop Phases</div>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card/60 text-left space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {NODE_PROBLEMS.length}
            </div>
            <div className="text-xs text-muted-foreground font-semibold">Practice Challenges</div>
          </div>
        </div>
      </section>

      {/* Primary Navigation Hub Cards: Concepts, Lab, Problems */}
      <section className="grid sm:grid-cols-3 gap-6 pt-2">
        <Link
          href="/nodecosmos/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
              Concepts ({NODE_TOPICS.length} Lessons)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              V8 bindings, AsyncLocalStorage, Slab allocator, process signals, and graceful shutdown architectures.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>Explore Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/nodecosmos/lab"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
              Runtime Lab
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Unified interactive suite for 6-phase loop stepper, thread pool saturation, streams flow, and V8 garbage collection.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>Launch Lab</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/nodecosmos/problems"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
              Practice Problems
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Test your knowledge on microtasks, thread pool saturation, backpressure, and V8 memory management.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>Solve Challenges</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* Production Best Practices */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Production Engineering Guidelines
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Zero-Downtime Node.js Production Rules
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Essential recipes battle-tested on enterprise Node.js clusters under high concurrency.
            </p>
          </div>

          <Link
            href="/nodecosmos/cheatsheet"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Complete Cheat Sheet Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Never Block the Event Loop
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Keep synchronous execution under 5ms. Offload large JSON parsing, image manipulation, and regex matching to Worker Threads.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Use stream.pipeline with AbortSignal
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Never pipe streams using raw .pipe(). pipeline() handles backpressure, unconsumed buffer flushes, and socket teardown automatically.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Graceful SIGTERM Teardown
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stop accepting new sockets on SIGTERM, allow active in-flight requests 10-30s to finish, close DB pools, and exit cleanly with code 0.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
