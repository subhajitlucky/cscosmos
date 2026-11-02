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
  Gauge,
  Timer,
  FileText,
  Boxes,
  Award,
  GitBranch,
  Repeat,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept10Lesson() {
  // Interactive quiz state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [q4Revealed, setQ4Revealed] = useState<boolean>(false);

  // Era view toggle state
  const [activeEra, setActiveEra] = useState<'callbacks' | 'promises' | 'asyncawait'>('asyncawait');

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
            Node.js — Lesson 10/280 • Module 1 Capstone
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Level: Beginner
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Category: Node.js Fundamentals
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold">
            Estimated Time: 35–45 mins
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Concept 10: Synchronous vs. Asynchronous Execution
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          The capstone foundation of Node.js. Journey through the three historical eras of JavaScript asynchrony—Error-First Callbacks, Promises, and Async/Await—uncover the V8 suspension mechanics under the hood, and master concurrent flow control.
        </p>
      </div>

      {/* SECTION 1: THE ILLUSION OF SEQUENCE */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            First, Understand the Problem: The Illusion of Sequence
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Human beings read natural language and computer programs sequentially from top to bottom. In a traditional synchronous program, execution time is strictly identical to textual line order:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <span className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                1. Synchronous Execution (Deterministic Order)
              </span>
              <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`const user = fetchUserSync(101); // Line 1: Wait...
const orders = fetchOrdersSync(user); // Line 2: Wait...
console.log(orders); // Line 3: Runs only after Line 2`}
              </pre>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Simple to reason about, but completely blocks the thread during every database or network round-trip.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                2. Asynchronous Execution (Temporal Decoupling)
              </span>
              <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`console.log("1. Starting query");
fetchUserAsync(101, (user) => {
  console.log("3. User data received!");
});
console.log("2. Query dispatched!");`}
              </pre>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Output order is <strong>1 &rarr; 2 &rarr; 3</strong>! Line 3 executes on a completely different turn of the Event Loop in the future.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-sm font-semibold flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>The Junior Developer Trap:</strong> Expecting an asynchronous function to return a value synchronously! For example: <code className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800">const data = fs.readFile(&apos;user.json&apos;); console.log(data);</code> will always output <code className="font-mono font-bold">undefined</code> because the data does not yet exist!
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 3 ERAS OF ASYNCHRONY */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            The 3 Historical Eras of Asynchrony in Node.js
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Over the last 15 years, Node.js and JavaScript evolved through three distinct asynchronous design patterns:
          </p>

          {/* Interactive Era Toggle */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveEra('callbacks')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeEra === 'callbacks'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <GitBranch className="w-4 h-4" /> 1. Callbacks (2009)
            </button>
            <button
              onClick={() => setActiveEra('promises')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeEra === 'promises'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Boxes className="w-4 h-4" /> 2. Promises (2015)
            </button>
            <button
              onClick={() => setActiveEra('asyncawait')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeEra === 'asyncawait'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" /> 3. Async / Await (2017+)
            </button>
          </div>

          {activeEra === 'callbacks' && (
            <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-4">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-base">
                <GitBranch className="w-5 h-5" /> Era 1: Error-First Callbacks &amp; Callback Hell (Pyramid of Doom)
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                In 2009, Ryan Dahl standardized the <strong>Error-First Callback convention</strong>: the first argument must always be the error (or <code className="font-mono">null</code>), followed by return data. However, sequential operations forced deeply nested pyramids:
              </p>

              <pre className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-rose-200 dark:border-rose-900 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`// Classic Callback Hell / Pyramid of Doom:
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getPaymentStatus(orders[0].id, (err, status) => {
      if (err) return handleError(err);
      renderReceipt(user, orders, status, (err, html) => {
        if (err) return handleError(err);
        res.send(html); // 5 levels of nesting!
      });
    });
  });
});`}
              </pre>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-300 font-mono">
                Problems: Pyramid of Doom, loss of try/catch error boundaries, inverted control flow.
              </div>
            </div>
          )}

          {activeEra === 'promises' && (
            <div className="p-6 rounded-3xl border border-blue-200 dark:border-blue-950/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-4">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-bold text-base">
                <Boxes className="w-5 h-5" /> Era 2: ES2015 Promises &amp; Linear Method Chaining
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <code className="font-mono font-bold">Promise</code> represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It has 3 immutable states: <strong>Pending</strong>, <strong>Fulfilled</strong>, and <strong>Rejected</strong>.
              </p>

              <pre className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-900 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`// Linear Promise Chaining (Flattens the Pyramid):
getUser(userId)
  .then((user) => getOrders(user.id))
  .then((orders) => getPaymentStatus(orders[0].id))
  .then((status) => renderReceipt(status))
  .then((html) => res.send(html))
  .catch((err) => handleError(err)); // Single unified error handler!`}
              </pre>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 font-mono">
                Advantage: Guarantees settled immutability, flattens nesting, integrates into V8 Microtask Queue.
              </div>
            </div>
          )}

          {activeEra === 'asyncawait' && (
            <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-base">
                <Sparkles className="w-5 h-5" /> Era 3: Async / Await (Modern Industry Standard)
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Introduced in ES2017, <code className="font-mono font-bold">async/await</code> is syntactic sugar on top of Promises and V8 Generator suspension. It allows developers to write asynchronous logic using familiar imperative synchronous syntax with native <code className="font-mono">try/catch</code> blocks:
              </p>

              <pre className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`// Modern Async/Await with Native Try/Catch:
async function handleCheckout(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const status = await getPaymentStatus(orders[0].id);
    const html = await renderReceipt(status);
    return res.send(html);
  } catch (err) {
    return handleError(err);
  }
}`}
              </pre>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200 font-mono">
                Rule: An async function ALWAYS returns a Promise, even if you return a plain number or string!
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: UNDER THE HOOD OF ASYNC/AWAIT */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Under the Hood: How V8 Suspends &amp; Resumes Execution
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When JavaScript hits an <code className="font-mono font-bold text-emerald-600 dark:text-emerald-400">await</code> keyword, what actually happens inside the V8 engine? Does it block the thread? <strong>No!</strong>
          </p>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              The 4 Steps of V8 Await Suspension:
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Step 1: Yield &amp; Wrap
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  V8 wraps the expression following <code className="font-mono">await</code> into a <code className="font-mono">Promise.resolve(expr)</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                  Step 2: Stack Frame Suspension
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  V8 captures the function&apos;s current local variables, program counter, and closure context and saves them into a heap object.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                  Step 3: Pop Stack &amp; Free Main Thread
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  The async function pops off the Call Stack! The main thread is now completely free to execute other functions or accept incoming HTTP connections.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                  Step 4: Microtask Resume
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  When the awaited Promise resolves, a resume job is enqueued in the <strong>V8 Microtask Queue</strong>. As soon as the call stack empties, V8 pushes the function back onto the stack and resumes execution right after the <code className="font-mono">await</code>!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CONCURRENT ORCHESTRATION: PROMISE.ALL */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Asynchronous Flow Control: Sequential vs. Concurrent
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            A massive performance trap in modern Node.js applications is writing sequential <code className="font-mono">await</code> statements when the operations are independent:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-rose-600 dark:text-rose-400">
                The Slow Waterfall: Sequential Await (~300ms)
              </span>
              <pre className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`// 3 independent queries executed sequentially:
const user = await fetchUser(); // 100ms
const posts = await fetchPosts(); // 100ms
const notifs = await fetchNotifs(); // 100ms

// Total Latency: 100 + 100 + 100 = 300ms!`}
              </pre>
            </div>

            <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                The Concurrent Fix: Promise.all (~100ms)
              </span>
              <pre className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`// Dispatched concurrently over non-blocking I/O:
const [user, posts, notifs] = await Promise.all([
  fetchUser(), // 100ms
  fetchPosts(), // 100ms
  fetchNotifs() // 100ms
]);

// Total Latency: MAX(100, 100, 100) = 100ms (3x faster!)`}
              </pre>
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
            Interactive Code Lab: Asynchronous Execution Playground
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Test and compare asynchronous execution patterns inside the simulator. Switch presets to benchmark sequential waterfalls versus concurrent <code className="font-mono">Promise.all</code> and inspect the infamous <code className="font-mono">forEach</code> async bug.
        </p>

        <NodeJsEditor
          title="Node.js Async Execution Simulator (Node v22 LTS)"
          initialCode={`// Preset 1: The Three Generations of Asynchrony
console.log("=== 1. Starting Asynchronous Demo ===");

// 1. Error-First Callback Simulation
function fetchUserCallback(id, cb) {
  setTimeout(() => cb(null, { id, name: "Subhajit" }), 50);
}

fetchUserCallback(1, (err, user) => {
  console.log("2. [Era 1: Callback] Fetched user:", user.name);
});

// 2. Promise Simulation
function fetchUserPromise(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, role: "Staff Engineer" }), 80);
  });
}

fetchUserPromise(1).then((user) => {
  console.log("3. [Era 2: Promise] Fetched role:", user.role);
});

// 3. Modern Async/Await
async function runAsync() {
  const user = await fetchUserPromise(1);
  console.log("4. [Era 3: Async/Await] Finished in async context:", user.role);
}

runAsync();
console.log("1.5. Synchronous script setup complete. Main thread is free!");`}
          presets={[
            {
              label: '1. The 3 Asynchronous Eras',
              code: `// Preset 1: The Three Generations of Asynchrony
console.log("=== 1. Starting Asynchronous Demo ===");

// 1. Error-First Callback Simulation
function fetchUserCallback(id, cb) {
  setTimeout(() => cb(null, { id, name: "Subhajit" }), 50);
}

fetchUserCallback(1, (err, user) => {
  console.log("2. [Era 1: Callback] Fetched user:", user.name);
});

// 2. Promise Simulation
function fetchUserPromise(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, role: "Staff Engineer" }), 80);
  });
}

fetchUserPromise(1).then((user) => {
  console.log("3. [Era 2: Promise] Fetched role:", user.role);
});

// 3. Modern Async/Await
async function runAsync() {
  const user = await fetchUserPromise(1);
  console.log("4. [Era 3: Async/Await] Finished in async context:", user.role);
}

runAsync();
console.log("1.5. Synchronous script setup complete. Main thread is free!");`,
            },
            {
              label: '2. Sequential vs Promise.all',
              code: `// Preset 2: Sequential Waterfall vs Promise.all Concurrency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runBenchmark() {
  console.log("--- Test 1: Sequential Await Waterfall ---");
  const startSeq = Date.now();
  await delay(60);
  await delay(60);
  await delay(60);
  console.log("Sequential duration:", Date.now() - startSeq, "ms (~180ms)");

  console.log("\\n--- Test 2: Concurrent Promise.all ---");
  const startConc = Date.now();
  await Promise.all([delay(60), delay(60), delay(60)]);
  console.log("Concurrent duration:", Date.now() - startConc, "ms (~60ms - 3x faster!)");
}

runBenchmark();`,
            },
            {
              label: '3. The forEach Async Trap',
              code: `// Preset 3: The Infamous forEach Async Trap
const items = [10, 20, 30];
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

console.log("=== Demonstration: Array.forEach DOES NOT await Promises! ===");

async function buggyLoop() {
  items.forEach(async (num) => {
    await delay(50);
    console.log("Buggy item processed:", num);
  });
  console.log("BUG: 'All done!' logged BEFORE items finished processing!");
}

async function correctLoop() {
  await delay(150); // wait for buggy demo to finish
  console.log("\\n=== Solution: Use standard for...of loop ===");
  for (const num of items) {
    await delay(30);
    console.log("Correct item processed:", num);
  }
  console.log("SUCCESS: 'All done!' waited for every item!");
}

buggyLoop();
correctLoop();`,
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
                  The Floating Promise Process Crash
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Anti-Pattern:</strong> Triggering an asynchronous background operation (like recording an audit log or analytics event) without <code className="font-mono">await</code> or <code className="font-mono">.catch()</code>:
            </p>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-300 space-y-1">
              <strong>The Production Outage:</strong> If the database or network fails, the promise rejects with no error handler. In modern Node.js, an <strong>UnhandledPromiseRejection</strong> raises an unhandled exception and <strong>instantly terminates the entire Node.js process</strong>!
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Fix:</strong> Either <code className="font-mono font-bold">await</code> the operation, or explicitly attach an error catcher: <code className="font-mono font-bold">recordAuditLog(req).catch(logger.error)</code>.
            </div>
          </div>

          {/* TRAP 2 */}
          <div className="p-6 rounded-3xl border border-amber-200 dark:border-amber-950/60 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Production Trap 2
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Missing &ldquo;return&rdquo; in Callback Handlers
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Anti-Pattern:</strong> In callback-based code, forgetting to return after invoking the callback on error:
            </p>

            <pre className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-900 font-mono text-xs text-slate-800 dark:text-slate-200">
{`if (err) {
  callback(err); // BUG: Missing 'return'!
}
callback(null, data); // FIRES A SECOND TIME!`}
            </pre>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <strong>Production Bug:</strong> Causes the callback to execute twice! In Express, this triggers <code className="font-mono font-bold">Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client</code>.
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Rule:</strong> Always write <code className="font-mono font-bold">return callback(err);</code> or migrate legacy code to modern <code className="font-mono font-bold">async/await</code>!
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
                What does an &ldquo;async&rdquo; function return if you write: &ldquo;async function getNum() &#123; return 42; &#125;&rdquo;?
              </h3>
            </div>
            {q1 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q1 === 'B'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q1 === 'B' ? 'Correct' : 'Incorrect'}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1 text-sm sm:text-base">
            {[
              {
                id: 'A',
                label: 'The raw primitive number 42 synchronously.',
              },
              {
                id: 'B',
                label: 'A Promise that resolves to the number 42.',
              },
              {
                id: 'C',
                label: 'An Error-First Callback function.',
              },
              {
                id: 'D',
                label: 'An EventEmitter instance listening for the &apos;done&apos; event.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setQ1(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between text-sm sm:text-base ${
                  q1 === opt.id
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
                {q1 === opt.id &&
                  (opt.id === 'B' ? (
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
                q1 === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q1 === 'B' ? (
                <p>
                  <strong>Correct!</strong> In JavaScript, every function marked with the <code className="font-mono">async</code> keyword automatically wraps its return value in a resolved Promise (<code className="font-mono">Promise.resolve(42)</code>).
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option B is correct. An <code className="font-mono">async</code> function ALWAYS returns a Promise, even if you return a primitive value like a number or boolean.
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
                Why does &ldquo;items.forEach(async (item) =&gt; &#123; await save(item); &#125;)&rdquo; fail to wait for all items to be saved?
              </h3>
            </div>
            {q2 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q2 === 'A'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q2 === 'A' ? 'Correct' : 'Incorrect'}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1 text-sm sm:text-base">
            {[
              {
                id: 'A',
                label: 'Array.prototype.forEach is a synchronous higher-order function that completely ignores any Promise returned by its callback.',
              },
              {
                id: 'B',
                label: 'Arrays in Node.js cannot contain asynchronous callbacks.',
              },
              {
                id: 'C',
                label: 'forEach runs its callbacks in the libuv thread pool where async/await is unsupported.',
              },
              {
                id: 'D',
                label: 'V8 converts forEach loops into WebAssembly routines.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setQ2(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between text-sm sm:text-base ${
                  q2 === opt.id
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
                {q2 === opt.id &&
                  (opt.id === 'A' ? (
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
                q2 === 'A'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q2 === 'A' ? (
                <p>
                  <strong>Correct!</strong> <code className="font-mono">Array.prototype.forEach</code> is synchronous. It invokes your callback, discards the returned Promise, and immediately advances to the next item without awaiting anything. Use <code className="font-mono font-bold">for...of</code> or <code className="font-mono font-bold">Promise.all(items.map(...))</code>!
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option A is correct. <code className="font-mono">forEach</code> does not know about or await Promises.
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
                How should you optimize three independent 100ms database queries: &ldquo;getUser()&rdquo;, &ldquo;getSettings()&rdquo;, &ldquo;getFeed()&rdquo;?
              </h3>
            </div>
            {q3 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q3 === 'C'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q3 === 'C' ? 'Correct' : 'Incorrect'}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1 text-sm sm:text-base">
            {[
              {
                id: 'A',
                label: 'Execute them sequentially with three separate await statements (Total: 300ms).',
              },
              {
                id: 'B',
                label: 'Use process.nextTick() inside a recursive while loop.',
              },
              {
                id: 'C',
                label: 'Dispatch them concurrently using &ldquo;await Promise.all([getUser(), getSettings(), getFeed()])&rdquo; (Total: ~100ms).',
              },
              {
                id: 'D',
                label: 'Convert the database driver to use synchronous readFileSync.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setQ3(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between text-sm sm:text-base ${
                  q3 === opt.id
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
                {q3 === opt.id &&
                  (opt.id === 'C' ? (
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
                q3 === 'C'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q3 === 'C' ? (
                <p>
                  <strong>Correct!</strong> When asynchronous queries are independent of one another, running them concurrently with <code className="font-mono font-bold">Promise.all()</code> allows the OS network sockets to execute simultaneously. The total time drops from 300ms down to ~100ms.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option C is correct. Use <code className="font-mono">Promise.all</code> to run independent asynchronous operations concurrently.
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
                Question 4: Explain how async/await operates under the hood using Promises and Generators, and why an async function always returns a Promise.
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on continuation passing, V8 Generator suspension, and microtask queue integration, then click below to reveal the faculty model answer.
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
                  <strong>1. The Generator &amp; Coroutine Foundation:</strong>
                  <br />
                  Under the hood in the V8 engine, <code className="font-mono">async/await</code> is implemented as a state machine combining <strong>ES6 Generators (<code className="font-mono">function*</code> and <code className="font-mono">yield</code>)</strong> with <strong>Promises</strong>. When V8 encounters an <code className="font-mono">await expr</code>, it effectively executes <code className="font-mono">yield Promise.resolve(expr)</code>.
                </p>

                <p>
                  <strong>2. Suspension Without Thread Blocking:</strong>
                  <br />
                  The <code className="font-mono">yield</code> pauses the function&apos;s execution context, serializes its local variable environment to the V8 memory heap, and pops its stack frame off the Call Stack. The main JavaScript thread is immediately returned to the event loop to process other work.
                </p>

                <p>
                  <strong>3. Microtask Resumption:</strong>
                  <br />
                  When the awaited Promise settles, its <code className="font-mono">.then()</code> callback queues a microtask job. When the microtask queue executes, V8 calls the internal generator&apos;s <code className="font-mono">.next(value)</code> method, passing the resolved result back into the function and restoring its execution frame.
                </p>

                <p>
                  <strong>4. Why Async Always Returns a Promise:</strong>
                  <br />
                  Because an async function can suspend at any <code className="font-mono">await</code> point, it cannot produce its final return value synchronously to the caller. Therefore, the language specification dictates that entering an <code className="font-mono">async</code> function immediately instantiates and returns a Promise to the caller representing the function&apos;s eventual settled result.
                </p>

                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Engineering Formula: async/await = Generator Coroutine (Heap State Suspension) + Promise Microtask Resumption
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 8: MODULE 1 CAPSTONE GRADUATION BANNER */}
      <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-6 sm:p-8 rounded-3xl border border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 space-y-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                  Module 1 Completed
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  10 of 10 Concepts Mastered
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                Congratulations! You Mastered Node.js Fundamentals!
              </h3>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            You have successfully completed the foundational module of the 2027 Node.js Curriculum Roadmap:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
            {[
              '1. Node.js Intro',
              '2. Architecture',
              '3. Why Node.js',
              '4. JS Runtime vs Browser',
              '5. V8 Engine',
              '6. libuv Intro',
              '7. Execution Model',
              '8. Event-Driven',
              '9. Non-Blocking I/O',
              '10. Async Execution',
            ].map((topic, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{topic}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              You are now fully prepared to advance to <strong>Module 2: Node.js Installation &amp; CLI</strong>!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: PEDAGOGICAL LEARNING RULE */}
      <section className="space-y-6 pt-2">
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
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, advance to Concept 11 using the bottom navigation.
          </div>
        </div>
      </section>
    </div>
  );
}
