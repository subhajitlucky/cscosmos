'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  FlaskConical,
  CheckSquare,
  Lock,
  Layers,
  Globe,
  Code2,
  Terminal,
  AlertTriangle,
  Server,
  FileCode,
} from 'lucide-react';
import { TOPIC_BASE_PATH } from '../data/topic';

export default function Home() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section - Solid Technical Architecture, Zero Gradients */}
      <section className="border border-border bg-card rounded-2xl p-8 lg:p-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1 text-xs font-mono font-semibold text-foreground">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <span>BROWSER ISOLATION ARCHITECTURE</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground uppercase">
            Interactive Security Engine
          </span>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
            Web Security & Browser Sandbox Internals
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Modern web applications execute in an untrusted, multi-tenant environment. Deconstruct
            how browsers enforce origin boundaries, sanitize execution sinks, manage ambient credentials,
            and structure layered HTTP response header defenses.
          </p>
        </div>

        {/* Primary Action Row - High Contrast, Solid Styling */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`${TOPIC_BASE_PATH}/concepts`}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            <BookOpen className="h-4 w-4" />
            <span>Explore Concepts (8 Modules)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={`${TOPIC_BASE_PATH}/lab`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <FlaskConical className="h-4 w-4 text-red-500" />
            <span>Interactive Security Lab</span>
          </Link>

          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <CheckSquare className="h-4 w-4 text-emerald-500" />
            <span>Practice Arena (52 Qs)</span>
          </Link>
        </div>

        {/* Technical Specification Matrix Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border">
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-foreground">8</div>
            <div className="text-xs font-mono text-muted-foreground uppercase">Core Modules</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-foreground">52</div>
            <div className="text-xs font-mono text-muted-foreground uppercase">Practice Qs</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-foreground">5</div>
            <div className="text-xs font-mono text-muted-foreground uppercase">Interactive Sandboxes</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-foreground">RFC 6265bis</div>
            <div className="text-xs font-mono text-muted-foreground uppercase">Cookie Standard</div>
          </div>
        </div>
      </section>

      {/* The 4 Architectural Pillars of Browser Security */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Four Pillars of Web Security Architecture
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Every vulnerability stems from a breakdown in one of these four structural boundaries.
            </p>
          </div>

          <Link
            href={`${TOPIC_BASE_PATH}/concepts`}
            className="text-xs font-mono font-semibold text-foreground hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>All Concepts</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1: Origin Boundary */}
          <div className="border border-border bg-card rounded-xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-500 uppercase">PILLAR 01</span>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="text-base font-bold text-foreground">Same-Origin Policy & CORS</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The origin tuple (Scheme, Host, Port) enforces strict process and memory separation.
                CORS provides explicit, opt-in cross-origin read authorization via HTTP preflight OPTIONS checks.
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">SOP · CORS Handshakes</span>
              <Link
                href={`${TOPIC_BASE_PATH}/topics/same-origin-policy`}
                className="font-semibold text-foreground hover:underline inline-flex items-center gap-1"
              >
                <span>Read SOP</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Injection & DOM Sinks */}
          <div className="border border-border bg-card rounded-xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-500 uppercase">PILLAR 02</span>
                <Code2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="text-base font-bold text-foreground">Injection Defense & Trusted Types</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Untrusted strings flowing into browser parsers (innerHTML, eval, document.write) execute
                arbitrary JavaScript. Neutralize with context-aware escaping and DOMPurify sanitization.
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">Stored · Reflected · DOM XSS</span>
              <Link
                href={`${TOPIC_BASE_PATH}/topics/xss-cross-site-scripting`}
                className="font-semibold text-foreground hover:underline inline-flex items-center gap-1"
              >
                <span>Read XSS</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Pillar 3: State & Ambient Authority */}
          <div className="border border-border bg-card rounded-xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-500 uppercase">PILLAR 03</span>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="text-base font-bold text-foreground">Session Integrity & Anti-Forgery</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Browsers automatically attach credentialed cookies to cross-site requests. Defend with
                SameSite cookie scoping (Strict/Lax), Synchronizer Tokens, and Sec-Fetch-Site metadata headers.
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">CSRF · SameSite · __Host-</span>
              <Link
                href={`${TOPIC_BASE_PATH}/topics/csrf-and-samesite`}
                className="font-semibold text-foreground hover:underline inline-flex items-center gap-1"
              >
                <span>Read CSRF</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Pillar 4: Layered Headers Shield */}
          <div className="border border-border bg-card rounded-xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-500 uppercase">PILLAR 04</span>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="text-base font-bold text-foreground">Content Security Policy & Headers</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Restrict resource execution with CSP Level 3 nonces. Mitigate clickjacking via frame-ancestors,
                enforce HTTPS with HSTS preloading, and verify CDN assets with Subresource Integrity (SRI).
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">CSP Level 3 · HSTS · SRI</span>
              <Link
                href={`${TOPIC_BASE_PATH}/topics/content-security-policy`}
                className="font-semibold text-foreground hover:underline inline-flex items-center gap-1"
              >
                <span>Read CSP</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tool Gateways - Solid Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lab Card */}
        <div className="border border-border bg-card rounded-2xl p-7 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg border border-border bg-muted w-fit text-foreground">
              <FlaskConical className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Multi-Tool Security Lab</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Live evaluators for CSP directive verification, CORS preflight simulation, XSS sanitization
              sandboxes, and SameSite cookie scopes with immediate browser feedback.
            </p>
          </div>
          <Link
            href={`${TOPIC_BASE_PATH}/lab`}
            className="inline-flex items-center justify-between rounded-lg border border-border bg-background p-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <span>Launch Security Lab</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Practice Arena Card */}
        <div className="border border-border bg-card rounded-2xl p-7 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg border border-border bg-muted w-fit text-foreground">
              <CheckSquare className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground">52-Question Practice Arena</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Challenge yourself across Beginner, Intermediate, and Advanced scenarios with instant feedback,
              detailed root-cause explanations, and streak tracking.
            </p>
          </div>
          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="inline-flex items-center justify-between rounded-lg border border-border bg-background p-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <span>Open Practice Arena</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
