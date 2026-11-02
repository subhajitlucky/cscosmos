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
  Download,
  FolderTree,
  Key,
  Laptop,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept11Lesson() {
  // Interactive quiz state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [q4Revealed, setQ4Revealed] = useState<boolean>(false);

  // Release cycle toggle state
  const [releaseFilter, setReleaseFilter] = useState<'lts' | 'current'>('lts');

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
            Node.js — Lesson 11/280 • Module 2 Start
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Level: Beginner
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
            Category: Node.js Installation &amp; CLI
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold">
            Estimated Time: 25–35 mins
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Concept 11: Installing Node.js
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Welcome to Module 2! Understand what the compiled Node.js binary actually contains, master the LTS vs. Current release strategy, compare installation pathways, and learn why professional engineers avoid root-level package managers.
        </p>
      </div>

      {/* SECTION 1: WHAT IS ACTUALLY BEING INSTALLED */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            First, Understand the Problem: What Is Being Installed?
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            When a developer downloads and installs Node.js, they are not installing a typical desktop application.
          </p>

          <p>
            Node.js installs as a <strong>single, statically linked C++ executable binary</strong> (<code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs sm:text-sm font-semibold">node</code> on Linux/macOS, <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs sm:text-sm font-semibold">node.exe</code> on Windows). This single binary packages the entire runtime ecosystem:
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                1. Google V8
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                JIT compiler and generational garbage collector translating JavaScript into native machine opcodes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                2. libuv Runtime
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Cross-platform asynchronous I/O multiplexer (<code className="font-mono">epoll/kqueue</code>) and thread pool.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                3. OpenSSL &amp; zlib
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Native cryptographic hashing, TLS/HTTPS cipher suites, and hardware-accelerated compression.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                4. Core JS Libraries
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pre-compiled built-in modules: <code className="font-mono">node:fs</code>, <code className="font-mono">node:http</code>, <code className="font-mono">node:net</code>, and npm.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              How the Shell Finds Node: The $PATH Environment Variable
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When you type <code className="font-mono font-bold">node app.js</code> in your terminal, your shell (Bash, Zsh, PowerShell) does not know what Node.js is. It traverses every directory listed in the colon-separated <code className="font-mono font-bold">$PATH</code> environment variable until it finds an executable file named <code className="font-mono">node</code>. Understanding this lookup is key to avoiding installation conflicts!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: LTS VS CURRENT RELEASE SCHEDULE */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            The Release Strategy: LTS (Long Term Support) vs. Current
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            The OpenJS Foundation maintains a strict, predictable release cadence governed by Semantic Versioning (<code className="font-mono">MAJOR.MINOR.PATCH</code>).
          </p>

          <p>
            Every 6 months (April and October), a new Major version is cut. The <strong>parity of the version number</strong> dictates whether it is suitable for enterprise production:
          </p>

          {/* Release Strategy Toggle */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setReleaseFilter('lts')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                releaseFilter === 'lts'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Even Versions: Active LTS (Production)
            </button>
            <button
              onClick={() => setReleaseFilter('current')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                releaseFilter === 'current'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Zap className="w-4 h-4" /> Odd Versions: Current (Experimental)
            </button>
          </div>

          {releaseFilter === 'lts' ? (
            <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-base">
                <ShieldCheck className="w-5 h-5" /> Even-Numbered Versions (v18, v20, v22, v24): The 30-Month Enterprise Guarantee
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Even versions are designated for <strong>Long Term Support (LTS)</strong>. They receive a codename from the periodic table (e.g., v18 <em>Hydrogen</em>, v20 <em>Iron</em>, v22 <em>Jod</em>).
              </p>
              <div className="grid sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Phase 1: Initial (6 Mos)
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Released in April; tested by community before LTS transition.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Phase 2: Active LTS (18 Mos)
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Transitions in October. Guaranteed backward compatibility, bug fixes, performance improvements.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Phase 3: Maintenance (12 Mos)
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Critical security patches only. Zero new features.
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-mono text-emerald-900 dark:text-emerald-200">
                Rule of Thumb: All mission-critical production servers, Dockerfiles, and CI/CD pipelines MUST use Active LTS.
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5" /> Odd-Numbered Versions (v19, v21, v23): Bleeding-Edge Testbeds
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Odd versions are released in October. They incorporate experimental V8 features and new ECMAScript proposals.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                    Short 6-Month Lifespan
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Odd versions <strong>NEVER</strong> enter LTS. As soon as the next even version ships in April, the odd version reaches End-Of-Life (EOL).
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                    Breaking Changes Risk
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    APIs may change or be removed between minor releases. <strong>Never deploy odd versions to production!</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: THE 4 INSTALLATION PATHWAYS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            The 4 Installation Pathways &amp; Architectural Trade-Offs
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            How you install Node.js determines your system security, upgrade ease, and ability to collaborate across multiple projects:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Method 1 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-500">Method 1</span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                  Not Recommended for Dev
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                OS Package Managers (<code className="font-mono">apt</code>, <code className="font-mono">brew</code>)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Installing via <code className="font-mono">apt install nodejs</code> writes to root directory <code className="font-mono">/usr/bin/node</code>. It is frequently years outdated, and installing global packages requires <code className="font-mono font-bold text-rose-600">sudo npm</code>, creating massive security hazards.
              </p>
            </div>

            {/* Method 2 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-500">Method 2</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                  Beginner Simple
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                Official Binary Installers (.pkg / .msi)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Downloaded from nodejs.org. Installs node and npm cleanly, but lacks multi-version switching: if Project A needs Node 18 and Project B needs Node 22, you cannot easily toggle between them.
              </p>
            </div>

            {/* Method 3 */}
            <div className="p-6 rounded-3xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Method 3
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  Professional Standard
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                Version Managers (<code className="font-mono">fnm</code>, <code className="font-mono">nvm</code>, <code className="font-mono">volta</code>)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Installs isolated Node.js binaries inside your user home directory (<code className="font-mono">~/.nvm</code> or <code className="font-mono">~/.fnm</code>). <strong>Zero sudo required!</strong> Switch versions instantly per repository using <code className="font-mono">.nvmrc</code> files.
              </p>
            </div>

            {/* Method 4 */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-500">Method 4</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                  Production Cloud Standard
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                OCI Container Images (Docker / Podman)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Uses official container images such as <code className="font-mono">node:22-alpine</code> or <code className="font-mono">node:22-bookworm-slim</code>. Guarantees 100% deterministic, immutable environments across developer machines and Kubernetes clusters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SANITY VERIFICATION COMMANDS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Sanity Verification &amp; Diagnostic Inspection
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            After installation, professional engineers run five verification commands in their terminal to ensure runtime integrity:
          </p>

          <div className="grid sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <code className="text-emerald-600 dark:text-emerald-400 font-bold">$ node -v</code>
              <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">
                Prints active Node version (e.g. <code className="font-mono">v22.11.0</code>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <code className="text-emerald-600 dark:text-emerald-400 font-bold">$ npm -v</code>
              <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">
                Verifies bundled Node Package Manager version (e.g. <code className="font-mono">10.9.0</code>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <code className="text-emerald-600 dark:text-emerald-400 font-bold">$ which node (or where node)</code>
              <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">
                Reveals the exact physical path on disk where the binary resides.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <code className="text-emerald-600 dark:text-emerald-400 font-bold">$ node -p &quot;process.arch&quot;</code>
              <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">
                Verifies native hardware compilation (<code className="font-mono">arm64</code> vs <code className="font-mono">x64</code>).
              </p>
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
            Interactive Code Lab: Runtime Diagnostics &amp; Release Validator
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Inspect Node.js installation internals directly in the simulator. Switch presets to explore the underlying engine versions, run an automated LTS release strategy validator, and simulate OS <code className="font-mono">PATH</code> resolution.
        </p>

        <NodeJsEditor
          title="Node.js Installation Inspector (Node v22 LTS)"
          initialCode={`// Preset 1: Complete Runtime & Engine Diagnostic
console.log("=== Node.js Installation Diagnostic ===");
console.log("Executable Path:", process.execPath);
console.log("Node Version:", process.version);
console.log("Target OS Platform:", process.platform);
console.log("CPU Architecture:", process.arch);

console.log("\\n=== Underlying Compiled C++ Engine Versions ===");
console.log("Google V8:", process.versions.v8);
console.log("libuv Concurrency Engine:", process.versions.uv);
console.log("OpenSSL Cryptography:", process.versions.openssl);
console.log("zlib Compression:", process.versions.zlib);
console.log("c-ares DNS:", process.versions.ares);`}
          presets={[
            {
              label: '1. Runtime & Engine Diagnostic',
              code: `// Preset 1: Complete Runtime & Engine Diagnostic
console.log("=== Node.js Installation Diagnostic ===");
console.log("Executable Path:", process.execPath);
console.log("Node Version:", process.version);
console.log("Target OS Platform:", process.platform);
console.log("CPU Architecture:", process.arch);

console.log("\\n=== Underlying Compiled C++ Engine Versions ===");
console.log("Google V8:", process.versions.v8);
console.log("libuv Concurrency Engine:", process.versions.uv);
console.log("OpenSSL Cryptography:", process.versions.openssl);
console.log("zlib Compression:", process.versions.zlib);
console.log("c-ares DNS:", process.versions.ares);`,
            },
            {
              label: '2. LTS Release Matrix Evaluator',
              code: `// Preset 2: Node.js LTS Release Strategy Evaluator
function evaluateNodeRelease(versionStr) {
  const major = parseInt(versionStr.replace(/^v/, '').split('.')[0], 10);
  const isEven = major % 2 === 0;

  if (isEven) {
    return {
      version: versionStr,
      type: "ACTIVE_LTS",
      productionReady: true,
      advice: "Approved for production! Supported with 30-month enterprise maintenance."
    };
  } else {
    return {
      version: versionStr,
      type: "CURRENT_EXPERIMENTAL",
      productionReady: false,
      advice: "Experimental testbed only! Reaches EOL in 6 months. Do not use in production."
    };
  }
}

console.log("Node v22 Evaluation:", evaluateNodeRelease("v22.11.0"));
console.log("Node v23 Evaluation:", evaluateNodeRelease("v23.2.0"));
console.log("Current Runtime Evaluation:", evaluateNodeRelease(process.version));`,
            },
            {
              label: '3. Shell PATH Resolution Diagnostic',
              code: `// Preset 3: Shell PATH Traversal Simulator
console.log("=== Inspecting Shell Environment PATH ===");
const pathEnv = process.env.PATH || "";
const directories = pathEnv.split(":");

console.log("Total PATH directories configured:", directories.length);
directories.forEach((dir, idx) => {
  console.log(\`  [\${idx + 1}] \${dir}\`);
});

const isUserSpace = directories.some(d => d.includes('.nvm') || d.includes('.fnm'));
console.log("\\nUsing User-Space Version Manager (Safe):", isUserSpace ? "YES (Secure)" : "NO (Root /usr/bin)");`,
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
                  The Fatal &ldquo;sudo npm install -g&rdquo; Security Risk
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Anti-Pattern:</strong> When developers install Node through system <code className="font-mono">apt</code>, global directories belong to root (<code className="font-mono">/usr/local/lib/node_modules</code>). To install CLIs, developers run <code className="font-mono font-bold text-rose-600">sudo npm install -g &lt;package&gt;</code>.
            </p>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-300 space-y-1">
              <strong>The Critical Danger:</strong> npm packages can run arbitrary lifecycle shell scripts (<code className="font-mono">preinstall</code>, <code className="font-mono">postinstall</code>). Running with <code className="font-mono">sudo</code> gives an untrusted third-party npm package full root administrative privileges to execute malware, steal SSH keys, or alter system files!
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Fix:</strong> <strong>NEVER use sudo with npm!</strong> Install Node.js via user-space version managers (<code className="font-mono font-bold">fnm</code> or <code className="font-mono font-bold">nvm</code>), or run CLIs on-demand using <code className="font-mono font-bold">npx &lt;package&gt;</code>.
            </div>
          </div>

          {/* TRAP 2 */}
          <div className="p-6 rounded-3xl border border-amber-200 dark:border-amber-950/60 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Production Trap 2
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  The Rosetta 2 Architecture Mismatch (x64 on ARM64)
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Silent Killer:</strong> On modern Apple Silicon Macs (M1/M2/M3/M4), migrating terminal profiles from older Intel machines often causes Node.js to be installed as an Intel <code className="font-mono">x86_64</code> binary running under Rosetta 2 binary translation.
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <strong>Performance Loss:</strong> You lose 30% to 50% CPU performance, and compiling native C++ addons (<code className="font-mono">node-gyp</code>) fails mysteriously due to incompatible dynamic library architectures.
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Fix:</strong> Run <code className="font-mono font-bold">node -p &quot;process.arch&quot;</code>. On Apple Silicon, it must print <code className="font-mono font-bold">arm64</code>. If it prints <code className="font-mono">x64</code>, reinstall Node natively.
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
                Why do enterprise production systems mandate using even-numbered Node.js versions (e.g. v20, v22) instead of odd-numbered versions (e.g. v21, v23)?
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
                label: 'Odd-numbered versions do not support the npm package manager.',
              },
              {
                id: 'B',
                label: 'Even versions use C++ while odd versions use Rust.',
              },
              {
                id: 'C',
                label: 'Even versions receive Long Term Support (LTS) with 30 months of guaranteed security and stability; odd versions are short-lived experimental releases that reach EOL in 6 months.',
              },
              {
                id: 'D',
                label: 'Odd versions are only compiled for 32-bit CPU architectures.',
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
                  <strong>Correct!</strong> Even-numbered releases transition to Active LTS and receive 30 months of official support. Odd-numbered releases are testbeds that reach End-Of-Life within 6 months.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option C is correct. Even versions are designated as Long Term Support (LTS) releases.
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
                Why is running &ldquo;sudo npm install -g &lt;package&gt;&rdquo; considered an extreme security vulnerability?
              </h3>
            </div>
            {q2 && (
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
                  q2 === 'B'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                }`}
              >
                {q2 === 'B' ? 'Correct' : 'Incorrect'}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1 text-sm sm:text-base">
            {[
              {
                id: 'A',
                label: 'sudo increases the size of node_modules by 500MB.',
              },
              {
                id: 'B',
                label: 'npm packages can execute arbitrary pre/post-install scripts; running with sudo grants untrusted code full root administrative control over your entire OS.',
              },
              {
                id: 'C',
                label: 'Linux kernels automatically disable V8 optimizations when executed under root.',
              },
              {
                id: 'D',
                label: 'sudo prevents npm from verifying SSL certificates.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setQ2(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between text-sm sm:text-base ${
                  q2 === opt.id
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
                {q2 === opt.id &&
                  (opt.id === 'B' ? (
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
                q2 === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
              }`}
            >
              {q2 === 'B' ? (
                <p>
                  <strong>Correct!</strong> Running npm with <code className="font-mono">sudo</code> grants untrusted package lifecycle scripts full root privileges to access sensitive files, install backdoors, or tamper with OS libraries.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option B is correct. Lifecycle scripts in npm packages execute with root permissions when invoked under <code className="font-mono">sudo</code>.
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
                How does the operating system shell locate the &ldquo;node&rdquo; executable when you type &ldquo;node server.js&rdquo;?
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
                label: 'It scans each directory listed in the PATH environment variable in order from left to right until it finds an executable file named &quot;node&quot;.',
              },
              {
                id: 'B',
                label: 'It performs a DNS query to nodejs.org to locate the binary.',
              },
              {
                id: 'C',
                label: 'It checks the browser cache for compiled JavaScript bytecode.',
              },
              {
                id: 'D',
                label: 'The shell always hardcodes execution to /usr/bin/node.',
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
                  <strong>Correct!</strong> The shell walks through the directories in <code className="font-mono">$PATH</code> from left to right. The first directory containing an executable file named <code className="font-mono">node</code> wins. This is how version managers (<code className="font-mono">nvm</code>/<code className="font-mono">fnm</code>) prepend their version paths to override global system installations.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option A is correct. The shell resolves executables sequentially through the directories in the <code className="font-mono">PATH</code> environment variable.
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
                Question 4: Analyze what components are packaged inside the Node.js installation binary, and explain why enterprise teams mandate user-space version managers over OS package managers.
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on statically linked C++ engines, root filesystem separation, and project-level version isolation, then click below to reveal the faculty model answer.
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
                  <strong>1. The Packaged C++ Runtime Binary:</strong>
                  <br />
                  The Node.js binary is a self-contained executable. It is statically linked with Google V8 (bytecode execution &amp; GC), libuv (event loop &amp; I/O multiplexing), OpenSSL (cryptography &amp; TLS), zlib (compression), and c-ares (asynchronous DNS), along with C++ binding wrappers and the JavaScript standard library.
                </p>

                <p>
                  <strong>2. Why OS Package Managers (<code className="font-mono">apt</code>, <code className="font-mono">yum</code>) Fail for Modern Development:</strong>
                  <br />
                  Operating system distribution repositories prioritize long stability cycles over language ecosystem updates. As a result, <code className="font-mono">apt install nodejs</code> often installs versions that are years behind Active LTS. Furthermore, OS packages install to <code className="font-mono">/usr/bin</code>, forcing developers to use <code className="font-mono">sudo npm</code>, which exposes the system to malicious package lifecycle scripts.
                </p>

                <p>
                  <strong>3. The Version Manager Paradigm (<code className="font-mono">fnm</code>, <code className="font-mono">nvm</code>):</strong>
                  <br />
                  Professional engineering organizations mandate version managers because:
                </p>
                <ul className="list-disc list-inside space-y-1 font-mono text-xs sm:text-sm pl-2">
                  <li>Binaries reside in user-space (<code className="font-mono">~/.nvm/versions</code>), completely eliminating the need for <code className="font-mono">sudo</code>.</li>
                  <li>Different projects can automatically switch between Node v18, v20, and v22 via repository <code className="font-mono">.nvmrc</code> configuration files.</li>
                  <li>Developers can instantly test compatibility against upcoming LTS versions before production migration.</li>
                </ul>

                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Engineering Formula: Safe Installation = User-Space Isolation (fnm/nvm) + Active LTS (Even SemVer) + Zero Sudo
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
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 12 using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}
