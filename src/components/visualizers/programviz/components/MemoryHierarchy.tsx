'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, Clock, HardDrive, Cpu, Layers, HelpCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ViewMode = 'hardware' | 'human';

interface MemoryTier {
  id: string;
  name: string;
  badge: string;
  location: string;
  latencyNs: string;
  cycles: string;
  typicalSize: string;
  humanAnalogy: string;
  humanTime: string;
  technology: string;
  description: string;
  speedRating: number; // 1 to 6 (6 is fastest)
  colorClass: string;
}

const TIERS: MemoryTier[] = [
  {
    id: 'registers',
    name: 'CPU Registers',
    badge: 'Immediate',
    location: 'Inside the CPU Core (Execution Pipeline)',
    latencyNs: '~0.5 ns',
    cycles: '1 clock cycle',
    typicalSize: '64 – 128 Bytes (e.g. 16 × 64-bit registers)',
    humanTime: '1 second',
    humanAnalogy: 'A scrap of paper currently in your hand while doing arithmetic.',
    technology: 'Direct transistor flip-flops',
    description:
      'The fastest possible storage in computing. Instructions take operands directly from registers and deposit results back in a single clock cycle.',
    speedRating: 6,
    colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    id: 'l1',
    name: 'L1 Cache (Inst / Data)',
    badge: 'Ultra Fast',
    location: 'Dedicated per CPU Core',
    latencyNs: '~1.0 ns',
    cycles: '3 – 4 cycles',
    typicalSize: '32 – 64 KB per core',
    humanTime: '3 seconds',
    humanAnalogy: 'A printed reference cheat-sheet sitting right on your desk.',
    technology: 'High-speed 6T SRAM (Static RAM)',
    description:
      'Split into L1-Instruction (L1i) and L1-Data (L1d) so fetching the next instruction never competes with reading or writing data values.',
    speedRating: 5,
    colorClass: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
  },
  {
    id: 'l2',
    name: 'L2 Cache',
    badge: 'Very Fast',
    location: 'Tightly coupled to each CPU Core',
    latencyNs: '~3 – 4 ns',
    cycles: '10 – 14 cycles',
    typicalSize: '512 KB – 1 MB per core',
    humanTime: '10 seconds',
    humanAnalogy: 'A book on the shelf right behind your chair.',
    technology: 'Dense SRAM',
    description:
      'Larger than L1, absorbs cache misses with minimal performance penalty before needing to go to the shared bus.',
    speedRating: 4,
    colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'l3',
    name: 'L3 Cache (Shared LLC)',
    badge: 'Fast',
    location: 'On-die Silicon, shared by ALL CPU Cores',
    latencyNs: '~10 – 20 ns',
    cycles: '40 – 60 cycles',
    typicalSize: '16 – 64 MB (up to 96MB with 3D V-Cache)',
    humanTime: '40 seconds',
    humanAnalogy: 'Walking to the file cabinet at the end of your hallway.',
    technology: 'Large-scale on-die SRAM',
    description:
      'The Last-Level Cache (LLC). If Core 0 writes data that Core 1 needs to read, L3 coordinates the shared cache coherency without touching slow motherboard RAM.',
    speedRating: 3,
    colorClass: 'text-zinc-300 bg-zinc-800 border-zinc-700',
  },
  {
    id: 'ram',
    name: 'Main Memory (RAM / DDR5)',
    badge: 'Off-Chip',
    location: 'Motherboard DIMM Slots (External Memory Bus)',
    latencyNs: '~60 – 100 ns',
    cycles: '150 – 250 cycles',
    typicalSize: '16 – 64 GB',
    humanTime: '4.5 minutes',
    humanAnalogy: 'Walking out of your building, across campus, into the public library.',
    technology: 'DRAM (Dynamic RAM: tiny capacitors that must be constantly refreshed)',
    description:
      'Massive capacity compared to SRAM, but over 100× slower than registers! If the CPU has to wait on RAM for every instruction, it stalls (the "Memory Wall").',
    speedRating: 2,
    colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'disk',
    name: 'Storage (NVMe SSD / Disk)',
    badge: 'Persistent',
    location: 'PCIe / SATA Storage Bus (Flash memory / Platters)',
    latencyNs: '10,000 – 50,000 ns (10–50 µs)',
    cycles: '20,000 – 100,000+ cycles',
    typicalSize: '512 GB – 4 TB',
    humanTime: '3 WEEKS to 12 MONTHS',
    humanAnalogy: 'Boarding a ship across the ocean to retrieve an archived manuscript.',
    technology: 'NAND Flash / Magnetic Platters (Non-volatile)',
    description:
      'Stores files permanently when power is turned off. The operating system uses RAM as a buffer because waiting on disk directly would freeze execution.',
    speedRating: 1,
    colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
  },
];

