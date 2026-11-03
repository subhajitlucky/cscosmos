'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Code2, 
  Layers, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  HelpCircle,
  Cpu,
  BookOpen
} from 'lucide-react';
import { RustConcept } from '../../data/concepts';

export function VariablesAndMutabilityLesson({ concept }: { concept: RustConcept }) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  
  // Interactive Memory Simulator state
  const [memoryState, setMemoryState] = useState<'immutable' | 'mutable_initial' | 'mutable_updated' | 'shadowed'>('immutable');

  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuizSelect = (questionIndex: number, optionIndex: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const phases = [
    { id: 'phase-1', number: '01', title: 'Everyday Intuition' },
    { id: 'phase-2', number: '02', title: 'The Mistake & The Fix' },
    { id: 'phase-3', number: '03', title: 'The 3 Superpowers' },
    { id: 'phase-4', number: '04', title: 'Inside RAM & Memory' },
    { id: 'phase-5', number: '05', title: 'Practice Drill' },
    { id: 'phase-6', number: '06', title: 'Golden Rules' },
  ];

  const scrollToPhase = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-16">
      
      {/* Visual Phase Navigation Bar */}
      <div className="sticky top-20 z-30 py-3 px-4 bg-[var(--rust-surface)]/95 backdrop-blur-md border border-[var(--rust-border)] rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
        <span className="text-sm font-mono font-bold text-[var(--rust-text)] uppercase tracking-wider shrink-0">
          Lesson Navigation:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => scrollToPhase(phase.id)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-[var(--rust-surface-2)] text-[var(--rust-text)] hover:bg-[var(--rust-primary-light)] hover:text-[var(--rust-primary)] transition-all border border-[var(--rust-border)] shadow-xs"
            >
              <span className="font-mono text-xs text-[var(--rust-primary)] font-extrabold">{phase.number}</span>
              <span>{phase.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PHASE 1: EVERYDAY INTUITION
         ========================================================================= */}
      <section id="phase-1" className="space-y-6 scroll-mt-36">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] font-mono text-sm font-bold shadow-xs">
            01
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] tracking-tight">
            Everyday Intuition: The Permanent Marker vs The Pencil
          </h2>
        </div>

        <p className="text-base sm:text-lg text-[var(--rust-text)] leading-relaxed font-normal">
          Imagine you have a cardboard toy box labeled <code className="px-2 py-0.5 rounded-md bg-[var(--rust-surface-2)] text-[var(--rust-primary)] font-mono font-bold text-sm">apples</code>.
        </p>

        {/* 2-Card Visual Metaphor Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Default in Python / JS / C++ */}
          <div className="p-6 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                Other Languages (Python, JS, C++)
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Unlock className="w-5 h-5" />
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-[var(--rust-text)]">
              The Chalkboard Box (Anything Can Change)
            </h3>

            <p className="text-sm text-[var(--rust-muted)] leading-relaxed">
              In most languages, every variable is like a chalkboard. Anyone walking past can wipe off the number <span className="font-mono font-bold text-[var(--rust-text)]">5</span> and scribble <span className="font-mono font-bold text-[var(--rust-text)]">100</span>. You never know who changed it, when it changed, or why your code broke 300 lines later.
            </p>
          </div>

          {/* Card 2: The Rust Way */}
          <div className="p-6 rounded-2xl border-2 border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)]/20 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[var(--rust-primary)] uppercase tracking-wider">
                The Rust Way (Safe by Default)
              </span>
              <div className="p-2 rounded-xl bg-[var(--rust-primary)] text-white shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[var(--rust-text)]">
              The Locked Safe (Permanent Marker)
            </h3>

            <p className="text-sm text-[var(--rust-text)] leading-relaxed">
              In Rust, every variable is <strong>immutable (locked)</strong> by default. Once you write <span className="font-mono font-bold text-[var(--rust-primary)]">5</span>, it is sealed shut with permanent ink. If you want permission to change it, you must explicitly stick a neon tag on it: <code className="px-2 py-0.5 rounded-md bg-[var(--rust-primary-light)] text-[var(--rust-primary)] font-mono font-bold text-sm">mut</code> (short for mutable).
            </p>
          </div>

        </div>

        {/* Why this matters callout */}
        <div className="p-5 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)] flex items-start gap-4 shadow-xs">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-sm sm:text-base text-[var(--rust-text)] leading-relaxed">
            <strong className="text-[var(--rust-primary)] font-bold text-base block">Why does Rust do this?</strong>
            <p>
              When a team of programmers builds software together, nobody can accidentally change your data behind your back. If you see a variable without <code className="font-mono font-bold text-[var(--rust-primary)]">mut</code>, you can be 100% confident its value will never change anywhere in the code.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 2: THE MISTAKE & THE FIX
         ========================================================================= */}
      <section id="phase-2" className="space-y-6 scroll-mt-36">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] font-mono text-sm font-bold shadow-xs">
            02
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] tracking-tight">
            Step-by-Step: The First Mistake Every Student Makes
          </h2>
        </div>

        <p className="text-base sm:text-lg text-[var(--rust-text)] leading-relaxed">
          Let&apos;s watch what happens when you try to change a normal variable. Rust does not crash at runtime—the friendly compiler catches you instantly before your code ever runs.
        </p>

        {/* Step 2A: The Broken Code */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono font-bold text-rose-500 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>Step 2A: The Code That Fails to Compile</span>
            </span>
            <button
              onClick={() => handleCopy(`fn main() {\n    let apples = 5;\n    println!("I have {} apples", apples);\n\n    apples = 10; // ❌ ERROR!\n}`, 'code-fail')}
              className="text-xs font-mono font-bold text-[var(--rust-text)] hover:text-[var(--rust-primary)] flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface)]"
            >
              {copiedIndex === 'code-fail' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 'code-fail' ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-[var(--rust-surface)] p-5 font-mono text-sm overflow-x-auto shadow-xs">
            <pre className="text-[var(--rust-text)] leading-relaxed">
              <code>
                <span className="text-purple-400 font-bold">fn</span> <span className="text-blue-400 font-bold">main</span>() &#123;{'\n'}
                {'    '}<span className="text-purple-400 font-bold">let</span> apples = <span className="text-amber-400 font-bold">5</span>; <span className="text-[var(--rust-muted)]">// Locked with permanent ink!</span>{'\n'}
                {'    '}<span className="text-blue-400 font-bold">println!</span>(<span className="text-emerald-400">&quot;I have &#123;&#125; apples&quot;</span>, apples);{'\n\n'}
                {'    '}<span className="text-rose-400 font-bold underline">apples = 10;</span> <span className="text-rose-400 font-bold">// ❌ COMPILE ERROR: Cannot assign twice to immutable variable</span>{'\n'}
                &#125;
              </code>
            </pre>
          </div>
        </div>

        {/* The Exact Compiler Output Terminal */}
        <div className="rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-[var(--rust-text)]">
            <span className="flex items-center gap-2 font-bold text-rose-500">
              <AlertTriangle className="w-4 h-4" />
              <span>Exact Compiler Diagnostic (Error E0384)</span>
            </span>
            <span className="text-[var(--rust-muted)] font-semibold">Terminal Output</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--rust-surface)] border border-[var(--rust-border-subtle)] font-mono text-xs sm:text-sm leading-relaxed text-[var(--rust-text)] space-y-1.5 shadow-inner">
            <div className="text-rose-500 font-bold text-sm">error[E0384]: cannot assign twice to immutable variable `apples`</div>
            <div className="text-[var(--rust-muted)]"> --&gt; src/main.rs:5:5</div>
            <div className="text-[var(--rust-muted)]">  |</div>
            <div className="text-[var(--rust-muted)]">2 |     let apples = 5;</div>
            <div className="text-[var(--rust-muted)]">  |         ------ first assignment to `apples`</div>
            <div className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded w-fit">  |         help: consider making this binding mutable: `mut apples`</div>
            <div className="text-[var(--rust-muted)]">5 |     apples = 10;</div>
            <div className="text-rose-500 font-bold">  |     ^^^^^^^^^^^ cannot assign twice to immutable variable</div>
          </div>

          <div className="text-sm text-[var(--rust-text)] flex items-center gap-2 pt-1 font-medium">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Notice the <strong>help</strong> line! Rust tells you the exact fix: add <code className="font-mono font-bold text-cyan-400">mut</code>.</span>
          </div>
        </div>

        {/* Step 2B: The Easy Fix */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono font-bold text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Step 2B: The Fix (Add `mut` to Unlock Mutation)</span>
            </span>
            <button
              onClick={() => handleCopy(`fn main() {\n    let mut apples = 5; // 🔑 The 'mut' key unlocks changes!\n    println!("I have {} apples", apples);\n\n    apples = 10; // ✅ Works!\n    println!("Now I have {} apples", apples);\n}`, 'code-fix')}
              className="text-xs font-mono font-bold text-[var(--rust-text)] hover:text-[var(--rust-primary)] flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface)]"
            >
              {copiedIndex === 'code-fix' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 'code-fix' ? 'Copied' : 'Copy Fix'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-[var(--rust-surface)] p-5 font-mono text-sm overflow-x-auto shadow-xs">
            <pre className="text-[var(--rust-text)] leading-relaxed">
              <code>
                <span className="text-purple-400 font-bold">fn</span> <span className="text-blue-400 font-bold">main</span>() &#123;{'\n'}
                {'    '}<span className="text-purple-400 font-bold">let</span> <span className="text-emerald-400 font-extrabold underline">mut</span> apples = <span className="text-amber-400 font-bold">5</span>; <span className="text-emerald-400 font-semibold">// 🔑 Adding 'mut' gives us permission to change the value</span>{'\n'}
                {'    '}<span className="text-blue-400 font-bold">println!</span>(<span className="text-emerald-400">&quot;I have &#123;&#125; apples&quot;</span>, apples); <span className="text-[var(--rust-muted)]">// Prints: 5</span>{'\n\n'}
                {'    '}<span className="text-emerald-400 font-bold">apples = 10;</span> <span className="text-emerald-400 font-semibold">// ✅ Now allowed! Value updated in-place</span>{'\n'}
                {'    '}<span className="text-blue-400 font-bold">println!</span>(<span className="text-emerald-400">&quot;Now I have &#123;&#125; apples&quot;</span>, apples); <span className="text-[var(--rust-muted)]">// Prints: 10</span>{'\n'}
                &#125;
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 3: THE 3 CORE SUPERPOWERS
         ========================================================================= */}
      <section id="phase-3" className="space-y-6 scroll-mt-36">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] font-mono text-sm font-bold shadow-xs">
            03
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] tracking-tight">
            The 3 Superpowers: Mutability vs Constants vs Shadowing
          </h2>
        </div>

        <p className="text-base sm:text-lg text-[var(--rust-text)] leading-relaxed">
          Students often ask: <em>&ldquo;Can mut change the type? What is a constant? What on earth is shadowing?&rdquo;</em> Let&apos;s answer each one with clear, memorable rules.
        </p>

        {/* Superpower 1: Mutation Cannot Change Types */}
        <div className="p-6 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-[var(--rust-primary)] uppercase">
            <span>Rule 1</span>
            <span>•</span>
            <span>`mut` Changes Values, NEVER The Type</span>
          </div>

          <h3 className="text-lg font-bold text-[var(--rust-text)]">
            You cannot put an Elephant inside an Apple Box
          </h3>

          <p className="text-sm text-[var(--rust-text)] leading-relaxed">
            When you declare <code className="font-mono font-bold text-[var(--rust-text)]">let mut score = 100;</code>, the variable is a number. You can change <span className="font-mono font-bold text-[var(--rust-text)]">100</span> to <span className="font-mono font-bold text-[var(--rust-text)]">200</span>, but you can NEVER assign a text string like <code className="font-mono font-bold text-[var(--rust-text)]">&quot;Winner&quot;</code> to it.
          </p>

          <div className="rounded-xl border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] p-4 font-mono text-sm">
            <pre className="text-[var(--rust-text)] leading-relaxed">
              <code>
                <span className="text-purple-400 font-bold">let</span> <span className="text-purple-400 font-bold">mut</span> score = <span className="text-amber-400 font-bold">100</span>;{'\n'}
                score = <span className="text-amber-400 font-bold">200</span>; <span className="text-emerald-400 font-semibold">// ✅ OK: 200 is still an integer</span>{'\n\n'}
                <span className="text-rose-500 font-bold">// score = &quot;Game Over&quot;; // ❌ Compile Error E0308: Expected integer, found &amp;str!</span>
              </code>
            </pre>
          </div>
        </div>

        {/* Superpower 2: Variables vs Constants */}
        <div className="p-6 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-cyan-500 uppercase">
            <span>Rule 2</span>
            <span>•</span>
            <span>`let` vs `const` (When to use which?)</span>
          </div>

          <h3 className="text-lg font-bold text-[var(--rust-text)]">
            Variables are at Runtime; Constants are Eternal Truths
          </h3>

          <p className="text-sm text-[var(--rust-text)] leading-relaxed">
            Beginners ask: <em>&ldquo;If `let` is already immutable, why do we need `const`?&rdquo;</em> Here is the simple difference:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] space-y-2">
              <span className="text-sm font-mono font-bold text-[var(--rust-text)] flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[var(--rust-text)]" />
                <span>let (Variables)</span>
              </span>
              <ul className="text-xs sm:text-sm text-[var(--rust-muted)] space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Computed at <strong>runtime</strong> while your program is running</li>
                <li>Can opt into changes with <code className="font-mono font-bold text-[var(--rust-text)]">mut</code></li>
                <li>Lives in local function stack frames</li>
                <li>Type is optional (compiler figures it out automatically)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] space-y-2">
              <span className="text-sm font-mono font-bold text-[var(--rust-primary)] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[var(--rust-primary)]" />
                <span>const (Constants)</span>
              </span>
              <ul className="text-xs sm:text-sm text-[var(--rust-muted)] space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Baked into the binary at <strong>compile time</strong> (hardcoded)</li>
                <li>Can <strong>NEVER</strong> use <code className="font-mono font-bold text-[var(--rust-text)]">mut</code></li>
                <li>Can be global across your entire application</li>
                <li>Type annotation is <strong>MANDATORY</strong> (e.g. <code className="font-mono font-bold text-[var(--rust-text)]">: u32</code>)</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] p-4 font-mono text-sm">
            <pre className="text-[var(--rust-text)]">
              <code>
                <span className="text-[var(--rust-muted)]">// Always uppercase naming convention:</span>{'\n'}
                <span className="text-purple-400 font-bold">const</span> <span className="text-amber-400 font-bold">MAX_PLAYERS</span>: <span className="text-blue-400 font-bold">u32</span> = <span className="text-amber-400 font-bold">100_000</span>;
              </code>
            </pre>
          </div>
        </div>

        {/* Superpower 3: Shadowing (The Magic Trick) */}
        <div className="p-6 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-amber-500 uppercase">
            <span>Rule 3</span>
            <span>•</span>
            <span>Shadowing (Declaring `let` Twice)</span>
          </div>

          <h3 className="text-lg font-bold text-[var(--rust-text)]">
            The Magic Trick: Transforming Data Without Awkward Names
          </h3>

          <p className="text-sm text-[var(--rust-text)] leading-relaxed">
            In other languages, if you get user input as text <code className="font-mono font-bold text-[var(--rust-text)]">&quot;42&quot;</code> and want to turn it into number <code className="font-mono font-bold text-[var(--rust-text)]">42</code>, you are forced to make up awkward names like <code className="font-mono font-bold text-[var(--rust-text)]">age_str</code> and <code className="font-mono font-bold text-[var(--rust-text)]">age_int</code>.
          </p>

          <p className="text-sm text-[var(--rust-text)] leading-relaxed">
            In Rust, you can simply declare <code className="font-mono font-bold text-[var(--rust-primary)]">let age</code> again! This is called <strong>Shadowing</strong>. The second variable <em>shadows (replaces)</em> the first one, and can even have a completely different type!
          </p>

          <div className="rounded-xl border border-amber-500/30 bg-[var(--rust-surface-2)] p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-[var(--rust-text)] leading-relaxed">
              <code>
                <span className="text-purple-400 font-bold">let</span> spaces = <span className="text-emerald-400 font-bold">&quot;   &quot;</span>; <span className="text-[var(--rust-muted)]">// Type: Text string (&amp;str) with 3 spaces</span>{'\n'}
                <span className="text-purple-400 font-bold">let</span> spaces = spaces.<span className="text-blue-400 font-bold">len</span>(); <span className="text-amber-400 font-bold">// Type: Number (usize) = 3!</span>{'\n\n'}
                <span className="text-blue-400 font-bold">println!</span>(<span className="text-emerald-400">&quot;Number of spaces: &#123;&#125;&quot;</span>, spaces); <span className="text-[var(--rust-muted)]">// Prints: 3</span>
              </code>
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-[var(--rust-surface)] border border-[var(--rust-border-subtle)] text-sm text-[var(--rust-text)] space-y-2">
            <strong className="text-[var(--rust-primary)] font-bold block">Quick 5-Year-Old Distinction: `mut` vs Shadowing</strong>
            <ul className="space-y-1.5 list-disc pl-4 text-sm text-[var(--rust-muted)] leading-relaxed">
              <li><strong>`mut`</strong>: Keeps the <em>same box</em>, just puts new contents inside (must stay the same shape/type).</li>
              <li><strong>Shadowing</strong>: Throws away the old box and builds a <em>brand-new box</em> with the same name (can have a brand-new type!).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 4: INSIDE COMPUTER RAM & HARDWARE
         ========================================================================= */}
      <section id="phase-4" className="space-y-6 scroll-mt-36">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] font-mono text-sm font-bold shadow-xs">
            04
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] tracking-tight">
            Inside RAM: What the Computer Hardware Actually Does
          </h2>
        </div>

        <p className="text-base sm:text-lg text-[var(--rust-text)] leading-relaxed">
          How does your computer processor (CPU) and memory (RAM) actually store these variables? Click the interactive buttons below to watch the hardware stack frame transform live:
        </p>

        {/* Interactive Memory Studio Box */}
        <div className="rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-6 space-y-6 shadow-sm">
          
          {/* State Switcher Buttons */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'immutable', label: '1. let x = 5 (Locked)' },
              { id: 'mutable_initial', label: '2. let mut x = 5 (Unlocked)' },
              { id: 'mutable_updated', label: '3. x = 10 (Overwritten)' },
              { id: 'shadowed', label: '4. let x = "Hello" (Shadowed)' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setMemoryState(st.id as typeof memoryState)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
                  memoryState === st.id
                    ? 'bg-[var(--rust-primary)] text-white shadow-md'
                    : 'bg-[var(--rust-surface-2)] text-[var(--rust-text)] hover:text-[var(--rust-primary)] border border-[var(--rust-border)]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Visual Memory Representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* The Stack Box Visual */}
            <div className="p-5 rounded-xl border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[var(--rust-text)] border-b border-[var(--rust-border)] pb-2.5">
                <span>Stack Frame [0x7fff0010]</span>
                <span className="text-xs text-[var(--rust-primary)] font-bold uppercase">RAM Byte Offset</span>
              </div>

              {memoryState === 'immutable' && (
                <div className="p-4 rounded-xl border-2 border-emerald-500/50 bg-emerald-500/10 space-y-2">
                  <div className="flex items-center justify-between text-sm font-bold text-emerald-400">
                    <span>x : i32</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase bg-emerald-500/20 px-2 py-0.5 rounded">
                      <Lock className="w-3.5 h-3.5" /> Immutable
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[var(--rust-text)]">
                    Value: 5
                  </div>
                  <div className="text-xs font-semibold text-[var(--rust-muted)]">
                    Memory: 4 bytes [ 00 00 00 05 ]
                  </div>
                </div>
              )}

              {memoryState === 'mutable_initial' && (
                <div className="p-4 rounded-xl border-2 border-amber-500/50 bg-amber-500/10 space-y-2">
                  <div className="flex items-center justify-between text-sm font-bold text-amber-400">
                    <span>mut x : i32</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase bg-amber-500/20 px-2 py-0.5 rounded">
                      <Unlock className="w-3.5 h-3.5" /> Writable
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[var(--rust-text)]">
                    Value: 5
                  </div>
                  <div className="text-xs font-semibold text-[var(--rust-muted)]">
                    Memory: 4 bytes [ 00 00 00 05 ] (Can be overwritten)
                  </div>
                </div>
              )}

              {memoryState === 'mutable_updated' && (
                <div className="p-4 rounded-xl border-2 border-amber-500/50 bg-amber-500/10 space-y-2">
                  <div className="flex items-center justify-between text-sm font-bold text-amber-400">
                    <span>mut x : i32</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase bg-amber-500/20 px-2 py-0.5 rounded">
                      <Unlock className="w-3.5 h-3.5" /> Overwritten
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[var(--rust-text)]">
                    Value: 10 <span className="text-sm text-amber-400 font-normal line-through ml-2">(was 5)</span>
                  </div>
                  <div className="text-xs font-semibold text-[var(--rust-muted)]">
                    Memory: Bytes updated to [ 00 00 00 0A ] in-place!
                  </div>
                </div>
              )}

              {memoryState === 'shadowed' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-dashed border-[var(--rust-border)] text-xs sm:text-sm text-[var(--rust-muted)]">
                    <span className="line-through">Original x : i32 = 5</span> (Shadowed / Hidden)
                  </div>
                  <div className="p-4 rounded-xl border-2 border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] space-y-2">
                    <div className="flex items-center justify-between text-sm font-bold text-[var(--rust-primary)]">
                      <span>New x : &amp;str</span>
                      <span className="text-xs font-bold uppercase bg-[var(--rust-primary)] text-white px-2 py-0.5 rounded">New Slot</span>
                    </div>
                    <div className="text-xl font-extrabold text-[var(--rust-text)]">
                      &quot;Hello&quot; (Fat Pointer)
                    </div>
                    <div className="text-xs font-semibold text-[var(--rust-muted)]">
                      Allocated at brand new stack address: 16 bytes
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation of the Hardware State */}
            <div className="flex flex-col justify-between space-y-4 text-sm sm:text-base leading-relaxed">
              <div className="space-y-3">
                <span className="font-bold text-[var(--rust-text)] flex items-center gap-2 uppercase font-mono text-sm">
                  <Cpu className="w-5 h-5 text-[var(--rust-primary)]" />
                  <span>Hardware &amp; Compiler Optimization</span>
                </span>
                
                {memoryState === 'immutable' && (
                  <p className="text-[var(--rust-text)] leading-relaxed">
                    Because Rust mathematically proves <code className="font-mono font-bold text-[var(--rust-primary)]">x</code> can never change, the compiler does not even have to write it to physical RAM! It can keep the number <span className="font-mono font-bold text-[var(--rust-primary)]">5</span> stored directly inside a super-fast <strong>CPU Register (RAX)</strong>. This means zero memory delay.
                  </p>
                )}

                {memoryState === 'mutable_initial' && (
                  <p className="text-[var(--rust-text)] leading-relaxed">
                    When you add <code className="font-mono font-bold text-amber-500">mut</code>, the compiler assigns a dedicated slot on the stack and generates storage instructions (<code className="font-mono font-bold text-[var(--rust-text)]">MOV [RBP-4], 5</code>). It tracks write permissions for every line of code.
                  </p>
                )}

                {memoryState === 'mutable_updated' && (
                  <p className="text-[var(--rust-text)] leading-relaxed">
                    Executing <code className="font-mono font-bold text-amber-500">x = 10;</code> emits a hardware store instruction (<code className="font-mono font-bold text-[var(--rust-text)]">MOV [RBP-4], 10</code>). The exact same 4 bytes in RAM are updated in-place with zero reallocation cost.
                  </p>
                )}

                {memoryState === 'shadowed' && (
                  <p className="text-[var(--rust-text)] leading-relaxed">
                    Shadowing does not overwrite the old memory. It creates a brand-new slot on the stack with the new type (<code className="font-mono font-bold text-[var(--rust-primary)]">&amp;str</code>), while the original slot goes out of scope and is reclaimed automatically.
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--rust-border-subtle)] bg-[var(--rust-surface)] font-mono text-xs sm:text-sm text-[var(--rust-text)] font-semibold">
                Hardware Result: <strong>Zero garbage collection pauses. Maximum speed.</strong>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 5: PRACTICE DRILL ("WILL IT COMPILE?")
         ========================================================================= */}
      <section id="phase-5" className="space-y-6 scroll-mt-36">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] font-mono text-sm font-bold shadow-xs">
            05
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] tracking-tight">
            Practice Drill: &ldquo;Will It Compile?&rdquo; (Test Your Knowledge)
          </h2>
        </div>

        <p className="text-base sm:text-lg text-[var(--rust-text)] leading-relaxed">
          Test what you just learned. Click your answer on each code snippet below to see instant feedback:
        </p>

        {/* 3 Interactive Quiz Questions */}
        <div className="space-y-6">
          
          {/* Question 1 */}
          <div className="p-6 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-4 shadow-sm">
            <span className="text-xs font-mono font-bold text-[var(--rust-primary)] uppercase tracking-wider">
              Question 1 of 3
            </span>
            <div className="p-4 rounded-xl bg-[var(--rust-surface-2)] font-mono text-sm text-[var(--rust-text)]">
              <code>
                <span className="text-purple-400 font-bold">let</span> count = <span className="text-amber-400 font-bold">0</span>;{'\n'}
                count = <span className="text-amber-400 font-bold">1</span>;
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { label: 'A) Compiles successfully', correct: false },
                { label: 'B) Fails with Error E0384 (Cannot assign twice)', correct: true },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[1] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(1, oIdx)}
                    className={`p-4 rounded-xl text-left text-sm font-bold border transition-all ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-rose-500 bg-rose-500/10 text-rose-500'
                        : 'border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-text)] hover:border-[var(--rust-primary-border)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[1] !== undefined && (
              <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                quizAnswers[1] === 1 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {quizAnswers[1] === 1 ? (
                  <span>✅ <strong>Correct!</strong> <code className="font-mono font-bold">count</code> is locked by default because it lacks the <code className="font-mono font-bold">mut</code> keyword.</span>
                ) : (
                  <span>❌ <strong>Incorrect.</strong> Remember: bindings are locked by default in Rust! You must write <code className="font-mono font-bold">let mut count = 0;</code> to reassign.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 2 */}
          <div className="p-6 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-4 shadow-sm">
            <span className="text-xs font-mono font-bold text-[var(--rust-primary)] uppercase tracking-wider">
              Question 2 of 3
            </span>
            <div className="p-4 rounded-xl bg-[var(--rust-surface-2)] font-mono text-sm text-[var(--rust-text)]">
              <code>
                <span className="text-purple-400 font-bold">let</span> <span className="text-purple-400 font-bold">mut</span> name = <span className="text-emerald-400 font-bold">&quot;Ferris&quot;</span>;{'\n'}
                name = <span className="text-emerald-400 font-bold">&quot;Crab&quot;</span>;
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { label: 'A) Compiles successfully', correct: true },
                { label: 'B) Fails because strings cannot change', correct: false },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[2] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(2, oIdx)}
                    className={`p-4 rounded-xl text-left text-sm font-bold border transition-all ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-rose-500 bg-rose-500/10 text-rose-500'
                        : 'border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-text)] hover:border-[var(--rust-primary-border)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[2] !== undefined && (
              <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                quizAnswers[2] === 0 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {quizAnswers[2] === 0 ? (
                  <span>✅ <strong>Correct!</strong> <code className="font-mono font-bold">name</code> was declared with <code className="font-mono font-bold">mut</code>, and both values are the same type (<code className="font-mono font-bold">&amp;str</code>).</span>
                ) : (
                  <span>❌ <strong>Incorrect.</strong> Because <code className="font-mono font-bold">mut</code> was supplied, reassignment of the same type is completely valid.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 3 */}
          <div className="p-6 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-4 shadow-sm">
            <span className="text-xs font-mono font-bold text-[var(--rust-primary)] uppercase tracking-wider">
              Question 3 of 3
            </span>
            <div className="p-4 rounded-xl bg-[var(--rust-surface-2)] font-mono text-sm text-[var(--rust-text)]">
              <code>
                <span className="text-purple-400 font-bold">let</span> spaces = <span className="text-emerald-400 font-bold">&quot;   &quot;</span>;{'\n'}
                <span className="text-purple-400 font-bold">let</span> spaces = spaces.<span className="text-blue-400 font-bold">len</span>();
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { label: 'A) Compiles successfully (Shadowing)', correct: true },
                { label: 'B) Fails because type changed from &str to usize', correct: false },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[3] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(3, oIdx)}
                    className={`p-4 rounded-xl text-left text-sm font-bold border transition-all ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-rose-500 bg-rose-500/10 text-rose-500'
                        : 'border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-text)] hover:border-[var(--rust-primary-border)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[3] !== undefined && (
              <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                quizAnswers[3] === 0 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {quizAnswers[3] === 0 ? (
                  <span>✅ <strong>Spot on!</strong> By repeating <code className="font-mono font-bold">let</code>, you shadowed the old variable with a brand-new one, allowing you to freely change its type.</span>
                ) : (
                  <span>❌ <strong>Incorrect.</strong> If this used <code className="font-mono font-bold">mut</code> it would fail, but because <code className="font-mono font-bold">let</code> was repeated, Shadowing creates a new variable.</span>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          PHASE 6: GOLDEN RULES (THE 10-SECOND RECALL)
         ========================================================================= */}
      <section id="phase-6" className="space-y-6 scroll-mt-36">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] font-mono text-sm font-bold shadow-xs">
            06
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] tracking-tight">
            Golden Rules: The 10-Second Recall Checklist
          </h2>
        </div>

        <div className="rounded-2xl border-2 border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)]/20 p-6 sm:p-8 space-y-4 shadow-sm">
          <span className="text-sm font-mono font-bold text-[var(--rust-primary)] uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>Mastery Takeaways for Interviews &amp; Exams</span>
          </span>

          <ul className="space-y-3.5 text-base sm:text-lg text-[var(--rust-text)] font-medium">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Locked by default:</strong> <code className="font-mono font-bold text-[var(--rust-primary)]">let x = 5;</code> is strictly immutable. It cannot be altered by anyone.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>The explicit key:</strong> Add <code className="font-mono font-bold text-[var(--rust-primary)]">mut</code> only when in-place modification is truly needed.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Type constancy:</strong> <code className="font-mono font-bold text-[var(--rust-primary)]">mut</code> changes the value inside, but NEVER changes the data type.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Constants are eternal:</strong> <code className="font-mono font-bold text-[var(--rust-primary)]">const</code> values are computed at compile time, live everywhere, and never allow <code className="font-mono font-bold">mut</code>.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Shadowing superpower:</strong> Use <code className="font-mono font-bold text-[var(--rust-primary)]">let x = ...; let x = ...;</code> to transform values and types cleanly without inventing clumsy variable names.</span>
            </li>
          </ul>
        </div>
      </section>

    </div>
  );
}
