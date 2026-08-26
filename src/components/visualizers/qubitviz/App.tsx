'use client';

import { useMemo, useState } from 'react';
import {
  Atom,
  BarChart3,
  CircuitBoard,
  Dices,
  Eraser,
  Link2,
  Link2Off,
  Trash2,
  Unlink,
  type LucideIcon,
} from 'lucide-react';
import {
  MAX_COLS,
  PREBUILTS,
  bitstring,
  isEntangled,
  mag,
  phaseDeg,
  qubit0Purity,
  runCircuit,
  sampleShots,
  type GateKind,
  type Placement,
} from './data';

function SectionCard({
  icon: Icon,
  title,
  sub,
  children,
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" aria-hidden />
        <div>
          <h2 className="text-sm font-bold leading-tight">{title}</h2>
          <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

type PaletteKind = GateKind | 'erase';

const PALETTE: { kind: PaletteKind; label: string; hint: string }[] = [
  { kind: 'H', label: 'H', hint: 'Hadamard - equal superposition' },
  { kind: 'X', label: 'X', hint: 'Pauli-X - quantum NOT flip' },
  { kind: 'Z', label: 'Z', hint: 'Pauli-Z - phase flip on |1>' },
  { kind: 'CNOT', label: 'CNOT', hint: 'click control, then target' },
  { kind: 'M', label: 'M', hint: 'measurement marker' },
  { kind: 'erase', label: 'erase', hint: 'click a gate to remove it' },
];

function GateBadge({ kind }: { kind: GateKind }) {
  if (kind === 'H')
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-cyan-600 bg-white text-xs font-bold text-cyan-700 dark:border-cyan-400 dark:bg-zinc-900 dark:text-cyan-300">
        H
      </span>
    );
  if (kind === 'X' || kind === 'Z')
    return (
      <span
        className={
          'flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white ' +
          (kind === 'X' ? 'bg-cyan-700 dark:bg-cyan-500' : 'bg-teal-700 dark:bg-teal-500')
        }
      >
        {kind}
      </span>
    );
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-zinc-500 bg-zinc-100 text-[10px] font-bold text-zinc-600 dark:border-zinc-400 dark:bg-zinc-800 dark:text-zinc-300">
      M
    </span>
  );
}

function TargetSymbol() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" className="shrink-0" aria-label="CNOT target">
      <circle cx="13" cy="13" r="9" fill="none" strokeWidth="2" className="stroke-cyan-600 dark:stroke-cyan-400" />
      <line x1="13" y1="6" x2="13" y2="20" strokeWidth="2" className="stroke-cyan-600 dark:stroke-cyan-400" />
      <line x1="6" y1="13" x2="20" y2="13" strokeWidth="2" className="stroke-cyan-600 dark:stroke-cyan-400" />
    </svg>
  );
}

function PhaseDial({ deg }: { deg: number }) {
  const rad = (deg * Math.PI) / 180;
  const x = 9 + 6.5 * Math.cos(rad);
  const y = 9 - 6.5 * Math.sin(rad);
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0" aria-label={'phase ' + Math.round(deg) + ' degrees'}>
      <circle cx="9" cy="9" r="8" fill="none" strokeWidth="1" className="stroke-zinc-300 dark:stroke-zinc-600" />
      <line x1="9" y1="9" x2={x} y2={y} strokeWidth="2" strokeLinecap="round" className="stroke-cyan-600 dark:stroke-cyan-400" />
    </svg>
  );
}

