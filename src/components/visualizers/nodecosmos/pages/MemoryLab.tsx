'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HardDrive, Sparkles } from 'lucide-react';
import { V8MemoryVisualizer } from '../components/V8MemoryVisualizer';
import { EventEmitterVisualizer } from '../components/EventEmitterVisualizer';

export default function MemoryLab() {
  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-3">
        <Link
          href="/nodecosmos"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to NodeCosmos
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <HardDrive className="w-3.5 h-3.5" /> V8 Memory &amp; Resource Management
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          V8 Memory Architecture &amp; Leak Simulator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
          Interactive simulation of V8 Young Generation Cheney semi-space scavenge, Old Generation Mark-Sweep promotion, and unhandled EventEmitter closure memory leaks.
        </p>
      </div>

      {/* Simulator 1: V8 Generational Garbage Collector */}
      <V8MemoryVisualizer />

      {/* Simulator 2: EventEmitter Listener Memory Leaks */}
      <EventEmitterVisualizer />
    </div>
  );
}
