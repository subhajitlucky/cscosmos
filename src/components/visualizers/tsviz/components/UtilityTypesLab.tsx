'use client';

import React, { useState } from 'react';
import { CheckCircle2, Code2, Sparkles, Wand2, Wrench } from 'lucide-react';
import { UTILITY_TYPES, type UtilityTypeDoc } from '../data/utility-types';

export function UtilityTypesLab() {
  const [selectedUtility, setSelectedUtility] = useState<UtilityTypeDoc>(UTILITY_TYPES[0]);

  return (
    <div className="rounded-3xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-purple-600 dark:text-purple-400">
              Interactive Type Transformation Sandbox
            </div>
            <h3 className="text-xl font-bold text-foreground">
              TypeScript Standard Utility Types Lab
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">
          Category: {selectedUtility.category}
        </span>
      </div>

      {/* Utility Type Chip Selector */}
      <div className="flex flex-wrap gap-2">
        {UTILITY_TYPES.map((util) => (
          <button
            key={util.id}
            onClick={() => setSelectedUtility(util)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
              selectedUtility.id === util.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-card border border-border text-foreground hover:border-purple-500'
            }`}
          >
            {util.name}
          </button>
        ))}
      </div>

      {/* Main Transform View */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Input Type & Definition */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" /> Description &amp; Utility Purpose
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {selectedUtility.description}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner space-y-2">
            <span className="text-slate-400 text-[11px] block border-b border-slate-800 pb-1.5">
              Underlying TypeScript Definition:
            </span>
            <pre className="text-purple-300 overflow-x-auto whitespace-pre-wrap">
              {selectedUtility.definition}
            </pre>
          </div>
        </div>

        {/* Right: Transformation Output */}
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-slate-400 text-[11px] block border-b border-slate-800 pb-1.5">
              Input Base Type:
            </span>
            <pre className="text-slate-300 whitespace-pre-wrap">{selectedUtility.exampleInput}</pre>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <span className="text-emerald-400 text-[11px] block font-bold">
              Transformed Type Output ({selectedUtility.name}):
            </span>
            <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
              {selectedUtility.exampleOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
