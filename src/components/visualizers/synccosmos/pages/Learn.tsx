'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, RefreshCw, BookOpen, ArrowUpRight } from 'lucide-react';
import { syncTopicGroups, syncTopics } from '../data/topics';

export function Learn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const filteredGroups = useMemo(() => {
    return syncTopicGroups
      .map(group => {
        if (selectedGroup !== 'all' && group.id !== selectedGroup) return null;
        const matchingTopics = group.topics.filter(t =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.group.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchingTopics.length === 0) return null;
        return {
          ...group,
          topics: matchingTopics,
        };
      })
      .filter(Boolean) as typeof syncTopicGroups;
  }, [searchQuery, selectedGroup]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--sync-primary)]/30 bg-[var(--sync-primary)]/10 text-[var(--sync-primary)] text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" /> Distributed Synchronization Curriculum
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--sync-text)]">
          The Synchronization <span className="text-[var(--sync-primary)] sync-glow">Architecture Map</span>
        </h1>

        <p className="text-sm md:text-base text-[var(--sync-muted)] max-w-2xl leading-relaxed">
          From Lamport timestamps and Vector Clocks to Operational Transformation matrices, join-semilattices, and Yjs RGA sequence CRDTs.
        </p>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sync-muted)]" />
            <input
              type="text"
              placeholder="Search concepts (e.g. vector clock, ot, crdt, semilattice, pn-counter, rga, yjs)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--sync-border-subtle)] bg-[var(--sync-surface)] text-xs font-mono text-[var(--sync-text)] placeholder:text-[var(--sync-muted)] focus:outline-none focus:border-[var(--sync-primary)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                selectedGroup === 'all'
                  ? 'bg-[var(--sync-primary)] text-black font-semibold'
                  : 'border border-[var(--sync-border-subtle)] bg-[var(--sync-surface)] text-[var(--sync-muted)] hover:text-[var(--sync-text)]'
              }`}
            >
              All ({syncTopics.length})
            </button>
            {syncTopicGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                  selectedGroup === g.id
                    ? 'bg-[var(--sync-primary)] text-black font-semibold'
                    : 'border border-[var(--sync-border-subtle)] bg-[var(--sync-surface)] text-[var(--sync-muted)] hover:text-[var(--sync-text)]'
                }`}
              >
                {g.name.split(' ')[0]} ({g.topics.length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      <div className="space-y-16">
        {filteredGroups.map((group, groupIdx) => (
          <section key={group.id} className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--sync-border-subtle)] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--sync-primary)]">
                    TRACK_0{groupIdx + 1}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[var(--sync-text)]">
                    {group.name}
                  </h2>
                </div>
                <p className="text-xs text-[var(--sync-muted)]">
                  {group.description}
                </p>
              </div>

              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${group.badgeColor}`}>
                {group.topics.length} topics
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/synccosmos/learn/${topic.id}`}
                  className="sync-card p-6 rounded-xl space-y-4 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--sync-primary)]">
                        {topic.kicker}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[var(--sync-muted)] group-hover:text-[var(--sync-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <h3 className="font-display font-bold text-lg text-[var(--sync-text)] group-hover:text-[var(--sync-primary)] transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-[var(--sync-muted)] leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--sync-border-subtle)] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--sync-muted)]">
                      {topic.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--sync-primary)] flex items-center gap-1">
                      Deep dive <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
