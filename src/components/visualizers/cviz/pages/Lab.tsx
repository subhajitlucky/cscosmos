'use client';

import React, { useState } from 'react';
import { Binary, FlaskConical, MemoryStick } from 'lucide-react';
import { PointerMemoryLab } from '../components/labs/PointerMemoryLab';
import { BitwiseLab } from '../components/labs/BitwiseLab';

type LabTab = 'pointers' | 'bitwise';

const TABS: { id: LabTab; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: 'pointers',
    label: 'Pointers & Memory',
    icon: MemoryStick,
    description: 'Follow addresses, dereference pointers, and walk an array with pointer arithmetic.',
  },
  {
    id: 'bitwise',
    label: 'Bitwise Playground',
    icon: Binary,
    description: 'Flip bits, apply masks, and see the decimal, hex, and binary result at once.',
  },
];

export function Lab() {
  const [tab, setTab] = useState<LabTab>('pointers');

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 border-b pb-6" style={{ borderColor: 'var(--c-border)' }}>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--c-border)', color: 'var(--c-primary)', backgroundColor: 'var(--c-primary-soft)' }}>
          <FlaskConical className="h-3.5 w-3.5" />
          C memory workbench
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Break it. Then understand it.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Two focused labs for the parts of C that are hardest to hold in your head: the pointer chain and
          bit-level manipulation. Change values, break links, and watch the consequences.
        </p>
      </div>

      <div className="mb-6 grid gap-2 sm:grid-cols-2">
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className="rounded-xl border p-3 text-left transition-colors"
              style={{
                borderColor: active ? 'var(--c-primary)' : 'var(--c-border)',
                backgroundColor: active ? 'var(--c-primary-soft)' : 'var(--c-surface)',
              }}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: active ? 'var(--c-primary)' : 'var(--c-muted)' }} />
                <span className="text-sm font-bold" style={{ color: active ? 'var(--c-primary)' : 'var(--c-text)' }}>
                  {item.label}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {tab === 'pointers' ? <PointerMemoryLab /> : <BitwiseLab />}
    </div>
  );
}
