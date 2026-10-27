'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Search, X } from 'lucide-react';
import { getLldTopic, lldTopicGroups, lldTopics } from '../data/topics';

/**
 * The concept map is a ledger, not a card wall.
 *
 * LLD is the discipline of deciding which object owns which responsibility,
 * so the curriculum is presented the way a design review is: five tracks read
 * as rungs (principle -> construction -> composition -> behaviour -> whole
 * system), and every concept is a row with a responsibility, a count of the
 * refactoring moves that carry it, the smells it attracts, and — drawn from
 * the topics' own `related` graph — the concepts it collaborates with.
 *
 * Nothing here is new technical copy. Every count is derived from
 * `data/topics.ts`; the ladder labels are the topics' own `kicker` prefixes.
 */

const LEDGER = lldTopicGroups.map((group) => ({
  id: group.id,
  name: group.name,
  description: group.description,
  badgeColor: group.badgeColor,
  count: group.topics.length,
  rung: group.topics[0]?.kicker.split('/')[0].trim() ?? group.name,
}));

const TOTAL_MOVES = lldTopics.reduce((total, topic) => total + topic.steps.length, 0);
const TOTAL_SMELLS = lldTopics.reduce((total, topic) => total + topic.mistakes.length, 0);
const TOTAL_COLLABORATIONS = lldTopics.reduce((total, topic) => total + topic.related.length, 0);

const TOTALS: { label: string; value: number }[] = [
  { label: 'concepts', value: lldTopics.length },
  { label: 'refactoring moves', value: TOTAL_MOVES },
  { label: 'named smells', value: TOTAL_SMELLS },
  { label: 'collaborator edges', value: TOTAL_COLLABORATIONS },
];

const SEARCH_FIELDS = (topic: (typeof lldTopics)[number]) => [
  topic.title,
  topic.summary,
  topic.group,
  topic.kicker,
  topic.definition,
];

