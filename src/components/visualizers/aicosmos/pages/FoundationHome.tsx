'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Sliders,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  Terminal,
  Activity,
  Layers,
  Cpu
} from 'lucide-react';
import { foundationSubtopics } from '../data/foundations';

interface FoundationHomeProps {
  basePath?: string;
}

interface PhaseInfo {
  number: number;
  category: string;
  title: string;
  description: string;
}

const PHASES: PhaseInfo[] = [
  {
    number: 1,
    category: 'Core Mental Models',
    title: 'Core Mental Models',
    description: 'Foundations of cognitive systems, learned parameters, tokenization, and probabilistic execution.',
  },
  {
    number: 2,
    category: 'Lifecycle & Roles',
    title: 'Systems & Roles',
    description: 'Software 1.0 vs 2.0 architectures, compute budgets, and engineering role taxonomy.',
  },
  {
    number: 3,
    category: 'Parameters & Mechanics',
    title: 'Parameters & Mechanics',
    description: 'Weights, bias offsets, feature vectors, activation non-linearities, and decision boundaries.',
  },
  {
    number: 4,
    category: 'Systems & Reliability',
    title: 'Systems & Reliability',
    description: 'Generalization, overfitting dynamics, data distribution drift, and production failure modes.',
  },
  {
    number: 5,
    category: 'Pipeline Projects',
    title: 'Capstone Pipelines',
    description: 'End-to-end interactive serving pipeline connecting inputs, transforms, and predictions.',
  },
];

