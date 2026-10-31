'use client';

import React, { useState } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { AssemblySimulator } from '../components/AssemblySimulator';
import { PredictCheck } from '../components/PredictCheck';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Search, Cpu, Save, Lightbulb, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STAGES = [
  {
    id: 'fetch',
    stepNumber: '1',
    title: 'Fetch',
    icon: Search,
    color: 'text-amber-500',
    borderColor: 'border-amber-500',
    summary: 'The CPU reads the next instruction from memory.',
    action: 'The Control Unit looks at the address in the Program Counter (PC), reaches out over the memory bus into RAM, and copies the instruction bytes into the Instruction Register (IR). Then, the PC automatically increments.',
  },
  {
    id: 'decode',
    stepNumber: '2',
    title: 'Decode',
    icon: RefreshCw,
    color: 'text-emerald-500',
    borderColor: 'border-emerald-500',
    summary: 'The Control Unit translates the binary opcode.',
    action: 'The Control Unit interprets the pattern of bits. It determines: "Is this an ADD, a MOV, or a JUMP? Which registers need to be read? Which ALU circuit needs to be activated?"',
  },
  {
    id: 'execute',
    stepNumber: '3',
    title: 'Execute',
    icon: Cpu,
    color: 'text-red-500',
    borderColor: 'border-red-500',
    summary: 'The ALU or execution units carry out the operation.',
    action: 'Electrical signals pulse through the arithmetic circuits. If the instruction is "ADD R0, R1", the ALU takes 15 from R0 and 27 from R1, adding them electronically to produce 42.',
  },
  {
    id: 'writeback',
    stepNumber: '4',
    title: 'Write-Back',
    icon: Save,
    color: 'text-emerald-500',
    borderColor: 'border-emerald-500',
    summary: 'The calculation result is saved to its destination.',
    action: 'The output of the computation (42) is written back into a register (like R0 or the Accumulator) or stored into a RAM address so future instructions can use it.',
  },
];

