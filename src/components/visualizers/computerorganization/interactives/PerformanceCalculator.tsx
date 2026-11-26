'use client';

import { useState } from 'react';
import '../styles.css';

const DEFAULTS = { clock: '500', cpi: '2', instructions: '100000000' };

function positive(raw: string): number | null {
  const value = Number(raw.trim());
  if (raw.trim() === '' || !Number.isFinite(value) || value <= 0) return null;
  return value;
}

function nonNegative(raw: string): number | null {
  const value = Number(raw.trim());
  if (raw.trim() === '' || !Number.isFinite(value) || value < 0 || !Number.isInteger(value)) return null;
  return value;
}

function formatSeconds(seconds: number): string {
  if (seconds === 0) return '0 s';
  if (seconds < 1e-6) return `${(seconds * 1e9).toPrecision(3)} ns`;
  if (seconds < 1e-3) return `${(seconds * 1e6).toPrecision(3)} µs`;
  if (seconds < 1) return `${(seconds * 1e3).toPrecision(3)} ms`;
  return `${seconds.toPrecision(4)} s`;
}

function formatCount(value: number): string {
  return value.toLocaleString('en-US');
}

// CPU time = IC × CPI × T_clock. Invalid or zero clock/CPI are reported rather
// than silently producing Infinity; zero instructions means zero work.
export function PerformanceCalculator() {
  const [clock, setClock] = useState(DEFAULTS.clock);
  const [cpi, setCpi] = useState(DEFAULTS.cpi);
  const [instructions, setInstructions] = useState(DEFAULTS.instructions);

  const clockMHz = positive(clock);
  const cyclesPerInstruction = positive(cpi);
  const instructionCount = nonNegative(instructions);

  const errors: string[] = [];
  if (clockMHz === null) errors.push('Clock rate must be a number greater than 0 MHz.');
  if (cyclesPerInstruction === null) errors.push('CPI must be a number greater than 0.');
  if (instructionCount === null) errors.push('Instruction count must be a whole number of 0 or more.');

  const valid = errors.length === 0;
  const clockHz = valid ? clockMHz! * 1e6 : null;
  const totalCycles = valid ? instructionCount! * cyclesPerInstruction! : null;
  const seconds = valid ? totalCycles! / clockHz! : null;
  const periodNs = valid ? 1000 / clockMHz! : null;
  const mips = valid && instructionCount! > 0 ? clockMHz! / cyclesPerInstruction! : null;

  return (
    <div className="co-pc">
      <p className="co-muted mt-0 text-sm">
        Clock speed alone says little. Enter the work, the average cycles per instruction and the clock rate to
        see the two numbers that actually describe performance.
      </p>

      <div className="co-pc-inputs co-card mt-3">
        <div className="co-bbd-field">
          <label htmlFor="co-pc-clock">Clock rate (MHz)</label>
          <input
            id="co-pc-clock"
            type="number"
            min={0}
            step="any"
            value={clock}
            onChange={(event) => setClock(event.target.value)}
          />
        </div>
        <div className="co-bbd-field">
          <label htmlFor="co-pc-cpi">Cycles per instruction (CPI)</label>
          <input
            id="co-pc-cpi"
            type="number"
            min={0}
            step="any"
            value={cpi}
            onChange={(event) => setCpi(event.target.value)}
          />
        </div>
        <div className="co-bbd-field">
          <label htmlFor="co-pc-ic">Dynamic instruction count</label>
          <input
            id="co-pc-ic"
            type="number"
            min={0}
            step={1}
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
          />
        </div>
      </div>

      <div className="co-pc-actions mt-3">
        <button
          type="button"
          className="co-action"
          onClick={() => {
            setClock(DEFAULTS.clock);
            setCpi(DEFAULTS.cpi);
            setInstructions(DEFAULTS.instructions);
          }}
        >
          Reset to example
        </button>
      </div>

      {!valid && (
        <div className="co-pc-error mt-3" role="alert">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      <div className="co-pc-results mt-3" aria-live="polite">
        <div className="co-pc-hero">
          <span className="co-pc-hero-label">Execution time</span>
          <strong className="co-pc-hero-value">{valid ? formatSeconds(seconds!) : '—'}</strong>
        </div>
        <div className="co-pc-hero">
          <span className="co-pc-hero-label">MIPS</span>
          <strong className="co-pc-hero-value">{mips === null ? '—' : mips.toPrecision(4)}</strong>
        </div>
      </div>

      <div className="co-pc-breakdown co-card mt-3">
        <p className="co-ics-heading">Breakdown</p>
        <dl>
          <div>
            <dt>Total clock cycles</dt>
            <dd>{valid ? formatCount(totalCycles!) : '—'}</dd>
          </div>
          <div>
            <dt>Clock period</dt>
            <dd>{periodNs === null ? '—' : `${periodNs.toPrecision(3)} ns`}</dd>
          </div>
          <div>
            <dt>Instructions / second</dt>
            <dd>{mips === null ? '—' : `${formatCount(Math.round(mips * 1e6))} / s`}</dd>
          </div>
        </dl>
      </div>

      <div className="co-pc-formula co-schematic mt-3">
        <p className="co-ics-heading">The formula</p>
        <p className="co-pc-equation">
          CPU time = IC × CPI × T<sub>clock</sub>
        </p>
        <p className="co-muted mt-1 text-sm">
          {valid
            ? `${formatCount(instructionCount!)} × ${cyclesPerInstruction} × ${periodNs!.toPrecision(3)} ns = ${formatSeconds(seconds!)}`
            : 'Fill in valid values to see the substitution.'}
        </p>
        <p className="co-pc-equation mt-3">
          MIPS = clock rate (MHz) ÷ CPI
        </p>
        <p className="co-muted mt-1 text-sm">
          {mips === null
            ? 'MIPS needs a positive clock, a positive CPI and at least one instruction.'
            : `${clockMHz} MHz ÷ ${cyclesPerInstruction} = ${mips.toPrecision(4)} million instructions / s`}
        </p>
      </div>
      <p className="co-muted mt-2 text-xs">
        A higher clock helps only when IC and CPI stay fixed; different instruction sets can need very different
        instruction counts for the same task.
      </p>
    </div>
  );
}
