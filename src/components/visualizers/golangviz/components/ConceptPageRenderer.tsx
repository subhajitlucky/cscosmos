'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from './navigation';
import { Footer } from './footer';
import { Section } from './section';
import { ConceptNavigation } from './concept-navigation';
import { QuizCards } from './quiz-cards';
import { useGoProgress } from '../lib/useGoProgress';
import { InteractivePointerWidget } from './widgets/InteractivePointerWidget';
import { InteractiveSliceWidget } from './widgets/InteractiveSliceWidget';
import { InteractiveChannelWidget } from './widgets/InteractiveChannelWidget';
import { InteractiveMutexWidget } from './widgets/InteractiveMutexWidget';
import { ProductionCaseStudyCard } from './ProductionCaseStudyCard';
import { caseStudiesMap } from '../data/case-studies-data';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Code2,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Terminal,
  Trophy,
  XCircle,
} from 'lucide-react';
import type { FullConcept } from '../data/concepts-data';

interface ConceptPageRendererProps {
  concept: FullConcept;
}

export function ConceptPageRenderer({ concept }: ConceptPageRendererProps) {
  const { isLoaded, isCompleted, toggleCompleted, recordVisit, completedCount, totalConcepts, percentage } =
    useGoProgress();

  useEffect(() => {
    recordVisit(concept.slug);
  }, [concept.slug, recordVisit]);

  const done = isCompleted(concept.slug);
  const caseStudy = caseStudiesMap.get(concept.slug);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 space-y-8 pb-20 pt-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
        {/* Breadcrumb & Progress Control Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)] border-b border-[var(--panel-border)] pb-4">
          <Link
            href="/golangviz/path"
            className="inline-flex items-center gap-1.5 font-semibold text-[var(--foreground)] hover:text-blue-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Concepts Roadmap
          </Link>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
              {concept.levelBadge}
            </span>

            <button
              onClick={() => toggleCompleted(concept.slug)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                done
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--foreground)] hover:border-emerald-500 hover:text-emerald-600'
              }`}
            >
              {done ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed 🎉</span>
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600 dark:text-blue-400">
                {concept.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                {concept.title}
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            {concept.summary}
          </p>
        </div>

        {/* 💡 Real-World Analogy (Beginner Friendly Metaphor) */}
        {concept.analogy && (
          <div className="rounded-2xl p-6 border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm tracking-wide uppercase">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Real-World Analogy (Mental Model)</span>
            </div>
            <p className="text-sm sm:text-base text-[var(--foreground)] leading-relaxed italic">
              &ldquo;{concept.analogy}&rdquo;
            </p>
          </div>
        )}

        {/* 🧩 Inline Interactive Simulator Widgets */}
        {(concept.slug === 'pointers' || concept.slug === 'variables') && (
          <InteractivePointerWidget />
        )}
        {(concept.slug === 'slices' || concept.slug === 'slice-internals') && (
          <InteractiveSliceWidget />
        )}
        {(concept.slug === 'channels' || concept.slug === 'channel-internals' || concept.slug === 'goroutines') && (
          <InteractiveChannelWidget />
        )}
        {(concept.slug === 'sync-primitives' || concept.slug === 'atomic-operations') && (
          <InteractiveMutexWidget />
        )}

        {/* 🧠 Visual Mental Model Diagram (ASCII) */}
        {concept.mentalModel && (
          <div className="rounded-2xl border border-[var(--panel-border)] bg-slate-950 text-slate-100 p-5 shadow-md space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Architecture &amp; Memory Map
              </span>
              <span>Visual Model</span>
            </div>
            <pre className="text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-emerald-400 pt-1">
              {concept.mentalModel}
            </pre>
          </div>
        )}

        {/* Core Rules & Takeaways */}
        {concept.bullets && concept.bullets.length > 0 && (
          <div className="surface rounded-2xl p-6 shadow-sm border border-[var(--panel-border)] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> Key Concepts &amp; Rules To Remember
            </h2>
            <ul className="grid gap-3">
              {concept.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[var(--foreground)]/90 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Deep Dive Walkthrough Sections */}
        {concept.sections &&
          concept.sections.map((sec, idx) => (
            <Section
              key={idx}
              id={`section-${idx}`}
              kicker="Step-by-Step Code"
              title={sec.title}
              description={sec.explanation}
            >
              {sec.code && (
                <div className="mt-4 rounded-xl border border-[var(--panel-border)] bg-slate-950 text-slate-100 overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-blue-400" /> example.go
                    </span>
                    <span>Go 1.24+</span>
                  </div>
                  <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-blue-200">
                    <code>{sec.code}</code>
                  </pre>
                </div>
              )}

              {sec.visualHint && (
                <div className="mt-3 p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-blue-600 dark:text-blue-300 font-mono">
                  💡 <span className="font-semibold">Pro Tip:</span> {sec.visualHint}
                </div>
              )}
            </Section>
          ))}

        {/* 🏢 Battle-Tested Production Case Study */}
        {caseStudy && <ProductionCaseStudyCard caseStudy={caseStudy} />}

        {/* ⚠️ Common Beginner Gotchas & Pitfalls */}
        {concept.commonPitfalls && concept.commonPitfalls.length > 0 && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Common Beginner Pitfalls &amp; Mistakes
            </h2>
            <div className="grid gap-4">
              {concept.commonPitfalls.map((item, idx) => (
                <div key={idx} className="rounded-xl bg-background border border-rose-500/20 p-4 space-y-2">
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-semibold">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    <span>Mistake: {item.mistake}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium pl-6">
                    <span>✅ Correct Way: {item.fix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Quizzes */}
        {concept.quizzes && concept.quizzes.length > 0 && (
          <Section
            id="quiz"
            kicker="Self Assessment"
            title="Knowledge Check"
            description="Verify your understanding with these interactive practice questions."
          >
            <QuizCards quizzes={concept.quizzes} />
          </Section>
        )}

        {/* Lesson Completion Action Card */}
        <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)]">
                {done ? 'Lesson Completed!' : 'Finished this lesson?'}
              </h3>
              <p className="text-xs text-[var(--muted)]">
                {done ? `Great job! Your progress: ${completedCount}/${totalConcepts} (${percentage}%)` : 'Mark it as complete to track your overall Go mastery.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleCompleted(concept.slug)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
              done
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'
            }`}
          >
            {done ? 'Mark as Incomplete' : 'Complete & Continue'}
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation to Next/Prev */}
        <ConceptNavigation />
      </main>

      <Footer />
    </div>
  );
}
