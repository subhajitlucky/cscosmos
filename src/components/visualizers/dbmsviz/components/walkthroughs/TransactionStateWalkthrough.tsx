'use client';

import React, { useMemo } from 'react';
import { StepPlayer, type DBMSWalkthroughStep } from './StepPlayer';

const STATES = ['active', 'partially committed', 'committed', 'failed', 'aborted'] as const;
type State = (typeof STATES)[number];

export function TransactionStateWalkthrough() {
  const steps = useMemo<DBMSWalkthroughStep[]>(() => {
    const frames: { state: State; title: string; description: string; event: string }[] = [
      { state: 'active', title: 'BEGIN', description: 'The transaction starts and begins reading and writing data. Its changes are not visible to other transactions.', event: 'BEGIN' },
      { state: 'active', title: 'Operations run', description: 'The transaction executes its reads and writes. It holds locks and records log entries.', event: 'READ / WRITE' },
      { state: 'partially committed', title: 'Last operation completes', description: 'All operations are done, but the commit is not yet durable. The DBMS must flush the commit record.', event: 'last operation' },
      { state: 'committed', title: 'Commit record is durable', description: 'The commit record is safely stored. The transaction is committed and its changes become visible.', event: 'COMMIT' },
      { state: 'failed', title: 'Failure before commit', description: 'A constraint violation, deadlock, or crash prevents the transaction from committing.', event: 'failure' },
      { state: 'aborted', title: 'Rollback completes', description: 'The recovery system undoes the transaction\'s changes. The transaction is aborted and may be retried.', event: 'ROLLBACK' },
    ];

    return frames.map((frame) => ({
      title: frame.title,
      description: frame.description,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {STATES.map((state) => {
              const active = state === frame.state;
              return (
                <div
                  key={state}
                  className="rounded-lg border px-2 py-3 text-center font-mono text-[8px] font-bold uppercase tracking-wider"
                  style={{
                    borderColor: active ? 'var(--db-primary)' : 'var(--db-border)',
                    backgroundColor: active ? 'var(--db-primary-soft)' : 'var(--db-surface-2)',
                    color: active ? 'var(--db-primary)' : 'var(--db-muted)',
                  }}
                >
                  {state}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-[10px]" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
            <span style={{ color: 'var(--db-muted)' }}>event</span>
            <span className="font-bold" style={{ color: 'var(--db-accent)' }}>{frame.event}</span>
          </div>
        </div>
      ),
    }));
  }, []);

  return <StepPlayer steps={steps} />;
}
