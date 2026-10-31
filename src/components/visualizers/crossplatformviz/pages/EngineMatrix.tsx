'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Table, Check, X, Smartphone, Layers, ShieldCheck, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

interface EngineComparison {
  name: string;
  badge: string;
  category: 'native-views' | 'canvas' | 'shared-logic' | 'webview';
  renderEngine: string;
  interopMechanism: string;
  uiTarget: string;
  ttiRating: string;
  memoryRating: string;
  frameRateCapability: string;
  strengths: string;
  tradeoffs: string;
}

const COMPARISON_DATA: EngineComparison[] = [
  {
    name: 'React Native (New Arch)',
    badge: 'JSI + Fabric',
    category: 'native-views',
    renderEngine: 'Fabric C++ Shadow Tree + Yoga Layout',
    interopMechanism: 'JSI C++ HostObjects (Direct Memory)',
    uiTarget: '100% Real OEM Native Views (UIView / android.view.View)',
    ttiRating: 'Very Fast (~240ms via Hermes HBC bytecode)',
    memoryRating: 'Low-Medium (Hermes GC)',
    frameRateCapability: '60 - 120 FPS',
    strengths: 'Native UI look & feel, concurrent React 18, zero JSON serialization overhead.',
    tradeoffs: 'Requires C++ bindings (Codegen) for custom TurboModules.',
  },
  {
    name: 'Flutter',
    badge: 'Impeller + Dart AOT',
    category: 'canvas',
    renderEngine: 'Impeller GPU Shaders (Metal / Vulkan)',
    interopMechanism: 'Dart FFI (Foreign Function Interface)',
    uiTarget: 'Own Canvas (Bypasses OEM Platform Widgets)',
    ttiRating: 'Fast (~280ms)',
    memoryRating: 'Medium (Bespoke UI Engine overhead)',
    frameRateCapability: '120 FPS rock-solid',
    strengths: 'Pixel-identical canvas on iOS & Android, eliminates runtime shader jank, fast dev reload.',
    tradeoffs: 'Bypasses platform accessibility and native text-rendering subtleties.',
  },
  {
    name: 'Kotlin Multiplatform (KMP)',
    badge: 'Shared Logic',
    category: 'shared-logic',
    renderEngine: 'Pure Native (SwiftUI on iOS & Jetpack Compose on Android)',
    interopMechanism: 'Native C/Objective-C LLVM Binaries',
    uiTarget: '100% Pure Native Platform Code',
    ttiRating: 'Native Speed (~100ms)',
    memoryRating: 'Lowest (Native Platform Runtime)',
    frameRateCapability: 'Native 120 FPS',
    strengths: '100% native platform fidelity, shared Kotlin business logic, zero runtime UI overhead.',
    tradeoffs: 'Requires maintaining two separate UI codebases (SwiftUI and Compose).',
  },
  {
    name: 'React Native (Legacy)',
    badge: 'Deprecated Bridge',
    category: 'native-views',
    renderEngine: 'Legacy UIManager + Shadow Queue',
    interopMechanism: 'Asynchronous JSON Message Bridge',
    uiTarget: 'OEM Native Views via Bridge',
    ttiRating: 'Slow (~1,200ms parse time)',
    memoryRating: 'High (V8/JSC runtime)',
    frameRateCapability: '30 - 60 FPS (Stutters on heavy load)',
    strengths: 'Pioneered cross-platform declarative UI (deprecated in favor of JSI).',
    tradeoffs: 'Bridge bottleneck causes frame drops during fast scrolls or gesture drags.',
  },
  {
    name: 'Capacitor / Cordova',
    badge: 'WebView Hybrid',
    category: 'webview',
    renderEngine: 'Chromium / WebKit DOM Engine',
    interopMechanism: 'WebView JavaScript PostMessage Bridge',
    uiTarget: 'HTML5 DOM Elements inside WebView container',
    ttiRating: 'Slowest (~1,800ms WebView warmup)',
    memoryRating: 'Highest (Full WebKit instance per view)',
    frameRateCapability: '30 - 60 FPS',
    strengths: '100% standard web code reuse, fast web developer onboarding.',
    tradeoffs: 'High memory consumption, DOM scrolling lag, non-native feel.',
  },
];

