'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Cpu, 
  Lightbulb, 
  AlertTriangle,
  Code2,
  Table,
  Terminal,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { RustConcept } from '../../data/concepts';

export function VariablesAndMutabilityLesson({ concept }: { concept: RustConcept }) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  
  // Interactive Memory Simulator state
  const [memoryState, setMemoryState] = useState<'immutable' | 'mutable_initial' | 'mutable_updated' | 'shadowed'>('immutable');

  // Interactive Quiz state (5 questions)
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
    { id: 'phase-1', number: '1', title: 'Intuition' },
    { id: 'phase-2', number: '2', title: 'Mistake & Fix' },
    { id: 'phase-3', number: '3', title: '3 Rules' },
    { id: 'phase-4', number: '4', title: 'Comparison Table' },
    { id: 'phase-5', number: '5', title: 'In Memory' },
    { id: 'phase-6', number: '6', title: 'Real Scenarios' },
    { id: 'phase-7', number: '7', title: 'Practice Drill' },
    { id: 'phase-8', number: '8', title: 'Summary' },
  ];

  const scrollToPhase = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Clean, Minimal Sticky Navigation Bar */}
      <nav aria-label="Lesson phases" className="sticky top-20 z-20 py-2.5 px-3 bg-[var(--rust-surface)]/90 backdrop-blur-md border border-[var(--rust-border)] rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <span className="text-xs font-medium text-[var(--rust-muted)] px-1">
          Sections:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => scrollToPhase(phase.id)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--rust-muted)] hover:text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] transition-colors"
            >
              <span className="text-[var(--rust-primary)]">{phase.number}.</span>
              <span>{phase.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* =========================================================================
          PHASE 1: EVERYDAY INTUITION
         ========================================================================= */}
      <section id="phase-1" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Everyday Intuition: The Permanent Marker vs The Chalkboard
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          Imagine you have a cardboard box labeled <code className="px-1.5 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-text)] font-mono text-sm">apples</code>.
        </p>

        {/* 2-Card Visual Metaphor Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Default in Python / JS / C++ */}
          <div className="p-6 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--rust-muted)]">
                Most Languages (Python, JavaScript, C++)
              </span>
              <Unlock className="w-4 h-4 text-[var(--rust-muted)]" />
            </div>
            
            <h3 className="text-base font-medium text-[var(--rust-text)]">
              The Chalkboard Box (Unlocked by Default)
            </h3>

            <p className="text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
              In most languages, variables can change at any time without warning. Anyone walking past can wipe off the number <span className="font-mono text-[var(--rust-text)]">5</span> and write <span className="font-mono text-[var(--rust-text)]">100</span>. You never know who changed it, when it changed, or why your code broke 300 lines later.
            </p>

            <div className="pt-2 border-t border-[var(--rust-border-subtle)] text-xs text-[var(--rust-muted)]">
              Risk: Unintended mutations, hard-to-reproduce state bugs, data races.
            </div>
          </div>

          {/* Card 2: The Rust Way */}
          <div className="p-6 rounded-xl border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--rust-primary)]">
                The Rust Way (Safe by Default)
              </span>
              <Lock className="w-4 h-4 text-[var(--rust-primary)]" />
            </div>

            <h3 className="text-base font-medium text-[var(--rust-text)]">
              The Locked Safe (Permanent Marker by Default)
            </h3>

            <p className="text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
              In Rust, every variable is <span className="text-[var(--rust-text)]">immutable (locked)</span> by default. Once you write <span className="font-mono text-[var(--rust-text)]">5</span>, it is sealed. If you want permission to change it, you must explicitly add the <code className="px-1.5 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-text)] font-mono text-xs">mut</code> keyword (short for mutable).
            </p>

            <div className="pt-2 border-t border-[var(--rust-primary-border)]/40 text-xs text-[var(--rust-primary)]">
              Guarantee: 100% certainty that the value never changes unless you explicitly marked it.
            </div>
          </div>

        </div>

        {/* Why this matters callout */}
        <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] flex items-start gap-3.5">
          <Lightbulb className="w-5 h-5 text-[var(--rust-primary)] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
            <span className="font-medium text-[var(--rust-text)]">Why does Rust do this?</span>
            <p>
              When dozens of developers write complex code or run multi-threaded background tasks simultaneously, immutable variables guarantee that no thread or function can secretly modify shared data. It eliminates entire classes of concurrency bugs and unexpected side effects before your program ever runs.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 2: THE MISTAKE & THE FIX
         ========================================================================= */}
      <section id="phase-2" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Step-by-Step: The First Mistake &amp; The Fix
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          Let’s watch what happens when you try to change a variable without permission. Rust stops you at compile time and explains the issue with a friendly suggestion.
        </p>

        {/* Side-by-Side: Broken Code vs Fixed Code */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Step 2A: The Broken Code */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Step 2A: Code that fails to compile</span>
              </span>
              <button
                onClick={() => handleCopy(`fn main() {\n    let apples = 5;\n    println!("I have {} apples", apples);\n\n    apples = 10; // ❌ ERROR!\n}`, 'code-fail')}
                className="text-xs font-medium text-[var(--rust-muted)] hover:text-[var(--rust-text)] flex items-center gap-1 px-2 py-0.5 rounded border border-[var(--rust-border)] hover:bg-[var(--rust-surface-2)] transition-colors"
              >
                {copiedIndex === 'code-fail' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 'code-fail' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm overflow-x-auto shadow-sm">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">fn</span> <span className="text-sky-300">main</span>() &#123;{'\n'}
                  {'    '}<span className="text-pink-400">let</span> apples = <span className="text-amber-300">5</span>; <span className="text-slate-400 italic">// Locked by default</span>{'\n'}
                  {'    '}<span className="text-sky-300">println!</span>(<span className="text-emerald-300">&quot;I have &#123;&#125; apples&quot;</span>, apples);{'\n\n'}
                  {'    '}<span className="text-rose-400 underline decoration-rose-500">apples = 10;</span> <span className="text-rose-400 italic">// ❌ Compile Error E0384</span>{'\n'}
                  &#125;
                </code>
              </pre>
            </div>
          </div>

          {/* Step 2B: The Easy Fix */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Step 2B: The Working Fix (Add `mut`)</span>
              </span>
              <button
                onClick={() => handleCopy(`fn main() {\n    let mut apples = 5; // mut unlocks permission to change\n    println!("I have {} apples", apples);\n\n    apples = 10; // Allowed!\n    println!("Now I have {} apples", apples);\n}`, 'code-fix')}
                className="text-xs font-medium text-[var(--rust-muted)] hover:text-[var(--rust-text)] flex items-center gap-1 px-2 py-0.5 rounded border border-[var(--rust-border)] hover:bg-[var(--rust-surface-2)] transition-colors"
              >
                {copiedIndex === 'code-fix' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 'code-fix' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm overflow-x-auto shadow-sm">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">fn</span> <span className="text-sky-300">main</span>() &#123;{'\n'}
                  {'    '}<span className="text-pink-400">let</span> <span className="text-emerald-300 font-medium">mut</span> apples = <span className="text-amber-300">5</span>; <span className="text-slate-400 italic">// 'mut' unlocks permission to modify</span>{'\n'}
                  {'    '}<span className="text-sky-300">println!</span>(<span className="text-emerald-300">&quot;I have &#123;&#125; apples&quot;</span>, apples); <span className="text-slate-400 italic">// Prints 5</span>{'\n\n'}
                  {'    '}<span className="text-emerald-300">apples = 10;</span> <span className="text-slate-400 italic">// ✅ Allowed! Value updated in-place</span>{'\n'}
                  {'    '}<span className="text-sky-300">println!</span>(<span className="text-emerald-300">&quot;Now I have &#123;&#125; apples&quot;</span>, apples); <span className="text-slate-400 italic">// Prints 10</span>{'\n'}
                  &#125;
                </code>
              </pre>
            </div>
          </div>

        </div>

        {/* The Exact Compiler Diagnostic Terminal */}
        <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)]/60 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--rust-muted)]">
            <span className="flex items-center gap-2 text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Exact Compiler Diagnostic (Error E0384)</span>
            </span>
            <span>Terminal</span>
          </div>

          <div className="p-4 rounded-lg bg-black border border-slate-800 font-mono text-xs sm:text-sm leading-relaxed space-y-1 text-slate-100 shadow-inner">
            <div className="text-rose-400 font-medium">error[E0384]: cannot assign twice to immutable variable `apples`</div>
            <div className="text-slate-400"> --&gt; src/main.rs:5:5</div>
            <div className="text-slate-500">  |</div>
            <div className="text-slate-300">2 |     let apples = 5;</div>
            <div className="text-slate-400">  |         ------ first assignment to `apples`</div>
            <div className="text-cyan-300 font-medium bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 w-fit">  |         help: consider making this binding mutable: `mut apples`</div>
            <div className="text-slate-300">5 |     apples = 10;</div>
            <div className="text-rose-400">  |     ^^^^^^^^^^^ cannot assign twice to immutable variable</div>
          </div>

          <div className="flex items-start gap-2 text-xs text-[var(--rust-muted)] leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Notice the <span className="text-cyan-400 font-medium">help</span> suggestion from the compiler. Rust doesn&apos;t just tell you that your code broke; it pinpoints the exact line and explains the fix: <code className="font-mono text-[var(--rust-text)]">mut apples</code>.
            </span>
          </div>
        </div>

        {/* Step 2C: Compiler Gotcha - Unused mut warning */}
        <div className="p-4 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
            <span className="font-medium text-[var(--rust-text)]">Compiler Hygiene: What if you add `mut` but never change the variable?</span>
            <p>
              If you write <code className="font-mono text-[var(--rust-text)]">let mut score = 10;</code> and never modify it later, Rust issues a friendly compiler warning: <span className="text-amber-400 font-mono">warning: variable does not need to be mutable</span>. Rust actively helps you remove unnecessary mutation!
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 3: THE 3 CORE RULES
         ========================================================================= */}
      <section id="phase-3" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            03
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            The Three Rules: Mutability, Constants, and Shadowing
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          Beginners often ask three natural questions: Can <code className="font-mono text-[var(--rust-text)]">mut</code> change types? What is a constant? What on earth is shadowing? Here are the 3 rules that explain it simply.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Rule 1: Type Constancy */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="text-xs font-medium text-[var(--rust-primary)]">
                Rule 1 • Value vs Type
              </span>

              <h3 className="text-base font-medium text-[var(--rust-text)]">
                `mut` changes values, never types
              </h3>

              <p className="text-xs sm:text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
                If you declare <code className="font-mono text-[var(--rust-text)]">let mut score = 100;</code>, it is an integer. You can change <span className="font-mono text-[var(--rust-text)]">100</span> to <span className="font-mono text-[var(--rust-text)]">200</span>, but you cannot assign text like <code className="font-mono text-[var(--rust-text)]">&quot;Win&quot;</code> to it.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">let</span> <span className="text-pink-400">mut</span> x = <span className="text-amber-300">100</span>;{'\n'}
                  x = <span className="text-amber-300">200</span>; <span className="text-slate-400 italic">// ✅ OK</span>{'\n'}
                  <span className="text-rose-400">// x = &quot;text&quot;; // ❌ Error</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Rule 2: let vs const */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="text-xs font-medium text-cyan-400">
                Rule 2 • Variables vs Constants
              </span>

              <h3 className="text-base font-medium text-[var(--rust-text)]">
                Runtime variables vs hardcoded constants
              </h3>

              <p className="text-xs sm:text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
                <code className="font-mono text-[var(--rust-text)]">let</code> variables run at runtime inside stack frames. <code className="font-mono text-[var(--rust-text)]">const</code> constants are hardcoded at compile time, never allow <code className="font-mono text-[var(--rust-text)]">mut</code>, and require explicit types.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">const</span> <span className="text-amber-300">MAX</span>: <span className="text-sky-300">u32</span> = <span className="text-amber-300">100_000</span>;{'\n'}
                  <span className="text-slate-400 italic">// Naming is SCREAMING_SNAKE</span>{'\n'}
                  <span className="text-slate-400 italic">// Inlined into binary directly</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Rule 3: Shadowing */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="text-xs font-medium text-amber-400">
                Rule 3 • Shadowing Superpower
              </span>

              <h3 className="text-base font-medium text-[var(--rust-text)]">
                Declaring `let` twice to transform types
              </h3>

              <p className="text-xs sm:text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
                Need to convert string <code className="font-mono text-[var(--rust-text)]">&quot;42&quot;</code> to number <code className="font-mono text-[var(--rust-text)]">42</code>? Don&apos;t invent awkward names like <code className="font-mono text-[var(--rust-text)]">num_str</code>. Just repeat <code className="font-mono text-[var(--rust-text)]">let</code> to shadow the old binding!
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">let</span> age = <span className="text-emerald-300">&quot;42&quot;</span>; <span className="text-slate-400 italic">// &amp;str</span>{'\n'}
                  <span className="text-pink-400">let</span> age: <span className="text-sky-300">u32</span> = <span className="text-amber-300">42</span>; <span className="text-slate-400 italic">// u32!</span>{'\n'}
                  <span className="text-slate-400 italic">// Clean &amp; idiomatic in Rust</span>
                </code>
              </pre>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PHASE 4: COMPARISON CHEAT SHEET TABLE
         ========================================================================= */}
      <section id="phase-4" className="space-y-5 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            04
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Comparison Matrix: Variables vs Mutability vs Constants vs Shadowing
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          Here is a quick side-by-side reference table to clarify the exact differences in syntax, memory behavior, and use cases:
        </p>

        <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--rust-border)] bg-[var(--rust-surface-2)]/70 text-[var(--rust-text)] font-medium">
                  <th className="p-3.5 sm:px-5">Feature</th>
                  <th className="p-3.5 sm:px-5">`let x = 5;` (Default)</th>
                  <th className="p-3.5 sm:px-5">`let mut x = 5;` (Mutable)</th>
                  <th className="p-3.5 sm:px-5">`const MAX: u32 = 100;`</th>
                  <th className="p-3.5 sm:px-5">`let x = ...; let x = ...;` (Shadow)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--rust-border)] text-[var(--rust-muted)]">
                <tr className="hover:bg-[var(--rust-surface-2)]/40 transition-colors">
                  <td className="p-3.5 sm:px-5 font-medium text-[var(--rust-text)]">Can value change?</td>
                  <td className="p-3.5 sm:px-5 text-rose-400">❌ No (Immutable)</td>
                  <td className="p-3.5 sm:px-5 text-emerald-400">✅ Yes (In-place)</td>
                  <td className="p-3.5 sm:px-5 text-rose-400">❌ Never</td>
                  <td className="p-3.5 sm:px-5 text-emerald-400">✅ Yes (New binding)</td>
                </tr>
                <tr className="hover:bg-[var(--rust-surface-2)]/40 transition-colors">
                  <td className="p-3.5 sm:px-5 font-medium text-[var(--rust-text)]">Can type change?</td>
                  <td className="p-3.5 sm:px-5 text-rose-400">❌ No</td>
                  <td className="p-3.5 sm:px-5 text-rose-400">❌ No (Same type only)</td>
                  <td className="p-3.5 sm:px-5 text-rose-400">❌ No</td>
                  <td className="p-3.5 sm:px-5 text-emerald-400">✅ Yes (Any new type)</td>
                </tr>
                <tr className="hover:bg-[var(--rust-surface-2)]/40 transition-colors">
                  <td className="p-3.5 sm:px-5 font-medium text-[var(--rust-text)]">Type Annotation</td>
                  <td className="p-3.5 sm:px-5">Optional (Inferred)</td>
                  <td className="p-3.5 sm:px-5">Optional (Inferred)</td>
                  <td className="p-3.5 sm:px-5 text-[var(--rust-primary)] font-medium">Mandatory</td>
                  <td className="p-3.5 sm:px-5">Optional (Inferred)</td>
                </tr>
                <tr className="hover:bg-[var(--rust-surface-2)]/40 transition-colors">
                  <td className="p-3.5 sm:px-5 font-medium text-[var(--rust-text)]">Memory Location</td>
                  <td className="p-3.5 sm:px-5">Stack or CPU Register</td>
                  <td className="p-3.5 sm:px-5">Stack Frame Slot</td>
                  <td className="p-3.5 sm:px-5">Inlined in Binary</td>
                  <td className="p-3.5 sm:px-5">Brand-new Stack Slot</td>
                </tr>
                <tr className="hover:bg-[var(--rust-surface-2)]/40 transition-colors">
                  <td className="p-3.5 sm:px-5 font-medium text-[var(--rust-text)]">Scope</td>
                  <td className="p-3.5 sm:px-5">Local Block / Function</td>
                  <td className="p-3.5 sm:px-5">Local Block / Function</td>
                  <td className="p-3.5 sm:px-5">Global or Local</td>
                  <td className="p-3.5 sm:px-5">Current &amp; Inner Scopes</td>
                </tr>
                <tr className="hover:bg-[var(--rust-surface-2)]/40 transition-colors">
                  <td className="p-3.5 sm:px-5 font-medium text-[var(--rust-text)]">Primary Use Case</td>
                  <td className="p-3.5 sm:px-5">90% of all variables</td>
                  <td className="p-3.5 sm:px-5">Counters, accumulators, buffers</td>
                  <td className="p-3.5 sm:px-5">Fixed configs, limits, math constants</td>
                  <td className="p-3.5 sm:px-5">Parsing, sanitizing, type conversions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 5: INSIDE COMPUTER RAM & HARDWARE
         ========================================================================= */}
      <section id="phase-5" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Inside RAM: What the Computer Hardware Actually Does
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          How do the CPU and physical memory store these variables? Click the interactive tabs below to watch the hardware stack frame transform:
        </p>

        {/* Interactive Memory Studio Box */}
        <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-5 sm:p-6 space-y-6">
          
          {/* State Switcher Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[var(--rust-border)] pb-4">
            {[
              { id: 'immutable', label: '1. let x = 5 (Locked)' },
              { id: 'mutable_initial', label: '2. let mut x = 5 (Writable)' },
              { id: 'mutable_updated', label: '3. x = 10 (Modified In-Place)' },
              { id: 'shadowed', label: '4. let x = "Hello" (Shadowed)' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setMemoryState(st.id as typeof memoryState)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  memoryState === st.id
                    ? 'bg-[var(--rust-primary)] text-white'
                    : 'bg-[var(--rust-surface-2)] text-[var(--rust-muted)] hover:text-[var(--rust-text)]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Visual Memory Representation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* The Stack Box Visual */}
            <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)]/50 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[var(--rust-muted)] border-b border-[var(--rust-border)] pb-2 font-sans text-xs">
                <span>Stack Frame [0x7fff0010]</span>
                <span className="text-[var(--rust-primary)]">RAM Layout</span>
              </div>

              {memoryState === 'immutable' && (
                <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 font-sans">
                    <span className="font-medium">x : i32</span>
                    <span className="text-xs flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  </div>
                  <div className="text-xl font-mono text-[var(--rust-text)]">
                    Value: 5
                  </div>
                  <div className="text-xs text-[var(--rust-muted)] font-mono">
                    Bytes: [ 00 00 00 05 ] (4 bytes on stack)
                  </div>
                </div>
              )}

              {memoryState === 'mutable_initial' && (
                <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex items-center justify-between text-amber-400 font-sans">
                    <span className="font-medium">mut x : i32</span>
                    <span className="text-xs flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Writable
                    </span>
                  </div>
                  <div className="text-xl font-mono text-[var(--rust-text)]">
                    Value: 5
                  </div>
                  <div className="text-xs text-[var(--rust-muted)] font-mono">
                    Bytes: [ 00 00 00 05 ] (Can be overwritten)
                  </div>
                </div>
              )}

              {memoryState === 'mutable_updated' && (
                <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex items-center justify-between text-amber-400 font-sans">
                    <span className="font-medium">mut x : i32</span>
                    <span className="text-xs flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Overwritten
                    </span>
                  </div>
                  <div className="text-xl font-mono text-[var(--rust-text)]">
                    Value: 10 <span className="text-xs text-[var(--rust-muted)] font-sans line-through ml-1">(was 5)</span>
                  </div>
                  <div className="text-xs text-[var(--rust-muted)] font-mono">
                    Bytes: [ 00 00 00 0A ] (Overwritten in-place)
                  </div>
                </div>
              )}

              {memoryState === 'shadowed' && (
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-lg border border-dashed border-[var(--rust-border)] text-xs text-[var(--rust-muted)] font-sans">
                    <span className="line-through">Original x : i32 = 5</span> (Shadowed / Superseded)
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)]/20 space-y-2">
                    <div className="flex items-center justify-between text-[var(--rust-primary)] font-sans">
                      <span className="font-medium">New x : &amp;str</span>
                      <span className="text-xs">New Stack Slot</span>
                    </div>
                    <div className="text-xl font-mono text-[var(--rust-text)]">
                      &quot;Hello&quot;
                    </div>
                    <div className="text-xs text-[var(--rust-muted)] font-mono">
                      Stack size: 16 bytes (pointer + length fat pointer)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation of Hardware Mechanics */}
            <div className="flex flex-col justify-between space-y-4 text-sm text-[var(--rust-muted)] leading-relaxed">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--rust-text)]">
                  <Cpu className="w-4 h-4 text-[var(--rust-primary)]" />
                  <span>Hardware &amp; Assembly Instructions</span>
                </div>
                
                {memoryState === 'immutable' && (
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--rust-muted)]">
                      Because Rust mathematically proves <code className="font-mono text-[var(--rust-text)]">x</code> never changes, the LLVM compiler can keep the number 5 inside a fast CPU register (<code className="font-mono text-[var(--rust-text)]">%rax</code>) without even performing a RAM memory load.
                    </p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                      x86_64: mov eax, 5 ; Pure register storage
                    </div>
                  </div>
                )}

                {memoryState === 'mutable_initial' && (
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--rust-muted)]">
                      Adding <code className="font-mono text-[var(--rust-text)]">mut</code> informs the compiler that this value will be modified. It reserves 4 bytes on the stack and tracks mutation permissions across each subsequent line.
                    </p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                      x86_64: mov dword ptr [rsp - 4], 5 ; Stack allocation
                    </div>
                  </div>
                )}

                {memoryState === 'mutable_updated' && (
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--rust-muted)]">
                      Executing <code className="font-mono text-[var(--rust-text)]">x = 10</code> updates the exact same 4 bytes on the stack in-place. Zero heap allocations, zero pointer dereferences, zero garbage collection pauses.
                    </p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                      x86_64: mov dword ptr [rsp - 4], 10 ; In-place overwrite
                    </div>
                  </div>
                )}

                {memoryState === 'shadowed' && (
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--rust-muted)]">
                      Shadowing does not overwrite the old memory. It allocates a brand-new slot for the new type (<code className="font-mono text-[var(--rust-text)]">&amp;str</code>). The previous variable name is overshadowed and will be automatically reclaimed when the scope ends.
                    </p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                      x86_64: lea rax, [rip + str_ptr] ; New pointer slot
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[var(--rust-surface-2)] text-xs text-[var(--rust-muted)] border border-[var(--rust-border-subtle)]">
                Performance Verdict: <strong>Zero-cost abstraction.</strong> Compile-time safety guarantees without paying runtime performance penalties.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 6: 4 REAL-WORLD PRACTICAL SCENARIOS
         ========================================================================= */}
      <section id="phase-6" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            06
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Real-World Scenarios: When to Use Which Pattern?
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          In real Rust projects, when should you write <code className="font-mono text-[var(--rust-text)]">mut</code>, when should you use <code className="font-mono text-[var(--rust-text)]">shadowing</code>, and when should you define a <code className="font-mono text-[var(--rust-text)]">const</code>? Here are 4 practical industry examples:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Scenario 1: mut for Accumulator Loop */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400">Scenario A • Accumulators &amp; Loops</span>
              <span className="text-xs font-mono text-[var(--rust-muted)]">Use `mut`</span>
            </div>

            <h3 className="text-sm font-medium text-[var(--rust-text)]">
              Summing values or updating state in a loop
            </h3>

            <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
              When accumulating numbers or maintaining a running total across loop iterations, in-place mutation is the standard, high-performance approach:
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">let</span> <span className="text-pink-400">mut</span> total = <span className="text-amber-300">0</span>;{'\n'}
                  <span className="text-pink-400">for</span> n <span className="text-pink-400">in</span> <span className="text-amber-300">1</span>..=<span className="text-amber-300">5</span> &#123;{'\n'}
                  {'    '}total += n; <span className="text-slate-400 italic">// In-place accumulation</span>{'\n'}
                  &#125;{'\n'}
                  <span className="text-sky-300">println!</span>(<span className="text-emerald-300">&quot;Total: &#123;&#125;&quot;</span>, total); <span className="text-slate-400 italic">// 15</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Scenario 2: Shadowing for String Parsing */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-400">Scenario B • Parsing &amp; Sanitization</span>
              <span className="text-xs font-mono text-[var(--rust-muted)]">Use Shadowing</span>
            </div>

            <h3 className="text-sm font-medium text-[var(--rust-text)]">
              Transforming input types without clumsy names
            </h3>

            <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
              When reading raw CLI arguments or environment variables as text and converting to numbers, shadowing gives you clean names and locks the parsed result as immutable:
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">let</span> port = <span className="text-emerald-300">&quot;8080&quot;</span>; <span className="text-slate-400 italic">// Raw text input (&amp;str)</span>{'\n'}
                  <span className="text-pink-400">let</span> port: <span className="text-sky-300">u16</span> = port.<span className="text-sky-300">parse</span>().<span className="text-sky-300">unwrap</span>();{'\n'}
                  <span className="text-slate-400 italic">// Now 'port' is a validated u16 number!</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Scenario 3: Constants for Fixed Configs */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-cyan-400">Scenario C • Fixed Architecture Limits</span>
              <span className="text-xs font-mono text-[var(--rust-muted)]">Use `const`</span>
            </div>

            <h3 className="text-sm font-medium text-[var(--rust-text)]">
              Application limits, timeout limits, and math formulas
            </h3>

            <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
              When a value is a universal truth across your whole application and never changes at runtime, define it as a top-level constant:
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">const</span> <span className="text-amber-300">MAX_CONNECTIONS</span>: <span className="text-sky-300">usize</span> = <span className="text-amber-300">10_000</span>;{'\n'}
                  <span className="text-pink-400">const</span> <span className="text-amber-300">TIMEOUT_SECONDS</span>: <span className="text-sky-300">u64</span> = <span className="text-amber-300">30</span>;{'\n'}
                  <span className="text-slate-400 italic">// Inlined into CPU instructions everywhere</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Scenario 4: Scope Shadowing */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-purple-400">Scenario D • Block Scope Shadowing</span>
              <span className="text-xs font-mono text-[var(--rust-muted)]">Scoped Shadowing</span>
            </div>

            <h3 className="text-sm font-medium text-[var(--rust-text)]">
              Temporarily altering a value inside an inner block
            </h3>

            <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
              Shadowing inside an inner block `{ }` only shadows within that block. Once the block ends, the original outer variable returns:
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs shadow-inner">
              <pre className="text-slate-100 leading-relaxed">
                <code>
                  <span className="text-pink-400">let</span> x = <span className="text-amber-300">5</span>;{'\n'}
                  &#123;{'\n'}
                  {'    '}<span className="text-pink-400">let</span> x = x * <span className="text-amber-300">2</span>; <span className="text-slate-400 italic">// Inner x is 10</span>{'\n'}
                  {'    '}<span className="text-sky-300">println!</span>(<span className="text-emerald-300">&quot;Inner: &#123;&#125;&quot;</span>, x); <span className="text-slate-400 italic">// 10</span>{'\n'}
                  &#125;{'\n'}
                  <span className="text-sky-300">println!</span>(<span className="text-emerald-300">&quot;Outer: &#123;&#125;&quot;</span>, x); <span className="text-slate-400 italic">// Still 5!</span>
                </code>
              </pre>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PHASE 7: PRACTICE DRILL ("WILL IT COMPILE?")
         ========================================================================= */}
      <section id="phase-7" className="space-y-6 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            07
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Practice Drill: Will It Compile? (5 Diagnostic Challenges)
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          Test what you learned on these 5 interactive scenarios. Click an option to inspect whether the Rust compiler accepts or rejects each one:
        </p>

        {/* 5 Interactive Quiz Questions */}
        <div className="space-y-4">
          
          {/* Question 1 */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <span className="text-xs font-medium text-[var(--rust-muted)]">
              Question 1 of 5
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 shadow-inner">
              <code>
                <span className="text-pink-400">let</span> count = <span className="text-amber-300">0</span>;{'\n'}
                count = <span className="text-amber-300">1</span>;
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) Compiles successfully', correct: false },
                { label: 'B) Fails with Error E0384 (Cannot assign twice)', correct: true },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[1] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(1, oIdx)}
                    className={`p-3 rounded-lg text-left text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                          : 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                        : 'border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-muted)] hover:text-[var(--rust-text)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[1] !== undefined && (
              <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                quizAnswers[1] === 1 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {quizAnswers[1] === 1 ? (
                  <span>Correct! <code className="font-mono text-[var(--rust-text)]">count</code> was not declared with <code className="font-mono text-[var(--rust-text)]">mut</code>, so reassignment is forbidden.</span>
                ) : (
                  <span>Incorrect. In Rust, all bindings are immutable by default unless you declare <code className="font-mono text-[var(--rust-text)]">let mut count = 0;</code>.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <span className="text-xs font-medium text-[var(--rust-muted)]">
              Question 2 of 5
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 shadow-inner">
              <code>
                <span className="text-pink-400">let</span> <span className="text-pink-400">mut</span> name = <span className="text-emerald-300">&quot;Ferris&quot;</span>;{'\n'}
                name = <span className="text-emerald-300">&quot;Crab&quot;</span>;
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) Compiles successfully', correct: true },
                { label: 'B) Fails because strings cannot change', correct: false },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[2] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(2, oIdx)}
                    className={`p-3 rounded-lg text-left text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                          : 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                        : 'border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-muted)] hover:text-[var(--rust-text)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[2] !== undefined && (
              <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                quizAnswers[2] === 0 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {quizAnswers[2] === 0 ? (
                  <span>Correct! <code className="font-mono text-[var(--rust-text)]">name</code> is declared with <code className="font-mono text-[var(--rust-text)]">mut</code>, and both values share the same type (<code className="font-mono text-[var(--rust-text)]">&amp;str</code>).</span>
                ) : (
                  <span>Incorrect. <code className="font-mono text-[var(--rust-text)]">mut</code> gives permission to modify the value, provided the data type remains unchanged.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 3 */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <span className="text-xs font-medium text-[var(--rust-muted)]">
              Question 3 of 5
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 shadow-inner">
              <code>
                <span className="text-pink-400">let</span> <span className="text-pink-400">mut</span> score = <span className="text-amber-300">100</span>;{'\n'}
                score = <span className="text-emerald-300">&quot;Winner&quot;</span>;
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) Compiles successfully', correct: false },
                { label: 'B) Fails with Error E0308 (Mismatched types: expected integer, found &str)', correct: true },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[3] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(3, oIdx)}
                    className={`p-3 rounded-lg text-left text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                          : 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                        : 'border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-muted)] hover:text-[var(--rust-text)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[3] !== undefined && (
              <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                quizAnswers[3] === 1 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {quizAnswers[3] === 1 ? (
                  <span>Correct! <code className="font-mono text-[var(--rust-text)]">mut</code> only allows changing the value, NEVER the underlying type.</span>
                ) : (
                  <span>Incorrect. You cannot put text inside a number variable. To change types in Rust, you must use Shadowing!</span>
                )}
              </div>
            )}
          </div>

          {/* Question 4 */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <span className="text-xs font-medium text-[var(--rust-muted)]">
              Question 4 of 5
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 shadow-inner">
              <code>
                <span className="text-pink-400">let</span> spaces = <span className="text-emerald-300">&quot;   &quot;</span>;{'\n'}
                <span className="text-pink-400">let</span> spaces = spaces.<span className="text-sky-300">len</span>();
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) Compiles successfully (Shadowing creates a new variable)', correct: true },
                { label: 'B) Fails because variable name is duplicated', correct: false },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[4] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(4, oIdx)}
                    className={`p-3 rounded-lg text-left text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                          : 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                        : 'border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-muted)] hover:text-[var(--rust-text)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[4] !== undefined && (
              <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                quizAnswers[4] === 0 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {quizAnswers[4] === 0 ? (
                  <span>Correct! Re-declaring with <code className="font-mono text-[var(--rust-text)]">let</code> shadows the previous variable and permits changing the type.</span>
                ) : (
                  <span>Incorrect. In Rust, repeating <code className="font-mono text-[var(--rust-text)]">let</code> is called Shadowing and is explicitly encouraged.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 5 */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <span className="text-xs font-medium text-[var(--rust-muted)]">
              Question 5 of 5
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 shadow-inner">
              <code>
                <span className="text-pink-400">const</span> <span className="text-pink-400">mut</span> PI: <span className="text-sky-300">f64</span> = <span className="text-amber-300">3.14159</span>;
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) Compiles successfully', correct: false },
                { label: 'B) Fails with Error: const cannot be mutable', correct: true },
              ].map((opt, oIdx) => {
                const selected = quizAnswers[5] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuizSelect(5, oIdx)}
                    className={`p-3 rounded-lg text-left text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? opt.correct
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                          : 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                        : 'border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-muted)] hover:text-[var(--rust-text)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {quizAnswers[5] !== undefined && (
              <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                quizAnswers[5] === 1 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {quizAnswers[5] === 1 ? (
                  <span>Correct! Constants are immutable by definition and can never be marked with <code className="font-mono text-[var(--rust-text)]">mut</code>.</span>
                ) : (
                  <span>Incorrect. <code className="font-mono text-[var(--rust-text)]">const</code> items cannot be mutable. If you need runtime mutation, use <code className="font-mono text-[var(--rust-text)]">let mut</code>.</span>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          PHASE 8: KEY TAKEAWAYS CHECKLIST
         ========================================================================= */}
      <section id="phase-8" className="space-y-4 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            08
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Mastery Checklist: The 5 Golden Takeaways
          </h2>
        </div>

        <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-6 space-y-3">
          <ul className="space-y-3 text-sm text-[var(--rust-muted)] font-normal leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span><span className="text-[var(--rust-text)] font-medium">Locked by default:</span> <code className="font-mono text-[var(--rust-text)]">let x = 5;</code> is immutable. It prevents accidental mutation and concurrency races across threads.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span><span className="text-[var(--rust-text)] font-medium">The explicit key:</span> Add <code className="font-mono text-[var(--rust-text)]">mut</code> only when in-place modification is truly needed (loops, counters, buffers).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span><span className="text-[var(--rust-text)] font-medium">Type constancy:</span> <code className="font-mono text-[var(--rust-text)]">mut</code> allows updating the value, but never changes the variable&apos;s data type.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span><span className="text-[var(--rust-text)] font-medium">Constants are eternal:</span> <code className="font-mono text-[var(--rust-text)]">const</code> items are computed at compile time, hardcoded into assembly, and never allow <code className="font-mono text-[var(--rust-text)]">mut</code>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span><span className="text-[var(--rust-text)] font-medium">Shadowing superpower:</span> Repeating <code className="font-mono text-[var(--rust-text)]">let</code> creates a new variable, allowing you to transform data types cleanly without awkward variable naming.</span>
            </li>
          </ul>
        </div>
      </section>

    </div>
  );
}
