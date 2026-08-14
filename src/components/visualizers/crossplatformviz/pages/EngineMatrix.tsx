'use client';

import React from 'react';
import { Table, Check, X, Smartphone, Layers, ShieldCheck, Sparkles } from 'lucide-react';

interface EngineComparison {
  name: string;
  badge: string;
  renderEngine: string;
  interopMechanism: string;
  uiTarget: string;
  ttiRating: string;
  memoryRating: string;
  frameRateCapability: string;
  strengths: string;
}

const COMPARISON_DATA: EngineComparison[] = [
  {
    name: 'React Native (New Arch)',
    badge: 'JSI + Fabric',
    renderEngine: 'Fabric C++ Shadow Tree + Yoga',
    interopMechanism: 'JSI C++ HostObjects (Direct Memory)',
    uiTarget: '100% Real OEM Native Views',
    ttiRating: 'Very Fast (~240ms via Hermes HBC)',
    memoryRating: 'Low-Medium (Hermes GC)',
    frameRateCapability: '60 - 120 FPS',
    strengths: 'Native UI look & feel, concurrent React 18, zero JSON serialization overhead.',
  },
  {
    name: 'Flutter',
    badge: 'Impeller + Dart AOT',
    renderEngine: 'Impeller GPU Shaders (Metal / Vulkan)',
    interopMechanism: 'Dart FFI (Foreign Function Interface)',
    uiTarget: 'Own Canvas (Bypasses OEM Widgets)',
    ttiRating: 'Fast (~280ms)',
    memoryRating: 'Medium (Bespoke UI Engine)',
    frameRateCapability: '120 FPS rock-solid',
    strengths: 'Pixel-perfect cross-platform consistency, high-performance GPU shaders, zero shader jank.',
  },
  {
    name: 'Kotlin Multiplatform (KMP)',
    badge: 'Shared Logic',
    renderEngine: 'Pure Native (SwiftUI & Jetpack Compose)',
    interopMechanism: 'Native C/Objective-C LLVM Binaries',
    uiTarget: '100% Pure Native Platform Code',
    ttiRating: 'Native Speed (~100ms)',
    memoryRating: 'Lowest (Native Platform Runtime)',
    frameRateCapability: 'Native 120 FPS',
    strengths: '100% native platform fidelity, shared Kotlin business logic, zero runtime UI overhead.',
  },
  {
    name: 'React Native (Legacy)',
    badge: 'Async Bridge',
    renderEngine: 'Legacy UIManager + Shadow Queue',
    interopMechanism: 'Asynchronous JSON Message Bridge',
    uiTarget: 'OEM Native Views via Bridge',
    ttiRating: 'Slow (~1,200ms parse time)',
    memoryRating: 'High (V8/JSC runtime)',
    frameRateCapability: '30 - 60 FPS (Stutters on heavy load)',
    strengths: 'Pioneered cross-platform declarative UI, large ecosystem (deprecated in favor of JSI).',
  },
  {
    name: 'Capacitor / Cordova',
    badge: 'WebView Hybrid',
    renderEngine: 'Chromium / WebKit DOM Engine',
    interopMechanism: 'WebView JavaScript PostMessage Bridge',
    uiTarget: 'HTML5 DOM Elements in WebView',
    ttiRating: 'Slowest (~1,800ms WebView warmup)',
    memoryRating: 'Highest (Full WebKit instance)',
    frameRateCapability: '30 - 60 FPS',
    strengths: '100% standard web code reuse, fast web developer onboarding.',
  },
];

export function EngineMatrix() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--cp-sky)]/30 bg-[var(--cp-sky)]/10 text-[var(--cp-sky)] text-xs font-mono">
          <Table className="w-3.5 h-3.5" /> Comprehensive Architecture Matrix
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--cp-text)]">
          Cross-Platform <span className="text-[var(--cp-primary)] cp-glow">Engine Comparison</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--cp-muted)] max-w-2xl leading-relaxed">
          Deep architectural comparison of rendering pipelines, memory footprints, startup latencies, and native interop mechanisms across modern mobile ecosystems.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-[var(--cp-border-subtle)] bg-[var(--cp-surface)] overflow-hidden shadow-2xl font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--cp-border-subtle)] bg-[var(--cp-surface-2)] text-[10px] text-[var(--cp-muted)] uppercase tracking-wider">
                <th className="p-4 font-bold">Framework</th>
                <th className="p-4 font-bold">Rendering Layer</th>
                <th className="p-4 font-bold">Native Interop</th>
                <th className="p-4 font-bold">UI Target</th>
                <th className="p-4 font-bold">Startup (TTI)</th>
                <th className="p-4 font-bold">FPS Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cp-border-subtle)]">
              {COMPARISON_DATA.map((row, idx) => {
                const isFeatured = idx === 0 || idx === 1;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isFeatured ? 'bg-[var(--cp-primary)]/5 hover:bg-[var(--cp-primary)]/10' : 'hover:bg-[var(--cp-surface-2)]'
                    }`}
                  >
                    <td className="p-4 font-bold text-[var(--cp-text)] space-y-1">
                      <div className="text-sm">{row.name}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--cp-surface-2)] text-[var(--cp-primary)] border border-[var(--cp-border-subtle)]">
                        {row.badge}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--cp-muted)]">{row.renderEngine}</td>
                    <td className="p-4 text-emerald-400 font-bold">{row.interopMechanism}</td>
                    <td className="p-4 text-[var(--cp-text)]">{row.uiTarget}</td>
                    <td className="p-4 text-[var(--cp-muted)]">{row.ttiRating}</td>
                    <td className="p-4 text-[var(--cp-sky)] font-bold">{row.frameRateCapability}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
