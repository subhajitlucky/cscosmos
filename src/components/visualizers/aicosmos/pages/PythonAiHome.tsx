'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  pythonAiSubtopics,
  pythonAiCategories,
} from '../data/python-ai';
import {
  Cpu,
  Terminal,
  Layers,
  ArrowRight,
  Code2,
  Sparkles,
  Search,
  CheckCircle2,
  Zap,
  Activity,
  Workflow,
  ShieldCheck,
} from 'lucide-react';

export function PythonAiHome() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = pythonAiSubtopics.filter((topic) => {
    const matchesCategory =
      selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.keyPoints.some((kp) =>
        kp.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-8 md:p-12">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
            <Cpu className="h-3.5 w-3.5" />
            Subject 02 // AI Engineering Roadmap
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--ai-text)]">
            Python for AI Engineering
          </h1>

          <p className="text-lg md:text-xl text-[var(--ai-muted)] leading-relaxed font-normal">
            Master the low-level systems engineering of Python that underpins modern generative AI:
            CPython memory internals, GIL bypasses, SIMD-accelerated tensor vectorization,
            non-blocking asyncio event loops, streaming generators, and Rust-powered Pydantic schema validation.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/aicosmos/learn/python-for-ai-engineering/cpython-memory-model-pyobject"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:scale-[1.02]"
            >
              Start Module 1 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/aicosmos/python-for-ai-engineering/lab"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--ai-text)] transition-colors hover:border-blue-500/50 hover:bg-blue-500/5"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              Async & Memory Studio
            </Link>
            <Link
              href="/aicosmos/python-for-ai-engineering/problems"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--ai-text)] transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Certification Arena
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-[var(--ai-border)] pt-8 md:grid-cols-4">
          <div className="space-y-1">
            <div className="text-2xl md:text-3xl font-bold font-mono text-[var(--ai-text)]">
              24
            </div>
            <div className="text-xs text-[var(--ai-muted)] uppercase tracking-wider font-mono">
              In-Depth Subtopics
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl md:text-3xl font-bold font-mono text-blue-400">
              5
            </div>
            <div className="text-xs text-[var(--ai-muted)] uppercase tracking-wider font-mono">
              Core Modules
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl md:text-3xl font-bold font-mono text-amber-400">
              1
            </div>
            <div className="text-xs text-[var(--ai-muted)] uppercase tracking-wider font-mono">
              Interactive Studio
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
              10
            </div>
            <div className="text-xs text-[var(--ai-muted)] uppercase tracking-wider font-mono">
              Certification Checks
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ai-muted)]" />
            <input
              type="text"
              placeholder="Search Python memory, GIL, vectorization, asyncio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] py-2.5 pl-10 pr-4 text-sm text-[var(--ai-text)] placeholder-[var(--ai-muted)] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {pythonAiCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-[var(--ai-border)] bg-[var(--ai-card)] text-[var(--ai-muted)] hover:text-[var(--ai-text)] hover:border-blue-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-[var(--ai-muted)]">
          Showing {filteredTopics.length} of {pythonAiSubtopics.length} engineering subtopics
        </div>
      </div>

      {/* Subtopics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/aicosmos/learn/python-for-ai-engineering/${topic.id}`}
            className="group relative flex flex-col justify-between rounded-xl border border-[var(--ai-border)] bg-[var(--ai-card)] p-5 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-blue-400">
                  #{String(topic.number).padStart(2, '0')}
                </span>
                <span className="rounded-full border border-[var(--ai-border)] bg-[var(--ai-bg)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--ai-muted)]">
                  {topic.category}
                </span>
              </div>

              <h2 className="text-base font-bold text-[var(--ai-text)] group-hover:text-blue-400 transition-colors line-clamp-1">
                {topic.title}
              </h2>

              <p className="text-xs text-[var(--ai-muted)] leading-relaxed line-clamp-3">
                {topic.definition}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--ai-border)]/60 pt-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--ai-muted)]">
                <Code2 className="h-3 w-3 text-blue-400" />
                {topic.visualization.replace(/-/g, ' ')}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:translate-x-0.5 transition-transform">
                Deep Dive <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Interactive Lab Spotlight Banner */}
      <section className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/20 via-[var(--ai-card)] to-indigo-950/20 p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-amber-400">
              <Zap className="h-4 w-4" />
              Hands-On Studio Workbench
            </div>
            <h2 className="text-2xl font-bold text-[var(--ai-text)]">
              The Python AI Memory & Async Execution Studio
            </h2>
            <p className="text-sm text-[var(--ai-muted)] leading-relaxed">
              Interactively inspect the 8x memory footprint difference between Python object pointer lists and contiguous C-order tensor buffers.
              Simulate high-concurrency async LLM fan-out, semaphore rate limits, token generation throughput, and Pydantic validation error repair.
            </p>
          </div>
          <Link
            href="/aicosmos/python-for-ai-engineering/lab"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500"
          >
            Launch Execution Studio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Certification Challenge Arena Spotlight */}
      <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-[var(--ai-card)] to-teal-950/20 p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              Evaluation Arena
            </div>
            <h2 className="text-2xl font-bold text-[var(--ai-text)]">
              Python for AI Engineering Certification Arena
            </h2>
            <p className="text-sm text-[var(--ai-muted)] leading-relaxed">
              Test your mastery of CPython reference cycles, GIL contention in deep learning pipelines,
              zero-copy strides, asyncio event loop starvation, and Rust-accelerated Pydantic v2 schemas.
            </p>
          </div>
          <Link
            href="/aicosmos/python-for-ai-engineering/problems"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500"
          >
            Enter Certification Arena <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
