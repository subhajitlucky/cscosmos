'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Binary,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  Flame,
  FlaskConical,
  Gauge,
  HelpCircle,
  Lightbulb,
  Radio,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { AssemblySimulator } from '../components/AssemblySimulator';
import { InteractiveMemoryGrid } from '../components/InteractiveMemoryGrid';
import { BinaryDataExplorer } from '../components/BinaryDataExplorer';
import { EndToEndExecutionStepper } from '../components/EndToEndExecutionStepper';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type LabStation = 'cpu' | 'memory' | 'binary' | 'lifecycle';

interface StationMeta {
  id: LabStation;
  code: string;
  name: string;
  shortTag: string;
  badge: string;
  description: string;
  telemetry: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STATIONS: StationMeta[] = [
  {
    id: 'cpu',
    code: 'STN-01',
    name: 'CPU Instruction Execution Engine',
    shortTag: 'CPU Core',
    badge: '8-Bit ALU & Registers',
    description: 'Step-through assembly machine execution with live Program Counter, registers R0/R1/ACC, and ALU writeback.',
    telemetry: 'ALU STATE: ARITHMETIC / LOGIC READY · PC CLOCK: SYNCHRONIZED',
    icon: Cpu,
  },
  {
    id: 'memory',
    code: 'STN-02',
    name: 'Silicon RAM Matrix & Hex Dump',
    shortTag: 'RAM Grid',
    badge: 'Byte-Addressable Bus',
    description: 'Direct byte-level physical addressing grid with live hex inspector, data alignment, and interactive byte writes.',
    telemetry: 'BUS ADDR: 0x00 - 0x1F · 32 BYTES ONLINE · READ/WRITE PERMITTED',
    icon: Database,
  },
  {
    id: 'binary',
    code: 'STN-03',
    name: 'Binary Logic & Data Representation',
    shortTag: 'Binary Forge',
    badge: 'Bits, Hex, ASCII & RGB',
    description: 'Tactile bit switchboard, two’s complement signed math, ASCII character conversion, and 24-bit RGB rasterizer.',
    telemetry: 'LOGIC: 8 BITS (256 STATES) · ENCODINGS: UINT8, INT8, UTF-8, RGB',
    icon: Binary,
  },
  {
    id: 'lifecycle',
    code: 'STN-04',
    name: 'Complete Execution Lifecycle Stepper',
    shortTag: 'OS & Syscall',
    badge: 'Ring 3 to Ring 0 Pipeline',
    description: 'Trace a program from source text through the compiler, OS virtual memory loader, CPU loops, and terminal I/O.',
    telemetry: 'PRIVILEGE: DUAL RING (USER 3 / KERNEL 0) · 13 EXECUTION STAGES',
    icon: Terminal,
  },
];

interface GuidedExperiment {
  id: string;
  title: string;
  station: LabStation;
  goal: string;
  steps: string[];
}

const EXPERIMENTS: GuidedExperiment[] = [
  {
    id: 'exp-1',
    title: 'Experiment 1: Watch an 8-bit Addition in CPU Silicon',
    station: 'cpu',
    goal: 'See how the ALU combines values from registers R0 and R1 and writes the result back.',
    steps: [
      'Select Station 01 (CPU Core).',
      'Choose the "15 + 27 = 42" assembly preset.',
      'Click "Step Instruction" or press ArrowRight to watch R0 load 15, R1 load 27, and the ALU sum them into 42.',
    ],
  },
  {
    id: 'exp-2',
    title: 'Experiment 2: Write Bytes Directly into RAM Addresses',
    station: 'memory',
    goal: 'Understand that variables are just bytes sitting at numerical memory addresses.',
    steps: [
      'Select Station 02 (RAM Grid).',
      'Click address 0x10 to see its current value (42 = 0x2A).',
      'Type a new value (e.g. 99) in the inspector panel and click Write to watch the RAM cell update immediately.',
    ],
  },
  {
    id: 'exp-3',
    title: 'Experiment 3: Negative Numbers in Two’s Complement',
    station: 'binary',
    goal: 'Discover why flipping the most significant bit (bit 7) converts a number to negative in binary hardware.',
    steps: [
      'Select Station 03 (Binary Forge).',
      'Toggle bit 7 (value 128) ON while all other bits are OFF.',
      'Notice how in Signed Two’s Complement mode, 1000 0000 becomes -128.',
    ],
  },
];

export function Lab() {
  const [activeStationId, setActiveStationId] = useState<LabStation>('cpu');
  const activeStation = STATIONS.find((s) => s.id === activeStationId) || STATIONS[0];

  return (
    <div className="space-y-8">
      {/* Hardware Chassis Ambient Surface */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm">
        {/* Top Hardware Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-6 mb-8 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-bold text-foreground tracking-wider">
              HARDWARE SIMULATION WORKBENCH
            </span>
            <span className="text-muted-foreground hidden sm:inline">·</span>
            <span className="text-amber-500 font-bold hidden sm:inline">
              SYSCLK: 3.20 GHz
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
            <span className="px-2 py-0.5 rounded bg-muted font-bold text-foreground">
              ARCH: VON NEUMANN
            </span>
            <span className="px-2 py-0.5 rounded bg-muted font-bold text-foreground">
              BUS: 8-BIT
            </span>
          </div>
        </div>

        {/* Hero Title & Mission */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Computer Architecture Laboratory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Systems <span className="text-amber-500">Simulation Lab</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Move past static diagrams. Directly command an 8-bit CPU execution unit, inspect live byte addressing in RAM,
            experiment with binary logic gates, and trace system call privilege transitions.
          </p>
        </div>

        {/* Station Navigation Deck */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STATIONS.map((station) => {
            const Icon = station.icon;
            const isSelected = activeStationId === station.id;

            return (
              <button
                key={station.id}
                type="button"
                onClick={() => setActiveStationId(station.id)}
                className={cn(
                  'group relative text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/50 shadow-xs'
                    : 'border-border/80 bg-card/60 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-card'
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded',
                      isSelected ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-muted text-muted-foreground'
                    )}>
                      {station.code}
                    </span>
                    <Icon className={cn('w-4 h-4', isSelected ? 'text-amber-500' : 'text-muted-foreground')} />
                  </div>

                  <div>
                    <h3 className={cn(
                      'text-sm font-bold tracking-tight transition-colors',
                      isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                    )}>
                      {station.shortTag}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      {station.badge}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-mono">
                  <span className={isSelected ? 'text-amber-500 font-bold' : 'text-muted-foreground'}>
                    {isSelected ? 'ACTIVE STATION' : 'SELECT STATION'}
                  </span>
                  <ChevronRight className={cn('w-3.5 h-3.5 transition-transform', isSelected ? 'text-amber-500 translate-x-0.5' : 'text-muted-foreground')} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Station Container */}
      <section className="rounded-3xl border border-border/80 bg-card shadow-sm p-6 sm:p-8 space-y-6">
        {/* Active Station Header & Telemetry Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                {activeStation.code} · {activeStation.badge}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">{activeStation.name}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {activeStation.description}
            </p>
          </div>

          <div className="shrink-0 p-3 rounded-xl border border-border bg-muted/30 font-mono text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2 text-foreground font-bold text-[11px]">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>LIVE TELEMETRY</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              {activeStation.telemetry}
            </p>
          </div>
        </div>

        {/* Embedded Interactive Instrument */}
        <div className="pt-2">
          {activeStationId === 'cpu' && (
            <div className="space-y-6">
              <AssemblySimulator />
            </div>
          )}

          {activeStationId === 'memory' && (
            <div className="space-y-6">
              <InteractiveMemoryGrid />
            </div>
          )}

          {activeStationId === 'binary' && (
            <div className="space-y-6">
              <BinaryDataExplorer />
            </div>
          )}

          {activeStationId === 'lifecycle' && (
            <div className="space-y-6">
              <EndToEndExecutionStepper />
            </div>
          )}
        </div>
      </section>

      {/* Guided Lab Missions (Actionable Experiments) */}
      <section className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Guided Lab Experiments</h3>
            <p className="text-xs text-muted-foreground">
              Try these three hands-on challenges inside the stations above to observe actual computer architecture principles in action.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPERIMENTS.map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-500">
                  Mission Target: {exp.station.toUpperCase()}
                </span>
                <h4 className="text-sm font-bold text-foreground leading-snug">{exp.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{exp.goal}</p>
                <div className="pt-2 space-y-1.5 border-t border-border/50">
                  {exp.steps.map((st, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                      <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStationId(exp.station)}
                className="w-full py-2 px-3 rounded-lg border border-border bg-muted/40 hover:bg-amber-500 hover:text-zinc-950 hover:border-amber-500 text-xs font-bold text-foreground transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Switch to {exp.station.toUpperCase()} Station</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}
