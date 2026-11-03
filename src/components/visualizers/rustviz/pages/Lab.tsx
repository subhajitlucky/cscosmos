'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  GitBranch, 
  Code2, 
  Play, 
  Terminal, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { OwnershipVisualizer } from '../components/OwnershipVisualizer';
import { BorrowCheckerVisualizer } from '../components/BorrowCheckerVisualizer';
import { LifetimeVisualizer } from '../components/LifetimeVisualizer';
import { SmartPointerVisualizer } from '../components/SmartPointerVisualizer';
import { ConcurrencyVisualizer } from '../components/ConcurrencyVisualizer';

type LabTab = 'ownership' | 'borrow' | 'lifetimes' | 'smart-pointers' | 'concurrency' | 'playground';

interface LabStudio {
  id: LabTab;
  name: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}

const studios: LabStudio[] = [
  {
    id: 'ownership',
    name: 'Ownership & Move Lab',
    shortDesc: 'Stack fat pointers & heap transfers',
    icon: Layers,
    badge: 'Hardware Memory',
  },
  {
    id: 'borrow',
    name: 'Borrow Checker & NLL',
    shortDesc: 'Aliasing XOR Mutability permissions',
    icon: ShieldCheck,
    badge: 'Compiler CFG',
  },
  {
    id: 'lifetimes',
    name: 'Lifetimes & Variance',
    shortDesc: 'Generic scopes & elision rules',
    icon: Clock,
    badge: 'Scope Analysis',
  },
  {
    id: 'smart-pointers',
    name: 'Smart Pointers',
    shortDesc: 'Box, Rc, Arc & RefCell layouts',
    icon: Cpu,
    badge: 'Heap Headers',
  },
  {
    id: 'concurrency',
    name: 'Tokio & Channels',
    shortDesc: 'MPSC FIFO message queues',
    icon: GitBranch,
    badge: 'Async Runtime',
  },
  {
    id: 'playground',
    name: 'Code Sandbox',
    shortDesc: 'Interactive Rust compiler studio',
    icon: Code2,
    badge: 'Coming Soon',
  },
];

