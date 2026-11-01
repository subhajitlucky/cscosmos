'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Clock,
  Lock,
  Unlock,
  Sliders,
  ArrowRight,
  Globe,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Preset {
  id: string;
  title: string;
  subtitle: string;
  origin: string;
  credentials: boolean;
  methods: string[];
  headers: string[];
  maxAge: number;
  description: string;
}

const PRESETS: Preset[] = [
  {
    id: 'strict-api',
    title: '1. Hardened Production API',
    subtitle: 'Specific origin + credentials + 24h cache',
    origin: 'https://app.example.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization'],
    maxAge: 86400,
    description: 'Gold standard for production SPAs: explicit origin allowlist, credentials enabled, preflight cached for 24 hours.',
  },
  {
    id: 'public-cdn',
    title: '2. Public Open API / CDN',
    subtitle: 'Wildcard \'*\' for public read-only assets',
    origin: '*',
    credentials: false,
    methods: ['GET', 'HEAD', 'OPTIONS'],
    headers: ['Content-Type'],
    maxAge: 3600,
    description: 'Public unauthenticated distribution: open to any origin, credentials prohibited to prevent session leakage.',
  },
  {
    id: 'wildcard-credentials',
    title: '3. The Wildcard + Credentials Hazard',
    subtitle: '\'*\' with credentials: true (Browser Error)',
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization'],
    maxAge: 0,
    description: 'Fatal specification violation: Browsers strictly reject responses when wildcard \'*\' is paired with credentials.',
  },
  {
    id: 'blind-reflection',
    title: '4. Blind Origin Reflection Flaw',
    subtitle: 'Reflecting attacker origin with credentials',
    origin: 'https://evil-attacker.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization'],
    maxAge: 0,
    description: 'Severe vulnerability: Echoing arbitrary untrusted Origin headers with credentials nullifies SOP isolation completely.',
  },
  {
    id: 'no-cache',
    title: '5. Preflight Cache Starvation',
    subtitle: 'Max-Age: 0 spams OPTIONS requests',
    origin: 'https://app.example.com',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    headers: ['Content-Type'],
    maxAge: 0,
    description: 'Performance pitfall: Max-Age: 0 forces a blocking preflight network trip before every API request, doubling round-trip latency.',
  },
];

const AVAILABLE_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
const AVAILABLE_HEADERS = ['Content-Type', 'Authorization', 'X-Api-Key', 'X-Requested-With', 'X-Workspace-Id'];

interface HeaderCardInfo {
  name: string;
  badge: string;
  scope: 'Preflight & Actual' | 'Preflight Only' | 'Credential Guard';
  summary: string;
  rule: string;
}

const HEADER_REFERENCE: HeaderCardInfo[] = [
  {
    name: 'Access-Control-Allow-Origin',
    badge: 'Origin Authorization',
    scope: 'Preflight & Actual',
    summary: 'Specifies which single origin (or wildcard) is permitted to read the HTTP response body.',
    rule: 'Must contain an exact URI or "*". Cannot contain a comma-separated list. If credentials are included, wildcard "*" is illegal.',
  },
  {
    name: 'Access-Control-Allow-Methods',
    badge: 'Method Allowlist',
    scope: 'Preflight Only',
    summary: 'Comma-separated list of permitted HTTP verbs allowed when issuing cross-origin requests.',
    rule: 'Required if client initiates non-simple requests (PUT, DELETE, PATCH). Simple methods (GET, HEAD, POST) do not require preflight.',
  },
  {
    name: 'Access-Control-Allow-Headers',
    badge: 'Header Whitelist',
    scope: 'Preflight Only',
    summary: 'Declares which non-standard or custom HTTP request headers the client is allowed to send.',
    rule: 'If client includes headers like "Authorization" or "X-Api-Key" without explicit server permission here, preflight fails.',
  },
  {
    name: 'Access-Control-Allow-Credentials',
    badge: 'Credential Exposure',
    scope: 'Credential Guard',
    summary: 'Must be explicitly "true" for the browser to expose the response when cookies or HTTP auth are transmitted.',
    rule: 'Case-sensitive string "true". Combining with "Access-Control-Allow-Origin: *" triggers a browser security block.',
  },
  {
    name: 'Access-Control-Max-Age',
    badge: 'Preflight Caching',
    scope: 'Preflight Only',
    summary: 'Seconds the browser is allowed to cache preflight OPTIONS responses, eliminating redundant roundtrips.',
    rule: 'Chrome caps this at 7,200s (2 hrs); Firefox allows up to 86,400s (24 hrs). Setting this prevents latency spikes.',
  },
];

