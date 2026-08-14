'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/visualizers/golangviz/components/footer';
import { Navigation } from '@/components/visualizers/golangviz/components/navigation';
import { Section } from '@/components/visualizers/golangviz/components/section';
import { levels } from '@/components/visualizers/golangviz/lib/curriculum';
import { useGoProgress } from '@/components/visualizers/golangviz/lib/useGoProgress';
import Link from 'next/link';
import { CheckCircle2, Circle, Filter, Play, Sparkles, Trophy } from 'lucide-react';

export default function LearningPathPage() {
  const { isCompleted, toggleCompleted, completedCount, totalConcepts, percentage, nextUncompletedConcept } =
    useGoProgress();

  const [filter, setFilter] = useState<'all' | 'uncompleted' | 'completed'>('all');

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 space-y-8 pb-20 pt-6">
        {/* Header Hero & Progress Card */}
        <div className="surface rounded-3xl p-6 sm:p-8 border border-[var(--panel-border)] shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> 70-Topic Complete Curriculum
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                The Master Go Roadmap
              </h1>
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                From Absolute Basics (Level 0) to Compiler Internals and Distributed Systems (Level 15). Every topic includes mental models, code examples, common pitfalls, and self-checks.
              </p>
            </div>

            {/* Overall Progress Gauge */}
            <div className="w-full md:w-auto min-w-[280px] p-5 rounded-2xl bg-background border border-[var(--panel-border)] shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" /> Your Mastery
                </span>
                <span className="text-xs font-mono font-bold text-emerald-500">{percentage}%</span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>{completedCount} of {totalConcepts} topics completed</span>
              </div>

              {nextUncompletedConcept && (
                <Link
                  href={`/golangviz/concepts/${nextUncompletedConcept.slug}`}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-transform hover:scale-[1.02]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume: {nextUncompletedConcept.title}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-8 pt-6 border-t border-[var(--panel-border)] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[var(--muted)]" />
              <span className="text-xs font-semibold text-[var(--muted)]">Filter:</span>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[var(--panel)] border border-[var(--panel-border)] text-[var(--foreground)] hover:border-blue-500'
                }`}
              >
                All (70)
              </button>
              <button
                onClick={() => setFilter('uncompleted')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === 'uncompleted'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[var(--panel)] border border-[var(--panel-border)] text-[var(--foreground)] hover:border-blue-500'
                }`}
              >
                Remaining ({totalConcepts - completedCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === 'completed'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[var(--panel)] border border-[var(--panel-border)] text-[var(--foreground)] hover:border-blue-500'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>
        </div>

        {/* 16 Levels Grid */}
        <div className="space-y-6">
          {levels.map((level) => {
            const levelConcepts = level.concepts;
            const levelCompletedCount = levelConcepts.filter((c) => {
              const slug = c.href ? c.href.split('/').pop() : '';
              return slug && isCompleted(slug);
            }).length;
            const isLevelMastered = levelCompletedCount === levelConcepts.length && levelConcepts.length > 0;

            const visibleConcepts = levelConcepts.filter((c) => {
              const slug = c.href ? c.href.split('/').pop() : '';
              if (!slug) return true;
              const done = isCompleted(slug);
              if (filter === 'completed') return done;
              if (filter === 'uncompleted') return !done;
              return true;
            });

            if (visibleConcepts.length === 0 && filter !== 'all') {
              return null;
            }

            return (
              <div
                key={level.id}
                className="surface rounded-3xl p-6 shadow-md border border-[var(--panel-border)] space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--panel-border)] pb-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
                      {level.badge}
                    </h2>
                    {isLevelMastered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Mastered 🎉
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-[var(--muted)]">
                        {levelCompletedCount}/{levelConcepts.length} completed
                      </span>
                    )}
                  </div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[var(--muted)]">
                    {level.blurb}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {visibleConcepts.map((concept, cIdx) => {
                    const slug = concept.href ? concept.href.split('/').pop() : '';
                    const done = slug ? isCompleted(slug) : false;

                    return (
                      <div
                        key={`${level.id}-${concept.title}-${cIdx}`}
                        className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                          done
                            ? 'bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-500/10'
                            : 'bg-[var(--panel)] border-[var(--panel-border)] hover:border-blue-500/50 hover:shadow-md'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            {concept.href ? (
                              <Link
                                href={concept.href}
                                className="font-bold text-sm sm:text-base text-[var(--foreground)] hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 group"
                              >
                                <span>{concept.title}</span>
                                <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                              </Link>
                            ) : (
                              <div className="font-bold text-sm sm:text-base text-[var(--foreground)]">
                                {concept.title}
                              </div>
                            )}

                            {slug && (
                              <button
                                onClick={() => toggleCompleted(slug)}
                                title={done ? 'Mark as incomplete' : 'Mark as completed'}
                                className="text-[var(--muted)] hover:text-emerald-500 transition-colors p-1"
                              >
                                {done ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <Circle className="w-5 h-5" />
                                )}
                              </button>
                            )}
                          </div>

                          <ul className="space-y-1.5 text-xs text-[var(--muted)]">
                            {concept.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-1.5">
                                <span className="text-blue-500 font-bold">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {concept.href && (
                          <div className="mt-4 pt-3 border-t border-[var(--panel-border)] flex items-center justify-between text-xs">
                            <span className={`font-semibold ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                              {done ? 'Completed' : 'Start Lesson'}
                            </span>
                            <Link
                              href={concept.href}
                              className="font-bold text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              Explore Lesson →
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
