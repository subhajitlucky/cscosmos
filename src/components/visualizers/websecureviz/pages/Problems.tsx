'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SECURITY_PROBLEMS,
  SECURITY_CATEGORIES,
  type SecurityProblem,
} from '../data/problems';
import { securityTopics } from '../data/topics';
import { TOPIC_BASE_PATH } from '../data/topic';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'websecurity_solved_problems';

export default function Problems() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Solved state: problemId -> { selectedIndex: number; isCorrect: boolean }
  const [userAnswers, setUserAnswers] = useState<
    Record<number, { selectedIndex: number; isCorrect: boolean }>
  >({});

  const cardRef = useRef<HTMLDivElement>(null);

  // Load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserAnswers(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save answer to localStorage and trigger milestone confetti
  const recordAnswer = (problemId: number, index: number, isCorrect: boolean) => {
    setUserAnswers((prev) => {
      const updated = {
        ...prev,
        [problemId]: { selectedIndex: index, isCorrect },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore write error
      }

      const totalCorrect = Object.values(updated).filter((a) => a.isCorrect).length;
      if (totalCorrect === 10 || totalCorrect === 25 || totalCorrect === SECURITY_PROBLEMS.length) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // Ignore
        }
      }

      return updated;
    });
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all your progress in the Security Practice Arena?')) {
      setUserAnswers({});
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  };

  // Filter problems based on user selections
  const filteredProblems = useMemo(() => {
    return SECURITY_PROBLEMS.filter((problem) => {
      if (selectedTopicId !== 'all' && problem.topicId !== selectedTopicId) {
        return false;
      }
      if (selectedDifficulty !== 'all' && problem.difficulty !== selectedDifficulty) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inQuestion = problem.question.toLowerCase().includes(q);
        const inOptions = problem.options.some((opt) => opt.toLowerCase().includes(q));
        const inExpl = problem.explanation.toLowerCase().includes(q);
        if (!inQuestion && !inOptions && !inExpl) {
          return false;
        }
      }
      return true;
    });
  }, [selectedTopicId, selectedDifficulty, searchQuery]);

  // Ensure selectedId is valid within filtered list
  useEffect(() => {
    if (filteredProblems.length > 0) {
      const exists = filteredProblems.some((p) => p.id === selectedId);
      if (!exists) {
        setSelectedId(filteredProblems[0].id);
      }
    }
  }, [filteredProblems, selectedId]);

  const currentProblem = useMemo(() => {
    return (
      SECURITY_PROBLEMS.find((p) => p.id === selectedId) ||
      filteredProblems[0] ||
      SECURITY_PROBLEMS[0]
    );
  }, [selectedId, filteredProblems]);

  const currentIndexInFiltered = useMemo(() => {
    return filteredProblems.findIndex((p) => p.id === currentProblem?.id);
  }, [filteredProblems, currentProblem]);

  // Overall statistics
  const totalProblemsCount = SECURITY_PROBLEMS.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const percentComplete = Math.round((answeredCount / totalProblemsCount) * 100);

  const answeredState = currentProblem ? userAnswers[currentProblem.id] : undefined;

  const handleNext = () => {
    if (currentIndexInFiltered < filteredProblems.length - 1) {
      setSelectedId(filteredProblems[currentIndexInFiltered + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndexInFiltered > 0) {
      setSelectedId(filteredProblems[currentIndexInFiltered - 1].id);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card/90 to-red-950/10 p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Security Certification Practice</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Web Security Practice Arena
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Master Same-Origin Policy, CORS preflights, XSS sanitization, Anti-CSRF architectures,
              CSP Level 3 directives, and modern browser isolation with 52 in-depth technical questions.
            </p>
          </div>

          {/* Stats Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 rounded-xl border border-border bg-background/80 p-4 backdrop-blur shadow-xs">
            <div className="space-y-1 pr-4">
              <div className="text-xs font-medium text-muted-foreground">Progress</div>
              <div className="text-xl font-bold text-foreground">
                {correctCount} / {totalProblemsCount}{' '}
                <span className="text-xs font-normal text-muted-foreground">solved</span>
              </div>
              <div className="h-2 w-36 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>

            <button
              onClick={resetProgress}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Reset practice progress"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions, keywords, headers, attack vectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedTopicId('all')}
            className={cn(
              'shrink-0 rounded-lg px-3 py-1.5 font-medium transition-colors',
              selectedTopicId === 'all'
                ? 'bg-foreground text-background font-semibold'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            All Topics ({SECURITY_PROBLEMS.length})
          </button>
          {SECURITY_CATEGORIES.map((cat) => {
            const count = SECURITY_PROBLEMS.filter((p) => p.topicId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedTopicId(cat.id)}
                className={cn(
                  'shrink-0 rounded-lg px-3 py-1.5 font-medium transition-colors',
                  selectedTopicId === cat.id
                    ? 'bg-foreground text-background font-semibold'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Difficulty Pills */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Difficulty:</span>
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={cn(
                'rounded-md px-2.5 py-1 transition-colors',
                selectedDifficulty === diff
                  ? 'bg-red-500/15 text-red-500 font-semibold border border-red-500/30'
                  : 'hover:text-foreground'
              )}
            >
              {diff === 'all' ? 'All Levels' : diff}
            </button>
          ))}
          <span className="ml-auto text-xs">
            Showing <strong className="text-foreground">{filteredProblems.length}</strong> questions
          </span>
        </div>
      </div>

      {/* Main Practice Container: Left Question List & Right Question View */}
      {filteredProblems.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border bg-card">
          <p className="text-muted-foreground">No questions found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedTopicId('all');
              setSelectedDifficulty('all');
              setSearchQuery('');
            }}
            className="mt-3 text-sm text-red-500 hover:underline font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question Navigator Drawer/Sidebar */}
          <div className="lg:col-span-4 rounded-xl border border-border bg-card p-4 space-y-3 max-h-[700px] flex flex-col">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Question Directory</span>
              <span>{filteredProblems.length} total</span>
            </div>

            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
              {filteredProblems.map((prob, idx) => {
                const answer = userAnswers[prob.id];
                const isSelected = prob.id === currentProblem?.id;

                return (
                  <button
                    key={prob.id}
                    onClick={() => {
                      setSelectedId(prob.id);
                      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                    className={cn(
                      'w-full text-left rounded-lg p-2.5 text-xs transition-all flex items-start gap-2.5 border',
                      isSelected
                        ? 'border-red-500 bg-red-500/10 text-foreground shadow-xs'
                        : 'border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className="font-mono text-[11px] shrink-0 font-bold opacity-70">
                      Q{prob.id}
                    </span>

                    <span className="truncate flex-1 font-medium">{prob.question}</span>

                    {answer && (
                      <span className="shrink-0">
                        {answer.isCorrect ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-rose-500" />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Card */}
          <div ref={cardRef} className="lg:col-span-8 rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
            {currentProblem && (
              <>
                {/* Meta header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">
                      Question #{currentProblem.id}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                      {currentProblem.category}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded',
                        currentProblem.difficulty === 'Beginner'
                          ? 'text-emerald-500 bg-emerald-500/10'
                          : currentProblem.difficulty === 'Intermediate'
                          ? 'text-amber-500 bg-amber-500/10'
                          : 'text-rose-500 bg-rose-500/10'
                      )}
                    >
                      {currentProblem.difficulty}
                    </span>
                  </div>

                  <Link
                    href={`${TOPIC_BASE_PATH}/topics/${currentProblem.topicId}`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>Review Lesson</span>
                  </Link>
                </div>

                {/* Question Prompt */}
                <h2 className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
                  {currentProblem.question}
                </h2>

                {/* Multiple Choice Options */}
                <div className="space-y-3 pt-2">
                  {currentProblem.options.map((option, idx) => {
                    const isAnswered = answeredState !== undefined;
                    const isChosen = answeredState?.selectedIndex === idx;
                    const isCorrectChoice = currentProblem.correctIndex === idx;

                    let btnStyle =
                      'border-border/80 bg-background hover:bg-muted/50 hover:border-border text-foreground';

                    if (isAnswered) {
                      if (isCorrectChoice) {
                        btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium';
                      } else if (isChosen && !isCorrectChoice) {
                        btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium';
                      } else {
                        btnStyle = 'border-border/40 opacity-50 bg-background text-muted-foreground';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => recordAnswer(currentProblem.id, idx, isCorrectChoice)}
                        className={cn(
                          'w-full text-left rounded-xl p-4 text-sm transition-all flex items-start gap-3 border shadow-2xs',
                          btnStyle
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border transition-colors',
                            isAnswered && isCorrectChoice
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : isAnswered && isChosen && !isCorrectChoice
                              ? 'border-rose-500 bg-rose-500 text-white'
                              : 'border-border bg-muted/60 text-muted-foreground'
                          )}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card upon answering */}
                <AnimatePresence>
                  {answeredState && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        'rounded-xl border p-5 space-y-2 mt-4',
                        answeredState.isCorrect
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-rose-500/30 bg-rose-500/5'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {answeredState.isCorrect ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                              Correct! Well done.
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-rose-500" />
                            <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                              Incorrect.
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed pt-1">
                        {currentProblem.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndexInFiltered <= 0}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Previous Question</span>
                  </button>

                  <span className="text-xs text-muted-foreground">
                    {currentIndexInFiltered + 1} of {filteredProblems.length}
                  </span>

                  <button
                    onClick={handleNext}
                    disabled={currentIndexInFiltered >= filteredProblems.length - 1}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none transition-opacity"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
