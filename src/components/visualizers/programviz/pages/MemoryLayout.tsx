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

const memorySegments = [
  { 
    name: 'Stack', 
    color: 'bg-red-500', 
    desc: 'Stores local variables and function call information. It grows and shrinks automatically.', 
    details: 'LIFO (Last-In, First-Out)'
  },
  { 
    name: 'Heap', 
    color: 'bg-orange-500', 
    desc: 'Used for dynamic memory allocation. You (or your runtime) manage this space.', 
    details: 'Flexible size'
  },
  { 
    name: 'Data', 
    color: 'bg-blue-500', 
    desc: 'Stores global and static variables that exist for the entire life of the program.', 
    details: 'Fixed size'
  },
  { 
    name: 'Code (Text)', 
    color: 'bg-green-500', 
    desc: 'The actual machine instructions of your program. Usually read-only.', 
    details: 'Read-Only'
  }
];

export const MemoryLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={5} title="Program Memory Layout">
      <div className="space-y-12">
        <section className={cn(
          "space-y-4",
          theme === 'dark' ? "text-slate-300" : "text-slate-700"
        )}>
          <p>
            When a program runs, the Operating System gives it a block of memory. The program doesn't just use this block randomly; it organizes it into specific <strong>segments</strong>.
          </p>
        </section>

        {/* Visualization: Vertical Memory Map */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className={cn(
            "w-full md:w-48 flex flex-col border-2 rounded-xl overflow-hidden shadow-2xl transition-colors duration-300",
            theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          )}>
            <div className={cn(
              "p-2 text-[10px] text-center font-mono border-b transition-colors",
              theme === 'dark' ? "text-slate-500 border-slate-800 bg-slate-950" : "text-slate-400 border-slate-200 bg-slate-50"
            )}>High Address</div>
            {memorySegments.map((seg, i) => (
              <motion.div
                key={seg.name}
                initial={{ height: 0 }}
                animate={{ height: i === 0 || i === 1 ? 100 : 60 }}
                className={cn(
                  seg.color,
                  "border-b-2 flex items-center justify-center relative group cursor-help transition-colors",
                  theme === 'dark' ? "border-slate-900" : "border-white"
                )}
              >
                <span className="font-bold text-white drop-shadow-md text-sm uppercase tracking-wider">{seg.name}</span>
                {/* Connector lines for Stack/Heap growth */}
                {seg.name === 'Stack' && (
                  <div className="absolute bottom-2 text-white animate-bounce">↓</div>
                )}
                {seg.name === 'Heap' && (
                  <div className="absolute top-2 text-white animate-bounce">↑</div>
                )}
              </motion.div>
            ))}
            <div className={cn(
              "p-2 text-[10px] text-center font-mono transition-colors",
              theme === 'dark' ? "text-slate-500 bg-slate-950" : "text-slate-400 bg-slate-50"
            )}>Low Address</div>
          </div>

          <div className="flex-1 space-y-6">
            {memorySegments.map((seg) => (
              <div key={seg.name} className={cn(
                "p-4 rounded-lg border transition-all",
                theme === 'dark' 
                  ? "bg-slate-900/50 border-slate-800 hover:border-slate-600" 
                  : "bg-white border-slate-200 hover:border-blue-300 shadow-sm"
              )}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("w-3 h-3 rounded-full", seg.color)} />
                  <h4 className="font-bold text-lg">{seg.name}</h4>
                  <span className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded uppercase transition-colors",
                    theme === 'dark' ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                  )}>{seg.details}</span>
                </div>
                <p className={cn(
                  "text-sm leading-relaxed",
                  theme === 'dark' ? "text-slate-400" : "text-slate-600"
                )}>{seg.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <section className={cn(
          "p-6 border rounded-xl transition-colors",
          theme === 'dark' ? "bg-blue-900/20 border-blue-500/30" : "bg-blue-50 border-blue-200"
        )}>
          <h4 className="font-bold mb-3 text-blue-600">Stack vs. Heap</h4>
          <p className={cn(
            "text-sm leading-relaxed",
            theme === 'dark' ? "text-slate-300" : "text-slate-700"
          )}>
            The <strong>Stack</strong> is managed by the CPU and is extremely fast. Every time you call a function, a new "frame" is added to the stack. When the function returns, it's removed.
            The <strong>Heap</strong> is for larger, more complex data that needs to stay around longer.
          </p>
        </section>
      </div>
    </TopicLayout>
  );
};