export function Learn() {
  const [query, setQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  const needle = query.trim().toLowerCase();

  const filteredTracks = useMemo(() => {
    return LEDGER.map((track) => {
      if (selectedTrack !== 'all' && track.id !== selectedTrack) return null;
      const topics = lldTopicGroups
        .find((group) => group.id === track.id)!
        .topics.filter((topic) =>
          needle.length === 0
            ? true
            : SEARCH_FIELDS(topic).some((field) => field.toLowerCase().includes(needle)),
        );
      return topics.length === 0 ? null : { ...track, topics };
    }).filter(Boolean) as (typeof LEDGER[number] & { topics: typeof lldTopics })[];
  }, [needle, selectedTrack]);

  const shown = filteredTracks.reduce((total, track) => total + track.topics.length, 0);
  const filtered = shown !== lldTopics.length;

  const resetFilters = () => {
    setQuery('');
    setSelectedTrack('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header: the ladder, stated as an order rather than a catalogue */}
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--lld-primary-30)] bg-[var(--lld-primary-10)] text-[var(--lld-primary-text)] text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" /> Concept map &bull; {LEDGER.length} tracks &bull;{' '}
          {lldTopics.length} concepts
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--lld-text)] max-w-4xl">
          Design vocabulary{' '}
          <span className="text-[var(--lld-primary-text)] lld-glow">ordered by responsibility</span>
        </h1>

        <p className="text-sm md:text-base text-[var(--lld-muted)] max-w-3xl leading-relaxed">
          The map runs in the order the design decisions are actually taken: give the class one
          reason to change, then decide who constructs it, then what it composes with, then how it
          behaves — and only after that rebuild a whole system under interview constraints. Each
          track below is a rung, and each row is one concept: its responsibility, the moves that
          carry it, the smells it attracts, and the concepts it collaborates with.
        </p>

        {/* The ladder itself — rung labels come from the topics' own kickers */}
        <div className="rounded-xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] px-4 py-3 space-y-2">
          <span className="block text-[9px] font-mono uppercase tracking-[0.18em] text-[var(--lld-muted)]">
            Ladder &bull; the order the ledger is read in
          </span>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {LEDGER.map((track, index) => (
              <li key={track.id} className="flex items-center gap-2">
                {index > 0 && (
                  <ArrowRight className="w-3 h-3 text-[var(--lld-muted)]" aria-hidden="true" />
                )}
                <span className="font-mono text-[11px] text-[var(--lld-text)]">{track.rung}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* What the ledger adds up to — every figure derived from the data */}
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOTALS.map((total) => (
            <div
              key={total.label}
              className="px-4 py-3 rounded-lg border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)]"
            >
              <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                {total.label}
              </dt>
              <dd className="font-display text-2xl font-extrabold text-[var(--lld-primary-text)] leading-tight">
                {total.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lld-muted)]" />
          <input
            type="text"
            aria-label="Filter the ledger"
            placeholder="Filter the ledger — srp, factory, decorator, observer, parking lot…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] text-xs font-mono text-[var(--lld-text)] placeholder:text-[var(--lld-muted)] focus:outline-none focus:border-[var(--lld-primary)]"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear the filter"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lld-muted)] hover:text-[var(--lld-primary-text)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Track rail: the ledger's table of contents, by responsibility */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
          <div className="space-y-1.5">
            <span className="block px-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
              Tracks
            </span>

            <button
              type="button"
              onClick={() => setSelectedTrack('all')}
              aria-pressed={selectedTrack === 'all'}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border font-mono text-[11px] transition-colors ${
                selectedTrack === 'all'
                  ? 'border-[var(--lld-primary-30)] bg-[var(--lld-primary-10)] text-[var(--lld-primary-text)] font-bold'
                  : 'border-transparent text-[var(--lld-muted)] hover:border-[var(--lld-border-subtle)] hover:text-[var(--lld-text)]'
              }`}
            >
              <span>Full ledger</span>
              <span>{lldTopics.length}</span>
            </button>

            {LEDGER.map((track, index) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedTrack(track.id)}
                aria-pressed={selectedTrack === track.id}
                className={`w-full flex items-start justify-between gap-2 px-3 py-2 rounded-md border text-left font-mono text-[11px] transition-colors ${
                  selectedTrack === track.id
                    ? 'border-[var(--lld-primary-30)] bg-[var(--lld-primary-10)] text-[var(--lld-primary-text)]'
                    : 'border-transparent text-[var(--lld-muted)] hover:border-[var(--lld-border-subtle)] hover:text-[var(--lld-text)]'
                }`}
              >
                <span className="flex items-start gap-2 min-w-0">
                  <span className="font-bold">{String(index + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 leading-snug">{track.name}</span>
                </span>
                <span className="shrink-0 opacity-70">{track.count}</span>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface-2)] p-4 space-y-2">
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-primary-text)]">
              How to read a row
            </span>
            <p className="text-[11px] text-[var(--lld-muted)] leading-relaxed">
              Left: the concept and the track it belongs to. Middle: the responsibility it owns.
              Right: how many moves carry it, how many smells it attracts, and which concepts it
              collaborates with. Open a row for the contract, the code and the trade it makes.
            </p>
          </div>
        </aside>

        {/* The ledger rows */}
        <div className="lg:col-span-9 space-y-10">
          {filtered && (
            <p className="font-mono text-[10px] text-[var(--lld-muted)]">
              {shown} of {lldTopics.length} concepts
              {selectedTrack !== 'all' && ' in this track'}
            </p>
          )}

          {filteredTracks.map((track) => {
            const rung = LEDGER.findIndex((entry) => entry.id === track.id) + 1;

            return (
              <section key={track.id} className="space-y-4" aria-labelledby={`track-${track.id}`}>
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--lld-border-subtle)] pb-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-[var(--lld-border)] text-[var(--lld-primary-text)]">
                        TRACK {String(rung).padStart(2, '0')}
                      </span>
                      <h2
                        id={`track-${track.id}`}
                        className="font-display text-xl font-bold text-[var(--lld-text)]"
                      >
                        {track.name}
                      </h2>
                    </div>
                    <p className="text-[11px] text-[var(--lld-muted)] max-w-2xl leading-relaxed">
                      {track.description}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${track.badgeColor}`}
                  >
                    {track.count} concept{track.count === 1 ? '' : 's'}
                  </span>
                </div>

                <ol className="space-y-3">
                  {track.topics.map((topic) => {
                    const collaborators = topic.related.flatMap((id) => {
                      const collaborator = getLldTopic(id);
                      return collaborator ? [collaborator] : [];
                    });

                    return (
                      <li key={topic.id}>
                        <Link
                          href={`/lldcosmos/learn/${topic.id}`}
                          className="lld-card group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 p-5 rounded-xl"
                        >
                          <div className="md:col-span-5 space-y-2">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px]">
                              <span className="font-bold text-[var(--lld-primary-text)]">
                                {topic.kicker}
                              </span>
                              <span className="text-[var(--lld-muted)]">
                                / {topic.difficulty}
                              </span>
                            </div>

                            <h3 className="font-display font-bold text-base leading-snug text-[var(--lld-text)] group-hover:text-[var(--lld-primary-text)] transition-colors">
                              {topic.title}
                            </h3>

                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--lld-muted)] group-hover:text-[var(--lld-primary-text)] transition-colors">
                              Open the record <ArrowUpRight className="w-3 h-3" />
                            </span>
                          </div>

                          <div className="md:col-span-4 space-y-1.5 md:border-l md:border-[var(--lld-border-subtle)] md:pl-5">
                            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                              Responsibility
                            </span>
                            <p className="text-xs text-[var(--lld-muted)] leading-relaxed">
                              {topic.summary}
                            </p>
                          </div>

                          <div className="md:col-span-3 space-y-2 md:border-l md:border-[var(--lld-border-subtle)] md:pl-5">
                            <div className="flex items-center gap-3 font-mono text-[10px]">
                              <span className="text-[var(--lld-primary-text)]">
                                {topic.steps.length} moves
                              </span>
                              <span className="text-[var(--lld-muted)]">
                                {topic.mistakes.length} smells
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                                Collaborators
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {collaborators.map((collaborator) => (
                                  <span
                                    key={collaborator.id}
                                    className="px-1.5 py-0.5 rounded border border-[var(--lld-border-subtle)] bg-[var(--lld-bg)] font-mono text-[9px] text-[var(--lld-muted)]"
                                  >
                                    {collaborator.title.split(':')[0]}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}

          {filteredTracks.length === 0 && (
            <div className="p-10 rounded-xl border border-dashed border-[var(--lld-border-subtle)] text-center space-y-3">
              <p className="font-mono text-xs text-[var(--lld-muted)]">
                No concept in the ledger matches &ldquo;{query}&rdquo;.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--lld-border)] bg-[var(--lld-surface)] font-mono text-[11px] text-[var(--lld-text)] hover:border-[var(--lld-primary)] hover:text-[var(--lld-primary-text)] transition-colors"
              >
                Reset the ledger
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
