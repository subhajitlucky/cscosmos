'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Play, Pause, SkipForward, RotateCcw, Music, Code2, Globe, Clock, Layers } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProcessInfo {
  pid: number;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgActive: string;
  pc: number;
  maxPc: number;
  instructions: string[];
  registers: { r0: number; r1: number };
}

const INITIAL_PROCESSES: ProcessInfo[] = [
  {
    pid: 101,
    name: 'Music Player (Spotify)',
    icon: Music,
    color: 'text-emerald-500',
    bgActive: 'bg-emerald-500/10 border-emerald-500',
    pc: 0,
    maxPc: 4,
    instructions: [
      'DECODE_AUDIO_FRAME [0x40]',
      'APPLY_EQUALIZER (Gain +2dB)',
      'SEND_PCM_BUFFER_TO_DAC',
      'POLL_PLAYBACK_CONTROLS',
    ],
    registers: { r0: 120, r1: 44100 },
  },
  {
    pid: 102,
    name: 'Code Editor (VS Code)',
    icon: Code2,
    color: 'text-amber-500',
    bgActive: 'bg-amber-500/10 border-amber-500',
    pc: 0,
    maxPc: 4,
    instructions: [
      'POLL_KEYBOARD_BUFFER',
      'RUN_SYNTAX_HIGHLIGHTER',
      'CHECK_LINTER_DIAGNOSTICS',
      'UPDATE_CURSOR_POSITION',
    ],
    registers: { r0: 42, r1: 80 },
  },
  {
    pid: 103,
    name: 'Web Browser (Chrome)',
    icon: Globe,
    color: 'text-emerald-500',
    bgActive: 'bg-emerald-500/10 border-emerald-500',
    pc: 0,
    maxPc: 4,
    instructions: [
      'FETCH_NETWORK_CHUNK',
      'PARSE_HTML_TOKEN_STREAM',
      'RECALCULATE_DOM_STYLES',
      'PAINT_PAGE_VIEWPORT',
    ],
    registers: { r0: 200, r1: 1920 },
  },
];