export function Lab() {
  const [activeTab, setActiveTab] = useState<LabTab>('ownership');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--rust-border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Experimentation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--rust-text)]">
            Rust Simulation Lab
          </h1>
          <p className="text-sm text-[var(--rust-muted)] mt-1 max-w-2xl">
            Experiment with compiled Rust code live. Inspect 24-byte stack fat pointers, test borrow checker invariants, step through non-lexical lifetimes, and simulate multi-threaded channel queues.
          </p>
        </div>

        {/* Quick Hub Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/rustviz/concepts"
            className="px-3 py-1.5 rounded-lg border border-[var(--rust-border)] text-xs font-semibold text-[var(--rust-muted)] hover:text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] transition-colors"
          >
            Concepts Syllabus →
          </Link>
          <Link
            href="/rustviz/problems"
            className="px-3 py-1.5 rounded-lg border border-[var(--rust-border)] text-xs font-semibold text-[var(--rust-muted)] hover:text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] transition-colors"
          >
            Practice Problems →
          </Link>
        </div>
      </div>

      {/* Studio Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {studios.map((studio) => {
          const Icon = studio.icon;
          const isActive = activeTab === studio.id;
          return (
            <button
              key={studio.id}
              onClick={() => setActiveTab(studio.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-[var(--rust-primary)] bg-[var(--rust-primary-light)]/40 shadow-sm'
                  : 'border-[var(--rust-border)] bg-[var(--rust-surface)] hover:border-[var(--rust-border-subtle)] hover:bg-[var(--rust-surface-2)]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-1.5 rounded-lg ${
                  isActive 
                    ? 'bg-[var(--rust-primary)] text-white' 
                    : 'bg-[var(--rust-surface-2)] text-[var(--rust-muted)]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  studio.id === 'playground'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : isActive
                      ? 'bg-[var(--rust-primary)]/10 text-[var(--rust-primary)] font-semibold'
                      : 'bg-[var(--rust-surface-2)] text-[var(--rust-muted)]'
                }`}>
                  {studio.badge}
                </span>
              </div>
              <div>
                <div className={`text-xs font-bold leading-tight ${
                  isActive ? 'text-[var(--rust-primary)]' : 'text-[var(--rust-text)]'
                }`}>
                  {studio.name}
                </div>
                <div className="text-[10px] text-[var(--rust-muted)] line-clamp-1 mt-0.5">
                  {studio.shortDesc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio Viewport */}
      <div className="rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-6 shadow-sm">
        {activeTab === 'ownership' && (
          <div className="space-y-6">
            <div className="border-b border-[var(--rust-border-subtle)] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--rust-text)]">
                  Ownership &amp; Move Semantics Simulator
                </h2>
                <p className="text-xs text-[var(--rust-muted)]">
                  Step through execution line by line to watch fat pointer stack frames allocate, transfer ownership, and drop.
                </p>
              </div>
              <Link
                href="/rustviz/concepts/016-the-stack-and-heap"
                className="text-xs text-[var(--rust-primary)] font-semibold hover:underline hidden sm:block"
              >
                Lesson 16: Stack &amp; Heap →
              </Link>
            </div>
            <OwnershipVisualizer />
          </div>
        )}

        {activeTab === 'borrow' && (
          <div className="space-y-6">
            <div className="border-b border-[var(--rust-border-subtle)] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--rust-text)]">
                  Borrow Checker &amp; Non-Lexical Lifetimes (NLL)
                </h2>
                <p className="text-xs text-[var(--rust-muted)]">
                  Verify compiler reference permissions: arbitrary immutable readers (&amp;T) OR exactly one mutable writer (&amp;mut T).
                </p>
              </div>
              <Link
                href="/rustviz/concepts/019-aliasing-xor-mutability"
                className="text-xs text-[var(--rust-primary)] font-semibold hover:underline hidden sm:block"
              >
                Lesson 19: Aliasing Law →
              </Link>
            </div>
            <BorrowCheckerVisualizer />
          </div>
        )}

        {activeTab === 'lifetimes' && (
          <div className="space-y-6">
            <div className="border-b border-[var(--rust-border-subtle)] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--rust-text)]">
                  Lifetimes &amp; Variance Engine
                </h2>
                <p className="text-xs text-[var(--rust-muted)]">
                  Analyze generic parameter bounds (\'a), compiler elision rules, and subtyping relationships.
                </p>
              </div>
              <Link
                href="/rustviz/concepts/031-what-are-lifetimes"
                className="text-xs text-[var(--rust-primary)] font-semibold hover:underline hidden sm:block"
              >
                Lesson 31: Lifetimes Primer →
              </Link>
            </div>
            <LifetimeVisualizer />
          </div>
        )}

        {activeTab === 'smart-pointers' && (
          <div className="space-y-6">
            <div className="border-b border-[var(--rust-border-subtle)] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--rust-text)]">
                  Smart Pointer Heap Layouts (Box, Rc, Arc, RefCell)
                </h2>
                <p className="text-xs text-[var(--rust-muted)]">
                  Simulate heap memory headers, strong &amp; weak atomic reference counters, and runtime borrow flags.
                </p>
              </div>
              <Link
                href="/rustviz/concepts/079-box-unique-heap-allocation"
                className="text-xs text-[var(--rust-primary)] font-semibold hover:underline hidden sm:block"
              >
                Lesson 79: Box Pointers →
              </Link>
            </div>
            <SmartPointerVisualizer />
          </div>
        )}

        {activeTab === 'concurrency' && (
          <div className="space-y-6">
            <div className="border-b border-[var(--rust-border-subtle)] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--rust-text)]">
                  Tokio Channels &amp; MPSC FIFO Queue Simulator
                </h2>
                <p className="text-xs text-[var(--rust-muted)]">
                  Send messages over multi-producer channels, verify backpressure buffers, and enforce Send + Sync boundaries.
                </p>
              </div>
              <Link
                href="/rustviz/concepts/089-fearless-concurrency-threads"
                className="text-xs text-[var(--rust-primary)] font-semibold hover:underline hidden sm:block"
              >
                Lesson 89: Threads &amp; Concurrency →
              </Link>
            </div>
            <ConcurrencyVisualizer />
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="space-y-6 py-6 text-center max-w-2xl mx-auto">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-fit mx-auto border border-amber-500/20">
              <Code2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                Engine Roadmap • Phase 2
              </span>
              <h3 className="text-2xl font-bold text-[var(--rust-text)]">
                Interactive Rust WebAssembly Compiler &amp; Sandbox
              </h3>
              <p className="text-xs sm:text-sm text-[var(--rust-muted)] leading-relaxed">
                An in-browser WebAssembly-powered Rust compiler sandbox. You will be able to write arbitrary Rust code, test borrow checker rules live, inspect LLVM assembly (MIR), and run test harnesses directly inside the browser.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-left text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-[var(--rust-muted)]">
                <Terminal className="w-4 h-4 text-[var(--rust-primary)]" />
                <span>Planned Sandbox Features:</span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-[var(--rust-text)]">
                <li>Real-time rustc 1.85 WebAssembly compilation with zero backend latency</li>
                <li>Live AST, MIR (Mid-Level IR), and ASM target code inspector</li>
                <li>Interactive memory allocation inspector showing stack frames in RAM</li>
                <li>Direct integration with all 100 LeetCode-style Practice Problems</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setActiveTab('ownership')}
                className="px-5 py-2.5 rounded-xl bg-[var(--rust-primary)] text-white font-bold text-xs hover:bg-[var(--rust-primary-hover)] transition-colors"
              >
                Explore Active Ownership Studio
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
