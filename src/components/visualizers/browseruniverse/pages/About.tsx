'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Layers, Cpu, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--bu-primary)]/30 bg-[var(--bu-primary)]/10 text-[var(--bu-primary)] text-xs font-mono">
          <Compass className="w-3.5 h-3.5" /> BROWSER::UNIVERSE Systems Architecture
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--bu-text)]">
          The Architecture of the <span className="text-[var(--bu-primary)] bu-glow">Modern Web Browser</span>
        </h1>

        <p className="text-base md:text-lg text-[var(--bu-muted)] max-w-3xl leading-relaxed">
          The web browser is an operating system within an operating system—a massive distributed platform translating declarative markup and untrusted code into 120 FPS hardware-accelerated user experiences.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--bu-border-subtle)] bg-[var(--bu-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--bu-primary)] font-bold">01 / RENDER ENGINE</span>
          <h3 className="font-display font-bold text-xl text-[var(--bu-text)]">Critical Rendering Path</h3>
          <p className="text-xs text-[var(--bu-muted)] leading-relaxed">
            By avoiding layout thrashing and animating strictly on GPU compositor layers, modern web apps sustain seamless 120 FPS frame rates.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--bu-border-subtle)] bg-[var(--bu-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--bu-v8-orange)] font-bold">02 / JIT COMPILATION</span>
          <h3 className="font-display font-bold text-xl text-[var(--bu-text)]">V8 Ignition &amp; TurboFan</h3>
          <p className="text-xs text-[var(--bu-muted)] leading-relaxed">
            Monomorphic hidden classes and Inline Caches allow dynamically-typed JavaScript to compile into raw machine assembly matching C++ performance.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--bu-border-subtle)] bg-[var(--bu-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--bu-purple)] font-bold">03 / SITE ISOLATION</span>
          <h3 className="font-display font-bold text-xl text-[var(--bu-text)]">Process Sandboxing</h3>
          <p className="text-xs text-[var(--bu-muted)] leading-relaxed">
            Chromium sandboxes every website into distinct OS processes via Mojo IPC, safeguarding against Spectre memory vulnerabilities and tab crashes.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--bu-border)] bg-[var(--bu-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--bu-text)]">
            Ready to master Browser Internals?
          </h3>
          <p className="text-xs text-[var(--bu-muted)]">
            Explore the complete 5-module curriculum map.
          </p>
        </div>

        <Link
          href="/browseruniverse/learn"
          className="px-6 py-3 rounded-lg bg-[var(--bu-primary)] text-black font-semibold text-xs hover:bg-[var(--bu-primary-hover)] transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
