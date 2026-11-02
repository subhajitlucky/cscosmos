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
  Gauge,
  Flame,
  GitBranch,
  Workflow,
  Trash2,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';
import { V8MemoryVisualizer } from './V8MemoryVisualizer';

export function Concept5Lesson() {
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
            Node.js — Lesson 05/280
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
          Concept 5: The V8 JavaScript Engine
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          The computational engine of Node.js. Dive deep into the JIT compilation pipeline: AST Parsing, the Ignition bytecode interpreter, TurboFan optimization, Hidden Classes (Shapes), Inline Caches, and generational garbage collection.
        </p>
      </div>

      {/* SECTION 1: FIRST, UNDERSTAND THE PROBLEM */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">First, Understand the Problem: Interpreted vs. Compiled</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            CPUs do not understand JavaScript text. A modern CPU (x86_64 or ARM64) understands only raw binary machine instructions (opcodes like <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">MOV</code>, <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">ADD</code>, <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">JMP</code>).
          </p>

          <p>
            Historically, programming languages solved this in one of two ways:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <span className="text-xs sm:text-sm font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                1. Ahead-Of-Time (AOT) Compilation (C, C++, Rust)
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Source code is compiled into native machine code <em>before</em> running. It is blazingly fast at runtime, but compilation takes time, and the binary is locked to a specific CPU architecture.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs">
              <span className="text-xs sm:text-sm font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                2. Pure Interpretation (Early JS in 1995, Ruby 1.8)
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                An interpreter reads source code line by line and translates it on the fly. Startup is instant, but execution is <strong>50x to 100x slower</strong> because the same loop line is re-interpreted on every single iteration!
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-sm font-semibold flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>The V8 Breakthrough:</strong> In 2008, Google released V8 (written in C++ by Lars Bak). V8 combined the instant startup of an interpreter with the blistering speed of a compiler using <strong>Just-In-Time (JIT) Compilation</strong>!
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE V8 COMPILATION PIPELINE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The Complete V8 Execution Pipeline</h2>
        </div>

        <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            How does JavaScript source code transform into raw CPU instructions? Follow the 5-stage V8 pipeline:
          </p>

          <div className="space-y-4">
            {/* Stage 1 */}
            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  01
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                    Scanner &amp; Lexical Analysis (Tokens)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Breaks the raw JavaScript character stream into meaningful grammar tokens (e.g., <code className="font-mono">const</code>, <code className="font-mono">Identifier</code>, <code className="font-mono">Assign</code>, <code className="font-mono">Number</code>).
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shrink-0">
                Lexer
              </span>
            </div>

            {/* Stage 2 */}
            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  02
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                    AST Parser (Abstract Syntax Tree)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Builds a hierarchical tree representing code semantics and scope hierarchies. Employs lazy pre-parsing for functions that aren&apos;t immediately called.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 shrink-0">
                AST Tree
              </span>
            </div>

            {/* Stage 3 */}
            <div className="p-5 rounded-3xl border-2 border-emerald-500/40 bg-slate-50/70 dark:bg-slate-900/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  03
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>Ignition Bytecode Interpreter</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-mono">Core</span>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Generates concise bytecode registers from the AST. Executes code immediately without compilation delays, while recording <strong>Type Feedback</strong> on every variable and function.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 shrink-0">
                Bytecode + Profiler
              </span>
            </div>

            {/* Stage 4 */}
            <div className="p-5 rounded-3xl border-2 border-amber-500/40 bg-slate-50/70 dark:bg-slate-900/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  04
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>TurboFan JIT Optimizing Compiler</span>
                    <Flame className="w-4 h-4 text-amber-500" />
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    When Ignition detects a &ldquo;hot function&rdquo; (executed repeatedly), TurboFan takes the bytecode + Type Feedback and compiles it directly into highly optimized native machine assembly!
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 shrink-0">
                Machine Assembly
              </span>
            </div>

            {/* Stage 5 */}
            <div className="p-5 rounded-3xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  05
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                    Deoptimization (Deopt Bailout)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    If an optimized function suddenly encounters an unexpected type (e.g. function optimized for two numbers receives a string), TurboFan discards the machine code and bails out back to Ignition bytecode!
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 shrink-0">
                Safety Bailout
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HIDDEN CLASSES (SHAPES) & INLINE CACHING */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Hidden Classes (Shapes) &amp; Inline Caching (IC)</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            In languages like C++ or Java, object properties are located at fixed memory offsets in compiled structs. Property lookups take <strong>zero CPU cycles</strong> (direct pointer arithmetic).
          </p>

          <p>
            JavaScript objects, however, are dynamic dictionaries. You can add or delete properties at runtime. If V8 performed dictionary hash lookups every time you read <code className="font-mono">point.x</code>, JavaScript would crawl.
          </p>

          <p>
            To solve this, V8 invents <strong>Hidden Classes (referred to internally as Maps or Shapes)</strong>:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>Monomorphic (Fast Path: Same Shape)</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                When you construct objects with properties in the <strong>exact same order</strong>:
              </p>
              <div className="p-3.5 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm border border-slate-800">
                <pre>{`function Point(x, y) {
  this.x = x; // Shape C0 -> C1
  this.y = y; // Shape C1 -> C2
}
const p1 = new Point(1, 2);
const p2 = new Point(3, 4);`}</pre>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Both <code className="font-mono">p1</code> and <code className="font-mono">p2</code> share the exact same hidden class pointer <code className="font-mono">C2</code>. V8 caches the memory offset (e.g. offset 0 for x, offset 1 for y). Property access runs at <strong>native C++ speed</strong>!
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm sm:text-base">
                <XCircle className="w-5 h-5" />
                <span>Megamorphic (Slow Path: Shape Thrashing)</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                When you dynamically mutate objects in inconsistent order or delete keys:
              </p>
              <div className="p-3.5 rounded-2xl bg-slate-950 text-rose-300 font-mono text-xs sm:text-sm border border-slate-800">
                <pre>{`const a = {}; a.x = 1; a.y = 2; // C0 -> C1 -> C2
const b = {}; b.y = 2; b.x = 1; // C0 -> C3 -> C4
delete a.x; // Drops into slow dictionary mode!`}</pre>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                V8 cannot predict memory offsets. It drops the Inline Cache into <strong>Megamorphic mode</strong>, forcing an expensive hash-table dictionary search on every single read!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE V8 HEAP & GENERATIONAL GARBAGE COLLECTION */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">The V8 Heap &amp; Generational Garbage Collection</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            V8 automatically manages memory using <strong>Generational Garbage Collection</strong>, based on the empirical <em>Weak Generational Hypothesis</em>: <strong>most objects die young</strong> (temporary loop variables, function parameters, intermediate promises).
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Young Generation */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    Young Generation (New Space)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  Minor GC (Scavenge)
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Small (typically 1 MB – 64 MB). Divided into two contiguous semi-spaces: <strong>From Space</strong> and <strong>To Space</strong>.
              </p>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Cheney&apos;s Copying Algorithm:</strong> When From Space fills up, live reachable objects are copied into To Space; dead objects are abandoned. The roles of From and To then swap instantly. Surviving objects are promoted to Old Space. Takes <strong>&lt; 1 millisecond</strong>!
              </div>
            </div>

            {/* Old Generation */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-purple-500" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    Old Generation (Old Space)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                  Major GC (Mark-Sweep)
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Large (up to ~1.4 GB – 4 GB+). Houses long-lived objects that survived two minor GC scavenge cycles (singletons, server caches, closures).
              </p>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Mark-Sweep-Compact Algorithm:</strong> Traverses the entire heap graph (Marking), sweeps dead memory, and defragments memory pages (Compacting). Runs concurrently in background threads via Orinoco to avoid freezing JavaScript.
              </div>
            </div>
          </div>

          {/* Interactive V8 Memory & Garbage Collection Visualizer */}
          <div className="pt-2">
            <V8MemoryVisualizer />
          </div>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE CODE LAB */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            5
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Interactive V8 Code Lab: Inspecting Engine Internals</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Execute the presets below to inspect live V8 engine statistics, query heap spaces, and observe JIT compilation mechanics:
          </p>

          <NodeJsEditor
            title="Concept 5 Code Lab: V8 Engine & Heap Telemetry"
            initialCode={`// 1. Inspect V8 Engine Version & Heap Stats
const v8 = require("node:v8");

console.log("=== V8 Engine Information ===");
console.log("V8 Version:", process.versions.v8);

const stats = v8.getHeapStatistics();
console.log("\\n=== V8 Heap Limit & Spaces ===");
console.log("Heap Size Limit   :", (stats.heap_size_limit / 1024 / 1024).toFixed(2), "MB");
console.log("Total Heap Size   :", (stats.total_heap_size / 1024 / 1024).toFixed(2), "MB");
console.log("Used Heap Size    :", (stats.used_heap_size / 1024 / 1024).toFixed(2), "MB");
console.log("Available Memory  :", (stats.total_available_size / 1024 / 1024).toFixed(2), "MB");`}
            presets={[
              {
                label: '1. V8 Heap Statistics',
                code: `// 1. Inspect V8 Engine Version & Heap Stats\nconst v8 = require("node:v8");\n\nconsole.log("=== V8 Engine Information ===");\nconsole.log("V8 Version:", process.versions.v8);\n\nconst stats = v8.getHeapStatistics();\nconsole.log("\\n=== V8 Heap Limit & Spaces ===");\nconsole.log("Heap Size Limit   :", (stats.heap_size_limit / 1024 / 1024).toFixed(2), "MB");\nconsole.log("Total Heap Size   :", (stats.total_heap_size / 1024 / 1024).toFixed(2), "MB");\nconsole.log("Used Heap Size    :", (stats.used_heap_size / 1024 / 1024).toFixed(2), "MB");\nconsole.log("Available Memory  :", (stats.total_available_size / 1024 / 1024).toFixed(2), "MB");`,
              },
              {
                label: '2. V8 Heap Spaces Breakdown',
                code: `// Inspect the individual memory spaces in the V8 heap\nconst v8 = require("node:v8");\n\nconsole.log("=== V8 Heap Memory Spaces ===");\nconst spaces = v8.getHeapSpaceStatistics();\n\nspaces.forEach((space) => {\n  console.log(\n    \`\${space.space_name.padEnd(20)}: Used \${(space.space_used_size / 1024).toFixed(1)} KB / Total \${(space.space_size / 1024).toFixed(1)} KB\`\n  );\n});`,
              },
              {
                label: '3. Hidden Class Uniformity Demo',
                code: `// Monomorphic objects share the same Hidden Class (Shape)\nconsole.log("=== Testing Object Shapes in V8 ===");\n\nfunction createUser(id, username) {\n  return { id, username }; // Consistent property initialization order\n}\n\nconst u1 = createUser(1, "alice");\nconst u2 = createUser(2, "bob");\nconst u3 = createUser(3, "charlie");\n\nconsole.log("Object 1 keys:", Object.keys(u1));\nconsole.log("Object 2 keys:", Object.keys(u2));\nconsole.log("Consistent shapes allow V8 to access properties at direct CPU offsets!");`,
              },
            ]}
          />
        </div>
      </section>

      {/* SECTION 6: TWO CRITICAL PRODUCTION V8 TRAPS */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            6
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Two Critical Production V8 Traps</h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Understanding V8 internals protects high-throughput backend services from sudden 10x latency spikes and unrecoverable process crashes:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Trap #1: Shape Mutation &amp; The &ldquo;delete&rdquo; Operator</span>
              </div>
              <p className="text-sm text-rose-950 dark:text-rose-200 leading-relaxed">
                Calling <code className="font-mono">delete obj.field</code> modifies the hidden class and forces V8 to drop the object into slow dictionary mode. If this happens in a tight loop or hot request handler, property lookups become <strong>up to 50x slower</strong>!
              </p>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900 text-sm font-mono text-rose-900 dark:text-rose-300">
                Remedy: Never use <code className="font-bold">delete</code> in hot paths. Assign <code className="font-bold">obj.field = undefined</code> or create a new clean object.
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Trap #2: Default V8 Heap Limit Exhaustion</span>
              </div>
              <p className="text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
                By default, V8 limits heap size to ~2 GB to keep garbage collection pauses sub-second. If an application buffers massive datasets in memory, V8 crashes immediately with: <code className="font-mono text-xs">FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory</code>.
              </p>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900 text-sm font-mono text-amber-900 dark:text-amber-300">
                Remedy: Stream data in chunks via <code className="font-bold">node:stream</code> or increase heap with <code className="font-bold">node --max-old-space-size=4096 app.js</code>.
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
          Verify your architectural comprehension of V8 JIT compilation, Hidden Classes, and heap garbage collection before advancing to Concept 6.
        </p>

        {/* QUESTION 1 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 1: What is the primary role of Ignition in the V8 engine?
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
              { id: 'A', text: 'To delete unused objects from heap memory.' },
              {
                id: 'B',
                text: 'To compile the AST into compact bytecode, execute code immediately, and collect type profiling feedback.',
              },
              { id: 'C', text: 'To manage operating system network sockets and TCP connections.' },
              { id: 'D', text: 'To compile CSS stylesheets into browser layout trees.' },
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
                  <strong>Correct!</strong> Ignition is V8&apos;s fast bytecode interpreter. It translates the AST into a memory-efficient bytecode stream and gathers Type Feedback Vectors while executing, which TurboFan subsequently uses for JIT compilation.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option {q1} is incorrect. Ignition is V8&apos;s bytecode interpreter. It compiles AST into bytecode and collects type feedback. Garbage collection is handled by Orinoco/Scavenger, and sockets are handled by Libuv.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 2 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 2: What causes TurboFan to &ldquo;deoptimize&rdquo; (bail out) previously compiled machine code?
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
              { id: 'A', text: 'When the CPU core reaches 100% capacity.' },
              { id: 'B', text: 'When a Promise resolves asynchronously.' },
              {
                id: 'C',
                text: 'When speculative type assumptions are violated (e.g. passing a string to a hot function optimized strictly for numbers).',
              },
              { id: 'D', text: 'When the computer disconnects from the internet.' },
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
                  <strong>Spot on!</strong> TurboFan JIT optimizations rely on speculative type assumptions gathered during Ignition profiling. If you call <code className="font-mono">add(a, b)</code> a million times with numbers, TurboFan emits raw CPU <code className="font-mono">ADD</code> instructions. If you then call <code className="font-mono">add(&quot;hello&quot;, &quot;world&quot;)</code>, the CPU instruction is invalid; TurboFan must deoptimize and bail out back to bytecode!
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option {q2} is incorrect. Deoptimization is triggered when type feedback assumptions fail (dynamic type polymorphism), forcing TurboFan to discard the native machine code.
                </p>
              )}
            </div>
          )}
        </div>

        {/* QUESTION 3 */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Question 3: Why does deleting an object property (&ldquo;delete obj.x&rdquo;) hurt V8 performance?
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
              { id: 'A', text: 'It creates a memory leak that can never be garbage collected.' },
              {
                id: 'B',
                text: 'It breaks the object’s Hidden Class (Shape) transition chain and forces V8 to drop the object into slow dictionary hash-table mode.',
              },
              { id: 'C', text: 'It freezes the Libuv thread pool.' },
              { id: 'D', text: 'It triggers a synchronous disk write.' },
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
                  <strong>Exactly!</strong> When properties are added, V8 creates deterministic Hidden Class transitions. Deleting a key breaks this structure, converting the internal storage from fast contiguous field offsets into a slow generic dictionary hashmap.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Deleting properties forces the object into dictionary mode, eliminating inline caching and slowing down subsequent property lookups significantly.
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
                Question 4: How do V8&apos;s Hidden Classes (Shapes) and Inline Caches (IC) work together to achieve C++ speed?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on property offset caching, shape comparisons, and call site specialization, then click below to reveal the faculty model answer.
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
                  <strong>1. Hidden Class (Shape) Mapping:</strong> Every time an object is initialized with properties in the same sequence, V8 assigns it an internal hidden class pointer. This hidden class specifies the exact numeric byte offset of each property in memory (e.g. <code className="font-mono">x</code> is at offset 0, <code className="font-mono">y</code> is at offset 1).
                </p>
                <p>
                  <strong>2. Inline Caching (IC) at Call Sites:</strong> When a function executes <code className="font-mono">point.x</code>, V8 memorizes the Shape of the incoming object and the calculated offset directly at that call site bytecode instruction.
                </p>
                <p>
                  <strong>3. Monomorphic Direct Memory Jump:</strong> On subsequent invocations, V8 performs a single lightning-fast check: <em>Does the object still match Shape C2?</em> If yes, it skips dictionary lookup entirely and reads the property directly via a fixed memory offset jump, achieving identical performance to compiled C++ struct access.
                </p>
                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Performance Formula: Monomorphic Call Site = 1 Shape Check + Direct Memory Offset Jump (Native CPU Speed)
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
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 6 using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}
