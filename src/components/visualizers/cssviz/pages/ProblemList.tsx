'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Trophy, CheckCircle2, Search, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { cssProblems, type CssProblem } from '../data/problems';
import PageTransition from '../components/common/PageTransition';
import SectionHeader from '../components/common/SectionHeader';
import { cn } from '../utils/cn';

export default function ProblemList() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [solvedIds, setSolvedIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cscosmos_solved_css_problems');
      if (stored) {
        setSolvedIds(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    cssProblems.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredProblems = useMemo(() => {
    return cssProblems.filter((p) => {
      const matchDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
      const matchCat = filterCategory === 'All' || p.category === filterCategory;
      const matchQuery =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.id) === searchQuery.trim();
      return matchDiff && matchCat && matchQuery;
    });
  }, [filterDifficulty, filterCategory, searchQuery]);

  const solvedCount = solvedIds.length;
  const progressPercent = Math.round((solvedCount / cssProblems.length) * 100);

  const getDifficultyBadge = (diff: CssProblem['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30';
      case 'Medium':
        return 'text-amber-700 bg-amber-50 border-amber-300 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/30';
      case 'Hard':
        return 'text-rose-700 bg-rose-50 border-rose-300 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30';
    }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8 py-4">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary font-bold">
              <Trophy className="h-4 w-4" />
              <span>Practice Arena · 100 CSS Problems</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              CSS Code Challenges
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Master CSS from beginner syntax to advanced 3D transforms, container queries, and subgrid with interactive, hands-on coding problems.
            </p>
          </div>

          {/* Progress Card */}
          <div className="rounded-xl border border-border bg-surface p-4 sm:min-w-[260px] space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-text">Progress</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {solvedCount} / {cssProblems.length} Solved ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges by name, number, or keyword..."
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Difficulty Tabs */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border self-start sm:self-auto overflow-x-auto max-w-full">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => {
                const count =
                  diff === 'All'
                    ? cssProblems.length
                    : cssProblems.filter((p) => p.difficulty === diff).length;
                return (
                  <button
                    key={diff}
                    onClick={() => setFilterDifficulty(diff)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                      filterDifficulty === diff
                        ? 'bg-primary text-slate-950 font-bold'
                        : 'text-muted-text hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {diff} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-text text-[11px] font-mono uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Topic:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs transition-colors shrink-0 border',
                  filterCategory === cat
                    ? 'border-primary bg-primary/10 text-primary font-bold'
                    : 'border-border bg-surface text-muted-text hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Problems Grid / List */}
        <div className="space-y-2.5">
          {filteredProblems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                No challenges found matching your filters.
              </p>
              <button
                onClick={() => {
                  setFilterDifficulty('All');
                  setFilterCategory('All');
                  setSearchQuery('');
                }}
                className="text-xs text-primary hover:underline font-mono"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredProblems.map((problem) => {
              const isSolved = solvedIds.includes(problem.id);
              return (
                <Link
                  key={problem.id}
                  href={`/fullstack/css-cosmos/problems/${problem.id}`}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface hover:border-primary/60 transition-all group hover:shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 border',
                        isSolved
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-border bg-slate-100 dark:bg-slate-800 text-muted-text group-hover:text-primary group-hover:border-primary/40'
                      )}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        `#${String(problem.id).padStart(2, '0')}`
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                          {problem.title}
                        </h3>
                        {isSolved && (
                          <span className="hidden sm:inline text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            SOLVED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-text truncate max-w-xl">
                        {problem.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="hidden md:inline-block px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-muted-text border border-border">
                      {problem.category}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded text-[11px] font-bold font-mono border',
                        getDifficultyBadge(problem.difficulty)
                      )}
                    >
                      {problem.difficulty}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-primary transition-transform" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </PageTransition>
  );
}
