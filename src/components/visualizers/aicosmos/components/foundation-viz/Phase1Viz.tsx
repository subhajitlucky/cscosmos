'use client';

import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  BrainCircuit,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Activity,
  Zap
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Topic 01: What is Artificial Intelligence? (AI Taxonomy Hierarchy)         */
/* -------------------------------------------------------------------------- */
export function AiTaxonomyWidget() {
  const [selectedLayer, setSelectedLayer] = useState<'ai' | 'ml' | 'dl' | 'genai' | 'llm'>('llm');

  const layers = {
    ai: {
      name: 'Artificial Intelligence',
      scope: 'The Broad Destination (1950s+)',
      tag: 'SUPERSET',
      desc: 'All computational systems executing tasks historically associated with biological cognition (symbolic logic, heuristic graph search, expert systems, and statistical learning).',
      examples: 'A* Pathfinding, Minimax Alpha-Beta Chess, Expert Rule Systems, LLMs',
      mathNote: 'Encompasses both deterministic symbolic algorithms and statistical optimization.'
    },
    ml: {
      name: 'Machine Learning',
      scope: 'Empirical Parameter Learning (1980s+)',
      tag: 'PARADIGM',
      desc: 'Algorithms whose performance on task T improves with empirical experience E. Instead of hardcoding conditional branching, the machine optimizes parameter weights directly from datasets.',
      examples: 'Linear Regression, XGBoost, Random Forests, K-Means Clustering, SVMs',
      mathNote: 'Optimizes objective loss function: argmin_θ L(y, f(x; θ))'
    },
    dl: {
      name: 'Deep Learning',
      scope: 'Hierarchical Multi-Layer Networks (2010s+)',
      tag: 'ARCHITECTURE',
      desc: 'Deep neural networks with stacked linear transformations and non-linear activations that learn representations hierarchically from raw signals without manual feature engineering.',
      examples: 'ResNet, Convolutions (CNNs), Transformers, Multi-Layer Perceptrons (MLPs)',
      mathNote: 'Layer composition: h^(l+1) = σ(W^(l) h^(l) + b^(l))'
    },
    genai: {
      name: 'Generative AI',
      scope: 'Sampling Learned Distributions (2020s+)',
      tag: 'OBJECTIVE',
      desc: 'Probabilistic models that learn the underlying joint distribution P(X) of high-dimensional data, allowing synthetic generation of novel, coherent text, images, or audio samples.',
      examples: 'Latent Diffusion (Stable Diffusion), VAEs, Autoregressive Transformers',
      mathNote: 'Samples from learned probability density: x_new ~ P_θ(X)'
    },
    llm: {
      name: 'Large Language Models',
      scope: 'Scale & Emergent In-Context Reasoning',
      tag: 'FRONTIER',
      desc: 'Autoregressive Transformer networks parameterized by billions to trillions of weights, pre-trained on internet-scale token streams to predict the next token with high fidelity.',
      examples: 'Claude 3.5 Sonnet, GPT-4, Llama 3, Gemini 1.5',
      mathNote: 'Maximizes log-likelihood: Σ log P(w_t | w_1, ..., w_{t-1}; θ)'
    }
  };

  const active = layers[selectedLayer];

  return (
    <div className="space-y-6">
      {/* Category Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        {(Object.keys(layers) as Array<keyof typeof layers>).map((key) => {
          const item = layers[key];
          const isSelected = selectedLayer === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedLayer(key)}
              className={`p-3 rounded-lg border text-center transition-all ${
                isSelected
                  ? 'border-foreground bg-foreground text-background font-bold shadow-sm'
                  : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-foreground/30'
              }`}
            >
              <div className="text-[10px] opacity-70 tracking-widest uppercase">{item.tag}</div>
              <div className="font-bold truncate mt-0.5">{item.name.split(' ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Taxonomy Detail Card */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              TAXONOMY LEVEL: {active.tag}
            </span>
            <h3 className="font-display font-bold text-xl text-foreground mt-0.5">
              {active.name}
            </h3>
          </div>
          <span className="font-mono text-xs px-3 py-1 rounded-full border border-border bg-secondary/60 text-foreground font-semibold">
            {active.scope}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
          {active.desc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
          <div className="rounded-lg border border-border/60 bg-secondary/40 p-3 space-y-1">
            <span className="text-muted-foreground block text-[10px] uppercase">Canonical Artifacts:</span>
            <span className="text-foreground font-semibold">{active.examples}</span>
          </div>
          <div className="rounded-lg border border-border/60 bg-secondary/40 p-3 space-y-1">
            <span className="text-muted-foreground block text-[10px] uppercase">Mathematical Formulation:</span>
            <span className="text-foreground font-semibold font-mono text-[11px]">{active.mathNote}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 02: AI vs Machine Learning (Rule-Based vs Learned Engine)            */
/* -------------------------------------------------------------------------- */
export function RuleVsLearnedInteractiveWidget() {
  const [inputText, setInputText] = useState('Claim your $1000 prize now! Click here.');
  const [activeEngine, setActiveEngine] = useState<'rule' | 'learned'>('learned');

  // Hardcoded keywords for rule engine
  const spamKeywords = ['urgent', 'lottery', 'free', 'crypto', 'prize', 'winner'];
  const hasSpamKeyword = spamKeywords.some((w) =>
    inputText.toLowerCase().includes(w)
  );

  // Simulated learned dense semantic similarity
  const lower = inputText.toLowerCase();
  let learnedScore = 0.15;
  if (lower.includes('prize') || lower.includes('claim')) learnedScore += 0.45;
  if (lower.includes('$') || lower.includes('free') || lower.includes('crypto')) learnedScore += 0.35;
  if (lower.includes('click') || lower.includes('http')) learnedScore += 0.2;
  const clampedScore = Math.min(0.99, Math.max(0.05, learnedScore));

  const sampleInputs = [
    'Claim your $1000 prize now! Click here.',
    'Urgent! Your account requires verification.',
    'Hey, are we still meeting for lunch at 12:30?',
    'You are our lucky winner today!!'
  ];

  return (
    <div className="space-y-6">
      {/* Input Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-muted-foreground block">
          Test Incoming Email Payload:
        </label>
        <div className="flex flex-wrap gap-2">
          {sampleInputs.map((sample) => (
            <button
              key={sample}
              onClick={() => setInputText(sample)}
              className={`text-left px-3 py-1.5 rounded-lg border font-mono text-xs transition-colors ${
                inputText === sample
                  ? 'border-foreground bg-foreground text-background font-semibold'
                  : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              &ldquo;{sample.slice(0, 32)}...&rdquo;
            </button>
          ))}
        </div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Or type custom text to test..."
          className="w-full rounded-lg border border-border/80 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
        />
      </div>

      {/* Engine Switcher */}
      <div className="flex rounded-lg border border-border/80 bg-secondary/30 p-1 font-mono text-xs">
        <button
          onClick={() => setActiveEngine('rule')}
          className={`flex-1 py-2 rounded-md font-bold transition-all ${
            activeEngine === 'rule' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Traditional Rule Engine (Software 1.0)
        </button>
        <button
          onClick={() => setActiveEngine('learned')}
          className={`flex-1 py-2 rounded-md font-bold transition-all ${
            activeEngine === 'learned' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Learned Statistical Model (Software 2.0)
        </button>
      </div>

      {/* Execution Diagnostics */}
      {activeEngine === 'rule' ? (
        <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Execution Pattern: Deterministic If/Else Matching</span>
            <span className={`px-2.5 py-1 rounded font-bold ${hasSpamKeyword ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'}`}>
              {hasSpamKeyword ? 'MATCHED SPAM FILTER' : 'PASSED (HAM)'}
            </span>
          </div>

          <div className="p-3 rounded border border-border/60 bg-secondary/40 space-y-1 text-[11px]">
            <div className="text-muted-foreground">// Hardcoded Logic</div>
            <div className="text-foreground">
              if (payload.containsAny([&quot;urgent&quot;, &quot;lottery&quot;, &quot;prize&quot;])) return SPAM;
            </div>
          </div>

          <p className="text-xs font-sans text-muted-foreground leading-relaxed">
            <strong>Vulnerability:</strong> Rigid syntax brittle to evasion. A simple intentional typo like &ldquo;pr1ze&rdquo; or phrasing like &ldquo;reward available&rdquo; completely bypasses the filter.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Execution Pattern: Continuous Embedding Dot-Product</span>
            <span className={`px-2.5 py-1 rounded font-bold ${clampedScore > 0.65 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'}`}>
              {clampedScore > 0.65 ? 'SPAM PREDICTED' : 'INBOX (HAM)'}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Spam Likelihood Confidence: σ(w · x + b)</span>
              <span className="text-foreground font-bold">{(clampedScore * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full rounded bg-secondary overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${clampedScore > 0.65 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${clampedScore * 100}%` }}
              />
            </div>
          </div>

          <p className="text-xs font-sans text-muted-foreground leading-relaxed">
            <strong>Advantage:</strong> Maps text into dense geometric latent space. Generalizes across synonyms, semantic tone, and adversarial typos without explicit manual regex rule authoring.
          </p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 03: Machine Learning vs Deep Learning (Hierarchical Representations)  */
/* -------------------------------------------------------------------------- */
export function RepresentationLearningWidget() {
  const [mode, setMode] = useState<'classical' | 'deep'>('deep');
  const [activeLayer, setActiveLayer] = useState<number>(3);

  const deepLayers = [
    { level: 'Layer 01', name: 'Low-Level Features', desc: 'Oriented Gabor edges, color gradients, texture patches, token subwords.' },
    { level: 'Layer 02', name: 'Mid-Level Motifs', desc: 'Geometric corners, curves, contours, syntactic grammar phrases.' },
    { level: 'Layer 03', name: 'High-Level Semantics', desc: 'Object parts (eyes, wheels), semantic intent, entity relations.' },
    { level: 'Layer 04', name: 'Class Prediction', desc: 'Final linear projection logits: P(y = Class_k | x)' }
  ];

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex rounded-lg border border-border/80 bg-secondary/30 p-1 font-mono text-xs">
        <button
          onClick={() => setMode('classical')}
          className={`flex-1 py-2 rounded-md font-bold transition-all ${
            mode === 'classical' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Classical ML: Handcrafted Features
        </button>
        <button
          onClick={() => setMode('deep')}
          className={`flex-1 py-2 rounded-md font-bold transition-all ${
            mode === 'deep' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Deep Learning: Learned Representations
        </button>
      </div>

      {mode === 'classical' ? (
        <div className="rounded-xl border border-border/80 bg-secondary/20 p-6 space-y-4 font-mono text-xs">
          <div className="text-foreground font-bold">Classical Machine Learning Pipeline</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
              <span className="text-[10px] text-muted-foreground">STAGE 01</span>
              <div className="font-bold text-foreground">Raw Data</div>
              <p className="text-[11px] text-muted-foreground">Images / Raw Text</p>
            </div>
            <div className="p-4 rounded-lg border border-amber-500/40 bg-amber-500/10 space-y-1">
              <span className="text-[10px] text-amber-500 font-bold">HUMAN BOTTLENECK</span>
              <div className="font-bold text-foreground">Manual Feature Eng.</div>
              <p className="text-[11px] text-muted-foreground">SIFT, HOG, TF-IDF, Regex</p>
            </div>
            <div className="p-4 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
              <span className="text-[10px] text-muted-foreground">STAGE 03</span>
              <div className="font-bold text-foreground">Classifier</div>
              <p className="text-[11px] text-muted-foreground">SVM, Logistic Reg, XGBoost</p>
            </div>
          </div>
          <p className="text-xs font-sans text-muted-foreground leading-relaxed">
            The performance ceiling is heavily limited by human domain knowledge and the quality of manually engineered features.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-secondary/20 p-6 space-y-5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-foreground font-bold">End-to-End Deep Representation Hierarchy</span>
            <span className="text-xs text-emerald-500 font-mono">Hierarchical Abstraction</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {deepLayers.map((l, idx) => (
              <button
                key={l.level}
                onClick={() => setActiveLayer(idx)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeLayer === idx
                    ? 'border-foreground bg-foreground text-background shadow-sm'
                    : 'border-border/80 bg-secondary/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="text-[10px] font-mono opacity-80">{l.level}</span>
                <div className="font-bold text-sm mt-0.5">{l.name}</div>
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-border/60 bg-secondary/40 p-4 space-y-1">
            <div className="text-muted-foreground text-[10px] uppercase font-bold">
              {deepLayers[activeLayer].level} Active Inspection:
            </div>
            <div className="text-foreground font-sans text-xs sm:text-sm">
              {deepLayers[activeLayer].desc}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 04: What is Generative AI? (Latent Space Sampling)                   */
/* -------------------------------------------------------------------------- */
export function GenerativeSamplingWidget() {
  const [dim1, setDim1] = useState(0.4);
  const [dim2, setDim2] = useState(-0.2);

  // Compute synthetic probability density & latent coordinates
  const radius = Math.sqrt(dim1 * dim1 + dim2 * dim2);
  const density = Math.exp(-0.5 * radius * radius) / (2 * Math.PI);

  const styleAttributes = [
    { label: 'Formality / Tone', value: Math.round((dim1 + 1) * 50) },
    { label: 'Technical Complexity', value: Math.round((-dim2 + 1) * 50) },
    { label: 'Creativity Entropy', value: Math.round((radius / 1.414) * 100) }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latent Dimension z₁ (Semantic Axis X)</span>
            <span className="text-foreground font-bold">{dim1.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={dim1}
            onChange={(e) => setDim1(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latent Dimension z₂ (Semantic Axis Y)</span>
            <span className="text-foreground font-bold">{dim2.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={dim2}
            onChange={(e) => setDim2(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Latent Vector Visualization */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <span className="text-muted-foreground">Latent Sample Coordinate:</span>
            <div className="text-sm font-bold text-foreground">
              z = [{dim1.toFixed(2)}, {dim2.toFixed(2)}] &sim; N(0, I)
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-muted-foreground">Probability Density P(z):</span>
            <div className="text-sm font-bold text-emerald-500">{(density * 100).toFixed(2)}%</div>
          </div>
        </div>

        {/* Synthesized Output Attributes */}
        <div className="space-y-3">
          <span className="text-[11px] text-muted-foreground uppercase font-bold block">
            Decoded Synthetic Artifact Attributes:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {styleAttributes.map((attr) => (
              <div key={attr.label} className="rounded-lg border border-border/60 bg-secondary/40 p-3 space-y-1">
                <span className="text-muted-foreground text-[10px] block">{attr.label}</span>
                <div className="text-base font-bold text-foreground">{attr.value}%</div>
                <div className="h-1.5 w-full rounded bg-secondary overflow-hidden">
                  <div className="h-full bg-foreground transition-all duration-150" style={{ width: `${attr.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 05: What is an AI Model? (Model as a Mathematical Function)          */
/* -------------------------------------------------------------------------- */
export function ModelMathFunctionWidget() {
  const [inputX, setInputX] = useState<number>(3.0);
  const [weightW, setWeightW] = useState<number>(1.8);
  const [biasB, setBiasB] = useState<number>(-1.2);
  const [activation, setActivation] = useState<'linear' | 'relu' | 'sigmoid'>('relu');

  const linearZ = weightW * inputX + biasB;

  let outputY = linearZ;
  if (activation === 'relu') outputY = Math.max(0, linearZ);
  if (activation === 'sigmoid') outputY = 1 / (1 + Math.exp(-linearZ));

  return (
    <div className="space-y-6">
      {/* Mathematical Mapping Header */}
      <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 text-center font-mono text-sm sm:text-base text-foreground">
        <span className="text-muted-foreground font-normal">Canonical Mapping: </span>
        <strong className="underline underline-offset-4">y = &sigma;(w &middot; x + b)</strong>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Input Signal (x)</span>
            <span className="text-foreground font-bold">{inputX.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={inputX}
            onChange={(e) => setInputX(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Parameter: Weight (w)</span>
            <span className="text-foreground font-bold">{weightW.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.2"
            value={weightW}
            onChange={(e) => setWeightW(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Parameter: Bias (b)</span>
            <span className="text-foreground font-bold">{biasB.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={biasB}
            onChange={(e) => setBiasB(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Activation Function Switcher */}
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Activation &sigma;:</span>
        {(['linear', 'relu', 'sigmoid'] as const).map((act) => (
          <button
            key={act}
            onClick={() => setActivation(act)}
            className={`px-3 py-1.5 rounded-lg border uppercase font-bold transition-all ${
              activation === act
                ? 'border-foreground bg-foreground text-background'
                : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            {act}
          </button>
        ))}
      </div>

      {/* Live Computation Trace */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-2 font-mono text-xs">
        <div className="text-muted-foreground text-[10px] uppercase">Intermediate Tensor Registers:</div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-foreground">
          <div>
            Affine Sum (z) = ({weightW.toFixed(1)} &times; {inputX.toFixed(1)}) + ({biasB.toFixed(1)}) = <strong>{linearZ.toFixed(2)}</strong>
          </div>
          <div className="px-4 py-2 rounded-lg border border-border bg-secondary/50 font-bold text-emerald-500">
            Output y = {outputY.toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 06: What is a Machine Learning Model? (Generalization Curve)         */
/* -------------------------------------------------------------------------- */
export function GeneralizationCurveWidget() {
  const [complexity, setComplexity] = useState<'underfit' | 'optimal' | 'overfit'>('optimal');

  const configs = {
    underfit: {
      title: 'Underfitting (High Bias)',
      desc: 'Model capacity is too weak (e.g. straight line attempting to fit a quadratic curve). High train error and high test error.',
      trainError: '38.4%',
      valError: '42.1%',
      verdict: 'FAILURE // Model cannot capture underlying data manifold.'
    },
    optimal: {
      title: 'Optimal Fit (Balanced Generalization)',
      desc: 'Model balances capacity and regularization. Accurately captures signal while ignoring random noise. Low train error and low test error.',
      trainError: '4.2%',
      valError: '5.1%',
      verdict: 'PRODUCTION READY // Strong generalization to unseen data.'
    },
    overfit: {
      title: 'Overfitting (High Variance)',
      desc: 'Model capacity is excessive (e.g. 15-degree polynomial memorizing exact coordinates). Zero training loss, but catastrophic validation error.',
      trainError: '0.0%',
      valError: '48.9%',
      verdict: 'FAILURE // Model memorized training noise.'
    }
  };

  const curr = configs[complexity];

  return (
    <div className="space-y-6">
      {/* Complexity Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
        {(['underfit', 'optimal', 'overfit'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setComplexity(mode)}
            className={`p-3 rounded-lg border text-center transition-all ${
              complexity === mode
                ? 'border-foreground bg-foreground text-background font-bold shadow-sm'
                : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            {configs[mode].title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Diagnostic Overview */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-6 space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          <h3 className="font-display font-bold text-lg text-foreground">{curr.title}</h3>
          <span className={`px-2.5 py-1 rounded font-bold text-xs ${complexity === 'optimal' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'}`}>
            {curr.verdict}
          </span>
        </div>

        <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {curr.desc}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-lg border border-border/60 bg-secondary/40 space-y-1 text-center">
            <span className="text-muted-foreground text-[10px] uppercase">Training Set Loss</span>
            <div className="text-2xl font-bold text-foreground">{curr.trainError}</div>
          </div>
          <div className="p-4 rounded-lg border border-border/60 bg-secondary/40 space-y-1 text-center">
            <span className="text-muted-foreground text-[10px] uppercase">Validation Set Loss</span>
            <div className={`text-2xl font-bold ${complexity === 'optimal' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {curr.valError}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 07: What is an LLM? (Next Token Generator with Prompt Selection)     */
/* -------------------------------------------------------------------------- */
export function NextTokenInteractiveWidget() {
  const [temperature, setTemperature] = useState(0.7);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);

  const prompts = [
    {
      prompt: 'Artificial Intelligence is transforming the',
      candidates: [
        { token: 'world', prob: 0.58 },
        { token: 'future', prob: 0.22 },
        { token: 'industry', prob: 0.12 },
        { token: 'economy', prob: 0.08 }
      ]
    },
    {
      prompt: 'To optimize the latency of neural network inference, we should',
      candidates: [
        { token: 'quantize', prob: 0.52 },
        { token: 'batch', prob: 0.28 },
        { token: 'compile', prob: 0.14 },
        { token: 'prune', prob: 0.06 }
      ]
    },
    {
      prompt: 'The Transformer architecture relies on multi-head self-',
      candidates: [
        { token: 'attention', prob: 0.94 },
        { token: 'assembly', prob: 0.03 },
        { token: 'alignment', prob: 0.02 },
        { token: 'adaptation', prob: 0.01 }
      ]
    }
  ];

  const current = prompts[selectedPromptIndex];

  // Adjust probabilities by temperature: P_i = P_i^(1/T) / Z
  const adjusted = current.candidates.map((t) => {
    const raw = Math.pow(t.prob, 1 / Math.max(0.05, temperature));
    return { ...t, raw };
  });
  const sumRaw = adjusted.reduce((acc, c) => acc + c.raw, 0);
  const normalized = adjusted.map((t) => ({ ...t, finalProb: t.raw / sumRaw }));

  return (
    <div className="space-y-6">
      {/* Prompt Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-muted-foreground block">
          Select Context Sequence:
        </label>
        <div className="flex flex-wrap gap-2">
          {prompts.map((p, i) => (
            <button
              key={p.prompt}
              onClick={() => setSelectedPromptIndex(i)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-colors ${
                selectedPromptIndex === i
                  ? 'border-foreground bg-foreground text-background font-semibold'
                  : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              Sequence 0{i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 font-mono text-sm text-foreground">
        <span className="text-muted-foreground">&gt; Context Prompt: </span>
        <span>&ldquo;{current.prompt} &rdquo;</span>
        <span className="inline-block w-2 h-4 bg-foreground animate-pulse align-middle ml-1" />
      </div>

      {/* Temperature Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-foreground font-semibold">Sampling Temperature (T): {temperature.toFixed(2)}</span>
          <span className="text-muted-foreground text-[11px]">
            {temperature < 0.3 ? 'Near-Deterministic (ArgMax Mode)' : temperature > 1.0 ? 'High Entropy / Creative' : 'Standard Balanced'}
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.5"
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Candidate Probability Distribution */}
      <div className="space-y-2.5 font-mono text-xs">
        <div className="text-muted-foreground">Next-Token Logits Softmax Distribution:</div>
        {normalized.map((item) => (
          <div key={item.token} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-foreground font-bold">&ldquo;{item.token}&rdquo;</span>
              <span className="text-foreground">{(item.finalProb * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 rounded bg-secondary overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-200 rounded"
                style={{ width: `${item.finalProb * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 08: What is AI Engineering? (End-to-End System Architecture Trace)    */
/* -------------------------------------------------------------------------- */
export function AiSystemsArchitectureWidget() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const stages = [
    {
      step: '01',
      title: 'Client UI & Gateway',
      component: 'FastAPI / Next.js Edge',
      action: 'Validates API keys, enforces rate limits, token quotas, and JSON schemas.',
      latency: '2 ms'
    },
    {
      step: '02',
      title: 'Input Safety Guardrails',
      component: 'LlamaGuard / NeMo',
      action: 'Scans for prompt injections, system leaks, jailbreak attempts, and PII redacting.',
      latency: '14 ms'
    },
    {
      step: '03',
      title: 'Context Retrieval (RAG)',
      component: 'Vector Index / Hybrid Search',
      action: 'Embeds query and executes cosine similarity search over chunk index.',
      latency: '22 ms'
    },
    {
      step: '04',
      title: 'Model Inference Engine',
      component: 'vLLM / TensorRT-LLM',
      action: 'PagedAttention execution over GPU cluster emitting autoregressive token stream.',
      latency: '180 ms'
    },
    {
      step: '05',
      title: 'Structured Validation & Tracing',
      component: 'Pydantic & OpenTelemetry',
      action: 'Verifies typed schema conformity and exports trace spans to observability dashboard.',
      latency: '5 ms'
    }
  ];

  const runSimulation = () => {
    setIsRunning(true);
    setActiveStep(0);
    stages.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStep(idx);
        if (idx === stages.length - 1) setIsRunning(false);
      }, (idx + 1) * 600);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div>
          <span className="text-muted-foreground uppercase text-[10px] font-bold">Production Request Lifecycle</span>
          <div className="text-foreground font-semibold">User Query &rarr; Guardrails &rarr; Vector DB &rarr; vLLM &rarr; Validation</div>
        </div>
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-background font-bold hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5" />
          {isRunning ? 'Tracing Request...' : 'Simulate Request Trace'}
        </button>
      </div>

      {/* Timeline stages */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-xs">
        {stages.map((s, idx) => {
          const isCurrent = activeStep === idx;
          const isPassed = activeStep > idx;
          return (
            <div
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`cursor-pointer p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'border-foreground bg-foreground text-background shadow-md'
                  : isPassed
                  ? 'border-emerald-500/40 bg-secondary/40 text-foreground'
                  : 'border-border/80 bg-secondary/20 text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-80">
                <span>STAGE {s.step}</span>
                <span>{s.latency}</span>
              </div>
              <div className="font-bold text-xs mt-1 truncate">{s.title}</div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Inspection */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="text-foreground font-bold">
            Stage {stages[activeStep].step}: {stages[activeStep].title}
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded border border-border bg-secondary/50 text-foreground">
            {stages[activeStep].component}
          </span>
        </div>
        <p className="text-xs font-sans text-muted-foreground leading-relaxed pt-1">
          {stages[activeStep].action}
        </p>
      </div>
    </div>
  );
}
