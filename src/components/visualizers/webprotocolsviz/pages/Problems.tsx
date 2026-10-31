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
  CheckSquare,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  WEB_PROTOCOL_PROBLEMS,
  WEB_PROTOCOL_CATEGORIES,
  type WebProtocolProblem,
} from '../data/problems';
import { topics } from '../data/topics';
import { TOPIC_BASE_PATH } from '../data/topic';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'webprotocols_solved_problems';

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
        // Ignore
      }
      return updated;
    });

    if (isCorrect) {
      const currentSolved = Object.values(userAnswers).filter((a) => a.isCorrect).length;
      if ([24, 49, 74, 99].includes(currentSolved)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#ffffff', '#e2e8f0', '#94a3b8', '#059669'],
        });
      }
    }
  };

  const resetAllProgress = () => {
    if (window.confirm('Reset all your practice progress across the 100 questions?')) {
      setUserAnswers({});
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  };

  // Filter problems by topic, difficulty, and search term
  const filteredProblems = useMemo(() => {
    return WEB_PROTOCOL_PROBLEMS.filter((problem) => {
      if (selectedTopicId !== 'all' && problem.topicId !== selectedTopicId) {
        return false;
      }
      if (selectedDifficulty !== 'all' && problem.difficulty !== selectedDifficulty) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = problem.question.toLowerCase().includes(query);
        const matchesExplanation = problem.explanation.toLowerCase().includes(query);
        const matchesCategory = problem.category.toLowerCase().includes(query);
        if (!matchesQuestion && !matchesExplanation && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [selectedTopicId, selectedDifficulty, searchQuery]);

  // Active problem resolving
  const activeProblem: WebProtocolProblem = useMemo(() => {
    const found = WEB_PROTOCOL_PROBLEMS.find((p) => p.id === selectedId);
    return found || WEB_PROTOCOL_PROBLEMS[0];
  }, [selectedId]);

  const activeAnswer = userAnswers[activeProblem.id];

  // Stats calculation
  const totalQuestions = WEB_PROTOCOL_PROBLEMS.length;
  const solvedCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const attemptedCount = Object.keys(userAnswers).length;
  const percent = Math.round((solvedCount / totalQuestions) * 100);

  // Next / Previous navigation within the active filter
  const currentIndexInFiltered = filteredProblems.findIndex((p) => p.id === activeProblem.id);
  const prevProblem =
    currentIndexInFiltered > 0 ? filteredProblems[currentIndexInFiltered - 1] : null;
  const nextProblem =
    currentIndexInFiltered >= 0 && currentIndexInFiltered < filteredProblems.length - 1
      ? filteredProblems[currentIndexInFiltered + 1]
      : null;

  // Find corresponding topic from topics list
  const activeTopic = topics.find((t) => t.id === activeProblem.topicId);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <header className="space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/60 text-foreground text-xs font-mono font-semibold">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>100 Line-by-Line System &amp; Protocol Questions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Web Protocols Practice Arena
        </h1>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
          Master the complete HTTP protocol stack line-by-line: from sockets and DNS to TLS 1.3 handshakes,
          RFC caching semantics, CORS preflight engines, HTTP/2 multiplexing, and HTTP/3 QUIC connection migration.
        </p>
      </header>

      {/* Progress & Stats Card */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-muted text-foreground border border-border">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-foreground">
                  {solvedCount} / {totalQuestions}
                </span>
                <span className="text-xs text-muted-foreground">Questions Mastered</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {attemptedCount} attempted · {solvedCount} correct
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetAllProgress}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Progress: {percent}%</span>
            <span>{totalQuestions - solvedCount} Remaining</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in 100 questions (e.g. ETag, CORS, HTTP/2, QUIC, max-age, 304)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/80 bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Filter questions by difficulty"
              className="py-2 px-3 rounded-xl border border-border/80 bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Difficulties (100)</option>
              <option value="Beginner">Beginner (1–33)</option>
              <option value="Intermediate">Intermediate (34–85)</option>
              <option value="Advanced">Advanced (86–100)</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedTopicId('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              selectedTopicId === 'all'
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground'
            )}
          >
            All Chapters (100)
          </button>
          {WEB_PROTOCOL_CATEGORIES.map((cat) => {
            const count = WEB_PROTOCOL_PROBLEMS.filter((p) => p.topicId === cat.id).length;
            const isCatActive = selectedTopicId === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedTopicId(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isCatActive
                    ? 'bg-foreground text-background font-semibold shadow-xs'
                    : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground'
                )}
              >
                <span>{cat.name}</span>
                <span
                  className={cn(
                    'text-[10px] font-mono px-1 rounded',
                    isCatActive ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Practice Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Problem Card */}
        <div className="lg:col-span-8 space-y-6" ref={cardRef}>
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            {/* Top metadata */}
            <div className="flex items-center justify-between gap-2 border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-muted text-foreground border border-border font-mono text-xs font-bold">
                  Question #{activeProblem.id}
                </span>
                <Link
                  href={activeTopic ? `${TOPIC_BASE_PATH}${activeTopic.path}` : `${TOPIC_BASE_PATH}/path`}
                  className="text-xs text-muted-foreground hover:text-foreground font-medium hidden sm:inline-flex items-center gap-1.5 transition-colors group"
                  title={`Open lesson for ${activeProblem.category}`}
                >
                  <span>Chapter: {activeProblem.category}</span>
                  <BookOpen className="w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-foreground transition-colors" />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase',
                    activeProblem.difficulty === 'Beginner' &&
                      'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
                    activeProblem.difficulty === 'Intermediate' &&
                      'bg-muted text-foreground border border-border',
                    activeProblem.difficulty === 'Advanced' &&
                      'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  )}
                >
                  {activeProblem.difficulty}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
              {activeProblem.question}
            </h2>

            {/* Multiple Choice Options */}
            <div className="space-y-3 pt-2">
              {activeProblem.options.map((option, idx) => {
                const isSelected = activeAnswer?.selectedIndex === idx;
                const isCorrectOption = idx === activeProblem.correctIndex;
                const answered = Boolean(activeAnswer);

                let buttonStyle = 'border-border/80 bg-card hover:bg-muted/50 text-foreground';
                let indicator = (
                  <span className="w-6 h-6 rounded-full border border-border flex items-center justify-center font-mono text-xs text-muted-foreground shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                );

                if (answered) {
                  if (isCorrectOption) {
                    buttonStyle =
                      'border-emerald-500 bg-emerald-500/10 text-foreground font-semibold shadow-xs';
                    indicator = <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />;
                  } else if (isSelected && !isCorrectOption) {
                    buttonStyle =
                      'border-rose-500 bg-rose-500/10 text-foreground shadow-xs';
                    indicator = <XCircle className="w-6 h-6 text-rose-500 shrink-0" />;
                  } else {
                    buttonStyle = 'opacity-50 border-border bg-card text-muted-foreground';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={answered}
                    onClick={() => recordAnswer(activeProblem.id, idx, isCorrectOption)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      buttonStyle
                    )}
                  >
                    {indicator}
                    <span className="text-sm leading-relaxed pt-0.5">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation reveal */}
            <AnimatePresence>
              {activeAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'p-5 rounded-xl border mt-4 space-y-2',
                    activeAnswer.isCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-border bg-muted/30'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className={cn(
                        'w-4 h-4',
                        activeAnswer.isCorrect ? 'text-emerald-500' : 'text-muted-foreground'
                      )}
                    />
                    <span className="text-xs font-bold text-foreground">
                      {activeAnswer.isCorrect
                        ? 'Correct! Technical Explanation:'
                        : 'Explanation & RFC Specification Takeaway:'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-mono">
                    {activeProblem.explanation}
                  </p>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      Covered in chapter: {activeProblem.category}
                    </span>
                    <Link
                      href={activeTopic ? `${TOPIC_BASE_PATH}${activeTopic.path}` : `${TOPIC_BASE_PATH}/path`}
                      className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline transition-colors"
                    >
                      <span>Study Chapter Lesson</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border/80">
              <button
                type="button"
                disabled={!prevProblem}
                onClick={() => {
                  if (prevProblem) setSelectedId(prevProblem.id);
                }}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  prevProblem
                    ? 'border border-border text-foreground hover:bg-muted/50'
                    : 'opacity-30 cursor-not-allowed border border-border text-muted-foreground'
                )}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Question</span>
              </button>

              <button
                type="button"
                disabled={!nextProblem}
                onClick={() => {
                  if (nextProblem) setSelectedId(nextProblem.id);
                }}
                className={cn(
                  'flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  nextProblem
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xs'
                    : 'opacity-30 cursor-not-allowed bg-muted text-muted-foreground'
                )}
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: 100-Question Quick Jump Matrix */}
        <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="text-sm font-bold text-foreground">Question Navigator (100)</h3>
            <span className="text-xs font-mono text-muted-foreground">
              {filteredProblems.length} shown
            </span>
          </div>

          {/* Color legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pb-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Correct</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Missed</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-foreground" />
              <span>Selected</span>
            </span>
          </div>

          {/* 100-Pill Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-1.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredProblems.map((prob) => {
              const answer = userAnswers[prob.id];
              const isSelected = prob.id === activeProblem.id;

              let cellStyle = 'bg-muted/40 text-muted-foreground hover:bg-muted';
              if (isSelected) {
                cellStyle =
                  'bg-foreground text-background font-bold ring-2 ring-foreground/20 shadow-xs';
              } else if (answer?.isCorrect) {
                cellStyle = 'bg-emerald-500 text-white font-bold';
              } else if (answer && !answer.isCorrect) {
                cellStyle = 'bg-rose-500/20 text-rose-500 font-bold border border-rose-500/40';
              }

              return (
                <button
                  key={prob.id}
                  type="button"
                  onClick={() => setSelectedId(prob.id)}
                  aria-label={`Jump to Question ${prob.id}`}
                  className={cn(
                    'h-8 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    cellStyle
                  )}
                >
                  {prob.id}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border/80">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Tip: Click any number to jump directly to that question. Your progress is saved automatically in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