export function FoundationHome({ basePath = '/ai/ai-engineering-foundations' }: FoundationHomeProps) {
  // Accordion state: Phase 1 open by default for clean progressive disclosure
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({ 1: true });

  const togglePhase = (num: number) => {
    setOpenPhases((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const expandAll = () => {
    setOpenPhases({ 1: true, 2: true, 3: true, 4: true, 5: true });
  };

  const collapseAll = () => {
    setOpenPhases({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16">
      {/* 1. Minimal Header Kicker */}
      <div className="flex items-center justify-between border-b border-border/70 pb-4 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-2 text-foreground font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          AI_ENGINEERING // FOUNDATIONS
        </span>
        <span className="text-[11px] text-muted-foreground">
          26 LESSONS &bull; 5 PHASES &bull; CLIENT-SIDE
        </span>
      </div>

      {/* 2. Focused Hero Section (Minimal, Confident, Direct) */}
      <section className="space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground font-display leading-[1.08]">
          Master the Mental Models <br />
          of AI Engineering.
        </h1>

        <p className="text-base sm:text-lg leading-relaxed text-muted-foreground font-sans max-w-2xl">
          Deconstruct continuous parameter spaces, tensor transformations, deterministic forward passes, and probabilistic token sampling. Understand how models compute before writing complex code.
        </p>

        {/* Primary Call to Action */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`${basePath}/learn/what-is-artificial-intelligence`}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3.5 text-sm font-mono font-semibold text-background hover:bg-foreground/90 transition-colors"
          >
            Start Lesson 01 <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={`${basePath}/lab`}
            className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/30 px-5 py-3.5 text-sm font-mono font-semibold text-foreground hover:bg-secondary/60 transition-colors"
          >
            <Sliders className="h-4 w-4 text-emerald-500" /> Open Micro-Model Studio
          </Link>
        </div>
      </section>

      {/* 3. Core Outcomes (3 Clean Minimal Pillars) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/60">
        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-foreground">
            01 // PARAMETERS OVER SYNTAX
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Understand how weights scale features, how bias shifts decision boundaries, and how non-linear activations warp vector space.
          </p>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-foreground">
            02 // DETERMINISTIC VS STOCHASTIC
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Distinguish between deterministic forward math (identical inputs yield identical outputs) and probabilistic sampling with temperature.
          </p>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-foreground">
            03 // ZERO BLACK BOXES
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every step is computed in the browser runtime: from scalar neurons to multi-class token probability distributions.
          </p>
        </div>
      </section>

      {/* 4. Curriculum Syllabus (Progressive Disclosure Accordion) */}
      <section className="space-y-6 pt-4 border-t border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              SYLLABUS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-display">
              Curriculum Roadmap
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <button
              onClick={expandAll}
              className="hover:text-foreground transition-colors"
            >
              Expand all
            </button>
            <span>&bull;</span>
            <button
              onClick={collapseAll}
              className="hover:text-foreground transition-colors"
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* 5 Phase Accordions */}
        <div className="space-y-3">
          {PHASES.map((phase) => {
            const isOpen = !!openPhases[phase.number];
            const phaseSubtopics = foundationSubtopics.filter(
              (t) => t.category === phase.category
            );

            return (
              <div
                key={phase.number}
                className="rounded-xl border border-border/80 bg-card overflow-hidden transition-colors"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => togglePhase(phase.number)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-secondary/20 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <span className="font-bold text-foreground">
                        PHASE 0{phase.number}
                      </span>
                      <span className="text-muted-foreground">&bull;</span>
                      <span className="text-muted-foreground">
                        {phaseSubtopics.length} Lessons
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-foreground">
                      {phase.title}
                    </h3>

                    <p className="text-xs text-muted-foreground font-sans line-clamp-1">
                      {phase.description}
                    </p>
                  </div>

                  <div className="shrink-0 p-1 rounded-md border border-border/60 bg-secondary/30 text-muted-foreground">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {/* Accordion Body: Lessons List */}
                {isOpen && (
                  <div className="border-t border-border/60 divide-y divide-border/40 bg-secondary/10">
                    {phaseSubtopics.map((subtopic) => (
                      <Link
                        key={subtopic.id}
                        href={`${basePath}/learn/${subtopic.id}`}
                        className="group p-4 sm:px-5 flex items-center justify-between gap-4 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                          <span className="font-mono text-xs text-muted-foreground mt-0.5 shrink-0">
                            {String(subtopic.number).padStart(2, '0')}.
                          </span>

                          <div className="min-w-0 space-y-0.5">
                            <div className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                              {subtopic.title}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 font-sans">
                              {subtopic.definition}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 font-mono text-xs text-muted-foreground">
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px]">
                            <Clock className="h-3 w-3" /> ~5m
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Hands-on Practice Highlights (2 Focused Cards) */}
      <section className="space-y-4 pt-4 border-t border-border/60">
        <div className="space-y-1">
          <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
            HANDS-ON BENCHES
          </span>
          <h2 className="text-2xl font-black tracking-tight text-foreground font-display">
            Interactive Workbenches
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Micro-Model Studio */}
          <Link
            href={`${basePath}/lab`}
            className="group rounded-xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-4 hover:border-foreground/40 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">// STUDIO_01</span>
                <span className="text-emerald-500 dark:text-emerald-400 text-[11px] font-semibold">
                  LIVE BENCH &rarr;
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                The Micro-Model Studio
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                Adjust weight coefficients, bias offsets, and activation functions live. Observe real-time decision boundary convergence across customer sentiment and credit risk scenarios.
              </p>
            </div>

            <span className="text-xs font-mono font-semibold text-foreground group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Launch Studio &rarr;
            </span>
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
                  10 SCENARIOS &rarr;
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                Scenario Knowledge Check
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                Test your engineering intuition on real failure modes: VRAM consumption during training vs inference, gradient explosion, and non-linear activation collapse.
              </p>
            </div>

            <span className="text-xs font-mono font-semibold text-foreground group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Start Knowledge Check &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* 6. Clean Bottom Action / Footer */}
      <footer className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
        <div>
          CSCosmos &bull; AI Engineering Foundations &bull; 26 Lessons
        </div>

        <Link
          href={`${basePath}/learn/what-is-artificial-intelligence`}
          className="inline-flex items-center gap-1.5 text-foreground hover:underline font-semibold"
        >
          Begin Lesson 01 <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </footer>
    </div>
  );
}
