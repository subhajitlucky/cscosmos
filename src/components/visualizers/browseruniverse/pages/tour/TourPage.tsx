'use client';

import React, { useState } from 'react';
import { cn } from '../../utils/cn';

const steps = [
  { title: 'Network & Fetch', body: 'Parse headers, content-type, encoding. Streaming response body to the parser.' },
  { title: 'HTML Tokenization', body: 'Bytes → code points → tokens. Handles scripts that pause parsing.' },
  { title: 'DOM + CSSOM', body: 'Tree building, style calculation, and cascade application.' },
  { title: 'Render Tree & Layout', body: 'Formatting contexts compute geometry; reflows bubble upward.' },
  { title: 'Paint & Composite', body: 'Display list → paint records → layers → compositor tiles.' },
  { title: 'GPU Pipeline', body: 'Raster threads upload textures; compositor blends into the backbuffer.' },
  { title: 'JS Engine & Event Loop', body: 'Ignition bytecode, TurboFan, microtasks vs tasks, rendering ticks.' },
  { title: 'DevTools & Tracing', body: 'Collect trace events, flamecharts, and performance budgets.' },
];

export default function TourPage() {
  const [index, setIndex] = useState(0);
  const step = steps[index];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">Interactive Tour</p>
        <h1 className="section-title">Critical Rendering Path, animated</h1>
        <p className="text-sm text-slate-300">
          Step through the journey from network to pixels. Each stage links to its corresponding visualizer.
        </p>
      </div>

      <div className="glass rounded-3xl border border-border p-6 shadow-glow">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400">Step {index + 1} of {steps.length}</p>
            <h2 className="text-2xl font-semibold text-white">{step.title}</h2>
            <p className="text-sm text-slate-300">{step.body}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-slate-200"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              Previous
            </button>
            <button
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow"
              onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
              disabled={index === steps.length - 1}
            >
              Next
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {steps.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                'rounded-xl border px-3 py-2 text-xs text-slate-300 transition',
                i === index
                  ? 'border-accent bg-accent/15 text-white shadow-glow'
                  : 'border-border bg-base/70',
              )}
            >
              <p className="font-semibold">{item.title}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-base/70">
          <div
            className="h-2 bg-accent transition-all"
            style={{ width: `${((index + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
