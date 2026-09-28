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
  CheckCircle2,
  Terminal,
  Activity,
  HardDrive,
  Workflow,
  Sparkles,
  ChevronRight,
  Gauge
} from 'lucide-react';
import { foundationSubtopics } from '../data/foundations';

interface FoundationHomeProps {
  basePath?: string;
}

const PHASES = [
  {
    number: 1,
    id: 'Core Mental Models',
    name: 'Mental Models',
    tagline: 'Symbolic vs Learned, Tokens & Taxonomies',
    modulesCount: 7,
  },
  {
    number: 2,
    id: 'Lifecycle & Roles',
    name: 'Lifecycle & Systems',
    tagline: 'Software 2.0, Compute & Engineering Roles',
    modulesCount: 4,
  },
  {
    number: 3,
    id: 'Parameters & Mechanics',
    name: 'Parameters & Math',
    tagline: 'Weights, Biases, Vectors & Activations',
    modulesCount: 8,
  },
  {
    number: 4,
    id: 'Systems & Reliability',
    name: 'Reliability & Drift',
    tagline: 'Generalization, Overfitting & Failure Modes',
    modulesCount: 4,
  },
  {
    number: 5,
    id: 'Pipeline Projects',
    name: 'Pipeline Capstones',
    tagline: 'End-to-End Reactive Serving Studio',
    modulesCount: 3,
  },
];

