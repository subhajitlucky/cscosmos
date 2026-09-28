'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Sliders,
  ShieldCheck,
  Search,
  Grid,
  Map,
  Clock,
  Terminal,
  Activity,
  Layers,
  Cpu,
  CheckCircle2,
  Workflow
} from 'lucide-react';
import { foundationSubtopics, foundationCategories } from '../data/foundations';

interface FoundationHomeProps {
  basePath?: string;
}

interface PhaseMetadata {
  number: string;
  category: string;
  name: string;
  description: string;
}

const PHASES: PhaseMetadata[] = [
  {
    number: '01',
    category: 'Core Mental Models',
    name: 'Core Mental Models',
    description: 'Foundations of cognitive systems, learned parameters, tokenization, and probabilistic vs deterministic execution.',
  },
  {
    number: '02',
    category: 'Lifecycle & Roles',
    name: 'Lifecycle & Systems Architecture',
    description: 'Software 1.0 vs 2.0 architectures, compute budgets, and engineering role taxonomy.',
  },
  {
    number: '03',
    category: 'Parameters & Mechanics',
    name: 'Parameters & Mathematical Mechanics',
    description: 'Weights, bias offsets, feature vectors, activation non-linearities, and decision boundaries.',
  },
  {
    number: '04',
    category: 'Systems & Reliability',
    name: 'Systems Reliability & Drift',
    description: 'Generalization, overfitting dynamics, data distribution drift, and production failure modes.',
  },
  {
    number: '05',
    category: 'Pipeline Projects',
    name: 'Capstone Pipelines',
    description: 'End-to-end interactive serving pipeline connecting raw inputs, transforms, and predictions.',
  },
];

