'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  Binary,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  Terminal,
  ShieldCheck,
  FileCode,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { TOPIC_BASE_PATH } from '../data/topic';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ConceptNode {
  id: string;
  title: string;
  track: 'data' | 'cpu' | 'system';
  lessonStep: number;
  lessonPath: string;
  prerequisites: string[];
  unlocks: string[];
  summary: string;
  whyItMatters: string;
}

export const CONCEPT_NODES: ConceptNode[] = [
  // Track 1: Data & Memory
  {
    id: 'bits-voltage',
    title: '1. Bits & Electrical Voltage',
    track: 'data',
    lessonStep: 2,
    lessonPath: `${TOPIC_BASE_PATH}/how-computers-understand-data`,
    prerequisites: ['Basic understanding of switches (ON/OFF)'],
    unlocks: ['Bytes & Data Encoding'],
    summary: 'Transistors can only reliably maintain two physical states: High Voltage (1) and Low Voltage (0).',
    whyItMatters: 'Every algorithm, game, and file in the world is fundamentally built from these microscopic voltage switches.',
  },
  {
    id: 'bytes-encoding',
    title: '2. Bytes, ASCII, UTF-8 & Endianness',
    track: 'data',
    lessonStep: 2,
    lessonPath: `${TOPIC_BASE_PATH}/how-computers-understand-data`,
    prerequisites: ['Bits & Electrical Voltage'],
    unlocks: ['Byte-Addressable RAM', 'Multi-Byte Integers'],
    summary: 'A byte is 8 bits (256 states). ASCII maps bytes to English characters; UTF-8 encodes global languages; endianness defines multi-byte ordering.',
    whyItMatters: 'Without standard encoding rules, bits cannot represent text, negative numbers, or colors.',
  },
  {
    id: 'ram-addressing',
    title: '3. Byte-Addressable RAM',
    track: 'data',
    lessonStep: 5,
    lessonPath: `${TOPIC_BASE_PATH}/memory-basics`,
    prerequisites: ['Bytes, ASCII, UTF-8 & Endianness'],
    unlocks: ['Process Virtual Address Space', 'Stack & Heap'],
    summary: 'RAM is an array of numbered cubbies. Every single byte has a unique numerical address (e.g. 0x00 to 0x1F).',
    whyItMatters: 'Distinguishes the location (the address) from what lives inside (the value).',
  },
  {
    id: 'address-space',
    title: '4. Virtual Address Space & MMU',
    track: 'data',
    lessonStep: 5,
    lessonPath: `${TOPIC_BASE_PATH}/memory-basics`,
    prerequisites: ['Byte-Addressable RAM'],
    unlocks: ['Stack & Heap Dynamics'],
    summary: 'The OS gives every process an illusion of private memory. The Memory Management Unit (MMU) translates virtual addresses to physical RAM.',
    whyItMatters: 'Prevents buggy or malicious applications from overwriting each other’s private data in memory.',
  },
  {
    id: 'stack-heap',
    title: '5. Stack & Heap Segments',
    track: 'data',
    lessonStep: 6,
    lessonPath: `${TOPIC_BASE_PATH}/memory-layout`,
    prerequisites: ['Virtual Address Space & MMU', 'Hardware Registers'],
    unlocks: ['Multitasking Threads', 'End-to-End Program Journey'],
    summary: 'Stack manages automatic LIFO function call frames; Heap manages dynamic malloc/new allocations growing upward toward the stack.',
    whyItMatters: 'Explains where local variables live, why memory leaks occur, and what causes Stack Overflow errors.',
  },

  // Track 2: Control & Compute
  {
    id: 'program-file',
    title: '1. Program as Inactive File on Disk',
    track: 'cpu',
    lessonStep: 1,
    lessonPath: `${TOPIC_BASE_PATH}/what-is-a-program`,
    prerequisites: ['None (Foundational)'],
    unlocks: ['CPU Core & Clock', 'Compilation Pipelines'],
    summary: 'Before execution, a program is an inert file of bytes sitting on your SSD. It uses zero CPU cycles and zero RAM.',
    whyItMatters: 'Clarifies the critical distinction between a passive stored program and an active executing process.',
  },
  {
    id: 'cpu-core-clock',
    title: '2. CPU Core, ALU & Clock Metronome',
    track: 'cpu',
    lessonStep: 3,
    lessonPath: `${TOPIC_BASE_PATH}/cpu-basics`,
    prerequisites: ['Program as Inactive File on Disk'],
    unlocks: ['Hardware Registers (PC, IR, ACC)'],
    summary: 'A CPU core combines a Control Unit (manager) and ALU (calculator), synchronized by an electronic clock ticking billions of times per second.',
    whyItMatters: 'Clock ticks advance electrical pulses through logic gates to process one stage of an instruction at a time.',
  },
  {
    id: 'registers',
    title: '3. Hardware Registers (PC, IR, ACC)',
    track: 'cpu',
    lessonStep: 3,
    lessonPath: `${TOPIC_BASE_PATH}/cpu-basics`,
    prerequisites: ['CPU Core, ALU & Clock Metronome'],
    unlocks: ['Instruction Execution Cycle'],
    summary: 'Ultra-fast sub-nanosecond storage cells in the CPU: PC holds next address, IR holds current instruction, ACC holds ALU output.',
    whyItMatters: 'Because RAM is hundreds of times too slow for clock-tick math, the CPU relies on internal registers for immediate operations.',
  },
  {
    id: 'instruction-cycle',
    title: '4. Instruction Cycle (Fetch-Decode-Execute)',
    track: 'cpu',
    lessonStep: 4,
    lessonPath: `${TOPIC_BASE_PATH}/instruction-cycle`,
    prerequisites: ['Hardware Registers (PC, IR, ACC)', 'Byte-Addressable RAM'],
    unlocks: ['OS Multitasking & Context Switching'],
    summary: 'The relentless 4-step loop: Fetch instruction at PC into IR &rarr; Decode opcode &rarr; Execute ALU math &rarr; Write-back result.',
    whyItMatters: 'This mechanical loop is the heartbeat of all modern software execution.',
  },
  {
    id: 'multitasking',
    title: '5. Multitasking & Context Switching',
    track: 'cpu',
    lessonStep: 7,
    lessonPath: `${TOPIC_BASE_PATH}/multitasking-and-processes`,
    prerequisites: ['Instruction Cycle', 'Stack & Heap Segments'],
    unlocks: ['Hardware I/O & System Calls', 'End-to-End Program Journey'],
    summary: 'Preemptive time-slicing driven by timer interrupts. OS swaps register state and PC via Process Control Blocks (PCBs).',
    whyItMatters: 'Explains how a 4-core processor smoothly juggles 200 background applications without freezing.',
  },

  // Track 3: The System Integration Bridge
  {
    id: 'io-syscalls',
    title: '1. Hardware I/O & System Calls',
    track: 'system',
    lessonStep: 8,
    lessonPath: `${TOPIC_BASE_PATH}/io-basics`,
    prerequisites: ['Multitasking & Context Switching'],
    unlocks: ['End-to-End Program Journey'],
    summary: 'User programs operate in unprivileged User Mode. Touching screen, keyboard, or disk requires asking the OS Kernel via System Calls.',
    whyItMatters: 'Ensures security, protects operating system stability, and prevents untrusted code from corrupting hardware.',
  },
  {
    id: 'compilation-runtimes',
    title: '2. Compilation Pipelines & Runtimes',
    track: 'system',
    lessonStep: 9,
    lessonPath: `${TOPIC_BASE_PATH}/how-code-becomes-an-executable`,
    prerequisites: ['Instruction Cycle', 'Hardware Registers'],
    unlocks: ['End-to-End Program Journey'],
    summary: 'Contrasting native AOT machine code (C/Rust), universal Bytecode VMs (Java/Python), and Dynamic JIT engines (JavaScript V8).',
    whyItMatters: 'Disproves the myth that all programming languages execute in the same physical manner.',
  },
  {
    id: 'end-',
    title: '3. Complete Program Execution Journey',
    track: 'system',
    lessonStep: 10,
    lessonPath: `${TOPIC_BASE_PATH}/execution-summary`,
    prerequisites: ['Stack & Heap Segments', 'Multitasking', 'Hardware I/O & System Calls', 'Compilation Pipelines'],
    unlocks: ['Complete Mastery of Program Cosmos'],
    summary: '13-milestone unification: High-level C &rarr; libc &rarr; syscall &rarr; GPU framebuffer &rarr; monitor RGB subpixels.',
    whyItMatters: 'Connects all hardware, memory, and OS concepts into one unified, unbroken mental model.',
  },
];

