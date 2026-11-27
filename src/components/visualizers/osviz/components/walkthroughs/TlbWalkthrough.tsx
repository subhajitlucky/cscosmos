'use client';

import React, { useMemo } from 'react';
import { toHex, translateAddress } from '../../lib/paging';
import { StepPlayer, type WalkthroughStep } from './StepPlayer';

export function TlbWalkthrough({
  virtualAddress,
  pageSize,
  pageTable,
}: {
  virtualAddress: number;
  pageSize: number;
  pageTable: number[];
}) {
  const steps = useMemo<WalkthroughStep[]>(() => {
    const result = translateAddress(virtualAddress, pageSize, pageTable);
    const offsetBits = Math.round(Math.log2(pageSize));
    const frame = result.frame;
    const physical = result.physicalAddress;

    const split = (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1 font-mono text-xs">
          <span className="rounded-md border px-2 py-1" style={{ borderColor: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)', color: 'var(--os-primary)' }}>
            VPN = {result.pageNumber}
          </span>
          <span className="rounded-md border px-2 py-1" style={{ borderColor: 'var(--os-accent)', backgroundColor: 'var(--os-accent-soft)', color: 'var(--os-accent)' }}>
            offset = {toHex(result.offset)}
          </span>
          <span className="rounded-md border px-2 py-1" style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)' }}>
            {offsetBits} offset bits
          </span>
        </div>
      </div>
    );

    const tlb = (entries: { page: number; frame: number }[], highlight?: number) => (
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--os-border)' }}>
        <div className="grid grid-cols-2 gap-1 border-b px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
          <span>page</span>
          <span>frame</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--os-border)' }}>
          {entries.length === 0 ? (
            <div className="px-2 py-2 font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>empty</div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.page}
                className="grid grid-cols-2 gap-1 px-2 py-1 font-mono text-[10px]"
                style={{
                  backgroundColor: entry.page === highlight ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                  color: entry.page === highlight ? 'var(--os-primary)' : 'var(--os-text)',
                }}
              >
                <span>{entry.page}</span>
                <span>{entry.frame}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );

    return [
      {
        title: 'Virtual address',
        description: `The CPU generates ${toHex(result.virtualAddress)}. The TLB will be checked first.`,
        content: (
          <div className="space-y-2">
            <div className="rounded-lg border p-3 font-mono text-xl font-black" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
              {toHex(result.virtualAddress)}
            </div>
            {split}
          </div>
        ),
      },
      {
        title: 'TLB lookup: miss',
        description: `Page ${result.pageNumber} is not in the TLB, so the CPU must walk the page table.`,
        content: (
          <div className="space-y-2">
            {tlb([], result.pageNumber)}
            <p className="font-mono text-[10px]" style={{ color: 'var(--os-danger)' }}>TLB MISS</p>
          </div>
        ),
      },
      {
        title: 'Page-table walk',
        description: `Page table[${result.pageNumber}] = ${frame ?? 'not present'}.`,
        content: (
          <div className="space-y-2">
            <div className="rounded-lg border p-3 font-mono text-sm" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
              page_table[{result.pageNumber}] = {frame ?? '—'}
            </div>
            {split}
          </div>
        ),
      },
      {
        title: 'TLB updated',
        description: `The translation ${result.pageNumber} → ${frame} is inserted into the TLB.`,
        content: tlb(frame === null ? [] : [{ page: result.pageNumber, frame }], result.pageNumber),
      },
      {
        title: 'Same page again: TLB hit',
        description: 'A second access to the same page finds the translation in the TLB and skips the page-table walk.',
        content: (
          <div className="space-y-2">
            {tlb(frame === null ? [] : [{ page: result.pageNumber, frame }], result.pageNumber)}
            <p className="font-mono text-[10px]" style={{ color: 'var(--os-ok)' }}>TLB HIT</p>
          </div>
        ),
      },
      {
        title: 'Physical address',
        description:
          physical === null
            ? 'The page is not present. The access faults instead of forming a physical address.'
            : `Physical = frame ${frame} × page size + offset = ${toHex(physical)}.`,
        content:
          physical === null ? (
            <div className="rounded-lg border p-3 font-mono text-sm font-bold" style={{ borderColor: 'var(--os-danger)', backgroundColor: 'var(--os-danger-soft)', color: 'var(--os-danger)' }}>
              PAGE FAULT
            </div>
          ) : (
            <div className="rounded-lg border p-3 font-mono text-xl font-black" style={{ borderColor: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)', color: 'var(--os-primary)' }}>
              {toHex(physical)}
            </div>
          ),
      },
    ];
  }, [pageSize, pageTable, virtualAddress]);

  return <StepPlayer steps={steps} />;
}
