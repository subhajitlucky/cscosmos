'use client';

import React from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { EndToEndExecutionStepper } from '../components/EndToEndExecutionStepper';
import { Sparkles, Award, Lightbulb, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ExecutionSummary: React.FC = () => {
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={10} title="Putting Everything Together">
      <div className="space-y-12">
        {/* Section A: Simple Introduction */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            You have explored the individual pieces: bits and bytes, the CPU ALU and Control Unit, the fetch-execute cycle, 
            RAM addresses, the stack and heap, multitasking, and system calls.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Now comes the grand unification. We will trace the complete, unbroken journey of a real C program—from the instant the developer writes it on a keyboard 
            to compilation, process creation, CPU execution, screen display, and termination.
          </p>
        </section>

        {/* Section B & C: The Symphony Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              The Symphony of Modern Computing
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When you write <code className="font-mono text-blue-500">int a = 15; int b = 27;</code>, millions of transistors, operating system kernel routines, 
              memory buses, and graphics pipelines coordinate with nanosecond precision. 
              No single component does everything—software and hardware work in complete harmony.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-500" />
              The Rocket Flight Plan Analogy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think of a rocket mission:
              Writing the source code is drawing up the flight plan. 
              Compilation builds the physical rocket. 
              The OS launching the process is fueling the engines on the launchpad. 
              The CPU clock is the countdown clock. 
              And the print statement is the telemetry beacon beaming data back to mission control!
            </p>
          </div>
        </div>

        {/* Section D: The 13-Step End-to-End Visual Stepper */}
        <EndToEndExecutionStepper />

        {/* Section E: The Complete 13-Milestone Breakdown */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">
            The 13 Milestones of Program Execution
          </h3>

          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">1</span>
              <div>
                <strong className="text-foreground">Source Code:</strong> Written by the developer in high-level C expressions (<code className="font-mono">int a = 15; int b = 27;</code>).
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">2</span>
              <div>
                <strong className="text-foreground">Storage (SSD):</strong> Saved to persistent disk as UTF-8 text bytes in <code className="font-mono">main.c</code>.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">3</span>
              <div>
                <strong className="text-foreground">Compiler:</strong> GCC translates C into native x86 machine instructions inside object file <code className="font-mono">main.o</code>.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">4</span>
              <div>
                <strong className="text-foreground">Linker:</strong> Stitches <code className="font-mono">main.o</code> with <code className="font-mono">libc</code> (for <code className="font-mono">printf</code>) to produce executable binary <code className="font-mono">program.exe</code>.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">5</span>
              <div>
                <strong className="text-foreground">User Launch:</strong> User runs <code className="font-mono">./program</code>. The shell requests process launch from the OS.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">6</span>
              <div>
                <strong className="text-foreground">Process Creation:</strong> OS Kernel creates Process ID (PID) and allocates an isolated virtual address space.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">7</span>
              <div>
                <strong className="text-foreground">Memory Mapping:</strong> OS Loader copies machine code into RAM and initializes the Stack Pointer (SP).
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">8</span>
              <div>
                <strong className="text-foreground">CPU Fetch &amp; Execute (a = 15):</strong> PC = 0x00. CPU fetches <code className="font-mono">MOV R0, 15</code> and executes; R0 = 15.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">9</span>
              <div>
                <strong className="text-foreground">CPU Fetch &amp; Execute (b = 27):</strong> PC = 0x01. CPU fetches <code className="font-mono">MOV R1, 27</code> and executes; R1 = 27.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">10</span>
              <div>
                <strong className="text-foreground">ALU Addition:</strong> PC = 0x02. ALU adds R0 + R1 ($15 + 27 = 42$). Result 42 written to Accumulator and RAM stack address 0x10.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">11</span>
              <div>
                <strong className="text-foreground">System Call &amp; ASCII Formatting:</strong> <code className="font-mono">printf</code> converts the integer 42 into two ASCII character bytes: <code className="font-mono">&apos;4&apos; (0x34)</code> and <code className="font-mono">&apos;2&apos; (0x32)</code>. It then invokes the <code className="font-mono">sys_write</code> system call, safely switching the CPU from User Mode to Kernel Mode.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">12</span>
              <div>
                <strong className="text-foreground">Device Output:</strong> The terminal driver writes the ASCII character codes into the GPU framebuffer. The display hardware illuminates RGB subpixels on your physical monitor to render the glyphs &quot;42&quot;.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0 font-mono">13</span>
              <div>
                <strong className="text-foreground">Termination:</strong> Program returns 0. OS Kernel reclaims address space and terminates the process.
              </div>
            </div>
          </div>
        </section>

        {/* Section G: Common Misconceptions */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-3">
          <h3 className="font-bold text-foreground text-base flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            Common Beginner Misconceptions
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside leading-relaxed">
            <li>
              <strong>"A program runs inside the source code file."</strong> <br />
              <span className="text-foreground">Reality:</span> The file on disk is never modified while running. The OS creates a separate dynamic instance in RAM (a Process). You can delete the source code file while the program is running, and the program will keep running without interruption!
            </li>
            <li>
              <strong>"A computer needs human intervention to move from step to step."</strong> <br />
              <span className="text-foreground">Reality:</span> The clock oscillator pulses continuously. Every tick pushes electrical charges through logic gates automatically, driving the entire cycle from start to finish.
            </li>
          </ul>
        </section>

        {/* Section H: Quick Knowledge Check */}
        <PredictCheck
          question="Why does the program require an operating system 'System Call' to print the number 42 to the screen instead of writing directly to the monitor?"
          options={[
            'Because the CPU does not have the physical electrical circuits to calculate 42',
            'Because user-mode applications are restricted from touching physical display hardware directly for security and crash prevention',
            'Because print statements can only run after the computer restarts',
            'Because the terminal emulator does not have an address in RAM',
          ]}
          correctIndex={1}
          explanation="Correct! To prevent applications from corrupting hardware or spying on each other, the CPU runs user code in unprivileged User Mode. Whenever an app needs to touch the screen, SSD, or network, it must request the OS Kernel to perform the I/O via a System Call."
        />

        {/* Section I: Graduation & Summary */}
        <div className="p-8 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground">
                Congratulations! You Understand How Programs Execute
              </h4>
              <p className="text-xs text-muted-foreground">
                You have completed the entire Program Cosmos curriculum.
              </p>
            </div>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            You now possess the foundational mental model that separates great software engineers from casual code typers. 
            Whenever you write code in any language—whether C, Python, JavaScript, Rust, or Java—you know what happens beneath the surface: 
            how memory is laid out, how the CPU executes instructions on clock ticks, how the OS multitasks, and how system calls bridge software to physical silicon.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              ✓ Hardware Architecture
            </span>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300">
              ✓ Memory Layout &amp; Stack
            </span>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300">
              ✓ Multitasking &amp; Context Switching
            </span>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
              ✓ Compilation &amp; System Calls
            </span>
          </div>
        </div>
      </div>
    </TopicLayout>
  );
};
