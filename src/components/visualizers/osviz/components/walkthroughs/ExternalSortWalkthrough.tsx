'use client';

import React, { useMemo } from 'react';
import { StepPlayer, type WalkthroughStep } from './StepPlayer';

function mergeSorted(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i += 1;
    } else {
      result.push(right[j]);
      j += 1;
    }
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

export function ExternalSortWalkthrough({ chunks }: { chunks: number[][] }) {
  const steps = useMemo<WalkthroughStep[]>(() => {
    const runs = chunks.map((chunk) => [...chunk].sort((a, b) => a - b));
    const steps: WalkthroughStep[] = [];

    const runBoxes = (visible: number, merged?: number[][]) => (
      <div className="space-y-2">
        <div className="grid gap-2 sm:grid-cols-3">
          {runs.map((run, index) => (
            <div
              key={index}
              className="rounded-lg border p-2"
              style={{
                borderColor: index <= visible ? 'var(--os-primary)' : 'var(--os-border)',
                backgroundColor: index <= visible ? 'var(--os-primary-soft)' : 'var(--os-surface-2)',
              }}
            >
              <div className="font-mono text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
                run {index + 1}
              </div>
              <div className="mt-1 flex flex-wrap gap-1 font-mono text-[10px] font-bold">
                {(merged?.[index] ?? run).map((value) => (
                  <span key={value} className="rounded border px-1.5 py-0.5" style={{ borderColor: 'var(--os-border)' }}>
                    {value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    chunks.forEach((chunk, index) => {
      steps.push({
        title: `Read chunk ${index + 1} and sort it`,
        description: `Chunk ${index + 1} fits in memory. Sort it and write it back as run ${index + 1}.`,
        content: runBoxes(index),
      });
    });

    let merged: number[][] = runs.map((run) => run);
    while (merged.length > 1) {
      const next: number[][] = [];
      for (let i = 0; i < merged.length; i += 2) {
        if (i + 1 < merged.length) {
          next.push(mergeSorted(merged[i], merged[i + 1]));
        } else {
          next.push(merged[i]);
        }
      }
      steps.push({
        title: merged.length === 2 ? 'Final merge' : 'Merge sorted runs',
        description: `Merge ${merged.length} runs into ${next.length}. The merge reads each run sequentially and writes the combined output.`,
        content: (
          <div className="space-y-2">
            {runBoxes(runs.length - 1, merged)}
            <div className="rounded-lg border p-2" style={{ borderColor: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)' }}>
              <div className="font-mono text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-primary)' }}>
                merged output
              </div>
              <div className="mt-1 flex flex-wrap gap-1 font-mono text-[10px] font-bold" style={{ color: 'var(--os-primary)' }}>
                {next.flat().map((value) => (
                  <span key={value} className="rounded border px-1.5 py-0.5" style={{ borderColor: 'var(--os-primary)' }}>
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ),
      });
      merged = next;
    }

    steps.push({
      title: 'Sorted file ready',
      description: 'The whole file is sorted. The runs were merged without ever loading the full file into memory.',
      content: (
        <div className="flex flex-wrap gap-1 font-mono text-[11px] font-bold">
          {merged[0].map((value) => (
            <span key={value} className="rounded-md border px-2 py-1" style={{ borderColor: 'var(--os-ok)', backgroundColor: 'var(--os-ok-soft)', color: 'var(--os-ok)' }}>
              {value}
            </span>
          ))}
        </div>
      ),
    });

    return steps;
  }, [chunks]);

  return <StepPlayer steps={steps} />;
}
