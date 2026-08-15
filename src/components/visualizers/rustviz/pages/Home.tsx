'use client';

import React from 'react';
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
  CheckCircle2, 
  Sparkles,
  Zap,
  HardDrive
} from 'lucide-react';
import { rustConcepts } from '../data/concepts';
import { OwnershipVisualizer } from '../components/OwnershipVisualizer';

export function Home() {
  const featuredConcepts = rustConcepts.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 border-b border-[var(--rust-border)] rust-grid-pattern">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            
            {/* Version Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--rust-primary)]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Rust 1.85 Edition • Zero-Cost Abstractions Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--rust-text)]">
              Master Rust Backend <br />
              <span className="text-[var(--rust-primary)] rust-glow">Internals &amp; Memory Safety</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[var(--rust-muted)] leading-relaxed max-w-2xl">
              An interactive visual sandbox to explore Rust&apos;s ownership model, the borrow checker&apos;s Aliasing XOR Mutability theorem, non-lexical lifetimes, smart pointer layouts, and multi-threaded Tokio runtime systems.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/rustviz/ownership-lab"
                className="flex items-center space-x-2 rounded-lg bg-[var(--rust-primary)] px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-[var(--rust-primary-hover)] transition-all hover:scale-[1.02]"
              >
                <span>Launch Memory Stepper</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/rustviz/concepts"
                className="flex items-center space-x-2 rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface)] px-5 py-3 text-sm font-bold text-[var(--rust-text)] hover:border-[var(--rust-primary)] hover:bg-[var(--rust-surface-2)] transition-colors"
              >
                <span>Browse 12 Concepts</span>
              </a>
            </div>

            {/* Micro Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[var(--rust-border-subtle)] text-xs text-[var(--rust-muted)]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--rust-emerald)] shrink-0" />
                <span>Zero-Cost Moves</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-[var(--rust-cyan)] shrink-0" />
                <span>Compile-Time NLL</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-[var(--rust-amber)] shrink-0" />
                <span>Fearless Concurrency</span>
              </div>
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-[var(--rust-purple)] shrink-0" />
                <span>RAII Drop Hierarchy</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Embedded Live Stepper Spotlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rust-card rounded-2xl p-6 sm:p-8 bg-[var(--rust-surface)]">
          <OwnershipVisualizer />
        </div>
      </section>

      {/* Interactive Labs Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-primary)] font-mono">
              Visual Learning Labs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--rust-text)] mt-1">
              Explore Specialized Interactive Engines
            </h2>
          </div>
          <p className="text-xs text-[var(--rust-muted)] max-w-md">
            Click into each lab to test edge cases, trigger compiler errors, and visualize physical CPU &amp; RAM behaviors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <a href="/rustviz/ownership-lab" className="rust-card rounded-xl p-6 group block">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
              <span>Ownership &amp; Move Lab</span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="mt-2 text-xs text-[var(--rust-muted)] leading-relaxed">
              Step through 24-byte fat pointers on the stack, dynamic heap buffer invalidations, and automatic RAII drops.
            </p>
          </a>

          <a href="/rustviz/borrow-checker" className="rust-card rounded-xl p-6 group block">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
              <span>Borrow Checker &amp; NLL</span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="mt-2 text-xs text-[var(--rust-muted)] leading-relaxed">
              Enforce the Aliasing XOR Mutability theorem (&amp;T vs &amp;mut T) and verify Non-Lexical Lifetime scopes.
            </p>
          </a>

          <a href="/rustviz/lifetimes-lab" className="rust-card rounded-xl p-6 group block">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 mb-4">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
              <span>Lifetimes &amp; Variance</span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="mt-2 text-xs text-[var(--rust-muted)] leading-relaxed">
              Analyze generic lifetime parameters (&apos;a), the 3 elision rules, and subtyping covariance vs invariance.
            </p>
          </a>

          <a href="/rustviz/smart-pointers" className="rust-card rounded-xl p-6 group block">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-950/40 text-amber-400 border border-amber-500/30 mb-4">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
              <span>Smart Pointers (Rc &amp; Arc)</span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="mt-2 text-xs text-[var(--rust-muted)] leading-relaxed">
              Simulate heap headers for Box, Rc, Arc reference counters, RefCell runtime borrow flags, and cycle leaks.
            </p>
          </a>

          <a href="/rustviz/concurrency-lab" className="rust-card rounded-xl p-6 group block">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-950/40 text-purple-400 border border-purple-500/30 mb-4">
              <GitBranch className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
              <span>Tokio &amp; Channels Lab</span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="mt-2 text-xs text-[var(--rust-muted)] leading-relaxed">
              Send messages over mpsc FIFO queues, test backpressure, and verify Send + Sync compile-time thread safety.
            </p>
          </a>

          <a href="/rustviz/pitfalls" className="rust-card rounded-xl p-6 group block">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-950/40 text-rose-400 border border-rose-500/30 mb-4">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors flex items-center justify-between">
              <span>Top 15 Compiler Errors</span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="mt-2 text-xs text-[var(--rust-muted)] leading-relaxed">
              Master the exact error diagnostics (E0382, E0502, E0597, E0499) with broken vs fixed side-by-side solutions.
            </p>
          </a>

        </div>
      </section>

      {/* Featured Deep Dives */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-primary)] font-mono">
              Theoretical Foundation
            </span>
            <h2 className="text-2xl font-extrabold text-[var(--rust-text)]">
              Core Rust Architecture Concepts
            </h2>
          </div>
          <a href="/rustviz/concepts" className="text-xs font-bold text-[var(--rust-primary)] hover:underline flex items-center">
            View All 12 Concepts <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredConcepts.map((c) => (
            <a
              key={c.id}
              href={`/rustviz/concepts/${c.slug}`}
              className="rust-card rounded-xl p-5 hover:border-[var(--rust-primary)] transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--rust-primary-light)] text-[var(--rust-primary)]">
                  {c.category}
                </span>
                <span className="text-[11px] text-[var(--rust-muted)]">{c.readTime}</span>
              </div>
              <h3 className="text-base font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
                {c.title}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--rust-muted)] leading-relaxed line-clamp-2">
                {c.summary}
              </p>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
