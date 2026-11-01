'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Flame,
  Globe,
  HardDrive,
  HelpCircle,
  Layers,
  Play,
  RefreshCw,
  RotateCcw,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Waves,
  Zap,
} from 'lucide-react';
import { NODE_TOPICS } from '../data/topics';
import { NODE_FLASHCARDS } from '../data/flashcards';

interface RuntimeLayer {
  id: string;
  name: string;
  short: string;
  role: string;
  color: string;
  syscalls: string[];
  description: string;
  productionTrap: string;
  labUrl: string;
  labName: string;
}

const RUNTIME_LAYERS: RuntimeLayer[] = [
  {
    id: 'v8',
    name: '1. V8 JavaScript Engine',
    short: 'V8 Engine',
    role: 'Sync Execution & Microtasks',
    color: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
    syscalls: ['mmap()', 'VirtualAlloc()', 'v8::Isolate'],
    description:
      'Compiles JavaScript into optimized machine code (TurboFan) and runs synchronous code on a single thread. Manages the Call Stack, Young/Old Heap memory, and draining high-priority Microtask queues (process.nextTick & Promise.then).',
    productionTrap:
      'Running heavy CPU computation (e.g. JSON.parse on 100MB, synchronous crypto, or regex backtracking) freezes the entire V8 Call Stack, preventing all incoming HTTP traffic from being handled.',
    labUrl: '/nodecosmos/memory-lab',
    labName: 'Open V8 Memory & Leaks Lab',
  },
  {
    id: 'bindings',
    name: '2. Node.js C++ Bindings & Core APIs',
    short: 'C++ Bindings',
    role: 'Native Bridges & Buffer Slabs',
    color: 'border-blue-500/30 bg-blue-500/10 text-blue-500',
    syscalls: ['Node-API', 'c-ares', 'OpenSSL', 'zlib'],
    description:
      'Exposes native C/C++ functionality to JavaScript through Node-API. Manages the 8KB Buffer slab allocator, EventEmitter registries, stream pipelines, and low-level protocol encoders.',
    productionTrap:
      'Using Buffer.allocUnsafe() without filling every byte can leak uninitialized memory secrets over the network. Default to Buffer.alloc() for zero-initialized memory.',
    labUrl: '/nodecosmos/cheatsheet',
    labName: 'View Native API Cheatsheet',
  },
  {
    id: 'libuv-loop',
    name: '3. Libuv 6-Phase Event Loop',
    short: 'Libuv Loop',
    role: 'Non-Blocking OS Multiplexing',
    color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
    syscalls: ['epoll_wait()', 'kevent()', 'IOCP'],
    description:
      'The heart of Node.js asynchrony. Loops across 6 distinct phases: Timers -> Pending Callbacks -> Idle/Prepare -> Poll -> Check -> Close Callbacks. Uses operating system kernel primitives (epoll/kqueue) to handle thousands of open network sockets non-blockingly on one thread.',
    productionTrap:
      'Assuming setTimeout(fn, 0) executes in 0ms. Operating systems impose a minimum 1ms timer threshold. Inside an I/O callback, setImmediate() always executes before setTimeout(fn, 0).',
    labUrl: '/nodecosmos/event-loop',
    labName: 'Launch Event Loop Lab',
  },
  {
    id: 'threadpool',
    name: '4. Libuv Worker Thread Pool',
    short: 'Thread Pool',
    role: 'Asynchronous Syscall Offloading',
    color: 'border-purple-500/30 bg-purple-500/10 text-purple-500',
    syscalls: ['pthread_create()', 'uv_queue_work()', 'getaddrinfo()'],
    description:
      'A pool of 4 C/C++ background worker threads (configurable via UV_THREADPOOL_SIZE) used exclusively for blocking file system I/O (fs.*), cryptographic operations (pbkdf2, randomBytes), zlib compression, and dns.lookup.',
    productionTrap:
      'Four concurrent crypto or fs tasks will completely saturate the default 4-thread pool, blocking all subsequent file reads or DNS lookups until a worker thread frees up.',
    labUrl: '/nodecosmos/thread-pool',
    labName: 'Launch Thread Pool Lab',
  },
  {
    id: 'cluster',
    name: '5. Multi-Core Scaling (Cluster vs Workers)',
    short: 'Multi-Core Scale',
    role: 'Horizontal Process Scaling',
    color: 'border-rose-500/30 bg-rose-500/10 text-rose-500',
    syscalls: ['fork()', 'IPC socket', 'SharedArrayBuffer'],
    description:
      'Leverage all CPU cores on production servers. The Cluster module forks separate OS processes sharing the same TCP port via IPC round-robin. Worker Threads run multiple V8 isolates in the same process sharing RAM.',
    productionTrap:
      'Storing session variables in memory in a Clustered Node app causes inconsistent state across worker processes. Always use an external store like Redis for distributed state.',
    labUrl: '/nodecosmos/thread-pool',
    labName: 'Compare Cluster vs Workers',
  },
];

