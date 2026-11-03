'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Code2, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  rustProblems, 
  RUST_PROBLEM_CATEGORIES, 
  ProblemDifficulty, 
  RustProblem 
} from '../data/problems';

export function Problems() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return rustProblems.filter((problem) => {
      const matchesSearch =
        searchQuery === '' ||
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.number.toString() === searchQuery.trim() ||
        problem.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || problem.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const difficultyColors: Record<ProblemDifficulty, string> = {
    Easy: 'bg-[var(--rust-emerald-light)] text-[var(--rust-emerald)] border-[var(--rust-emerald-border)]',
    Medium: 'bg-[var(--rust-amber-light)] text-[var(--rust-amber)] border-[var(--rust-amber-border)]',
    Hard: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--rust-border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>100 LeetCode-Style Challenges</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--rust-text)]">
            Rust Coding Problems
          </h1>
          <p className="text-sm text-[var(--rust-muted)] mt-1 max-w-2xl">
            100 curated Rust problems from foundational syntax and vector manipulation to zero-copy slices, interior mutability, and lock-free concurrency.
          </p>
        </div>

        {/* Total counts badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface)] font-bold text-[var(--rust-text)]">
            {rustProblems.length} Total Problems
          </span>
          <span className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold">
            Compiler Sandbox Coming Soon
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--rust-muted)]" />
            <input
              type="text"
              placeholder="Search problem by name, #number, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] text-sm text-[var(--rust-text)] placeholder-[var(--rust-muted)] focus:outline-none focus:border-[var(--rust-primary)] transition-colors"
            />
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex items-center rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-1 gap-1 shrink-0">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-[var(--rust-primary)] text-white shadow-sm'
                    : 'text-[var(--rust-muted)] hover:text-[var(--rust-text)]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {RUST_PROBLEM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] text-[var(--rust-primary)] font-semibold'
                  : 'border-[var(--rust-border)] bg-[var(--rust-surface)] text-[var(--rust-muted)] hover:text-[var(--rust-text)] hover:border-[var(--rust-border-subtle)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProblems.map((problem) => (
          <Link
            key={problem.id}
            href={`/rustviz/problems/${problem.slug}`}
            className="group p-5 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:border-[var(--rust-primary-border)] hover:bg-[var(--rust-surface-2)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              {/* Card Top: Number + Badges */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[var(--rust-primary)] bg-[var(--rust-primary-light)] px-2 py-0.5 rounded-md border border-[var(--rust-primary-border)]">
                  #{String(problem.number).padStart(3, '0')}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--rust-surface-2)] border border-[var(--rust-border)] text-[var(--rust-muted)]">
                    Coming Soon
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors leading-snug">
                {problem.title}
              </h3>
            </div>

            {/* Bottom Strip */}
            <div className="mt-4 pt-3 border-t border-[var(--rust-border-subtle)] flex items-center justify-between text-xs font-semibold">
              <span className="text-[10px] font-mono text-[var(--rust-muted)] uppercase">
                {problem.category}
              </span>

              <span className="inline-flex items-center gap-1 text-[var(--rust-primary)] group-hover:translate-x-0.5 transition-transform text-xs">
                <span>View Problem</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <p className="text-sm text-[var(--rust-muted)]">
            No problems found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="text-xs text-[var(--rust-primary)] font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
