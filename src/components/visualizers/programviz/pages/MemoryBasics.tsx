'use client';

import React from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { InteractiveMemoryGrid } from '../components/InteractiveMemoryGrid';
import { Database, HardDrive, Zap, Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MemoryBasics: React.FC = () => {
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={5} title="Understanding Computer Memory">
      <div className="space-y-12">
        {/* Section A: Simple Introduction */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            A CPU is blindingly fast, but it has very little internal storage—its registers can only hold a few dozen numbers at once. 
            To run actual applications, the computer needs a vast, high-speed workspace to store millions of instructions and variables. 
            This workspace is <strong>Random Access Memory (RAM)</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            RAM is organized like a massive grid of numbered cubbies. Every single byte has its own unique <strong>memory address</strong>.
          </p>
        </section>

        {/* Section B & C: Why RAM & The Post-It Note Wall Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Volatile RAM vs Persistent Storage (SSD)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>RAM is volatile:</strong> it uses tiny electrical capacitors that require power to maintain data. Turn off the computer, and RAM instantly wipes clean to 0. 
              <strong>Storage (SSD / NVMe / HDD) is non-volatile:</strong> it uses magnetic or flash-charge traps that retain photos and files forever without power, but it is hundreds of times slower than RAM.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              The Post-Office Box Analogy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Imagine a giant wall of post-office boxes:
              Every box has a distinct number stamped on it (<code className="font-mono">0x00, 0x01, 0x02...</code>)—this is the <strong>Address</strong>. 
              Inside each box sits a piece of paper holding an 8-bit number—this is the <strong>Value</strong>. 
              The mail carrier can walk directly to box #16 and read or swap the paper in nanoseconds. That is why it’s called <em>"Random Access"</em> (you can access any address randomly with equal speed).
            </p>
          </div>
        </div>

        {/* Section D: Interactive Memory Address Grid */}
        <InteractiveMemoryGrid />

        {/* Section E: How It Works Internally — RAM vs ROM */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">
            The Three Types of Computer Storage
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-500 uppercase">
                1. RAM (Main Memory)
              </span>
              <h4 className="font-bold text-foreground text-base">Read &amp; Write / Volatile</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ultra-fast working memory for active programs and variables. Data vanishes when powered off. Size: typically 8 GB to 64 GB. Speed: ~50 nanoseconds.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-blue-500 uppercase">
                2. ROM (Read-Only Memory)
              </span>
              <h4 className="font-bold text-foreground text-base">Read-Only / Permanent</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contains factory-programmed boot instructions (UEFI/BIOS). It cannot be easily modified and persists forever. It tells the hardware how to turn on and find the SSD.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase">
                3. SSD / Storage
              </span>
              <h4 className="font-bold text-foreground text-base">Persistent / Files</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stores the operating system, games, and documents permanently. When you launch an app, the OS copies it from SSD into RAM so the CPU can execute it.
              </p>
            </div>
          </div>

          {/* Byte-Addressable Memory & Multi-byte Variables Callout */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h4 className="font-bold text-foreground text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" />
              Byte-Addressable Memory: How Multi-Byte Data Lives in RAM
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every single address in RAM points to exactly <strong>ONE byte (8 bits)</strong> of space. 
              So what happens when a program stores larger data types?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-1">
                <span className="font-mono font-bold text-blue-500">char (1 Byte)</span>
                <p className="text-foreground font-bold">Takes 1 Address</p>
                <p className="text-muted-foreground text-[11px]">Example: <code className="font-mono">char c = &apos;A&apos;</code> occupies address <code className="font-mono">0x10</code>.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-1">
                <span className="font-mono font-bold text-emerald-500">int (4 Bytes / 32-bit)</span>
                <p className="text-foreground font-bold">Takes 4 Consecutive Addresses</p>
                <p className="text-muted-foreground text-[11px]">Example: <code className="font-mono">int a = 15</code> spans <code className="font-mono">0x10, 0x11, 0x12, 0x13</code>. The pointer points to <code className="font-mono">0x10</code>.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-1">
                <span className="font-mono font-bold text-purple-500">Pointer / double (8 Bytes)</span>
                <p className="text-foreground font-bold">Takes 8 Consecutive Addresses</p>
                <p className="text-muted-foreground text-[11px]">Spans 8 consecutive bytes in 64-bit systems.</p>
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
          <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside leading-relaxed">
            <li>
              <strong>"The memory address and the value inside it are the same thing."</strong> <br />
              <span className="text-foreground">Reality:</span> Never confuse a house number with the person living inside! Memory address <code className="font-mono">0x10</code> is just the physical/virtual location coordinate. The value stored inside <code className="font-mono">0x10</code> could be 42, 0, 255, or the letter &apos;A&apos;.
            </li>
            <li>
              <strong>"RAM addresses correspond directly to physical wires on the silicon chip."</strong> <br />
              <span className="text-foreground">Reality:</span> To protect programs from hacking or crashing each other, the operating system gives every application an isolated <strong>Virtual Address Space</strong>. The CPU’s hardware <strong>MMU (Memory Management Unit)</strong> translates virtual addresses to actual physical DRAM pins via page tables on the fly.
            </li>
            <li>
              <strong>"More RAM makes the CPU clock tick faster."</strong> <br />
              <span className="text-foreground">Reality:</span> RAM capacity has zero effect on the CPU’s clock speed. However, if you run out of RAM, the OS is forced to use the SSD as slow emergency memory (called <em>paging or swapping</em>), which slows down execution by 1,000×!
            </li>
          </ul>
        </section>

        {/* Section H: Active Learning Check */}
        <PredictCheck
          kind="why-operation"
          question="A program requests to write the number 42 into memory address 0x10. Why is address 0x10 considered a 'Virtual Address' rather than a physical wire on the RAM chip?"
          options={[
            'Because modern RAM chips do not have physical wires',
            'To protect programs: the OS and MMU map virtual address 0x10 to physical RAM so apps cannot spy on or overwrite each other’s data',
            'Because virtual memory is stored only on the monitor screen',
            'Because 0x10 is a floating-point number',
          ]}
          correctIndex={1}
          explanation="Correct! Without virtual memory, any program could guess the address of your web browser and read your passwords directly from RAM! Virtual memory isolation ensures each process only sees its own sandbox."
          optionExplanations={[
            'Incorrect! Physical RAM is built from billions of microscopic silicon capacitors and wires.',
            'Correct! Virtual addressing allows the OS and MMU to enforce security and memory isolation between processes.',
            'Incorrect! Virtual memory refers to system RAM and OS translation, not monitor graphics.',
            'Incorrect! 0x10 is a hexadecimal integer address representing 16.',
          ]}
        />

        {/* Section I: Summary */}
        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-blue-500">
            Lesson 05 Key Takeaways
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>RAM provides the high-speed workspace the CPU needs to run active software.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Every byte in RAM has a unique numerical address (e.g. 0x00, 0x10).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>RAM is volatile (wipes on shutdown); SSD storage is persistent (retains files).</span>
            </li>
          </ul>
        </div>
      </div>
    </TopicLayout>
  );
};
