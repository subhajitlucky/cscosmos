'use client';

import React, { useEffect, useState } from 'react';
import { Database, FlaskConical, Gauge, MemoryStick } from 'lucide-react';
import { SchedulerLab } from '../components/labs/SchedulerLab';
import { PagingLab } from '../components/labs/PagingLab';
import { FileAllocationLab } from '../components/labs/FileAllocationLab';

type LabTab = 'scheduler' | 'paging' | 'files';

const TABS: { id: LabTab; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: 'scheduler',
    label: 'CPU Scheduler',
    icon: Gauge,
    description: 'Run FCFS, Round Robin, and Priority on the same process set and compare metrics.',
  },
  {
    id: 'paging',
    label: 'Paging & TLB',
    icon: MemoryStick,
    description: 'Translate virtual addresses, page through a table, and watch the TLB cache hits and misses.',
  },
  {
    id: 'files',
    label: 'File Allocation',
    icon: Database,
    description: 'Walk a FAT chain and compare it with indexed allocation for direct block access.',
  },
];

export function Lab() {
  const [tab, setTab] = useState<LabTab>('scheduler');

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('lab');
    if (requested === 'scheduler' || requested === 'paging' || requested === 'files') {
      setTab(requested);
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 border-b pb-6" style={{ borderColor: 'var(--os-border)' }}>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--os-border)', color: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)' }}>
          <FlaskConical className="h-3.5 w-3.5" />
          Kernel workbench
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Run the system. Change one policy.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--os-muted)' }}>
          Three focused labs for the parts of an operating system that are hardest to hold in your head:
          scheduling, address translation, and file allocation.
        </p>
      </div>

      <div className="mb-6 grid gap-2 sm:grid-cols-3">
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
                borderColor: active ? 'var(--os-primary)' : 'var(--os-border)',
                backgroundColor: active ? 'var(--os-primary-soft)' : 'var(--os-surface)',
              }}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: active ? 'var(--os-primary)' : 'var(--os-muted)' }} />
                <span className="text-sm font-bold" style={{ color: active ? 'var(--os-primary)' : 'var(--os-text)' }}>
                  {item.label}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {tab === 'scheduler' && <SchedulerLab />}
      {tab === 'paging' && <PagingLab />}
      {tab === 'files' && <FileAllocationLab />}
    </div>
  );
}
