'use client';
import React, { useState, useMemo } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MemoryBasics: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const { theme } = useTheme();

  // Simulated memory cells
  const cells = useMemo(() => Array.from({ length: 64 }, (_, i) => ({
    address: `0x${i.toString(16).padStart(2, '0').toUpperCase()}`,
    // eslint-disable-next-line react-hooks/purity
    value: Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
  })), []);

  // eslint-disable-next-line react-hooks/purity
  const bits = useMemo(() => Array.from({ length: 8 }, () => Math.round(Math.random())), []);

  return (
    <TopicLayout stepNumber={4} title="Memory Basics">
      <div className="space-y-12">
        <section className={cn(
          "space-y-4",
          theme === 'dark' ? "text-slate-300" : "text-slate-700"
        )}>
          <p>
            <strong>Random Access Memory (RAM)</strong> is where the computer stores the data and instructions it is currently using. 
            Think of it as a massive wall of post-it notes, where each note has a unique <strong>address</strong>.
          </p>
        </section>

        {/* Memory Grid Visualization */}
        <div className={cn(
          "rounded-2xl p-6 border transition-colors duration-300",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className={cn(
              "uppercase tracking-widest text-sm font-semibold",
              theme === 'dark' ? "text-slate-400" : "text-slate-500"
            )}>Memory Map (RAM)</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded" /> Address</div>
              <div className="flex items-center gap-1"><div className={cn("w-3 h-3 rounded", theme === 'dark' ? "bg-slate-700" : "bg-slate-200")} /> Value</div>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {cells.map((cell, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedCell(i)}
                className={cn(
                  "p-2 rounded border cursor-pointer transition-all",
                  selectedCell === i 
                    ? "bg-blue-600 border-blue-400 text-white" 
                    : (theme === 'dark' 
                        ? "bg-slate-800 border-slate-700 hover:border-slate-500" 
                        : "bg-slate-50 border-slate-200 hover:border-blue-300")
                )}
              >
                <div className={cn(
                  "text-[10px] font-mono mb-1",
                  selectedCell === i ? "text-blue-100" : "text-slate-500"
                )}>{cell.address}</div>
                <div className="text-sm font-mono font-bold text-center">{cell.value}</div>
              </motion.div>
            ))}
          </div>

          {selectedCell !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-8 p-4 rounded-xl border transition-colors",
                theme === 'dark' ? "bg-slate-800 border-blue-500/30" : "bg-blue-50 border-blue-200"
              )}
            >
              <h4 className="font-bold mb-2">Cell Details</h4>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? "text-slate-300" : "text-slate-700"
              )}>
                The CPU requested address <span className="font-mono text-blue-500 font-bold">{cells[selectedCell].address}</span> and found the hexadecimal value <span className="font-mono text-green-600 font-bold">0x{cells[selectedCell].value}</span>.
                This value could be a part of a program instruction, a piece of text, or a number.
              </p>
            </motion.div>
          )}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Key Concepts</h3>
            <ul className={cn(
              "space-y-4 text-sm",
              theme === 'dark' ? "text-slate-400" : "text-slate-600"
            )}>
              <li>
                <strong className={cn("block mb-1", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>Addressing</strong>
                Every byte in RAM has a unique number (address) so the CPU can find it instantly.
              </li>
              <li>
                <strong className={cn("block mb-1", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>Volatile</strong>
                RAM needs power to keep data. If you turn off the computer, everything in RAM is gone.
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Bytes & Words</h3>
            <p className={cn(
              "text-sm leading-relaxed",
              theme === 'dark' ? "text-slate-400" : "text-slate-600"
            )}>
              Computers usually group 8 bits into a <strong>Byte</strong>. 
              Modern CPUs often work with 64 bits (8 bytes) at a time, which we call a <strong>Word</strong>.
            </p>
            <div className="flex gap-1 mt-4">
              {bits.map((bit, i) => (
                <div key={i} className={cn(
                  "flex-1 h-8 border rounded flex items-center justify-center text-[10px] font-mono transition-colors",
                  theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-inner"
                )}>
                  {bit}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 text-center block uppercase tracking-wider">One Byte (8 Bits)</span>
          </div>
        </section>
      </div>
    </TopicLayout>
  );
};