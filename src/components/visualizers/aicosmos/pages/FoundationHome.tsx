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
  Workflow,
  HardDrive,
  RotateCcw,
  Gauge,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { foundationSubtopics, foundationCategories } from '../data/foundations';

interface FoundationHomeProps {
  basePath?: string;
}

export function FoundationHome({ basePath = '/ai/ai-engineering-foundations' }: FoundationHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Hero Mini-Interactive Neuron State ---
  const [heroInput, setHeroInput] = useState<number>(1.5);
  const [heroWeight, setHeroWeight] = useState<number>(1.2);
  const [heroBias, setHeroBias] = useState<number>(-0.4);
  const [heroActivation, setHeroActivation] = useState<'sigmoid' | 'relu' | 'step'>('sigmoid');

  const heroRawZ = heroWeight * heroInput + heroBias;
  const heroActivated = useMemo(() => {
    if (heroActivation === 'sigmoid') return 1 / (1 + Math.exp(-heroRawZ));
    if (heroActivation === 'relu') return Math.max(0, heroRawZ);
    if (heroActivation === 'step') return heroRawZ >= 0 ? 1 : 0;
    return heroRawZ;
  }, [heroRawZ, heroActivation]);

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
        formula: `${modelParams}B params × ${precisionBytes}B + 20% KV Buffer`,
      };
    } else {
      // Training with Adam: Weights (1x) + Gradients (1x) + Adam Momentum (2x) = 4x weight memory + activations
      const optimizerMultiplier = precisionBytes === 4 ? 4 : 6; // Adam optimizer states
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

  const phaseRoadmap = [
    { id: 'Core Mental Models', label: 'PHASE 01', title: 'Core Mental Models', count: 7, desc: 'Symbolic vs Learned, Tokens & Taxonomies' },
    { id: 'Lifecycle & Roles', label: 'PHASE 02', title: 'Systems & Roles', count: 4, desc: 'Software 2.0, Lifecycle & Compute Tradeoffs' },
    { id: 'Parameters & Mechanics', label: 'PHASE 03', title: 'Parameters & Math', count: 8, desc: 'Weights, Biases, Vectors & Activations' },
    { id: 'Systems & Reliability', label: 'PHASE 04', title: 'Systems & Reliability', count: 4, desc: 'Generalization, Overfitting & Drift' },
    { id: 'Pipeline Projects', label: 'PHASE 05', title: 'Capstone Pipelines', count: 3, desc: 'End-to-End Reactive Serving Studio' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Technical Telemetry Header Ribbon */}
      <section className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4 text-xs font-mono text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            AI_ENGINEERING // FOUNDATIONS
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

      {/* 2. Architectural Split Hero with Live "First Neuron" Interactive Workbench */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission Manifesto & Action CTAs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-1 text-xs font-mono text-muted-foreground">
              <Terminal className="h-3.5 w-3.5 text-foreground" />
              <span>FIRST-PRINCIPLES MACHINE LEARNING</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground font-display leading-[1.08]">
              DECONSTRUCT THE MODEL. <br />
              <span className="text-muted-foreground">FROM WEIGHT MATRICES TO INFERENCE RUNTIMES.</span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground font-sans max-w-2xl">
              AI engineering is not writing prose prompts. It is the deterministic software architecture of learned continuous parameters, tensor transformations, non-linear activation bounds, and probabilistic execution runtimes. Master how raw numbers turn into learned representations before writing deep model code.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`${basePath}/learn/what-is-artificial-intelligence`}
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-xs sm:text-sm font-mono font-semibold text-background hover:bg-foreground/90 transition-colors"
              >
                Begin Module 01 <ArrowRight className="h-4 w-4" />
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

          {/* Right Column: Live Interactive "First Neuron" Hero Canvas */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs font-mono">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  LIVE BENCH // THE FIRST NEURON
                </span>
                <span className="text-[10px] text-muted-foreground">INTERACTIVE TELEMETRY</span>
              </div>

              {/* Formula & Live Calculation Readout */}
              <div className="rounded-lg border border-border/80 bg-card p-4 space-y-2 font-mono text-xs">
                <div className="text-muted-foreground text-[11px]">Forward Computation:</div>
                <div className="text-sm font-bold text-foreground">
                  z = (w &times; x) + b = ({heroWeight.toFixed(2)} &times; {heroInput.toFixed(2)}) + {heroBias.toFixed(2)} = <span className="underline">{heroRawZ.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px]">
                  <span className="text-muted-foreground">Activation &sigma;(z):</span>
                  <span className="font-bold text-emerald-500 text-sm">
                    {heroActivation === 'step'
                      ? `${heroActivated.toFixed(0)} (Binary)`
                      : `${(heroActivated * 100).toFixed(1)}%`}
                  </span>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Input Feature (x)</span>
                    <span className="font-bold text-foreground">{heroInput.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.1"
                    value={heroInput}
                    onChange={(e) => setHeroInput(parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Learned Weight (w)</span>
                    <span className="font-bold text-foreground">{heroWeight.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.1"
                    value={heroWeight}
                    onChange={(e) => setHeroWeight(parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Bias Offset (b)</span>
                    <span className="font-bold text-foreground">{heroBias.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={heroBias}
                    onChange={(e) => setHeroBias(parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
              </div>

              {/* Activation Function Selectors */}
              <div className="flex items-center gap-1.5 pt-1 font-mono text-[11px]">
                <span className="text-muted-foreground mr-1">Act:</span>
                {(['sigmoid', 'relu', 'step'] as const).map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setHeroActivation(fn)}
                    className={`flex-1 py-1 rounded border text-center transition-colors ${
                      heroActivation === fn
                        ? 'border-foreground bg-foreground text-background font-bold'
                        : 'border-border/80 bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {fn.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
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

      {/* 4. Interactive Tool: Model Parameter & VRAM Footprint Sizer */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              HARDWARE REALITY TOOL
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-display">
              Model Parameter &amp; VRAM Footprint Sizer
            </h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Standard ML Systems Calculus
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-5 font-mono text-xs">
            {/* Parameters Selector */}
            <div className="space-y-2">
              <label className="text-muted-foreground font-semibold">
                MODEL PARAMETER COUNT:
              </label>
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

            {/* Precision Selector */}
            <div className="space-y-2">
              <label className="text-muted-foreground font-semibold">
                WEIGHT NUMERICAL PRECISION:
              </label>
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

            {/* Pipeline Mode */}
            <div className="space-y-2">
              <label className="text-muted-foreground font-semibold">
                EXECUTION WORKLOAD:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPipelineMode('inference')}
                  className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                    pipelineMode === 'inference'
                      ? 'border-foreground bg-foreground text-background font-bold'
                      : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Inference Serving (Frozen Weights + KV)
                </button>
                <button
                  onClick={() => setPipelineMode('training')}
                  className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                    pipelineMode === 'training'
                      ? 'border-foreground bg-foreground text-background font-bold'
                      : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Full Training (Adam Optimizer + Gradients)
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-6 rounded-xl border border-border/80 bg-secondary/20 p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="font-bold text-foreground">TELEMETRY ESTIMATE</span>
              <span className="text-[11px] text-muted-foreground">{vramCalculations.formula}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border/80 bg-card p-4 space-y-1">
                <span className="text-[11px] text-muted-foreground">STATIC WEIGHTS MEMORY</span>
                <div className="text-2xl font-black font-display text-foreground">
                  {vramCalculations.weightMemoryGb} <span className="text-xs font-mono">GB</span>
                </div>
              </div>

              <div className="rounded-lg border border-border/80 bg-card p-4 space-y-1">
                <span className="text-[11px] text-muted-foreground">
                  {pipelineMode === 'inference' ? 'KV CACHE OVERHEAD' : 'OPTIMIZER & GRADS'}
                </span>
                <div className="text-2xl font-black font-display text-foreground">
                  {vramCalculations.overheadGb} <span className="text-xs font-mono">GB</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border/80 bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">MINIMUM GPU VRAM REQUIRED:</span>
                <span className="text-2xl font-black font-display text-emerald-500">
                  {vramCalculations.totalVramGb} GB
                </span>
              </div>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Target Hardware Archetype:</span>
                <span className="font-bold text-foreground">{vramCalculations.recommendedGpu}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5-Phase Architecture Pipeline Stepper */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
            CURRICULUM ARCHITECTURE
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground font-display">
            The 5 Phases of AI Engineering
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {phaseRoadmap.map((phase) => {
            const isSelected = selectedCategory === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedCategory(phase.id)}
                className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border/80 bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold">
                    <span>{phase.label}</span>
                    <span className="rounded px-1.5 py-0.5 border border-current">
                      {phase.count} MODS
                    </span>
                  </div>
                  <div className="font-display font-bold text-sm text-foreground">
                    {phase.title}
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed line-clamp-2">
                  {phase.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. Interactive Command & Filter Deck */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              MODULE MATRIX
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-display">
              Explore 26 Foundational Modules
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
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
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
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'border border-foreground bg-foreground text-background font-semibold'
                    : 'border border-border/80 bg-secondary/30 text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] ${
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

      {/* 7. Comparative Paradigm Matrix: Rules vs ML vs Deep Learning vs LLMs */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
            PARADIGM MATRIX
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground font-display">
            The Computing Spectrum: Rules &rarr; Deep Learning &rarr; LLMs
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Understanding where traditional software ends and learned representations begin:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground">
                <th className="py-3 px-3">PARADIGM</th>
                <th className="py-3 px-3">STATE SPECIFICATION</th>
                <th className="py-3 px-3">EXECUTION MODEL</th>
                <th className="py-3 px-3">PRIMARY DETERMINISM</th>
                <th className="py-3 px-3">PRIMARY FAILURE MODE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <tr>
                <td className="py-3 px-3 font-bold text-foreground">01 // Symbolic Rules</td>
                <td className="py-3 px-3 text-muted-foreground">Handwritten if/else ASTs</td>
                <td className="py-3 px-3">Branching conditional loops</td>
                <td className="py-3 px-3 text-emerald-500 font-semibold">100% Deterministic</td>
                <td className="py-3 px-3 text-rose-500">Unforeseen edge cases</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-foreground">02 // Classical ML</td>
                <td className="py-3 px-3 text-muted-foreground">Learned weights &amp; tree splits</td>
                <td className="py-3 px-3">Feature vector dot products</td>
                <td className="py-3 px-3 text-emerald-500 font-semibold">Deterministic forward</td>
                <td className="py-3 px-3 text-rose-500">Feature scale &amp; drift</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-foreground">03 // Deep Learning</td>
                <td className="py-3 px-3 text-muted-foreground">Stacked continuous tensors</td>
                <td className="py-3 px-3">Multi-layer matrix multiplies</td>
                <td className="py-3 px-3 text-emerald-500 font-semibold">Deterministic forward</td>
                <td className="py-3 px-3 text-rose-500">Gradient vanishing / black box</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-foreground">04 // Autoregressive LLM</td>
                <td className="py-3 px-3 text-muted-foreground">Billion-parameter KV cache</td>
                <td className="py-3 px-3">Self-attention + Softmax sample</td>
                <td className="py-3 px-3 text-amber-500 font-semibold">Probabilistic (T &gt; 0)</td>
                <td className="py-3 px-3 text-rose-500">Hallucination &amp; context drift</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Flagship Interactive Studios Showcase */}
      <section className="space-y-4 pt-4 border-t border-border/60">
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

      {/* 9. First-Principles AI Manifesto */}
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

      {/* 10. Bottom Navigation Ribbon */}
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
