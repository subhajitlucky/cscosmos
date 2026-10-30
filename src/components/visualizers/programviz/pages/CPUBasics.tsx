'use client';
import React, { useState } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { MemoryHierarchy } from '../components/MemoryHierarchy';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PartKey = 'cu' | 'alu' | 'regs' | 'pc' | 'ir' | 'acc' | 'gp';

const PART_DETAILS: Record<PartKey, { title: string; text: string }> = {
  cu: {
    title: 'Control Unit (CU)',
    text: 'The manager. During FETCH it points the Program Counter at the next instruction; during DECODE it translates the instruction bits into control signals; during EXECUTE it routes data between registers and the ALU — it never does math itself.',
  },
  alu: {
    title: 'Arithmetic Logic Unit (ALU)',
    text: 'The calculator. During EXECUTE it performs math (ADD, SUB) and logic (AND, OR, NOT) on register values, then drops the result into a register like the accumulator.',
  },
  regs: {
    title: 'Registers',
    text: 'The scratchpad — the fastest storage that exists, built directly into the CPU. Instructions read their inputs from registers and write results back to them. There are only a handful, so compilers fight for them.',
  },
  pc: {
    title: 'Program Counter (PC)',
    text: 'Holds the ADDRESS of the NEXT instruction to run. Every fetch reads memory at PC, then the PC increments to point at the following instruction — that is how the CPU walks through a program.',
  },
  ir: {
    title: 'Instruction Register (IR)',
    text: 'Holds the CURRENT instruction while the control unit decodes it — the instruction is literally sitting in this register between fetch and decode.',
  },
  acc: {
    title: 'Accumulator (ACC)',
    text: 'A special register where the ALU commonly leaves its result. In our simulator, “ADD R0, R1” writes 42 into both the ACC and R0.',
  },
  gp: {
    title: 'General Purpose Registers',
    text: 'Fast temporary storage instructions use freely (R0, R1, R2, …). Unlike the PC, they hold data — not addresses — unless your program decides otherwise.',
  },
};

export const CPUBasics: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPart, setSelectedPart] = useState<PartKey | null>(null);

  const partCardClass = (key: PartKey, base: string) =>
    cn(
      base,
      'text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
      selectedPart === key
        ? 'ring-2 ring-blue-500 shadow-xl scale-[1.02]'
        : 'hover:scale-[1.01]'
    );

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
            Inside the CPU, three main components work together to make this happen. <strong>Click any part below</strong> to see exactly what it does during the instruction cycle.
          </p>
        </section>

        {/* Visualization: CPU Block Diagram (interactive) */}
        <div className={cn(
          "rounded-2xl p-8 border relative overflow-hidden transition-colors",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <h3 className={cn(
            "text-center mb-8 uppercase tracking-widest text-sm font-semibold",
            theme === 'dark' ? "text-slate-400" : "text-slate-500"
          )}>Inside the CPU — Click a Part</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Control Unit */}
            <motion.button
              type="button"
              onClick={() => setSelectedPart(selectedPart === 'cu' ? null : 'cu')}
              aria-pressed={selectedPart === 'cu'}
              className={partCardClass('cu', cn(
                "p-6 rounded-xl border-2 shadow-lg",
                theme === 'dark' ? "bg-slate-800 border-blue-500 shadow-blue-500/10" : "bg-slate-50 border-blue-400 shadow-blue-400/5"
              ))}
              initial={false}
              animate={{ x: 0, opacity: 1 }}
            >
              <h4 className="font-bold text-blue-500 mb-2 uppercase text-xs">Control Unit (CU)</h4>
              <p className={cn("text-sm", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>The "Manager". It decodes instructions and coordinates how data moves around the computer.</p>
            </motion.button>

            {/* ALU */}
            <motion.button
              type="button"
              onClick={() => setSelectedPart(selectedPart === 'alu' ? null : 'alu')}
              aria-pressed={selectedPart === 'alu'}
              className={partCardClass('alu', cn(
                "p-6 rounded-xl border-2 shadow-lg",
                theme === 'dark' ? "bg-slate-800 border-red-500 shadow-red-500/10" : "bg-slate-50 border-red-400 shadow-red-400/5"
              ))}
              initial={false}
              animate={{ x: 0, opacity: 1 }}
            >
              <h4 className="font-bold text-red-500 mb-2 uppercase text-xs">Arithmetic Logic Unit (ALU)</h4>
              <p className={cn("text-sm", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>The "Calculator". It performs all the math (addition, subtraction) and logic (AND, OR, NOT).</p>
            </motion.button>

            {/* Registers */}
            <motion.div
              className={partCardClass('regs', cn(
                "md:col-span-2 p-6 rounded-xl border-2 shadow-lg",
                theme === 'dark' ? "bg-slate-800 border-green-500 shadow-green-500/10" : "bg-slate-50 border-green-400 shadow-green-400/5"
              ))}
              initial={false}
              animate={{ y: 0, opacity: 1 }}
            >
              <h4 className="font-bold text-green-500 mb-2 uppercase text-xs text-center">Registers</h4>
              <p className={cn("text-sm text-center mb-4", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>The "Scratchpad". Tiny, ultra-fast storage locations inside the CPU for immediate data.</p>

              <div className="flex flex-wrap justify-center gap-4">
                {([
                  { key: 'pc', label: 'Program Counter' },
                  { key: 'ir', label: 'Instruction Register' },
                  { key: 'acc', label: 'Accumulator' },
                  { key: 'gp', label: 'General Purpose' },
                ] as { key: PartKey; label: string }[]).map((reg) => (
                  <button
                    key={reg.key}
                    type="button"
                    onClick={() => setSelectedPart(selectedPart === reg.key ? null : reg.key)}
                    aria-pressed={selectedPart === reg.key}
                    className={cn(
                      "px-3 py-1 border rounded text-xs font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                      selectedPart === reg.key
                        ? "bg-blue-600 text-white border-blue-500 shadow-md"
                        : (theme === 'dark' ? "bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500" : "bg-white border-slate-200 text-slate-600 hover:border-blue-400")
                    )}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Detail panel */}
          <div className={cn(
            "mt-8 rounded-xl border min-h-[96px] p-5 transition-colors",
            theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
          )}>
            <AnimatePresence mode="wait">
              {selectedPart ? (
                <motion.div
                  key={selectedPart}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-2"
                  role="status"
                >
                  <h4 className="font-bold text-blue-500">{PART_DETAILS[selectedPart].title}</h4>
                  <p className={cn("text-sm leading-relaxed", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
                    {PART_DETAILS[selectedPart].text}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  initial={false}
                  animate={{ opacity: 1 }}
                  className={cn("text-sm text-center pt-6", theme === 'dark' ? "text-slate-500" : "text-slate-400")}
                >
                  Click the Control Unit, the ALU, or any register above to inspect it.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Memory Hierarchy & CPU Caches: The Memory Wall */}
        <MemoryHierarchy />

        <PredictCheck
          question="An instruction says “ADD R0, R1”. Which part of the CPU performs the actual addition?"
          options={['The Control Unit', 'The ALU', 'The Program Counter', 'The RAM chips']}
          correctIndex={1}
          explanation="The ALU is the calculator — the Control Unit only decides WHEN and WHICH values, and it routes them into the ALU. The Program Counter just tracks which instruction is next."
        />
      </div>
    </TopicLayout>
  );
};
