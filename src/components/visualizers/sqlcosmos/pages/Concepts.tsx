'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Filter, Sparkles } from 'lucide-react';
import { SQL_TOPICS, type SqlTopic } from '../data/topics';

export default function Concepts() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? SQL_TOPICS : SQL_TOPICS.filter((t) => t.category === filter);

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
          Curriculum
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          SQL &amp; Relational Engine Concepts
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          20 in-depth architectural topics from B+ Tree leaf traversals to MVCC tuple headers and Cost-Based Optimizers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'foundations', 'indexing', 'query-execution', 'transactions', 'architecture'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-card border border-border text-foreground hover:border-indigo-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((topic) => (
          <Link
            key={topic.id}
            href={`/sqlcosmos/concepts/${topic.id}`}
            className="p-6 rounded-3xl bg-card border border-border/80 hover:border-indigo-500/50 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                  {topic.category}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{topic.difficulty}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                {topic.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {topic.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Start Interactive Lesson</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
