'use client';

import React, { useState } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { motion } from 'framer-motion';
import { Keyboard, HardDrive, Monitor, ShieldCheck, ArrowRight, Lightbulb, AlertCircle, CheckCircle2, Cpu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const IOBasics: React.FC = () => {
  const [ioMode, setIoMode] = useState<'blocking' | 'non-blocking'>('blocking');
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={8} title="How Does a Program Interact With Hardware?">
      <div className="space-y-12">
        {/* Section A: Simple Introduction */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            A program that only does calculations in CPU registers is completely useless if it cannot communicate with the outside world. 
            <strong>Input / Output (I/O)</strong> is how software accepts data from you (keyboard, mouse, microphone) and delivers results back to you (screen, speakers, SSD, network).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            However, your program is strictly forbidden from touching physical hardware wires directly. 
            All hardware communication must go through <strong>System Calls</strong> and <strong>Device Drivers</strong> managed by the Operating System.
          </p>
        </section>

        {/* Section B & C: Why Gatekeepers Exist & The Passport Control Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              User Mode vs Kernel Mode Security
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Why can't your C code or Python script send signals directly to the monitor or SSD? 
              Because if any student or website could manipulate hardware directly, a buggy program could write garbage over your disk or spy on your keystrokes. 
              The CPU operates in <strong>User Mode (unprivileged)</strong>. Whenever it needs hardware, it asks the <strong>OS Kernel (privileged mode)</strong> via a <strong>System Call</strong>.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              The Bank Teller Analogy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think of a bank: Customers are not allowed to walk into the back vault and grab cash from the safe! 
              Instead, you walk up to a teller counter (the <strong>System Call API</strong>), slide your withdrawal slip through the glass window, 
              and the teller (the <strong>OS Kernel</strong>) verifies your identity and retrieves the money for you.
            </p>
          </div>
        </div>

        {/* Section D: Interactive Visual Explanation — The Complete I/O Pathway */}
        <section className={cn(
          "rounded-2xl p-6 sm:p-8 border shadow-xl transition-colors space-y-6",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-500 font-bold">
              The Journey of a Keypress &amp; printf
            </span>
            <h3 className="text-xl font-bold text-foreground">
              Hardware-to-Application I/O Pipeline
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center pt-2">
            {/* Step 1: Physical Hardware */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center text-center gap-2">
              <Keyboard className="w-8 h-8 text-blue-500" />
              <span className="text-xs font-bold text-foreground">1. Physical Device</span>
              <p className="text-[11px] text-muted-foreground">
                You press the 'A' key on keyboard (closes electrical switch).
              </p>
            </div>

            <div className="hidden md:flex justify-center text-muted-foreground">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Step 2: Device Controller & Driver */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center text-center gap-2">
              <HardDrive className="w-8 h-8 text-purple-500" />
              <span className="text-xs font-bold text-foreground">2. Device Driver</span>
              <p className="text-[11px] text-muted-foreground">
                Hardware chip sends scan code. Driver translates it into character 'A'.
              </p>
            </div>

            <div className="hidden md:flex justify-center text-muted-foreground">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Step 3: OS Kernel */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <span className="text-xs font-bold text-foreground">3. OS System Call</span>
              <p className="text-[11px] text-muted-foreground">
                Kernel verifies app permissions and passes data across security boundary.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-border/80">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>User Program receives char &apos;A&apos; &rarr; Calls <code className="font-bold">printf(&quot;Result: %d&quot;, 42)</code></span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-foreground flex items-center gap-2">
              <Monitor className="w-4 h-4 text-emerald-500" />
              <span>Monitor Driver updates GPU framebuffer &rarr; Pixels draw &quot;42&quot;</span>
            </div>
          </div>
        </section>

        {/* Interrupts vs Polling Section */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            How Does Hardware Notify the CPU? Interrupts vs. Polling
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            How does the CPU know you clicked your mouse or tapped a key? There are two possible strategies:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase">
                1. Polling (The Inefficient Way)
              </span>
              <h4 className="font-bold text-foreground text-base">Continuous Asking</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The CPU runs in a tight loop repeatedly asking the keyboard: <em>&quot;Did you press a key yet? Did you press a key yet?&quot;</em> 
                This burns 100% of CPU power, drains batteries, and prevents the CPU from doing any useful calculations.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-500 uppercase">
                2. Hardware Interrupts (The Modern Way)
              </span>
              <h4 className="font-bold text-foreground text-base">Signal When Ready</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The CPU completely ignores the keyboard. When you press a key, the keyboard hardware sends an electrical pulse down a dedicated wire called the <strong>Interrupt Line</strong>. 
                The CPU immediately pauses, executes an <strong>Interrupt Handler</strong> in the OS Kernel to collect the key, and resumes where it left off.
              </p>
            </div>
          </div>
        </section>

        {/* Section E: How It Works Internally — Blocking vs Non-Blocking I/O */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Blocking vs Non-Blocking I/O
              </h3>
              <p className="text-sm text-muted-foreground">
                I/O operations (like reading from an SSD or fetching from the Internet) are millions of times slower than the CPU:
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIoMode('blocking')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  ioMode === 'blocking'
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                Blocking I/O
              </button>
              <button
                type="button"
                onClick={() => setIoMode('non-blocking')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  ioMode === 'non-blocking'
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                Non-Blocking (Async) I/O
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card">
            {ioMode === 'blocking' ? (
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-blue-500 uppercase">
                  Traditional Synchronous / Blocking Mode (e.g. standard C scanf / read)
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  When your program executes <code className="font-mono">scanf()</code> or reads from a file, the OS puts your program to sleep (Suspended state). 
                  Your program does not execute another single instruction until the user actually presses a key or the hard drive finishes reading.
                </p>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 font-mono">
                  Program state: SLEEPING (Waiting for I/O completion). CPU core runs other processes in the meantime.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-500 uppercase">
                  Modern Asynchronous / Non-Blocking Mode (e.g. JavaScript, Node.js, Go)
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  The program asks the OS: <em>"Start fetching this file, but don't pause me! Let me keep calculating."</em> 
                  The program continues running animations or handling user clicks. When the data arrives later, the OS notifies the program via an <strong>event loop or callback</strong>.
                </p>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 font-mono">
                  Program state: ACTIVE (Non-blocking). UI remains 60fps responsive while I/O happens in the background.
                </div>
              </div>
            )}
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
              <strong>"A print statement is fast because it's only one line of code."</strong> <br />
              <span className="text-foreground">Reality:</span> Printing to the screen or console is actually one of the slowest things your code can do! It requires a user-to-kernel mode switch, font rasterization, and GPU pixel rendering. Doing 10,000 <code className="font-mono">printf()</code> calls in a loop takes seconds, while 10,000 math additions in CPU registers takes nanoseconds.
            </li>
            <li>
              <strong>"A device driver is a hardware chip."</strong> <br />
              <span className="text-foreground">Reality:</span> A driver is software! It is a specialized piece of code written by the hardware manufacturer (like NVIDIA or Logitech) that teaches the generic OS kernel how to speak the specific electrical protocol of that device.
            </li>
          </ul>
        </section>

        {/* Section H: Quick Knowledge Check */}
        <PredictCheck
          question="Why are regular user programs (like web browsers or games) forbidden from sending electronic signals directly to physical hardware wires?"
          options={[
            'Because modern CPUs lack the physical circuits to send electrical signals',
            'For security and stability: to prevent crashes, hardware corruption, and unauthorized data theft',
            'Because monitor screens can only read binary from the hard drive',
            'Because device drivers are only allowed to run when the computer is turned off',
          ]}
          correctIndex={1}
          explanation="If any program could touch hardware wires directly, a single buggy program could overwrite your operating system files or spy on every keystroke you make! The OS kernel acts as the secure gatekeeper via System Calls."
        />

        {/* Section I: Summary */}
        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-blue-500">
            Lesson 08 Key Takeaways
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>I/O connects software to the outside world (keyboards, screens, storage, network).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>User Mode programs must request hardware access through OS System Calls.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Device drivers translate generic operating system requests into specific hardware signals.</span>
            </li>
          </ul>
        </div>
      </div>
    </TopicLayout>
  );
};
