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

  const go = (next: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(steps.length - 1, next)));
  };

  return (
    <div className="border" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-surface)' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: 'var(--db-border)' }}>
        <div className="flex items-baseline gap-3">
          <span className="db-kicker text-[8px]" style={{ color: 'var(--db-primary)' }}>Step player</span>
          <span className="db-mono text-[10px]" style={{ color: 'var(--db-muted)' }}>
            {String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="flex h-8 w-8 items-center justify-center border disabled:opacity-30" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }} aria-label="Previous step">
            <SkipBack className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (atEnd && !playing) setIndex(0);
              setPlaying((value) => !value);
            }}
            className="inline-flex h-8 items-center gap-1.5 border px-2.5 text-[9px] font-bold uppercase tracking-wider"
            style={{ borderColor: 'var(--db-primary)', backgroundColor: 'var(--db-primary)', color: '#fff' }}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
          </button>
          <button type="button" onClick={() => go(index + 1)} disabled={atEnd} className="flex h-8 w-8 items-center justify-center border disabled:opacity-30" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }} aria-label="Next step">
            <SkipForward className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => go(0)} className="flex h-8 w-8 items-center justify-center border" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }} aria-label="Reset walkthrough">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <span className="mx-1 h-5 w-px" style={{ backgroundColor: 'var(--db-border)' }} />
          {[0.5, 1, 2].map((value) => (
            <button key={value} type="button" onClick={() => setSpeed(value)} className="h-8 px-1.5 font-mono text-[9px] font-bold" style={{ backgroundColor: speed === value ? 'var(--db-primary-soft)' : 'transparent', color: speed === value ? 'var(--db-primary)' : 'var(--db-muted)' }}>
              {value}x
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1 px-4 pt-4" aria-hidden="true">
        {steps.map((_, stepIndex) => (
          <button
            key={stepIndex}
            type="button"
            tabIndex={-1}
            onClick={() => go(stepIndex)}
            className="h-1 flex-1"
            style={{ backgroundColor: stepIndex <= index ? 'var(--db-primary)' : 'var(--db-border)' }}
          />
        ))}
      </div>

      <div className="px-4 py-5 sm:px-5">
        <div className="flex items-baseline gap-3">
          <span className="db-num text-2xl" style={{ color: 'var(--db-primary)' }}>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 className="text-sm font-semibold">{step.title}</h3>
            <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{step.description}</p>
          </div>
        </div>
        <div className="mt-4">{step.content}</div>
      </div>
    </div>
  );
}
