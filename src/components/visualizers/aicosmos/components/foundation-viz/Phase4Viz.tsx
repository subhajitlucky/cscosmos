'use client';

import React, { useState } from 'react';
import {
  Workflow,
  Dice5,
  AlertOctagon,
  Wrench,
  Cloud,
  Laptop,
  Play,
  RotateCcw,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Lock,
  DollarSign
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Topic 20: What Happens When Model Receives Input? (Inference Dataflow)     */
/* -------------------------------------------------------------------------- */
export function InputFlowStepperWidget() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'String Tokenization (BPE)',
      desc: 'Raw UTF-8 text string is parsed by Byte-Pair Encoding into token discrete integer IDs.',
      data: '"AI" -> [15340], " Engineering" -> [8923]'
    },
    {
      num: '02',
      title: 'Embedding Matrix Lookup',
      desc: 'Integer token IDs are mapped to dense float vectors in continuous d-dimensional space (e.g., 4096 floats per token).',
      data: 'T[15340] -> [0.12, -0.45, 0.98, ... 4096 dims]'
    },
    {
      num: '03',
      title: 'Positional Encoding Addition',
      desc: 'Rotary Position Embeddings (RoPE) are added to inform the model of word order and distance.',
      data: 'E_pos = RoPE(E_token, position_index)'
    },
    {
      num: '04',
      title: 'Stacked Transformer Layers',
      desc: 'Multi-Head Self-Attention projects Queries (Q), Keys (K), and Values (V). Feed-forward MLPs transform hidden states.',
      data: 'Attention(Q, K, V) = softmax(QK^T / √d_k) V'
    },
    {
      num: '05',
      title: 'Final Unembedding Projection',
      desc: 'Final hidden vector is multiplied by vocabulary matrix to yield 32,000 to 128,000 raw logit scores.',
      data: 'Logits Z = W_vocab · H_final'
    },
    {
      num: '06',
      title: 'Softmax Sampling & Token Emission',
      desc: 'Logits are converted to probabilities. Temperature sampling selects token ID and appends to KV cache.',
      data: 'Sample: token_next = "Foundations"'
    }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
        {steps.map((s, idx) => (
          <button
            key={s.num}
            onClick={() => setActiveStep(idx)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              activeStep === idx
                ? 'border-foreground bg-foreground text-background font-bold shadow-sm'
                : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="text-[10px] opacity-75">STEP {s.num}</div>
            <div className="truncate font-semibold mt-0.5">{s.title.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="font-bold text-sm text-foreground">
            Step {steps[activeStep].num}: {steps[activeStep].title}
          </div>
          <span className="text-[11px] text-emerald-500 font-semibold">Active State</span>
        </div>

        <p className="text-xs font-sans text-muted-foreground leading-relaxed">
          {steps[activeStep].desc}
        </p>

        <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Tensor Intermediate Payload:</span>
          <div className="text-foreground text-[11px] font-semibold">{steps[activeStep].data}</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 21: Deterministic vs Probabilistic (Seed & Temperature Simulator)    */
/* -------------------------------------------------------------------------- */
export function ProbabilisticSimulatorDeepWidget() {
  const [temp, setTemp] = useState<number>(0.0);
  const [history, setHistory] = useState<string[]>([]);

  const runSample = () => {
    let result = 'Token_A ("Consistent")';
    if (temp > 0) {
      const r = Math.random();
      if (r > 0.7) result = 'Token_B ("Alternative")';
      if (r > 0.9) result = 'Token_C ("Creative")';
    }
    setHistory((prev) => [result, ...prev.slice(0, 3)]);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-secondary/30">
        <div>
          <span className="text-muted-foreground block text-[10px] uppercase">Sampling Mode:</span>
          <div className="text-sm font-bold text-foreground">
            {temp === 0.0 ? 'T = 0.0 (Purely Deterministic)' : `T = ${temp.toFixed(1)} (Stochastic / Probabilistic)`}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTemp(0.0)}
            className={`px-3 py-1.5 rounded border transition-colors ${
              temp === 0.0 ? 'border-foreground bg-foreground text-background font-bold' : 'border-border text-muted-foreground'
            }`}
          >
            T = 0.0 (Greedy)
          </button>
          <button
            onClick={() => setTemp(0.8)}
            className={`px-3 py-1.5 rounded border transition-colors ${
              temp === 0.8 ? 'border-foreground bg-foreground text-background font-bold' : 'border-border text-muted-foreground'
            }`}
          >
            T = 0.8 (Creative)
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={runSample}
          className="px-4 py-2 rounded-lg bg-foreground text-background font-bold hover:bg-foreground/90 transition-colors"
        >
          Execute Inference Sample
        </button>
        <span className="text-muted-foreground text-[11px]">Click 4 times to observe variance</span>
      </div>

      {history.length > 0 && (
        <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-1.5">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">Sequential Run History:</span>
          {history.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-foreground">
              <span>Run #{history.length - i} Output:</span>
              <strong className={temp === 0 ? 'text-emerald-500' : 'text-foreground'}>{item}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 22: Why AI Makes Mistakes (Failure Mode Diagnostics)                 */
/* -------------------------------------------------------------------------- */
export function FailureModeDiagnosticWidget() {
  const [selectedFailure, setSelectedFailure] = useState<'hallucination' | 'ood' | 'context' | 'injection'>('hallucination');

  const failures = {
    hallucination: {
      name: 'Hallucination & Confabulation',
      cause: 'Model is an autoregressive token predictor optimizing grammatical fluency, not an ontological database of truth.',
      mitigation: 'Implement Grounded RAG with strict citation verification and zero-temperature decoding.',
      riskLevel: 'HIGH // Plausible falsehoods delivered with high confidence.'
    },
    ood: {
      name: 'Out-of-Distribution (OOD) Shift',
      cause: 'Input query data differs fundamentally from the statistical manifold of the training corpus.',
      mitigation: 'Add uncertainty estimation, input boundary checks, and human-in-the-loop escalation.',
      riskLevel: 'CRITICAL // Model produces unpredictable outputs on novel distribution domains.'
    },
    context: {
      name: 'Context Loss (Needle in Haystack)',
      cause: 'Attention saturation in long contexts causes middle tokens to be degraded or ignored (U-shaped attention curve).',
      mitigation: 'Chunk and re-rank documents; place crucial reference context at the beginning or end of prompt.',
      riskLevel: 'MEDIUM // Missing fine-grained details in 50k+ token documents.'
    },
    injection: {
      name: 'Adversarial Prompt Injection',
      cause: 'Untrusted user input mixes with system instructions, overriding the model’s intended operational persona.',
      mitigation: 'Isolate user data with XML tags, dual-LLM architectural filters (LlamaGuard), and hardened system prompts.',
      riskLevel: 'CRITICAL // Security vulnerability allowing unauthorized tool execution.'
    }
  };

  const curr = failures[selectedFailure];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(failures) as Array<keyof typeof failures>).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedFailure(key)}
            className={`p-3 rounded-lg border text-center transition-all ${
              selectedFailure === key
                ? 'border-foreground bg-foreground text-background font-bold shadow-sm'
                : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            {failures[key].name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <h3 className="font-display font-bold text-base sm:text-lg text-foreground">{curr.name}</h3>
          <span className="text-[11px] px-2.5 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-500 font-semibold">
            {curr.riskLevel}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Root Engineering Cause:</span>
          <p className="text-xs font-sans text-muted-foreground leading-relaxed">{curr.cause}</p>
        </div>

        <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
          <span className="text-[10px] text-emerald-500 uppercase font-bold">Production Mitigation:</span>
          <p className="text-xs font-sans text-foreground leading-relaxed">{curr.mitigation}</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 23: AI Engineering Tools (Modern AI Tech Stack Builder)              */
/* -------------------------------------------------------------------------- */
export function AiToolsStackWidget() {
  const [pattern, setPattern] = useState<'rag' | 'agent' | 'finetune'>('rag');

  const architectures = {
    rag: {
      name: 'Production RAG System',
      serving: 'vLLM / TensorRT-LLM',
      orchestration: 'LlamaIndex / LangChain',
      retrieval: 'Qdrant / PGVector (Hybrid Search)',
      evaluation: 'Ragas / DeepEval',
      observability: 'LangSmith / OpenTelemetry'
    },
    agent: {
      name: 'Autonomous Agentic Workflow',
      serving: 'Ollama / Claude 3.5 Sonnet Tool Use',
      orchestration: 'LangGraph / AutoGen / CrewAI',
      retrieval: 'Memory Vector Store + SQLite Tool State',
      evaluation: 'SWE-Bench / Custom Unit Assertions',
      observability: 'Arize Phoenix / OpenLLMetry'
    },
    finetune: {
      name: 'Custom Domain LoRA Fine-Tuning',
      serving: 'Axolotl / Unsloth / Hugging Face SFT',
      orchestration: 'PyTorch FSDP / DeepSpeed ZeRO-3',
      retrieval: 'Hugging Face Datasets / Synthetic Data',
      evaluation: 'Evaluation Loss & MMLU Benchmark',
      observability: 'Weights & Biases / MLflow'
    }
  };

  const curr = architectures[pattern];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={() => setPattern('rag')}
          className={`p-3 rounded-lg border font-bold transition-all ${
            pattern === 'rag' ? 'border-foreground bg-foreground text-background' : 'border-border bg-secondary/30 text-muted-foreground'
          }`}
        >
          RAG Pipeline Stack
        </button>
        <button
          onClick={() => setPattern('agent')}
          className={`p-3 rounded-lg border font-bold transition-all ${
            pattern === 'agent' ? 'border-foreground bg-foreground text-background' : 'border-border bg-secondary/30 text-muted-foreground'
          }`}
        >
          Agentic Loop Stack
        </button>
        <button
          onClick={() => setPattern('finetune')}
          className={`p-3 rounded-lg border font-bold transition-all ${
            pattern === 'finetune' ? 'border-foreground bg-foreground text-background' : 'border-border bg-secondary/30 text-muted-foreground'
          }`}
        >
          Fine-Tuning Stack
        </button>
      </div>

      <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 space-y-4">
        <div className="border-b border-border/60 pb-2 font-bold text-sm text-foreground">
          Recommended Stack: {curr.name}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">1. Model Inference Runtime</span>
            <div className="text-foreground font-semibold">{curr.serving}</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">2. Workflow Orchestration</span>
            <div className="text-foreground font-semibold">{curr.orchestration}</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">3. Context Storage &amp; State</span>
            <div className="text-foreground font-semibold">{curr.retrieval}</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">4. CI/CD Evaluation &amp; Metrics</span>
            <div className="text-foreground font-semibold">{curr.evaluation}</div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-secondary/40 space-y-1 sm:col-span-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">5. Production Observability</span>
            <div className="text-emerald-500 font-semibold">{curr.observability}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Topic 24: Local AI vs Cloud AI (Cost & Latency Tradeoff Calculator)        */
/* -------------------------------------------------------------------------- */
export function LocalVsCloudTradeoffWidget() {
  const [tokenVolumeMillion, setTokenVolumeMillion] = useState<number>(10);
  const [requiresPrivacy, setRequiresPrivacy] = useState<boolean>(true);

  // Approximate pricing:
  // Cloud (GPT-4o or Claude Sonnet tier): ~$4 per 1M tokens combined in/out
  // Local (Mac Studio M2/M3 or On-Prem RTX 4090): $0 token cost after fixed hardware $2500, ~$40/mo electricity
  const cloudCostMonthly = tokenVolumeMillion * 4.0;
  const localCostMonthly = 40.0; // Electricity & depreciation

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Token Volume Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly Token Volume:</span>
            <span className="text-foreground font-bold">{tokenVolumeMillion} Million Tokens</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={tokenVolumeMillion}
            onChange={(e) => setTokenVolumeMillion(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Privacy Requirement */}
        <div className="space-y-2">
          <label className="text-muted-foreground">Data Privacy Constraint:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setRequiresPrivacy(true)}
              className={`flex-1 py-1.5 rounded border ${
                requiresPrivacy ? 'border-foreground bg-foreground text-background font-bold' : 'border-border bg-secondary/30 text-muted-foreground'
              }`}
            >
              Strict HIPAA / On-Prem
            </button>
            <button
              onClick={() => setRequiresPrivacy(false)}
              className={`flex-1 py-1.5 rounded border ${
                !requiresPrivacy ? 'border-foreground bg-foreground text-background font-bold' : 'border-border bg-secondary/30 text-muted-foreground'
              }`}
            >
              Public / Commercial API
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-border/80 bg-secondary/20 space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Laptop className="h-4 w-4 text-emerald-500" /> Local Model (Ollama / vLLM)
            </span>
            <span className="text-emerald-500 font-bold">${localCostMonthly}/mo</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-muted-foreground">
            <div>&bull; Privacy: 100% On-Premise, zero external packets</div>
            <div>&bull; Latency: Sub-15ms TTFT, zero network hops</div>
            <div>&bull; Upfront CapEx: $2,500 hardware required</div>
            <div>&bull; Max model capacity bounded by VRAM</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border/80 bg-secondary/20 space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Cloud className="h-4 w-4 text-blue-500" /> Cloud API (OpenAI / Anthropic)
            </span>
            <span className="text-foreground font-bold">${cloudCostMonthly.toFixed(0)}/mo</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-muted-foreground">
            <div>&bull; Privacy: Transmitted over TLS to external provider</div>
            <div>&bull; Latency: 150-300ms network roundtrip</div>
            <div>&bull; Zero upfront hardware cost</div>
            <div>&bull; Immediate access to frontier frontier-tier models</div>
          </div>
        </div>
      </div>
    </div>
  );
}