export function EngineMatrix() {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredData = COMPARISON_DATA.filter(
    (item) => filterCategory === 'all' || item.category === filterCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--cp-border)] bg-[var(--cp-surface-2)] text-[var(--cp-sky)] text-xs font-mono font-medium">
          <Table className="w-3.5 h-3.5" /> Comprehensive Architecture Matrix
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--cp-text)]">
          Cross-Platform Engine Comparison
        </h1>
        <p className="text-sm md:text-base text-[var(--cp-muted)] max-w-2xl leading-relaxed">
          Deep architectural comparison of rendering pipelines, memory footprints, startup latencies, and native interop mechanisms across modern mobile ecosystems.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            ['all', 'All Engines (5)'],
            ['native-views', 'Real Native Views'],
            ['canvas', 'Own GPU Canvas'],
            ['shared-logic', 'Shared Logic Only'],
            ['webview', 'WebView Hybrid'],
          ].map(([cat, label]) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filterCategory === cat
                  ? 'bg-[var(--cp-primary)] text-white font-bold'
                  : 'border border-[var(--cp-border)] bg-[var(--cp-surface)] text-[var(--cp-muted)] hover:text-[var(--cp-text)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--cp-border)] bg-[var(--cp-surface-2)] text-[10px] text-[var(--cp-muted)] uppercase tracking-wider">
                <th className="p-4 font-bold">Framework</th>
                <th className="p-4 font-bold">Rendering Layer</th>
                <th className="p-4 font-bold">Native Interop</th>
                <th className="p-4 font-bold">UI Target</th>
                <th className="p-4 font-bold">Startup (TTI)</th>
                <th className="p-4 font-bold">FPS Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cp-border)]">
              {filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[var(--cp-surface-2)] transition-colors"
                >
                  <td className="p-4 font-bold text-[var(--cp-text)] space-y-1">
                    <div className="text-sm font-sans">{row.name}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--cp-surface-2)] text-[var(--cp-primary)] border border-[var(--cp-border)] inline-block">
                      {row.badge}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--cp-muted)] font-sans">{row.renderEngine}</td>
                  <td className="p-4 text-[var(--cp-emerald)] font-bold">{row.interopMechanism}</td>
                  <td className="p-4 text-[var(--cp-text)] font-sans">{row.uiTarget}</td>
                  <td className="p-4 text-[var(--cp-muted)]">{row.ttiRating}</td>
                  <td className="p-4 text-[var(--cp-sky)] font-bold">{row.frameRateCapability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engineering Decision Guide for Students */}
      <section className="p-6 md:p-8 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--cp-primary)] font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> Architectural Decision Guide
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--cp-text)]">
            Which Framework Should You Choose?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
          <div className="p-5 rounded-lg border border-[var(--cp-border)] bg-[var(--cp-surface-2)] space-y-2">
            <span className="font-mono font-bold text-[var(--cp-primary)] text-sm">Choose React Native JSI if:</span>
            <ul className="text-[var(--cp-muted)] space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Your app relies heavily on standard native platform components and accessibility.</li>
              <li>Your team has strong React / TypeScript expertise.</li>
              <li>You need fast over-the-air updates and large NPM library ecosystem support.</li>
            </ul>
          </div>

          <div className="p-5 rounded-lg border border-[var(--cp-border)] bg-[var(--cp-surface-2)] space-y-2">
            <span className="font-mono font-bold text-[var(--cp-sky)] text-sm">Choose Flutter Impeller if:</span>
            <ul className="text-[var(--cp-muted)] space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Your app requires identical pixel-perfect custom designs across iOS, Android, and Desktop.</li>
              <li>You need heavy custom animations, charts, or 120 FPS canvas interactions.</li>
              <li>You prefer a single language (Dart) spanning the entire UI and layout stack.</li>
            </ul>
          </div>

          <div className="p-5 rounded-lg border border-[var(--cp-border)] bg-[var(--cp-surface-2)] space-y-2">
            <span className="font-mono font-bold text-[var(--cp-amber)] text-sm">Choose Kotlin Multiplatform if:</span>
            <ul className="text-[var(--cp-muted)] space-y-1.5 list-disc list-inside leading-relaxed">
              <li>You already have existing native iOS (Swift) and Android (Kotlin) applications.</li>
              <li>You want 100% native platform UI with zero abstractions (SwiftUI + Jetpack Compose).</li>
              <li>You want to share critical offline databases, algorithms, and business logic.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
