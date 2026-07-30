'use client';
import React, { useState, useEffect } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Cpu, Database, Keyboard, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const executionSteps = [
  { id: 1, component: 'OS', action: 'Load Program', detail: 'The OS reads the program file from disk and places its code/data into RAM.', icon: Database, color: 'text-blue-500' },
  { id: 2, component: 'CPU', action: 'Initialize PC', detail: 'The Program Counter (PC) is set to the address of the first instruction.', icon: Cpu, color: 'text-purple-500' },
  { id: 3, component: 'CPU/RAM', action: 'Fetch Loop', detail: 'The CPU begins the Fetch-Decode-Execute cycle for each instruction.', icon: RotateCcw, color: 'text-red-500' },
  { id: 4, component: 'CPU/IO', action: 'System Call', detail: 'A "print" instruction is reached. The CPU asks the OS to send data to the monitor.', icon: Keyboard, color: 'text-orange-500' },
  { id: 5, component: 'OS', action: 'Terminate', detail: 'The last instruction is executed. The OS cleans up the memory used by the program.', icon: CheckCircle2, color: 'text-green-500' },
];

export const ExecutionSummary: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying) {
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
  }, [isPlaying]);

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
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

        {/* Timeline Visualization */}
        <div className={cn(
          "rounded-2xl p-8 border transition-colors duration-300",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="flex items-center justify-between mb-12">
             <h3 className={cn(
               "uppercase tracking-widest text-sm font-semibold",
               theme === 'dark' ? "text-slate-400" : "text-slate-500"
             )}>Execution Timeline</h3>
             <div className="flex gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={cn(
                    "p-2 rounded transition-colors",
                    theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm"
                  )}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button 
                  onClick={handleReset}
                  className={cn(
                    "p-2 rounded transition-colors",
                    theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm"
                  )}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
             </div>
          </div>

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
              href="/program-cosmos"
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