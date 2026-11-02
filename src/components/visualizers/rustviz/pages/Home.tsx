'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen,
  FlaskConical,
  CheckSquare,
  PlayCircle
} from 'lucide-react';
import { rustConcepts } from '../data/concepts';

export function Home() {
  const firstConcept = rustConcepts[0];

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6 py-6 text-center max-w-3xl mx-auto">
        
        {/* Edition Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3.5 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <Flame className="h-3.5 w-3.5" />
          <span>Rust 1.85 Edition • Zero-Cost Mental Models</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--rust-text)] leading-[1.1]">
          Master Rust Internals by{' '}
          <span className="text-[var(--rust-primary)]">Visualizing Memory</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[var(--rust-muted)] leading-relaxed max-w-2xl mx-auto">
          An interactive visual engine to master Rust&apos;s ownership transfers, borrow checker invariants, non-lexical lifetimes, smart pointer layouts, and multi-threaded Tokio concurrency.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/rustviz/concepts"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--rust-primary)] hover:bg-[var(--rust-primary-hover)] px-7 py-3.5 text-sm font-bold text-white transition-all shadow-sm active:scale-95"
          >
            <BookOpen className="w-4 h-4" /> Start Curriculum
          </Link>
          <Link
            href="/rustviz/ownership-lab"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:bg-[var(--rust-surface-2)] hover:border-[var(--rust-primary-border)] px-7 py-3.5 text-sm font-bold text-[var(--rust-text)] transition-all"
          >
            <FlaskConical className="w-4 h-4 text-[var(--rust-primary)]" /> Simulation Lab
          </Link>
          <Link
            href="/rustviz/pitfalls"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:bg-[var(--rust-surface-2)] hover:border-[var(--rust-primary-border)] px-7 py-3.5 text-sm font-bold text-[var(--rust-text)] transition-all"
          >
            <CheckSquare className="w-4 h-4 text-amber-500" /> Practice Pitfalls
          </Link>
        </div>

        {/* 3 Main Hub Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left w-full">
          
          <Link
            href="/rustviz/concepts"
            className="rust-card group p-5 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:border-[var(--rust-primary-border)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] w-fit border border-[var(--rust-primary-border)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
                  Core Concepts
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--rust-primary-light)] text-[var(--rust-primary)]">
                  12 Lessons
                </span>
              </div>
              <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                Structured deep dives covering ownership &amp; move semantics, borrow checking, lifetimes, smart pointers, and Tokio async.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-[var(--rust-border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--rust-primary)]">
              <span>View Full Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/rustviz/ownership-lab"
            className="rust-card group p-5 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:border-[var(--rust-primary-border)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-[var(--rust-cyan-light)] text-[var(--rust-cyan)] w-fit border border-[var(--rust-cyan-border)]">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
                  Simulation Labs
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--rust-cyan-light)] text-[var(--rust-cyan)]">
                  5 Engines
                </span>
              </div>
              <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                Interactive memory engines for stack fat pointers, heap allocation, borrow checker NLL scopes, and Tokio message queues.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-[var(--rust-border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--rust-primary)]">
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/rustviz/pitfalls"
            className="rust-card group p-5 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:border-[var(--rust-primary-border)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-[var(--rust-amber-light)] text-[var(--rust-amber)] w-fit border border-[var(--rust-amber-border)]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
                  Diagnostics &amp; Drills
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--rust-amber-light)] text-[var(--rust-amber)]">
                  7 Errors
                </span>
              </div>
              <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                Master compiler diagnostics (E0382, E0502, E0597) with side-by-side fixes, spaced-repetition flashcards, and cheat sheets.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-[var(--rust-border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--rust-primary)]">
              <span>Start Practice</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

        </div>
      </section>

      {/* 3 Core Rust Architecture Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rust-card p-6 border border-[var(--rust-border)] rounded-2xl bg-[var(--rust-surface)] space-y-3">
          <div className="p-2.5 rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] w-fit border border-[var(--rust-primary-border)] mb-1">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--rust-text)]">Zero-Cost Ownership</h3>
          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            Stack-allocated 24-byte fat pointer descriptors, dynamic heap buffer invalidations, and automatic RAII drops with zero runtime garbage collector overhead.
          </p>
        </div>

        <div className="rust-card p-6 border border-[var(--rust-border)] rounded-2xl bg-[var(--rust-surface)] space-y-3">
          <div className="p-2.5 rounded-xl bg-[var(--rust-emerald-light)] text-[var(--rust-emerald)] w-fit border border-[var(--rust-emerald-border)] mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--rust-text)]">Aliasing XOR Mutability</h3>
          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            Compile-time safety enforcement: arbitrary immutable readers (&amp;T) OR exactly one mutable writer (&amp;mut T), never both concurrently.
          </p>
        </div>

        <div className="rust-card p-6 border border-[var(--rust-border)] rounded-2xl bg-[var(--rust-surface)] space-y-3">
          <div className="p-2.5 rounded-xl bg-[var(--rust-purple-light)] text-[var(--rust-purple)] w-fit border border-[var(--rust-purple-border)] mb-1">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--rust-text)]">Fearless Concurrency</h3>
          <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
            Send + Sync thread safety trait bounds, atomic reference counting (Arc), and asynchronous mpsc channel message passing via the Tokio runtime.
          </p>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="text-center py-10 space-y-4 max-w-xl mx-auto border-t border-[var(--rust-border)]">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--rust-text)]">
          Ready to Build Fearless Rust Systems?
        </h2>
        <p className="text-xs sm:text-sm text-[var(--rust-muted)] leading-relaxed">
          Begin with Lesson 1 to master ownership transfers and stack frames, or test your skills in the simulation lab.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href={`/rustviz/concepts/${firstConcept.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--rust-primary)] hover:bg-[var(--rust-primary-hover)] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <PlayCircle className="w-4 h-4" /> Start Lesson 1: {firstConcept.title}
          </Link>
          <Link
            href="/rustviz/ownership-lab"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:bg-[var(--rust-surface-2)] text-[var(--rust-text)] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Launch Ownership Lab <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
