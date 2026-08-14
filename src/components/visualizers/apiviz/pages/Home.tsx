'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Database, GitBranch, Globe, HelpCircle, Layers, Lock, Play, Server, Sparkles, Terminal, Zap } from 'lucide-react';
import { GraphqlResolverVisualizer } from '../components/GraphqlResolverVisualizer';
import { DataLoaderVisualizer } from '../components/DataLoaderVisualizer';
import { ProtocolComparisonVisualizer } from '../components/ProtocolComparisonVisualizer';
import { IdempotencyKeyVisualizer } from '../components/IdempotencyKeyVisualizer';
import { ApiPlayground } from '../components/ApiPlayground';

export default function Home() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Modern API Design &amp; GraphQL Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master <span className="text-pink-600 dark:text-pink-400">REST, GraphQL &amp; gRPC</span>.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Interactive visualizers for GraphQL AST field resolvers, DataLoader N+1 query batching, REST vs GraphQL vs gRPC vs tRPC tradeoffs, Idempotency-Key safe retries, and API sandboxes.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/apiviz/concepts"
            className="px-6 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-pink-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore 20 Concepts
          </Link>
          <Link
            href="/apiviz/playground"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> API Sandbox
          </Link>
        </div>
      </div>

      {/* Feature 1: GraphQL Field Resolver Pipeline */}
      <GraphqlResolverVisualizer />

      {/* Feature 2: DataLoader N+1 Problem Simulator */}
      <DataLoaderVisualizer />

      {/* Feature 3: Protocol Matrix */}
      <ProtocolComparisonVisualizer />

      {/* Feature 4: Idempotency Key Engine */}
      <IdempotencyKeyVisualizer />

      {/* Feature 5: Interactive Sandbox */}
      <ApiPlayground />

      {/* Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/apiviz/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-pink-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-pink-500 transition-colors">
            20 In-Depth Lessons
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Apollo Federation, OpenAPI specs, Keyset pagination, HMAC webhooks, Subscriptions, and RFC 7807 error formats.
          </p>
        </Link>

        <Link
          href="/apiviz/dataloader-lab"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-pink-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-pink-500 transition-colors">
            DataLoader Lab
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Inspect how microtask batching reduces 11 database queries down to strictly 2 SQL queries.
          </p>
        </Link>

        <Link
          href="/apiviz/flashcards"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-pink-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-pink-500 transition-colors">
            Senior Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Master tough API Architect interview questions on idempotency locks, cursor pagination, and Protobuf.
          </p>
        </Link>
      </div>
    </div>
  );
}
