'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, Database, FileText, RotateCcw } from 'lucide-react';
import { walkFAT } from '../../lib/fat';

const TOTAL_BLOCKS = 24;
const FAT_START = 5;
const FAT_CHAIN = [5, 9, 2, 14, 20];
const INDEXED_BLOCK = 3;
const INDEXED_DATA = [7, 11, 18, 21];

function buildFAT(): number[] {
  const fat = Array.from({ length: TOTAL_BLOCKS }, () => -2);
  for (let index = 0; index < FAT_CHAIN.length; index += 1) {
    fat[FAT_CHAIN[index]] = index === FAT_CHAIN.length - 1 ? -1 : FAT_CHAIN[index + 1];
  }
  return fat;
}

const FAT = buildFAT();

type Mode = 'fat' | 'indexed';

export function FileAllocationLab() {
  const [mode, setMode] = useState<Mode>('fat');
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const chain = useMemo(() => walkFAT(FAT_START, FAT).blocks, []);
  const current = chain[Math.min(step, chain.length - 1)];

  const reset = () => {
    setStep(0);
    setSelected(null);
  };

  const fatBlocks = new Set(FAT_CHAIN);
  const indexedBlocks = new Set([INDEXED_BLOCK, ...INDEXED_DATA]);

  const blockState = (block: number) => {
    if (mode === 'fat') {
      if (block === current) return 'current';
      if (fatBlocks.has(block) && chain.indexOf(block) <= step) return 'visited';
      if (fatBlocks.has(block)) return 'file';
      return 'free';
    }
    if (block === INDEXED_BLOCK) return 'index';
    if (indexedBlocks.has(block)) return selected === block ? 'current' : 'file';
    return 'free';
  };

  const blockColor = (state: string) => {
    switch (state) {
      case 'current':
        return { bg: 'var(--os-primary)', color: '#fff', border: 'var(--os-primary)' };
      case 'visited':
        return { bg: 'var(--os-primary-soft)', color: 'var(--os-primary)', border: 'var(--os-primary)' };
      case 'file':
        return { bg: 'var(--os-surface-2)', color: 'var(--os-text)', border: 'var(--os-border-strong)' };
      case 'index':
        return { bg: 'var(--os-accent)', color: '#fff', border: 'var(--os-accent)' };
      default:
        return { bg: 'var(--os-surface)', color: 'var(--os-muted)', border: 'var(--os-border)' };
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'fat' as Mode, label: 'FAT chain', icon: Database },
          { id: 'indexed' as Mode, label: 'Indexed allocation', icon: FileText },
        ].map((item) => {
          const Icon = item.icon;
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setMode(item.id);
                reset();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold"
              style={{
                borderColor: active ? 'var(--os-primary)' : 'var(--os-border)',
                backgroundColor: active ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                color: active ? 'var(--os-primary)' : 'var(--os-muted)',
              }}
            >
              <Icon className="h-3.5 w-3.5" /> {item.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={reset}
          className="ml-auto inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold"
          style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)' }}
        >
          <RotateCcw className="h-3 w-3" /> reset
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold">Disk blocks</h3>
            <span className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
              24 blocks · 1 block = 4 KB
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
            {Array.from({ length: TOTAL_BLOCKS }, (_, block) => {
              const state = blockState(block);
              const colors = blockColor(state);
              const clickable = mode === 'indexed' && indexedBlocks.has(block);
              return (
                <button
                  key={block}
                  type="button"
                  disabled={!clickable}
                  onClick={() => setSelected(block)}
                  className="flex aspect-square flex-col items-center justify-center rounded-md border font-mono text-[10px] font-bold transition-transform disabled:cursor-default enabled:hover:-translate-y-0.5"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.bg,
                    color: colors.color,
                  }}
                  title={
                    state === 'current'
                      ? 'current block'
                      : state === 'index'
                        ? 'index block'
                        : state === 'file' || state === 'visited'
                          ? 'file block'
                          : 'free block'
                  }
                >
                  <span>{block}</span>
                  <span className="text-[7px] opacity-70">
                    {mode === 'fat' ? (FAT[block] === -1 ? 'EOF' : FAT[block] === -2 ? 'free' : `→${FAT[block]}`) : state === 'index' ? 'idx' : ''}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[9px]" style={{ color: 'var(--os-muted)' }}>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--os-primary)' }} /> current</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--os-accent)' }} /> index</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--os-border-strong)' }} /> file</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--os-border)' }} /> free</span>
          </div>
        </div>

        <div className="space-y-4">
          {mode === 'fat' ? (
            <>
              <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border-strong)', backgroundColor: 'var(--os-surface)' }}>
                <h3 className="mb-2 text-sm font-bold">FAT walk</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
                  Follow the chain from the directory entry. The FAT tells you the next block, so random access requires walking from the start.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-xs">
                  {chain.map((block, index) => (
                    <React.Fragment key={block}>
                      <span
                        className="rounded-md border px-2 py-1 font-bold"
                        style={{
                          borderColor: index <= step ? 'var(--os-primary)' : 'var(--os-border)',
                          backgroundColor: index <= step ? 'var(--os-primary-soft)' : 'var(--os-surface-2)',
                          color: index <= step ? 'var(--os-primary)' : 'var(--os-muted)',
                        }}
                      >
                        {block}
                      </span>
                      {index < chain.length - 1 && <ArrowRight className="h-3 w-3" style={{ color: 'var(--os-muted)' }} />}
                    </React.Fragment>
                  ))}
                  <span className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>EOF</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep((value) => Math.min(chain.length - 1, value + 1))}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--os-primary)' }}
                  >
                    Next block
                  </button>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                    {step + 1} / {chain.length} blocks read
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border p-4 font-mono text-[10px] leading-relaxed" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
                FAT[{FAT_START}] = {FAT[FAT_START]} · current block = {current}
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border-strong)', backgroundColor: 'var(--os-surface)' }}>
                <h3 className="mb-2 text-sm font-bold">Indexed allocation</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
                  The index block stores all data-block pointers. Reading block 3 of the file is one index read plus one data read, without walking the earlier blocks.
                </p>
                <div className="mt-3 rounded-lg border p-3" style={{ borderColor: 'var(--os-accent)', backgroundColor: 'var(--os-accent-soft)' }}>
                  <div className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-accent)' }}>
                    index block {INDEXED_BLOCK}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {INDEXED_DATA.map((block) => (
                      <button
                        key={block}
                        type="button"
                        onClick={() => setSelected(block)}
                        className="rounded border px-2 py-0.5 font-bold"
                        style={{
                          borderColor: selected === block ? 'var(--os-primary)' : 'var(--os-border)',
                          backgroundColor: selected === block ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                          color: selected === block ? 'var(--os-primary)' : 'var(--os-text)',
                        }}
                      >
                        → {block}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3 font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                  {selected === null ? 'Select a data block to read it.' : `Read block ${selected} directly via the index.`}
                </div>
              </div>
              <div className="rounded-2xl border p-4 font-mono text-[10px] leading-relaxed" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)', color: 'var(--os-muted)' }}>
                access cost = index block + data block = 2 reads
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
