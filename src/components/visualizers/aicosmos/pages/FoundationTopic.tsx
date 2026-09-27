'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Code2,
  Sparkles,
  Copy,
  Check,
  Cpu,
  Layers,
  Sliders,
  Dice5,
  Activity,
  Workflow
} from 'lucide-react';
import { foundationSubtopics, getFoundationSubtopic, type FoundationSubtopic } from '../data/foundations';

interface FoundationTopicProps {
  topicId: string;
  basePath?: string;
}

export function FoundationTopic({
  topicId,
  basePath = '/ai/ai-engineering-foundations',
}: FoundationTopicProps) {
  const topic = getFoundationSubtopic(topicId) || foundationSubtopics[0];
  const index = foundationSubtopics.findIndex((t) => t.id === topic.id);
  const previous = foundationSubtopics[index - 1];
  const next = foundationSubtopics[index + 1];

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(topic.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Top Nav Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href={basePath}
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Foundations Curriculum
        </Link>
        <span className="font-mono text-xs text-[var(--ai-muted)]">
          MODULE {String(topic.number).padStart(2, '0')} OF 26
        </span>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-[var(--ai-primary)] px-2.5 py-0.5 rounded-full bg-[var(--ai-primary)]/10 border border-[var(--ai-primary)]/20">
            {topic.category.toUpperCase()}
          </span>
          <span className="text-xs font-mono text-[var(--ai-muted)]">
            Estimated ~5 min read
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[var(--ai-text)] tracking-tight">
          {topic.title}
        </h1>

        <p className="text-base sm:text-lg leading-relaxed text-[var(--ai-muted)] max-w-3xl">
          {topic.definition}
        </p>
      </header>

      {/* Mental Model & Analogy */}
      <section className="rounded-2xl border border-[var(--ai-primary)]/30 bg-[var(--ai-primary)]/5 p-6 sm:p-8 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--ai-primary)] uppercase tracking-wider font-semibold">
          <Lightbulb className="w-4 h-4 text-[var(--ai-primary)]" /> Real-World Mental Model
        </div>
        <p className="text-lg sm:text-xl font-display font-bold text-[var(--ai-text)] leading-snug">
          "{topic.analogy}"
        </p>
      </section>

      {/* Interactive Visualization Studio */}
      <section className="rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-surface)] overflow-hidden shadow-xl">
        <div className="border-b border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--ai-text)] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--ai-primary)]" />
            INTERACTIVE CANVAS: {topic.visualization.toUpperCase().replace(/-/g, ' ')}
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Reactive
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <SubtopicInteractiveVisualizer topic={topic} />
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--ai-text)]">
          What You Must Understand
        </h2>
        <div className="space-y-3.5">
          {topic.keyPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--ai-muted)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Code Snippet */}
      {topic.codeSnippet && (
        <section className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] overflow-hidden">
          <div className="border-b border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--ai-muted)]">
              <Code2 className="w-4 h-4 text-[var(--ai-primary)]" /> Engineering Reference Code
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-text)] transition-colors px-2 py-1 rounded bg-white/5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>
          <pre className="p-6 text-xs sm:text-sm font-mono text-[var(--ai-text)] bg-black/40 overflow-x-auto leading-relaxed">
            <code>{topic.codeSnippet}</code>
          </pre>
        </section>
      )}

      {/* Common Pitfall Warning */}
      {topic.pitfall && (
        <section className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 sm:p-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Production Pitfall to Avoid
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-[var(--ai-muted)]">
            {topic.pitfall}
          </p>
        </section>
      )}

      {/* Bottom Navigation */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[var(--ai-border-subtle)]">
        {previous ? (
          <Link
            href={`${basePath}/learn/${previous.id}`}
            className="ai-card p-5 rounded-2xl group flex flex-col justify-between"
          >
            <span className="text-[10px] font-mono text-[var(--ai-muted)] uppercase">
              &larr; Previous Subtopic ({previous.number})
            </span>
            <div className="mt-2 font-display font-bold text-base text-[var(--ai-text)] group-hover:text-[var(--ai-primary)] transition-colors">
              {previous.title}
            </div>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`${basePath}/learn/${next.id}`}
            className="ai-card p-5 rounded-2xl group flex flex-col justify-between text-right sm:items-end"
          >
            <span className="text-[10px] font-mono text-[var(--ai-primary)] uppercase font-semibold">
              Next Subtopic ({next.number}) &rarr;
            </span>
            <div className="mt-2 font-display font-bold text-base text-[var(--ai-text)] group-hover:text-[var(--ai-primary)] transition-colors">
              {next.title}
            </div>
          </Link>
        ) : (
          <Link
            href={`${basePath}/lab`}
            className="ai-card p-5 rounded-2xl group flex flex-col justify-between text-right sm:items-end border-emerald-500/40"
          >
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
              Foundation Complete &rarr;
            </span>
            <div className="mt-2 font-display font-bold text-base text-[var(--ai-text)] group-hover:text-emerald-400 transition-colors">
              Launch The Micro-Model Studio
            </div>
          </Link>
        )}
      </nav>
    </div>
  );
}

