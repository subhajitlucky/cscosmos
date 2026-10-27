'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Network, Search, X } from 'lucide-react';
import { microserviceTopicGroups, microserviceTopics, type MicroserviceTopic } from '../data/topics';

/**
 * The domain map is a path, not a shelf.
 *
 * A microservice architecture is read the way a request moves through it, so
 * the curriculum is a lane of stages: each stage is one hop, and each hop shows
 * the failure modes it names and the lever that keeps them from spreading. The
 * stage order is the engine's own (decomposition -> resilience -> transactions
 * -> observability -> mesh); the second ordering sorts the same stages by how
 * many failure modes each one names, which is the only "risk register" the data
 * actually supports. Stage numbers are always the path position, so the lane
 * stays a path even when the reading order is changed.
 *
 * Counts are derived from `data/topics.ts`; the stage labels are the topics'
 * own `kicker` prefixes. No failure mode, lever or claim is authored here.
 */

interface StageRow {
  id: string;
  name: string;
  description: string;
  pathIndex: number;
  phase: string;
  topics: MicroserviceTopic[];
  failureModes: number;
}

const STAGES: StageRow[] = microserviceTopicGroups.map((group, index) => ({
  id: group.id,
  name: group.name,
  description: group.description,
  pathIndex: index,
  phase: group.topics[0]?.kicker.split('/')[0].trim() ?? group.name,
  topics: group.topics,
  failureModes: group.topics.reduce((total, topic) => total + topic.mistakes.length, 0),
}));

const TOTAL_FAILURE_MODES = STAGES.reduce((total, stage) => total + stage.failureModes, 0);
const TOTAL_MOVES = microserviceTopics.reduce((total, topic) => total + topic.steps.length, 0);
const TOTAL_LEVERS = microserviceTopics.filter((topic) => topic.optimization.length > 0).length;

type Order = 'path' | 'failure';

const searchable = (topic: MicroserviceTopic) => [
  topic.title,
  topic.summary,
  topic.group,
  topic.kicker,
  topic.definition,
];

