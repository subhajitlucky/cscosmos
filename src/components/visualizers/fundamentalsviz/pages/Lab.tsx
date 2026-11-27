'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, CircleDot } from 'lucide-react';
import { SystemBuilder } from '../components/labs/SystemBuilder';
import { BinaryBench } from '../components/labs/BinaryBench';
import { NetworkPath } from '../components/labs/NetworkPath';

type LabTab = 'system' | 'binary' | 'network';

const TABS: { id: LabTab; label: string; description: string; note: string }[] = [
  {
    id: 'system',
    label: 'System builder',
    description: 'Choose parts and see which one limits the build.',
    note: 'A computer is a chain. The slowest component sets the experience, no matter how good the others are.',
  },
  {
    id: 'binary',
    label: 'Binary bench',
    description: 'Toggle a byte and watch decimal, hex, and text agree.',
    note: 'Bits are switches. A number is a pattern of switches; a character is a number with an agreed meaning.',
  },
  {
    id: 'network',
    label: 'Network path',
    description: 'Trace a URL from DNS to the rendered page.',
    note: 'Every click is a relay: name resolution, connection, request, response, and render.',
  },
];

export function Lab() {
  const [tab, setTab] = useState<LabTab>('system');

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('lab');
    if (requested === 'system' || requested === 'binary' || requested === 'network') {
      setTab(requested);
    }
  }, []);

  const activeIndex = TABS.findIndex((item) => item.id === tab);
  const active = TABS[activeIndex];

  return (
    <div className="it-frame mx-auto w-full max-w-[1240px]">
      <header className="border-b px-5 py-10 sm:px-8 sm:py-14" style={{ borderColor: 'var(--it-border)' }}>
        <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>Volume 01 · Instruments</p>
        <h1 className="it-display mt-4 text-[clamp(3.2rem,8vw,6.8rem)]">Three instruments.</h1>
        <p className="mt-5 max-w-2xl text-sm leading-[1.85] sm:text-base" style={{ color: 'var(--it-muted)' }}>
          The machine, the byte, and the request. Change one input and watch the next layer respond.
          These are the parts of IT that diagrams explain badly and interaction explains quickly.
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
              className={`px-5 py-5 text-left sm:px-7 ${index < TABS.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''}`}
              style={{ borderColor: 'var(--it-border)', backgroundColor: isActive ? 'var(--it-primary-soft)' : 'transparent' }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="it-mono text-[9px] font-bold" style={{ color: isActive ? 'var(--it-primary)' : 'var(--it-border-strong)' }}>INSTRUMENT {String(index + 1).padStart(2, '0')}</span>
                <ArrowRight className="h-3.5 w-3.5" style={{ color: isActive ? 'var(--it-primary)' : 'var(--it-muted)' }} />
              </div>
              <span className="it-display-sm mt-3 block text-xl">{item.label}</span>
              <span className="mt-1.5 block text-[11px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{item.description}</span>
            </button>
          );
        })}
      </section>

      <section className="border-b px-5 py-6 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CircleDot className="h-4 w-4" style={{ color: 'var(--it-primary)' }} />
            <div>
              <p className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Instrument {String(activeIndex + 1).padStart(2, '0')} / 03</p>
              <h2 className="it-display-sm mt-0.5 text-2xl">{active.label}</h2>
            </div>
          </div>
          <p className="max-w-xl text-[11px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{active.note}</p>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="border p-4 sm:p-6" style={{ borderColor: 'var(--it-border-strong)', backgroundColor: 'var(--it-surface)' }}>
          {tab === 'system' && <SystemBuilder />}
          {tab === 'binary' && <BinaryBench />}
          {tab === 'network' && <NetworkPath />}
        </div>
      </section>
    </div>
  );
}
