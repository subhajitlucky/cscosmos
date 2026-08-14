'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Sparkles, BookOpen, ArrowUpRight } from 'lucide-react';
import { aiTopicGroups, aiTopics } from '../data/topics';

export function Learn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const filteredGroups = useMemo(() => {
    return aiTopicGroups
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
      .filter(Boolean) as typeof aiTopicGroups;
  }, [searchQuery, selectedGroup]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ai-primary)]/30 bg-[var(--ai-primary)]/10 text-[var(--ai-primary)] text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" /> AI Application Engineering Curriculum
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ai-text)]">
          The AI Systems <span className="text-[var(--ai-primary)] ai-glow">Architecture Map</span>
        </h1>

        <p className="text-sm md:text-base text-[var(--ai-muted)] max-w-2xl leading-relaxed">
          From high-dimensional vector embeddings and HNSW graph traversal to Advanced Hybrid RAG, Autonomous ReAct agent loops, and RAG Triad evaluation.
        </p>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ai-muted)]" />
            <input
              type="text"
              placeholder="Search concepts (e.g. embeddings, hnsw, rag, reranking, react, agents, prompt, guardrails)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] text-xs font-mono text-[var(--ai-text)] placeholder:text-[var(--ai-muted)] focus:outline-none focus:border-[var(--ai-primary)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                selectedGroup === 'all'
                  ? 'bg-[var(--ai-primary)] text-white font-semibold'
                  : 'border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
              }`}
            >
              All ({aiTopics.length})
            </button>
            {aiTopicGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                  selectedGroup === g.id
                    ? 'bg-[var(--ai-primary)] text-white font-semibold'
                    : 'border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
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
            <div className="flex items-center justify-between border-b border-[var(--ai-border-subtle)] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--ai-primary)]">
                    TRACK_0{groupIdx + 1}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[var(--ai-text)]">
                    {group.name}
                  </h2>
                </div>
                <p className="text-xs text-[var(--ai-muted)]">
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
                  href={`/aicosmos/learn/${topic.id}`}
                  className="ai-card p-6 rounded-xl space-y-4 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--ai-primary)]">
                        {topic.kicker}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[var(--ai-muted)] group-hover:text-[var(--ai-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <h3 className="font-display font-bold text-lg text-[var(--ai-text)] group-hover:text-[var(--ai-primary)] transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--ai-border-subtle)] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--ai-muted)]">
                      {topic.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--ai-primary)] flex items-center gap-1">
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
