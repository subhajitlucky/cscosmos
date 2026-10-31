'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { steps } from '../data/learningPath';
import { TOPIC_BASE_PATH } from '../data/topic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TopicLayoutProps {
  stepNumber: number;
  title: string;
  children: React.ReactNode;
}

export const TopicLayout: React.FC<TopicLayoutProps> = ({ stepNumber, title, children }) => {
  const { completeStep, isStepCompleted } = useProgress();
  const router = useRouter();
  
  const currentStepIndex = steps.findIndex(s => s.step === stepNumber);
  const nextStep = steps[currentStepIndex + 1];
  const prevStep = steps[currentStepIndex - 1];

  const isLastStep = !nextStep;

  const handleComplete = () => {
    completeStep(stepNumber);
    router.push(isLastStep ? TOPIC_BASE_PATH : nextStep?.path ?? TOPIC_BASE_PATH);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-500 font-medium text-xs font-mono">
            <span>Step {stepNumber} of {steps.length}</span>
            <span className="w-1 h-1 rounded-full bg-slate-500" />
            <span>{steps[currentStepIndex]?.estimatedTime}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={TOPIC_BASE_PATH}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Course Home</span>
          </Link>
        </div>
      </header>

      {/* initial={false} matters for SSG: framer-motion serialises `initial` into
          the pre-rendered HTML, so `initial={{ opacity: 0 }}` shipped every lesson
          body invisible until JS hydrated (5 opacity:0 occurrences per page). The
          content is the lesson — it must be readable without JS. */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="prose max-w-none transition-colors duration-300 dark:prose-invert text-foreground"
      >
        {children}
      </motion.div>

      <div className="pt-12 border-t border-border/80 flex items-center justify-between">
        {prevStep ? (
          <Link 
            href={prevStep.path}
            className="flex items-center gap-2 transition-colors text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{prevStep.title}</span>
          </Link>
        ) : <div />}

        <button
          onClick={handleComplete}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          {isStepCompleted(stepNumber)
            ? (isLastStep ? "Back to Course Home" : "Next Step")
            : (isLastStep ? "Finish Course" : "Mark Step Complete")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
