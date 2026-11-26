'use client';

import { useState } from 'react';
import '../styles.css';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'] as const;
const ADDRESS_DEFAULT = 20;
const DATA_DEFAULT = 32;

// Keep byte counts exact beyond Number.MAX_SAFE_INTEGER (2^64 bytes and up).
function formatBytes(bytes: bigint): string {
  let unitIndex = 0;
  while (unitIndex < UNITS.length - 1 && bytes >= 1024n ** BigInt(unitIndex + 1)) {
    unitIndex += 1;
  }
  const divisor = 1024n ** BigInt(unitIndex);
  const hundredths = (bytes * 100n + divisor / 2n) / divisor; // round, don't truncate
  const whole = (hundredths / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const fraction = hundredths % 100n;
  return fraction === 0n
    ? `${whole} ${UNITS[unitIndex]}`
    : `${whole}.${fraction.toString().padStart(2, '0')} ${UNITS[unitIndex]}`;
}

function clampLines(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(64, Math.max(1, Math.trunc(value)));
}

// An empty field resolves to the default; anything else is clamped on commit.
function commitDraft(raw: string, fallback: number): number {
  const trimmed = raw.trim();
  if (trimmed === '') return fallback;
  return clampLines(Number(trimmed), fallback);
}

// Only a complete in-range integer updates the derivation while typing.
function liveDraft(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const value = Number(trimmed);
  return Number.isInteger(value) && value >= 1 && value <= 64 ? value : null;
}

// Address width sets *where*; data width sets *how much per transfer*.
// All derivation is pure so the same markup pre-renders on the server.
export function BusWidthCalculator() {
  const [addressLines, setAddressLines] = useState(ADDRESS_DEFAULT);
  const [dataLines, setDataLines] = useState(DATA_DEFAULT);
  // Draft strings let the learner clear or partially type a number without the
  // field snapping back; the numeric value commits on valid entry and on blur.
  const [addressDraft, setAddressDraft] = useState(String(ADDRESS_DEFAULT));
  const [dataDraft, setDataDraft] = useState(String(DATA_DEFAULT));

  const addressableBytes = 1n << BigInt(addressLines);
  const bytesPerTransfer = dataLines / 8;
  const laneCount = Math.max(1, Math.ceil(bytesPerTransfer));
  const laneTop = 70 - ((laneCount - 1) * 12) / 2;

  return (
    <div className="co-bwc">
      <p className="co-muted mt-0 text-sm">
        Address lines decide how many locations exist; data lines decide how many bits move per
        transfer. The two widths are independent design choices.
      </p>

      <div className="co-bbd-controls co-card mt-3">
        <div className="co-bbd-fields">
          <div className="co-bbd-field">
            <label htmlFor="co-bwc-address">Address lines (1–64)</label>
            <input
              id="co-bwc-address"
              type="number"
              min={1}
              max={64}
              step={1}
              value={addressDraft}
              onChange={(event) => {
                const raw = event.target.value;
                setAddressDraft(raw);
                const valid = liveDraft(raw);
                if (valid !== null) setAddressLines(valid);
              }}
              onBlur={() => {
                const value = commitDraft(addressDraft, ADDRESS_DEFAULT);
                setAddressLines(value);
                setAddressDraft(String(value));
              }}
            />
          </div>
          <div className="co-bbd-field">
            <label htmlFor="co-bwc-data">Data lines (1–64)</label>
            <input
              id="co-bwc-data"
              type="number"
              min={1}
              max={64}
              step={1}
              value={dataDraft}
              onChange={(event) => {
                const raw = event.target.value;
                setDataDraft(raw);
                const valid = liveDraft(raw);
                if (valid !== null) setDataLines(valid);
              }}
              onBlur={() => {
                const value = commitDraft(dataDraft, DATA_DEFAULT);
                setDataLines(value);
                setDataDraft(String(value));
              }}
            />
          </div>
        </div>
      </div>

      <div className="co-bwc-results mt-3" aria-live="polite">
        <p>
          <span className="co-num">2<sup>{addressLines}</sup></span> ={' '}
          <strong>{formatBytes(addressableBytes)}</strong> addressable bytes
        </p>
        <p className="co-muted mt-1 text-sm">
          Last byte address: {(addressableBytes - 1n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className="mt-2">
          Data bus: <strong>{dataLines} bits</strong> ·{' '}
          {Number(bytesPerTransfer.toFixed(2))} bytes per transfer
        </p>
      </div>

      <div className="co-schematic co-bwc-canvas mt-3">
        <svg viewBox="0 0 640 150" className="h-auto w-full" role="img" aria-label={`${dataLines}-bit data bus with ${laneCount} byte lanes`}>
          <text className="co-bus-label" x="320" y="18" textAnchor="middle">
            {dataLines}-bit data bus
          </text>
          <rect
            className="co-bwc-track"
            x="56"
            y={laneTop - 10}
            width="528"
            height={(laneCount - 1) * 12 + 20}
            rx="10"
          />
          {Array.from({ length: laneCount }, (_, index) => (
            <line
              key={index}
              className="co-wire co-bwc-lane"
              x1="70"
              y1={laneTop + index * 12}
              x2="570"
              y2={laneTop + index * 12}
            />
          ))}
          <text className="co-diagram-label" x="70" y="132" textAnchor="middle">CPU</text>
          <text className="co-diagram-label" x="570" y="132" textAnchor="middle">MEMORY</text>
          <text className="co-diagram-sub" x="320" y="132" textAnchor="middle">
            {dataLines < 8
              ? '1 partial byte lane'
              : `${laneCount} byte lane${laneCount === 1 ? '' : 's'}`}
          </text>
        </svg>
      </div>
      <p className="co-muted mt-2 text-xs">
        Widen only the address lines and the map grows; widen only the data lines and each trip carries more.
      </p>
    </div>
  );
}
