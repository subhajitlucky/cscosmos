'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  HelpCircle,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Cpu,
  Sliders,
  ShieldCheck,
  Workflow
} from 'lucide-react';
import { foundationSubtopics, foundationCategories } from '../data/foundations';

interface FoundationHomeProps {
  basePath?: string;
}

export function FoundationHome({ basePath = '/ai/ai-engineering-foundations' }: FoundationHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubtopics = useMemo(() => {
    return foundationSubtopics.filter((topic) => {
      const matchesCategory =
        selectedCategory === 'All' || topic.category === selectedCategory;
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.analogy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const stats = [
    { value: '26', label: 'Foundational Subtopics', icon: BookOpen, color: 'text-indigo-400' },
    { value: '05', label: 'Curriculum Phases', icon: Layers, color: 'text-purple-400' },
    { value: '01', label: 'Micro-Model Studio', icon: FlaskConical, color: 'text-emerald-400' },
    { value: '10', label: 'Certification Problems', icon: HelpCircle, color: 'text-cyan-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--ai-border)] bg-[var(--ai-surface)] p-8 md:p-14 shadow-2xl">
        <div className="absolute inset-0 ai-grid-bg opacity-40" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--ai-primary)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ai-primary)]/40 bg-[var(--ai-primary)]/15 px-3 py-1 text-xs font-mono text-[var(--ai-primary)] font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> PHASE 01 &bull; TOPIC 01
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Core Foundation
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--ai-text)] leading-[1.08]">
            AI Engineering <br className="hidden sm:inline" />
            <span className="text-[var(--ai-primary)] ai-glow">Foundations</span>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-[var(--ai-muted)] max-w-2xl font-normal">
            Master the mental models, vocabulary, parameter mechanics, and software architecture of artificial intelligence before writing complex model code. Understand how data transforms into learned weights and probabilistic runtime inference.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`${basePath}/learn/what-is-artificial-intelligence`}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--ai-primary)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--ai-primary-hover)] transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
            >
              Start Learning (Subtopic 1) <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`${basePath}/lab`}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-surface-2)] px-5 py-3.5 text-sm font-semibold text-[var(--ai-text)] hover:border-[var(--ai-primary)] transition-all active:scale-95"
            >
              <FlaskConical className="w-4 h-4 text-emerald-400" /> Open Micro-Model Studio
            </Link>
            <Link
              href={`${basePath}/problems`}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--ai-border-subtle)] bg-transparent px-5 py-3.5 text-sm font-semibold text-[var(--ai-muted)] hover:text-[var(--ai-text)] hover:border-[var(--ai-border)] transition-all"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" /> Knowledge Check
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ value, label, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-6 space-y-2 hover:border-[var(--ai-border)] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black font-display text-[var(--ai-text)]">{value}</span>
              <div className={`p-2.5 rounded-xl bg-white/5 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xs font-mono text-[var(--ai-muted)] uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </section>

      {/* Filter & Search Bar */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[var(--ai-primary)] font-semibold uppercase tracking-wider">Curriculum Roadmap</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--ai-text)]">
              26 Foundational Modules
            </h2>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ai-muted)]" />
            <input
              type="text"
              placeholder="Search concepts (e.g. weights, bias, inference)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] text-xs font-mono text-[var(--ai-text)] placeholder:text-[var(--ai-muted)] focus:outline-none focus:border-[var(--ai-primary)]"
            />
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {foundationCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-[var(--ai-primary)] text-white font-semibold shadow-md'
                  : 'border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] text-[var(--ai-muted)] hover:text-[var(--ai-text)] hover:border-[var(--ai-border)]'
              }`}
            >
              {category} {category === 'All' ? `(${foundationSubtopics.length})` : `(${foundationSubtopics.filter(t => t.category === category).length})`}
            </button>
          ))}
        </div>

        {/* Subtopic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubtopics.map((topic) => (
            <Link
              key={topic.id}
              href={`${basePath}/learn/${topic.id}`}
              className="ai-card rounded-2xl p-6 group flex flex-col justify-between hover:border-[var(--ai-primary)]/60 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[var(--ai-primary)] px-2 py-0.5 rounded-md bg-[var(--ai-primary)]/10 border border-[var(--ai-primary)]/20">
                    MODULE_{String(topic.number).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[var(--ai-muted)] border border-white/5 bg-white/5 px-2 py-0.5 rounded">
                    {topic.category}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-[var(--ai-text)] group-hover:text-[var(--ai-primary)] transition-colors leading-snug">
                  {topic.title}
                </h3>

                <p className="text-xs leading-relaxed text-[var(--ai-muted)] line-clamp-3">
                  {topic.definition}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--ai-border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--ai-muted)] group-hover:text-[var(--ai-text)]">
                <span className="flex items-center gap-1.5 text-[var(--ai-primary)]">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Canvas
                </span>
                <span className="inline-flex items-center gap-1 text-[var(--ai-primary)] font-semibold group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Hub Jump Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[var(--ai-border-subtle)]">
        <Link
          href={`${basePath}/lab`}
          className="ai-card rounded-2xl p-6 flex flex-col justify-between space-y-4 group hover:border-emerald-500/50"
        >
          <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-[var(--ai-text)] group-hover:text-emerald-400 transition-colors">
              The Micro-Model Studio
            </h3>
            <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
              Step inside a transparent deterministic pipeline: adjust weights, bias, activation functions, and classification thresholds live.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 inline-flex items-center gap-1 font-semibold">
            Launch Sandbox &rarr;
          </span>
        </Link>

        <Link
          href={`${basePath}/problems`}
          className="ai-card rounded-2xl p-6 flex flex-col justify-between space-y-4 group hover:border-cyan-500/50"
        >
          <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-[var(--ai-text)] group-hover:text-cyan-400 transition-colors">
              10 Certification Problems
            </h3>
            <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
              Challenge your intuition on parameters, training vs inference latency, failure modes, and engineering tradeoffs with instant feedback.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 inline-flex items-center gap-1 font-semibold">
            Take Knowledge Check &rarr;
          </span>
        </Link>

        <Link
          href="/ai"
          className="ai-card rounded-2xl p-6 flex flex-col justify-between space-y-4 group hover:border-indigo-500/50"
        >
          <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-[var(--ai-primary)]">
            <Workflow className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-[var(--ai-text)] group-hover:text-[var(--ai-primary)] transition-colors">
              Full AI Curriculum Map
            </h3>
            <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
              Explore the entire 100-topic roadmap across Neural Networks, Transformers, Advanced RAG, and Autonomous ReAct Agents.
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--ai-primary)] inline-flex items-center gap-1 font-semibold">
            View All AI Topics &rarr;
          </span>
        </Link>
      </section>
    </div>
  );
}
