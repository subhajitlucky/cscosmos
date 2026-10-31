'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Cpu,
  Repeat,
  Code2,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { getCrossPlatformTopic, crossPlatformTopics } from '../data/topics';

export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = getCrossPlatformTopic(topicId) || crossPlatformTopics[0];

  // Find index for prev/next navigation
  const currentIndex = crossPlatformTopics.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? crossPlatformTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < crossPlatformTopics.length - 1 ? crossPlatformTopics[currentIndex + 1] : null;

  // Interactive Quiz State
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelectOption = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--cp-border)] pb-4 text-xs font-mono text-[var(--cp-muted)]">
        <div className="flex items-center gap-2">
          <Link
            href="/crossplatformviz/learn"
            className="hover:text-[var(--cp-primary)] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Concept Map
          </Link>
          <span>/</span>
          <span className="text-[var(--cp-muted)]">{topic.group.split(':')[0]}</span>
          <span>/</span>
          <span className="text-[var(--cp-text)] font-semibold">{topic.kicker}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded border border-[var(--cp-border)] text-[10px]">
            Topic {currentIndex + 1} of {crossPlatformTopics.length}
          </span>
          <span className="px-2 py-0.5 rounded border border-[var(--cp-border)] text-[10px] text-[var(--cp-primary)] font-bold">
            {topic.difficulty.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--cp-primary-30)] bg-[var(--cp-primary-10)] text-[var(--cp-primary)] text-xs font-mono font-bold">
            <span>{topic.kicker}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--cp-text)]">
            {topic.title}
          </h1>

          <div className="p-4 rounded-xl border-l-4 border-[var(--cp-primary)] bg-[var(--cp-surface-2)] text-sm md:text-base text-[var(--cp-text)] leading-relaxed font-sans">
            &ldquo;{topic.definition}&rdquo;
          </div>
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-4 p-6 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-3 font-mono">
          <span className="text-[11px] text-[var(--cp-primary)] uppercase tracking-wider font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Stage Track
          </span>
          <div className="font-display font-bold text-base text-[var(--cp-text)]">
            {topic.group}
          </div>
          <p className="text-xs text-[var(--cp-muted)] leading-relaxed font-sans">
            {topic.summary}
          </p>
        </div>
      </div>

      {/* Physical World Analogy Card */}
      <section className="p-6 md:p-8 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--cp-primary)] font-bold uppercase tracking-wider">
          <Repeat className="w-4 h-4 text-[var(--cp-primary)]" /> Mental Model: Physical World Analogy
        </div>
        <p className="font-display text-lg md:text-xl font-semibold text-[var(--cp-text)] leading-snug">
          {topic.analogy}
        </p>
      </section>

      {/* Step Sequence */}
      <section className="p-6 md:p-8 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-[var(--cp-primary)] uppercase tracking-wider font-bold">
            Execution Mechanics
          </span>
          <h3 className="font-display font-bold text-xl text-[var(--cp-text)]">
            Step-by-Step Architecture Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topic.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-[var(--cp-border)] bg-[var(--cp-surface-2)] space-y-2 font-mono text-xs"
            >
              <div className="flex items-center gap-2 text-[var(--cp-primary)] font-bold">
                <span className="px-2 py-0.5 rounded bg-[var(--cp-surface)] border border-[var(--cp-border)] text-[10px]">
                  STEP 0{idx + 1}
                </span>
              </div>
              <p className="text-[var(--cp-muted)] leading-relaxed font-sans text-xs">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Code Contract Implementation */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-mono text-[var(--cp-primary)] uppercase tracking-wider font-bold">
            Code Contract &amp; Implementation
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--cp-text)]">
            Concrete Runtime Architecture
          </h2>
        </div>

        <div className="rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] overflow-hidden font-mono text-xs">
          <div className="px-4 py-2.5 border-b border-[var(--cp-border)] bg-[var(--cp-surface-2)] flex items-center justify-between">
            <span className="text-xs text-[var(--cp-muted)] flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[var(--cp-primary)]" />
              {topic.id}.spec
            </span>
            <span className="text-[10px] text-[var(--cp-emerald)] bg-[var(--cp-emerald-bg)] px-2 py-0.5 rounded border border-[var(--cp-emerald-border)] font-bold">
              SYSTEM CONTRACT
            </span>
          </div>

          <div className="p-6 overflow-x-auto bg-[var(--cp-surface)]">
            <pre className="text-[var(--cp-text)] leading-relaxed text-xs">
              <code>{topic.codeSnippet}</code>
            </pre>
          </div>

          <div className="px-4 py-3 border-t border-[var(--cp-border)] bg-[var(--cp-surface-2)] text-[11px] text-[var(--cp-muted)] font-sans">
            <span className="font-mono font-bold text-[var(--cp-text)] mr-2">Runtime Behavior:</span>
            {topic.outputDescription}
          </div>
        </div>
      </section>

      {/* Pitfalls & Performance Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="p-6 md:p-8 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--cp-rose)] font-bold">
            <AlertTriangle className="w-4 h-4" /> Common Pitfalls &amp; Frame Drops
          </div>
          <div className="space-y-3 font-sans text-xs text-[var(--cp-muted)] leading-relaxed">
            {topic.mistakes.map((mistake, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--cp-rose)] mt-1.5 flex-shrink-0" />
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 md:p-8 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--cp-sky)] font-bold">
            <Cpu className="w-4 h-4" /> Systems Engineering Optimization
          </div>
          <p className="text-xs font-sans text-[var(--cp-muted)] leading-relaxed">
            {topic.optimization}
          </p>
        </section>
      </div>

      {/* Interactive Knowledge Verification Quiz */}
      {topic.quiz && (
        <section className="p-6 md:p-8 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface-2)] space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--cp-border)] pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--cp-primary)] font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" /> Student Knowledge Check
            </div>
            {selectedAnswer !== null && (
              <button
                onClick={handleResetQuiz}
                className="text-xs font-mono text-[var(--cp-muted)] hover:text-[var(--cp-primary)] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Question
              </button>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold text-[var(--cp-text)]">
              {topic.quiz.question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {topic.quiz.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === topic.quiz?.correctIndex;

                let btnStyles = 'border-[var(--cp-border)] bg-[var(--cp-surface)] text-[var(--cp-text)] hover:border-[var(--cp-primary)]';
                if (showExplanation) {
                  if (isCorrect) {
                    btnStyles = 'border-[var(--cp-emerald-border)] bg-[var(--cp-emerald-bg)] text-[var(--cp-emerald)] font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'border-[var(--cp-rose-border)] bg-[var(--cp-rose-bg)] text-[var(--cp-rose)] font-bold';
                  } else {
                    btnStyles = 'border-[var(--cp-border)] bg-[var(--cp-surface)] text-[var(--cp-muted)] opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-lg border text-left transition-all flex items-start gap-3 ${btnStyles}`}
                  >
                    <span className="w-5 h-5 rounded border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className={`p-4 rounded-lg border font-mono text-xs space-y-1.5 ${
                selectedAnswer === topic.quiz.correctIndex
                  ? 'border-[var(--cp-emerald-border)] bg-[var(--cp-emerald-bg)] text-[var(--cp-emerald)]'
                  : 'border-[var(--cp-rose-border)] bg-[var(--cp-rose-bg)] text-[var(--cp-rose)]'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {selectedAnswer === topic.quiz.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Incorrect Answer
                    </>
                  )}
                </div>
                <p className="font-sans text-[var(--cp-text)] leading-relaxed">
                  {topic.quiz.explanation}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Prev / Next Topic Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--cp-border)] pt-8">
        {prevTopic ? (
          <Link
            href={`/crossplatformviz/learn/${prevTopic.id}`}
            className="p-4 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] hover:border-[var(--cp-primary)] transition-all space-y-1 group"
          >
            <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--cp-muted)] group-hover:text-[var(--cp-primary)]">
              <ChevronLeft className="w-3.5 h-3.5" /> Previous Topic ({currentIndex})
            </div>
            <div className="font-display font-bold text-sm text-[var(--cp-text)] group-hover:text-[var(--cp-primary)] transition-colors">
              {prevTopic.title}
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface-2)] opacity-40 space-y-1">
            <span className="text-[10px] font-mono text-[var(--cp-muted)]">Beginning of Curriculum</span>
            <div className="font-display font-bold text-sm text-[var(--cp-muted)]">No Previous Topic</div>
          </div>
        )}

        {nextTopic ? (
          <Link
            href={`/crossplatformviz/learn/${nextTopic.id}`}
            className="p-4 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] hover:border-[var(--cp-primary)] transition-all space-y-1 group text-right sm:text-right"
          >
            <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-[var(--cp-muted)] group-hover:text-[var(--cp-primary)]">
              Next Topic ({currentIndex + 2}) <ChevronRight className="w-3.5 h-3.5" />
            </div>
            <div className="font-display font-bold text-sm text-[var(--cp-text)] group-hover:text-[var(--cp-primary)] transition-colors">
              {nextTopic.title}
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface-2)] opacity-40 space-y-1 text-right">
            <span className="text-[10px] font-mono text-[var(--cp-muted)]">End of Curriculum</span>
            <div className="font-display font-bold text-sm text-[var(--cp-muted)]">All 14 Topics Completed!</div>
          </div>
        )}
      </div>

      {/* Related Topics */}
      <section className="space-y-4 border-t border-[var(--cp-border)] pt-8">
        <h3 className="font-display text-xl font-bold text-[var(--cp-text)]">
          Related Mobile Concepts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topic.related.map((relId) => {
            const relTopic = getCrossPlatformTopic(relId);
            if (!relTopic) return null;
            return (
              <Link
                key={relId}
                href={`/crossplatformviz/learn/${relTopic.id}`}
                className="cp-card p-5 rounded-xl space-y-2 group"
              >
                <span className="text-[10px] font-mono text-[var(--cp-primary)] font-bold">
                  {relTopic.kicker}
                </span>
                <h4 className="font-display font-bold text-sm text-[var(--cp-text)] group-hover:text-[var(--cp-primary)] transition-colors">
                  {relTopic.title}
                </h4>
                <span className="text-xs font-mono text-[var(--cp-primary)] flex items-center gap-1 pt-1 font-bold">
                  Study concept &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
