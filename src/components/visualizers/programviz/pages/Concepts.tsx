'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { steps } from '../data/learningPath';
import { useProgress } from '../context/ProgressContext';
import { TOPIC_BASE_PATH } from '../data/topic';

interface PillarGroup {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  stepNumbers: number[];
}

const PILLARS: PillarGroup[] = [
  {
    id: 'hardware',
    name: 'Hardware & Execution Foundations',
    description: 'Understand machine code, binary arithmetic, CPU microarchitecture, and the instruction execution cycle.',
    icon: Cpu,
    stepNumbers: [1, 2, 3, 4],
  },
  {
    id: 'memory',
    name: 'Memory Systems & Multitasking',
    description: 'Explore RAM addressing, virtual memory, process layout (stack and heap), and time-shared context switching.',
    icon: Database,
    stepNumbers: [5, 6, 7],
  },
  {
    id: 'runtime',
    name: 'Operating System, Compilers & Full Lifecycle',
    description: 'Learn how software accesses hardware via system calls, how compilers build executables, and the end-to-end journey from source code to screen output.',
    icon: Terminal,
    stepNumbers: [8, 9, 10],
  },
];

export function Concepts() {
  const { isStepCompleted, progress } = useProgress();
  const completedCount = progress.completedSteps.length;
  const percent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-xs font-mono font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Complete 10-Lesson Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Core <span className="text-amber-500">Concepts</span> Directory
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          From electronic logic gates and binary numbers up to process address spaces and operating system drivers.
          Work through these 10 structured lessons to build an unbreakable mental model of how computers run programs.
        </p>

        {/* Progress summary bar */}
        <div className="p-4 rounded-xl border border-border/80 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span>Overall Curriculum Progress: {completedCount} / {steps.length} Steps Finished</span>
              {completedCount === steps.length && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Each concept includes real-world analogies, step-by-step interactive visualizers, and misconception checks.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-32 bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-foreground">{percent}%</span>
          </div>
        </div>
      </header>

      {/* Pillars */}
      <div className="space-y-12">
        {PILLARS.map((pillar) => {
          const PillarIcon = pillar.icon;
          const pillarSteps = steps.filter((s) => pillar.stepNumbers.includes(s.step));

          return (
            <section key={pillar.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border/80 pb-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <PillarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{pillar.name}</h2>
                  <p className="text-xs text-muted-foreground">{pillar.description}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {pillarSteps.map((step) => {
                  const completed = isStepCompleted(step.step);

                  return (
                    <motion.div
                      key={step.step}
                      initial={false}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Link
                        href={step.path}
                        className="group flex flex-col justify-between p-5 rounded-xl border border-border/80 bg-card hover:border-amber-500/50 hover:shadow-sm transition-all h-full"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-500">
                              <span>Step 0{step.step}</span>
                              <span className="text-muted-foreground">·</span>
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{step.estimatedTime}</span>
                            </span>
                            {completed ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                <Circle className="w-3 h-3" />
                                Ready
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-foreground group-hover:text-amber-500 transition-colors">
                            {step.title}
                          </h3>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {step.masteryGoal}
                          </p>
                        </div>

                        <div className="pt-4 mt-2 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-amber-500">
                          <span>Enter Interactive Lesson</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer Callout */}
      <div className="p-6 rounded-xl border border-border/80 bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">Want to put your knowledge to the test?</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Explore interactive experiments in the Simulation Lab or challenge yourself with 100 practice questions.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`${TOPIC_BASE_PATH}/lab`}
            className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Open Lab
          </Link>
          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-xs font-bold text-zinc-950 transition-colors shadow-xs"
          >
            Practice 100 Questions →
          </Link>
        </div>
      </div>
    </div>
  );
}
