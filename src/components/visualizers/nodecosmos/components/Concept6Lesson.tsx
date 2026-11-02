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
  FolderOpen,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept6Lesson() {
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
            Node.js — Lesson 06/280
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
          Concept 6: Introduction to libuv
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          The engine of asynchronous I/O and concurrency. Discover why libuv was created, how it unifies operating system kernel notification systems (<code className="font-mono">epoll</code>, <code className="font-mono">kqueue</code>, <code className="font-mono">IOCP</code>), and how its background worker thread pool handles blocking syscalls.
        </p>
      </div>

      {/* SECTION 1: FIRST, UNDERSTAND THE PROBLEM */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">First, Understand the Problem: The Operating System Jungle</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            In 2009, Ryan Dahl set out to build an event-driven server platform where JavaScript could handle tens of thousands of simultaneous web connections on a single thread.
          </p>

          <p>
            However, he immediately encountered two monumental engineering roadblocks:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <span className="text-xs sm:text-sm font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                Roadblock 1: Fragmented OS Kernel Primitives
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Every operating system provides a completely different kernel notification system for non-blocking network sockets:
              </p>
              <ul className="space-y-1 list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono">
                <li>Linux: <code className="font-bold text-slate-900 dark:text-slate-100">epoll</code></li>
                <li>macOS &amp; BSD: <code className="font-bold text-slate-900 dark:text-slate-100">kqueue</code></li>
                <li>Windows: <code className="font-bold text-slate-900 dark:text-slate-100">IOCP</code> (I/O Completion Ports)</li>
                <li>Solaris: <code className="font-bold text-slate-900 dark:text-slate-100">Event Ports</code></li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <span className="text-xs sm:text-sm font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                Roadblock 2: The Blocking Disk File Problem
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Unlike network sockets, operating systems do <strong>NOT</strong> have universal, non-blocking asynchronous APIs for reading files from local disk! On Linux and macOS, reading a file blocks the calling thread synchronously at the kernel level until the disk sectors are fetched.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-sm font-semibold flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>The libuv Solution:</strong> The Node.js core team developed <strong>libuv</strong> in C. It acts as an abstraction bridge over all OS notification systems and bundles a background worker thread pool to handle blocking disk and crypto operations.
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 4 PILLARS OF LIBUV */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The 4 Architectural Pillars of libuv</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            libuv provides four foundational pillars that power every asynchronous operation in Node.js:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    1. The 6-Phase Event Loop
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-emerald-600 dark:text-emerald-400">
                    uv_run()
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The continuous lifecycle loop that polls for kernel I/O events, tracks timer min-heaps, and executes scheduled JavaScript callbacks across 6 distinct phases.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    2. OS Kernel Multiplexer
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-blue-600 dark:text-blue-400">
                    epoll / kqueue / IOCP
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Provides a single cross-platform API for non-blocking network sockets. The operating system kernel monitors thousands of connections and notifies libuv when packets arrive.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    3. Worker Thread Pool
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-purple-600 dark:text-purple-400">
                    UV_THREADPOOL_SIZE (Default: 4)
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A background pool of C++ worker threads used to offload synchronous OS syscalls that cannot be executed non-blockingly (file I/O, DNS lookups, crypto hashing, zlib compression).
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    4. Handles &amp; Requests System
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-amber-600 dark:text-amber-400">
                    uv_handle_t &amp; uv_req_t
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Handles</strong> represent long-lived active resources (TCP server, active timer) that keep the process alive. <strong>Requests</strong> represent short-lived operations (writing a buffer, resolving a file read).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE TWO CONCURRENCY MECHANISMS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The Two Concurrency Paths: Kernel vs. Thread Pool</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Every asynchronous call in Node.js branches into one of two completely distinct execution paths inside libuv:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Path A */}
            <div className="p-6 rounded-3xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-base">
                <Radio className="w-5 h-5" />
                <span>Path A: OS Kernel Demultiplexing</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                0 Worker Threads Used
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The single main thread registers socket file descriptors directly with the OS kernel. The OS kernel notifies the event loop when data arrives:
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                <li>Incoming HTTP / HTTPS requests</li>
                <li>WebSocket and TCP sockets (<code className="font-mono">node:net</code>)</li>
                <li>UDP datagram sockets (<code className="font-mono">node:dgram</code>)</li>
                <li>Operating system signal listeners (<code className="font-mono">SIGINT</code>, <code className="font-mono">SIGTERM</code>)</li>
                <li>Child process streams (<code className="font-mono">node:child_process</code>)</li>
              </ul>
            </div>

            {/* Path B */}
            <div className="p-6 rounded-3xl border border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-400 font-bold text-base">
                <Split className="w-5 h-5" />
                <span>Path B: Worker Thread Pool Offloading</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                Uses 1 of 4 Libuv Threads
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Blocking synchronous C syscalls are shipped to background C++ threads. When the thread finishes, it posts a callback to the event loop:
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                <li>All File System operations (<code className="font-mono">fs.readFile</code>, <code className="font-mono">fs.writeFile</code>)</li>
                <li>DNS lookups using system libc (<code className="font-mono">dns.lookup</code>)</li>
                <li>Heavy crypto algorithms (<code className="font-mono">crypto.pbkdf2</code>, <code className="font-mono">crypto.scrypt</code>)</li>
                <li>Data compression &amp; decompression (<code className="font-mono">zlib</code> gzip, brotli)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE 6 EVENT LOOP PHASES AT A GLANCE */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The 6 Event Loop Phases (Execution Sequence)</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            libuv continuously ticks through 6 sequential phases. Between <strong>every single phase</strong>, Node.js immediately drains the microtask queue (<code className="font-mono font-bold">process.nextTick</code> and <code className="font-mono font-bold">Promise</code> microtasks):
          </p>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3.5 px-4">Phase #</th>
                  <th className="py-3.5 px-4">Phase Name</th>
                  <th className="py-3.5 px-4">What Runs Here</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {[
                  {
                    num: '1',
                    name: 'Timers',
                    desc: 'Executes callbacks scheduled by setTimeout() and setInterval() whose threshold has elapsed.',
                  },
                  {
                    num: '2',
                    name: 'Pending Callbacks',
                    desc: 'Executes I/O callbacks deferred from the previous loop iteration (e.g. TCP ECONNREFUSED errors).',
                  },
                  {
                    num: '3',
                    name: 'Idle, Prepare',
                    desc: 'Internal libuv housekeeping phases executed on every loop tick to prepare poll structures.',
                  },
                  {
                    num: '4',
                    name: 'Poll (I/O)',
                    desc: 'Retrieves incoming I/O events from epoll/kqueue (incoming HTTP requests, socket data). Blocks if no timers are pending.',
                  },
                  {
                    num: '5',
                    name: 'Check',
                    desc: 'Executes callbacks scheduled specifically by setImmediate(). Always runs right after the Poll phase.',
                  },
                  {
                    num: '6',
                    name: 'Close Callbacks',
                    desc: 'Executes cleanup and finalization callbacks (e.g. socket.on("close", ...) and handle destructions).',
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                      {row.num}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {row.desc}
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
          <h2 className="text-2xl font-bold tracking-tight">Interactive libuv Code Lab: Observing Event Ordering</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Experience how libuv orchestrates asynchronous phase execution and coordinates microtask queues:
          </p>

          <NodeJsEditor
            title="Concept 6 Code Lab: libuv Phase Execution Order"
            initialCode={`// Trace how libuv orders timers, setImmediate, and microtasks
console.log("1. [Synchronous] Main JavaScript script execution begins");

setTimeout(() => {
  console.log("5. [Libuv Timers Phase] setTimeout() callback fired");
}, 0);

setImmediate(() => {
  console.log("4. [Libuv Check Phase] setImmediate() callback fired");
});

process.nextTick(() => {
  console.log("3. [Microtask Queue] process.nextTick() drained before next phase");
});

console.log("2. [Synchronous] Main JavaScript script execution completes");`}
            presets={[
              {
                label: '1. Phase Ordering Trace',
                code: `// Trace how libuv orders timers, setImmediate, and microtasks\nconsole.log("1. [Synchronous] Main JavaScript script execution begins");\n\nsetTimeout(() => {\n  console.log("5. [Libuv Timers Phase] setTimeout() callback fired");\n}, 0);\n\nsetImmediate(() => {\n  console.log("4. [Libuv Check Phase] setImmediate() callback fired");\n});\n\nprocess.nextTick(() => {\n  console.log("3. [Microtask Queue] process.nextTick() drained before next phase");\n});\n\nconsole.log("2. [Synchronous] Main JavaScript script execution completes");`,
              },
              {
                label: '2. Inspect libuv & OS Subsystem',
                code: `console.log("=== Node.js & libuv Subsystem Telemetry ===");\nconsole.log("libuv Version     :", process.versions.uv);\nconsole.log("Node Version      :", process.version);\nconsole.log("Platform          :", process.platform);\nconsole.log("CPU Architecture  :", process.arch);\n\nconst multiplexer =\n  process.platform === "linux"\n    ? "epoll (Linux)"\n    : process.platform === "darwin"\n    ? "kqueue (macOS/BSD)"\n    : process.platform === "win32"\n    ? "IOCP (Windows)"\n    : "Event Ports";\n\nconsole.log("Kernel Multiplexer:", multiplexer);`,
              },
              {
                label: '3. Timer Unref Demonstration',
                code: `// Notice how timer.unref() allows libuv to exit when only this timer remains\nconsole.log("Starting script with unref timer...");\n\nconst backgroundTimer = setTimeout(() => {\n  console.log("This will never fire if main script finishes first!");\n}, 5000);\n\n// Decrement libuv active handle counter\nbackgroundTimer.unref();\n\nconsole.log("Main script finished. Process can terminate without waiting 5000ms!");`,
              },
            ]}
          />
        </div>
      </section>

      {/* SECTION 6: TWO CRITICAL PRODUCTION LIBUV TRAPS */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            6
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Two Critical Production libuv Traps</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Because libuv handles both event polling and the C++ worker thread pool, misconfiguring it leads to hidden system bottlenecks:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Trap #1: The 4-Thread Pool Saturation Wall</span>
              </div>
              <p className="text-sm text-rose-950 dark:text-rose-200 leading-relaxed">
                By default, libuv spawns only <strong>4 worker threads</strong>. If your server receives 4 simultaneous heavy password hashing requests (<code className="font-mono">crypto.pbkdf2</code>) or large file reads, all 4 threads become busy. Any subsequent file read or DNS lookup hangs in an invisible queue!
              </p>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900 text-sm font-mono text-rose-900 dark:text-rose-300">
                Remedy: Scale via <code className="font-bold">UV_THREADPOOL_SIZE=16 node server.js</code> or use worker_threads.
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Trap #2: Synchronous DNS Lookup Blocking (dns.lookup)</span>
              </div>
              <p className="text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
                By default, <code className="font-mono">http.request(&apos;https://api.stripe.com&apos;)</code> uses <code className="font-mono">dns.lookup()</code>, which calls the OS <code className="font-mono">getaddrinfo()</code> C syscall inside the Libuv thread pool. Under high outbound traffic, DNS lookups alone can choke your entire thread pool!
              </p>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900 text-sm font-mono text-amber-900 dark:text-amber-300">
                Remedy: Use <code className="font-bold">dns.promises.resolve*()</code> (c-ares non-blocking network socket lookup) for massive scale.
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
          Verify your architectural comprehension of libuv kernel multiplexing, thread pool offloading, and event loop phases before advancing to Concept 7.
        </p>

        {/* QUESTION 1 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 1: Why was libuv created as a separate C library for Node.js?
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
              { id: 'A', text: 'To compile JavaScript syntax into C++ source code.' },
              {
                id: 'B',
                text: 'To provide a unified cross-platform abstraction over different OS kernel notification systems (epoll, kqueue, IOCP) and provide a background thread pool for blocking syscalls.',
              },
              { id: 'C', text: 'To render HTML and CSS layouts inside the terminal.' },
              { id: 'D', text: 'To replace the Linux operating system kernel entirely.' },
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
                  <strong>Correct!</strong> libuv unifies the completely disparate I/O APIs of Linux (<code className="font-mono">epoll</code>), macOS (<code className="font-mono">kqueue</code>), and Windows (<code className="font-mono">IOCP</code>) into a single standard event loop and provides a background C++ thread pool.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option {q1} is incorrect. libuv was built specifically to bridge operating system kernel differences (epoll, kqueue, IOCP) and manage asynchronous event loop execution.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 2 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 2: Which of the following operations uses OS kernel multiplexing WITHOUT touching the Libuv worker thread pool?
            </h3>
            {q2 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q2 === 'C'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q2 === 'C' ? 'Correct' : 'Needs Review'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {[
              { id: 'A', text: 'Reading a 500 MB file via fs.readFile().' },
              { id: 'B', text: 'Hashing a password with crypto.pbkdf2().' },
              {
                id: 'C',
                text: 'Accepting incoming HTTP network connections on a listening TCP server socket.',
              },
              { id: 'D', text: 'Decompressing a gzip payload with zlib.gunzip().' },
            ].map((option) => {
              const isSelected = q2 === option.id;
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
                q2 === 'C'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q2 === 'C' ? (
                <p>
                  <strong>Spot on!</strong> Network sockets are non-blocking kernel abstractions. The single main thread registers the socket with <code className="font-mono">epoll</code>/<code className="font-mono">kqueue</code>. <em>Zero worker threads from the thread pool are used</em>. Conversely, <code className="font-mono">fs</code>, <code className="font-mono">crypto</code>, and <code className="font-mono">zlib</code> are all offloaded to the 4 worker threads.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Network sockets are handled non-blockingly by the kernel. File I/O, crypto, and zlib all rely on the Libuv thread pool.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 3 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 3: What is the default number of worker threads in libuv&apos;s thread pool?
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
              { id: 'A', text: '1 thread' },
              { id: 'B', text: '4 threads' },
              { id: 'C', text: '16 threads' },
              { id: 'D', text: 'Equal to the number of CPU cores automatically' },
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
                q3 === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q3 === 'B' ? (
                <p>
                  <strong>Correct!</strong> By default, libuv spawns exactly <strong>4 threads</strong> regardless of how many CPU cores exist on the host machine. You can increase this up to 1024 or 128 by setting <code className="font-mono font-bold">UV_THREADPOOL_SIZE</code> before starting the Node process.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> The default is 4 threads. It does not automatically scale with CPU cores. You must explicitly configure <code className="font-mono">UV_THREADPOOL_SIZE</code>.
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
                Question 4: Why does libuv use kernel multiplexing for network sockets, but uses a thread pool for disk file I/O?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on operating system kernel architectures, readiness notifications, and disk device drivers, then click below to reveal the faculty model answer.
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
                  <strong>1. Readiness Notification vs. Always-Ready Disks:</strong> Network sockets are inherently asynchronous; they sit idle waiting for network packets to arrive over wires. The OS kernel multiplexers (<code className="font-mono font-bold">epoll</code>/<code className="font-mono font-bold">kqueue</code>) easily monitor these file descriptors and wake up the main thread only when data arrives. Conversely, the OS treats disk file descriptors as &ldquo;always ready&rdquo;, meaning <code className="font-mono">epoll</code> on regular files does not block asynchronously!
                </p>
                <p>
                  <strong>2. Synchronous Disk Drivers:</strong> Disk device drivers and file systems (ext4, APFS, NTFS) traditionally execute file reads and directory walks synchronously on the calling thread. If the main JavaScript thread performed a synchronous disk read, the event loop would freeze entirely during mechanical disk seek times or network mount delays.
                </p>
                <p>
                  <strong>3. The Thread Pool Bridge:</strong> By offloading blocking synchronous <code className="font-mono">read()</code> and <code className="font-mono">write()</code> syscalls to a dedicated C++ thread pool, libuv simulates true non-blocking asynchronous file I/O for JavaScript without freezing the main thread.
                </p>
                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Engineering Summary: Network Sockets = OS Kernel epoll/kqueue (0 Threads) &bull; Disk Files = Libuv Thread Pool (UV_THREADPOOL_SIZE)
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
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 7 using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}
