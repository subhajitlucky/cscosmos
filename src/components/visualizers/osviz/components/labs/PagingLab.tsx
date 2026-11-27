'use client';

import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Cpu, Database, RotateCcw } from 'lucide-react';
import { pageOffsetBits, toHex, translateAddress, type TranslationResult } from '../../lib/paging';

const PAGE_SIZE = 4096;
const PAGE_TABLE = [4, 7, -1, 2, 9, -1, 5, 1];
const TLB_CAPACITY = 3;

interface TlbEntry {
  page: number;
  frame: number;
  lastUsed: number;
}

function parseAddress(raw: string): number {
  const cleaned = raw.trim();
  if (cleaned.toLowerCase().startsWith('0x')) return parseInt(cleaned.slice(2), 16) || 0;
  return Number(cleaned) || 0;
}

export function PagingLab() {
  const [input, setInput] = useState('0x1A2B');
  const [address, setAddress] = useState(0x1a2b);
  const [tlbEnabled, setTlbEnabled] = useState(true);
  const [tlbEntries, setTlbEntries] = useState<TlbEntry[]>([]);
  const [clock, setClock] = useState(0);
  const [event, setEvent] = useState<string>('Ready. Translate an address.');
  const [result, setResult] = useState<TranslationResult>(() =>
    translateAddress(0x1a2b, PAGE_SIZE, PAGE_TABLE),
  );

  const offsetBits = pageOffsetBits(PAGE_SIZE);
  const pageBits = Math.max(1, 32 - offsetBits);

  const translate = () => {
    const nextAddress = parseAddress(input);
    const next = translateAddress(nextAddress, PAGE_SIZE, PAGE_TABLE);
    setAddress(nextAddress);
    setResult(next);

    if (!tlbEnabled) {
      setEvent(next.fault ? 'Page fault: page is not present.' : 'Translated without the TLB.');
      return;
    }

    if (next.fault) {
      setEvent(`Page fault on page ${next.pageNumber}. No TLB entry is created.`);
      return;
    }

    const existing = tlbEntries.find((entry) => entry.page === next.pageNumber);
    const nextClock = clock + 1;
    setClock(nextClock);

    if (existing) {
      setTlbEntries((entries) =>
        entries.map((entry) =>
          entry.page === next.pageNumber ? { ...entry, lastUsed: nextClock } : entry,
        ),
      );
      setEvent(`TLB hit: page ${next.pageNumber} is already cached in frame ${next.frame}.`);
      return;
    }

    const updated = [...tlbEntries, { page: next.pageNumber, frame: next.frame ?? 0, lastUsed: nextClock }]
      .sort((a, b) => a.lastUsed - b.lastUsed)
      .slice(-TLB_CAPACITY);
    setTlbEntries(updated);
    setEvent(`TLB miss: page ${next.pageNumber} loaded into the TLB.`);
  };

  const loadRandom = () => {
    const next = Math.floor(Math.random() * 0x8000);
    setInput(toHex(next));
    setAddress(next);
    setResult(translateAddress(next, PAGE_SIZE, PAGE_TABLE));
    setEvent('Loaded a random virtual address. Press Translate to check the TLB.');
  };

  const loadFault = () => {
    const next = 0x2000 + Math.floor(Math.random() * PAGE_SIZE);
    setInput(toHex(next));
    setAddress(next);
    setResult(translateAddress(next, PAGE_SIZE, PAGE_TABLE));
    setEvent('Loaded an address on an invalid page. Press Translate to see the fault.');
  };

  const reset = () => {
    setInput('0x1A2B');
    setAddress(0x1a2b);
    setResult(translateAddress(0x1a2b, PAGE_SIZE, PAGE_TABLE));
    setTlbEntries([]);
    setClock(0);
    setEvent('Ready. Translate an address.');
  };

  const binary = result.virtualAddress.toString(2).padStart(pageBits + offsetBits, '0');
  const vpnBits = binary.slice(0, Math.max(0, binary.length - offsetBits));
  const offsetBin = binary.slice(-offsetBits);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Virtual address</h3>
                <p className="text-[11px]" style={{ color: 'var(--os-muted)' }}>
                  Page size 4 KB · 8 virtual pages · offsets 0–4095
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold"
                style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)' }}
              >
                <RotateCcw className="h-3 w-3" /> reset
              </button>
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') translate();
                }}
                className="min-w-0 flex-1 rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:border-[var(--os-primary)]"
                style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-text)' }}
                placeholder="0x1A2B"
              />
              <button
                type="button"
                onClick={translate}
                className="rounded-lg px-4 py-2 text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--os-primary)' }}
              >
                Translate
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={loadRandom} className="rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold" style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)' }}>
                random address
              </button>
              <button type="button" onClick={loadFault} className="rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold" style={{ borderColor: 'var(--os-danger)', color: 'var(--os-danger)' }}>
                invalid page
              </button>
              <span className="ml-auto font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                input = {toHex(address)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold">TLB</h3>
              <button
                type="button"
                onClick={() => {
                  setTlbEnabled((value) => !value);
                  setTlbEntries([]);
                  setEvent(tlbEnabled ? 'TLB disabled.' : 'TLB enabled.');
                }}
                className="rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold"
                style={{
                  borderColor: tlbEnabled ? 'var(--os-ok)' : 'var(--os-border)',
                  color: tlbEnabled ? 'var(--os-ok)' : 'var(--os-muted)',
                  backgroundColor: tlbEnabled ? 'var(--os-ok-soft)' : 'var(--os-surface-2)',
                }}
              >
                {tlbEnabled ? 'enabled' : 'disabled'}
              </button>
            </div>
            <p className="mb-2 text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
              The TLB caches recent page-to-frame translations. Capacity: {TLB_CAPACITY}.
            </p>
            <div className="space-y-1.5">
              {tlbEntries.length === 0 && (
                <p className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                  empty
                </p>
              )}
              {tlbEntries.map((entry) => (
                <div key={entry.page} className="flex items-center justify-between rounded-md border px-2.5 py-1.5 font-mono text-[10px]" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
                  <span>page {entry.page}</span>
                  <ArrowRight className="h-3 w-3" style={{ color: 'var(--os-muted)' }} />
                  <span>frame {entry.frame}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border p-4" style={{ borderColor: result.fault ? 'var(--os-danger)' : 'var(--os-border-strong)', backgroundColor: 'var(--os-surface)' }}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">Translation</h3>
              <span
                className="rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase"
                style={{
                  borderColor: result.fault ? 'var(--os-danger)' : 'var(--os-ok)',
                  color: result.fault ? 'var(--os-danger)' : 'var(--os-ok)',
                  backgroundColor: result.fault ? 'var(--os-danger-soft)' : 'var(--os-ok-soft)',
                }}
              >
                {result.fault ? 'page fault' : 'mapped'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'virtual', value: toHex(result.virtualAddress), icon: Cpu },
                { label: 'page number', value: String(result.pageNumber), icon: Database },
                { label: 'offset', value: toHex(result.offset), icon: ArrowRight },
                {
                  label: 'frame',
                  value: result.frame === null ? 'not present' : String(result.frame),
                  icon: Database,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-lg border p-2.5" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
                    <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
                      <Icon className="h-3 w-3" /> {item.label}
                    </div>
                    <div className="mt-0.5 font-mono text-sm font-bold">{item.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 rounded-lg border p-3" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
              <div className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
                physical address
              </div>
              <div className="mt-1 font-mono text-lg font-black" style={{ color: result.fault ? 'var(--os-danger)' : 'var(--os-primary)' }}>
                {result.physicalAddress === null ? 'FAULT' : toHex(result.physicalAddress)}
              </div>
            </div>

            <div className="mt-3 space-y-1 font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
              <div className="flex items-center justify-between gap-2">
                <span>VPN = {result.pageNumber}</span>
                <span>offset = {result.offset}</span>
              </div>
              <div className="break-all rounded-md border px-2 py-1.5" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
                <span style={{ color: 'var(--os-primary)' }}>{vpnBits || '0'}</span>
                <span style={{ color: 'var(--os-accent)' }}>{offsetBin}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--os-primary)' }}>page bits</span>
                <span style={{ color: 'var(--os-accent)' }}>offset bits ({offsetBits})</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-3 font-mono text-[10px] leading-relaxed" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
            {result.fault ? <AlertTriangle className="mr-1 inline h-3 w-3" style={{ color: 'var(--os-danger)' }} /> : null}
            {event}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--os-border)' }}>
        <div className="grid grid-cols-4 gap-2 border-b px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
          <span>Page</span>
          <span>Frame</span>
          <span>Valid</span>
          <span>Virtual range</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--os-border)' }}>
          {PAGE_TABLE.map((frame, page) => {
            const valid = frame >= 0;
            const active = page === result.pageNumber;
            return (
              <div
                key={page}
                className="grid grid-cols-4 gap-2 px-3 py-2 font-mono text-[11px]"
                style={{
                  backgroundColor: active ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                  color: active ? 'var(--os-primary)' : 'var(--os-text)',
                }}
              >
                <span className="font-bold">{page}</span>
                <span>{valid ? frame : '—'}</span>
                <span style={{ color: valid ? 'var(--os-ok)' : 'var(--os-danger)' }}>
                  {valid ? 'yes' : 'no'}
                </span>
                <span style={{ color: 'var(--os-muted)' }}>
                  {toHex(page * PAGE_SIZE)} – {toHex((page + 1) * PAGE_SIZE - 1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
