'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Globe, Layers, Sparkles, Zap } from 'lucide-react';

type Protocol = 'rest' | 'graphql' | 'grpc' | 'trpc';

export function ProtocolComparisonVisualizer() {
  const [protocol, setProtocol] = useState<Protocol>('graphql');

  const protocols = {
    rest: {
      name: 'REST (Representational State Transfer)',
      transport: 'HTTP/1.1 or HTTP/2',
      format: 'JSON / XML',
      pros: ['Standard HTTP caching (Cache-Control)', 'Universal client support', 'Clear URL resources'],
      cons: ['Over-fetching (returns unwanted fields)', 'Under-fetching (requires multiple roundtrips)'],
      payload: `// GET /api/v1/users/42
{
  "id": 42,
  "name": "Alice",
  "email": "alice@corp.io",
  "bio": "Staff Architect...",
  "created_at": "2026-08-14...",
  "address": { "city": "SF", "zip": "94107" },
  "followers_count": 1204
  // 40+ extra unused fields!
}`
    },
    graphql: {
      name: 'GraphQL (Declarative Query Language)',
      transport: 'HTTP POST /graphql',
      format: 'JSON (Client-Selected)',
      pros: ['Zero over/under-fetching', 'Strongly typed schema (SDL)', 'Single aggregated request'],
      cons: ['Complex HTTP caching', 'N+1 query problem without DataLoader'],
      payload: `// POST /graphql { user(id: 42) { name } }
{
  "data": {
    "user": {
      "name": "Alice"
    }
  }
}`
    },
    grpc: {
      name: 'gRPC (High Performance RPC)',
      transport: 'HTTP/2 Binary Streams',
      format: 'Protocol Buffers (Binary)',
      pros: ['10x faster serialization than JSON', 'HTTP/2 multiplexing & bidirectional streaming', 'Strict contract schema (.proto)'],
      cons: ['Not directly readable in browser fetch()', 'Binary payload not human-readable'],
      payload: `// Binary Protobuf Wire Stream:
08 2A 12 05 41 6C 69 63 65 (Only 9 raw bytes!)`
    },
    trpc: {
      name: 'tRPC (End-to-End TypeScript RPC)',
      transport: 'HTTP / WebSockets',
      format: 'JSON / SuperJSON',
      pros: ['Zero code generation required', 'Full TypeScript compile-time autocomplete', 'Instant refactoring safety'],
      cons: ['TypeScript-only (client and server must be TS)'],
      payload: `// trpc.user.byId.useQuery({ id: 42 })
// Types automatically inferred from backend AppRouter!`
    }
  };

  const current = protocols[protocol];

  return (
    <div className="rounded-3xl border border-pink-500/30 bg-pink-500/5 dark:bg-pink-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-md">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-400">
              Protocol Comparison Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              REST vs GraphQL vs gRPC vs tRPC
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-700 dark:text-pink-300 font-mono text-xs font-bold">
          {protocol.toUpperCase()}
        </span>
      </div>

      {/* Protocol Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        {(['rest', 'graphql', 'grpc', 'trpc'] as Protocol[]).map((p) => (
          <button
            key={p}
            onClick={() => setProtocol(p)}
            className={`p-3 rounded-2xl border text-center font-bold uppercase transition-all ${
              protocol === p
                ? 'bg-pink-600 text-white shadow-md border-pink-500 scale-105'
                : 'bg-card border-border text-foreground hover:border-pink-500'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Pros / Cons */}
        <div className="p-5 rounded-3xl bg-card border border-border space-y-3 shadow-sm">
          <div className="font-extrabold text-sm text-foreground">{current.name}</div>
          <div className="space-y-1 text-slate-400">
            <div><strong>Transport:</strong> {current.transport}</div>
            <div><strong>Wire Format:</strong> {current.format}</div>
          </div>

          <div className="space-y-1.5 pt-2">
            <span className="text-emerald-500 font-bold block">Key Advantages:</span>
            {current.pros.map((pro, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{pro}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wire Payload Representation */}
        <div className="p-5 rounded-3xl bg-slate-950 text-pink-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="text-slate-400 border-b border-slate-800 pb-2">Wire Payload &amp; DX:</div>
          <pre className="whitespace-pre-wrap leading-relaxed text-[11px]">
            {current.payload}
          </pre>
        </div>
      </div>
    </div>
  );
}
