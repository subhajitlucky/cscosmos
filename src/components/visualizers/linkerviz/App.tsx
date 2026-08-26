'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileCode,
  Layers,
  Link2,
  MemoryStick,
  Package,
  RotateCcw,
  Shuffle,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import {
  ASLR_BASES,
  BASE_NO_ASLR,
  OBJECT_FILES,
  PHASES,
  SECTION_COLORS,
  STUB_FILE,
  mapSegments,
  mergeSections,
  resolveSymbols,
  toHex,
  type LinkResult,
  type MemSegment,
  type MergedSection,
  type ObjectFile,
} from './data';

type Tone = 'info' | 'ok' | 'err';

interface LogEntry {
  id: string;
  tone: Tone;
  cmd: string;
  detail: string;
}

interface Banner {
  tone: 'good' | 'bad';
  lines: string[];
}

const PHASE_ICONS: Record<string, LucideIcon> = {
  'Object files': FileCode,
  'Symbol resolution': Link2,
  'Section merge': Layers,
  'Load & run': MemoryStick,
};

const NEUTRAL_BLOCK = 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';

type SectionKey = keyof typeof SECTION_COLORS;

function filesForLink(stubIn: boolean): ObjectFile[] {
  return stubIn ? [...OBJECT_FILES, STUB_FILE] : OBJECT_FILES;
}

function segmentStrip(name: string): string {
  if (name.startsWith('.text')) return SECTION_COLORS['.text'];
  if (name.startsWith('.data')) return SECTION_COLORS['.data'];
  return NEUTRAL_BLOCK;
}

function fmtKiB(bytes: number): string {
  return Math.round(bytes / 1024) + ' KiB';
}

function buildLog(
  step: number,
  files: ObjectFile[],
  result: LinkResult,
  merged: MergedSection[],
  segs: MemSegment[],
  base: number,
  stubIn: boolean
): LogEntry[] {
  if (step === 0) {
    const entries: LogEntry[] = files.map((f, i) => ({
      id: 'obj-' + i,
      tone: 'info',
      cmd: 'gcc -c ' + f.name,
      detail:
        'defines ' +
        (f.defines.map((d) => d.name).join(', ') || 'nothing') +
        ' - needs ' +
        (f.refs.join(', ') || 'nothing') +
        ' - .text ' + f.sections.text + ' B / .data ' + f.sections.data + ' B / .bss ' + f.sections.bss + ' B',
    }));
    if (!stubIn) {
      entries.push({
        id: 'hint',
        tone: 'err',
        cmd: 'missing provider',
        detail:
          'log_message is referenced by every object but defined nowhere - pull in librt.a(log.o) above or expect an undefined reference.',
      });
    }
    return entries;
  }
  if (step === 1) {
    const entries: LogEntry[] = [
      {
        id: 'ld',
        tone: result.missing.length > 0 ? 'err' : 'ok',
        cmd: 'ld -o a.out main.o util.o mathx.o' + (stubIn ? ' librt.a' : ''),
        detail:
          result.missing.length > 0
            ? result.missing.length + ' unresolved symbol' + (result.missing.length > 1 ? 's' : '') + ' - link failed.'
            : 'All references satisfied in ' + result.resolved.length + ' lookups - link succeeded.',
      },
    ];
    for (const r of result.resolved) {
      entries.push({
        id: 'res-' + r.name,
        tone: 'ok',
        cmd: r.name + ' -> ' + r.defIn,
        detail:
          'referenced from ' + r.refsFrom.join(', ') + (r.lib ? ' - satisfied implicitly from the shared library.' : '.'),
      });
    }
    for (const m of result.missing) {
      entries.push({
        id: 'miss-' + m.name,
        tone: 'err',
        cmd: "undefined reference to '" + m.name + "'",
        detail: 'referenced from ' + m.refsFrom.join(', ') + ' - no definition in any input object.',
      });
    }
    return entries;
  }
  if (step === 2) {
    return merged
      .filter((s) => s.size > 0)
      .map((s, i) => ({
        id: 'merge-' + i,
        tone: 'ok' as Tone,
        cmd: 'merge ' + s.name + ' (' + s.size + ' B)',
        detail:
          s.origin.map((o) => o.file + ' (' + o.size + ' B)').join(' + ') +
          (s.name === '.bss' ? ' - occupies no file bytes, zero-filled at load.' : ''),
      }));
  }
  const entries: LogEntry[] = [
    {
      id: 'base',
      tone: 'info',
      cmd: 'image base ' + toHex(base),
      detail:
        base === BASE_NO_ASLR
          ? 'Fixed base - every run loads at the identical address.'
          : 'Randomized base picked by the kernel-style loader for this run.',
    },
  ];
  for (const s of segs) {
    entries.push({
      id: 'mmap-' + s.name,
      tone: 'ok',
      cmd: 'mmap ' + toHex(s.vaddr) + '-' + toHex(s.vaddr + s.size) + ' ' + s.perm,
      detail: s.name + ' (' + fmtKiB(s.size) + ') - ' + s.src,
    });
  }
  entries.push({
    id: 'run',
    tone: 'ok',
    cmd: 'execve("./a.out")',
    detail: 'Entry _start -> main at ' + toHex(base) + ' - the process is live.',
  });
  return entries;
}

