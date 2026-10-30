'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
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

  const filtered = filter === 'all' ? SQL_TOPICS : SQL_TOPICS.filter((t) => t.category === filter);

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-foreground font-mono text-xs font-medium">
          <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Complete Curriculum • 50 Interactive Modules</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          SQL &amp; Relational Engine Concepts
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
          Comprehensive curriculum from SQL DDL, constraints, and aggregations to B+ Tree page traversals, Two-Phase Locking, MVCC, and table partitioning.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-2">
        {CATEGORIES.map((cat) => {
          const isSelected = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                isSelected
                  ? 'bg-foreground text-background border-foreground shadow-xs'
                  : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((topic) => (
          <Link
            key={topic.id}
            href={`/sqlcosmos/concepts/${topic.id}`}
            className="p-6 rounded-2xl bg-card border border-border hover:border-foreground/40 hover:shadow-sm transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border border-border bg-muted/30 text-muted-foreground uppercase">
                  {topic.category}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">{topic.difficulty}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:underline transition-colors leading-snug">
                {topic.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {topic.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">Start Interactive Lesson</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
