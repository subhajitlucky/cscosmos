'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Eye,
  Flame,
  FolderTree,
  GitBranch,
  Settings,
  Workflow,
  ArrowRight,
  ShieldCheck,
  Binary,
  Code2,
  Zap,
  Repeat,
  Compass,
} from 'lucide-react';
import { NodeJsEditor } from './NodeJsEditor';

export function Concept12Lesson() {
  // Interactive quiz state
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [q4Revealed, setQ4Revealed] = useState<boolean>(false);

  // Architecture mechanism interactive tab state
  const [activeMechanism, setActiveMechanism] = useState<'path' | 'symlink' | 'shim'>('path');

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
            Node.js — Lesson 12/280 • Module 2
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
          Concept 12: Node.js Version Management
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Why single global Node installations fail in modern engineering organizations, how version managers manipulate shell environment variables and filesystem symlinks, and how to guarantee absolute runtime parity across local machines, CI/CD runners, and production clusters.
        </p>
      </div>

      {/* SECTION 1: THE MULTI-VERSION CONUNDRUM */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            1
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            First, Understand the Problem: The Multi-Version Conundrum
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          <p>
            In a realistic professional engineering workflow, a software engineer rarely works on a single codebase in isolation. Consider a typical workday:
          </p>

          <div className="grid md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">Project Alpha</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-amber-500/10 text-amber-600 font-bold">Node v18 LTS</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Legacy Enterprise Monolith</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Built in 2022. Uses Webpack 4 and older native C++ bindings. Upgrading to Node 20+ breaks build tooling dependencies.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400">Project Beta</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-500/10 text-blue-600 font-bold">Node v20 LTS</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Customer API Microservice</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Production-deployed backend relying on Node 20&apos;s native test runner (<code className="font-mono">node:test</code>) and stable Fetch API.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">Project Gamma</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/10 text-emerald-600 font-bold">Node v22 LTS</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Next-Gen Realtime Platform</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Greenfield service utilizing native <code className="font-mono">node:sqlite</code>, <code className="font-mono">require(esm)</code>, and WebSocket client support.
              </p>
            </div>
          </div>

          <p className="pt-2">
            If you install Node.js as a single global binary in <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs sm:text-sm">/usr/bin/node</code>, switching between these projects requires constantly uninstalling and reinstalling entire packages with administrator privileges.
          </p>

          <p>
            Even worse, running Project Alpha under Node 22 will crash your builds because major Node.js versions introduce breaking changes in two critical dimensions:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
                <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>1. Language Syntax &amp; Core API Breaks</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                New V8 versions introduce newer syntax (e.g., Top-Level Await in Node 14.8, <code className="font-mono">Promise.withResolvers</code> in Node 22). Core APIs also deprecate old patterns (e.g., <code className="font-mono">url.parse()</code> replaced by WHATWG <code className="font-mono">new URL()</code>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
                <Binary className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>2. The C++ ABI Breakdown (NODE_MODULE_VERSION)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Native C++ addons (e.g., <code className="font-mono">sharp</code>, <code className="font-mono">canvas</code>, <code className="font-mono">better-sqlite3</code>) are compiled into machine code linked to V8 internal structures. Every major Node release updates this ABI number, causing un-recompiled native modules to hard crash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW VERSION MANAGERS WORK UNDER THE HOOD */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            2
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Internal Working: The 3 Core Architectural Mechanisms
          </h2>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          How does a version manager actually change which Node binary executes when you type <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs sm:text-sm">node app.js</code>? Modern version managers implement one of three distinct architectural strategies:
        </p>

        {/* Mechanism Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 max-w-xl">
          <button
            onClick={() => setActiveMechanism('path')}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeMechanism === 'path'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>PATH Mutation (NVM)</span>
          </button>

          <button
            onClick={() => setActiveMechanism('symlink')}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeMechanism === 'symlink'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Symlink Redirection (FNM)</span>
          </button>

          <button
            onClick={() => setActiveMechanism('shim')}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeMechanism === 'shim'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Shim Interceptor (Volta)</span>
          </button>
        </div>

        {/* Tab Detail Display */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          {activeMechanism === 'path' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                    Mechanism A: Dynamic $PATH Mutation (Shell Function)
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Used by: NVM (Node Version Manager)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                NVM is not a binary program; it is a <strong>POSIX shell function</strong> sourced into your shell session. When you execute <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-semibold">nvm use 22</code>, NVM intercepts the call and manipulates your shell process&apos;s in-memory <code className="font-mono font-bold">$PATH</code> variable.
              </p>

              {/* Visual Flow */}
              <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs sm:text-sm space-y-2 overflow-x-auto">
                <div className="text-slate-500">// 1. Before 'nvm use 22':</div>
                <div className="text-amber-400">PATH=&quot;/home/user/.nvm/versions/node/v18.20.4/bin:/usr/local/bin:/usr/bin&quot;</div>
                <div className="text-slate-500 pt-2">// 2. Running 'nvm use 22' mutates the string:</div>
                <div className="text-emerald-400 font-bold">PATH=&quot;/home/user/.nvm/versions/node/v22.11.0/bin:/usr/local/bin:/usr/bin&quot;</div>
                <div className="text-slate-500 pt-2">// 3. The OS shell searches $PATH from left to right, immediately hitting v22.11.0!</div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300">
                  <strong>Strength:</strong> Completely isolated in user space (<code className="font-mono">~/.nvm/versions</code>). Zero root privileges required.
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300">
                  <strong>Trade-off:</strong> Shell functions do not propagate across non-interactive subshells, and sourcing <code className="font-mono">nvm.sh</code> adds 300ms–800ms to every new terminal window.
                </div>
              </div>
            </div>
          )}

          {activeMechanism === 'symlink' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                    Mechanism B: Atomic Symlink Redirection (Rust-Powered)
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Used by: FNM (Fast Node Manager)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                FNM is a compiled native Rust binary. Instead of slow bash loops modifying environment strings, FNM maintains installed versions inside <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-semibold">~/.local/share/fnm/node-versions/</code> and points your shell to a single stable directory or dynamic environment evaluation via sub-millisecond execution.
              </p>

              {/* Visual Flow */}
              <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs sm:text-sm space-y-2 overflow-x-auto">
                <div className="text-slate-500">// Stable PATH entry points to FNM active link:</div>
                <div className="text-blue-400">PATH=&quot;/run/user/1000/fnm_multishells/1042/bin:$PATH&quot;</div>
                <div className="text-slate-500 pt-2">// In milliseconds, fnm creates an atomic symbolic link to the selected binary:</div>
                <div className="text-emerald-400 font-bold">/run/user/1000/fnm_multishells/1042/bin/node &rarr; ~/.local/share/fnm/node-versions/v22.11.0/installation/bin/node</div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300">
                  <strong>Strength:</strong> Blazing speed (&lt; 15ms startup). Native cross-platform binary (Linux, macOS, Windows PowerShell).
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300">
                  <strong>Consideration:</strong> Requires a shell hook (<code className="font-mono">eval &quot;$(fnm env)&quot;</code>) to manage multishell sessions independently.
                </div>
              </div>
            </div>
          )}

          {activeMechanism === 'shim' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                    Mechanism C: Shim Interceptors (Wrapper Binaries)
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Used by: Volta, asdf, nodenv
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Shim managers never mutate your <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-semibold">$PATH</code> when switching directories. Instead, they put a permanent, lightweight binary wrapper (&ldquo;shim&rdquo;) in <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-semibold">~/.volta/bin/node</code>.
              </p>

              {/* Visual Flow */}
              <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs sm:text-sm space-y-2 overflow-x-auto">
                <div className="text-slate-500">// 1. User executes 'node index.js'</div>
                <div className="text-slate-300">Terminal calls shim binary: <span className="text-amber-400 font-bold">~/.volta/bin/node</span></div>
                <div className="text-slate-500 pt-1">// 2. The shim scans the current working directory hierarchy:</div>
                <div className="text-blue-400">Reads current directory &rarr; finds package.json [&quot;volta&quot;: &#123; &quot;node&quot;: &quot;22.11.0&quot; &#125;]</div>
                <div className="text-slate-500 pt-1">// 3. Shim executes POSIX execv() to replace its process with the target Node:</div>
                <div className="text-emerald-400 font-bold">execv(&quot;~/.volta/tools/image/node/22.11.0/bin/node&quot;, argv) [Zero shell overhead!]</div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300">
                  <strong>Strength:</strong> Completely shell-agnostic! Works identically in Bash, Zsh, Fish, VS Code terminal, cron jobs, and desktop GUIs.
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300">
                  <strong>Consideration:</strong> Adds a microscopic directory inspection overhead (~2-5ms) to every invocation of the command.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: REPOSITORY VERSION PINNING STANDARDS */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            3
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Repository Version Pinning: The Three Configuration Standards
          </h2>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          How do engineering teams enforce that all 50 developers on a project, plus CI/CD build agents, run the exact same Node.js runtime? There are three standard configuration files checked into git repositories:
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {/* File 1: .nvmrc */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base font-mono">
                .nvmrc
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The oldest and most ubiquitous standard. Contains a single string representing the target SemVer version or alias.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400">
              v22.11.0<br />
              <span className="text-slate-500">// or simply: 22</span><br />
              <span className="text-slate-500">// or: lts/jod</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supported by NVM, FNM, and GitHub Actions <code className="font-mono">actions/setup-node</code>.
            </p>
          </div>

          {/* File 2: .node-version */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base font-mono">
                .node-version
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cross-runtime standard adopted by modern polyglot version managers (asdf, fnm, nodenv, mise).
            </p>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-blue-400">
              22.11.0<br />
              <span className="text-slate-500">// Clean SemVer without</span><br />
              <span className="text-slate-500">// the &apos;v&apos; prefix</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Standard format for multi-language development environments.
            </p>
          </div>

          {/* File 3: package.json engines */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base font-mono">
                package.json &quot;engines&quot;
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard package metadata enforcing SemVer ranges on package managers (npm, pnpm, yarn).
            </p>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-purple-300">
              &#123;<br />
              &nbsp;&nbsp;&quot;engines&quot;: &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;node&quot;: &quot;&gt;=22.0.0 &lt;23.0.0&quot;,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;npm&quot;: &quot;&gt;=10.0.0&quot;<br />
              &nbsp;&nbsp;&#125;<br />
              &#125;
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Coupled with <code className="font-mono">engine-strict=true</code> in <code className="font-mono">.npmrc</code> to halt builds on mismatches.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE C++ NATIVE ADDON ABI PROBLEM */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            4
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Deep Dive: The C++ ABI Breakdown (NODE_MODULE_VERSION)
          </h2>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            When you switch Node versions in a project that uses native C++ dependencies (<code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-semibold">sharp</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-semibold">better-sqlite3</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-semibold">canvas</code>, or cryptographic libraries), you will frequently encounter this terrifying error:
          </p>

          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
            Error: The module &apos;/app/node_modules/sharp/build/Release/sharp.node&apos;<br />
            was compiled against a different Node.js version using<br />
            NODE_MODULE_VERSION 115. This version of Node.js requires<br />
            NODE_MODULE_VERSION 127. Please try re-compiling or re-installing...
          </div>

          <div className="space-y-3 pt-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Why Does This Happen Under the Hood?
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed">
              Google V8 does not have a stable C++ Application Binary Interface (ABI). Internal class layouts, memory offsets, and function pointers change between V8 releases. To prevent memory corruption or catastrophic segmentation faults when an incompatible C++ binary runs in memory, Node.js embeds a numerical identifier called <code className="font-mono font-bold text-emerald-600 dark:text-emerald-400">NODE_MODULE_VERSION</code> into every compiled binary:
            </p>

            {/* ABI Mapping Table */}
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="py-2.5 px-4 font-bold text-slate-900 dark:text-slate-100">Node Release</th>
                    <th className="py-2.5 px-4 font-bold text-slate-900 dark:text-slate-100">V8 Version</th>
                    <th className="py-2.5 px-4 font-bold text-slate-900 dark:text-slate-100">NODE_MODULE_VERSION (ABI)</th>
                    <th className="py-2.5 px-4 font-bold text-slate-900 dark:text-slate-100">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr>
                    <td className="py-2 px-4 font-semibold text-slate-900 dark:text-slate-100">Node v18 LTS</td>
                    <td className="py-2 px-4 text-slate-600 dark:text-slate-400">V8 10.2</td>
                    <td className="py-2 px-4 text-emerald-600 dark:text-emerald-400 font-bold">108</td>
                    <td className="py-2 px-4 text-slate-500 font-sans text-xs">Maintenance LTS</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold text-slate-900 dark:text-slate-100">Node v20 LTS</td>
                    <td className="py-2 px-4 text-slate-600 dark:text-slate-400">V8 11.3</td>
                    <td className="py-2 px-4 text-emerald-600 dark:text-emerald-400 font-bold">115</td>
                    <td className="py-2 px-4 text-slate-500 font-sans text-xs">Active LTS</td>
                  </tr>
                  <tr className="bg-emerald-50/50 dark:bg-emerald-950/20">
                    <td className="py-2 px-4 font-semibold text-emerald-950 dark:text-emerald-300">Node v22 LTS (Current)</td>
                    <td className="py-2 px-4 text-emerald-800 dark:text-emerald-400">V8 12.4</td>
                    <td className="py-2 px-4 text-emerald-600 dark:text-emerald-400 font-bold">127</td>
                    <td className="py-2 px-4 text-emerald-700 dark:text-emerald-400 font-sans text-xs font-bold">Active LTS</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold text-slate-900 dark:text-slate-100">Node v24 (2025/2026)</td>
                    <td className="py-2 px-4 text-slate-600 dark:text-slate-400">V8 13.x</td>
                    <td className="py-2 px-4 text-emerald-600 dark:text-emerald-400 font-bold">135</td>
                    <td className="py-2 px-4 text-slate-500 font-sans text-xs">Future Active LTS</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 space-y-1 mt-3">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4" /> The Modern Solution: Node-API (N-API)
              </div>
              <p className="leading-relaxed">
                To solve this perpetual ABI crisis, Node created <strong>Node-API (formerly N-API)</strong>. Node-API is an ABI-stable C interface implemented by the runtime. Addons written using Node-API (<code className="font-mono">node-addon-api</code>) compile once and run across Node 18, 20, 22, and 24 without any recompilation!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE CODE LAB */}
      <section className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
              5
            </span>
            <h2 className="text-2xl font-bold tracking-tight">
              Interactive Lab: Version Manager Simulation (Node v22 LTS)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            In-Browser Runtime Engine
          </span>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Test version constraint resolution, shell PATH prioritization, and native module ABI compatibility live in the sandbox:
        </p>

        <NodeJsEditor
          initialCode={`// Preset 1: SemVer Engine Range Validator & .nvmrc Resolver
const currentVersion = process.version; // 'v22.11.0'
const currentMajor = parseInt(currentVersion.replace('v', '').split('.')[0], 10);

console.log("=== Active Node.js Runtime ===");
console.log("Current Process Version :", currentVersion);
console.log("Current Major Version   :", currentMajor);

// Simulated project configuration files:
const packageJson = {
  name: "enterprise-api",
  engines: {
    node: ">=20.0.0 <23.0.0" // Allows Node 20 and Node 22
  }
};
const nvmrc = "22"; // Target major

console.log("\\n=== Evaluating Project Engine Constraints ===");
console.log("Target .nvmrc Pin       :", nvmrc);
console.log("Allowed engines.node    :", packageJson.engines.node);

// Basic SemVer engine check:
const isCompatible = currentMajor >= 20 && currentMajor < 23;

if (isCompatible) {
  console.log("SUCCESS: Active Node " + currentVersion + " satisfies engines constraint!");
} else {
  console.error("ERROR: Engine mismatch! Project requires " + packageJson.engines.node);
}`}
          title="Node.js Version Management Simulator (Node v22 LTS)"
          presets={[
            {
              label: '1. SemVer Engine & .nvmrc Resolver',
              code: `// Preset 1: SemVer Engine Range Validator & .nvmrc Resolver
const currentVersion = process.version; // 'v22.11.0'
const currentMajor = parseInt(currentVersion.replace('v', '').split('.')[0], 10);

console.log("=== Active Node.js Runtime ===");
console.log("Current Process Version :", currentVersion);
console.log("Current Major Version   :", currentMajor);

// Simulated project configuration files:
const packageJson = {
  name: "enterprise-api",
  engines: {
    node: ">=20.0.0 <23.0.0" // Allows Node 20 and Node 22
  }
};
const nvmrc = "22"; // Target major

console.log("\\n=== Evaluating Project Engine Constraints ===");
console.log("Target .nvmrc Pin       :", nvmrc);
console.log("Allowed engines.node    :", packageJson.engines.node);

// Basic SemVer engine check:
const isCompatible = currentMajor >= 20 && currentMajor < 23;

if (isCompatible) {
  console.log("SUCCESS: Active Node " + currentVersion + " satisfies engines constraint!");
} else {
  console.error("ERROR: Engine mismatch! Project requires " + packageJson.engines.node);
}`,
            },
            {
              label: '2. PATH Prioritization & Symlink Simulation',
              code: `// Preset 2: Shell $PATH Priority Traversal Simulation
const rawPath = process.env.PATH || '';
const pathDirs = rawPath.split(':');

console.log("=== Shell PATH Resolution Simulation ===");
console.log("Total entries in $PATH:", pathDirs.length);

pathDirs.forEach((dir, index) => {
  const isUserSpace = dir.includes('.nvm') || dir.includes('.fnm') || dir.includes('.volta');
  const tag = isUserSpace ? "[USER-SPACE MANAGER]" : "[SYSTEM DIRECTORY]";
  console.log((index + 1) + ". " + dir + " " + tag);
});

console.log("\\n=== Resolution Rule ===");
console.log("Active binary resolved from Priority #1 directory:");
console.log("-> " + pathDirs[0] + "/node");
console.log("Because version managers prepend to $PATH, they completely override system /usr/bin/node!");`,
            },
            {
              label: '3. Native Module ABI & Node-API Checker',
              code: `// Preset 3: Native Addon ABI (NODE_MODULE_VERSION) Checker
const modulesAbi = process.versions.modules;
const nodeVersion = process.versions.node;
const napiVersion = process.versions.napi;

console.log("=== Native Module ABI Diagnostics ===");
console.log("Active Node Version        :", nodeVersion);
console.log("Active NODE_MODULE_VERSION :", modulesAbi);
console.log("Supported Node-API (N-API) : Version", napiVersion);

// Historical ABI reference lookup:
const abiRegistry = {
  "108": "Node.js v18 (Hydrogen)",
  "115": "Node.js v20 (Iron)",
  "127": "Node.js v22 (Jod)",
  "135": "Node.js v24 (Krypton)"
};

console.log("\\n=== Compatibility Evaluation ===");
console.log("Matched ABI Release:", abiRegistry[modulesAbi] || "Unknown custom build");

// Simulating a native module compiled against Node 20:
const incomingAddonAbi = "115";
console.log("\\nChecking binary compiled with ABI " + incomingAddonAbi + " against active runtime (ABI " + modulesAbi + "):");

if (incomingAddonAbi === modulesAbi) {
  console.log("SUCCESS: Addon ABI matches! Safe to load .node binary into process memory.");
} else {
  console.warn("WARNING: ABI mismatch detected! (Addon: " + incomingAddonAbi + ", Runtime: " + modulesAbi + ")");
  console.log("Action: Recompile addon via 'npm rebuild' OR refactor addon to Node-API for cross-version compatibility.");
}`,
            },
          ]}
        />
      </section>

      {/* SECTION 6: TWO CRITICAL PRODUCTION TRAPS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
            6
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Two Critical Production Traps &amp; Failure Modes
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
                  The &ldquo;Local vs CI/CD Engine Drift&rdquo; Disaster
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Failure Scenario:</strong> A developer on a modern laptop uses Node 22 locally via a version manager and uses new features like native <code className="font-mono">node:sqlite</code>, <code className="font-mono">import.meta.dirname</code>, or <code className="font-mono">require(esm)</code>. Everything passes locally!
            </p>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-300 space-y-1">
              <strong>The Production Outage:</strong> The GitHub Actions workflow or Kubernetes base image had a hardcoded Node 18 or 20 image. When the code deploys, production crashes immediately with <code className="font-mono">ERR_MODULE_NOT_FOUND: Cannot find module &apos;node:sqlite&apos;</code> or syntax errors on newer language operators!
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Fix:</strong> Pin versions in <code className="font-mono font-bold">.nvmrc</code>, configure GitHub Actions using <code className="font-mono font-bold">node-version-file: &apos;.nvmrc&apos;</code>, and add <code className="font-mono font-bold">engine-strict=true</code> to your root <code className="font-mono font-bold">.npmrc</code>.
            </div>
          </div>

          {/* TRAP 2 */}
          <div className="p-6 rounded-3xl border border-amber-200 dark:border-amber-950/60 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Production Trap 2
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  The Shell Startup Latency Bloat
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>The Silent Penalty:</strong> Developers place <code className="font-mono">source ~/.nvm/nvm.sh</code> at the top of their <code className="font-mono">~/.bashrc</code> or <code className="font-mono">~/.zshrc</code>. Because NVM is written in 3,000+ lines of POSIX shell script, every new terminal tab, tmux split, or IDE child terminal incurs a 500ms to 1,500ms startup freeze.
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <strong>Developer Tax:</strong> Engineers open dozens of subshells and command prompts every day. Over a year, this latency wastes hours of time and causes IDE terminal windows to feel sluggish.
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200">
              <strong>Production Fix:</strong> Switch to compiled native version managers like <strong>fnm</strong> (written in Rust, starts in &lt;15ms) or <strong>Volta</strong> (shim-based, 0ms shell startup overhead).
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
                How does a shim-based version manager (like Volta) differ fundamentally from a shell-based version manager (like NVM)?
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

          <div className="space-y-2 pt-2">
            {[
              {
                id: 'A',
                label:
                  'A. NVM installs node directly to /usr/bin, while Volta runs inside a background Docker container.',
              },
              {
                id: 'B',
                label:
                  'B. NVM mutates the $PATH variable in shell memory via a shell script; Volta uses a permanent wrapper binary ("shim") that inspects the current directory and executes the target binary via execv() without shell environment changes.',
              },
              {
                id: 'C',
                label:
                  'C. NVM only works on Windows, whereas Volta is strictly an operating system kernel patch for Linux.',
              },
              {
                id: 'D',
                label:
                  'D. There is no architectural difference; both are shell functions sourced inside ~/.bashrc.',
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
                  <strong>Correct!</strong> NVM relies on a shell function that mutates the in-memory <code className="font-mono">$PATH</code> variable. Volta installs static wrapper executables (&ldquo;shims&rdquo;) in your PATH that dynamically detect the required version from project manifests and invoke the correct binary seamlessly.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option B is correct. NVM mutates <code className="font-mono">$PATH</code> via a shell function, while Volta intercepts executions using binary shims.
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
                Why do native C++ modules throw a NODE_MODULE_VERSION mismatch error when switching major Node.js releases, and how does Node-API (N-API) resolve it?
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

          <div className="space-y-2 pt-2">
            {[
              {
                id: 'A',
                label:
                  'A. Because npm delete the files from node_modules automatically upon switching versions.',
              },
              {
                id: 'B',
                label:
                  'B. Because JavaScript cannot execute C++ functions without TypeScript compiling them first.',
              },
              {
                id: 'C',
                label:
                  'C. V8 C++ class layouts change between major versions breaking the binary ABI; Node-API provides an ABI-stable C interface that insulates native modules from internal engine changes so they run across releases without recompilation.',
              },
              {
                id: 'D',
                label:
                  'D. NODE_MODULE_VERSION is an optional string used only for semantic version logging and does not prevent binary execution.',
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
                  <strong>Correct!</strong> Google V8 modifies internal C++ class hierarchies across versions. To avoid memory crashes, Node validates <code className="font-mono">NODE_MODULE_VERSION</code> upon loading native libraries. Node-API was engineered precisely to deliver an ABI-stable layer so compiled addons remain forward and backward compatible.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option C is correct. V8 internal memory layout changes break binary ABI compatibility, which Node-API stabilizes.
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
                How can an engineering team enforce that npm halts with an immediate fatal error if a developer attempts to install dependencies using an unapproved Node version?
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

          <div className="space-y-2 pt-2">
            {[
              {
                id: 'A',
                label:
                  'A. Specify the target SemVer range in package.json under "engines.node" and set "engine-strict=true" in the project\'s .npmrc file.',
              },
              {
                id: 'B',
                label:
                  'B. Delete the local package.json file and place a bash script named "error.sh" inside node_modules.',
              },
              {
                id: 'C',
                label:
                  'C. npm automatically enforces "engines" strictly by default and rejects mismatched versions without any extra flags.',
              },
              {
                id: 'D',
                label:
                  'D. It is impossible to enforce runtime versions at the package manager level; this can only be checked inside Docker.',
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
                  <strong>Correct!</strong> By default, npm only outputs a warning when the active Node version violates <code className="font-mono">engines.node</code>. Adding <code className="font-mono">engine-strict=true</code> to <code className="font-mono">.npmrc</code> converts that warning into a hard build failure, preventing accidental dependency installations under the wrong runtime.
                </p>
              ) : (
                <p>
                  <strong>Correction:</strong> Option A is correct. npm requires <code className="font-mono">engine-strict=true</code> in <code className="font-mono">.npmrc</code> to convert the advisory warning into a fatal exit.
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
                Question 4: Architectural Synthesis &mdash; Compare the operational trade-offs between dynamic $PATH mutation (NVM), symlink switching (FNM), and shim interception (Volta), and describe how to design a zero-drift CI/CD pipeline.
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Reflect on process isolation, terminal startup overhead, non-interactive subshell handling, and manifest pinning, then reveal the faculty model answer below.
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
                  <strong>1. Architectural Trade-offs Across the Three Paradigms:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm pl-2">
                  <li>
                    <strong>Shell Function $PATH Mutation (NVM):</strong> Purely POSIX-compliant script that prepends directory paths into the current shell process. <em>Trade-off:</em> High startup latency (~500ms per shell) and total failure in non-interactive subshells (e.g., cron jobs, IDE child processes, GUI launchers).
                  </li>
                  <li>
                    <strong>Native Symlink Management (FNM):</strong> Compiled Rust binary executing in microseconds. Modifies symlinks or sets lightweight multishell directory links. <em>Trade-off:</em> Requires shell hook initialization, but offers near-instantaneous speed (&lt;15ms).
                  </li>
                  <li>
                    <strong>Shim Interception (Volta / asdf):</strong> Places a persistent wrapper executable in <code className="font-mono">PATH</code> that delegates via <code className="font-mono">execv()</code> after walking the filesystem for project manifests. <em>Trade-off:</em> 100% shell-agnostic, zero startup latency, seamless IDE integration, with a negligible ~2ms per-command filesystem lookup overhead.
                  </li>
                </ul>

                <p>
                  <strong>2. Designing a Zero-Drift Enterprise Pipeline:</strong>
                  <br />
                  To guarantee absolute runtime parity from local workstations to production containers:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm pl-2 font-mono">
                  <li>Single Source of Truth: Pin runtime in <code className="font-mono">.nvmrc</code> (e.g., <code className="font-mono">22.11.0</code>).</li>
                  <li>Developer Enforcement: Enforce <code className="font-mono">engines.node</code> in <code className="font-mono">package.json</code> coupled with <code className="font-mono">engine-strict=true</code> in <code className="font-mono">.npmrc</code>.</li>
                  <li>CI/CD Automation: Use <code className="font-mono">actions/setup-node@v4</code> with <code className="font-mono">node-version-file: &apos;.nvmrc&apos;</code> to eliminate manual version divergence.</li>
                  <li>Container Parity: Base production Dockerfiles on the exact matching Alpine or Debian image (<code className="font-mono">node:22.11.0-alpine</code>).</li>
                </ol>

                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-sm font-mono text-slate-700 dark:text-slate-300">
                  Engineering Formula: Zero Drift = .nvmrc (Manifest) + engine-strict (Guardrail) + setup-node-file (CI) + node:X.Y.Z (Container)
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
            <strong className="text-slate-900 dark:text-slate-100">Your turn:</strong> Verify all 4 assessment questions above. Once complete, you are fully prepared to advance to Concept 13 (NVM Deep Dive) using the navigation below.
          </div>
        </div>
      </section>
    </div>
  );
}
