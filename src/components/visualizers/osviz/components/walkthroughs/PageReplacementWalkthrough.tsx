'use client';

import React, { useMemo, useState } from 'react';
import { StepPlayer, type WalkthroughStep } from './StepPlayer';

type Policy = 'FIFO' | 'LRU' | 'OPTIMAL';

interface FrameStep {
  reference: number;
  frames: (number | null)[];
  hit: boolean;
  evicted: number | null;
  faults: number;
  description: string;
}

function simulateFIFO(references: number[], frameCount: number): FrameStep[] {
  const frames: (number | null)[] = Array.from({ length: frameCount }, () => null);
  const queue: number[] = [];
  let faults = 0;

  return references.map((reference) => {
    let hit = false;
    let evicted: number | null = null;

    if (frames.includes(reference)) {
      hit = true;
    } else {
      faults += 1;
      const free = frames.indexOf(null);
      if (free >= 0) {
        frames[free] = reference;
        queue.push(reference);
      } else {
        evicted = queue.shift() ?? null;
        const victim = frames.indexOf(evicted);
        frames[victim] = reference;
        queue.push(reference);
      }
    }

    return {
      reference,
      frames: [...frames],
      hit,
      evicted,
      faults,
      description: hit
        ? `Reference ${reference}: hit. The page is already in memory.`
        : evicted !== null
          ? `Reference ${reference}: miss. FIFO evicts page ${evicted}, the oldest resident page.`
          : `Reference ${reference}: miss. A free frame is available.`,
    };
  });
}

function simulateLRU(references: number[], frameCount: number): FrameStep[] {
  const frames: (number | null)[] = Array.from({ length: frameCount }, () => null);
  let recency: number[] = [];
  let faults = 0;

  return references.map((reference) => {
    let hit = false;
    let evicted: number | null = null;

    if (frames.includes(reference)) {
      hit = true;
      recency = [...recency.filter((page) => page !== reference), reference];
    } else {
      faults += 1;
      const free = frames.indexOf(null);
      if (free >= 0) {
        frames[free] = reference;
      } else {
        evicted = recency[0] ?? null;
        const victim = frames.indexOf(evicted);
        frames[victim] = reference;
        recency = recency.slice(1);
      }
      recency = [...recency, reference];
    }

    return {
      reference,
      frames: [...frames],
      hit,
      evicted,
      faults,
      description: hit
        ? `Reference ${reference}: hit. LRU moves it to the most-recently-used position.`
        : evicted !== null
          ? `Reference ${reference}: miss. LRU evicts page ${evicted}, the least recently used page.`
          : `Reference ${reference}: miss. A free frame is available.`,
    };
  });
}

function nextUse(references: number[], page: number, after: number): number {
  for (let index = after + 1; index < references.length; index += 1) {
    if (references[index] === page) return index;
  }
  return Number.POSITIVE_INFINITY;
}

function simulateOptimal(references: number[], frameCount: number): FrameStep[] {
  const frames: (number | null)[] = Array.from({ length: frameCount }, () => null);
  let faults = 0;

  return references.map((reference, index) => {
    let hit = false;
    let evicted: number | null = null;

    if (frames.includes(reference)) {
      hit = true;
    } else {
      faults += 1;
      const free = frames.indexOf(null);
      if (free >= 0) {
        frames[free] = reference;
      } else {
        let victimIndex = 0;
        let farthest = -1;
        frames.forEach((page, frameIndex) => {
          if (page === null) return;
          const use = nextUse(references, page, index);
          if (use > farthest) {
            farthest = use;
            victimIndex = frameIndex;
          }
        });
        evicted = frames[victimIndex];
        frames[victimIndex] = reference;
      }
    }

    return {
      reference,
      frames: [...frames],
      hit,
      evicted,
      faults,
      description: hit
        ? `Reference ${reference}: hit. Optimal does nothing.`
        : evicted !== null
          ? `Reference ${reference}: miss. Optimal evicts page ${evicted}, which is used farthest in the future.`
          : `Reference ${reference}: miss. A free frame is available.`,
    };
  });
}

