'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Layers, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  rustInterviewQuestions, 
  RUST_INTERVIEW_CATEGORIES, 
  InterviewDifficulty, 
  RustInterviewQuestion 
} from '../data/interview';

export function Interview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const filteredQuestions = useMemo(() => {
    return rustInterviewQuestions.filter((q) => {
      const matchesSearch =
        searchQuery === '' ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.number.toString() === searchQuery.trim() ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || q.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const difficultyColors: Record<InterviewDifficulty, string> = {
    Junior: 'bg-[var(--rust-emerald-light)] text-[var(--rust-emerald)] border-[var(--rust-emerald-border)]',
    'Mid-Level': 'bg-[var(--rust-cyan-light)] text-[var(--rust-cyan)] border-[var(--rust-cyan-border)]',
    Senior: 'bg-[var(--rust-amber-light)] text-[var(--rust-amber)] border-[var(--rust-amber-border)]',
    Staff: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  const frequencyBadges = {
    Essential: 'bg-red-500/10 text-red-500 border border-red-500/20',
    High: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    Common: 'bg-[var(--rust-surface-2)] text-[var(--rust-muted)] border border-[var(--rust-border)]',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--rust-border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>100 Technical Interview Questions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--rust-text)]">
            Rust Interview Questions
          </h1>
          <p className="text-sm text-[var(--rust-muted)] mt-1 max-w-2xl">
            100 core systems questions with step-by-step clear explanations, concrete code examples, and ultra-simple mental models to ace technical interviews.
          </p>
        </div>

        {/* Total counts badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface)] font-bold text-[var(--rust-text)]">
            {rustInterviewQuestions.length} Questions Cataloged
          </span>
          <span className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold">
            Roadmap / Template Mode
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
              placeholder="Search interview question by topic, #number, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] text-sm text-[var(--rust-text)] placeholder-[var(--rust-muted)] focus:outline-none focus:border-[var(--rust-primary)] transition-colors"
            />
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex items-center rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-1 gap-1 shrink-0">
            {['All', 'Junior', 'Mid-Level', 'Senior', 'Staff'].map((diff) => (
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
          {RUST_INTERVIEW_CATEGORIES.map((cat) => (
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

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.map((q) => (
          <Link
            key={q.id}
            href={`/rustviz/interview/${q.slug}`}
            className="group p-5 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:border-[var(--rust-primary-border)] hover:bg-[var(--rust-surface-2)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              {/* Card Top: Number + Badges */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[var(--rust-primary)] bg-[var(--rust-primary-light)] px-2 py-0.5 rounded-md border border-[var(--rust-primary-border)]">
                  Q#{String(q.number).padStart(3, '0')}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${frequencyBadges[q.frequency]}`}>
                    {q.frequency}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors leading-snug">
                {q.title}
              </h3>
            </div>

            {/* Bottom Strip */}
            <div className="mt-4 pt-3 border-t border-[var(--rust-border-subtle)] flex items-center justify-between text-xs font-semibold">
              <span className="text-[10px] font-mono text-[var(--rust-muted)] uppercase">
                {q.category}
              </span>

              <span className="inline-flex items-center gap-1 text-[var(--rust-primary)] group-hover:translate-x-0.5 transition-transform text-xs">
                <span>View Blueprint</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <p className="text-sm text-[var(--rust-muted)]">
            No questions found matching your criteria.
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
