'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';

const STAGES = [
  {
    label: 'Parse the URL',
    short: 'Browser',
    latency: 0,
    detail: 'The browser reads the scheme, host, path, and query. It decides whether it needs DNS, a secure connection, and which request to send.',
    wire: 'https://atlas.example/course',
  },
  {
    label: 'Resolve the name',
    short: 'DNS',
    latency: 20,
    detail: 'DNS turns the human name into an IP address. The answer may come from a local cache instead of a full lookup.',
    wire: 'atlas.example → 203.0.113.10',
  },
  {
    label: 'Open a secure channel',
    short: 'TCP + TLS',
    latency: 60,
    detail: 'TCP establishes a reliable stream, then TLS negotiates encryption and verifies that the server certificate matches the host.',
    wire: 'handshake ✓ · encrypted ✓',
  },
  {
    label: 'Ask the server',
    short: 'HTTP',
    latency: 120,
    detail: 'The browser sends GET /course. The server routes the request, checks permissions, queries its data store, and builds a response.',
    wire: 'GET /course → 200 OK',
  },
  {
    label: 'Render the response',
    short: 'Browser',
    latency: 45,
    detail: 'HTML arrives first. The browser parses it, requests CSS and images, lays out the page, and paints pixels on the screen.',
    wire: '18 KB · 3 assets · painted',
  },
];

export function NetworkPath() {
  const [step, setStep] = useState(0);
  const active = STAGES[step];
  const total = STAGES.slice(0, step + 1).reduce((sum, stage) => sum + stage.latency, 0);

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="border" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
        <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: 'var(--it-border)' }}>
          <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Request trace</span>
          <button type="button" onClick={() => setStep(0)} className="inline-flex items-center gap-1 text-[9px]" style={{ color: 'var(--it-muted)' }}>
            <RotateCcw className="h-3 w-3" /> reset
          </button>
        </div>
        <div className="p-3">
          {STAGES.map((stage, index) => {
            const done = index < step;
            const current = index === step;
            return (
              <button
                key={stage.label}
                type="button"
                onClick={() => setStep(index)}
                className="it-step-line relative block w-full pb-5 text-left last:pb-0"
              >
                <span className="it-step-dot" style={{ borderColor: done || current ? 'var(--it-primary)' : 'var(--it-border-strong)', color: done || current ? 'var(--it-primary)' : 'var(--it-muted)', backgroundColor: current ? 'var(--it-primary-soft)' : 'var(--it-bg)' }}>
                  {done ? <Check className="h-3 w-3" /> : String(index + 1).padStart(2, '0')}
                </span>
                <span className="block text-[12px] font-semibold" style={{ color: current ? 'var(--it-primary)' : 'var(--it-text)' }}>{stage.label}</span>
                <span className="it-mono mt-0.5 block text-[9px]" style={{ color: 'var(--it-muted)' }}>{stage.short} · {stage.latency} ms</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border" style={{ borderColor: 'var(--it-border-strong)', backgroundColor: 'var(--it-surface)' }}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3" style={{ borderColor: 'var(--it-border)' }}>
          <span className="it-kicker text-[8px]" style={{ color: 'var(--it-primary)' }}>Stage {String(step + 1).padStart(2, '0')} / 05</span>
          <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{total} ms so far</span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>{active.short}</div>
          <h3 className="it-display-sm mt-2 text-3xl">{active.label}</h3>
          <p className="mt-3 max-w-[650px] text-[12px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{active.detail}</p>

          <div className="mt-5 border-l-2 px-3 py-2 font-mono text-[11px]" style={{ borderColor: 'var(--it-primary)', backgroundColor: 'var(--it-primary-soft)' }}>
            {active.wire}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              disabled={step === 0}
              className="it-btn it-btn-quiet min-h-9 px-3 py-1 text-[9px] disabled:opacity-30"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep((value) => Math.min(STAGES.length - 1, value + 1))}
              disabled={step === STAGES.length - 1}
              className="it-btn it-btn-accent min-h-9 px-3 py-1 text-[9px] disabled:opacity-30"
            >
              Next stage <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
