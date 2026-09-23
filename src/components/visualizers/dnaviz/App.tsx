'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Dna,
  FlaskConical,
  Pause,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import {
  BEAD_STYLES,
  PIPELINE_STEPS,
  PRIMER_5,
  PRIMER_7,
  STORAGE_MEDIA,
  applyMutation,
  decodePayload,
  encodeMessage,
  mutateOnce,
  naiveDecode,
  type Mutation,
  type Nucleotide,
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
        <Icon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
        <div>
          <h2 className="text-sm font-bold leading-tight">{title}</h2>
          <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

type TabKey = 'encode' | 'density' | 'decode' | 'pipeline';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'encode', label: 'Encode' },
  { key: 'density', label: 'Density' },
  { key: 'decode', label: 'Decode' },
  { key: 'pipeline', label: 'Pipeline' },
];

function PrimerBadge({ label, seq }: { label: string; seq: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 overflow-hidden rounded border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
      <span className="shrink-0 rounded bg-emerald-600 px-1 text-[9px] uppercase text-white dark:bg-emerald-500">{label}</span>
      <span className="truncate">{seq}</span>
    </span>
  );
}

function BeadStrip({ bases, mark }: { bases: Nucleotide[]; mark?: Set<number> }) {
  return (
    <div className="flex flex-wrap gap-0.5">
      {bases.map((b, i) => (
        <span
          key={i}
          title={(mark?.has(i) ? 'mutated - repaired by parity: ' : '') + b + ' = ' + i}
          className={
            'flex h-5 w-5 items-center justify-center rounded-[4px] text-[10px] font-bold ' +
            BEAD_STYLES[b] +
            (mark?.has(i) ? ' ring-2 ring-offset-1 ring-rose-400 ring-offset-white dark:ring-offset-zinc-900' : '')
          }
        >
          {b}
        </span>
      ))}
    </div>
  );
}