const TRACE_PRESETS = [
  {
    id: 'timers-vs-immediate',
    name: 'Timers vs setImmediate vs nextTick',
    code: `console.log('1. Sync Start');

setTimeout(() => console.log('5. setTimeout (Timers Phase)'), 0);

setImmediate(() => console.log('4. setImmediate (Check Phase)'));

Promise.resolve().then(() => console.log('3. Promise.then (Microtask)'));

process.nextTick(() => console.log('2. process.nextTick (VIP Queue)'));

console.log('1.5. Sync End');`,
    steps: [
      { num: '1', text: '1. Sync Start', phase: 'V8 Call Stack', note: 'Synchronous top-level code runs first immediately.' },
      { num: '1.5', text: '1.5. Sync End', phase: 'V8 Call Stack', note: 'Top-level script finishes before any callbacks fire.' },
      { num: '2', text: '2. process.nextTick (VIP Queue)', phase: 'nextTick Queue', note: 'Highest priority microtask queue drains before Promise queue.' },
      { num: '3', text: '3. Promise.then (Microtask)', phase: 'Promise Microtask', note: 'Drains immediately after nextTick, before entering Libuv.' },
      { num: '5', text: '5. setTimeout (Timers Phase)', phase: 'Timers Phase', note: 'Timer threshold of 1ms expired during V8 startup.' },
      { num: '4', text: '4. setImmediate (Check Phase)', phase: 'Check Phase', note: 'Check phase executes after Poll phase completes.' },
    ],
  },
  {
    id: 'io-lifecycle',
    name: 'Inside an I/O Cycle (fs.readFile)',
    code: `import fs from 'fs';

fs.readFile('data.json', () => {
  console.log('1. I/O Callback in Poll Phase');

  setTimeout(() => console.log('3. setTimeout in Timers Phase'), 0);

  setImmediate(() => console.log('2. setImmediate in Check Phase'));
});`,
    steps: [
      { num: '1', text: '1. I/O Callback in Poll Phase', phase: 'Poll Phase', note: 'epoll notifies Libuv that file reading finished on worker thread.' },
      { num: '2', text: '2. setImmediate in Check Phase', phase: 'Check Phase', note: 'Guaranteed! Poll phase immediately transitions to Check phase.' },
      { num: '3', text: '3. setTimeout in Timers Phase', phase: 'Timers Phase (Next Tick)', note: 'Timers phase is only reached on the subsequent event loop tick.' },
    ],
  },
  {
    id: 'microtask-starvation',
    name: 'process.nextTick Starvation Risk',
    code: `let count = 0;
function recursiveTick() {
  if (count++ < 3) {
    process.nextTick(recursiveTick);
    console.log('nextTick loop:', count);
  }
}
recursiveTick();
setTimeout(() => console.log('setTimeout fired'), 0);`,
    steps: [
      { num: '1', text: 'nextTick loop: 1', phase: 'nextTick Queue', note: 'Drains completely before Libuv advances.' },
      { num: '2', text: 'nextTick loop: 2', phase: 'nextTick Queue', note: 'New items added during nextTick drain in the same cycle!' },
      { num: '3', text: 'nextTick loop: 3', phase: 'nextTick Queue', note: 'Causes I/O starvation if called recursively indefinitely.' },
      { num: '4', text: 'setTimeout fired', phase: 'Timers Phase', note: 'Finally executes once all nextTick microtasks are exhausted.' },
    ],
  },
];

