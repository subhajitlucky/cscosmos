'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Terminal, XCircle } from 'lucide-react';
import { NODE_TOPICS } from '../data/topics';

export default function ConceptDetail({ topicId }: { topicId: string }) {
  const topic = NODE_TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    notFound();
  }

  const nextTopic = topic.nextTopicId
    ? NODE_TOPICS.find((t) => t.id === topic.nextTopicId)
    : null;

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 pt-10">
      <Link
        href="/nodecosmos/concepts"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to 20 Concepts
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            {topic.category} • {topic.difficulty}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {topic.title}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {topic.summary}
        </p>
      </div>

      {/* Mental Model Analogy Card */}
      <div className="p-6 rounded-3xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Intuitive Mental Model
        </div>
        <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
          {topic.mentalModel}
        </p>
      </div>

      {/* Code Snippet */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-500" /> Node.js ESM / CJS Implementation
          </span>
          <span className="font-mono text-[11px]">Node.js v22 LTS</span>
        </div>
        <pre className="p-5 rounded-3xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-border shadow-inner whitespace-pre-wrap leading-relaxed">
          {topic.codeSnippet}
        </pre>
      </div>

      {/* Key Takeaways */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Architectural Takeaways
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
          {topic.takeaways.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pitfall & Fix */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Common Production Mistake
          </div>
          <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
            {topic.commonPitfall.mistake}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Recommended Solution
          </div>
          <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
            {topic.commonPitfall.fix}
          </p>
        </div>
      </div>

      {/* Next Lesson Navigation */}
      {nextTopic && (
        <div className="pt-6 border-t border-border flex justify-end">
          <Link
            href={`/nodecosmos/concepts/${nextTopic.id}`}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
          >
            <span>Next: {nextTopic.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
