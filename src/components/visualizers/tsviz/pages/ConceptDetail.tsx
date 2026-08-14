'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Info, Play, Sparkles, Terminal, XCircle } from 'lucide-react';
import { TS_TOPICS } from '../data/topics';

export default function ConceptDetail({ topicId }: { topicId: string }) {
  const topic = TS_TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    notFound();
  }

  const [code, setCode] = useState(topic.codeSnippet);
  const nextTopic = TS_TOPICS.find((t) => t.id === topic.nextTopicId);

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto px-4 sm:px-6 pt-10">
      {/* Header & Back Link */}
      <div>
        <Link
          href="/tsviz/concepts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Concepts Catalog
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            {topic.category}
          </span>
          <span className="text-xs text-muted-foreground font-mono">{topic.difficulty}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          {topic.title}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {topic.summary}
        </p>
      </div>

      {/* Mental Model Callout Card */}
      <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-3xl p-6 sm:p-8 border border-blue-500/20 shadow-sm space-y-2">
        <h3 className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
          <Info className="w-4 h-4" /> Intuitive Mental Model
        </h3>
        <p className="text-foreground italic text-base leading-relaxed font-medium">
          &ldquo;{topic.mentalModel}&rdquo;
        </p>
      </div>

      {/* Code Snippet Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-500" /> Runnable TypeScript Code Example
          </h3>
          <span className="text-[11px] font-mono text-muted-foreground">TypeScript 5.x</span>
        </div>

        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner">
          <pre className="text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {code}
          </pre>
        </div>
      </div>

      {/* Common Beginner Pitfall Card */}
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold uppercase text-xs tracking-widest">
          <AlertTriangle className="w-4 h-4 text-rose-500" /> Common Beginner Pitfall &amp; Anti-Pattern
        </div>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2 text-xs sm:text-sm text-rose-700 dark:text-rose-300 font-medium">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span><strong>Mistake:</strong> {topic.commonPitfall.mistake}</span>
          </div>
          <div className="flex items-start gap-2 text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-medium pl-6">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span><strong>Fix:</strong> {topic.commonPitfall.fix}</span>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-foreground font-bold uppercase text-xs tracking-widest">
          <AlertCircle className="w-4 h-4 text-blue-500" /> Architectural Rules &amp; Key Takeaways
        </div>
        <ul className="grid sm:grid-cols-3 gap-4 pt-2">
          {topic.takeaways.map((item, idx) => (
            <li key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed flex gap-2.5">
              <span className="text-blue-500 font-bold font-mono select-none">0{idx + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Concept Footer Nav */}
      {nextTopic && (
        <div className="pt-6 border-t border-border flex justify-end">
          <Link
            href={`/tsviz/concepts/${nextTopic.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
          >
            <span>Next: {nextTopic.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
