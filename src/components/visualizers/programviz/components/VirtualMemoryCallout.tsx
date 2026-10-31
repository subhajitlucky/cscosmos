'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Database, ArrowRight, AlertTriangle, ExternalLink, KeyRound } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ExampleCase {
  id: string;
  name: string;
  virtualAddress: string;
  process: string;
  pageNumber: string;
  frameNumber: string;
  physicalAddress: string;
  status: 'valid' | 'forbidden';
  statusText: string;
  explanation: string;
}

const TRANSLATION_EXAMPLES: ExampleCase[] = [
  {
    id: 'browser',
    name: 'Browser Process (App A)',
    virtualAddress: '0x0010',
    process: 'Web Browser (PID 1420)',
    pageNumber: 'Page 0',
    frameNumber: 'Frame 42',
    physicalAddress: '0x7FA04010',
    status: 'valid',
    statusText: 'Translation Allowed (RW Permissions)',
    explanation:
      'The browser writes to its own virtual address 0x0010. The MMU hardware looks up Page 0 in the browser’s page table and routes the electrical signals to physical RAM frame 42.',
  },
  {
    id: 'editor',
    name: 'Code Editor (App B)',
    virtualAddress: '0x0010',
    process: 'Code Editor (PID 3891)',
    pageNumber: 'Page 0',
    frameNumber: 'Frame 108',
    physicalAddress: '0x12B89010',
    status: 'valid',
    statusText: 'Translation Allowed (Independent Physical RAM)',
    explanation:
      'The editor ALSO writes to virtual address 0x0010! But because its OS page table is different, the MMU routes it to an entirely different physical RAM frame (Frame 108). Neither process can corrupt the other!',
  },
  {
    id: 'segfault',
    name: 'Rogue Pointer Access',
    virtualAddress: '0xDEADBEEF',
    process: 'Crashing App (PID 9999)',
    pageNumber: 'Unmapped',
    frameNumber: 'None',
    physicalAddress: '—',
    status: 'forbidden',
    statusText: 'Hardware Trap: Segmentation Fault (SIGSEGV)',
    explanation:
      'The program attempted to read memory that has not been mapped into its page table. The MMU raises an interrupt line directly to the CPU; the kernel halts the program immediately before any system memory is corrupted.',
  },
];

export const VirtualMemoryCallout: React.FC = () => {
  const { theme } = useTheme();
  const [selectedExampleId, setSelectedExampleId] = useState<string>('browser');

  const selectedExample =
    TRANSLATION_EXAMPLES.find((e) => e.id === selectedExampleId) ?? TRANSLATION_EXAMPLES[0];

  return (
    <div
      className={cn(
        'rounded-3xl border p-6 sm:p-8 space-y-8 shadow-xl transition-colors duration-300',
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-zinc-300 dark:text-zinc-300">
            <KeyRound className="w-4 h-4" />
            <span>Hardware Architecture Reality</span>
          </div>
          <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
            The Virtual Memory Secret: Why Programs Never Touch Physical RAM Directly
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-zinc-800 text-zinc-300 dark:text-zinc-300 border border-zinc-700">
          MMU &amp; Paging
        </span>
      </div>

      {/* Main explanation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl border bg-card border-border space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Process Isolation</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Every running program lives inside its own private <strong>Virtual Address Space</strong>. A program thinks it has the entire memory to itself, starting at zero.
          </p>
        </div>

        <div className="p-4 rounded-2xl border bg-card border-border space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <Cpu className="w-4 h-4 text-amber-500" />
            <span>The Hardware MMU</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The CPU contains a dedicated piece of silicon called the <strong>Memory Management Unit (MMU)</strong>. On every single memory fetch, it translates virtual addresses to physical RAM frames.
          </p>
        </div>

        <div className="p-4 rounded-2xl border bg-card border-border space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Crash Protection</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            If a program tries to touch memory outside its page table, the MMU stops execution instantly and signals the OS kernel, producing a <strong>Segmentation Fault (SegFault)</strong>.
          </p>
        </div>
      </div>

      {/* Interactive Translation Demo */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Interactive MMU Address Translation Demo:
          </span>
          <span className="text-xs text-muted-foreground">Select a scenario to inspect:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TRANSLATION_EXAMPLES.map((ex) => {
            const isSelected = selectedExampleId === ex.id;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelectedExampleId(ex.id)}
                className={cn(
                  'px-3.5 py-2.5 rounded-xl text-left border text-xs font-bold transition flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                  isSelected
                    ? 'border-zinc-700 bg-zinc-800 dark:bg-zinc-800 text-foreground ring-1 ring-amber-500'
                    : 'border-slate-200 dark:border-slate-800 bg-card text-muted-foreground hover:text-foreground hover:border-slate-400'
                )}
              >
                <div>{ex.name}</div>
                <div className="text-[10px] font-mono font-normal opacity-70 mt-0.5 truncate">
                  Address: {ex.virtualAddress}
                </div>
              </button>
            );
          })}
        </div>

        {/* Translation Path Diagram */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedExample.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              'p-5 rounded-2xl border transition-colors space-y-5',
              theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            )}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
              {/* Virtual Address */}
              <div className="w-full md:w-1/3 p-3.5 rounded-xl bg-card border border-border text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                  1. Program Virtual Address
                </span>
                <div className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                  {selectedExample.virtualAddress}
                </div>
                <div className="text-[11px] text-muted-foreground">{selectedExample.process}</div>
              </div>

              {/* Arrow / MMU */}
              <div className="flex flex-col items-center justify-center text-center px-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-100 font-bold flex items-center justify-center shadow">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-zinc-300 mt-1 uppercase">
                  MMU Translation
                </span>
              </div>

              {/* Physical RAM Location */}
              <div
                className={cn(
                  'w-full md:w-1/3 p-3.5 rounded-xl border text-center space-y-1',
                  selectedExample.status === 'valid'
                    ? 'bg-card border-border'
                    : 'bg-rose-500/10 border-rose-500/30'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider block',
                    selectedExample.status === 'valid' ? 'text-emerald-500' : 'text-rose-500'
                  )}
                >
                  2. Physical RAM Location
                </span>
                <div
                  className={cn(
                    'text-base font-extrabold',
                    selectedExample.status === 'valid'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-500'
                  )}
                >
                  {selectedExample.physicalAddress}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {selectedExample.status === 'valid'
                    ? `Mapped to ${selectedExample.frameNumber}`
                    : 'Trap: SIGSEGV'}
                </div>
              </div>
            </div>

            {/* Explanation card */}
            <div
              className={cn(
                'p-3.5 rounded-xl border text-xs leading-relaxed',
                selectedExample.status === 'valid'
                  ? 'bg-zinc-800 border-zinc-700 text-slate-800 dark:text-slate-200'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-200'
              )}
            >
              <span className="font-bold block mb-1">Status: {selectedExample.statusText}</span>
              <p>{selectedExample.explanation}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Deep-dive link to Operating Systems Internals */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-muted-foreground text-center sm:text-left">
          Want to see multi-level page tables, TLB cache walks, and fork-exec COW (copy-on-write) in action?
        </div>
        <Link
          href="/corecs/operating-systems-internals-processes-memory"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-md whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span>OS Internals &amp; Memory Topic</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
