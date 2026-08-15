'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight,
  Code,
  Terminal
} from 'lucide-react';
import { rustPitfalls, RustPitfall } from '../data/pitfalls';

export function Pitfalls() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(rustPitfalls[0].id);

  const categories = ['All', 'Ownership', 'Borrowing', 'Lifetimes', 'Traits'];

  const filteredPitfalls = rustPitfalls.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-rose-500/30 bg-rose-950/20 px-3 py-1 text-xs font-semibold text-rose-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Diagnostic Mastery Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
          Top Rust Compiler Errors &amp; Solutions
        </h1>
        <p className="text-sm text-[var(--rust-muted)] max-w-2xl">
          Decode exact rustc diagnostics, understand why the compiler rejected the code, and master idiomatic fixes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border-b border-[var(--rust-border)] pb-6">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-[var(--rust-surface)] text-[var(--rust-muted)] hover:text-[var(--rust-text)] border border-[var(--rust-border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--rust-muted)]" />
          <input
            type="text"
            placeholder="Search error codes (e.g. E0382)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface)] pl-9 pr-3 py-2 text-xs text-[var(--rust-text)] placeholder-[var(--rust-muted)] focus:border-rose-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Errors Accordion / List */}
      <div className="space-y-6">
        {filteredPitfalls.map((pitfall) => {
          const isExpanded = expandedId === pitfall.id;

          return (
            <div
              key={pitfall.id}
              className="rust-card rounded-xl overflow-hidden border border-[var(--rust-border)] transition-all"
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : pitfall.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-[var(--rust-surface-2)] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 rounded bg-rose-950/40 text-rose-400 border border-rose-500/30 font-mono text-xs font-bold">
                      {pitfall.code}
                    </span>
                    <span className="text-base font-bold text-[var(--rust-text)]">{pitfall.title}</span>
                  </div>
                  <p className="text-xs text-[var(--rust-muted)]">{pitfall.summary}</p>
                </div>

                <span className="text-xs font-mono text-[var(--rust-primary)] ml-4 shrink-0 font-semibold">
                  {isExpanded ? 'Collapse' : 'Inspect Fix'}
                </span>
              </button>

              {/* Expanded Diagnostic & Fix Body */}
              {isExpanded && (
                <div className="border-t border-[var(--rust-border)] p-6 bg-[var(--rust-surface)] space-y-6">
                  
                  {/* Compiler Diagnostic Output Box */}
                  <div className="rounded-lg border border-rose-500/40 bg-black/80 p-4 font-mono text-xs text-rose-400 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-rose-500 uppercase font-bold tracking-wider">
                      <span className="flex items-center"><Terminal className="mr-1 h-3.5 w-3.5" /> rustc Compiler Diagnostic</span>
                      <span>Edition 2024</span>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto text-[11px]">
                      {pitfall.compilerDiagnostic}
                    </pre>
                  </div>

                  {/* Broken vs Fixed Code Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* Broken Box */}
                    <div className="rounded-lg border border-rose-500/30 bg-rose-950/10 p-4 space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-400">
                        <XCircle className="h-4 w-4" />
                        <span>Problematic Code (Fails Compile)</span>
                      </div>
                      <pre className="font-mono text-xs text-[var(--rust-text)] p-3 rounded bg-[var(--rust-bg)] border border-rose-500/20 overflow-x-auto">
                        <code>{pitfall.brokenCode}</code>
                      </pre>
                    </div>

                    {/* Fixed Box */}
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Idiomatic Fixed Implementation</span>
                      </div>
                      <pre className="font-mono text-xs text-[var(--rust-text)] p-3 rounded bg-[var(--rust-bg)] border border-emerald-500/20 overflow-x-auto">
                        <code>{pitfall.fixedCode}</code>
                      </pre>
                    </div>

                  </div>

                  {/* Deep Architectural Explanation */}
                  <div className="p-4 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border)] space-y-2 text-xs">
                    <div className="font-bold text-[var(--rust-text)]">Why rustc rejected this:</div>
                    <p className="text-[var(--rust-muted)] leading-relaxed">{pitfall.explanation}</p>
                    
                    <div className="pt-2 border-t border-[var(--rust-border-subtle)] text-[var(--rust-primary)] flex items-start space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold">Mental Model Rule: </span>
                        <span>{pitfall.mentalModelTip}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
