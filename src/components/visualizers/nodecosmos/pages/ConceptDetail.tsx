'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';
import { NODE_TOPICS } from '../data/topics';
import { Concept1Lesson } from '../components/Concept1Lesson';
import { Concept2Lesson } from '../components/Concept2Lesson';
import { Concept3Lesson } from '../components/Concept3Lesson';
import { Concept4Lesson } from '../components/Concept4Lesson';
import { Concept5Lesson } from '../components/Concept5Lesson';

export default function ConceptDetail({ topicId }: { topicId: string }) {
  const topic = NODE_TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    notFound();
  }

  const prevTopic = topic.prevTopicId
    ? NODE_TOPICS.find((t) => t.id === topic.prevTopicId)
    : null;

  const nextTopic = topic.nextTopicId
    ? NODE_TOPICS.find((t) => t.id === topic.nextTopicId)
    : null;

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 pt-10">
      <Link
        href="/nodecosmos/concepts"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-semibold transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all {NODE_TOPICS.length} Concepts
      </Link>

      {/* Interactive Pedagogical Lesson Experiences */}
      {topic.number === 1 ? (
        <Concept1Lesson />
      ) : topic.number === 2 ? (
        <Concept2Lesson />
      ) : topic.number === 3 ? (
        <Concept3Lesson />
      ) : topic.number === 4 ? (
        <Concept4Lesson />
      ) : topic.number === 5 ? (
        <Concept5Lesson />
      ) : (
        /* Coming Soon Template for Concepts 6-280 */
        <>
          {/* Title & Metadata */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Module {topic.moduleNumber}: {topic.moduleName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-mono font-bold">
                {topic.level} Level
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                  topic.stability === 'Experimental'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {topic.stability || 'Stable'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {topic.title}
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed">
              {topic.summary}
            </p>
          </div>

          {/* Coming Soon Notice */}
          <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Roadmap 2027 &bull; In Active Authoring
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                This lesson is concept #{topic.number} of the 280-topic Node.js learning roadmap. Full interactive simulators, execution traces, and hands-on exercises will be progressively rolled out.
              </p>
            </div>
          </div>

          {/* Mental Model Analogy Card */}
          <div className="p-6 rounded-3xl bg-muted/40 border border-border space-y-2">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Intuitive Mental Model
            </div>
            <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
              {topic.mentalModel}
            </p>
          </div>

          {/* Code Snippet */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-500" /> Node.js Implementation Preview
              </span>
              <span className="font-mono text-xs">Node.js v22 LTS</span>
            </div>
            <pre className="p-5 rounded-3xl bg-slate-950 text-emerald-300 font-mono text-sm overflow-x-auto border border-border shadow-inner whitespace-pre-wrap leading-relaxed">
              {topic.codeSnippet}
            </pre>
          </div>

          {/* Key Takeaways */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Architectural Takeaways
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {topic.takeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pitfall & Fix */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Common Production Mistake
              </div>
              <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
                {topic.commonPitfall.mistake}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Recommended Solution
              </div>
              <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                {topic.commonPitfall.fix}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Sequential Roadmap Navigation: Prev & Next */}
      <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
        {prevTopic ? (
          <Link
            href={`/nodecosmos/concepts/${prevTopic.id}`}
            className="px-5 py-2.5 rounded-2xl border border-border hover:bg-muted text-foreground font-bold text-xs sm:text-sm uppercase tracking-wider transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="truncate max-w-[200px]">Prev: {prevTopic.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextTopic && (
          <Link
            href={`/nodecosmos/concepts/${nextTopic.id}`}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-sm flex items-center gap-2 ml-auto"
          >
            <span className="truncate max-w-[200px]">Next: {nextTopic.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}