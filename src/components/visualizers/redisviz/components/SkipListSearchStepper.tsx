'use client';

'use client';

import React, { useState } from 'react';
import { ArrowDown, ArrowRight, CheckCircle2, ChevronRight, Play, RotateCcw, Search, Sparkles, Trophy } from 'lucide-react';

interface Step {
  level: number;
  nodeScore: number | 'HEAD';
  action: 'forward' | 'down' | 'found' | 'start';
  description: string;
}

export function SkipListSearchStepper() {
  const [targetScore, setTargetScore] = useState<number>(1850);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  // Pre-calculated step paths for standard targets
  const getSearchSteps = (target: number): Step[] => {
    if (target === 1850) {
      return [
        { level: 2, nodeScore: 'HEAD', action: 'start', description: 'Start at top layer (Level 2) at HEAD node.' },
        { level: 2, nodeScore: 2400, action: 'forward', description: 'Inspect Level 2 next node: Score 2400 > 1850 (Too far!). Cannot jump forward.' },
        { level: 1, nodeScore: 'HEAD', action: 'down', description: 'Drop down one tier to Level 1 at HEAD node.' },
        { level: 1, nodeScore: 1850, action: 'forward', description: 'Inspect Level 1 next node: Score 1850 == 1850. Exact Match Found!' },
        { level: 1, nodeScore: 1850, action: 'found', description: '🎯 SUCCESS: Node located in just 3 pointer inspections (O(log N) efficiency).' },
      ];
    } else if (target === 2400) {
      return [
        { level: 2, nodeScore: 'HEAD', action: 'start', description: 'Start at top layer (Level 2) at HEAD node.' },
        { level: 2, nodeScore: 2400, action: 'forward', description: 'Inspect Level 2 next node: Score 2400 == 2400. Direct Express Jump!' },
        { level: 2, nodeScore: 2400, action: 'found', description: '🎯 SUCCESS: Express lane reached target in a single hop!' },
      ];
    } else {
      // 1500
      return [
        { level: 2, nodeScore: 'HEAD', action: 'start', description: 'Start at top layer (Level 2) at HEAD node.' },
        { level: 2, nodeScore: 2400, action: 'forward', description: 'Level 2 next node (2400) > 1500. Drop to Level 1.' },
        { level: 1, nodeScore: 'HEAD', action: 'down', description: 'At Level 1: next node is 1850 > 1500. Drop to Level 0.' },
        { level: 0, nodeScore: 1500, action: 'forward', description: 'At Level 0 (local train): jump to node 1500. Exact Match!' },
        { level: 0, nodeScore: 1500, action: 'found', description: '🎯 SUCCESS: Node located in O(log N) search time.' },
      ];
    }
  };

  const steps = getSearchSteps(targetScore);
  const currentStep = steps[currentStepIdx] || steps[0];

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handleReset = (target: number) => {
    setTargetScore(target);
    setCurrentStepIdx(0);
  };

  return (
    <div className="rounded-3xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-purple-600 dark:text-purple-400">
              Sorted Set (ZSET) Algorithms
            </div>
            <h3 className="text-xl font-bold text-foreground">
              SkipList $O(\log N)$ Multi-Level Search Stepper
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">
          Step {currentStepIdx + 1} of {steps.length}
        </span>
      </div>

      {/* Target Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground">Search Target Score:</span>
        {[1500, 1850, 2400].map((score) => (
          <button
            key={score}
            onClick={() => handleReset(score)}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              targetScore === score
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-card border border-border text-foreground hover:border-purple-500'
            }`}
          >
            Score: {score}
          </button>
        ))}
      </div>

      {/* Visual Multi-Level SkipList Railway */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Active Layer: Level {currentStep.level}</span>
          <span className="text-purple-400 font-bold">Target Score: {targetScore}</span>
        </div>

        {/* Level 2 (Express Lane) */}
        <div className={`p-3 rounded-xl border transition-all ${
          currentStep.level === 2 ? 'border-purple-500 bg-purple-500/10 shadow-md' : 'border-slate-800 bg-slate-900/40 opacity-50'
        }`}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-purple-400 font-bold w-16">Level 2:</span>
            <div className="flex-1 flex items-center justify-between px-4">
              <span className={`px-2 py-1 rounded ${currentStep.level === 2 && currentStep.nodeScore === 'HEAD' ? 'bg-purple-600 text-white font-bold animate-pulse' : 'bg-slate-800 text-slate-400'}`}>[HEAD]</span>
              <span className="text-slate-600">────────────────────────────────────►</span>
              <span className={`px-2 py-1 rounded ${currentStep.level === 2 && currentStep.nodeScore === 2400 ? 'bg-purple-600 text-white font-bold animate-pulse' : 'bg-slate-800 text-slate-400'}`}>[2400]</span>
              <span className="text-slate-600">──► NULL</span>
            </div>
          </div>
        </div>

        {/* Level 1 (Semi-Express Lane) */}
        <div className={`p-3 rounded-xl border transition-all ${
          currentStep.level === 1 ? 'border-cyan-500 bg-cyan-500/10 shadow-md' : 'border-slate-800 bg-slate-900/40 opacity-50'
        }`}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-cyan-400 font-bold w-16">Level 1:</span>
            <div className="flex-1 flex items-center justify-between px-4">
              <span className={`px-2 py-1 rounded ${currentStep.level === 1 && currentStep.nodeScore === 'HEAD' ? 'bg-cyan-600 text-white font-bold animate-pulse' : 'bg-slate-800 text-slate-400'}`}>[HEAD]</span>
              <span className="text-slate-600">──────────────►</span>
              <span className={`px-2 py-1 rounded ${currentStep.level === 1 && currentStep.nodeScore === 1850 ? 'bg-cyan-600 text-white font-bold animate-pulse' : 'bg-slate-800 text-slate-400'}`}>[1850]</span>
              <span className="text-slate-600">──────────────►</span>
              <span className={`px-2 py-1 rounded ${currentStep.level === 1 && currentStep.nodeScore === 2400 ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>[2400]</span>
              <span className="text-slate-600">──► NULL</span>
            </div>
          </div>
        </div>

        {/* Level 0 (Local Train - All Nodes) */}
        <div className={`p-3 rounded-xl border transition-all ${
          currentStep.level === 0 ? 'border-emerald-500 bg-emerald-500/10 shadow-md' : 'border-slate-800 bg-slate-900/40 opacity-50'
        }`}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold w-16">Level 0:</span>
            <div className="flex-1 flex items-center justify-between px-4">
              <span className={`px-2 py-1 rounded ${currentStep.level === 0 && currentStep.nodeScore === 'HEAD' ? 'bg-emerald-600 text-white font-bold animate-pulse' : 'bg-slate-800 text-slate-400'}`}>[HEAD]</span>
              <span className="text-slate-600">──►</span>
              <span className={`px-2 py-1 rounded ${currentStep.level === 0 && currentStep.nodeScore === 1500 ? 'bg-emerald-600 text-white font-bold animate-pulse' : 'bg-slate-800 text-slate-400'}`}>[1500]</span>
              <span className="text-slate-600">──►</span>
              <span className={`px-2 py-1 rounded ${currentStep.level === 0 && currentStep.nodeScore === 1850 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>[1850]</span>
              <span className="text-slate-600">──►</span>
              <span className={`px-2 py-1 rounded ${currentStep.level === 0 && currentStep.nodeScore === 2400 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>[2400]</span>
              <span className="text-slate-600">──► NULL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Description & Controls */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-foreground font-mono space-y-1">
          <span className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block">
            Step Narration:
          </span>
          <p className="text-sm font-medium">{currentStep.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentStepIdx(0)}
            className="p-2.5 rounded-xl border border-border hover:bg-muted text-foreground transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIdx >= steps.length - 1}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
