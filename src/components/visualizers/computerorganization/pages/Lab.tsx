'use client';

import Link from 'next/link';
import { useState, type KeyboardEvent } from 'react';
import '../styles.css';
import { InstructionCycleStepper } from '../interactives/InstructionCycleStepper';

export interface ComputerOrganizationLabProps {
  basePath?: string;
}

type Fault = 'none' | 'bus-width' | 'address-overflow';

const BLOCKS = ['Input', 'CPU', 'Memory', 'Output', 'Storage'] as const;
type Block = (typeof BLOCKS)[number];

const DIAGNOSIS: Record<Exclude<Fault, 'none'>, string> = {
  'bus-width': 'data bus too narrow for the word size — a 32-bit word is split across two transfers',
  'address-overflow': 'address bus cannot reach the requested location — widen the address bus or move the word',
};

// The workbench: place blocks, run a real fetch–execute program, then inject a
// fault and see which wire of the data path breaks.
export function ComputerOrganizationLab({ basePath = '/corecs/computer-organization' }: ComputerOrganizationLabProps) {
  const [wired, setWired] = useState<Block[]>([]);
  const [fault, setFault] = useState<Fault>('none');

  const place = (block: Block) =>
    setWired((current) => (current.includes(block) ? current.filter((item) => item !== block) : [...current, block]));

  const onBlockKey = (event: KeyboardEvent<SVGGElement>, block: Block) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      place(block);
    }
  };

  const wires = wired.slice(0, -1).map((block, index) => ({
    id: `${block}-${wired[index + 1]}`,
    from: wired.indexOf(block),
    to: wired.indexOf(wired[index + 1]),
  }));

  return (
    <div className="co-root min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Digital Computer Workbench</h1>
        <p className="co-muted mt-2">
          Wire the blocks, run a program, then break the machine and diagnose it.
        </p>

        <section className="co-card co-lab-section mt-8">
          <h2 className="font-semibold">1 · Place the blocks</h2>
          <p className="co-muted mt-1 text-sm">
            Click a block (or focus it and press Enter) to add it to the data path; click again to remove it.
          </p>
          <div className="co-schematic co-lab-canvas mt-3">
            <svg viewBox="0 0 600 160" aria-labelledby="co-lab-title co-lab-desc" className="h-auto w-full">
              <title id="co-lab-title">Computer block diagram canvas</title>
              <desc id="co-lab-desc">
                Input, CPU, memory, output and storage blocks. Place blocks on the data path and inspect injected
                faults on the CPU to memory connection.
              </desc>
              {wires.map((wire) => (
                <line
                  key={wire.id}
                  className="co-wire"
                  x1={wire.from * 118 + 100}
                  y1="80"
                  x2={wire.to * 118}
                  y2="80"
                />
              ))}
              {fault !== 'none' && (
                <g className="co-lab-fault" aria-hidden="true">
                  <line className="co-lab-fault-line" x1="204" y1="122" x2="252" y2="122" />
                  <text className="co-lab-fault-text" x="228" y="148" textAnchor="middle">!</text>
                </g>
              )}
              {BLOCKS.map((block, index) => (
                <g
                  key={block}
                  className="co-lab-node"
                  role="button"
                  tabIndex={0}
                  aria-pressed={wired.includes(block)}
                  aria-label={`${block} block — ${wired.includes(block) ? 'remove from' : 'place on'} the data path`}
                  onClick={() => place(block)}
                  onKeyDown={(event) => onBlockKey(event, block)}
                >
                  <rect
                    className={`co-lab-block${wired.includes(block) ? ' co-lab-block-on' : ''}`}
                    x={index * 118}
                    y="50"
                    width="100"
                    height="60"
                    rx="8"
                  />
                  <text className="co-diagram-label" x={index * 118 + 50} y="86" textAnchor="middle">
                    {block}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="co-lab-block-buttons mt-3" role="group" aria-label="Blocks on the data path">
            {BLOCKS.map((block) => (
              <button
                key={block}
                type="button"
                className={`co-chip co-action${wired.includes(block) ? ' co-chip-active' : ''}`}
                aria-pressed={wired.includes(block)}
                onClick={() => place(block)}
              >
                {block}
              </button>
            ))}
            <button type="button" className="co-action" onClick={() => setWired([])} disabled={wired.length === 0}>
              Clear wiring
            </button>
          </div>
          <p className="co-muted mt-2 text-sm" aria-live="polite">
            Wired: {wired.length ? wired.join(' → ') : 'click blocks to place them'}
          </p>
        </section>

        <section className="co-card co-lab-section mt-4">
          <h2 className="font-semibold">2 · Inject a fault</h2>
          <label className="co-lab-fault-field mt-2">
            Fault injection:{' '}
            <select value={fault} onChange={(event) => setFault(event.target.value as Fault)}>
              <option value="none">none</option>
              <option value="bus-width">bus-width mismatch</option>
              <option value="address-overflow">address overflow</option>
            </select>
          </label>
          <p className={`co-lab-diagnosis mt-2${fault === 'none' ? '' : ' co-lab-diagnosis-bad'}`} aria-live="polite">
            {fault === 'none'
              ? 'Machine healthy — the CPU ↔ memory path carries both addresses and words correctly.'
              : `Diagnose: ${DIAGNOSIS[fault]}`}
          </p>
        </section>

        <section className="co-card co-lab-section mt-4">
          <h2 className="font-semibold">3 · Run the program</h2>
          <div className="mt-3">
            <InstructionCycleStepper />
          </div>
        </section>

        <Link className="co-chip co-cta mt-8" href={basePath}>
          ← Topic home
        </Link>
      </div>
    </div>
  );
}
