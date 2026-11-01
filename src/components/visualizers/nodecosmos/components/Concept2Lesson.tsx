'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  Cpu,
  Layers,
  Globe,
  Server,
  Zap,
  Sparkles,
  FileCode,
  RotateCcw,
  Eye,
  AlertTriangle,
  HardDrive,
  Activity,
  ShieldCheck,
  Binary,
  ArrowRight,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept2Lesson() {
  // Interactive quiz state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [q4Revealed, setQ4Revealed] = useState<boolean>(false);

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
            Node.js &mdash; Lesson 02/280
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Level: Beginner
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Category: Node.js Fundamentals
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold">
            Estimated learning time: 25&ndash;35 minutes
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Concept 2: Node.js Architecture
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Deconstructing the internal engine: the 4-tier stack, V8 execution, Libuv OS multiplexing, native C/C++ bindings, and the critical distinction between the single JavaScript main thread and asynchronous worker threads.
        </p>
      </div>

      {/* SECTION 1: THE CORE PROBLEM */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">First, understand the problem</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            To understand why Node.js is architected the way it is, you must understand how traditional backend servers worked before 2009.
          </p>

          <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              The Traditional Model: Multi-Threaded Thread-Per-Request (Apache / Tomcat)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In classic server frameworks, when an HTTP request arrives, the operating system creates or assigns a dedicated thread to handle it. That thread sits idle and <strong>blocks</strong> while waiting for database queries, network responses, or disk files.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-rose-600 dark:text-rose-400 font-mono uppercase">
                  1. Memory Footprint Exhaustion
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  Each OS thread allocates 1 MB to 2 MB of stack memory. Handling 10,000 concurrent connections requires up to 20 GB of RAM just for idle thread stacks!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-rose-600 dark:text-rose-400 font-mono uppercase">
                  2. CPU Context Switching Thrashing
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  The CPU core wastes massive clock cycles saving registers and switching thread states instead of running actual application logic.
                </p>
              </div>
            </div>
          </div>

          <p className="font-semibold text-slate-900 dark:text-slate-100">
            This became famous in software engineering history as the <strong>C10K Problem</strong>: how do you serve 10,000 concurrent clients on commodity hardware without running out of RAM or CPU cycles?
          </p>

          <p className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium">
            <strong>The Node.js Architectural Breakthrough:</strong> Instead of dedicating a thread per request, Node.js runs all JavaScript logic on a <em>single event loop thread</em> and offloads all I/O operations non-blockingly to the operating system kernel.
          </p>
        </div>
      </section>

      {/* SECTION 2: THE 4-TIER ARCHITECTURE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The 4-Tier Node.js Architecture</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When you type <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-900 dark:text-emerald-300">node app.js</code>, your request cascades through 4 distinct architectural layers:
          </p>

          {/* 4 Layers Visual Grid */}
          <div className="space-y-3.5">
            {/* Layer 1 */}
            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  L1
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    JavaScript Application Layer
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your application scripts, npm packages, Express, NestJS, and user code.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 shrink-0">
                Pure JavaScript
              </span>
            </div>

            {/* Layer 2 */}
            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  L2
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Node.js Core APIs &amp; C++ Bindings (Node-API)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Standard built-ins (<code className="font-mono text-emerald-600 dark:text-emerald-400">node:fs</code>, <code className="font-mono text-emerald-600 dark:text-emerald-400">node:http</code>, <code className="font-mono text-emerald-600 dark:text-emerald-400">node:crypto</code>, <code className="font-mono text-emerald-600 dark:text-emerald-400">node:net</code>) and native C++ wrappers.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 shrink-0">
                JS &harr; C++ Bridge
              </span>
            </div>

            {/* Layer 3 */}
            <div className="p-6 rounded-3xl border-2 border-emerald-500/40 bg-slate-50/70 dark:bg-slate-900/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                    L3
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                      Native C/C++ Engine Core (The Heavy Lifters)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      High-performance low-level libraries compiled directly into the Node.js executable binary.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shrink-0">
                  Compiled Native C/C++
                </span>
              </div>

              {/* Engine dependencies breakdown */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">V8 (Google)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Compiles JavaScript to machine code; manages the heap and garbage collection.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">libuv</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Provides the 6-phase Event Loop, OS non-blocking I/O, and the C++ worker thread pool.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-500" />
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">OpenSSL</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Cryptographic ciphers, SHA hashing, TLS/SSL secure sockets, and HTTPS certificates.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <Binary className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">zlib</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Fast streaming data compression and decompression (gzip, deflate, brotli).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-500" />
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">llhttp</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Ultra-fast, zero-allocation C parser for incoming HTTP 1.1 and HTTP/2 headers and payloads.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">c-ares</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Asynchronous, non-blocking DNS request and resolver library in C.
                  </p>
                </div>
              </div>
            </div>

            {/* Layer 4 */}
            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  L4
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Operating System Kernel Layer (epoll / kqueue / IOCP)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kernel notification multiplexers: Linux (<code className="font-mono">epoll</code>), macOS (<code className="font-mono">kqueue</code>), Windows (<code className="font-mono">IOCP</code>).
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 shrink-0">
                OS Kernel
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SINGLE THREAD VS THREAD POOL */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The Single Thread vs. Thread Pool Distinction</h2>
        </div>

        <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm font-semibold flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span>
              <strong>Crucial Engineering Fact:</strong> Node.js is <em>NOT</em> completely single-threaded! JavaScript execution runs on a single main thread, but Libuv maintains a pool of C++ worker threads in the background.
            </span>
          </div>

          <p>
            Understanding which operations run on the <strong>single main thread</strong> versus which operations get offloaded to the <strong>Libuv thread pool</strong> is one of the most critical topics in backend engineering:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Box 1: Main Thread OS Multiplexing */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    Main Thread (0 Threads Used)
                  </h3>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    Handled via OS Kernel Non-Blocking epoll
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                The operating system kernel directly notifies Node.js when network packets or timers arrive. No worker threads are spawned:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">TCP &amp; HTTP Sockets:</strong> Listening, receiving requests, and streaming responses over network.
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Timers:</strong> Threshold tracking for <code className="font-mono text-emerald-600 dark:text-emerald-400">setTimeout</code> and <code className="font-mono text-emerald-600 dark:text-emerald-400">setInterval</code>.
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Microtasks:</strong> Immediate resolution of <code className="font-mono text-emerald-600 dark:text-emerald-400">process.nextTick</code> and Promise callbacks.
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Thread Pool Offloading */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    Libuv Thread Pool (Default: 4 Threads)
                  </h3>
                  <p className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
                    Configured via UV_THREADPOOL_SIZE
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Operating systems do not provide universal asynchronous primitives for disk or CPU tasks. These are offloaded to Libuv threads:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">File System Operations:</strong> All asynchronous <code className="font-mono text-purple-600 dark:text-purple-400">fs.readFile</code>, <code className="font-mono text-purple-600 dark:text-purple-400">fs.writeFile</code> calls.
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Heavy Crypto:</strong> Password hashing (<code className="font-mono text-purple-600 dark:text-purple-400">crypto.pbkdf2</code>, <code className="font-mono text-purple-600 dark:text-purple-400">crypto.scrypt</code>) and key generation.
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Compression &amp; DNS:</strong> <code className="font-mono text-purple-600 dark:text-purple-400">zlib</code> compression blocks and synchronous <code className="font-mono text-purple-600 dark:text-purple-400">dns.lookup()</code> calls.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ARCHITECTURAL COMPARISON TABLE */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Architectural Comparison: Thread-per-Request vs. Node.js</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Here is how Node.js compares against the traditional multi-threaded server architecture:
          </p>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Metric / Dimension</th>
                  <th className="py-3.5 px-4">Thread-Per-Request (Apache/Tomcat)</th>
                  <th className="py-3.5 px-4">Node.js Event-Driven Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {[
                  {
                    metric: 'Concurrency Model',
                    trad: '1 Thread spawned per active client',
                    node: '1 Main Event Loop + OS Multiplexing (epoll)',
                  },
                  {
                    metric: 'Memory per Connection',
                    trad: '1 MB to 2 MB (Stack allocation)',
                    node: '~2 KB to 4 KB (Socket descriptor state)',
                  },
                  {
                    metric: '10,000 Concurrent Idle Clients',
                    trad: '10 GB – 20 GB RAM (Server crash)',
                    node: '< 50 MB RAM (Effortless scalability)',
                  },
                  {
                    metric: 'CPU Context Switching',
                    trad: 'Heavy; CPU thrashes between threads',
                    node: 'Zero context switching for network sockets',
                  },
                  {
                    metric: 'I/O Handling',
                    trad: 'Thread blocks synchronously during I/O',
                    node: 'Non-blocking asynchronous event notification',
                  },
                  {
                    metric: 'Best Suited For',
                    trad: 'Heavy synchronous CPU computation',
                    node: 'High-throughput I/O, WebSockets, REST APIs',
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {row.metric}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {row.trad}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.node}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE CODE LAB */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            5
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Interactive Architecture Lab: Non-Blocking Execution</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Experience how the Node.js V8 execution stack and the Libuv timer queue coordinate asynchronous operations. Notice how synchronous execution finishes completely <em>before</em> any scheduled asynchronous callback runs:
          </p>

          <NodeJsEditor
            title="Concept 2 Code Lab: Non-Blocking Execution Trace"
            initialCode={`console.log("1. [Main Thread] Sync JavaScript task begins");

setTimeout(() => {
  console.log("3. [Libuv Timers Phase] Timer callback fired by runtime!");
}, 200);

console.log("2. [Main Thread] Sync JavaScript task finishes");`}
            presets={[
              {
                label: '1. Event Loop Timing Order',
                code: `console.log("1. [Main Thread] Sync JavaScript task begins");\n\nsetTimeout(() => {\n  console.log("3. [Libuv Timers Phase] Timer callback fired by runtime!");\n}, 200);\n\nconsole.log("2. [Main Thread] Sync JavaScript task finishes");`,
              },
              {
                label: '2. Inspect Environment & Architecture',
                code: `console.log("=== Node.js Engine Architecture Info ===");\nconsole.log("Node version   :", process.version);\nconsole.log("V8 version     :", process.versions.v8);\nconsole.log("libuv version  :", process.versions.uv);\nconsole.log("CPU Architecture:", process.arch);\nconsole.log("Platform       :", process.platform);\nconsole.log("Process PID    :", process.pid);`,
              },
              {
                label: '3. Multi-Timer Race',
                code: `console.log("[Start] Scheduling 3 asynchronous tasks");\n\nsetTimeout(() => console.log("--> Task C (300ms delay completed)"), 300);\nsetTimeout(() => console.log("--> Task A (100ms delay completed)"), 100);\nsetTimeout(() => console.log("--> Task B (200ms delay completed)"), 200);\n\nconsole.log("[End] Main thread is now free to accept new incoming events!");`,
              },
            ]}
          />
        </div>
      </section>

      {/* SECTION 6: TWO CRITICAL ENGINEERING FAILURE MODES */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            6
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Two Critical Production Failure Modes</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Because Node.js runs all JavaScript logic on a single thread and offloads blocking tasks to 4 worker threads, production engineering bugs usually fall into one of two traps:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Trap #1: Event Loop Starvation</span>
              </div>
              <p className="text-xs text-rose-950 dark:text-rose-200 leading-relaxed">
                If you execute a heavy CPU calculation (e.g. recursive Fibonacci, parsing a 100MB JSON payload, or an exponential Regex) on the main thread, the single thread freezes! No other incoming HTTP sockets, timers, or promises can be processed until that function finishes.
              </p>
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-300 font-mono">
                Rule: &ldquo;Don&apos;t block the Event Loop!&rdquo; Offload heavy CPU work to <code className="font-bold">worker_threads</code>.
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Trap #2: Thread Pool Exhaustion</span>
              </div>
              <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                By default, <code className="font-mono">UV_THREADPOOL_SIZE</code> is 4. If your server receives 4 simultaneous heavy password hashing requests (<code className="font-mono">crypto.pbkdf2</code>), all 4 worker threads are occupied. A 5th task&mdash;even a simple file read&mdash;must queue and wait until a thread frees up!
              </p>
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 font-mono">
                Remedy: Scale via <code className="font-bold">process.env.UV_THREADPOOL_SIZE = 16</code> or cluster processes.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CHECK YOUR UNDERSTANDING (INTERACTIVE QUIZ) */}
      <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-sm">
              7
            </span>
            <h2 className="text-2xl font-bold tracking-tight">Check Your Understanding</h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-mono font-bold">
            <span className="text-slate-600 dark:text-slate-400">Progress:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {totalCompleted} / 4 Completed
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Verify your architectural comprehension of Node.js engine layers, Libuv, and concurrency before advancing to Concept 3.
        </p>

        {/* QUESTION 1 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Question 1: Is Node.js truly single-threaded?
            </h3>
            {q1 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q1 === 'C'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q1 === 'C' ? 'Correct' : 'Needs Review'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {[
              { id: 'A', text: 'Yes, Node.js never uses more than one thread for anything under any circumstances.' },
              { id: 'B', text: 'No, every incoming HTTP request spawns a new operating system thread.' },
              {
                id: 'C',
                text: 'JavaScript executes on a single main thread, but Libuv uses a background worker thread pool for blocking tasks like file I/O and crypto.',
              },
              { id: 'D', text: 'Node.js is only single-threaded on Windows; on Linux it is multi-threaded.' },
            ].map((option) => {
              const isSelected = q1 === option.id;
              const isCorrect = option.id === 'C';
              let btnStyle =
                'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700';

              if (isSelected) {
                if (isCorrect) {
                  btnStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                } else {
                  btnStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-semibold ring-1 ring-rose-500';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => setQ1(option.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {option.id}
                    </span>
                    <span>{option.text}</span>
                  </span>
                  {isSelected && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {q1 && (
            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed ${
                q1 === 'C'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q1 === 'C' ? (
                <p>
                  <strong>Correct!</strong> Your JavaScript code and the Event Loop execute on a single thread. However, low-level blocking tasks (file system, crypto, zlib) are offloaded to Libuv&apos;s C++ worker thread pool (<code className="font-mono">UV_THREADPOOL_SIZE</code>).
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option {q1} is incorrect. The single thread applies only to JavaScript execution and the event loop. Libuv spawns a default pool of 4 C++ worker threads to execute synchronous OS syscalls in the background.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 2 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Question 2: Which library in Layer 3 provides the Event Loop and Worker Thread Pool to Node.js?
            </h3>
            {q2 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q2 === 'B'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q2 === 'B' ? 'Correct' : 'Needs Review'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {[
              { id: 'A', text: 'V8' },
              { id: 'B', text: 'libuv' },
              { id: 'C', text: 'OpenSSL' },
              { id: 'D', text: 'Express' },
            ].map((option) => {
              const isSelected = q2 === option.id;
              const isCorrect = option.id === 'B';
              let btnStyle =
                'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700';

              if (isSelected) {
                if (isCorrect) {
                  btnStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                } else {
                  btnStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-semibold ring-1 ring-rose-500';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => setQ2(option.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {option.id}
                    </span>
                    <span>{option.text}</span>
                  </span>
                  {isSelected && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {q2 && (
            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed ${
                q2 === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q2 === 'B' ? (
                <p>
                  <strong>Spot on!</strong> <code className="font-mono">libuv</code> is the multi-platform C library specifically designed for Node.js to provide the 6-phase event loop, asynchronous I/O abstractions, and the worker thread pool.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> It is <code className="font-mono">libuv</code>. V8 only executes JavaScript and manages heap memory; OpenSSL handles encryption; and Express is a high-level userland framework.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 3 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Question 3: How does Node.js handle 10,000 concurrent network sockets without creating 10,000 threads?
            </h3>
            {q3 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q3 === 'B'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q3 === 'B' ? 'Correct' : 'Needs Review'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {[
              { id: 'A', text: 'It creates a hidden thread pool with 10,000 threads.' },
              {
                id: 'B',
                text: 'It relies on operating system kernel multiplexing primitives (epoll, kqueue, IOCP) that monitor all sockets non-blockingly on one thread.',
              },
              { id: 'C', text: 'It drops old connections when new ones arrive to save RAM.' },
              { id: 'D', text: 'It executes all network requests synchronously.' },
            ].map((option) => {
              const isSelected = q3 === option.id;
              const isCorrect = option.id === 'B';
              let btnStyle =
                'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700';

              if (isSelected) {
                if (isCorrect) {
                  btnStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                } else {
                  btnStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-semibold ring-1 ring-rose-500';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => setQ3(option.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {option.id}
                    </span>
                    <span>{option.text}</span>
                  </span>
                  {isSelected && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {q3 && (
            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed ${
                q3 === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q3 === 'B' ? (
                <p>
                  <strong>Exactly!</strong> Operating systems provide kernel notification systems (<code className="font-mono">epoll</code> on Linux, <code className="font-mono">kqueue</code> on macOS, <code className="font-mono">IOCP</code> on Windows). The single main thread registers file descriptors and only wakes up when the OS confirms that data has arrived.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Node.js uses OS kernel non-blocking multiplexing (<code className="font-mono">epoll</code>/<code className="font-mono">kqueue</code>). It does not create a thread per socket, and it does not drop active connections.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 4: PEEK / HIDE MODEL ANSWER */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Question 4: What is the architectural difference when an HTTP network request arrives vs. when fs.readFile() is executed?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Reflect on how each path interacts with the operating system and worker threads, then click below to reveal the faculty model answer.
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
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-2 shadow-2xs"
            >
              <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{q4Revealed ? 'Hide Model Answer' : 'Peek Model Answer'}</span>
            </button>
          </div>

          {q4Revealed && (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs">
                <Sparkles className="w-4 h-4" /> Professor&apos;s Engineering Model Answer
              </div>

              <div className="space-y-3 leading-relaxed">
                <p>
                  <strong>1. Incoming HTTP Network Request (OS Kernel Multiplexing):</strong> Handled directly by the main thread via Libuv and the OS kernel (<code className="font-mono">epoll</code> on Linux, <code className="font-mono">kqueue</code> on macOS). <em>Zero worker threads from the thread pool are used</em>. The OS kernel notifies the event loop when data packets arrive, allowing millions of open sockets to be monitored concurrently without thread overhead.
                </p>
                <p>
                  <strong>2. fs.readFile() Execution (Libuv Thread Pool Offloading):</strong> Standard operating systems do not provide universal asynchronous file system syscalls. Therefore, Libuv <em>offloads the blocking synchronous read syscall to one of its 4 background C++ worker threads</em>. Once the worker thread finishes reading the file chunk into a buffer, it pushes the callback into the event loop poll queue to be executed on the main JavaScript thread.
                </p>
                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 font-mono">
                  Architectural Summary: Network I/O = Kernel Event Demultiplexer &bull; File &amp; Crypto I/O = Libuv Thread Pool
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
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                CSCosmos Pedagogical Learning Rule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The university-grade 7-step mastery process followed across all 280 concepts:
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
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
                className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5"
              >
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-800 dark:text-slate-200 text-xs font-medium">{step}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 3 using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}