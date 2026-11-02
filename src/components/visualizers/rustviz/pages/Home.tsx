'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Cpu, 
  GitBranch, 
  AlertTriangle, 
  Bookmark, 
  Terminal, 
  ArrowRight, 
  BookOpen,
  Code2,
  CheckCircle2,
  Boxes,
  Sparkles,
  Zap
} from 'lucide-react';
import { rustConcepts, rustCategories, RustConcept } from '../data/concepts';

export function Home() {
  const [activeMentalModel, setActiveMentalModel] = useState<'move' | 'borrow' | 'smartptr'>('move');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter concepts for the curated section
  const displayedConcepts = rustConcepts.filter((c) => {
    if (selectedCategory === 'All') return true;
    return c.category === selectedCategory;
  }).slice(0, selectedCategory === 'All' ? 6 : 8);

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-12 border-b border-[var(--rust-border)] rust-grid-pattern">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Edition Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3.5 py-1 text-xs font-semibold text-[var(--rust-primary)]">
              <Flame className="h-3.5 w-3.5" />
              <span>Rust 1.85 Edition • Zero-Cost Mental Models</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--rust-text)] leading-[1.15]">
              Master Rust Internals by{' '}
              <span className="text-[var(--rust-primary)]">Visualizing Memory</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[var(--rust-muted)] leading-relaxed max-w-2xl mx-auto">
              Interactive visual models for Rust&apos;s ownership transfers, borrow checker invariants, non-lexical lifetimes, smart pointer layouts, and multi-threaded Tokio concurrency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/rustviz/ownership-lab"
                className="flex items-center gap-2 rounded-xl bg-[var(--rust-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[var(--rust-primary-hover)] transition-all hover:scale-[1.01]"
              >
                <span>Launch Ownership Lab</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/rustviz/concepts"
                className="flex items-center gap-2 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] px-5 py-3 text-sm font-semibold text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] hover:border-[var(--rust-primary-border)] transition-all"
              >
                <BookOpen className="h-4 w-4 text-[var(--rust-primary)]" />
                <span>Browse 12 Concepts</span>
              </Link>
              <Link
                href="/rustviz/pitfalls"
                className="flex items-center gap-2 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] px-5 py-3 text-sm font-semibold text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] hover:border-[var(--rust-primary-border)] transition-all"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Compiler Pitfalls</span>
              </Link>
            </div>

            {/* Clean Spec Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[var(--rust-border)] text-left">
              <div className="p-3.5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)]/80">
                <div className="text-2xl font-extrabold font-mono text-[var(--rust-primary)]">5</div>
                <div className="text-xs text-[var(--rust-muted)] font-medium">Interactive Labs</div>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)]/80">
                <div className="text-2xl font-extrabold font-mono text-[var(--rust-text)]">12</div>
                <div className="text-xs text-[var(--rust-muted)] font-medium">Core Concepts</div>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)]/80">
                <div className="text-2xl font-extrabold font-mono text-[var(--rust-text)]">7</div>
                <div className="text-xs text-[var(--rust-muted)] font-medium">Compiler Pitfalls</div>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)]/80">
                <div className="text-2xl font-extrabold font-mono text-[var(--rust-text)]">10</div>
                <div className="text-xs text-[var(--rust-muted)] font-medium">Practice Flashcards</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Mental Model Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-primary)] font-mono">
              Core Mental Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] mt-1">
              How Rust Works at the Hardware Boundary
            </h2>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--rust-surface-2)] border border-[var(--rust-border)]">
            <button
              onClick={() => setActiveMentalModel('move')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMentalModel === 'move'
                  ? 'bg-[var(--rust-primary)] text-white shadow-sm'
                  : 'text-[var(--rust-muted)] hover:text-[var(--rust-text)]'
              }`}
            >
              Move Semantics
            </button>
            <button
              onClick={() => setActiveMentalModel('borrow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMentalModel === 'borrow'
                  ? 'bg-[var(--rust-primary)] text-white shadow-sm'
                  : 'text-[var(--rust-muted)] hover:text-[var(--rust-text)]'
              }`}
            >
              Aliasing XOR Mutability
            </button>
            <button
              onClick={() => setActiveMentalModel('smartptr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMentalModel === 'smartptr'
                  ? 'bg-[var(--rust-primary)] text-white shadow-sm'
                  : 'text-[var(--rust-muted)] hover:text-[var(--rust-text)]'
              }`}
            >
              Arc Heap Header
            </button>
          </div>
        </div>

        {/* Mental Model Interactive Showcase Card */}
        <div className="rust-card rounded-2xl p-6 sm:p-8 bg-[var(--rust-surface)] border border-[var(--rust-border)]">
          {activeMentalModel === 'move' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--rust-primary-light)] text-[var(--rust-primary)] text-xs font-mono font-semibold">
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Stack Transfer &amp; Invalidation</span>
                </div>
                <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-4 font-mono text-xs leading-relaxed text-[var(--rust-text)]">
                  <div className="text-[var(--rust-muted)]">// 1. Allocate heap buffer</div>
                  <div><span className="text-purple-400 font-semibold">let</span> s1 = <span className="text-amber-400">String</span>::from(<span className="text-emerald-400">&quot;Ferris&quot;</span>);</div>
                  <div className="text-[var(--rust-muted)] mt-2">// 2. Ownership transferred to s2</div>
                  <div><span className="text-purple-400 font-semibold">let</span> s2 = s1;</div>
                  <div className="text-rose-400 mt-2">// println!(&quot;{}&quot;, s1); // Error E0382</div>
                  <div>println!(<span className="text-emerald-400">&quot;{}&quot;</span>, s2); <span className="text-[var(--rust-muted)]">// OK</span></div>
                </div>
                <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                  Rust copies the 24-byte fat pointer on the stack and statically invalidates <code className="text-[var(--rust-text)] font-mono">s1</code>. No deep copy overhead, and zero double-free risk when variables drop.
                </p>
                <Link
                  href="/rustviz/ownership-lab"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--rust-primary)] hover:underline"
                >
                  Step through full execution in Ownership Lab <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="lg:col-span-7 bg-[var(--rust-surface-2)]/60 rounded-xl p-5 border border-[var(--rust-border)] space-y-5">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--rust-muted)] pb-2 border-b border-[var(--rust-border)]">
                  <span className="font-semibold text-[var(--rust-text)]">Stack Memory Frame</span>
                  <span className="font-semibold text-[var(--rust-text)]">Heap Memory (0x7fff0010)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Stack Side */}
                  <div className="space-y-3">
                    {/* s1 Card */}
                    <div className="p-3 rounded-lg border border-dashed border-rose-500/40 bg-rose-500/5 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-rose-500 line-through">s1: String</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold uppercase">
                          Moved / Invalidated
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[var(--rust-muted)]">
                        ptr: <span className="text-[var(--rust-text)]">0x7fff0010</span> | len: 6 | cap: 8
                      </div>
                      <div className="text-[10px] text-rose-400 italic">Compiler statically forbids read access</div>
                    </div>

                    {/* s2 Card */}
                    <div className="p-3 rounded-lg border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-[var(--rust-primary)]">s2: String</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--rust-primary)] text-white font-bold uppercase">
                          Active Owner
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[var(--rust-muted)]">
                        ptr: <span className="text-[var(--rust-text)]">0x7fff0010</span> | len: 6 | cap: 8
                      </div>
                      <div className="text-[10px] text-[var(--rust-emerald)]">Sole owner responsible for deallocation</div>
                    </div>
                  </div>

                  {/* Heap Side */}
                  <div className="p-4 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3 text-center">
                    <div className="text-xs font-mono font-bold text-[var(--rust-text)]">Heap Allocation: 8 Bytes</div>
                    <div className="flex justify-center gap-1 font-mono text-xs">
                      {['F', 'e', 'r', 'r', 'i', 's', '\\0', '\\0'].map((char, i) => (
                        <div
                          key={i}
                          className={`w-7 h-8 flex items-center justify-center rounded border ${
                            i < 6 
                              ? 'border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] text-[var(--rust-primary)] font-bold'
                              : 'border-[var(--rust-border)] text-[var(--rust-muted)]'
                          }`}
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-[var(--rust-muted)] font-mono">
                      Heap Address: 0x7fff0010
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMentalModel === 'borrow' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--rust-cyan-light)] text-[var(--rust-cyan)] text-xs font-mono font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>The Fundamental Theorem</span>
                </div>
                <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-4 font-mono text-xs leading-relaxed text-[var(--rust-text)]">
                  <div><span className="text-purple-400 font-semibold">let mut</span> vec = <span className="text-cyan-400">vec!</span>[1, 2, 3];</div>
                  <div className="text-[var(--rust-muted)] mt-2">// Multiple immutable references: OK</div>
                  <div><span className="text-purple-400 font-semibold">let</span> r1 = &amp;vec;</div>
                  <div><span className="text-purple-400 font-semibold">let</span> r2 = &amp;vec;</div>
                  <div className="text-rose-400 mt-2">// vec.push(4); // ERROR E0502: already borrowed</div>
                  <div>println!(<span className="text-emerald-400">&quot;{} {}&quot;</span>, r1[0], r2[1]);</div>
                </div>
                <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                  At any given point in time, data may have <strong>any number of immutable borrows (&amp;T)</strong> OR <strong>exactly one mutable borrow (&amp;mut T)</strong>, but never both simultaneously.
                </p>
                <Link
                  href="/rustviz/borrow-checker"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--rust-primary)] hover:underline"
                >
                  Verify NLL scopes in Borrow Checker Lab <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="lg:col-span-7 bg-[var(--rust-surface-2)]/60 rounded-xl p-5 border border-[var(--rust-border)] space-y-4">
                <div className="text-xs font-mono font-bold text-[var(--rust-text)] pb-2 border-b border-[var(--rust-border)]">
                  Compile-Time Borrow Checker Invariant Matrix
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-[var(--rust-emerald-border)] bg-[var(--rust-emerald-light)] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--rust-emerald)]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Shared Readers (&amp;T)</span>
                    </div>
                    <p className="text-[11px] text-[var(--rust-muted)] leading-relaxed">
                      N simultaneous immutable references allowed. Read-only access guarantees no concurrent mutation can invalidate buffers or cause pointer invalidation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-500">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Exclusive Writer (&amp;mut T)</span>
                    </div>
                    <p className="text-[11px] text-[var(--rust-muted)] leading-relaxed">
                      Only 1 mutable reference permitted. All other reads and writes are statically blocked during its active lifetime scope, eliminating race conditions entirely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMentalModel === 'smartptr' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--rust-amber-light)] text-[var(--rust-amber)] text-xs font-mono font-semibold">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Arc&lt;T&gt; Atomic Refcount Layout</span>
                </div>
                <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-4 font-mono text-xs leading-relaxed text-[var(--rust-text)]">
                  <div><span className="text-purple-400 font-semibold">use</span> std::sync::Arc;</div>
                  <div><span className="text-purple-400 font-semibold">let</span> a = Arc::new(Config::default());</div>
                  <div><span className="text-purple-400 font-semibold">let</span> b = Arc::clone(&amp;a);</div>
                  <div className="text-[var(--rust-muted)] mt-2">// Heap strong_count == 2</div>
                  <div className="text-[var(--rust-muted)]">// Dropping &apos;a&apos; decrements to 1;</div>
                  <div className="text-[var(--rust-muted)]">// Dropping &apos;b&apos; decrements to 0 &amp; deallocates.</div>
                </div>
                <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                  Smart pointers store metadata in the heap block preceding payload data. <code className="text-[var(--rust-text)] font-mono">Arc</code> uses atomic operations (<code className="text-[var(--rust-text)] font-mono">fetch_add</code> / <code className="text-[var(--rust-text)] font-mono">fetch_sub</code>) for thread-safe reference counting.
                </p>
                <Link
                  href="/rustviz/smart-pointers"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--rust-primary)] hover:underline"
                >
                  Explore Box, Rc, Arc &amp; RefCell in Lab <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="lg:col-span-7 bg-[var(--rust-surface-2)]/60 rounded-xl p-5 border border-[var(--rust-border)] space-y-4">
                <div className="text-xs font-mono font-bold text-[var(--rust-text)] pb-2 border-b border-[var(--rust-border)]">
                  Physical Heap Memory Representation
                </div>
                <div className="p-4 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30">
                      <div className="text-[10px] text-[var(--rust-muted)]">strong_count</div>
                      <div className="font-bold text-amber-500 text-sm">2 (Atomic)</div>
                    </div>
                    <div className="p-2 rounded bg-[var(--rust-surface-2)] border border-[var(--rust-border)]">
                      <div className="text-[10px] text-[var(--rust-muted)]">weak_count</div>
                      <div className="font-bold text-[var(--rust-text)] text-sm">0</div>
                    </div>
                    <div className="p-2 rounded bg-[var(--rust-primary-light)] border border-[var(--rust-primary-border)]">
                      <div className="text-[10px] text-[var(--rust-muted)]">data: Config</div>
                      <div className="font-bold text-[var(--rust-primary)] text-sm">Payload Bytes</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--rust-muted)] font-mono text-center">
                    Stack pointers <span className="text-[var(--rust-text)]">a</span> and <span className="text-[var(--rust-text)]">b</span> both point to header address 0x24a0
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Simulation Labs (5 Core Engines) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-primary)] font-mono">
              Simulation Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] mt-1">
              5 Specialized Interactive Labs
            </h2>
          </div>
          <p className="text-xs text-[var(--rust-muted)] max-w-md">
            Step through compiled execution, inspect byte layouts in RAM, and test borrow checker boundaries live.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Lab 1 */}
          <Link href="/rustviz/ownership-lab" className="rust-card rounded-xl p-5 group block space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)]">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-muted)] border border-[var(--rust-border)]">
                Stack &amp; Heap
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
                <span>Ownership &amp; Move Lab</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--rust-primary)]" />
              </h3>
              <p className="mt-1.5 text-xs text-[var(--rust-muted)] leading-relaxed">
                Step through 24-byte fat pointer stack descriptors, dynamic heap buffer transfers, and zero-cost RAII drops.
              </p>
            </div>
          </Link>

          {/* Lab 2 */}
          <Link href="/rustviz/borrow-checker" className="rust-card rounded-xl p-5 group block space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--rust-emerald-light)] text-[var(--rust-emerald)] border border-[var(--rust-emerald-border)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-muted)] border border-[var(--rust-border)]">
                Aliasing XOR Mutability
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
                <span>Borrow Checker &amp; NLL</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--rust-primary)]" />
              </h3>
              <p className="mt-1.5 text-xs text-[var(--rust-muted)] leading-relaxed">
                Enforce reference permissions (&amp;T vs &amp;mut T) and verify Non-Lexical Lifetime compiler scope analysis.
              </p>
            </div>
          </Link>

          {/* Lab 3 */}
          <Link href="/rustviz/lifetimes-lab" className="rust-card rounded-xl p-5 group block space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--rust-cyan-light)] text-[var(--rust-cyan)] border border-[var(--rust-cyan-border)]">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-muted)] border border-[var(--rust-border)]">
                Compile-Time Scopes
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
                <span>Lifetimes &amp; Variance</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--rust-primary)]" />
              </h3>
              <p className="mt-1.5 text-xs text-[var(--rust-muted)] leading-relaxed">
                Analyze generic lifetime parameters (&apos;a), the 3 elision rules, and subtyping covariance vs invariance.
              </p>
            </div>
          </Link>

          {/* Lab 4 */}
          <Link href="/rustviz/smart-pointers" className="rust-card rounded-xl p-5 group block space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--rust-amber-light)] text-[var(--rust-amber)] border border-[var(--rust-amber-border)]">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-muted)] border border-[var(--rust-border)]">
                Heap Abstractions
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
                <span>Smart Pointers (Rc &amp; Arc)</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--rust-primary)]" />
              </h3>
              <p className="mt-1.5 text-xs text-[var(--rust-muted)] leading-relaxed">
                Simulate heap headers for Box, Rc, Arc reference counters, RefCell runtime borrow flags, and cycle leaks.
              </p>
            </div>
          </Link>

          {/* Lab 5 */}
          <Link href="/rustviz/concurrency-lab" className="rust-card rounded-xl p-5 group block space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--rust-purple-light)] text-[var(--rust-purple)] border border-[var(--rust-purple-border)]">
                <GitBranch className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-muted)] border border-[var(--rust-border)]">
                Async Runtime
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
                <span>Tokio &amp; Channels Lab</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--rust-primary)]" />
              </h3>
              <p className="mt-1.5 text-xs text-[var(--rust-muted)] leading-relaxed">
                Send messages over mpsc FIFO queues, test backpressure, and verify Send + Sync compile-time thread safety.
              </p>
            </div>
          </Link>

          {/* Practice & Diagnostics Hub Quick Card */}
          <Link href="/rustviz/pitfalls" className="rust-card rounded-xl p-5 group block space-y-3 border-dashed">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--rust-rose-light)] text-[var(--rust-rose)] border border-[var(--rust-rose-border)]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-muted)] border border-[var(--rust-border)]">
                Diagnostics
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
                <span>Compiler Pitfalls &amp; Fixes</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--rust-primary)]" />
              </h3>
              <p className="mt-1.5 text-xs text-[var(--rust-muted)] leading-relaxed">
                Master 7 exact compiler error diagnostics (E0382, E0502, E0597, E0499) with broken vs fixed side-by-side solutions.
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* Diagnostics, Practice & Reference Strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="border-t border-[var(--rust-border)] pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <Link
              href="/rustviz/pitfalls"
              className="rust-card rounded-xl p-5 group block hover:border-[var(--rust-primary-border)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
                    7 Compiler Pitfalls
                  </h4>
                  <span className="text-[10px] text-[var(--rust-muted)] font-mono">Error diagnostics &amp; fixes</span>
                </div>
              </div>
              <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                Step through side-by-side broken code vs corrected architectures for borrow checker errors.
              </p>
              <div className="mt-3 flex items-center text-xs font-semibold text-[var(--rust-primary)]">
                <span>Review diagnostics</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/rustviz/flashcards"
              className="rust-card rounded-xl p-5 group block hover:border-[var(--rust-primary-border)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)]">
                  <Bookmark className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
                    10 Memory Flashcards
                  </h4>
                  <span className="text-[10px] text-[var(--rust-muted)] font-mono">Spaced repetition drills</span>
                </div>
              </div>
              <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                Test active recall on fat pointer sizes, borrow rules, variance definitions, and thread safety traits.
              </p>
              <div className="mt-3 flex items-center text-xs font-semibold text-[var(--rust-primary)]">
                <span>Start flashcard drill</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/rustviz/cheatsheet"
              className="rust-card rounded-xl p-5 group block hover:border-[var(--rust-primary-border)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[var(--rust-cyan-light)] text-[var(--rust-cyan)] border border-[var(--rust-cyan-border)]">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
                    Architecture Cheat Sheet
                  </h4>
                  <span className="text-[10px] text-[var(--rust-muted)] font-mono">Syntax &amp; memory tables</span>
                </div>
              </div>
              <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                Quick reference for pointer overhead, ownership rules, cargo commands, and smart pointer selection trees.
              </p>
              <div className="mt-3 flex items-center text-xs font-semibold text-[var(--rust-primary)]">
                <span>Open cheat sheet</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Core Rust Architecture Concepts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-primary)] font-mono">
              Theoretical Foundation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] mt-1">
              12 Deep-Dive Architectural Lessons
            </h2>
          </div>
          <Link
            href="/rustviz/concepts"
            className="text-xs font-bold text-[var(--rust-primary)] hover:underline flex items-center"
          >
            Browse Full Syllabus <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 border-b border-[var(--rust-border)] pb-4">
          {rustCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--rust-primary)] text-white shadow-sm'
                  : 'bg-[var(--rust-surface)] text-[var(--rust-muted)] hover:text-[var(--rust-text)] border border-[var(--rust-border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Concepts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedConcepts.map((concept) => (
            <Link
              key={concept.id}
              href={`/rustviz/concepts/${concept.slug}`}
              className="rust-card rounded-xl p-5 flex flex-col justify-between group block hover:border-[var(--rust-primary-border)] transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--rust-primary-light)] text-[var(--rust-primary)]">
                    {concept.category}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--rust-muted)]">
                    {concept.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
                  {concept.title}
                </h3>

                <p className="text-xs text-[var(--rust-muted)] leading-relaxed line-clamp-2">
                  {concept.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--rust-border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--rust-primary)]">
                <span className="text-[10px] font-mono text-[var(--rust-muted)] uppercase">
                  {concept.difficulty}
                </span>
                <span className="flex items-center">
                  Read blueprint <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Clean Bottom Call to Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-8 sm:p-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] mx-auto">
            <Flame className="h-6 w-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] tracking-tight">
            Ready to Build Fearless Rust Systems?
          </h3>
          <p className="text-xs sm:text-sm text-[var(--rust-muted)] max-w-xl mx-auto leading-relaxed">
            Gain an intuitive physical mental model of the stack, heap, references, lifetimes, and Tokio async actors.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/rustviz/ownership-lab"
              className="flex items-center gap-2 rounded-xl bg-[var(--rust-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[var(--rust-primary-hover)] transition-all"
            >
              <span>Start with Ownership Lab</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/rustviz/cheatsheet"
              className="flex items-center gap-2 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)] px-5 py-3 text-sm font-semibold text-[var(--rust-text)] hover:border-[var(--rust-primary-border)] transition-all"
            >
              <Terminal className="h-4 w-4" />
              <span>Architecture Cheat Sheet</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
