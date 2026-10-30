'use client';

import React, { useState } from 'react';
import { ArrowDown, ArrowRight, Layers, RotateCcw } from 'lucide-react';

interface TraversalStep {
  level: 'Root' | 'Branch' | 'Leaf' | 'Heap';
  nodeId: string;
  keys: number[];
  action: string;
  description: string;
}

interface SearchTargetConfig {
  id: number;
  name: string;
  email: string;
  branchPage: string;
  branchKeys: number[];
  leafPage: string;
  leafEntries: { id: number; block: string }[];
  steps: TraversalStep[];
}

const TARGET_CONFIGS: Record<number, SearchTargetConfig> = {
  18: {
    id: 18,
    name: 'David',
    email: 'david@test.com',
    branchPage: 'Branch Page #2 (Disk Block: 0x02)',
    branchKeys: [10, 20],
    leafPage: 'Leaf Page #5 (Doubly-Linked with Page #4 and #6)',
    leafEntries: [
      { id: 12, block: 'Blk 3:2' },
      { id: 18, block: 'Blk 4:1' },
      { id: 25, block: 'Blk 6:4' },
    ],
    steps: [
      {
        level: 'Root',
        nodeId: 'Page #1 (Root Node)',
        keys: [30, 70],
        action: 'Compare 18 against Root Keys [30, 70]',
        description: '18 < 30. Follow pointer ptr_0 (< 30) down to Branch Page #2.'
      },
      {
        level: 'Branch',
        nodeId: 'Page #2 (Branch Node)',
        keys: [10, 20],
        action: 'Compare 18 against Branch Keys [10, 20]',
        description: '10 <= 18 < 20. Follow pointer ptr_1 (10 - 20) down to Leaf Page #5.'
      },
      {
        level: 'Leaf',
        nodeId: 'Page #5 (Leaf Node Page)',
        keys: [12, 18, 25],
        action: 'Scan Leaf Page entries',
        description: '🎯 EXACT MATCH: Key 18 found at Leaf Page #5! Extract (Block 4, Offset 1) heap pointer.'
      },
      {
        level: 'Heap',
        nodeId: 'Table Heap File (Block 4)',
        keys: [18],
        action: 'Fetch full row tuple payload',
        description: '✅ ROW RETRIEVED: { id: 18, name: "David", email: "david@test.com", created_at: "2026-02-14" } in 3 page reads!'
      }
    ]
  },
  45: {
    id: 45,
    name: 'Alice',
    email: 'alice@test.com',
    branchPage: 'Branch Page #3 (Disk Block: 0x03)',
    branchKeys: [40, 60],
    leafPage: 'Leaf Page #8 (Doubly-Linked with Page #7 and #9)',
    leafEntries: [
      { id: 41, block: 'Blk 11:1' },
      { id: 45, block: 'Blk 12:4' },
      { id: 52, block: 'Blk 14:2' },
    ],
    steps: [
      {
        level: 'Root',
        nodeId: 'Page #1 (Root Node)',
        keys: [30, 70],
        action: 'Compare 45 against Root Keys [30, 70]',
        description: '45 > 30 and 45 <= 70. Follow pointer ptr_1 (30 - 70) to Branch Page #3.'
      },
      {
        level: 'Branch',
        nodeId: 'Page #3 (Branch Node)',
        keys: [40, 60],
        action: 'Compare 45 against Branch Keys [40, 60]',
        description: '40 <= 45 <= 60. Follow pointer ptr_1 (40 - 60) to Leaf Page #8.'
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
        description: '✅ ROW RETRIEVED: { id: 45, name: "Alice", email: "alice@test.com", created_at: "2026-03-01" } in 3 page reads!'
      }
    ]
  },
  82: {
    id: 82,
    name: 'Grace',
    email: 'grace@test.com',
    branchPage: 'Branch Page #4 (Disk Block: 0x04)',
    branchKeys: [80, 90],
    leafPage: 'Leaf Page #11 (Doubly-Linked with Page #10 and #12)',
    leafEntries: [
      { id: 78, block: 'Blk 27:3' },
      { id: 82, block: 'Blk 29:1' },
      { id: 89, block: 'Blk 31:2' },
    ],
    steps: [
      {
        level: 'Root',
        nodeId: 'Page #1 (Root Node)',
        keys: [30, 70],
        action: 'Compare 82 against Root Keys [30, 70]',
        description: '82 > 70. Follow pointer ptr_2 (> 70) to Branch Page #4.'
      },
      {
        level: 'Branch',
        nodeId: 'Page #4 (Branch Node)',
        keys: [80, 90],
        action: 'Compare 82 against Branch Keys [80, 90]',
        description: '80 <= 82 < 90. Follow pointer ptr_1 (80 - 90) to Leaf Page #11.'
      },
      {
        level: 'Leaf',
        nodeId: 'Page #11 (Leaf Node Page)',
        keys: [78, 82, 89],
        action: 'Scan Leaf Page entries',
        description: '🎯 EXACT MATCH: Key 82 found at Leaf Page #11! Extract (Block 29, Offset 1) heap pointer.'
      },
      {
        level: 'Heap',
        nodeId: 'Table Heap File (Block 29)',
        keys: [82],
        action: 'Fetch full row tuple payload',
        description: '✅ ROW RETRIEVED: { id: 82, name: "Grace", email: "grace@test.com", created_at: "2026-04-10" } in 3 page reads!'
      }
    ]
  }
};

