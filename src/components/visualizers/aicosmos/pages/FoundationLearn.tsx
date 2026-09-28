'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Layers,
  Sliders,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Table as TableIcon,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { foundationSubtopics, foundationCategories, type FoundationSubtopic } from '../data/foundations';

interface FoundationLearnProps {
  basePath?: string;
}

const PHASES = [
  {
    number: '01',
    category: 'Core Mental Models',
    name: 'Core Mental Models',
    description: 'Foundations of cognitive systems, learned parameters vs handcrafted rules, continuous representations, and tokenized language spaces.',
  },
  {
    number: '02',
    category: 'Lifecycle & Roles',
    name: 'Lifecycle & Systems Architecture',
    description: 'Engineering role taxonomies, Software 1.0 vs 2.0 architectures, training loops, and production inference lifecycle.',
  },
  {
    number: '03',
    category: 'Parameters & Mechanics',
    name: 'Parameters & Mathematical Mechanics',
    description: 'Weights, bias offsets, feature vectors, activation non-linearities, loss functions, and decision surfaces.',
  },
  {
    number: '04',
    category: 'Systems & Reliability',
    name: 'Systems Reliability & Drift',
    description: 'Inference dataflow, probabilistic sampling, failure modes, tool integration, and cloud vs local deployment tradeoffs.',
  },
  {
    number: '05',
    category: 'Pipeline Projects',
    name: 'Capstone Serving Pipelines',
    description: 'Interactive end-to-end serving pipeline connecting raw input ingestion, feature transformations, forward pass, and live predictions.',
  },
];

export function FoundationLearn({
  basePath = '/ai/ai-engineering-foundations',
}: FoundationLearnProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewFormat, setViewFormat] = useState<'grouped' | 'table'>('grouped');

  const filteredTopics = useMemo(() => {
    return foundationSubtopics.filter((topic) => {
      const matchesCategory =
        selectedCategory === 'All' || topic.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery =
        topic.title.toLowerCase().includes(q) ||
        topic.definition.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q) ||
        topic.number.toString() === q ||
        `module ${topic.number}`.includes(q) ||
        topic.visualization.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full space-y-10 pb-20">
      {/* 1. Header & Navigation Ribbon */}
      <section className="border-b border-border/80 bg-card/40">
        <div className="page-container py-10 sm:py-14 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
            <Link
              href={basePath}
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-semibold"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
            </Link>
            <div className="flex items-center gap-3">
              <span>TRACK 01 // FOUNDATIONS</span>
              <span className="opacity-40">&bull;</span>
              <span className="text-foreground font-semibold">26 CURRICULUM TOPICS</span>
            </div>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-display">
              Curriculum Matrix &amp; Topic Directory
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
              Select any chapter directly from the complete syllabus below. Every topic includes first-principles theory, mathematical formulations, production pitfalls, and a bespoke interactive visualizer.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Search, Filter Chips & View Toggle Bar */}
      <section className="page-container">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by topic, number (e.g. 9), keyword, or visualizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-secondary/30 pl-10 pr-4 py-2.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Format Toggle & Count */}
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-muted-foreground hidden sm:inline">
                Showing <strong className="text-foreground">{filteredTopics.length}</strong> of 26 topics
              </span>

              <div className="flex rounded-lg border border-border/80 bg-secondary/30 p-1">
                <button
                  onClick={() => setViewFormat('grouped')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                    viewFormat === 'grouped'
                      ? 'bg-foreground text-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Grouped
                </button>
                <button
                  onClick={() => setViewFormat('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                    viewFormat === 'table'
                      ? 'bg-foreground text-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TableIcon className="h-3.5 w-3.5" /> Table
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs pt-1 border-t border-border/40">
            {foundationCategories.map((cat) => {
              const count =
                cat === 'All'
                  ? foundationSubtopics.length
                  : foundationSubtopics.filter((t) => t.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors border ${
                    isSelected
                      ? 'border-foreground bg-foreground text-background font-bold shadow-sm'
                      : 'border-border/80 bg-secondary/20 text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-background/80' : 'text-muted-foreground/60'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Main Content: Grouped by Phase or Table View */}
      <section className="page-container space-y-12">
        {viewFormat === 'grouped' ? (
          <div className="space-y-12">
            {PHASES.map((phase) => {
              const phaseTopics = filteredTopics.filter(
                (t) => t.category === phase.category
              );

              if (phaseTopics.length === 0) return null;

              return (
                <div key={phase.number} className="space-y-5">
                  {/* Phase Header */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-foreground border border-border/80 rounded-md px-2 py-0.5 bg-secondary/40">
                        PHASE {phase.number}
                      </span>
                      <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground">
                        {phase.name}
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {phaseTopics.length} Modules in Phase
                    </span>
                  </div>

                  {/* Grid of Topic Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {phaseTopics.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`${basePath}/learn/${topic.id}`}
                        className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 hover:border-foreground/40 transition-all hover:bg-secondary/15 space-y-4"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="font-bold text-foreground">
                              // MODULE {String(topic.number).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">
                              {topic.category.split(' ')[0]}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                            {topic.title}
                          </h3>

                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-sans">
                            {topic.definition}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                          <span className="text-[11px] flex items-center gap-1.5 text-emerald-500">
                            <Activity className="h-3 w-3" />
                            <span>{topic.visualization.replace(/-/g, ' ')}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Open <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table Format */
          <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-border/80 bg-secondary/30 text-muted-foreground">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold w-16">#</th>
                    <th className="py-3.5 px-4 font-semibold">Module Title</th>
                    <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Category</th>
                    <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">Interactive Visualizer</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredTopics.map((topic) => (
                    <tr
                      key={topic.id}
                      className="hover:bg-secondary/20 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-bold text-foreground">
                        {String(topic.number).padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          href={`${basePath}/learn/${topic.id}`}
                          className="font-display font-semibold text-foreground group-hover:text-primary transition-colors block text-sm"
                        >
                          {topic.title}
                        </Link>
                        <p className="text-[11px] text-muted-foreground font-sans truncate max-w-md mt-0.5">
                          {topic.definition}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground hidden md:table-cell">
                        {topic.category}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-500 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1.5">
                          <Activity className="h-3 w-3" />
                          {topic.visualization.replace(/-/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`${basePath}/learn/${topic.id}`}
                          className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-foreground hover:text-background transition-colors"
                        >
                          Launch <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty Search State */}
        {filteredTopics.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/80 p-12 text-center space-y-3 font-mono text-xs">
            <p className="text-muted-foreground">
              No modules match query &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-foreground underline underline-offset-4 font-bold"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