const POLICIES: { id: Policy; label: string }[] = [
  { id: 'FIFO', label: 'FIFO' },
  { id: 'LRU', label: 'LRU' },
  { id: 'OPTIMAL', label: 'Optimal' },
];

export function PageReplacementWalkthrough({
  references,
  frameCount,
  defaultPolicy = 'FIFO',
}: {
  references: number[];
  frameCount: number;
  defaultPolicy?: Policy;
}) {
  const [policy, setPolicy] = useState<Policy>(defaultPolicy);

  const steps = useMemo<WalkthroughStep[]>(() => {
    const result =
      policy === 'FIFO'
        ? simulateFIFO(references, frameCount)
        : policy === 'LRU'
          ? simulateLRU(references, frameCount)
          : simulateOptimal(references, frameCount);

    return result.map((step, index) => ({
      title: `Reference ${step.reference} · ${step.hit ? 'hit' : 'fault'}`,
      description: step.description,
      content: (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {references.map((reference, refIndex) => (
              <span
                key={`${reference}-${refIndex}`}
                className="flex h-7 w-7 items-center justify-center rounded-md border font-mono text-[10px] font-bold"
                style={{
                  borderColor:
                    refIndex === index
                      ? 'var(--os-primary)'
                      : refIndex < index
                        ? 'var(--os-border-strong)'
                        : 'var(--os-border)',
                  backgroundColor:
                    refIndex === index
                      ? 'var(--os-primary-soft)'
                      : refIndex < index
                        ? 'var(--os-surface-2)'
                        : 'var(--os-surface)',
                  color:
                    refIndex === index
                      ? 'var(--os-primary)'
                      : refIndex < index
                        ? 'var(--os-text)'
                        : 'var(--os-muted)',
                }}
              >
                {reference}
              </span>
            ))}
          </div>

          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${frameCount}, minmax(0, 1fr))` }}>
            {step.frames.map((page, frameIndex) => (
              <div
                key={frameIndex}
                className="rounded-xl border p-3 text-center"
                style={{
                  borderColor: page === step.evicted ? 'var(--os-danger)' : 'var(--os-border)',
                  backgroundColor: page === step.evicted ? 'var(--os-danger-soft)' : 'var(--os-surface-2)',
                }}
              >
                <div className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
                  frame {frameIndex}
                </div>
                <div className="mt-1 font-mono text-xl font-black" style={{ color: page === null ? 'var(--os-muted)' : 'var(--os-text)' }}>
                  {page ?? '—'}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px]">
            <span
              className="rounded-full border px-2 py-0.5 font-bold"
              style={{
                borderColor: step.hit ? 'var(--os-ok)' : 'var(--os-danger)',
                color: step.hit ? 'var(--os-ok)' : 'var(--os-danger)',
                backgroundColor: step.hit ? 'var(--os-ok-soft)' : 'var(--os-danger-soft)',
              }}
            >
              {step.hit ? 'HIT' : 'FAULT'}
            </span>
            <span style={{ color: 'var(--os-muted)' }}>faults so far: {step.faults}</span>
            <span style={{ color: 'var(--os-muted)' }}>frames: {frameCount}</span>
          </div>
        </div>
      ),
    }));
  }, [defaultPolicy, frameCount, policy, references]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
          policy
        </span>
        {POLICIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPolicy(item.id)}
            className="rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-bold"
            style={{
              borderColor: policy === item.id ? 'var(--os-primary)' : 'var(--os-border)',
              backgroundColor: policy === item.id ? 'var(--os-primary-soft)' : 'var(--os-surface)',
              color: policy === item.id ? 'var(--os-primary)' : 'var(--os-muted)',
            }}
          >
            {item.label}
          </button>
        ))}
        <span className="ml-auto font-mono text-[9px]" style={{ color: 'var(--os-muted)' }}>
          reference string: {references.join(', ')}
        </span>
      </div>
      <StepPlayer steps={steps} />
    </div>
  );
}

export type { Policy as PageReplacementPolicy };
