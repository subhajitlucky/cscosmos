'use client';

import { useEffect, useRef, useState } from 'react';
import type { QuestionStep } from '@/data/interview';
import { cn } from '@/lib/utils';
import { AnimationBlock } from './animations/AnimationBlock';

function Step({
  step,
  index,
  total,
}: {
  step: QuestionStep;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paragraphs = step.body
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <li
      ref={ref}
      className={cn('interview-reveal relative pl-14', visible && 'is-visible')}
    >
      {index < total - 1 && (
        <span className="absolute -bottom-16 left-[17px] top-12 w-px bg-border" aria-hidden="true" />
      )}
      <span
        className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-bold text-primary"
        aria-hidden="true"
      >
        {index + 1}
      </span>

      <div className="max-w-3xl">
        <h3 className="text-lg font-semibold text-foreground">
          <span className="sr-only">Step {index + 1}: </span>
          {step.title}
        </h3>
        {paragraphs.map((paragraph, paragraphIndex) => (
          <p
            key={paragraphIndex}
            className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground"
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

      <div className="mt-5">
        {visible ? (
          <AnimationBlock spec={step.animation} />
        ) : (
          <div
            className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border bg-card/60 text-xs uppercase tracking-wider text-muted-foreground/60"
            aria-hidden="true"
          >
            Plays as you scroll
          </div>
        )}
      </div>
    </li>
  );
}

export function StepWalkthrough({ steps }: { steps: QuestionStep[] }) {
  return (
    <section aria-label="Step-by-step solution">
      <ol className="space-y-16">
        {steps.map((step, index) => (
          <Step key={step.title} step={step} index={index} total={steps.length} />
        ))}
      </ol>
    </section>
  );
}
