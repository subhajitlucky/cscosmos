'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Sliders,
  ShieldCheck,
  Search,
  Cpu,
  Layers,
  Binary,
  CheckCircle2,
  Terminal,
  Activity,
  Workflow
} from 'lucide-react';
import { foundationSubtopics, foundationCategories } from '../data/foundations';

interface FoundationHomeProps {
  basePath?: string;
}

export function FoundationHome({ basePath = '/ai/ai-engineering-foundations' }: FoundationHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener ('/' to search, 'Esc' to clear)
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
        topic.analogy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const telemetryMetrics = [
    {
      label: 'CURRICULUM SUBTOPICS',
      value: '26',
      unit: 'MODULES',
      sub: 'Symbolic to learned inference',
      icon: BookOpen,
    },
    {
      label: 'EXECUTION PHASES',
      value: '05',
      unit: 'LEVELS',
      sub: 'Models → Lifecycle → Mechanics',
      icon: Layers,
    },
    {
      label: 'DETERMINISTIC STUDIO',
      value: '01',
      unit: 'ACTIVE BENCH',
      sub: 'z = w · x + b telemetry',
      icon: Sliders,
    },
    {
      label: 'SCENARIO AUDITS',
      value: '10',
      unit: 'CHALLENGES',
      sub: 'Memory & divergence audits',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Technical Telemetry Header Ribbon */}
      <section className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4 text-xs font-mono text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            AI_SYSTEMS // FOUNDATIONS
          </span>
          <span className="text-border">/</span>
          <span>SPEC: RUNTIME_01</span>
          <span className="text-border">/</span>
          <span className="hidden sm:inline">PRECISION: FP64_REACTIVE</span>
          <span className="text-border hidden sm:inline">/</span>
          <span>ZERO_GRADIENTS_VERIFIED</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded border border-border bg-secondary/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            26 COMPILED MODULES
          </span>
        </div>
      </section>

      {/* 2. Architectural Hero Section */}
      <section className="relative rounded-2xl border border-border/80 bg-card p-6 sm:p-10 md:p-12 space-y-6">
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-1 text-xs font-mono text-muted-foreground">
            <Terminal className="h-3.5 w-3.5 text-foreground" />
            <span>PHASE 01 // RUNTIME ARCHITECTURE & PARAMETERS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground font-display leading-[1.08]">
            AI ENGINEERING <br />
            FOUNDATIONS.
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-3xl font-sans">
            Deconstruct the fundamental mechanics of learned parameters, tensor transformations, deterministic forward passes, and probabilistic inference runtimes. Master how raw numbers transform into learned weights before writing complex model architectures.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`${basePath}/learn/what-is-artificial-intelligence`}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-xs sm:text-sm font-mono font-semibold text-background hover:bg-foreground/90 transition-colors"
            >
              Start Module 01 <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`${basePath}/lab`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-5 py-3 text-xs sm:text-sm font-mono font-semibold text-foreground hover:bg-secondary/70 transition-colors"
            >
              <Sliders className="h-4 w-4 text-emerald-500" /> Micro-Model Studio
            </Link>

            <Link
              href={`${basePath}/problems`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-5 py-3 text-xs sm:text-sm font-mono font-semibold text-foreground hover:bg-secondary/70 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-foreground" /> 10 Scenario Challenges
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Core Telemetry Metrics Bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {telemetryMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-xl border border-border/80 bg-card p-5 space-y-2"
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="font-mono text-[11px] font-semibold tracking-wider">
                  {metric.label}
                </span>
                <Icon className="h-4 w-4 text-foreground" />
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-display text-foreground">
                  {metric.value}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                  {metric.unit}
                </span>
              </div>

              <p className="text-xs text-muted-foreground font-mono">
                {metric.sub}
              </p>
            </div>
          );
        })}
      </section>

      {/* 4. Interactive Command & Filter Deck */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              CURRICULUM MATRIX
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-display">
              26 Architecture Modules
            </h2>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search concepts (e.g. weights, bias, inference)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-secondary/30 pl-10 pr-14 py-2.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-foreground/40 focus:bg-background focus:outline-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded border border-border/80 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              /
            </kbd>
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {foundationCategories.map((category) => {
            const count =
              category === 'All'
                ? foundationSubtopics.length
                : foundationSubtopics.filter((t) => t.category === category).length;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'border border-foreground bg-foreground text-background font-semibold'
                    : 'border border-border/80 bg-secondary/30 text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-mono ${
                    isSelected
                      ? 'bg-background/20 text-background'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subtopic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubtopics.map((topic) => (
            <Link
              key={topic.id}
              href={`${basePath}/learn/${topic.id}`}
              className="group rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between transition-colors hover:border-foreground/40"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-foreground">
                    // MOD_{String(topic.number).padStart(2, '0')}
                  </span>
                  <span className="rounded border border-border bg-secondary/40 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                    {topic.category}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-snug">
                  {topic.title}
                </h3>

                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {topic.definition}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="inline-flex items-center gap-1.5 text-[11px]">
                  <Activity className="h-3 w-3 text-emerald-500" />
                  <span>{topic.visualization.replace(/-/g, ' ')}</span>
                </span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Inspect Module <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredSubtopics.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3">
            <p className="font-mono text-sm text-muted-foreground">
              No modules matched query &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="font-mono text-xs text-foreground underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* 5. Flagship Interactive Studios Showcase */}
      <section className="space-y-4 pt-6 border-t border-border/60">
        <div className="space-y-1">
          <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
            INTERACTIVE TOOLING
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground font-display">
            Execution Studios &amp; Certification
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Micro-Model Studio */}
          <Link
            href={`${basePath}/lab`}
            className="group rounded-xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-5 hover:border-foreground/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  // STUDIO_01
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-500 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  LIVE BENCH
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                The Micro-Model Studio
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Step inside a deterministic machine learning execution loop. Directly adjust weight coefficients (w), bias offsets (b), activation functions (Sigmoid, ReLU, Step), and observe realtime decision boundaries across Customer Sentiment, Credit Risk, and Spam detection presets.
              </p>

              <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 font-mono text-[11px] text-muted-foreground space-y-1">
                <div>PIPELINE: x &rarr; [w &middot; x + b] &rarr; &sigma;(z) &rarr; &tau; &rarr; &#375;</div>
                <div className="text-foreground">COMPUTATION: 100% Client-Side Reactive Telemetry</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-foreground group-hover:translate-x-1 transition-transform">
              Launch Studio Bench <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* Certification Problems */}
          <Link
            href={`${basePath}/problems`}
            className="group rounded-xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-5 hover:border-foreground/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  // AUDIT_01
                </span>
                <span className="rounded border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  10 PRODUCTION SCENARIOS
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                Scenario Certification Arena
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Test your engineering intuition on real failure modes: VRAM consumption during training vs inference, backpropagation gradient explosion, hyperparameter misconfigurations, and non-linear activation collapse.
              </p>

              <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 font-mono text-[11px] text-muted-foreground space-y-1">
                <div>TOPICS: Memory Buffers, Activation Saturation, Parameter Bounds</div>
                <div className="text-foreground">PASS CRITERIA: 80% First-Principles Score</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-foreground group-hover:translate-x-1 transition-transform">
              Enter Certification Arena <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 6. First-Principles AI Manifesto */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            THE FIRST-PRINCIPLES AI MANIFESTO
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-display">
            Why Deconstruct AI Foundations?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Modern tutorials treat AI as a mystical black-box API. Real AI engineering starts by inspecting the deterministic mathematical pipelines that make models work:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2 rounded-xl border border-border/60 bg-secondary/20 p-5">
            <span className="font-mono text-xs font-bold text-foreground">
              01 // STATE OVER SYNTAX
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You don&apos;t understand neural networks by copying PyTorch snippets. You understand them by watching how weight matrices scale inputs and how non-linear activations warp vector space.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-border/60 bg-secondary/20 p-5">
            <span className="font-mono text-xs font-bold text-foreground">
              02 // ZERO BLACK BOXES
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every abstraction layer is deconstructed: from single neuron linear algebra z = w &middot; x + b up to multi-head self-attention and KV cache memory constraints.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-border/60 bg-secondary/20 p-5">
            <span className="font-mono text-xs font-bold text-foreground">
              03 // DETERMINISTIC CLIENT RUNTIME
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every visualization is computed live in your browser using pure JavaScript and TypeScript. Zero server latency, zero paywalls, zero marketing fluff.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Bottom Navigation Ribbon */}
      <section className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          <span>SHORTCUTS:</span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground font-semibold">/</kbd>
            Search
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground font-semibold">Esc</kbd>
            Clear
          </span>
        </div>

        <div>
          CSCosmos &bull; AI Engineering Foundations &bull; 26 Interactive Modules
        </div>
      </section>
    </div>
  );
}