export function Learn() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<Order>('path');

  const needle = query.trim().toLowerCase();

  const stages = useMemo(() => {
    const matches = STAGES.flatMap((stage) => {
      const topics = stage.topics.filter((topic) =>
        needle.length === 0
          ? true
          : searchable(topic).some((field) => field.toLowerCase().includes(needle)),
      );
      if (topics.length === 0) return [];
      return [
        {
          ...stage,
          topics,
          failureModes: topics.reduce((total, topic) => total + topic.mistakes.length, 0),
        },
      ];
    });

    return order === 'failure'
      ? [...matches].sort(
          (a, b) => b.failureModes - a.failureModes || a.pathIndex - b.pathIndex,
        )
      : matches;
  }, [needle, order]);

  const shownTopics = stages.reduce((total, stage) => total + stage.topics.length, 0);
  const filtered = shownTopics !== microserviceTopics.length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* Header: the path is named before any card is drawn */}
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ms-primary-30)] bg-[var(--ms-primary-10)] text-[var(--ms-text)] text-xs font-mono">
          <Network className="w-3.5 h-3.5" /> Domain map &bull; {STAGES.length} stages &bull;{' '}
          {microserviceTopics.length} domains
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ms-text)] max-w-3xl">
          Five domains along{' '}
          <span className="text-[var(--ms-text)] ms-glow">one request path</span>
        </h1>

        <p className="text-sm md:text-base text-[var(--ms-muted)] max-w-3xl leading-relaxed">
          The map is ordered the way a request crosses the architecture: draw the boundary, contain
          the failure, settle the transaction, observe the outcome, secure the transport. Each stop
          below is one hop of that path, carrying the failure modes it names and the lever that
          keeps them from spreading into the next hop.
        </p>

        {/* The path, stated as the stage order the lane is drawn in */}
        <div className="rounded-xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] px-4 py-3 space-y-2">
          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-muted)]">
            Request path &bull; {TOTAL_FAILURE_MODES} named failure modes &bull; {TOTAL_MOVES}{' '}
            moves &bull; {TOTAL_LEVERS} containment levers
          </span>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px]">
            {STAGES.map((stage, index) => (
              <li key={stage.id} className="flex items-center gap-2">
                {index > 0 && (
                  <ArrowRight className="w-3 h-3 text-[var(--ms-muted)]" aria-hidden="true" />
                )}
                <span className="text-[var(--ms-muted)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[var(--ms-text)]">{stage.phase}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Controls: find a hop, or read the lane as a risk register */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ms-muted)]" />
            <input
              type="text"
              aria-label="Filter the domain map"
              placeholder="Filter the path — boundaries, bulkhead, saga, traceparent, envoy…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] text-xs font-mono text-[var(--ms-text)] placeholder:text-[var(--ms-muted)] focus:outline-none focus:border-[var(--ms-primary)]"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear the filter"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ms-muted)] hover:text-[var(--ms-text)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-[var(--ms-muted)]">Read the lane as</span>
            {(
              [
                ['path', 'Request path'],
                ['failure', 'Failure-first'],
              ] as [Order, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setOrder(value)}
                aria-pressed={order === value}
                className={`px-2.5 py-1.5 rounded-md border transition-colors ${
                  order === value
                    ? 'border-[var(--ms-primary-30)] bg-[var(--ms-primary-10)] text-[var(--ms-text)] font-bold'
                    : 'border-[var(--ms-border-subtle)] text-[var(--ms-muted)] hover:text-[var(--ms-text)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="font-mono text-[10px] text-[var(--ms-muted)] leading-relaxed">
          {order === 'failure'
            ? 'Ordered by the number of failure modes each stage names — stage numbers still mark the position on the request path.'
            : 'Stage numbers mark the position on the request path; the failure-first reading keeps them and re-orders the lane only.'}
          {filtered && ` ${shownTopics} of ${microserviceTopics.length} domains match.`}
        </p>
      </header>

      {/* The lane: one stage per stop, one hop per topic in the stage */}
      <ol className="space-y-0">
        {stages.map((stage, displayIndex) => (
          <li key={stage.id} className="relative pl-7 md:pl-9 pb-8 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute left-0 top-3 w-2.5 h-2.5 rotate-45 bg-[var(--ms-primary)]"
            />
            {displayIndex < stages.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-1 top-6 bottom-0 border-l border-dashed border-[var(--ms-border)]"
              />
            )}

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px]">
                <span className="px-1.5 py-0.5 rounded border border-[var(--ms-primary-30)] bg-[var(--ms-primary-10)] font-bold text-[var(--ms-text)]">
                  STAGE {String(stage.pathIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-[var(--ms-muted)] uppercase tracking-[0.16em]">
                  {stage.phase}
                </span>
                <span className="text-[var(--ms-muted)]">{stage.name}</span>
                <span className="text-[var(--ms-muted)]">
                  &bull; {stage.failureModes} failure mode{stage.failureModes === 1 ? '' : 's'}
                </span>
              </div>

              <p className="text-[11px] text-[var(--ms-muted)] max-w-3xl leading-relaxed">
                {stage.description}
              </p>

              {stage.topics.map((topic) => (
                <article
                  key={topic.id}
                  className="rounded-xl border border-[var(--ms-border-subtle)] border-l-2 border-l-[var(--ms-primary)] bg-[var(--ms-surface)] p-5 md:p-6 space-y-4 transition-colors hover:border-[var(--ms-border)]"
                >
                  <Link href={`/microservicesviz/learn/${topic.id}`} className="block group space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                      <span className="text-[var(--ms-muted)]">{topic.kicker}</span>
                      <span className="text-[var(--ms-muted)] uppercase tracking-[0.14em]">
                        {topic.difficulty}
                      </span>
                    </div>
                    <h2 className="font-display text-xl md:text-2xl font-bold leading-snug text-[var(--ms-text)] group-hover:underline">
                      {topic.title}
                    </h2>
                    <p className="text-xs text-[var(--ms-muted)] leading-relaxed">{topic.summary}</p>
                  </Link>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-[var(--ms-rose-30)] bg-[var(--ms-bg)] p-4 space-y-2">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-text)]">
                        Named failure modes
                      </span>
                      <ul className="space-y-1.5">
                        {topic.mistakes.map((mistake, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-[11px] text-[var(--ms-muted)] leading-relaxed"
                          >
                            <span className="shrink-0 font-mono text-[9px] text-[var(--ms-text)]">
                              FM{index + 1}
                            </span>
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-[var(--ms-border-subtle)] bg-[var(--ms-bg)] p-4 space-y-2">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-text)]">
                        Containment lever
                      </span>
                      <p className="text-[11px] text-[var(--ms-muted)] leading-relaxed">
                        {topic.optimization}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 font-mono text-[10px] text-[var(--ms-muted)]">
                        <span>{topic.steps.length} moves</span>
                        <span>{topic.related.length} adjacent domains</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/microservicesviz/learn/${topic.id}`}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--ms-text)] hover:underline"
                  >
                    Open the dossier <ArrowRight className="w-3 h-3" />
                  </Link>
                </article>
              ))}
            </div>
          </li>
        ))}
      </ol>

      {stages.length === 0 && (
        <div className="p-10 rounded-xl border border-dashed border-[var(--ms-border-subtle)] text-center space-y-3">
          <p className="font-mono text-xs text-[var(--ms-muted)]">
            No hop on the path matches &ldquo;{query}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setOrder('path');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--ms-border)] bg-[var(--ms-surface)] font-mono text-[11px] text-[var(--ms-text)] hover:border-[var(--ms-primary)] transition-colors"
          >
            Reset the path
          </button>
        </div>
      )}
    </div>
  );
}
