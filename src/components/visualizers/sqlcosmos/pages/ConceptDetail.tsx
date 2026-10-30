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
          <span className="px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
            {topic.category} • {topic.difficulty}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-snug">
          {topic.title}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {topic.summary}
        </p>
      </div>

      {/* Mental Model Analogy Card */}
      <div className="p-6 rounded-xl bg-muted/20 border border-border space-y-2.5">
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Intuitive mental model
        </div>
        <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
          {topic.mentalModel}
        </p>
      </div>

      {/* Code Snippet */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-muted-foreground" /> SQL query specification
          </span>
          <span className="font-mono text-[11px]">PostgreSQL / MySQL</span>
        </div>
        <pre className="p-5 rounded-xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-xs overflow-x-auto border border-border/80 shadow-inner whitespace-pre-wrap leading-relaxed">
          {topic.codeSnippet}
        </pre>
      </div>

      {/* Key Takeaways */}
      <div className="p-6 rounded-xl bg-card border border-border space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key architectural takeaways
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
          <div className="text-xs font-mono text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Common production mistake
          </div>
          <p className="text-xs text-rose-950 dark:text-rose-200 leading-relaxed font-medium">
            {topic.commonPitfall.mistake}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Recommended solution
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
            className="px-5 py-2.5 rounded-lg bg-foreground hover:bg-foreground/90 text-background font-semibold text-xs transition-colors shadow-xs flex items-center gap-2"
          >
            <span>Next: {nextTopic.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
