'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Lock, 
  Unlock,
  Eye,
  Edit3
} from 'lucide-react';
import { borrowScenarios, BorrowStep } from '../data/simulations';

export function BorrowCheckerVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const scenario = borrowScenarios[0];
  const stepData: BorrowStep = scenario.steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[var(--rust-border)] pb-4">
        <h3 className="text-lg font-bold text-[var(--rust-text)] flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5 text-[var(--rust-emerald)]" />
          Aliasing XOR Mutability Conflict Inspector
        </h3>
        <p className="text-xs text-[var(--rust-muted)]">
          Observe how the compiler verifies reader/writer exclusion and non-lexical lifetime scopes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Code Stepper (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-2 mb-3">
              <span className="text-xs font-mono font-bold text-[var(--rust-primary)]">
                Step {currentStep + 1} of {scenario.steps.length}
              </span>
              <span className="text-[11px] font-mono text-[var(--rust-muted)]">Line {stepData.codeLine}</span>
            </div>

            <div className={`font-mono text-sm p-3 rounded-lg border text-[var(--rust-text)] ${
              stepData.isConflict 
                ? 'bg-rose-950/20 border-rose-500/50 text-rose-300' 
                : 'bg-[var(--rust-bg)] border-[var(--rust-border)]'
            }`}>
              <code>{stepData.codeSnippet}</code>
            </div>

            {/* Explanation box */}
            <div className={`mt-3 p-3 rounded-lg text-xs leading-relaxed border ${
              stepData.isConflict
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : 'bg-[var(--rust-primary-light)] border-[var(--rust-primary-border)] text-[var(--rust-text)]'
            }`}>
              <div className="flex items-start space-x-2">
                {stepData.isConflict ? (
                  <AlertTriangle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-[var(--rust-primary)] mt-0.5 shrink-0" />
                )}
                <span>{stepData.explanation}</span>
              </div>
            </div>

            {/* Compiler Diagnostic Output if conflict */}
            {stepData.isConflict && stepData.compilerDiagnostic && (
              <div className="mt-3 p-3 rounded-lg bg-black/80 border border-rose-500/60 font-mono text-[11px] text-rose-400 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-500">rustc Compiler Diagnostic:</div>
                <pre className="whitespace-pre-wrap">{stepData.compilerDiagnostic}</pre>
              </div>
            )}
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-text)] disabled:opacity-30 hover:border-[var(--rust-primary)] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => setCurrentStep(Math.min(scenario.steps.length - 1, currentStep + 1))}
                disabled={currentStep === scenario.steps.length - 1}
                className="flex h-8 items-center space-x-1.5 px-3 rounded-lg bg-[var(--rust-primary)] text-white text-xs font-bold hover:bg-[var(--rust-primary-hover)] transition-colors"
              >
                <span>Next Line</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              onClick={() => setCurrentStep(0)}
              className="flex items-center space-x-1 text-xs text-[var(--rust-muted)] hover:text-[var(--rust-text)] px-2.5 py-1.5 rounded-md hover:bg-[var(--rust-surface-2)] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </button>
          </div>
        </div>

        {/* Right: Active Loans & Variable State Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-5 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-text)] flex items-center">
                <Eye className="mr-1.5 h-4 w-4 text-[var(--rust-primary)]" />
                Active Loans & Ownership State
              </span>
              <span className="text-[11px] font-mono text-[var(--rust-muted)]">Rule: &amp;T (many) XOR &amp;mut T (1)</span>
            </div>

            {/* Variable Status Cards */}
            <div className="space-y-3">
              {stepData.variableState.map((v, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border p-3.5 flex items-center justify-between transition-all ${
                    v.status === 'frozen'
                      ? 'border-cyan-500/40 bg-cyan-950/10'
                      : v.status === 'immutable_loan'
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-[var(--rust-border)] bg-[var(--rust-surface-2)]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--rust-bg)] font-mono font-bold text-xs text-[var(--rust-primary)] border border-[var(--rust-border)]">
                      {v.name}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-[var(--rust-text)]">{v.value}</div>
                      <div className="text-[11px] text-[var(--rust-muted)]">
                        {v.status === 'frozen' && 'Frozen (Immutable Read Lock active)'}
                        {v.status === 'immutable_loan' && 'Shared Reference Loan (&)'}
                        {v.status === 'owned' && 'Owned & Mutable'}
                      </div>
                    </div>
                  </div>

                  <div>
                    {v.status === 'frozen' ? (
                      <span className="flex items-center space-x-1 px-2 py-1 rounded bg-cyan-900/40 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                        <Lock className="h-3 w-3 mr-1" /> FROZEN
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 px-2 py-1 rounded bg-[var(--rust-surface)] text-[var(--rust-muted)] text-[10px] font-mono border border-[var(--rust-border)]">
                        <Unlock className="h-3 w-3 mr-1 text-emerald-400" /> READY
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Active Loans Table */}
            <div className="rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-3.5 space-y-2">
              <div className="text-xs font-bold text-[var(--rust-text)]">Active Loan Registry</div>
              {stepData.activeLoans.length === 0 ? (
                <div className="text-xs font-mono text-[var(--rust-muted)] py-2">No active borrows held.</div>
              ) : (
                stepData.activeLoans.map((loan, lIdx) => (
                  <div key={lIdx} className="flex items-center justify-between font-mono text-xs p-2 rounded bg-[var(--rust-bg)] border border-[var(--rust-border)]">
                    <span className="text-[var(--rust-emerald)] font-bold">{loan.borrower} &rarr; &amp;{loan.target}</span>
                    <span className="text-[10px] text-[var(--rust-muted)]">Scope: {loan.scopeSpan}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                      {loan.kind}
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
