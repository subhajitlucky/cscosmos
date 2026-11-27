'use client';

import React, { useMemo } from 'react';
import { toHex } from '../../lib/paging';
import { StepPlayer, type WalkthroughStep } from './StepPlayer';

export function SegmentationWalkthrough({
  segments,
  segmentIndex,
  offset,
}: {
  segments: { name: string; base: number; limit: number }[];
  segmentIndex: number;
  offset: number;
}) {
  const steps = useMemo<WalkthroughStep[]>(() => {
    const segment = segments[segmentIndex];
    const valid = Boolean(segment) && offset < segment.limit;
    const physical = segment ? segment.base + offset : 0;

    const table = (highlight = true) => (
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--os-border)' }}>
        <div className="grid grid-cols-4 gap-1 border-b px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
          <span>#</span>
          <span>name</span>
          <span>base</span>
          <span>limit</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--os-border)' }}>
          {segments.map((item, index) => (
            <div
              key={item.name}
              className="grid grid-cols-4 gap-1 px-2 py-1 font-mono text-[10px]"
              style={{
                backgroundColor: highlight && index === segmentIndex ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                color: highlight && index === segmentIndex ? 'var(--os-primary)' : 'var(--os-text)',
              }}
            >
              <span>{index}</span>
              <span>{item.name}</span>
              <span>{toHex(item.base)}</span>
              <span>{toHex(item.limit)}</span>
            </div>
          ))}
        </div>
      </div>
    );

    return [
      {
        title: 'Logical address',
        description: `The program refers to segment ${segmentIndex} (${segment?.name ?? 'unknown'}) with offset ${toHex(offset)}.`,
        content: (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1 font-mono text-xs">
              <span className="rounded-md border px-2 py-1" style={{ borderColor: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)', color: 'var(--os-primary)' }}>
                segment = {segmentIndex}
              </span>
              <span className="rounded-md border px-2 py-1" style={{ borderColor: 'var(--os-accent)', backgroundColor: 'var(--os-accent-soft)', color: 'var(--os-accent)' }}>
                offset = {toHex(offset)}
              </span>
            </div>
            {table(false)}
          </div>
        ),
      },
      {
        title: 'Segment-table lookup',
        description: `The hardware finds segment ${segmentIndex}: base ${toHex(segment?.base ?? 0)}, limit ${toHex(segment?.limit ?? 0)}.`,
        content: table(),
      },
      {
        title: 'Limit check',
        description:
          offset < (segment?.limit ?? 0)
            ? `Offset ${toHex(offset)} is below the limit ${toHex(segment?.limit ?? 0)}, so the access is valid.`
            : `Offset ${toHex(offset)} is outside the limit ${toHex(segment?.limit ?? 0)}, so the CPU raises a protection trap.`,
        content: (
          <div
            className="rounded-lg border p-3 font-mono text-sm font-bold"
            style={{
              borderColor: valid ? 'var(--os-ok)' : 'var(--os-danger)',
              backgroundColor: valid ? 'var(--os-ok-soft)' : 'var(--os-danger-soft)',
              color: valid ? 'var(--os-ok)' : 'var(--os-danger)',
            }}
          >
            {toHex(offset)} {valid ? '<' : '>='} {toHex(segment?.limit ?? 0)} · {valid ? 'VALID' : 'TRAP'}
          </div>
        ),
      },
      {
        title: 'Physical address',
        description: valid
          ? `Physical = base ${toHex(segment?.base ?? 0)} + offset ${toHex(offset)} = ${toHex(physical)}.`
          : 'No physical address is formed because the access is invalid.',
        content: valid ? (
          <div className="rounded-lg border p-3 font-mono text-xl font-black" style={{ borderColor: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)', color: 'var(--os-primary)' }}>
            {toHex(physical)}
          </div>
        ) : (
          <div className="rounded-lg border p-3 font-mono text-sm font-bold" style={{ borderColor: 'var(--os-danger)', backgroundColor: 'var(--os-danger-soft)', color: 'var(--os-danger)' }}>
            SEGMENTATION FAULT
          </div>
        ),
      },
    ];
  }, [offset, segmentIndex, segments]);

  return <StepPlayer steps={steps} />;
}
