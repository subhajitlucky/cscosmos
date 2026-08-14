'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Radio, Sparkles, Activity, Layers, Zap, ArrowUpRight, CheckCircle2, ShieldAlert, Cpu, Server } from 'lucide-react';
import { mqTopics } from '../data/topics';

export function Home() {
  const [activePartition, setActivePartition] = useState<number>(0);
  const [producedCount, setProducedCount] = useState<number>(4);
  const [consumerOffset, setConsumerOffset] = useState<number>(3);
  const [streamSpeed, setStreamSpeed] = useState<'normal' | 'fast'>('normal');

  const produceMessage = () => {
    setProducedCount(c => c + 1);
    setActivePartition(p => (p + 1) % 3);
  };

  const consumeMessage = () => {
    setConsumerOffset(o => Math.min(producedCount, o + 1));
  };

  const lag = Math.max(0, producedCount - consumerOffset);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="mq-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--mq-primary)]/30 bg-[var(--mq-primary)]/10 text-[var(--mq-primary)] text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[var(--mq-primary)]" />
              Event Streaming &amp; Commit Log Engine
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--mq-text)]">
              Decouple. Buffer.<br />
              <span className="text-[var(--mq-primary)] mq-glow">Stream Millions</span> of Events.
            </h1>

            <p className="text-base md:text-lg text-[var(--mq-muted)] max-w-xl leading-relaxed">
              Deconstruct distributed message brokers from the inside out. Explore partition hashing, OS PageCache Zero-Copy, consumer group rebalancing, and dead-letter retry policies.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/mqviz/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--mq-primary)] text-black font-semibold text-sm hover:bg-[var(--mq-primary-hover)] transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95"
              >
                Explore Concept Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/mqviz/stream-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--mq-border)] bg-[var(--mq-surface)] text-[var(--mq-text)] font-mono text-sm hover:border-[var(--mq-primary)] hover:text-[var(--mq-primary)] transition-all"
              >
                <Activity className="w-4 h-4 text-[var(--mq-primary)]" />
                Live Stream Lab
              </Link>

              <Link
                href="/mqviz/retries"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--mq-border-subtle)] bg-[var(--mq-surface-2)] text-[var(--mq-muted)] font-mono text-sm hover:text-[var(--mq-text)] transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-[var(--mq-rose)]" />
                Retry &amp; DLQ Lab
              </Link>
            </div>
          </div>

          {/* Right Live Interactive Message Broker Simulation */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--mq-border-subtle)] bg-[var(--mq-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-[var(--mq-muted)] ml-2">KafkaTopic::orders-v1</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--mq-emerald)]/10 text-[var(--mq-emerald)] border border-[var(--mq-emerald)]/30">
                  LEADER_UP
                </span>
              </div>

              <div className="p-6 font-mono text-xs space-y-6">
                {/* Partition Pipeline */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[var(--mq-muted)]">
                    <span>Partitions (Murmur2 Hash)</span>
                    <span className="text-[var(--mq-primary)] font-bold">Total Events: {producedCount}</span>
                  </div>

                  <div className="space-y-2">
                    {[0, 1, 2].map((pId) => {
                      const isTarget = activePartition === pId;
                      return (
                        <div
                          key={pId}
                          className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                            isTarget
                              ? 'border-[var(--mq-primary)] bg-[var(--mq-primary)]/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                              : 'border-[var(--mq-border-subtle)] bg-[var(--mq-bg)] opacity-70'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Server className="w-3.5 h-3.5 text-[var(--mq-primary)]" />
                            <span className="font-bold text-[var(--mq-text)]">Partition-0{pId}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-[var(--mq-muted)]">
                            <span>Offset: {pId === activePartition ? producedCount : 2}</span>
                            {isTarget && <span className="w-2 h-2 rounded-full bg-[var(--mq-primary)] animate-ping" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Consumer Lag Gauge */}
                <div className="p-4 rounded-xl bg-[var(--mq-bg)] border border-[var(--mq-border-subtle)] space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--mq-muted)] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[var(--mq-cyan)]" /> Consumer Group: payment-svc
                    </span>
                    <span className={`font-bold font-mono ${lag > 2 ? 'text-[var(--mq-rose)]' : 'text-[var(--mq-emerald)]'}`}>
                      Lag: {lag} msgs
                    </span>
                  </div>

                  <div className="w-full bg-[var(--mq-surface-2)] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[var(--mq-cyan)] h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (consumerOffset / Math.max(1, producedCount)) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Interactive Controls */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={produceMessage}
                    className="px-4 py-2.5 rounded-lg bg-[var(--mq-primary)] text-black font-semibold text-xs hover:bg-[var(--mq-primary-hover)] transition-all shadow-md active:scale-95"
                  >
                    + Publish Message
                  </button>
                  <button
                    onClick={consumeMessage}
                    className="px-4 py-2.5 rounded-lg border border-[var(--mq-cyan)] bg-[var(--mq-cyan)]/10 text-[var(--mq-cyan)] font-mono text-xs hover:bg-[var(--mq-cyan)]/20 transition-all"
                  >
                    ✓ Consume &amp; Commit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: RabbitMQ vs Kafka */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--mq-primary)] uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Broker Topology Matrix
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--mq-text)]">
            Traditional Queues vs Append-Only Commit Logs
          </h2>
          <p className="text-sm text-[var(--mq-muted)]">
            Choose the right architecture: transient work dispatch or persistent replayable event streams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Queue card */}
          <div className="p-8 rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--mq-text)]">Point-to-Point Work Queue</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                RabbitMQ / SQS
              </span>
            </div>
            <p className="text-xs text-[var(--mq-muted)] leading-relaxed">
              Messages are transient work items. Once consumed and acknowledged, the message is permanently deleted from the broker memory and disk.
            </p>
            <div className="p-4 rounded-lg bg-[var(--mq-bg)] font-mono text-[11px] text-[var(--mq-muted)] space-y-2 border border-[var(--mq-border-subtle)]">
              <div>• Messages deleted immediately upon Ack</div>
              <div>• Competing workers pull from single queue</div>
              <div>• Rich complex routing keys and exchange bindings</div>
              <div>• Cannot rewind or replay past messages</div>
            </div>
          </div>

          {/* Append-Only Commit Log card */}
          <div className="p-8 rounded-2xl border-2 border-[var(--mq-primary)]/40 bg-[var(--mq-surface)] space-y-6 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--mq-text)]">Distributed Commit Log</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--mq-primary)]/10 text-[var(--mq-primary)] border border-[var(--mq-primary)]/30 font-bold">
                Apache Kafka / Redpanda
              </span>
            </div>
            <p className="text-xs text-[var(--mq-muted)] leading-relaxed">
              Messages are written to an immutable sequential on-disk ledger. Multiple independent consumer groups read at their own pace and can rewind to replay history.
            </p>
            <div className="p-4 rounded-lg bg-[var(--mq-bg)] font-mono text-[11px] text-[var(--mq-muted)] space-y-2 border border-[var(--mq-primary)]/20">
              <div className="text-[var(--mq-primary)]">• Immutable append-only sequential disk writes</div>
              <div className="text-[var(--mq-cyan)]">• Millions of ops/sec via OS PageCache &amp; Zero-Copy</div>
              <div className="text-[var(--mq-emerald)]">• Time-travel offset replay &amp; event sourcing</div>
              <div className="text-[var(--mq-text)]">• Linear horizontal scaling across partitions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--mq-border-subtle)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--mq-primary)] uppercase tracking-wider">
              Architecture Tracks
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--mq-text)] mt-1">
              Curriculum Deep Dives
            </h2>
          </div>
          <Link
            href="/mqviz/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--mq-primary)] hover:underline"
          >
            View all 10 topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mqTopics.slice(0, 6).map((topic) => (
            <Link
              key={topic.id}
              href={`/mqviz/learn/${topic.id}`}
              className="mq-card p-6 rounded-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mq-primary)]">
                  {topic.kicker}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--mq-muted)] group-hover:text-[var(--mq-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--mq-text)] group-hover:text-[var(--mq-primary)] transition-colors">
                {topic.title}
              </h3>

              <p className="text-xs text-[var(--mq-muted)] leading-relaxed line-clamp-2">
                {topic.summary}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--mq-border-subtle)] text-[var(--mq-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--mq-muted)]">
                  {topic.group}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
