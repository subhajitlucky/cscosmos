'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, ArrowRight, Layers, Database, Cpu, Network } from 'lucide-react';
import { MONGO_TOPICS } from '../data/topics';

const CATEGORIES = [
  { id: 'all', label: 'All Topics', count: 50 },
  { id: 'bson-storage', label: 'BSON & Storage Architecture', count: 10 },
  { id: 'wiredtiger', label: 'WiredTiger Engine & Cache', count: 10 },
  { id: 'indexing', label: 'Indexing & Query Optimization', count: 10 },
  { id: 'aggregation', label: 'Aggregation Framework', count: 10 },
  { id: 'distributed', label: 'Replication & Distributed Sharding', count: 10 },
];

export default function Concepts() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTopics = MONGO_TOPICS.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Curriculum Directory • 50 In-Depth Modules</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Document Database Architecture Concepts
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Master MongoDB internals from BSON byte layouts and WiredTiger cache eviction to ESR compound indexing, aggregation pipeline memory limits, and distributed Raft consensus.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search concepts, operators ($match, $lookup), WiredTiger, BSON..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-colors shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-foreground text-background font-semibold shadow-xs'
                  : 'border border-border bg-card hover:bg-muted/40 text-muted-foreground'
              }`}
            >
              <span>{cat.label}</span>
              <span className="ml-1.5 opacity-60 font-mono text-[11px]">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/mongocosmos/concepts/${topic.id}`}
            className="p-5 rounded-xl border border-border bg-card hover:border-foreground/40 transition-colors space-y-3 flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  TOPIC {topic.topicNumber.toString().padStart(2, '0')}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                  {topic.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground group-hover:underline leading-snug">
                {topic.title}
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {topic.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-foreground">
              <span className="text-[11px] font-mono capitalize">{topic.category.replace('-', ' ')}</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                Explore Lesson <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div className="p-12 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm space-y-1">
          <p className="font-semibold text-foreground">No matching concepts found</p>
          <p className="text-xs">Try searching for a different keyword or resetting your category filter.</p>
        </div>
      )}
    </div>
  );
}
