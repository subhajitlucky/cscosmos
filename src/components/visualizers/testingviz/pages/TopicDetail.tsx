'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Lightbulb,
  ListChecks,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { getTestingTopic, testingTopics } from '../data/topics';

export function TopicDetail({ topicId }: { topicId: string }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const topic = getTestingTopic(topicId) ?? testingTopics[0];

  const relatedTopics = topic.related
    .map((id) => getTestingTopic(id))
    .filter((related): related is NonNullable<typeof related> => Boolean(related));

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-6 py-12">
      <Link
        href="/fullstack/testing/learn"
        className="inline-flex items-center gap-2 font-mono text-xs text-[var(--test-muted)] transition-colors hover:text-[var(--test-primary)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the curriculum
      </Link>

      {/* Header */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded border border-[var(--test-primary-30)] bg-[var(--test-primary-10)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--test-primary)]">
              {topic.kicker}
            </span>
            <span className="font-mono text-xs capitalize text-[var(--test-muted)]">
              {topic.difficulty}
            </span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--test-text)] md:text-6xl">
            {topic.title}
          </h1>

          <p className="border-l-4 border-[var(--test-primary-30)] pl-6 text-base italic leading-relaxed text-[var(--test-muted)] md:text-lg">
            &ldquo;{topic.definition}&rdquo;
          </p>
        </div>

        <aside className="space-y-4 rounded-2xl border border-[var(--test-border-subtle)] bg-[var(--test-surface)] p-6 lg:col-span-4">
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--test-primary)]">
            <Sparkles className="h-3.5 w-3.5" /> At a glance
          </span>
          <div className="font-display text-lg font-bold text-[var(--test-text)]">
            {topic.group}
          </div>
          <p className="text-xs leading-relaxed text-[var(--test-muted)]">{topic.summary}</p>
          <div className="border-t border-[var(--test-border-subtle)] pt-4 font-mono text-[10px] text-[var(--test-muted)]">
            {topic.keyPoints.length} key ideas &bull; {topic.mistakes.length} common traps
          </div>
        </aside>
      </div>

      {/* Analogy */}
      <section className="space-y-4 rounded-2xl border border-[var(--test-border)] bg-[var(--test-surface)] p-8">
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--test-primary)]">
          <Repeat className="h-4 w-4" /> Think of it like this
        </div>
        <p className="font-display text-xl font-bold leading-relaxed text-[var(--test-text)] md:text-2xl">
          {topic.analogy}
        </p>
      </section>

      {/* Key points */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--test-primary)]">
            The mental model
          </span>
          <h2 className="font-display text-2xl font-bold text-[var(--test-text)]">
            What to remember
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {topic.keyPoints.map((point, index) => (
            <div
              key={point}
              className="flex items-start gap-3 rounded-xl border border-[var(--test-border-subtle)] bg-[var(--test-surface)] p-4"
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-[var(--test-primary-10)] font-mono text-[10px] font-bold text-[var(--test-primary)]">
                {index + 1}
              </span>
              <p className="text-xs leading-relaxed text-[var(--test-muted)]">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--test-primary)]">
          <Code2 className="h-4 w-4" /> In practice
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--test-border-subtle)] bg-[var(--test-surface)] font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--test-border-subtle)] bg-[var(--test-surface-2)] px-4 py-3">
            <span className="flex items-center gap-2 text-[var(--test-muted)]">
              <Code2 className="h-3.5 w-3.5 text-[var(--test-primary)]" />
              {topic.id}.test.ts
            </span>
            <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
              EXAMPLE
            </span>
          </div>
          <div className="overflow-x-auto p-6">
            <pre className="leading-relaxed text-[var(--test-text)]">
              <code>{topic.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Mistakes */}
      <section className="space-y-6 rounded-2xl border border-[var(--test-border-subtle)] bg-[var(--test-surface)] p-8">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--test-rose)]">
          <AlertTriangle className="h-4 w-4" /> Common traps
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {topic.mistakes.map((mistake) => (
            <div key={mistake} className="flex items-start gap-3 text-xs leading-relaxed text-[var(--test-muted)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--test-rose)]" />
              <span>{mistake}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Self check */}
      <section className="space-y-4 rounded-2xl border border-[var(--test-border)] bg-[var(--test-surface)] p-8">
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--test-amber)]">
          <ListChecks className="h-4 w-4" /> Check yourself
        </div>
        <p className="font-display text-xl font-bold text-[var(--test-text)]">
          {topic.check.question}
        </p>

        {showAnswer ? (
          <div className="flex items-start gap-3 rounded-xl border border-[var(--test-primary-30)] bg-[var(--test-primary-10)] p-4">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--test-primary)]" />
            <p className="text-xs leading-relaxed text-[var(--test-muted)]">{topic.check.answer}</p>
          </div>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--test-border)] bg-[var(--test-bg)] px-4 py-2 font-mono text-xs text-[var(--test-primary)] transition-colors hover:bg-[var(--test-primary-10)]"
          >
            <Lightbulb className="h-4 w-4" /> Reveal the answer
          </button>
        )}
      </section>

      {/* Related */}
      {relatedTopics.length > 0 && (
        <section className="space-y-5 border-t border-[var(--test-border-subtle)] pt-10">
          <h2 className="font-display text-2xl font-bold text-[var(--test-text)]">
            Related lessons
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {relatedTopics.map((related) => (
              <Link
                key={related.id}
                href={`/fullstack/testing/learn/${related.id}`}
                className="test-card group rounded-xl p-5"
              >
                <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-[var(--test-primary)]">
                  <span>{related.kicker}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[var(--test-muted)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--test-primary)]" />
                </div>
                <h3 className="font-display text-sm font-bold text-[var(--test-text)] transition-colors group-hover:text-[var(--test-primary)]">
                  {related.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