export default function Home() {
  const [selectedLayer, setSelectedLayer] = useState<string>('libuv-loop');
  const [activeTraceId, setActiveTraceId] = useState<string>('timers-vs-immediate');
  const [revealedFlashcardId, setRevealedFlashcardId] = useState<string | null>(null);
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState<number>(0);

  const currentLayer = RUNTIME_LAYERS.find((l) => l.id === selectedLayer) || RUNTIME_LAYERS[2];
  const activeTrace = TRACE_PRESETS.find((t) => t.id === activeTraceId) || TRACE_PRESETS[0];
  const flashcard = NODE_FLASHCARDS[activeFlashcardIndex % NODE_FLASHCARDS.length];

  // Group topics by category
  const categories: { key: string; label: string; icon: typeof RefreshCw }[] = [
    { key: 'foundations', label: 'Architecture & Foundations', icon: Server },
    { key: 'event-loop', label: 'Event Loop & Microtasks', icon: RefreshCw },
    { key: 'streams', label: 'Streams, Buffers & Backpressure', icon: Waves },
    { key: 'concurrency', label: 'Multi-Core & Threading', icon: Cpu },
    { key: 'internals', label: 'Memory & Runtime Internals', icon: HardDrive },
  ];

  return (
    <div className="space-y-20 pb-28 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* 1. Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          Node.js v22 LTS &bull; Libuv &amp; V8 Runtime Architecture
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          Master the <span className="text-emerald-600 dark:text-emerald-400">Node.js &amp; Libuv</span> Runtime Engine.
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          An interactive engineering curriculum deconstructing single-threaded non-blocking I/O. Explore the 6-phase Libuv event loop, epoll demultiplexing, worker thread pool offloading, streams backpressure flow, and V8 generational garbage collection.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/nodecosmos/concepts"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore {NODE_TOPICS.length} Concepts
          </Link>
          <Link
            href="/nodecosmos/event-loop"
            className="px-6 py-3 rounded-2xl border border-emerald-500/30 bg-card hover:bg-emerald-500/10 text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-emerald-500" /> Event Loop Lab
          </Link>
          <Link
            href="/nodecosmos/playground"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-muted text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> Node.js Playground
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
              4 Labs
            </div>
            <div className="text-xs text-muted-foreground font-semibold">Interactive Simulators</div>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card/60 text-left space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              6 Phases
            </div>
            <div className="text-xs text-muted-foreground font-semibold">Libuv Loop &amp; Microtasks</div>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card/60 text-left space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {NODE_FLASHCARDS.length}
            </div>
            <div className="text-xs text-muted-foreground font-semibold">Staff Interview Cards</div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Runtime Anatomy Map */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Layers className="w-4 h-4" /> Architectural Blueprint
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Node.js High-Throughput Engine Anatomy
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select an engine subsystem to inspect its execution mechanics, OS system calls, and concurrency traps.
            </p>
          </div>

          <Link
            href="/nodecosmos/concepts"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Full Curriculum Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Anatomy Subsystem Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {RUNTIME_LAYERS.map((layer) => {
            const isSelected = selectedLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`p-3 rounded-2xl text-left border transition-all space-y-1 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/30'
                    : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground">
                  {layer.short}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">{layer.role}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Anatomy Layer Detail Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
            <div className="space-y-1">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${currentLayer.color}`}>
                Subsystem Layer
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {currentLayer.name}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                Primary Role: {currentLayer.role}
              </p>
            </div>

            <Link
              href={currentLayer.labUrl}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{currentLayer.labName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-start">
            {/* Description & Syscalls */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Core Runtime Mechanics
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentLayer.description}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  Kernel &amp; OS Primitives
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentLayer.syscalls.map((sys) => (
                    <span
                      key={sys}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800"
                    >
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Production Trap Box */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Production Failure Mode
              </div>
              <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
                {currentLayer.productionTrap}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dedicated Interactive Labs Showcase */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Zap className="w-4 h-4" /> Interactive Simulation Suites
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Explore Dedicated Node.js Runtime Labs
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Hands-on sandboxes purpose-built to simulate execution phases, thread saturation, streams flow control, and garbage collection.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Event Loop Lab */}
          <Link
            href="/nodecosmos/event-loop"
            className="p-6 rounded-3xl bg-card border border-border hover:border-emerald-500/60 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Phase Inspection
                </span>
                <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                  Libuv 6-Phase Event Loop
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Step through Timers, Pending, Poll, and Check phases. Observe process.nextTick &amp; Promise microtasks draining between every phase.
              </p>
            </div>

            <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Launch Lab</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Thread Pool Lab */}
          <Link
            href="/nodecosmos/thread-pool"
            className="p-6 rounded-3xl bg-card border border-border hover:border-purple-500/60 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Worker Offloading
                </span>
                <h3 className="text-lg font-bold text-foreground group-hover:text-purple-500 transition-colors">
                  Thread Pool &amp; Concurrency
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Simulate UV_THREADPOOL_SIZE worker saturation under crypto loads, and compare Multi-Process Clustering against Shared-Memory Worker Threads.
              </p>
            </div>

            <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Launch Lab</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Streams & Backpressure */}
          <Link
            href="/nodecosmos/streams-lab"
            className="p-6 rounded-3xl bg-card border border-border hover:border-blue-500/60 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Waves className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Flow Control
                </span>
                <h3 className="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors">
                  Streams &amp; Backpressure
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Observe chunk buffering between Readable and Writable streams. See buffer levels hit 16KB highWaterMark and trigger &ldquo;drain&rdquo; events.
              </p>
            </div>

            <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>Launch Lab</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: V8 Memory & Leaks */}
          <Link
            href="/nodecosmos/memory-lab"
            className="p-6 rounded-3xl bg-card border border-border hover:border-amber-500/60 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <HardDrive className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Heap &amp; Leaks
                </span>
                <h3 className="text-lg font-bold text-foreground group-hover:text-amber-500 transition-colors">
                  V8 GC &amp; Memory Leaks
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track Cheney semi-space scavenge, Old Gen promotion, and simulate memory leaks from dangling EventEmitter closures.
              </p>
            </div>

            <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Launch Lab</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Interactive Execution Order Trace Spotlight */}
      <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Terminal className="w-4 h-4" /> Execution Trace Spotlight
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Event Loop Execution Order Explained
            </h2>
            <p className="text-xs text-muted-foreground">
              Select an asynchronous scenario to trace how Node.js orders timers, microtasks, and I/O callbacks.
            </p>
          </div>

          <Link
            href="/nodecosmos/playground"
            className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 text-emerald-500" />
            <span>Open Playground</span>
          </Link>
        </div>

        {/* Trace Preset Tabs */}
        <div className="flex flex-wrap gap-2">
          {TRACE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActiveTraceId(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTraceId === preset.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-muted/40 text-foreground border border-border hover:bg-muted'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Trace Comparison: Code vs Execution Order */}
        <div className="grid md:grid-cols-12 gap-6 items-stretch">
          {/* Left: Code Snippet */}
          <div className="md:col-span-6 space-y-2 flex flex-col">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>JavaScript Code</span>
              <span className="font-mono text-[10px]">Node v22 LTS</span>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-border shadow-inner whitespace-pre-wrap leading-relaxed flex-1">
              {activeTrace.code}
            </pre>
          </div>

          {/* Right: Ordered Output Steps */}
          <div className="md:col-span-6 space-y-2 flex flex-col">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Execution Order &amp; Phase Rationale</span>
              <span className="font-mono text-[10px] text-emerald-500 font-bold">{activeTrace.steps.length} Steps</span>
            </div>
            <div className="space-y-2 flex-1">
              {activeTrace.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-border bg-card/60 flex items-start gap-3 text-xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-foreground truncate">{st.text}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground shrink-0">
                        {st.phase}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">{st.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Curriculum Track Explorer */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" /> Comprehensive Syllabus
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {NODE_TOPICS.length} In-Depth Architectural Lessons
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Structured across 5 distinct learning tracks from V8 compilation to multi-core process clustering.
            </p>
          </div>

          <Link
            href="/nodecosmos/concepts"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <span>View All Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const categoryTopics = NODE_TOPICS.filter((t) => t.category === cat.key);
            return (
              <div
                key={cat.key}
                className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] font-bold">
                      {categoryTopics.length} Lessons
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {cat.label}
                  </h3>

                  <ul className="space-y-2 pt-1">
                    {categoryTopics.slice(0, 3).map((top) => (
                      <li key={top.id}>
                        <Link
                          href={`/nodecosmos/concepts/${top.id}`}
                          className="text-xs text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-between group transition-colors"
                        >
                          <span className="truncate pr-2 font-medium">{top.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/nodecosmos/concepts"
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2 border-t border-border/80 flex items-center gap-1"
                >
                  <span>Explore Track</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Senior Engineering Flashcard Teaser */}
      <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <HelpCircle className="w-4 h-4" /> Senior Staff Interview Challenge
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Test Your Node.js Internals Mastery
            </h2>
            <p className="text-xs text-muted-foreground">
              Flashcard {activeFlashcardIndex + 1} of {NODE_FLASHCARDS.length} &bull; Difficulty: {flashcard.difficulty}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveFlashcardIndex((prev) => (prev > 0 ? prev - 1 : NODE_FLASHCARDS.length - 1));
                setRevealedFlashcardId(null);
              }}
              className="px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition"
            >
              Previous
            </button>
            <button
              onClick={() => {
                setActiveFlashcardIndex((prev) => (prev + 1) % NODE_FLASHCARDS.length);
                setRevealedFlashcardId(null);
              }}
              className="px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition"
            >
              Next Card
            </button>
            <Link
              href="/nodecosmos/flashcards"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
            >
              All {NODE_FLASHCARDS.length} Flashcards
            </Link>
          </div>
        </div>

        {/* Active Question Box */}
        <div className="p-6 rounded-2xl bg-muted/30 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
              {flashcard.category}
            </span>
            <span className="text-xs font-mono text-muted-foreground">{flashcard.difficulty}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
            {flashcard.question}
          </h3>

          {/* Reveal Button */}
          <div className="pt-2">
            {revealedFlashcardId === flashcard.id ? (
              <div className="space-y-4 p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in">
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Architectural Explanation
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {flashcard.answer}
                  </p>
                </div>

                {flashcard.tip && (
                  <div className="text-xs text-muted-foreground border-t border-emerald-500/20 pt-2 font-medium">
                    💡 <strong className="text-foreground">Pro-Tip:</strong> {flashcard.tip}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setRevealedFlashcardId(flashcard.id)}
                className="px-5 py-2.5 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center gap-2"
              >
                <span>Reveal Answer &amp; Architectural Reason</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 7. Production Best Practices & Cheat Sheet Preview */}
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
              Essential recipes battle-tested on enterprise Node.js clusters under millions of requests per second.
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
