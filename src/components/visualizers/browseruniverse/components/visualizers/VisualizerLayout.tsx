'use client';

import React from 'react';
import { cn } from '../../utils/cn';

type VisualizerLayoutProps = {
  title: string;
  description: string;
  controls: React.ReactNode;
  canvas: React.ReactNode;
  inspector?: React.ReactNode;
  className?: string;
};

export function VisualizerLayout({
  title,
  description,
  controls,
  canvas,
  inspector,
  className,
}: VisualizerLayoutProps) {
  return (
    <section className={cn('glass p-4 sm:p-6 lg:p-7 relative overflow-hidden', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25rem] text-slate-400">Visualizer</p>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-300 max-w-2xl">{description}</p>
        </div>
        <div className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accentSoft border border-border">
          live
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[320px,1fr]">
        <div className="rounded-2xl border border-border bg-muted/70 p-3 sm:p-4 shadow-inset">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Controls</p>
          {controls}
        </div>
        <div className="rounded-2xl border border-border bg-base/60 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Visualization</p>
          {canvas}
        </div>
      </div>
      {inspector ? (
        <div className="mt-4 rounded-2xl border border-border bg-card/80 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Inspector</p>
          {inspector}
        </div>
      ) : null}
    </section>
  );
}

export default VisualizerLayout;
