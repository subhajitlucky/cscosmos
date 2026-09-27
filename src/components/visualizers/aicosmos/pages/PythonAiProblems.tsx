'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  pythonAiQuizQuestions,
  type PythonAiQuizQuestion,
} from '../data/python-ai';
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Award,
  Zap,
} from 'lucide-react';

export function PythonAiProblems() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  const currentQ: PythonAiQuizQuestion = pythonAiQuizQuestions[currentIdx];
  const isSubmitted = !!submittedQuestions[currentQ.id];
  const selectedAnswer = selectedOptions[currentQ.id];

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOptions((prev) => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleSubmit = () => {
    if (selectedAnswer === undefined) return;
    setSubmittedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  const handleReset = () => {
    setSelectedOptions({});
    setSubmittedQuestions({});
    setCurrentIdx(0);
  };

  const totalAnswered = Object.keys(submittedQuestions).length;
  const correctCount = Object.keys(submittedQuestions).reduce((acc, qId) => {
    const q = pythonAiQuizQuestions.find((item) => item.id === qId);
    if (q && selectedOptions[qId] === q.correctIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const scorePercent = totalAnswered > 0 ? Math.round((correctCount / pythonAiQuizQuestions.length) * 100) : 0;

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="space-y-3">
        <Link
          href="/aicosmos/learn/python-for-ai-engineering"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-text)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Python AI Curriculum
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Certification Arena // Subject 02
            </div>
            <h1 className="text-3xl font-black text-[var(--ai-text)] tracking-tight mt-2">
              Python for AI Engineering Knowledge Check
            </h1>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-3 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-3 px-4">
            <Award className="h-5 w-5 text-amber-400" />
            <div className="font-mono text-xs">
              <div className="text-[var(--ai-muted)]">Verified Score:</div>
              <div className="text-sm font-bold text-[var(--ai-text)]">
                {correctCount} / {pythonAiQuizQuestions.length} ({scorePercent}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Selector Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {pythonAiQuizQuestions.map((q, idx) => {
          const submitted = submittedQuestions[q.id];
          const isCorrect = submitted && selectedOptions[q.id] === q.correctIndex;
          const isWrong = submitted && selectedOptions[q.id] !== q.correctIndex;
          const isCurrent = currentIdx === idx;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all ${
                isCurrent
                  ? 'border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20'
                  : isCorrect
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                  : isWrong
                  ? 'border-rose-500/40 bg-rose-500/15 text-rose-400'
                  : 'border-[var(--ai-border)] bg-[var(--ai-card)] text-[var(--ai-muted)] hover:border-blue-500/30 hover:text-[var(--ai-text)]'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Box */}
      <section className="rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--ai-border)] pb-4">
          <span className="font-mono text-xs font-semibold text-blue-400">
            QUESTION {currentIdx + 1} OF {pythonAiQuizQuestions.length}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold ${
            currentQ.difficulty === 'Easy'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : currentQ.difficulty === 'Medium'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {currentQ.difficulty}
          </span>
        </div>

        <h2 className="text-lg md:text-xl font-bold text-[var(--ai-text)] leading-snug">
          {currentQ.question}
        </h2>

        {/* Option Selection List */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQ.correctIndex;
            let optionStyles = 'border-[var(--ai-border)] bg-[var(--ai-bg)] text-[var(--ai-text)] hover:border-blue-500/40';

            if (isSubmitted) {
              if (isCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold';
              } else if (isSelected && !isCorrect) {
                optionStyles = 'border-rose-500 bg-rose-500/10 text-rose-300';
              } else {
                optionStyles = 'border-[var(--ai-border)] bg-[var(--ai-bg)] opacity-40 text-[var(--ai-muted)]';
              }
            } else if (isSelected) {
              optionStyles = 'border-blue-500 bg-blue-500/10 text-blue-300 font-semibold ring-1 ring-blue-500';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isSubmitted}
                className={`w-full rounded-xl border p-4 text-left text-sm transition-all flex items-start gap-3 ${optionStyles}`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current font-mono text-[10px] font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{option}</span>
                {isSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-rose-400" />}
              </button>
            );
          })}
        </div>

        {/* Submit or Navigation Controls */}
        <div className="flex items-center justify-between border-t border-[var(--ai-border)] pt-4">
          <button
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ai-border)] px-3 py-1.5 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-text)] disabled:opacity-30"
          >
            <ArrowLeft className="h-3 w-3" /> Previous
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === undefined}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-mono font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 disabled:opacity-40"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx((prev) => Math.min(pythonAiQuizQuestions.length - 1, prev + 1))}
              disabled={currentIdx === pythonAiQuizQuestions.length - 1}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-mono font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 disabled:opacity-40"
            >
              Next Question <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Detailed Engineering Rationale */}
        {isSubmitted && (
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              Systems Engineering Rationale
            </div>
            <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </section>

      {/* Completion Banner */}
      {totalAnswered === pythonAiQuizQuestions.length && (
        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center space-y-4">
          <Award className="h-12 w-12 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-[var(--ai-text)]">
            Certification Assessment Complete!
          </h2>
          <p className="text-sm text-[var(--ai-muted)] max-w-lg mx-auto">
            You scored {correctCount} out of {pythonAiQuizQuestions.length} ({scorePercent}%).
            You have verified your comprehension of CPython memory mechanics, vectorization, asyncio LLM streaming, and Pydantic validation!
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] px-4 py-2 text-xs font-mono text-[var(--ai-text)] hover:border-emerald-500/50"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Retake Assessment
            </button>
            <Link
              href="/aicosmos/learn/python-for-ai-engineering"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-mono font-semibold text-white hover:bg-emerald-500"
            >
              Review Curriculum Map <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
