'use client';
import React, { useState, useMemo } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
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

  // Simulated memory cells — deterministic values so SSG and hydration agree.
  const cells = useMemo(() => Array.from({ length: 64 }, (_, i) => {
    const valueInt = (i * 53 + 7) % 256;
    return {
      address: `0x${i.toString(16).padStart(2, '0').toUpperCase()}`,
      value: valueInt.toString(16).padStart(2, '0').toUpperCase(),
      valueInt,
    };
  }), []);

  const selectedBits =
    selectedCell !== null
      ? cells[selectedCell].valueInt.toString(2).padStart(8, '0').split('')
      : null;

  const focusCell = (index: number) => {
    const next = Math.max(0, Math.min(cells.length - 1, index));
    setSelectedCell(next);
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-memory-cell="${next}"]`)?.focus();
    });
  };

  const handleCellKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedCell(index);
      return;
    }

    const columns = window.matchMedia('(min-width: 640px)').matches ? 8 : 4;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
        next = index + 1;
        break;
      case 'ArrowLeft':
        next = index - 1;
        break;
      case 'ArrowDown':
        next = index + columns;
        break;
      case 'ArrowUp':
        next = index - columns;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = cells.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    focusCell(next);
  };

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
                onKeyDown={(event) => handleCellKeyDown(event, i)}
                role="button"
                tabIndex={selectedCell === i || (selectedCell === null && i === 0) ? 0 : -1}
                aria-pressed={selectedCell === i}
                aria-label={`Memory cell at address ${cell.address}, value 0x${cell.value}. Press Enter to inspect.`}
                data-memory-cell={i}
                className={cn(
                  "p-2 rounded border cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
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
          <p className="mt-3 text-[10px] text-muted-foreground">
            Tip: use the arrow keys, Home, and End to move through memory; press Enter to inspect a cell.
          </p>

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
                The CPU requested address <span className="font-mono text-blue-500 font-bold">{cells[selectedCell].address}</span> and found the hexadecimal value <span className="font-mono text-green-600 font-bold">0x{cells[selectedCell].value}</span>{' '}
                — which is <span className="font-mono font-bold">{cells[selectedCell].valueInt}</span> in decimal and{' '}
                <span className="font-mono text-purple-500 font-bold">0b{cells[selectedCell].valueInt.toString(2).padStart(8, '0')}</span> in binary.
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
                Every byte in a process&apos;s address space has a number. The OS and memory-management unit translate that virtual address to a physical location in RAM.
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
              Most 64-bit CPUs work with 64 bits (8 bytes) at a time; the architecture defines its native <strong>word</strong> size.
            </p>
            <div className="flex gap-1 mt-4">
              {(selectedBits ?? '01001010'.split('')).map((bit, i) => (
                <div key={i} className={cn(
                  "flex-1 h-8 border rounded flex items-center justify-center text-[10px] font-mono transition-colors",
                  selectedCell !== null
                    ? "bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-300 font-bold"
                    : (theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-inner")
                )}>
                  {bit}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 text-center block uppercase tracking-wider">
              {selectedCell !== null
                ? `The 8 bits of ${cells[selectedCell].address} = 0x${cells[selectedCell].value}`
                : 'Example byte: 0x4A — click any cell above to see its real bits'}
            </span>
          </div>
        </section>

        <PredictCheck
          question="How many bits live in one byte?"
          options={['4 bits', '8 bits', '16 bits', '64 bits']}
          correctIndex={1}
          explanation="One byte = 8 bits. Some computers used to use other sizes, but 8 has been the standard for decades — and most 64-bit CPUs process 64-bit words (8 bytes) per operation."
        />
      </div>
    </TopicLayout>
  );
};