export function ProcessSchedulerSimulator() {
  const { theme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [processes, setProcesses] = useState<ProcessInfo[]>(INITIAL_PROCESSES);
  const [runningIndex, setRunningIndex] = useState<number>(0);
  const [quantum, setQuantum] = useState<number>(3); // 3 instruction ticks per quantum
  const [quantumRemaining, setQuantumRemaining] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [contextSwitching, setContextSwitching] = useState<boolean>(false);
  const [log, setLog] = useState<string>(
    'Ready. Click "Start CPU Time-Slicing" to watch the CPU multitask between 3 apps.'
  );

  const activeProcess = processes[runningIndex];

  // Tick execution
  const stepExecution = () => {
    if (contextSwitching) return;

    if (quantumRemaining > 1) {
      // Execute 1 instruction inside current process
      setProcesses((prev) => {
        const next = [...prev];
        const p = { ...next[runningIndex] };
        p.pc = (p.pc + 1) % p.maxPc;
        p.registers = {
          r0: (p.registers.r0 + 7) % 256,
          r1: (p.registers.r1 + 13) % 65535,
        };
        next[runningIndex] = p;
        return next;
      });

      setQuantumRemaining((q) => q - 1);
      setLog(
        `CPU executed ${activeProcess.instructions[activeProcess.pc]} for ${activeProcess.name} (Time slice remaining: ${quantumRemaining - 1}).`
      );
    } else {
      // Quantum expired: Trigger Context Switch!
      triggerContextSwitch();
    }
  };

  const triggerContextSwitch = () => {
    setContextSwitching(true);
    const nextIdx = (runningIndex + 1) % processes.length;
    const nextProcess = processes[nextIdx];

    setLog(
      `TIMER INTERRUPT: Saving registers of [${activeProcess.name}] to PCB. Loading PCB of [${nextProcess.name}] into CPU registers...`
    );

    setTimeout(() => {
      setRunningIndex(nextIdx);
      setQuantumRemaining(quantum);
      setContextSwitching(false);
      setLog(
        `CONTEXT SWITCH COMPLETE: CPU now executing [${nextProcess.name}] starting at PC=${nextProcess.pc}.`
      );
    }, 800);
  };

  useEffect(() => {
    if (prefersReducedMotion) setIsPlaying(false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      stepExecution();
    }, 1500);

    return () => window.clearInterval(interval);
  }, [isPlaying, runningIndex, quantumRemaining, contextSwitching, prefersReducedMotion]);

  const handleReset = () => {
    setIsPlaying(false);
    setProcesses(INITIAL_PROCESSES);
    setRunningIndex(0);
    setQuantumRemaining(quantum);
    setContextSwitching(false);
    setLog('Simulation reset.');
  };

  return (
    <div className={cn(
      "rounded-2xl border p-6 sm:p-8 space-y-6 shadow-xl transition-colors",
      theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
    )}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-border/80">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-500 font-bold">
            OS Multitasking Simulator
          </span>
          <h3 className="text-xl font-bold text-foreground">
            Single CPU Core Time-Sharing &amp; Context Switching
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-xs transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Start Auto-Play'}
          </button>

          <button
            type="button"
            disabled={isPlaying}
            onClick={stepExecution}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-colors disabled:opacity-50"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Step Cycle
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        A single CPU core can only execute <strong>one instruction at a time</strong>. To run Spotify, VS Code, and Chrome together, the Operating System divides time into tiny slices (milliseconds) and rapidly switches between them.
      </p>

      {/* Central CPU Core & Active Process Display */}
      <div className="relative p-6 rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-zinc-950 font-bold flex items-center justify-center shadow-lg">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-amber-500 font-bold block">
              Physical CPU Core #0
            </span>
            <h4 className="text-lg font-extrabold text-foreground">
              {contextSwitching ? (
                <span className="text-amber-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 animate-spin" />
                  Context Switching (Kernel Mode)...
                </span>
              ) : (
                <span>Currently Running: <span className={activeProcess.color}>{activeProcess.name}</span></span>
              )}
            </h4>
            <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-4 font-mono">
              <span>Time Slice Remaining: <strong>{quantumRemaining} ticks</strong></span>
              <span>Active PC: <strong>0x0{activeProcess.pc}</strong></span>
              <span>R0: <strong>{activeProcess.registers.r0}</strong></span>
              <span>R1: <strong>{activeProcess.registers.r1}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 font-mono text-xs text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-card border border-border font-bold text-foreground">
            PID: {activeProcess.pid}
          </span>
          <span className="text-[11px] truncate max-w-xs">
            {activeProcess.instructions[activeProcess.pc]}
          </span>
        </div>
      </div>

      {/* Processes and Process Control Blocks (PCB) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {processes.map((proc, idx) => {
          const isCurrent = idx === runningIndex;
          const Icon = proc.icon;

          return (
            <div
              key={proc.pid}
              className={cn(
                "p-5 rounded-xl border-2 transition-all flex flex-col justify-between gap-4",
                isCurrent && !contextSwitching
                  ? proc.bgActive + " shadow-lg scale-[1.02]"
                  : "bg-card border-border opacity-70"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-5 h-5", proc.color)} />
                    <span className="font-bold text-sm text-foreground">{proc.name}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase",
                    isCurrent && !contextSwitching
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {isCurrent && !contextSwitching ? 'RUNNING' : 'WAITING (READY)'}
                  </span>
                </div>

                {/* Process Control Block (PCB) saved state */}
                <div className="p-3 rounded-lg bg-background/80 border border-border/80 text-xs font-mono space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                    Process Control Block (PCB)
                  </span>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saved PC:</span>
                    <span className="font-bold text-foreground">0x0{proc.pc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Register R0:</span>
                    <span className="font-bold text-foreground">{proc.registers.r0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Register R1:</span>
                    <span className="font-bold text-foreground">{proc.registers.r1}</span>
                  </div>
                </div>
              </div>

              {/* Instruction list */}
              <div className="space-y-1 text-[11px] font-mono">
                <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold">
                  Code Instructions:
                </span>
                {proc.instructions.map((inst, i) => (
                  <div
                    key={i}
                    className={cn(
                      "px-2 py-1 rounded truncate transition-colors",
                      isCurrent && proc.pc === i
                        ? "bg-amber-500 text-zinc-950 font-bold font-bold"
                        : "text-muted-foreground"
                    )}
                  >
                    {i === proc.pc ? '▶ ' : '  '}{inst}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Narrative Telemetry Log */}
      <div className="p-4 rounded-xl border border-border bg-muted/40 font-mono text-xs flex items-center gap-3">
        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-foreground leading-relaxed">{log}</span>
      </div>
    </div>
  );
}