export const InstructionCycle: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={4} title="How Does a CPU Execute Instructions?">
      <div className="space-y-12">
        {/* Section A: Simple Introduction */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            A CPU cannot think ahead or get bored. From the moment you turn on your computer until you power it down, 
            the CPU repeats a relentless, four-step routine billions of times per second: 
            <strong> Fetch → Decode → Execute → Write-Back</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This continuous loop is known as the <strong>Instruction Execution Cycle</strong> (or the Fetch-Execute cycle).
          </p>
        </section>

        {/* Section B & C: Why It Exists & The Assembly Line Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Why A Standard Cycle?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Without a strict sequence, electrical signals would collide and corrupt data. 
              By breaking instruction handling into synchronized stages driven by the clock metronome, 
              hardware guarantees that values are safely transferred before the next step begins.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-amber-500" />
              The Factory Assembly Line Analogy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think of a manufacturing robot:
              <strong> 1. Fetch:</strong> picks up a raw part from the supply shelf.
              <strong> 2. Decode:</strong> identifies the blueprint.
              <strong> 3. Execute:</strong> welds the piece into place.
              <strong> 4. Write-Back:</strong> places the assembled product into the output bin. Then repeats immediately!
            </p>
          </div>
        </div>

        {/* Section D: Interactive 4-Phase Cycle Selector */}
        <div className={cn(
          "rounded-2xl p-6 sm:p-8 border shadow-xl transition-colors space-y-6",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
              The 4-Stage Model
            </span>
            <h3 className="text-xl font-bold text-foreground">
              The Fetch-Decode-Execute-WriteBack Cycle
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {STAGES.map((stage, idx) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                  activeStage === idx
                    ? "border-amber-500 bg-amber-500/10 shadow-lg scale-[1.02]"
                    : "border-border bg-card hover:border-muted-foreground/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded", activeStage === idx ? "bg-amber-500 text-zinc-950 font-bold" : "bg-muted text-muted-foreground")}>
                    Phase {stage.stepNumber}
                  </span>
                  <stage.icon className={cn("w-5 h-5", stage.color)} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{stage.title}</h4>
                  <p className="text-xs text-muted-foreground leading-tight mt-1">{stage.summary}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Stage Narrative */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-2">
            <span className="text-xs font-mono font-bold text-amber-500 uppercase block">
              What Happens Behind the Silicon:
            </span>
            <h4 className="text-lg font-bold text-foreground">
              {STAGES[activeStage].title} Phase
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {STAGES[activeStage].action}
            </p>
          </div>
        </div>

        {/* Section E: Live Interactive 8-Bit CPU Simulator */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Interactive CPU Hardware Stepper
              </h3>
              <p className="text-sm text-muted-foreground">
                Step through real instructions one clock tick at a time. Watch the Program Counter advance, registers update, and the ALU add 15 + 27.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 font-bold self-start">
              Simplified Educational CPU Model
            </span>
          </div>

          <AssemblySimulator />
        </section>

        {/* Section G: Common Misconceptions */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="font-bold text-foreground text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            Common Beginner Misconceptions
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside leading-relaxed">
            <li>
              <strong>"MOV cuts or deletes the source value."</strong> <br />
              <span className="text-foreground">Reality:</span> The name &quot;MOV&quot; (Move) is a historical misnomer in assembly language. It does not cut-and-paste. It duplicates the electrical bits into the destination register, leaving the original source completely intact and unchanged.
            </li>
            <li>
              <strong>"A CPU finishes an entire instruction before starting the next one."</strong> <br />
              <span className="text-foreground">Reality:</span> While our educational simulator steps instructions one at a time, real modern CPUs use <strong>Instruction Pipelining</strong>. While instruction #3 is executing, instruction #2 is already being decoded, and instruction #1 is already being fetched!
            </li>
            <li>
              <strong>"The Program Counter is just a counter that adds 1."</strong> <br />
              <span className="text-foreground">Reality:</span> Normally it increments sequentially. But when your code hits an <code className="font-mono">if</code> statement, loop, or function call (like <code className="font-mono">JUMP</code>), the PC is forcefully overwritten with a completely different address, jumping execution to another part of memory!
            </li>
          </ul>
        </section>

        {/* Section H: Active Learning Check */}
        <PredictCheck
          kind="predict-register"
          question="In the CPU simulator, register R0 holds 15 and register R1 holds 27. When “ADD R0, R1” completes its Write-Back phase, what value will R0 and the Accumulator hold?"
          options={[
            '15 — registers cannot be modified after initialization',
            '27 — R0 takes the value of R1',
            '42 — the ALU output (15 + 27 = 42) is written back into R0 and the Accumulator',
            '0 — arithmetic clears all working registers to prevent leaks',
          ]}
          correctIndex={2}
          explanation="Correct! In the Execute stage, the ALU adder computes 15 + 27 = 42. In the Write-Back stage, this result 42 is latched into both the Accumulator (ACC) and the destination register R0."
          optionExplanations={[
            'Incorrect! General-purpose registers are designed specifically to be rewritten as calculations progress.',
            'Incorrect! This would happen in a MOV R0, R1 instruction, but this is an arithmetic ADD.',
            'Correct! The ALU adds 15 + 27 = 42, which is saved into R0 and ACC during Write-Back.',
            'Incorrect! Registers are not cleared; they preserve their new result for the next instruction to use.',
          ]}
        />

        {/* Section I: Summary */}
        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-amber-500">
            Lesson 04 Key Takeaways
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>The CPU repeats the Fetch → Decode → Execute → Write-Back cycle continuously.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Fetch reads from RAM at PC; Decode translates opcodes; Execute runs ALU math.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Write-back saves the result to registers or memory for subsequent instructions.</span>
            </li>
          </ul>
        </div>
      </div>
    </TopicLayout>
  );
};
