'use client';
import React from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CPUBasics: React.FC = () => {
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={2} title="CPU Basics">
      <div className="space-y-12">
        <section className={cn(
          "space-y-4",
          theme === 'dark' ? "text-slate-300" : "text-slate-700"
        )}>
          <p>
            The <strong>Central Processing Unit (CPU)</strong> is the "brain" of the computer. Its job is to fetch instructions from memory and carry them out.
          </p>
          <p>
            Inside the CPU, three main components work together to make this happen:
          </p>
        </section>

        {/* Visualization: CPU Block Diagram */}
        <div className={cn(
          "rounded-2xl p-8 border relative overflow-hidden transition-colors",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <h3 className={cn(
            "text-center mb-8 uppercase tracking-widest text-sm font-semibold",
            theme === 'dark' ? "text-slate-400" : "text-slate-500"
          )}>Inside the CPU</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Control Unit */}
            <motion.div 
              className={cn(
                "p-6 rounded-xl border-2 shadow-lg transition-colors",
                theme === 'dark' ? "bg-slate-800 border-blue-500 shadow-blue-500/10" : "bg-slate-50 border-blue-400 shadow-blue-400/5"
              )}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h4 className="font-bold text-blue-500 mb-2 uppercase text-xs">Control Unit (CU)</h4>
              <p className={cn("text-sm", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>The "Manager". It decodes instructions and coordinates how data moves around the computer.</p>
            </motion.div>

            {/* ALU */}
            <motion.div 
              className={cn(
                "p-6 rounded-xl border-2 shadow-lg transition-colors",
                theme === 'dark' ? "bg-slate-800 border-red-500 shadow-red-500/10" : "bg-slate-50 border-red-400 shadow-red-400/5"
              )}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h4 className="font-bold text-red-500 mb-2 uppercase text-xs">Arithmetic Logic Unit (ALU)</h4>
              <p className={cn("text-sm", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>The "Calculator". It performs all the math (addition, subtraction) and logic (AND, OR, NOT).</p>
            </motion.div>

            {/* Registers */}
            <motion.div 
              className={cn(
                "md:col-span-2 p-6 rounded-xl border-2 shadow-lg transition-colors",
                theme === 'dark' ? "bg-slate-800 border-green-500 shadow-green-500/10" : "bg-slate-50 border-green-400 shadow-green-400/5"
              )}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h4 className="font-bold text-green-500 mb-2 uppercase text-xs text-center">Registers</h4>
              <p className={cn("text-sm text-center mb-4", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>The "Scratchpad". Tiny, ultra-fast storage locations inside the CPU for immediate data.</p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {['Program Counter', 'Instruction Register', 'Accumulator', 'General Purpose'].map(reg => (
                  <div key={reg} className={cn(
                    "px-3 py-1 border rounded text-xs font-mono transition-colors",
                    theme === 'dark' ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600"
                  )}>
                    {reg}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Animated data paths (visual fluff) */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <motion.div 
              className="absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-blue-500"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-xl font-bold">Registers You Should Know</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={cn(
              "p-4 rounded-lg border transition-colors",
              theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            )}>
              <span className="text-blue-500 font-mono text-sm block mb-1">Program Counter (PC)</span>
              <p className={cn("text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>Stores the memory address of the <strong>next</strong> instruction to be executed.</p>
            </div>
            <div className={cn(
              "p-4 rounded-lg border transition-colors",
              theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            )}>
              <span className="text-green-500 font-mono text-sm block mb-1">Instruction Register (IR)</span>
              <p className={cn("text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>Stores the <strong>current</strong> instruction being processed.</p>
            </div>
          </div>
        </section>
      </div>
    </TopicLayout>
  );
};