export default function QuantumCircuitLab() {
  const [nWires, setNWires] = useState(2);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [palette, setPalette] = useState<PaletteKind>('H');
  const [pendingCnot, setPendingCnot] = useState<{ col: number; wire: number } | null>(null);
  const [histogram, setHistogram] = useState<{ label: string; counts: number }[] | null>(null);

  const amplitudes = useMemo(() => runCircuit(nWires, placements), [nWires, placements]);
  const entangled = isEntangled(amplitudes);
  const purity = qubit0Purity(amplitudes);

  const occupies = (p: Placement, col: number, wire: number): boolean =>
    p.col === col && (p.wire === wire || (p.kind === 'CNOT' && p.targetWire === wire));

  const removeAt = (id: number): void => {
    setPlacements((ps) => ps.filter((p) => p.id !== id));
    setHistogram(null);
  };

  const addPlacement = (p: Omit<Placement, 'id'>): void => {
    setPlacements((ps) => [...ps, { ...p, id: Math.max(0, ...ps.map((q) => q.id)) + 1 }]);
    setHistogram(null);
  };

  const onCell = (col: number, wire: number): void => {
    const existing = placements.find((p) => occupies(p, col, wire));
    if (palette === 'erase' || existing) {
      if (existing) removeAt(existing.id);
      setPendingCnot(null);
      return;
    }
    if (palette === 'CNOT') {
      if (!pendingCnot) {
        setPendingCnot({ col, wire });
        return;
      }
      if (pendingCnot.col === col && pendingCnot.wire !== wire) {
        addPlacement({ col, kind: 'CNOT', wire: pendingCnot.wire, targetWire: wire });
      }
      setPendingCnot(null);
      return;
    }
    addPlacement({ col, kind: palette as GateKind, wire });
  };

  const loadPrebuilt = (key: string): void => {
    const pb = PREBUILTS.find((p) => p.key === key);
    if (!pb) return;
    setNWires(pb.nWires);
    setPlacements(pb.placements.map((p) => ({ ...p })));
    setPendingCnot(null);
    setHistogram(null);
  };

  const clearAll = (): void => {
    setPlacements([]);
    setPendingCnot(null);
    setHistogram(null);
  };

  const runShots = (): void => {
    setHistogram(sampleShots(amplitudes, 1000).map((r) => ({ label: r.label, counts: r.counts })));
  };

  const dim = amplitudes.length;
  const maxProb = Math.max(...amplitudes.map((a) => mag(a) * mag(a)), 0.0001);

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <header className="flex flex-wrap items-start gap-3">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">Quantum Computing Internals</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            A pocket state-vector simulator: place gates, watch amplitudes move, then shoot the wavefunction 1000 times.
          </p>
        </div>
        <div
          className={
            'ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ' +
            (entangled
              ? 'bg-cyan-100 text-cyan-800 ring-2 ring-cyan-400 dark:bg-cyan-500/20 dark:text-cyan-200'
              : 'bg-zinc-100 text-zinc-500 ring-1 ring-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700')
          }
        >
          {entangled ? <Link2 className="h-3.5 w-3.5" aria-hidden /> : <Link2Off className="h-3.5 w-3.5" aria-hidden />}
          {entangled ? 'Entangled · non-separable' : 'Separable'}
          <span className="font-normal opacity-70">ρ-purity {purity.toFixed(3)}</span>
        </div>
      </header>

      <SectionCard icon={Atom} title="Prebuilt circuits" sub="One click each - Bell entanglement, plain superposition, and a one-iteration Grover search.">
        <div className="flex flex-wrap items-center gap-2">
          {PREBUILTS.map((pb) => (
            <button
              key={pb.key}
              type="button"
              title={pb.description}
              onClick={() => loadPrebuilt(pb.key)}
              className="rounded-md border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 transition-colors hover:bg-cyan-100 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-200 dark:hover:bg-cyan-500/20"
            >
              {pb.name}
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Clear
          </button>
          <div className="ml-auto flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            wires
            {[2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setNWires(n);
                  clearAll();
                }}
                className={
                  'rounded px-2 py-0.5 font-bold transition-colors ' +
                  (nWires === n
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500'
                    : 'border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800')
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={CircuitBoard} title="Circuit playground" sub="Pick a gate below, then click cells on the wires. Click a placed gate to remove it.">
        <div className="mb-3 flex flex-wrap gap-2">
          {PALETTE.map((item) => (
            <button
              key={item.kind}
              type="button"
              title={item.hint}
              onClick={() => {
                setPalette(item.kind);
                setPendingCnot(null);
              }}
              className={
                'rounded-md px-3 py-1.5 text-xs font-bold capitalize transition-colors ' +
                (palette === item.kind
                  ? item.kind === 'erase'
                    ? 'bg-rose-600 text-white dark:bg-rose-500'
                    : 'bg-cyan-600 text-white dark:bg-cyan-500'
                  : 'border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800')
              }
            >
              {item.kind === 'erase' ? <Eraser className="inline h-3.5 w-3.5" aria-label="eraser" /> : item.label}
            </button>
          ))}
          {pendingCnot && (
            <span className="animate-pulse self-center text-[11px] font-semibold text-cyan-700 dark:text-cyan-300">
              CNOT control on q{pendingCnot.wire}, col {pendingCnot.col} - now pick the target wire
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
          <div className="min-w-[720px]">
            {Array.from({ length: nWires }, (_, wire) => (
              <div key={wire} className="flex items-center">
                <span className="w-8 shrink-0 text-xs font-bold text-zinc-500 dark:text-zinc-400">q{wire}</span>
                <div className="relative flex-1">
                  <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-zinc-300 dark:bg-zinc-600" />
                  <div className="relative grid gap-1 py-1.5" style={{ gridTemplateColumns: 'repeat(' + MAX_COLS + ', minmax(0, 1fr))' }}>
                    {Array.from({ length: MAX_COLS }, (_, col) => {
                      const gateHere = placements.find((p) => occupies(p, col, wire));
                      const isCnotTarget = gateHere?.kind === 'CNOT' && gateHere.targetWire === wire;
                      const isPending =
                        pendingCnot !== null && pendingCnot.col === col && pendingCnot.wire === wire;
                      return (
                        <button
                          key={col}
                          type="button"
                          onClick={() => onCell(col, wire)}
                          aria-label={'column ' + col + ' wire ' + wire}
                          className={
                            'flex h-9 items-center justify-center rounded-md transition-colors ' +
                            (gateHere || isPending
                              ? ''
                              : 'hover:bg-cyan-100/70 dark:hover:bg-cyan-500/10')
                          }
                        >
                          {!gateHere && !isPending && <span className="text-[10px] text-zinc-300 dark:text-zinc-600">{col}</span>}
                          {isPending && (
                            <span className="h-3.5 w-3.5 animate-ping rounded-full bg-cyan-600 dark:bg-cyan-400" />
                          )}
                          {gateHere && isCnotTarget && <TargetSymbol />}
                          {gateHere && gateHere.kind === 'CNOT' && !isCnotTarget && (
                            <span className="h-3.5 w-3.5 rounded-full bg-cyan-600 dark:bg-cyan-400" />
                          )}
                          {gateHere && gateHere.kind !== 'CNOT' && <GateBadge kind={gateHere.kind} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard icon={Atom} title="State vector · live amplitudes" sub="Bar = probability |α|², dial = phase of α.">
          <ul className="space-y-2">
            {Array.from({ length: dim }, (_, i) => {
              const amp = amplitudes[i];
              const prob = mag(amp) * mag(amp);
              return (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <code className="w-12 shrink-0 font-bold">|{bitstring(i, nWires)}⟩</code>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className={'h-full rounded-full transition-all duration-300 ' + (prob > 1e-9 ? 'bg-cyan-500 dark:bg-cyan-400' : '')}
                      style={{ width: (prob / maxProb) * 100 + '%' }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                    {(prob * 100).toFixed(1)}%
                  </span>
                  <PhaseDial deg={phaseDeg(amp)} />
                  <span className="w-24 shrink-0 text-right tabular-nums text-zinc-400 dark:text-zinc-500">
                    {amp.re.toFixed(2)} {amp.im >= 0 ? '+' : '-'} {Math.abs(amp.im).toFixed(2)}i
                  </span>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard icon={BarChart3} title="Measurement · probabilistic collapse" sub="Run the circuit 1000 times and tally what the classical world sees.">
          <button
            type="button"
            onClick={runShots}
            className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cyan-500 disabled:opacity-40 dark:bg-cyan-500 dark:hover:bg-cyan-400"
          >
            <Dices className="h-3.5 w-3.5" aria-hidden />
            Measure ×1000 shots
          </button>
          {histogram === null ? (
            <p className="text-xs italic text-zinc-500 dark:text-zinc-400">
              No shots yet - outcomes here are random samples of the probabilities on the left.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {(() => {
                const maxCount = Math.max(1, ...histogram.map((h) => h.counts));
                return histogram.map((row) => (
                <li key={row.label} className="flex items-center gap-2 text-xs">
                  <code className="w-12 shrink-0 font-bold">|{row.label}⟩</code>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-teal-600 dark:bg-teal-400"
                      style={{ width: (row.counts / maxCount) * 100 + '%' }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                    {row.counts} · {((row.counts / 1000) * 100).toFixed(1)}%
                  </span>
                </li>
                ));
              })()}
            </ul>
          )}
          <p className="mt-3 border-t border-zinc-200 pt-2 text-[11px] italic text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            <Unlink className="mr-1 inline h-3 w-3 align-[-1px]" aria-hidden />
            Single runs are random; only the distribution converges to |α|² - that is the Born rule at work.
          </p>
        </SectionCard>
      </div>
    </main>
  );
}
