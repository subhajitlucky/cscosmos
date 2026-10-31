'use client';

import React from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { PredictCheck } from '../components/PredictCheck';
import { BinaryDataExplorer } from '../components/BinaryDataExplorer';
import { Binary, Lightbulb, ToggleLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DataRepresentation: React.FC = () => {
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={2} title="How Does a Computer Understand Data?">
      <div className="space-y-12">
        {/* Section A: Simple Introduction */}
        <section className="space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            At the physical level, a computer cannot read English, understand numbers, or see colors. 
            All modern computer hardware is built from microscopic electronic switches called <strong>transistors</strong>. 
            Because an electronic switch can only be <strong>ON (voltage present)</strong> or <strong>OFF (no voltage)</strong>, the computer represents all information in the universe using just two digits: <strong>0 and 1</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This two-symbol system is called the <strong>Binary system</strong> (from the Latin <em>binarius</em>, meaning "two by two").
          </p>
        </section>

        {/* Section B & C: Why Binary & Light Switch Analogy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Why Not Use Decimal (0 to 9)?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Why don't computers count in base-10 like humans? Because building electrical circuits that reliably distinguish between 10 different voltage levels (e.g. 1.1V vs 1.2V) is easily corrupted by electrical noise and heat. 
              Checking whether voltage is simply <strong>HIGH (1)</strong> or <strong>LOW (0)</strong> is lightning fast, immune to interference, and completely reliable.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <ToggleLeft className="w-5 h-5 text-blue-500" />
              The Light Switch Analogy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think of a <strong>bit (Binary Digit)</strong> as a single light switch on the wall:
              it can only be ON (1) or OFF (0). One switch gives you only 2 states. 
              If you line up <strong>8 switches in a row (a byte)</strong>, you can create 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 = <strong>256 unique combinations</strong>!
            </p>
          </div>
        </div>

        {/* Section D: Interactive Visual Explanation */}
        <BinaryDataExplorer />

        {/* Section E: How It Works Internally — Number Systems */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">
            The Three Languages of Computer Data
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-blue-500 uppercase">
                1. Decimal (Base 10)
              </span>
              <h4 className="font-bold text-foreground text-base">Human Intuition</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Uses 10 digits: <code className="font-mono">0, 1, 2, 3, 4, 5, 6, 7, 8, 9</code>. 
                Each column to the left is multiplied by 10 (1s, 10s, 100s, 1000s). We use this because humans have 10 fingers.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-500 uppercase">
                2. Binary (Base 2)
              </span>
              <h4 className="font-bold text-foreground text-base">Hardware Native</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Uses 2 digits: <code className="font-mono">0, 1</code>. 
                Each column to the left is multiplied by 2 (1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s). 
                This directly maps to microscopic transistors in the CPU.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <span className="text-xs font-mono font-bold text-purple-500 uppercase">
                3. Hexadecimal (Base 16)
              </span>
              <h4 className="font-bold text-foreground text-base">Programmer Shorthand</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Uses 16 digits: <code className="font-mono">0-9</code> and <code className="font-mono">A, B, C, D, E, F</code>. 
                Writing binary (<code className="font-mono">1101 1010</code>) is long and error-prone. 
                Exactly 4 bits turn into 1 hex digit, making <code className="font-mono">0xDA</code> much cleaner to read.
              </p>
            </div>
          </div>

          {/* Multi-byte Integers Section */}
          <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 space-y-3">
            <h4 className="font-bold text-foreground text-base flex items-center gap-2">
              <Binary className="w-5 h-5 text-blue-500" />
              What About Numbers Greater Than 255?
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If a single 8-bit byte can only count up to 255, how does a computer calculate $1,000,000$ or track bank balances? 
              The computer simply lines up <strong>multiple consecutive bytes</strong> together:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                <span className="font-mono font-bold text-blue-500 block">16-Bit Integer (2 Bytes)</span>
                <p className="text-foreground font-bold">Up to 65,535</p>
                <p className="text-muted-foreground text-[11px]">$2^{16}$ unique states. Used for small audio samples.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                <span className="font-mono font-bold text-emerald-500 block">32-Bit Integer (4 Bytes)</span>
                <p className="text-foreground font-bold">Up to 4.29 Billion</p>
                <p className="text-muted-foreground text-[11px]">The standard <code className="font-mono">int</code> in C and Java. Covers almost all everyday counts.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                <span className="font-mono font-bold text-purple-500 block">64-Bit Integer (8 Bytes)</span>
                <p className="text-foreground font-bold">Up to 18.4 Quintillion</p>
                <p className="text-muted-foreground text-[11px]">Virtually infinite. Used for 64-bit RAM addresses and timestamps.</p>
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
              <strong>"A bit and a byte are the same thing."</strong> <br />
              <span className="text-foreground">Reality:</span> A <strong>bit</strong> is a single 0 or 1. A <strong>byte</strong> is a group of 8 bits. 
              Internet download speeds are usually advertised in megabits (Mb/s), whereas file sizes on your disk are measured in megabytes (MB). 1 MB = 8 Mb!
            </li>
            <li>
              <strong>"Computers store pictures, audio, and text in different physical ways."</strong> <br />
              <span className="text-foreground">Reality:</span> In physical memory, every single thing—whether an MP3 song, a selfie, a C program, or a font—is just rows of bytes. Only the program reading the bytes knows how to interpret them.
            </li>
          </ul>
        </section>

        {/* Section H: Quick Knowledge Check */}
        <PredictCheck
          question="How many distinct values or numbers can a single 8-bit byte store (from 00000000 to 11111111)?"
          options={[
            '8 values (0 to 7)',
            '64 values (0 to 63)',
            '256 values (0 to 255)',
            '1024 values (0 to 1023)',
          ]}
          correctIndex={2}
          explanation="Because each of the 8 bits has 2 possible states (0 or 1), the total number of combinations is 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 = 2⁸ = 256. This represents values from 0 up to 255!"
        />

        {/* Section I: Summary */}
        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 space-y-3">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-blue-500">
            Lesson 02 Key Takeaways
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>A bit is a binary digit (0 or 1); a byte is 8 bits (256 combinations).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Binary is used because electronic switches (transistors) are reliably ON or OFF.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Text is mapped to bytes via ASCII/Unicode; colors are stored as 3 bytes (Red, Green, Blue).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Hexadecimal is simply a compact shorthand: 2 hex characters represent 1 byte.</span>
            </li>
          </ul>
        </div>
      </div>
    </TopicLayout>
  );
};
