'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Atom,
  Crosshair,
  Dices,
  Pause,
  Play,
  RotateCcw,
  Scissors,
  type LucideIcon,
} from 'lucide-react';
import {
  HYDROPHOBIC,
  MAX_CHAIN,
  VALID_AA,
  cutBoundary,
  findPamSites,
  foldChain,
  makeDemoStrand,
  rankOffTargets,
  translate,
  type LatticePoint,
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
        <Icon className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
        <div>
          <h2 className="text-sm font-bold leading-tight">{title}</h2>
          <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function CrisprDesignStudio() {
  const [seed, setSeed] = useState(20250101);
  const strand = useMemo(() => makeDemoStrand(seed), [seed]);
  const pamSites = useMemo(() => findPamSites(strand), [strand]);
  const [selIdx, setSelIdx] = useState(0);
  const site = pamSites.length > 0 ? pamSites[Math.min(selIdx, pamSites.length - 1)] : null;
  const offTargets = useMemo(
    () => (site ? rankOffTargets(site.protospacer, strand, site.protospacerStart) : []),
    [site, strand],
  );
  const [cutOpen, setCutOpen] = useState(false);

  useEffect(() => {
    setCutOpen(false);
  }, [selIdx, seed]);

  const [aaInput, setAaInput] = useState('MVLDAWLKRAVILACG');
  const aaSeq = useMemo(
    () => [...aaInput.toUpperCase()].filter((c) => VALID_AA.includes(c)).slice(0, MAX_CHAIN).join(''),
    [aaInput],
  );
  const hasInvalid = aaSeq.length === 0 && aaInput.trim().length > 0;
  const [foldSeed, setFoldSeed] = useState(11);
  const fold = useMemo(() => (aaSeq.length >= 5 ? foldChain(aaSeq, foldSeed) : null), [aaSeq, foldSeed]);
  const [frame, setFrame] = useState(0);
  const [folding, setFolding] = useState(true);

  useEffect(() => {
    setFrame(0);
    setFolding(true);
  }, [fold]);
  useEffect(() => {
    if (!folding || !fold) return;
    const id = window.setInterval(() => {
      setFrame((f) => Math.min(f + 1, fold.frames.length - 1));
    }, 110);
    return () => window.clearInterval(id);
  }, [folding, fold]);
  useEffect(() => {
    if (fold && frame >= fold.frames.length - 1) setFolding(false);
  }, [frame, fold]);

  const conf: LatticePoint[] | null = fold ? fold.frames[frame] : null;
  const proteinNote = useMemo(() => translate(strand.slice(0, 33)), [strand]);

  const cellClass = (i: number): string => {
    if (site && i >= site.pamIndex && i <= site.pamIndex + 2)
      return 'bg-teal-600 text-white dark:bg-teal-400 dark:text-teal-950 font-bold cursor-pointer';
    if (site && i >= site.protospacerStart && i < site.protospacerStart + 20)
      return 'bg-teal-100 text-teal-900 dark:bg-teal-500/25 dark:text-teal-100';
    return 'bg-white text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300';
  };

  const S = 26;
  const cx = 230;
  const cy = 210;

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <header className="flex flex-wrap items-start gap-3">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">Computational Biology and Bioinformatics</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Design a CRISPR guide against a PAM site, score off-targets by mismatch profile, then watch an HP-model chain fold.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSeed((s) => s + 977);
            setSelIdx(0);
          }}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 dark:border-teal-500/40 dark:bg-teal-500/10 dark:text-teal-200 dark:hover:bg-teal-500/20"
        >
          <Dices className="h-3.5 w-3.5" aria-hidden />
          New strand
        </button>
      </header>

      <SectionCard icon={Crosshair} title="Genome browser · pick your target" sub="Click any highlighted NGG PAM; its upstream 20 nt become the guide RNA.">
        {pamSites.length === 0 ? (
          <p className="text-xs italic text-zinc-500">No PAM sites here - roll a new strand.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
            <div className="flex min-w-max flex-wrap gap-0.5 font-mono text-[11px] leading-none">
              {[...strand].map((ch, i) => (
                <span
                  key={i}
                  onClick={() => {
                    const owner = pamSites.findIndex((p) => i >= p.pamIndex && i <= p.pamIndex + 2);
                    if (owner >= 0) setSelIdx(owner);
                  }}
                  role={pamSites.some((p) => i >= p.pamIndex && i <= p.pamIndex + 2) ? 'button' : undefined}
                  title={'pos ' + i}
                  className={'flex h-6 w-[18px] items-center justify-center rounded-[3px] transition-colors ' + cellClass(i)}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-teal-600 align-middle dark:bg-teal-400" />PAM (NGG)</span>
          <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-teal-200 align-middle dark:bg-teal-500/30" />protospacer candidates</span>
          <span>{pamSites.length} PAM sites found</span>
        </div>
      </SectionCard>

      {site && (
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard icon={Scissors} title="Cas9 cut simulation" sub="Blunt cut lands 3 bp into the guide from the PAM side.">
            <div className="mb-2 flex items-baseline justify-between text-xs">
              <code className="font-bold">{site.protospacer.slice(0, 17)}</code>
              <code className="font-bold">{site.protospacer.slice(17)}<span className="mx-1 rounded bg-teal-600 px-1 py-0.5 text-[10px] font-bold text-white dark:bg-teal-400 dark:text-teal-950">{site.pam}</span></code>
            </div>
            <div className="flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/60">
              <div
                className={
                  'rounded-l-md bg-teal-600 px-2 py-3 font-mono text-xs font-bold text-white transition-all duration-500 dark:bg-teal-400 dark:text-teal-950 ' +
                  (cutOpen ? '-rotate-3' : '')
                }
              >
                {site.protospacer.slice(0, 17)}
              </div>
              <div
                className={
                  'flex items-center justify-center overflow-hidden bg-transparent transition-all duration-500 ' +
                  (cutOpen ? 'w-10 opacity-100' : 'w-6 opacity-80')
                }
              >
                <Scissors className={'h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 ' + (cutOpen ? 'animate-bounce' : '')} aria-label="cut position" />
              </div>
              <div
                className={
                  'rounded-r-md bg-teal-500 px-2 py-3 font-mono text-xs font-bold text-white transition-all duration-500 dark:bg-teal-300 dark:text-teal-950 ' +
                  (cutOpen ? 'rotate-3' : '')
                }
              >
                {site.protospacer.slice(17)}
                <span className="ml-1 rounded bg-zinc-800 px-1 py-0.5 text-[10px] text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">{site.pam}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCutOpen((c) => !c)}
                className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400"
              >
                <Scissors className="h-3.5 w-3.5" aria-hidden />
                {cutOpen ? 'Reset DNA' : 'Cut DNA'}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                  <span>GC content</span>
                  <span className="tabular-nums">{site.gcPercent}%</span>
                </div>
                <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className={
                      'h-full rounded-full ' +
                      (site.gcPercent >= 40 && site.gcPercent <= 65 ? 'bg-teal-500 dark:bg-teal-400' : 'bg-amber-400')
                    }
                    style={{ width: site.gcPercent + '%' }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-2 text-[11px] italic text-zinc-500 dark:text-zinc-400">
              Ideal guides sit near 40-65% GC and avoid poly-T; this one translates the first frame as {proteinNote || '(no ORF)'}.
            </p>
          </SectionCard>

          <SectionCard icon={AlertTriangle} title="Off-target ranking" sub="Whole-strand scan: mismatches weighted, PAM-proximal seed hits penalised hardest.">
            {offTargets.length === 0 ? (
              <p className="text-xs italic text-zinc-500 dark:text-zinc-400">Clean strand - every other 20-mer differs in more than 6 positions.</p>
            ) : (
              <ul className="space-y-2.5">
                {offTargets.map((h) => (
                  <li key={h.position}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                      <code className="truncate">{h.candidate}</code>
                      <span className="shrink-0 font-bold tabular-nums text-zinc-500 dark:text-zinc-400">@{h.position}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div
                          className={
                            'h-full rounded-full transition-all duration-300 ' +
                            (h.score > 55 ? 'bg-rose-500 dark:bg-rose-400' : h.score > 25 ? 'bg-amber-400' : 'bg-zinc-400 dark:bg-zinc-600')
                          }
                          style={{ width: Math.max(4, h.score) + '%' }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right text-[11px] font-bold tabular-nums">{h.score}</span>
                      <span
                        title={h.seedMismatches + ' in PAM-proximal seed'}
                        className={
                          'w-14 shrink-0 rounded px-1 py-0.5 text-center text-[10px] font-bold ' +
                          (h.seedMismatches > 0
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300')
                        }
                      >
                        {h.mismatches} mm
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 border-t border-zinc-200 pt-2 text-[11px] italic text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              Real pipelines also weigh guide secondary structure and chromatin accessibility before ordering oligos.
            </p>
          </SectionCard>
        </div>
      )}

      <SectionCard icon={Atom} title="AlphaFold-simplified · HP lattice folding" sub="Hydrophobic residues collapse inward to bury from water - the core force AlphaFold learns to predict.">
        <div className="grid gap-4 md:grid-cols-[auto_1fr]">
          <div>
            <label htmlFor="aa-input" className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Amino acid chain (max {MAX_CHAIN}, A-Z codes)
            </label>
            <input
              id="aa-input"
              value={aaInput}
              onChange={(e) => setAaInput(e.target.value)}
              className={
                'w-64 rounded-md border bg-white px-3 py-2 font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-teal-200 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-teal-500/30 ' +
                (hasInvalid ? 'border-rose-400' : 'border-zinc-300 focus:border-teal-500 dark:border-zinc-700')
              }
              maxLength={32}
              spellCheck={false}
            />
            {hasInvalid && (
              <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">No valid residues yet - use letters like A V L M F W K D E.</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFoldSeed((s) => s + 13)}
                disabled={!fold}
                className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-40 dark:bg-teal-500 dark:hover:bg-teal-400"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Refold
              </button>
              <button
                type="button"
                onClick={() => setFolding((f) => !f)}
                disabled={!fold || frame >= (fold ? fold.frames.length - 1 : 0)}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {folding ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
                {folding ? 'Pause' : 'Replay'}
              </button>
              {fold && (
                <span className="self-center text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">
                  frame {frame + 1}/{fold.frames.length} · energy {fold.energy}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {[...aaSeq].map((aa, i) => (
                <span
                  key={i}
                  title={(HYDROPHOBIC.has(aa) ? 'hydrophobic' : 'polar') + ' residue ' + aa}
                  className={
                    'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ' +
                    (HYDROPHOBIC.has(aa)
                      ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900'
                      : 'border border-teal-400 bg-teal-50 text-teal-700 dark:border-teal-500 dark:bg-teal-500/10 dark:text-teal-300')
                  }
                >
                  {aa}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800/60">
            {conf && (
              <svg viewBox="0 0 460 420" className="min-w-[280px]" role="img" aria-label="protein lattice fold">
                <polyline
                  points={conf.map((p) => cx + p.x * S * 0.9 + ',' + (cy + p.y * S * 0.9)).join(' ')}
                  fill="none"
                  strokeWidth="2"
                  className="stroke-zinc-400 dark:stroke-zinc-500"
                />
                {conf.map((p, i) => {
                  const hydro = HYDROPHOBIC.has(aaSeq[i]);
                  return (
                    <g key={i}>
                      <circle
                        cx={cx + p.x * S * 0.9}
                        cy={cy + p.y * S * 0.9}
                        r="10"
                        strokeWidth="1.5"
                        className={
                          hydro
                            ? 'fill-zinc-800 stroke-zinc-900 dark:fill-zinc-200 dark:stroke-zinc-400'
                            : 'fill-teal-50 stroke-teal-500 dark:fill-zinc-800 dark:stroke-teal-400'
                        }
                      />
                      <text
                        x={cx + p.x * S * 0.9}
                        y={cy + p.y * S * 0.9 + 3.5}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        className={hydro ? 'fill-zinc-100 dark:fill-zinc-900' : 'fill-teal-700 dark:fill-teal-300'}
                      >
                        {aaSeq[i]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        </div>
        <p className="mt-3 border-t border-zinc-200 pt-2 text-[11px] italic text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Dark beads are hydrophobic cores; hollow teal ones stay solvent-exposed. Energy counts buried hydrophobic-hydrophobic contacts.
        </p>
      </SectionCard>
    </main>
  );
}
