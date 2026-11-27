'use client';

import React, { useMemo } from 'react';
import { StepPlayer, type DBMSWalkthroughStep } from './StepPlayer';

interface LockState {
  t1: string;
  t2: string;
  waitFor: string;
  note: string;
}

export function LockingWalkthrough() {
  const steps = useMemo<DBMSWalkthroughStep[]>(() => {
    const frames: { title: string; description: string; locks: LockState; event: string }[] = [
      {
        title: 'T1 acquires a shared lock on A',
        description: 'A shared lock allows reads and is compatible with other shared locks.',
        locks: { t1: 'S(A)', t2: '—', waitFor: '—', note: 'S locks are compatible.' },
        event: 'T1: LOCK-S(A) granted',
      },
      {
        title: 'T2 also acquires a shared lock on A',
        description: 'Both transactions can read A at the same time. No conflict yet.',
        locks: { t1: 'S(A)', t2: 'S(A)', waitFor: '—', note: 'Two S locks coexist.' },
        event: 'T2: LOCK-S(A) granted',
      },
      {
        title: 'T1 requests an exclusive lock on A',
        description: 'X(A) conflicts with T2\'s shared lock, so T1 waits.',
        locks: { t1: 'S(A) → X(A) waiting', t2: 'S(A)', waitFor: 'T1 → T2', note: 'X conflicts with S.' },
        event: 'T1: LOCK-X(A) waits',
      },
      {
        title: 'T2 requests an exclusive lock on A',
        description: 'X(A) conflicts with T1\'s shared lock. T2 also waits. Now each transaction waits for the other.',
        locks: { t1: 'S(A) waiting for X', t2: 'S(A) waiting for X', waitFor: 'T1 → T2 → T1', note: 'Deadlock cycle.' },
        event: 'T2: LOCK-X(A) waits',
      },
      {
        title: 'The DBMS detects the cycle',
        description: 'The wait-for graph contains a cycle. The DBMS aborts one transaction to break the deadlock.',
        locks: { t1: 'aborted (victim)', t2: 'S(A) → X(A)', waitFor: 'resolved', note: 'One victim is rolled back.' },
        event: 'deadlock detected · T1 aborted',
      },
    ];

    return frames.map((frame) => ({
      title: frame.title,
      description: frame.description,
      content: (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--db-border)' }}>
            <div className="grid grid-cols-3 gap-2 border-b px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-wider" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)', color: 'var(--db-muted)' }}>
              <span>transaction</span>
              <span>locks</span>
              <span>waits for</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--db-border)' }}>
              <div className="grid grid-cols-3 gap-2 px-3 py-2 font-mono text-[10px]">
                <span className="font-bold" style={{ color: 'var(--db-primary)' }}>T1</span>
                <span>{frame.locks.t1}</span>
                <span>{frame.locks.waitFor.startsWith('T1') ? 'T2' : '—'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 px-3 py-2 font-mono text-[10px]">
                <span className="font-bold" style={{ color: 'var(--db-accent)' }}>T2</span>
                <span>{frame.locks.t2}</span>
                <span>{frame.locks.waitFor.includes('T2 → T1') ? 'T1' : '—'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-[10px]" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
            <span style={{ color: 'var(--db-muted)' }}>event</span>
            <span className="font-bold" style={{ color: 'var(--db-accent)' }}>{frame.event}</span>
          </div>
          <div className="rounded-lg border px-3 py-2 font-mono text-[10px]" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)', color: 'var(--db-muted)' }}>
            {frame.locks.note}
          </div>
        </div>
      ),
    }));
  }, []);

  return <StepPlayer steps={steps} />;
}
