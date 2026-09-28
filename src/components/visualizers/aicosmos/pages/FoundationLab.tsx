'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  Play,
  CheckCircle2,
  Sliders,
  Terminal,
  Activity,
  Layers,
  ArrowRight
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
    labelFormat: (p) =>
      p
        ? { text: 'POSITIVE REVIEW', color: 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10' }
        : { text: 'NEGATIVE REVIEW', color: 'text-rose-500 border-rose-500/40 bg-rose-500/10' },
  },
  {
    id: 'credit',
    name: 'Credit Risk Scoring',
    description: 'Assessing loan approval likelihood based on normalized applicant solvency.',
    defaultInput: 0.8,
    defaultWeight: 2.1,
    defaultBias: -1.0,
    activation: 'sigmoid',
    labelFormat: (p) =>
      p
        ? { text: 'LOAN APPROVED', color: 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10' }
        : { text: 'REJECTED / HIGH RISK', color: 'text-rose-500 border-rose-500/40 bg-rose-500/10' },
  },
  {
    id: 'spam',
    name: 'Email Spam Filter',
    description: 'Classifying emails based on phishing trigger keyword density.',
    defaultInput: -0.5,
    defaultWeight: 2.5,
    defaultBias: 0.1,
    activation: 'step',
    labelFormat: (p) =>
      p
        ? { text: 'SPAM DETECTED', color: 'text-rose-500 border-rose-500/40 bg-rose-500/10' }
        : { text: 'LEGITIMATE (HAM)', color: 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10' },
  },
];

interface FoundationLabProps {
  basePath?: string;
}

export function FoundationLab({ basePath = '/ai/ai-engineering-foundations' }: FoundationLabProps) {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [inputVal, setInputVal] = useState<number>(PRESETS[0].defaultInput);
  const [weight, setWeight] = useState<number>(PRESETS[0].defaultWeight);
  const [bias, setBias] = useState<number>(PRESETS[0].defaultBias);
  const [activation, setActivation] = useState<'sigmoid' | 'relu' | 'linear' | 'step'>(PRESETS[0].activation);
  const [threshold, setThreshold] = useState<number>(0.5);

  const [animating, setAnimating] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(3);

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

  // Pipeline calculations
  const z = useMemo(() => weight * inputVal + bias, [weight, inputVal, bias]);

  const activatedOutput = useMemo(() => {
    if (activation === 'sigmoid') return 1 / (1 + Math.exp(-z));
    if (activation === 'relu') return Math.max(0, z);
    if (activation === 'step') return z >= 0 ? 1 : 0;
    return z;
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
      }, (step + 1) * 450);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4 text-xs font-mono text-muted-foreground">
        <Link
          href={basePath}
          className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Foundations Matrix
        </Link>
        <span className="font-semibold text-foreground">
          // STUDIO_01 &bull; DETERMINISTIC PIPELINE BENCH
        </span>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="rounded border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
            BENCHMARK LAB 01
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight font-display">
          The Micro-Model Studio
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Step directly inside the deterministic mathematical execution loop of a learned model. Tune weight coefficients (w), bias intercepts (b), choose non-linear activation functions, and inspect intermediate memory registers transforming into classified predictions.
        </p>
      </header>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
        <span className="text-muted-foreground mr-1">SCENARIOS:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelectPreset(preset)}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              selectedPreset.id === preset.id
                ? 'border-foreground bg-foreground text-background font-bold'
                : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Studio Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Parameter Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Sliders className="h-4 w-4 text-foreground" /> Parameter Registers
              </h2>
              <button
                onClick={reset}
                className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                title="Reset sliders to preset defaults"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Defaults
              </button>
            </div>

            {/* Input Feature (x) */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-foreground">Input Scalar (x)</span>
                <span className="font-bold text-foreground">{inputVal.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="3.0"
                step="0.1"
                value={inputVal}
                onChange={(e) => setInputVal(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>-3.0 (Low)</span>
                <span>0.0</span>
                <span>+3.0 (High)</span>
              </div>
            </div>

            {/* Learned Weight (w) */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-foreground">Weight Coefficient (w)</span>
                <span className="font-bold text-foreground">{weight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="3.0"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>-3.0 (Inhibitory)</span>
                <span>0.0</span>
                <span>+3.0 (Excitatory)</span>
              </div>
            </div>

            {/* Learned Bias (b) */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-foreground">Bias Intercept (b)</span>
                <span className="font-bold text-foreground">{bias.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="2.0"
                step="0.1"
                value={bias}
                onChange={(e) => setBias(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>-2.0 (Strict)</span>
                <span>0.0</span>
                <span>+2.0 (Permissive)</span>
              </div>
            </div>

            {/* Activation Function */}
            <div className="space-y-2">
              <span className="font-mono text-xs text-foreground font-semibold">Activation Function &sigma;(z)</span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {(['sigmoid', 'relu', 'step', 'linear'] as const).map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setActivation(fn)}
                    className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                      activation === fn
                        ? 'border-foreground bg-foreground text-background font-bold'
                        : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {fn.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Decision Threshold */}
            <div className="space-y-1.5 pt-2 border-t border-border/80">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-foreground">Decision Threshold (&tau;)</span>
                <span className="font-bold text-foreground">{threshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={runStepper}
            disabled={animating}
            className="w-full py-3 rounded-lg bg-foreground text-background font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            <Play className="h-4 w-4" /> Run Step-by-Step Pipeline Animation
          </button>
        </div>

        {/* Right Column: 4-Stage Transparent Execution Pipeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <span className="font-mono text-xs text-muted-foreground uppercase">// PIPELINE TELEMETRY</span>
                <h3 className="font-display font-bold text-xl text-foreground">
                  {selectedPreset.name}
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground hidden sm:block">
                4-Stage Execution
              </span>
            </div>

            {/* 4 Pipeline Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stage 1 */}
              <div
                className={`p-4 rounded-xl border transition-colors ${
                  activeStep >= 0
                    ? 'border-foreground/40 bg-secondary/30'
                    : 'border-border/40 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-foreground">01 / FEATURE INGESTION</span>
                  {activeStep >= 0 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-foreground">
                  x = {inputVal.toFixed(2)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Normalized scalar input representation.
                </p>
              </div>

              {/* Stage 2 */}
              <div
                className={`p-4 rounded-xl border transition-colors ${
                  activeStep >= 1
                    ? 'border-foreground/40 bg-secondary/30'
                    : 'border-border/40 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-foreground">02 / LINEAR COMBINATION (z)</span>
                  {activeStep >= 1 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-foreground">
                  z = {z.toFixed(2)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground font-mono">
                  ({weight.toFixed(1)} &times; {inputVal.toFixed(1)}) + {bias.toFixed(1)}
                </p>
              </div>

              {/* Stage 3 */}
              <div
                className={`p-4 rounded-xl border transition-colors ${
                  activeStep >= 2
                    ? 'border-foreground/40 bg-secondary/30'
                    : 'border-border/40 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-foreground">03 / ACTIVATION &sigma;(z)</span>
                  {activeStep >= 2 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-foreground">
                  a = {activatedOutput.toFixed(3)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground font-mono">
                  Applied {activation.toUpperCase()} non-linearity.
                </p>
              </div>

              {/* Stage 4 */}
              <div
                className={`p-4 rounded-xl border transition-colors ${
                  activeStep >= 3
                    ? 'border-foreground/40 bg-secondary/30'
                    : 'border-border/40 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-foreground">04 / DECISION VERDICT</span>
                  {activeStep >= 3 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
                <div className="mt-2.5">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-mono font-bold border ${verdict.color}`}>
                    {verdict.text}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground font-mono">
                  Score {activatedOutput.toFixed(2)} {isPositive ? '&ge;' : '<'} Threshold {threshold.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Live State Machine Table */}
            <div className="p-4 rounded-xl border border-border/80 bg-secondary/20 font-mono text-xs space-y-2">
              <span className="text-muted-foreground">&gt; Intermediate Register State:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-foreground font-medium">
                <div>Input x: <span className="font-bold">{inputVal.toFixed(2)}</span></div>
                <div>Weighted w&middot;x: <span className="font-bold">{(weight * inputVal).toFixed(2)}</span></div>
                <div>Linear z: <span className="font-bold">{z.toFixed(2)}</span></div>
                <div>Probability: <span className="font-bold text-emerald-500">{(activatedOutput * 100).toFixed(1)}%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
