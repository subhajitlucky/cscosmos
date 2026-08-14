'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Database, HardDrive, HelpCircle, Layers, Play, RefreshCw, Server, Sparkles, Terminal, Trophy, Zap } from 'lucide-react';
import { DataStructuresLab } from '../components/DataStructuresLab';
import { CachingStrategiesLab } from '../components/CachingStrategiesLab';
import { EvictionSimulator } from '../components/EvictionSimulator';
import { RedisCliPlayground } from '../components/RedisCliPlayground';

export default function Home() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Redis In-Memory Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master the <span className="text-red-600 dark:text-red-400">Redis</span> Architecture.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Explore in-memory data structures (SDS, SkipLists, QuickLists), enterprise caching patterns (Cache-Aside, Write-Through), memory eviction policies, and live CLI execution.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/redisviz/concepts"
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> 18 Core Concepts
          </Link>
          <Link
            href="/redisviz/playground"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> Web CLI Terminal
          </Link>
        </div>
      </div>

      {/* Feature 1: In-Memory Data Structures Lab */}
      <DataStructuresLab />

      {/* Feature 2: Enterprise Caching Strategies */}
      <CachingStrategiesLab />

      {/* Feature 3: Eviction Simulator */}
      <EvictionSimulator />

      {/* Feature 4: Interactive CLI Playground */}
      <RedisCliPlayground />

      {/* Quick Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/redisviz/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-red-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-red-500 transition-colors">
            18 In-Depth Lessons
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mental models, complexity analysis, architecture takeaways, and production pitfall warnings.
          </p>
        </Link>

        <Link
          href="/redisviz/persistence"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-red-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-red-500 transition-colors">
            RDB &amp; AOF Persistence
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Compare binary snapshotting via Linux fork() against stream logging with fsync policies.
          </p>
        </Link>

        <Link
          href="/redisviz/flashcards"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-red-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-red-500 transition-colors">
            Senior Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Master tricky Redis interview questions covering single-threading, SkipLists, and Cache Avalanche.
          </p>
        </Link>
      </div>
    </div>
  );
}
