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
  RefreshCw,
  Box,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept3Lesson() {
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
            Node.js — Lesson 03/280
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Level: Beginner
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Category: Node.js Fundamentals
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold">
            Estimated Time: 25–35 mins
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Concept 3: The Node.js Runtime Environment
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Peeling back the host container: how an operating system process initializes JavaScript, allocates V8 heap vs. native memory, exposes the global scope, and manages the execution lifecycle from boot to exit.
        </p>
      </div>

      {/* SECTION 1: FIRST, UNDERSTAND THE PROBLEM */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">First, Understand the Problem: What is a &ldquo;Runtime&rdquo;?</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When engineers say <em>&ldquo;JavaScript is a programming language, but Node.js is a runtime environment&rdquo;</em>, what does that actually mean under the hood?
          </p>

          <p>
            A programming language is merely an <strong>abstract specification</strong> (ECMAScript standard). It defines syntax rules: keywords like <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">function</code>, <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">const</code>, object prototypes, and loops.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm font-semibold flex items-center gap-3">
            <span className="text-xl">💡</span>
            <span>
              <strong>The Problem:</strong> A language specification cannot run by itself. Code cannot execute in a vacuum. It requires an <strong>operating system process</strong> with allocated RAM, a call stack, environment variables, standard streams (stdout/stderr), and system capabilities.
            </span>
          </div>

          <p>
            Here is how different programming languages solve this runtime requirement:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-mono text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">
                C / C++ / Rust
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Compiles ahead of time into machine binary. The OS kernel + standard libc acts as the native runtime.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-mono text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 uppercase">
                Python / Java
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Uses a dedicated virtual machine (CPython VM or Java JVM) that interprets bytecode and manages heap memory.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                Node.js (JavaScript)
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Bundles Google&apos;s V8 engine inside a C++ container with Libuv, creating an OS host process that executes JavaScript outside browsers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 5 CORE RUNTIME SUBSYSTEMS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The 5 Core Subsystems of the Node.js Runtime</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When you launch a Node.js application (<code className="font-mono font-bold text-emerald-600 dark:text-emerald-400">node server.js</code>), the operating system spawns a process containing <strong>five interconnected subsystems</strong>:
          </p>

          <div className="space-y-4">
            {/* Subsystem 1: Global Execution Scope */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
                    01
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                      The Global Execution Scope (<code className="font-mono text-emerald-600 dark:text-emerald-400">globalThis</code> &amp; <code className="font-mono text-emerald-600 dark:text-emerald-400">global</code>)
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                      Universal Top-Level Environment
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  Global Namespace
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                In browsers, the top-level global is <code className="font-mono font-bold">window</code>. In Node.js, the top-level global is <code className="font-mono font-bold">global</code> (standardized in ECMAScript as <code className="font-mono font-bold">globalThis</code>). It houses universal primitives available everywhere without imports: <code className="font-mono font-bold">Buffer</code>, <code className="font-mono font-bold">process</code>, <code className="font-mono font-bold">console</code>, <code className="font-mono font-bold">setTimeout</code>, <code className="font-mono font-bold">setImmediate</code>, and <code className="font-mono font-bold">queueMicrotask</code>.
              </p>
            </div>

            {/* Subsystem 2: The process Host Controller */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-sm">
                    02
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                      The <code className="font-mono text-blue-600 dark:text-blue-400">process</code> Host Controller
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                      Operating System Bridge &amp; Telemetry
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  OS Telemetry
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The <code className="font-mono font-bold">process</code> object is the vital umbilical cord linking your JavaScript code to the operating system kernel. It provides the Process ID (<code className="font-mono">process.pid</code>), environment variables (<code className="font-mono">process.env</code>), CLI arguments (<code className="font-mono">process.argv</code>), execution directory (<code className="font-mono">process.cwd()</code>), and OS signals (<code className="font-mono">SIGINT</code>, <code className="font-mono">SIGTERM</code>).
              </p>
            </div>

            {/* Subsystem 3: Dual Memory Space */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-mono font-bold text-sm">
                    03
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                      Dual Memory Space: V8 Heap vs. Native C++ Buffers
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                      Garbage Collected vs. Raw System RAM
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                  Memory Architecture
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Unlike a pure browser sandbox, Node.js divides process memory into two realms: <strong>V8 Heap</strong> (where standard JS objects, closures, strings, and arrays reside and are managed by garbage collection) and <strong>Native C++ Memory</strong> (where binary <code className="font-mono font-bold">Buffer</code> instances, socket slabs, and libuv queues reside outside V8 heap limits directly allocated via system <code className="font-mono">malloc</code>).
              </p>
            </div>

            {/* Subsystem 4: V8 Execution Engine */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-sm">
                    04
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                      V8 Execution Engine &amp; Call Stack
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                      Ignition Interpreter + TurboFan JIT
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                  Execution Stack
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Executes code sequentially on a single call stack. Hot functions run through TurboFan for machine-code optimization, while microtasks (<code className="font-mono">process.nextTick</code>, <code className="font-mono">Promise.then</code>) drain immediately after the current synchronous stack frame unwinds.
              </p>
            </div>

            {/* Subsystem 5: Libuv Event Loop & Handle Counter */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center font-mono font-bold text-sm">
                    05
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                      Libuv Event Loop &amp; Active Handle Counter
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                      The Process Lifecycle Arbiter
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  Loop Keep-Alive
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The runtime maintains an internal counter of <strong>Active Handles</strong> (open TCP servers, listening sockets, active timers, open file descriptors). As long as this counter is greater than 0, the Node.js process stays alive. The moment active handles reach 0, Node.js shuts down!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE LIFECYCLE OF A NODE.JS PROCESS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The Lifecycle of a Node.js Process: From Boot to Exit</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            What exact sequence of operations occurs when you run <code className="font-mono font-bold text-slate-900 dark:text-emerald-300">node app.js</code>? Let&apos;s follow the execution lifecycle step-by-step:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  OS Process Initialization
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The operating system creates an execution process, assigns a <strong>PID</strong> (Process ID), allocates initial virtual memory, and prepares standard I/O streams (<code className="font-mono">stdin</code>, <code className="font-mono">stdout</code>, <code className="font-mono">stderr</code>).
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  C++ Native Bootstrap
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The Node.js binary initializes the V8 Isolate, sets up the Libuv event loop, loads C++ internal bindings, and prepares the <code className="font-mono">globalThis</code> environment.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Synchronous Script Execution
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Node.js loads your entry file (<code className="font-mono">app.js</code>), wraps it in the module closure, and executes the entire synchronous JavaScript code from top to bottom on the V8 call stack.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Active Handles Check
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Once the synchronous code completes, Node.js queries the Libuv event loop: <em>Are there any active timers, unclosed sockets, or pending requests?</em> If none exist, the process skips straight to exit!
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0">
                  5
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Event Loop Ticking
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                If active handles exist (such as an HTTP server or timers), the Event Loop ticks across its 6 phases, servicing incoming network packets and processing callbacks until all handles close.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0">
                  6
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Clean Process Teardown
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Node.js triggers the <code className="font-mono">process.on(&apos;exit&apos;)</code> event, drains final microtasks, flushes stdout buffers, and returns an exit code (<code className="font-mono">0</code> for success, non-zero for errors) back to the OS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PROCESS MEMORY DEEP DIVE */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Understanding process.memoryUsage()</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            In production backend engineering, diagnosing memory issues requires mastering the output of <code className="font-mono font-bold text-emerald-600 dark:text-emerald-400">process.memoryUsage()</code>. Here is what each property measures:
          </p>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3.5 px-4">Memory Field</th>
                  <th className="py-3.5 px-4">What It Represents</th>
                  <th className="py-3.5 px-4">Where It Resides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {[
                  {
                    field: 'rss (Resident Set Size)',
                    desc: 'Total RAM allocated to the entire Node.js OS process (includes V8 heap, C++ bindings, code, and shared libraries).',
                    where: 'Operating System RAM',
                  },
                  {
                    field: 'heapTotal',
                    desc: 'Total memory allocated by V8 for JavaScript object storage. Automatically expands as memory demands grow.',
                    where: 'V8 Engine Heap Space',
                  },
                  {
                    field: 'heapUsed',
                    desc: 'Actual memory actively occupied by live JavaScript objects, closures, strings, and variables right now.',
                    where: 'V8 Active Heap',
                  },
                  {
                    field: 'external',
                    desc: 'Memory allocated to C++ objects bound to JavaScript (primarily Node.js Buffer instances and native addons).',
                    where: 'Native C++ Memory (malloc)',
                  },
                  {
                    field: 'arrayBuffers',
                    desc: 'Memory allocated for ArrayBuffer and SharedArrayBuffer instances (subset of external).',
                    where: 'Direct System Memory',
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {row.field}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {row.desc}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.where}
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
          <h2 className="text-2xl font-bold tracking-tight">Interactive Runtime Lab: Inspect Your Environment</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Use our interactive simulated Node.js environment below to query live process telemetry, inspect memory distribution, and explore the global scope:
          </p>

          <NodeJsEditor
            title="Concept 3 Code Lab: Runtime Environment Inspection"
            initialCode={`// 1. Inspect Process Telemetry
console.log("=== Node.js Process Telemetry ===");
console.log("Process ID (PID) :", process.pid);
console.log("Platform / Arch  :", process.platform, "/", process.arch);
console.log("Current Directory:", process.cwd());
console.log("Node.js Version  :", process.version);

// 2. Inspect Memory Footprint (converted to Megabytes)
const mem = process.memoryUsage();
console.log("\\n=== Process Memory Footprint ===");
console.log("RSS (Total RAM)  :", (mem.rss / 1024 / 1024).toFixed(2), "MB");
console.log("V8 Heap Total    :", (mem.heapTotal / 1024 / 1024).toFixed(2), "MB");
console.log("V8 Heap Used     :", (mem.heapUsed / 1024 / 1024).toFixed(2), "MB");
console.log("External C++ Mem :", (mem.external / 1024 / 1024).toFixed(2), "MB");`}
            presets={[
              {
                label: '1. Process & Memory Inspection',
                code: `// 1. Inspect Process Telemetry\nconsole.log("=== Node.js Process Telemetry ===");\nconsole.log("Process ID (PID) :", process.pid);\nconsole.log("Platform / Arch  :", process.platform, "/", process.arch);\nconsole.log("Current Directory:", process.cwd());\nconsole.log("Node.js Version  :", process.version);\n\n// 2. Inspect Memory Footprint (converted to Megabytes)\nconst mem = process.memoryUsage();\nconsole.log("\\n=== Process Memory Footprint ===");\nconsole.log("RSS (Total RAM)  :", (mem.rss / 1024 / 1024).toFixed(2), "MB");\nconsole.log("V8 Heap Total    :", (mem.heapTotal / 1024 / 1024).toFixed(2), "MB");\nconsole.log("V8 Heap Used     :", (mem.heapUsed / 1024 / 1024).toFixed(2), "MB");\nconsole.log("External C++ Mem :", (mem.external / 1024 / 1024).toFixed(2), "MB");`,
              },
              {
                label: '2. Buffer Allocation & C++ Memory',
                code: `// Buffers are allocated outside the V8 heap in native memory slabs\nconsole.log("=== Node.js Native Buffer Exploration ===");\n\nconst buf = Buffer.from("Hello Node.js Runtime!");\nconsole.log("Buffer content  :", buf.toString());\nconsole.log("Buffer bytes    :", buf.length, "bytes");\nconsole.log("Hex representation:", buf.toString("hex"));\nconsole.log("Is Buffer instance:", Buffer.isBuffer(buf));`,
              },
              {
                label: '3. Global Scope & process.nextTick',
                code: `console.log("=== Global Scope & Microtasks ===");\nconsole.log("globalThis === global:", globalThis === global);\n\nconsole.log("1. Synchronous log");\n\nprocess.nextTick(() => {\n  console.log("3. process.nextTick fired (highest priority microtask)!");\n});\n\nsetTimeout(() => {\n  console.log("4. Timer callback fired in Libuv Timers phase");\n}, 50);\n\nconsole.log("2. Synchronous completion");`,
              },
            ]}
          />
        </div>
      </section>

      {/* SECTION 6: TWO CRITICAL ENGINEERING TRAPS */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            6
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Two Critical Production Runtime Traps</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Understanding the runtime environment helps avoid devastating production bugs that take down production services:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Trap #1: The Zombie Event Loop (Active Handles)</span>
              </div>
              <p className="text-sm text-rose-950 dark:text-rose-200 leading-relaxed">
                If a script creates a background <code className="font-mono">setInterval</code> or keeps an unclosed database socket, Node.js sees active handles and <strong>refuses to exit</strong>. In Docker containers, this creates zombie processes that fail to shut down during redeployment.
              </p>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900 text-sm font-mono text-rose-900 dark:text-rose-300">
                Remedy: Call <code className="font-bold">timer.unref()</code> on background timers to allow clean exit when main tasks finish.
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Trap #2: Unhandled Rejection Process Crashes</span>
              </div>
              <p className="text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
                In modern Node.js versions (v15+), an unhandled Promise rejection terminates the entire Node.js OS process with a non-zero exit code. A single unhandled query failure in an obscure handler can take down your entire API!
              </p>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900 text-sm font-mono text-amber-900 dark:text-amber-300">
                Remedy: Always handle promise rejections, or register <code className="font-bold">process.on(&apos;unhandledRejection&apos;)</code>.
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
          Verify your architectural comprehension of the Node.js runtime process lifecycle, memory allocations, and global scope before advancing to Concept 4.
        </p>

        {/* QUESTION 1 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 1: What determines whether a Node.js runtime process stays alive or terminates?
            </h3>
            {q1 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q1 === 'B'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q1 === 'B' ? 'Correct' : 'Needs Review'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {[
              { id: 'A', text: 'The size of the JavaScript file loaded from disk.' },
              {
                id: 'B',
                text: 'Whether there are active Libuv handles or requests (active timers, open network sockets, unclosed files) remaining in the event loop.',
              },
              { id: 'C', text: 'Node.js always runs indefinitely until killed with SIGKILL (kill -9).' },
              { id: 'D', text: 'The number of functions declared in the global scope.' },
            ].map((option) => {
              const isSelected = q1 === option.id;
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
                  onClick={() => setQ1(option.id)}
                  className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base flex items-center justify-between transition ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs sm:text-sm shrink-0">
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
              className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                q1 === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q1 === 'B' ? (
                <p>
                  <strong>Correct!</strong> Node.js stays alive as long as Libuv&apos;s active handle reference count is greater than zero. When all listening servers, open files, and timers are finished or closed, the event loop empties and the process exits naturally.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option {q1} is incorrect. The process lifecycle is governed by the Event Loop&apos;s active handle counter. If there are no active timers or open I/O handles, Node.js terminates immediately upon completing synchronous execution.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 2 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 2: In Node.js, where is memory allocated when creating a large Buffer (e.g. Buffer.alloc(10 * 1024 * 1024))?
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
              { id: 'A', text: 'Inside the V8 JavaScript garbage-collected heap.' },
              {
                id: 'B',
                text: 'Outside the V8 heap in native C++ memory slabs allocated directly from system RAM via malloc.',
              },
              { id: 'C', text: 'Inside browser localStorage.' },
              { id: 'D', text: 'On the CPU cache registers.' },
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
                  className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base flex items-center justify-between transition ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs sm:text-sm shrink-0">
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
              className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                q2 === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q2 === 'B' ? (
                <p>
                  <strong>Spot on!</strong> Node.js <code className="font-mono font-bold">Buffer</code> instances are raw binary memory slabs allocated directly by C++ outside V8&apos;s heap (tracked under <code className="font-mono">external</code> in <code className="font-mono">process.memoryUsage()</code>). This allows high-speed stream I/O without triggering V8 GC pauses!
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option {q2} is incorrect. Buffers are allocated in native C++ memory outside the V8 heap. This prevents V8 garbage collection overhead when streaming massive files or socket payloads.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 3 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 3: What is the purpose of timer.unref() in Node.js?
            </h3>
            {q3 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q3 === 'C'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q3 === 'C' ? 'Correct' : 'Needs Review'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {[
              { id: 'A', text: 'It cancels the timer immediately and removes it from memory.' },
              { id: 'B', text: 'It speeds up the timer callback by executing it synchronously.' },
              {
                id: 'C',
                text: 'It tells Libuv to exclude this timer from the active handle count, allowing the Node.js process to exit naturally even if the timer has not fired yet.',
              },
              { id: 'D', text: 'It makes the timer run in a separate worker thread.' },
            ].map((option) => {
              const isSelected = q3 === option.id;
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
                  onClick={() => setQ3(option.id)}
                  className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base flex items-center justify-between transition ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs sm:text-sm shrink-0">
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
              className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                q3 === 'C'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q3 === 'C' ? (
                <p>
                  <strong>Exactly!</strong> By default, an active timer keeps the process alive. Calling <code className="font-mono font-bold">timer.unref()</code> tells Libuv: <em>&ldquo;If this timer is the only remaining handle left in the event loop, don&apos;t wait for it—terminate the process.&rdquo;</em> This is crucial for background metrics and cache cleanup intervals!
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Calling <code className="font-mono">.unref()</code> does not cancel the timer; it merely decrements the active handle count so the process is free to terminate if no other work remains.
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
                Question 4: Why can a Node.js process consume 1.5 GB of RAM when heapUsed reports only 150 MB?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on the difference between V8 heap memory and native C++ process memory, then click below to reveal the faculty model answer.
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
                  <strong>1. Heap Memory vs. Native Memory Divergence:</strong> <code className="font-mono font-bold">heapUsed</code> measures only the JavaScript objects managed by the V8 garbage collector (strings, closures, plain objects).
                </p>
                <p>
                  <strong>2. Native C++ Buffer Allocations:</strong> Large data streams, video chunks, and file uploads are handled via <code className="font-mono font-bold">Buffer</code> instances allocated directly in C++ via libc <code className="font-mono">malloc</code>. These exist outside the V8 heap and appear in <code className="font-mono">external</code> and <code className="font-mono">rss</code>, but not in <code className="font-mono">heapUsed</code>.
                </p>
                <p>
                  <strong>3. Operating System Virtual Memory &amp; Fragmentation:</strong> The <code className="font-mono font-bold">rss</code> (Resident Set Size) reflects all physical RAM mapped to the process, including compiled native code, shared libraries, thread stacks, memory fragmentation, and uncollected external allocations.
                </p>
                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Formula: RSS = V8 Heap (heapTotal) + Native External C++ (Buffers/Addons) + Thread Stacks + Binary Code + Libuv State
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
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 4 using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}
