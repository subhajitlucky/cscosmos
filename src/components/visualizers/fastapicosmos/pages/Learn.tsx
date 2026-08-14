'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Server, BookOpen, ArrowUpRight } from 'lucide-react';
import { fastApiTopicGroups, fastApiTopics } from '../data/topics';

export function Learn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const filteredGroups = useMemo(() => {
    return fastApiTopicGroups
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
      .filter(Boolean) as typeof fastApiTopicGroups;
  }, [searchQuery, selectedGroup]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--fastapi-teal)]/30 bg-[var(--fastapi-teal)]/10 text-[var(--fastapi-teal)] text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" /> Python Backend Architecture Curriculum
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--fastapi-text)]">
          The FastAPI <span className="text-[var(--fastapi-teal)] fastapi-glow">Architecture Map</span>
        </h1>

        <p className="text-sm md:text-base text-[var(--fastapi-muted)] max-w-2xl leading-relaxed">
          From Uvicorn ASGI socket loops and non-blocking AnyIO threadpools to Rust-powered Pydantic V2 validation and hierarchical Depends() DAG resolution.
        </p>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fastapi-muted)]" />
            <input
              type="text"
              placeholder="Search concepts (e.g. asgi, uvicorn, async def, pydantic, depends, sse, websocket)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] text-xs font-mono text-[var(--fastapi-text)] placeholder:text-[var(--fastapi-muted)] focus:outline-none focus:border-[var(--fastapi-teal)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                selectedGroup === 'all'
                  ? 'bg-[var(--fastapi-primary)] text-white font-semibold'
                  : 'border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] text-[var(--fastapi-muted)] hover:text-[var(--fastapi-text)]'
              }`}
            >
              All ({fastApiTopics.length})
            </button>
            {fastApiTopicGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                  selectedGroup === g.id
                    ? 'bg-[var(--fastapi-primary)] text-white font-semibold'
                    : 'border border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] text-[var(--fastapi-muted)] hover:text-[var(--fastapi-text)]'
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
            <div className="flex items-center justify-between border-b border-[var(--fastapi-border-subtle)] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--fastapi-teal)]">
                    TRACK_0{groupIdx + 1}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[var(--fastapi-text)]">
                    {group.name}
                  </h2>
                </div>
                <p className="text-xs text-[var(--fastapi-muted)]">
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
                  href={`/fastapicosmos/learn/${topic.id}`}
                  className="fastapi-card p-6 rounded-xl space-y-4 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--fastapi-teal)]">
                        {topic.kicker}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[var(--fastapi-muted)] group-hover:text-[var(--fastapi-teal)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <h3 className="font-display font-bold text-lg text-[var(--fastapi-text)] group-hover:text-[var(--fastapi-teal)] transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-[var(--fastapi-muted)] leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--fastapi-border-subtle)] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--fastapi-muted)]">
                      {topic.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--fastapi-teal)] flex items-center gap-1">
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
