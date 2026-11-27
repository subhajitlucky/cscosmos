'use client';

import React, { useMemo } from 'react';
import { toHex, translateAddress } from '../../lib/paging';
import { StepPlayer, type WalkthroughStep } from './StepPlayer';

export function PagingWalkthrough({
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
    const frame = result.frame;
    const frameBase = frame === null ? null : frame * pageSize;
    const offsetBits = Math.round(Math.log2(pageSize));
    const binary = result.virtualAddress.toString(2).padStart(Math.max(offsetBits, 12), '0');
    const vpnBits = binary.slice(0, Math.max(0, binary.length - offsetBits));
    const offBits = binary.slice(-offsetBits);

    const pageTableNode = (
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--os-border)' }}>
        <div className="grid grid-cols-3 gap-1 border-b px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
          <span>page</span>
          <span>frame</span>
          <span>valid</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--os-border)' }}>
          {pageTable.map((entry, page) => (
            <div
              key={page}
              className="grid grid-cols-3 gap-1 px-2 py-1 font-mono text-[10px]"
              style={{
                backgroundColor: page === result.pageNumber ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                color: page === result.pageNumber ? 'var(--os-primary)' : 'var(--os-text)',
              }}
            >
              <span>{page}</span>
              <span>{entry >= 0 ? entry : '—'}</span>
              <span style={{ color: entry >= 0 ? 'var(--os-ok)' : 'var(--os-danger)' }}>{entry >= 0 ? 'yes' : 'no'}</span>
            </div>
          ))}
        </div>
      </div>
    );

    return [
      {
        title: 'Start with the virtual address',
        description: `The CPU generates virtual address ${toHex(result.virtualAddress)}.`,
        content: (
          <div className="space-y-2">
            <div className="rounded-lg border p-3 font-mono text-xl font-black" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
              {toHex(result.virtualAddress)}
            </div>
            <p className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
              page size = {pageSize} bytes = {toHex(pageSize)}
            </p>
          </div>
        ),
      },
      {
        title: 'Split into page number and offset',
        description: `The low ${offsetBits} bits are the offset. The remaining bits are the virtual page number.`,
        content: (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1 font-mono text-xs">
              <span className="rounded-md border px-2 py-1" style={{ borderColor: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)', color: 'var(--os-primary)' }}>
                VPN = {result.pageNumber}
              </span>
              <span className="rounded-md border px-2 py-1" style={{ borderColor: 'var(--os-accent)', backgroundColor: 'var(--os-accent-soft)', color: 'var(--os-accent)' }}>
                offset = {toHex(result.offset)}
              </span>
            </div>
            <div className="break-all rounded-md border px-2 py-1.5 font-mono text-[10px]" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
              <span style={{ color: 'var(--os-primary)' }}>{vpnBits || '0'}</span>
              <span style={{ color: 'var(--os-accent)' }}>{offBits}</span>
            </div>
            <p className="font-mono text-[9px]" style={{ color: 'var(--os-muted)' }}>
              page bits | offset bits ({offsetBits})
            </p>
          </div>
        ),
      },
      {
        title: `Look up page ${result.pageNumber} in the page table`,
        description:
          frame === null
            ? `Page ${result.pageNumber} is not present, so this access would raise a page fault.`
            : `Page table[${result.pageNumber}] = frame ${frame}. The page is resident.`,
        content: pageTableNode,
      },
      {
        title: 'Form the physical address',
        description:
          frame === null
            ? 'No physical address can be formed until the page is loaded.'
            : `Physical = frame base ${toHex(frameBase ?? 0)} + offset ${toHex(result.offset)} = ${toHex(result.physicalAddress ?? 0)}.`,
        content: (
          <div className="space-y-2">
            {frame === null ? (
              <div className="rounded-lg border p-3 font-mono text-sm font-bold" style={{ borderColor: 'var(--os-danger)', backgroundColor: 'var(--os-danger-soft)', color: 'var(--os-danger)' }}>
                PAGE FAULT
              </div>
            ) : (
              <>
                <div className="rounded-lg border p-3 font-mono text-xl font-black" style={{ borderColor: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)', color: 'var(--os-primary)' }}>
                  {toHex(result.physicalAddress ?? 0)}
                </div>
                <p className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                  frame {frame} × {pageSize} + offset {toHex(result.offset)} = {toHex(result.physicalAddress ?? 0)}
                </p>
              </>
            )}
          </div>
        ),
      },
    ];
  }, [pageSize, pageTable, virtualAddress]);

  return <StepPlayer steps={steps} />;
}
