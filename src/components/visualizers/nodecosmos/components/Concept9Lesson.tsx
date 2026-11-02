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
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept9Lesson() {
  // Interactive quiz state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [q4Revealed, setQ4Revealed] = useState<boolean>(false);

  // Latency perspective scale toggle
  const [timeScale, setTimeScale] = useState<'cpu' | 'human'>('human');

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
            Node.js — Lesson 09/280
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
          Concept 9: Blocking vs. Non-Blocking I/O
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          The physical latency gap between CPUs, memory, disks, and networks. Master POSIX <code className="font-mono">O_NONBLOCK</code> file descriptors, the difference between CPU-bound and I/O-bound blocking, and how Node.js achieves high concurrency without thread stalls.
        </p>
      </div>

      {/* SECTION 1: THE PHYSICAL LATENCY GAP */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            First, Understand the Problem: The Physical Latency Gap
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Why does blocking I/O destroy server throughput? The answer lies in the monumental physical speed difference between a CPU executing instructions and an external device (SSD, spinning disk, or network cable) delivering data.
          </p>

          <p>
            Computer systems pioneer Peter Norvig and engineer Jeff Dean published the classic &ldquo;Numbers Every Programmer Should Know.&rdquo; To truly grasp what blocking means, we can scale <strong>1 CPU cycle (0.3 nanoseconds)</strong> up to <strong>1 human second</strong>:
          </p>

          {/* Scale Toggle */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTimeScale('human')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                timeScale === 'human'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Timer className="w-4 h-4" /> Scaled to Human Time (1 Cycle = 1 Sec)
            </button>
            <button
              onClick={() => setTimeScale('cpu')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                timeScale === 'cpu'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Gauge className="w-4 h-4" /> Raw Physical Nanoseconds
            </button>
          </div>

          {/* Latency Comparison Table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-mono text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="p-4 sm:px-6">Hardware Subsystem</th>
                  <th className="p-4 sm:px-6">Raw Duration</th>
                  <th className="p-4 sm:px-6">Human Scaled Equivalent</th>
                  <th className="p-4 sm:px-6">Blocking Consequence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="p-4 sm:px-6 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    L1 CPU Cache Reference
                  </td>
                  <td className="p-4 sm:px-6 font-mono text-slate-600 dark:text-slate-400">0.5 ns</td>
                  <td className="p-4 sm:px-6 font-semibold text-emerald-600 dark:text-emerald-400">
                    {timeScale === 'human' ? '1.5 seconds' : '0.5 ns'}
                  </td>
                  <td className="p-4 sm:px-6 text-slate-600 dark:text-slate-400">Instantaneous register load</td>
                </tr>

                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="p-4 sm:px-6 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    Main Memory (RAM) Read
                  </td>
                  <td className="p-4 sm:px-6 font-mono text-slate-600 dark:text-slate-400">100 ns</td>
                  <td className="p-4 sm:px-6 font-semibold text-blue-600 dark:text-blue-400">
                    {timeScale === 'human' ? '5.5 minutes' : '100 ns'}
                  </td>
                  <td className="p-4 sm:px-6 text-slate-600 dark:text-slate-400">Fast in-memory cache lookup</td>
                </tr>

                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="p-4 sm:px-6 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    NVMe Solid State Drive (SSD)
                  </td>
                  <td className="p-4 sm:px-6 font-mono text-slate-600 dark:text-slate-400">150,000 ns (150 µs)</td>
                  <td className="p-4 sm:px-6 font-semibold text-purple-600 dark:text-purple-400">
                    {timeScale === 'human' ? '5.7 days' : '150 µs'}
                  </td>
                  <td className="p-4 sm:px-6 text-slate-600 dark:text-slate-400">Thousands of CPU cycles lost if blocked</td>
                </tr>

                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="p-4 sm:px-6 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Network className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    Network Round Trip (SF to London)
                  </td>
                  <td className="p-4 sm:px-6 font-mono text-slate-600 dark:text-slate-400">150,000,000 ns (150 ms)</td>
                  <td className="p-4 sm:px-6 font-semibold text-amber-600 dark:text-amber-400">
                    {timeScale === 'human' ? '15.8 years!' : '150 ms'}
                  </td>
                  <td className="p-4 sm:px-6 text-rose-600 dark:text-rose-400 font-semibold">
                    Complete server paralysis if blocked!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-sm font-semibold flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>The Takeaway:</strong> If the single JavaScript thread executed a synchronous network fetch or disk read, it would sit completely frozen for the human equivalent of <strong>weeks or years</strong>, unable to process any other HTTP client!
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: POSIX UNDERPINNINGS (O_NONBLOCK & EAGAIN) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Operating System Mechanics: POSIX <code className="font-mono text-emerald-600 dark:text-emerald-400">O_NONBLOCK</code>
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            At the operating system level (Linux, macOS, BSD), every open network socket and file is represented by a numeric <strong>File Descriptor (FD)</strong>.
          </p>

          <p>
            By default, POSIX file descriptors operate in <strong>blocking mode</strong>. When a program invokes the <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs sm:text-sm font-semibold">read(fd, buffer, length)</code> system call on a socket with no incoming data, the OS kernel puts the calling thread into an uninterruptible sleep state until packets arrive from the network interface card.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Blocking Mode */}
            <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                1. Standard Blocking Syscall
              </span>
              <pre className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`// Default blocking socket read:
ssize_t bytes = read(socket_fd, buf, 1024);

// If no packet is in kernel buffer:
// 1. Thread execution HALTS immediately.
// 2. OS scheduler removes thread from CPU.
// 3. Thread sleeps until packet arrives.`}
              </pre>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If Node.js did this, the entire main thread would freeze for all users during every database query!
              </p>
            </div>

            {/* Non-Blocking Mode */}
            <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-950/60 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                2. POSIX Non-Blocking (O_NONBLOCK)
              </span>
              <pre className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
{`// Put socket into non-blocking mode:
fcntl(socket_fd, F_SETFL, O_NONBLOCK);

ssize_t bytes = read(socket_fd, buf, 1024);
// If no data: returns IMMEDIATELY with -1
// Sets errno = EAGAIN or EWOULDBLOCK!`}
              </pre>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The call returns in nanoseconds with an error code: <em>&ldquo;Resource temporarily unavailable—try again later!&rdquo;</em>
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              Why Node.js Doesn&apos;t Waste CPU on Polling Loops
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              If an application simply called <code className="font-mono">read()</code> in a <code className="font-mono">while(bytes == -1)</code> loop, it would spike the CPU to 100%. Instead, <strong>libuv registers the non-blocking FD with epoll (Linux) or kqueue (macOS)</strong>. The OS kernel itself notifies libuv only when data is ready to be drained, consuming <strong>zero CPU cycles</strong> while waiting!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: NODE.JS API SPLIT: SYNC VS ASYNC */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            The Node.js API Duality: Synchronous vs. Asynchronous
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            Node.js provides two parallel sets of APIs across its standard libraries:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                <FileText className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Synchronous (Blocking) APIs
              </div>
              <ul className="space-y-1.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                <li><code className="text-rose-600 dark:text-rose-400 font-bold">fs.readFileSync(path)</code></li>
                <li><code className="text-rose-600 dark:text-rose-400 font-bold">fs.writeFileSync(path, data)</code></li>
                <li><code className="text-rose-600 dark:text-rose-400 font-bold">crypto.pbkdf2Sync(...)</code></li>
                <li><code className="text-rose-600 dark:text-rose-400 font-bold">zlib.gzipSync(...)</code></li>
                <li><code className="text-rose-600 dark:text-rose-400 font-bold">child_process.execSync(...)</code></li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pushes directly onto the Call Stack. Completely blocks the event loop tick until completion.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Asynchronous (Non-Blocking) APIs
              </div>
              <ul className="space-y-1.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                <li><code className="text-emerald-600 dark:text-emerald-400 font-bold">fs.promises.readFile(path)</code></li>
                <li><code className="text-emerald-600 dark:text-emerald-400 font-bold">fs.promises.writeFile(...)</code></li>
                <li><code className="text-emerald-600 dark:text-emerald-400 font-bold">crypto.pbkdf2(...)</code></li>
                <li><code className="text-emerald-600 dark:text-emerald-400 font-bold">net.connect() / http.get()</code></li>
                <li><code className="text-emerald-600 dark:text-emerald-400 font-bold">child_process.exec(...)</code></li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Registers work with OS kernel or libuv thread pool. Returns immediately and fires callback/promise when ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CPU-BOUND VS I/O-BOUND BLOCKING */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            CPU-Bound Blocking vs. I/O-Bound Blocking: The Golden Rule
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            A widespread misconception among intermediate developers is: <em>&ldquo;If I use async/await, my code is non-blocking.&rdquo;</em> <strong>This is completely incorrect!</strong>
          </p>

          <p>
            You must understand the profound distinction between two entirely different types of blocking:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base">
                <Network className="w-5 h-5" /> 1. I/O-Bound Blocking
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Waiting on external devices: database sockets, disk sectors, or web services.
              </p>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                Solved 100% by Node.js non-blocking APIs and libuv event polling!
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm sm:text-base">
                <Cpu className="w-5 h-5" /> 2. CPU-Bound Blocking
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Heavy computations executed directly on the single V8 Call Stack: <code className="font-mono">JSON.parse()</code> on 100MB strings, matrix calculations, synchronous crypto, or recursive algorithms.
              </p>
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs font-mono text-rose-900 dark:text-rose-300">
                async/await CANNOT fix this! Only worker_threads or cluster processes can solve CPU blocking.
              </div>
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
            Interactive Code Lab: Blocking vs. Non-Blocking Simulator
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Experience the difference in real-time. Use the three engineering presets below to observe how blocking CPU code paralyzes timers versus how non-blocking asynchronous execution interleaves smoothly.
        </p>

        <NodeJsEditor
          title="Blocking vs Non-Blocking Simulator (Node v22 LTS)"
          initialCode={`// Preset 1: The Event Loop Freezing Demonstration
console.log("1. Setting up a timer to fire after 100ms...");

setTimeout(() => {
  console.log("4. Timer callback fired! (Notice when it actually ran)");
}, 100);

console.log("2. Simulating a blocking synchronous computation (300ms)...");

// Simulating synchronous blocking I/O or heavy computation:
const start = Date.now();
while (Date.now() - start < 300) {
  // Freezing the single JavaScript Call Stack
}

console.log("3. Blocking computation complete after", Date.now() - start, "ms");
// Even though the timer expired at 100ms, it could not run until 300ms!`}
          presets={[
            {
              label: '1. Event Loop Freezing Demo',
              code: `// Preset 1: The Event Loop Freezing Demonstration
console.log("1. Setting up a timer to fire after 100ms...");

setTimeout(() => {
  console.log("4. Timer callback fired! (Notice when it actually ran)");
}, 100);

console.log("2. Simulating a blocking synchronous computation (300ms)...");

// Simulating synchronous blocking I/O or heavy computation:
const start = Date.now();
while (Date.now() - start < 300) {
  // Freezing the single JavaScript Call Stack
}

console.log("3. Blocking computation complete after", Date.now() - start, "ms");
// Even though the timer expired at 100ms, it could not run until 300ms!`,
            },
            {
              label: '2. Non-Blocking Interleaving',
              code: `// Preset 2: Non-Blocking Asynchronous Interleaving
console.log("1. Dispatching 3 concurrent non-blocking tasks...");

function simulateNonBlockingQuery(id, delayMs) {
  setTimeout(() => {
    console.log(\`Task #\${id} finished in \${delayMs}ms\`);
  }, delayMs);
}

// 3 tasks started concurrently:
simulateNonBlockingQuery("A (Fast Cache)", 50);
simulateNonBlockingQuery("B (Database Query)", 150);
simulateNonBlockingQuery("C (Disk Read)", 100);

console.log("2. Main thread is immediately free to serve other requests!");`,
            },
            {
              label: '3. The Asynchronous Trap',
              code: `// Preset 3: The Asynchronous CPU-Bound Trap
console.log("1. Initiating asynchronous task...");

setTimeout(() => {
  console.log("3. Asynchronous callback reached! Now starting heavy synchronous JSON parsing...");
  
  const start = Date.now();
  while (Date.now() - start < 250) {
    // Heavy CPU work inside async callback!
  }
  console.log("4. Heavy work done inside callback after", Date.now() - start, "ms");
}, 50);

setTimeout(() => {
  console.log("5. Independent client request processed (Delayed by Step 4!)");
}, 100);

console.log("2. Script setup complete.");`,
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
                  Startup readFileSync vs. Request readFileSync
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Golden Nuance:</strong> <code className="font-mono">fs.readFileSync()</code> is completely acceptable during server boot time (reading SSL certs, env files, or loading config before listening on ports).
            </p>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-300 space-y-1">
              <strong>The Fatal Disaster:</strong> Calling <code className="font-mono">fs.readFileSync()</code> inside an Express/Fastify route handler (<code className="font-mono">app.get(&apos;/download&apos;, ...)</code>). Under 100 concurrent requests, each request blocks the thread for 15ms, creating a catastrophic 1,500ms latency queue for all users!
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Fix:</strong> Never use <code className="font-mono font-bold">*Sync()</code> methods inside request handlers. Always use <code className="font-mono font-bold">fs.promises.readFile()</code> or streams (<code className="font-mono font-bold">fs.createReadStream()</code>).
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
                  The &ldquo;Zalgo&rdquo; Antipattern (Mixed Sync/Async)
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Anti-Pattern:</strong> Writing a utility function that invokes its callback synchronously when data is in cache, but asynchronously when fetching from disk.
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <strong>The Nightmare Bug:</strong> Callers cannot predict whether code after the function call executes before or after the callback! This causes race conditions, uninitialized state bugs, and unpredictable control flow.
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Rule:</strong> &ldquo;Never unleash Zalgo!&rdquo; If an API is asynchronous, wrap cached results in <code className="font-mono font-bold">queueMicrotask()</code> or <code className="font-mono font-bold">process.nextTick()</code> to guarantee 100% asynchronous consistency.
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
                When a POSIX socket file descriptor is configured with O_NONBLOCK and no data is ready to be read, what does the read() system call do?
              </h3>
            </div>
            {q1 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q1 === 'C'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q1 === 'C' ? 'Correct' : 'Incorrect'}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1 text-sm sm:text-base">
            {[
              {
                id: 'A',
                label: 'It puts the calling thread into an uninterruptible kernel sleep until data arrives.',
              },
              {
                id: 'B',
                label: 'It spawns a new OS background worker thread automatically.',
              },
              {
                id: 'C',
                label: 'It returns immediately with -1 and sets errno to EAGAIN or EWOULDBLOCK.',
              },
              {
                id: 'D',
                label: 'It raises a SIGSEGV segmentation fault in the host process.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setQ1(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between text-sm sm:text-base ${
                  q1 === opt.id
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
                {q1 === opt.id &&
                  (opt.id === 'C' ? (
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
                q1 === 'C'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q1 === 'C' ? (
                <p>
                  <strong>Correct!</strong> In POSIX non-blocking mode, <code className="font-mono">read()</code> never sleeps. If the kernel buffer is empty, it returns immediately with <code className="font-mono">-1</code> and sets <code className="font-mono">errno = EAGAIN</code> (Try again later).
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option C is correct. Non-blocking sockets return immediately with <code className="font-mono">EAGAIN</code> instead of putting the thread to sleep.
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
                Why is &ldquo;fs.readFileSync()&rdquo; acceptable during application startup, but strictly prohibited inside an HTTP request handler?
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
                label: 'During startup there are no connected users to block; in an HTTP handler, it freezes the entire single thread for all concurrent users.',
              },
              {
                id: 'B',
                label: 'V8 disables synchronous file operations after 5 seconds of uptime.',
              },
              {
                id: 'C',
                label: 'readFileSync uses the thread pool during startup but uses the main thread during runtime.',
              },
              {
                id: 'D',
                label: 'HTTP handlers require WebAssembly to access the local file system.',
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
                  <strong>Correct!</strong> During server initialization, synchronous reads ensure necessary certificates and configuration are loaded before listening for traffic. Inside request handlers, however, synchronous reads block the event loop, freezing all other concurrent connections.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option A is correct. Synchronous operations are acceptable only when no concurrent requests are active.
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
                Can wrapping a heavy CPU computation (like JSON.parse on 100MB) inside an async/await function prevent it from blocking the Event Loop?
              </h3>
            </div>
            {q3 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q3 === 'B'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q3 === 'B' ? 'Correct' : 'Incorrect'}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1 text-sm sm:text-base">
            {[
              {
                id: 'A',
                label: 'Yes, because async/await automatically moves code to the libuv thread pool.',
              },
              {
                id: 'B',
                label: 'No, because async/await only yields on Promise resolution; the synchronous CPU execution still runs entirely on the main JavaScript thread.',
              },
              {
                id: 'C',
                label: 'Yes, V8 runs async functions in parallel WebAssembly threads.',
              },
              {
                id: 'D',
                label: 'No, because JavaScript does not support JSON parsing inside async functions.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setQ3(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between text-sm sm:text-base ${
                  q3 === opt.id
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
                {q3 === opt.id &&
                  (opt.id === 'B' ? (
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
                q3 === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q3 === 'B' ? (
                <p>
                  <strong>Correct!</strong> <code className="font-mono">async/await</code> is syntactic sugar over Promises. It does not spawn background threads. CPU-heavy code still runs on the single JavaScript thread and must be offloaded to <code className="font-mono font-bold">worker_threads</code>.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option B is correct. <code className="font-mono">async/await</code> does not make CPU-bound execution asynchronous or multi-threaded.
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
                Question 4: Analyze the latency differences between CPU cache, RAM, disk, and network, and explain how Node.js prevents single-threaded stalling under high I/O latency.
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on human-scaled latency, kernel demultiplexing, and event loop phase transitions, then click below to reveal the faculty model answer.
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
                  <strong>1. The Physical Latency Reality:</strong>
                  <br />
                  A modern CPU core completes instructions in ~0.3 nanoseconds. In comparison, waiting for an NVMe SSD takes ~150,000ns (500,000 CPU cycles), and waiting for a cross-continental network packet takes ~150,000,000ns (500,000,000 CPU cycles). Scaled to human time where 1 cycle = 1 second, a network request takes <strong>almost 16 years</strong>.
                </p>

                <p>
                  <strong>2. Preventing the Single-Thread Stall:</strong>
                  <br />
                  In a blocking architecture, the thread goes dormant in the OS kernel scheduler for the entire 16 human years. In Node.js, the main thread initiates the I/O operation asynchronously:
                </p>
                <ul className="list-disc list-inside space-y-1 font-mono text-xs sm:text-sm pl-2">
                  <li>For network I/O: Socket FDs are marked non-blocking (<code className="font-mono font-bold">O_NONBLOCK</code>) and registered with kernel demultiplexers (<code className="font-mono">epoll</code>/<code className="font-mono">kqueue</code>).</li>
                  <li>For disk I/O: Operations are offloaded to libuv&apos;s background C++ worker thread pool.</li>
                </ul>

                <p>
                  <strong>3. Event Loop Continuation:</strong>
                  <br />
                  The main JavaScript thread immediately exits the initiate function and continues running other code on the Call Stack or enters the Poll phase to accept new incoming HTTP connections. When the external I/O completes, the OS or worker pool notifies libuv, which queues the completion callback into the Poll phase. The single thread is thus never idle and never blocked by physical device latency!
                </p>

                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Engineering Formula: High Throughput = Zero Blocking Wait States &times; Continuous Event Loop Saturation
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
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 10 using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}
