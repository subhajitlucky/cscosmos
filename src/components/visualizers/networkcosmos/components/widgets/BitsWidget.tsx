'use client';

import { useState } from 'react';
import {
  Segmented,
  WidgetButton,
  WidgetPanel,
  WidgetSlider,
  WidgetStat,
  type WidgetProps,
} from './shared';

type Scheme = 'nrz' | 'manchester' | 'pam4';

const SCHEMES: ReadonlyArray<{ value: Scheme; label: string }> = [
  { value: 'nrz', label: 'NRZ' },
  { value: 'manchester', label: 'Manchester' },
  { value: 'pam4', label: 'PAM-4' },
];

const HIGH = 10;
const MID = 23;
const LOW = 36;

function waveform(bits: number[], scheme: Scheme): { path: string; width: number } {
  const points: { x: number; y: number }[] = [];
  const push = (x: number, y: number): void => {
    const last = points[points.length - 1];
    if (!last || last.x !== x || last.y !== y) points.push({ x, y });
  };

  if (scheme === 'pam4') {
    for (let i = 0; i < bits.length; i += 2) {
      const level = bits[i] * 2 + (bits[i + 1] ?? 0);
      const y = LOW - (level * (LOW - HIGH)) / 3;
      const x = (i / 2) * 40;
      push(x, y);
      push(x + 40, y);
    }
  } else if (scheme === 'manchester') {
    bits.forEach((bit, index) => {
      const x = index * 20;
      const first = bit ? LOW : HIGH;
      const second = bit ? HIGH : LOW;
      push(x, first);
      push(x + 10, first);
      push(x + 10, second);
      push(x + 20, second);
    });
  } else {
    bits.forEach((bit, index) => {
      const x = index * 20;
      const y = bit ? HIGH : LOW;
      push(x, y);
      push(x + 20, y);
    });
  }

  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  return { path, width: scheme === 'pam4' ? (bits.length / 2) * 40 : bits.length * 20 };
}

export function BitsWidget({ concept }: WidgetProps) {
  const shannonFocus = concept.slug.includes('shannon');
  const [bits, setBits] = useState([1, 0, 1, 1, 0, 0, 1, 0]);
  const [scheme, setScheme] = useState<Scheme>(shannonFocus ? 'pam4' : 'manchester');
  const [bandwidth, setBandwidth] = useState(shannonFocus ? 50 : 10);
  const [snrDb, setSnrDb] = useState(concept.defaultFault === 'none' ? 24 : 6);

  const { path, width } = waveform(bits, scheme);
  const capacity = bandwidth * Math.log2(1 + 10 ** (snrDb / 10));
  const bitsPerSymbol = scheme === 'pam4' ? 2 : 1;
  const symbolRate = 2 * bandwidth;
  const bitRate = symbolRate * bitsPerSymbol;
  const reliable = bitRate <= capacity;

  return (
    <WidgetPanel
      title="Signal & bit lab"
      subtitle="Click bits to change the waveform; adjust the channel to see whether the receiver can keep up."
      badge="Physical layer"
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Line code</span>
        <Segmented label="Bit encoding scheme" value={scheme} options={SCHEMES} onChange={setScheme} />
      </div>

      <div className="rounded-md border border-slate-300 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/60">
        <svg
          viewBox={`0 0 ${width} 46`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`${scheme} waveform for bits ${bits.join(' ')}`}
          className="h-16 w-full"
        >
          <line x1="0" y1={MID} x2={width} y2={MID} stroke="currentColor" strokeWidth="0.5" className="text-slate-400 dark:text-slate-500" strokeDasharray="3 3" />
          <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="text-sky-700 dark:text-sky-300" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div role="group" aria-label="Editable bit pattern" className="mt-2 flex flex-wrap gap-1.5">
        {bits.map((bit, index) => (
          <WidgetButton
            key={index}
            label={`Bit ${index + 1} is ${bit}. Toggle it`}
            active={bit === 1}
            onClick={() =>
              setBits((current) => current.map((value, position) => (position === index ? (value ? 0 : 1) : value)))
            }
          >
            <span className="font-mono">{bit}</span>
          </WidgetButton>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        <WidgetSlider
          label="Bandwidth B"
          value={bandwidth}
          min={1}
          max={200}
          suffix=" MHz"
          onChange={setBandwidth}
          hint="Nyquist ceiling = 2B symbols/s"
        />
        <WidgetSlider
          label="Signal-to-noise"
          value={snrDb}
          min={0}
          max={40}
          suffix=" dB"
          onChange={setSnrDb}
          hint="Shannon capacity = B log2(1 + S/N)"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <WidgetStat label="Shannon capacity" value={`${capacity.toFixed(1)} Mbit/s`} />
        <WidgetStat label="Symbol rate" value={`${symbolRate} MSym/s`} />
        <WidgetStat label="Offered bit rate" value={`${bitRate} Mbit/s`} />
        <WidgetStat label="Sampling margin" value={reliable ? 'OK' : 'Exceeded'} tone={reliable ? 'good' : 'bad'} />
      </div>
      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300" aria-live="polite">
        {reliable
          ? scheme === 'pam4'
            ? 'Two bits per symbol fit inside the Shannon limit; transitions still carry the clock.'
            : 'The requested bit rate fits below capacity, so mid-bit samples land on the correct level.'
          : 'The requested rate is past the capacity ceiling: smeared symbols produce flipped bits that appear later as CRC errors.'}
      </p>
    </WidgetPanel>
  );
}
