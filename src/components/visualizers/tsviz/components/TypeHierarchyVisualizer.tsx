'use client';

import React, { useState } from 'react';
import { ArrowDown, Layers, Sparkles } from 'lucide-react';

interface TypeLevel {
  name: string;
  role: string;
  types: string[];
  color: string;
  description: string;
}

const HIERARCHY: TypeLevel[] = [
  {
    name: 'Top Types',
    role: 'Supertype of all types in TypeScript',
    types: ['unknown (Type-Safe)', 'any (Unsound Escape Hatch)'],
    color: 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300',
    description: 'Every value in JavaScript is assignable to unknown and any. However, unknown requires type narrowing before you can operate on it.'
  },
  {
    name: 'Broad Object & Primitive Kinds',
    role: 'Standard categorized representations',
    types: ['Object', 'string', 'number', 'boolean', 'symbol', 'bigint'],
    color: 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300',
    description: 'Wider primitive types and structural object shapes.'
  },
  {
    name: 'Literal Subtypes & Tuples',
    role: 'Exact finite values and shapes',
    types: ['"active" | "error"', '42', 'true', '[string, number]'],
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    description: 'Narrowed singletons and readonly tuples produced by "as const" or literal assignments.'
  },
  {
    name: 'Bottom Type',
    role: 'Subtype of all types (Empty Set ∅)',
    types: ['never (Unreachable / Incompatible)'],
    color: 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    description: 'The bottom type containing 0 possible values. Used for exhaustive switch checking and unreachable code branches.'
  }
];

export function TypeHierarchyVisualizer() {
  const [selectedLevel, setSelectedLevel] = useState<TypeLevel>(HIERARCHY[0]);

  return (
    <div className="rounded-3xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-blue-600 dark:text-blue-400">
              Type Theory Visualizer
            </div>
            <h3 className="text-xl font-bold text-foreground">
              The TypeScript Type Hierarchy Lattice (Top to Bottom)
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold">
          Top: unknown ➔ Bottom: never
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Hierarchy Ladder */}
        <div className="space-y-3">
          {HIERARCHY.map((lvl, idx) => (
            <React.Fragment key={lvl.name}>
              <button
                onClick={() => setSelectedLevel(lvl)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between shadow-sm ${
                  selectedLevel.name === lvl.name
                    ? `${lvl.color} font-bold scale-[1.02] shadow-md`
                    : 'bg-card border-border text-foreground hover:border-blue-500'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold uppercase tracking-wider">{lvl.name}</div>
                  <div className="text-xs font-mono">{lvl.types.join(', ')}</div>
                </div>
                <span className="text-[10px] font-mono opacity-70">Level {idx + 1}</span>
              </button>
              {idx < HIERARCHY.length - 1 && (
                <div className="flex justify-center text-muted-foreground">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right: Selected Level Explanation */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Tier Analysis:
            </span>
            <h4 className="text-lg font-bold text-foreground">{selectedLevel.name}</h4>
            <div className="text-xs font-mono text-muted-foreground">{selectedLevel.role}</div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed pt-2">
              {selectedLevel.description}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs space-y-1">
            <span className="text-slate-400 text-[11px]">Representative Member Types:</span>
            <div className="text-emerald-400 font-bold">{selectedLevel.types.join(' • ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
