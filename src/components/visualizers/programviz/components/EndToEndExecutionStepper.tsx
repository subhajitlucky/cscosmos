'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode,
  HardDrive,
  Layers,
  Boxes,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Cpu,
  Database,
  Terminal,
  Monitor,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface JourneyStep {
  step: number;
  title: string;
  component: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  summary: string;
  technicalDetail: string;
  systemState: {
    disk: string;
    ram: string;
    pc: string;
    r0: string;
    r1: string;
    acc: string;
    terminal: string;
    mode: 'User Mode' | 'Kernel Mode';
  };
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    step: 1,
    title: '1. Developer Writes Source Code',
    component: 'Editor (Human)',
    icon: FileCode,
    color: 'text-blue-500',
    summary: 'The programmer writes high-level C code in a text editor.',
    technicalDetail: 'Human-readable expressions like "int a = 15;" and "printf" are saved in memory buffers inside your text editor. The CPU cannot execute this yet.',
    systemState: {
      disk: 'main.c (in editor buffer)',
      ram: 'Editor process memory',
      pc: 'N/A',
      r0: '0',
      r1: '0',
      acc: '0',
      terminal: 'Ready for compile',
      mode: 'User Mode',
    },
  },
  {
    step: 2,
    title: '2. Source Code Is Saved to Storage',
    component: 'Storage (SSD / Disk)',
    icon: HardDrive,
    color: 'text-amber-500',
    summary: 'The editor writes bytes of text into a file on persistent storage.',
    technicalDetail: 'The file "main.c" is saved to disk as a sequence of ASCII/UTF-8 bytes. Even if power is disconnected right now, this text remains safe on the SSD.',
    systemState: {
      disk: 'main.c saved to /home/user (142 bytes)',
      ram: 'Disk cache buffer flushed',
      pc: 'N/A',
      r0: '0',
      r1: '0',
      acc: '0',
      terminal: '$ gcc main.c -o program',
      mode: 'User Mode',
    },
  },
  {
    step: 3,
    title: '3. Compiler Translates C to Machine Code',
    component: 'Compiler (GCC / Clang)',
    icon: Layers,
    color: 'text-indigo-500',
    summary: 'The compiler parses syntax and generates native assembly & machine instructions.',
    technicalDetail: 'The compiler converts "a + b" into the CPU’s native arithmetic instructions: "MOV eax, 15", "MOV edx, 27", and "ADD eax, edx", outputting an object file (main.o).',
    systemState: {
      disk: 'main.o generated (ELF object)',
      ram: 'Compiler workspace',
      pc: 'N/A',
      r0: '0',
      r1: '0',
      acc: '0',
      terminal: 'Compiling...',
      mode: 'User Mode',
    },
  },
  {
    step: 4,
    title: '4. Linker Prepares the Standalone Executable',
    component: 'Linker (ld)',
    icon: Boxes,
    color: 'text-purple-500',
    summary: 'The linker attaches the C standard library (printf) and builds "program.exe".',
    technicalDetail: 'Your code called printf(), but you did not write printf. The linker connects your code to the standard library libc and writes binary executable headers.',
    systemState: {
      disk: 'program (Executable binary on disk)',
      ram: 'Libraries linked',
      pc: 'N/A',
      r0: '0',
      r1: '0',
      acc: '0',
      terminal: '$ ./program',
      mode: 'User Mode',
    },
  },
  {
    step: 5,
    title: '5. User Launches the Program',
    component: 'Operating System Kernel',
    icon: Terminal,
    color: 'text-rose-500',
    summary: 'The user presses Enter on "./program". The shell asks the OS to start it.',
    technicalDetail: 'The shell issues an execve() system call to the operating system kernel. The CPU temporarily switches to privileged Kernel Mode to prepare execution.',
    systemState: {
      disk: 'Reading binary headers from disk...',
      ram: 'Kernel allocates process space',
      pc: '0x0000',
      r0: '0',
      r1: '0',
      acc: '0',
      terminal: '$ ./program (executing)',
      mode: 'Kernel Mode',
    },
  },
  {
    step: 6,
    title: '6. OS Creates the Process & Virtual Memory',
    component: 'OS & Memory Manager (MMU)',
    icon: Database,
    color: 'text-blue-600',
    summary: 'The OS creates Process ID 2048 with its own isolated memory address space.',
    technicalDetail: 'The OS allocates a page table and memory segments: Code Segment (read-only machine code), Data Segment (globals), and Stack (for local variables a, b, result).',
    systemState: {
      disk: 'Idle',
      ram: 'Process ID: 2048 allocated (Stack + Code)',
      pc: '0x0000',
      r0: '0',
      r1: '0',
      acc: '0',
      terminal: '$ ./program',
      mode: 'Kernel Mode',
    },
  },
  {
    step: 7,
    title: '7. Machine Code Loaded Into RAM & PC Initialized',
    component: 'OS Loader -> CPU',
    icon: Cpu,
    color: 'text-emerald-500',
    summary: 'Machine code copied into RAM; Program Counter set to entry point 0x00.',
    technicalDetail: 'The OS loader copies the machine instructions into RAM address 0x00 and sets the CPU’s Program Counter (PC) to 0x00. The OS drops privilege back to User Mode.',
    systemState: {
      disk: 'Executable mapped in RAM',
      ram: 'RAM[0x00]: MOV R0, 15',
      pc: '0x00',
      r0: '0',
      r1: '0',
      acc: '0',
      terminal: '$ ./program',
      mode: 'User Mode',
    },
  },
  {
    step: 8,
    title: '8. CPU Fetches & Executes "int a = 15"',
    component: 'CPU (Fetch -> Decode -> Execute)',
    icon: Cpu,
    color: 'text-blue-500',
    summary: 'CPU loads constant 15 into register R0.',
    technicalDetail: 'Control Unit fetches MOV R0, 15 from RAM address 0x00. PC increments to 0x01. Control signals load the binary integer 15 into CPU register R0.',
    systemState: {
      disk: 'Idle',
      ram: 'Stack allocated',
      pc: '0x01',
      r0: '15',
      r1: '0',
      acc: '0',
      terminal: '$ ./program',
      mode: 'User Mode',
    },
  },
  {
    step: 9,
    title: '9. CPU Fetches & Executes "int b = 27"',
    component: 'CPU (Fetch -> Decode -> Execute)',
    icon: Cpu,
    color: 'text-blue-500',
    summary: 'CPU loads constant 27 into register R1.',
    technicalDetail: 'Control Unit fetches MOV R1, 27 from RAM address 0x01. PC increments to 0x02. Register R1 now holds 27. Both inputs are ready in CPU scratchpad.',
    systemState: {
      disk: 'Idle',
      ram: 'Stack allocated',
      pc: '0x02',
      r0: '15',
      r1: '27',
      acc: '0',
      terminal: '$ ./program',
      mode: 'User Mode',
    },
  },
  {
    step: 10,
    title: '10. ALU Computes "result = a + b" (15 + 27 = 42)',
    component: 'CPU Arithmetic Logic Unit (ALU)',
    icon: Cpu,
    color: 'text-red-500',
    summary: 'The ALU adds R0 + R1, producing 42 in the accumulator & storing to RAM.',
    technicalDetail: 'ALU executes ADD R0, R1. The electronic adder computes 15 + 27 = 42. In Write-Back, 42 is stored into the accumulator (ACC) and into stack RAM address 0x10.',
    systemState: {
      disk: 'Idle',
      ram: 'RAM[0x10] (result) = 42',
      pc: '0x03',
      r0: '42',
      r1: '27',
      acc: '42',
      terminal: '$ ./program',
      mode: 'User Mode',
    },
  },
  {
    step: 11,
    title: '11. Program Calls printf() via System Call',
    component: 'System Call (User -> Kernel)',
    icon: ShieldAlert,
    color: 'text-amber-500',
    summary: 'User programs cannot talk to the screen directly. It requests OS help.',
    technicalDetail: 'printf() issues a write() system call (sys_write). The CPU executes a trap/syscall instruction, switching privilege from User Mode to Kernel Mode.',
    systemState: {
      disk: 'Idle',
      ram: 'RAM holds formatted string "42"',
      pc: '0x04',
      r0: '42',
      r1: '27',
      acc: '42',
      terminal: 'System Call sys_write(1, "42", 2)...',
      mode: 'Kernel Mode',
    },
  },
  {
    step: 12,
    title: '12. OS Driver Sends Output to Screen / Terminal',
    component: 'Device Driver & Display Hardware',
    icon: Monitor,
    color: 'text-emerald-500',
    summary: 'The terminal driver draws the characters "42" onto the screen.',
    technicalDetail: 'The terminal device driver copies the ASCII bytes 0x34 ("4") and 0x32 ("2") to the GPU framebuffer. The physical monitor lights up pixels to show "42".',
    systemState: {
      disk: 'Idle',
      ram: 'RAM holds output buffer',
      pc: '0x04',
      r0: '42',
      r1: '27',
      acc: '42',
      terminal: '42',
      mode: 'Kernel Mode',
    },
  },
  {
    step: 13,
    title: '13. Program Returns 0 and Terminates',
    component: 'OS Process Cleanup',
    icon: CheckCircle2,
    color: 'text-green-500',
    summary: 'Program returns status 0 (Success). OS cleans up and frees memory.',
    technicalDetail: 'CPU executes "ret" / exit syscall. The OS reclaims all RAM allocated to PID 2048, removes page tables, and returns control to the terminal shell.',
    systemState: {
      disk: 'Idle',
      ram: 'All process RAM freed back to pool',
      pc: 'Halted',
      r0: '0 (exit code)',
      r1: '0',
      acc: '0',
      terminal: '$ ./program\n42\n$ [Process exited with code 0]',
      mode: 'User Mode',
    },
  },
];

