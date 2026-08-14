'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, RotateCcw, ShieldAlert, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

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
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              ACID Transaction Isolation
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Concurrency Anomaly &amp; Isolation Level Stepper
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          🛡️ Required: {currentTimeline.isolationRequired}
        </span>
      </div>

      {/* Anomaly Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { id: 'dirty-read' as const, name: '1. Dirty Read', sub: 'Reads uncommitted rollback data' },
          { id: 'non-repeatable-read' as const, name: '2. Non-Repeatable Read', sub: 'Row value mutates mid-transaction' },
          { id: 'phantom-read' as const, name: '3. Phantom Read', sub: 'Range query count changes' },
          { id: 'write-skew' as const, name: '4. Write Skew', sub: 'Disjoint writes violate constraint' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setAnomaly(item.id);
              setStepIdx(0);
            }}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              anomaly === item.id
                ? 'bg-indigo-600 text-white shadow-md border-indigo-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-indigo-500'
            }`}
          >
            <div className="font-bold">{item.name}</div>
            <div className={`text-[10px] ${anomaly === item.id ? 'text-indigo-100' : 'text-muted-foreground'}`}>
              {item.sub}
            </div>
          </button>
        ))}
      </div>

      {/* Concurrent Timeline Grid */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-6 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Concurrency Timeline: {currentTimeline.title}</span>
          <span className="text-indigo-400 font-bold">Time: {currentStep.time}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Session A */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-slate-800 pb-1">
              <span>Session A (Transaction #1)</span>
              <span className="text-[10px] text-slate-500">Client 1</span>
            </div>
            <pre className="text-emerald-300 min-h-[60px] whitespace-pre-wrap leading-relaxed py-1">
              {currentStep.sessionA || '(Idle / Waiting for next step)'}
            </pre>
          </div>

          {/* Session B */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-purple-400 font-bold border-b border-slate-800 pb-1">
              <span>Session B (Transaction #2)</span>
              <span className="text-[10px] text-slate-500">Client 2</span>
            </div>
            <pre className="text-amber-300 min-h-[60px] whitespace-pre-wrap leading-relaxed py-1">
              {currentStep.sessionB || '(Idle / Waiting for next step)'}
            </pre>
          </div>
        </div>

        {/* Step Explanation */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-indigo-400 font-bold">Step Narration:</span>
          <p className="text-slate-200 text-xs leading-relaxed">{currentStep.explanation}</p>
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
            className="p-2.5 rounded-xl border border-border hover:bg-card text-foreground transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setStepIdx((prev) => (prev < currentTimeline.steps.length - 1 ? prev + 1 : prev))}
            disabled={stepIdx >= currentTimeline.steps.length - 1}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
