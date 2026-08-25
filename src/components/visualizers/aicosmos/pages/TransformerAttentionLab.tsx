'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  Grid, 
  Sliders, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  Hash, 
  Share2, 
  Lock, 
  Unlock, 
  Zap 
} from 'lucide-react';

interface HeadConfig {
  name: string;
  focus: string;
  description: string;
  weightShift: number;
}

const PRESET_SENTENCES = [
  'The transformer model processes human language efficiently',
  'Attention is all you need for sequence models',
  'The animal did not cross the street because it was tired',
  'Deep neural networks learn rich latent representations',
];

const ATTENTION_HEADS: HeadConfig[] = [
  {
    name: 'Head 1: Syntactic Dependencies',
    focus: 'Verbs & Direct Objects',
    description: 'Specializes in linking predicate verbs with their direct syntactic objects across distant clauses.',
    weightShift: 1.2,
  },
  {
    name: 'Head 2: Positional Locality',
    focus: 'Adjacent Neighbor Biases',
    description: 'Captures local n-gram contexts and immediate sequential precedence in natural grammar.',
    weightShift: 2.5,
  },
  {
    name: 'Head 3: Coreference Resolution',
    focus: 'Pronouns & Antecedents',
    description: 'Resolves ambiguous anaphora (e.g. "it", "they") back to the root noun entity in the sequence.',
    weightShift: 0.8,
  },
  {
    name: 'Head 4: Semantic Associations',
    focus: 'Contextual Topic Embeddings',
    description: 'Attends to semantically congruent topical clusters regardless of absolute sequence distance.',
    weightShift: 1.6,
  },
];

