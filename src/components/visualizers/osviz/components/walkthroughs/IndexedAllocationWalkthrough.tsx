'use client';

import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { StepPlayer, type WalkthroughStep } from './StepPlayer';

export function IndexedAllocationWalkthrough({
  indexBlock,
  pointers,
  requestedBlock,
}: {
  indexBlock: number;
  pointers: number[];
  requestedBlock: number;
}) {
  const steps = useMemo<WalkthroughStep[]>(() => {
    const dataBlock = pointers[requestedBlock];
    const pointerList = (active?: number) => (
      <div className="rounded-lg border p-3" style={{ borderColor: 'var(--os-accent)', backgroundColor: 'var(--os-accent-soft)' }}>
        <div className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-accent)' }}>
          index block {indexBlock}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[11px]">
          {pointers.map((block, index) => (
            <span
              key={index}
              className="rounded border px-2 py-1 font-bold"
              style={{
                borderColor: index === active ? 'var(--os-primary)' : 'var(--os-border)',
                backgroundColor: index === active ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                color: index === active ? 'var(--os-primary)' : 'var(--os-text)',
              }}
            >
              [{index}] → {block}
            </span>
          ))}
        </div>
      </div>
    );

    const disk = (highlight: number) => (
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: 24 }, (_, block) => {
          const isIndex = block === indexBlock;
          const isData = pointers.includes(block);
          const active = block === highlight;
          return (
            <div
              key={block}
              className="flex aspect-square items-center justify-center rounded-md border font-mono text-[9px] font-bold"
              style={{
                borderColor: active ? 'var(--os-primary)' : isIndex ? 'var(--os-accent)' : isData ? 'var(--os-border-strong)' : 'var(--os-border)',
                backgroundColor: active ? 'var(--os-primary)' : isIndex ? 'var(--os-accent)' : isData ? 'var(--os-surface-2)' : 'var(--os-surface)',
                color: active || isIndex ? '#fff' : isData ? 'var(--os-text)' : 'var(--os-muted)',
              }}
            >
              {block}
            </div>
          );
        })}
      </div>
    );

    return [
      {
        title: 'Directory entry points to the index block',
        description: `The file's directory entry stores index block ${indexBlock}.`,
        content: (
          <div className="space-y-2">
            <div className="rounded-lg border p-2.5 font-mono text-xs" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
              report.txt → index block {indexBlock}
            </div>
            {disk(indexBlock)}
          </div>
        ),
      },
      {
        title: 'Read the index block',
        description: 'The index block holds pointers to the file data blocks.',
        content: pointerList(),
      },
      {
        title: `Follow pointer ${requestedBlock}`,
        description: `index[${requestedBlock}] = ${dataBlock}. That is the data block for file block ${requestedBlock}.`,
        content: (
          <div className="space-y-2">
            {pointerList(requestedBlock)}
            <div className="flex items-center gap-2 font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
              <span>index[{requestedBlock}]</span>
              <ArrowRight className="h-3 w-3" />
              <span className="font-bold" style={{ color: 'var(--os-primary)' }}>data block {dataBlock}</span>
            </div>
          </div>
        ),
      },
      {
        title: 'Read the data block',
        description: `The file system reads block ${dataBlock}. Total cost: one index read + one data read.`,
        content: (
          <div className="space-y-2">
            {disk(dataBlock)}
            <div className="rounded-lg border px-3 py-2 font-mono text-[10px]" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
              access cost = index block + data block = 2 reads
            </div>
          </div>
        ),
      },
    ];
  }, [indexBlock, pointers, requestedBlock]);

  return <StepPlayer steps={steps} />;
}
