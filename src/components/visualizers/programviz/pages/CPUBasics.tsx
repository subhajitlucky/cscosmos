'use client';

import React, { useState } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { MemoryHierarchy } from '../components/MemoryHierarchy';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Clock, Lightbulb, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PartKey = 'cu' | 'alu' | 'regs' | 'pc' | 'ir' | 'acc' | 'gp';

const PART_DETAILS: Record<PartKey, { title: string; analogy: string; text: string }> = {
  cu: {
    title: 'Control Unit (CU)',
    analogy: 'The Conductor of the Orchestra',
    text: 'The Control Unit directs all electronic traffic inside the CPU. It fetches instructions, decodes what they mean, and sends electrical control signals to the ALU and registers telling them when and how to react. It never does math itself—it manages everyone else.',
  },
  alu: {
    title: 'Arithmetic Logic Unit (ALU)',
    analogy: 'The Pocket Calculator',
    text: 'The ALU does the heavy lifting: mathematical arithmetic (addition, subtraction, multiplication) and logical comparisons (AND, OR, NOT, Equal, Greater-Than). When your program says "15 + 27", the ALU silicon is what performs the addition.',
  },
  regs: {
    title: 'Hardware Registers',
    analogy: 'The Scratchpad in the Chef’s Pocket',
    text: 'Registers are tiny, ultra-fast storage cells located directly inside the CPU silicon. Because RAM is too far away to access on every clock tick, the CPU keeps the immediate numbers it is working with in these registers.',
  },
  pc: {
    title: 'Program Counter (PC)',
    analogy: 'The Bookmark in a Book',
    text: 'The PC holds the memory address of the NEXT instruction to be executed. As each instruction is fetched, the PC automatically increments so the CPU moves sequentially to the next line of code.',
  },
  ir: {
    title: 'Instruction Register (IR)',
    analogy: 'The Clipboard Holding the Active Order',
    text: 'When an instruction is fetched from memory, it is placed into the IR. The Control Unit reads the bits in the IR to decode what operation needs to be performed.',
  },
  acc: {
    title: 'Accumulator (ACC)',
    analogy: 'The Cash Register Display',
    text: 'A dedicated register where the ALU stores the immediate result of an arithmetic computation (e.g. holding 42 after computing 15 + 27).',
  },
  gp: {
    title: 'General Purpose Registers (R0, R1, R2...)',
    analogy: 'Scratchpad Slots',
    text: 'Temporary storage registers that programmers and compilers use freely to hold intermediate variables during calculations.',
  },
};

