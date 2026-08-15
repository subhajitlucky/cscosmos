'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  HardDrive, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  ArrowRight
} from 'lucide-react';
import { ownershipScenarios, OwnershipStep } from '../data/simulations';

export function OwnershipVisualizer() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeScenario = ownershipScenarios[scenarioIndex];
  const stepData: OwnershipStep = activeScenario.steps[currentStep];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < activeScenario.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeScenario.steps.length]);

  const handleScenarioChange = (index: number) => {
    setScenarioIndex(index);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < activeScenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Scenario Selector & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--rust-border)] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--rust-text)] flex items-center">
            <Layers className="mr-2 h-5 w-5 text-[var(--rust-primary)]" />
            Stack vs Heap Memory Stepper
          </h3>
          <p className="text-xs text-[var(--rust-muted)]">
            Step through Rust execution to observe fat pointers, ownership transfer, and deterministic deallocation.
          </p>
        </div>

        {/* Scenario Buttons */}
        <div className="flex flex-wrap gap-2">
          {ownershipScenarios.map((scen, idx) => (
            <button
              key={scen.id}
              onClick={() => handleScenarioChange(idx)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                scenarioIndex === idx
                  ? 'bg-[var(--rust-primary)] text-white shadow-md'
                  : 'bg-[var(--rust-surface-2)] text-[var(--rust-muted)] hover:text-[var(--rust-text)] border border-[var(--rust-border)]'
              }`}
            >
              {scen.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Code Execution & Step Explanations (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Code Snippet Block */}
          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-2 mb-3">
              <span className="text-xs font-mono font-bold text-[var(--rust-primary)]">
                Step {currentStep + 1} of {activeScenario.steps.length}
              </span>
              <span className="text-[11px] font-mono text-[var(--rust-muted)]">Line {stepData.codeLine}</span>
            </div>

            <div className="font-mono text-sm bg-[var(--rust-bg)] p-3 rounded-lg border border-[var(--rust-border)] text-[var(--rust-text)]">
              <code className="text-[var(--rust-primary)] font-bold">{stepData.codeSnippet}</code>
            </div>

            {/* Explanation box */}
            <div className="mt-3 p-3 rounded-lg bg-[var(--rust-primary-light)] border border-[var(--rust-primary-border)] text-xs leading-relaxed text-[var(--rust-text)]">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--rust-primary)] mt-0.5 shrink-0" />
                <span>{stepData.explanation}</span>
              </div>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-text)] disabled:opacity-30 hover:border-[var(--rust-primary)] transition-colors"
                title="Previous step"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-8 items-center space-x-1.5 px-3 rounded-lg bg-[var(--rust-primary)] text-white text-xs font-bold hover:bg-[var(--rust-primary-hover)] transition-colors"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStep === activeScenario.steps.length - 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-text)] disabled:opacity-30 hover:border-[var(--rust-primary)] transition-colors"
                title="Next step"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center space-x-1 text-xs text-[var(--rust-muted)] hover:text-[var(--rust-text)] px-2.5 py-1.5 rounded-md hover:bg-[var(--rust-surface-2)] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </button>
          </div>

          {/* Step Progress Bar */}
          <div className="flex items-center space-x-1">
            {activeScenario.steps.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all ${
                  idx === currentStep
                    ? 'bg-[var(--rust-primary)]'
                    : idx < currentStep
                    ? 'bg-[var(--rust-primary)]/40'
                    : 'bg-[var(--rust-border)]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Visual Memory Architecture (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-5 shadow-sm space-y-6">
            
            {/* Memory Header */}
            <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-text)] flex items-center">
                <HardDrive className="mr-1.5 h-4 w-4 text-[var(--rust-cyan)]" />
                Physical Memory Architecture
              </span>
              <span className="text-[11px] font-mono text-[var(--rust-muted)]">64-bit Architecture</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Stack Frame Region */}
              <div className="rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--rust-cyan)] font-mono">STACK (LIFO)</span>
                  <span className="text-[10px] text-[var(--rust-muted)] font-mono">Fast / Contiguous</span>
                </div>

                {stepData.stackFrames.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-[var(--rust-muted)] border border-dashed border-[var(--rust-border)] rounded-lg">
                    Stack Frame Empty (Popped)
                  </div>
                ) : (
                  stepData.stackFrames.map((frame, fIdx) => (
                    <div key={fIdx} className="space-y-2.5">
                      <div className="text-[11px] font-mono text-[var(--rust-muted)] border-b border-[var(--rust-border-subtle)] pb-1">
                        Frame: {frame.name}
                      </div>

                      {frame.variables.map((v, vIdx) => {
                        const isMoved = v.status === 'moved';
                        const isDropped = v.status === 'dropped';

                        return (
                          <div
                            key={vIdx}
                            className={`rounded-md p-2.5 font-mono text-xs border transition-all ${
                              isMoved
                                ? 'border-dashed border-red-500/40 bg-red-950/10 text-red-400 opacity-60'
                                : isDropped
                                ? 'border-dashed border-[var(--rust-border)] opacity-30'
                                : 'border-[var(--rust-cyan)]/40 bg-[var(--rust-bg)] text-[var(--rust-text)] shadow-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[var(--rust-cyan)]">{v.name}</span>
                              <span className="text-[10px] text-[var(--rust-muted)]">{v.type}</span>
                            </div>

                            {isMoved ? (
                              <div className="text-[11px] font-bold text-rose-500 flex items-center">
                                <AlertCircle className="mr-1 h-3 w-3" />
                                MOVED (Invalidated)
                              </div>
                            ) : (
                              <div className="space-y-0.5 text-[11px] text-[var(--rust-muted)]">
                                <div>ptr: <span className="text-[var(--rust-primary)] font-bold">{v.heapAddress}</span></div>
                                {v.capacity !== undefined && (
                                  <div className="flex justify-between text-[10px]">
                                    <span>len: {v.length}</span>
                                    <span>cap: {v.capacity}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Heap Storage Region */}
              <div className="rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--rust-amber)] font-mono">HEAP (Dynamic)</span>
                  <span className="text-[10px] text-[var(--rust-muted)] font-mono">Managed by RAII</span>
                </div>

                {stepData.heapAllocations.map((h, hIdx) => (
                  <div
                    key={hIdx}
                    className={`rounded-md p-2.5 font-mono text-xs border transition-all ${
                      h.isFreed
                        ? 'border-dashed border-[var(--rust-border)] opacity-40 bg-[var(--rust-bg)]'
                        : 'border-[var(--rust-amber)]/40 bg-[var(--rust-bg)] text-[var(--rust-text)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px]">
                      <span className="text-[var(--rust-amber)] font-bold">{h.address}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        h.isFreed ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {h.isFreed ? 'FREED' : `Owner: ${h.owner}`}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-[var(--rust-surface)] border border-[var(--rust-border-subtle)] text-center text-xs font-bold tracking-wider text-[var(--rust-text)]">
                      {h.isFreed ? (
                        <span className="flex items-center justify-center text-zinc-500 text-[11px]">
                          <Trash2 className="mr-1 h-3 w-3" /> Deallocated
                        </span>
                      ) : (
                        h.content
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Pointer Link Indicator */}
            <div className="rounded-lg border border-[var(--rust-border-subtle)] bg-[var(--rust-bg)] p-3 text-[11px] text-[var(--rust-muted)] flex items-center justify-between">
              <span className="font-mono">Fat Pointer (Stack) 24B</span>
              <ArrowRight className="h-4 w-4 text-[var(--rust-primary)]" />
              <span className="font-mono">Heap Buffer ({stepData.heapAllocations.filter(h => !h.isFreed).length} active)</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
