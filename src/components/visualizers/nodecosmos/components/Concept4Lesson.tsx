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
  Monitor,
  Code2,
  Lock,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept4Lesson() {
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
            Node.js — Lesson 04/280
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
          Concept 4: Node.js vs. Browser JavaScript
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          One language, two fundamentally opposite operating realities. Discover how the ECMAScript core shares syntax while host environments diverge in security models, global scope, DOM rendering, and operating system permissions.
        </p>
      </div>

      {/* SECTION 1: FIRST, UNDERSTAND THE PROBLEM */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">First, Understand the Problem: The Language vs. The Host</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When beginner developers write JavaScript, they often assume <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">window</code>, <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">document</code>, or <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">fs.readFile</code> are built-in parts of the JavaScript language itself.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm font-semibold flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span>
              <strong>Crucial Engineering Distinction:</strong> The official JavaScript language specification (ECMAScript) defines <strong>zero I/O capabilities</strong>! ECMAScript has no syntax or standard library for reading files, drawing buttons, listening on network sockets, or reading cookies.
            </span>
          </div>

          <p>
            Instead, ECMAScript defines only:
          </p>

          <ul className="grid sm:grid-cols-2 gap-2.5 list-disc list-inside text-slate-700 dark:text-slate-300 text-sm">
            <li>Data types: String, Number, BigInt, Boolean, Object, Symbol.</li>
            <li>Core structures: Array, Map, Set, WeakMap, Date, RegExp.</li>
            <li>Control flow: <code className="font-mono">if/else</code>, <code className="font-mono">for</code>, <code className="font-mono">while</code>, <code className="font-mono">try/catch</code>.</li>
            <li>Async primitives: <code className="font-mono">Promise</code>, <code className="font-mono">async/await</code>, Microtasks.</li>
          </ul>

          <p>
            Every single capability beyond syntax is injected into the execution context by the <strong>Host Environment</strong>:
          </p>

          <div className="grid md:grid-cols-2 gap-4 pt-1">
            <div className="p-6 rounded-3xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 space-y-2.5">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm sm:text-base">
                <Monitor className="w-5 h-5" />
                <span>The Web Browser Host Environment</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Designed to run untrusted code safely. Injects DOM APIs (<code className="font-mono">document</code>), Browser Object Model (<code className="font-mono">window</code>, <code className="font-mono">navigator</code>), CSS rendering engines, and hardware sandboxes.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm sm:text-base">
                <Server className="w-5 h-5" />
                <span>The Node.js Host Environment</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Designed to build backend infrastructure. Injects file system bindings (<code className="font-mono">node:fs</code>), TCP/UDP socket servers (<code className="font-mono">node:net</code>, <code className="font-mono">node:http</code>), OS telemetry (<code className="font-mono">process</code>), and raw binary buffers (<code className="font-mono">Buffer</code>).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE SECURITY MODEL DIVERGENCE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The Security Model: Sandboxed vs. Unsandboxed</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            The single most consequential architectural difference between Browser JavaScript and Node.js is their <strong>security boundary</strong>:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Browser Sandbox */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    Browser: Strict Sandbox Isolation
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  Untrusted Code
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                When you visit an unfamiliar website, your browser downloads and executes arbitrary JavaScript code written by an unknown entity.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-slate-100">Sandbox Protections:</div>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-400">
                  <li>No direct reading/writing of local hard drive files.</li>
                  <li>No raw TCP/UDP socket connections (preventing DDoS &amp; botnets).</li>
                  <li>Cross-Origin Resource Sharing (CORS) blocks unauthorized requests to other domains.</li>
                  <li>Crash in one tab is isolated by the browser process sandbox.</li>
                </ul>
              </div>
            </div>

            {/* Node.js Unsandboxed */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    Node.js: Full Operating System Privileges
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  Trusted Code
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Node.js is designed for server backends, microservices, and CLI dev tools that you intentionally install and trust.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-slate-100">Direct System Privileges:</div>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-400">
                  <li>Full disk access (can read, write, create, or delete any file your user owns).</li>
                  <li>Listen on any network port and establish arbitrary raw TCP/TLS sockets.</li>
                  <li>Zero CORS restrictions (CORS is purely a browser-enforced security mechanism).</li>
                  <li>Spawn child processes and execute shell scripts via <code className="font-mono">child_process</code>.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: GLOBAL SCOPE & MODULE WRAPPER DIFFERENCE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Scope Architecture: The Module Wrapper Function</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Consider this single line of JavaScript code:
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-sm border border-slate-800">
            <code>var companyName = &quot;CSCosmos&quot;;</code>
          </div>

          <p>
            What happens when this line executes in a browser versus inside a Node.js file?
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-xs">
              <span className="text-xs sm:text-sm font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                In Browser Classic Script
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The variable is hoisted directly onto the global <code className="font-mono font-bold">window</code> object! It becomes accessible as <code className="font-mono">window.companyName</code> everywhere, creating collision hazards across third-party scripts.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-xs">
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                In Node.js CommonJS File
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The variable is <strong>strictly private to that file</strong>! It does NOT attach to <code className="font-mono font-bold">global.companyName</code>.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              Why does Node.js isolate top-level variables?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Before Node.js executes any CommonJS file, it automatically wraps your source code in an invisible <strong>Module Wrapper IIFE</strong>:
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm border border-slate-800 overflow-x-auto shadow-inner">
              <pre>{`(function (exports, require, module, __filename, __dirname) {
  // YOUR SOURCE CODE IS PLACED HERE
  var companyName = "CSCosmos";
});`}</pre>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This explains where <code className="font-mono font-bold">__dirname</code>, <code className="font-mono font-bold">__filename</code>, <code className="font-mono font-bold">require</code>, and <code className="font-mono font-bold">module.exports</code> originate: they are not magic globals, but function arguments passed into your file by the Node.js runtime loader!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPREHENSIVE 8-DIMENSION COMPARISON TABLE */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The Comprehensive 8-Dimension Comparison</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Here is the definitive architectural comparison matrix between Browser JavaScript and Node.js:
          </p>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3.5 px-4">Dimension</th>
                  <th className="py-3.5 px-4">Web Browser (Client)</th>
                  <th className="py-3.5 px-4">Node.js (Server / Runtime)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {[
                  {
                    dim: '1. Primary Purpose',
                    browser: 'Interactive user interfaces, client state, animations & visual rendering.',
                    node: 'REST/GraphQL APIs, background workers, file streaming, CLI dev tools.',
                  },
                  {
                    dim: '2. Global Object',
                    browser: 'window (also self, frames, globalThis)',
                    node: 'global (standardized as globalThis)',
                  },
                  {
                    dim: '3. Security Sandbox',
                    browser: 'Strict sandbox. Blocked from arbitrary filesystem or raw sockets.',
                    node: 'Unsandboxed. Runs with full permissions of host OS user.',
                  },
                  {
                    dim: '4. File System Access',
                    browser: 'No direct filesystem. Limited to sandbox File API with user prompt.',
                    node: 'Full read, write, append, and stream access via node:fs.',
                  },
                  {
                    dim: '5. Networking & Sockets',
                    browser: 'High-level HTTP/WebSocket, strictly governed by browser CORS rules.',
                    node: 'Raw TCP sockets (node:net), UDP (node:dgram), TLS, HTTP server.',
                  },
                  {
                    dim: '6. UI & Rendering',
                    browser: 'DOM (document), CSSOM, Canvas, WebGL, layout and paint pipeline.',
                    node: 'Headless. No DOM, no window, no CSS, no visual rendering engine.',
                  },
                  {
                    dim: '7. Module Systems',
                    browser: 'Standard ES Modules (import/export) loaded over HTTP.',
                    node: 'Dual support: CommonJS (require) + ES Modules (import/export).',
                  },
                  {
                    dim: '8. Memory Limits',
                    browser: 'Limited per browser tab (typically 1 GB – 4 GB maximum).',
                    node: 'Configurable via --max-old-space-size up to physical system RAM limit.',
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {row.dim}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {row.browser}
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
          <h2 className="text-2xl font-bold tracking-tight">Interactive Code Lab: Detecting Host Environments</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When writing universal or isomorphic JavaScript (libraries that run on both servers and browsers, such as Axios or React components), your code must safely detect its host environment:
          </p>

          <NodeJsEditor
            title="Concept 4 Code Lab: Environment Detection & Globals"
            initialCode={`// Safe, cross-platform host environment detector
function detectHost() {
  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  const isNode = typeof process !== 'undefined' && Boolean(process.versions && process.versions.node);

  return {
    isBrowser,
    isNode,
    globalIdentifier: typeof globalThis !== 'undefined' ? 'globalThis supported' : 'legacy',
  };
}

console.log("=== Environment Detection Result ===");
console.log(detectHost());

console.log("\\n=== Available Globals in this Runtime ===");
console.log("typeof process :", typeof process);
console.log("typeof Buffer  :", typeof Buffer);
console.log("typeof window  :", typeof window);
console.log("typeof document:", typeof document);`}
            presets={[
              {
                label: '1. Safe Environment Detection',
                code: `// Safe, cross-platform host environment detector\nfunction detectHost() {\n  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';\n  const isNode = typeof process !== 'undefined' && Boolean(process.versions && process.versions.node);\n\n  return {\n    isBrowser,\n    isNode,\n    globalIdentifier: typeof globalThis !== 'undefined' ? 'globalThis supported' : 'legacy',\n  };\n}\n\nconsole.log("=== Environment Detection Result ===");\nconsole.log(detectHost());\n\nconsole.log("\\n=== Available Globals in this Runtime ===");\nconsole.log("typeof process :", typeof process);\nconsole.log("typeof Buffer  :", typeof Buffer);\nconsole.log("typeof window  :", typeof window);\nconsole.log("typeof document:", typeof document);`,
              },
              {
                label: '2. Universal ECMAScript Built-ins',
                code: `// Universal ECMAScript features that work identically everywhere:\nconsole.log("=== Universal ECMAScript Engine Features ===");\n\n// 1. Map & Set\nconst userMap = new Map();\nuserMap.set("subhajit", { role: "Engineer" });\nconsole.log("User Map:", userMap.get("subhajit"));\n\n// 2. Modern Array Methods\nconst numbers = [10, 25, 40, 55];\nconst evens = numbers.filter(n => n % 2 === 0);\nconsole.log("Even numbers:", evens);\n\n// 3. JSON Serialization\nconst payload = JSON.stringify({ framework: "Node.js", version: 22 });\nconsole.log("JSON Output:", payload);`,
              },
              {
                label: '3. Web APIs Ported to Node.js',
                code: `// Modern Node.js implements many Web Standards:\nconsole.log("=== Modern Shared Web APIs in Node.js ===");\n\n// 1. TextEncoder\nconst encoder = new TextEncoder();\nconst encoded = encoder.encode("Hello Universal JS");\nconsole.log("TextEncoder byte length:", encoded.byteLength);\n\n// 2. URL parsing\nconst url = new URL("https://cscosmos.dev/nodecosmos?tab=concepts");\nconsole.log("Parsed hostname:", url.hostname);\nconsole.log("Parsed search query:", url.searchParams.get("tab"));`,
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
          <h2 className="text-2xl font-bold tracking-tight">Two Critical Production Failure Modes</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When building modern Fullstack applications (Next.js, Remix, Astro) that bridge the server and client, conflating host environments causes catastrophic production crashes:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Trap #1: &ldquo;ReferenceError: window is not defined&rdquo;</span>
              </div>
              <p className="text-sm text-rose-950 dark:text-rose-200 leading-relaxed">
                During Server-Side Rendering (SSR), your React component renders on a Node.js backend. If code invokes <code className="font-mono">window.localStorage</code> or <code className="font-mono">document.title</code> during the initial render pass, the server crashes instantly with a 500 error!
              </p>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900 text-sm font-mono text-rose-900 dark:text-rose-300">
                Remedy: Move browser-only calls inside <code className="font-bold">useEffect()</code> or guard with <code className="font-bold">typeof window !== &apos;undefined&apos;</code>.
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Trap #2: Leaking Server Secrets &amp; Node APIs to the Client</span>
              </div>
              <p className="text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
                Attempting to import <code className="font-mono">node:fs</code> or <code className="font-mono">process.env.DB_PASSWORD</code> in client bundle files causes bundler build failures (<code className="font-mono">Module not found: Can&apos;t resolve &apos;fs&apos;</code>) or exposes critical database credentials to the public web!
              </p>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900 text-sm font-mono text-amber-900 dark:text-amber-300">
                Remedy: Isolate server code in API Route Handlers / Server Actions; never import node modules in client components.
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
          Verify your architectural comprehension of host environment boundaries, security sandboxing, and module scoping before advancing to Concept 5.
        </p>

        {/* QUESTION 1 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 1: What happens to a top-level &ldquo;var name = &apos;CSCosmos&apos;&rdquo; declaration inside a Node.js CommonJS file?
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
              { id: 'A', text: 'It attaches directly to global.name, polluting the entire Node.js global namespace.' },
              {
                id: 'B',
                text: 'It is scoped privately to the automatic Module Wrapper IIFE function and does NOT pollute global.',
              },
              { id: 'C', text: 'It causes a fatal SyntaxError because var is deprecated in Node.js.' },
              { id: 'D', text: 'It writes the variable to an environment file on the hard drive.' },
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
                  <strong>Correct!</strong> In Node.js CommonJS files, every file is wrapped inside an anonymous function: <code className="font-mono font-bold">(function(exports, require, module, __filename, __dirname) {'{'} ... {'}'})</code>. Variables declared with <code className="font-mono">var</code>, <code className="font-mono">let</code>, or <code className="font-mono">const</code> remain private to that function scope.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option {q1} is incorrect. Unlike classic browser scripts where <code className="font-mono">var</code> pollutes <code className="font-mono">window</code>, Node.js isolates every module inside an IIFE function wrapper.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 2 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 2: Which security constraint applies to Web Browsers but does NOT apply to Node.js?
            </h3>
            {q2 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q2 === 'A'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q2 === 'A' ? 'Correct' : 'Needs Review'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {[
              {
                id: 'A',
                text: 'Cross-Origin Resource Sharing (CORS) enforcement and arbitrary file system blocking.',
              },
              { id: 'B', text: 'Automatic garbage collection of heap objects.' },
              { id: 'C', text: 'Handling of Promise async/await resolution.' },
              { id: 'D', text: 'Parsing of JSON string data via JSON.parse().' },
            ].map((option) => {
              const isSelected = q2 === option.id;
              const isCorrect = option.id === 'A';
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
                q2 === 'A'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q2 === 'A' ? (
                <p>
                  <strong>Spot on!</strong> CORS is an entirely browser-enforced security policy to prevent malicious scripts on one origin from exfiltrating data from another. Node.js has no CORS enforcement whatsoever: it can issue HTTP requests directly to any server on the internet or open raw sockets at will!
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option {q2} is incorrect. Garbage collection, Promises, and JSON parsing are core ECMAScript specifications present in both environments. CORS and hard sandbox restrictions are exclusive to browsers.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 3 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 3: Why do fullstack libraries (Next.js, React) frequently use &ldquo;typeof window !== &apos;undefined&apos;&rdquo;?
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
              { id: 'A', text: 'To check if the user is using Microsoft Windows operating system.' },
              { id: 'B', text: 'To verify whether the browser tab has focus.' },
              {
                id: 'C',
                text: 'To determine whether code is currently running in a browser client vs. a Node.js SSR backend environment before accessing DOM/BOM APIs.',
              },
              { id: 'D', text: 'To trigger hardware graphics acceleration.' },
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
                  <strong>Exactly!</strong> In modern server-side rendering (SSR), identical React components run first on Node.js to generate initial HTML, and then hydrate in the browser. In Node.js, <code className="font-mono">window</code> is undefined. Checking <code className="font-mono font-bold">typeof window !== &apos;undefined&apos;</code> safely guards browser-only APIs (<code className="font-mono">localStorage</code>, <code className="font-mono">navigator</code>, <code className="font-mono">document</code>) from crashing the server.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> The <code className="font-mono">window</code> object represents the browser global context. In Node.js, it does not exist. Checking its type is the standard idiomatic way to detect whether execution is on the client or server.
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
                Question 4: Why did the ECMAScript committee deliberately exclude File I/O, Sockets, and the DOM from the JavaScript language specification?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on language portability, cross-platform architecture, and host-agnostic design, then click below to reveal the faculty model answer.
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
                  <strong>1. Host-Agnostic Portability:</strong> If ECMAScript had tightly coupled file I/O or DOM nodes into the language core, JavaScript could never have run in diverse, constrained, or non-visual host environments (e.g. embedded microcontrollers via Espruino, database query engines like MongoDB, serverless workers like Cloudflare Workers, or Node.js).
                </p>
                <p>
                  <strong>2. Clean Separation of Concerns:</strong> By standardizing only grammar, type semantics, syntax, and computational abstractions, TC39 (the standards committee) ensures that the language remains evergreen and host-neutral. Each host environment is completely free to design appropriate security boundaries, I/O abstractions, and permission models suited to its unique operational domain.
                </p>
                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Architectural Principle: ECMAScript = Computation &bull; Host Environment = I/O &amp; Security Permissions
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
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 5 using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}
