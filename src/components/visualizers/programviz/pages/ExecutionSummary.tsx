'use client';
import React, { useState, useEffect } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Cpu, Database, Keyboard, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../hooks/useTheme';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { TOPIC_BASE_PATH } from '../data/topic';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const executionSteps = [
  { id: 1, component: 'OS', action: 'Load Program', detail: 'The OS loader maps the executable — the same ROM listing from Step 3 (MOV 15, MOV 27, ADD, STORE, HALT) — into the process address space. Pages are faulted in as the program touches them.', icon: Database, color: 'text-blue-500' },
  { id: 2, component: 'CPU', action: 'Initialize PC', detail: 'The Program Counter is set to 0x00, the address of the very first instruction.', icon: Cpu, color: 'text-purple-500' },
  { id: 3, component: 'CPU/RAM', action: 'Fetch Loop', detail: 'The CPU repeats Fetch → Decode → Execute: R0 = 15, R1 = 27, the ALU computes 42, and RAM[0x10] = 42.', icon: RotateCcw, color: 'text-red-500' },
  { id: 4, component: 'CPU/IO', action: 'System Call', detail: 'A print instruction calls the OS, which hands 42 to the monitor driver — the same system-call path from the I/O lesson.', icon: Keyboard, color: 'text-orange-500' },
  { id: 5, component: 'OS', action: 'Terminate', detail: 'HALT ends the fetch cycle. The OS reclaims the memory block the program was using.', icon: CheckCircle2, color: 'text-green-500' },
];

export const ExecutionSummary: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { theme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) setIsPlaying(false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying && !prefersReducedMotion) {
      interval = window.setInterval(() => {
        setCurrentStep(s => {
          if (s >= executionSteps.length - 1) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, prefersReducedMotion]);

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepKeyboard = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!prefersReducedMotion) setIsPlaying(p => !p);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setIsPlaying(false);
      setCurrentStep(s => Math.min(s + 1, executionSteps.length - 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setIsPlaying(false);
      setCurrentStep(s => Math.max(s - 1, 0));
    }
  };

  return (
    <TopicLayout stepNumber={7} title="Putting It All Together">
      <div className="space-y-12">
        <section className={cn(
          "space-y-4",
          theme === 'dark' ? "text-slate-300" : "text-slate-700"
        )}>
          <p>
            You've seen the individual parts. Now, let's watch how they work in harmony during the life of a single program execution.
          </p>
        </section>

        {/* The program from Step 3, now viewed at system level */}
        <div className="rounded-xl border border-border bg-slate-950 text-slate-100 font-mono text-xs p-5 space-y-2 shadow-inner">
          <span className="text-blue-400 font-bold block">
            // The exact program you stepped through in Step 3 — now at system level:
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-300">
            <span><span className="text-slate-500">0x00</span> MOV R0, 15</span>
            <span><span className="text-slate-500">0x01</span> MOV R1, 27</span>
            <span><span className="text-slate-500">0x02</span> ADD R0, R1</span>
            <span><span className="text-slate-500">0x03</span> STORE [0x10], R0</span>
            <span><span className="text-slate-500">0x04</span> HALT</span>
          </div>
          <p className="text-slate-400">
            Everything below is the story of this tiny program: loaded by the OS, fetched and executed by the CPU, printed through a system call, and cleaned up.
          </p>
        </div>

        {/* Timeline Visualization */}
        <div
          className={cn(
            "rounded-2xl p-8 border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          )}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Execution timeline stepper. Use Space to play or pause, arrow keys to step."
          onKeyDown={handleStepKeyboard}
        >
          <div className="flex items-center justify-between mb-12">
             <h3 className={cn(
               "uppercase tracking-widest text-sm font-semibold",
               theme === 'dark' ? "text-slate-400" : "text-slate-500"
             )}>Execution Timeline</h3>
             <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={prefersReducedMotion ? 'Auto-play disabled by reduced-motion preference' : isPlaying ? 'Pause timeline' : 'Play timeline'}
                  aria-pressed={isPlaying}
                  disabled={prefersReducedMotion}
                  title={prefersReducedMotion ? 'Auto-play is disabled by your reduced-motion preference' : undefined}
                  className={cn(
                    "p-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm"
                  )}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleReset}
                  aria-label="Reset timeline to first step"
                  className={cn(
                    "p-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm"
                  )}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
             </div>
          </div>

          <p aria-live="polite" className="sr-only">
            {`Step ${currentStep + 1} of ${executionSteps.length}: ${executionSteps[currentStep].action}. ${executionSteps[currentStep].detail}`}
          </p>

          <div className="relative">
            {/* The Line */}
            <div className={cn("absolute left-6 top-0 bottom-0 w-0.5", theme === 'dark' ? "bg-slate-800" : "bg-slate-100")} />

            <div className="space-y-8 relative">
              {executionSteps.map((step, i) => (
                <motion.div 
                  key={step.id}
                  className={`flex gap-6 items-start transition-opacity duration-500 ${i <= currentStep ? 'opacity-100' : 'opacity-20'}`}
                >
                  <div className={cn(
                    "relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all",
                    i <= currentStep 
                      ? "border-blue-500 shadow-lg shadow-blue-500/20 bg-white dark:bg-slate-900" 
                      : (theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")
                  )}>
                    <step.icon className={`w-5 h-5 ${i <= currentStep ? step.color : 'text-slate-300'}`} />
                  </div>
                  
                  <div className={cn(
                    "flex-1 p-4 rounded-xl border transition-colors",
                    i <= currentStep 
                      ? (theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-blue-100 shadow-sm")
                      : (theme === 'dark' ? "border-slate-800" : "border-slate-100")
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn("text-[10px] font-bold uppercase", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>{step.component}</span>
                      {i === currentStep && isPlaying && (
                        <motion.div 
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <h4 className="font-bold mb-2">{step.action}</h4>
                    <p className={cn("text-sm leading-relaxed", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>{step.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <PredictCheck
          question="When you double-click a program, WHO actually loads it into RAM?"
          options={['The CPU', 'The operating system', 'The monitor', 'The program itself']}
          correctIndex={1}
          explanation="The OS is the loader: it reads the file from disk, allocates memory, points the CPU at the entry instruction — and reclaims everything when the program exits."
        />

        <section className={cn(
          "text-center space-y-6 pt-12 border-t transition-colors",
          theme === 'dark' ? "border-slate-800" : "border-slate-200"
        )}>
          <h2 className="text-3xl font-bold">Congratulations!</h2>
          <p className={cn(
            "max-w-xl mx-auto",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            You now have a foundational mental model of how a computer actually runs your code. 
            You're ready to dive deeper into operating systems, compilers, and advanced software design.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href={TOPIC_BASE_PATH}
              className={cn(
                "px-8 py-3 rounded-full font-bold transition-colors",
                theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              )}
            >
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </TopicLayout>
  );
};