// -------------------------------------------------------------
// Interactive Subtopic Visualizers
// -------------------------------------------------------------
function SubtopicInteractiveVisualizer({ topic }: { topic: FoundationSubtopic }) {
  // 1. Weight & Bias Linear Slider Canvas
  if (topic.visualization === 'weight-slider' || topic.visualization === 'bias-slider' || topic.id === 'weights' || topic.id === 'bias') {
    return <WeightBiasSliderWidget />;
  }

  // 2. AI Taxonomy Circles
  if (topic.visualization === 'ai-taxonomy' || topic.id === 'what-is-artificial-intelligence') {
    return <AiTaxonomyWidget />;
  }

  // 3. Autoregressive Next-Token Predictor
  if (topic.visualization === 'next-token' || topic.id === 'what-is-an-llm') {
    return <NextTokenWidget />;
  }

  // 4. Deterministic vs Probabilistic Dice
  if (topic.visualization === 'probabilistic-dice' || topic.id === 'deterministic-vs-probabilistic-systems') {
    return <ProbabilisticSimulatorWidget />;
  }

  // 5. Training vs Inference Comparison
  if (topic.visualization === 'training-vs-inference' || topic.id === 'training-vs-inference') {
    return <TrainingVsInferenceWidget />;
  }

  // 6. Rule-based vs Learned ML
  if (topic.visualization === 'rule-vs-learned' || topic.id === 'ai-vs-machine-learning') {
    return <RuleVsLearnedWidget />;
  }

  // 7. General Pipeline Stepper
  return <GenericPipelineWidget topic={topic} />;
}

