'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/visualizers/golangviz/components/footer';
import { Navigation } from '@/components/visualizers/golangviz/components/navigation';
import { GO_PITFALLS, GoPitfall } from '@/components/visualizers/golangviz/data/pitfalls-data';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Flame,
  Search,
  ShieldAlert,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';

export default function PitfallsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Concurrency', 'Memory & Slices', 'Interfaces & Types', 'Error & Control Flow', 'Maps & Structs'];

  const filtered = GO_PITFALLS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.explanation.toLowerCase().includes(search.toLowerCase()) ||
      p.underTheHood.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 space-y-8 pb-20 pt-6">
        {/* Header Hero */}
        <div className="surface rounded-3xl p-6 sm:p-8 border border-[var(--panel-border)] shadow-xl relative overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" /> Production Anti-Patterns &amp; Bugs
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Top Go Production Pitfalls &amp; Traps
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
            The most notorious bugs, memory leaks, and concurrency deadlocks that trip up Go developers in production — and exactly how to fix them.
          </p>

          {/* Search Bar & Category Filters */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="Search pitfalls, keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-[var(--panel-border)] text-xs text-[var(--foreground)] focus:border-rose-500 outline-none transition"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-[var(--panel)] border border-[var(--panel-border)] text-[var(--foreground)] hover:border-rose-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pitfalls List */}
        <div className="space-y-8">
          {filtered.map((pitfall) => (
            <div
              key={pitfall.id}
              className="surface rounded-3xl p-6 sm:p-8 border border-[var(--panel-border)] shadow-md space-y-6"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--panel-border)] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
                      {pitfall.category}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        pitfall.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {pitfall.severity} Severity
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)]">
                    {pitfall.title}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {pitfall.explanation}
              </p>

              {/* Code Comparison Grid */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* ❌ Buggy Code */}
                <div className="rounded-2xl border border-rose-500/30 bg-slate-950 text-slate-100 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-rose-950/50 border-b border-rose-800/40 text-xs font-mono text-rose-300 font-bold">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>❌ The Anti-Pattern / Buggy Code</span>
                  </div>
                  <pre className="p-4 text-xs font-mono overflow-x-auto text-rose-200 leading-relaxed">
                    <code>{pitfall.buggyCode}</code>
                  </pre>
                </div>

                {/* ✅ Fixed Code */}
                <div className="rounded-2xl border border-emerald-500/30 bg-slate-950 text-slate-100 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/50 border-b border-emerald-800/40 text-xs font-mono text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✅ The Fixed Idiomatic Way</span>
                  </div>
                  <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-200 leading-relaxed">
                    <code>{pitfall.fixedCode}</code>
                  </pre>
                </div>
              </div>

              {/* Under the Hood Callout */}
              <div className="p-4 rounded-2xl bg-[var(--panel)] border border-[var(--panel-border)] text-xs text-[var(--foreground)] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">
                  <Cpu className="w-3.5 h-3.5" /> Under the Hood Mechanics:
                </div>
                <p className="text-[var(--muted)] leading-relaxed">{pitfall.underTheHood}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
