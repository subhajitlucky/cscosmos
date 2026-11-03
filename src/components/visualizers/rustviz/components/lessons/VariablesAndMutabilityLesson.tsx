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
  HelpCircle,
  Lightbulb,
  ArrowRight
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
    { id: 'phase-1', number: '1', title: 'Intuition' },
    { id: 'phase-2', number: '2', title: 'Mistake & Fix' },
    { id: 'phase-3', number: '3', title: '3 Rules' },
    { id: 'phase-4', number: '4', title: 'In Memory' },
    { id: 'phase-5', number: '5', title: 'Quiz' },
    { id: 'phase-6', number: '6', title: 'Summary' },
  ];

  const scrollToPhase = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Clean, Minimal Phase Navigation Bar */}
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
      <section id="phase-1" className="space-y-5 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Everyday Intuition: The Permanent Marker vs The Pencil
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          Imagine you have a cardboard box labeled <code className="px-1.5 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-text)] font-mono text-sm">apples</code>.
        </p>

        {/* 2-Card Visual Metaphor Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Default in Python / JS / C++ */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--rust-muted)]">
                Most Languages (Python, JavaScript, C++)
              </span>
              <Unlock className="w-4 h-4 text-[var(--rust-muted)]" />
            </div>
            
            <h3 className="text-base font-medium text-[var(--rust-text)]">
              The Chalkboard Box (Unlocked)
            </h3>

            <p className="text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
              In most languages, variables can change at any time. Anyone walking past can wipe off the number <span className="font-mono text-[var(--rust-text)]">5</span> and write <span className="font-mono text-[var(--rust-text)]">100</span>. You never know who changed it or why your code broke 50 lines later.
            </p>
          </div>

          {/* Card 2: The Rust Way */}
          <div className="p-5 rounded-xl border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--rust-primary)]">
                The Rust Way (Safe by Default)
              </span>
              <Lock className="w-4 h-4 text-[var(--rust-primary)]" />
            </div>

            <h3 className="text-base font-medium text-[var(--rust-text)]">
              The Locked Safe (Permanent Marker)
            </h3>

            <p className="text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
              In Rust, every variable is <span className="text-[var(--rust-text)]">immutable (locked)</span> by default. Once you write <span className="font-mono text-[var(--rust-text)]">5</span>, it is sealed. If you want permission to change it later, you must explicitly add the <code className="px-1.5 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-text)] font-mono text-xs">mut</code> keyword (short for mutable).
            </p>
          </div>

        </div>

        {/* Why this matters callout */}
        <div className="p-4 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
            <span className="font-medium text-[var(--rust-text)]">Why does Rust do this?</span>
            <p>
              When people collaborate on large codebases, immutable variables guarantee that no function can secretly modify your data behind your back. If a variable lacks <code className="font-mono text-[var(--rust-text)]">mut</code>, its value will never change.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 2: THE MISTAKE & THE FIX
         ========================================================================= */}
      <section id="phase-2" className="space-y-5 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Step-by-Step: The First Mistake &amp; The Fix
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          Let’s watch what happens when you try to change a variable without permission. Rust stops you before your program ever runs.
        </p>

        {/* Step 2A: The Broken Code */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Step 2A: Code that fails to compile</span>
            </span>
            <button
              onClick={() => handleCopy(`fn main() {\n    let apples = 5;\n    println!("I have {} apples", apples);\n\n    apples = 10; // Error!\n}`, 'code-fail')}
              className="text-xs font-medium text-[var(--rust-muted)] hover:text-[var(--rust-text)] flex items-center gap-1 px-2 py-0.5 rounded border border-[var(--rust-border)] hover:bg-[var(--rust-surface-2)] transition-colors"
            >
              {copiedIndex === 'code-fail' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedIndex === 'code-fail' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-[var(--rust-text)] leading-relaxed">
              <code>
                <span className="text-purple-400">fn</span> <span className="text-blue-400">main</span>() &#123;{'\n'}
                {'    '}<span className="text-purple-400">let</span> apples = <span className="text-amber-400">5</span>; <span className="text-[var(--rust-subtle)] italic">// Locked by default</span>{'\n'}
                {'    '}<span className="text-blue-400">println!</span>(<span className="text-emerald-400">&quot;I have &#123;&#125; apples&quot;</span>, apples);{'\n\n'}
                {'    '}<span className="text-rose-400">apples = 10;</span> <span className="text-rose-400 italic">// ❌ Error: cannot assign twice to immutable variable</span>{'\n'}
                &#125;
              </code>
            </pre>
          </div>
        </div>

        {/* The Exact Compiler Output Terminal */}
        <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)]/60 p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--rust-muted)]">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Compiler Diagnostic (Error E0384)</span>
            </span>
            <span>Terminal</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--rust-surface)] border border-[var(--rust-border-subtle)] font-mono text-xs sm:text-sm leading-relaxed space-y-1 text-[var(--rust-text)]">
            <div className="text-rose-400 font-medium">error[E0384]: cannot assign twice to immutable variable `apples`</div>
            <div className="text-[var(--rust-subtle)]"> --&gt; src/main.rs:5:5</div>
            <div className="text-[var(--rust-subtle)]">  |</div>
            <div className="text-[var(--rust-subtle)]">2 |     let apples = 5;</div>
            <div className="text-[var(--rust-subtle)]">  |         ------ first assignment to `apples`</div>
            <div className="text-cyan-400 font-medium">  |         help: consider making this binding mutable: `mut apples`</div>
            <div className="text-[var(--rust-subtle)]">5 |     apples = 10;</div>
            <div className="text-rose-400">  |     ^^^^^^^^^^^ cannot assign twice to immutable variable</div>
          </div>

          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            Notice the <span className="text-cyan-400 font-medium">help</span> message. Rust suggests the exact fix: add <code className="font-mono text-[var(--rust-text)]">mut</code>.
          </p>
        </div>

        {/* Step 2B: The Easy Fix */}
        <div className="space-y-2.5 pt-1">
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

          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-[var(--rust-text)] leading-relaxed">
              <code>
                <span className="text-purple-400">fn</span> <span className="text-blue-400">main</span>() &#123;{'\n'}
                {'    '}<span className="text-purple-400">let</span> <span className="text-emerald-400 font-medium">mut</span> apples = <span className="text-amber-400">5</span>; <span className="text-[var(--rust-subtle)] italic">// 'mut' unlocks permission to modify</span>{'\n'}
                {'    '}<span className="text-blue-400">println!</span>(<span className="text-emerald-400">&quot;I have &#123;&#125; apples&quot;</span>, apples); <span className="text-[var(--rust-subtle)] italic">// Prints 5</span>{'\n\n'}
                {'    '}<span className="text-emerald-400">apples = 10;</span> <span className="text-[var(--rust-subtle)] italic">// ✅ Allowed! Value updated in-place</span>{'\n'}
                {'    '}<span className="text-blue-400">println!</span>(<span className="text-emerald-400">&quot;Now I have &#123;&#125; apples&quot;</span>, apples); <span className="text-[var(--rust-subtle)] italic">// Prints 10</span>{'\n'}
                &#125;
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 3: THE 3 CORE RULES
         ========================================================================= */}
      <section id="phase-3" className="space-y-5 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            03
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            The Three Rules: Mutability, Constants, and Shadowing
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          New learners often ask: Can <code className="font-mono text-[var(--rust-text)]">mut</code> change the type? What is a constant? What is shadowing? Here are the 3 simple rules.
        </p>

        {/* Rule 1: Type Constancy */}
        <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
          <div className="text-xs font-medium text-[var(--rust-primary)]">
            Rule 1 • `mut` changes the value, not the type
          </div>

          <h3 className="text-base font-medium text-[var(--rust-text)]">
            A box made for numbers only holds numbers
          </h3>

          <p className="text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
            If you declare <code className="font-mono text-[var(--rust-text)]">let mut score = 100;</code>, it is an integer. You can change <span className="font-mono text-[var(--rust-text)]">100</span> to <span className="font-mono text-[var(--rust-text)]">200</span>, but you cannot put a piece of text like <code className="font-mono text-[var(--rust-text)]">&quot;Winner&quot;</code> inside.
          </p>

          <div className="rounded-lg border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] p-3 font-mono text-xs sm:text-sm">
            <pre className="text-[var(--rust-text)] leading-relaxed">
              <code>
                <span className="text-purple-400">let</span> <span className="text-purple-400">mut</span> score = <span className="text-amber-400">100</span>;{'\n'}
                score = <span className="text-amber-400">200</span>; <span className="text-[var(--rust-subtle)] italic">// ✅ Allowed: 200 is still an integer</span>{'\n\n'}
                <span className="text-rose-400">// score = &quot;Winner&quot;; // ❌ Error E0308: Expected integer, found &amp;str</span>
              </code>
            </pre>
          </div>
        </div>

        {/* Rule 2: let vs const */}
        <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
          <div className="text-xs font-medium text-cyan-400">
            Rule 2 • Variables (`let`) vs Constants (`const`)
          </div>

          <h3 className="text-base font-medium text-[var(--rust-text)]">
            Variables live at runtime; constants are hardcoded forever
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-lg border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] space-y-2">
              <span className="text-xs font-medium text-[var(--rust-text)]">
                Variables (`let`)
              </span>
              <ul className="text-xs text-[var(--rust-muted)] space-y-1 list-disc pl-4 leading-relaxed font-normal">
                <li>Computed at runtime while code runs</li>
                <li>Can opt into changes with <code className="font-mono text-[var(--rust-text)]">mut</code></li>
                <li>Lives in local function stack frames</li>
                <li>Type annotation is optional</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-lg border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] space-y-2">
              <span className="text-xs font-medium text-[var(--rust-primary)]">
                Constants (`const`)
              </span>
              <ul className="text-xs text-[var(--rust-muted)] space-y-1 list-disc pl-4 leading-relaxed font-normal">
                <li>Baked into the binary at compile time</li>
                <li>Can never use <code className="font-mono text-[var(--rust-text)]">mut</code></li>
                <li>Can be global across all files</li>
                <li>Type annotation is mandatory (<code className="font-mono text-[var(--rust-text)]">: u32</code>)</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] p-3 font-mono text-xs sm:text-sm">
            <pre className="text-[var(--rust-text)]">
              <code>
                <span className="text-[var(--rust-subtle)] italic">// Constants use SCREAMING_SNAKE_CASE:</span>{'\n'}
                <span className="text-purple-400">const</span> <span className="text-amber-400">MAX_PLAYERS</span>: <span className="text-blue-400">u32</span> = <span className="text-amber-400">100_000</span>;
              </code>
            </pre>
          </div>
        </div>

        {/* Rule 3: Shadowing */}
        <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
          <div className="text-xs font-medium text-amber-400">
            Rule 3 • Shadowing (Declaring `let` a second time)
          </div>

          <h3 className="text-base font-medium text-[var(--rust-text)]">
            Transform data cleanly without inventing awkward variable names
          </h3>

          <p className="text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
            If you read user input as text <code className="font-mono text-[var(--rust-text)]">&quot;42&quot;</code> and want to convert it to number <code className="font-mono text-[var(--rust-text)]">42</code>, in other languages you might name them <code className="font-mono text-[var(--rust-text)]">age_str</code> and <code className="font-mono text-[var(--rust-text)]">age_num</code>.
          </p>

          <p className="text-sm text-[var(--rust-muted)] leading-relaxed font-normal">
            In Rust, you can simply declare <code className="font-mono text-[var(--rust-text)]">let age</code> again. The second variable <span className="text-[var(--rust-text)]">shadows</span> the first one, and can even have a completely different type:
          </p>

          <div className="rounded-lg border border-[var(--rust-border-subtle)] bg-[var(--rust-surface-2)] p-3 font-mono text-xs sm:text-sm">
            <pre className="text-[var(--rust-text)] leading-relaxed">
              <code>
                <span className="text-purple-400">let</span> spaces = <span className="text-emerald-400">&quot;   &quot;</span>; <span className="text-[var(--rust-subtle)] italic">// Type: text string (&amp;str)</span>{'\n'}
                <span className="text-purple-400">let</span> spaces = spaces.<span className="text-blue-400">len</span>(); <span className="text-[var(--rust-subtle)] italic">// Type: number (usize) = 3</span>{'\n\n'}
                <span className="text-blue-400">println!</span>(<span className="text-emerald-400">&quot;Number of spaces: &#123;&#125;&quot;</span>, spaces); <span className="text-[var(--rust-subtle)] italic">// Prints 3</span>
              </code>
            </pre>
          </div>

          <div className="p-3 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border-subtle)] text-xs text-[var(--rust-muted)] space-y-1">
            <span className="font-medium text-[var(--rust-text)]">Simple Summary: `mut` vs Shadowing</span>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><span className="text-[var(--rust-text)]">mut</span>: Kept the same box, changed the contents inside (same type).</li>
              <li><span className="text-[var(--rust-text)]">Shadowing</span>: Created a brand-new box with the same name (can change types).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 4: INSIDE COMPUTER RAM & HARDWARE
         ========================================================================= */}
      <section id="phase-4" className="space-y-5 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            04
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Inside RAM: What the Computer Actually Does
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          How do the CPU and memory store these variables? Click the tabs below to watch how memory changes:
        </p>

        {/* Interactive Memory Studio Box */}
        <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-5 space-y-5">
          
          {/* State Switcher Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-[var(--rust-border)] pb-3">
            {[
              { id: 'immutable', label: '1. let x = 5 (Locked)' },
              { id: 'mutable_initial', label: '2. let mut x = 5' },
              { id: 'mutable_updated', label: '3. x = 10 (Modified)' },
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* The Stack Box Visual */}
            <div className="p-4 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)]/50 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[var(--rust-muted)] border-b border-[var(--rust-border)] pb-2 font-sans text-xs">
                <span>Stack Frame [0x7fff0010]</span>
                <span className="text-[var(--rust-primary)]">RAM Layout</span>
              </div>

              {memoryState === 'immutable' && (
                <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-400 font-sans">
                    <span className="font-medium">x : i32</span>
                    <span className="text-xs flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  </div>
                  <div className="text-lg font-mono text-[var(--rust-text)]">
                    Value: 5
                  </div>
                  <div className="text-xs text-[var(--rust-muted)] font-mono">
                    Bytes: [ 00 00 00 05 ] (4 bytes)
                  </div>
                </div>
              )}

              {memoryState === 'mutable_initial' && (
                <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-1.5">
                  <div className="flex items-center justify-between text-amber-400 font-sans">
                    <span className="font-medium">mut x : i32</span>
                    <span className="text-xs flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Writable
                    </span>
                  </div>
                  <div className="text-lg font-mono text-[var(--rust-text)]">
                    Value: 5
                  </div>
                  <div className="text-xs text-[var(--rust-muted)] font-mono">
                    Bytes: [ 00 00 00 05 ] (Can be overwritten)
                  </div>
                </div>
              )}

              {memoryState === 'mutable_updated' && (
                <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-1.5">
                  <div className="flex items-center justify-between text-amber-400 font-sans">
                    <span className="font-medium">mut x : i32</span>
                    <span className="text-xs flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Overwritten
                    </span>
                  </div>
                  <div className="text-lg font-mono text-[var(--rust-text)]">
                    Value: 10 <span className="text-xs text-[var(--rust-muted)] font-sans line-through ml-1">(was 5)</span>
                  </div>
                  <div className="text-xs text-[var(--rust-muted)] font-mono">
                    Bytes: [ 00 00 00 0A ] (Overwritten in-place)
                  </div>
                </div>
              )}

              {memoryState === 'shadowed' && (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg border border-dashed border-[var(--rust-border)] text-xs text-[var(--rust-muted)] font-sans">
                    <span className="line-through">Original x : i32 = 5</span> (Shadowed / Superseded)
                  </div>
                  <div className="p-3.5 rounded-lg border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)]/20 space-y-1.5">
                    <div className="flex items-center justify-between text-[var(--rust-primary)] font-sans">
                      <span className="font-medium">New x : &amp;str</span>
                      <span className="text-xs">New Stack Slot</span>
                    </div>
                    <div className="text-lg font-mono text-[var(--rust-text)]">
                      &quot;Hello&quot;
                    </div>
                    <div className="text-xs text-[var(--rust-muted)] font-mono">
                      Stack size: 16 bytes (pointer + length)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation of the Hardware State */}
            <div className="flex flex-col justify-between space-y-3 text-sm text-[var(--rust-muted)] leading-relaxed">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--rust-text)]">
                  <Cpu className="w-4 h-4 text-[var(--rust-primary)]" />
                  <span>Hardware Mechanics</span>
                </div>
                
                {memoryState === 'immutable' && (
                  <p className="text-sm text-[var(--rust-muted)]">
                    Because Rust knows <code className="font-mono text-[var(--rust-text)]">x</code> never changes, the compiler can keep the value 5 inside a fast CPU register without even reading from RAM.
                  </p>
                )}

                {memoryState === 'mutable_initial' && (
                  <p className="text-sm text-[var(--rust-muted)]">
                    Adding <code className="font-mono text-[var(--rust-text)]">mut</code> tells the compiler to give this variable a real slot on the stack so that future lines can write new bytes to it.
                  </p>
                )}

                {memoryState === 'mutable_updated' && (
                  <p className="text-sm text-[var(--rust-muted)]">
                    Writing <code className="font-mono text-[var(--rust-text)]">x = 10</code> updates the exact same 4 bytes on the stack in-place. No extra memory is allocated.
                  </p>
                )}

                {memoryState === 'shadowed' && (
                  <p className="text-sm text-[var(--rust-muted)]">
                    Shadowing does not overwrite the old memory. It allocates a brand-new slot for the new type (<code className="font-mono text-[var(--rust-text)]">&amp;str</code>). The previous variable is no longer accessible.
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[var(--rust-surface-2)] text-xs text-[var(--rust-muted)] border border-[var(--rust-border-subtle)]">
                Key benefit: Clean stack allocations with zero garbage collector pauses.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          PHASE 5: PRACTICE DRILL ("WILL IT COMPILE?")
         ========================================================================= */}
      <section id="phase-5" className="space-y-5 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Practice Drill: Will It Compile?
          </h2>
        </div>

        <p className="text-base text-[var(--rust-muted)] leading-relaxed font-normal">
          Test what you learned on these 3 quick scenarios:
        </p>

        {/* 3 Interactive Quiz Questions */}
        <div className="space-y-4">
          
          {/* Question 1 */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <span className="text-xs font-medium text-[var(--rust-muted)]">
              Question 1 of 3
            </span>
            <div className="p-3 rounded-lg bg-[var(--rust-surface-2)] font-mono text-xs sm:text-sm text-[var(--rust-text)]">
              <code>
                <span className="text-purple-400">let</span> count = <span className="text-amber-400">0</span>;{'\n'}
                count = <span className="text-amber-400">1</span>;
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
                  <span>Correct! <code className="font-mono text-[var(--rust-text)]">count</code> is immutable by default. To allow changes, write <code className="font-mono text-[var(--rust-text)]">let mut count = 0;</code>.</span>
                ) : (
                  <span>Incorrect. In Rust, variables are immutable by default. You cannot reassign without <code className="font-mono text-[var(--rust-text)]">mut</code>.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 2 */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <span className="text-xs font-medium text-[var(--rust-muted)]">
              Question 2 of 3
            </span>
            <div className="p-3 rounded-lg bg-[var(--rust-surface-2)] font-mono text-xs sm:text-sm text-[var(--rust-text)]">
              <code>
                <span className="text-purple-400">let</span> <span className="text-purple-400">mut</span> name = <span className="text-emerald-400">&quot;Ferris&quot;</span>;{'\n'}
                name = <span className="text-emerald-400">&quot;Crab&quot;</span>;
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
                  <span>Correct! <code className="font-mono text-[var(--rust-text)]">name</code> was declared with <code className="font-mono text-[var(--rust-text)]">mut</code>, and both values are of the same type (<code className="font-mono text-[var(--rust-text)]">&amp;str</code>).</span>
                ) : (
                  <span>Incorrect. Because <code className="font-mono text-[var(--rust-text)]">mut</code> was present and the types match, this compiles cleanly.</span>
                )}
              </div>
            )}
          </div>

          {/* Question 3 */}
          <div className="p-5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
            <span className="text-xs font-medium text-[var(--rust-muted)]">
              Question 3 of 3
            </span>
            <div className="p-3 rounded-lg bg-[var(--rust-surface-2)] font-mono text-xs sm:text-sm text-[var(--rust-text)]">
              <code>
                <span className="text-purple-400">let</span> spaces = <span className="text-emerald-400">&quot;   &quot;</span>;{'\n'}
                <span className="text-purple-400">let</span> spaces = spaces.<span className="text-blue-400">len</span>();
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'A) Compiles successfully (Shadowing)', correct: true },
                { label: 'B) Fails because type changed from &str to usize', correct: false },
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
                quizAnswers[3] === 0 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {quizAnswers[3] === 0 ? (
                  <span>Correct! Re-declaring with <code className="font-mono text-[var(--rust-text)]">let</code> shadows the previous variable and allows changing the type.</span>
                ) : (
                  <span>Incorrect. If this used <code className="font-mono text-[var(--rust-text)]">mut</code> it would fail, but because <code className="font-mono text-[var(--rust-text)]">let</code> was repeated, shadowing allows changing types.</span>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          PHASE 6: KEY TAKEAWAYS
         ========================================================================= */}
      <section id="phase-6" className="space-y-4 scroll-mt-32">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] text-xs font-semibold">
            06
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--rust-text)] tracking-tight">
            Key Takeaways
          </h2>
        </div>

        <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-5 space-y-3">
          <ul className="space-y-2.5 text-sm text-[var(--rust-muted)] font-normal leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span><span className="text-[var(--rust-text)] font-medium">Locked by default:</span> <code className="font-mono text-[var(--rust-text)]">let x = 5;</code> is immutable. It cannot be altered by anyone.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span><span className="text-[var(--rust-text)] font-medium">The explicit key:</span> Add <code className="font-mono text-[var(--rust-text)]">mut</code> only when in-place modification is needed.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span><span className="text-[var(--rust-text)] font-medium">Type constancy:</span> <code className="font-mono text-[var(--rust-text)]">mut</code> changes values, never data types.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span><span className="text-[var(--rust-text)] font-medium">Constants are eternal:</span> <code className="font-mono text-[var(--rust-text)]">const</code> values are evaluated at compile time and never allow <code className="font-mono text-[var(--rust-text)]">mut</code>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span><span className="text-[var(--rust-text)] font-medium">Shadowing superpower:</span> Repeating <code className="font-mono text-[var(--rust-text)]">let</code> creates a new variable and allows safely transforming types.</span>
            </li>
          </ul>
        </div>
      </section>

    </div>
  );
}
