'use client';

import React from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { motion } from 'framer-motion';
import { FileCode, Database, Cpu, Terminal, Play, AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
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
        {/* Section A: Simple Introduction */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            A <strong>computer program</strong> is simply a sequence of step-by-step instructions that tells a computer what to do. 
            Just as a cooking recipe guides a chef to prepare a meal, a program guides the computer hardware to solve a math problem, display a web page, or play a game.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Before you run a program, it is not active. It sits quietly as a passive file on your storage disk (SSD or hard drive). Only when you launch it does the computer bring those instructions to life.
          </p>
        </section>

        {/* Section B & C: Why Does It Exist & Real-World Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Why Do Programs Exist?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Early computers in the 1940s had to be physically rewired by hand with cables and vacuum tubes for every single calculation! 
              Computer pioneers like <strong>John von Neumann</strong> realized: <em>"What if instructions could be stored as data in memory, so the machine could change tasks instantly?"</em> That invention gave birth to modern software.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-500" />
              The Music Box &amp; Sheet Music Analogy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think of a computer program like sheet music. Sheet music is just ink on paper—it makes no sound on its own. 
              The <strong>musician (the CPU)</strong> reads the notes (instructions) and plays the instruments (hardware). 
              A different sheet of music immediately turns the same musician into a symphony orchestra or a rock concert.
            </p>
          </div>
        </div>

        {/* Section D: Interactive Visual Explanation — Program Lifecycle */}
        <section className={cn(
          "rounded-2xl p-6 sm:p-8 border shadow-xl transition-colors space-y-6",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-500 font-bold">
              The Fundamental Journey
            </span>
            <h3 className="text-xl font-bold text-foreground">
              What Happens When You Click "Run"?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative pt-4">
            {/* Step 1: Human Source Code */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-foreground text-sm">Source Code</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You write readable text using a programming language like C, Python, or JavaScript.
              </p>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-foreground">
                a = 15 + 27
              </span>
            </div>

            {/* Step 2: Stored File on Disk */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-bold text-foreground text-sm">File on Storage</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Saved as bytes on your SSD/disk. At this stage, it uses zero CPU time and zero RAM.
              </p>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-foreground">
                program.exe
              </span>
            </div>

            {/* Step 3: Loaded into RAM */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-bold text-foreground text-sm">Loaded into RAM</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you click "Run", the Operating System copies the instructions into high-speed memory.
              </p>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-foreground">
                Process Created
              </span>
            </div>

            {/* Step 4: CPU Execution & Output */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="font-bold text-foreground text-sm">CPU Execution</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The CPU fetches instructions one by one, executes arithmetic, and outputs the result.
              </p>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-foreground">
                Screen Prints "42"
              </span>
            </div>
          </div>
        </section>

        {/* Section E: How It Works Internally — Code vs Data */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            The Two Halves of Every Program: Code and Data
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every computer program in existence breaks down into two core elements:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-500" />
                <h4 className="font-bold text-foreground text-base">1. Code (The Verbs)</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                These are the <strong>action commands</strong>: <code className="font-mono">ADD</code>, <code className="font-mono">MOVE</code>, <code className="font-mono">COMPARE</code>, <code className="font-mono">JUMP</code>. They tell the CPU what calculations or steps to perform.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-500" />
                <h4 className="font-bold text-foreground text-base">2. Data (The Nouns)</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                These are the <strong>values operated on</strong>: numbers (e.g. <code className="font-mono">15</code>, <code className="font-mono">27</code>), user text, images, or audio samples that the code modifies and computes.
              </p>
            </div>
          </div>
        </section>

        {/* Section G: Common Misconceptions */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="font-bold text-foreground text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            Common Beginner Misconceptions
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside leading-relaxed">
            <li>
              <strong>"A program is the same thing as a process."</strong> <br />
              <span className="text-foreground">Reality:</span> A <strong>program</strong> is like a recipe in a cookbook—an inert, passive file of text/bytes sitting on your SSD. A <strong>process</strong> is the chef actually in the kitchen cooking—it has an assigned Process ID (PID), memory allocated in RAM, and active execution on the CPU.
            </li>
            <li>
              <strong>"The CPU executes Python or C code directly."</strong> <br />
              <span className="text-foreground">Reality:</span> The CPU has zero understanding of English words like <code className="font-mono">if</code>, <code className="font-mono">while</code>, or <code className="font-mono">function</code>. It only understands raw binary numbers called <strong>machine instructions</strong>. Your source code must always be translated first.
            </li>
            <li>
              <strong>"A program runs directly from your hard drive or SSD."</strong> <br />
              <span className="text-foreground">Reality:</span> Hard drives and SSDs are far too slow for the CPU (thousands of times slower than RAM). The operating system always copies instructions into fast RAM before the CPU begins executing them.
            </li>
          </ul>
        </section>

        {/* Section H: Active Learning Check */}
        <PredictCheck
          kind="identify-incorrect"
          question="Which of the following statements about computer programs is FALSE (a common beginner misconception)?"
          options={[
            'Before execution, a program exists as an inactive file of bytes on storage (SSD)',
            'The CPU chip directly executes Python and JavaScript text without any translation',
            'When launched, the Operating System copies program instructions into high-speed RAM',
            'Every software program is fundamentally composed of code (instructions) and data (values)',
          ]}
          correctIndex={1}
          explanation="Statement B is FALSE! The CPU is silicon hardware—it cannot understand high-level human words like 'print', 'if', or 'def'. Code must be compiled or interpreted into binary machine instructions before the CPU can run it."
          optionExplanations={[
            'This statement is TRUE! On disk, a program is an inert file taking zero CPU time.',
            'Correct! This statement is FALSE. The CPU cannot read source code directly; it only runs binary machine code.',
            'This statement is TRUE! Storage disks are far too slow for the CPU, so the OS always loads code into RAM first.',
            'This statement is TRUE! Every program consists of instructions (code verbs) operating on values (data nouns).',
          ]}
        />

        {/* Section I: Summary */}
        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-blue-500">
            Lesson 01 Key Takeaways
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>A program is a sequence of instructions telling hardware what to compute.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Source code is human-friendly; machine code is CPU-friendly binary numbers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Programs live on storage disks until launched, then load into RAM for CPU execution.</span>
            </li>
          </ul>
        </div>
      </div>
    </TopicLayout>
  );
};
