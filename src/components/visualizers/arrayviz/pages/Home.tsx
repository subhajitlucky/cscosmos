'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Box, Cpu, HardDrive, Hash, HelpCircle, Layers, LayoutGrid, Play, Search, Server, Sparkles, Terminal, Waves, Zap } from 'lucide-react';
import { ContiguousMemoryVisualizer } from '../components/ContiguousMemoryVisualizer';
import { CacheLocalityVisualizer } from '../components/CacheLocalityVisualizer';
import { DynamicArrayResizingVisualizer } from '../components/DynamicArrayResizingVisualizer';
import { SlidingWindowVisualizer } from '../components/SlidingWindowVisualizer';
import { DutchNationalFlagVisualizer } from '../components/DutchNationalFlagVisualizer';
import { MonotonicStackVisualizer } from '../components/MonotonicStackVisualizer';
import { KmpPatternVisualizer } from '../components/KmpPatternVisualizer';
import { RabinKarpRollingHashVisualizer } from '../components/RabinKarpRollingHashVisualizer';
import { ManacherVisualizer } from '../components/ManacherVisualizer';
import { ArrayPlayground } from '../components/ArrayPlayground';

export default function Home() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Hardware Memory &amp; String Algorithms Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master <span className="text-emerald-600 dark:text-emerald-400">Array Memory &amp; Strings</span>.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Interactive visualizers for physical contiguous RAM pointer arithmetic, 64-byte CPU cache lines, dynamic geometric doubling, sliding window two-pointers, Dutch National Flag 3-way partitioning, Monotonic stacks, KMP LPS pattern search, Rabin-Karp rolling hashes, and Manacher&apos;s O(N) palindromes.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/arrayviz/concepts"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore 20 Concepts
          </Link>
          <Link
            href="/arrayviz/playground"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> DSA Sandbox
          </Link>
        </div>
      </div>

      {/* Feature 1: Contiguous RAM Memory Pointer Arithmetic */}
      <ContiguousMemoryVisualizer />

      {/* Feature 2: 64-Byte CPU Cache Line Spatial Locality */}
      <CacheLocalityVisualizer />

      {/* Feature 3: Dynamic Array Geometric Doubling */}
      <DynamicArrayResizingVisualizer />

      {/* Feature 4: Sliding Window Subarray Stepper */}
      <SlidingWindowVisualizer />

      {/* Feature 5: Dutch National Flag 3-Way Partitioning */}
      <DutchNationalFlagVisualizer />

      {/* Feature 6: Monotonic Decreasing Stack */}
      <MonotonicStackVisualizer />

      {/* Feature 7: KMP Pattern Matching & LPS Table */}
      <KmpPatternVisualizer />

      {/* Feature 8: Rabin-Karp Polynomial Rolling Hash */}
      <RabinKarpRollingHashVisualizer />

      {/* Feature 9: Manacher's O(N) Palindromic Substring Finder */}
      <ManacherVisualizer />

      {/* Feature 10: Interactive DSA Sandbox */}
      <ArrayPlayground />

      {/* Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/arrayviz/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            20 In-Depth Lessons
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Kadane algorithm, Dutch National Flag, Manacher palindrome search, Aho-Corasick, and UTF-8 encoding.
          </p>
        </Link>

        <Link
          href="/arrayviz/cache-lab"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            CPU Cache Lab
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Inspect L1/L2 cache hit vs miss latency differences between Row-Major and Column-Major loops.
          </p>
        </Link>

        <Link
          href="/arrayviz/flashcards"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            Senior Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Master tough DSA &amp; Systems interview questions on pointer math, amortized aggregate method, and KMP.
          </p>
        </Link>
      </div>
    </div>
  );
}
