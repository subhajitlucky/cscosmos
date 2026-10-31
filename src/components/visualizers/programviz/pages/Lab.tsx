'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Binary,
  Cpu,
  Database,
  FlaskConical,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
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

type LabTool = 'cpu' | 'memory' | 'binary' | 'lifecycle';

const TOOLS: { id: LabTool; name: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    id: 'cpu',
    name: 'CPU Instruction Simulator',
    subtitle: '8-bit assembly execution, registers, ALU & PC',
    icon: Cpu,
  },
  {
    id: 'memory',
    name: 'RAM Memory Grid',
    subtitle: 'Byte-level addressing, write/read, and endianness',
    icon: Database,
  },
  {
    id: 'binary',
    name: 'Data & Binary Explorer',
    subtitle: 'Bits, bytes, hex, ASCII text & RGB pixel raster',
    icon: Binary,
  },
  {
    id: 'lifecycle',
    name: 'Full Execution Stepper',
    subtitle: '13-milestone journey from source code to screen',
    icon: Terminal,
  },
];

export function Lab() {
  const [activeTool, setActiveTool] = useState<LabTool>('cpu');

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-500 text-xs font-mono font-semibold">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Interactive Simulation Workbench</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Systems <span className="text-blue-500">Simulation Lab</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
          Experiment directly with the hardware abstractions that power all software. Toggle bits, step through CPU assembly cycles,
          inspect RAM bytes, and trace execution from source code down to hardware pins.
        </p>
      </header>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-xl border border-border/80 bg-muted/40">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTool(tool.id)}
              className={cn(
                'flex flex-col text-left p-3 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isActive
                  ? 'bg-card text-foreground shadow-xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn('w-4 h-4', isActive ? 'text-blue-500' : 'text-muted-foreground')} />
                <span className="text-xs font-bold truncate">{tool.name}</span>
              </div>
              <span className="text-[11px] text-muted-foreground line-clamp-1">{tool.subtitle}</span>
            </button>
          );
        })}
      </div>

      {/* Active Lab Component */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        {activeTool === 'cpu' && (
          <div className="space-y-4">
            <div className="border-b border-border/80 pb-3">
              <h2 className="text-lg font-bold text-foreground">CPU Instruction Execution Simulator</h2>
              <p className="text-xs text-muted-foreground">
                Step through 8-bit assembly instructions. Watch the Program Counter advance, registers update in real time, and the ALU perform binary math.
              </p>
            </div>
            <AssemblySimulator />
          </div>
        )}

        {activeTool === 'memory' && (
          <div className="space-y-4">
            <div className="border-b border-border/80 pb-3">
              <h2 className="text-lg font-bold text-foreground">Interactive RAM Memory Grid</h2>
              <p className="text-xs text-muted-foreground">
                Each cell represents a single 8-bit byte at a unique hexadecimal address. Click any byte to inspect or write values.
              </p>
            </div>
            <InteractiveMemoryGrid />
          </div>
        )}

        {activeTool === 'binary' && (
          <div className="space-y-4">
            <div className="border-b border-border/80 pb-3">
              <h2 className="text-lg font-bold text-foreground">Binary &amp; Data Representation Explorer</h2>
              <p className="text-xs text-muted-foreground">
                Toggle individual bits, observe binary-to-decimal conversion, explore Two's Complement for negative integers, and see how RGB pixel values are represented.
              </p>
            </div>
            <BinaryDataExplorer />
          </div>
        )}

        {activeTool === 'lifecycle' && (
          <div className="space-y-4">
            <div className="border-b border-border/80 pb-3">
              <h2 className="text-lg font-bold text-foreground">End-to-End Program Execution Stepper</h2>
              <p className="text-xs text-muted-foreground">
                Follow a C program through all 13 execution milestones: from compiler translation to process loading, CPU instruction loops, and terminal syscall rendering.
              </p>
            </div>
            <EndToEndExecutionStepper />
          </div>
        )}
      </div>
    </div>
  );
}
