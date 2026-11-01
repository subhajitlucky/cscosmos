'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CorsScenario {
  id: string;
  label: string;
  tag: string;
  headers: {
    origin: string;
    credentials?: string;
    methods: string;
    allowedHeaders: string;
    maxAge: string;
  };
  verdict: {
    valid: boolean;
    title: string;
    summary: string;
  };
}

const SCENARIOS: CorsScenario[] = [
  {
    id: 'auth',
    label: 'Authenticated API',
    tag: 'Production Safe',
    headers: {
      origin: 'https://app.example.com',
      credentials: 'true',
      methods: 'GET, POST, PUT, DELETE, OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      maxAge: '86400 (24h cache)',
    },
    verdict: {
      valid: true,
      title: 'Valid & Secure',
      summary: 'Only https://app.example.com can read responses with cookies/auth. Preflight is cached for 24h to avoid extra roundtrips.',
    },
  },
  {
    id: 'public',
    label: 'Public Open API',
    tag: 'Read-Only / CDN',
    headers: {
      origin: '*',
      credentials: '(omitted)',
      methods: 'GET, HEAD',
      allowedHeaders: 'Content-Type',
      maxAge: '3600 (1h cache)',
    },
    verdict: {
      valid: true,
      title: 'Public Access',
      summary: 'Any origin can read data. Credentials are disallowed, preventing sensitive session theft.',
    },
  },
  {
    id: 'trap',
    label: 'The Classic Blunder',
    tag: 'Browser Rejection',
    headers: {
      origin: '*',
      credentials: 'true',
      methods: 'GET, POST, PUT',
      allowedHeaders: 'Content-Type, Authorization',
      maxAge: '0 (no cache)',
    },
    verdict: {
      valid: false,
      title: 'Browser NetworkError',
      summary: 'Browsers strictly forbid pairing wildcard "*" with credentials: true. Client fetch() will fail immediately.',
    },
  },
];

const HEADER_DEFINITIONS = [
  {
    name: 'Access-Control-Allow-Origin',
    purpose: 'Specifies which origin(s) can read the response body.',
    getKey: (h: CorsScenario['headers']) => h.origin,
  },
  {
    name: 'Access-Control-Allow-Credentials',
    purpose: 'Must be "true" to expose response when cookies or auth tokens are sent.',
    getKey: (h: CorsScenario['headers']) => h.credentials || '(omitted)',
  },
  {
    name: 'Access-Control-Allow-Methods',
    purpose: 'Permitted HTTP verbs for cross-origin requests.',
    getKey: (h: CorsScenario['headers']) => h.methods,
  },
  {
    name: 'Access-Control-Allow-Headers',
    purpose: 'Permitted custom request headers sent by client.',
    getKey: (h: CorsScenario['headers']) => h.allowedHeaders,
  },
  {
    name: 'Access-Control-Max-Age',
    purpose: 'Seconds the browser caches preflight OPTIONS answer.',
    getKey: (h: CorsScenario['headers']) => h.maxAge,
  },
];

export function CorsHeadersExplorer() {
  const [selectedId, setSelectedId] = useState<string>('auth');
  const active = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];

  return (
    <div className="border border-border bg-card rounded-xl p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">
          Critical CORS Response Headers
        </h3>
        <p className="text-xs text-muted-foreground">
          Click a real-world scenario to see how the 5 core headers are configured and evaluated by the browser.
        </p>
      </div>

      {/* Scenario Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {SCENARIOS.map((s) => {
          const isSelected = s.id === selectedId;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={cn(
                'text-left rounded-lg p-3 border text-xs transition-colors flex flex-col gap-1',
                isSelected
                  ? 'border-foreground bg-muted font-bold text-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <div className="flex items-center justify-between">
                <span>{s.label}</span>
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded',
                    s.verdict.valid
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  )}
                >
                  {s.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 5 Headers Table/List */}
      <div className="rounded-lg border border-border divide-y divide-border overflow-hidden bg-background">
        {HEADER_DEFINITIONS.map((def) => {
          const val = def.getKey(active.headers);
          const isError = !active.verdict.valid && (def.name.includes('Origin') || def.name.includes('Credentials'));

          return (
            <div
              key={def.name}
              className={cn(
                'p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs',
                isError && 'bg-rose-500/5'
              )}
            >
              <div className="space-y-0.5 min-w-0">
                <span className="font-mono font-bold text-foreground block">
                  {def.name}
                </span>
                <span className="text-muted-foreground text-[11px] block">
                  {def.purpose}
                </span>
              </div>

              <code
                className={cn(
                  'font-mono text-xs px-2.5 py-1 rounded border shrink-0',
                  isError
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 font-bold'
                    : 'border-border bg-muted/60 text-foreground'
                )}
              >
                {val}
              </code>
            </div>
          );
        })}
      </div>

      {/* Real-time Verdict */}
      <div
        className={cn(
          'rounded-lg border p-3.5 flex items-start gap-2.5 text-xs',
          active.verdict.valid
            ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
            : 'border-rose-500/40 bg-rose-500/5 text-rose-300'
        )}
      >
        {active.verdict.valid ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
        )}
        <div className="space-y-0.5">
          <span className="font-bold block text-foreground">
            {active.verdict.title}
          </span>
          <span className="text-muted-foreground text-xs leading-relaxed block">
            {active.verdict.summary}
          </span>
        </div>
      </div>
    </div>
  );
}
