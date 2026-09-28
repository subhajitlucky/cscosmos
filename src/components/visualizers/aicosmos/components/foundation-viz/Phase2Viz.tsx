'use client';

import React, { useState } from 'react';
import {
  Users,
  GitBranch,
  Layers,
  Database,
  Cpu,
  ArrowRight,
  Server,
  Zap,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Topic 09: AI vs ML Engineer vs Data Scientist (Roles Comparison Matrix)    */
/* -------------------------------------------------------------------------- */
export function RolesMatrixWidget() {
  const [selectedRole, setSelectedRole] = useState<'ai_eng' | 'ml_eng' | 'data_sci'>('ai_eng');

  const roles = {
    ai_eng: {
      title: 'AI Systems Engineer',
      focus: 'Application Architecture & Production Serving',
      stack: 'TypeScript, Python, FastAPI, vLLM, LangChain, Pinecone, OpenTelemetry',
      deliverables: 'Low-latency RAG systems, AI agent loops, structured JSON outputs, streaming APIs',
      metrics: 'Time-To-First-Token (TTFT), P99 Latency, Error Rate, Cost per 1M Tokens',
      dailyWork: 'Wraps foundational models into robust, observable, scalable software systems.'
    },
    ml_eng: {
      title: 'Machine Learning Engineer',
      focus: 'Model Training, Fine-Tuning & Quantization',
      stack: 'Python, PyTorch, CUDA, Hugging Face, DeepSpeed, TensorRT, Triton',
      deliverables: 'Custom model weights, LoRA adapters, distilled checkpoints, optimized ONNX runtimes',
      metrics: 'Validation Perplexity, Training Loss convergence, MFU (Model FLOPs Utilization)',
      dailyWork: 'Trains, fine-tunes, quantizes, and optimizes neural models on distributed GPU clusters.'
    },
    data_sci: {
      title: 'Data Scientist',
      focus: 'Statistical Analysis, Hypotheses & Business Insights',
      stack: 'Python, SQL, R, Pandas, Scikit-Learn, Jupyter, Tableau, BigQuery',
      deliverables: 'Exploratory data analysis, statistical A/B test reports, feature importance insights',
      metrics: 'ROC-AUC, F1-Score, Statistical Significance (p-values), Business Conversion Lift',
      dailyWork: 'Formulates empirical hypotheses, analyzes experimental results, and discovers patterns in data.'
    }
  };

  const active = roles[selectedRole];

  return (
    <div className="space-y-6">
      {/* Role Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
        <button
          onClick={() => setSelectedRole('ai_eng')}
          className={`p-3 rounded-lg border text-center transition-all ${
            selectedRole === 'ai_eng'
              ? 'border-foreground bg-foreground text-background font-bold shadow-sm'
              : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
          }`}
        >
          AI Engineer (Software 2.0)
        </button>
        <button
          onClick={() => setSelectedRole('ml_eng')}
          className={`p-3 rounded-lg border text-center transition-all ${
            selectedRole === 'ml_eng'
              ? 'border-foreground bg-foreground text-background font-bold shadow-sm'
              : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
          }`}
        >
          ML Engineer (Model Internals)
        </button>
        <button
          onClick={() => setSelectedRole('data_sci')}
          className={`p-3 rounded-lg border text-center transition-all ${
            selectedRole === 'data_sci'
              ? 'border-foreground bg-foreground text-background font-bold shadow-sm'
              : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
          }`}
        >
          Data Scientist (Analytics)
        </button>
      </div>

      {/* Role Detail Card */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-6 space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              ENGINEERING ROLE PROFILE
            </span>
            <h3 className="font-display font-bold text-xl text-foreground mt-0.5">
              {active.title}
            </h3>
          </div>
          <span className="text-xs px-3 py-1 rounded-full border border-border bg-secondary/60 text-foreground font-semibold">
            {active.focus}
          </span>
        </div>

        <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {active.dailyWork}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-muted-foreground text-[10px] uppercase font-bold">Primary Tech Stack</span>
            <div className="text-foreground text-[11px] font-semibold">{active.stack}</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-muted-foreground text-[10px] uppercase font-bold">Key Deliverables</span>
            <div className="text-foreground text-[11px] font-semibold">{active.deliverables}</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1 sm:col-span-2">
            <span className="text-muted-foreground text-[10px] uppercase font-bold">North Star Evaluation Metrics</span>
            <div className="text-emerald-500 text-[11px] font-semibold">{active.metrics}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 10: The AI Engineering Pipeline (Lifecycle Stepper)                  */
/* -------------------------------------------------------------------------- */
export function PipelineLifecycleWidget() {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      num: '01',
      title: 'Problem Framing & Metric Setup',
      desc: 'Define whether task requires zero-shot prompting, few-shot RAG, fine-tuning, or classical heuristics. Set up golden test dataset with synthetic evaluation metrics.',
      tools: 'DeepEval, Ragas, Langfuse, Human Review'
    },
    {
      num: '02',
      title: 'Context & Knowledge Pipeline',
      desc: 'Ingest raw documents, partition with semantic chunking, compute dense embeddings, and populate low-latency vector index with hybrid full-text BM25 search.',
      tools: 'Unstructured, LlamaIndex, Qdrant, Chroma, PGVector'
    },
    {
      num: '03',
      title: 'Prompt Engineering & Routing',
      desc: 'Author system prompts with strict XML/JSON formatting schemas. Implement conditional semantic routing between high-tier reasoning models and lightweight mini models.',
      tools: 'DSPy, Instructor, Outlines, Pydantic'
    },
    {
      num: '04',
      title: 'High-Throughput Serving & Caching',
      desc: 'Deploy model with continuous batching, PagedAttention, and prompt prefix caching to maximize token throughput and minimize latency.',
      tools: 'vLLM, TensorRT-LLM, Ollama, Redis KV Cache'
    },
    {
      num: '05',
      title: 'Observability & Continual Eval',
      desc: 'Log live inference spans, trace token costs, capture user thumbs up/down feedback, and detect data distribution drift in production.',
      tools: 'OpenTelemetry, LangSmith, Arize Phoenix, Grafana'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 5-Stage Stepper Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-xs">
        {stages.map((s, idx) => (
          <button
            key={s.num}
            onClick={() => setActiveStage(idx)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeStage === idx
                ? 'border-foreground bg-foreground text-background shadow-sm'
                : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="text-[10px] opacity-75">STAGE {s.num}</div>
            <div className="font-bold text-xs truncate mt-0.5">{s.title.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      {/* Selected Stage Detail */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-6 space-y-3 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="font-bold text-sm sm:text-base text-foreground">
            Stage {stages[activeStage].num}: {stages[activeStage].title}
          </div>
          <span className="text-[11px] text-emerald-500 font-semibold">Active Milestone</span>
        </div>

        <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {stages[activeStage].desc}
        </p>

        <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1 mt-2">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">Standard Tooling Stack:</span>
          <div className="text-foreground font-semibold">{stages[activeStage].tools}</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 11: Data → Model → Inference (Vector Embeddings & Retrieval)        */
/* -------------------------------------------------------------------------- */
export function DataModelInferenceWidget() {
  const [query, setQuery] = useState('How does vector search work?');

  const corpus = [
    { id: 1, text: 'Vector search computes cosine similarity between high-dimensional dense embedding arrays.', sim: 0.94 },
    { id: 2, text: 'PostgreSQL relational databases organize tabular records into B-Trees and row tuples.', sim: 0.28 },
    { id: 3, text: 'Embeddings project unstructured human language into a continuous geometric semantic space.', sim: 0.86 },
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="space-y-2">
        <label className="text-muted-foreground text-[11px] block">Test User Query (Incoming Inference Payload):</label>
        <div className="flex gap-2">
          <button
            onClick={() => setQuery('How does vector search work?')}
            className="px-2.5 py-1 rounded border border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground text-[11px]"
          >
            Query A: &ldquo;Vector search&rdquo;
          </button>
          <button
            onClick={() => setQuery('Tell me about relational database B-Trees')}
            className="px-2.5 py-1 rounded border border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground text-[11px]"
          >
            Query B: &ldquo;Databases&rdquo;
          </button>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border/80 bg-secondary/30 px-3.5 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-foreground/50"
        />
      </div>

      {/* Vector Pipeline Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-border/80 bg-secondary/20 space-y-1.5">
          <span className="text-[10px] text-muted-foreground font-bold">STAGE 01: EMBEDDING</span>
          <div className="font-bold text-foreground text-xs">Dense Vector 384D</div>
          <div className="text-[11px] text-muted-foreground break-all">
            [0.21, -0.44, 0.89, -0.12, 0.65...]
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-secondary/20 space-y-1.5">
          <span className="text-[10px] text-muted-foreground font-bold">STAGE 02: SIMILARITY</span>
          <div className="font-bold text-foreground text-xs">Cosine Distance</div>
          <div className="text-[11px] text-muted-foreground">
            cos(&theta;) = (u &middot; v) / (||u|| ||v||)
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/80 bg-secondary/20 space-y-1.5">
          <span className="text-[10px] text-muted-foreground font-bold">STAGE 03: CONTEXT</span>
          <div className="font-bold text-foreground text-xs">Top-1 Retrieved Chunk</div>
          <div className="text-[11px] text-emerald-500 font-semibold">
            Similarity: 94.2% Match
          </div>
        </div>
      </div>

      {/* Ranked Chunks */}
      <div className="space-y-2">
        <span className="text-muted-foreground text-[11px]">Ranked Knowledge Base Chunks:</span>
        {corpus.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border/80 bg-secondary/30"
          >
            <p className="text-foreground text-xs font-sans truncate">{item.text}</p>
            <span className="font-mono text-xs font-bold text-foreground px-2 py-0.5 rounded border border-border bg-secondary shrink-0">
              {(item.sim * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 12: Training vs Inference (VRAM & Compute Budget Inspector)           */
/* -------------------------------------------------------------------------- */
export function TrainingVsInferenceDeepWidget() {
  const [paramsBillion, setParamsBillion] = useState<number>(7);
  const [mode, setMode] = useState<'inference' | 'training'>('inference');

  // VRAM calculation:
  // Inference FP16: 2 bytes per param + ~20% KV cache
  // Training FP16 + AdamW:
  // - Parameters: 2 bytes (FP16)
  // - Gradients: 2 bytes (FP16)
  // - Optimizer States (AdamW): 4 bytes FP32 master weights + 4 bytes momentum + 4 bytes variance = 12 bytes
  // Total Training = 16 bytes per param + activations!
  const inferenceVramGb = (paramsBillion * 2 * 1.25).toFixed(1);
  const trainingVramGb = (paramsBillion * 16 * 1.2).toFixed(1);

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Mode Switcher */}
      <div className="flex rounded-lg border border-border/80 bg-secondary/30 p-1">
        <button
          onClick={() => setMode('inference')}
          className={`flex-1 py-2 rounded-md font-bold transition-all ${
            mode === 'inference' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Inference Mode (Serving Frozen Weights)
        </button>
        <button
          onClick={() => setMode('training')}
          className={`flex-1 py-2 rounded-md font-bold transition-all ${
            mode === 'training' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Training Mode (Backprop &amp; Optimizer States)
        </button>
      </div>

      {/* Model Parameter Size Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Model Parameter Count:</span>
          <span className="text-foreground font-bold text-sm">{paramsBillion} Billion Parameters</span>
        </div>
        <div className="flex gap-2">
          {[1, 3, 7, 13, 70].map((size) => (
            <button
              key={size}
              onClick={() => setParamsBillion(size)}
              className={`flex-1 py-1.5 rounded border ${
                paramsBillion === size ? 'border-foreground bg-foreground text-background font-bold' : 'border-border bg-secondary/30 text-muted-foreground'
              }`}
            >
              {size}B
            </button>
          ))}
        </div>
      </div>

      {/* Memory Breakdown Grid */}
      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-muted-foreground">Minimum GPU VRAM Footprint:</span>
          <span className="text-xl font-bold text-foreground">
            {mode === 'inference' ? `${inferenceVramGb} GB VRAM` : `${trainingVramGb} GB VRAM`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase">Weights Buffer</span>
            <div className="text-sm font-bold text-foreground">{(paramsBillion * 2).toFixed(1)} GB (FP16)</div>
            <div className="text-[10px] text-muted-foreground">Frozen model parameters</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase">
              {mode === 'inference' ? 'KV Cache' : 'Gradients'}
            </span>
            <div className="text-sm font-bold text-foreground">
              {mode === 'inference' ? `${(paramsBillion * 0.5).toFixed(1)} GB` : `${(paramsBillion * 2).toFixed(1)} GB`}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {mode === 'inference' ? 'Dynamic attention keys/values' : 'Backprop derivative tensors'}
            </div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase">
              {mode === 'inference' ? 'Runtime Overhead' : 'Optimizer States (AdamW)'}
            </span>
            <div className="text-sm font-bold text-foreground">
              {mode === 'inference' ? '1.5 GB' : `${(paramsBillion * 12).toFixed(1)} GB`}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {mode === 'inference' ? 'CUDA runtime & scratchpad' : 'FP32 weights + momentum + variance'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
