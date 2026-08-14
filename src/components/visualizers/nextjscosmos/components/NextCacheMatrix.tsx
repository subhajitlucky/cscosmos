'use client';

import React, { useState } from 'react';
import { CheckCircle2, Database, HardDrive, Layers, RefreshCw, Server, Smartphone, Sparkles, XCircle } from 'lucide-react';

interface CacheStrategy {
  id: string;
  name: string;
  code: string;
  requestMemo: boolean;
  dataCache: boolean;
  fullRouteCache: boolean;
  routerCache: boolean;
  description: string;
}

const STRATEGIES: CacheStrategy[] = [
  {
    id: 'static',
    name: 'Static SSG (Default)',
    code: `fetch('https://api.com/posts') // Defaults to force-cache in SSG`,
    requestMemo: true,
    dataCache: true,
    fullRouteCache: true,
    routerCache: true,
    description: 'Pre-rendered at build time. Ultra fast (0ms TTFB), served directly from CDN edge.'
  },
  {
    id: 'isr',
    name: 'ISR (Revalidate: 60s)',
    code: `fetch('https://api.com/posts', { next: { revalidate: 60 } })`,
    requestMemo: true,
    dataCache: true,
    fullRouteCache: true,
    routerCache: true,
    description: 'Serves cached page instantly; background worker regenerates cache every 60 seconds.'
  },
  {
    id: 'dynamic',
    name: 'Dynamic SSR (no-store)',
    code: `fetch('https://api.com/live', { cache: 'no-store' })`,
    requestMemo: true,
    dataCache: false,
    fullRouteCache: false,
    routerCache: true,
    description: 'Always queries origin server on every request. Data Cache & Route Cache bypassed.'
  }
];

export function NextCacheMatrix() {
  const [selected, setSelected] = useState<CacheStrategy>(STRATEGIES[0]);

  return (
    <div className="rounded-3xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-purple-600 dark:text-purple-400">
              Next.js 15 Deep Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              The 4-Layer Caching Architecture Matrix
            </h3>
          </div>
        </div>

        {/* Strategy Buttons */}
        <div className="flex flex-wrap gap-2">
          {STRATEGIES.map((strat) => (
            <button
              key={strat.id}
              onClick={() => setSelected(strat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selected.id === strat.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-card border border-border text-foreground hover:border-purple-500'
              }`}
            >
              {strat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Layers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Layer 1 */}
        <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
          selected.requestMemo ? 'bg-emerald-500/10 border-emerald-500' : 'bg-card border-border opacity-50'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">1. Request Memoization</span>
            {selected.requestMemo ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            Dedupes identical fetch() calls within a single render pass.
          </div>
          <div className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">Scope: Server (Per Request)</div>
        </div>

        {/* Layer 2 */}
        <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
          selected.dataCache ? 'bg-emerald-500/10 border-emerald-500' : 'bg-rose-500/5 border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">2. Data Cache</span>
            {selected.dataCache ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            Stores fetch results across incoming server requests and deployments.
          </div>
          <div className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">Scope: Server (Persistent)</div>
        </div>

        {/* Layer 3 */}
        <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
          selected.fullRouteCache ? 'bg-emerald-500/10 border-emerald-500' : 'bg-rose-500/5 border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">3. Full Route Cache</span>
            {selected.fullRouteCache ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            Caches complete HTML and RSC payloads at build/revalidation time.
          </div>
          <div className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">Scope: Server (Edge CDN)</div>
        </div>

        {/* Layer 4 */}
        <div className={`p-4 rounded-2xl border transition-all space-y-2 ${
          selected.routerCache ? 'bg-emerald-500/10 border-emerald-500' : 'bg-rose-500/5 border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">4. Router Cache</span>
            {selected.routerCache ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            Client in-memory cache storing visited routes for instantaneous navigation.
          </div>
          <div className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">Scope: Client (Browser Session)</div>
        </div>
      </div>

      {/* Code & Summary */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
        <div className="text-xs font-mono text-muted-foreground">Code Syntax: <code>{selected.code}</code></div>
        <p className="text-xs sm:text-sm text-foreground leading-relaxed">
          <strong>Behavior:</strong> {selected.description}
        </p>
      </div>
    </div>
  );
}
