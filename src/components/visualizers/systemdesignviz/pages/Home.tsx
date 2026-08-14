'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, BookOpen, Calculator, Database, Gauge, GitFork, HelpCircle, Layers, Network, Server, Sparkles, Terminal, Zap } from 'lucide-react';
import { ConsistentHashingVisualizer } from '../components/ConsistentHashingVisualizer';
import { RaftConsensusVisualizer } from '../components/RaftConsensusVisualizer';
import { RateLimiterVisualizer } from '../components/RateLimiterVisualizer';
import { CapTheoremVisualizer } from '../components/CapTheoremVisualizer';
import { DatabaseShardingVisualizer } from '../components/DatabaseShardingVisualizer';
import { CachePatternsVisualizer } from '../components/CachePatternsVisualizer';
import { CapacityCalculator } from '../components/CapacityCalculator';

export default function Home() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> High-Scale Distributed Systems Architecture Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master <span className="text-indigo-600 dark:text-indigo-400">System Design &amp; Scale</span>.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Interactive visualizers for Consistent Hashing rings, Raft consensus leader elections, distributed Token/Leaky bucket rate limiters, CAP Theorem network partitions, horizontal database sharding, and back-of-the-envelope capacity estimations.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/systemdesignviz/concepts"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore 20 Concepts
          </Link>
          <Link
            href="/systemdesignviz/calculator-lab"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" /> Capacity Calculator
          </Link>
        </div>
      </div>

      {/* Feature 1: Consistent Hashing & Virtual Nodes */}
      <ConsistentHashingVisualizer />

      {/* Feature 2: Raft Consensus Leader Election & Quorum */}
      <RaftConsensusVisualizer />

      {/* Feature 3: Distributed Rate Limiting Engines */}
      <RateLimiterVisualizer />

      {/* Feature 4: CAP Theorem Network Partition Simulator */}
      <CapTheoremVisualizer />

      {/* Feature 5: Database Sharding & Shard Key Routing */}
      <DatabaseShardingVisualizer />

      {/* Feature 6: Cache-Aside vs Write-Through Patterns */}
      <CachePatternsVisualizer />

      {/* Feature 7: Back-of-the-Envelope Scale Calculator */}
      <CapacityCalculator />

      {/* Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/systemdesignviz/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-indigo-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">
            20 In-Depth Lessons
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Write-Ahead Logs, Circuit Breakers, Bulkheads, Kafka consumer partitions, XFetch early expiration, and PACELC.
          </p>
        </Link>

        <Link
          href="/systemdesignviz/raft-lab"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-indigo-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <GitFork className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">
            Raft Consensus Lab
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Kill leaders, simulate heartbeats, trigger candidate elections, and verify quorum log replication.
          </p>
        </Link>

        <Link
          href="/systemdesignviz/flashcards"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-indigo-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">
            Staff Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Master tough FAANG Staff Architect interview questions on quorum math, XFetch proofs, and WAL crash recovery.
          </p>
        </Link>
      </div>
    </div>
  );
}