export function EndToEndExecutionStepper() {
  const { theme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const current = JOURNEY_STEPS[currentStepIdx];
  const StepIcon = current.icon;

  useEffect(() => {
    if (prefersReducedMotion) setIsPlaying(false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setCurrentStepIdx((s) => {
        if (s >= JOURNEY_STEPS.length - 1) {
          setIsPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2800);

    return () => window.clearInterval(interval);
  }, [isPlaying, prefersReducedMotion]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIdx((s) => Math.min(s + 1, JOURNEY_STEPS.length - 1));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIdx((s) => Math.max(s - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  return (
    <div className={cn(
      "rounded-2xl border p-6 sm:p-8 space-y-6 shadow-xl transition-colors",
      theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
    )}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-border/80">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-blue-500 font-bold">
            The Grand Unification
          </span>
          <h3 className="text-xl font-bold text-foreground">
            Complete Journey of a Program: From Code to Screen
          </h3>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Auto-Play Story'}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-colors disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentStepIdx === JOURNEY_STEPS.length - 1}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-40"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
            title="Reset to step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Program Code Preview */}
      <div className="rounded-xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-bold block mb-1">
            // Target C Program being traced step by step:
          </span>
          <code className="text-slate-300">
            int main() &#123; int a = 15; int b = 27; int result = a + b; printf("%d", result); return 0; &#125;
          </code>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
          Step {current.step} / {JOURNEY_STEPS.length}
        </span>
      </div>

      {/* Progress Track Ribbon */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>Source Code</span>
          <span>Compilation</span>
          <span>OS Loading</span>
          <span>CPU Execution</span>
          <span>I/O Output</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={false}
            animate={{ width: `${((currentStepIdx + 1) / JOURNEY_STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Current Step Spotlight Card */}
      <div className="p-6 rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <StepIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold text-blue-500">
                {current.component}
              </span>
              <span className={cn(
                "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase",
                current.systemState.mode === 'Kernel Mode'
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              )}>
                {current.systemState.mode}
              </span>
            </div>
            <h4 className="text-xl font-extrabold text-foreground">
              {current.title}
            </h4>
          </div>
        </div>

        <p className="text-base text-foreground font-medium leading-relaxed">
          {current.summary}
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed pt-1">
          {current.technicalDetail}
        </p>
      </div>

      {/* Live System Telemetry HUD (Hardware State at this instant) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl border border-border bg-card">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
            Storage / Disk
          </span>
          <span className="text-foreground truncate block font-bold">
            {current.systemState.disk}
          </span>
        </div>

        <div className="p-3 rounded-xl border border-border bg-card">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
            RAM (Memory State)
          </span>
          <span className="text-foreground truncate block font-bold">
            {current.systemState.ram}
          </span>
        </div>

        <div className="p-3 rounded-xl border border-border bg-card">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
            CPU Registers
          </span>
          <div className="text-foreground flex flex-wrap gap-x-2">
            <span>PC: <strong>{current.systemState.pc}</strong></span>
            <span>R0: <strong>{current.systemState.r0}</strong></span>
            <span>R1: <strong>{current.systemState.r1}</strong></span>
            <span>ACC: <strong>{current.systemState.acc}</strong></span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-border bg-card">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
            Terminal Output
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold block truncate">
            {current.systemState.terminal}
          </span>
        </div>
      </div>
    </div>
  );
}
