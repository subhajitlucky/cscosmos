'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Code2, 
  CheckCircle2, 
  BookOpen, 
  Compass, 
  Terminal,
  Cpu,
  Clock,
  ArrowLeft
} from 'lucide-react';

export function JsConceptComingSoon({ topic, conceptNumber }) {
  const chapterNumber = conceptNumber || topic?.number || 1;
  const category = topic?.category || 'JavaScript Mastery 2027';
  const level = topic?.level || 'Beginner';

  const plannedMilestones = [
    {
      step: '01',
      title: 'Introduction & Mental Model',
      desc: 'Intuitive real-world analogies explaining what this concept is and why it exists.'
    },
    {
      step: '02',
      title: 'Core Engine Mechanics',
      desc: 'How the V8 JavaScript engine executes and allocates this concept behind the scenes.'
    },
    {
      step: '03',
      title: 'Interactive Studio & Visualizer',
      desc: 'Hands-on code editor with live memory diagram tracking stack, heap, and execution flow.'
    },
    {
      step: '04',
      title: 'Defensive Engineering & Pitfalls',
      desc: 'Real-world bugs, silent failures, and modern production patterns to write safe code.'
    },
    {
      step: '05',
      title: 'Interactive Stepper Quiz',
      desc: 'One-by-one focused questions with instant feedback and pedagogical explanations.'
    }
  ];

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto py-2">
      
      {/* Header Breadcrumbs & Status */}
      <header className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-brand-lime font-bold border border-emerald-500/20">
            {category}
          </span>
          <span>&bull;</span>
          <span className="font-bold text-[var(--text-main)]">
            Concept {String(chapterNumber).padStart(2, '0')} of 100
          </span>
          <span>&bull;</span>
          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
            {level}
          </span>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>CHAPTER IN DEVELOPMENT &bull; COMING SOON</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-main)]">
            {topic?.title || 'JavaScript Mastery Concept'}
          </h1>
        </div>

        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
          {topic?.description || 'This chapter is being developed as part of the CSCosmos JavaScript Mastery 2027 curriculum.'}
        </p>
      </header>

      {/* Reference Lesson Spotlight Banner */}
      <section className="p-5 sm:p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-brand-lime">
          <Sparkles className="w-5 h-5 shrink-0" />
          <h2 className="text-base sm:text-lg font-bold">
            Interactive Architecture Reference
          </h2>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          We are building all 100 curriculum concepts using our beginner-friendly interactive lesson architecture. You can experience the completed lesson format, interactive stepper quiz, and live memory visualizer in <strong className="text-[var(--text-main)] font-semibold">Concept 08: Primitive vs Non-Primitive Data Types</strong>.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            href="/jsviz/topic/primitive-vs-non-primitive-data-types"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-brand-lime dark:text-slate-950 font-mono text-xs font-bold transition-all shadow-xs"
          >
            <span>Explore Concept 08: Data Types</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/jsviz/learn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-medium hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>View All 100 Concepts</span>
          </Link>
        </div>
      </section>

      {/* Curriculum Blueprint / What's Coming Card */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight">
            What You Will Learn in This Chapter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {plannedMilestones.map((m) => (
            <div
              key={m.step}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-brand-lime">
                  PHASE {m.step}
                </span>
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                {m.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}

          {/* Quick Info Box */}
          <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between space-y-2">
            <div>
              <span className="font-mono text-xs font-bold text-zinc-500 uppercase">
                Pedagogy Standard
              </span>
              <h3 className="text-sm font-bold text-[var(--text-main)] mt-1">
                Beginner Friendly &bull; Practical
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mt-1">
                Zero academic fluff. Focused on mental models, predictable code, and internal engine understanding.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-emerald-700 dark:text-brand-lime">
              // Version 2.0 Curriculum
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <Link
          href="/jsviz/learn"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Curriculum Index</span>
        </Link>

        <span className="text-xs font-mono text-zinc-500">
          CSCosmos &bull; JavaScript Mastery 2027
        </span>
      </div>

    </div>
  );
}

export default JsConceptComingSoon;
