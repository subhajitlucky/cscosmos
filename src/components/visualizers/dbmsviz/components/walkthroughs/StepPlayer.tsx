'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

export interface DBMSWalkthroughStep {
  title: string;
  description: string;
  content: React.ReactNode;
}

export function StepPlayer({ steps }: { steps: DBMSWalkthroughStep[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<number | null>(null);

  const atEnd = index >= steps.length - 1;

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing) return;
    if (atEnd) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => {
      setIndex((current) => Math.min(steps.length - 1, current + 1));
    }, 1400 / speed);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, index, atEnd, speed, steps.length]);

  const step = steps[index];
  const progress = steps.length <= 1 ? 100 : (index / (steps.length - 1)) * 100;

  const go = (next: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(steps.length - 1, next)));
  };

  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-surface)' }}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--db-primary)' }}>step-by-step</p>
          <p className="text-[11px]" style={{ color: 'var(--db-muted)' }}>Step {index + 1} of {steps.length}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="rounded-lg border p-1.5 disabled:opacity-40" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }} aria-label="Previous step">
            <SkipBack className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => { if (atEnd && !playing) setIndex(0); setPlaying((value) => !value); }} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-white" style={{ backgroundColor: 'var(--db-primary)' }}>
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
          </button>
          <button type="button" onClick={() => go(index + 1)} disabled={atEnd} className="rounded-lg border p-1.5 disabled:opacity-40" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }} aria-label="Next step">
            <SkipForward className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => go(0)} className="rounded-lg border p-1.5" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }} aria-label="Reset walkthrough">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <div className="ml-1 flex items-center gap-0.5">
            {[0.5, 1, 2].map((value) => (
              <button key={value} type="button" onClick={() => setSpeed(value)} className="rounded px-1.5 py-1 font-mono text-[9px] font-bold" style={{ backgroundColor: speed === value ? 'var(--db-primary-soft)' : 'transparent', color: speed === value ? 'var(--db-primary)' : 'var(--db-muted)' }}>
                {value}x
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-1 w-full" style={{ backgroundColor: 'var(--db-surface-2)' }}>
        <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: 'var(--db-primary)' }} />
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-sm font-bold">{step.title}</h3>
          <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{step.description}</p>
        </div>
        <div>{step.content}</div>
      </div>
    </div>
  );
}