export function TransformerAttentionLab() {
  const [selectedSentence, setSelectedSentence] = useState<string>(PRESET_SENTENCES[0]);
  const [customInput, setCustomInput] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [activeHeadIndex, setActiveHeadIndex] = useState<number>(0);
  const [isCausalMasked, setIsCausalMasked] = useState<boolean>(false);
  const [hoveredCell, setHoveredCell] = useState<{ queryIdx: number; keyIdx: number } | null>(null);
  const [temperature, setTemperature] = useState<number>(1.0);

  const tokens = useMemo(() => {
    const text = isCustom && customInput.trim() ? customInput : selectedSentence;
    return text.trim().split(/\s+/).slice(0, 8); // Top 8 tokens for clean matrix display
  }, [selectedSentence, customInput, isCustom]);

  const d_k = 64; // Embedding dimension per head
  const sqrt_dk = Math.sqrt(d_k); // 8.0

  // Deterministic pseudo-embedding vectors for Q, K, V derived from token strings & head index
  const { rawScores, scaledScores, attentionWeights } = useMemo(() => {
    const n = tokens.length;

    // Seeded pseudo-embedding generation
    const genVector = (str: string, seedOffset: number) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i) + seedOffset;
        hash |= 0;
      }
      return [
        Math.sin(hash * 0.1) * 2,
        Math.cos(hash * 0.2) * 2,
        Math.sin(hash * 0.3) * 2,
        Math.cos(hash * 0.4) * 2,
      ];
    };

    const qVectors: number[][] = [];
    const kVectors: number[][] = [];
    const vVectors: number[][] = [];

    tokens.forEach((tok, idx) => {
      qVectors.push(genVector(tok, 10 + activeHeadIndex * 7 + idx));
      kVectors.push(genVector(tok, 20 + activeHeadIndex * 11 + idx));
      vVectors.push(genVector(tok, 30 + activeHeadIndex * 13 + idx));
    });

    // 1. Raw Dot Product Q * K^T
    const raw: number[][] = [];
    const scaled: number[][] = [];

    for (let i = 0; i < n; i++) {
      const rawRow: number[] = [];
      const scaledRow: number[] = [];
      for (let j = 0; j < n; j++) {
        let dot = 0;
        for (let d = 0; d < 4; d++) {
          dot += qVectors[i][d] * kVectors[j][d];
        }

        // Add Head-specific structural bias
        if (activeHeadIndex === 1) {
          // Positional bias
          dot += Math.max(0, 3 - Math.abs(i - j) * 1.5);
        } else if (activeHeadIndex === 0 && (i === 2 || j === 2)) {
          dot += 2.2;
        }

        rawRow.push(dot);

        // Scaled dot product
        let s = (dot / (sqrt_dk / 2)) / temperature;

        // Apply Causal / Autoregressive Decoder Mask
        if (isCausalMasked && j > i) {
          s = -1e9; // Negative infinity for future tokens
        }

        scaledRow.push(s);
      }
      raw.push(rawRow);
      scaled.push(scaledRow);
    }

    // 2. Softmax along each row: Softmax(s_i) = exp(s_ij) / sum(exp(s_ik))
    const attn: number[][] = [];
    for (let i = 0; i < n; i++) {
      const maxVal = Math.max(...scaled[i]);
      const expRow = scaled[i].map((val) => (val <= -1e8 ? 0 : Math.exp(val - maxVal)));
      const sumExp = expRow.reduce((acc, curr) => acc + curr, 0) || 1e-9;
      attn.push(expRow.map((e) => e / sumExp));
    }

    return {
      rawScores: raw,
      scaledScores: scaled,
      attentionWeights: attn,
    };
  }, [tokens, activeHeadIndex, isCausalMasked, temperature]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--ai-border-subtle)] pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--ai-border)] bg-[var(--ai-primary)]/10 px-3 py-1 text-xs font-mono font-semibold text-[var(--ai-primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Attention Is All You Need &bull; Scaled Dot-Product Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ai-text)]">
            Transformer <span className="text-[var(--ai-primary)] ai-glow">Self-Attention Lab</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ai-muted)] leading-relaxed">
            Deconstruct the core math that powers modern LLMs (GPT-4, Gemini, Claude). Step through linear Query (Q), Key (K), Value (V) projections, scaled dot products, softmax probability normalizations, multi-head attention decomposition, and causal autoregressive masking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCausalMasked(!isCausalMasked)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border ${
              isCausalMasked
                ? 'bg-[var(--ai-primary)]/15 border-[var(--ai-primary)] text-[var(--ai-primary)] shadow-sm'
                : 'bg-[var(--ai-surface)] border-[var(--ai-border-subtle)] text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
            }`}
          >
            {isCausalMasked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            <span>{isCausalMasked ? 'Causal Mask: ON (GPT Decoder)' : 'Causal Mask: OFF (BERT Encoder)'}</span>
          </button>
        </div>
      </div>

      {/* Input Sentence Toolbar & Presets */}
      <div className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ai-text)] flex items-center gap-2">
            <Hash className="h-4 w-4 text-[var(--ai-primary)]" />
            Input Token Sequence
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustom(false)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                !isCustom ? 'bg-[var(--ai-primary)] text-white' : 'text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
              }`}
            >
              Preset Sentences
            </button>
            <button
              onClick={() => setIsCustom(true)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                isCustom ? 'bg-[var(--ai-primary)] text-white' : 'text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
              }`}
            >
              Custom Text
            </button>
          </div>
        </div>

        {!isCustom ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_SENTENCES.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSentence(s)}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  selectedSentence === s
                    ? 'border-[var(--ai-primary)] bg-[var(--ai-primary)]/10 text-[var(--ai-text)] font-semibold shadow-sm'
                    : 'border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
                }`}
              >
                &ldquo;{s}&rdquo;
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter sentence tokens (e.g. LLMs process token sequences in parallel)..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--ai-border)] bg-[var(--ai-surface-2)] px-4 py-2.5 text-xs text-[var(--ai-text)] focus:outline-none focus:border-[var(--ai-primary)]"
            />
          </div>
        )}

        {/* Token Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--ai-border-subtle)]">
          <span className="text-[10px] font-mono text-[var(--ai-muted)] uppercase">Parsed Tokens ({tokens.length}):</span>
          {tokens.map((t, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-[var(--ai-bg)] border border-[var(--ai-border-subtle)] font-mono text-xs text-[var(--ai-text)] flex items-center gap-1.5"
            >
              <span className="text-[10px] text-[var(--ai-primary)] font-bold">[{idx}]</span>
              <span>{t}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Multi-Head Attention Head Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ai-text)] flex items-center gap-2">
            <Layers className="h-4 w-4 text-[var(--ai-cyan)]" />
            Multi-Head Attention (MHA) Projection Heads
          </span>
          <span className="text-[10px] font-mono text-[var(--ai-muted)]">d_k = 64 &bull; 8 Heads Parallel</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ATTENTION_HEADS.map((head, idx) => (
            <button
              key={idx}
              onClick={() => setActiveHeadIndex(idx)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeHeadIndex === idx
                  ? 'border-[var(--ai-cyan)] bg-[var(--ai-cyan)]/10 shadow-md ring-1 ring-[var(--ai-cyan)]/30'
                  : 'border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] hover:bg-[var(--ai-surface-2)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[var(--ai-text)]">{head.name}</span>
                {activeHeadIndex === idx && <CheckCircle2 className="h-3.5 w-3.5 text-[var(--ai-cyan)]" />}
              </div>
              <div className="text-[10px] font-mono font-bold text-[var(--ai-cyan)] mb-1.5">{head.focus}</div>
              <p className="text-[11px] text-[var(--ai-muted)] leading-relaxed">{head.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Core Attention Matrix Heatmap & Formula Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Attention Matrix Heatmap */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--ai-border-subtle)] pb-4">
            <div className="flex items-center gap-2">
              <Grid className="h-4 w-4 text-[var(--ai-primary)]" />
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--ai-text)]">
                Attention Weight Heatmap Softmax(Q &middot; K&#7488; / &radic;d_k)
              </span>
            </div>
            <span className="text-[10px] font-mono text-[var(--ai-muted)]">Hover cell to inspect</span>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[420px] space-y-2">
              
              {/* Header Key Labels */}
              <div className="flex items-center pl-24 gap-2">
                {tokens.map((tok, j) => (
                  <div
                    key={`k-hdr-${j}`}
                    className="w-14 text-center font-mono text-[10px] text-[var(--ai-muted)] truncate"
                    title={`Key ${j}: ${tok}`}
                  >
                    K:{tok}
                  </div>
                ))}
              </div>

              {/* Rows: Query Tokens */}
              {tokens.map((qTok, i) => (
                <div key={`q-row-${i}`} className="flex items-center gap-2">
                  <div className="w-24 text-right font-mono text-xs font-semibold text-[var(--ai-text)] truncate pr-2">
                    Q:{qTok}
                  </div>

                  {tokens.map((kTok, j) => {
                    const weight = attentionWeights[i]?.[j] ?? 0;
                    const isMasked = isCausalMasked && j > i;
                    const isHovered = hoveredCell?.queryIdx === i && hoveredCell?.keyIdx === j;

                    // Color mapping: opacity based on softmax weight
                    const alpha = isMasked ? 0.05 : Math.max(0.1, weight);

                    return (
                      <div
                        key={`cell-${i}-${j}`}
                        onMouseEnter={() => setHoveredCell({ queryIdx: i, keyIdx: j })}
                        onMouseLeave={() => setHoveredCell(null)}
                        style={{
                          backgroundColor: isMasked
                            ? 'rgba(255, 255, 255, 0.02)'
                            : `rgba(99, 102, 241, ${alpha})`,
                        }}
                        className={`w-14 h-12 rounded-lg border flex flex-col items-center justify-center font-mono cursor-pointer transition-all ${
                          isHovered
                            ? 'border-white scale-105 z-10 shadow-lg'
                            : isMasked
                            ? 'border-dashed border-[var(--ai-border-subtle)] text-[var(--ai-muted)]/40'
                            : 'border-[var(--ai-border-subtle)] text-[var(--ai-text)]'
                        }`}
                      >
                        {isMasked ? (
                          <span className="text-[10px]">&minus;&infin;</span>
                        ) : (
                          <>
                            <span className="text-xs font-bold">{(weight * 100).toFixed(0)}%</span>
                            <span className="text-[9px] text-[var(--ai-muted)]">{weight.toFixed(2)}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

            </div>
          </div>

          {/* Scale Legend */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--ai-muted)] pt-3 border-t border-[var(--ai-border-subtle)]">
            <span>Low Attention (0%)</span>
            <div className="flex h-2.5 w-48 rounded-full overflow-hidden border border-[var(--ai-border-subtle)]"><span className="flex-1 bg-[rgba(99,102,241,0.15)]" /><span className="flex-1 bg-[rgba(99,102,241,0.55)]" /><span className="flex-1 bg-[rgba(99,102,241,1)]" /></div>
            <span>High Attention (100%)</span>
          </div>

        </div>

        {/* Right 5 Cols: Live Mathematical Step Inspector */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--ai-border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[var(--ai-primary)]" />
                <span className="font-bold text-xs uppercase tracking-wider text-[var(--ai-text)]">
                  Active Cell Math Inspector
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--ai-cyan)] font-bold">
                {hoveredCell ? `Q[${hoveredCell.queryIdx}] → K[${hoveredCell.keyIdx}]` : 'Hover matrix cell'}
              </span>
            </div>

            {hoveredCell ? (
              <div className="space-y-4 text-xs font-mono">
                {/* Step 1 */}
                <div className="p-3 rounded-xl bg-[var(--ai-surface-2)] border border-[var(--ai-border-subtle)] space-y-1">
                  <div className="text-[10px] font-bold text-[var(--ai-cyan)] uppercase">1. Raw Dot Product Score (Q &middot; K)</div>
                  <div className="text-sm font-bold text-[var(--ai-text)]">
                    Score = {rawScores[hoveredCell.queryIdx]?.[hoveredCell.keyIdx]?.toFixed(3)}
                  </div>
                  <p className="text-[10px] text-[var(--ai-muted)] font-sans">
                    Computed by taking the scalar dot product between Query vector for &ldquo;{tokens[hoveredCell.queryIdx]}&rdquo; and Key vector for &ldquo;{tokens[hoveredCell.keyIdx]}&rdquo;.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-xl bg-[var(--ai-surface-2)] border border-[var(--ai-border-subtle)] space-y-1">
                  <div className="text-[10px] font-bold text-[var(--ai-primary)] uppercase">2. Scaling by 1 / &radic;d_k (&radic;64 = 8.0)</div>
                  <div className="text-sm font-bold text-[var(--ai-text)]">
                    Scaled = {scaledScores[hoveredCell.queryIdx]?.[hoveredCell.keyIdx]?.toFixed(3)}
                  </div>
                  <p className="text-[10px] text-[var(--ai-muted)] font-sans">
                    Prevents vanishing gradients in Softmax when embedding dimensions grow large.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-xl bg-[var(--ai-surface-2)] border border-[var(--ai-border-subtle)] space-y-1">
                  <div className="text-[10px] font-bold text-[var(--ai-emerald)] uppercase">3. Softmax Normalization P(K | Q)</div>
                  <div className="text-base font-extrabold text-[var(--ai-emerald)]">
                    Weight = {(attentionWeights[hoveredCell.queryIdx]?.[hoveredCell.keyIdx] * 100).toFixed(1)}% ({attentionWeights[hoveredCell.queryIdx]?.[hoveredCell.keyIdx]?.toFixed(4)})
                  </div>
                  <p className="text-[10px] text-[var(--ai-muted)] font-sans">
                    Normalized probability across row {hoveredCell.queryIdx} (row sum equals exactly 1.0).
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[var(--ai-muted)] font-mono border border-dashed border-[var(--ai-border-subtle)] rounded-xl space-y-2">
                <Eye className="h-6 w-6 mx-auto text-[var(--ai-primary)] opacity-60" />
                <p>Move your cursor over any matrix cell on the left to see the exact dot-product, scaling, and softmax computations.</p>
              </div>
            )}
          </div>

          {/* Attention Mechanism Formula Reference */}
          <div className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--ai-text)] flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--ai-amber)]" />
              Canonical Transformer Equation
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--ai-bg)] border border-[var(--ai-border-subtle)] font-mono text-xs text-[var(--ai-primary)] font-bold text-center">
              Attention(Q, K, V) = Softmax(Q &middot; K&#7488; / &radic;d_k) &middot; V
            </div>
          </div>

        </div>

      </div>

      {/* Deep Dive Architecture Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[var(--ai-border-subtle)]">
        <div className="p-5 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-2">
          <h3 className="text-sm font-bold text-[var(--ai-text)] flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[var(--ai-primary)]" />
            Why Divide by &radic;d_k?
          </h3>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            For large dimensions, dot products grow large in magnitude, pushing Softmax into regions with extremely small gradients (&approx; 0). Scaling by 1/&radic;d_k preserves unit variance.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-2">
          <h3 className="text-sm font-bold text-[var(--ai-text)] flex items-center gap-2">
            <Lock className="h-4 w-4 text-[var(--ai-cyan)]" />
            Causal Masking in Autoregressive LLMs
          </h3>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            Decoder models like GPT prevent tokens from looking into the future by setting upper-triangular logits to &minus;&infin;, ensuring next-token predictions depend only on past context.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-2">
          <h3 className="text-sm font-bold text-[var(--ai-text)] flex items-center gap-2">
            <Share2 className="h-4 w-4 text-[var(--ai-emerald)]" />
            Multi-Head Synergy
          </h3>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            Rather than performing a single attention function, Multi-Head Attention linearly projects Q, K, V into h different subspaces, allowing the model to jointly attend to syntax, coreference, and semantics simultaneously.
          </p>
        </div>
      </div>

    </div>
  );
}
