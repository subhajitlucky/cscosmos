'use client';
import React, { useState, useEffect } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { motion } from 'framer-motion';
import { ArrowRight, Pause, Play, RotateCcw, StepBack, StepForward } from 'lucide-react';
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

const FRAME_INFO: Record<string, string> = {
  'main()': 'x = 5',
  'compute(x)': 'n = 5',
  'square(n)': 'n = 5 → 25',
};

const CALL_TIMELINE: { stack: string[]; caption: string }[] = [
  { stack: [], caption: 'No function is running yet — the stack is empty.' },
  { stack: ['main()'], caption: 'main() starts → a frame is PUSHED onto the stack.' },
  { stack: ['main()', 'compute(x)'], caption: 'compute(x) is called → a second frame is PUSHED on top of main’s.' },
  { stack: ['main()', 'compute(x)', 'square(n)'], caption: 'square(n) runs now — and only the TOP frame ever executes.' },
  { stack: ['main()', 'compute(x)'], caption: 'square returns 25 → its frame is POPPED. Last in, first out.' },
  { stack: ['main()'], caption: 'compute returns → its frame is popped too.' },
  { stack: [], caption: 'main returns → the stack is empty again. Every call is perfectly reversed.' },
];

export const MemoryLayout: React.FC = () => {
  const { theme } = useTheme();
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setFrameIndex((f) => {
        if (f >= CALL_TIMELINE.length - 1) {
          setPlaying(false);
          return f;
        }
        return f + 1;
      });
    }, 1700);
    return () => window.clearInterval(id);
  }, [playing]);

  const current = CALL_TIMELINE[frameIndex];

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

        {/* Interactive: The Stack in Motion */}
        <div className={cn(
          "rounded-2xl p-8 border transition-colors",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3 className={cn(
              "uppercase tracking-widest text-sm font-semibold",
              theme === 'dark' ? "text-slate-400" : "text-slate-500"
            )}>The Stack in Motion — Watch a Function Call</h3>
            <span className={cn(
              "text-[10px] font-mono px-2 py-0.5 rounded uppercase",
              theme === 'dark' ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
            )}>
              Frame {frameIndex + 1} / {CALL_TIMELINE.length}
            </span>
          </div>

          <p className={cn(
            "text-sm mb-4 min-h-[40px]",
            theme === 'dark' ? "text-slate-300" : "text-slate-700"
          )} aria-live="polite">
            {current.caption}
          </p>

          <div className={cn(
            "relative flex flex-col-reverse gap-2 p-4 rounded-xl border-2 min-h-[200px] justify-start transition-colors",
            theme === 'dark' ? "border-red-900/60 bg-red-950/20" : "border-red-200 bg-red-50/60"
          )}>
            {current.stack.length === 0 && (
              <p className={cn(
                "text-center text-sm pt-16 font-mono",
                theme === 'dark' ? "text-slate-600" : "text-slate-400"
              )}>(stack is empty)</p>
            )}
            {current.stack.map((name, i) => {
              const isTop = i === current.stack.length - 1;
              return (
                <motion.div
                  key={name}
                  layout
                  initial={{ opacity: 0, y: -16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border-2 px-4 py-2.5 font-mono text-sm transition-colors",
                    isTop
                      ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10"
                      : (theme === 'dark' ? "border-slate-700 bg-slate-900" : "border-slate-300 bg-white")
                  )}
                >
                  <span className="font-bold">{name}</span>
                  <span className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-slate-400" : "text-slate-500"
                  )}>{FRAME_INFO[name]}</span>
                  {isTop && (
                    <span className="text-[10px] uppercase font-extrabold text-red-500 whitespace-nowrap">
                      ← top frame runs
                    </span>
                  )}
                </motion.div>
              );
            })}
            <span className={cn(
              "text-center text-[10px] uppercase tracking-wider pt-2",
              theme === 'dark' ? "text-slate-600" : "text-slate-400"
            )}>
              Stack base ↓ · grows upward ↑
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-6">
            <button
              onClick={() => { setPlaying(false); setFrameIndex((f) => Math.max(0, f - 1)); }}
              disabled={frameIndex === 0}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 flex items-center gap-1.5",
                theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              )}
            >
              <StepBack className="w-3.5 h-3.5" /> Pop Step
            </button>
            <button
              onClick={() => { setPlaying(false); setFrameIndex((f) => Math.min(CALL_TIMELINE.length - 1, f + 1)); }}
              disabled={frameIndex === CALL_TIMELINE.length - 1}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-red-500/20"
            >
              Push Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={playing}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5",
                theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              )}
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {playing ? 'Pause' : 'Auto Play'}
            </button>
            <button
              onClick={() => { setPlaying(false); setFrameIndex(0); }}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5",
                theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              )}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
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

        <PredictCheck
          question="You call four functions one inside another — main → a → b → c. Which frame returns FIRST?"
          options={['main()', 'a()', 'b()', 'c() — the last one called']}
          correctIndex={3}
          explanation="The stack is Last-In-First-Out: c() is the top frame, so it must return before b, then a, then main. That mirror-image order is exactly what the animation showed."
        />
      </div>
    </TopicLayout>
  );
};
