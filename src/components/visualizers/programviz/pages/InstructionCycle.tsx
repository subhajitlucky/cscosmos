'use client';
import React, { useState } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Search, Cpu, Database, Save } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const stages = [
  { 
    id: 'fetch', 
    title: 'Fetch', 
    icon: Search, 
    color: 'text-blue-500', 
    desc: 'The CPU gets the next instruction from memory using the address in the Program Counter.' 
  },
  { 
    id: 'decode', 
    title: 'Decode', 
    icon: RefreshCw, 
    color: 'text-purple-500', 
    desc: 'The Control Unit translates the instruction into signals the rest of the CPU understands.' 
  },
  { 
    id: 'execute', 
    title: 'Execute', 
    icon: Cpu, 
    color: 'text-red-500', 
    desc: 'The ALU performs the actual operation (like adding two numbers).' 
  },
  { 
    id: 'writeback', 
    title: 'Write-back', 
    icon: Save, 
    color: 'text-green-500', 
    desc: 'The result is saved back into a register or memory.' 
  }
];

export const InstructionCycle: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={3} title="Instruction Execution Cycle">
      <div className="space-y-12">
        <section className={cn(
          "space-y-4",
          theme === 'dark' ? "text-slate-300" : "text-slate-700"
        )}>
          <p>
            The CPU runs in a continuous loop called the <strong>Instruction Cycle</strong>. Every single operation your computer performs goes through these four stages.
          </p>
        </section>

        {/* Interactive Cycle Visualization */}
        <div className={cn(
          "rounded-2xl p-8 border transition-colors duration-300",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Stage Selector */}
            <div className="flex flex-col gap-3 w-full md:w-48">
              {stages.map((stage, i) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(i)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all text-left border-l-4",
                    activeStage === i 
                      ? (theme === 'dark' ? "bg-slate-800 border-blue-500" : "bg-slate-50 border-blue-600 shadow-sm")
                      : "border-transparent text-slate-500 hover:bg-slate-800/20"
                  )}
                >
                  <stage.icon className={cn("w-5 h-5", activeStage === i ? stage.color : "opacity-40")} />
                  <span className={cn("font-bold text-sm", activeStage === i ? (theme === 'dark' ? "text-white" : "text-slate-900") : "")}>
                    {i + 1}. {stage.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Stage Detail */}
            <div className={cn(
              "flex-1 rounded-xl p-8 border min-h-[200px] flex flex-col justify-center transition-colors",
              theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"
            )}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className={cn(
                    "inline-flex p-3 rounded-full transition-colors",
                    theme === 'dark' ? "bg-slate-900" : "bg-white shadow-sm"
                  )}>
                    {React.createElement(stages[activeStage].icon, { className: cn("w-8 h-8", stages[activeStage].color) })}
                  </div>
                  <h3 className="text-2xl font-bold">{stages[activeStage].title}</h3>
                  <p className={cn("leading-relaxed", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>{stages[activeStage].desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex justify-center gap-4">
            <button 
              onClick={() => setActiveStage(prev => (prev > 0 ? prev - 1 : stages.length - 1))}
              className={cn(
                "px-4 py-2 rounded transition-colors text-sm font-medium",
                theme === 'dark' ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200"
              )}
            >
              Previous
            </button>
            <button 
              onClick={() => setActiveStage(prev => (prev < stages.length - 1 ? prev + 1 : 0))}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-bold shadow-md shadow-blue-500/20"
            >
              Next Phase
            </button>
          </div>
        </div>

        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t transition-colors",
          theme === 'dark' ? "border-slate-800" : "border-slate-200"
        )}>
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-blue-500">
              <RefreshCw className="w-4 h-4" />
              The Loop Never Stops
            </h4>
            <p className={cn("text-sm leading-relaxed", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
              A modern CPU repeats this cycle <strong>billions</strong> of times every second. This speed is what we call "Clock Speed" (measured in GHz).
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-green-500">
              <Database className="w-4 h-4" />
              Fetch vs Execute
            </h4>
            <p className={cn("text-sm leading-relaxed", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
              Fetch is about communicating with external RAM, while Execute happens entirely inside the CPU's own circuitry.
            </p>
          </div>
        </div>
      </div>
    </TopicLayout>
  );
};
