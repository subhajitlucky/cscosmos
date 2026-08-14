'use client';

import React, { useState } from 'react';
import { ArrowRight, Globe, Lock, Network, Server, ShieldCheck, Sparkles, Terminal, Zap } from 'lucide-react';

interface RouteRule {
  host: string;
  path: string;
  targetService: string;
  targetPods: string[];
}

const RULES: RouteRule[] = [
  {
    host: 'api.example.com',
    path: '/v1/users',
    targetService: 'user-service (10.96.0.12)',
    targetPods: ['user-pod-89a (10.244.1.4)', 'user-pod-92b (10.244.2.7)']
  },
  {
    host: 'api.example.com',
    path: '/v1/orders',
    targetService: 'order-service (10.96.0.45)',
    targetPods: ['order-pod-77c (10.244.1.9)']
  },
  {
    host: 'app.example.com',
    path: '/dashboard',
    targetService: 'frontend-service (10.96.0.88)',
    targetPods: ['web-pod-11a (10.244.2.14)', 'web-pod-14d (10.244.3.2)']
  }
];

export function IngressRouterVisualizer() {
  const [selectedRule, setSelectedRule] = useState<RouteRule>(RULES[0]);

  return (
    <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400">
              Layer-7 Edge Routing Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Kubernetes Ingress Controller &amp; TLS Gateway
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> TLS Terminated (cert-manager)
        </span>
      </div>

      {/* Selectable Request URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {RULES.map((r, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedRule(r)}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              selectedRule.path === r.path && selectedRule.host === r.host
                ? 'bg-sky-600 text-white shadow-md border-sky-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-sky-500'
            }`}
          >
            <div className="text-[10px] opacity-80">{r.host}</div>
            <div className="text-xs font-bold truncate">https://{r.host}{r.path}</div>
            <div className={`text-[10px] pt-1 ${selectedRule.path === r.path ? 'text-sky-100' : 'text-sky-600 dark:text-sky-400'}`}>
              ➔ {r.targetService.split(' ')[0]}
            </div>
          </button>
        ))}
      </div>

      {/* Traffic Routing Pipeline */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Incoming HTTP Request: https://{selectedRule.host}{selectedRule.path}</span>
          <span className="text-emerald-400 font-bold">Public Cloud LB: 34.120.45.10</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-center">
          {/* Step 1: Ingress Controller */}
          <div className="p-4 rounded-2xl border border-sky-500/40 bg-sky-500/10 space-y-1">
            <span className="text-sky-400 font-bold block">1. Ingress Controller (Nginx / Envoy)</span>
            <div className="text-[10px] text-slate-300">
              Matches Host: <code className="text-sky-300">{selectedRule.host}</code><br/>
              Matches Path: <code className="text-sky-300">{selectedRule.path}</code>
            </div>
          </div>

          {/* Step 2: Cluster Service */}
          <div className="p-4 rounded-2xl border border-purple-500/40 bg-purple-500/10 space-y-1">
            <span className="text-purple-400 font-bold block">2. ClusterIP Service</span>
            <div className="text-[10px] text-slate-300">
              {selectedRule.targetService}<br/>
              <span className="text-slate-500">Virtual internal IP routing</span>
            </div>
          </div>

          {/* Step 3: Target Pod Endpoints */}
          <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-1">
            <span className="text-emerald-400 font-bold block">3. Live Pod Endpoints</span>
            <div className="text-[10px] text-emerald-300 space-y-0.5 pt-0.5">
              {selectedRule.targetPods.map((p, i) => (
                <div key={i}>• {p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