// -------------------------------------------------------------
// Widget 1: Weight & Bias Live Slider
// -------------------------------------------------------------
function WeightBiasSliderWidget() {
  const [weight, setWeight] = useState(1.5);
  const [bias, setBias] = useState(0.5);
  const [inputVal, setInputVal] = useState(2.0);

  const rawSum = weight * inputVal + bias;
  const activatedSigmoid = 1 / (1 + Math.exp(-rawSum));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] p-4 space-y-2">
          <div className="text-[var(--ai-muted)]">Input Feature (x)</div>
          <div className="text-xl font-bold text-[var(--ai-text)]">{inputVal.toFixed(1)}</div>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={inputVal}
            onChange={(e) => setInputVal(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        <div className="rounded-xl border border-[var(--ai-primary)]/40 bg-[var(--ai-primary)]/10 p-4 space-y-2">
          <div className="text-[var(--ai-primary)] font-semibold">Weight (w) &bull; Slope</div>
          <div className="text-xl font-bold text-[var(--ai-text)]">{weight.toFixed(2)}</div>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        <div className="rounded-xl border border-purple-500/40 bg-purple-500/10 p-4 space-y-2">
          <div className="text-purple-400 font-semibold">Bias (b) &bull; Intercept</div>
          <div className="text-xl font-bold text-[var(--ai-text)]">{bias.toFixed(2)}</div>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={bias}
            onChange={(e) => setBias(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[var(--ai-muted)]">Linear Equation:</span>
          <div className="text-base text-[var(--ai-text)] font-semibold">
            z = (w &times; x) + b = ({weight.toFixed(2)} &times; {inputVal.toFixed(1)}) + {bias.toFixed(2)} = <span className="text-[var(--ai-primary)]">{rawSum.toFixed(2)}</span>
          </div>
        </div>

        <div className="px-5 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-center">
          <div>Sigmoid Activation &sigma;(z)</div>
          <div className="text-lg">{(activatedSigmoid * 100).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Widget 2: AI Taxonomy Hierarchy
// -------------------------------------------------------------
function AiTaxonomyWidget() {
  const [selectedLayer, setSelectedLayer] = useState<'ai' | 'ml' | 'dl' | 'genai' | 'llm'>('llm');

  const layers = {
    ai: {
      name: 'Artificial Intelligence',
      scope: 'The Broad Destination',
      desc: 'All machines exhibiting cognitive behavior (search algorithms, heuristics, expert systems, learned models).',
      examples: 'A* Pathfinding, Deep Blue chess engine, rule engines, LLMs'
    },
    ml: {
      name: 'Machine Learning',
      scope: 'Empirical Parameter Learning',
      desc: 'Algorithms that optimize weights from data instead of hardcoded if/else statements.',
      examples: 'Linear Regression, XGBoost, Random Forests, K-Means'
    },
    dl: {
      name: 'Deep Learning',
      scope: 'Hierarchical Multi-Layer Networks',
      desc: 'Neural networks with multiple hidden layers that automatically discover internal representations.',
      examples: 'ResNet (Vision), Convolutions, Multi-Layer Perceptrons'
    },
    genai: {
      name: 'Generative AI',
      scope: 'Sampling Learned Distributions',
      desc: 'Models that produce brand-new artifacts (text, image, audio) by learning P(X).',
      examples: 'Diffusion Models (Midjourney), VAEs, Autoregressive LLMs'
    },
    llm: {
      name: 'Large Language Models',
      scope: 'Scale & Emergent Reasoning',
      desc: 'Trillion-token Transformer models trained on next-token prediction with general reasoning capabilities.',
      examples: 'GPT-4, Claude 3.5 Sonnet, Gemini 1.5, Llama 3'
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        {(Object.keys(layers) as Array<keyof typeof layers>).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedLayer(key)}
            className={`p-3 rounded-xl border text-center transition-all ${
              selectedLayer === key
                ? 'border-[var(--ai-primary)] bg-[var(--ai-primary)]/20 text-[var(--ai-text)] font-bold shadow-md'
                : 'border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
            }`}
          >
            {layers[key].name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-surface-2)] p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-xl text-[var(--ai-text)]">{layers[selectedLayer].name}</h3>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[var(--ai-primary)]/10 text-[var(--ai-primary)] border border-[var(--ai-primary)]/30 font-semibold">
            {layers[selectedLayer].scope}
          </span>
        </div>
        <p className="text-sm text-[var(--ai-muted)] leading-relaxed">{layers[selectedLayer].desc}</p>
        <div className="pt-2 text-xs font-mono text-emerald-400">
          <span className="text-[var(--ai-muted)]">Key Examples: </span>{layers[selectedLayer].examples}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Widget 3: Autoregressive Next-Token Predictor
// -------------------------------------------------------------
function NextTokenWidget() {
  const [temperature, setTemperature] = useState(0.7);

  const tokens = [
    { token: 'world', baseProb: 0.62 },
    { token: 'future', baseProb: 0.21 },
    { token: 'universe', baseProb: 0.11 },
    { token: 'machine', baseProb: 0.06 },
  ];

  // Adjust probabilities based on temperature
  const adjusted = tokens.map((t) => {
    const raw = Math.pow(t.baseProb, 1 / Math.max(0.1, temperature));
    return { ...t, prob: raw };
  });
  const total = adjusted.reduce((acc, t) => acc + t.prob, 0);
  const normalized = adjusted.map((t) => ({ ...t, prob: t.prob / total }));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-[var(--ai-text)]">
        <span className="text-[var(--ai-muted)]">&gt; Context: </span>
        <span>"Artificial Intelligence is redefining the "</span>
        <span className="inline-block w-2.5 h-4 bg-[var(--ai-primary)] animate-pulse align-middle ml-1" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-[var(--ai-text)] font-semibold">Temperature: {temperature.toFixed(2)}</span>
          <span className="text-[var(--ai-muted)]">
            {temperature < 0.3 ? 'Deterministic (Sharp)' : temperature > 1.0 ? 'High Entropy (Creative / Noisy)' : 'Balanced'}
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.5"
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>

      <div className="space-y-2 font-mono text-xs">
        <div className="text-[var(--ai-muted)]">Next-Token Probability Distribution:</div>
        {normalized.map((item) => (
          <div key={item.token} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[var(--ai-text)] font-bold">"{item.token}"</span>
              <span className="text-[var(--ai-primary)]">{(item.prob * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-[var(--ai-primary)] transition-all duration-300 rounded-full"
                style={{ width: `${item.prob * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Widget 4: Probabilistic Simulator
// -------------------------------------------------------------
function ProbabilisticSimulatorWidget() {
  const [temperature, setTemperature] = useState(0.0);
  const [history, setHistory] = useState<string[]>([]);

  const sample = () => {
    let outcome = 'Result A';
    if (temperature > 0) {
      const rand = Math.random();
      if (rand > 0.6) outcome = 'Result B';
      if (rand > 0.85) outcome = 'Result C';
    }
    setHistory((prev) => [outcome, ...prev.slice(0, 4)]);
  };

  return (
    <div className="space-y-5 font-mono text-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)]">
        <div>
          <div className="text-[var(--ai-text)] font-bold">Sampling Mode:</div>
          <div className="text-[var(--ai-muted)] text-[11px]">
            {temperature === 0 ? 'T = 0 (Purely Deterministic: identical input always yields Result A)' : 'T > 0 (Probabilistic: random sampling across distribution)'}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTemperature(0.0)}
            className={`px-3 py-1.5 rounded-lg border ${temperature === 0 ? 'bg-indigo-600 text-white' : 'border-white/10 text-muted-foreground'}`}
          >
            T = 0.0
          </button>
          <button
            onClick={() => setTemperature(0.8)}
            className={`px-3 py-1.5 rounded-lg border ${temperature > 0 ? 'bg-indigo-600 text-white' : 'border-white/10 text-muted-foreground'}`}
          >
            T = 0.8
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={sample}
          className="px-4 py-2.5 rounded-xl bg-[var(--ai-primary)] text-white font-bold hover:bg-[var(--ai-primary-hover)] active:scale-95 transition-all"
        >
          Execute Sample (Run Inference)
        </button>
        <span className="text-[var(--ai-muted)]">Click multiple times to observe repeatability</span>
      </div>

      {history.length > 0 && (
        <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-1.5">
          <span className="text-[var(--ai-muted)]">Recent Outputs:</span>
          {history.map((h, i) => (
            <div key={i} className="text-emerald-400">
              Run #{history.length - i}: <strong>{h}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Widget 5: Training vs Inference
// -------------------------------------------------------------
function TrainingVsInferenceWidget() {
  const [mode, setMode] = useState<'training' | 'inference'>('inference');

  return (
    <div className="space-y-5 font-mono text-xs">
      <div className="flex rounded-xl p-1 bg-white/5 border border-white/10">
        <button
          onClick={() => setMode('inference')}
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${mode === 'inference' ? 'bg-[var(--ai-primary)] text-white' : 'text-[var(--ai-muted)]'}`}
        >
          Inference Mode (Serving)
        </button>
        <button
          onClick={() => setMode('training')}
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${mode === 'training' ? 'bg-[var(--ai-primary)] text-white' : 'text-[var(--ai-muted)]'}`}
        >
          Training Mode (Optimization)
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-white/10 bg-[var(--ai-surface-2)]">
          <div className="text-[var(--ai-muted)]">Pass Required</div>
          <div className="text-base font-bold text-[var(--ai-text)] mt-1">
            {mode === 'inference' ? 'Forward Pass Only' : 'Forward + Backward'}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[var(--ai-surface-2)]">
          <div className="text-[var(--ai-muted)]">Parameter State</div>
          <div className="text-base font-bold text-emerald-400 mt-1">
            {mode === 'inference' ? 'Frozen / Static' : 'Updated via Gradients'}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[var(--ai-surface-2)]">
          <div className="text-[var(--ai-muted)]">VRAM Footprint</div>
          <div className="text-base font-bold text-[var(--ai-primary)] mt-1">
            {mode === 'inference' ? '1x (Weights + KV)' : '3x - 4x (Optimizer + Acts)'}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[var(--ai-surface-2)]">
          <div className="text-[var(--ai-muted)]">Latency Scale</div>
          <div className="text-base font-bold text-cyan-400 mt-1">
            {mode === 'inference' ? '10 - 200 ms' : 'Hours to Months'}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Widget 6: Rule-based vs Learned ML
// -------------------------------------------------------------
function RuleVsLearnedWidget() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
      <div className="p-5 rounded-xl border border-white/10 bg-black/40 space-y-3">
        <div className="font-bold text-amber-400 flex items-center gap-1.5">
          Traditional Rule-Based Code
        </div>
        <div className="text-[var(--ai-muted)] leading-relaxed">
          Human writes explicit logic. Cannot scale to complex visual or natural language ambiguities.
        </div>
        <pre className="p-3 rounded-lg bg-white/5 text-[11px] text-[var(--ai-text)]">
          {`if (email.contains("lottery") && email.hasLink()) {
  return SPAM;
} else if (email.senderUnknown()) {
  return SUSPICIOUS;
}`}
        </pre>
      </div>

      <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
        <div className="font-bold text-emerald-400 flex items-center gap-1.5">
          Learned Machine Learning Model
        </div>
        <div className="text-[var(--ai-muted)] leading-relaxed">
          Model learns weights from 1,000,000 examples. Discovers non-linear interactions automatically.
        </div>
        <pre className="p-3 rounded-lg bg-white/5 text-[11px] text-[var(--ai-text)]">
          {`// Parameterized vector dot product
const score = dotProduct(weights, emailVector) + bias;
const isSpam = sigmoid(score) > 0.95;`}
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Widget 7: Generic Pipeline Stepper
// -------------------------------------------------------------
function GenericPipelineWidget({ topic }: { topic: FoundationSubtopic }) {
  const steps = [
    { label: 'Raw Input', sub: 'User query / signal' },
    { label: 'Preprocessing', sub: 'Tokenization / Normalization' },
    { label: 'Model Math', sub: 'Weights & Activations' },
    { label: 'Prediction', sub: 'Decision output' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
        {steps.map((s, i) => (
          <div
            key={s.label}
            className="p-4 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] space-y-1 relative"
          >
            <div className="text-[10px] text-[var(--ai-primary)] font-bold">STAGE 0{i + 1}</div>
            <div className="font-bold text-[var(--ai-text)]">{s.label}</div>
            <div className="text-[11px] text-[var(--ai-muted)]">{s.sub}</div>
          </div>
        ))}
      </div>
      <p className="text-center font-mono text-xs text-[var(--ai-muted)] pt-2">
        Concept demonstrated: <span className="text-[var(--ai-text)] font-semibold">{topic.title}</span>
      </p>
    </div>
  );
}
