'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Layers, Cpu, ShieldCheck, ArrowRight, BookOpen, Compass } from 'lucide-react';
import { crossPlatformTopicGroups } from '../data/topics';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--cp-border)] bg-[var(--cp-surface-2)] text-[var(--cp-primary)] text-xs font-mono font-medium">
          <Smartphone className="w-3.5 h-3.5" /> MOBILE::INTERNALS Systems Architecture
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--cp-text)]">
          The Architecture of Native Speed Across Platforms
        </h1>

        <p className="text-base md:text-lg text-[var(--cp-muted)] max-w-3xl leading-relaxed">
          Cross-platform engineering is the science of eliminating impedance mismatches between high-level declarative UI logic and underlying mobile GPU hardware rendering pipelines.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 md:p-8 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--cp-primary)] font-bold">01 / JSI C++ POINTERS</span>
          <h3 className="font-display font-bold text-lg text-[var(--cp-text)]">Zero Serialization</h3>
          <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
            Direct memory bindings eliminate the asynchronous JSON bridge, allowing JavaScript engines to invoke C++ HostObjects synchronously in zero milliseconds.
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--cp-sky)] font-bold">02 / GPU RASTERIZATION</span>
          <h3 className="font-display font-bold text-lg text-[var(--cp-text)]">Impeller Shaders</h3>
          <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
            By pre-compiling Vulkan and Metal shaders Ahead-of-Time, modern graphics engines eliminate runtime shader compilation jank and maintain 120 FPS.
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-4">
          <span className="font-mono text-xs text-[var(--cp-amber)] font-bold">03 / SHARED RUNTIMES</span>
          <h3 className="font-display font-bold text-lg text-[var(--cp-text)]">KMP Native Code</h3>
          <p className="text-xs text-[var(--cp-muted)] leading-relaxed">
            Compiling shared Kotlin logic into LLVM native binaries allows 100% native platform fidelity with pure SwiftUI and Jetpack Compose UIs.
          </p>
        </div>
      </div>

      {/* 4-Stage Progressive Curriculum Overview */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--cp-primary)] font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" /> Educational Syllabus
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--cp-text)]">
            Curriculum Stages for Students
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {crossPlatformTopicGroups.map((group, idx) => (
            <div
              key={group.id}
              className="p-5 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface-2)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--cp-primary)]">STAGE 0{idx + 1}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${group.badgeColor}`}>
                  {group.topics.length} topics
                </span>
              </div>
              <h3 className="font-display font-bold text-sm text-[var(--cp-text)]">
                {group.name}
              </h3>
              <p className="font-sans text-[11px] text-[var(--cp-muted)] leading-relaxed">
                {group.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <div className="p-8 md:p-10 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="font-display font-bold text-xl md:text-2xl text-[var(--cp-text)]">
            Ready to master cross-platform mobile runtimes?
          </h3>
          <p className="text-xs text-[var(--cp-muted)]">
            Explore all 14 topics with code contracts and interactive quizzes.
          </p>
        </div>

        <Link
          href="/crossplatformviz/learn"
          className="cp-btn-primary whitespace-nowrap"
        >
          Explore Concept Map <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
