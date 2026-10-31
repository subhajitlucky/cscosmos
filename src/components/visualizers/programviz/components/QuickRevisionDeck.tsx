'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface RevisionCard {
  id: number;
  lesson: number;
  lessonTitle: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  misconceptionAlert?: string;
}

export const REVISION_CARDS: RevisionCard[] = [
  {
    id: 1,
    lesson: 1,
    lessonTitle: 'What Is a Program?',
    topic: 'Program vs. Process',
    question: 'Where does a computer program exist before you click or type “Run”?',
    options: [
      'In CPU registers, waiting for a clock pulse',
      'As an inert, passive file of bytes saved on persistent storage (SSD)',
      'Loaded in RAM, executing in sleep mode',
      'Inside the monitor graphics memory',
    ],
    correctIndex: 1,
    explanation: 'A program is just a static file on your disk. It only becomes an active "process" when the operating system loads it into RAM and points the CPU to it.',
    misconceptionAlert: 'A program is not the same as a process. The file on disk never executes directly.',
  },
  {
    id: 2,
    lesson: 2,
    lessonTitle: 'Data Representation',
    topic: 'Endianness & Multi-Byte Integers',
    question: 'On standard modern computers (x86 and ARM), how is a multi-byte integer stored in memory (Little-Endian)?',
    options: [
      'The most significant byte is stored at the lowest memory address',
      'The least significant byte is stored at the lowest memory address',
      'The bytes are scrambled randomly by the CPU cache',
      'All 4 bytes are merged into a single 1-byte address',
    ],
    correctIndex: 1,
    explanation: 'In Little-Endian systems (x86 / modern ARM), the least significant byte (LSB) goes first at the lowest memory address. For integer 42 (0x0000002A), 0x2A sits at address 0x10, and 0x00 sits at 0x11, 0x12, 0x13.',
    misconceptionAlert: 'Memory is byte-addressable. A 4-byte int spans 4 consecutive byte addresses, not 1!',
  },
  {
    id: 3,
    lesson: 3,
    lessonTitle: 'CPU Basics',
    topic: 'Instruction Register (IR)',
    question: 'When an instruction is fetched from RAM, which internal CPU register holds it during the Decode stage?',
    options: [
      'The Program Counter (PC)',
      'The Accumulator (ACC)',
      'The Instruction Register (IR)',
      'The Memory Address Register',
    ],
    correctIndex: 2,
    explanation: 'The Instruction Register (IR) holds the fetched instruction bits so the Control Unit can decode what operation to perform. The PC merely holds the address of the NEXT instruction.',
  },
  {
    id: 4,
    lesson: 4,
    lessonTitle: 'Instruction Cycle',
    topic: 'MOV Mnemonic Semantics',
    question: 'When the CPU executes the assembly instruction “MOV R0, 15”, what happens to the number 15?',
    options: [
      '15 is erased from its source location and moved permanently',
      '15 is copied into register R0, leaving the original source unchanged',
      '15 is added to whatever was previously inside R0',
      'R0 is reset to 0',
    ],
    correctIndex: 1,
    explanation: 'Despite the name "MOV", it is actually a COPY operation! The source value is duplicated into the destination register without deleting or zeroing the original value.',
    misconceptionAlert: 'MOV does not mean "cut and paste". It means "copy".',
  },
  {
    id: 5,
    lesson: 5,
    lessonTitle: 'Memory Basics',
    topic: 'Memory Addresses vs. Values',
    question: 'What is the fundamental difference between memory address 0x10 and the value stored at 0x10?',
    options: [
      'They are always the same number on 64-bit systems',
      'The address is the numerical location (the house); the value is the data inside (the resident)',
      'Addresses are stored on SSD; values are stored in RAM',
      'The address is read-only; values can never be changed',
    ],
    correctIndex: 1,
    explanation: 'Never confuse a house address with the person living inside! Address 0x10 is just a location number. The value stored inside could be 42, 255, or the letter "A".',
  },
  {
    id: 6,
    lesson: 6,
    lessonTitle: 'Memory Layout',
    topic: 'Stack Call Frame Destruction',
    question: 'What happens to local variables created inside a function when that function finishes executing and returns?',
    options: [
      'They are permanently transferred into the Data segment',
      'Their stack frame is popped off, and their memory is immediately reclaimed',
      'They remain on the stack until the entire computer powers off',
      'The operating system copies them to disk swap space',
    ],
    correctIndex: 1,
    explanation: 'Local variables live strictly inside their function’s stack frame. When the function returns, the CPU adjusts the Stack Pointer (pops the frame), immediately invalidating those variables.',
  },
  {
    id: 7,
    lesson: 7,
    lessonTitle: 'Multitasking & Processes',
    topic: 'Process vs. Thread Private State',
    question: 'When multiple threads run inside the same process, which resource is PRIVATE to each individual thread?',
    options: [
      'The Heap segment and open files',
      'The Code segment and global variables',
      'Their own Call Stack, Program Counter, and CPU Registers',
      'The physical CPU silicon chip',
    ],
    correctIndex: 2,
    explanation: 'Threads share the Heap and Data segments, but each thread MUST have its own private Stack (for independent local variables) and its own Program Counter & Registers (to track what line of code it is executing)!',
    misconceptionAlert: 'Threads share memory, but they do NOT share stacks or Program Counters!',
  },
  {
    id: 8,
    lesson: 8,
    lessonTitle: 'Hardware I/O',
    topic: 'Interrupts vs. Polling',
    question: 'How does modern hardware notify the CPU that a key was pressed without wasting 100% CPU power?',
    options: [
      'The CPU runs an infinite while(true) loop checking the keyboard continuously',
      'The keyboard controller pulses a physical Interrupt Line (IRQ), prompting the CPU to run an Interrupt Handler',
      'The keyboard writes directly into the CPU instruction cache',
      'The monitor sends a signal to the power supply',
    ],
    correctIndex: 1,
    explanation: 'Hardware Interrupts allow the CPU to focus entirely on calculations. When an I/O event occurs, an electrical signal alerts the CPU, which briefly pauses to handle the event and then resumes.',
  },
  {
    id: 9,
    lesson: 9,
    lessonTitle: 'Compilation Pipelines',
    topic: 'Java & JIT Performance',
    question: 'Why does modern Java execute significantly faster than purely interpreted languages?',
    options: [
      'Because Java bypasses the operating system kernel completely',
      'Because the HotSpot JIT compiler dynamically compiles frequently executed bytecode loops into native CPU machine code',
      'Because Java runs directly on hardware transistors without a JVM',
      'Because Java does not use memory or registers',
    ],
    correctIndex: 1,
    explanation: 'The JVM begins by interpreting bytecode for instant startup. As loops run repeatedly ("hot code"), the Just-In-Time (JIT) compiler converts them into raw native machine instructions on the fly.',
  },
  {
    id: 10,
    lesson: 10,
    lessonTitle: 'End-to-End Execution',
    topic: 'printf to Screen Journey',
    question: 'In C, when printf("%d", result) executes to print 42, what actually reaches the terminal framebuffer?',
    options: [
      'The raw mathematical binary integer 42 directly to GPU pins',
      'The C library formats 42 into ASCII bytes "4" (0x34) and "2" (0x32), which the terminal renders as font glyph pixels',
      'The compiler executes a hardware print instruction on the CPU clock',
      'The entire source code file is displayed on the screen',
    ],
    correctIndex: 1,
    explanation: 'printf is not magic. The C standard library converts the binary integer 42 into ASCII characters "4" and "2". The OS sys_write system call sends those bytes to the terminal, and the GPU draws the character glyph pixels.',
  },
];

