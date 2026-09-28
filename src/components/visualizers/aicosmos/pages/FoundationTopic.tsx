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
  Copy,
  Check,
  Cpu,
  Layers,
  Sliders,
  Activity,
  Terminal
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Top Nav Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4 text-xs font-mono text-muted-foreground">
        <Link
          href={basePath}
          className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Foundations Matrix
        </Link>
        <span className="font-semibold text-foreground">
          // MODULE {String(topic.number).padStart(2, '0')} OF 26
        </span>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-mono font-semibold text-foreground">
            {topic.category.toUpperCase()}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Estimated ~5 min read &bull; Client-Side Reactive
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight font-display">
          {topic.title}
        </h1>

        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-3xl">
          {topic.definition}
        </p>
      </header>

      {/* Mental Model & Analogy */}
      <section className="rounded-xl border border-border/80 bg-secondary/30 p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
          <Lightbulb className="h-4 w-4 text-foreground" /> Real-World Mental Model
        </div>
        <p className="text-base sm:text-lg font-display font-bold text-foreground leading-snug">
          &ldquo;{topic.analogy}&rdquo;
        </p>
      </section>

      {/* Interactive Visualization Studio */}
      <section className="rounded-xl border border-border/80 bg-card overflow-hidden">
        <div className="border-b border-border/80 bg-secondary/40 px-5 py-3 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Terminal className="h-3.5 w-3.5 text-foreground" />
            <span>INTERACTIVE ENGINE: {topic.visualization.toUpperCase().replace(/-/g, ' ')}</span>
          </div>
          <span className="text-[11px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live Reactive
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <SubtopicInteractiveVisualizer topic={topic} />
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 space-y-4">
        <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
          CORE PRINCIPLES
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
          What You Must Understand
        </h2>
        <div className="space-y-3">
          {topic.keyPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Code Snippet */}
      {topic.codeSnippet && (
        <section className="rounded-xl border border-border/80 bg-card overflow-hidden">
          <div className="border-b border-border/80 bg-secondary/40 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Code2 className="h-4 w-4 text-foreground" /> Reference Implementation
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border bg-secondary/60"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>
          <pre className="p-6 text-xs sm:text-sm font-mono text-foreground bg-secondary/20 overflow-x-auto leading-relaxed">
            <code>{topic.codeSnippet}</code>
          </pre>
        </section>
      )}

      {/* Common Pitfall Warning */}
      {topic.pitfall && (
        <section className="rounded-xl border border-border/80 bg-secondary/20 p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Production Failure Mode
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {topic.pitfall}
          </p>
        </section>
      )}

      {/* Bottom Navigation */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/80">
        {previous ? (
          <Link
            href={`${basePath}/learn/${previous.id}`}
            className="group rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between hover:border-foreground/40 transition-colors"
          >
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              &larr; Previous Module ({previous.number})
            </span>
            <div className="mt-2 font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
              {previous.title}
            </div>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`${basePath}/learn/${next.id}`}
            className="group rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between text-right sm:items-end hover:border-foreground/40 transition-colors"
          >
            <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">
              Next Module ({next.number}) &rarr;
            </span>
            <div className="mt-2 font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
              {next.title}
            </div>
          </Link>
        ) : (
          <Link
            href={`${basePath}/lab`}
            className="group rounded-xl border border-border/80 bg-card p-5 flex flex-col justify-between text-right sm:items-end hover:border-foreground/40 transition-colors"
          >
            <span className="text-[10px] font-mono text-emerald-500 uppercase font-semibold">
              Curriculum Complete &rarr;
            </span>
            <div className="mt-2 font-display font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors">
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
  if (topic.visualization === 'weight-slider' || topic.visualization === 'bias-slider' || topic.id === 'weights' || topic.id === 'bias') {
    return <WeightBiasSliderWidget />;
  }
  if (topic.visualization === 'ai-taxonomy' || topic.id === 'what-is-artificial-intelligence') {
    return <AiTaxonomyWidget />;
  }
  if (topic.visualization === 'next-token' || topic.id === 'what-is-an-llm') {
    return <NextTokenWidget />;
  }
  if (topic.visualization === 'probabilistic-dice' || topic.id === 'deterministic-vs-probabilistic-systems') {
    return <ProbabilisticSimulatorWidget />;
  }
  if (topic.visualization === 'training-vs-inference' || topic.id === 'training-vs-inference') {
    return <TrainingVsInferenceWidget />;
  }
  if (topic.visualization === 'rule-vs-learned' || topic.id === 'ai-vs-machine-learning') {
    return <RuleVsLearnedWidget />;
  }
  return <GenericPipelineWidget topic={topic} />;
}

// -------------------------------------------------------------
// Widget 1: Weight & Bias Live Telemetry Slider
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
        <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-2">
          <div className="text-muted-foreground">Input Feature (x)</div>
          <div className="text-2xl font-bold text-foreground">{inputVal.toFixed(1)}</div>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={inputVal}
            onChange={(e) => setInputVal(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-2">
          <div className="text-muted-foreground font-semibold">Weight (w) &bull; Slope</div>
          <div className="text-2xl font-bold text-foreground">{weight.toFixed(2)}</div>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-2">
          <div className="text-muted-foreground font-semibold">Bias (b) &bull; Intercept</div>
          <div className="text-2xl font-bold text-foreground">{bias.toFixed(2)}</div>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={bias}
            onChange={(e) => setBias(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-muted-foreground">Linear Equation:</span>
          <div className="text-sm sm:text-base text-foreground font-semibold">
            z = (w &times; x) + b = ({weight.toFixed(2)} &times; {inputVal.toFixed(1)}) + {bias.toFixed(2)} = <span className="font-bold underline">{rawSum.toFixed(2)}</span>
          </div>
        </div>

        <div className="px-5 py-3 rounded-lg border border-border/80 bg-secondary/50 text-foreground font-bold text-center">
          <div className="text-[11px] text-muted-foreground font-mono">Sigmoid Activation &sigma;(z)</div>
          <div className="text-xl font-mono text-emerald-500">{(activatedSigmoid * 100).toFixed(1)}%</div>
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
      desc: 'All computational systems exhibiting cognitive reasoning (heuristics, tree search, expert systems, learned models).',
      examples: 'A* Pathfinding, Minimax chess engine, rule engines, LLMs'
    },
    ml: {
      name: 'Machine Learning',
      scope: 'Empirical Parameter Learning',
      desc: 'Algorithms that optimize weights from data instead of hand-written conditional logic.',
      examples: 'Linear Regression, XGBoost, Random Forests, K-Means'
    },
    dl: {
      name: 'Deep Learning',
      scope: 'Hierarchical Multi-Layer Networks',
      desc: 'Neural networks with multiple stacked layers that learn representations directly from raw inputs.',
      examples: 'ResNet, Convolutions, Multi-Layer Perceptrons, Vision Transformers'
    },
    genai: {
      name: 'Generative AI',
      scope: 'Sampling Learned Distributions',
      desc: 'Models that generate synthetic data artifacts (text, image, audio) by learning probability distribution P(X).',
      examples: 'Diffusion Models (Stable Diffusion), VAEs, Autoregressive LLMs'
    },
    llm: {
      name: 'Large Language Models',
      scope: 'Scale & Emergent Reasoning',
      desc: 'Trillion-parameter Transformer models trained on next-token prediction with general in-context learning.',
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
            className={`p-3 rounded-lg border text-center transition-colors ${
              selectedLayer === key
                ? 'border-foreground bg-foreground text-background font-bold'
                : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            {layers[key].name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border/80 bg-secondary/20 p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display font-bold text-xl text-foreground">{layers[selectedLayer].name}</h3>
          <span className="font-mono text-xs px-2.5 py-1 rounded border border-border bg-secondary/60 text-muted-foreground font-semibold">
            {layers[selectedLayer].scope}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{layers[selectedLayer].desc}</p>
        <div className="pt-2 text-xs font-mono text-foreground">
          <span className="text-muted-foreground">Key Examples: </span>{layers[selectedLayer].examples}
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

  const adjusted = tokens.map((t) => {
    const raw = Math.pow(t.baseProb, 1 / Math.max(0.1, temperature));
    return { ...t, prob: raw };
  });
  const total = adjusted.reduce((acc, t) => acc + t.prob, 0);
  const normalized = adjusted.map((t) => ({ ...t, prob: t.prob / total }));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 font-mono text-sm text-foreground">
        <span className="text-muted-foreground">&gt; Context: </span>
        <span>&ldquo;Artificial Intelligence is redefining the &rdquo;</span>
        <span className="inline-block w-2 h-4 bg-foreground animate-pulse align-middle ml-1" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-foreground font-semibold">Temperature: {temperature.toFixed(2)}</span>
          <span className="text-muted-foreground">
            {temperature < 0.3 ? 'Deterministic (Sharp argmax)' : temperature > 1.0 ? 'High Entropy (Flat distribution)' : 'Balanced'}
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

      <div className="space-y-2.5 font-mono text-xs">
        <div className="text-muted-foreground">Next-Token Probability Distribution:</div>
        {normalized.map((item) => (
          <div key={item.token} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-foreground font-bold">&ldquo;{item.token}&rdquo;</span>
              <span className="text-foreground">{(item.prob * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 rounded bg-secondary overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-200 rounded"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-secondary/30">
        <div>
          <div className="text-foreground font-bold">Sampling Mode:</div>
          <div className="text-muted-foreground text-[11px]">
            {temperature === 0 ? 'T = 0 (Purely Deterministic: identical input always yields identical token)' : 'T > 0 (Probabilistic: random sampling across distribution)'}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTemperature(0.0)}
            className={`px-3 py-1.5 rounded border ${temperature === 0 ? 'border-foreground bg-foreground text-background font-bold' : 'border-border text-muted-foreground'}`}
          >
            T = 0.0
          </button>
          <button
            onClick={() => setTemperature(0.8)}
            className={`px-3 py-1.5 rounded border ${temperature > 0 ? 'border-foreground bg-foreground text-background font-bold' : 'border-border text-muted-foreground'}`}
          >
            T = 0.8
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={sample}
          className="px-4 py-2 rounded-lg bg-foreground text-background font-bold hover:bg-foreground/90 transition-colors"
        >
          Execute Sample (Run Inference)
        </button>
        <span className="text-muted-foreground text-[11px]">Click multiple times to verify repeatability</span>
      </div>

      {history.length > 0 && (
        <div className="p-4 rounded-xl border border-border/80 bg-secondary/20 space-y-1.5">
          <span className="text-muted-foreground">Recent Outputs:</span>
          {history.map((h, i) => (
            <div key={i} className="text-foreground">
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
      <div className="flex rounded-lg p-1 border border-border/80 bg-secondary/30">
        <button
          onClick={() => setMode('inference')}
          className={`flex-1 py-2 rounded font-bold transition-colors ${mode === 'inference' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
        >
          Inference Mode (Serving)
        </button>
        <button
          onClick={() => setMode('training')}
          className={`flex-1 py-2 rounded font-bold transition-colors ${mode === 'training' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
        >
          Training Mode (Optimization)
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border/80 bg-secondary/20">
          <div className="text-muted-foreground">Pass Required</div>
          <div className="text-base font-bold text-foreground mt-1">
            {mode === 'inference' ? 'Forward Pass Only' : 'Forward + Backward'}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border/80 bg-secondary/20">
          <div className="text-muted-foreground">Parameter State</div>
          <div className="text-base font-bold text-foreground mt-1">
            {mode === 'inference' ? 'Frozen / Static' : 'Updated via Gradients'}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border/80 bg-secondary/20">
          <div className="text-muted-foreground">VRAM Footprint</div>
          <div className="text-base font-bold text-foreground mt-1">
            {mode === 'inference' ? '1x (Weights + KV)' : '3x - 4x (Optimizer + Acts)'}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border/80 bg-secondary/20">
          <div className="text-muted-foreground">Latency Scale</div>
          <div className="text-base font-bold text-foreground mt-1">
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
      <div className="p-5 rounded-xl border border-border/80 bg-secondary/20 space-y-3">
        <div className="font-bold text-foreground flex items-center gap-1.5">
          Traditional Rule-Based Code
        </div>
        <div className="text-muted-foreground leading-relaxed">
          Human writes explicit logic. Cannot scale to complex visual or natural language ambiguities.
        </div>
        <pre className="p-3 rounded border border-border/60 bg-secondary/40 text-[11px] text-foreground">
          {`if (email.contains("lottery") && email.hasLink()) {
  return SPAM;
} else if (email.senderUnknown()) {
  return SUSPICIOUS;
}`}
        </pre>
      </div>

      <div className="p-5 rounded-xl border border-border/80 bg-secondary/20 space-y-3">
        <div className="font-bold text-foreground flex items-center gap-1.5">
          Learned Machine Learning Model
        </div>
        <div className="text-muted-foreground leading-relaxed">
          Model learns weights from millions of examples. Discovers non-linear interactions automatically.
        </div>
        <pre className="p-3 rounded border border-border/60 bg-secondary/40 text-[11px] text-foreground">
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
    { label: 'Raw Input', sub: 'Signal / token vector' },
    { label: 'Preprocessing', sub: 'Normalization & Tokenization' },
    { label: 'Model Math', sub: 'Weights & Activations' },
    { label: 'Prediction', sub: 'Decision output' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
        {steps.map((s, i) => (
          <div
            key={s.label}
            className="p-4 rounded-xl border border-border/80 bg-secondary/30 space-y-1 relative"
          >
            <div className="text-[10px] text-muted-foreground font-bold">STAGE 0{i + 1}</div>
            <div className="font-bold text-foreground">{s.label}</div>
            <div className="text-[11px] text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>
      <p className="text-center font-mono text-xs text-muted-foreground pt-2">
        Concept demonstrated: <span className="text-foreground font-semibold">{topic.title}</span>
      </p>
    </div>
  );
}
