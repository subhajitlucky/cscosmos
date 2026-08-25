'use client';

import { useMemo, useState } from 'react';
import {
  EVIDENCE,
  EVIDENCE_BY_ID,
  GROUND_TRUTH,
  KIND_TAG,
  NARRATIVE,
  TRUE_ORDER,
  seededShuffle,
} from './data';

const TOTAL = EVIDENCE.length;
const TRUE_INDEX: Record<string, number> = TRUE_ORDER.reduce(
  (acc, id, i) => {
    acc[id] = i;
    return acc;
  },
  {} as Record<string, number>
);

interface ScoreResult {
  exact: number;
  pairsCorrect: number;
  pairsTotal: number;
  perfect: boolean;
}

export default function DfirBoard() {
  const [placed, setPlaced] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [spoiler, setSpoiler] = useState(false);

  const remaining = useMemo(
    () => seededShuffle(EVIDENCE, 20251104).filter((e) => !placed.includes(e.id)),
    [placed]
  );
  const allPlaced = placed.length === TOTAL;

  // Gentle contradiction hints: a referenced item should sit earlier.
  const hints = useMemo(() => {
    const map = new Map<string, string>();
    placed.forEach((id) => {
      const item = EVIDENCE_BY_ID[id];
      if (!item) return;
      for (const ref of item.references) {
        if (placed.indexOf(ref) > placed.indexOf(id)) map.set(id, item.referenceHint);
      }
    });
    return map;
  }, [placed]);

  const score: ScoreResult | null = useMemo(() => {
    if (!checked || !allPlaced) return null;
    const exact = placed.filter((id, i) => TRUE_ORDER[i] === id).length;
    let pairsCorrect = 0;
    let pairsTotal = 0;
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        pairsTotal++;
        if (TRUE_INDEX[placed[i]] < TRUE_INDEX[placed[j]]) pairsCorrect++;
      }
    }
    return { exact, pairsCorrect, pairsTotal, perfect: exact === TOTAL };
  }, [checked, allPlaced, placed]);

  const showReveal = (score?.perfect ?? false) || spoiler;

  function place(id: string) {
    setChecked(false);
    setSpoiler(false);
    setPlaced((prev) => [...prev, id]);
  }

  function remove(index: number) {
    setChecked(false);
    setSpoiler(false);
    setPlaced((prev) => prev.filter((_, i) => i !== index));
  }

  function reset() {
    setPlaced([]);
    setChecked(false);
    setSpoiler(false);
  }

  const kindChip =
    'inline-block rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300';

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            Digital Forensics &amp; Incident Response
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Incident Case Board</h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Six artifacts, no timestamps - exactly like real triage, where host clocks disagree. Order the
            evidence into a timeline using cross-references between records, then reconstruct what happened.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-7 lg:grid-cols-[minmax(320px,420px)_1fr]">
        {/* Evidence locker */}
        <section aria-label="Evidence locker" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Evidence locker</h2>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{remaining.length} unplaced</span>
          </div>
          <ul className="mt-3 space-y-2" aria-label="Unplaced evidence cards">
            {remaining.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => place(item.id)}
                  className="w-full rounded-lg border border-zinc-200 p-3 text-left transition-colors hover:border-amber-500 dark:border-zinc-700 dark:hover:border-amber-400"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span>
                      <span className={kindChip}>{KIND_TAG[item.kind]}</span>{' '}
                      <span className="text-sm font-semibold">{item.label}</span>
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">#{item.host}</span>
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-zinc-600 dark:text-zinc-400">{item.detail}</span>
                </button>
              </li>
            ))}
            {remaining.length === 0 && (
              <li className="rounded-lg bg-zinc-100 p-4 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                Locker empty - every artifact is on the board. Press check when ready.
              </li>
            )}
          </ul>
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-zinc-700 dark:bg-amber-500/10 dark:text-zinc-300">
            <span className="font-semibold text-amber-700 dark:text-amber-400">Analyst note: </span>
            timestamps are withheld on purpose. Correlate content - who references whom - not clocks. Click a
            card to append it to the case timeline; click it there to pull it back.
          </p>
        </section>

        {/* Timeline */}
        <section aria-label="Case timeline" className="flex flex-col gap-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Reconstructed timeline</h2>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {placed.length}/{TOTAL} ordered
                {hints.size > 0 && ' · ' + hints.size + ' cross-reference' + (hints.size > 1 ? 's' : '') + ' look tangled'}
              </span>
            </div>

            <ol className="mt-3 space-y-2">
              {Array.from({ length: TOTAL }, (_, slot) => {
                const id = placed[slot];
                const item = id ? EVIDENCE_BY_ID[id] : null;
                const hint = id ? hints.get(id) : undefined;
                const isExact = score ? TRUE_ORDER[slot] === id : false;
                return (
                  <li key={slot}>
                    {item && id ? (
                      <div
                        className={
                          'rounded-lg border p-3 transition-colors ' +
                          (score
                            ? isExact
                              ? 'border-emerald-400 bg-emerald-50/60 dark:border-emerald-500/50 dark:bg-emerald-500/10'
                              : 'border-rose-300 bg-rose-50/60 dark:border-rose-500/40 dark:bg-rose-500/10'
                            : hint
                              ? 'border-amber-400 bg-amber-50/50 dark:border-amber-400/50 dark:bg-amber-500/10'
                              : 'border-zinc-200 dark:border-zinc-700')
                        }
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span>
                            <span className="mr-2 font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500">{slot + 1}</span>
                            <span className={kindChip}>{KIND_TAG[item.kind]}</span>{' '}
                            <span className="text-sm font-semibold">{item.label}</span>
                            <span className="ml-2 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">#{item.host}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(slot)}
                            aria-label={'Remove ' + item.label + ' from timeline'}
                            className="rounded px-2 py-0.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-rose-600 dark:hover:bg-zinc-800 dark:hover:text-rose-400"
                          >
                            remove
                          </button>
                        </div>
                        <p className="mt-1 pl-6 text-xs leading-snug text-zinc-600 dark:text-zinc-400">{item.detail}</p>
                        {score && (
                          <p className={'mt-1 pl-6 text-xs font-medium ' + (isExact ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                            {isExact ? '✓ correct position' : '✗ out of order'}
                          </p>
                        )}
                        {!score && hint && (
                          <p className="mt-1 pl-6 text-xs italic leading-snug text-amber-700 dark:text-amber-300">
                            Hmm - {hint}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-zinc-300 p-3 text-xs text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                        Slot {slot + 1} - awaiting evidence
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setChecked(true)}
                disabled={!allPlaced}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
              >
                Check timeline
              </button>
              {!showReveal && checked && !score?.perfect && (
                <button
                  type="button"
                  onClick={() => setSpoiler(true)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-amber-500 hover:text-amber-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-amber-400 dark:hover:text-amber-400"
                >
                  Reveal ground truth (spoiler)
                </button>
              )}
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-rose-400 hover:text-rose-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-rose-500 dark:hover:text-rose-400"
              >
                Reset board
              </button>
            </div>

            {score && (
              <div className="mt-4 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold">
                    Exact positions {score.exact}/{TOTAL}
                    <span className="mx-2 text-zinc-400">·</span>
                    Relative order {score.pairsCorrect}/{score.pairsTotal}
                  </p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {Math.round(((score.exact / TOTAL) * 0.5 + (score.pairsCorrect / Math.max(score.pairsTotal, 1)) * 0.5) * 100)}
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">/100</span>
                  </p>
                </div>
                {!score.perfect && (
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: ((score.exact / TOTAL) * 0.5 + (score.pairsCorrect / Math.max(score.pairsTotal, 1)) * 0.5) * 100 + '%' }}
                    />
                  </div>
                )}
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {score.perfect
                    ? 'Perfect reconstruction - every artifact in its true position.'
                    : 'Close. Fix the flagged slots and re-check for full marks.'}
                </p>
              </div>
            )}
          </div>

          {/* Reveal */}
          {showReveal && score && (
            <div className="rounded-xl border border-amber-300 bg-white p-4 shadow-sm dark:border-amber-400/40 dark:bg-zinc-900">
              <h2 className="text-lg font-bold">The intrusion, reconstructed</h2>
              {spoiler && !score.perfect && (
                <p className="mt-1 text-xs italic text-amber-600 dark:text-amber-400">
                  Revealed early - the board stays editable if you want another pass without spoilers in memory.
                </p>
              )}
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Your narrative</h3>
                  <ol className="mt-2 space-y-1.5">
                    {(score.perfect ? placed : TRUE_ORDER).map((id, i) => {
                      const step = NARRATIVE.find((n) => n.id === id);
                      const item = EVIDENCE_BY_ID[id];
                      return (
                        <li key={id} className="text-sm leading-snug">
                          <span className="mr-1.5 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{i + 1}.</span>
                          <span className={kindChip}>{KIND_TAG[item.kind]}</span> {step?.text ?? item.label}
                        </li>
                      );
                    })}
                  </ol>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-500/10">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">Ground truth</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{GROUND_TRUTH}</p>
                  <p className="mt-2 text-xs italic text-zinc-500 dark:text-zinc-400">
                    Takeaway: DFIR ordering comes from reference chains - a task names its binary, a flow matches
                    its persistence - never from trusting any single clock.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
