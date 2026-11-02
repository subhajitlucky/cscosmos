'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Terminal,
  AlertTriangle,
  Server,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept2Lesson() {
  // Assessment state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);

  const completedCount = [q1, q2, q3].filter(Boolean).length;

  return (
    <div className="space-y-12 w-full">
      {/* 1. Header */}
      <header className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
          <span>Module 1: Node.js Fundamentals</span>
          <span>&bull;</span>
          <span>Concept 02 of 280</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Node.js Architecture
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Deconstructing the internal engine: how Google V8, libuv, native C++ bindings, and OS kernel multiplexers coordinate to run high-throughput applications on a single JavaScript main thread.
        </p>
      </header>

      {/* 2. Core Idea: The 4-Tier Internal Engine */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          The Core Idea: The 4-Tier Internal Engine
        </h2>

        <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base max-w-4xl">
          <p>
            Before Node.js, classic server software (like Apache or Tomcat) followed a <strong>thread-per-request model</strong>: whenever a client connected, the operating system allocated a dedicated thread. Handling 10,000 concurrent requests required 20 GB of RAM just for idle thread stacks, and CPU cores wasted massive clock cycles on context switching (the famous <em>C10K Problem</em>).
          </p>
          <p>
            Node.js revolutionized this by decoupling JavaScript execution from operating system I/O. It organizes responsibilities into a <strong>4-tier architecture</strong>: your JavaScript code runs sequentially on a single main thread, while low-level disk, network, and cryptographic tasks are offloaded to OS kernel multiplexers (<code className="font-mono text-xs">epoll</code>, <code className="font-mono text-xs">kqueue</code>, <code className="font-mono text-xs">IOCP</code>) or a background worker pool managed by <strong>libuv</strong>.
          </p>
        </div>

        {/* Minimal Architecture Flowchart */}
        <div className="flex justify-center my-6">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 shadow-sm">
            <div className="text-slate-400 text-xs mb-4 pb-2.5 border-b border-slate-800 font-mono flex items-center justify-between">
              <span className="font-semibold text-slate-300">Internal Architecture</span>
              <span className="text-slate-500">4-Tier System Stack</span>
            </div>
            <div className="flex justify-center overflow-x-auto py-2">
              <pre className="text-emerald-400 font-mono text-xs sm:text-sm font-medium leading-relaxed select-none">{`┌────────────────────────────────────────────────────────┐
│           Tier 1: JavaScript Application & APIs        │
│      (Your Code, node:fs, node:http, node:crypto)      │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│   Tier 2A: Google V8      │ │ Tier 2B: Node-API & C++   │
│  (AST, JIT Machine Code)  │ │  (System Call Bridges)    │
└─────────────┬─────────────┘ └─────────────┬─────────────┘
              │                             │
              └─────────────┬───────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│           Tier 3: libuv Event Loop & Thread Pool       │
│       (Event Demultiplexer + 4 Background Threads)     │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│          Tier 4: Operating System Kernel Primitives    │
│       (epoll: Linux, kqueue: macOS, IOCP: Windows)     │
└────────────────────────────────────────────────────────┘`}</pre>
            </div>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
          Key architectural insight: JavaScript logic executes on a single main thread, while I/O is offloaded non-blockingly to libuv and the OS kernel.
        </p>
      </section>

      {/* 3. Two Essential Examples */}
      <section className="space-y-5">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Two Essential Examples
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Example 1 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Example 1
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  The Single Main Thread &amp; Process Footprint
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Every Node.js instance boots with a single main thread running the event loop. The runtime baseline memory footprint is orders of magnitude smaller than multi-threaded servers.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto space-y-1">
                <div className="text-slate-500">// thread-info.mjs</div>
                <div><span className="text-emerald-400">import</span> &#123; isMainThread, threadId &#125; <span className="text-emerald-400">from</span> <span className="text-amber-300">&apos;node:worker_threads&apos;</span>;</div>
                <div className="pt-2 text-slate-500">// 1. Inspect main execution thread</div>
                <div><span className="text-cyan-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-amber-300">&apos;Is Main Thread? :&apos;</span>, isMainThread);</div>
                <div><span className="text-cyan-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-amber-300">&apos;Thread ID       :&apos;</span>, threadId); <span className="text-slate-500">// 0 = main thread</span></div>
                <div className="pt-2 text-slate-500">// 2. Check process heap allocation</div>
                <div><span className="text-emerald-400">const</span> mem = process.<span className="text-blue-400">memoryUsage</span>();</div>
                <div><span className="text-cyan-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-amber-300">`Heap Used       : &#36;&#123;(mem.heapUsed / 1e6).toFixed(1)&#125; MB`</span>);</div>
              </div>
            </div>

            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside pt-2">
              <li><code className="font-mono">threadId === 0</code> confirms all user JavaScript runs on the single primary thread.</li>
              <li>Baseline heap is typically under 30 MB, enabling high density container deployments.</li>
            </ul>
          </div>

          {/* Example 2 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Example 2
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Libuv Offloading to Background Thread Pool
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Expensive cryptographic and filesystem operations are not executed on the main thread. Libuv routes them to a background worker pool (<code className="font-mono text-xs">UV_THREADPOOL_SIZE</code>).
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto space-y-1">
                <div className="text-slate-500">// crypto-pool.mjs</div>
                <div><span className="text-emerald-400">import</span> crypto <span className="text-emerald-400">from</span> <span className="text-amber-300">&apos;node:crypto&apos;</span>;</div>
                <div className="pt-2"><span className="text-cyan-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-amber-300">&apos;1. Dispatching hash to libuv pool...&apos;</span>);</div>
                <div className="pt-1">crypto.<span className="text-blue-400">pbkdf2</span>(<span className="text-amber-300">&apos;pass&apos;</span>, <span className="text-amber-300">&apos;salt&apos;</span>, <span className="text-purple-400">100000</span>, <span className="text-purple-400">64</span>, <span className="text-amber-300">&apos;sha512&apos;</span>, () =&gt; &#123;</div>
                <div className="pl-4"><span className="text-cyan-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-amber-300">&apos;3. Hash finished on libuv worker thread&apos;</span>);</div>
                <div>&#125;);</div>
                <div className="pt-1"><span className="text-cyan-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-amber-300">&apos;2. Main thread is free and responsive!&apos;</span>);</div>
              </div>
            </div>

            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside pt-2">
              <li>Notice log #2 executes before log #3: the main thread does not block waiting for the hash.</li>
              <li>Libuv handles the computation on a background worker thread, then queues the completion callback.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Model Comparison Table */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Traditional Multi-Threaded vs. Node.js Event-Driven Architecture
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-1/4">Architectural Metric</th>
                <th className="py-3 px-4 w-3/8">Multi-Threaded (Apache / Tomcat)</th>
                <th className="py-3 px-4 w-3/8">Node.js (V8 + libuv)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">Concurrency Model</td>
                <td className="py-3 px-4">1 OS Thread per client connection</td>
                <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">1 Event Loop Thread + Asynchronous I/O Multiplexing</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">RAM per 10k Connections</td>
                <td className="py-3 px-4">~10 GB – 20 GB (1–2 MB stack memory per thread)</td>
                <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">~30 MB – 50 MB total process heap</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">CPU Context Switching</td>
                <td className="py-3 px-4">High context switching overhead between threads</td>
                <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">Near-zero context switching on single main thread</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">I/O Handling</td>
                <td className="py-3 px-4">Thread blocks and sleeps during I/O wait</td>
                <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">Non-blocking notification via epoll / kqueue / IOCP</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">Ideal Workload</td>
                <td className="py-3 px-4">Heavy synchronous CPU number-crunching</td>
                <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">High-throughput I/O, REST APIs, WebSockets, Streaming</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Live Code Lab */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Try It: Inspecting Internal Architecture
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Execute the presets below to observe the single-threaded execution timing and inspect runtime dependency versions.
          </p>
        </div>

        <NodeJsEditor
          title="Concept 2: Architecture Lab"
          initialCode={`// Preset 1: Single-Threaded Non-Blocking Execution Order
console.log("1. [Main Thread] Script execution begins synchronously");

// Asynchronous timer callback registered with libuv
setTimeout(() => {
  console.log("4. [libuv Timer] Callback executed by event loop after delay");
}, 150);

// Promise microtask queued
Promise.resolve().then(() => {
  console.log("3. [Microtask] Promise microtask ran before next event loop tick");
});

console.log("2. [Main Thread] Synchronous script execution completed");`}
          presets={[
            {
              label: '1. Execution Order & Timing',
              code: `// Preset 1: Single-Threaded Non-Blocking Execution Order
console.log("1. [Main Thread] Script execution begins synchronously");

// Asynchronous timer callback registered with libuv
setTimeout(() => {
  console.log("4. [libuv Timer] Callback executed by event loop after delay");
}, 150);

// Promise microtask queued
Promise.resolve().then(() => {
  console.log("3. [Microtask] Promise microtask ran before next event loop tick");
});

console.log("2. [Main Thread] Synchronous script execution completed");`,
            },
            {
              label: '2. Runtime Dependencies & V8 Info',
              code: `// Preset 2: Inspecting Node.js Engine Components
console.log("=== Node.js Engine Architecture ===");
console.log("Node Version :", process.version);
console.log("V8 Engine    :", process.versions.v8);
console.log("libuv Version:", process.versions.uv);
console.log("OpenSSL      :", process.versions.openssl);
console.log("zlib         :", process.versions.zlib);
console.log("Active PID   :", process.pid);
console.log("Platform     :", process.platform, process.arch);`,
            },
          ]}
        />
      </section>

      {/* 6. Key Production Trap */}
      <section className="p-5 rounded-2xl border-l-4 border-amber-500 bg-amber-500/5 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>The Golden Rule: Beware of Libuv Thread Pool Starvation</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          By default, libuv creates a thread pool of only <strong>4 background worker threads</strong> (<code className="font-mono text-xs">UV_THREADPOOL_SIZE=4</code>). If your backend fires 5 simultaneous filesystem reads or cryptographic hashes, the 5th operation must wait in queue until one of the first 4 completes. In high-traffic services dealing with extensive disk or crypto operations, increase this pool via environment variable: <code className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">UV_THREADPOOL_SIZE=16 node server.js</code>.
        </p>
      </section>

      {/* 7. Knowledge Self-Check */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Check Your Understanding
          </h2>
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
            {completedCount}/3 answered
          </span>
        </div>

        {/* Q1 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="font-medium text-sm sm:text-base text-slate-900 dark:text-slate-100">
            1. How does Node.js achieve high concurrency despite running JavaScript on a single thread?
          </div>

          <div className="grid gap-2">
            {[
              { id: 'A', text: 'It creates a new OS thread for every incoming HTTP connection' },
              { id: 'B', text: 'It delegates non-blocking I/O to OS kernel event mechanisms (epoll/kqueue) and a background thread pool via libuv', correct: true },
              { id: 'C', text: 'It compiles all JavaScript into bytecode ahead of deployment' },
              { id: 'D', text: 'It restricts all web traffic to synchronous queuing' },
            ].map((option) => {
              const isSelected = q1 === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setQ1(option.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? option.correct
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium'
                        : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>
                    <strong className="font-mono mr-2">{option.id}.</strong> {option.text}
                  </span>
                  {isSelected && (
                    option.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )
                  )}
                </button>
              );
            })}
          </div>

          {q1 && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-1">
              {q1 === 'B' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Correct. Node.js uses an event-driven non-blocking I/O model powered by libuv, freeing the single JavaScript main thread from waiting on slow network or disk tasks.
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400">
                  Incorrect. Node.js avoids allocating a thread per connection—that was the legacy multi-threaded model that caused the C10K memory exhaustion problem.
                </span>
              )}
            </p>
          )}
        </div>

        {/* Q2 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="font-medium text-sm sm:text-base text-slate-900 dark:text-slate-100">
            2. Which component of Node.js is responsible for executing the JavaScript code?
          </div>

          <div className="grid gap-2">
            {[
              { id: 'A', text: 'libuv' },
              { id: 'B', text: 'Google V8 Engine', correct: true },
              { id: 'C', text: 'OpenSSL' },
              { id: 'D', text: 'zlib' },
            ].map((option) => {
              const isSelected = q2 === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setQ2(option.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? option.correct
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium'
                        : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>
                    <strong className="font-mono mr-2">{option.id}.</strong> {option.text}
                  </span>
                  {isSelected && (
                    option.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )
                  )}
                </button>
              );
            })}
          </div>

          {q2 && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-1">
              {q2 === 'B' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Correct. V8 parses, compiles, and optimizes JavaScript into native machine code, while libuv manages asynchronous I/O and the event loop.
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400">
                  Incorrect. Google V8 compiles and executes JavaScript. libuv handles I/O and the event loop, OpenSSL handles cryptography, and zlib handles compression.
                </span>
              )}
            </p>
          )}
        </div>

        {/* Q3 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="font-medium text-sm sm:text-base text-slate-900 dark:text-slate-100">
            3. What is the default size of the libuv background thread pool?
          </div>

          <div className="grid gap-2">
            {[
              { id: 'A', text: '1 thread' },
              { id: 'B', text: '4 threads', correct: true },
              { id: 'C', text: '16 threads' },
              { id: 'D', text: 'Unlimited threads' },
            ].map((option) => {
              const isSelected = q3 === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setQ3(option.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? option.correct
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium'
                        : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>
                    <strong className="font-mono mr-2">{option.id}.</strong> {option.text}
                  </span>
                  {isSelected && (
                    option.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )
                  )}
                </button>
              );
            })}
          </div>

          {q3 && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-1">
              {q3 === 'B' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Correct. The default is 4 threads (UV_THREADPOOL_SIZE=4). It can be configured up to 1024 threads for I/O heavy workloads.
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400">
                  Incorrect. By default, libuv allocates exactly 4 worker threads for filesystem, DNS lookups, and crypto tasks.
                </span>
              )}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
