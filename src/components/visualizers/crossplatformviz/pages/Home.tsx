'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Smartphone,
  Activity,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  RotateCcw,
  Play,
  Zap,
  Cpu,
  Table,
  Sliders,
  BookOpen,
  Compass,
  MonitorPlay,
  CheckCircle
} from 'lucide-react';
import { crossPlatformTopics, crossPlatformTopicGroups } from '../data/topics';

export function Home() {
  const [selectedArch, setSelectedArch] = useState<'legacy' | 'jsi' | 'flutter'>('jsi');
  const [isSimulating, setIsSimulating] = useState(false);
  const [packetCount, setPacketCount] = useState(0);
  const [droppedFrames, setDroppedFrames] = useState(0);
  const [fps, setFps] = useState(60);

  const runSimulation = () => {
    setIsSimulating(true);
    setPacketCount(0);
    setDroppedFrames(0);
    setFps(60);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setPacketCount(count * 5);

      if (selectedArch === 'legacy') {
        setDroppedFrames(prev => prev + Math.floor(Math.random() * 3) + 1);
        setFps(f => Math.max(32, f - 3));
      } else if (selectedArch === 'jsi') {
        setFps(60);
      } else {
        setFps(120);
      }

      if (count >= 10) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 140);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--cp-border)] bg-[var(--cp-surface-2)] text-[var(--cp-primary)] text-xs font-mono font-medium">
              <Smartphone className="w-3.5 h-3.5 text-[var(--cp-primary)]" />
              <span>Mobile Systems Architecture &bull; 14 Interactive Topics</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-[var(--cp-text)]">
              Zero Serialization.<br />
              <span className="text-[var(--cp-primary)]">Direct C++ Pointers.</span><br />
              120 FPS Canvas.
            </h1>

            <p className="text-base md:text-lg text-[var(--cp-muted)] max-w-xl leading-relaxed">
              Understand how modern cross-platform runtimes eliminate bridge latency. Learn the engineering behind React Native JSI C++ HostObjects, Fabric immutable shadow trees, Flutter Impeller GPU shaders, and Kotlin Multiplatform LLVM binaries.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/crossplatformviz/learn"
                className="cp-btn-primary"
              >
                Explore 14 Topics <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/crossplatformviz/bridge-sim"
                className="cp-btn-secondary"
              >
                <Activity className="w-4 h-4 text-[var(--cp-primary)]" />
                Bridge vs JSI Lab
              </Link>

              <Link
                href="/crossplatformviz/engine-matrix"
                className="cp-btn-secondary"
              >
                <Table className="w-4 h-4 text-[var(--cp-sky)]" />
                Engine Matrix
              </Link>
            </div>

            {/* Quick Metrics Badge Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--cp-border)] max-w-lg font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[var(--cp-muted)] text-[10px]">Curriculum</span>
                <p className="font-bold text-[var(--cp-text)]">4 Progressive Stages</p>
              </div>
              <div className="space-y-1">
                <span className="text-[var(--cp-muted)] text-[10px]">Learning Path</span>
                <p className="font-bold text-[var(--cp-primary)]">Basic &rarr; Advanced</p>
              </div>
              <div className="space-y-1">
                <span className="text-[var(--cp-muted)] text-[10px]">Interactive</span>
                <p className="font-bold text-[var(--cp-emerald)]">Quizzes &amp; Sims</p>
              </div>
            </div>
          </div>

          {/* Right Live Architecture Simulator */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--cp-border)] bg-[var(--cp-surface)] overflow-hidden font-mono text-xs shadow-sm">
              <div className="px-4 py-3 border-b border-[var(--cp-border)] bg-[var(--cp-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--cp-rose)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--cp-amber)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--cp-emerald)]" />
                  <span className="text-xs text-[var(--cp-muted)] ml-2 font-bold">Runtime::PipelineSimulator</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                  fps >= 60
                    ? 'border-[var(--cp-emerald-border)] bg-[var(--cp-emerald-bg)] text-[var(--cp-emerald)]'
                    : 'border-[var(--cp-rose-border)] bg-[var(--cp-rose-bg)] text-[var(--cp-rose)]'
                }`}>
                  {fps} FPS
                </span>
              </div>

              <div className="p-6 space-y-6">
                {/* Architecture Selector Tabs */}
                <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[var(--cp-surface-2)] border border-[var(--cp-border)]">
                  {[
                    ['legacy', 'Legacy Bridge'],
                    ['jsi', 'RN JSI / Fabric'],
                    ['flutter', 'Flutter Impeller'],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => {
                        setSelectedArch(id as 'legacy' | 'jsi' | 'flutter');
                        setPacketCount(0);
                        setDroppedFrames(0);
                        setFps(id === 'flutter' ? 120 : 60);
                      }}
                      className={`py-2 px-2 rounded text-[11px] font-mono transition-colors text-center ${
                        selectedArch === id
                          ? 'bg-[var(--cp-surface)] text-[var(--cp-text)] font-bold border border-[var(--cp-border)]'
                          : 'text-[var(--cp-muted)] hover:text-[var(--cp-text)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Pipeline Execution Flow Diagram */}
                <div className="p-4 rounded-xl bg-[var(--cp-surface-2)] border border-[var(--cp-border)] space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--cp-muted)]">Thread Pipeline</span>
                    <span className="text-[var(--cp-primary)] font-bold">
                      {selectedArch === 'legacy' && 'Async Batched JSON'}
                      {selectedArch === 'jsi' && 'Synchronous C++ Pointers'}
                      {selectedArch === 'flutter' && 'Direct GPU Rasterization'}
                    </span>
                  </div>

                  {selectedArch === 'legacy' && (
                    <div className="space-y-2 text-[11px]">
                      <div className="p-2.5 rounded bg-[var(--cp-surface)] border border-[var(--cp-border)] flex items-center justify-between">
                        <span>1. JS Thread (V8/JSC)</span>
                        <span className="text-[var(--cp-amber)] font-bold">JSON.stringify()</span>
                      </div>
                      <div className="p-2.5 rounded bg-[var(--cp-rose-bg)] border border-[var(--cp-rose-border)] flex items-center justify-between text-[var(--cp-rose)] font-bold">
                        <span>2. Async Bridge Queue (Bottleneck)</span>
                        <span>5-16ms batch latency</span>
                      </div>
                      <div className="p-2.5 rounded bg-[var(--cp-surface)] border border-[var(--cp-border)] flex items-center justify-between">
                        <span>3. Native UI Thread (iOS/Android)</span>
                        <span>JSON.parse() + Layout</span>
                      </div>
                    </div>
                  )}

                  {selectedArch === 'jsi' && (
                    <div className="space-y-2 text-[11px]">
                      <div className="p-2.5 rounded bg-[var(--cp-surface)] border border-[var(--cp-border)] flex items-center justify-between">
                        <span>1. Hermes JS Engine</span>
                        <span className="text-[var(--cp-emerald)] font-bold">0ms Serialization</span>
                      </div>
                      <div className="p-2.5 rounded bg-[var(--cp-primary-10)] border border-[var(--cp-primary-30)] flex items-center justify-between text-[var(--cp-primary)] font-bold">
                        <span>2. JSI C++ HostObject Pointer</span>
                        <span>Direct Memory Call</span>
                      </div>
                      <div className="p-2.5 rounded bg-[var(--cp-surface)] border border-[var(--cp-border)] flex items-center justify-between">
                        <span>3. Fabric C++ Shadow Tree</span>
                        <span className="text-[var(--cp-emerald)] font-bold">Multi-threaded Yoga</span>
                      </div>
                    </div>
                  )}

                  {selectedArch === 'flutter' && (
                    <div className="space-y-2 text-[11px]">
                      <div className="p-2.5 rounded bg-[var(--cp-surface)] border border-[var(--cp-border)] flex items-center justify-between">
                        <span>1. Dart AOT Machine Code</span>
                        <span className="text-[var(--cp-sky)] font-bold">Native ARM Instructions</span>
                      </div>
                      <div className="p-2.5 rounded bg-[var(--cp-surface)] border border-[var(--cp-border)] flex items-center justify-between">
                        <span>2. RenderObject Display List</span>
                        <span className="text-[var(--cp-sky)] font-bold">Bypasses OEM Widgets</span>
                      </div>
                      <div className="p-2.5 rounded bg-[var(--cp-surface)] border border-[var(--cp-border)] flex items-center justify-between">
                        <span>3. Impeller GPU Engine</span>
                        <span className="text-[var(--cp-emerald)] font-bold">120 FPS Metal/Vulkan</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[var(--cp-surface-2)] border border-[var(--cp-border)] space-y-1">
                    <span className="text-[var(--cp-muted)] text-[10px]">Gesture Packets</span>
                    <div className="font-bold text-[var(--cp-text)] text-sm">{packetCount} pkts</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--cp-surface-2)] border border-[var(--cp-border)] space-y-1">
                    <span className="text-[var(--cp-muted)] text-[10px]">Dropped Frames</span>
                    <div className={`font-bold text-sm ${droppedFrames > 0 ? 'text-[var(--cp-rose)]' : 'text-[var(--cp-emerald)]'}`}>
                      {droppedFrames} frames
                    </div>
                  </div>
                </div>

                {/* Simulation Trigger */}
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="w-full py-3 rounded-lg bg-[var(--cp-primary)] text-white font-bold hover:bg-[var(--cp-primary-hover)] transition-colors active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2 text-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  {isSimulating ? 'Injecting 60Hz Touch Stream...' : 'Simulate 60Hz Scroll Gesture Drag'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Tier Learning Roadmap (Basic to Advanced) */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="border-b border-[var(--cp-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--cp-primary)] font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" /> Structured Curriculum Roadmap
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-[var(--cp-text)] mt-1">
              From Mobile Basics to Senior Architecture
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[var(--cp-muted)] max-w-md">
            Engineered for first-year BCA/B.Tech students up to systems engineers. Master the progression step-by-step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {crossPlatformTopicGroups.map((group, idx) => (
            <div
              key={group.id}
              className="cp-card p-6 rounded-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[var(--cp-primary)]">
                    STAGE 0{idx + 1}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${group.badgeColor}`}>
                    {group.topics.length} Topics
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-[var(--cp-text)]">
                  {group.name}
                </h3>

                <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
                  {group.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--cp-border)]">
                <Link
                  href={`/crossplatformviz/learn`}
                  className="text-xs font-mono text-[var(--cp-primary)] font-bold hover:underline flex items-center gap-1.5"
                >
                  Explore Stage Topics <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Way Architectural Comparison */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--cp-primary)] uppercase tracking-wider font-bold">
            <Layers className="w-4 h-4" /> Three Engineering Philosophies
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[var(--cp-text)]">
            React Native JSI vs Flutter vs KMP
          </h2>
          <p className="text-xs md:text-sm text-[var(--cp-muted)]">
            How three major frameworks solve the cross-platform speed equation without compromising developer velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* React Native Card */}
          <div className="cp-card p-6 md:p-8 rounded-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--cp-text)]">React Native JSI</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--cp-primary-10)] text-[var(--cp-primary)] border border-[var(--cp-primary-30)] font-bold">
                Real OEM Widgets
              </span>
            </div>
            <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
              JSX compiles to real platform views (UIView on iOS, android.view.View on Android). Direct C++ JSI bindings eliminate bridge queues, driven by Hermes AOT bytecode.
            </p>
            <div className="p-4 rounded-lg bg-[var(--cp-surface-2)] font-mono text-[11px] text-[var(--cp-muted)] space-y-2 border border-[var(--cp-border)]">
              <div className="text-[var(--cp-primary)] font-bold">&bull; 100% Real OEM Native Widgets</div>
              <div className="text-[var(--cp-emerald)] font-bold">&bull; JSI C++ HostObjects (0 JSON latency)</div>
              <div>&bull; Immutable Fabric Shadow Tree Layout</div>
              <div>&bull; React 18 Concurrent Rendering on Mobile</div>
            </div>
          </div>

          {/* Flutter Card */}
          <div className="cp-card p-6 md:p-8 rounded-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--cp-text)]">Flutter Impeller</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--cp-sky-bg)] text-[var(--cp-sky)] border border-[var(--cp-sky-border)] font-bold">
                Bespoke GPU Canvas
              </span>
            </div>
            <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
              Bypasses platform widgets completely. Compiles Dart AOT to native ARM machine code and draws every pixel directly to a GPU surface at 120 FPS via Metal &amp; Vulkan.
            </p>
            <div className="p-4 rounded-lg bg-[var(--cp-surface-2)] font-mono text-[11px] text-[var(--cp-muted)] space-y-2 border border-[var(--cp-border)]">
              <div className="text-[var(--cp-sky)] font-bold">&bull; Pixel-Identical Canvas on iOS &amp; Android</div>
              <div>&bull; Pre-compiled Impeller Vulkan/Metal Shaders</div>
              <div>&bull; Zero OEM widget impedance mismatches</div>
              <div className="text-[var(--cp-emerald)] font-bold">&bull; Rock-solid 120 FPS animations</div>
            </div>
          </div>

          {/* KMP Card */}
          <div className="cp-card p-6 md:p-8 rounded-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--cp-text)]">Kotlin Multiplatform</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--cp-amber-bg)] text-[var(--cp-amber)] border border-[var(--cp-amber-border)] font-bold">
                Shared Logic Only
              </span>
            </div>
            <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
              Shares 100% of business logic, SQL databases, and networking in Kotlin, while rendering UI with 100% pure SwiftUI (iOS) and Jetpack Compose (Android).
            </p>
            <div className="p-4 rounded-lg bg-[var(--cp-surface-2)] font-mono text-[11px] text-[var(--cp-muted)] space-y-2 border border-[var(--cp-border)]">
              <div className="text-[var(--cp-amber)] font-bold">&bull; Pure SwiftUI &amp; Jetpack Compose UI</div>
              <div>&bull; Kotlin/Native LLVM Framework binaries</div>
              <div>&bull; Zero UI abstraction or bridge overhead</div>
              <div>&bull; Frictionless incremental adoption</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Grid (All 14 Topics) */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--cp-border)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--cp-primary)] uppercase tracking-wider font-bold">
              Comprehensive Curriculum
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[var(--cp-text)] mt-1">
              Explore All 14 Architecture Topics
            </h2>
          </div>
          <Link
            href="/crossplatformviz/learn"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--cp-primary)] font-bold hover:underline"
          >
            Open Interactive Concept Map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crossPlatformTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/crossplatformviz/learn/${topic.id}`}
              className="cp-card p-6 rounded-xl space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--cp-primary)] font-bold">
                    {topic.kicker}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--cp-muted)] group-hover:text-[var(--cp-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <h3 className="font-display font-bold text-base text-[var(--cp-text)] group-hover:text-[var(--cp-primary)] transition-colors">
                  {topic.title}
                </h3>

                <p className="text-xs text-[var(--cp-muted)] leading-relaxed line-clamp-2">
                  {topic.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--cp-border)] flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--cp-border)] text-[var(--cp-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--cp-primary)] font-medium">
                  {topic.group.split(' ')[0]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
