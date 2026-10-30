'use client';

import React, { useState } from 'react';
import { ChevronRight, RotateCcw, ShieldAlert } from 'lucide-react';

type Anomaly = 'dirty-read' | 'non-repeatable-read' | 'phantom-read' | 'write-skew';

interface TimelineStep {
  time: string;
  sessionA?: string;
  sessionB?: string;
  explanation: string;
}

export function TransactionAnomalyStepper() {
  const [anomaly, setAnomaly] = useState<Anomaly>('dirty-read');
  const [stepIdx, setStepIdx] = useState<number>(0);

  const getTimeline = (type: Anomaly): {
    title: string;
    isolationRequired: string;
    steps: TimelineStep[];
  } => {
    if (type === 'dirty-read') {
      return {
        title: 'Dirty Read Anomaly',
        isolationRequired: 'READ COMMITTED (or higher)',
        steps: [
          { time: 'T1', sessionA: 'BEGIN;', sessionB: 'BEGIN;', explanation: 'Both transactions start concurrent sessions.' },
          { time: 'T2', sessionA: 'UPDATE accounts SET balance = 500 WHERE id = 1;', explanation: 'Session A updates balance from 100 to 500, but has NOT committed yet.' },
          { time: 'T3', sessionB: 'SELECT balance FROM accounts WHERE id = 1; -- Returns 500!', explanation: '🚨 DIRTY READ: Session B reads uncommitted data (500) under Read Uncommitted isolation.' },
          { time: 'T4', sessionA: 'ROLLBACK;', explanation: 'Session A encounters an error and rolls back! Balance in DB remains 100.' },
          { time: 'T5', explanation: '💥 CORRUPTION: Session B acted on imaginary money (500) that never existed in the database!' },
        ]
      };
    } else if (type === 'non-repeatable-read') {
      return {
        title: 'Non-Repeatable Read Anomaly',
        isolationRequired: 'REPEATABLE READ (or higher)',
        steps: [
          { time: 'T1', sessionA: 'BEGIN;', sessionB: 'BEGIN;', explanation: 'Both transactions start.' },
          { time: 'T2', sessionA: 'SELECT balance FROM accounts WHERE id = 1; -- Returns 100', explanation: 'Session A reads initial balance: 100.' },
          { time: 'T3', sessionB: 'UPDATE accounts SET balance = 500 WHERE id = 1;\nCOMMIT;', explanation: 'Session B updates balance to 500 and commits.' },
          { time: 'T4', sessionA: 'SELECT balance FROM accounts WHERE id = 1; -- Returns 500!', explanation: '🚨 NON-REPEATABLE READ: In Read Committed, Session A sees new value (500) within the SAME transaction.' },
          { time: 'T5', explanation: '🛡️ FIX: REPEATABLE READ takes snapshot at transaction start, so Session A consistently sees 100 throughout.' }
        ]
      };
    } else if (type === 'phantom-read') {
      return {
        title: 'Phantom Read Anomaly',
        isolationRequired: 'REPEATABLE READ (with Gap Locks) or SERIALIZABLE',
        steps: [
          { time: 'T1', sessionA: 'BEGIN;', sessionB: 'BEGIN;', explanation: 'Both transactions start.' },
          { time: 'T2', sessionA: 'SELECT COUNT(*) FROM orders WHERE total > 100; -- Returns 3', explanation: 'Session A queries range of high-value orders (found 3).' },
          { time: 'T3', sessionB: 'INSERT INTO orders (total) VALUES (250);\nCOMMIT;', explanation: 'Session B inserts a new order with total 250 and commits.' },
          { time: 'T4', sessionA: 'SELECT COUNT(*) FROM orders WHERE total > 100; -- Returns 4!', explanation: '🚨 PHANTOM READ: A new "phantom" row appeared inside Session A range query.' },
          { time: 'T5', explanation: '🛡️ FIX: SERIALIZABLE / Range Locks freeze the predicates across the transaction lifecycle.' }
        ]
      };
    } else {
      // write-skew
      return {
        title: 'Write Skew Anomaly (The On-Call Doctors Dilemma)',
        isolationRequired: 'SERIALIZABLE',
        steps: [
          { time: 'T1', sessionA: 'BEGIN (Doctor Alice);', sessionB: 'BEGIN (Doctor Bob);', explanation: 'Constraint: At least ONE doctor must remain on call at all times.' },
          { time: 'T2', sessionA: 'SELECT COUNT(*) FROM on_call; -- Returns 2 (Safe to leave)', sessionB: 'SELECT COUNT(*) FROM on_call; -- Returns 2 (Safe to leave)', explanation: 'Both doctors see 2 doctors active, concluding they can safely check out.' },
          { time: 'T3', sessionA: 'UPDATE doctors SET on_call = false WHERE name = "Alice";\nCOMMIT;', explanation: 'Alice checks out and commits.' },
          { time: 'T4', sessionB: 'UPDATE doctors SET on_call = false WHERE name = "Bob";\nCOMMIT;', explanation: 'Bob checks out and commits.' },
          { time: 'T5', explanation: '💥 WRITE SKEW: 0 doctors left on call! Violated global business rule despite Repeatable Read snapshot isolation. Only SERIALIZABLE prevents Write Skew!' }
        ]
      };
    }
  };

  const currentTimeline = getTimeline(anomaly);
  const currentStep = currentTimeline.steps[stepIdx] || currentTimeline.steps[0];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-muted-foreground">
              Transaction isolation models
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Concurrency Anomaly &amp; Isolation Level Stepper
            </h3>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          Required: {currentTimeline.isolationRequired}
        </span>
      </div>

      {/* Anomaly Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { id: 'dirty-read' as const, name: '1. Dirty Read', sub: 'Reads uncommitted rollback data' },
          { id: 'non-repeatable-read' as const, name: '2. Non-Repeatable Read', sub: 'Row value mutates mid-transaction' },
          { id: 'phantom-read' as const, name: '3. Phantom Read', sub: 'Range query count changes' },
          { id: 'write-skew' as const, name: '4. Write Skew', sub: 'Disjoint writes violate constraint' },
        ].map((item) => {
          const isSelected = anomaly === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setAnomaly(item.id);
                setStepIdx(0);
              }}
              className={`p-3.5 rounded-lg border text-left font-mono text-xs transition-colors ${
                isSelected
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                  : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
              }`}
            >
              <div className="font-bold">{item.name}</div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-background/80' : 'text-muted-foreground'}`}>
                {item.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Concurrent Timeline Grid */}
      <div className="p-6 rounded-2xl bg-zinc-950 text-zinc-100 dark:bg-black border border-border/80 space-y-5 font-mono text-xs shadow-inner">
        <div className="text-zinc-400 text-[11px] border-b border-zinc-800 pb-2 flex items-center justify-between">
          <span>Concurrency Timeline: {currentTimeline.title}</span>
          <span className="text-zinc-200 font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
            Time: {currentStep.time}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Session A */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-200 font-bold border-b border-zinc-800 pb-1">
              <span>Session A (Transaction #1)</span>
              <span className="text-[10px] text-zinc-500">Client 1</span>
            </div>
            <pre className="text-emerald-400 min-h-[60px] whitespace-pre-wrap leading-relaxed py-1 font-mono">
              {currentStep.sessionA || '(Idle / Waiting for next step)'}
            </pre>
          </div>

          {/* Session B */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-200 font-bold border-b border-zinc-800 pb-1">
              <span>Session B (Transaction #2)</span>
              <span className="text-[10px] text-zinc-500">Client 2</span>
            </div>
            <pre className="text-amber-400 min-h-[60px] whitespace-pre-wrap leading-relaxed py-1 font-mono">
              {currentStep.sessionB || '(Idle / Waiting for next step)'}
            </pre>
          </div>
        </div>

        {/* Step Explanation */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
          <span className="text-zinc-200 font-bold block">Step Narration:</span>
          <p className="text-zinc-300 text-xs leading-relaxed">{currentStep.explanation}</p>
        </div>
      </div>

      {/* Stepper Controls */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-muted-foreground font-mono">
          Step {stepIdx + 1} of {currentTimeline.steps.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStepIdx(0)}
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setStepIdx((prev) => (prev < currentTimeline.steps.length - 1 ? prev + 1 : prev))}
            disabled={stepIdx >= currentTimeline.steps.length - 1}
            className="px-4 py-2 rounded-lg bg-foreground hover:bg-foreground/90 disabled:opacity-50 text-background font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
