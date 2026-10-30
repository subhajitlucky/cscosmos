'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Terminal, XCircle } from 'lucide-react';
import { SQL_TOPICS } from '../data/topics';

export default function ConceptDetail({ topicId }: { topicId: string }) {
  const topic = SQL_TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    notFound();
  }

  const nextTopic = topic.nextTopicId
    ? SQL_TOPICS.find((t) => t.id === topic.nextTopicId)
    : null;

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-10">
      <Link
        href="/sqlcosmos/concepts"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to 50 Concepts
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full border border-border bg-muted/40 text-foreground font-mono text-xs font-medium">
            {topic.category} • {topic.difficulty}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-snug">
          {topic.title}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {topic.summary}
        </p>
      </div>

      {/* Mental Model Analogy Card */}
      <div className="p-6 rounded-2xl bg-muted/20 border border-border space-y-2.5">
        <div className="text-[11px] font-bold uppercase font-mono tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Intuitive Mental Model
        </div>
        <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
          {topic.mentalModel}
        </p>
      </div>

      {/* Code Snippet */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-muted-foreground" /> SQL DDL / DML Query
          </span>
          <span className="font-mono text-[11px]">PostgreSQL / MySQL</span>
        </div>
        <pre className="p-5 rounded-2xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-xs overflow-x-auto border border-border/80 shadow-inner whitespace-pre-wrap leading-relaxed">
          {topic.codeSnippet}
        </pre>
      </div>

      {/* Key Takeaways */}
      <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Architectural Takeaways
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
          {topic.takeaways.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-foreground font-bold shrink-0 mt-0.5">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pitfall & Fix */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
          <div className="text-[11px] font-bold uppercase font-mono tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Common Production Mistake
          </div>
          <p className="text-xs text-rose-950 dark:text-rose-200 leading-relaxed font-medium">
            {topic.commonPitfall.mistake}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="text-[11px] font-bold uppercase font-mono tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Recommended Solution
          </div>
          <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
            {topic.commonPitfall.fix}
          </p>
        </div>
      </div>

      {/* Next Lesson Navigation */}
      {nextTopic && (
        <div className="pt-6 border-t border-border flex justify-end">
          <Link
            href={`/sqlcosmos/concepts/${nextTopic.id}`}
            className="px-5 py-2.5 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-semibold text-xs transition shadow-xs flex items-center gap-2"
          >
            <span>Next: {nextTopic.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
