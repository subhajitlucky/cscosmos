'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Cpu,
  Database,
  Keyboard,
  PlayCircle,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  BookOpen,
  FlaskConical,
  CheckSquare,
} from 'lucide-react';
import { steps } from '../data/learningPath';
import { useProgress } from '../context/ProgressContext';
import { TOPIC_BASE_PATH } from '../data/topic';

function ProgressRing({ percent }: { percent: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-20 h-20 shrink-0" role="img" aria-label={`${percent}% of learning path completed`}>
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="6" className="stroke-border" opacity="0.4" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-amber-500 transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
        {percent}%
      </span>
    </div>
  );
}

export const Home: React.FC = () => {
  const { progress, resetProgress } = useProgress();
  const completedCount = progress.completedSteps.length;
  const percent = Math.round((completedCount / steps.length) * 100);

  const nextStep = steps.find((s) => !progress.completedSteps.includes(s.step));
  const isStarted = completedCount > 0;
  const isComplete = completedCount === steps.length;
  const resumePath = isComplete ? steps[0].path : nextStep?.path ?? steps[0].path;
  const nextStepLabel = nextStep
    ? `Step ${nextStep.step} — ${nextStep.title}`
    : '';

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <header className="space-y-6 text-center max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Computer Architecture &amp; Execution</span>
        </div>

        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground"
        >
          How Programs <span className="text-amber-500">Execute</span>
        </motion.h1>

        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
        >
          A visual, step-by-step deep dive into what happens when code runs — from high-level source text to binary opcodes, CPU cycles, RAM memory layout, and operating system I/O.
        </motion.p>

        {/* 3 Main Navbar Feature Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
          <Link
            href={`${TOPIC_BASE_PATH}/concepts`}
            className="group p-4 rounded-xl border border-border/80 bg-card hover:border-amber-500/50 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 w-fit">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-amber-500 transition-colors">
                Core Concepts
              </h3>
              <p className="text-xs text-muted-foreground">
                10 structured lessons covering binary, CPU, RAM, stack/heap, and system calls.
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-amber-500">
              <span>View Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href={`${TOPIC_BASE_PATH}/lab`}
            className="group p-4 rounded-xl border border-border/80 bg-card hover:border-amber-500/50 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-zinc-800 text-amber-400 w-fit">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-amber-500 transition-colors">
                Simulation Lab
              </h3>
              <p className="text-xs text-muted-foreground">
                Interactive CPU assembly simulator, RAM address matrix, and data explorer.
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-amber-500">
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="group p-4 rounded-xl border border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 w-fit">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground group-hover:text-emerald-500 transition-colors">
                  Practice Problems
                </h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  100 Qs
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Test and reinforce your systems understanding with instant explanations.
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-emerald-500">
              <span>Start Practice</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </header>

      {/* Continue Progress Section (if started) */}
      {isStarted && (isComplete || nextStep !== undefined) && (
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          aria-label="Learning progress"
          className="p-6 border border-border/80 rounded-xl bg-card shadow-sm flex flex-col sm:flex-row items-center gap-6 justify-between"
        >
          <div className="flex items-center gap-6">
            <ProgressRing percent={percent} />
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                {isComplete ? (
                  <>Course Complete <CheckCircle2 className="w-5 h-5 text-emerald-500" /></>
                ) : (
                  'Continue where you left off'
                )}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isComplete
                  ? `All ${steps.length} steps finished — review any step below or restart.`
                  : `${completedCount} of ${steps.length} steps completed · Next up: ${nextStepLabel}`}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={resumePath}
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-bold text-zinc-950 transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-xs"
            >
              <PlayCircle className="h-5 w-5" />
              {isComplete ? 'Review Course' : 'Resume'}
            </Link>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all step progress for this topic?')) resetProgress();
              }}
              aria-label="Reset progress"
              title="Reset progress"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </motion.section>
      )}

      {/* 3 Pillars Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Cpu, title: "CPU Execution", desc: "How the processor fetches instructions, decodes opcodes, and runs ALU cycles." },
          { icon: Database, title: "Memory Systems", desc: "How RAM is addressed and partitioned into Code, Data, Heap, and Stack." },
          { icon: Keyboard, title: "Input / Output", desc: "How programs transition to Ring 0 kernel mode to communicate with real hardware." }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-6 border border-border/80 rounded-xl bg-card shadow-sm"
          >
            <item.icon className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Step by Step Learning Path */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Step-by-Step Learning Path</h2>
          <Link
            href={`${TOPIC_BASE_PATH}/concepts`}
            className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
          >
            <span>View Full Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => {
            const isStepDone = progress.completedSteps.includes(step.step);
            return (
              <motion.div
                key={step.step}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <Link
                  href={step.path}
                  className="group flex items-center justify-between p-4 border border-border/80 rounded-lg bg-card/60 hover:bg-card transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      isStepDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted group-hover:bg-amber-500 group-hover:text-zinc-950'
                    }`}>
                      {isStepDone ? <CheckCircle2 className="w-4 h-4" /> : step.step}
                    </span>
                    <div>
                      <h4 className="font-bold text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.masteryGoal}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Completion Recommendations */}
      {isComplete && (
        <section className="space-y-4 pt-6 border-t border-border/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <h2 className="text-xl font-bold text-foreground">Recommended Next Steps</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            You've built the foundation of how hardware executes software. Deepen your systems knowledge with these next modules:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/corecs/computer-architecture-cpu-caches"
              className="group p-4 rounded-xl border border-border/80 bg-card/60 hover:bg-card transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-amber-500 font-bold">Deep Dive</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <h3 className="mt-2 text-base font-bold text-foreground group-hover:text-amber-500 transition-colors">
                Computer Architecture &amp; CPU Caches
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Explore L1/L2 caches, cache lines, associativity, and the memory wall.
              </p>
            </Link>

            <Link
              href="/corecs/operating-systems-internals-processes-memory"
              className="group p-4 rounded-xl border border-border/80 bg-card/60 hover:bg-card transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-amber-500 font-bold">Systems</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <h3 className="mt-2 text-base font-bold text-foreground group-hover:text-amber-500 transition-colors">
                OS Internals: Processes &amp; Memory
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Step through CPU scheduling algorithms, page-table walks, and virtual memory.
              </p>
            </Link>
          </div>
        </section>
      )}

      {/* Start Learning Button if not started */}
      {!isStarted && (
        <div className="pt-4 text-center">
          <Link
            href={steps[0].path}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-full font-bold text-lg transition-colors shadow-xs border border-amber-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <PlayCircle className="w-6 h-6" />
            Start Learning
          </Link>
        </div>
      )}
    </div>
  );
};
