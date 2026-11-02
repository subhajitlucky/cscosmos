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
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept1Lesson() {
  // Interactive quiz state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [q4Revealed, setQ4Revealed] = useState<boolean>(false);
  const [selectedEnv, setSelectedEnv] = useState<'browser' | 'node'>('node');

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
            Node.js &mdash; Lesson 01/280
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Level: Beginner
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Category: Node.js Fundamentals
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold">
            Estimated learning time: 20&ndash;30 minutes
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Concept 1: Introduction to Node.js
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          The foundational paradigm shift: freeing JavaScript from the sandbox of web browsers to build high-throughput backend runtimes, servers, CLI utilities, and distributed microservices.
        </p>
      </div>

      {/* SECTION 1 */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">First, understand the problem</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>Imagine you know JavaScript.</p>
          <p>You can write:</p>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-emerald-300 p-4 font-mono text-sm shadow-inner">
            <code>console.log(&quot;Hello World&quot;);</code>
          </div>

          <p className="font-semibold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
            Where does this JavaScript code run?
          </p>

          <p>
            Traditionally, JavaScript runs inside <strong>browsers</strong>. Every modern browser bundles a dedicated JavaScript engine:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {[
              { name: 'Google Chrome', engine: 'V8 Engine' },
              { name: 'Mozilla Firefox', engine: 'SpiderMonkey' },
              { name: 'Apple Safari', engine: 'JavaScriptCore' },
              { name: 'Microsoft Edge', engine: 'V8 Engine' },
            ].map((b) => (
              <div
                key={b.name}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {b.name}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {b.engine}
                </div>
              </div>
            ))}
          </div>

          <p>JavaScript allows websites to respond to user interactions.</p>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              But what if you want to use JavaScript to:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300 text-sm sm:text-base">
              <li>Create a server?</li>
              <li>Read files from your computer?</li>
              <li>Access the operating system?</li>
              <li>Build command-line applications?</li>
              <li>Handle network connections?</li>
              <li>Build backend applications?</li>
            </ul>
          </div>

          <p>
            JavaScript in the browser doesn&apos;t directly provide all these capabilities due to security isolation and sandboxing restrictions.
          </p>

          <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
            This is where Node.js comes in.
          </p>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">What is Node.js?</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <blockquote className="p-5 rounded-2xl border-l-4 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-slate-900 dark:text-slate-100 text-base sm:text-lg font-medium">
            &ldquo;Node.js is an open-source, cross-platform JavaScript runtime environment that allows you to execute JavaScript outside a web browser.&rdquo;
          </blockquote>

          <p>Let&apos;s break that definition down term by term:</p>

          {/* Definition Breakdown Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3 px-4 w-1/3">Term</th>
                  <th className="py-3 px-4">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-emerald-300">
                    Open-source
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    Its source code is publicly available and governed by the OpenJS Foundation.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-emerald-300">
                    Cross-platform
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    Works seamlessly on Windows, Linux, and macOS.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-emerald-300">
                    JavaScript
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    The ECMAScript programming language it parses, optimizes, and executes.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-emerald-300">
                    Runtime
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    The surrounding software layer and host environment that executes your code.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-emerald-300">
                    Outside browser
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    You can execute JavaScript independently of any browser engine or graphical window.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm font-semibold flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span>
              <strong>Remember:</strong> Node.js is <em>NOT</em> a programming language. It is <em>NOT</em> a framework. It is a <strong>runtime environment</strong>.
            </span>
          </div>

          {/* Interactive Environment Comparator Widget */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Interactive Environment Anatomy: Browser Sandbox vs. Node.js Runtime
                </h3>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono">
                <button
                  onClick={() => setSelectedEnv('browser')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    selectedEnv === 'browser'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Web Browser Sandbox
                </button>
                <button
                  onClick={() => setSelectedEnv('node')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    selectedEnv === 'node'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Node.js OS Runtime
                </button>
              </div>
            </div>

            {selectedEnv === 'browser' ? (
              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-1.5">
                  <span className="font-bold text-blue-700 dark:text-blue-300">Global Root Object</span>
                  <div className="text-slate-700 dark:text-slate-300">window, document, navigator, location</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-1.5">
                  <span className="font-bold text-blue-700 dark:text-blue-300">Filesystem Access</span>
                  <div className="text-slate-700 dark:text-slate-300">Strictly prohibited (sandbox isolation)</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-1.5">
                  <span className="font-bold text-blue-700 dark:text-blue-300">Network Layer</span>
                  <div className="text-slate-700 dark:text-slate-300">fetch(), XMLHttpRequest, WebSockets (CORS enforced)</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-1.5">
                  <span className="font-bold text-blue-700 dark:text-blue-300">Process &amp; OS Primitives</span>
                  <div className="text-slate-700 dark:text-slate-300">None &bull; Isolated in renderer tab memory</div>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Global Root Object</span>
                  <div className="text-slate-700 dark:text-slate-300">globalThis, process, Buffer, setImmediate</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Filesystem Access</span>
                  <div className="text-slate-700 dark:text-slate-300">Full POSIX disk access via node:fs / node:fs/promises</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Network Layer</span>
                  <div className="text-slate-700 dark:text-slate-300">Arbitrary TCP/UDP sockets, node:http servers (No CORS)</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Process &amp; OS Primitives</span>
                  <div className="text-slate-700 dark:text-slate-300">process.env, process.exit(), node:os, node:child_process</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">How does Node.js work?</h2>
        </div>

        <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When you run JavaScript with Node.js, the runtime is powered by two foundational, complementary systems working in tandem:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pillar A: V8 Engine */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 space-y-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                        A. V8 JavaScript Engine
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                        Execution Core &bull; Written in C++
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  V8 is Google&apos;s open-source, high-performance JavaScript and WebAssembly engine (the same engine powering Google Chrome).
                </p>

                <div className="space-y-2 pt-1">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    Core Responsibilities:
                  </span>

                  <div className="space-y-2">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100">AST Parsing:</strong> Parses raw JavaScript source text into an Abstract Syntax Tree.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100">Ignition Interpreter:</strong> Compiles the syntax tree directly into compact bytecode.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100">TurboFan JIT Compiler:</strong> Optimizes frequent &ldquo;hot&rdquo; code paths directly into machine code.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100">Garbage Collector:</strong> Automates memory allocation and scavenges unreachable heap objects.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar B: Node.js Runtime APIs */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 space-y-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                        B. Node.js Runtime APIs
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
                        Host Bridge &bull; C++ Bindings &amp; OS Primitives
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Node.js provides host capabilities that JavaScript engines cannot access inside sandboxed web browsers.
                </p>

                <div className="space-y-2 pt-1">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    System Capabilities Provided:
                  </span>

                  <div className="space-y-2">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100">File System Access:</strong> Read, write, and stream files on disk via <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">node:fs</code>.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100">Network Sockets:</strong> Create HTTP, HTTPS, TCP, and UDP servers with <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">node:http</code> &amp; <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">node:net</code>.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100">Cryptography:</strong> Encryption, decryption, hashes, and HMAC signatures with <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">node:crypto</code>.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100">Concurrency:</strong> Spawn OS child processes and thread workers with <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">worker_threads</code>.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Example & Architectural Breakdown */}
          <div className="space-y-3 pt-2">
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              Example: How V8 and Node.js work together in code:
            </p>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-emerald-300 p-4 font-mono text-sm overflow-x-auto shadow-inner">
              <pre>{`const fs = require("node:fs");

fs.writeFileSync("hello.txt", "Hello from Node.js!");`}</pre>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  1. require(&quot;node:fs&quot;)
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Loads the Node.js built-in C++ filesystem binding into the JavaScript runtime.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  2. fs.writeFileSync(...)
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Issues an OS kernel system call (<code className="font-mono">open</code> / <code className="font-mono">write</code>) to persist the file to disk.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  3. Unified Partnership
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  V8 executes the JavaScript syntax; Node.js performs the low-level operating system work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Browser JavaScript vs Node.js</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>Let&apos;s compare the two environments side-by-side:</p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4">Browser</th>
                  <th className="py-3 px-4">Node.js</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {[
                  {
                    feat: 'JavaScript engine',
                    browser: 'V8 (Chrome), SpiderMonkey (Firefox), JSC (Safari)',
                    node: 'V8 (Google Open-Source)',
                  },
                  {
                    feat: 'DOM access (document, HTML)',
                    browser: 'Yes (window.document, DOM Tree)',
                    node: 'No built-in DOM (headless server)',
                  },
                  {
                    feat: 'Window object (globalThis)',
                    browser: 'Yes (window, document, history)',
                    node: 'No (global, globalThis, process)',
                  },
                  {
                    feat: 'File system access',
                    browser: 'Restricted browser sandboxed APIs',
                    node: 'Full OS access via node:fs / node:fs/promises',
                  },
                  {
                    feat: 'HTTP server creation',
                    browser: 'Not directly (acts as client via fetch)',
                    node: 'Yes (node:http, node:https, Express, Fastify)',
                  },
                  {
                    feat: 'Operating system APIs',
                    browser: 'Strictly restricted sandbox',
                    node: 'Yes (node:os, node:child_process, process)',
                  },
                  {
                    feat: 'JavaScript execution',
                    browser: 'Yes (ECMAScript specification)',
                    node: 'Yes (ECMAScript specification)',
                  },
                  {
                    feat: 'Network communication',
                    browser: 'Yes (WebSocket, fetch, XMLHttpRequest)',
                    node: 'Yes (Raw TCP sockets, UDP, HTTP/2, HTTP/3)',
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {row.feat}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {row.browser}
                    </td>
                    <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">
                      {row.node}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 italic leading-relaxed">
            <strong>An important detail:</strong> Modern browsers and Node.js share many JavaScript and Web APIs (such as <code className="font-mono">fetch</code>, <code className="font-mono">URL</code>, <code className="font-mono">EventTarget</code>, and <code className="font-mono">TextEncoder</code>), but their runtime host environments, security models, and underlying system privileges are completely different.
          </p>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE IN-BROWSER JS EDITOR */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            5
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Your first Node.js program</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            In a traditional local environment, you create a file named <code className="font-mono font-bold text-slate-900 dark:text-emerald-300">hello.js</code>, write your code, and run it via terminal:
          </p>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-emerald-300 p-4 font-mono text-sm">
            <div className="text-slate-400 text-xs pb-2 border-b border-slate-800 mb-2">
              // hello.js
            </div>
            <pre>{`console.log("Hello, Node.js!");

const name = "Subhajit";

console.log(\`Welcome, \${name}\`);`}</pre>
          </div>

          <p>Open your terminal and execute:</p>

          <div className="rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 font-mono text-sm text-slate-800 dark:text-emerald-400 flex items-center gap-2">
            <span className="text-slate-400 font-bold">$</span>
            <code>node hello.js</code>
          </div>

          <p>Output:</p>

          <div className="rounded-xl bg-slate-950 text-slate-100 p-4 font-mono text-sm border border-slate-800">
            <pre>{`Hello, Node.js!
Welcome, Subhajit`}</pre>
          </div>

          <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-base">
            Congratulations! You&apos;ve executed JavaScript outside a browser.
          </p>

          {/* Embedded Live Runner */}
          <div className="pt-2">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 font-mono">
                <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Live In-Browser Code Runner &bull; Try It Yourself!
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
                Runs instantly &bull; No terminal setup needed
              </span>
            </div>

            <NodeJsEditor
              title="Concept 1 Code Lab: hello.js"
              initialCode={`console.log("Hello, Node.js!");\n\nconst name = "Subhajit";\n\nconsole.log(\`Welcome, \${name}\`);`}
              presets={[
                {
                  label: '1. Hello Node.js',
                  code: `console.log("Hello, Node.js!");\n\nconst name = "Subhajit";\n\nconsole.log(\`Welcome, \${name}\`);`,
                },
                {
                  label: '2. Inspect process object',
                  code: `console.log("=== Node.js Process Inspection ===");\nconsole.log("Node version:", process.version);\nconsole.log("Platform:", process.platform);\nconsole.log("Architecture:", process.arch);\nconsole.log("Process ID (PID):", process.pid);\nconsole.log("Uptime:", process.uptime(), "seconds");`,
                },
                {
                  label: '3. Async Execution Order',
                  code: `console.log("1. Synchronous: Start of script");\n\nsetTimeout(() => {\n  console.log("3. Asynchronous: Timer callback executed by Node.js runtime");\n}, 250);\n\nconsole.log("2. Synchronous: End of script");`,
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* SECTION 6 */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            6
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Where is Node.js used?</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>Some common applications include:</p>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {[
              {
                num: '01',
                title: 'Backend Servers',
                desc: 'Handling millions of concurrent HTTP/HTTPS requests with event-driven non-blocking I/O.',
              },
              {
                num: '02',
                title: 'REST APIs & GraphQL Services',
                desc: 'Microservices architecture with Express, NestJS, and Fastify powering mobile and web apps.',
              },
              {
                num: '03',
                title: 'Real-time Applications',
                desc: 'Collaborative document editors, chat engines, and multiplayer backends via WebSockets.',
              },
              {
                num: '04',
                title: 'Command-line Tools (CLI)',
                desc: 'Interactive developer tools, deployment utilities, and terminal dashboards.',
              },
              {
                num: '05',
                title: 'Automation & DevOps Scripts',
                desc: 'CI/CD pipeline scripts, database migration runners, and server maintenance bots.',
              },
              {
                num: '06',
                title: 'Developer Tools',
                desc: 'Package managers (npm, pnpm, yarn), linters (ESLint), and code formatters (Prettier).',
              },
              {
                num: '07',
                title: 'Build Tools & Bundlers',
                desc: 'Vite, Webpack, Rollup, Turbopack, and Next.js compiler toolchains.',
              },
              {
                num: '08',
                title: 'AI Application Infrastructure',
                desc: 'LangChain, Vercel AI SDK, embeddings processing, and orchestrating LLM tool loops.',
              },
              {
                num: '09',
                title: 'MCP Servers (Model Context Protocol)',
                desc: 'Standardized context and tool providers bridging LLMs with local files and enterprise databases.',
              },
              {
                num: '10',
                title: 'Streaming Applications',
                desc: 'Video/audio transcoding, real-time log ingestion, and high-volume data stream transformations.',
              },
            ].map((app) => (
              <div
                key={app.num}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3.5 shadow-xs hover:border-emerald-500/50 transition"
              >
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-lg shrink-0 mt-0.5">
                  {app.num}
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    {app.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {app.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="pt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            For example, <span className="font-semibold text-slate-900 dark:text-slate-200">npm</span>,{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-200">Vite</span>, and many modern developer ecosystems run directly on top of Node.js.
          </p>
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

          {/* Progress Tracker Pill */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-mono font-bold">
            <span className="text-slate-600 dark:text-slate-400">Progress:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {totalCompleted} / 4 Completed
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Before moving to Concept 2, I want to check whether you&apos;ve understood today&apos;s lesson. Answer the questions below to test your retention and architectural comprehension.
        </p>

        {/* QUESTION 1 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 1: What exactly is Node.js?
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

          <div className="space-y-2.5">
            {[
              { id: 'A', text: 'A programming language based on JavaScript.' },
              {
                id: 'B',
                text: 'A JavaScript runtime environment that executes JavaScript outside browsers.',
              },
              { id: 'C', text: 'A frontend framework used to build websites.' },
              { id: 'D', text: 'A database management system.' },
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
                  <span className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs sm:text-sm shrink-0">
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
              className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed ${
                q1 === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q1 === 'B' ? (
                <p>
                  <strong>Excellent!</strong> Node.js is neither a language nor a framework. It is an open-source runtime environment built on Chrome&apos;s V8 engine that allows JavaScript to run directly on server operating systems.
                </p>
              ) : (
                <p>
                  <strong>Common misconception:</strong> Option {q1} is incorrect. JavaScript is the programming language (ECMAScript specification); Node.js is the host runtime environment that executes that language outside web browsers.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 2 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 2: Which technology is responsible for executing JavaScript in Node.js?
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

          <div className="space-y-2.5">
            {[
              { id: 'A', text: 'Express.js' },
              { id: 'B', text: 'libuv' },
              { id: 'C', text: 'V8' },
              { id: 'D', text: 'npm' },
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
                  <span className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-xs sm:text-sm shrink-0">
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
              className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed ${
                q2 === 'C'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q2 === 'C' ? (
                <p>
                  <strong>Spot on!</strong> Google V8 parses, compiles to machine code, and executes your JavaScript. (Note: <em>libuv</em> is responsible for asynchronous event-driven I/O and thread pools, while <em>Express.js</em> is a web framework).
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Google&apos;s <strong>V8</strong> engine executes JavaScript. <em>libuv</em> handles asynchronous I/O and the event loop, <em>Express.js</em> is an HTTP library, and <em>npm</em> is the package manager.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 3 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 3: Can Node.js execute JavaScript without opening a browser?
            </h3>
            {q3 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q3 === 'A'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q3 === 'A' ? 'Correct' : 'Needs Review'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'A', text: 'A. Yes' },
              { id: 'B', text: 'B. No' },
            ].map((option) => {
              const isSelected = q3 === option.id.charAt(0);
              const isCorrect = option.id.charAt(0) === 'A';
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
                  onClick={() => setQ3(option.id.charAt(0))}
                  className={`p-4 rounded-2xl border text-center text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition ${btnStyle}`}
                >
                  <span>{option.text}</span>
                  {isSelected && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {q3 && (
            <div
              className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed ${
                q3 === 'A'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q3 === 'A' ? (
                <p>
                  <strong>Yes, absolutely!</strong> That is the foundational essence of Node.js. It executes standalone on terminal CLIs, headless server clusters, container instances, and embedded hardware without any graphical browser.
                </p>
              ) : (
                <p>
                  <strong>Incorrect:</strong> Node.js has zero dependency on web browsers. You run your script by simply typing <code className="font-mono">node script.js</code> in any terminal shell.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 4: EXPLAIN IN YOUR OWN WORDS */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                Question 4: What is the primary difference between JavaScript and Node.js?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on your answer, then click below to reveal the faculty model answer.
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
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-3 text-sm sm:text-base text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs sm:text-sm">
                <Sparkles className="w-4 h-4" /> Professor&apos;s Engineering Model Answer
              </div>

              <div className="space-y-2.5 leading-relaxed">
                <p>
                  <strong>1. JavaScript is the programming language specification (ECMAScript).</strong> It defines the syntax, keywords, operators, primitives, and standard object semantics (functions, prototypes, arrays, promises).
                </p>
                <p>
                  <strong>2. Node.js is the host runtime environment.</strong> It bundles Google&apos;s V8 engine with low-level C++ system libraries (libuv, OpenSSL, zlib, c-ares) to provide direct operating system access, file I/O, socket networking, and event loop concurrency.
                </p>
                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Formula: Node.js = V8 Engine + libuv (I/O &amp; Event Loop) + C++ System Bindings + Core JS APIs
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* LEARNING RULE BANNER & NEXT STEP NAVIGATION */}
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
                className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5"
              >
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 2 using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}