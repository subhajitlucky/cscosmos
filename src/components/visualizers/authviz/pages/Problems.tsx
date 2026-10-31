'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  CheckSquare,
  HelpCircle,
  BookOpen,
  KeyRound,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  AUTH_PROBLEMS,
  AUTH_PROBLEM_CATEGORIES,
  type AuthProblem,
} from '../data/problems';

const STORAGE_KEY = 'authviz_solved_problems';

export default function Problems() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Solved state: map problemId -> { selectedIndex: number; isCorrect: boolean }
  const [userAnswers, setUserAnswers] = useState<
    Record<number, { selectedIndex: number; isCorrect: boolean }>
  >({});

  const cardRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserAnswers(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save to localStorage
  const recordAnswer = (problemId: number, index: number, isCorrect: boolean) => {
    setUserAnswers((prev) => {
      const updated = {
        ...prev,
        [problemId]: { selectedIndex: index, isCorrect },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    if (isCorrect) {
      const currentSolved = Object.values(userAnswers).filter((a) => a.isCorrect).length;
      if ([10, 25, 40, 60].includes(currentSolved + 1)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const resetAllProgress = () => {
    if (window.confirm(`Reset all your practice progress across the ${AUTH_PROBLEMS.length} questions?`)) {
      setUserAnswers({});
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  };

  // Filtered problem list
  const filteredProblems = useMemo(() => {
    return AUTH_PROBLEMS.filter((problem) => {
      if (selectedCategory !== 'all' && problem.category !== selectedCategory) {
        return false;
      }
      if (selectedDifficulty !== 'all' && problem.difficulty !== selectedDifficulty) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesQ = problem.question.toLowerCase().includes(q);
        const matchesExp = problem.explanation.toLowerCase().includes(q);
        const matchesOpt = problem.options.some((opt) => opt.toLowerCase().includes(q));
        if (!matchesQ && !matchesExp && !matchesOpt) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  // Keep selectedId valid
  useEffect(() => {
    if (filteredProblems.length > 0) {
      const exists = filteredProblems.some((p) => p.id === selectedId);
      if (!exists) {
        setSelectedId(filteredProblems[0].id);
      }
    }
  }, [filteredProblems, selectedId]);

  const currentProblem = useMemo(() => {
    return AUTH_PROBLEMS.find((p) => p.id === selectedId) ?? AUTH_PROBLEMS[0];
  }, [selectedId]);

  const currentIndexInFiltered = useMemo(() => {
    return filteredProblems.findIndex((p) => p.id === selectedId);
  }, [filteredProblems, selectedId]);

  const solvedCount = useMemo(() => {
    return Object.values(userAnswers).filter((a) => a.isCorrect).length;
  }, [userAnswers]);

  const answerState = userAnswers[currentProblem.id];
  const hasAnswered = answerState !== undefined;

  const goToNext = () => {
    if (currentIndexInFiltered < filteredProblems.length - 1) {
      setSelectedId(filteredProblems[currentIndexInFiltered + 1].id);
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const goToPrev = () => {
    if (currentIndexInFiltered > 0) {
      setSelectedId(filteredProblems[currentIndexInFiltered - 1].id);
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="space-y-10 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/60 text-foreground text-xs font-mono font-semibold">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Interactive Evaluation Arena</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Identity &amp; Auth Practice Problems
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {AUTH_PROBLEMS.length} architectural questions covering OAuth 2.0 PKCE, asymmetric RS256 JWTs, WebAuthn Passkeys, cookie security, RBAC engines, and Zero Trust identity.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-4 shrink-0">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-muted-foreground font-semibold">
              Mastery Progress
            </div>
            <div className="text-xl font-extrabold text-foreground">
              {solvedCount} <span className="text-xs font-normal text-muted-foreground">/ {AUTH_PROBLEMS.length} Solved</span>
            </div>
          </div>
          {solvedCount > 0 && (
            <button
              onClick={resetAllProgress}
              className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-2"
              title="Reset progress"
              aria-label="Reset progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by keyword (e.g. PKCE, RS256, SameSite, Argon2id, mTLS)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {AUTH_PROBLEM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-card border border-border text-foreground hover:border-emerald-500/50 hover:bg-muted/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Question List Sidebar + Active Problem Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Problem Navigator (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider px-1">
            <span>Question Index</span>
            <span>{filteredProblems.length} available</span>
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredProblems.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl text-sm">
                No questions match your current filters.
              </div>
            ) : (
              filteredProblems.map((prob, idx) => {
                const isSelected = prob.id === currentProblem.id;
                const answered = userAnswers[prob.id];

                return (
                  <button
                    key={prob.id}
                    onClick={() => {
                      setSelectedId(prob.id);
                      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-foreground font-bold shadow-xs'
                        : 'border-border/70 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[11px] shrink-0 text-muted-foreground w-6">
                        #{prob.id}
                      </span>
                      <span className="truncate">{prob.question}</span>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {answered?.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      {answered && !answered.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Question Solver (8 cols) */}
        <div ref={cardRef} className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
            {/* Question Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/70">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-mono text-xs font-bold">
                  Q{currentProblem.id} of {AUTH_PROBLEMS.length}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {currentProblem.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    currentProblem.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : currentProblem.difficulty === 'Intermediate'
                      ? 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20'
                      : currentProblem.difficulty === 'Advanced'
                      ? 'bg-muted text-foreground border border-border'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {currentProblem.difficulty}
                </span>

                <Link
                  href={`/authviz/concepts/${currentProblem.topicId}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  title="Study corresponding lesson"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Review Concept</span>
                </Link>
              </div>
            </div>

            {/* Question Prompt */}
            <h2 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
              {currentProblem.question}
            </h2>

            {/* Multiple Choice Options */}
            <div className="space-y-3 pt-2">
              {currentProblem.options.map((option, idx) => {
                const isSelected = answerState?.selectedIndex === idx;
                const isCorrect = idx === currentProblem.correctIndex;

                let optionStyle =
                  'border-border/80 bg-muted/20 hover:bg-muted/50 text-foreground';

                if (hasAnswered) {
                  if (isCorrect) {
                    optionStyle =
                      'border-emerald-500 bg-emerald-500/10 text-foreground font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle =
                      'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300';
                  } else {
                    optionStyle = 'border-border/40 text-muted-foreground opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasAnswered}
                    onClick={() => recordAnswer(currentProblem.id, idx, isCorrect)}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start gap-3.5 ${optionStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg border border-border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 bg-background">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box */}
            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-xl border space-y-2 ${
                  answerState.isCorrect
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-rose-500/30 bg-rose-500/5'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  {answerState.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Correct Answer</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span className="text-rose-600 dark:text-rose-400">Incorrect Choice</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {currentProblem.explanation}
                </p>
              </motion.div>
            )}

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-border/70 flex items-center justify-between gap-3">
              <button
                onClick={goToPrev}
                disabled={currentIndexInFiltered === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-foreground font-semibold text-xs hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                {currentIndexInFiltered + 1} of {filteredProblems.length} filtered
              </span>

              <button
                onClick={goToNext}
                disabled={currentIndexInFiltered === filteredProblems.length - 1}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
