'use client';

import React, { useState } from 'react';
import {
  Workflow,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Terminal,
  Activity,
  ArrowRight,
  Zap,
  Cpu
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Topic 25: Build Your First Tiny AI Pipeline (Interactive Pipeline Builder) */
/* -------------------------------------------------------------------------- */
export function FirstTinyPipelineWidget() {
  const [inputText, setInputText] = useState('This AI engineering curriculum is incredibly fast and clear!');
  const [step, setStep] = useState<number>(0);

  // Simulated pipeline transforms
  const cleanedText = inputText.toLowerCase().replace(/[^\w\s]/g, '');
  const tokens = cleanedText.split(/\s+/).filter(Boolean);

  // Positive vs negative lexicon weights
  const positiveLexicon = ['fast', 'clear', 'incredibly', 'good', 'great', 'love', 'smart', 'accurate'];
  const negativeLexicon = ['slow', 'bad', 'broken', 'error', 'hate', 'terrible', 'confusing'];

  let dotProduct = 0.5; // Base bias
  tokens.forEach((t) => {
    if (positiveLexicon.includes(t)) dotProduct += 1.2;
    if (negativeLexicon.includes(t)) dotProduct -= 1.2;
  });

  const probability = 1 / (1 + Math.exp(-dotProduct));
  const isPositive = probability >= 0.5;

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="space-y-2">
        <label className="text-muted-foreground text-[11px] block">Pipeline Input String:</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setStep(0);
          }}
          className="w-full rounded-lg border border-border/80 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-foreground/50"
        />
      </div>

      {/* 4 Pipeline Stages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {['1. Preprocess', '2. Tokenize', '3. Dot Product', '4. Activation'].map((label, idx) => (
          <button
            key={label}
            onClick={() => setStep(idx)}
            className={`p-3 rounded-xl border text-center transition-all ${
              step === idx
                ? 'border-foreground bg-foreground text-background font-bold shadow-sm'
                : step > idx
                ? 'border-emerald-500/40 bg-secondary/40 text-foreground'
                : 'border-border bg-secondary/20 text-muted-foreground'
            }`}
          >
            <div className="text-[10px] opacity-75">STAGE 0{idx + 1}</div>
            <div className="font-bold text-xs mt-0.5">{label.split(' ')[1]}</div>
          </button>
        ))}
      </div>

      {/* Active Stage Details */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4">
        {step === 0 && (
          <div className="space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Stage 1: Text Sanitization &amp; Lowercasing</span>
            <div className="p-3 rounded bg-secondary/40 text-foreground text-xs break-all">
              Cleaned String: &ldquo;{cleanedText}&rdquo;
            </div>
            <p className="text-xs font-sans text-muted-foreground">
              Removes punctuation noise and standardizes letter casing to ensure consistent vocabulary mapping.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Stage 2: Discrete Token Partitioning</span>
            <div className="flex flex-wrap gap-1.5 p-3 rounded bg-secondary/40">
              {tokens.map((tok, i) => (
                <span key={i} className="px-2 py-0.5 rounded border border-border/80 bg-secondary font-bold text-foreground text-[11px]">
                  {tok}
                </span>
              ))}
            </div>
            <p className="text-xs font-sans text-muted-foreground">
              Deconstructs string into {tokens.length} distinct discrete token entities.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Stage 3: Parameter Weights Affine Sum: z = w &middot; x + b</span>
            <div className="p-3 rounded bg-secondary/40 text-foreground text-xs flex justify-between items-center">
              <span>Affine Accumulator z:</span>
              <span className="text-base font-bold">{dotProduct.toFixed(2)}</span>
            </div>
            <p className="text-xs font-sans text-muted-foreground">
              Positive words add +1.2 weight; negative words subtract -1.2 weight; initial bias intercept = +0.5.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Stage 4: Non-Linear Sigmoid &sigma;(z) Output</span>
              <span className={`px-2.5 py-0.5 rounded font-bold ${isPositive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'}`}>
                {isPositive ? 'SENTIMENT: POSITIVE' : 'SENTIMENT: NEGATIVE'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Class Confidence:</span>
              <span className="text-foreground font-bold">{(probability * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full rounded bg-secondary overflow-hidden">
              <div className="h-full bg-foreground transition-all duration-300" style={{ width: `${probability * 100}%` }} />
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-between items-center">
          <button
            onClick={() => setStep((prev) => (prev + 1) % 4)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background font-bold hover:bg-foreground/90 transition-colors"
          >
            {step === 3 ? 'Restart Pipeline' : 'Next Stage'} <ArrowRight className="h-3 w-3" />
          </button>
          <span className="text-muted-foreground text-[11px]">Step {step + 1} of 4</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 26: Mini Project (Capstone Live Inference Pipeline Console)          */
/* -------------------------------------------------------------------------- */
export function PipelineCapstoneWidget() {
  const [query, setQuery] = useState('Production inference runtime with zero server latency.');
  const [sensitivity, setSensitivity] = useState<number>(1.2);
  const [biasIntercept, setBiasIntercept] = useState<number>(0.2);

  // Live client-side inference math
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const tokenCount = tokens.length;
  const rawSum = tokenCount * 0.15 * sensitivity + biasIntercept;
  const probability = 1 / (1 + Math.exp(-rawSum));

  const simulatedFlops = tokenCount * 4096 * 2;
  const simulatedLatencyMs = (tokenCount * 0.4 + 1.2).toFixed(1);

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-2">
        <label className="text-muted-foreground text-[11px] block">Live Capstone Input Inference Prompt:</label>
        <textarea
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border/80 bg-secondary/40 p-3 text-xs font-mono text-foreground focus:outline-none focus:border-foreground/50 resize-none"
        />
      </div>

      {/* Live Interactive Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-border/80 bg-secondary/20 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Parameter Weight Multiplier (w):</span>
            <span className="text-foreground font-bold">{sensitivity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-secondary/20 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Decision Threshold Bias (b):</span>
            <span className="text-foreground font-bold">{biasIntercept.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-1.0"
            max="1.0"
            step="0.1"
            value={biasIntercept}
            onChange={(e) => setBiasIntercept(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Model Forward Pass Telemetry Dashboard */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Client-Side Runtime Prediction:</span>
            <div className="text-base font-bold text-foreground">
              {probability >= 0.5 ? 'VALIDATED // HIGH CONFIDENCE' : 'REJECTED // LOW CONFIDENCE'}
            </div>
          </div>
          <span className="text-lg font-bold text-emerald-500 font-mono">
            {(probability * 100).toFixed(1)}% Score
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-0.5">
            <span className="text-[10px] text-muted-foreground">Tokens Parsed</span>
            <div className="text-base font-bold text-foreground">{tokenCount} Tokens</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-0.5">
            <span className="text-[10px] text-muted-foreground">FLOPs Executed</span>
            <div className="text-base font-bold text-foreground">{(simulatedFlops / 1000).toFixed(1)}k FLOPs</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-0.5">
            <span className="text-[10px] text-muted-foreground">Affine Tensor (z)</span>
            <div className="text-base font-bold text-foreground">{rawSum.toFixed(3)}</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-0.5">
            <span className="text-[10px] text-muted-foreground">Execution Latency</span>
            <div className="text-base font-bold text-emerald-500">{simulatedLatencyMs} ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}
