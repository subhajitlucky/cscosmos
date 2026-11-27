'use client';

import React, { useEffect, useState } from 'react';
import { CircleDot } from 'lucide-react';
import { BlockDiagramLab } from '../components/labs/BlockDiagramLab';
import { NumberSystemsLab } from '../components/labs/NumberSystemsLab';
import { LogicGateLab } from '../components/labs/LogicGateLab';

type LabTab = 'block' | 'numbers' | 'logic';

const TABS: { id: LabTab; label: string; description: string; note: string }[] = [
  {
    id: 'block',
    label: 'Block diagram',
    description: 'Click each functional unit of a digital computer.',
    note: 'Input, memory, ALU, control, and output are connected by buses. The control unit coordinates the cycle; it does not do the arithmetic itself.',
  },
  {
    id: 'numbers',
    label: 'Number systems',
    description: 'Convert one byte between decimal, binary, octal, hex, and BCD.',
    note: 'Group binary bits in threes for octal and in fours for hexadecimal. BCD is different: it stores each decimal digit in its own four bits.',
  },
  {
    id: 'logic',
    label: 'Logic gates',
    description: 'Toggle inputs and inspect the truth table.',
    note: 'A truth table lists every input combination. AND needs both inputs; OR needs either; XOR is true only when they differ.',
  },
];

export function Lab() {
  const [tab, setTab] = useState<LabTab>('block');

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('lab');
    if (requested === 'block' || requested === 'numbers' || requested === 'logic') setTab(requested);
  }, []);

  const activeIndex = TABS.findIndex((item) => item.id === tab);
  const active = TABS[activeIndex];

  return (
    <div className="it-frame mx-auto w-full max-w-[1180px]">
      <header className="border-b px-5 py-8 sm:px-8 sm:py-10" style={{ borderColor: 'var(--it-border)' }}>
        <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>IT Fundamentals · Tools</p>
        <h1 className="it-page-title mt-2">Three ways to see the machine.</h1>
        <p className="it-prose mt-3 max-w-[720px]">
          A block diagram, a byte, and a logic gate. Change an input and watch the concept move.
        </p>
      </header>

      <section className="grid border-b md:grid-cols-3" style={{ borderColor: 'var(--it-border)' }}>
        {TABS.map((item, index) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-5 py-4 text-left sm:px-6 ${index < TABS.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''}`}
              style={{ borderColor: 'var(--it-border)', backgroundColor: isActive ? 'var(--it-primary-soft)' : 'transparent' }}
            >
              <span className="it-label text-[10px]" style={{ color: isActive ? 'var(--it-primary)' : 'var(--it-muted)' }}>Tool {String(index + 1).padStart(2, '0')}</span>
              <span className="it-heading mt-1 block text-[15px]">{item.label}</span>
              <span className="mt-1 block text-[12px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{item.description}</span>
            </button>
          );
        })}
      </section>

      <section className="border-b px-5 py-4 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
        <div className="flex items-center gap-2">
          <CircleDot className="h-4 w-4" style={{ color: 'var(--it-primary)' }} />
          <p className="it-kicker text-[10px]" style={{ color: 'var(--it-muted)' }}>Tool {String(activeIndex + 1).padStart(2, '0')} / 03 · {active.label}</p>
        </div>
        <p className="mt-2 max-w-[760px] text-[13px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{active.note}</p>
      </section>

      <section className="px-5 py-6 sm:px-8 sm:py-8">
        <div className="border p-4 sm:p-6" style={{ borderColor: 'var(--it-border-strong)', backgroundColor: 'var(--it-surface)' }}>
          {tab === 'block' && <BlockDiagramLab />}
          {tab === 'numbers' && <NumberSystemsLab />}
          {tab === 'logic' && <LogicGateLab />}
        </div>
      </section>
    </div>
  );
}
