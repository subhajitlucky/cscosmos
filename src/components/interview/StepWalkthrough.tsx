'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { QuestionStep } from '@/data/interview';
import { cn } from '@/lib/utils';
import { AnimationBlock } from './animations/AnimationBlock';

export function StepWalkthrough({ steps }: { steps: QuestionStep[] }) {
  const [state, setState] = useState({ steps, current: 0 });
  const containerRef = useRef<HTMLElement | null>(null);

  if (state.steps !== steps) {
    setState({ steps, current: 0 });
  }

  const current = Math.min(state.current, Math.max(steps.length - 1, 0));
  const step = steps[current];

  if (!step) return null;

  const isFirst = current === 0;
  const isLast = current === steps.length - 1;

  const scrollIfBelow = () => {
    const container = containerRef.current;
    if (!container) return;
    if (container.getBoundingClientRect().top >= 0) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, index));
    setState({ steps, current: clamped });
    scrollIfBelow();
  };

  const paragraphs = step.body
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section ref={containerRef} aria-label="Step-by-step solution" className="scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Step {current + 1} of {steps.length}
        </p>
        <div role="group" aria-label="Jump to a step" className="flex flex-wrap items-center gap-1.5">
          {steps.map((s, index) => (
            <button
              key={s.title}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to step ${index + 1}`}
              aria-current={index === current ? 'step' : undefined}
              className={cn(
                'focus-ring flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors',
                index === current
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/60 hover:text-foreground',
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-8">
        <div className="max-w-3xl">
          <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line"
            >
              {paragraph}
            </p>
          ))}
          {step.code && (
            <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4">
              <span className="mb-2 inline-block rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                {step.code.language}
              </span>
              <pre className="font-mono text-xs text-foreground">{step.code.source}</pre>
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none" aria-hidden="true" />
            Animation — {step.title}
          </p>
          <AnimationBlock key={`${current}-${step.title}`} spec={step.animation} />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={isFirst}
          className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Prev
        </button>
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={isLast}
          className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
