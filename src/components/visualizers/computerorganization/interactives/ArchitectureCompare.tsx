'use client';

import { useState } from 'react';
import '../styles.css';

type Focus = 'both' | 'fetch' | 'data';

const FOCUS_OPTIONS: { key: Focus; label: string }[] = [
  { key: 'both', label: 'Both' },
  { key: 'fetch', label: 'Fetch only' },
  { key: 'data', label: 'Data only' },
];

// Two blueprints of the same fetch/data problem: one shared path versus two
// independent paths. The pulses are CSS animations, so there is no JS timer.
export function ArchitectureCompare() {
  const [running, setRunning] = useState(true);
  const [focus, setFocus] = useState<Focus>('both');
  const dimFetch = focus === 'data';
  const dimData = focus === 'fetch';
  const motionClass = running ? ' co-ac-running' : '';

  return (
    <div className="co-ac">
      <p className="co-muted mt-0 text-sm">
        Both machines run the same program. Watch where an instruction fetch and a data access travel — the
        difference is whether they share one route or have one each.
      </p>

      <div className="co-ac-controls mt-3">
        <button
          type="button"
          className={`co-action${running ? ' co-chip-active' : ''}`}
          aria-pressed={running}
          onClick={() => setRunning((current) => !current)}
        >
          {running ? 'Pause paths' : 'Animate paths'}
        </button>
        <div className="co-ac-focus" role="group" aria-label="Which path to show">
          {FOCUS_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`co-action${focus === option.key ? ' co-chip-active' : ''}`}
              aria-pressed={focus === option.key}
              onClick={() => setFocus(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="co-ac-panels mt-3">
        <section className="co-ac-panel">
          <h3 className="co-ac-panel-title">Von Neumann · unified memory</h3>
          <div className={`co-schematic co-ac-canvas${motionClass}`}>
            <svg viewBox="0 0 420 230" className="h-auto w-full" role="img" aria-label="Von Neumann architecture: CPU and one shared memory. Instruction fetch and data access use the same bus pair, so they take turns.">
              <rect className="co-ac-box" x="24" y="92" width="110" height="72" rx="9" />
              <text className="co-diagram-label" x="79" y="124" textAnchor="middle">CPU</text>
              <text className="co-ac-sub" x="79" y="144" textAnchor="middle">fetch + execute</text>

              <rect className="co-ac-trunk" x="146" y="116" width="126" height="30" rx="8" />
              <text className="co-ac-sub" x="209" y="106" textAnchor="middle">ONE BUS</text>
              <text className="co-ac-sub" x="209" y="166" textAnchor="middle">one access per cycle</text>

              <rect className="co-ac-box" x="286" y="86" width="110" height="86" rx="9" />
              <text className="co-diagram-label" x="341" y="118" textAnchor="middle">MEMORY</text>
              <text className="co-ac-sub" x="341" y="138" textAnchor="middle">code + data</text>

              {/* One wire shared by both kinds of access: the pulses alternate. */}
              <path className="co-ac-path" d="M 134 131 L 286 131" />
              {focus !== 'data' && (
                <path
                  className={`co-ac-pulse co-ac-pulse-address${focus === 'both' ? ' co-ac-vn-fetch' : ''}`}
                  d="M 134 131 L 286 131"
                />
              )}
              {focus !== 'fetch' && (
                <path
                  className={`co-ac-pulse co-ac-pulse-data${focus === 'both' ? ' co-ac-vn-data' : ''}`}
                  d="M 134 131 L 286 131"
                />
              )}
              <text className={`co-ac-wire-label${dimFetch ? ' co-ac-dim' : ''}`} x="210" y="88" textAnchor="middle">FETCH →</text>
              <text className={`co-ac-wire-label co-ac-wire-label-data${dimData ? ' co-ac-dim' : ''}`} x="210" y="182" textAnchor="middle">← DATA</text>
              <text className="co-ac-foot" x="210" y="212" textAnchor="middle">two transfers, one wire — they take turns</text>
            </svg>
          </div>
          <p className="co-ac-note mt-2">
            One address space holds instructions and data. A fetch and a data access cannot both use the bus in
            the same cycle — a structural hazard the pipeline must stall around.
          </p>
        </section>

        <section className="co-ac-panel">
          <h3 className="co-ac-panel-title">Harvard · split memories</h3>
          <div className={`co-schematic co-ac-canvas${motionClass}`}>
            <svg viewBox="0 0 420 230" className="h-auto w-full" role="img" aria-label="Harvard architecture: CPU with two separate memories and two independent buses. Instruction fetch and data access can happen at the same time.">
              <rect className="co-ac-box" x="24" y="92" width="110" height="72" rx="9" />
              <text className="co-diagram-label" x="79" y="124" textAnchor="middle">CPU</text>
              <text className="co-ac-sub" x="79" y="144" textAnchor="middle">fetch + execute</text>

              <rect className="co-ac-box co-ac-box-inst" x="286" y="34" width="110" height="62" rx="9" />
              <text className="co-diagram-label" x="341" y="62" textAnchor="middle">INSTR.</text>
              <text className="co-ac-sub" x="341" y="80" textAnchor="middle">memory</text>
              <rect className="co-ac-box co-ac-box-data" x="286" y="156" width="110" height="62" rx="9" />
              <text className="co-diagram-label" x="341" y="184" textAnchor="middle">DATA</text>
              <text className="co-ac-sub" x="341" y="202" textAnchor="middle">memory</text>

              <path className={`co-ac-path${dimFetch ? ' co-ac-dim' : ''}`} d="M 134 116 L 286 65" />
              <path className={`co-ac-pulse co-ac-pulse-address${dimFetch ? ' co-ac-dim' : ''}`} d="M 134 116 L 286 65" />
              <path className={`co-ac-path${dimData ? ' co-ac-dim' : ''}`} d="M 134 144 L 286 187" />
              <path className={`co-ac-pulse co-ac-pulse-data${dimData ? ' co-ac-dim' : ''}`} d="M 134 144 L 286 187" />
              <text className={`co-ac-wire-label${dimFetch ? ' co-ac-dim' : ''}`} x="212" y="70" textAnchor="middle">FETCH →</text>
              <text className={`co-ac-wire-label co-ac-wire-label-data${dimData ? ' co-ac-dim' : ''}`} x="212" y="186" textAnchor="middle">← DATA</text>
            </svg>
          </div>
          <p className="co-ac-note mt-2">
            Two address spaces and two buses. Fetch and data access can overlap, but code and data cannot be
            treated as one undifferentiated array in memory.
          </p>
        </section>
      </div>

      <table className="co-ac-table mt-4">
        <caption className="co-muted text-left text-sm">What each design trades</caption>
        <thead>
          <tr>
            <th scope="col">Question</th>
            <th scope="col">Von Neumann</th>
            <th scope="col">Harvard</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Memory spaces</th>
            <td>One shared</td>
            <td>Two separate</td>
          </tr>
          <tr>
            <th scope="row">Fetch + data in same cycle</th>
            <td>Share the bus — take turns</td>
            <td>Two buses — can overlap</td>
          </tr>
          <tr>
            <th scope="row">Code stored with data</th>
            <td>Yes, same address space</td>
            <td>No, different memories</td>
          </tr>
        </tbody>
      </table>
      <p className="co-muted mt-3 text-xs">
        Modern machines are usually “modified Harvard”: separate L1 instruction and data caches sit next to the
        core, while main memory and the lower cache levels stay unified.
      </p>
    </div>
  );
}
