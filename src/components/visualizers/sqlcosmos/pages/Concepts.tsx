'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Search, X } from 'lucide-react';
import { SQL_TOPICS } from '../data/topics';

const CATEGORIES = [
  'all',
  'foundations',
  'indexing',
  'query-execution',
  'transactions',
  'architecture',
] as const;

export default function Concepts() {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTopics = useMemo(() => {
    return SQL_TOPICS.filter((topic) => {
      const matchesCategory = filter === 'all' || topic.category === filter;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchesSearch =
        topic.title.toLowerCase().includes(q) ||
        topic.summary.toLowerCase().includes(q) ||
        topic.id.toLowerCase().includes(q) ||
        String(topic.topicNumber) === q ||
        `topic ${topic.topicNumber}`.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          <BookOpen className="w-3.5 h-3.5 text-foreground" />
          <span>Curriculum • 50 structured lessons</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          SQL &amp; Relational Engine Concepts
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
          Comprehensive curriculum from SQL DDL, constraints, and aggregations to B+ Tree page traversals, Two-Phase Locking, MVCC, and table partitioning.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4 pt-2">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 50 concepts by name, topic #, or keyword..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-card text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors border ${
                  isSelected
                    ? 'bg-foreground text-background border-foreground shadow-xs'
                    : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
                }`}
              >
                {cat}
              </button>
            );
          })}

          <span className="text-xs font-mono text-muted-foreground ml-auto hidden sm:inline">
            Showing {filteredTopics.length} of {SQL_TOPICS.length} topics
          </span>
        </div>
      </div>

      {/* Concepts Grid */}
      {filteredTopics.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-border bg-muted/10 space-y-3">
          <p className="text-sm font-semibold text-foreground">No concepts match your search criteria</p>
          <p className="text-xs text-muted-foreground">Try clearing the search query or selecting a different category filter.</p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/sqlcosmos/concepts/${topic.id}`}
              className="p-5 rounded-xl bg-card border border-border hover:border-foreground/40 shadow-xs transition-colors flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border border-border bg-muted/40 text-foreground">
                    #{String(topic.topicNumber).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono border border-border bg-muted/30 text-muted-foreground capitalize">
                      {topic.category}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">{topic.difficulty}</span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-foreground group-hover:underline transition-colors leading-snug">
                  {topic.title}
                </h2>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Start lesson</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
