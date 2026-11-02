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

export function Concept1Lesson() {
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
          <span>Concept 01 of 280</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Introduction to Node.js
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Node.js is an open-source, cross-platform JavaScript runtime environment built on Google Chrome&apos;s V8 engine that executes JavaScript code outside a web browser.
        </p>
      </header>

      {/* 2. Core Idea: Why Node.js Exists */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          The Core Idea: Escaping the Browser Sandbox
        </h2>

        <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Historically, JavaScript lived exclusively inside web browsers (Chrome, Firefox, Safari). To protect users from malicious websites, browsers enforce a strict <strong>security sandbox</strong>: JavaScript cannot read or write to your local hard drive, inspect hardware specifications, or bind to network ports.
          </p>
          <p>
            In 2009, Ryan Dahl created Node.js by taking Google&apos;s high-performance <strong>V8 JavaScript engine</strong> out of Chrome, wrapping it in C++ bindings, and pairing it with <strong>libuv</strong> (an asynchronous event-driven I/O library). This allowed JavaScript to interact directly with the underlying operating system.
          </p>
        </div>

        {/* Minimal Architecture Flowchart */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs sm:text-sm overflow-x-auto">
          <div className="text-slate-400 text-xs mb-3 pb-2 border-b border-slate-800 font-sans font-medium flex items-center justify-between">
            <span>Runtime Architecture</span>
            <span>C++ &amp; OS Layer</span>
          </div>
          <pre className="text-emerald-400 font-medium">{`┌────────────────────────────────────────────────────────┐
│                   Your JavaScript Code                 │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     Google V8 Engine      │ │   Node.js Core C++ APIs   │
│  (Parses & Compiles JS)   │ │  (node:fs, node:http...)  │
└─────────────┬─────────────┘ └─────────────┬─────────────┘
              │                             │
              └─────────────┬───────────────┘
                            ▼
              ┌───────────────────────────┐
              │           libuv           │
              │ (Event Loop & Thread Pool)│
              └─────────────┬─────────────┘
                            ▼
              ┌───────────────────────────┐
              │     Operating System      │
              │  (Disk, Sockets, Kernel)  │
              └───────────────────────────┘`}</pre>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
          Key distinction: Node.js is <strong>not</strong> a programming language, and it is <strong>not</strong> a framework. It is an execution host (runtime) for JavaScript.
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
                  Operating System &amp; Filesystem Access
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Browser JavaScript cannot touch the file system. In Node.js, built-in modules like <code className="font-mono text-slate-800 dark:text-slate-200">node:os</code> and <code className="font-mono text-slate-800 dark:text-slate-200">node:fs/promises</code> speak directly to the OS kernel.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto space-y-1">
                <div className="text-slate-500">// system-check.mjs</div>
                <div><span className="text-emerald-400">import</span> os <span className="text-emerald-400">from</span> <span className="text-amber-300">&apos;node:os&apos;</span>;</div>
                <div><span className="text-emerald-400">import</span> fs <span className="text-emerald-400">from</span> <span className="text-amber-300">&apos;node:fs/promises&apos;</span>;</div>
                <div className="pt-2 text-slate-500">// 1. Inspect physical hardware</div>
                <div><span className="text-cyan-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-amber-300">`OS: &#36;&#123;os.type()&#125; | Cores: &#36;&#123;os.cpus().length&#125; | Free RAM: &#36;&#123;(os.freemem() / 1e9).toFixed(1)&#125; GB`</span>);</div>
                <div className="pt-2 text-slate-500">// 2. Write and read directly on disk</div>
                <div><span className="text-emerald-400">await</span> fs.<span className="text-blue-400">writeFile</span>(<span className="text-amber-300">&apos;server.log&apos;</span>, <span className="text-amber-300">`Booted at &#36;&#123;new Date().toISOString()&#125;\n`</span>);</div>
                <div><span className="text-emerald-400">const</span> log = <span className="text-emerald-400">await</span> fs.<span className="text-blue-400">readFile</span>(<span className="text-amber-300">&apos;server.log&apos;</span>, <span className="text-amber-300">&apos;utf-8&apos;</span>);</div>
                <div><span className="text-cyan-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-amber-300">&apos;Saved Log:&apos;</span>, log.<span className="text-blue-400">trim</span>());</div>
              </div>
            </div>

            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside pt-2">
              <li><code className="font-mono">os.cpus()</code> retrieves hardware thread count directly from host kernel tables.</li>
              <li><code className="font-mono">fs.writeFile</code> invokes POSIX system calls (<code className="font-mono">open</code>, <code className="font-mono">write</code>, <code className="font-mono">close</code>) to persist bytes to disk.</li>
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
                  A Standalone HTTP Web Server in 6 Lines
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Node.js doesn&apos;t require an external application server (such as Apache or NGINX) to run your code. The runtime itself creates and manages TCP sockets and HTTP connections.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto space-y-1">
                <div className="text-slate-500">// server.mjs</div>
                <div><span className="text-emerald-400">import</span> http <span className="text-emerald-400">from</span> <span className="text-amber-300">&apos;node:http&apos;</span>;</div>
                <div className="pt-2"><span className="text-emerald-400">const</span> server = http.<span className="text-blue-400">createServer</span>((req, res) =&gt; &#123;</div>
                <div className="pl-4">res.<span className="text-blue-400">writeHead</span>(<span className="text-purple-400">200</span>, &#123; <span className="text-amber-300">&apos;Content-Type&apos;</span>: <span className="text-amber-300">&apos;application/json&apos;</span> &#125;);</div>
                <div className="pl-4">res.<span className="text-blue-400">end</span>(<span className="text-cyan-400">JSON</span>.<span className="text-blue-400">stringify</span>(&#123; status: <span className="text-amber-300">&apos;ok&apos;</span>, uptime: process.<span className="text-blue-400">uptime</span>() &#125;));</div>
                <div>&#125;);</div>
                <div className="pt-2">server.<span className="text-blue-400">listen</span>(<span className="text-purple-400">3000</span>, () =&gt; <span className="text-cyan-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-amber-300">&apos;Server running on port 3000&apos;</span>));</div>
              </div>
            </div>

            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside pt-2">
              <li><code className="font-mono">http.createServer</code> registers a callback triggered whenever a client socket completes an HTTP request.</li>
              <li>Thousands of incoming requests can be served asynchronously on a single thread without allocating a dedicated OS thread per connection.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Browser vs. Node.js Comparison */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Browser JavaScript vs. Node.js at a Glance
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-1/4">Aspect</th>
                <th className="py-3 px-4 w-3/8">Web Browser</th>
                <th className="py-3 px-4 w-3/8">Node.js</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">Global Root</td>
                <td className="py-3 px-4 font-mono text-xs"><code className="text-slate-600 dark:text-slate-400">window</code>, <code className="text-slate-600 dark:text-slate-400">document</code></td>
                <td className="py-3 px-4 font-mono text-xs text-emerald-600 dark:text-emerald-400"><code className="text-emerald-700 dark:text-emerald-400">globalThis</code>, <code className="text-emerald-700 dark:text-emerald-400">process</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">File System Access</td>
                <td className="py-3 px-4">Sandboxed (no arbitrary disk read/write)</td>
                <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">Full POSIX filesystem access (<code className="font-mono text-xs">node:fs</code>)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">Networking Role</td>
                <td className="py-3 px-4">Client-only (<code className="font-mono text-xs">fetch</code>, WebSockets with CORS)</td>
                <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">Server &amp; Client (raw TCP, UDP, HTTP servers)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">DOM &amp; UI</td>
                <td className="py-3 px-4">Direct DOM tree rendering &amp; styling</td>
                <td className="py-3 px-4 text-slate-500">None (headless server &amp; CLI execution)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">System Primitives</td>
                <td className="py-3 px-4">Restricted to tab environment</td>
                <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">Environment variables, signals, child processes</td>
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
            Try It: In-Browser Node.js Runtime
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Edit JavaScript on the left and click <strong>Run Code</strong> (or press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300">⌘+Enter</kbd>) to observe real-time output in the terminal on the right.
          </p>
        </div>

        <NodeJsEditor
          title="Node.js v22 REPL Lab"
          initialCode={`// Inspect the Node.js process environment
console.log("=== Node.js Process & Runtime ===");
console.log("Node Version :", process.version);
console.log("Platform     :", process.platform);
console.log("Architecture :", process.arch);
console.log("Process PID  :", process.pid);
console.log("Process Uptime:", process.uptime().toFixed(2), "seconds");

// Note: In Node.js, 'window' is undefined, but 'process' is always available
console.log("Is window defined? :", typeof window !== "undefined");
console.log("Is process defined?:", typeof process !== "undefined");`}
          presets={[
            {
              label: '1. Runtime & Process Info',
              code: `// Inspect the Node.js process environment
console.log("=== Node.js Process & Runtime ===");
console.log("Node Version :", process.version);
console.log("Platform     :", process.platform);
console.log("Architecture :", process.arch);
console.log("Process PID  :", process.pid);
console.log("Process Uptime:", process.uptime().toFixed(2), "seconds");

// Note: In Node.js, 'window' is undefined, but 'process' is always available
console.log("Is window defined? :", typeof window !== "undefined");
console.log("Is process defined?:", typeof process !== "undefined");`,
            },
            {
              label: '2. Asynchronous Event Timing',
              code: `// Synchronous execution vs asynchronous timers
console.log("1. [Sync] Script execution begins");

setTimeout(() => {
  console.log("3. [Async] Timer callback ran via Event Loop");
}, 200);

console.log("2. [Sync] Script execution ends (main thread remains active)");`,
            },
          ]}
        />
      </section>

      {/* 6. Key Production Trap */}
      <section className="p-5 rounded-2xl border-l-4 border-amber-500 bg-amber-500/5 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>The Golden Rule: Don&apos;t Block the Event Loop</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Node.js executes your JavaScript on a <strong>single thread</strong>. While asynchronous I/O (database queries, network requests, disk reads) does not block this thread, heavy synchronous CPU computations (e.g. encrypting large payloads, calculating primes, or synchronous JSON parsing) freeze the entire process. While blocked, <em>no other connected client can be served</em>.
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
            1. What is Node.js?
          </div>

          <div className="grid gap-2">
            {[
              { id: 'A', text: 'A new programming language that supersedes JavaScript' },
              { id: 'B', text: 'A JavaScript runtime environment that executes code outside the browser', correct: true },
              { id: 'C', text: 'A frontend component framework similar to React or Vue' },
              { id: 'D', text: 'A relational database server built on V8' },
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
                  Correct. Node.js is neither a language nor a framework—it is an execution host (runtime) embedding V8 and libuv.
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400">
                  Not quite. Node.js is not a separate language or framework; it executes standard ECMAScript on the server.
                </span>
              )}
            </p>
          )}
        </div>

        {/* Q2 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="font-medium text-sm sm:text-base text-slate-900 dark:text-slate-100">
            2. Why can Node.js read files and open TCP ports while browser JavaScript cannot?
          </div>

          <div className="grid gap-2">
            {[
              { id: 'A', text: 'Node.js translates JavaScript into C++ binary ahead of time' },
              { id: 'B', text: 'Browsers use an outdated version of ECMAScript' },
              { id: 'C', text: 'Node.js provides C++ bindings to host OS system calls, while browsers enforce a security sandbox', correct: true },
              { id: 'D', text: 'Browsers do not have a JavaScript compiler' },
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
              {q2 === 'C' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Correct. Node.js bundles native C++ host bindings that execute OS system calls; browsers deliberately sandbox JavaScript to prevent malicious sites from accessing user hardware.
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400">
                  Incorrect. Both modern browsers and Node.js use fast JIT engines (like V8), but browsers deliberately isolate scripts in a security sandbox.
                </span>
              )}
            </p>
          )}
        </div>

        {/* Q3 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="font-medium text-sm sm:text-base text-slate-900 dark:text-slate-100">
            3. What happens if a Node.js HTTP server executes a 10-second synchronous calculation during a request?
          </div>

          <div className="grid gap-2">
            {[
              { id: 'A', text: 'Node.js spins up a new OS thread to serve incoming requests concurrently' },
              { id: 'B', text: 'The single event loop thread freezes, preventing all concurrent users from being served for 10 seconds', correct: true },
              { id: 'C', text: 'The request is aborted immediately by the runtime watchdog' },
              { id: 'D', text: 'The calculation is automatically split across all CPU cores' },
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
                  Correct. Node.js executes JavaScript on a single thread. CPU-intensive work must be offloaded to worker threads or background queues to keep the event loop unblocked.
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400">
                  Incorrect. Node.js does not automatically multi-thread your JavaScript synchronous code. The entire event loop stalls for all users until the calculation finishes.
                </span>
              )}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
