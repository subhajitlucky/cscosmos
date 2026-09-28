'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sliders,
  ShieldCheck,
  Layers,
  ChevronRight,
  Sparkles,
  Table as TableIcon
} from 'lucide-react';
import { foundationSubtopics } from '../data/foundations';

interface FoundationHomeProps {
  basePath?: string;
}

interface PhaseMetadata {
  number: string;
  name: string;
  category: string;
  moduleCount: number;
  firstTopicId: string;
  description: string;
}

const PHASES: PhaseMetadata[] = [
  {
    number: '01',
    name: 'Core Mental Models',
    category: 'Core Mental Models',
    moduleCount: 8,
    firstTopicId: 'what-is-artificial-intelligence',
    description: 'Foundations of cognitive systems, learned parameters vs handcrafted rules, continuous representations, and tokenized language spaces.',
  },
  {
    number: '02',
    name: 'Lifecycle & Systems Architecture',
    category: 'Lifecycle & Roles',
    moduleCount: 4,
    firstTopicId: 'ai-vs-ml-engineer-vs-data-scientist',
    description: 'Engineering role taxonomies, Software 1.0 vs 2.0 architectures, training loops, and production inference lifecycle.',
  },
  {
    number: '03',
    name: 'Parameters & Mathematical Mechanics',
    category: 'Parameters & Mechanics',
    moduleCount: 7,
    firstTopicId: 'parameters',
    description: 'Weights, bias offsets, feature vectors, activation non-linearities, loss functions, and decision surfaces.',
  },
  {
    number: '04',
    name: 'Systems Reliability & Drift',
    category: 'Systems & Reliability',
    moduleCount: 5,
    firstTopicId: 'what-happens-when-model-receives-input',
    description: 'Inference dataflow, probabilistic sampling, failure modes, tool integration, and cloud vs local deployment tradeoffs.',
  },
  {
    number: '05',
    name: 'Capstone Serving Pipelines',
    category: 'Pipeline Projects',
    moduleCount: 2,
    firstTopicId: 'first-tiny-ai-pipeline',
    description: 'Interactive end-to-end serving pipeline connecting raw input ingestion, feature transformations, forward pass, and live predictions.',
  },
];

export function FoundationHome({ basePath = '/ai/ai-engineering-foundations' }: FoundationHomeProps) {
  return (
    <div className="w-full">
      {/* 1. Hero Section (Audited from jsviz & htmlviz) */}
      <section className="w-full border-b border-border/80 bg-card/40">
        <div className="page-container py-16 sm:py-24 lg:py-28 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-4 py-1.5 text-xs font-mono text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">AI SYSTEMS</span>
            <span className="opacity-40">//</span>
            <span>TRACK 01 &bull; FOUNDATIONS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground font-display max-w-5xl mx-auto leading-[1.08]">
            DECONSTRUCT THE MODEL. <br className="hidden sm:inline" />
            <span className="text-muted-foreground">FROM WEIGHTS TO INFERENCE.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground font-sans leading-relaxed">
            Master the mental models, parameter mechanics, tensor transformations, and execution runtimes of artificial intelligence. 100% client-side interactive visualizers. No marketing fluff.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`${basePath}/learn/what-is-artificial-intelligence`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-8 py-4 text-sm font-mono font-bold text-background hover:bg-foreground/90 transition-colors shadow-sm"
            >
              Initialize Learning
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`${basePath}/learn`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border/80 bg-card px-8 py-4 text-sm font-mono font-bold text-foreground hover:bg-secondary/60 transition-colors"
            >
              <TableIcon className="h-4 w-4" />
              All 26 Topics
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

      {/* 2. Divided Telemetry Stats Bar (Audited from jsviz) */}
      <section className="w-full border-b border-border/80 bg-card/20">
        <div className="page-container py-0">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/80 text-center">
            <div className="p-6 sm:p-8 space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-display text-foreground">
                26
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Curriculum Modules
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-display text-foreground">
                05
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Learning Phases
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-display text-emerald-500">
                100%
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Client-Side Reactive
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-display text-foreground">
                0ms
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Server Latency
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Core Feature Workbenches (Audited from jsviz FeatureCards) */}
      <section className="w-full border-b border-border/80">
        <div className="page-container py-16 sm:py-20 space-y-8">
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
                  Visual representations of continuous parameter spaces, loss surface geometry, and token embeddings. Built to demystify complex neural mechanics.
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
                  Deterministic sandbox runtime. Adjust weights, bias offsets, and activation functions in real-time to watch decision surfaces and classifications adapt.
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

      {/* 4. Curriculum Architecture (5 Progressive Phases, Clean & Breathable) */}
      <section className="w-full">
        <div className="page-container py-16 sm:py-20 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
                CURRICULUM ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-display">
                The 5-Phase Learning Track
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`${basePath}/learn`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/40 px-3.5 py-2 text-xs font-mono font-semibold text-foreground hover:bg-secondary/70 transition-colors"
              >
                <TableIcon className="h-3.5 w-3.5" />
                View Full Topic Directory &amp; Matrix
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {PHASES.map((phase) => {
              const phaseTopics = foundationSubtopics.filter(
                (t) => t.category === phase.category
              );

              return (
                <div
                  key={phase.number}
                  className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <span className="font-mono text-sm font-bold text-muted-foreground border border-border/80 rounded-md px-2.5 py-1 bg-secondary/30">
                        {phase.number}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                            {phase.name}
                          </h3>
                          <span className="text-[11px] font-mono text-muted-foreground rounded-full border border-border/70 px-2 py-0.5">
                            {phase.moduleCount} Modules
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-2xl">
                          {phase.description}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`${basePath}/learn/${phase.firstTopicId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground hover:text-primary transition-colors shrink-0 group"
                    >
                      Start Phase <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Individual Clickable Topic Badges/Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-border/40">
                    {phaseTopics.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`${basePath}/learn/${sub.id}`}
                        className="group/topic flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-secondary/15 p-2.5 hover:border-foreground/40 hover:bg-secondary/40 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono font-bold text-muted-foreground group-hover/topic:text-foreground shrink-0 text-[11px]">
                            {String(sub.number).padStart(2, '0')}.
                          </span>
                          <span className="font-sans font-medium text-foreground truncate group-hover/topic:text-primary transition-colors">
                            {sub.title}
                          </span>
                        </div>
                        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/60 group-hover/topic:text-foreground group-hover/topic:translate-x-0.5 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Track CTA Banner */}
          <div className="mt-8 rounded-xl border border-border/80 bg-secondary/20 p-8 sm:p-10 text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
              Ready to Deconstruct AI Systems?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-xl mx-auto">
              Start with foundational mental models or jump directly to any of the 26 interactive modules.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`${basePath}/learn/what-is-artificial-intelligence`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors shadow-sm"
              >
                Start Module 01: What is AI?
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`${basePath}/learn`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border/80 bg-card px-6 py-3 text-xs font-mono font-bold text-foreground hover:bg-secondary/60 transition-colors"
              >
                <TableIcon className="h-3.5 w-3.5" />
                Browse 26-Module Table
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
