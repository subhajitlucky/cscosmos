'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Network, BookOpen, ArrowUpRight } from 'lucide-react';
import { microserviceTopicGroups, microserviceTopics } from '../data/topics';

export function Learn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const filteredGroups = useMemo(() => {
    return microserviceTopicGroups
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
      .filter(Boolean) as typeof microserviceTopicGroups;
  }, [searchQuery, selectedGroup]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ms-primary)]/30 bg-[var(--ms-primary)]/10 text-[var(--ms-primary)] text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" /> Distributed Architecture Curriculum
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ms-text)]">
          The Microservices <span className="text-[var(--ms-primary)] ms-glow">Architecture Map</span>
        </h1>

        <p className="text-sm md:text-base text-[var(--ms-muted)] max-w-2xl leading-relaxed">
          From Domain-Driven Bounded Contexts and Circuit Breaker state machines to Saga compensating rollbacks, OpenTelemetry W3C tracing, and Envoy service meshes.
        </p>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ms-muted)]" />
            <input
              type="text"
              placeholder="Search concepts (e.g. ddd, circuit breaker, bulkhead, saga, opentelemetry, grpc, envoy)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] text-xs font-mono text-[var(--ms-text)] placeholder:text-[var(--ms-muted)] focus:outline-none focus:border-[var(--ms-primary)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                selectedGroup === 'all'
                  ? 'bg-[var(--ms-primary)] text-white font-semibold'
                  : 'border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] text-[var(--ms-muted)] hover:text-[var(--ms-text)]'
              }`}
            >
              All ({microserviceTopics.length})
            </button>
            {microserviceTopicGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                  selectedGroup === g.id
                    ? 'bg-[var(--ms-primary)] text-white font-semibold'
                    : 'border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] text-[var(--ms-muted)] hover:text-[var(--ms-text)]'
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
            <div className="flex items-center justify-between border-b border-[var(--ms-border-subtle)] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--ms-primary)]">
                    TRACK_0{groupIdx + 1}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[var(--ms-text)]">
                    {group.name}
                  </h2>
                </div>
                <p className="text-xs text-[var(--ms-muted)]">
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
                  href={`/microservicesviz/learn/${topic.id}`}
                  className="ms-card p-6 rounded-xl space-y-4 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--ms-primary)]">
                        {topic.kicker}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[var(--ms-muted)] group-hover:text-[var(--ms-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <h3 className="font-display font-bold text-lg text-[var(--ms-text)] group-hover:text-[var(--ms-primary)] transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-[var(--ms-muted)] leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--ms-border-subtle)] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--ms-muted)]">
                      {topic.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--ms-primary)] flex items-center gap-1">
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
