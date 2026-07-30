'use client';
import React from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { motion } from 'framer-motion';
import { FileCode, Cpu, Database } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const WhatIsProgram: React.FC = () => {
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={1} title="What Is a Program?">
      <div className="space-y-12">
        <section className={cn(
          "space-y-4",
          theme === 'dark' ? "text-slate-300" : "text-slate-700"
        )}>
          <p>
            At its simplest, a <strong>program</strong> is a sequence of instructions that tells a computer what to do. 
            Before a program runs, it exists as a file on your storage (like a hard drive or SSD).
          </p>
          <p>
            When you "run" a program, the computer performs a series of steps to turn those stored instructions into active work.
          </p>
        </section>

        {/* Visualization: Program Lifecycle */}
        <section className={cn(
          "rounded-2xl p-8 border transition-colors duration-300",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <h3 className={cn(
            "text-center mb-12 uppercase tracking-widest text-sm font-semibold",
            theme === 'dark' ? "text-slate-400" : "text-slate-500"
          )}>Program Lifecycle</h3>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Step 1: Storage */}
            <motion.div 
              className="flex flex-col items-center gap-4 text-center w-32"
              whileHover={{ y: -5 }}
            >
              <div className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center border shadow-xl transition-colors",
                theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
              )}>
                <FileCode className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-sm font-bold">1. Program File<br/><span className={cn("text-xs font-normal", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>(On Disk)</span></span>
            </motion.div>

            {/* Arrow */}
            <div className={cn("hidden md:block flex-1 h-0.5 relative", theme === 'dark' ? "bg-slate-800" : "bg-slate-200")}>
              <motion.div 
                className="absolute top-1/2 left-0 h-1 bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Step 2: Memory */}
            <motion.div 
              className="flex flex-col items-center gap-4 text-center w-32"
              whileHover={{ y: -5 }}
            >
              <div className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center border shadow-xl transition-colors",
                theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
              )}>
                <Database className="w-8 h-8 text-green-400" />
              </div>
              <span className="text-sm font-bold">2. Loaded<br/><span className={cn("text-xs font-normal", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>(Into RAM)</span></span>
            </motion.div>

            {/* Arrow */}
            <div className={cn("hidden md:block flex-1 h-0.5 relative", theme === 'dark' ? "bg-slate-800" : "bg-slate-200")}>
              <motion.div 
                className="absolute top-1/2 left-0 h-1 bg-green-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </div>

            {/* Step 3: CPU */}
            <motion.div 
              className="flex flex-col items-center gap-4 text-center w-32"
              whileHover={{ y: -5 }}
            >
              <div className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center border shadow-xl transition-colors",
                theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
              )}>
                <Cpu className="w-8 h-8 text-red-400" />
              </div>
              <span className="text-sm font-bold">3. Executing<br/><span className={cn("text-xs font-normal", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>(By CPU)</span></span>
            </motion.div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={cn(
            "p-6 rounded-xl border transition-colors",
            theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          )}>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              Code vs Data
            </h4>
            <p className={cn("text-sm leading-relaxed", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
              Programs consist of two main parts: <strong>Code</strong> (the instructions) and <strong>Data</strong> (the numbers, text, and values the code works with).
            </p>
          </div>
          <div className={cn(
            "p-6 rounded-xl border transition-colors",
            theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          )}>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              Compiled vs Interpreted
            </h4>
            <p className={cn("text-sm leading-relaxed", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
              Some programs are translated to machine code ahead of time (Compiled), while others are translated on the fly as they run (Interpreted).
            </p>
          </div>
        </section>
      </div>
    </TopicLayout>
  );
};
