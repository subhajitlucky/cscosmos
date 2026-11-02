'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Terminal,
  Cpu,
  Layers,
  Globe,
  Server,
  Zap,
  Sparkles,
  Eye,
  AlertTriangle,
  HardDrive,
  Activity,
  ShieldCheck,
  Binary,
  Clock,
  ArrowRight,
  Network,
  Radio,
  Split,
  RefreshCw,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept7Lesson() {
  // Interactive quiz state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [q4Revealed, setQ4Revealed] = useState<boolean>(false);

  // Architecture toggle state
  const [activeModel, setActiveModel] = useState<'traditional' | 'nodejs'>('nodejs');

  // Score calculation
  const totalCompleted =
    (q1 !== null ? 1 : 0) +
    (q2 !== null ? 1 : 0) +
    (q3 !== null ? 1 : 0) +
    (q4Revealed ? 1 : 0);

  return (
    <div className="space-y-12">
      {/* Lesson Header */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider font-mono">
            Node.js — Lesson 07/280
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Level: Beginner
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Category: Node.js Fundamentals
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold">
            Estimated Time: 30–40 mins
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Concept 7: Node.js Execution Model
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          The single-threaded event loop, multi-threaded process reality, run-to-completion invariants, and how Node.js achieves high-throughput non-blocking I/O while solving the historic C10K concurrency challenge.
        </p>
      </div>

      {/* SECTION 1: THE CONCURRENCY PARADOX */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            The Concurrency Paradox: Thread-per-Request vs. Event-Driven
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            To understand why Node.js revolutionized backend engineering in 2009, we must first examine how traditional web servers (such as Apache HTTP Server with prefork or Tomcat Java servlets) handled concurrent web traffic: the <strong>Thread-per-Request</strong> model.
          </p>

          {/* Interactive Model Toggle */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveModel('traditional')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeModel === 'traditional'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Server className="w-4 h-4" /> Traditional Thread-per-Request
            </button>
            <button
              onClick={() => setActiveModel('nodejs')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeModel === 'nodejs'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Zap className="w-4 h-4" /> Node.js Event-Driven Loop
            </button>
          </div>

          {activeModel === 'traditional' ? (
            <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-4 transition-all">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5" /> The Thread-per-Request Bottleneck (The C10K Problem)
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                In a thread-per-request architecture, when client Alice connects to the server, the OS spawns or assigns a dedicated OS worker thread to handle Alice&apos;s socket. If Alice initiates a database query that takes 150ms, that thread sleeps—doing literally zero compute work while holding its system resources captive.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                    1. Stack Memory Cost
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Each OS thread allocates <strong>1MB to 8MB</strong> of stack memory. 10,000 idle clients demand <strong>10GB–80GB of RAM</strong> just for dormant thread stacks!
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                    2. Context Switch Thrashing
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    The OS kernel scheduler must rapidly cycle through thousands of threads, swapping CPU registers and invalidating CPU L1/L2 caches (TLB flushing).
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                    3. Concurrency Lock Deadlocks
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Developers must manually manage mutexes, semaphores, and synchronization blocks, introducing race conditions and deadlocks.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4 transition-all">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-base">
                <Sparkles className="w-5 h-5" /> The Node.js Reactive Event Loop Paradigm
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Node.js inverts this paradigm completely. Instead of assigning a physical thread to each client, Node.js runs exactly <strong>one single thread</strong> for JavaScript execution. It delegates I/O operations directly to the OS kernel multiplexers (<code className="font-mono font-bold">epoll</code>/<code className="font-mono font-bold">kqueue</code>).
              </p>

              <div className="grid sm:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    1. Tiny Memory Footprint
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    A connection is merely a numeric File Descriptor (FD) inside the kernel. 10,000 idle sockets consume negligible memory (&lt;50MB total).
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    2. Zero Context Switching
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    The CPU remains laser-focused on the single thread, maximizing L1/L2 data cache hits and instruction pipeline throughput.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    3. No Thread Locks
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Synchronous JavaScript code runs without fear of background preemption. You will never encounter a thread deadlock in single-threaded Node.js!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: THE MYTH BUSTED */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            The Myth Busted: Is Node.js Truly Single-Threaded?
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            A pervasive industry myth claims that &ldquo;Node.js is single-threaded.&rdquo; <strong>This is technically false.</strong>
          </p>

          <p>
            The accurate statement is: <strong>JavaScript execution on the V8 Call Stack is single-threaded.</strong> The Node.js OS process itself is heavily multi-threaded! If you start a basic Node.js script and inspect its OS thread list using <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs sm:text-sm font-semibold">ps -T -p &lt;pid&gt;</code> or <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs sm:text-sm font-semibold">ls /proc/&lt;pid&gt;/task</code> on Linux, you will discover between <strong>7 and 11 active OS threads</strong>:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm sm:text-base">
                <Cpu className="w-5 h-5" /> 1. The Main JavaScript Thread (1 Thread)
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Contains the V8 Call Stack, executes all your user-written synchronous JavaScript, evaluates imports, and powers the libuv Event Loop tick cycle.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400">
                Rule: If this thread is blocked by a heavy CPU loop, your entire server halts!
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base">
                <Layers className="w-5 h-5" /> 2. libuv Worker Thread Pool (Default 4 Threads)
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Offloads operations where no asynchronous OS kernel interface exists: synchronous disk I/O (<code className="font-mono">node:fs</code>), CPU-heavy cryptography (<code className="font-mono">pbkdf2</code>, <code className="font-mono">scrypt</code>), compression (<code className="font-mono">node:zlib</code>), and blocking DNS resolution (<code className="font-mono">dns.lookup</code>).
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400">
                Configured via: UV_THREADPOOL_SIZE (1 to 1024 threads)
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm sm:text-base">
                <Zap className="w-5 h-5" /> 3. V8 Background Optimization Threads (~2 Threads)
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                V8 spawns helper threads to compile hot JavaScript functions into optimized machine code (TurboFan) asynchronously in the background without stuttering your application.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400">
                Runs TurboFan compilation pipelines concurrently
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm sm:text-base">
                <RefreshCw className="w-5 h-5" /> 4. V8 Garbage Collection Threads (~2 Threads)
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Concurrent marking and parallel sweeping threads that traverse the V8 memory heap, reclaiming dead objects without pausing the main thread for long durations.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400">
                Parallel Major GC &amp; Concurrent Scavenge Workers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE 4 RUNTIME PILLARS & PRIORITY QUEUES */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            The 4 Runtime Components &amp; Queue Priority Hierarchy
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When code executes in Node.js, it transitions across four distinct runtime memory and scheduling structures:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                A. The V8 Call Stack (LIFO)
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Synchronous Execution &amp; Run-to-Completion
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Every function call pushes a stack frame onto the Call Stack; returning pops the frame. JavaScript guarantees <strong>Run-to-Completion</strong>: once a function begins execution on the stack, it cannot be interrupted or preempted by another event until it yields control or exits.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                B. The V8 Memory Heap
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Dynamic Object &amp; Closure Storage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The unstructured memory space where objects, arrays, closures, and function scopes reside. Managed automatically by the V8 Garbage Collector via pointer tracing from the root context.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                C. Microtask Queues (Highest Priority)
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                nextTick &amp; Promise Job Queues
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Microtasks execute immediately after the current synchronous stack frame empties, <em>before</em> the event loop is allowed to advance to any other phase:
                <br />
                <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold">
                  1. process.nextTick Queue &gt; 2. Promise / queueMicrotask Queue
                </span>
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                D. Macrotask Event Loop Queues
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                The 6 libuv Phases
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Callbacks originating from timers (<code className="font-mono">setTimeout</code>), completed OS I/O events (<code className="font-mono">epoll</code>), immediate callbacks (<code className="font-mono">setImmediate</code>), and socket close events.
              </p>
            </div>
          </div>

          {/* Priority Ladder Diagram */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-3">
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              The Exact Node.js Callback Execution Order
            </h4>
            <div className="space-y-2 font-mono text-xs sm:text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">Synchronous Call Stack</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">(top-level script, functions)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-purple-200 dark:border-purple-900">
                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <span className="font-bold text-purple-700 dark:text-purple-300">Microtask: process.nextTick</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">(drained completely before promises)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-purple-200 dark:border-purple-900">
                <span className="w-6 h-6 rounded-lg bg-purple-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <span className="font-bold text-purple-700 dark:text-purple-300">Microtask: Promise / queueMicrotask</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">(Promise.then, async/await resumes)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-900">
                <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-300">Event Loop Phase 1: Timers</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">(setTimeout, setInterval expired)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-900">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  5
                </span>
                <span className="font-bold text-blue-700 dark:text-blue-300">Event Loop Phase 4: Poll</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">(incoming network sockets, file completions)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-950 border border-cyan-200 dark:border-cyan-900">
                <span className="w-6 h-6 rounded-lg bg-cyan-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  6
                </span>
                <span className="font-bold text-cyan-700 dark:text-cyan-300">Event Loop Phase 5: Check</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">(setImmediate callbacks)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPLETE REQUEST-RESPONSE LIFECYCLE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            The Complete Request-Response Journey
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Let&apos;s trace exactly what happens inside the operating system, libuv, and the V8 engine when an HTTP client requests data from a Node.js server:
          </p>

          <div className="relative border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-4 pl-6 space-y-6">
            <div className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-950" />
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Step 1: Network Ingress at OS Kernel
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  TCP packets arrive at the Network Interface Card (NIC). The Linux kernel writes the payload into the socket buffer and marks the socket file descriptor as <em>readable</em>.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-950" />
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Step 2: libuv Poll Phase Wakes Up
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  The Main Thread is sitting inside <code className="font-mono">epoll_wait()</code> in the Poll phase. The kernel instantly notifies libuv that FD #42 is ready. <strong>Zero worker threads were used.</strong>
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-950" />
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Step 3: V8 Executes JavaScript Callback
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  libuv passes the TCP stream to Node&apos;s HTTP parser. Your callback <code className="font-mono">(req, res) =&gt; ...</code> is pushed onto the Call Stack. It parses headers and queries a database.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-950" />
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Step 4: Asynchronous Delegation &amp; Main Thread Yield
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  The database driver writes a TCP packet to PostgreSQL and registers an event handler. The main thread immediately exits the callback and continues looping, ready to accept hundreds of other incoming requests!
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-950" />
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Step 5: Database Response &amp; Completion Callback
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  PostgreSQL returns rows 10ms later. <code className="font-mono">epoll</code> signals the database socket is readable. In the Poll phase, the database callback executes, writes JSON via <code className="font-mono">res.end()</code>, and sends the HTTP response back down the socket.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE CODE LAB */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            5
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Interactive Code Lab: Execution Model Simulator
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Test the execution model in real-time. Use the three engineering presets below to observe Call Stack run-to-completion behavior, microtask vs macrotask queuing priority, and process memory distribution.
        </p>

        <NodeJsEditor
          title="Node.js Execution Model Simulator (Node v22 LTS)"
          initialCode={`// Preset 1: Event Loop Starvation & Run-To-Completion
console.log("1. Program started");

setTimeout(() => {
  console.log("4. Timer callback executed! (Expected after 100ms)");
}, 100);

console.log("2. Starting CPU-intensive synchronous computation...");

// Blocking the main thread for ~400ms
const start = Date.now();
while (Date.now() - start < 400) {
  // Doing busy work on the single JavaScript thread
}

console.log("3. Synchronous loop finished after", Date.now() - start, "ms");
// Notice that Step 4 could NOT run until Step 3 finished!`}
          presets={[
            {
              label: '1. Single-Thread CPU Starvation',
              code: `// Preset 1: Event Loop Starvation & Run-To-Completion
console.log("1. Program started");

setTimeout(() => {
  console.log("4. Timer callback executed! (Expected after 100ms)");
}, 100);

console.log("2. Starting CPU-intensive synchronous computation...");

// Blocking the main thread for ~400ms
const start = Date.now();
while (Date.now() - start < 400) {
  // Doing busy work on the single JavaScript thread
}

console.log("3. Synchronous loop finished after", Date.now() - start, "ms");
// Notice that Step 4 could NOT run until Step 3 finished!`,
            },
            {
              label: '2. Microtask vs Macrotask Waterfall',
              code: `// Preset 2: Microtask vs Macrotask Priority Hierarchy
console.log("1. [Synchronous] Script starts");

setTimeout(() => {
  console.log("5. [Macrotask: Timers] setTimeout 0ms callback");
}, 0);

setImmediate(() => {
  console.log("6. [Macrotask: Check] setImmediate callback");
});

Promise.resolve().then(() => {
  console.log("3. [Microtask: Promise] Promise.then callback");
});

process.nextTick(() => {
  console.log("2. [Microtask: nextTick] process.nextTick callback (Highest priority!)");
});

console.log("4. [Synchronous] Script ends");`,
            },
            {
              label: '3. Process & Memory Inspection',
              code: `// Preset 3: Process Anatomy & Memory Architecture
console.log("=== Node.js Process Internals ===");
console.log("Process PID:", process.pid);
console.log("Platform:", process.platform, "| Architecture:", process.arch);
console.log("Node Version:", process.version);
console.log("libuv Version:", process.versions.uv);
console.log("V8 Engine Version:", process.versions.v8);

const mem = process.memoryUsage();
console.log("\\n=== Memory Footprint ===");
console.log("RSS (Resident Set Size):", (mem.rss / 1024 / 1024).toFixed(2), "MB");
console.log("Heap Total:", (mem.heapTotal / 1024 / 1024).toFixed(2), "MB");
console.log("Heap Used:", (mem.heapUsed / 1024 / 1024).toFixed(2), "MB");
console.log("External C++:", (mem.external / 1024 / 1024).toFixed(2), "MB");`,
            },
          ]}
        />
      </section>

      {/* SECTION 6: TWO PRODUCTION TRAPS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            6
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Two High-Stakes Production Traps &amp; Architectural Solutions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* TRAP 1 */}
          <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Production Trap 1
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  The Event Loop Lag Death Spiral
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Anti-Pattern:</strong> A developer executes synchronous compute on the main thread inside an express route, such as <code className="font-mono">JSON.parse(hugePayload)</code>, a catastrophic backtracking RegEx like <code className="font-mono">/(x+x+)+y/</code>, or synchronous image resizing.
            </p>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-300 space-y-1">
              <strong>The Cascading Catastrophe:</strong> Because JavaScript runs on a single thread, blocking it for 2 seconds means <em>all other concurrent HTTP requests freeze</em>. Kubernetes readiness/liveness probes (<code className="font-mono">/healthz</code>) fail to respond, triggering a Pod restart and causing an outage.
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Fix:</strong> Offload heavy CPU work to <code className="font-mono font-bold">node:worker_threads</code>, use streaming parsers (e.g. <code className="font-mono">stream-json</code>), or queue background tasks to Redis workers (e.g. BullMQ).
            </div>
          </div>

          {/* TRAP 2 */}
          <div className="p-6 rounded-3xl border border-amber-200 dark:border-amber-950/60 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Production Trap 2
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Recursive process.nextTick Starvation
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Anti-Pattern:</strong> Continuously scheduling microtasks using recursive <code className="font-mono">process.nextTick()</code> or unyielding resolved Promise loops without yielding to the event loop.
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <strong>The Hidden Bug:</strong> Unlike macrotasks, the V8 engine completely drains the entire <code className="font-mono">process.nextTick</code> microtask queue before it allows libuv to advance to the next event loop phase. A runaway nextTick loop creates 100% CPU lock without ever checking I/O or timers!
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Fix:</strong> Use <code className="font-mono font-bold">setImmediate()</code> instead of <code className="font-mono">process.nextTick()</code> for chunked iterative work. <code className="font-mono">setImmediate</code> queues into the Check phase, allowing the Poll phase to process I/O between iterations.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: KNOWLEDGE ASSESSMENT */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
              7
            </span>
            <h2 className="text-2xl font-bold tracking-tight">University Knowledge Assessment</h2>
          </div>
          <span className="text-xs sm:text-sm font-mono font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Completed: {totalCompleted} / 4
          </span>
        </div>

        {/* QUESTION 1 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Question 1
              </span>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 mt-0.5">
                How does Node.js handle 20,000 concurrent network connections on a single JavaScript thread?
              </h3>
            </div>
            {q1 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q1 === 'C'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q1 === 'C' ? 'Correct' : 'Incorrect'}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1 text-sm sm:text-base">
            {[
              {
                id: 'A',
                label: 'By allocating 20,000 OS worker threads from the libuv thread pool.',
              },
              {
                id: 'B',
                label: 'By time-slicing the V8 Call Stack using hardware interrupts.',
              },
              {
                id: 'C',
                label: 'By delegating socket descriptors to OS kernel event demultiplexers (epoll/kqueue) and processing ready sockets via the non-blocking event loop.',
              },
              {
                id: 'D',
                label: 'By converting synchronous disk reads into WebAssembly background tasks.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setQ1(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between text-sm sm:text-base ${
                  q1 === opt.id
                    ? opt.id === 'C'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-semibold'
                      : 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {opt.id}
                  </span>
                  <span>{opt.label}</span>
                </div>
                {q1 === opt.id &&
                  (opt.id === 'C' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  ))}
              </button>
            ))}
          </div>

          {q1 && (
            <div
              className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                q1 === 'C'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q1 === 'C' ? (
                <p>
                  <strong>Correct!</strong> Node.js does not allocate worker threads for network connections. Sockets are registered with OS kernel notification mechanisms (<code className="font-mono">epoll</code> on Linux, <code className="font-mono">kqueue</code> on macOS). The event loop wakes up only when packets arrive.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option C is the correct answer. The thread pool is NOT used for network sockets; sockets are monitored by OS kernel multiplexers with zero thread overhead.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 2 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Question 2
              </span>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 mt-0.5">
                If you inspect a vanilla Node.js process using &ldquo;ps -T -p &lt;pid&gt;&rdquo;, why do you observe 7 to 11 OS threads?
              </h3>
            </div>
            {q2 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q2 === 'B'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q2 === 'B' ? 'Correct' : 'Incorrect'}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1 text-sm sm:text-base">
            {[
              {
                id: 'A',
                label: 'Node.js creates an OS thread for every imported npm module.',
              },
              {
                id: 'B',
                label: 'The process contains 1 main JS thread, 4 libuv pool workers, plus V8 background TurboFan compiler and GC sweeper threads.',
              },
              {
                id: 'C',
                label: 'Each open TCP port automatically spawns 2 dedicated kernel threads.',
              },
              {
                id: 'D',
                label: 'The Linux kernel automatically clones the main thread into redundant backup processes.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setQ2(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between text-sm sm:text-base ${
                  q2 === opt.id
                    ? opt.id === 'B'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-semibold'
                      : 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {opt.id}
                  </span>
                  <span>{opt.label}</span>
                </div>
                {q2 === opt.id &&
                  (opt.id === 'B' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  ))}
              </button>
            ))}
          </div>

          {q2 && (
            <div
              className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                q2 === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q2 === 'B' ? (
                <p>
                  <strong>Correct!</strong> While JavaScript execution is single-threaded, the host Node.js OS process leverages C++ multi-threading for the libuv worker pool (default 4 threads), V8 JIT background compilation, and V8 concurrent garbage collection.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option B is correct. The multi-threaded nature of the Node.js process stems from libuv workers and V8 internal helper threads.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 3 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Question 3
              </span>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 mt-0.5">
                What does the &ldquo;Run-to-Completion&rdquo; invariant guarantee in JavaScript?
              </h3>
            </div>
            {q3 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q3 === 'A'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q3 === 'A' ? 'Correct' : 'Incorrect'}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1 text-sm sm:text-base">
            {[
              {
                id: 'A',
                label: 'A function currently executing on the Call Stack cannot be preempted by another event until it finishes and pops from the stack.',
              },
              {
                id: 'B',
                label: 'Asynchronous callbacks are guaranteed to complete within 100 milliseconds.',
              },
              {
                id: 'C',
                label: 'The Node.js process will never exit until all network sockets are closed.',
              },
              {
                id: 'D',
                label: 'Promise handlers run in parallel across all available CPU cores.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setQ3(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between text-sm sm:text-base ${
                  q3 === opt.id
                    ? opt.id === 'A'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-semibold'
                      : 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {opt.id}
                  </span>
                  <span>{opt.label}</span>
                </div>
                {q3 === opt.id &&
                  (opt.id === 'A' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  ))}
              </button>
            ))}
          </div>

          {q3 && (
            <div
              className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                q3 === 'A'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q3 === 'A' ? (
                <p>
                  <strong>Correct!</strong> In JavaScript, synchronous execution is atomic with respect to the event loop. No timer, I/O callback, or network packet can interrupt a running function until that function finishes and returns control to the V8 runtime.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option A is correct. Run-to-Completion means synchronous frames cannot be preemptively interrupted mid-execution.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 4: PEEK / HIDE MODEL ANSWER */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                Question 4: Compare Node&apos;s single-threaded event-driven execution model with Apache/Tomcat&apos;s thread-per-request model under extreme concurrency (C10K).
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on stack memory allocation, OS kernel context switching, and I/O waiting states, then click below to reveal the faculty model answer.
              </p>
            </div>
            {q4Revealed && (
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                Revealed
              </span>
            )}
          </div>

          <div className="pt-1">
            <button
              onClick={() => setQ4Revealed(!q4Revealed)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold transition flex items-center gap-2 shadow-2xs"
            >
              <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{q4Revealed ? 'Hide Model Answer' : 'Peek Model Answer'}</span>
            </button>
          </div>

          {q4Revealed && (
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-3.5 text-sm sm:text-base text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs sm:text-sm">
                <Sparkles className="w-4 h-4" /> Professor&apos;s Engineering Model Answer
              </div>

              <div className="space-y-3 leading-relaxed">
                <p>
                  <strong>1. Memory Overhead (10K Connections):</strong>
                  <br />
                  In a thread-per-request server (Apache/Tomcat), 10,000 concurrent client connections require 10,000 OS threads. With an average thread stack size of 2MB–8MB, thread stacks alone consume <strong>20GB to 80GB of RAM</strong>. In Node.js, 10,000 idle TCP connections are represented merely as File Descriptors inside the OS kernel, consuming <strong>less than 50MB of RAM total</strong>.
                </p>

                <p>
                  <strong>2. Kernel Context Switching &amp; Cache Misses:</strong>
                  <br />
                  When 10,000 threads are active, the operating system scheduler spends the majority of its CPU cycles preemptively switching threads: saving CPU registers, swapping page tables, and invalidating CPU L1/L2 data and instruction caches (context thrashing). In Node.js, the single thread executes user code continuously without CPU context switching between sockets.
                </p>

                <p>
                  <strong>3. I/O Bound Workloads vs. CPU Bound Workloads:</strong>
                  <br />
                  Node.js achieves near-infinite scalability for I/O-bound systems (microservices, REST/GraphQL APIs, real-time WebSocket chats) because the thread yields immediately while waiting for databases or disks. However, for heavily CPU-bound tasks (video transcoding, machine learning inference), the single JavaScript thread can become a bottleneck unless offloaded to Worker Threads or native C++ addons.
                </p>

                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Engineering Formula: Concurrency Scalability = (Non-blocking I/O) / (Zero Context Switching Overhead + Minimal Stack Memory)
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 8: PEDAGOGICAL LEARNING RULE */}
      <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                CSCosmos Pedagogical Learning Rule
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                The university-grade 7-step mastery process followed across all 280 concepts:
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            {[
              'Explanation from zero.',
              'Internal working.',
              'Real-world examples.',
              'Practical coding exercise.',
              'Interview questions.',
              'Knowledge assessment.',
              'Move to next concept only after mastering current one.',
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5"
              >
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 8 using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}
