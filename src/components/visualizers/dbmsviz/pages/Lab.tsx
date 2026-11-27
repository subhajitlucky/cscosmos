'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, FlaskConical } from 'lucide-react';
import { CardinalityLab } from '../components/labs/CardinalityLab';
import { RelationalAlgebraLab } from '../components/labs/RelationalAlgebraLab';
import { NormalizationLab } from '../components/labs/NormalizationLab';

type LabTab = 'erd' | 'algebra' | 'normalization';

const TABS: { id: LabTab; label: string; description: string }[] = [
  {
    id: 'erd',
    label: 'Cardinality mapper',
    description: 'Change 1:1, 1:N, and M:N and see the relational tables change.',
  },
  {
    id: 'algebra',
    label: 'Algebra bench',
    description: 'Apply selection, projection, and join to the same sample relations.',
  },
  {
    id: 'normalization',
    label: 'Decomposition bench',
    description: 'Step through 1NF, 2NF, and 3NF and inspect every resulting table.',
  },
];

const NOTES: Record<LabTab, string> = {
  erd: 'The relationship decides the foreign key. Find the many side first, then look for the junction.',
  algebra: 'Read the expression from the inside out. Selection before projection, unless the projection removed a column the predicate needs.',
  normalization: 'Name the dependency before you split. A decomposition without a reason is just column shuffling.',
};

export function Lab() {
  const [tab, setTab] = useState<LabTab>('erd');

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('lab');
    if (requested === 'erd' || requested === 'algebra' || requested === 'normalization') {
      setTab(requested);
    }
  }, []);

  const activeIndex = TABS.findIndex((item) => item.id === tab);
  const active = TABS[activeIndex];

  return (
    <div className="dbmsviz-frame mx-auto w-full max-w-[1240px]">
      <header className="border-b px-5 py-10 sm:px-8 sm:py-14" style={{ borderColor: 'var(--db-border)' }}>
        <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>Volume 01 · Workbench</p>
        <h1 className="db-display mt-4 text-[clamp(3.6rem,8vw,7rem)]">Operate the model.</h1>
        <p className="mt-5 max-w-2xl text-sm leading-[1.85] sm:text-base" style={{ color: 'var(--db-muted)' }}>
          Three instruments for the parts of a DBMS that are easiest to memorize and hardest to see:
          cardinality, algebra, and decomposition. Change an input and watch the schema answer.
        </p>
      </header>

      <section className="grid border-b md:grid-cols-3" style={{ borderColor: 'var(--db-border)' }}>
        {TABS.map((item, index) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`group px-5 py-5 text-left sm:px-7 ${index < TABS.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''}`}
              style={{
                borderColor: 'var(--db-border)',
                backgroundColor: isActive ? 'var(--db-primary-soft)' : 'transparent',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="db-mono text-[9px] font-bold" style={{ color: isActive ? 'var(--db-primary)' : 'var(--db-border-strong)' }}>
                  INSTRUMENT {String(index + 1).padStart(2, '0')}
                </span>
                <ArrowRight className="h-3.5 w-3.5" style={{ color: isActive ? 'var(--db-primary)' : 'var(--db-muted)' }} />
              </div>
              <span className="db-display-tight mt-3 block text-xl">{item.label}</span>
              <span className="mt-1.5 block text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>
                {item.description}
              </span>
            </button>
          );
        })}
      </section>

      <section className="border-b px-5 py-6 sm:px-8" style={{ borderColor: 'var(--db-border)' }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-4 w-4" style={{ color: 'var(--db-primary)' }} />
            <div>
              <p className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>
                Instrument {String(activeIndex + 1).padStart(2, '0')} / 03
              </p>
              <h2 className="db-display-tight mt-0.5 text-2xl">{active.label}</h2>
            </div>
          </div>
          <p className="max-w-xl text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>
            {NOTES[tab]}
          </p>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="border p-4 sm:p-6" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-surface)' }}>
          {tab === 'erd' && <CardinalityLab />}
          {tab === 'algebra' && <RelationalAlgebraLab />}
          {tab === 'normalization' && <NormalizationLab />}
        </div>
      </section>
    </div>
  );
}