export function FoundationHome({ basePath = '/ai/ai-engineering-foundations' }: FoundationHomeProps) {
  // Navigation View Tab: Curriculum Roadmap vs Hardware Sizer vs Paradigm Matrix
  const [activeView, setActiveView] = useState<'curriculum' | 'hardware' | 'paradigms'>('curriculum');
  
  // Phase filter inside Curriculum tab
  const [activePhaseNumber, setActivePhaseNumber] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- VRAM & Parameter Footprint Sizer State ---
  const [modelParams, setModelParams] = useState<number>(7); // in billions
  const [precisionBytes, setPrecisionBytes] = useState<number>(2); // 2 bytes = FP16/BF16
  const [pipelineMode, setPipelineMode] = useState<'inference' | 'training'>('inference');

  const vramCalculations = useMemo(() => {
    const rawWeightGb = (modelParams * 1e9 * precisionBytes) / (1024 * 1024 * 1024);
    if (pipelineMode === 'inference') {
      const kvOverheadGb = rawWeightGb * 0.2; // ~20% KV cache buffer
      const totalGb = rawWeightGb + kvOverheadGb;
      let recommendedGpu = 'NVIDIA RTX 4070 (12 GB)';
      if (totalGb > 12 && totalGb <= 24) recommendedGpu = 'NVIDIA RTX 4090 (24 GB)';
      else if (totalGb > 24 && totalGb <= 48) recommendedGpu = '2x RTX 4090 / A6000 (48 GB)';
      else if (totalGb > 48 && totalGb <= 80) recommendedGpu = '1x NVIDIA A100 / H100 (80 GB)';
      else if (totalGb > 80) recommendedGpu = `${Math.ceil(totalGb / 80)}x NVIDIA H100 Cluster`;

      return {
        weightMemoryGb: rawWeightGb.toFixed(1),
        overheadGb: kvOverheadGb.toFixed(1),
        totalVramGb: totalGb.toFixed(1),
        recommendedGpu,
        formula: `${modelParams}B params × ${precisionBytes}B + 20% KV Cache`,
      };
    } else {
      const optimizerMultiplier = precisionBytes === 4 ? 4 : 6;
      const totalGb = rawWeightGb * optimizerMultiplier;
      let recommendedGpu = 'NVIDIA RTX 4090 (24 GB)';
      if (totalGb > 24 && totalGb <= 80) recommendedGpu = '1x NVIDIA A100 (80 GB)';
      else if (totalGb > 80 && totalGb <= 320) recommendedGpu = '4x NVIDIA H100 (320 GB)';
      else if (totalGb > 320) recommendedGpu = `${Math.ceil(totalGb / 80)}x H100 GPU Pod`;

      return {
        weightMemoryGb: rawWeightGb.toFixed(1),
        overheadGb: (totalGb - rawWeightGb).toFixed(1),
        totalVramGb: totalGb.toFixed(1),
        recommendedGpu,
        formula: `${modelParams}B × ${precisionBytes}B × ${optimizerMultiplier}x (Adam + Grads + Acts)`,
      };
    }
  }, [modelParams, precisionBytes, pipelineMode]);

  // Keyboard shortcut listener ('/' to search, 'Esc' to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        setActiveView('curriculum');
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && isInputFocused) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentPhaseObject = useMemo(() => {
    if (activePhaseNumber === 'all') return null;
    return PHASES.find((p) => p.number === activePhaseNumber);
  }, [activePhaseNumber]);

  const filteredSubtopics = useMemo(() => {
    return foundationSubtopics.filter((topic) => {
      const matchesPhase =
        activePhaseNumber === 'all' ||
        (currentPhaseObject && topic.category === currentPhaseObject.id);
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.analogy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPhase && matchesSearch;
    });
  }, [activePhaseNumber, currentPhaseObject, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14">
      {/* 1. Technical Telemetry Header Ribbon */}
      <section className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4 text-xs font-mono text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            AI_ENGINEERING // FOUNDATIONS
          </span>
          <span className="text-border">/</span>
          <span>SPEC: RUNTIME_01</span>
          <span className="text-border hidden sm:inline">/</span>
          <span className="hidden sm:inline">ZERO_GRADIENTS</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded border border-border/80 bg-secondary/30 px-2 py-0.5 text-[10px] uppercase font-mono text-muted-foreground">
            26 MODULES &bull; 5 PHASES
          </span>
        </div>
      </section>

      {/* 2. Spacious Architectural Hero (Airy, High Impact, Restrained) */}
      <section className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-secondary/40 px-2.5 py-1 text-xs font-mono text-muted-foreground">
          <Terminal className="h-3.5 w-3.5 text-foreground" />
          <span>PHASE 01 &bull; TOPIC 01</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground font-display leading-[1.06]">
          AI ENGINEERING <br />
          FOUNDATIONS.
        </h1>

        <p className="text-base sm:text-lg leading-relaxed text-muted-foreground font-sans">
          Deconstruct continuous parameter spaces, tensor transformations, deterministic forward passes, and probabilistic inference runtimes. Master how learned weights execute from silicon memory to production serving.
        </p>

        {/* Primary Action Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`${basePath}/learn/what-is-artificial-intelligence`}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-xs sm:text-sm font-mono font-semibold text-background hover:bg-foreground/90 transition-colors"
          >
            Start Curriculum <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={`${basePath}/lab`}
            className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/30 px-4 py-3 text-xs sm:text-sm font-mono font-semibold text-foreground hover:bg-secondary/60 transition-colors"
          >
            <Sliders className="h-4 w-4 text-emerald-500" /> Micro-Model Studio
          </Link>

          <Link
            href={`${basePath}/problems`}
            className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/30 px-4 py-3 text-xs sm:text-sm font-mono font-semibold text-foreground hover:bg-secondary/60 transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-foreground" /> 10 Scenarios
          </Link>
        </div>
      </section>

      {/* 3. Perspective Mode Switcher (Curriculum vs Hardware Sizer vs Paradigms) */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border/80 bg-secondary/30">
            <button
              onClick={() => setActiveView('curriculum')}
              className={`px-3.5 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeView === 'curriculum'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Curriculum (26)</span>
            </button>

            <button
              onClick={() => setActiveView('hardware')}
              className={`px-3.5 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeView === 'hardware'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <HardDrive className="h-3.5 w-3.5" />
              <span>VRAM Sizer</span>
            </button>

            <button
              onClick={() => setActiveView('paradigms')}
              className={`px-3.5 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeView === 'paradigms'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Workflow className="h-3.5 w-3.5" />
              <span>Paradigm Matrix</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 text-muted-foreground text-[11px]">
            <span>PRESS <kbd className="border border-border/80 px-1 py-0.5 rounded bg-secondary">/</kbd> TO SEARCH</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: CURRICULUM ROADMAP (DEFAULT)                                      */}
        {/* ========================================================================= */}
        {activeView === 'curriculum' && (
          <div className="space-y-8">
            {/* Phase Navigation Tabs */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
                  <button
                    onClick={() => setActivePhaseNumber('all')}
                    className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                      activePhaseNumber === 'all'
                        ? 'border-foreground bg-foreground text-background font-bold'
                        : 'border-border/80 bg-secondary/20 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All Modules (26)
                  </button>

                  {PHASES.map((p) => {
                    const isSelected = activePhaseNumber === p.number;
                    return (
                      <button
                        key={p.number}
                        onClick={() => setActivePhaseNumber(p.number)}
                        className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                          isSelected
                            ? 'border-foreground bg-foreground text-background font-bold'
                            : 'border-border/80 bg-secondary/20 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        0{p.number} {p.name} ({p.modulesCount})
                      </button>
                    );
                  })}
                </div>

                {/* Inline Search */}
                <div className="relative w-full sm:w-64 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-border/80 bg-secondary/30 pl-8 pr-8 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-foreground/40 focus:bg-background focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Active Phase Banner Description */}
              {currentPhaseObject && (
                <div className="rounded-lg border border-border/60 bg-secondary/20 px-4 py-2.5 flex items-center justify-between font-mono text-xs">
                  <div className="space-x-2">
                    <span className="font-bold text-foreground">
                      PHASE 0{currentPhaseObject.number}: {currentPhaseObject.name.toUpperCase()}
                    </span>
                    <span className="text-muted-foreground">&bull; {currentPhaseObject.tagline}</span>
                  </div>
                  <span className="text-muted-foreground text-[11px]">
                    {currentPhaseObject.modulesCount} MODULES
                  </span>
                </div>
              )}
            </div>

            {/* Subtopic Cards Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubtopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`${basePath}/learn/${topic.id}`}
                  className="group rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between hover:border-foreground/40 transition-colors space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-foreground">
                        // MOD_{String(topic.number).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground font-mono">
                        {topic.category.split(' ')[0]}
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                      {topic.title}
                    </h2>

                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
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
              ))}
            </div>

            {filteredSubtopics.length === 0 && (
              <div className="rounded-xl border border-dashed border-border/80 p-12 text-center space-y-2">
                <p className="font-mono text-sm text-muted-foreground">
                  No modules match &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActivePhaseNumber('all');
                  }}
                  className="font-mono text-xs text-foreground underline underline-offset-4"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: HARDWARE & VRAM SIZER                                             */}
        {/* ========================================================================= */}
        {activeView === 'hardware' && (
          <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1 border-b border-border/60 pb-3">
              <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">
                HARDWARE SIZING CALCULUS
              </span>
              <h2 className="font-display font-bold text-xl text-foreground">
                Model Parameter &amp; GPU VRAM Sizer
              </h2>
              <p className="text-xs text-muted-foreground">
                Calculate memory allocation requirements for weights, KV cache, and optimizer states.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Controls */}
              <div className="lg:col-span-6 space-y-5 font-mono text-xs">
                <div className="space-y-2">
                  <label className="text-muted-foreground font-semibold">PARAMETERS:</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 7, 13, 70, 405].map((p) => (
                      <button
                        key={p}
                        onClick={() => setModelParams(p)}
                        className={`py-2 rounded-lg border text-center transition-colors ${
                          modelParams === p
                            ? 'border-foreground bg-foreground text-background font-bold'
                            : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {p}B
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground font-semibold">PRECISION:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'FP32', bytes: 4, desc: '4 Bytes' },
                      { label: 'FP16', bytes: 2, desc: '2 Bytes' },
                      { label: 'INT8', bytes: 1, desc: '1 Byte' },
                      { label: 'INT4', bytes: 0.5, desc: '0.5 Byte' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setPrecisionBytes(item.bytes)}
                        className={`py-2 rounded-lg border text-center transition-colors ${
                          precisionBytes === item.bytes
                            ? 'border-foreground bg-foreground text-background font-bold'
                            : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[10px] opacity-70">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground font-semibold">PIPELINE WORKLOAD:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPipelineMode('inference')}
                      className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                        pipelineMode === 'inference'
                          ? 'border-foreground bg-foreground text-background font-bold'
                          : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Inference Serving
                    </button>
                    <button
                      onClick={() => setPipelineMode('training')}
                      className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                        pipelineMode === 'training'
                          ? 'border-foreground bg-foreground text-background font-bold'
                          : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Full Training (Adam)
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Results */}
              <div className="lg:col-span-6 rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="font-bold text-foreground">HARDWARE TELEMETRY</span>
                  <span className="text-[11px] text-muted-foreground">{vramCalculations.formula}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/80 bg-card p-3 space-y-1">
                    <span className="text-[10px] text-muted-foreground">WEIGHTS MEMORY</span>
                    <div className="text-xl font-black font-display text-foreground">
                      {vramCalculations.weightMemoryGb} GB
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/80 bg-card p-3 space-y-1">
                    <span className="text-[10px] text-muted-foreground">
                      {pipelineMode === 'inference' ? 'KV CACHE BUFFER' : 'OPTIMIZER + GRADS'}
                    </span>
                    <div className="text-xl font-black font-display text-foreground">
                      {vramCalculations.overheadGb} GB
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border/80 bg-card p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">MINIMUM GPU VRAM:</span>
                    <span className="text-2xl font-black font-display text-emerald-500">
                      {vramCalculations.totalVramGb} GB
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Hardware Target:</span>
                    <span className="font-bold text-foreground">{vramCalculations.recommendedGpu}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: PARADIGMS MATRIX                                                  */}
        {/* ========================================================================= */}
        {activeView === 'paradigms' && (
          <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 space-y-4">
            <div className="space-y-1 border-b border-border/60 pb-3">
              <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">
                ARCHITECTURAL COMPARISON
              </span>
              <h2 className="font-display font-bold text-xl text-foreground">
                The Computing Continuum: Rules &rarr; ML &rarr; Deep Learning &rarr; LLMs
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground">
                    <th className="py-2.5 px-3">PARADIGM</th>
                    <th className="py-2.5 px-3">STATE SPECIFICATION</th>
                    <th className="py-2.5 px-3">EXECUTION MODEL</th>
                    <th className="py-2.5 px-3">DETERMINISM</th>
                    <th className="py-2.5 px-3">PRIMARY FAILURE MODE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr>
                    <td className="py-3 px-3 font-bold text-foreground">01 // Symbolic Rules</td>
                    <td className="py-3 px-3 text-muted-foreground">Handwritten if/else ASTs</td>
                    <td className="py-3 px-3">Branching logic</td>
                    <td className="py-3 px-3 text-emerald-500 font-semibold">100% Deterministic</td>
                    <td className="py-3 px-3 text-rose-500">Unforeseen edge cases</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-foreground">02 // Classical ML</td>
                    <td className="py-3 px-3 text-muted-foreground">Learned weights &amp; tree splits</td>
                    <td className="py-3 px-3">Feature dot products</td>
                    <td className="py-3 px-3 text-emerald-500 font-semibold">Deterministic forward</td>
                    <td className="py-3 px-3 text-rose-500">Feature scale &amp; drift</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-foreground">03 // Deep Learning</td>
                    <td className="py-3 px-3 text-muted-foreground">Stacked continuous tensors</td>
                    <td className="py-3 px-3">Matrix multiplications</td>
                    <td className="py-3 px-3 text-emerald-500 font-semibold">Deterministic forward</td>
                    <td className="py-3 px-3 text-rose-500">Vanishing gradients</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-foreground">04 // Autoregressive LLM</td>
                    <td className="py-3 px-3 text-muted-foreground">Billion-parameter KV cache</td>
                    <td className="py-3 px-3">Attention + Softmax</td>
                    <td className="py-3 px-3 text-amber-500 font-semibold">Probabilistic (T &gt; 0)</td>
                    <td className="py-3 px-3 text-rose-500">Hallucination &amp; context drift</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* 4. Flagship Interactive Studios Cards */}
      <section className="space-y-4 pt-4 border-t border-border/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Micro-Model Studio */}
          <Link
            href={`${basePath}/lab`}
            className="group rounded-xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-4 hover:border-foreground/40 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">// STUDIO_01</span>
                <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 font-semibold text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  LIVE BENCH
                </span>
              </div>

              <h2 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                The Micro-Model Studio
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Step inside an interactive machine learning pipeline. Adjust weights (w), bias (b), activation functions (Sigmoid, ReLU, Step), and observe decision boundaries live across Sentiment, Credit, and Spam presets.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-foreground group-hover:translate-x-1 transition-transform">
              Launch Studio Bench <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* Certification Problems */}
          <Link
            href={`${basePath}/problems`}
            className="group rounded-xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-4 hover:border-foreground/40 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">// AUDIT_01</span>
                <span className="text-muted-foreground text-[11px]">
                  10 PRODUCTION SCENARIOS
                </span>
              </div>

              <h2 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                Scenario Certification Arena
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Test your engineering intuition on real failure modes: VRAM allocation in training vs inference, gradient explosion, hyperparameter misconfigurations, and non-linear activation collapse.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-foreground group-hover:translate-x-1 transition-transform">
              Enter Certification Arena <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Minimal Keyboard Footer Ribbon */}
      <footer className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
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

        <div>
          CSCosmos &bull; AI Engineering Foundations &bull; 26 Compiled Modules
        </div>
      </footer>
    </div>
  );
}
