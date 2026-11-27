'use client';

import React, { useMemo } from 'react';
import { walkFAT } from '../../lib/fat';
import { StepPlayer, type WalkthroughStep } from './StepPlayer';

export function FatWalkthrough({
  start,
  fat,
  totalBlocks = 24,
}: {
  start: number;
  fat: number[];
  totalBlocks?: number;
}) {
  const steps = useMemo<WalkthroughStep[]>(() => {
    const { blocks } = walkFAT(start, fat);

    const blockGrid = (visible: number) => (
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: totalBlocks }, (_, block) => {
          const inChain = blocks.includes(block);
          const reached = blocks.indexOf(block) <= visible && blocks.indexOf(block) >= 0;
          const current = block === blocks[visible];
          const entry = fat[block];
          return (
            <div
              key={block}
              className="flex aspect-square flex-col items-center justify-center rounded-md border font-mono text-[9px] font-bold"
              style={{
                borderColor: current ? 'var(--os-primary)' : reached ? 'var(--os-border-strong)' : 'var(--os-border)',
                backgroundColor: current ? 'var(--os-primary)' : reached ? 'var(--os-primary-soft)' : inChain ? 'var(--os-surface-2)' : 'var(--os-surface)',
                color: current ? '#fff' : reached ? 'var(--os-primary)' : inChain ? 'var(--os-text)' : 'var(--os-muted)',
              }}
            >
              <span>{block}</span>
              <span className="text-[7px] opacity-70">
                {entry === -1 ? 'EOF' : entry === -2 ? 'free' : `→${entry}`}
              </span>
            </div>
          );
        })}
      </div>
    );

    const initial: WalkthroughStep = {
      title: `Directory entry points to block ${start}`,
      description: `The file starts at block ${start}. The FAT tells us where the rest of the file lives.`,
      content: (
        <div className="space-y-2">
          <div className="rounded-lg border p-2.5 font-mono text-xs" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
            report.txt → block {start}
          </div>
          {blockGrid(0)}
        </div>
      ),
    };

    const chainSteps = blocks.map((block, index) => ({
      title: index === blocks.length - 1 ? `Block ${block} marks EOF` : `Block ${block} points to block ${fat[block]}`,
      description:
        index === blocks.length - 1
          ? `FAT[${block}] = EOF. The file ends here, with ${blocks.length} blocks in total.`
          : `FAT[${block}] = ${fat[block]}. Follow the chain to the next block.`,
      content: (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
            {blocks.map((pathBlock, pathIndex) => (
              <React.Fragment key={pathBlock}>
                <span
                  className="rounded border px-1.5 py-0.5 font-bold"
                  style={{
                    borderColor: pathIndex <= index ? 'var(--os-primary)' : 'var(--os-border)',
                    backgroundColor: pathIndex <= index ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                    color: pathIndex <= index ? 'var(--os-primary)' : 'var(--os-muted)',
                  }}
                >
                  {pathBlock}
                </span>
                {pathIndex < blocks.length - 1 && <span style={{ color: 'var(--os-muted)' }}>→</span>}
              </React.Fragment>
            ))}
            <span style={{ color: 'var(--os-muted)' }}>EOF</span>
          </div>
          {blockGrid(index)}
        </div>
      ),
    }));

    return [initial, ...chainSteps];
  }, [fat, start, totalBlocks]);

  return <StepPlayer steps={steps} />;
}
