'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Code2,
  Globe,
  Cookie,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CookieSecurity } from '../components/visuals/CookieSecurity';
import { ClickjackingVisual } from '../components/visuals/ClickjackingVisual';

type LabTab = 'csp' | 'cors' | 'xss' | 'cookies' | 'clickjacking';

export default function Lab() {
  const [activeTab, setActiveTab] = useState<LabTab>('csp');

  // --- CSP Evaluator State ---
  const [cspScriptSrc, setCspScriptSrc] = useState<string>("'self' https://trusted-cdn.com");
  const [cspStyleSrc, setCspStyleSrc] = useState<string>("'self' 'unsafe-inline'");
  const [cspConnectSrc, setCspConnectSrc] = useState<string>("'self' https://api.my-app.com");
  const [cspFrameAncestors, setCspFrameAncestors] = useState<string>("'none'");
  const [cspNonce, setCspNonce] = useState<boolean>(false);

  // --- CORS Tester State ---
  const [corsClientOrigin, setCorsClientOrigin] = useState<string>('https://app.frontend.com');
  const [corsMethod, setCorsMethod] = useState<string>('POST');
  const [corsCustomHeader, setCorsCustomHeader] = useState<string>('X-Api-Key');
  const [corsWithCredentials, setCorsWithCredentials] = useState<boolean>(true);
  const [corsServerAao, setCorsServerAao] = useState<string>('https://app.frontend.com');
  const [corsServerAac, setCorsServerAac] = useState<boolean>(true);
  const [corsServerAah, setCorsServerAah] = useState<string>('Content-Type, X-Api-Key');

  // --- XSS Sandbox State ---
  const [xssPayload, setXssPayload] = useState<string>(
    '<img src="invalid" onerror="alert(\'Stealing session cookies: \' + document.cookie)" />'
  );
  const [xssDefenseMode, setXssDefenseMode] = useState<'raw' | 'naive' | 'escape' | 'purify'>('raw');

  // Evaluate CSP against test assets
  const evaluateCspAsset = (
    assetType: 'script' | 'style' | 'fetch' | 'connect' | 'frame',
    url: string,
    isInline: boolean
  ) => {
    if (assetType === 'script') {
      if (isInline) {
        if (cspNonce) return { allowed: true, reason: 'Allowed by cryptographic nonce attribute.' };
        if (cspScriptSrc.includes("'unsafe-inline'")) return { allowed: true, reason: "Allowed because 'unsafe-inline' is enabled." };
        return { allowed: false, reason: "Blocked: script-src restricts inline scripts without matching nonce." };
      }
      if (cspScriptSrc.includes('*')) return { allowed: true, reason: 'Allowed by wildcard (*).' };
      if (url.includes('trusted-cdn.com') && cspScriptSrc.includes('trusted-cdn.com')) {
        return { allowed: true, reason: 'Allowed by host allowlist (https://trusted-cdn.com).' };
      }
      if (url.includes('self') && cspScriptSrc.includes("'self'")) {
        return { allowed: true, reason: "Allowed by 'self' origin." };
      }
      return { allowed: false, reason: `Refused to load script from ${url}: violated script-src directive.` };
    }

    if (assetType === 'connect' || assetType === 'fetch') {
      if (cspConnectSrc.includes('*')) return { allowed: true, reason: 'Allowed by wildcard (*).' };
      if (url.includes('api.my-app.com') && cspConnectSrc.includes('api.my-app.com')) {
        return { allowed: true, reason: 'Allowed by host allowlist (https://api.my-app.com).' };
      }
      if (url.includes('self') && cspConnectSrc.includes("'self'")) {
        return { allowed: true, reason: "Allowed by 'self' origin." };
      }
      return { allowed: false, reason: `Refused to connect to ${url}: violated connect-src directive.` };
    }

    if (assetType === 'frame') {
      if (cspFrameAncestors === "'none'") {
        return { allowed: false, reason: "Blocked from framing by frame-ancestors 'none'." };
      }
      if (cspFrameAncestors.includes(url)) {
        return { allowed: true, reason: `Allowed framing by authorized ancestor: ${url}.` };
      }
      return { allowed: false, reason: `Refused to be framed by ${url}: violated frame-ancestors directive.` };
    }

    return { allowed: true, reason: 'Allowed.' };
  };

  // Evaluate CORS handshake
  const evaluateCors = () => {
    // Check credentials + wildcard rule
    if (corsWithCredentials && corsServerAao === '*') {
      return {
        passed: false,
        error: 'INVALID CORS CONFIGURATION: The Access-Control-Allow-Origin header cannot be wildcard (*) when credentials flag is true. Modern browsers reject the response!',
      };
    }

    // Check Origin match
    const originMatches = corsServerAao === '*' || corsServerAao === corsClientOrigin;
    if (!originMatches) {
      return {
        passed: false,
        error: `CORS REJECTED: Request Origin '${corsClientOrigin}' does not match Access-Control-Allow-Origin '${corsServerAao}'. Browser blocks JavaScript from reading response.`,
      };
    }

    // Check custom header
    if (corsCustomHeader && !corsServerAah.toLowerCase().includes(corsCustomHeader.toLowerCase())) {
      return {
        passed: false,
        error: `PREFLIGHT REJECTED: Request header '${corsCustomHeader}' is not included in server Access-Control-Allow-Headers ('${corsServerAah}').`,
      };
    }

    // Check credentials match
    if (corsWithCredentials && !corsServerAac) {
      return {
        passed: false,
        error: 'CREDENTIALS REJECTED: Browser requested credentials (cookies/auth headers), but server omitted Access-Control-Allow-Credentials: true.',
      };
    }

    return {
      passed: true,
      message: 'CORS PREFLIGHT SUCCESSFUL: Browser validates all headers, permits the request dispatch, and allows client JavaScript to inspect response data.',
    };
  };

  // Process XSS payload through selected defense
  const processXss = () => {
    if (xssDefenseMode === 'raw') {
      return {
        output: xssPayload,
        escaped: false,
        dangerous: true,
        summary: 'Vulnerable: Raw string passed to innerHTML without sanitization. Script payload will execute!',
      };
    }
    if (xssDefenseMode === 'naive') {
      // Strips only exact <script> tags
      const sanitized = xssPayload.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      const stillHasPayload = sanitized.includes('onerror=') || sanitized.includes('onload=') || sanitized.includes('javascript:');
      return {
        output: sanitized,
        escaped: false,
        dangerous: stillHasPayload,
        summary: stillHasPayload
          ? 'Bypassed! Naive script stripping failed: event handlers (<img onerror=...>) still executed!'
          : 'Script tag stripped, but naive regexes fail against complex nested vectors.',
      };
    }
    if (xssDefenseMode === 'escape') {
      const escaped = xssPayload
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      return {
        output: escaped,
        escaped: true,
        dangerous: false,
        summary: 'Safe Context Encoding: HTML metacharacters converted to harmless text entities. Browser parses as text only.',
      };
    }
    // purify simulation: retains safe tags (<b>, <i>), removes dangerous attributes (onerror, onload, javascript:)
    const purified = xssPayload
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/href="javascript:[^"]*"/gi, 'href="#"');
    return {
      output: purified,
      escaped: false,
      dangerous: false,
      summary: 'DOMPurify Semantic Sanitization: Preserved valid HTML tags while actively stripping executable JavaScript event handlers and protocols.',
    };
  };

  const corsResult = evaluateCors();
  const xssResult = processXss();

  const fullCspHeader = `Content-Security-Policy: default-src 'self'; script-src ${cspScriptSrc}${
    cspNonce ? " 'nonce-rAnd0m123'" : ''
  }; style-src ${cspStyleSrc}; connect-src ${cspConnectSrc}; frame-ancestors ${cspFrameAncestors};`;

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card/90 to-red-950/15 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Multi-Tool Security Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Interactive Web Security Lab
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Real-time simulators for evaluating Content Security Policies, CORS preflight handshakes,
              XSS sanitization engines, SameSite cookie scopes, and UI framing defenses.
            </p>
          </div>
        </div>
      </div>

      {/* Lab Tool Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-2 text-xs font-semibold">
        {[
          { id: 'csp', label: '1. CSP Policy Evaluator', icon: Terminal },
          { id: 'cors', label: '2. CORS Preflight Matrix', icon: Globe },
          { id: 'xss', label: '3. XSS Sanitization Sandbox', icon: Code2 },
          { id: 'cookies', label: '4. Cookie SameSite Inspector', icon: Cookie },
          { id: 'clickjacking', label: '5. Clickjacking UI Redress', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as LabTab)}
              className={cn(
                'flex items-center gap-2 shrink-0 rounded-lg px-3.5 py-2 transition-all',
                active
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CSP Policy Evaluator */}
      {activeTab === 'csp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Directive Configurator */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Configure CSP Directives</span>
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-foreground">CSP Level 3</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    script-src
                  </label>
                  <input
                    type="text"
                    value={cspScriptSrc}
                    onChange={(e) => setCspScriptSrc(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                  <span className="text-[11px] text-muted-foreground">Controls trusted script sources.</span>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    style-src
                  </label>
                  <input
                    type="text"
                    value={cspStyleSrc}
                    onChange={(e) => setCspStyleSrc(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    connect-src (fetch, XHR, WebSockets)
                  </label>
                  <input
                    type="text"
                    value={cspConnectSrc}
                    onChange={(e) => setCspConnectSrc(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    frame-ancestors (Clickjacking defense)
                  </label>
                  <input
                    type="text"
                    value={cspFrameAncestors}
                    onChange={(e) => setCspFrameAncestors(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <span className="font-semibold text-foreground">Include Cryptographic Nonce</span>
                  <button
                    onClick={() => setCspNonce(!cspNonce)}
                    className={cn(
                      'px-3 py-1 rounded text-xs font-bold transition-colors',
                      cspNonce ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {cspNonce ? 'Enabled (nonce-rAnd0m123)' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Full Header Output */}
              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">Generated HTTP Header:</span>
                <div className="rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-100 break-all select-all">
                  {fullCspHeader}
                </div>
              </div>
            </div>

            {/* Right: Asset Test Suite */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Live Asset Evaluation Matrix
              </h3>

              <div className="space-y-2.5">
                {[
                  {
                    title: '1. First-Party App Script',
                    url: 'https://my-app.com/static/bundle.js (self)',
                    res: evaluateCspAsset('script', 'self', false),
                  },
                  {
                    title: '2. Inline Script Tag (<script>alert(1)</script>)',
                    url: 'inline code block',
                    res: evaluateCspAsset('script', 'inline', true),
                  },
                  {
                    title: '3. Approved CDN Script (trusted-cdn.com)',
                    url: 'https://trusted-cdn.com/lib/react.js',
                    res: evaluateCspAsset('script', 'https://trusted-cdn.com/lib/react.js', false),
                  },
                  {
                    title: '4. Third-Party Tracker (evil-analytics.com)',
                    url: 'https://evil-analytics.com/tracker.js',
                    res: evaluateCspAsset('script', 'https://evil-analytics.com/tracker.js', false),
                  },
                  {
                    title: '5. Backend API Fetch Call',
                    url: 'https://api.my-app.com/v1/user',
                    res: evaluateCspAsset('connect', 'https://api.my-app.com/v1/user', false),
                  },
                  {
                    title: '6. Embedded Iframe Framing Request',
                    url: 'https://partner-portal.com',
                    res: evaluateCspAsset('frame', 'https://partner-portal.com', false),
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'p-3 rounded-lg border flex items-start gap-3 transition-colors',
                      item.res.allowed
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-rose-500/30 bg-rose-500/5'
                    )}
                  >
                    {item.res.allowed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{item.title}</span>
                        <span
                          className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded',
                            item.res.allowed ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                          )}
                        >
                          {item.res.allowed ? 'ALLOWED' : 'BLOCKED'}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-muted-foreground truncate">{item.url}</div>
                      <div className="text-[11px] text-foreground/80">{item.res.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CORS Preflight Matrix */}
      {activeTab === 'cors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Request Settings */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Client Request Parameters
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Request Origin Header
                  </label>
                  <input
                    type="text"
                    value={corsClientOrigin}
                    onChange={(e) => setCorsClientOrigin(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      HTTP Method
                    </label>
                    <select
                      value={corsMethod}
                      onChange={(e) => setCorsMethod(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Custom Header
                    </label>
                    <input
                      type="text"
                      value={corsCustomHeader}
                      onChange={(e) => setCorsCustomHeader(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Include Credentials (cookies / auth)</span>
                  <button
                    onClick={() => setCorsWithCredentials(!corsWithCredentials)}
                    className={cn(
                      'px-3 py-1 rounded text-xs font-bold transition-colors',
                      corsWithCredentials ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {corsWithCredentials ? 'credentials: "include"' : 'credentials: "omit"'}
                  </button>
                </div>
              </div>
            </div>

            {/* Server Settings */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Server Response Headers
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Access-Control-Allow-Origin
                  </label>
                  <input
                    type="text"
                    value={corsServerAao}
                    onChange={(e) => setCorsServerAao(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setCorsServerAao('https://app.frontend.com')}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Set matching origin
                    </button>
                    <button
                      onClick={() => setCorsServerAao('*')}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Set wildcard (*)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Access-Control-Allow-Headers
                  </label>
                  <input
                    type="text"
                    value={corsServerAah}
                    onChange={(e) => setCorsServerAah(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Access-Control-Allow-Credentials: true</span>
                  <button
                    onClick={() => setCorsServerAac(!corsServerAac)}
                    className={cn(
                      'px-3 py-1 rounded text-xs font-bold transition-colors',
                      corsServerAac ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {corsServerAac ? 'true' : 'omitted'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Handshake Verdict */}
          <div
            className={cn(
              'rounded-xl border p-5 flex items-start gap-4',
              corsResult.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'
            )}
          >
            {corsResult.passed ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="text-sm font-bold text-foreground">
                {corsResult.passed ? 'Browser CORS Check PASSED' : 'Browser CORS Check BLOCKED'}
              </div>
              <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                {corsResult.passed ? corsResult.message : corsResult.error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: XSS Sanitization Sandbox */}
      {activeTab === 'xss' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>XSS Payload Injector & Defense Analyzer</span>
              <span className="text-xs text-red-500">Safe In-Memory Sandbox</span>
            </h3>

            {/* Payload Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-muted-foreground">Presets:</span>
              {[
                { label: 'Img Onerror', code: '<img src=x onerror="alert(\'Session Stolen: \' + document.cookie)" />' },
                { label: 'SVG Onload', code: '<svg onload="alert(\'DOM XSS via SVG\')" />' },
                { label: 'Javascript URL', code: '<a href="javascript:alert(\'Phishing Click\')">Click to login</a>' },
                { label: 'Format Injection', code: '<b>Hello</b> <i>World</i><script>alert(1)</script>' },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setXssPayload(preset.code)}
                  className="rounded bg-muted px-2.5 py-1 text-muted-foreground hover:bg-muted/80 hover:text-foreground font-mono text-[11px]"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Input payload textarea */}
            <textarea
              rows={3}
              value={xssPayload}
              onChange={(e) => setXssPayload(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="Enter untrusted user input..."
            />

            {/* Defense level toggle */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-foreground">Select Sanitization Strategy:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'raw', label: '1. Raw Unescaped (Vulnerable)' },
                  { id: 'naive', label: '2. Naive Script Strip' },
                  { id: 'escape', label: '3. Context Entity Escape' },
                  { id: 'purify', label: '4. DOMPurify Sanitizer' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setXssDefenseMode(mode.id as 'raw' | 'naive' | 'escape' | 'purify')}
                    className={cn(
                      'p-2.5 rounded-lg text-xs font-semibold border transition-all text-left',
                      xssDefenseMode === mode.id
                        ? 'border-red-500 bg-red-500/10 text-foreground shadow-xs'
                        : 'border-border/60 bg-background text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Output view */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-muted-foreground uppercase">Sanitized HTML Markup:</span>
                <div className="rounded-lg bg-zinc-950 p-3 font-mono text-xs text-emerald-400 overflow-x-auto min-h-[60px]">
                  {xssResult.output}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-muted-foreground uppercase">Browser Rendered Result:</span>
                <div className="rounded-lg border border-border bg-background p-3 text-xs min-h-[60px] flex items-center">
                  {xssResult.escaped ? (
                    <span className="font-mono">{xssResult.output}</span>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: xssDefenseMode === 'raw' ? '[Script Execution Blocked in Sandbox]' : xssResult.output,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Evaluation banner */}
            <div
              className={cn(
                'rounded-lg border p-3.5 flex items-start gap-2.5 text-xs',
                xssResult.dangerous ? 'border-rose-500/30 bg-rose-500/5 text-rose-500' : 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500'
              )}
            >
              {xssResult.dangerous ? <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> : <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />}
              <span className="font-medium leading-relaxed">{xssResult.summary}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Cookie SameSite Inspector */}
      {activeTab === 'cookies' && (
        <div>
          <CookieSecurity />
        </div>
      )}

      {/* TAB 5: Clickjacking UI Redress */}
      {activeTab === 'clickjacking' && (
        <div>
          <ClickjackingVisual />
        </div>
      )}
    </div>
  );
}
