'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  SIGNALS,
  freqToUnit,
  unitToFreq,
  type SignalDef,
  type SignalKind,
} from './data';

const BIN_COUNT = 48;
const ROW_COUNT = 32;
const TICK_MS = 150;

interface SignalGeometry {
  sig: SignalDef;
  unit: number;
  sigma: number;
}

interface WaterfallRow {
  id: number;
  cells: number[];
}

const GEOMETRY: SignalGeometry[] = SIGNALS.map((sig) => {
  const lo = freqToUnit(Math.max(sig.freqMHz - sig.bandwidthMHz / 2, 0.05));
  const hi = freqToUnit(sig.freqMHz + sig.bandwidthMHz / 2);
  return { sig, unit: freqToUnit(sig.freqMHz), sigma: Math.max((hi - lo) / 2, 0.007) };
});

const ACTIVITY: Record<SignalKind, (seed: number, t: number) => number> = {
  am: (seed, t) => 0.6 + 0.26 * Math.sin(t / 23 + seed),
  fm: (seed, t) => 0.86 + 0.08 * Math.sin(t / 12 + seed * 2.1),
  wifi: (seed, t) => (Math.sin(t / 7 + seed * 1.3) > 0.12 ? 0.95 : 0.05),
  mystery: (seed, t) => (Math.sin(t / 27 + seed * 4.2) > 0.84 ? 0.7 : 0.04),
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function hashNoise(seed: number, i: number): number {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function makeRow(t: number): number[] {
  const cells: number[] = [];
  for (let i = 0; i < BIN_COUNT; i++) {
    const u = (i + 0.5) / BIN_COUNT;
    let p = 0.04 + Math.random() * 0.09; // noise floor
    for (const g of GEOMETRY) {
      const d = u - g.unit;
      p += ACTIVITY[g.sig.kind](g.sig.seed, t) * Math.exp(-(d * d) / (2 * g.sigma * g.sigma));
    }
    cells.push(clamp01(p));
  }
  return cells;
}

function cellColor(v: number): string {
  const c = clamp01((v - 0.05) / 0.95);
  const r = Math.round(8 + 235 * c * c * c);
  const g = Math.round(14 + 225 * Math.pow(c, 1.3));
  const b = Math.round(22 + 205 * Math.pow(c, 0.75));
  return 'rgb(' + Math.min(r, 255) + ',' + Math.min(g, 255) + ',' + Math.min(b, 255) + ')';
}

function formatFreq(mhz: number): string {
  if (mhz >= 1000) return (mhz / 1000).toFixed(3) + ' GHz';
  if (mhz >= 10) return mhz.toFixed(1) + ' MHz';
  return mhz.toFixed(3) + ' MHz';
}

function rawSample(kind: SignalKind, seed: number, i: number, t: number): number {
  const ph = i * 0.55 + t * 0.85;
  switch (kind) {
    case 'am':
      return (0.55 + 0.35 * Math.sin(ph * 0.12 + t * 0.04)) * Math.sin(ph * 1.7);
    case 'fm':
      return Math.sin(ph) * (0.72 + 0.24 * Math.sin(ph * 0.21));
    case 'wifi':
      return hashNoise(seed, Math.floor(i / 4) + t * 3) > 0.5 ? 0.85 : -0.85;
    default:
      return Math.sin(ph * 0.5) * Math.sin(ph * 3.3) * (hashNoise(seed, i + t * 2) > 0.8 ? 1 : 0.2);
  }
}

function wavePoints(kind: SignalKind, seed: number, t: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 64; i++) {
    const v = clamp01((rawSample(kind, seed, i, t) + 1.2) / 2.4);
    pts.push((i * 5).toFixed(1) + ',' + (34 - v * 30).toFixed(1));
  }
  return pts.join(' ');
}

const RULER_TICKS = [
  { f: 1, label: '1 MHz' },
  { f: 10, label: '10' },
  { f: 100, label: '100' },
  { f: 1000, label: '1 GHz' },
];

export default function SdrExplorer() {
  const [rows, setRows] = useState<WaterfallRow[]>([]);
  const [tune, setTune] = useState(0.6);
  const [decodeCount, setDecodeCount] = useState(0);
  const [discovered, setDiscovered] = useState<string[]>([]);

  // Waterfall scroll loop - the only timer in the component.
  useEffect(() => {
    let n = 0;
    const timer = window.setInterval(() => {
      n += 1;
      setRows((prev) => [{ id: n, cells: makeRow(n) }, ...prev].slice(0, ROW_COUNT));
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  const tick = rows[0]?.id ?? 0;

  const lockedSig = useMemo(() => {
    let best: SignalGeometry | null = null;
    let bestDist = Infinity;
    for (const g of GEOMETRY) {
      const dist = Math.abs(g.unit - tune);
      if (dist < bestDist) {
        bestDist = dist;
        best = g;
      }
    }
    if (!best) return null;
    return bestDist <= Math.max(best.sigma * 1.15, 0.007) ? best.sig : null;
  }, [tune]);

  const lockedId = lockedSig?.id ?? null;

  // Discovering a signal permanently logs it in the legend.
  useEffect(() => {
    if (!lockedId) return;
    setDiscovered((prev) => (prev.includes(lockedId) ? prev : [...prev, lockedId]));
  }, [lockedId]);

  // Demodulated text streams in while tuned to a signal.
  useEffect(() => {
    setDecodeCount(0);
    const sig = SIGNALS.find((s) => s.id === lockedId);
    if (!sig) return;
    const total = sig.decodedText.length;
    const timer = window.setInterval(() => {
      setDecodeCount((n) => Math.min(n + 2, total));
    }, 30);
    return () => window.clearInterval(timer);
  }, [lockedId]);

  const strength = lockedSig ? ACTIVITY[lockedSig.kind](lockedSig.seed, tick) : 0;
  const decodedText = lockedSig ? lockedSig.decodedText.slice(0, decodeCount) : '';
  const tuneFreq = unitToFreq(tune);

  const nearList = useMemo(
    () =>
      GEOMETRY.map((g) => ({
        g,
        distMHz: Math.abs(unitToFreq(g.unit) - tuneFreq),
      })).sort((a, b) => a.distMHz - b.distMHz),
    [tuneFreq]
  );

  const displayName = (sig: SignalDef) =>
    sig.classified && !discovered.includes(sig.id) ? 'Unidentified emitter' : sig.name;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
              Software Defined Radio
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">The Shared Spectrum Explorer</h1>
            <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Every signal below is transmitting at once. Slide the receiver across five decades of radio
              spectrum, lock onto a carrier, and watch it resolve into meaning.
            </p>
          </div>
          <div className="rounded-lg border border-cyan-500/40 bg-cyan-50 px-4 py-2 text-right dark:bg-cyan-500/10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Receiver</p>
            <p className="font-mono text-lg font-bold text-cyan-700 dark:text-cyan-300">{formatFreq(tuneFreq)}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-7 lg:grid-cols-[minmax(340px,1.35fr)_1fr]">
        {/* Spectrum screen */}
        <section aria-label="Waterfall spectrum" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold">Waterfall</h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Time flows downward; brightness is energy at each frequency. Log axis spans 0.5 MHz to 3 GHz.
          </p>

          <div className="relative mt-3 overflow-hidden rounded-lg border border-zinc-800 bg-[#05070d]">
            {/* ruler */}
            <div className="relative h-6 border-b border-zinc-800 bg-zinc-950/80">
              {RULER_TICKS.map((tk) => (
                <span
                  key={tk.f}
                  className="absolute top-1 -translate-x-1/2 font-mono text-[10px] text-zinc-500"
                  style={{ left: (freqToUnit(tk.f) * 100).toFixed(2) + '%' }}
                >
                  {tk.label}
                </span>
              ))}
            </div>

            {/* waterfall grid */}
            <div role="img" aria-label="Scrolling waterfall display of synthetic radio signals" className="relative">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="grid"
                  style={{ gridTemplateColumns: 'repeat(' + BIN_COUNT + ', 1fr)', height: '7px' }}
                >
                  {row.cells.map((v, i) => (
                    <div key={i} style={{ backgroundColor: cellColor(v) }} />
                  ))}
                </div>
              ))}
              {rows.length === 0 && <div className="h-56" />}

              {/* locked-signal highlight */}
              {lockedSig && (() => {
                const g = GEOMETRY.find((x) => x.sig.id === lockedSig.id);
                if (!g) return null;
                const w = Math.max(g.sigma * 1.15, 0.008);
                return (
                  <div
                    className="pointer-events-none absolute inset-y-0 border-x border-cyan-300/70 bg-cyan-400/10"
                    style={{ left: ((g.unit - w) * 100).toFixed(2) + '%', width: (w * 200).toFixed(2) + '%' }}
                  />
                );
              })()}

              {/* tuning cursor */}
              <div
                className="pointer-events-none absolute inset-y-0 w-px bg-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                style={{ left: (tune * 100).toFixed(2) + '%' }}
              />
            </div>
          </div>

          {/* tuner */}
          <div className="mt-4">
            <label htmlFor="sdr-tune" className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Tuning dial
            </label>
            <input
              id="sdr-tune"
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={tune}
              onChange={(e) => setTune(Number(e.target.value))}
              className="mt-2 w-full accent-cyan-600 dark:accent-cyan-400"
              aria-label="Receiver tuning frequency"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Tuning is filtering: the dial selects one narrow slice of the shared airwaves.
            </p>
          </div>

          {/* nearest signals */}
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Signals nearest the dial">
            {nearList.map(({ g, distMHz }) => {
              const isLocked = g.sig.id === lockedId;
              const known = !g.sig.classified || discovered.includes(g.sig.id);
              return (
                <li key={g.sig.id}>
                  <button
                    type="button"
                    onClick={() => setTune(g.unit)}
                    className={
                      'rounded-full border px-3 py-1 text-xs transition-colors ' +
                      (isLocked
                        ? 'border-cyan-600 bg-cyan-600 text-white hover:bg-cyan-700 dark:border-cyan-400 dark:bg-cyan-500/90 dark:text-zinc-950'
                        : 'border-zinc-300 text-zinc-700 hover:border-cyan-500 hover:text-cyan-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300')
                    }
                  >
                    {known ? g.sig.name : '???'} · {isLocked ? 'LOCKED' : 'Δ ' + formatFreq(distMHz)}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Demodulation + legend column */}
        <div className="flex flex-col gap-6">
          <section aria-label="Demodulator output" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold">Demodulator</h2>
            {!lockedSig ? (
              <p className="mt-3 rounded-lg bg-zinc-100 p-4 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                No carrier centered under the cursor. Move the dial until a band lights up and locks -
                then the receiver math can pull meaning out of the noise.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{displayName(lockedSig)}</p>
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{formatFreq(lockedSig.freqMHz)}</p>
                </div>

                <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#05070d] p-2">
                  <svg viewBox="0 0 315 60" className="h-16 w-full" role="img" aria-label="Demodulated waveform trace">
                    <line x1="0" y1="34" x2="315" y2="34" className="stroke-zinc-700" strokeWidth="1" strokeDasharray="4 4" />
                    <polyline
                      points={wavePoints(lockedSig.kind, lockedSig.seed, tick)}
                      fill="none"
                      strokeWidth="2"
                      className="stroke-cyan-300"
                    />
                  </svg>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    <span>Signal strength</span>
                    <span>{Math.round(strength * 100)}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-cyan-600 transition-[width] duration-150 dark:bg-cyan-400"
                      style={{ width: (strength * 100).toFixed(0) + '%' }}
                    />
                  </div>
                </div>

                <div className="min-h-[72px] rounded-lg bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-cyan-300">
                  {decodedText}
                  {decodeCount < lockedSig.decodedText.length && (
                    <span className="animate-pulse text-cyan-500">█</span>
                  )}
                </div>

                <p className="rounded-lg bg-cyan-50 p-3 text-xs leading-relaxed text-zinc-700 dark:bg-cyan-500/10 dark:text-zinc-300">
                  <span className="font-semibold text-cyan-700 dark:text-cyan-400">What you learned: </span>
                  {lockedSig.blurb}
                </p>
              </div>
            )}
          </section>

          <section aria-label="Signal log" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold">Station log</h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Tune into a signal once to identify it. {discovered.length} of {SIGNALS.length} logged.
            </p>
            <table className="mt-3 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th scope="col" className="py-1.5 pr-2 font-medium">Signal</th>
                  <th scope="col" className="py-1.5 pr-2 font-medium">Band</th>
                  <th scope="col" className="py-1.5 text-right font-medium">Center</th>
                </tr>
              </thead>
              <tbody>
                {SIGNALS.map((sig) => {
                  const found = discovered.includes(sig.id);
                  const isLocked = sig.id === lockedId;
                  return (
                    <tr key={sig.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60">
                      <td className="py-1.5 pr-2">
                        <span className={'mr-1.5 inline-block h-2 w-2 rounded-full align-middle ' + (isLocked ? 'bg-cyan-500' : found ? 'bg-zinc-400 dark:bg-zinc-600' : 'bg-zinc-300 dark:bg-zinc-700')} />
                        {found ? displayName(sig) : 'Unidentified emitter'}
                      </td>
                      <td className="py-1.5 pr-2 text-xs text-zinc-500 dark:text-zinc-400">{found ? sig.band : '- ? -'}</td>
                      <td className="py-1.5 text-right font-mono text-xs text-zinc-500 dark:text-zinc-400">
                        {found ? formatFreq(sig.freqMHz) : '?'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>
      </main>

      {/* Teaching footer */}
      <footer className="mx-auto grid max-w-6xl gap-6 px-5 pb-10 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-bold">Lesson 1 - The airwaves are a commons</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Regulators slice the spectrum into bands: AM below 1.7 MHz, FM broadcast at 88-108 MHz,
            weather radios just above, walkie-talkies in UHF gaps, Wi-Fi up at 2.4 GHz. Everyone in a
            band transmits into the same shared medium - the waterfall shows all of them stacked on one
            axis, exactly as they arrive at your antenna.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-bold">Lesson 2 - Tuning means filtering</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Your receiver never hears one station by luck - it mathematically filters out everything
            except a narrow window around the dial. Center that window on a carrier (the LOCK state)
            and demodulation can invert the modulation scheme to recover audio or data. Off-center even
            slightly, and the decode degrades back into noise. Same trick selects Wi-Fi channels.
          </p>
        </div>
      </footer>
    </div>
  );
}
