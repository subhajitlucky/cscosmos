'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">About</p>
      <h1 className="section-title">BrowserUniverse</h1>
      <p className="text-sm text-slate-300">
        An interactive lab to learn how browsers turn bytes into pixels. Built with React +
        Tailwind, dark-mode-first, with performance in mind (lazy-loaded Monaco, route-based code splitting).
      </p>
      <div className="grid gap-3 lg:grid-cols-2">
        <InfoCard title="Mission" body="Explain browser internals from first principles with hands-on visualizers." />
        <InfoCard title="How to use" body="Start the tour, open the sandbox, and explore each topic page with its visualizer." />
        <InfoCard title="Contributors" body="Add your name in README; contributions via PRs welcome." />
        <InfoCard title="License" body="MIT — build on top freely; please keep credits." />
      </div>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass rounded-2xl border border-border p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-slate-300">{body}</p>
    </div>
  );
}
