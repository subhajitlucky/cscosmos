'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from './navigation';
import { Footer } from './footer';
import { Section } from './section';
import { ConceptNavigation } from './concept-navigation';
import { QuizCards } from './quiz-cards';
import { ArrowLeft, BookOpen, CheckCircle2, Code2, Sparkles, Terminal } from 'lucide-react';
import type { FullConcept } from '../data/concepts-data';

interface ConceptPageRendererProps {
  concept: FullConcept;
}

export function ConceptPageRenderer({ concept }: ConceptPageRendererProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 space-y-8 pb-20 pt-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between text-xs text-[var(--muted)] border-b border-[var(--panel-border)] pb-4">
          <Link
            href="/golangviz/path"
            className="inline-flex items-center gap-1.5 font-semibold text-[var(--foreground)] hover:text-blue-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Concepts Roadmap
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 font-mono text-[11px] text-blue-500 dark:text-blue-400 font-semibold">
              {concept.levelBadge}
            </span>
          </div>
        </div>

        {/* Header Hero */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-blue-500 dark:text-blue-400">{concept.category}</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                {concept.title}
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            {concept.summary}
          </p>
        </div>

        {/* Key Concepts / Takeaways */}
        {concept.bullets && concept.bullets.length > 0 && (
          <div className="surface rounded-2xl p-6 shadow-sm border border-[var(--panel-border)] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> Core Takeaways & Architecture Rules
            </h2>
            <ul className="grid gap-2.5 sm:grid-cols-1">
              {concept.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]/90 leading-normal">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Deep Dive Walkthrough Sections */}
        {concept.sections && concept.sections.map((sec, idx) => (
          <Section
            key={idx}
            id={`section-${idx}`}
            kicker="Deep Dive"
            title={sec.title}
            description={sec.explanation}
          >
            {sec.code && (
              <div className="mt-4 rounded-xl border border-[var(--panel-border)] bg-slate-950 text-slate-100 overflow-hidden shadow-lg">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-blue-400" /> example.go</span>
                  <span>Go 1.24+</span>
                </div>
                <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-blue-200">
                  <code>{sec.code}</code>
                </pre>
              </div>
            )}

            {sec.visualHint && (
              <div className="mt-3 p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-blue-600 dark:text-blue-300 font-mono">
                💡 <span className="font-semibold">Visual Hint:</span> {sec.visualHint}
              </div>
            )}
          </Section>
        ))}

        {/* Interactive Quizzes */}
        {concept.quizzes && concept.quizzes.length > 0 && (
          <Section
            id="quiz"
            kicker="Self Assessment"
            title="Knowledge Check"
            description="Test your understanding of this topic with interactive verification questions."
          >
            <QuizCards quizzes={concept.quizzes} />
          </Section>
        )}

        {/* Navigation to Next/Prev */}
        <ConceptNavigation />
      </main>

      <Footer />
    </div>
  );
}
