'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Layers,
  X
} from 'lucide-react';
import { rustConcepts, rustCategories, RustCategory } from '../data/concepts';

export function Concepts() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: rustConcepts.length };
    for (const c of rustConcepts) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredConcepts = useMemo(() => {
    return rustConcepts.filter((c) => {
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        `#${c.number}`.includes(q) ||
        String(c.number) === q;
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const readyCount = rustConcepts.filter((c) => !c.isComingSoon).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3.5 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Curated Blueprint • 100 Concepts</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
              100 Rust Architectural Concepts
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--rust-muted)] max-w-2xl leading-relaxed">
              From foundational syntax and memory layouts to non-lexical lifetimes, vtables, async Tokio state machines, and FFI boundaries.
            </p>
          </div>

          {/* Live vs Roadmap Status Pill */}
          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {readyCount} Live Lessons
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-muted)] border border-[var(--rust-border)]">
              <Lock className="h-3 w-3" />
              {rustConcepts.length - readyCount} in Roadmap
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 border-b border-[var(--rust-border)] pb-6">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--rust-muted)]" />
          <input
            type="text"
            placeholder="Search all 100 concepts by keyword, title, or #number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] pl-10 pr-10 py-2.5 text-xs text-[var(--rust-text)] placeholder-[var(--rust-muted)] focus:border-[var(--rust-primary)] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-[var(--rust-muted)] hover:text-[var(--rust-text)]"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {rustCategories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[var(--rust-primary)] text-white shadow-sm'
                    : 'bg-[var(--rust-surface)] text-[var(--rust-muted)] hover:text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] border border-[var(--rust-border)]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-mono rounded px-1.5 py-0.2 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[var(--rust-surface-2)] text-[var(--rust-muted)]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-[var(--rust-muted)] font-mono flex items-center justify-between">
          <span>Showing {filteredConcepts.length} of 100 concepts</span>
          {searchQuery && (
            <span>Filtered by: &quot;{searchQuery}&quot;</span>
          )}
        </div>
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredConcepts.map((concept) => {
          const isLive = !concept.isComingSoon;

          return (
            <Link
              key={concept.id}
              href={`/rustviz/concepts/${concept.slug}`}
              className={`rust-card rounded-xl p-5 flex flex-col justify-between group block transition-all ${
                isLive
                  ? 'border-[var(--rust-border)] hover:border-[var(--rust-primary-border)] hover:shadow-md'
                  : 'border-[var(--rust-border)]/60 bg-[var(--rust-surface)]/70 hover:border-[var(--rust-border)]'
              }`}
            >
              <div className="space-y-2.5">
                
                {/* Card Top: Number + Status Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--rust-primary)]">
                      #{String(concept.number).padStart(3, '0')}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--rust-surface-2)] text-[var(--rust-muted)] border border-[var(--rust-border)]">
                      {concept.category}
                    </span>
                  </div>

                  {isLive ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--rust-muted)] bg-[var(--rust-surface-2)] px-2 py-0.5 rounded">
                      <Lock className="h-2.5 w-2.5" />
                      Roadmap
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className={`text-base font-bold transition-colors ${
                  isLive 
                    ? 'text-[var(--rust-text)] group-hover:text-[var(--rust-primary)]' 
                    : 'text-[var(--rust-text)]/90'
                }`}>
                  {concept.title}
                </h3>
              </div>

              {/* Bottom Action Strip */}
              <div className="mt-4 pt-3 border-t border-[var(--rust-border-subtle)] flex items-center justify-between text-xs font-semibold">
                <span className="text-[10px] font-mono text-[var(--rust-muted)] uppercase">
                  {concept.difficulty} • {concept.readTime}
                </span>
                
                {isLive ? (
                  <span className="text-[var(--rust-primary)] flex items-center gap-1">
                    Read Lesson <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                ) : (
                  <span className="text-[var(--rust-muted)] flex items-center gap-1 group-hover:text-[var(--rust-text)] transition-colors">
                    Preview <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredConcepts.length === 0 && (
        <div className="py-20 text-center text-xs text-[var(--rust-muted)] border border-dashed border-[var(--rust-border)] rounded-2xl space-y-3">
          <Layers className="h-8 w-8 mx-auto text-[var(--rust-muted)]" />
          <p className="font-semibold text-sm text-[var(--rust-text)]">No concepts matched your filter</p>
          <p className="text-xs text-[var(--rust-muted)]">Try adjusting your search query or selecting a different category.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="text-xs font-bold text-[var(--rust-primary)] hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}

    </div>
  );
}
