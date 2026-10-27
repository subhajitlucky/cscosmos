'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Repeat,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getLldTopic, lldTopicGroups, lldTopics } from '../data/topics';

/**
 * One concept, held to its own form: a design record.
 *
 * The page is laid out as a design review of a single responsibility unit —
 * the contract it is held to (definition), a CRC card (class, responsibility,
 * collaborators), the intuition that carries it, the ordered refactoring
 * moves that apply it, the interface in code, and the trade it makes: what the
 * design buys against what it costs when it is misapplied.
 *
 * Every sentence and every count below comes from `data/topics.ts`; the page
 * only decides where each field sits and which design vocabulary frames it.
 */
export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = getLldTopic(topicId) || lldTopics[0];

  const trackIndex = lldTopicGroups.findIndex((group) =>
    group.topics.some((entry) => entry.id === topic.id),
  );
  const track = trackIndex >= 0 ? lldTopicGroups[trackIndex] : undefined;

  const collaborators = topic.related.flatMap((id) => {
    const collaborator = getLldTopic(id);
    return collaborator ? [collaborator] : [];
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-14">
      <Link
        href="/lldcosmos/learn"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--lld-muted)] hover:text-[var(--lld-primary-text)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to the concept map
      </Link>

      {/* ── Record header: identity on the left, CRC card on the right ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <span className="px-2 py-1 rounded border border-[var(--lld-primary-30)] bg-[var(--lld-primary-10)] font-bold text-[var(--lld-primary-text)]">
              {topic.kicker}
            </span>
            <span className="px-2 py-1 rounded border border-[var(--lld-border-subtle)] text-[var(--lld-muted)] uppercase tracking-[0.14em]">
              {topic.difficulty}
            </span>
            {track && (
              <span className="px-2 py-1 rounded border border-[var(--lld-border-subtle)] text-[var(--lld-muted)]">
                TRACK {String(trackIndex + 1).padStart(2, '0')} of{' '}
                {String(lldTopicGroups.length).padStart(2, '0')}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--lld-text)]">
            {topic.title}
          </h1>

          <div className="border-l-2 border-[var(--lld-primary-30)] pl-5 space-y-2">
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-primary-text)]">
              The contract
            </span>
            <p className="text-sm md:text-base text-[var(--lld-text)] leading-relaxed">
              {topic.definition}
            </p>
          </div>
        </div>

        {/* CRC card — the studio's own review instrument, applied to a topic */}
        <div className="lg:col-span-4 rounded-2xl border border-[var(--lld-border)] bg-[var(--lld-surface)] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[var(--lld-border-subtle)] bg-[var(--lld-surface-2)] flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--lld-muted)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--lld-primary-text)]" />
            Class &bull; Responsibility &bull; Collaborator
          </div>

          <dl className="divide-y divide-[var(--lld-border-subtle)] font-mono text-[11px]">
            <div className="px-4 py-3 space-y-1">
              <dt className="text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                Class
              </dt>
              <dd className="text-[var(--lld-text)] break-all">{topic.id}</dd>
            </div>

            <div className="px-4 py-3 space-y-1">
              <dt className="text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                Responsibility
              </dt>
              <dd className="font-sans text-xs text-[var(--lld-muted)] leading-relaxed">
                {topic.summary}
              </dd>
            </div>

            <div className="px-4 py-3 space-y-1.5">
              <dt className="text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                Collaborators
              </dt>
              <dd className="flex flex-wrap gap-1">
                {collaborators.map((collaborator) => (
                  <span
                    key={collaborator.id}
                    className="px-1.5 py-0.5 rounded border border-[var(--lld-border-subtle)] bg-[var(--lld-bg)] text-[10px] text-[var(--lld-muted)]"
                  >
                    {collaborator.title.split(':')[0]}
                  </span>
                ))}
              </dd>
            </div>

            <div className="px-4 py-3 space-y-1">
              <dt className="text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                Changes when
              </dt>
              <dd className="font-sans text-xs text-[var(--lld-muted)] leading-relaxed">
                the explanation of this one concept improves — not when a sibling concept moves.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ── The intuition that keeps the rule concrete ─────────────────── */}
      <section className="rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] p-8 space-y-4">
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-primary-text)]">
          <Repeat className="w-3.5 h-3.5" /> Intuition before interface
        </div>
        <p className="font-display text-xl md:text-2xl font-bold text-[var(--lld-text)] leading-snug max-w-4xl">
          {topic.analogy}
        </p>
        <p className="text-[11px] text-[var(--lld-muted)] max-w-3xl leading-relaxed">
          Hold the picture while you read the contract above and the moves below; the analogy is
          what makes the abstraction checkable when the class diagram gets large.
        </p>
      </section>

      {/* ── Refactoring procedure: the ordered moves ───────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--lld-border-subtle)] pb-3">
          <div className="space-y-1">
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-primary-text)]">
              Refactoring procedure
            </span>
            <h2 className="font-display text-2xl font-bold text-[var(--lld-text)]">
              Move by move, in this order
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[var(--lld-muted)]">
            {topic.steps.length} ordered moves
          </span>
        </div>

        <ol className="space-y-0">
          {topic.steps.map((step, index) => (
            <li key={index} className="relative pl-12 pb-5 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 w-8 h-8 rounded-full border border-[var(--lld-border)] bg-[var(--lld-surface)] flex items-center justify-center font-mono text-[10px] font-bold text-[var(--lld-primary-text)]"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              {index < topic.steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-8 bottom-0 w-px bg-[var(--lld-border-subtle)]"
                />
              )}
              <div className="pt-1.5 space-y-1">
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                  Move {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-xs text-[var(--lld-text)] leading-relaxed">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The interface, in code ─────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-primary-text)]">
            The interface
          </span>
          <h2 className="font-display text-2xl font-bold text-[var(--lld-text)]">
            What the abstraction looks like in code
          </h2>
        </div>

        <div className="rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[var(--lld-border-subtle)] bg-[var(--lld-surface-2)] flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] text-[var(--lld-muted)] flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[var(--lld-primary-text)]" />
              {topic.id}.ts
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--lld-muted)]">
              {topic.group}
            </span>
          </div>

          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-xs text-[var(--lld-text)] leading-relaxed">
              <code>{topic.codeSnippet}</code>
            </pre>
          </div>

          <div className="px-4 py-3 border-t border-[var(--lld-border-subtle)] bg-[var(--lld-surface-2)] flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--lld-primary-text)]" />
            <span className="font-mono text-[10px] text-[var(--lld-muted)] leading-relaxed">
              {topic.outputDescription}
            </span>
          </div>
        </div>
      </section>

      {/* ── The trade the design makes ─────────────────────────────────── */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-primary-text)]">
            The trade
          </span>
          <h2 className="font-display text-2xl font-bold text-[var(--lld-text)]">
            What it buys, and what it costs when it is misapplied
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] p-6 space-y-3">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-emerald)]">
              <Sparkles className="w-3.5 h-3.5" /> What it buys
            </div>
            <p className="text-xs text-[var(--lld-text)] leading-relaxed">{topic.optimization}</p>
          </div>

          <div className="rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] p-6 space-y-3">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-rose)]">
              <AlertTriangle className="w-3.5 h-3.5" /> What it costs when misapplied
            </div>
            <ul className="space-y-2.5">
              {topic.mistakes.map((mistake, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 w-1 h-1 rounded-full bg-[var(--lld-rose)] shrink-0"
                  />
                  <span className="text-xs text-[var(--lld-muted)] leading-relaxed">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Collaborator set: the topic's own graph ────────────────────── */}
      <section className="space-y-5 border-t border-[var(--lld-border-subtle)] pt-10">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-primary-text)]">
              Collaborator set
            </span>
            <h2 className="font-display text-2xl font-bold text-[var(--lld-text)]">
              Concepts this one is coupled to
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[var(--lld-muted)]">
            {collaborators.length} collaborators
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {collaborators.map((collaborator) => (
            <Link
              key={collaborator.id}
              href={`/lldcosmos/learn/${collaborator.id}`}
              className="lld-card group rounded-xl p-5 space-y-2"
            >
              <div className="flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--lld-muted)]">
                <span>{collaborator.kicker}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-[var(--lld-primary-text)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="font-display font-bold text-base text-[var(--lld-text)] group-hover:text-[var(--lld-primary-text)] transition-colors">
                {collaborator.title}
              </h3>
              <p className="font-mono text-[10px] text-[var(--lld-muted)]">{collaborator.group}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