export const CPUBasics: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPart, setSelectedPart] = useState<PartKey>('cu');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const partCardClass = (key: PartKey, base: string) =>
    cn(
      base,
      'text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
      selectedPart === key
        ? 'ring-2 ring-blue-500 shadow-xl scale-[1.02]'
        : 'hover:scale-[1.01]'
    );

  return (
    <TopicLayout stepNumber={3} title="Understanding the CPU">
      <div className="space-y-12">
        {/* Section A: Simple Introduction */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            The <strong>Central Processing Unit (CPU)</strong> is often called the "brain" of the computer. 
            Its sole purpose is to fetch instructions from memory, decode what they mean, and execute them at unbelievable speeds.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Inside the CPU chip, billions of microscopic transistors form three essential components: the <strong>Control Unit (the manager)</strong>, the <strong>ALU (the calculator)</strong>, and <strong>Registers (the immediate scratchpad)</strong>.
          </p>
        </section>

        {/* Section B & C: Why CPU & Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              What is a CPU "Core"?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In early computers, a CPU chip had only one processing unit. Today, a modern processor chip contains multiple independent execution engines called <strong>cores</strong> (e.g. Quad-Core = 4 cores, Octa-Core = 8 cores). 
              Each core has its own Control Unit, ALU, and registers, allowing it to execute instructions simultaneously.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              The Metronome Analogy (Clock Speed)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A computer needs an electronic heartbeat to synchronize operations. A tiny quartz crystal oscillates billions of times per second. 
              A <strong>3.0 GHz CPU</strong> ticks 3,000,000,000 times every second! On every tick (cycle), electrical charges advance across transistors to process the next step of an instruction.
            </p>
          </div>
        </div>

        {/* Section D: Interactive Visual Architecture Diagram */}
        <div className={cn(
          "rounded-2xl p-6 sm:p-8 border shadow-xl transition-colors space-y-6",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-500 font-bold">
              Interactive Hardware Inspector
            </span>
            <h3 className="text-xl font-bold text-foreground">
              Inside the CPU Core (Click any part to inspect)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Control Unit */}
            <button
              type="button"
              onClick={() => setSelectedPart('cu')}
              aria-pressed={selectedPart === 'cu'}
              className={partCardClass('cu', cn(
                "p-5 rounded-xl border-2 transition-all",
                theme === 'dark' ? "bg-slate-800/80 border-blue-500/50" : "bg-slate-50 border-blue-400"
              ))}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-blue-500 text-sm">Control Unit (CU)</h4>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                  The Manager
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Decodes instructions, synchronizes clock signals, and coordinates data movement across registers.
              </p>
            </button>

            {/* Arithmetic Logic Unit */}
            <button
              type="button"
              onClick={() => setSelectedPart('alu')}
              aria-pressed={selectedPart === 'alu'}
              className={partCardClass('alu', cn(
                "p-5 rounded-xl border-2 transition-all",
                theme === 'dark' ? "bg-slate-800/80 border-red-500/50" : "bg-slate-50 border-red-400"
              ))}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-red-500 text-sm">Arithmetic Logic Unit (ALU)</h4>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-bold">
                  The Calculator
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Performs all mathematical addition/subtraction and boolean logical operations (AND, OR, NOT).
              </p>
            </button>

            {/* Hardware Registers */}
            <div className={cn(
              "md:col-span-2 p-5 rounded-xl border-2 transition-all space-y-4",
              theme === 'dark' ? "bg-slate-800/80 border-emerald-500/50" : "bg-slate-50 border-emerald-400"
            )}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-emerald-500 text-sm">CPU Registers (The Scratchpad)</h4>
                  <p className="text-xs text-muted-foreground">
                    Sub-nanosecond storage locations built directly into the silicon core:
                  </p>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold self-start">
                  Fastest Memory in Computer
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([
                  { key: 'pc', label: 'Program Counter (PC)' },
                  { key: 'ir', label: 'Instruction Register (IR)' },
                  { key: 'acc', label: 'Accumulator (ACC)' },
                  { key: 'gp', label: 'General Purpose (R0, R1)' },
                ] as { key: PartKey; label: string }[]).map((reg) => (
                  <button
                    key={reg.key}
                    type="button"
                    onClick={() => setSelectedPart(reg.key)}
                    className={cn(
                      "p-2.5 rounded-lg border text-xs font-mono font-bold transition-all text-center",
                      selectedPart === reg.key
                        ? "bg-blue-600 text-white border-blue-500 shadow-md"
                        : "bg-card border-border text-foreground hover:border-blue-400"
                    )}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Inspector Panel */}
          <div className="p-5 rounded-xl border border-border bg-muted/40 space-y-2">
            <span className="text-[10px] font-mono uppercase text-blue-500 font-bold block">
              Component Deep-Dive: {PART_DETAILS[selectedPart].analogy}
            </span>
            <h4 className="text-base font-bold text-foreground">
              {PART_DETAILS[selectedPart].title}
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {PART_DETAILS[selectedPart].text}
            </p>
          </div>
        </div>

        {/* Section G: Common Misconceptions & Architecture Reality */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <h3 className="font-bold text-foreground text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            Common Beginner Misconceptions vs. Real Hardware
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside leading-relaxed">
            <li>
              <strong>"A 4.0 GHz CPU executes exactly 4 billion instructions every second."</strong> <br />
              <span className="text-foreground">Reality:</span> Clock speed is only the rate of electronic metronome pulses. How many instructions finish per clock tick is called <strong>IPC (Instructions Per Cycle)</strong>. A modern superscalar CPU can execute 4 to 6 instructions per cycle in parallel, while an instruction stalled waiting for RAM might take 200 cycles! A modern 2.5 GHz chip crushes a 20-year-old 3.8 GHz Pentium 4.
            </li>
            <li>
              <strong>"The Control Unit calculates the numbers."</strong> <br />
              <span className="text-foreground">Reality:</span> The Control Unit never performs math. It is strictly the conductor: it decodes instructions and sends control wire signals so the ALU can calculate.
            </li>
            <li>
              <strong>"Educational CPU Model vs. Modern Reality:"</strong> <br />
              <span className="text-foreground">Reality:</span> In this course, we teach sequential execution so you can learn without overwhelm. Real modern CPUs use <strong>Branch Prediction</strong> (guessing which path an <code className="font-mono">if</code> statement will take), <strong>Pipelining</strong>, and <strong>Out-of-Order Execution</strong> to run instructions ahead of time whenever possible.
            </li>
          </ul>
        </section>

        {/* Section H: Active Learning Check */}
        <PredictCheck
          kind="why-operation"
          question="An instruction says “ADD R0, R1”. Why does the Control Unit NOT perform the addition itself?"
          options={[
            'Because the Control Unit is only powered when the computer is shutting down',
            'Because the Control Unit is an orchestration manager with no arithmetic logic gates; arithmetic is physically wired inside the ALU',
            'Because registers are physically located inside the power supply',
            'Because addition can only be computed by the graphics card (GPU)',
          ]}
          correctIndex={1}
          explanation="Correct! Silicon hardware specializes: the Control Unit contains decoding logic to direct data traffic, while the ALU (Arithmetic Logic Unit) contains the physical transistor adders that perform math."
          optionExplanations={[
            'Incorrect! The Control Unit operates continuously on every single clock cycle.',
            'Correct! The Control Unit coordinates signals, while the ALU contains the physical arithmetic adder circuits.',
            'Incorrect! Registers are ultra-fast silicon cells built directly inside the CPU core.',
            'Incorrect! General CPU integer math is always handled by the CPU ALU, not the GPU.',
          ]}
        />

        {/* Optional Collapsible Advanced Deep-Dive: CPU Caches & SRAM */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((p) => !p)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold text-foreground">
                Optional Advanced Topic: CPU Caches (L1, L2, L3) &amp; The Memory Wall
              </span>
            </div>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3"
              >
                <MemoryHierarchy />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section I: Summary */}
        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-blue-500">
            Lesson 03 Key Takeaways
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>The CPU is the central execution engine of the computer.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>A CPU core contains a Control Unit (manager), ALU (calculator), and Registers (scratchpad).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>The Program Counter (PC) stores the address of the next instruction to fetch.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>The CPU clock synchronizes electrical signals billions of times per second (GHz).</span>
            </li>
          </ul>
        </div>
      </div>
    </TopicLayout>
  );
};