export const ConceptDependencyMap: React.FC = () => {
  const { theme } = useTheme();
  const [selectedId, setSelectedId] = useState<string>('bits-voltage');
  const [activeTrack, setActiveTrack] = useState<'all' | 'data' | 'cpu' | 'system'>('all');

  const selectedNode = CONCEPT_NODES.find((n) => n.id === selectedId) ?? CONCEPT_NODES[0];

  const filteredNodes =
    activeTrack === 'all'
      ? CONCEPT_NODES
      : CONCEPT_NODES.filter((n) => n.track === activeTrack);

  const getTrackBadge = (track: ConceptNode['track']) => {
    switch (track) {
      case 'data':
        return { label: 'Data & Memory Track', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
      case 'cpu':
        return { label: 'CPU & Control Track', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' };
      case 'system':
        return { label: 'System Integration Track', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    }
  };

  return (
    <section
      aria-label="Concept Dependency Map"
      className={cn(
        "rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xl transition-colors",
        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      )}
    >
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
              Pedagogical Roadmap
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Concept Dependency Map
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            See how foundational concepts unlock advanced architecture topics. Click any node to inspect prerequisites.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-muted/60 border border-border text-xs font-bold" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTrack('all')}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              activeTrack === 'all' ? "bg-amber-500 text-zinc-950 font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Tracks
          </button>
          <button
            type="button"
            onClick={() => setActiveTrack('data')}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              activeTrack === 'data' ? "bg-emerald-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Data &amp; Memory
          </button>
          <button
            type="button"
            onClick={() => setActiveTrack('cpu')}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              activeTrack === 'cpu' ? "bg-amber-500 text-zinc-950 font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            CPU &amp; Control
          </button>
          <button
            type="button"
            onClick={() => setActiveTrack('system')}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              activeTrack === 'system' ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            System Integration
          </button>
        </div>
      </div>

      {/* Grid of Concept Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredNodes.map((node) => {
          const isSelected = node.id === selectedId;
          const trackBadge = getTrackBadge(node.track);
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedId(node.id)}
              className={cn(
                "p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[110px] gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                isSelected
                  ? "border-amber-500 bg-amber-500/10 shadow-lg scale-[1.02] ring-2 ring-amber-500/20"
                  : "border-border bg-card hover:border-amber-400/50 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded border", trackBadge.color)}>
                  Lesson 0{node.lessonStep}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {node.track.toUpperCase()}
                </span>
              </div>
              <h4 className="font-bold text-foreground text-sm line-clamp-1">
                {node.title}
              </h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {node.summary}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Node Inspector Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded border", getTrackBadge(selectedNode.track).color)}>
                  {getTrackBadge(selectedNode.track).label}
                </span>
                <span className="text-xs font-mono text-amber-500 font-bold">
                  Lesson 0{selectedNode.lessonStep}
                </span>
              </div>
              <h4 className="text-lg font-extrabold text-foreground">
                {selectedNode.title}
              </h4>
            </div>

            <Link
              href={selectedNode.lessonPath}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-xs font-bold text-xs transition-colors shadow-sm shrink-0"
            >
              <span>Go to Lesson 0{selectedNode.lessonStep}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            {selectedNode.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-500 block">
                Prerequisites Needed:
              </span>
              <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                {selectedNode.prerequisites.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-500 block">
                Unlocks Next:
              </span>
              <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                {selectedNode.unlocks.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-500 block">
                Why It Matters:
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {selectedNode.whyItMatters}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