export default function DnaStorageLab() {
  const [tab, setTab] = useState<TabKey>('encode');
  const [message, setMessage] = useState('Hello DNA!');
  const [mutation, setMutation] = useState<Mutation | null>(null);

  const encoded = useMemo(() => encodeMessage(message.slice(0, 24)), [message]);
  const payload = useMemo(
    () => (mutation ? applyMutation(encoded.payload, mutation) : encoded.payload),
    [encoded, mutation],
  );
  const decoded = useMemo(() => decodePayload(payload), [payload]);
  const naive = useMemo(() => naiveDecode(payload), [payload]);

  const [playing, setPlaying] = useState(true);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setStage((s) => Math.min(s + 1, PIPELINE_STEPS.length - 1));
    }, 1500);
    return () => window.clearInterval(id);
  }, [playing]);
  useEffect(() => {
    if (stage >= PIPELINE_STEPS.length - 1) setPlaying(false);
  }, [stage]);

  const injectMutation = (): void => {
    setMutation(mutateOnce(encoded.payload));
  };

  const maxGrams = Math.max(...STORAGE_MEDIA.map((m) => m.gramsPerExabyte));

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <header className="flex flex-wrap items-start gap-3">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">DNA Storage and Molecular Computing</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Type a message, watch it become A/C/G/T with indexing primers, break it on purpose, then let Hamming parities heal it.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800 ring-2 ring-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-200">
          <Dna className="h-3.5 w-3.5" aria-hidden />
          {encoded.payload.length} nt · {encoded.oligoCount} oligo{encoded.oligoCount > 1 ? 's' : ''}
        </div>
      </header>

      <nav aria-label="Sections" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={
              'rounded-md px-3 py-1.5 text-xs font-bold transition-colors ' +
              (tab === t.key
                ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                : 'border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800')
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'encode' && (
        <SectionCard icon={Dna} title="Quaternary encoder" sub="Each character becomes 8 bits; bit pairs map to nucleotides (A=00, C=01, G=10, T=11) wrapped in PCR primers.">
          <label htmlFor="dna-message" className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            Message to store (max 24 chars)
          </label>
          <input
            id="dna-message"
            value={message}
            maxLength={24}
            onChange={(e) => {
              setMessage(e.target.value);
              setMutation(null);
            }}
            className="mb-3 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-emerald-500/30"
            placeholder="Type something"
          />
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <PrimerBadge label="P5" seq={PRIMER_5} />
            <span className="text-[10px] font-bold uppercase text-zinc-400">index</span>
            <PrimerBadge label="P7" seq={PRIMER_7} />
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
            <BeadStrip bases={payload.slice(0, 120)} mark={mutation ? new Set([mutation.index]) : undefined} />
            {payload.length > 120 && (
              <p className="mt-2 text-[11px] italic text-zinc-500 dark:text-zinc-400">+{payload.length - 120} more nucleotides…</p>
            )}
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">Bits</dt>
              <dd className="font-bold tabular-nums">{encoded.codewords.length * 8}</dd>
            </div>
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">Nucleotides</dt>
              <dd className="font-bold tabular-nums">{encoded.payload.length}</dd>
            </div>
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">Parity blocks</dt>
              <dd className="font-bold tabular-nums">{encoded.codewords.length}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[11px] italic text-zinc-500 dark:text-zinc-400">
            Raw density: one nucleotide carries 2 bits, so {encoded.payload.length} nt hold {encoded.codewords.length * 8} payload-and-parity bits.
          </p>
        </SectionCard>
      )}

      {tab === 'density' && (
        <SectionCard icon={Scale} title="Density comparison" sub="Grams of medium required to store one exabyte - log scale, approximate figures.">
          <ul className="space-y-3">
            {STORAGE_MEDIA.map((m) => {
              const frac = (Math.log10(m.gramsPerExabyte) / Math.log10(maxGrams)) * 100;
              return (
                <li key={m.key}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-bold">{m.name}</span>
                    <code className="tabular-nums text-zinc-500 dark:text-zinc-400">
                      {m.gramsPerExabyte.toLocaleString('en-US')} g / EB
                    </code>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className={
                        'h-full rounded-full transition-all duration-500 ' +
                        (m.key === 'dna' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-zinc-400 dark:bg-zinc-600')
                      }
                      style={{ width: Math.max(6, frac) + '%' }}
                    />
                  </div>
                  <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">{m.note}</p>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 border-t border-zinc-200 pt-2 text-[11px] italic text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            All human knowledge ever written (~50 EB) fits in a few milligrams of DNA - the catch is reading and writing speed.
          </p>
        </SectionCard>
      )}

      {tab === 'decode' && (
        <SectionCard icon={ShieldCheck} title="Error correction playground" sub="Inject a substitution; extended Hamming (8,4) syndromes locate the flipped bit and restore the message.">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={injectMutation}
              disabled={mutation !== null}
              className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-500 disabled:opacity-40"
            >
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
              Inject mutation
            </button>
            {mutation && (
              <button
                type="button"
                onClick={() => setMutation(null)}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Reset strand
              </button>
            )}
            {mutation && (
              <span className="self-center rounded bg-rose-100 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                pos {mutation.index}: {mutation.from}→{mutation.to}
              </span>
            )}
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
            <BeadStrip bases={payload.slice(0, 120)} mark={new Set(decoded.repairedPositions)} />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {decoded.verdicts.map((v, i) => (
              <span
                key={i}
                title={'block ' + i + ' syndrome ' + v.syndrome}
                className={
                  'rounded px-1.5 py-0.5 text-[10px] font-bold ' +
                  (v.status === 'clean'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : v.status === 'corrected'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300')
                }
              >
                {v.status === 'clean' ? 'OK' : v.status === 'corrected' ? 'FIX s=' + v.syndrome : 'LOST'}
              </span>
            ))}
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <p>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">SECDED output: </span>
              <code className="rounded bg-emerald-50 px-1.5 py-0.5 font-bold dark:bg-emerald-500/10">{decoded.text || '(empty)'}</code>
              {mutation === null && <span className="ml-1 italic text-zinc-500 dark:text-zinc-400">- channel clean, nothing to repair</span>}
              {mutation !== null && decoded.repairedPositions.length > 0 && <span className="ml-1 italic text-zinc-500 dark:text-zinc-400">- 1 flip healed by syndrome voting</span>}
            </p>
            <p>
              <span className="font-bold text-zinc-600 dark:text-zinc-300">Naive readout: </span>
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">{naive || '(empty)'}</code>
              <span className="ml-1 italic text-zinc-500 dark:text-zinc-400">- without parities the damage ships silently</span>
            </p>
          </div>
        </SectionCard>
      )}

      {tab === 'pipeline' && (
        <SectionCard icon={FlaskConical} title="Synthesis to sequencing" sub="The physical loop your encoded oligos take through the lab - animated end to end.">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              {playing ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStage(0);
                setPlaying(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Restart
            </button>
            <span className="self-center text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">
              step {stage + 1} / {PIPELINE_STEPS.length}
            </span>
          </div>
          <ol className="relative ml-3 space-y-3 border-l-2 border-zinc-200 pl-5 dark:border-zinc-700">
            {PIPELINE_STEPS.map((step, i) => {
              const done = i < stage;
              const now = i === stage;
              return (
                <li key={step.key} className="relative">
                  <span
                    className={
                      'absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 ' +
                      (now
                        ? 'animate-pulse border-emerald-500 bg-emerald-400 dark:border-emerald-400'
                        : done
                          ? 'border-emerald-500 bg-emerald-500 dark:border-emerald-400 dark:bg-emerald-400'
                          : 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800')
                    }
                    aria-hidden
                  />
                  <p className={'text-xs font-bold ' + (now || done ? '' : 'text-zinc-400 dark:text-zinc-500')}>
                    {i + 1}. {step.title}
                  </p>
                  {(now || done) && <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{step.detail}</p>}
                </li>
              );
            })}
          </ol>
        </SectionCard>
      )}
    </main>
  );
}