export function BTreeIndexVisualizer() {
  const [targetId, setTargetId] = useState<number>(45);
  const [stepIdx, setStepIdx] = useState<number>(0);

  const currentConfig = TARGET_CONFIGS[targetId] || TARGET_CONFIGS[45];
  const steps = currentConfig.steps;
  const currentStep = steps[stepIdx] || steps[0];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-muted-foreground">
              Physical Storage Engine
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              B+ Tree Index Traversal &amp; Leaf Page Stepper
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          Step {stepIdx + 1} of {steps.length} • O(log N) Point Lookup
        </span>
      </div>

      {/* Target Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground">Select Search Target ID:</span>
        <div className="flex flex-wrap gap-2">
          {([18, 45, 82] as const).map((id) => {
            const isSelected = targetId === id;
            const cfg = TARGET_CONFIGS[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTargetId(id);
                  setStepIdx(0);
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 ${
                  isSelected
                    ? 'bg-foreground text-background border-foreground font-bold shadow-xs'
                    : 'bg-muted/40 border-border hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                id = {id} ({cfg.name})
              </button>
            );
          })}
        </div>
      </div>

      {/* B+ Tree Visual Nodes Hierarchy */}
      <div className="p-6 rounded-2xl bg-zinc-950 text-zinc-100 dark:bg-black border border-border/80 space-y-4 font-mono text-xs shadow-inner">
        {/* Tier 1: Root Node */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          currentStep.level === 'Root' ? 'border-foreground/50 bg-zinc-900/90 shadow-xs' : 'border-zinc-800 bg-zinc-900/40 opacity-70'
        }`}>
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-zinc-800">
            <span className="text-zinc-200 font-bold">Root Page #1 (Disk Block: 0x01)</span>
            <span className="text-zinc-400">8 KB Page</span>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <span className={`p-1.5 px-3 rounded-lg border transition-all ${
              currentStep.level === 'Root' && targetId === 18 ? 'bg-foreground text-background font-bold shadow-xs' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}>
              ptr_0 (&lt; 30)
            </span>
            <span className="text-zinc-400 font-bold">[ Key: 30 ]</span>
            <span className={`p-1.5 px-3 rounded-lg border transition-all ${
              currentStep.level === 'Root' && targetId === 45 ? 'bg-foreground text-background font-bold shadow-xs' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}>
              ptr_1 (30 - 70)
            </span>
            <span className="text-zinc-400 font-bold">[ Key: 70 ]</span>
            <span className={`p-1.5 px-3 rounded-lg border transition-all ${
              currentStep.level === 'Root' && targetId === 82 ? 'bg-foreground text-background font-bold shadow-xs' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}>
              ptr_2 (&gt; 70)
            </span>
          </div>
        </div>

        <div className="flex justify-center text-zinc-600">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 2: Branch Node */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          currentStep.level === 'Branch' ? 'border-foreground/50 bg-zinc-900/90 shadow-xs' : 'border-zinc-800 bg-zinc-900/40 opacity-70'
        }`}>
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-zinc-800">
            <span className="text-zinc-200 font-bold">{currentConfig.branchPage}</span>
            <span className="text-zinc-400">Internal Routing Page</span>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <span className="p-1.5 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400">ptr_0 (&lt; {currentConfig.branchKeys[0]})</span>
            <span className="text-zinc-300 font-bold">[ Key: {currentConfig.branchKeys[0]} ]</span>
            <span className={`p-1.5 px-3 rounded-lg border transition-all ${
              currentStep.level === 'Branch' ? 'bg-foreground text-background font-bold shadow-xs' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}>
              ptr_1 ({currentConfig.branchKeys[0]} - {currentConfig.branchKeys[1]})
            </span>
            <span className="text-zinc-300 font-bold">[ Key: {currentConfig.branchKeys[1]} ]</span>
            <span className="p-1.5 px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400">ptr_2 (&gt; {currentConfig.branchKeys[1]})</span>
          </div>
        </div>

        <div className="flex justify-center text-zinc-600">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 3: Leaf Pages (Linked List) */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          currentStep.level === 'Leaf' ? 'border-emerald-500/50 bg-zinc-900/90 shadow-xs' : 'border-zinc-800 bg-zinc-900/40 opacity-70'
        }`}>
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-zinc-800">
            <span className="text-zinc-200 font-bold">{currentConfig.leafPage}</span>
            <span className="text-zinc-400">Record Pointers</span>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            {currentConfig.leafEntries.map((ent, idx) => {
              const isMatch = ent.id === targetId;
              return (
                <React.Fragment key={ent.id}>
                  {idx > 0 && <span className="text-zinc-500">⇄</span>}
                  <span className={`p-1.5 px-3 rounded-lg border transition-all ${
                    isMatch && currentStep.level === 'Leaf'
                      ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 font-bold shadow-xs'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}>
                    [ id: {ent.id} ➔ {ent.block} ]
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Description & Stepper Controls */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-foreground font-mono space-y-1">
          <span className="text-foreground font-bold uppercase tracking-wider block">
            {currentStep.action}
          </span>
          <p className="text-muted-foreground">{currentStep.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setStepIdx(0)}
            className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition"
            title="Reset Stepper"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setStepIdx((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
            className="px-4 py-2 rounded-lg bg-foreground text-background hover:opacity-90 font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <span>{stepIdx < steps.length - 1 ? 'Next Step' : 'Restart Stepper'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
