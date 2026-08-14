'use client';

import React, { useState } from 'react';
import { ArrowDown, ArrowRight, CheckCircle2, ChevronRight, Layers, RotateCcw, Search, Sparkles, Terminal } from 'lucide-react';

interface TraversalStep {
  level: 'Root' | 'Branch' | 'Leaf' | 'Heap';
  nodeId: string;
  keys: number[];
  action: string;
  description: string;
}

export function BTreeIndexVisualizer() {
  const [targetId, setTargetId] = useState<number>(45);
  const [stepIdx, setStepIdx] = useState<number>(0);

  // Stepper logic for targetId 45 (or others)
  const steps: TraversalStep[] = [
    {
      level: 'Root',
      nodeId: 'Page #1 (Root Node)',
      keys: [30, 70],
      action: 'Compare 45 against Root Keys [30, 70]',
      description: '45 > 30 and 45 <= 70. Follow pointer between 30 and 70 to Branch Page #3.'
    },
    {
      level: 'Branch',
      nodeId: 'Page #3 (Branch Node)',
      keys: [40, 60],
      action: 'Compare 45 against Branch Keys [40, 60]',
      description: '45 > 40 and 45 <= 60. Follow pointer between 40 and 60 to Leaf Page #8.'
    },
    {
      level: 'Leaf',
      nodeId: 'Page #8 (Leaf Node Page)',
      keys: [41, 45, 52],
      action: 'Scan Leaf Page entries',
      description: '🎯 EXACT MATCH: Key 45 found at Leaf Page #8! Extract (Block 12, Offset 4) heap pointer.'
    },
    {
      level: 'Heap',
      nodeId: 'Table Heap File (Block 12)',
      keys: [45],
      action: 'Fetch full row tuple payload',
      description: '✅ ROW RETRIEVED: { id: 45, name: "Alice", email: "alice@test.com", created_at: "2026-03-01" } in just 3 page reads!'
    }
  ];

  const currentStep = steps[stepIdx] || steps[0];

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Database Physical Storage Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              B+ Tree Index Traversal &amp; Leaf Page Stepper
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          Step {stepIdx + 1} of {steps.length} • $O(\log N)$ Point Lookup
        </span>
      </div>

      {/* Target Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground">Search Target ID:</span>
        <button
          onClick={() => { setTargetId(45); setStepIdx(0); }}
          className="px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold bg-indigo-600 text-white shadow-md"
        >
          id = 45 (Alice)
        </button>
      </div>

      {/* B+ Tree Visual Nodes Hierarchy */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        {/* Tier 1: Root Node */}
        <div className={`p-3.5 rounded-2xl border transition-all ${
          currentStep.level === 'Root' ? 'border-indigo-500 bg-indigo-500/20 shadow-md scale-[1.02]' : 'border-slate-800 bg-slate-900/60 opacity-60'
        }`}>
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800">
            <span className="text-indigo-400 font-bold">Root Page #1 (Disk Block: 0x01)</span>
            <span className="text-slate-400">8 KB Page</span>
          </div>
          <div className="flex items-center justify-center gap-4 pt-2">
            <span className="p-1.5 px-3 rounded-lg bg-slate-800 border border-slate-700">ptr_0 (&lt; 30)</span>
            <span className="text-indigo-300 font-bold">[ Key: 30 ]</span>
            <span className={`p-1.5 px-3 rounded-lg border ${currentStep.level === 'Root' ? 'bg-indigo-600 text-white font-bold animate-pulse' : 'bg-slate-800 text-slate-300'}`}>ptr_1 (30 - 70)</span>
            <span className="text-indigo-300 font-bold">[ Key: 70 ]</span>
            <span className="p-1.5 px-3 rounded-lg bg-slate-800 border border-slate-700">ptr_2 (&gt; 70)</span>
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 2: Branch Node */}
        <div className={`p-3.5 rounded-2xl border transition-all ${
          currentStep.level === 'Branch' ? 'border-purple-500 bg-purple-500/20 shadow-md scale-[1.02]' : 'border-slate-800 bg-slate-900/60 opacity-60'
        }`}>
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800">
            <span className="text-purple-400 font-bold">Branch Page #3 (Disk Block: 0x03)</span>
            <span className="text-slate-400">Internal Routing Page</span>
          </div>
          <div className="flex items-center justify-center gap-4 pt-2">
            <span className="p-1.5 px-3 rounded-lg bg-slate-800 border border-slate-700">ptr_0 (30 - 40)</span>
            <span className="text-purple-300 font-bold">[ Key: 40 ]</span>
            <span className={`p-1.5 px-3 rounded-lg border ${currentStep.level === 'Branch' ? 'bg-purple-600 text-white font-bold animate-pulse' : 'bg-slate-800 text-slate-300'}`}>ptr_1 (40 - 60)</span>
            <span className="text-purple-300 font-bold">[ Key: 60 ]</span>
            <span className="p-1.5 px-3 rounded-lg bg-slate-800 border border-slate-700">ptr_2 (60 - 70)</span>
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 3: Leaf Pages (Linked List) */}
        <div className={`p-3.5 rounded-2xl border transition-all ${
          currentStep.level === 'Leaf' ? 'border-emerald-500 bg-emerald-500/20 shadow-md scale-[1.02]' : 'border-slate-800 bg-slate-900/60 opacity-60'
        }`}>
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800">
            <span className="text-emerald-400 font-bold">Leaf Page #8 (Doubly-Linked with Page #7 and #9)</span>
            <span className="text-slate-400">Record Pointers</span>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="p-1.5 px-3 rounded-lg bg-slate-800 text-slate-400">[ id: 41 ➔ Blk 11:1 ]</span>
            <span>⇄</span>
            <span className={`p-1.5 px-3 rounded-lg border ${currentStep.level === 'Leaf' ? 'bg-emerald-600 text-white font-bold animate-pulse' : 'bg-slate-800 text-slate-300'}`}>[ id: 45 ➔ Blk 12:4 ]</span>
            <span>⇄</span>
            <span className="p-1.5 px-3 rounded-lg bg-slate-800 text-slate-400">[ id: 52 ➔ Blk 14:2 ]</span>
          </div>
        </div>
      </div>

      {/* Step Description & Stepper Controls */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-foreground font-mono space-y-1">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block">
            Step Narration:
          </span>
          <p className="text-sm font-medium">{currentStep.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setStepIdx(0)}
            className="p-2.5 rounded-xl border border-border hover:bg-muted text-foreground transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setStepIdx((prev) => (prev < steps.length - 1 ? prev + 1 : prev))}
            disabled={stepIdx >= steps.length - 1}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
