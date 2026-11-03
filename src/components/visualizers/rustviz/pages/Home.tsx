'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ArrowRight, 
  BookOpen, 
  FlaskConical, 
  Code2, 
  HelpCircle,
  ShieldCheck,
  Layers,
  Cpu
} from 'lucide-react';

export function Home() {
  const hubs = [
    {
      name: 'Concepts',
      badge: '100 Lessons',
      href: '/rustviz/concepts',
      icon: BookOpen,
      desc: 'Progressive curriculum from basic primitives to memory models, lifetimes, and systems internals.',
    },
    {
      name: 'Simulation Lab',
      badge: 'All Engines',
      href: '/rustviz/lab',
      icon: FlaskConical,
      desc: 'Interactive memory engines for stack fat pointers, heap allocation, borrow checking, and Tokio channels.',
    },
    {
      name: 'Problems',
      badge: '100 Drills',
      href: '/rustviz/problems',
      icon: Code2,
      desc: 'LeetCode-style coding challenges with compiler runner templates from basic syntax to lock-free systems.',
    },
    {
      name: 'Interview Q&A',
      badge: '100 Questions',
      href: '/rustviz/interview',
      icon: HelpCircle,
      desc: 'Step-by-step clear explanations and concrete examples to master Rust systems engineering interviews.',
    },
  ];

  const pillars = [
    {
      icon: Layers,
      title: 'Zero-Cost Ownership',
      desc: '24-byte fat pointers on the stack, dynamic heap transfers, and deterministic RAII drops without garbage collection.',
    },
    {
      icon: ShieldCheck,
      title: 'Aliasing XOR Mutability',
      desc: 'Arbitrary immutable readers (&T) OR exactly one mutable writer (&mut T), statically proven at compile time.',
    },
    {
      icon: Cpu,
      title: 'Fearless Concurrency',
      desc: 'Send + Sync auto-trait bounds, atomic reference counters (Arc), and asynchronous Tokio channels.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-20">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
        
        {/* Edition Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3.5 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <Flame className="h-3.5 w-3.5" />
          <span>Rust 1.85 Edition • Visual Memory Engine</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--rust-text)] leading-[1.1]">
          Master Rust Internals by{' '}
          <span className="text-[var(--rust-primary)]">Visualizing Memory</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[var(--rust-muted)] leading-relaxed max-w-2xl">
          An interactive visual guide and simulation suite for ownership transfers, borrow checker invariants, lifetimes, smart pointers, and multi-threaded concurrency.
        </p>

        {/* 2 Primary Clean Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/rustviz/concepts"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--rust-primary)] hover:bg-[var(--rust-primary-hover)] px-6 py-3 text-sm font-bold text-white transition-all shadow-sm active:scale-95"
          >
            <BookOpen className="w-4 h-4" /> Start Curriculum
          </Link>
          <Link
            href="/rustviz/lab"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:bg-[var(--rust-surface-2)] hover:border-[var(--rust-primary-border)] px-6 py-3 text-sm font-bold text-[var(--rust-text)] transition-all"
          >
            <FlaskConical className="w-4 h-4 text-[var(--rust-primary)]" /> Open Simulation Lab
          </Link>
        </div>
      </section>

      {/* 4 Core Hub Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hubs.map((hub) => {
          const Icon = hub.icon;
          return (
            <Link
              key={hub.name}
              href={hub.href}
              className="group p-5 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:border-[var(--rust-primary-border)] hover:bg-[var(--rust-surface-2)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--rust-primary-light)] text-[var(--rust-primary)]">
                    {hub.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
                  {hub.name}
                </h3>
                <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                  {hub.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[var(--rust-border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--rust-primary)]">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* 3 Core Architecture Invariants Strip */}
      <section className="pt-8 border-t border-[var(--rust-border)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-[var(--rust-surface-2)] text-[var(--rust-primary)] border border-[var(--rust-border)] shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--rust-text)]">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
