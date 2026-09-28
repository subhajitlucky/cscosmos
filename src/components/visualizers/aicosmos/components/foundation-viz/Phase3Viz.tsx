'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Layers,
  BarChart3,
  TrendingDown,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Topic 13: Parameters (Tensor Inspector & Quantization Calculator)          */
/* -------------------------------------------------------------------------- */
export function TensorInspectorWidget() {
  const [paramCount, setParamCount] = useState<number>(7);
  const [precision, setPrecision] = useState<'fp32' | 'fp16' | 'int8' | 'int4'>('fp16');

  const byteMultipliers = {
    fp32: 4,
    fp16: 2,
    int8: 1,
    int4: 0.5
  };

  const bytesPerParam = byteMultipliers[precision];
  const memoryGb = (paramCount * bytesPerParam).toFixed(2);
  const macRamRecommended = (parseFloat(memoryGb) * 1.2).toFixed(1);

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Model Scale */}
        <div className="space-y-2">
          <label className="text-muted-foreground">Model Scale (Billion Parameters):</label>
          <div className="flex gap-2">
            {[1, 3, 7, 13, 70].map((count) => (
              <button
                key={count}
                onClick={() => setParamCount(count)}
                className={`flex-1 py-1.5 rounded border transition-colors ${
                  paramCount === count
                    ? 'border-foreground bg-foreground text-background font-bold'
                    : 'border-border bg-secondary/30 text-muted-foreground'
                }`}
              >
                {count}B
              </button>
            ))}
          </div>
        </div>

        {/* Quantization Format */}
        <div className="space-y-2">
          <label className="text-muted-foreground">Quantization Precision:</label>
          <div className="flex gap-2">
            {(['fp32', 'fp16', 'int8', 'int4'] as const).map((prec) => (
              <button
                key={prec}
                onClick={() => setPrecision(prec)}
                className={`flex-1 py-1.5 rounded border uppercase transition-colors ${
                  precision === prec
                    ? 'border-foreground bg-foreground text-background font-bold'
                    : 'border-border bg-secondary/30 text-muted-foreground'
                }`}
              >
                {prec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Memory Telemetry */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <span className="text-muted-foreground">Total Model Weights Size:</span>
            <div className="text-2xl font-bold text-foreground">{memoryGb} GB</div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-muted-foreground">Unified Memory Required:</span>
            <div className="text-sm font-bold text-emerald-500">~{macRamRecommended} GB RAM</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase">Bits Per Weight</span>
            <div className="text-base font-bold text-foreground">
              {precision === 'fp32' ? '32 bits' : precision === 'fp16' ? '16 bits' : precision === 'int8' ? '8 bits' : '4 bits'}
            </div>
            <div className="text-[10px] text-muted-foreground">{bytesPerParam} bytes per param</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase">Perplexity Impact</span>
            <div className="text-base font-bold text-foreground">
              {precision === 'int4' ? 'Mild (+0.12 PPL)' : precision === 'int8' ? 'Negligible' : 'Zero Loss'}
            </div>
            <div className="text-[10px] text-muted-foreground">Weight degradation</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase">Inference Speedup</span>
            <div className="text-base font-bold text-foreground">
              {precision === 'int4' ? '~3.5x Faster' : precision === 'int8' ? '~2.0x Faster' : '1.0x Baseline'}
            </div>
            <div className="text-[10px] text-muted-foreground">Memory bandwidth bound</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 14: Hyperparameters (Learning Rate Gradient Descent Simulator)       */
/* -------------------------------------------------------------------------- */
export function HyperparameterTuningWidget() {
  const [learningRate, setLearningRate] = useState<number>(0.1);
  const [positionW, setPositionW] = useState<number>(4.0);
  const [stepCount, setStepCount] = useState<number>(0);

  // Parabolic loss: L(w) = w^2. Gradient: dL/dw = 2w.
  // Update step: w_new = w - lr * 2w
  const takeStep = () => {
    const gradient = 2 * positionW;
    const newW = positionW - learningRate * gradient;
    setPositionW(parseFloat(newW.toFixed(3)));
    setStepCount((prev) => prev + 1);
  };

  const reset = () => {
    setPositionW(4.0);
    setStepCount(0);
  };

  const currentLoss = (positionW * positionW).toFixed(2);

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Learning Rate (&eta;): {learningRate.toFixed(2)}</span>
          <span className="text-[11px] text-muted-foreground">
            {learningRate < 0.05 ? 'Under-damped (Slow)' : learningRate > 0.8 ? 'Dangerous (Oscillation / Divergence!)' : 'Optimal Convergence'}
          </span>
        </div>
        <div className="flex gap-2">
          {[0.02, 0.1, 0.3, 0.8, 1.05].map((lr) => (
            <button
              key={lr}
              onClick={() => {
                setLearningRate(lr);
                reset();
              }}
              className={`flex-1 py-1.5 rounded border transition-colors ${
                learningRate === lr
                  ? 'border-foreground bg-foreground text-background font-bold'
                  : 'border-border bg-secondary/30 text-muted-foreground'
              }`}
            >
              {lr}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="space-y-0.5">
            <span className="text-muted-foreground">Parameter Position (w):</span>
            <div className="text-2xl font-bold text-foreground">{positionW}</div>
          </div>
          <div className="space-y-0.5 sm:text-right">
            <span className="text-muted-foreground">Objective Loss L(w) = w&sup2;:</span>
            <div className="text-xl font-bold text-emerald-500">{currentLoss}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={takeStep}
            className="px-4 py-2 rounded-lg bg-foreground text-background font-bold hover:bg-foreground/90 transition-colors"
          >
            Step Gradient Descent (Step #{stepCount})
          </button>
          <button
            onClick={reset}
            className="px-3 py-2 rounded-lg border border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>

        {Math.abs(positionW) > 20 && (
          <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-500 font-semibold">
            WARNING: GRADIENT EXPLOSION / DIVERGENCE! The learning rate &eta; = {learningRate} is too large.
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 15: Weights (Multi-Feature Weight Attribution)                       */
/* -------------------------------------------------------------------------- */
export function MultiFeatureWeightWidget() {
  const [w1, setW1] = useState(1.2);
  const [w2, setW2] = useState(-0.8);
  const [w3, setW3] = useState(0.5);

  const x1 = 2.0; // Word positive count
  const x2 = 1.5; // Typos count
  const x3 = 3.0; // Account age

  const score1 = w1 * x1;
  const score2 = w2 * x2;
  const score3 = w3 * x3;
  const totalScore = score1 + score2 + score3;

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight w₁ (Positive Signals)</span>
            <span className="text-foreground font-bold">{w1.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={w1}
            onChange={(e) => setW1(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-[10px] text-muted-foreground">Input Feature x₁ = {x1}</div>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight w₂ (Typo Penalty)</span>
            <span className="text-foreground font-bold">{w2.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={w2}
            onChange={(e) => setW2(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-[10px] text-muted-foreground">Input Feature x₂ = {x2}</div>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight w₃ (Account Age)</span>
            <span className="text-foreground font-bold">{w3.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={w3}
            onChange={(e) => setW3(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-[10px] text-muted-foreground">Input Feature x₃ = {x3}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <span className="text-muted-foreground">Feature Vector Dot Product: w &middot; x</span>
          <span className="text-lg font-bold text-foreground">{totalScore.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="p-2 rounded bg-secondary/40">
            <div className="text-muted-foreground">Contrib 1</div>
            <div className="font-bold text-foreground">{score1.toFixed(2)}</div>
          </div>
          <div className="p-2 rounded bg-secondary/40">
            <div className="text-muted-foreground">Contrib 2</div>
            <div className="font-bold text-foreground">{score2.toFixed(2)}</div>
          </div>
          <div className="p-2 rounded bg-secondary/40">
            <div className="text-muted-foreground">Contrib 3</div>
            <div className="font-bold text-foreground">{score3.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 16: Bias (Decision Boundary & Intercept Shift)                       */
/* -------------------------------------------------------------------------- */
export function BiasOffsetWidget() {
  const [bias, setBias] = useState<number>(0.0);
  const inputX = 1.0;
  const weight = 2.0;

  const rawZ = weight * inputX + bias;
  const isActivated = rawZ >= 0;

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bias Parameter (b): Intercept Shift</span>
          <span className="text-foreground font-bold text-sm">{bias.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="-4"
          max="4"
          step="0.2"
          value={bias}
          onChange={(e) => setBias(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>-4.0 (Suppresses Activation)</span>
          <span>0.0 (Neutral)</span>
          <span>+4.0 (Triggers Activation)</span>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-muted-foreground">Threshold Equation: z = (2.0 &times; 1.0) + ({bias.toFixed(1)}) = {rawZ.toFixed(1)}</span>
          <span className={`px-3 py-1 rounded font-bold ${isActivated ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'}`}>
            {isActivated ? 'STATE: FIRED (1)' : 'STATE: INHIBITED (0)'}
          </span>
        </div>

        <p className="text-xs font-sans text-muted-foreground leading-relaxed">
          <strong>Key Mental Model:</strong> Bias enables the neuron to output non-zero values even when all input features x are exactly zero, shifting the hyper-plane decision boundary across space.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 17: Features (2D Continuous Feature Space Vector Embedding)          */
/* -------------------------------------------------------------------------- */
export function FeaturesVectorWidget() {
  const [selectedEntity, setSelectedEntity] = useState<string>('Cat');

  const entities = [
    { name: 'Cat', f1: 0.85, f2: 0.25, label: 'Biological / Small' },
    { name: 'Dog', f1: 0.88, f2: 0.45, label: 'Biological / Medium' },
    { name: 'Laptop', f1: -0.75, f2: 0.20, label: 'Electronic / Portable' },
    { name: 'Cloud Server', f1: -0.92, f2: 0.95, label: 'Electronic / Massive' },
  ];

  const current = entities.find((e) => e.name === selectedEntity) || entities[0];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="space-y-2">
        <label className="text-muted-foreground text-[11px] block">Select Real-World Entity to Project:</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {entities.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedEntity(item.name)}
              className={`p-3 rounded-lg border text-center transition-colors ${
                selectedEntity === item.name
                  ? 'border-foreground bg-foreground text-background font-bold'
                  : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase">Dense Vector Representation</span>
            <div className="text-base font-bold text-foreground mt-0.5">
              vec({current.name}) = [{current.f1.toFixed(2)}, {current.f2.toFixed(2)}] &isin; &Ropf;&sup2;
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded border border-border bg-secondary/50 text-foreground font-semibold">
            {current.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase">Dimension 1: Animacy</span>
            <div className="text-lg font-bold text-foreground">
              {current.f1 > 0 ? `+${current.f1.toFixed(2)} (Biological)` : `${current.f1.toFixed(2)} (Silicon/Tech)`}
            </div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase">Dimension 2: Scale/Weight</span>
            <div className="text-lg font-bold text-foreground">
              {current.f2.toFixed(2)} (Normalized Mass)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 18: Labels (Cross-Entropy Loss Calculator)                           */
/* -------------------------------------------------------------------------- */
export function LabelsLossWidget() {
  const [groundTruth, setGroundTruth] = useState<0 | 1>(1);
  const [predictedP, setPredictedP] = useState<number>(0.85);

  // Binary Cross Entropy: - [y * log(p) + (1-y) * log(1-p)]
  const eps = 1e-7;
  const p = Math.max(eps, Math.min(1 - eps, predictedP));
  const bceLoss = - (groundTruth * Math.log(p) + (1 - groundTruth) * Math.log(1 - p));

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ground Truth Label */}
        <div className="space-y-2">
          <label className="text-muted-foreground">Ground Truth Label (y &isin; &#123;0, 1&#125;):</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGroundTruth(1)}
              className={`flex-1 py-2 rounded-lg border font-bold ${
                groundTruth === 1 ? 'border-foreground bg-foreground text-background' : 'border-border bg-secondary/30 text-muted-foreground'
              }`}
            >
              y = 1 (Positive / True)
            </button>
            <button
              onClick={() => setGroundTruth(0)}
              className={`flex-1 py-2 rounded-lg border font-bold ${
                groundTruth === 0 ? 'border-foreground bg-foreground text-background' : 'border-border bg-secondary/30 text-muted-foreground'
              }`}
            >
              y = 0 (Negative / False)
            </button>
          </div>
        </div>

        {/* Model Predicted Probability */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Model Output Probability (ŷ):</span>
            <span className="text-foreground font-bold">{(predictedP * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.99"
            step="0.01"
            value={predictedP}
            onChange={(e) => setPredictedP(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0% (Certain False)</span>
            <span>100% (Certain True)</span>
          </div>
        </div>
      </div>

      {/* Computed Loss Feedback */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-muted-foreground">Binary Cross-Entropy Loss:</span>
          <span className={`text-2xl font-bold ${bceLoss > 1.5 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {bceLoss.toFixed(4)}
          </span>
        </div>

        <p className="text-xs font-sans text-muted-foreground leading-relaxed">
          {bceLoss > 1.5
            ? 'Severe loss penalty incurred! The model was confidently incorrect, forcing large gradient updates back through the weights.'
            : 'Low loss penalty! The model prediction aligns closely with the verified ground truth.'}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 19: Predictions (Softmax Probability Distribution Normalizer)        */
/* -------------------------------------------------------------------------- */
export function SoftmaxDistributionWidget() {
  const [z1, setZ1] = useState<number>(2.5);
  const [z2, setZ2] = useState<number>(1.0);
  const [z3, setZ3] = useState<number>(-0.5);

  const exp1 = Math.exp(z1);
  const exp2 = Math.exp(z2);
  const exp3 = Math.exp(z3);
  const sumExp = exp1 + exp2 + exp3;

  const p1 = exp1 / sumExp;
  const p2 = exp2 / sumExp;
  const p3 = exp3 / sumExp;

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Raw Logit z₁ (Class A)</span>
            <span className="text-foreground font-bold">{z1.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-3"
            max="5"
            step="0.5"
            value={z1}
            onChange={(e) => setZ1(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Raw Logit z₂ (Class B)</span>
            <span className="text-foreground font-bold">{z2.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-3"
            max="5"
            step="0.5"
            value={z2}
            onChange={(e) => setZ2(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Raw Logit z₃ (Class C)</span>
            <span className="text-foreground font-bold">{z3.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-3"
            max="5"
            step="0.5"
            value={z3}
            onChange={(e) => setZ3(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Normalized Softmax Probabilities */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <span className="text-muted-foreground">Normalized Probability Distribution: &Sigma; p = 1.00 (100%)</span>
          <span className="text-emerald-500 font-bold">ArgMax: {p1 > p2 && p1 > p3 ? 'Class A' : p2 > p3 ? 'Class B' : 'Class C'}</span>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-foreground font-bold">Class A: p₁ = e^z₁ / &Sigma; e^z</span>
              <span className="text-foreground">{(p1 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full rounded bg-secondary overflow-hidden">
              <div className="h-full bg-foreground transition-all duration-200" style={{ width: `${p1 * 100}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-foreground font-bold">Class B: p₂ = e^z₂ / &Sigma; e^z</span>
              <span className="text-foreground">{(p2 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full rounded bg-secondary overflow-hidden">
              <div className="h-full bg-foreground transition-all duration-200" style={{ width: `${p2 * 100}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-foreground font-bold">Class C: p₃ = e^z₃ / &Sigma; e^z</span>
              <span className="text-foreground">{(p3 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full rounded bg-secondary overflow-hidden">
              <div className="h-full bg-foreground transition-all duration-200" style={{ width: `${p3 * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