export function FoundationHome({ basePath = '/ai/ai-engineering-foundations' }: FoundationHomeProps) {
  const [viewMode, setViewMode] = useState<'path' | 'grid'>('path');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' to focus search, 'Esc' to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && isInputFocused) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSubtopics = useMemo(() => {
    return foundationSubtopics.filter((topic) => {
      const matchesCategory =
        selectedCategory === 'All' || topic.category === selectedCategory;
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen w-full">
      {/* 1. Full-Width Hero Section (Audited from jsviz / htmlviz) */}
      <section className="border-b border-border/80 bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 text-center space-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-4 py-1.5 text-xs font-mono text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">AI SYSTEMS</span>
            <span>//</span>
            <span>TRACK 01 &bull; FOUNDATIONS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground font-display max-w-5xl mx-auto leading-[1.08]">
            DECONSTRUCT THE MODEL. <br className="hidden sm:inline" />
            <span className="text-muted-foreground">FROM WEIGHTS TO INFERENCE.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground font-sans leading-relaxed">
            Master the mental models, parameter mechanics, tensor transformations, and execution runtimes of artificial intelligence. 100% client-side interactive visualizers. No marketing fluff.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`${basePath}/learn/what-is-artificial-intelligence`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-8 py-4 text-sm font-mono font-bold text-background hover:bg-foreground/90 transition-colors shadow-sm"
            >
              Start Learning (Module 01)
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`${basePath}/lab`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-8 py-4 text-sm font-mono font-bold text-foreground hover:bg-secondary/70 transition-colors"
            >
              <Sliders className="h-4 w-4 text-emerald-500" />
              Open Micro-Model Studio
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Full-Width Telemetry Stats Bar (Audited from jsviz divide grid) */}
      <section className="border-b border-border/80 bg-card/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/80">
          <div className="p-6 sm:p-8 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-display text-foreground">
              26
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Curriculum Modules
            </div>
          </div>

          <div className="p-6 sm:p-8 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-display text-foreground">
              05
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Learning Phases
            </div>
          </div>

          <div className="p-6 sm:p-8 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-display text-emerald-500">
              100%
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Client-Side Reactive
            </div>
          </div>

          <div className="p-6 sm:p-8 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-display text-foreground">
              0ms
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Server Latency
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Core Feature Workbenches (Audited from jsviz FeatureCard trio) */}
      <section className="border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-8">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              LEARNING PARADIGM
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-display">
              Built on First Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href={`${basePath}/learn/what-is-artificial-intelligence`}
              className="group rounded-xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between hover:border-foreground/40 transition-colors space-y-6"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg border border-border/80 bg-secondary/40 flex items-center justify-center text-foreground group-hover:border-foreground/40 transition-colors">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                  Mental Models &amp; Taxonomies
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  Visual representations of abstract computing mechanics: how continuous parameters warp vector space and how tokenizers partition language.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                Explore Curriculum <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link
              href={`${basePath}/lab`}
              className="group rounded-xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between hover:border-foreground/40 transition-colors space-y-6"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg border border-border/80 bg-secondary/40 flex items-center justify-center text-emerald-500 group-hover:border-foreground/40 transition-colors">
                  <Sliders className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                  The Micro-Model Studio
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  Deterministic sandbox runtime. Adjust weights, bias offsets, and activation functions live to observe real-time decision boundary shifts.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                Launch Sandbox Bench <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <Link
              href={`${basePath}/problems`}
              className="group rounded-xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between hover:border-foreground/40 transition-colors space-y-6"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg border border-border/80 bg-secondary/40 flex items-center justify-center text-foreground group-hover:border-foreground/40 transition-colors">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                  Scenario Certification Drill
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  Structured problem sets auditing your comprehension of training vs inference memory buffers, gradient vanishing, and real-world failure modes.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                Take Knowledge Check <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Curriculum Galaxy (Audited from htmlviz ConceptsGrid: Path View vs Grid View) */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Controls Bar: Title, Path/Grid Toggle, and Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/80 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
                COMPLETE SYLLABUS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground font-display">
                Concept Galaxy (26 Modules)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Path vs Grid Toggle (Direct from htmlviz) */}
              <div className="border border-border/80 bg-secondary/30 rounded-lg p-1 flex items-center font-mono text-xs">
                <button
                  onClick={() => setViewMode('path')}
                  className={`px-3 py-1.5 rounded-md font-bold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'path'
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Map className="h-3.5 w-3.5" /> Path
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md font-bold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid className="h-3.5 w-3.5" /> Grid
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border/80 bg-secondary/30 pl-9 pr-9 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:bg-background focus:outline-none transition-colors"
                />
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded border border-border/80 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  /
                </kbd>
              </div>
            </div>
          </div>

          {/* Category Filter Chips for Grid Mode */}
          {viewMode === 'grid' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
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
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors border ${
                      isSelected
                        ? 'border-foreground bg-foreground text-background font-bold'
                        : 'border-border/80 bg-secondary/20 text-muted-foreground hover:text-foreground hover:border-foreground/30'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="opacity-70 text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 1: PATH (Timeline Guided Roadmap, direct from htmlviz) */}
          {viewMode === 'path' && (
            <div className="space-y-16 relative">
              {/* Connecting vertical timeline track */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border/60 hidden lg:block" />

              {PHASES.map((phase) => {
                const phaseTopics = filteredSubtopics.filter(
                  (t) => t.category === phase.category
                );

                if (phaseTopics.length === 0) return null;

                return (
                  <div key={phase.number} className="relative lg:pl-20 space-y-6">
                    {/* Numbered Milestone Badge */}
                    <div className="hidden lg:flex absolute left-0 top-0 items-center justify-center w-12 h-12 rounded-xl bg-card border-2 border-border text-foreground font-mono font-bold text-sm z-10 shadow-sm">
                      {phase.number}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                        <span className="font-bold text-foreground lg:hidden">
                          PHASE {phase.number} &bull;
                        </span>
                        <span>{phaseTopics.length} Modules</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                        {phase.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-3xl">
                        {phase.description}
                      </p>
                    </div>

                    {/* Responsive Grid of Module Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {phaseTopics.map((topic) => (
                        <ModuleCard key={topic.id} topic={topic} basePath={basePath} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: GRID (Full-Width Responsive 4-Column Matrix) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredSubtopics.map((topic) => (
                <ModuleCard key={topic.id} topic={topic} basePath={basePath} />
              ))}
            </div>
          )}

          {/* Empty Search State */}
          {filteredSubtopics.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/80 p-12 text-center space-y-3">
              <p className="font-mono text-sm text-muted-foreground">
                No modules match query &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="font-mono text-xs text-foreground underline underline-offset-4"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Minimal Platform Footer Ribbon */}
      <footer className="border-t border-border/80 bg-card/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>SHORTCUTS:</span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground font-semibold">/</kbd>
              Search
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground font-semibold">Esc</kbd>
              Clear
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={`${basePath}/learn/what-is-artificial-intelligence`}
              className="text-foreground hover:underline font-semibold"
            >
              Start Module 01 &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subtopic Card (Audited from htmlviz TagCard & jsviz)
function ModuleCard({
  topic,
  basePath,
}: {
  topic: (typeof foundationSubtopics)[number];
  basePath: string;
}) {
  return (
    <Link
      href={`${basePath}/learn/${topic.id}`}
      className="group rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between hover:border-foreground/40 transition-colors space-y-3"
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-foreground">
            // MOD_{String(topic.number).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">
            {topic.category.split(' ')[0]}
          </span>
        </div>

        <h4 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
          {topic.title}
        </h4>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-sans">
          {topic.definition}
        </p>
      </div>

      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
        <span className="text-[11px] flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-emerald-500" />
          <span>{topic.visualization.replace(/-/g, ' ')}</span>
        </span>
        <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Inspect <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
