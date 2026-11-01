'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParsedOrigin {
  protocol: string;
  host: string;
  port: string;
  path: string;
  valid: boolean;
}

function parseUrl(input: string): ParsedOrigin {
  try {
    const raw = input.startsWith('http://') || input.startsWith('https://') ? input : `https://${input}`;
    const url = new URL(raw);
    const protocol = url.protocol.replace(':', '');
    const defaultPort = protocol === 'http' ? '80' : protocol === 'https' ? '443' : '';
    const port = url.port || defaultPort || '(none)';

    return {
      protocol,
      host: url.hostname,
      port,
      path: url.pathname || '/',
      valid: true,
    };
  } catch {
    return {
      protocol: 'invalid',
      host: 'invalid',
      port: 'invalid',
      path: '/',
      valid: false,
    };
  }
}

const PRESETS = [
  {
    id: 'protocol',
    title: '1. Protocol Mismatch',
    subtitle: 'http:// vs https://',
    urlA: 'http://example.com:80',
    urlB: 'https://example.com:80',
    note: 'Different origin: http vs https schemes are cryptographically isolated.',
  },
  {
    id: 'subdomain',
    title: '2. Subdomain Mismatch',
    subtitle: 'example.com vs api.example.com',
    urlA: 'https://example.com',
    urlB: 'https://api.example.com',
    note: 'Different origin: Subdomains are distinct hosts and separate trust boundaries.',
  },
  {
    id: 'port',
    title: '3. Port Mismatch',
    subtitle: ':443 vs :8443',
    urlA: 'https://example.com:443',
    urlB: 'https://example.com:8443',
    note: 'Different origin: Even on identical hosts, different ports are isolated origins.',
  },
  {
    id: 'path',
    title: '4. Path Difference',
    subtitle: '/user vs /login',
    urlA: 'https://example.com/user',
    urlB: 'https://example.com/login',
    note: 'Same origin: URL paths, directories, and query strings do NOT affect the origin tuple!',
  },
];

