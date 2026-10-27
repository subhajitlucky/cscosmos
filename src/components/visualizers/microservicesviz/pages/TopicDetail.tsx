'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, ArrowRight, Code2, Gauge, Radar, ShieldAlert } from 'lucide-react';
import { getMicroserviceTopic, microserviceTopicGroups, microserviceTopics } from '../data/topics';

/**
 * One mechanism, written up the way an operator receives it: a dossier.
 *
 * Failure-first order, because that is the order a distributed system teaches
 * its lessons: the rule and the intuition it rests on, the failure modes the
 * mechanism names, the hop sequence it inserts into the request path, the
 * lever that contains it, the code that implements it, and the adjacent
 * domains it can drag down with it.
 *
 * Everything below is a field of `data/topics.ts` — the page only chooses the
 * order and the operational vocabulary. No failure rate, latency or blast
 * radius is invented; the counters are counts of what the record already says.
 */
export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = getMicroserviceTopic(topicId) || microserviceTopics[0];

  const stageIndex = microserviceTopicGroups.findIndex((group) =>
    group.topics.some((entry) => entry.id === topic.id),
  );
  const stage = stageIndex >= 0 ? microserviceTopicGroups[stageIndex] : undefined;

  const adjacent = topic.related.flatMap((id) => {
    const neighbour = getMicroserviceTopic(id);
    return neighbour ? [neighbour] : [];
  });

  const counters: { label: string; value: number }[] = [
    { label: 'hop steps', value: topic.steps.length },
    { label: 'failure modes', value: topic.mistakes.length },
    { label: 'adjacent domains', value: adjacent.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <Link
        href="/microservicesviz/learn"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ms-muted)] hover:text-[var(--ms-text)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to the domain map
      </Link>

      {/* ── Dossier header ─────────────────────────────────────────────── */}
      <header className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-1 rounded border border-[var(--ms-primary-30)] bg-[var(--ms-primary-10)] font-bold text-[var(--ms-text)]">
            DOMAIN DOSSIER
          </span>
          <span className="px-2 py-1 rounded border border-[var(--ms-border-subtle)] text-[var(--ms-muted)]">
            {topic.kicker}
          </span>
          <span className="px-2 py-1 rounded border border-[var(--ms-border-subtle)] text-[var(--ms-muted)] uppercase tracking-[0.14em]">
            {topic.difficulty}
          </span>
          {stage && (
            <span className="px-2 py-1 rounded border border-[var(--ms-border-subtle)] text-[var(--ms-muted)]">
              STAGE {String(stageIndex + 1).padStart(2, '0')} of{' '}
              {String(microserviceTopicGroups.length).padStart(2, '0')}
            </span>
          )}
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--ms-text)] max-w-4xl">
          {topic.title}
        </h1>

        <dl className="grid grid-cols-3 divide-x divide-[var(--ms-border-subtle)] rounded-xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] overflow-hidden">
          {counters.map((counter) => (
            <div key={counter.label} className="px-4 py-3">
              <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-muted)]">
                {counter.label}
              </dt>
              <dd className="font-display text-2xl font-extrabold text-[var(--ms-text)] leading-tight">
                {counter.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ── The rule, with the intuition it rests on beside it ─────────── */}
      <section className="rounded-2xl border border-[var(--ms-border)] bg-[var(--ms-surface)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 md:p-8 space-y-3">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-text)]">
              <ShieldAlert className="w-3.5 h-3.5" /> The rule
            </div>
            <p className="text-sm md:text-base text-[var(--ms-text)] leading-relaxed">
              {topic.definition}
            </p>
          </div>

          <div className="lg:col-span-5 p-6 md:p-8 space-y-3 border-t lg:border-t-0 lg:border-l border-[var(--ms-border-subtle)] bg-[var(--ms-bg)]">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-muted)]">
              <Radar className="w-3.5 h-3.5" /> Field note
            </div>
            <p className="text-xs md:text-sm text-[var(--ms-muted)] leading-relaxed">
              {topic.analogy}
            </p>
          </div>
        </div>
      </section>

      {/* ── What goes wrong: named before anything is contained ────────── */}
      <section className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em]">
            <span className="text-[var(--ms-text)]">Failure modes</span>
            <span aria-hidden="true" className="h-px flex-1 bg-[var(--ms-border-subtle)]" />
            <span className="text-[var(--ms-muted)] normal-case tracking-normal">
              {topic.mistakes.length} named
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--ms-text)]">
            What this mechanism has to survive
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-3">
          {topic.mistakes.map((mistake, index) => (
            <li
              key={index}
              className="flex items-start gap-4 rounded-lg border border-[var(--ms-border-subtle)] border-l-2 border-l-[var(--ms-rose-30)] bg-[var(--ms-surface)] p-4"
            >
              <span className="shrink-0 font-mono text-[10px] font-bold text-[var(--ms-text)] pt-0.5">
                FM{String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-xs text-[var(--ms-muted)] leading-relaxed">{mistake}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── The hops this mechanism adds to the path ───────────────────── */}
      <section className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em]">
            <span className="text-[var(--ms-text)]">Hop sequence</span>
            <span aria-hidden="true" className="h-px flex-1 bg-[var(--ms-border-subtle)]" />
            <span className="text-[var(--ms-muted)] normal-case tracking-normal">
              {topic.steps.length} hops
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--ms-text)]">
            The path through the mechanism, hop by hop
          </h2>
        </div>

        <ol className="space-y-0">
          {topic.steps.map((step, index) => (
            <li key={index} className="relative pl-8 pb-4 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 w-2 h-2 rotate-45 bg-[var(--ms-primary)]"
              />
              {index < topic.steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[3px] top-4 bottom-0 border-l border-dashed border-[var(--ms-border)]"
                />
              )}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ms-text)]">
                  HOP {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-xs text-[var(--ms-muted)] leading-relaxed">{step}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The lever that contains it ─────────────────────────────────── */}
      <section className="rounded-2xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] p-6 md:p-8 space-y-3">
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-text)]">
          <Gauge className="w-3.5 h-3.5" /> Containment lever
        </div>
        <p className="text-sm text-[var(--ms-text)] leading-relaxed max-w-4xl">
          {topic.optimization}
        </p>
        <p className="font-mono text-[10px] text-[var(--ms-muted)]">
          {stage ? stage.name : topic.group} &bull; {topic.difficulty}
        </p>
      </section>

      {/* ── The implementation, with the guarantee it buys beside it ───── */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-text)]">
            Implementation
          </span>
          <h2 className="font-display text-2xl font-bold text-[var(--ms-text)]">
            The same mechanism, as it is written
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between gap-3 font-mono text-[10px] pb-2">
              <span className="text-[var(--ms-text)] flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5" />
                {topic.id}.ts
              </span>
              <span className="text-[var(--ms-muted)]">{topic.group}</span>
            </div>

            <div className="rounded-xl border border-[var(--ms-border-subtle)] bg-[var(--ms-bg)] p-5 overflow-x-auto">
              <pre className="font-mono text-xs text-[var(--ms-text)] leading-relaxed">
                <code>{topic.codeSnippet}</code>
              </pre>
            </div>
          </div>

          <aside className="lg:col-span-4 rounded-xl border border-[var(--ms-border-subtle)] border-l-2 border-l-[var(--ms-rose-30)] bg-[var(--ms-surface)] p-5 space-y-2">
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-text)]">
              <AlertTriangle className="w-3.5 h-3.5" /> What it guarantees
            </span>
            <p className="text-xs text-[var(--ms-muted)] leading-relaxed">
              {topic.outputDescription}
            </p>
            <p className="font-mono text-[10px] text-[var(--ms-muted)] pt-1">
              {topic.mistakes.length} failure modes above are what this guarantee is bought against.
            </p>
          </aside>
        </div>
      </section>

      {/* ── Adjacent hops: what this domain shares an edge with ────────── */}
      <section className="space-y-4 border-t border-[var(--ms-border-subtle)] pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-text)]">
              Adjacent hops
            </span>
            <h2 className="font-display text-2xl font-bold text-[var(--ms-text)]">
              Domains that share an edge with this one
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[var(--ms-muted)]">
            {adjacent.length} adjacent
          </span>
        </div>

        <ul className="divide-y divide-[var(--ms-border-subtle)] border-y border-[var(--ms-border-subtle)]">
          {adjacent.map((neighbour) => (
            <li key={neighbour.id}>
              <Link
                href={`/microservicesviz/learn/${neighbour.id}`}
                className="group flex flex-wrap items-center gap-x-4 gap-y-1 py-3"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--ms-muted)] w-28 shrink-0">
                  {neighbour.kicker}
                </span>
                <span className="font-display font-bold text-sm text-[var(--ms-text)] group-hover:underline">
                  {neighbour.title}
                </span>
                <span className="ml-auto flex items-center gap-2 font-mono text-[10px] text-[var(--ms-muted)]">
                  {neighbour.difficulty}
                  <ArrowRight className="w-3 h-3 group-hover:text-[var(--ms-text)] transition-colors" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
