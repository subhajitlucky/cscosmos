'use client';

import React, { useState } from 'react';
import { Sparkles, Play, RotateCcw, Zap, Layers, RefreshCw, Cpu } from 'lucide-react';

export function RunesSandbox() {
  const [activeRune, setActiveRune] = useState<'$state' | '$derived' | '$effect' | '$props'>('$state');
  
  // State variables for the interactive simulation
  const [firstName, setFirstName] = useState('Ada');
  const [lastName, setLastName] = useState('Lovelace');
  const [score, setScore] = useState(42);
  const [effectLogs, setEffectLogs] = useState<string[]>(['[0.00s] $effect initial mount registered.']);

  // Derived values
  const fullName = `${firstName} ${lastName}`;
  const rank = score > 80 ? 'Master Engineer' : score > 40 ? 'Senior Architect' : 'Junior Hacker';

  const triggerEffect = (msg: string) => {
    const timestamp = (performance.now() / 1000).toFixed(2);
    setEffectLogs(prev => [`[${timestamp}s] ${msg}`, ...prev.slice(0, 7)]);
  };

  const updateScore = (delta: number) => {
    const newScore = Math.max(0, score + delta);
    setScore(newScore);
    triggerEffect(`$effect: Signal score changed to ${newScore}. Rank derived as "${newScore > 80 ? 'Master Engineer' : newScore > 40 ? 'Senior Architect' : 'Junior Hacker'}".`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--svelte-primary)]/30 bg-[var(--svelte-primary)]/10 text-[var(--svelte-primary)] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" /> Svelte 5 Runes Laboratory
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--svelte-text)]">
          Universal Signals <span className="text-[var(--svelte-primary)] svelte-glow">Sandbox</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--svelte-muted)] max-w-2xl leading-relaxed">
          Test Svelte 5 primitives in real-time. Experience fine-grained push-pull signals with zero Virtual DOM overhead.
        </p>
      </div>

      {/* Rune Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--svelte-border-subtle)] pb-4 overflow-x-auto">
        {(['$state', '$derived', '$effect', '$props'] as const).map((rune) => (
          <button
            key={rune}
            onClick={() => setActiveRune(rune)}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              activeRune === rune
                ? 'bg-[var(--svelte-primary)] text-white shadow-[0_0_15px_rgba(255,62,0,0.3)]'
                : 'border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] text-[var(--svelte-muted)] hover:text-[var(--svelte-text)]'
            }`}
          >
            {rune}()
          </button>
        ))}
      </div>

      {/* Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Signals Control Surface */}
        <div className="lg:col-span-6 rounded-2xl border border-[var(--svelte-border)] bg-[var(--svelte-surface)] p-8 space-y-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--svelte-border-subtle)] pb-4">
            <span className="font-mono text-xs text-[var(--svelte-primary)] uppercase tracking-wider font-bold">
              Signal Input Controller
            </span>
            <button
              onClick={() => {
                setFirstName('Ada');
                setLastName('Lovelace');
                setScore(42);
                setEffectLogs(['[0.00s] Reset signals state.']);
              }}
              className="text-[10px] font-mono text-[var(--svelte-muted)] hover:text-[var(--svelte-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset State
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-[var(--svelte-muted)]">
                let firstName = $state(&quot;{firstName}&quot;)
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  triggerEffect(`$effect: firstName signal updated to "${e.target.value}"`);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--svelte-border-subtle)] bg-[var(--svelte-bg)] font-mono text-xs text-[var(--svelte-text)] focus:border-[var(--svelte-primary)] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[var(--svelte-muted)]">
                let lastName = $state(&quot;{lastName}&quot;)
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  triggerEffect(`$effect: lastName signal updated to "${e.target.value}"`);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--svelte-border-subtle)] bg-[var(--svelte-bg)] font-mono text-xs text-[var(--svelte-text)] focus:border-[var(--svelte-primary)] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--svelte-muted)]">let score = $state({score})</span>
                <span className="text-[var(--svelte-primary)] font-bold">{score} pts</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateScore(-5)}
                  className="px-4 py-2 rounded-lg bg-[var(--svelte-bg)] border border-[var(--svelte-border-subtle)] text-xs font-mono hover:border-[var(--svelte-primary)]"
                >
                  -5 pts
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => updateScore(Number(e.target.value) - score)}
                  className="w-full accent-[var(--svelte-primary)] cursor-pointer"
                />
                <button
                  onClick={() => updateScore(+5)}
                  className="px-4 py-2 rounded-lg bg-[var(--svelte-primary)] text-white text-xs font-mono hover:bg-[var(--svelte-primary-hover)]"
                >
                  +5 pts
                </button>
              </div>
            </div>
          </div>

          {/* Derived Values Readout */}
          <div className="p-5 rounded-xl border border-[var(--svelte-mint)]/30 bg-[var(--svelte-mint)]/5 space-y-3">
            <span className="text-xs font-mono text-[var(--svelte-mint)] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> $derived() Reactive Values
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded bg-[var(--svelte-bg)] border border-[var(--svelte-border-subtle)]">
                <span className="text-[10px] font-mono text-[var(--svelte-muted)] block">fullName</span>
                <span className="font-mono font-bold text-sm text-[var(--svelte-text)]">{fullName}</span>
              </div>
              <div className="p-3 rounded bg-[var(--svelte-bg)] border border-[var(--svelte-border-subtle)]">
                <span className="text-[10px] font-mono text-[var(--svelte-muted)] block">computed rank</span>
                <span className="font-mono font-bold text-sm text-[var(--svelte-accent)]">{rank}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Reactive Signals Telemetry & Effects Log */}
        <div className="lg:col-span-6 space-y-8">
          {/* Signal Graph Visualizer */}
          <div className="rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--svelte-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> Live Signal Dependency Graph
              </span>
              <span className="text-[10px] font-mono text-[var(--svelte-mint)] px-2 py-0.5 rounded bg-[var(--svelte-mint)]/10 border border-[var(--svelte-mint)]/30">
                ACTIVE_SUBSCRIBERS: 3
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--svelte-bg)] border border-[var(--svelte-border-subtle)] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="p-2 rounded bg-[var(--svelte-primary)]/10 text-[var(--svelte-primary)] border border-[var(--svelte-primary)]/30">
                  [Source] score: {score}
                </div>
                <div className="text-[var(--svelte-muted)]">──&gt; (push dirty) ──&gt;</div>
                <div className="p-2 rounded bg-[var(--svelte-mint)]/10 text-[var(--svelte-mint)] border border-[var(--svelte-mint)]/30">
                  [Derived] rank: {rank}
                </div>
              </div>
            </div>
          </div>

          {/* $effect Execution Stream */}
          <div className="rounded-2xl border border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--svelte-cyan)] uppercase tracking-wider font-bold flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" /> $effect() Microtask Stream
              </span>
              <span className="text-[10px] font-mono text-[var(--svelte-muted)]">
                BATCHED_TICKS
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--svelte-bg)] font-mono text-[11px] space-y-2 border border-[var(--svelte-border-subtle)] max-h-48 overflow-y-auto">
              {effectLogs.map((log, index) => (
                <div key={index} className="text-[var(--svelte-cyan)] leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
