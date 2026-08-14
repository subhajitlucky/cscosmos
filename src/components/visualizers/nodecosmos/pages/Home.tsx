'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Cpu, HardDrive, HelpCircle, Layers, Play, RefreshCw, Server, Sparkles, Terminal, Waves, Zap } from 'lucide-react';
import { LibuvEventLoopStepper } from '../components/LibuvEventLoopStepper';
import { ThreadPoolVisualizer } from '../components/ThreadPoolVisualizer';
import { StreamsBackpressureLab } from '../components/StreamsBackpressureLab';
import { ClusterVsWorkerLab } from '../components/ClusterVsWorkerLab';
import { V8MemoryVisualizer } from '../components/V8MemoryVisualizer';
import { EventEmitterVisualizer } from '../components/EventEmitterVisualizer';
import { NodePlayground } from '../components/NodePlayground';

export default function Home() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Complete Node.js &amp; Libuv Runtime Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master the <span className="text-emerald-600 dark:text-emerald-400">Node.js &amp; Libuv</span> Engine.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Interactive visualizers for the 6-phase Libuv event loop, thread pool offloading, streams backpressure, V8 generational garbage collection, EventEmitter memory leaks, and clustering.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/nodecosmos/concepts"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore 20 Concepts
          </Link>
          <Link
            href="/nodecosmos/playground"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> Node.js Playground
          </Link>
        </div>
      </div>

      {/* Feature 1: Libuv 6-Phase Event Loop Stepper */}
      <LibuvEventLoopStepper />

      {/* Feature 2: Thread Pool Visualizer */}
      <ThreadPoolVisualizer />

      {/* Feature 3: Streams Backpressure Flow */}
      <StreamsBackpressureLab />

      {/* Feature 4: V8 Generational Garbage Collection Visualizer */}
      <V8MemoryVisualizer />

      {/* Feature 5: EventEmitter Memory Leak Visualizer */}
      <EventEmitterVisualizer />

      {/* Feature 6: Cluster vs Worker Threads */}
      <ClusterVsWorkerLab />

      {/* Feature 7: In-Browser Node Playground */}
      <NodePlayground />

      {/* Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/nodecosmos/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            20 In-Depth Lessons
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            V8 bindings, AsyncLocalStorage, Slab allocator, process signals, and graceful shutdown architectures.
          </p>
        </Link>

        <Link
          href="/nodecosmos/event-loop"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            Event Loop Lab
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Step through Timers, Pending, Poll, and Check phases with VIP microtask queues.
          </p>
        </Link>

        <Link
          href="/nodecosmos/flashcards"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            Senior Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Master tough Node.js interview questions on thread pool saturation, backpressure, and V8 memory slabs.
          </p>
        </Link>
      </div>
    </div>
  );
}