interface ObjectCardProps {
  file: ObjectFile;
  pendingStub?: boolean;
}

function ObjectCard({ file, pendingStub }: ObjectCardProps) {
  const sectionChips = (
    [
      { name: '.text' as SectionKey, size: file.sections.text },
      { name: '.data' as SectionKey, size: file.sections.data },
      { name: '.bss' as SectionKey, size: file.sections.bss },
    ] satisfies { name: SectionKey; size: number }[]
  ).filter((s) => s.size > 0);
  let cls = 'rounded-xl border p-3.5 transition-colors ';
  if (pendingStub) {
    cls += 'border-dashed border-teal-400/60 bg-teal-50/40 dark:border-teal-500/40 dark:bg-teal-500/5';
  } else {
    cls += 'border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900';
  }
  return (
    <div className={cls}>
      <div className="flex items-center gap-2">
        <FileCode className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
        <span className="font-mono text-sm font-bold">{file.name}</span>
        <span className="ml-auto text-right text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          {pendingStub ? 'optional archive' : file.desc}
        </span>
      </div>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        defines
      </p>
      <div className="mt-1 flex flex-wrap gap-1">
        {file.defines.map((d) => (
          <span
            key={d.name}
            className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
          >
            {d.name}
            <span className="opacity-60">{d.kind === 'func' ? '()' : '{}'}</span>
          </span>
        ))}
      </div>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        needs (undefined here)
      </p>
      <div className="mt-1 flex flex-wrap gap-1">
        {file.refs.map((r) => (
          <span
            key={r}
            className="rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-600 dark:text-zinc-300"
          >
            {r}&nbsp;?
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-zinc-100 pt-2.5 dark:border-zinc-800">
        {sectionChips.map((s) => (
          <span
            key={s.name}
            className={'rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ' + SECTION_COLORS[s.name]}
            title={s.name + ': ' + s.size + ' bytes'}
          >
            {s.name} {s.size}B
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LinkerWorkshop() {
  const [step, setStep] = useState(0);
  const [stubIn, setStubIn] = useState(false);
  const [aslr, setAslr] = useState(false);
  const [base, setBase] = useState(BASE_NO_ASLR);
  const [shown, setShown] = useState(0);

  const files = filesForLink(stubIn);
  const result = resolveSymbols(files);
  const merged = mergeSections(files);
  const segs = [...mapSegments(files, base)].sort((a, b) => b.vaddr - a.vaddr);
  const logs = buildLog(step, files, result, merged, segs, base, stubIn);

  // Re-map whenever ASLR flips: a fresh random base (or the fixed one).
  useEffect(() => {
    setBase(aslr ? ASLR_BASES[Math.floor(Math.random() * ASLR_BASES.length)] : BASE_NO_ASLR);
  }, [aslr]);

  // New step or new link inputs -> restart the log reveal.
  useEffect(() => {
    setShown(0);
  }, [step, stubIn]);

  useEffect(() => {
    if (shown >= logs.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), 320);
    return () => clearTimeout(t);
  }, [shown, logs.length]);

  const failed = step === 1 && result.missing.length > 0;
  const banner: Banner | null =
    step === 1
      ? failed
        ? {
            tone: 'bad',
            lines: [
              "/usr/bin/ld: undefined reference to '" + result.missing[0].name + "'",
              'collect2: error: ld returned 1 exit status',
            ],
          }
        : {
            tone: 'good',
            lines: [
              'Link succeeded - ' + result.resolved.length + ' references bound across ' + files.length + ' inputs.',
            ],
          }
      : null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Keyframe for the address-space re-map flash */}
      <style>{'@keyframes lk-pop{from{opacity:.35;transform:translateY(-4px)}to{opacity:1;transform:none}}'}</style>

      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
            Systems Programming · Toolchain
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Three .o Files, One Executable</h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Step the compiler driver through its real jobs: bind symbols, stitch sections, then drop the segments
            into a virtual address space - with or without ASLR.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-7">
        {/* Controls */}
        <section
          aria-label="Controls"
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            {PHASES.map((p, i) => {
              const Icon = PHASE_ICONS[p];
              const stateCls =
                i === step
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : i < step
                    ? 'bg-teal-50 text-teal-800 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-300 dark:hover:bg-teal-500/20'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800';
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setStep(i)}
                  aria-current={i === step ? 'step' : undefined}
                  className={
                    'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ' +
                    stateCls
                  }
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  <span className="tabular-nums opacity-70">{i + 1}</span>
                  {p}
                </button>
              );
            })}
            <span className="mx-1 hidden h-6 w-px bg-zinc-200 sm:block dark:bg-zinc-700" />
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:border-zinc-500"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(PHASES.length - 1, s + 1))}
              disabled={step === PHASES.length - 1}
              className="inline-flex items-center gap-1 rounded-lg border border-teal-600 bg-teal-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setStubIn((v) => !v)}
              aria-pressed={stubIn}
              className={
                'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ' +
                (stubIn
                  ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-500/10 dark:text-teal-300'
                  : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500')
              }
            >
              <Package className="h-4 w-4" aria-hidden />
              librt.a(log.o)
              <span className="font-normal opacity-70">{stubIn ? 'linked in' : 'on shelf'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(0);
                setStubIn(false);
                setAslr(false);
              }}
              className="ml-auto inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Stage */}
          <section aria-label="Pipeline stages" className="space-y-6">
            {step === 0 && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  {OBJECT_FILES.map((f) => (
                    <ObjectCard key={f.name} file={f} />
                  ))}
                </div>
                {!stubIn && (
                  <div className="rounded-xl border border-dashed border-teal-400/60 p-3.5 dark:border-teal-500/40">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      Still on the shelf - toggle it in the controls to pull it into the link
                    </p>
                    <ObjectCard file={STUB_FILE} pendingStub />
                  </div>
                )}
                {stubIn && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <ObjectCard file={STUB_FILE} />
                  </div>
                )}
              </>
            )}

            {step === 1 && (
              <>
                {banner && (
                  <div
                    role="status"
                    className={
                      'rounded-lg p-3 font-mono text-xs leading-relaxed ' +
                      (banner.tone === 'bad'
                        ? 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300'
                        : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300')
                    }
                  >
                    {banner.lines.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="flex items-center gap-2 text-sm font-bold">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                      Resolved bindings
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {result.resolved.map((r) => (
                        <li
                          key={r.name}
                          className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 font-mono text-xs dark:border-emerald-500/30 dark:bg-emerald-500/5"
                        >
                          <span className="font-bold">{r.name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400"> ← {r.defIn}</span>
                          {r.lib && (
                            <span className="ml-2 rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-teal-800 dark:bg-teal-500/20 dark:text-teal-300">
                              shared lib
                            </span>
                          )}
                          <p className="mt-0.5 font-sans text-[11px] text-zinc-500 dark:text-zinc-400">
                            called from {r.refsFrom.join(', ')}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="flex items-center gap-2 text-sm font-bold">
                      <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" aria-hidden />
                      Undefined references
                    </h3>
                    {result.missing.length === 0 ? (
                      <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-xs text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-300">
                        None - every reference found a definition.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {result.missing.map((m) => (
                          <li
                            key={m.name}
                            className="animate-pulse rounded-lg border border-rose-300 bg-rose-50/60 p-2.5 font-mono text-xs dark:border-rose-500/40 dark:bg-rose-500/5"
                          >
                            <span className="font-bold text-rose-700 dark:text-rose-300">
                              undefined reference to '{m.name}'
                            </span>
                            <p className="mt-0.5 font-sans text-[11px] text-zinc-500 dark:text-zinc-400">
                              referenced from {m.refsFrom.join(', ')} - pull in librt.a(log.o) and relink.
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <Layers className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden />
                  a.out - merged section layout
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Like-named sections from every input are concatenated end-to-end. Chunk width = bytes contributed.
                </p>
                <div className="mt-4 space-y-4">
                  {merged.map((s) =>
                    s.size > 0 ? (
                      <div key={s.name}>
                        <div className="flex items-baseline justify-between font-mono text-xs">
                          <span className="font-bold">{s.name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400">{s.size} B</span>
                        </div>
                        <div className="mt-1 flex h-7 w-full overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
                          {s.origin.map((o) => (
                            <div
                              key={o.file}
                              style={{ flexGrow: o.size, flexBasis: 0 }}
                              className={
                                'flex items-center justify-center overflow-hidden whitespace-nowrap px-1 text-[10px] font-semibold ' +
                                SECTION_COLORS[s.name]
                              }
                              title={o.file + ': ' + o.size + ' B'}
                            >
                              {o.file}
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                          {s.origin.map((o) => (
                            <span key={o.file} className="font-mono">
                              {o.file} · {o.size} B
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
                <div
                  key={base}
                  style={{ animation: 'lk-pop 0.4s ease-out' }}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="flex items-center gap-2 text-sm font-bold">
                    <Cpu className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden />
                    Virtual address space
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {segs.map((s) => (
                      <li key={s.name} className="flex gap-2.5">
                        <span className="w-36 shrink-0 pt-1 text-right font-mono text-[10px] leading-tight text-zinc-500 dark:text-zinc-400 sm:w-40">
                          {toHex(s.vaddr)}
                          <br />
                          {'–' + toHex(s.vaddr + s.size)}
                        </span>
                        <div className="flex min-w-0 flex-1 gap-2.5">
                          <span
                            className={'w-1.5 shrink-0 rounded ' + segmentStrip(s.name).split(' ')[0]}
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1 rounded-lg border border-zinc-200 p-2.5 dark:border-zinc-700">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold">{s.name}</span>
                              <span
                                className={
                                  'rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ' +
                                  (s.perm.includes('x')
                                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300'
                                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300')
                                }
                              >
                                {s.perm}
                              </span>
                              <span className="ml-auto font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                                {fmtKiB(s.size)}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">{s.src}</p>
                            {s.name === '.text' && (
                              <p className="mt-1 font-mono text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                                ▸ entry _start → main @ {toHex(base)}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="text-sm font-bold">Loader controls</h3>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={aslr}
                      onClick={() => setAslr((v) => !v)}
                      className={
                        'mt-3 flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ' +
                        (aslr
                          ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-500/10 dark:text-teal-300'
                          : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500')
                      }
                    >
                      <span className="flex items-center gap-2">
                        <Shuffle className="h-4 w-4" aria-hidden />
                        ASLR
                      </span>
                      <span
                        className={
                          'relative h-5 w-9 rounded-full transition-colors ' +
                          (aslr ? 'bg-teal-600' : 'bg-zinc-300 dark:bg-zinc-600')
                        }
                        aria-hidden
                      >
                        <span
                          className={
                            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ' +
                            (aslr ? 'left-[1.125rem]' : 'left-0.5')
                          }
                        />
                      </span>
                    </button>
                    <dl className="mt-3 space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between gap-2">
                        <dt className="text-zinc-500 dark:text-zinc-400">image base</dt>
                        <dd className="font-bold">{toHex(base)}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-zinc-500 dark:text-zinc-400">.text spans</dt>
                        <dd className="font-bold">
                          {toHex(base)}–{toHex(base + mapSegments(files, base)[3].size)}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-2 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                      Toggling ASLR re-runs the mapper with a fresh randomized base - watch every address shift while
                      the layout stays identical.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Toolchain log */}
          <section
            aria-label="Toolchain log"
            className="self-start rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Link2 className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden />
              Toolchain log
            </h2>
            <div aria-live="polite">
              {logs.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Press Next to begin the build.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {logs.slice(0, shown).map((e) => (
                    <li
                      key={e.id}
                      className={
                        'rounded-lg border p-2.5 ' +
                        (e.tone === 'err'
                          ? 'border-rose-200 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/5'
                          : e.tone === 'ok'
                            ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/5'
                            : 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50')
                      }
                    >
                      <p className="break-words font-mono text-[11px] font-bold">
                        <span
                          className={
                            'mr-1.5 inline-block h-2 w-2 rounded-full align-middle ' +
                            (e.tone === 'err'
                              ? 'bg-rose-500'
                              : e.tone === 'ok'
                                ? 'bg-emerald-500'
                                : 'bg-teal-500')
                          }
                          aria-hidden
                        />
                        {e.cmd}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-zinc-600 dark:text-zinc-300">{e.detail}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {shown < logs.length && (
              <p className="mt-2 text-[10px] italic text-zinc-400 dark:text-zinc-500">running…</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