export const MemoryHierarchy: React.FC = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('hardware');
  const [selectedTierId, setSelectedTierId] = useState<string>('l1');

  const selectedTier = TIERS.find((t) => t.id === selectedTierId) ?? TIERS[0];

  return (
    <div
      className={cn(
        'rounded-3xl border p-6 sm:p-8 space-y-8 shadow-xl transition-colors duration-300',
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      )}
    >
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-amber-600 dark:text-amber-400">
            <Layers className="w-4 h-4" />
            <span>Architecture Deep Dive</span>
          </div>
          <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
            The Memory Wall &amp; Hardware Speed Hierarchy
          </h3>
        </div>

        {/* View mode toggle */}
        <div
          role="tablist"
          aria-label="Memory hierarchy scale view modes"
          className={cn(
            'flex rounded-xl p-1 border text-xs font-semibold',
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          )}
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'hardware'}
            onClick={() => setViewMode('hardware')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5',
              viewMode === 'hardware'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-foreground'
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Hardware Time (ns)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'human'}
            onClick={() => setViewMode('human')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5',
              viewMode === 'human'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-foreground'
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Human Analogy (1s = 1 cycle)</span>
          </button>
        </div>
      </div>

      {/* Intro Context */}
      <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
        <p>
          A 3.5 GHz CPU executes an instruction every <strong>0.3 nanoseconds</strong>. But pulling data from main RAM takes <strong>~60 to 100 nanoseconds</strong>. 
          If a CPU had to wait for RAM on every step, it would spend <strong>over 95% of its time completely stalled</strong>!
        </p>
        <p className="text-xs text-muted-foreground">
          Computer architects solved this with the <strong>Memory Hierarchy</strong>: placing small, blazing-fast SRAM caches right next to the execution units.
        </p>
      </div>

      {/* Tier Pyramid / List */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Storage Tiers (Fastest &amp; Smallest at Top → Largest &amp; Slowest at Bottom):
        </span>

        <div className="space-y-2">
          {TIERS.map((tier) => {
            const isSelected = selectedTierId === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTierId(tier.id)}
                className={cn(
                  'w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-zinc-900 dark:bg-zinc-900 shadow-md ring-1 ring-amber-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-card'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-mono font-bold border',
                      tier.colorClass
                    )}
                  >
                    {tier.badge}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span>{tier.name}</span>
                      <span className="text-[11px] font-normal text-muted-foreground">
                        ({tier.typicalSize})
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {tier.location}
                    </div>
                  </div>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1">
                  <div className="font-mono font-extrabold text-sm text-amber-600 dark:text-amber-400">
                    {viewMode === 'hardware' ? tier.latencyNs : tier.humanTime}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {viewMode === 'hardware' ? tier.cycles : 'CPU cycles equivalent'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tier Inspector */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTier.id + viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'p-6 rounded-2xl border transition-colors space-y-4',
            theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-border">
            <div>
              <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>{selectedTier.name} Deep Dive</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {selectedTier.technology}
                </span>
              </h4>
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              Capacity: <strong className="text-foreground">{selectedTier.typicalSize}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border bg-card border-border space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-amber-500 block">
                Access Latency &amp; Penalty
              </span>
              <p className="text-foreground font-mono text-sm font-bold">
                {selectedTier.latencyNs} ({selectedTier.cycles})
              </p>
              <p className="text-muted-foreground leading-relaxed mt-1">
                {selectedTier.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card border-border space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-amber-500 block">
                Human-Scale Perspective (If 1 cycle = 1 second)
              </span>
              <p className="text-foreground font-mono text-sm font-bold">
                {selectedTier.humanTime}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-1">
                {selectedTier.humanAnalogy}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-800 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p>
              <strong className="text-amber-600 dark:text-amber-400">Why Modern Programs Run Fast: </strong>
              Because of <em>Spatial and Temporal Locality</em>, ~95% of CPU memory requests hit the L1/L2 caches! The CPU rarely needs to endure the agonizing 150-cycle penalty to reach external RAM.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
