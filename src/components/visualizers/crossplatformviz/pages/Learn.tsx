'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Smartphone, BookOpen, ArrowUpRight, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { crossPlatformTopicGroups, crossPlatformTopics } from '../data/topics';

export function Learn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredGroups = useMemo(() => {
    return crossPlatformTopicGroups
      .map(group => {
        if (selectedGroup !== 'all' && group.id !== selectedGroup) return null;
        const matchingTopics = group.topics.filter(t => {
          const matchesSearch =
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.kicker.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesDiff =
            selectedDifficulty === 'all' ||
            t.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

          return matchesSearch && matchesDiff;
        });

        if (matchingTopics.length === 0) return null;
        return {
          ...group,
          topics: matchingTopics,
        };
      })
      .filter(Boolean) as typeof crossPlatformTopicGroups;
  }, [searchQuery, selectedGroup, selectedDifficulty]);

  const totalMatchingTopics = filteredGroups.reduce((acc, g) => acc + g.topics.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--cp-border)] bg-[var(--cp-surface-2)] text-[var(--cp-primary)] text-xs font-mono font-medium">
          <BookOpen className="w-3.5 h-3.5" /> 14-Topic Progressive Curriculum Map
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--cp-text)]">
          The Cross-Platform Architecture Map
        </h1>

        <p className="text-sm md:text-base text-[var(--cp-muted)] max-w-2xl leading-relaxed">
          From basic mobile OS display pipelines and thread models to React Native JSI C++ HostObjects, Fabric shadow trees, Flutter Impeller GPU shaders, and Kotlin Multiplatform LLVM binaries.
        </p>

        {/* Search & Filter Toolbar */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cp-muted)]" />
              <input
                type="text"
                placeholder="Search topics (e.g. jsi, vsync, bridge, fabric, turbomodule, hermes, impeller, kmp)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--cp-border)] bg-[var(--cp-surface)] text-xs font-mono text-[var(--cp-text)] placeholder:text-[var(--cp-muted)] focus:outline-none focus:border-[var(--cp-primary)]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-[11px] font-mono text-[var(--cp-muted)] whitespace-nowrap pl-1">
                Level:
              </span>
              {['all', 'basic', 'intermediate', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedDifficulty(lvl)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono capitalize whitespace-nowrap transition-colors ${
                    selectedDifficulty === lvl
                      ? 'bg-[var(--cp-primary)] text-white font-bold'
                      : 'border border-[var(--cp-border)] bg-[var(--cp-surface)] text-[var(--cp-muted)] hover:text-[var(--cp-text)]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Stage Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                selectedGroup === 'all'
                  ? 'bg-[var(--cp-text)] text-[var(--cp-bg)] font-bold'
                  : 'border border-[var(--cp-border)] bg-[var(--cp-surface)] text-[var(--cp-muted)] hover:text-[var(--cp-text)]'
              }`}
            >
              All Stages ({crossPlatformTopics.length})
            </button>
            {crossPlatformTopicGroups.map((g, idx) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                  selectedGroup === g.id
                    ? 'bg-[var(--cp-text)] text-[var(--cp-bg)] font-bold'
                    : 'border border-[var(--cp-border)] bg-[var(--cp-surface)] text-[var(--cp-muted)] hover:text-[var(--cp-text)]'
                }`}
              >
                Stage 0{idx + 1}: {g.name.split(':')[0]} ({g.topics.length})
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-[var(--cp-muted)]">
            Showing <span className="font-bold text-[var(--cp-text)]">{totalMatchingTopics}</span> of {crossPlatformTopics.length} topics
          </div>
        </div>
      </div>

      {/* Tracks / Stages Section */}
      <div className="space-y-16">
        {filteredGroups.length === 0 ? (
          <div className="p-12 text-center border border-[var(--cp-border)] rounded-2xl bg-[var(--cp-surface)] space-y-3 font-mono">
            <p className="text-sm text-[var(--cp-muted)]">No topics match your current filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
                setSelectedDifficulty('all');
              }}
              className="text-xs text-[var(--cp-primary)] font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredGroups.map((group, groupIdx) => (
            <section key={group.id} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--cp-border)] pb-4 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[var(--cp-primary)]">
                      STAGE_0{groupIdx + 1}
                    </span>
                    <h2 className="font-display text-2xl font-bold text-[var(--cp-text)]">
                      {group.name}
                    </h2>
                  </div>
                  <p className="text-xs text-[var(--cp-muted)] max-w-2xl">
                    {group.description}
                  </p>
                </div>

                <span className={`text-[10px] font-mono px-2.5 py-1 rounded border self-start sm:self-auto ${group.badgeColor}`}>
                  {group.topics.length} topics
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.topics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/crossplatformviz/learn/${topic.id}`}
                    className="cp-card p-6 rounded-xl space-y-4 group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[var(--cp-primary)] font-bold uppercase tracking-wider">
                          {topic.kicker}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[var(--cp-muted)] group-hover:text-[var(--cp-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>

                      <h3 className="font-display font-bold text-base text-[var(--cp-text)] group-hover:text-[var(--cp-primary)] transition-colors">
                        {topic.title}
                      </h3>

                      <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
                        {topic.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[var(--cp-border)] flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--cp-border)] text-[var(--cp-muted)]">
                        {topic.difficulty}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--cp-primary)] font-bold flex items-center gap-1">
                        Read Topic &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
