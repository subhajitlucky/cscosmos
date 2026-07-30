'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { steps } from '../data/learningPath';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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

  const handleComplete = () => {
    completeStep(stepNumber);
    if (nextStep) {
      router.push(nextStep.path);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-blue-500 font-medium">
          <span>Step {stepNumber}</span>
          <span className="w-1 h-1 rounded-full bg-slate-500" />
          <span>{steps[currentStepIndex]?.estimatedTime}</span>
        </div>
        <h1 className="text-3xl font-bold">{title}</h1>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose max-w-none transition-colors duration-300 dark:prose-invert text-foreground"
      >
        {children}
      </motion.div>

      <div className="pt-12 border-t border-border/80 flex items-center justify-between">
        {prevStep ? (
          <Link 
            href={prevStep.path}
            className="flex items-center gap-2 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{prevStep.title}</span>
          </Link>
        ) : <div />}

        <button
          onClick={handleComplete}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white transition-colors"
        >
          {isStepCompleted(stepNumber) ? "Next Step" : "Mark as Completed"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
