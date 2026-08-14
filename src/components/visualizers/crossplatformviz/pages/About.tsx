'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Layers, Cpu, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--cp-primary)]/30 bg-[var(--cp-primary)]/10 text-[var(--cp-primary)] text-xs font-mono">
          <Smartphone className="w-3.5 h-3.5" /> MOBILE::INTERNALS Systems Architecture
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--cp-text)]">
          The Architecture of <span className="text-[var(--cp-primary)] cp-glow">Native Speed</span> Across Platforms
        </h1>

        <p className="text-base md:text-lg text-[var(--cp-muted)] max-w-3xl leading-relaxed">
          Cross-platform engineering is the art of eliminating impedance mismatches between high-level declarative logic and underlying hardware rendering pipelines.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--cp-border-subtle)] bg-[var(--cp-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--cp-primary)] font-bold">01 / JSI C++ POINTERS</span>
          <h3 className="font-display font-bold text-xl text-[var(--cp-text)]">Zero Serialization</h3>
          <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
            Direct memory bindings eliminate the asynchronous JSON bridge, allowing JavaScript engines to invoke C++ HostObjects synchronously in zero milliseconds.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--cp-border-subtle)] bg-[var(--cp-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--cp-sky)] font-bold">02 / GPU RASTERIZATION</span>
          <h3 className="font-display font-bold text-xl text-[var(--cp-text)]">Impeller Shaders</h3>
          <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
            By pre-compiling Vulkan and Metal shaders Ahead-of-Time, modern graphic engines eliminate runtime shader compilation jank and maintain 120 FPS.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--cp-border-subtle)] bg-[var(--cp-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--cp-amber)] font-bold">03 / SHARED RUNTIMES</span>
          <h3 className="font-display font-bold text-xl text-[var(--cp-text)]">KMP Native Code</h3>
          <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
            Compiling shared Kotlin logic into LLVM native binaries allows 100% native platform fidelity with pure SwiftUI and Jetpack Compose UIs.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--cp-border)] bg-[var(--cp-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--cp-text)]">
            Ready to master Cross-Platform mobile internals?
          </h3>
          <p className="text-xs text-[var(--cp-muted)]">
            Explore the complete 5-module curriculum map.
          </p>
        </div>

        <Link
          href="/crossplatformviz/learn"
          className="px-6 py-3 rounded-lg bg-[var(--cp-primary)] text-white font-semibold text-xs hover:bg-[var(--cp-primary-hover)] transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
