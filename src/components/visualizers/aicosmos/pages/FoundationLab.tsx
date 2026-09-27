'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  Play,
  CheckCircle2,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  Layers,
  HelpCircle
} from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  description: string;
  defaultInput: number;
  labelFormat: (pred: boolean) => { text: string; color: string };
  defaultWeight: number;
  defaultBias: number;
  activation: 'sigmoid' | 'relu' | 'linear' | 'step';
}

const PRESETS: Preset[] = [
  {
    id: 'sentiment',
    name: 'Customer Review Sentiment',
    description: 'Predicting customer satisfaction from review sentiment features.',
    defaultInput: 1.5,
    defaultWeight: 1.4,
    defaultBias: -0.2,
    activation: 'sigmoid',
    labelFormat: (p) => p ? { text: 'POSITIVE REVIEW', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' } : { text: 'NEGATIVE REVIEW', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' }
  },
  {
    id: 'credit',
    name: 'Credit Risk Scoring',
    description: 'Assessing loan approval likelihood based on normalized applicant solvency.',
    defaultInput: 0.8,
    defaultWeight: 2.1,
    defaultBias: -1.0,
    activation: 'sigmoid',
    labelFormat: (p) => p ? { text: 'LOAN APPROVED', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' } : { text: 'REJECTED / HIGH RISK', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' }
  },
  {
    id: 'spam',
    name: 'Email Spam Filter',
    description: 'Classifying emails based on phishing trigger keyword density.',
    defaultInput: -0.5,
    defaultWeight: 2.5,
    defaultBias: 0.1,
    activation: 'step',
    labelFormat: (p) => p ? { text: 'SPAM DETECTED', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' } : { text: 'LEGITIMATE (HAM)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
  }
];

export function FoundationLab() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [inputVal, setInputVal] = useState<number>(PRESETS[0].defaultInput);
  const [weight, setWeight] = useState<number>(PRESETS[0].defaultWeight);
  const [bias, setBias] = useState<number>(PRESETS[0].defaultBias);
  const [activation, setActivation] = useState<'sigmoid' | 'relu' | 'linear' | 'step'>(PRESETS[0].activation);
  const [threshold, setThreshold] = useState<number>(0.5);

  const [animating, setAnimating] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(3); // All stages illuminated

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPreset(preset);
    setInputVal(preset.defaultInput);
    setWeight(preset.defaultWeight);
    setBias(preset.defaultBias);
    setActivation(preset.activation);
  };

  const reset = () => {
    setInputVal(selectedPreset.defaultInput);
    setWeight(selectedPreset.defaultWeight);
    setBias(selectedPreset.defaultBias);
    setActivation(selectedPreset.activation);
    setThreshold(0.5);
    setActiveStep(3);
  };

  // Mathematical pipeline calculation
  const z = useMemo(() => weight * inputVal + bias, [weight, inputVal, bias]);

  const activatedOutput = useMemo(() => {
    if (activation === 'sigmoid') return 1 / (1 + Math.exp(-z));
    if (activation === 'relu') return Math.max(0, z);
    if (activation === 'step') return z >= 0 ? 1 : 0;
    return z; // linear
  }, [z, activation]);

  const isPositive = activatedOutput >= threshold;
  const verdict = selectedPreset.labelFormat(isPositive);

  const runStepper = () => {
    setAnimating(true);
    setActiveStep(0);
    [0, 1, 2, 3].forEach((step) => {
      setTimeout(() => {
        setActiveStep(step);
        if (step === 3) setAnimating(false);
      }, (step + 1) * 550);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/aicosmos/learn/ai-engineering-foundations"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Foundations Curriculum
        </Link>
        <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          MICRO-MODEL STUDIO &bull; LAB 01
        </span>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--ai-primary)] uppercase tracking-wider font-semibold">
            Interactive Workbench
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[var(--ai-text)] tracking-tight">
          The Micro-Model Studio
        </h1>
        <p className="text-base sm:text-lg text-[var(--ai-muted)] max-w-3xl leading-relaxed">
          Step directly inside the mathematical execution loop of a machine learning model. Adjust input features, tune weights (slope) and bias (intercept), choose non-linear activation functions, and watch every intermediate computation transform into a final decision.
        </p>
      </header>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-[var(--ai-muted)]">Select Preset Scenario:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelectPreset(preset)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
              selectedPreset.id === preset.id
                ? 'bg-[var(--ai-primary)] text-white font-bold shadow-md'
                : 'border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Studio Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-surface)] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--ai-border-subtle)] pb-3">
              <h2 className="font-display font-bold text-lg text-[var(--ai-text)] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[var(--ai-primary)]" /> Parameter Controls
              </h2>
              <button
                onClick={reset}
                className="text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-text)] flex items-center gap-1"
                title="Reset sliders to preset defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Input Feature (x) */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[var(--ai-text)] font-semibold">Input Feature (x)</span>
                <span className="text-[var(--ai-primary)] font-bold">{inputVal.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="3.0"
                step="0.1"
                value={inputVal}
                onChange={(e) => setInputVal(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--ai-muted)]">
                <span>-3.0 (Low)</span>
                <span>0.0</span>
                <span>+3.0 (High)</span>
              </div>
            </div>

            {/* Learned Weight (w) */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[var(--ai-text)] font-semibold">Weight Coefficient (w)</span>
                <span className="text-emerald-400 font-bold">{weight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="3.0"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--ai-muted)]">
                <span>-3.0 (Inhibitory)</span>
                <span>0.0</span>
                <span>+3.0 (Excitatory)</span>
              </div>
            </div>

            {/* Learned Bias (b) */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[var(--ai-text)] font-semibold">Learned Bias (b)</span>
                <span className="text-purple-400 font-bold">{bias.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="2.0"
                step="0.1"
                value={bias}
                onChange={(e) => setBias(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--ai-muted)]">
                <span>-2.0 (Strict)</span>
                <span>0.0</span>
                <span>+2.0 (Permissive)</span>
              </div>
            </div>

            {/* Activation Function */}
            <div className="space-y-2">
              <span className="font-mono text-xs text-[var(--ai-text)] font-semibold">Activation Function &sigma;(z)</span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {(['sigmoid', 'relu', 'step', 'linear'] as const).map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setActivation(fn)}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      activation === fn
                        ? 'border-[var(--ai-primary)] bg-[var(--ai-primary)]/20 text-[var(--ai-text)] font-bold'
                        : 'border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
                    }`}
                  >
                    {fn.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Decision Threshold */}
            <div className="space-y-2 pt-2 border-t border-[var(--ai-border-subtle)]">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[var(--ai-text)] font-semibold">Decision Threshold (&tau;)</span>
                <span className="text-cyan-400 font-bold">{threshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          <button
            onClick={runStepper}
            disabled={animating}
            className="w-full py-3.5 rounded-xl bg-[var(--ai-primary)] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[var(--ai-primary-hover)] active:scale-95 transition-all shadow-lg"
          >
            <Play className="w-4 h-4" /> Run Step-by-Step Pipeline Animation
          </button>
        </div>

        {/* Right Column: 4-Stage Transparent Pipeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-surface)] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--ai-border-subtle)] pb-4">
              <div>
                <span className="font-mono text-xs text-[var(--ai-primary)] uppercase">Live Architecture</span>
                <h3 className="font-display font-bold text-xl text-[var(--ai-text)]">
                  {selectedPreset.name} Pipeline
                </h3>
              </div>
              <span className="text-xs font-mono text-[var(--ai-muted)] hidden sm:block">
                4-Stage Execution
              </span>
            </div>

            {/* 4 Pipeline Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stage 1 */}
              <div
                className={`p-5 rounded-xl border transition-all duration-300 ${
                  activeStep >= 0
                    ? 'border-indigo-500/40 bg-indigo-500/5 shadow-md'
                    : 'border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-indigo-400 font-bold">01 / FEATURE INGESTION</span>
                  {activeStep >= 0 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="mt-3 text-2xl font-bold font-mono text-[var(--ai-text)]">
                  x = {inputVal.toFixed(2)}
                </div>
                <p className="mt-1 text-xs text-[var(--ai-muted)]">
                  Normalized scalar input representation.
                </p>
              </div>

              {/* Stage 2 */}
              <div
                className={`p-5 rounded-xl border transition-all duration-300 ${
                  activeStep >= 1
                    ? 'border-emerald-500/40 bg-emerald-500/5 shadow-md'
                    : 'border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-emerald-400 font-bold">02 / LINEAR SUM (z)</span>
                  {activeStep >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="mt-3 text-2xl font-bold font-mono text-[var(--ai-text)]">
                  z = {z.toFixed(2)}
                </div>
                <p className="mt-1 text-xs text-[var(--ai-muted)] font-mono">
                  ({weight.toFixed(1)} &times; {inputVal.toFixed(1)}) + {bias.toFixed(1)}
                </p>
              </div>

              {/* Stage 3 */}
              <div
                className={`p-5 rounded-xl border transition-all duration-300 ${
                  activeStep >= 2
                    ? 'border-purple-500/40 bg-purple-500/5 shadow-md'
                    : 'border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-purple-400 font-bold">03 / ACTIVATION &sigma;(z)</span>
                  {activeStep >= 2 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="mt-3 text-2xl font-bold font-mono text-[var(--ai-text)]">
                  a = {activatedOutput.toFixed(3)}
                </div>
                <p className="mt-1 text-xs text-[var(--ai-muted)] font-mono">
                  Applied {activation.toUpperCase()} function.
                </p>
              </div>

              {/* Stage 4 */}
              <div
                className={`p-5 rounded-xl border transition-all duration-300 ${
                  activeStep >= 3
                    ? 'border-cyan-500/40 bg-cyan-500/5 shadow-md'
                    : 'border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-cyan-400 font-bold">04 / DECISION VERDICT</span>
                  {activeStep >= 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="mt-2.5">
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-mono font-bold border ${verdict.color}`}>
                    {verdict.text}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--ai-muted)] font-mono">
                  Score {activatedOutput.toFixed(2)} {isPositive ? '&ge;' : '<'} Threshold {threshold.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Live State Machine Table */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/40 font-mono text-xs space-y-2">
              <span className="text-[var(--ai-muted)]">&gt; Intermediate Memory Buffer:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[var(--ai-text)]">
                <div>Input x: <span className="text-indigo-400">{inputVal.toFixed(2)}</span></div>
                <div>Weighted w&middot;x: <span className="text-emerald-400">{(weight * inputVal).toFixed(2)}</span></div>
                <div>Linear z: <span className="text-purple-400">{z.toFixed(2)}</span></div>
                <div>Confidence: <span className="text-cyan-400">{(activatedOutput * 100).toFixed(1)}%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
