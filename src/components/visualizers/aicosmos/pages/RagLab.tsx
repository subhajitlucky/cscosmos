'use client';

import React, { useState } from 'react';
import { Network, Play, RotateCcw, Zap, CheckCircle2, ShieldCheck, Database, Sliders, Layers } from 'lucide-react';

const CORPUS = [
  { id: 'doc-1', title: 'ingress_controller.md', text: 'NGINX ingress controller returns HTTP 504 Gateway Timeout when upstream backend pod fails to respond within proxy-read-timeout (default: 60s).', keywords: ['504', 'gateway timeout', 'ingress-nginx', 'proxy-read-timeout'] },
  { id: 'doc-2', title: 'kubernetes_hpa.md', text: 'Horizontal Pod Autoscaler (HPA) scales pods dynamically based on average CPU utilization exceeding 80% threshold.', keywords: ['hpa', 'autoscaler', 'cpu', 'scaling'] },
  { id: 'doc-3', title: 'postgres_pool.md', text: 'PostgreSQL connection pool exhaustion triggers HTTP 500 internal server errors in backend service when pool size is less than 50.', keywords: ['postgres', 'pool', 'connection', '500'] },
  { id: 'doc-4', title: 'redis_cluster.md', text: 'Redis cluster cache miss latency increases p99 response times by 45ms during cache stampede events.', keywords: ['redis', 'cache', 'p99', 'stampede'] },
];

export function RagLab() {
  const [chunkSize, setChunkSize] = useState<number>(256);
  const [retrievalMode, setRetrievalMode] = useState<'dense' | 'bm25' | 'hybrid_rerank'>('hybrid_rerank');
  const [query, setQuery] = useState<string>('error 504 gateway timeout in ingress-nginx');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<typeof CORPUS>([]);
  const [synthesizedAnswer, setSynthesizedAnswer] = useState<string>('');

  const executeSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      let filtered = [...CORPUS];
      if (retrievalMode === 'bm25') {
        // Keyword match
        filtered = CORPUS.filter(d => query.toLowerCase().split(' ').some(w => d.text.toLowerCase().includes(w) || d.keywords.includes(w)));
      } else if (retrievalMode === 'dense') {
        // Vector semantic match
        filtered = [CORPUS[0], CORPUS[2]]; // doc-1 and doc-3
      } else {
        // Hybrid + Cross-Encoder
        filtered = [CORPUS[0]]; // High precision doc-1
      }

      setResults(filtered);
      if (filtered.some(d => d.id === 'doc-1')) {
        setSynthesizedAnswer(
          'HTTP 504 Gateway Timeout in NGINX ingress is caused by the upstream backend pod exceeding the `proxy-read-timeout` window (default 60s). Increase `proxy-read-timeout` or optimize upstream database queries [Source: ingress_controller.md].'
        );
      } else {
        setSynthesizedAnswer('No relevant documents matched with sufficient confidence threshold.');
      }
      setIsSearching(false);
    }, 350);
  };

  const resetAll = () => {
    setQuery('error 504 gateway timeout in ingress-nginx');
    setRetrievalMode('hybrid_rerank');
    setResults([]);
    setSynthesizedAnswer('');
    setIsSearching(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ai-cyan)]/30 bg-[var(--ai-cyan)]/10 text-[var(--ai-cyan)] text-xs font-mono">
          <Network className="w-3.5 h-3.5" /> Interactive RAG Retrieval &amp; Re-ranking Studio
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ai-text)]">
          Hybrid RAG <span className="text-[var(--ai-primary)] ai-glow">&amp; Re-ranking Lab</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--ai-muted)] max-w-2xl leading-relaxed">
          Compare Dense Vector Search vs Sparse BM25 vs Hybrid Reciprocal Rank Fusion (RRF) with Cross-Encoder Re-Ranking.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left Controls */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--ai-border-subtle)] pb-4">
            <span className="text-[var(--ai-cyan)] uppercase tracking-wider font-bold">
              RAG Pipeline Configuration
            </span>
            <button
              onClick={resetAll}
              className="text-[10px] text-[var(--ai-muted)] hover:text-[var(--ai-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            {/* Retrieval Mode */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-[var(--ai-muted)]">Retrieval Strategy:</span>
              <div className="space-y-2">
                {[
                  ['dense', '1. Dense Vector Search (OpenAI text-embedding-3)'],
                  ['bm25', '2. Sparse Keyword Search (BM25 Index)'],
                  ['hybrid_rerank', '3. Hybrid (Dense+BM25) + Cross-Encoder Re-Ranker (Highest Recall)'],
                ].map(([mId, label]) => (
                  <button
                    key={mId}
                    onClick={() => setRetrievalMode(mId as 'dense' | 'bm25' | 'hybrid_rerank')}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                      retrievalMode === mId
                        ? 'border-[var(--ai-primary)] bg-[var(--ai-primary)]/15 text-white font-bold'
                        : 'border-[var(--ai-border-subtle)] bg-[var(--ai-bg)] text-[var(--ai-muted)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chunk Size */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--ai-muted)]">Chunk Size:</span>
                <span className="text-[var(--ai-primary)] font-bold">{chunkSize} tokens</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[128, 256, 512].map((cs) => (
                  <button
                    key={cs}
                    onClick={() => setChunkSize(cs)}
                    className={`py-1.5 rounded-lg border transition-all text-center ${
                      chunkSize === cs
                        ? 'border-[var(--ai-primary)] bg-[var(--ai-primary)]/20 text-white font-bold'
                        : 'border-[var(--ai-border-subtle)] bg-[var(--ai-bg)] text-[var(--ai-muted)]'
                    }`}
                  >
                    {cs} tokens
                  </button>
                ))}
              </div>
            </div>

            {/* Query Input */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] text-[var(--ai-muted)]">User Query:</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[var(--ai-border-subtle)] bg-[var(--ai-bg)] text-[var(--ai-text)] focus:outline-none focus:border-[var(--ai-primary)]"
              />
            </div>

            <button
              onClick={executeSearch}
              disabled={isSearching}
              className="w-full py-3 rounded-lg bg-[var(--ai-primary)] text-white font-bold hover:bg-[var(--ai-primary-hover)] transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {isSearching ? 'Traversing Vector & BM25 Indexes...' : 'Run RAG Retrieval'}
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* Retrieved Chunks */}
          <div className="p-6 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--ai-cyan)] uppercase tracking-wider font-bold text-[10px]">
                Retrieved &amp; Re-Ranked Document Chunks
              </span>
              <span className="text-[10px] text-[var(--ai-muted)]">
                {results.length} Chunks Matched
              </span>
            </div>

            {results.length === 0 ? (
              <div className="p-8 text-center text-[var(--ai-muted)] border border-dashed border-white/10 rounded-xl">
                Click &ldquo;Run RAG Retrieval&rdquo; to execute search across the corpus.
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-white/5 bg-[var(--ai-bg)] space-y-2"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-[var(--ai-primary)]">#{idx + 1} {doc.title}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        Re-Rank Score: {(0.96 - idx * 0.12).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[var(--ai-muted)] leading-relaxed">{doc.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Synthesized Response */}
          {synthesizedAnswer && (
            <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" /> Grounded LLM Generation (Zero Hallucinations)
              </div>
              <p className="text-emerald-100 text-xs leading-relaxed font-sans">
                {synthesizedAnswer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
