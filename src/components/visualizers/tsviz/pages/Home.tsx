'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Bug, Code2, Cpu, Filter, Layers, Sparkles, Trophy, Wrench, Zap } from 'lucide-react';
import { TypeNarrowingStepper } from '../components/TypeNarrowingStepper';
import { StructuralAssignabilityLab } from '../components/StructuralAssignabilityLab';
import { SatisfiesVsAsLab } from '../components/SatisfiesVsAsLab';
import { TypeHierarchyVisualizer } from '../components/TypeHierarchyVisualizer';
import { BrandedTypesLab } from '../components/BrandedTypesLab';
import { UtilityTypesLab } from '../components/UtilityTypesLab';

export default function Home() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Complete TypeScript 5.x Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master the <span className="text-blue-600 dark:text-blue-400">TypeScript</span> Type System.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Interactive engines for structural subtyping, control flow type narrowing, the satisfies operator, branded nominal types, and compiler AST pipelines.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/tsviz/concepts"
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore 22 Concepts
          </Link>
          <Link
            href="/tsviz/utility-lab"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" /> Utility Types Lab
          </Link>
        </div>
      </div>

      {/* Feature 1: Type Narrowing Stepper */}
      <TypeNarrowingStepper />

      {/* Feature 2: satisfies vs as Lab */}
      <SatisfiesVsAsLab />

      {/* Feature 3: Type Hierarchy Tree */}
      <TypeHierarchyVisualizer />

      {/* Feature 4: Branded / Nominal Types Lab */}
      <BrandedTypesLab />

      {/* Feature 5: Structural Subtyping & Assignability Lab */}
      <StructuralAssignabilityLab />

      {/* Feature 6: Standard Utility Types Lab */}
      <UtilityTypesLab />

      {/* Quick Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/tsviz/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-blue-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors">
            22 Core Concepts
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Deep-dive lessons with mental models, runnable snippets, takeaways, and common pitfalls.
          </p>
        </Link>

        <Link
          href="/tsviz/compiler-pipeline"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            TSC Compiler Pipeline
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Trace the 5-stage architecture from Scanner tokens and AST parsing to Type Checker diagnostics.
          </p>
        </Link>

        <Link
          href="/tsviz/errors"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-rose-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Bug className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-rose-500 transition-colors">
            Type Error Debugger
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Demystify cryptic errors like TS2322, TS2339, TS2571, and TS7053 with side-by-side solutions.
          </p>
        </Link>
      </div>
    </div>
  );
}
