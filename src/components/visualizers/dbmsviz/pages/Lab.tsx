'use client';

import React, { useEffect, useState } from 'react';
import { Database, FlaskConical, GitBranch, Table2 } from 'lucide-react';
import { CardinalityLab } from '../components/labs/CardinalityLab';
import { RelationalAlgebraLab } from '../components/labs/RelationalAlgebraLab';
import { NormalizationLab } from '../components/labs/NormalizationLab';

type LabTab = 'erd' | 'algebra' | 'normalization';

const TABS: { id: LabTab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'erd', label: 'ERD & Cardinality', icon: GitBranch, description: 'Change 1:1, 1:N, and M:N and see the relational tables change.' },
  { id: 'algebra', label: 'Relational Algebra', icon: Table2, description: 'Apply selection, projection, and join to sample tables.' },
  { id: 'normalization', label: 'Normalization', icon: Database, description: 'Step through 1NF, 2NF, and 3NF decompositions.' },
];

export function Lab() {
  const [tab, setTab] = useState<LabTab>('erd');

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('lab');
    if (requested === 'erd' || requested === 'algebra' || requested === 'normalization') {
      setTab(requested);
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 border-b pb-6" style={{ borderColor: 'var(--db-border)' }}>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--db-border)', color: 'var(--db-primary)', backgroundColor: 'var(--db-primary-soft)' }}>
          <FlaskConical className="h-3.5 w-3.5" />
          Data workbench
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Model it. Query it. Normalize it.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--db-muted)' }}>
          Three focused labs for the parts of a DBMS that are easiest to memorize and hardest to see:
          cardinality mapping, relational algebra, and normalization.
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
              className="rounded-xl border p-3 text-left"
              style={{
                borderColor: active ? 'var(--db-primary)' : 'var(--db-border)',
                backgroundColor: active ? 'var(--db-primary-soft)' : 'var(--db-surface)',
              }}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: active ? 'var(--db-primary)' : 'var(--db-muted)' }} />
                <span className="text-sm font-bold" style={{ color: active ? 'var(--db-primary)' : 'var(--db-text)' }}>{item.label}</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{item.description}</p>
            </button>
          );
        })}
      </div>

      {tab === 'erd' && <CardinalityLab />}
      {tab === 'algebra' && <RelationalAlgebraLab />}
      {tab === 'normalization' && <NormalizationLab />}
    </div>
  );
}
