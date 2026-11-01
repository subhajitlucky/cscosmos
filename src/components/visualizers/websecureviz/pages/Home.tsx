'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, FlaskConical, CheckSquare } from 'lucide-react';
import { TOPIC_BASE_PATH } from '../data/topic';
import { securityTopics } from '../data/topics';

const SECURITY_INSPECTION = [
  { label: 'ORIGIN', value: 'https://bank.com:443 (isolated context)', tone: 'text-slate-400' },
  { label: 'CORS', value: 'OPTIONS preflight · 204 No Content', tone: 'text-slate-400' },
  { label: 'COOKIE', value: 'SameSite=Strict · Secure · HttpOnly', tone: 'text-emerald-400' },
  { label: 'CSP', value: "default-src 'self' · nonce verified", tone: 'text-emerald-400' },
  { label: 'FRAMING', value: "frame-ancestors 'none' · blocked", tone: 'text-rose-400' },
  { label: 'HSTS', value: 'max-age=31536000 · preload active', tone: 'text-emerald-400' },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-14 pb-16">
      {/* Clean Hero Section */}
      <section className="flex flex-col items-center gap-6 py-10 text-center">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-8 bg-red-500" aria-hidden="true" />
          Browser Sandbox Guide · {securityTopics.length} Modules
          <span className="h-px w-8 bg-red-500" aria-hidden="true" />
        </div>

        <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
          Web Security &amp; Browser Isolation
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Trace how the browser enforces origin isolation, verifies CORS handshakes,
          neutralizes script injection, and hardens ambient sessions.
        </p>

        {/* Action Buttons - Solid, Clean, High Contrast */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`${TOPIC_BASE_PATH}/concepts`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-7 py-3.5 text-sm font-bold transition-opacity hover:opacity-90"
          >
            <span>Explore Concepts</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={`${TOPIC_BASE_PATH}/lab`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <FlaskConical className="h-4 w-4 text-red-500" />
            <span>Security Lab</span>
          </Link>

          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <CheckSquare className="h-4 w-4 text-emerald-500" />
            <span>Practice (52 Qs)</span>
          </Link>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {securityTopics.length} modules · 52 practice problems · 5 interactive tools · self-paced
        </p>
      </section>

      {/* Overview Card: Architecture & Live Security Policy Trace */}
      <section className="grid gap-8 rounded-2xl border border-border bg-card p-8 md:grid-cols-2 md:p-10">
        <div className="flex flex-col justify-center gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Browser Security Boundaries
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every cross-origin interaction is evaluated against origin boundaries,
              credential policies, and runtime execution rules.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <div className="flex items-center gap-3 border-t border-border pt-3">
              <span className="font-bold text-red-500">01</span>
              <span>Origin Isolation &amp; Cross-Origin Handshakes</span>
            </div>
            <div className="flex items-center gap-3 border-t border-border pt-3">
              <span className="font-bold text-red-500">02</span>
              <span>DOM Parser Sinks &amp; Output Sanitization</span>
            </div>
            <div className="flex items-center gap-3 border-t border-border pt-3">
              <span className="font-bold text-red-500">03</span>
              <span>Ambient Authority &amp; Defense-in-Depth Headers</span>
            </div>
          </div>
        </div>

        {/* Security Transaction Monitor */}
        <div className="overflow-hidden rounded-xl border border-border bg-zinc-950 font-mono text-xs text-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            <span>Security Header Audit</span>
            <span className="text-emerald-400">ENFORCED</span>
          </div>
          <div className="divide-y divide-zinc-800/80">
            {SECURITY_INSPECTION.map((row) => (
              <div key={row.label} className="flex items-center gap-4 px-4 py-2.5">
                <span className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {row.label}
                </span>
                <span className={row.tone}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-800 px-4 py-2.5 text-[10px] text-zinc-500">
            Configure and test live policies in the Security Lab.
          </div>
        </div>
      </section>
    </div>
  );
}
