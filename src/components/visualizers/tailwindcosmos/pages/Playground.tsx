'use client';

import React, { useState } from 'react';
import { Activity, Play, Box, Smartphone, Tablet, Laptop, RefreshCw, Copy, Check, Code2, Sparkles, Wind } from 'lucide-react';

const PRESETS = [
  {
    id: 'hero-card',
    name: 'Cosmic Hero Card',
    classes: 'flex flex-col gap-4 p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] text-white hover:border-cyan-400 transition-all group',
    html: `<div class="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono group-hover:scale-110 transition-transform">01</div>
<div>
  <h3 class="text-xl font-bold font-display group-hover:text-cyan-400 transition-colors">Distributed Cloud Ledger</h3>
  <p class="text-xs text-slate-400 mt-1 leading-relaxed">High-throughput append-only event streaming with zero-copy page caching.</p>
</div>
<div class="pt-2 flex items-center justify-between">
  <span class="text-xs font-mono text-cyan-400">STATUS: HEALTHY</span>
  <button class="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors">Deploy</button>
</div>`
  },
  {
    id: 'pricing-badge',
    name: 'Pro Badge',
    classes: 'relative overflow-hidden p-6 rounded-2xl bg-indigo-950 border border-indigo-500/30 text-white shadow-xl',
    html: `<div class="flex items-center justify-between mb-4">
  <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">ENTERPRISE</span>
  <span class="text-2xl font-bold font-display">$99<span class="text-xs text-slate-400 font-normal">/mo</span></span>
</div>
<p class="text-xs text-slate-300 mb-6">Unlimited partitions, 99.999% replication quorum, and full 24/7 dedicated support.</p>
<button class="w-full py-2.5 rounded-lg bg-indigo-500 text-white font-semibold text-xs hover:bg-indigo-400 transition-colors shadow-lg">Start Free 14-Day Trial</button>`
  },
  {
    id: 'peer-input',
    name: 'Floating Label Input',
    classes: 'relative p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4',
    html: `<div class="relative">
  <input type="text" id="email" placeholder=" " class="peer w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-transparent focus:border-cyan-500 focus:outline-none" />
  <label for="email" class="absolute left-4 top-3 text-xs text-slate-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-cyan-400 peer-focus:bg-slate-900 peer-focus:px-1">Email Address</label>
</div>
<button class="w-full py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors">Submit Form</button>`
  }
];

export function Playground() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [customClasses, setCustomClasses] = useState(PRESETS[0].classes);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showWireframe, setShowWireframe] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectPreset = (p: typeof PRESETS[0]) => {
    setSelectedPreset(p);
    setCustomClasses(p.classes);
  };

  const copyClasses = () => {
    navigator.clipboard.writeText(customClasses);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viewportWidths = {
    mobile: 'max-w-[340px]',
    tablet: 'max-w-[600px]',
    desktop: 'w-full max-w-2xl'
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--twc-primary)]/30 bg-[var(--twc-primary)]/10 text-[var(--twc-primary)] text-xs font-mono">
          <Activity className="w-3.5 h-3.5" /> Interactive Sandbox
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--twc-text)]">
          Live Tailwind <span className="text-[var(--twc-primary)] twc-glow">JIT Playground</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--twc-muted)] max-w-2xl leading-relaxed">
          Experiment with utility compositions in real-time. Test responsive viewport bounds, inspect Box Model dimensions, and copy production class tokens.
        </p>
      </div>

      {/* Preset Selector Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-[var(--twc-muted)]">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => selectPreset(p)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedPreset.id === p.id
                ? 'bg-[var(--twc-primary)] text-black font-bold'
                : 'border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] text-[var(--twc-muted)] hover:text-[var(--twc-text)]'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Editor Console */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--twc-border)] bg-[var(--twc-surface)] p-6 space-y-6 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[var(--twc-border-subtle)] pb-4">
            <span className="text-[var(--twc-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5" /> Utility Class String
            </span>
            <button
              onClick={copyClasses}
              className="text-[10px] flex items-center gap-1 text-[var(--twc-muted)] hover:text-[var(--twc-primary)] transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[var(--twc-muted)] text-[11px]">Class Names (edit in real-time):</label>
            <textarea
              value={customClasses}
              onChange={(e) => setCustomClasses(e.target.value)}
              rows={5}
              className="w-full p-3 rounded-xl border border-[var(--twc-border-subtle)] bg-[var(--twc-bg)] text-[var(--twc-text)] focus:border-[var(--twc-primary)] focus:outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Quick Utility Helpers */}
          <div className="space-y-2 pt-2 border-t border-[var(--twc-border-subtle)]">
            <span className="text-[10px] text-[var(--twc-muted)] uppercase tracking-wider">Quick Tokens</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'p-6',
                'rounded-3xl',
                'shadow-2xl',
                'border-cyan-500/50',
                'backdrop-blur-md',
                'hover:scale-105',
                'cursor-pointer',
                'text-center'
              ].map((token) => (
                <button
                  key={token}
                  onClick={() => setCustomClasses(prev => `${prev} ${token}`)}
                  className="px-2 py-1 rounded bg-[var(--twc-surface-2)] text-[10px] text-[var(--twc-primary)] hover:bg-[var(--twc-primary)] hover:text-black transition-colors"
                >
                  +{token}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-[var(--twc-border-subtle)] bg-[var(--twc-surface)] overflow-hidden shadow-2xl">
            {/* Viewport Toolbar */}
            <div className="px-4 py-3 border-b border-[var(--twc-border-subtle)] bg-[var(--twc-surface-2)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewport('mobile')}
                  className={`p-1.5 rounded transition-colors ${viewport === 'mobile' ? 'bg-[var(--twc-primary)] text-black' : 'text-[var(--twc-muted)] hover:text-[var(--twc-text)]'}`}
                  title="Mobile 340px"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`p-1.5 rounded transition-colors ${viewport === 'tablet' ? 'bg-[var(--twc-primary)] text-black' : 'text-[var(--twc-muted)] hover:text-[var(--twc-text)]'}`}
                  title="Tablet 600px"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewport('desktop')}
                  className={`p-1.5 rounded transition-colors ${viewport === 'desktop' ? 'bg-[var(--twc-primary)] text-black' : 'text-[var(--twc-muted)] hover:text-[var(--twc-text)]'}`}
                  title="Desktop Full"
                >
                  <Laptop className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowWireframe(!showWireframe)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded border flex items-center gap-1.5 transition-colors ${
                  showWireframe
                    ? 'bg-emerald-500 text-black font-bold border-emerald-500'
                    : 'bg-[var(--twc-bg)] text-[var(--twc-muted)] border-[var(--twc-border-subtle)]'
                }`}
              >
                <Box className="w-3 h-3" />
                Box Diagnostics
              </button>
            </div>

            {/* Canvas Stage */}
            <div className="p-8 sm:p-12 bg-[var(--twc-bg)] min-h-[380px] flex items-center justify-center transition-all">
              <div className={`${viewportWidths[viewport]} transition-all duration-300`}>
                <div
                  className={`${customClasses} ${showWireframe ? 'ring-4 ring-emerald-400/80 outline-dashed outline-2 outline-cyan-400' : ''}`}
                  dangerouslySetInnerHTML={{ __html: selectedPreset.html }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
