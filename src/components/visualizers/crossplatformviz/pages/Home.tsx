'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Smartphone, Activity, Layers, ArrowUpRight, CheckCircle2, RotateCcw, Play, Zap, Cpu, Table, Sliders } from 'lucide-react';
import { crossPlatformTopics } from '../data/topics';

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
        setFps(f => Math.max(32, f - 2));
      } else if (selectedArch === 'jsi') {
        setFps(60);
      } else {
        setFps(120);
      }

      if (count >= 10) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 150);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="cp-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--cp-primary)]/30 bg-[var(--cp-primary)]/10 text-[var(--cp-primary)] text-xs font-mono">
              <Smartphone className="w-3.5 h-3.5 animate-pulse text-[var(--cp-primary)]" />
              Cross-Platform Internals &bull; React Native &bull; Flutter &bull; KMP
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--cp-text)]">
              Zero Serialization.<br />
              <span className="text-[var(--cp-primary)] cp-glow">Direct C++ Pointers.</span> 120 FPS Canvas.
            </h1>

            <p className="text-base md:text-lg text-[var(--cp-muted)] max-w-xl leading-relaxed">
              Deconstruct cross-platform mobile architectures. Compare React Native’s asynchronous JSON bridge with JSI C++ HostObjects, Fabric immutable shadow trees, and Flutter’s direct GPU Impeller rasterization.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/crossplatformviz/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--cp-primary)] text-white font-semibold text-sm hover:bg-[var(--cp-primary-hover)] transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)] active:scale-95"
              >
                Explore Concept Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/crossplatformviz/bridge-sim"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--cp-border)] bg-[var(--cp-surface)] text-[var(--cp-text)] font-mono text-sm hover:border-[var(--cp-primary)] hover:text-[var(--cp-primary)] transition-all"
              >
                <Activity className="w-4 h-4 text-[var(--cp-primary)]" />
                Bridge vs JSI Lab
              </Link>

              <Link
                href="/crossplatformviz/engine-matrix"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--cp-border-subtle)] bg-[var(--cp-surface-2)] text-[var(--cp-muted)] font-mono text-sm hover:text-[var(--cp-text)] transition-all"
              >
                <Table className="w-4 h-4 text-[var(--cp-sky)]" />
                Engine Matrix
              </Link>
            </div>
          </div>

          {/* Right Live Architecture Simulator */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--cp-border)] bg-[var(--cp-surface)] shadow-2xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-3 border-b border-[var(--cp-border-subtle)] bg-[var(--cp-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-[var(--cp-muted)] ml-2">MobileEngine::PipelineMonitor</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  fps >= 60 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {fps} FPS
                </span>
              </div>

              <div className="p-6 space-y-6">
                {/* Architecture Selector Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--cp-bg)] border border-[var(--cp-border-subtle)]">
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
                      className={`py-1.5 px-2 rounded-lg text-[10px] transition-all text-center ${
                        selectedArch === id
                          ? 'bg-[var(--cp-primary)] text-white font-bold shadow'
                          : 'text-[var(--cp-muted)] hover:text-[var(--cp-text)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Pipeline Execution Flow Diagram */}
                <div className="p-4 rounded-xl bg-[var(--cp-bg)] border border-[var(--cp-border-subtle)] space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-[var(--cp-muted)]">
                    <span>Thread Execution Pipeline</span>
                    <span className="text-[var(--cp-primary)] font-bold">
                      {selectedArch === 'legacy' && 'Async Batched JSON'}
                      {selectedArch === 'jsi' && 'Synchronous C++ Pointers'}
                      {selectedArch === 'flutter' && 'Direct GPU Rasterization'}
                    </span>
                  </div>

                  {selectedArch === 'legacy' && (
                    <div className="space-y-2 text-[10px]">
                      <div className="p-2 rounded bg-[var(--cp-surface-2)] border border-amber-500/30 flex items-center justify-between">
                        <span>1. JS Thread (V8/JSC)</span>
                        <span className="text-amber-400">JSON.stringify()</span>
                      </div>
                      <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-rose-400 font-bold animate-pulse">
                        <span>2. Async Bridge Queue (Bottleneck)</span>
                        <span>5ms batch delay</span>
                      </div>
                      <div className="p-2 rounded bg-[var(--cp-surface-2)] border border-[var(--cp-border-subtle)] flex items-center justify-between">
                        <span>3. Native UI Thread (iOS/Android)</span>
                        <span>JSON.parse() + Layout</span>
                      </div>
                    </div>
                  )}

                  {selectedArch === 'jsi' && (
                    <div className="space-y-2 text-[10px]">
                      <div className="p-2 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-indigo-300">
                        <span>1. Hermes JS Engine</span>
                        <span className="text-emerald-400 font-bold">0ms Serialization</span>
                      </div>
                      <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-cyan-300 font-bold">
                        <span>2. JSI C++ HostObject Pointer</span>
                        <span>Synchronous Memory Call</span>
                      </div>
                      <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-400">
                        <span>3. Fabric C++ Shadow Tree</span>
                        <span>Multi-threaded Yoga Layout</span>
                      </div>
                    </div>
                  )}

                  {selectedArch === 'flutter' && (
                    <div className="space-y-2 text-[10px]">
                      <div className="p-2 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-between text-sky-300">
                        <span>1. Dart AOT Machine Code</span>
                        <span>Direct CPU Instructions</span>
                      </div>
                      <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-cyan-300 font-bold">
                        <span>2. RenderObject Display List</span>
                        <span>Bypasses OEM Widgets</span>
                      </div>
                      <div className="p-2 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-between text-teal-400">
                        <span>3. Impeller GPU Shader Engine</span>
                        <span>120 FPS Vulkan/Metal Draw</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="p-3 rounded-xl bg-[var(--cp-bg)] border border-[var(--cp-border-subtle)] space-y-1">
                    <span className="text-[var(--cp-muted)]">Gesture Packets Sent</span>
                    <div className="font-bold text-[var(--cp-text)] text-sm">{packetCount} msgs</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--cp-bg)] border border-[var(--cp-border-subtle)] space-y-1">
                    <span className="text-[var(--cp-muted)]">Dropped Frames</span>
                    <div className={`font-bold text-sm ${droppedFrames > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {droppedFrames} frames
                    </div>
                  </div>
                </div>

                {/* Simulation Trigger */}
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="w-full py-3 rounded-lg bg-[var(--cp-primary)] text-white font-bold hover:bg-[var(--cp-primary-hover)] transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  {isSimulating ? 'Sending 60Hz Touch Stream...' : 'Simulate 60Hz Scroll Gesture Drag'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Way Architectural Comparison */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--cp-primary)] uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Systems Architecture Comparison
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--cp-text)]">
            React Native (New Arch) vs Flutter vs KMP
          </h2>
          <p className="text-sm text-[var(--cp-muted)]">
            Three distinct engineering philosophies for achieving native speed across iOS and Android.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* React Native Card */}
          <div className="p-8 rounded-2xl border-2 border-[var(--cp-primary)]/40 bg-[var(--cp-surface)] space-y-6 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--cp-text)]">React Native JSI</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--cp-primary)]/10 text-[var(--cp-primary)] border border-[var(--cp-primary)]/30 font-bold">
                Native Widgets
              </span>
            </div>
            <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
              JSX compiles to real OEM platform widgets (UIViews / Android Views). Direct C++ JSI bindings eliminate bridge latency, powered by Hermes AOT bytecode.
            </p>
            <div className="p-4 rounded-lg bg-[var(--cp-bg)] font-mono text-[11px] text-[var(--cp-muted)] space-y-2 border border-[var(--cp-primary)]/20">
              <div className="text-[var(--cp-primary)]">• 100% Real OEM Native Widgets</div>
              <div className="text-emerald-400">• JSI C++ HostObjects (0 JSON serialization)</div>
              <div>• Immutable Fabric Shadow Tree Layout</div>
              <div>• React 18 Concurrent Rendering on Mobile</div>
            </div>
          </div>

          {/* Flutter Card */}
          <div className="p-8 rounded-2xl border border-[var(--cp-border-subtle)] bg-[var(--cp-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--cp-text)]">Flutter Impeller</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                Own Canvas
              </span>
            </div>
            <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
              Bypasses platform widgets completely. Compiles Dart AOT into native ARM machine code and draws every pixel directly to a GPU surface at 120 FPS.
            </p>
            <div className="p-4 rounded-lg bg-[var(--cp-bg)] font-mono text-[11px] text-[var(--cp-muted)] space-y-2 border border-[var(--cp-border-subtle)]">
              <div className="text-sky-400">• Pixel-Identical Canvas across iOS/Android</div>
              <div>• Pre-compiled Impeller Vulkan/Metal Shaders</div>
              <div>• Zero OEM widget impedance mismatches</div>
              <div>• High-performance 120 FPS animations</div>
            </div>
          </div>

          {/* KMP Card */}
          <div className="p-8 rounded-2xl border border-[var(--cp-border-subtle)] bg-[var(--cp-surface)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl text-[var(--cp-text)]">Kotlin Multiplatform</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                Shared Logic
              </span>
            </div>
            <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
              Shares 100% of business logic, networking, and databases in Kotlin, while rendering UI natively with pure SwiftUI (iOS) and Jetpack Compose (Android).
            </p>
            <div className="p-4 rounded-lg bg-[var(--cp-bg)] font-mono text-[11px] text-[var(--cp-muted)] space-y-2 border border-[var(--cp-border-subtle)]">
              <div className="text-amber-400">• 100% Pure SwiftUI &amp; Jetpack Compose UI</div>
              <div>• Kotlin/Native LLVM Framework binaries</div>
              <div>• Zero UI translation or bridge layer</div>
              <div>• Incremental migration for existing native apps</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--cp-border-subtle)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--cp-primary)] uppercase tracking-wider">
              Architecture Tracks
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--cp-text)] mt-1">
              Cross-Platform Internals
            </h2>
          </div>
          <Link
            href="/crossplatformviz/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--cp-primary)] hover:underline"
          >
            View all 5 topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crossPlatformTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/crossplatformviz/learn/${topic.id}`}
              className="cp-card p-6 rounded-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--cp-primary)]">
                  {topic.kicker}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--cp-muted)] group-hover:text-[var(--cp-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--cp-text)] group-hover:text-[var(--cp-primary)] transition-colors">
                {topic.title}
              </h3>

              <p className="text-xs text-[var(--cp-muted)] leading-relaxed line-clamp-2">
                {topic.summary}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--cp-border-subtle)] text-[var(--cp-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--cp-muted)]">
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
