'use client';

import { useState } from 'react';
import '../styles.css';

type Addressing = 'byte' | 'word';

const WINDOW = 32;
const WORD_BYTES = 4n;

function parseAddress(raw: string, max: bigint): bigint {
  try {
    const value = BigInt(raw.trim() === '' ? '0' : raw.trim());
    if (value < 0n) return 0n;
    if (value > max) return max;
    return value;
  } catch {
    return 0n;
  }
}

function formatBig(value: bigint): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// A 32-location window stands in for the whole space; the caption says so.
// BigInt keeps counts exact even at a 32-bit address bus.
export function AddressSpaceExplorer() {
  const [width, setWidth] = useState(20);
  const [widthDraft, setWidthDraft] = useState('20');
  const [addressDraft, setAddressDraft] = useState('0');
  const [mode, setMode] = useState<Addressing>('byte');

  const locations = 1n << BigInt(width);
  const maxAddress = locations - 1n;
  const selected = parseAddress(addressDraft, maxAddress);
  const windowStart = selected - (selected % BigInt(WINDOW));
  const cellCount = Number(minBig(BigInt(WINDOW - 1), maxAddress) + 1n);
  const cells = Array.from({ length: cellCount }, (_, offset) => windowStart + BigInt(offset));

  const byteCapacity = mode === 'byte' ? locations : locations * WORD_BYTES;
  const selectedWord = selected - (selected % WORD_BYTES);
  const wordEnd = minBig(selectedWord + WORD_BYTES - 1n, maxAddress);
  const byteOffset = Number(selected % WORD_BYTES);
  const bits = selected.toString(2).padStart(width, '0');

  const commitWidth = (raw: string) => {
    const value = Number(raw);
    const next = Number.isInteger(value) && value >= 1 && value <= 32 ? value : width;
    setWidth(next);
    setWidthDraft(String(next));
  };

  const move = (delta: bigint) => {
    const candidate = selected + delta;
    const clamped = candidate < 0n ? 0n : candidate > maxAddress ? maxAddress : candidate;
    setAddressDraft(clamped.toString());
  };

  return (
    <div className="co-ase">
      <p className="co-muted mt-0 text-sm">
        The address bus decides how many locations exist. Drag its width and watch the map redraw, then pick an
        address to see which bits select it.
      </p>

      <div className="co-ase-controls co-card mt-3">
        <div className="co-ase-width-row">
          <div className="co-ase-field">
            <label htmlFor="co-ase-width-slider">Address bus width</label>
            <input
              id="co-ase-width-slider"
              type="range"
              min={1}
              max={32}
              step={1}
              value={width}
              onChange={(event) => {
                const next = Number(event.target.value);
                setWidth(next);
                setWidthDraft(String(next));
              }}
            />
          </div>
          <div className="co-ase-field co-ase-field-number">
            <label htmlFor="co-ase-width-number">Bits</label>
            <input
              id="co-ase-width-number"
              type="number"
              min={1}
              max={32}
              step={1}
              value={widthDraft}
              onChange={(event) => {
                const raw = event.target.value;
                setWidthDraft(raw);
                const value = Number(raw);
                if (Number.isInteger(value) && value >= 1 && value <= 32) setWidth(value);
              }}
              onBlur={() => commitWidth(widthDraft)}
            />
          </div>
          <output className="co-ase-width-badge" htmlFor="co-ase-width-slider">
            {width} bits
          </output>
        </div>

        <div className="co-ase-address-row">
          <div className="co-ase-field">
            <label htmlFor="co-ase-address">Selected address (decimal)</label>
            <input
              id="co-ase-address"
              type="text"
              inputMode="numeric"
              value={addressDraft}
              onChange={(event) => setAddressDraft(event.target.value)}
            />
            <span className="co-muted text-xs">Valid range: 0 … {formatBig(maxAddress)}</span>
          </div>
          <div className="co-ase-nudge" role="group" aria-label="Move selected address">
            <button type="button" className="co-action" onClick={() => move(-1n)} disabled={selected === 0n} aria-label="Previous address">
              −1
            </button>
            <button type="button" className="co-action" onClick={() => move(1n)} disabled={selected === maxAddress} aria-label="Next address">
              +1
            </button>
            <button type="button" className="co-action" onClick={() => setAddressDraft('0')}>First</button>
            <button type="button" className="co-action" onClick={() => setAddressDraft(maxAddress.toString())}>Last</button>
          </div>
        </div>

        <div className="co-ase-modes" role="group" aria-label="Addressing unit">
          <button
            type="button"
            className={`co-action${mode === 'byte' ? ' co-chip-active' : ''}`}
            aria-pressed={mode === 'byte'}
            onClick={() => setMode('byte')}
          >
            Byte-addressed
          </button>
          <button
            type="button"
            className={`co-action${mode === 'word' ? ' co-chip-active' : ''}`}
            aria-pressed={mode === 'word'}
            onClick={() => setMode('word')}
          >
            Word-addressed (32-bit words)
          </button>
        </div>
      </div>

      <div className="co-card co-ase-stats mt-3" aria-live="polite">
        <p>
          <span className="co-num">2<sup>{width}</sup></span> = <strong>{formatBig(locations)}</strong>{' '}
          {mode === 'byte' ? 'byte locations' : 'word locations'}
        </p>
        <p className="co-muted mt-1 text-sm">
          Capacity: {formatBig(byteCapacity)} bytes · highest {mode === 'byte' ? 'byte' : 'word'} address{' '}
          {formatBig(maxAddress)}
        </p>
        <p className="mt-2 text-sm">
          {mode === 'byte'
            ? `${selected} is byte ${byteOffset} of the word starting at ${selectedWord}; that word covers ${selectedWord} … ${wordEnd}.`
            : `Word address ${selected} selects bytes ${selected * WORD_BYTES} … ${selected * WORD_BYTES + 3n}; each address fetches a full 32-bit word.`}
        </p>
      </div>

      <div className="co-schematic co-ase-map mt-3">
        <div className="co-ase-ruler">
          <span>address {formatBig(windowStart)}</span>
          <span>window of {cellCount} of {formatBig(locations)} locations</span>
          <span>… {formatBig(windowStart + BigInt(cellCount - 1))}</span>
        </div>
        <div className="co-ase-cells" role="group" aria-label="Addresses in the current window">
          {cells.map((address) => {
            const inWord =
              mode === 'byte' && address >= selectedWord && address < selectedWord + WORD_BYTES;
            return (
              <button
                key={address.toString()}
                type="button"
                className={`co-ase-cell${address === selected ? ' co-ase-cell-selected' : ''}${
                  inWord ? ' co-ase-cell-word' : ''
                }`}
                aria-pressed={address === selected}
                aria-label={`Select ${mode === 'byte' ? 'byte' : 'word'} address ${address}`}
                onClick={() => setAddressDraft(address.toString())}
              >
                {address.toString()}
              </button>
            );
          })}
        </div>
        <p className="co-muted mt-2 text-xs">
          {mode === 'byte'
            ? 'Cells are bytes; the outlined group is the 4-byte word containing the selected byte.'
            : 'Cells are 32-bit words; one address names four bytes, so the byte capacity is four times larger.'}
        </p>
      </div>

      <div className="co-ase-bits mt-3">
        <p className="co-ics-heading">Bits on the address bus</p>
        <div className="co-ase-bit-row" aria-label={`Selected address in ${width} binary digits`}>
          {bits.split('').map((bit, index) => (
            <span key={index} className={`co-ase-bit${bit === '1' ? ' co-ase-bit-on' : ''}`} title={`bit ${width - 1 - index}`}>
              {bit}
            </span>
          ))}
        </div>
        <p className="co-muted mt-2 text-xs">Most significant bit on the left · least significant on the right.</p>
      </div>
    </div>
  );
}

function minBig(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}
