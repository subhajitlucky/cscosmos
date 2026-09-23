'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cpu, Database, Keyboard, PlayCircle, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { steps } from '../data/learningPath';
import { useProgress } from '../context/ProgressContext';

function ProgressRing({ percent }: { percent: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-20 h-20 shrink-0" role="img" aria-label={`${percent}% of learning path completed`}>
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="6" className="text-muted stroke-current" opacity="0.25" />
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
  const { progress } = useProgress();
  const completedCount = progress.completedSteps.length;
  const percent = Math.round((completedCount / steps.length) * 100);

  const nextStep = steps.find((s) => !progress.completedSteps.includes(s.step));
  const isStarted = completedCount > 0;
  const isComplete = completedCount === steps.length;

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-6xl font-extrabold tracking-tight text-foreground"
        >
          How Programs <span className="text-blue-500">Execute</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl max-w-2xl text-muted-foreground"
        >
          A visual, step-by-step guide to understanding the journey of a program from source code to CPU instructions, memory management, and I/O.
        </motion.p>
      </header>

      {(isStarted || isComplete) && nextStep !== undefined && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
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
                  : `${completedCount} of ${steps.length} steps completed · Next up: Step ${nextStep.step} — ${nextStep.title}`}
              </p>
            </div>
          </div>
          <Link
            href={isComplete ? '/program-cosmos/what-is-a-program' : nextStep.path}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-colors shadow-lg shadow-blue-500/20 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {isComplete ? <RotateCcw className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
            {isComplete ? 'Review Course' : 'Resume'}
          </Link>
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
            initial={{ opacity: 0, scale: 0.9 }}
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
                initial={{ opacity: 0, x: -20 }}
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

      {!isStarted && (
        <div className="pt-8">
          <Link
            href="/program-cosmos/what-is-a-program"
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