export function OriginTupleComparator() {
  const [urlA, setUrlA] = useState<string>('http://example.com:80');
  const [urlB, setUrlB] = useState<string>('https://example.com:80');
  const [activePreset, setActivePreset] = useState<string>('protocol');

  const parsedA = useMemo(() => parseUrl(urlA), [urlA]);
  const parsedB = useMemo(() => parseUrl(urlB), [urlB]);

  const protocolMatch = parsedA.protocol === parsedB.protocol;
  const hostMatch = parsedA.host === parsedB.host;
  const portMatch = parsedA.port === parsedB.port;
  const isSameOrigin = protocolMatch && hostMatch && portMatch && parsedA.valid && parsedB.valid;

  const loadPreset = (preset: (typeof PRESETS)[0]) => {
    setActivePreset(preset.id);
    setUrlA(preset.urlA);
    setUrlB(preset.urlB);
  };

  const getReasonExplanation = () => {
    if (isSameOrigin) {
      return 'SAME ORIGIN: All three components of the origin tuple (Scheme, Host, Port) match exactly. Browser permits full cross-document DOM read access, script inspection, and credentialed API responses.';
    }
    const reasons: string[] = [];
    if (!protocolMatch) reasons.push(`Protocol mismatch ('${parsedA.protocol}' vs '${parsedB.protocol}')`);
    if (!hostMatch) reasons.push(`Host mismatch ('${parsedA.host}' vs '${parsedB.host}')`);
    if (!portMatch) reasons.push(`Port mismatch (':${parsedA.port}' vs ':${parsedB.port}')`);

    return `CROSS-ORIGIN BLOCKED: ${reasons.join(', ')}. The browser strictly isolates JavaScript execution. Attempting to inspect DOM or response bodies triggers a SecurityError DOMException.`;
  };

  return (
    <div className="border border-border bg-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-red-500 uppercase tracking-wider">
            <Globe className="h-4 w-4" />
            <span>Interactive 2026 Origin Tuple Comparator</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">
            The Origin Tuple: Protocol + Host + Port
          </h3>
          <p className="text-xs text-muted-foreground">
            Two URLs share the same origin if and only if their protocol, host (domain), and port match bit-for-bit.
          </p>
        </div>

        <button
          onClick={() => loadPreset(PRESETS[0])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-mono text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Reset to default example"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
          Explore Core Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className={cn(
                'text-left rounded-xl p-3 border text-xs transition-all flex flex-col justify-between gap-1',
                activePreset === preset.id
                  ? 'border-foreground bg-muted font-semibold text-foreground shadow-xs'
                  : 'border-border bg-background/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <div className="font-bold text-foreground text-xs">{preset.title}</div>
              <div className="font-mono text-[11px] text-muted-foreground truncate">
                {preset.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* URL Input Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* URL A */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-foreground flex items-center justify-between">
            <span>URL A (Target Resource)</span>
            <span className="text-[10px] text-muted-foreground font-normal">Editable</span>
          </label>
          <input
            type="text"
            value={urlA}
            onChange={(e) => {
              setUrlA(e.target.value);
              setActivePreset('custom');
            }}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
            placeholder="https://example.com:443/user"
          />
        </div>

        {/* URL B */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-foreground flex items-center justify-between">
            <span>URL B (Requesting Context)</span>
            <span className="text-[10px] text-muted-foreground font-normal">Editable</span>
          </label>
          <input
            type="text"
            value={urlB}
            onChange={(e) => {
              setUrlB(e.target.value);
              setActivePreset('custom');
            }}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
            placeholder="https://example.com:443/login"
          />
        </div>
      </div>

      {/* Component-by-Component Tuple Breakdown Grid */}
      <div className="border border-border rounded-xl bg-background overflow-hidden">
        <div className="grid grid-cols-12 bg-muted/50 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="col-span-3">Tuple Component</div>
          <div className="col-span-4">URL A</div>
          <div className="col-span-4">URL B</div>
          <div className="col-span-1 text-right">Verdict</div>
        </div>

        <div className="divide-y divide-border/60 text-xs font-mono">
          {/* Protocol Row */}
          <div className="grid grid-cols-12 px-4 py-3 items-center">
            <div className="col-span-3 font-bold text-foreground">1. Protocol / Scheme</div>
            <div className="col-span-4 text-cyan-500 dark:text-cyan-400 font-semibold truncate">
              {parsedA.protocol}://
            </div>
            <div className="col-span-4 text-cyan-500 dark:text-cyan-400 font-semibold truncate">
              {parsedB.protocol}://
            </div>
            <div className="col-span-1 text-right">
              {protocolMatch ? (
                <span className="inline-flex items-center text-emerald-500" title="Match">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              ) : (
                <span className="inline-flex items-center text-rose-500" title="Mismatch">
                  <XCircle className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>

          {/* Host Row */}
          <div className="grid grid-cols-12 px-4 py-3 items-center">
            <div className="col-span-3 font-bold text-foreground">2. Host / Domain</div>
            <div className="col-span-4 text-amber-500 dark:text-amber-400 font-semibold truncate">
              {parsedA.host}
            </div>
            <div className="col-span-4 text-amber-500 dark:text-amber-400 font-semibold truncate">
              {parsedB.host}
            </div>
            <div className="col-span-1 text-right">
              {hostMatch ? (
                <span className="inline-flex items-center text-emerald-500" title="Match">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              ) : (
                <span className="inline-flex items-center text-rose-500" title="Mismatch">
                  <XCircle className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>

          {/* Port Row */}
          <div className="grid grid-cols-12 px-4 py-3 items-center">
            <div className="col-span-3 font-bold text-foreground">3. Port Number</div>
            <div className="col-span-4 text-purple-500 dark:text-purple-400 font-semibold truncate">
              :{parsedA.port}
            </div>
            <div className="col-span-4 text-purple-500 dark:text-purple-400 font-semibold truncate">
              :{parsedB.port}
            </div>
            <div className="col-span-1 text-right">
              {portMatch ? (
                <span className="inline-flex items-center text-emerald-500" title="Match">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              ) : (
                <span className="inline-flex items-center text-rose-500" title="Mismatch">
                  <XCircle className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>

          {/* Path Row (Explicitly noted as NOT part of origin) */}
          <div className="grid grid-cols-12 px-4 py-3 items-center bg-muted/20 opacity-80">
            <div className="col-span-3 text-muted-foreground flex items-center gap-1">
              <span>Path / Query</span>
              <span className="text-[10px] font-normal">(Ignored by SOP)</span>
            </div>
            <div className="col-span-4 text-muted-foreground truncate">{parsedA.path}</div>
            <div className="col-span-4 text-muted-foreground truncate">{parsedB.path}</div>
            <div className="col-span-1 text-right">
              <span
                className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded"
                title="Paths do not affect origin comparison"
              >
                PASS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time SOP Judgment Banner */}
      <motion.div
        key={`${urlA}-${urlB}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-xl border p-5 flex items-start gap-3.5',
          isSameOrigin
            ? 'border-emerald-500/40 bg-emerald-500/5'
            : 'border-rose-500/40 bg-rose-500/5'
        )}
      >
        {isSameOrigin ? (
          <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <div
            className={cn(
              'text-sm font-bold font-mono tracking-wide',
              isSameOrigin ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            )}
          >
            {isSameOrigin ? 'VERDICT: SAME ORIGIN (EXACT TUPLE MATCH)' : 'VERDICT: CROSS-ORIGIN (DIFFERENT ORIGIN)'}
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {getReasonExplanation()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
