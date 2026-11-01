'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  HelpCircle,
  RotateCcw,
  Search,
  Sparkles,
  Terminal,
  Trophy,
  XCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  NODE_PROBLEMS,
  NODE_PROBLEM_CATEGORIES,
  type NodeProblem,
} from '../data/problems';

const STORAGE_KEY = 'nodecosmos_solved_problems';

export default function Problems() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<
    Record<number, { selectedIndex: number; isCorrect: boolean }>
  >({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Load from localStorage
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

  const filteredProblems = useMemo(() => {
    return NODE_PROBLEMS.filter((p) => {
      const matchCat =
        selectedCategory === 'all' || p.category === selectedCategory;
      const matchDiff =
        selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
      const matchQuery =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.question.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiff && matchQuery;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const activeProblem =
    NODE_PROBLEMS.find((p) => p.id === selectedId) || NODE_PROBLEMS[0];

  // Update selected option when active problem changes
  useEffect(() => {
    if (userAnswers[activeProblem.id]) {
      setSelectedOption(userAnswers[activeProblem.id].selectedIndex);
    } else {
      setSelectedOption(null);
    }
  }, [activeProblem.id, userAnswers]);

  const handleSelectOption = (idx: number) => {
    if (userAnswers[activeProblem.id]?.isCorrect) return;
    setSelectedOption(idx);
  };

  const handleVerify = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === activeProblem.correctIndex;

    const nextAnswers = {
      ...userAnswers,
      [activeProblem.id]: { selectedIndex: selectedOption, isCorrect },
    };
    setUserAnswers(nextAnswers);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAnswers));
    } catch {
      // Ignore
    }

    if (isCorrect) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch {
        // Confetti optional
      }
    }
  };

  const handleResetProgress = () => {
    if (confirm('Reset your solved problem progress?')) {
      setUserAnswers({});
      setSelectedOption(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const solvedCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const currentAnswer = userAnswers[activeProblem.id];

  const currentIndex = filteredProblems.findIndex((p) => p.id === activeProblem.id);
  const prevProblem = currentIndex > 0 ? filteredProblems[currentIndex - 1] : null;
  const nextProblem =
    currentIndex < filteredProblems.length - 1
      ? filteredProblems[currentIndex + 1]
      : null;

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <CheckSquare className="w-3.5 h-3.5" /> Hands-On Challenges
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Node.js Architecture Practice Problems
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Master the Event Loop, Thread Pool offloading, Streams backpressure, and V8 memory management.
          </p>
        </div>

        {/* Solved Progress Counter */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-card border border-border flex items-center gap-2.5 shadow-xs">
            <Trophy className="w-4 h-4 text-emerald-500" />
            <div className="text-xs">
              <span className="font-bold text-foreground">{solvedCount}</span>
              <span className="text-muted-foreground font-medium"> / {NODE_PROBLEMS.length} Solved</span>
            </div>
          </div>

          {solvedCount > 0 && (
            <button
              onClick={handleResetProgress}
              title="Reset progress"
              className="p-2.5 rounded-2xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems by keyword (e.g. nextTick, backpressure, threadpool)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/40 border border-border text-xs text-foreground focus:border-emerald-500 outline-none transition"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                  selectedDifficulty === diff
                    ? 'bg-foreground text-background shadow-xs'
                    : 'bg-muted/30 border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 border-t border-border/80 pt-3">
          {NODE_PROBLEM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Problem List Sidebar + Active Problem Card */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Problem Selector List */}
        <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredProblems.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-card border border-border text-xs text-muted-foreground">
              No problems match your filters.
            </div>
          ) : (
            filteredProblems.map((p) => {
              const isSelected = p.id === activeProblem.id;
              const isSolved = userAnswers[p.id]?.isCorrect;
              const isWrong = userAnswers[p.id] && !userAnswers[p.id].isCorrect;

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedId(p.id);
                  }}
                  className={`w-full p-4 rounded-2xl text-left border transition-all space-y-1.5 flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-xs ring-1 ring-emerald-500/30'
                      : 'border-border bg-card hover:bg-muted/40'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">
                        #{p.id}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-muted text-muted-foreground">
                        {p.difficulty}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-foreground truncate">
                      {p.title}
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    {isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isWrong ? (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-border" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Area: Active Problem View */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                Problem #{activeProblem.id}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {activeProblem.category} &bull; {activeProblem.difficulty}
              </span>
            </div>

            {currentAnswer?.isCorrect && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Solved
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug">
            {activeProblem.title}
          </h2>

          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
            {activeProblem.question}
          </p>

          {activeProblem.code && (
            <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-border whitespace-pre-wrap leading-relaxed shadow-inner">
              {activeProblem.code}
            </pre>
          )}

          {/* Options List */}
          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select the correct answer:
            </div>
            {activeProblem.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const hasAnswered = currentAnswer !== undefined;
              const isCorrectAnswer = idx === activeProblem.correctIndex;
              const isUserChoice = currentAnswer?.selectedIndex === idx;

              let style = 'border-border bg-card hover:bg-muted/40 text-foreground';
              if (hasAnswered) {
                if (isCorrectAnswer) {
                  style = 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500/30';
                } else if (isUserChoice && !currentAnswer.isCorrect) {
                  style = 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200';
                } else {
                  style = 'opacity-50 border-border bg-card text-muted-foreground';
                }
              } else if (isSelected) {
                style = 'border-emerald-500 bg-emerald-500/10 text-foreground font-semibold ring-1 ring-emerald-500/30';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl text-left border text-xs sm:text-sm transition-all flex items-start gap-3 ${style}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-muted/60 text-foreground font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Submit & Next Action Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/80">
            <div className="flex items-center gap-2">
              <button
                onClick={handleVerify}
                disabled={selectedOption === null || currentAnswer?.isCorrect}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
              >
                {currentAnswer?.isCorrect ? 'Verified' : 'Check Answer'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {prevProblem && (
                <button
                  onClick={() => setSelectedId(prevProblem.id)}
                  className="px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Prev
                </button>
              )}
              {nextProblem && (
                <button
                  onClick={() => setSelectedId(nextProblem.id)}
                  className="px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition flex items-center gap-1"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Explanation Box */}
          {currentAnswer && (
            <div
              className={`p-5 rounded-2xl border space-y-2 animate-in fade-in ${
                currentAnswer.isCorrect
                  ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
                  : 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                {currentAnswer.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Correct Architecture Rationale
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-500" /> Incorrect Choice &bull; Runtime Mechanics
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed font-medium">
                {activeProblem.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
