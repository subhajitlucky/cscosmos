'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  GitCommit, 
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { lifetimeScenarios, LifetimeScenario } from '../data/simulations';

export function LifetimeVisualizer() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const scenario: LifetimeScenario = lifetimeScenarios[selectedIdx];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--rust-border)] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--rust-text)] flex items-center">
            <Clock className="mr-2 h-5 w-5 text-[var(--rust-cyan)]" />
            Lifetime Lifespan &amp; Variance Timeline
          </h3>
          <p className="text-xs text-[var(--rust-muted)]">
            Analyze lifespan overlap constraints and verify when a reference outlives its source data.
          </p>
        </div>

        <div className="flex gap-2">
          {lifetimeScenarios.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedIdx === idx
                  ? 'bg-[var(--rust-primary)] text-white shadow-md'
                  : 'bg-[var(--rust-surface-2)] text-[var(--rust-muted)] hover:text-[var(--rust-text)] border border-[var(--rust-border)]'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Code Box with Syntax Lines (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-2 mb-3">
              <span className="text-xs font-mono font-bold text-[var(--rust-primary)]">Source Code</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                scenario.isValid
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
              }`}>
                {scenario.isValid ? 'Valid Lifetimes' : 'Lifetimes Error (E0597)'}
              </span>
            </div>

            <div className="bg-[var(--rust-bg)] p-3 rounded-lg border border-[var(--rust-border)] font-mono text-xs overflow-x-auto">
              <pre className="text-[var(--rust-text)] leading-relaxed">
                {scenario.code.split('\n').map((line, lIdx) => (
                  <div key={lIdx} className="flex">
                    <span className="w-8 text-[var(--rust-muted)] select-none text-[10px]">{lIdx + 1}</span>
                    <span className={lIdx + 1 === 7 && !scenario.isValid ? 'text-rose-400 font-bold' : ''}>
                      {line}
                    </span>
                  </div>
                ))}
              </pre>
            </div>

            {/* Error reason alert if invalid */}
            {!scenario.isValid && scenario.errorReason && (
              <div className="mt-3 p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs text-rose-300 flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-200">Borrow Checker Rejection:</div>
                  <div>{scenario.errorReason}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Visual Lifespan Timeline Bars (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-5 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-text)]">
                Lifespan Timeline (Lines 1 to 9)
              </span>
              <span className="text-[10px] font-mono text-[var(--rust-muted)]">Rule: Data life &ge; Loan life</span>
            </div>

            {/* Visual Timeline Bars */}
            <div className="space-y-4">
              {scenario.lifetimes.map((lt, idx) => (
                <div key={idx} className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[var(--rust-text)]">{lt.name}</span>
                    <span className="text-[var(--rust-muted)] text-[10px]">Lines {lt.startLine} &rarr; {lt.endLine}</span>
                  </div>

                  {/* Visual Bar representation */}
                  <div className="h-6 w-full rounded-md bg-[var(--rust-surface-2)] p-1 flex items-center border border-[var(--rust-border)]">
                    <div
                      style={{
                        marginLeft: `${(lt.startLine - 1) * 11}%`,
                        width: `${(lt.endLine - lt.startLine + 1) * 11}%`,
                      }}
                      className="h-full rounded bg-[var(--rust-primary)] text-white text-[10px] font-bold flex items-center justify-center shadow-sm"
                    >
                      {lt.endLine - lt.startLine + 1} lines
                    </div>
                  </div>
                  <div className="text-[10px] text-[var(--rust-muted)]">{lt.description}</div>
                </div>
              ))}
            </div>

            {/* Lifetime Subtyping (Variance) Cheat Sheet Box */}
            <div className="rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-3.5 space-y-2 text-xs">
              <div className="font-bold text-[var(--rust-text)] flex items-center">
                <GitCommit className="h-3.5 w-3.5 text-[var(--rust-primary)] mr-1.5" />
                Lifetime Subtyping &amp; Variance Rules
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[var(--rust-muted)]">
                <div className="p-2 rounded bg-[var(--rust-bg)] border border-[var(--rust-border-subtle)]">
                  <div className="text-[var(--rust-emerald)] font-bold">&amp;&apos;a T (Covariant)</div>
                  <div>Can substitute longer lifetime for shorter</div>
                </div>
                <div className="p-2 rounded bg-[var(--rust-bg)] border border-[var(--rust-border-subtle)]">
                  <div className="text-[var(--rust-rose)] font-bold">&amp;&apos;a mut T (Invariant)</div>
                  <div>Exact lifetime match required (no substitution)</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
