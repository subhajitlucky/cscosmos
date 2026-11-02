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
  Bell,
  Sliders,
  Volume2,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';
import { EventEmitterVisualizer } from './EventEmitterVisualizer';

export function Concept8Lesson() {
  // Interactive quiz state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [q4Revealed, setQ4Revealed] = useState<boolean>(false);

  // Architecture toggle state
  const [pattern, setPattern] = useState<'polling' | 'event'>('event');

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
            Node.js — Lesson 08/280
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
          Concept 8: Event-Driven Architecture
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          The foundational paradigm of Node.js. Discover how hardware interrupts inspired event-driven software, uncover the inner workings of <code className="font-mono">EventEmitter</code>, explore synchronous emission mechanics, and master memory-safe production event patterns.
        </p>
      </div>

      {/* SECTION 1: THE POLLING PROBLEM VS HARDWARE INTERRUPTS */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            First, Understand the Problem: Polling (Pull) vs. Interrupts (Push)
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When a program waits for external inputs (a network packet, a disk block read, or a user keystroke), computer science provides two fundamental ways to detect when that data is ready: <strong>Polling (The Pull Model)</strong> and <strong>Event-Driven Interrupts (The Push Model)</strong>.
          </p>

          {/* Interactive Pattern Toggle */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setPattern('polling')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                pattern === 'polling'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <RefreshCw className="w-4 h-4" /> The Polling Trap (Pull)
            </button>
            <button
              onClick={() => setPattern('event')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                pattern === 'event'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Zap className="w-4 h-4" /> Event-Driven Push (Node.js)
            </button>
          </div>

          {pattern === 'polling' ? (
            <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-4 transition-all">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5" /> The Polling Tax: CPU Burn vs. Latency Trade-Off
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                In a polling system, the consumer continuously queries the producer: &ldquo;Is the data ready yet? Is the data ready yet?&rdquo; in an infinite loop. This forces a destructive engineering dilemma:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                    Aggressive Polling (1ms Interval)
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Delivers immediate latency when data arrives, but burns <strong>100% of CPU cycles</strong> doing useless repetitive status checks.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                    Lazy Polling (500ms Interval)
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Saves CPU utilization, but adds up to <strong>500ms of artificial latency</strong> before the application realizes an event has already occurred.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4 transition-all">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-base">
                <Sparkles className="w-5 h-5" /> The Hardware Interrupt Heritage (Push)
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                CPUs never poll keyboards or network cards; peripheral hardware sends an <strong>Electrical Interrupt Request (IRQ)</strong>. The CPU immediately suspends background tasks, runs the Interrupt Service Routine (ISR), and resumes.
              </p>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Event-Driven Architecture in Node.js
                </span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Node.js mirrors this hardware model in application software: <strong>consumers register interest (callbacks) and enter sleep mode.</strong> When data arrives, the operating system and libuv &ldquo;interrupt&rdquo; the event loop, actively invoking the registered listeners with zero CPU waste!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: THE 3 CORE ACTORS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            The 3 Core Actors of Event-Driven Systems
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Any event-driven architecture consists of three completely decoupled participants:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Actor 1 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                1. Event Producer (Emitter)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The component that experiences a state change. It has <strong>zero knowledge</strong> of who is listening or what will happen next. It simply publishes a named event with optional payload data.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400">
                Examples: Incoming TCP connection, file read chunk, user login.
              </div>
            </div>

            {/* Actor 2 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Split className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                2. Event Channel / Registry
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The centralized routing mechanism (<code className="font-mono">EventEmitter</code> in memory, or Kafka/RabbitMQ in distributed systems). It maintains a lookup table of event names and registered handler arrays.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400">
                Lookups: O(1) dictionary key lookup for callback lists.
              </div>
            </div>

            {/* Actor 3 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                3. Event Consumer (Listener)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The reactive callback function. It registers interest in an event name and executes business logic when triggered, without blocking the producer or other consumers.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-600 dark:text-slate-400">
                Examples: Write HTTP response, log audit event, send alert email.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: UNDER THE HOOD OF EVENTEMITTER */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Under the Hood of <code className="font-mono text-emerald-600 dark:text-emerald-400">EventEmitter</code>
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            In Node.js, Event-Driven Architecture is implemented in the core module <code className="font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs sm:text-sm">node:events</code> via the <code className="font-mono font-bold text-emerald-600 dark:text-emerald-400">EventEmitter</code> class.
          </p>

          <p>
            Many developers believe <code className="font-mono">EventEmitter</code> is a complex asynchronous C++ construct. <strong>In reality, it is written in pure JavaScript and is shockingly simple:</strong>
          </p>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-3 font-mono text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-sans font-bold text-xs uppercase tracking-wider">
              Internal Memory Representation of an EventEmitter Instance:
            </span>
            <pre className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto text-slate-800 dark:text-slate-200">
{`const emitter = new EventEmitter();

// Behind the scenes, emitter maintains an internal dictionary:
emitter._events = {
  'data': [ [Function: onDataChunk], [Function: updateProgressBar] ],
  'error': [ [Function: handleError] ],
  'close': [Function: cleanupSocket]
};
emitter._maxListeners = 10;`}
            </pre>
          </div>

          <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm sm:text-base">
              <Zap className="w-4 h-4 shrink-0" />
              <span>Crucial Insight: emitter.emit() is SYNCHRONOUS!</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              When you call <code className="font-mono font-bold">emitter.emit(&apos;event&apos;, data)</code>, Node.js does <strong>NOT</strong> queue the callbacks into the event loop or thread pool! It simply iterates through the array <code className="font-mono">this._events[&apos;event&apos;]</code> and invokes each listener function <strong>synchronously on the current Call Stack</strong>.
            </p>
          </div>

          {/* Core EventEmitter APIs */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <code className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                emitter.on(event, listener)
              </code>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Appends the listener callback to the end of the listeners array for the specified event name.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <code className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                emitter.once(event, listener)
              </code>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Adds a one-time listener. As soon as it fires once, it automatically deregisters itself before executing.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <code className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                emitter.emit(event, ...args)
              </code>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Synchronously calls each listener registered for the event, passing the supplied arguments. Returns true if listeners existed.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <code className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                emitter.off(event, listener)
              </code>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Removes the specified listener from the listener array. Crucial for avoiding memory leaks in long-lived objects.
              </p>
            </div>
          </div>

          {/* DNA of Node.js Inheritance Diagram */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              EventEmitter is the DNA of Node.js Core Modules
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Nearly every major networking, I/O, and streaming class in Node.js inherits from <code className="font-mono">EventEmitter</code>:
            </p>

            <div className="grid sm:grid-cols-4 gap-2.5 font-mono text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Stream Subsystem</span>
                <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">Readable, Writable, Duplex, Transform</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-blue-600 dark:text-blue-400">HTTP Subsystem</span>
                <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">Server, ClientRequest, ServerResponse</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-purple-600 dark:text-purple-400">Socket Subsystem</span>
                <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">net.Socket, net.Server, tls.TLSSocket</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-amber-600 dark:text-amber-400">Process Object</span>
                <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">process.on(&apos;SIGTERM&apos;), uncaughtException</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SYNCHRONOUS VS ASYNCHRONOUS EMISSION & CONSTRUCTOR TRAP */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            The Constructor Race Condition &amp; Asynchronous Emission
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Because <code className="font-mono">emitter.emit()</code> is synchronous, calling it inside a class constructor introduces one of the most infamous junior engineering bugs in Node.js: <strong>The Constructor Race Condition</strong>.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-rose-600 dark:text-rose-400">
                The Bug: Synchronous Constructor Emission
              </span>
              <pre className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`class Database extends EventEmitter {
  constructor() {
    super();
    // BUG: Emits immediately!
    this.emit('connected');
  }
}

// Caller creates instance:
const db = new Database();
// Too late! 'connected' fired before
// this line could ever execute!
db.on('connected', () => {
  console.log('Ready!'); // NEVER RUNS!
});`}
              </pre>
            </div>

            <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                The Fix: Deferred Microtask Emission
              </span>
              <pre className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`class Database extends EventEmitter {
  constructor() {
    super();
    // FIX: Defer emission to next microtask
    process.nextTick(() => {
      this.emit('connected');
    });
  }
}

const db = new Database();
// Listener is registered synchronously:
db.on('connected', () => {
  console.log('Ready!'); // FIRES PERFECTLY!
});`}
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
            Interactive Code Lab: EventEmitter Playground
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Test real Event-Driven Architecture behaviors inside the simulator below. Switch presets to explore synchronous emission timing, constructor race-condition resolution, and memory leak warnings.
        </p>

        <NodeJsEditor
          title="Node.js EventEmitter Simulator (Node v22 LTS)"
          initialCode={`// Preset 1: Synchronous Emission Reality Check
const EventEmitter = require('node:events');
const orderHub = new EventEmitter();

console.log("1. Registering order listeners...");

orderHub.on('orderPlaced', (orderId, amount) => {
  console.log(\`3. [Listener 1] Invoice created for Order #\${orderId} ($ \${amount})\`);
});

orderHub.on('orderPlaced', (orderId) => {
  console.log(\`4. [Listener 2] Warehouse notified to dispatch Order #\${orderId}\`);
});

console.log("2. About to emit 'orderPlaced' synchronously...");
orderHub.emit('orderPlaced', 1042, 89.99);

console.log("5. Execution resumed after emit! Notice listeners ran synchronously.");`}
          presets={[
            {
              label: '1. Synchronous Emission Timing',
              code: `// Preset 1: Synchronous Emission Reality Check
const EventEmitter = require('node:events');
const orderHub = new EventEmitter();

console.log("1. Registering order listeners...");

orderHub.on('orderPlaced', (orderId, amount) => {
  console.log(\`3. [Listener 1] Invoice created for Order #\${orderId} ($ \${amount})\`);
});

orderHub.on('orderPlaced', (orderId) => {
  console.log(\`4. [Listener 2] Warehouse notified to dispatch Order #\${orderId}\`);
});

console.log("2. About to emit 'orderPlaced' synchronously...");
orderHub.emit('orderPlaced', 1042, 89.99);

console.log("5. Execution resumed after emit! Notice listeners ran synchronously.");`,
            },
            {
              label: '2. Constructor Race Condition Fix',
              code: `// Preset 2: Fixing Constructor Race Condition with process.nextTick
const EventEmitter = require('node:events');

class PaymentGateway extends EventEmitter {
  constructor() {
    super();
    console.log("1. PaymentGateway constructor executing...");
    
    // Defer emission so the caller has time to register listeners!
    process.nextTick(() => {
      console.log("3. Emitting 'ready' on nextTick microtask...");
      this.emit('ready', { status: 'ONLINE', latencyMs: 14 });
    });
  }
}

const gateway = new PaymentGateway();

// Synchronously attaching listener right after instantiation
gateway.on('ready', (info) => {
  console.log("4. Listener received 'ready' event! Gateway info:", info);
});

console.log("2. Script finished synchronous execution; now draining microtasks...");`,
            },
            {
              label: '3. Memory Leak Warning (MaxListeners)',
              code: `// Preset 3: Memory Leak Detection (MaxListenersExceededWarning)
const EventEmitter = require('node:events');
const socket = new EventEmitter();

console.log("Default Max Listeners limit:", socket.getMaxListeners());

// Adding 11 listeners to exceed the default limit of 10
for (let i = 1; i <= 11; i++) {
  socket.on('data', () => {
    // Simulated listener
  });
}

console.log("Total active 'data' listeners:", socket.listenerCount('data'));
console.log("Notice the MaxListenersExceededWarning generated in the console above!");`,
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
                  The Unhandled &apos;error&apos; Event Crash
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Anti-Pattern:</strong> In Node.js, the event name <code className="font-mono font-bold text-rose-600 dark:text-rose-400">&apos;error&apos;</code> has a special semantic status. If an emitter calls <code className="font-mono">emitter.emit(&apos;error&apos;, err)</code> and <em>zero</em> listeners are registered for <code className="font-mono">&apos;error&apos;</code>, Node.js treats it as an unhandled exception and <strong>instantly terminates the entire process</strong>!
            </p>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-300 space-y-1">
              <strong>Production Impact:</strong> A transient network socket reset or minor file stream read error crashes your entire backend web server pod, affecting thousands of innocent connected users.
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Fix:</strong> Always attach an error handler: <code className="font-mono font-bold">stream.on(&apos;error&apos;, (err) =&gt; ...)</code>, or use <code className="font-mono font-bold">stream.promises.pipeline()</code> which handles error propagation automatically.
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
                  Dangling Listener Closure Memory Leaks
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Anti-Pattern:</strong> Attaching an event listener to a long-lived global singleton (such as a database client, websocket broker, or config watcher) inside a short-lived request scope without ever calling <code className="font-mono">.off()</code>.
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <strong>The Silent Killer:</strong> Every request adds a new closure to the singleton&apos;s <code className="font-mono">_events</code> array. Because the singleton never gets garbage collected, the closure retains the request object, response object, and entire heap context forever.
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Fix:</strong> Use <code className="font-mono font-bold">emitter.once()</code> for single events, or modern AbortSignal: <code className="font-mono font-bold">emitter.on(&apos;event&apos;, fn, &#123; signal: req.signal &#125;)</code> to auto-remove when the connection closes.
            </div>
          </div>
        </div>

        {/* Interactive EventEmitter Memory Leak & Listener Visualizer */}
        <div className="pt-2">
          <EventEmitterVisualizer />
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
                When you call &ldquo;emitter.emit(&apos;data&apos;, payload)&rdquo;, in what order and execution context do the listeners run?
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
                label: 'Asynchronously on the next tick of the event loop Poll phase.',
              },
              {
                id: 'B',
                label: 'Synchronously in the order they were registered on the current V8 Call Stack.',
              },
              {
                id: 'C',
                label: 'In parallel across the 4 libuv background worker threads.',
              },
              {
                id: 'D',
                label: 'As microtasks queued into the Promise Job Queue.',
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
                  <strong>Correct!</strong> <code className="font-mono">emitter.emit()</code> is strictly synchronous. It iterates over the internal listener array and executes each function immediately on the current Call Stack before the next line of code runs.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option B is correct. Many developers mistakenly believe <code className="font-mono">emit</code> is asynchronous, but it executes registered listener callbacks synchronously!
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
                What happens if an EventEmitter emits an &apos;error&apos; event when there are zero &apos;error&apos; listeners registered?
              </h3>
            </div>
            {q2 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q2 === 'C'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q2 === 'C' ? 'Correct' : 'Incorrect'}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1 text-sm sm:text-base">
            {[
              {
                id: 'A',
                label: 'The error is silently ignored and garbage collected.',
              },
              {
                id: 'B',
                label: 'Node.js retries the operation 3 times automatically.',
              },
              {
                id: 'C',
                label: 'Node.js throws an unhandled exception, prints a stack trace, and crashes the process.',
              },
              {
                id: 'D',
                label: 'The error is automatically redirected to process.stdout as a warning.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setQ2(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between text-sm sm:text-base ${
                  q2 === opt.id
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
                {q2 === opt.id &&
                  (opt.id === 'C' ? (
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
                q2 === 'C'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q2 === 'C' ? (
                <p>
                  <strong>Correct!</strong> In Node.js, the <code className="font-mono">&apos;error&apos;</code> event is special. If no listener is listening for it, Node.js throws an unhandled exception, which prints the stack trace and crashes the entire process.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option C is correct. Always register an error listener on every EventEmitter or Stream to prevent crashing the Node process!
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
                Why does emitting an event synchronously inside a class constructor prevent external callers from receiving it?
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
                label: 'Because the event fires during instantiation before the caller can execute the line of code that attaches .on() to the new instance.',
              },
              {
                id: 'B',
                label: 'Constructors are executed in a separate V8 isolate where events are prohibited.',
              },
              {
                id: 'C',
                label: 'JavaScript classes do not support EventEmitter inheritance without TypeScript decorators.',
              },
              {
                id: 'D',
                label: 'Constructors clear the _events dictionary upon return.',
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
                  <strong>Correct!</strong> <code className="font-mono">const obj = new MyClass()</code> finishes the entire constructor before <code className="font-mono">obj.on(...)</code> can be called. Deferring the emission with <code className="font-mono">process.nextTick()</code> gives the caller a synchronous window to attach listeners!
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option A is correct. The caller cannot attach listeners to an object until after its constructor returns.
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
                Question 4: Analyze why Node.js chose Event-Driven Architecture over thread-based polling, and explain how EventEmitter synchronicity affects error handling and call stack traces.
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on stack preservation, O(1) listener lookups, and system concurrency, then click below to reveal the faculty model answer.
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
                  <strong>1. Architectural Rationale (Event-Driven vs. Polling):</strong>
                  <br />
                  Polling is inherently wasteful: it burns CPU cycles when idle and introduces latency when sleeping. By adopting an event-driven architecture based on reactive notifications, Node.js components remain asleep until triggered by the OS kernel (via <code className="font-mono">epoll</code>/<code className="font-mono">kqueue</code>). This yields near-zero baseline CPU consumption and immediate response times upon data arrival.
                </p>

                <p>
                  <strong>2. Why EventEmitter Emission is Synchronous:</strong>
                  <br />
                  Node.js deliberately designed <code className="font-mono">emitter.emit()</code> to be synchronous so that:
                </p>
                <ul className="list-disc list-inside space-y-1 font-mono text-xs sm:text-sm pl-2">
                  <li>Execution order across multiple listeners is strictly deterministic (FIFO).</li>
                  <li>Exceptions thrown inside listeners preserve the original caller&apos;s full Call Stack trace.</li>
                  <li>Emitters can return boolean values (<code className="font-mono">true</code> if listeners were called, <code className="font-mono">false</code> otherwise) synchronously to control execution branching.</li>
                </ul>

                <p>
                  <strong>3. The Error Handling Contract:</strong>
                  <br />
                  Because errors in asynchronous systems can easily be lost if dropped, Node.js enforces an architectural invariant: emitting an unhandled <code className="font-mono">&apos;error&apos;</code> event terminates the process by design. This forces engineers to write resilient software where every I/O stream, socket, and emitter must explicitly manage failure boundaries.
                </p>

                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Engineering Formula: EDA = Push (Hardware Interrupt Model) + Synchronous Dispatch + Strict Failure Boundaries
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
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 9 using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}
