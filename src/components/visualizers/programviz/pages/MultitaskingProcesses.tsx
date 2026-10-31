'use client';

import React from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { ProcessSchedulerSimulator } from '../components/ProcessSchedulerSimulator';
import { Cpu, Users, Layers, Lightbulb, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MultitaskingProcesses: React.FC = () => {
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={7} title="How Does a Computer Run Multiple Programs?">
      <div className="space-y-12">
        {/* Section A: Simple Introduction */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            Right now, your computer or phone is playing background music, refreshing browser tabs, downloading updates, and watching for mouse clicks—all at the same time. 
            Yet, your machine may have only 4 or 8 CPU cores.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            How can a single CPU core execute hundreds of applications without freezing? 
            The secret is an illusion created by the Operating System called <strong>Preemptive Multitasking</strong> and <strong>Time-Sharing</strong>.
          </p>
        </section>

        {/* Section B & C: Why Time-Sharing & The Master Chef Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-500" />
              Why Multitasking Exists
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In the 1980s, early operating systems (like MS-DOS) could only run <strong>one program at a time</strong>. 
              If a program started printing a document or waiting for a slow floppy disk, the entire computer froze and locked you out until it finished! 
              Modern operating systems ensure the CPU never sits idle while waiting.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              The Master Chef Analogy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Imagine a solitary master chef in a restaurant kitchen with 3 customer orders:
              The chef does not finish Order #1 completely before touching Order #2. 
              Instead, they sear the steak for 30 seconds, quickly chop carrots for the soup while the pan sizzles, and check the dessert oven. 
              Because the chef switches between tasks so rapidly, every customer feels like their dish is being cooked continuously!
            </p>
          </div>
        </div>

        {/* Section D: Interactive Visual Simulation */}
        <ProcessSchedulerSimulator />

        {/* Section E: How It Works Internally — Process vs Thread */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">
            Process vs Thread: What Is the Difference?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-foreground text-base">A Process (Isolated House)</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A <strong>process</strong> is an independent running application (like Spotify or Chrome). 
                Each process has its own completely isolated memory address space. 
                If one process crashes or encounters a bug, the operating system terminates it without affecting other running applications.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <h4 className="font-bold text-foreground text-base">A Thread (Worker in the House)</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A <strong>thread</strong> is a lightweight path of execution <em>inside</em> a process. 
                All threads of a single process share the exact same Heap and Data segments in memory. 
                For example, in a video game, one thread handles 3D physics while another thread streams background audio simultaneously.
              </p>
            </div>
          </div>

          {/* Shared vs Private Memory in Threads */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-3">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-emerald-500">
              What Is Shared vs. Private in Multi-Threading?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">Shared Across All Threads in a Process:</span>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li><strong>Code Segment:</strong> All threads run the same program binary.</li>
                  <li><strong>Heap &amp; Data:</strong> Dynamically allocated objects and global variables.</li>
                  <li><strong>OS Resources:</strong> Open files, network sockets, window handles.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Private to EACH Individual Thread:</span>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li><strong>Program Counter (PC):</strong> Each thread tracks its own current instruction.</li>
                  <li><strong>Registers:</strong> Each thread holds its own immediate calculation math.</li>
                  <li><strong>Call Stack:</strong> Each thread has its own private stack for local variables!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Context Switching Mechanics */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-emerald-500">
              The Secret Weapon: The Context Switch
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              How does the CPU switch between apps without losing your place?
            </p>
            <ol className="space-y-2 text-xs text-foreground list-decimal list-inside leading-relaxed">
              <li>
                <strong>Timer Interrupt:</strong> A hardware timer chip fires an electronic interrupt signal to the CPU every few milliseconds.
              </li>
              <li>
                <strong>Save State:</strong> The CPU pauses the active application and copies its Program Counter (PC) and registers into a data structure in RAM called the <strong>Process Control Block (PCB)</strong>.
              </li>
              <li>
                <strong>Restore State:</strong> The OS Scheduler picks the next waiting application, loads its saved PCB into the CPU registers, and points the PC to its saved location.
              </li>
              <li>
                <strong>Resume:</strong> The next application continues running without ever realizing it was paused!
              </li>
            </ol>
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
              <strong>"Threads share everything inside a process, including local variables."</strong> <br />
              <span className="text-foreground">Reality:</span> If threads shared local variables, function calls would corrupt each other! While threads share the Heap and Data segments, <strong>every thread has its own private Call Stack, its own Program Counter (PC), and its own CPU registers</strong>.
            </li>
            <li>
              <strong>"A quad-core CPU can only run 4 programs."</strong> <br />
              <span className="text-foreground">Reality:</span> A quad-core CPU can execute 4 instructions at the exact same physical microsecond, but through preemptive time-slicing it easily juggles 200 processes and 2,000 threads smoothly!
            </li>
            <li>
              <strong>"Multitasking has zero performance cost."</strong> <br />
              <span className="text-foreground">Reality:</span> Every context switch takes time (saving registers to RAM, invalidating CPU caches, switching MMU page tables). If you run too many heavy programs at once, the CPU spends more time switching between apps than doing useful work—a condition called <em>thrashing</em>.
            </li>
          </ul>
        </section>

        {/* Section H: Active Learning Check */}
        <PredictCheck
          kind="identify-incorrect"
          question="Which of the following statements about multi-threading and processes is FALSE (a misconception)?"
          options={[
            'A process has its own isolated memory address space that other processes cannot touch',
            'All threads in a process share the same call stack and local variables',
            'When the OS switches processes, it saves the current PC and registers into a Process Control Block (PCB)',
            'Threads in the same process share the Heap and global variables',
          ]}
          correctIndex={1}
          explanation="Statement B is FALSE! If threads shared the same call stack, one thread calling a function would overwrite the local variables and return addresses of another thread! Each thread MUST have its own dedicated stack and Program Counter."
          optionExplanations={[
            'This statement is TRUE! Process memory isolation prevents one crash from taking down the OS.',
            'Correct! This statement is FALSE. Each thread has its own private stack and Program Counter.',
            'This statement is TRUE! The PCB preserves hardware register state during context switches.',
            'This statement is TRUE! Shared heap memory is what makes thread communication fast.',
          ]}
        />

        {/* Section I: Summary */}
        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-amber-500">
            Lesson 07 Key Takeaways
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Time-sharing divides CPU time into millisecond slices so apps seem to run at once.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>A Process has an isolated memory space; Threads share memory within a process.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Context switching saves and restores registers via the Process Control Block (PCB).</span>
            </li>
          </ul>
        </div>
      </div>
    </TopicLayout>
  );
};
