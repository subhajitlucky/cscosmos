'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, Binary, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--svelte-primary)]/30 bg-[var(--svelte-primary)]/10 text-[var(--svelte-primary)] text-xs font-mono">
          <Binary className="w-3.5 h-3.5" /> SvelteCosmos Philosophy
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--svelte-text)]">
          The Architecture of <span className="text-[var(--svelte-primary)] svelte-glow">Zero Overhead</span>
        </h1>

        <p className="text-base md:text-lg text-[var(--svelte-muted)] max-w-3xl leading-relaxed">
          Frameworks don&apos;t need to live in the browser. Svelte was created on a radical proposition: shift the burden of user interface engineering from runtime execution to compile-time code generation.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--svelte-primary)] font-bold">01 / SURGICAL DOM</span>
          <h3 className="font-display font-bold text-xl text-[var(--svelte-text)]">Compile-Time Reactivity</h3>
          <p className="text-xs text-[var(--svelte-muted)] leading-relaxed">
            By analyzing dependencies during the build, Svelte knows exactly which DOM nodes depend on which variables. There is no diffing algorithm wasting cycles in the browser.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--svelte-accent)] font-bold">02 / UNIVERSAL SIGNALS</span>
          <h3 className="font-display font-bold text-xl text-[var(--svelte-text)]">Svelte 5 Runes</h3>
          <p className="text-xs text-[var(--svelte-muted)] leading-relaxed">
            Runes like $state, $derived, and $effect provide fine-grained signal reactivity that works both inside .svelte components and plain .svelte.js modules.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--svelte-mint)] font-bold">03 / PROGRESSIVE FULLSTACK</span>
          <h3 className="font-display font-bold text-xl text-[var(--svelte-text)]">SvelteKit Ergonomics</h3>
          <p className="text-xs text-[var(--svelte-muted)] leading-relaxed">
            Filesystem routing, server-side data loaders, form actions with use:enhance, and streaming SSR out of the box with zero boilerplate.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--svelte-border)] bg-[var(--svelte-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--svelte-text)]">
            Ready to explore Svelte 5?
          </h3>
          <p className="text-xs text-[var(--svelte-muted)]">
            Traverse the 10 deep-dive modules across the concept roadmap.
          </p>
        </div>

        <Link
          href="/sveltecosmos/learn"
          className="px-6 py-3 rounded-lg bg-[var(--svelte-primary)] text-white font-medium text-xs hover:bg-[var(--svelte-primary-hover)] transition-all shadow-[0_0_20px_rgba(255,62,0,0.3)] whitespace-nowrap"
        >
          Explore Concept Map →
        </Link>
      </div>
    </div>
  );
}