export const QuickRevisionDeck: React.FC = () => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const card = REVISION_CARDS[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === card.correctIndex;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setAnsweredCount((c) => c + 1);
    if (idx === card.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCurrentIndex((prev) => (prev + 1) % REVISION_CARDS.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setCurrentIndex(0);
    setAnsweredCount(0);
    setCorrectCount(0);
  };

  return (
    <div
      aria-label="Quick Revision Deck"
      className={cn(
        "rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xl transition-colors",
        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
              Active Recall &amp; Retention
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Quick Revision Deck
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Test and reinforce your mental model through rapid-fire conceptual checks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl border border-border bg-card text-foreground font-bold">
            Score: {correctCount} / {answeredCount}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors"
            title="Reset Revision Deck"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Metadata Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
            Lesson 0{card.lesson}: {card.lessonTitle}
          </span>
          <span className="text-muted-foreground">
            Topic: <strong>{card.topic}</strong>
          </span>
        </div>
        <span className="text-muted-foreground">
          Card {currentIndex + 1} of {REVISION_CARDS.length}
        </span>
      </div>

      {/* Question */}
      <div className="space-y-4">
        <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
          {card.question}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {card.options.map((option, idx) => {
            const isPicked = selectedOption === idx;
            const isTarget = isAnswered && idx === card.correctIndex;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={cn(
                  "p-4 rounded-xl border-2 text-left text-xs sm:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  isTarget && "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-md font-bold",
                  isPicked && !isTarget && "bg-red-500/15 border-red-500 text-red-800 dark:text-red-200 font-bold",
                  !isPicked && !isTarget && "bg-card border-border text-foreground hover:border-blue-400 disabled:opacity-60"
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="font-mono text-xs opacity-70 mt-0.5">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Panel */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              "p-5 rounded-2xl border-2 space-y-3",
              isCorrect
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-100"
                : "bg-red-500/10 border-red-500/40 text-red-950 dark:text-red-100"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
                <h4 className="font-bold text-sm">
                  {isCorrect ? 'Correct! Strong retention.' : 'Incorrect misconception identified.'}
                </h4>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <span>Next Revision Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-foreground">
              {card.explanation}
            </p>

            {card.misconceptionAlert && (
              <div className="p-3 rounded-xl bg-card/80 border border-border text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>Key Takeaway:</strong> {card.misconceptionAlert}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
