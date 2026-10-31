'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cpu, Database, Keyboard, PlayCircle, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { steps } from '../data/learningPath';
import { useProgress } from '../context/ProgressContext';

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
          className="stroke-blue-500 transition-all duration-700"
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
      <header className="space-y-4">
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-6xl font-extrabold tracking-tight text-foreground"
        >
          How Programs <span className="text-blue-500">Execute</span>
        </motion.h1>
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl max-w-2xl text-muted-foreground"
        >
          A visual, step-by-step guide to understanding the journey of a program from source code to CPU instructions, memory management, and I/O.
        </motion.p>
      </header>

      {isStarted && (isComplete || nextStep !== undefined) && (
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          aria-label="Learning progress"
          className="p-6 border border-border/80 rounded-xl bg-card shadow-md flex flex-col sm:flex-row items-center gap-6 justify-between"
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
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </motion.section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Cpu, title: "CPU Execution", desc: "How the processor fetches and runs instructions." },
          { icon: Database, title: "Memory Usage", desc: "How data is stored and organized in RAM." },
          { icon: Keyboard, title: "Input / Output", desc: "How programs interact with the outside world." }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-6 border border-border/80 rounded-xl bg-card shadow-sm"
          >
            <item.icon className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Learning Path</h2>
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
                  className="group flex items-center justify-between p-4 border border-border/80 rounded-lg bg-card/60 hover:bg-card transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      isStepDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted group-hover:bg-blue-600 group-hover:text-white'
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
                <span className="text-xs font-mono uppercase text-blue-500 font-bold">Deep Dive</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <h3 className="mt-2 text-base font-bold text-foreground group-hover:text-blue-500 transition-colors">
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
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <Link
              href="/exercises"
              className="font-semibold text-primary hover:underline"
            >
              Practice multiple-choice challenges →
            </Link>
            <span className="text-muted-foreground" aria-hidden="true">·</span>
            <Link
              href="/progress"
              className="font-semibold text-primary hover:underline"
            >
              View certification progress →
            </Link>
          </div>
        </section>
      )}

      {!isStarted && (
        <div className="pt-8">
          <Link
            href={steps[0].path}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-colors shadow-lg shadow-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <PlayCircle className="w-6 h-6" />
            Start Learning
          </Link>
        </div>
      )}
    </div>
  );
};
