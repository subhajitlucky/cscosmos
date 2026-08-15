'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, ArrowRight, Clock } from 'lucide-react';
import { rustConcepts, rustCategories } from '../data/concepts';

export function Concepts() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConcepts = rustConcepts.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Curated Architecture Syllabus</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
          Rust Backend Systems Concepts
        </h1>
        <p className="text-sm text-[var(--rust-muted)] max-w-2xl">
          Deep-dive theoretical references and memory layout blueprints for every fundamental layer of the Rust language and runtime.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border-b border-[var(--rust-border)] pb-6">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {rustCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--rust-primary)] text-white shadow'
                  : 'bg-[var(--rust-surface)] text-[var(--rust-muted)] hover:text-[var(--rust-text)] border border-[var(--rust-border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--rust-muted)]" />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface)] pl-9 pr-3 py-2 text-xs text-[var(--rust-text)] placeholder-[var(--rust-muted)] focus:border-[var(--rust-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcepts.map((concept) => (
          <Link
            key={concept.id}
            href={`/rustviz/concepts/${concept.slug}`}
            className="rust-card rounded-xl p-6 flex flex-col justify-between group block transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--rust-primary-light)] text-[var(--rust-primary)]">
                  {concept.category}
                </span>
                <span className="flex items-center text-[11px] text-[var(--rust-muted)] font-mono">
                  <Clock className="mr-1 h-3 w-3" />
                  {concept.readTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
                {concept.title}
              </h2>

              <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                {concept.summary}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--rust-border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--rust-primary)]">
              <span>Read Full Breakdown</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {filteredConcepts.length === 0 && (
        <div className="py-16 text-center text-xs text-[var(--rust-muted)] border border-dashed border-[var(--rust-border)] rounded-xl">
          No concepts match your search criteria. Try a different filter or query.
        </div>
      )}

    </div>
  );
}