export function CorsHeadersExplorer() {
  const [activePreset, setActivePreset] = useState<string>('strict-api');
  const [origin, setOrigin] = useState<string>('https://app.example.com');
  const [credentials, setCredentials] = useState<boolean>(true);
  const [methods, setMethods] = useState<string[]>(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
  const [headers, setHeaders] = useState<string[]>(['Content-Type', 'Authorization']);
  const [maxAge, setMaxAge] = useState<number>(86400);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedHeaderTab, setSelectedHeaderTab] = useState<string>('all');

  const loadPreset = (preset: Preset) => {
    setActivePreset(preset.id);
    setOrigin(preset.origin);
    setCredentials(preset.credentials);
    setMethods(preset.methods);
    setHeaders(preset.headers);
    setMaxAge(preset.maxAge);
  };

  const toggleMethod = (method: string) => {
    setActivePreset('custom');
    setMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const toggleHeader = (header: string) => {
    setActivePreset('custom');
    setHeaders((prev) =>
      prev.includes(header) ? prev.filter((h) => h !== header) : [...prev, header]
    );
  };

  // Evaluation logic
  const evaluation = useMemo(() => {
    if (origin === '*' && credentials) {
      return {
        level: 'error',
        badge: 'FATAL SPEC VIOLATION',
        title: 'Browser Protocol Error: Wildcard with Credentials Rejected',
        explanation:
          'Browsers enforce a strict security block when Access-Control-Allow-Origin is "*" and Access-Control-Allow-Credentials is true. The fetch() call fails with a TypeError, and no response data is exposed to JavaScript.',
        remedy: 'Explicitly reflect the exact validated client origin (e.g. https://app.example.com) instead of "*".',
      };
    }

    if (origin.toLowerCase().includes('evil') && credentials) {
      return {
        level: 'critical',
        badge: 'CRITICAL VULNERABILITY',
        title: 'SOP Bypass: Blind Origin Reflection Exploit',
        explanation:
          'Echoing untrusted attacker origins with credentials enabled completely defeats Same-Origin Policy. Malicious sites can execute credentialed requests and read user profiles, private tokens, and account balances.',
        remedy: 'Check the incoming Origin header against a strict server-side Set of approved domains before returning it.',
      };
    }

    if (maxAge === 0) {
      return {
        level: 'warning',
        badge: 'PERFORMANCE INEFFICIENCY',
        title: 'Cache Starvation: High Preflight Latency',
        explanation:
          'With Access-Control-Max-Age set to 0, every single non-simple API call must execute a synchronous OPTIONS preflight roundtrip before sending data, drastically increasing latency.',
        remedy: 'Set Access-Control-Max-Age to 7200 (Chrome cap) or 86400 (Firefox cap) to cache preflight decisions.',
      };
    }

    if (origin === '*' && !credentials) {
      return {
        level: 'public',
        badge: 'PUBLIC ASSET MODE',
        title: 'Valid Public API Configuration',
        explanation:
          'Any web application can read responses from this endpoint. Ambient cookies and authentication tokens are stripped, preventing unauthorized data exfiltration.',
        remedy: 'Ideal for CDNs, fonts, public weather/crypto tickers, and open documentation feeds.',
      };
    }

    return {
      level: 'secure',
      badge: 'STANDARDS-COMPLIANT & SECURE',
      title: 'Hardened Production Architecture',
      explanation:
        'Explicit origin matching with credentials authorization, strict method/header allowlist, and preflight caching enabled. Maximum protection against unauthorized cross-origin data exposure.',
      remedy: 'Always ensure "Vary: Origin" is returned alongside dynamic origin headers to avoid proxy cache poisoning.',
    };
  }, [origin, credentials, maxAge]);

  // Generate raw HTTP response text
  const rawHttpResponse = useMemo(() => {
    const lines = [
      'HTTP/1.1 204 No Content',
      `Access-Control-Allow-Origin: ${origin || '(empty)'}`,
    ];

    if (credentials) {
      lines.push('Access-Control-Allow-Credentials: true');
    }

    if (methods.length > 0) {
      lines.push(`Access-Control-Allow-Methods: ${methods.join(', ')}`);
    }

    if (headers.length > 0) {
      lines.push(`Access-Control-Allow-Headers: ${headers.join(', ')}`);
    }

    lines.push(`Access-Control-Max-Age: ${maxAge}`);

    if (origin !== '*') {
      lines.push('Vary: Origin');
    }

    return lines.join('\n');
  }, [origin, credentials, methods, headers, maxAge]);

  const copyHeaders = async () => {
    try {
      await navigator.clipboard.writeText(rawHttpResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="border border-border bg-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-500 uppercase tracking-wider">
            <Server className="h-4 w-4" />
            <span>Interactive 2026 CORS Response Header Inspector</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Critical CORS Response Headers & Enforcement
          </h3>
          <p className="text-xs text-muted-foreground">
            Experiment with the 5 core response headers to inspect how browsers enforce cross-origin isolation and preflight caching.
          </p>
        </div>

        <button
          onClick={() => loadPreset(PRESETS[0])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-mono text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Reset to default hardened configuration"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Preset Scenarios */}
      <div className="space-y-2">
        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
          Explore Architecture Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
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
              <div className="font-bold text-foreground text-xs leading-snug">{preset.title}</div>
              <div className="font-mono text-[10px] text-muted-foreground truncate">
                {preset.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Playground & Live HTTP Synthesis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls (7 cols on large) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Sliders className="h-4 w-4 text-muted-foreground" />
              <span>Live Header Modifiers</span>
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              Direct State Tuning
            </span>
          </div>

          {/* 1. Origin Header */}
          <div className="rounded-xl border border-border/80 bg-background/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                <span>Access-Control-Allow-Origin</span>
              </label>
              <span className="text-[10px] font-mono uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">
                Read Permission
              </span>
            </div>
            <input
              type="text"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setActivePreset('custom');
              }}
              placeholder="https://app.example.com or *"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'https://app.example.com',
                '*',
                'https://evil-attacker.com',
                'null',
              ].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setOrigin(val);
                    setActivePreset('custom');
                  }}
                  className={cn(
                    'px-2 py-1 rounded text-[11px] font-mono transition-colors border',
                    origin === val
                      ? 'bg-foreground text-background font-bold border-foreground'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted border-border'
                  )}
                >
                  {val === '*' ? '* (Wildcard)' : val}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Credentials Toggle */}
          <div className="rounded-xl border border-border/80 bg-background/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                {credentials ? (
                  <Lock className="h-3.5 w-3.5 text-amber-500" />
                ) : (
                  <Unlock className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span>Access-Control-Allow-Credentials</span>
              </label>
              <span className="text-[10px] font-mono uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">
                Cookies & Auth
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-xs text-muted-foreground">
                Authorizes browsers to expose responses when cookies or Authorization headers are sent with request.
              </p>
              <div className="flex rounded-lg border border-border p-1 bg-muted/40 shrink-0">
                <button
                  onClick={() => {
                    setCredentials(true);
                    setActivePreset('custom');
                  }}
                  className={cn(
                    'px-3 py-1 rounded text-xs font-mono font-bold transition-all',
                    credentials
                      ? 'bg-amber-500 text-zinc-950 shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  true
                </button>
                <button
                  onClick={() => {
                    setCredentials(false);
                    setActivePreset('custom');
                  }}
                  className={cn(
                    'px-3 py-1 rounded text-xs font-mono font-bold transition-all',
                    !credentials
                      ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  false (omit)
                </button>
              </div>
            </div>
          </div>

          {/* 3. Methods */}
          <div className="rounded-xl border border-border/80 bg-background/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-foreground">
                Access-Control-Allow-Methods
              </label>
              <span className="text-[10px] font-mono uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">
                Preflight Verbs
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_METHODS.map((m) => {
                const isSelected = methods.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() => toggleMethod(m)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-mono transition-all border',
                      isSelected
                        ? 'bg-foreground text-background font-bold border-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted border-border/70'
                    )}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Headers */}
          <div className="rounded-xl border border-border/80 bg-background/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-foreground">
                Access-Control-Allow-Headers
              </label>
              <span className="text-[10px] font-mono uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">
                Custom Headers
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_HEADERS.map((h) => {
                const isSelected = headers.includes(h);
                return (
                  <button
                    key={h}
                    onClick={() => toggleHeader(h)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-mono transition-all border',
                      isSelected
                        ? 'bg-foreground text-background font-bold border-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted border-border/70'
                    )}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Max-Age */}
          <div className="rounded-xl border border-border/80 bg-background/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-500" />
                <span>Access-Control-Max-Age</span>
              </label>
              <span className="text-xs font-mono font-bold text-foreground">
                {maxAge}s {maxAge >= 3600 ? `(${maxAge / 3600}h)` : maxAge > 0 ? `(${maxAge / 60}m)` : '(0s - None)'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: '0s (No Cache)', val: 0 },
                { label: '600s (10 min)', val: 600 },
                { label: '7200s (Chrome Cap: 2h)', val: 7200 },
                { label: '86400s (Firefox Cap: 24h)', val: 86400 },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => {
                    setMaxAge(item.val);
                    setActivePreset('custom');
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded text-xs font-mono transition-colors border',
                    maxAge === item.val
                      ? 'bg-foreground text-background font-bold border-foreground'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted border-border'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Inspector (5 cols on large) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Synthesized HTTP Response
            </span>
            <button
              onClick={copyHeaders}
              className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy HTTP</span>
                </>
              )}
            </button>
          </div>

          {/* Raw HTTP preview box */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-100 space-y-1 shadow-inner relative overflow-hidden">
            <div className="text-zinc-500 pb-1 text-[11px] border-b border-zinc-800/80 mb-2 flex items-center justify-between">
              <span>HTTP/1.1 CORS Preflight / Actual Headers</span>
              <span className="text-[10px] text-zinc-400">RFC 6454</span>
            </div>
            {rawHttpResponse.split('\n').map((line, lIdx) => {
              const isStatus = line.startsWith('HTTP/');
              const isOrigin = line.startsWith('Access-Control-Allow-Origin');
              const isCreds = line.startsWith('Access-Control-Allow-Credentials');
              const isHazard = (isOrigin && origin === '*' && credentials) || (isCreds && origin === '*' && credentials);

              return (
                <div
                  key={lIdx}
                  className={cn(
                    'py-0.5 break-all',
                    isStatus && 'text-zinc-400 font-bold',
                    isHazard && 'text-rose-400 bg-rose-500/10 px-1 rounded -mx-1',
                    !isStatus && !isHazard && 'text-emerald-400'
                  )}
                >
                  {line}
                </div>
              );
            })}
          </div>

          {/* Dynamic Browser Security & Compliance Banner */}
          <div
            className={cn(
              'rounded-xl border p-4 space-y-2 transition-all',
              evaluation.level === 'error' && 'border-rose-500/50 bg-rose-500/10 text-rose-300',
              evaluation.level === 'critical' && 'border-red-500/50 bg-red-500/10 text-red-300',
              evaluation.level === 'warning' && 'border-amber-500/50 bg-amber-500/10 text-amber-300',
              evaluation.level === 'public' && 'border-blue-500/50 bg-blue-500/10 text-blue-300',
              evaluation.level === 'secure' && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
            )}
          >
            <div className="flex items-center gap-2">
              {evaluation.level === 'error' || evaluation.level === 'critical' ? (
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500" />
              ) : evaluation.level === 'warning' ? (
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
              ) : (
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />
              )}
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                {evaluation.badge}
              </span>
            </div>

            <div className="text-sm font-bold text-foreground">
              {evaluation.title}
            </div>

            <p className="text-xs text-foreground/85 leading-relaxed">
              {evaluation.explanation}
            </p>

            <div className="pt-1 text-[11px] font-mono border-t border-border/40 text-foreground/90">
              <strong className="text-foreground">Architectural Fix: </strong>
              {evaluation.remedy}
            </div>
          </div>
        </div>
      </div>

      {/* Cheatsheet Breakdown Matrix for the 5 Headers */}
      <div className="space-y-3 pt-4 border-t border-border/80">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            The 5 Critical CORS Headers: Engineering Specification
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            W3C CORS & Fetch Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {HEADER_REFERENCE.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-background/50 p-4 space-y-2 hover:border-foreground/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold text-foreground break-all">
                  {item.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-semibold border border-amber-500/20">
                  {item.badge}
                </span>
                <span className="inline-block px-2 py-0.5 rounded bg-muted font-mono text-[10px] text-muted-foreground">
                  {item.scope}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.summary}
              </p>
              <div className="text-[11px] text-foreground/80 font-mono bg-muted/40 p-2 rounded-lg border border-border/50">
                <strong className="text-foreground">Rule: </strong>
                {item.rule}
              </div>
            </div>
          ))}

          {/* Bonus 6th Card: Access-Control-Expose-Headers */}
          <div className="rounded-xl border border-dashed border-border bg-background/30 p-4 space-y-2">
            <span className="font-mono text-xs font-bold text-foreground">
              Access-Control-Expose-Headers (Companion)
            </span>
            <div className="inline-block px-2 py-0.5 rounded bg-muted font-mono text-[10px] text-muted-foreground">
              Response Exposure
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By default, JavaScript fetch() can only read basic headers (Content-Type, Cache-Control).
            </p>
            <div className="text-[11px] text-foreground/80 font-mono bg-muted/40 p-2 rounded-lg border border-border/50">
              <strong className="text-foreground">Rule: </strong>
              To read custom response headers like <code className="text-foreground">X-RateLimit-Remaining</code> or <code className="text-foreground">Authorization</code>, list them here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
