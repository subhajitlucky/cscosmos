'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Search } from 'lucide-react';
import { testingTopicGroups, testingTopics } from '../data/topics';

const trackAccent: Record<string, string> = {
  foundations: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  'integration-e2e': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  practice: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
};

export function Learn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return testingTopicGroups
      .map((group) => {
        if (selectedGroup !== 'all' && group.id !== selectedGroup) return null;

        const topics = group.topics.filter(
          (topic) =>
            topic.title.toLowerCase().includes(query) ||
            topic.summary.toLowerCase().includes(query) ||
            topic.group.toLowerCase().includes(query),
        );

        if (topics.length === 0) return null;
        return { ...group, topics };
      })
      .filter(Boolean) as typeof testingTopicGroups;
  }, [searchQuery, selectedGroup]);

  const matchCount = filteredGroups.reduce((total, group) => total + group.topics.length, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-6 py-12">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--test-primary-30)] bg-[var(--test-primary-10)] px-3 py-1 font-mono text-xs text-[var(--test-primary)]">
          <BookOpen className="h-3.5 w-3.5" /> Testing &amp; Quality Curriculum
        </div>

        <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--test-text)] md:text-6xl">
          The Quality <span className="test-glow text-[var(--test-primary)]">Engineering Map</span>
        </h1>

        <p className="max-w-2xl text-sm leading-relaxed text-[var(--test-muted)] md:text-base">
          Start with the shape of a healthy suite, move through real integration seams and
          browser journeys, then learn the practices that make assertions actually bite.
        </p>

        {/* Search and filters */}
        <div className="flex flex-col items-center gap-4 pt-4 md:flex-row">
          <div className="relative w-full flex-grow md:w-auto">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--test-muted)]" />
            <input
              type="text"
              placeholder="Search lessons (e.g. mock, e2e, tdd, mutation)..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-lg border border-[var(--test-border-subtle)] bg-[var(--test-surface)] py-2.5 pl-10 pr-4 font-mono text-xs text-[var(--test-text)] placeholder:text-[var(--test-muted)] focus:border-[var(--test-primary)] focus:outline-none"
            />
          </div>

          <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`whitespace-nowrap rounded-lg px-3 py-2 font-mono text-xs transition-colors ${
                selectedGroup === 'all'
                  ? 'bg-[var(--test-primary)] font-semibold text-black'
                  : 'border border-[var(--test-border-subtle)] bg-[var(--test-surface)] text-[var(--test-muted)] hover:text-[var(--test-text)]'
              }`}
            >
              All ({testingTopics.length})
            </button>
            {testingTopicGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 font-mono text-xs transition-colors ${
                  selectedGroup === group.id
                    ? 'bg-[var(--test-primary)] font-semibold text-black'
                    : 'border border-[var(--test-border-subtle)] bg-[var(--test-surface)] text-[var(--test-muted)] hover:text-[var(--test-text)]'
                }`}
              >
                {group.name} ({group.topics.length})
              </button>
            ))}
          </div>
        </div>

        <p className="font-mono text-[10px] text-[var(--test-muted)]">
          {matchCount} of {testingTopics.length} lessons shown
        </p>
      </div>

      {/* Tracks */}
      <div className="space-y-16">
        {filteredGroups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-20 space-y-6">
            <div className="flex flex-col justify-between gap-3 border-b border-[var(--test-border-subtle)] pb-4 sm:flex-row sm:items-end">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold text-[var(--test-text)]">
                  {group.name}
                </h2>
                <p className="text-xs text-[var(--test-muted)]">{group.description}</p>
              </div>
              <span
                className={`w-fit rounded-full border px-2.5 py-1 font-mono text-[10px] ${
                  trackAccent[group.id] ?? trackAccent.foundations
                }`}
              >
                {group.topics.length} lessons
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {group.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/fullstack/testing/learn/${topic.id}`}
                  className="test-card group flex flex-col justify-between rounded-xl p-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[var(--test-primary)]">
                        {topic.kicker}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-[var(--test-muted)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--test-primary)]" />
                    </div>

                    <h3 className="font-display text-lg font-bold text-[var(--test-text)] transition-colors group-hover:text-[var(--test-primary)]">
                      {topic.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-[var(--test-muted)]">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[var(--test-border-subtle)] pt-4 font-mono text-[10px]">
                    <span className="capitalize text-[var(--test-muted)]">{topic.difficulty}</span>
                    <span className="flex items-center gap-1 text-[var(--test-primary)]">
                      Read lesson <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {filteredGroups.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--test-border)] bg-[var(--test-surface)] p-12 text-center">
            <p className="font-display text-lg font-bold text-[var(--test-text)]">
              No lessons match that search.
            </p>
            <p className="mt-2 text-xs text-[var(--test-muted)]">
              Try “mock”, “integration”, “tdd”, or clear the filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
              }}
              className="mt-5 rounded-lg bg-[var(--test-primary)] px-4 py-2 font-mono text-xs font-semibold text-black hover:bg-[var(--test-primary-hover)]"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
