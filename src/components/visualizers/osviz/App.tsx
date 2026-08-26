'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowDown,
  Cpu,
  MemoryStick,
  Pause,
  Play,
  RotateCcw,
  StepForward,
  type LucideIcon,
} from 'lucide-react';
import {
  ALGOS,
  DEFAULT_VA,
  PAGE_DIRECTORY,
  PAGE_TABLES,
  PROCESS_DEFS,
  computeSchedule,
  computeStats,
  makespanOf,
  toBin,
  toHex,
  walkPageTable,
  type AlgoKey,
} from './data';

const PID_SHADES: Record<string, string> = {
  p1: 'bg-amber-200 text-zinc-900',
  p2: 'bg-amber-300 text-zinc-900',
  p3: 'bg-amber-400 text-zinc-900',
  p4: 'bg-amber-500 text-zinc-950',
  p5: 'bg-amber-600 text-white',
  p6: 'bg-amber-700 text-white',
};

const IDLE_CLS = 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400';

const BTN_PRIMARY =
  'inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm';

const BTN_GHOST =
  'inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:text-sm';

function SectionCard({ title, icon: Icon, accent, children }: { title: string; icon: LucideIcon; accent: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${accent}`}>
          <Icon size={17} />
        </span>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SchedulerPanel() {
  const [algo, setAlgo] = useState<AlgoKey>('fcfs');
  const [quantum, setQuantum] = useState(2);
  const [clock, setClock] = useState(0);
  const [playing, setPlaying] = useState(false);

  const schedule = useMemo(() => computeSchedule(algo, quantum), [algo, quantum]);
  const stats = useMemo(() => computeStats(schedule), [schedule]);
  const total = useMemo(() => makespanOf(schedule), [schedule]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setClock((c) => Math.min(c + 1, total)), 420);
    return () => clearInterval(timer);
  }, [playing, total]);

  useEffect(() => {
    if (playing && clock >= total) setPlaying(false);
  }, [playing, clock, total]);

  const pickAlgo = (key: AlgoKey) => {
    setAlgo(key);
    setClock(0);
    setPlaying(false);
  };

  const pickQuantum = (q: number) => {
    setQuantum(q);
    setClock(0);
    setPlaying(false);
  };

  const runningPid = schedule.find((s) => clock >= s.start && clock < s.end)?.pid ?? null;
  const avgTurnaround = stats.reduce((s, p) => s + p.turnaround, 0) / stats.length;
  const avgWaiting = stats.reduce((s, p) => s + p.waiting, 0) / stats.length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
          {ALGOS.map((a) => (
            <button
              key={a.key}
              onClick={() => pickAlgo(a.key)}
              title={a.sub}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                algo === a.key
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        {algo === 'rr' && (
          <label className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            quantum q={quantum}
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={quantum}
              onChange={(e) => pickQuantum(Number(e.target.value))}
              className="w-28 accent-amber-500"
            />
          </label>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => { setClock(0); setPlaying(false); }} className={BTN_GHOST} title="Reset simulation">
            <RotateCcw size={15} />
          </button>
          <button onClick={() => setClock((c) => Math.min(c + 1, total))} disabled={clock >= total} className={BTN_GHOST} title="Step one time unit">
            <StepForward size={15} />
          </button>
          <button onClick={() => setPlaying((p) => !p)} disabled={clock >= total} className={BTN_PRIMARY}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
            {playing ? 'Pause' : clock >= total ? 'Done' : 'Run'}
          </button>
        </div>
      </div>

      {/* Gantt chart */}
      <div className="mt-5">
        <div className="relative h-12 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950">
          {schedule.map((seg) => {
            const visEnd = Math.min(seg.end, clock);
            if (visEnd <= seg.start) return null;
            const cls = seg.pid === 'idle' ? IDLE_CLS : PID_SHADES[seg.pid];
            return (
              <div
                key={`${seg.pid}-${seg.start}`}
                className={`absolute inset-y-0 flex items-center justify-center overflow-hidden text-[10px] font-bold sm:text-xs ${cls}`}
                style={{ left: `${(seg.start / total) * 100}%`, width: `${((visEnd - seg.start) / total) * 100}%` }}
              >
                {seg.pid === 'idle' ? '' : seg.pid.toUpperCase()}
              </div>
            );
          })}
          <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-rose-500" style={{ left: `${(clock / total) * 100}%` }} />
        </div>
        <div className="relative mt-1 h-4 text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500">
          {Array.from({ length: Math.floor(total / 5) + 1 }, (_, k) => k * 5)
            .filter((t) => t <= total)
            .map((t) => (
              <span key={t} className="absolute -translate-x-1/2" style={{ left: `${(t / total) * 100}%` }}>
                {t}
              </span>
            ))}
        </div>
      </div>

      {/* Per-process stats */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[430px] text-left text-xs sm:text-sm">
          <thead>
            <tr className="text-zinc-500 dark:text-zinc-400">
              {['Process', 'Arrival', 'Burst', 'Completion', 'Turnaround', 'Waiting'].map((h) => (
                <th key={h} className="border-b border-zinc-200 pb-2 pr-3 font-medium dark:border-zinc-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map((st) => (
              <tr key={st.id} className={`transition-colors ${runningPid === st.id ? 'bg-amber-50 dark:bg-amber-500/10' : ''}`}>
                <td className="py-1.5 pr-3 font-semibold">
                  <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-sm align-middle ${PID_SHADES[st.id].split(' ')[0]}`} />
                  {st.name}
                </td>
                <td className="py-1.5 pr-3 tabular-nums">{st.arrival}</td>
                <td className="py-1.5 pr-3 tabular-nums">{st.burst}</td>
                <td className="py-1.5 pr-3 tabular-nums">{clock >= st.completion ? st.completion : '-'}</td>
                <td className="py-1.5 pr-3 tabular-nums">{clock >= st.completion ? st.turnaround : '-'}</td>
                <td className="py-1.5 pr-3 tabular-nums">{clock >= st.completion ? st.waiting : '-'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="text-zinc-500 dark:text-zinc-400">
              <td className="pt-2 pr-3 font-medium">Average</td>
              <td /> <td />
              <td />
              <td className="pt-2 pr-3 tabular-nums font-medium">{avgTurnaround.toFixed(1)}</td>
              <td className="pt-2 pr-3 tabular-nums font-medium">{avgWaiting.toFixed(1)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function StageChip({ tone, label, value }: { tone: 'neutral' | 'good' | 'bad'; label: string; value: string }) {
  const tones = {
    neutral: 'border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
    good: 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
    bad: 'border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
  } as const;
  return (
    <div className={`mx-auto w-full max-w-md rounded-lg border px-3 py-2 text-center ${tones[tone]}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</div>
      <div className="font-mono text-sm font-semibold">{value}</div>
    </div>
  );
}

const FlowArrow = () => <ArrowDown size={14} className="mx-auto my-1 text-zinc-400 dark:text-zinc-500" />;

function PageWalkPanel() {
  const [input, setInput] = useState(toHex(DEFAULT_VA));
  const [va, setVa] = useState(DEFAULT_VA);
  const [err, setErr] = useState<string | null>(null);

  const walk = useMemo(() => walkPageTable(va), [va]);
  const bin = toBin(va, 32);
  const offset = va & 0xfff;

  const submit = () => {
    const raw = input.trim().toLowerCase();
    const hexPart = raw.startsWith('0x') ? raw.slice(2) : raw;
    if (hexPart.length === 0 || hexPart.length > 8 || !/^[0-9a-f]+$/.test(hexPart)) {
      setErr('Enter a hexadecimal address, e.g. 0x0083204C');
      return;
    }
    const value = parseInt(hexPart, 16);
    setErr(null);
    setVa(value);
    setInput(toHex(value));
  };

  const bitGroups = [
    { title: 'directory [31:22]', bits: bin.slice(0, 10), dec: `idx ${walk.dirIndex}` },
    { title: 'table [21:12]', bits: bin.slice(10, 20), dec: `idx ${walk.tableIndex}` },
    { title: 'offset [11:0]', bits: bin.slice(20), dec: toHex(offset, 3) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          spellCheck={false}
          aria-label="Virtual address in hexadecimal"
          className="w-44 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-mono text-sm outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-amber-400"
        />
        <button onClick={submit} className={BTN_PRIMARY}>
          Translate
        </button>
        {err && <span className="text-xs text-rose-500">{err}</span>}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {bitGroups.map((g) => (
          <div key={g.title} className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-center dark:border-zinc-700 dark:bg-zinc-800">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{g.title}</div>
            <div className="mt-1 break-all font-mono text-[11px] font-semibold tracking-wider sm:text-xs">{g.bits}</div>
            <div className="mt-1 font-mono text-[10px] text-amber-600 dark:text-amber-400">{g.dec}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-0">
        <FlowArrow />
        <StageChip
          tone={walk.tableFrame === null ? 'bad' : 'neutral'}
          label={`PGD lookup - directory index ${walk.dirIndex}`}
          value={
            walk.tableFrame === null
              ? 'entry not present'
              : `points to page table in frame ${toHex(walk.tableFrame, 2)}`
          }
        />
        <FlowArrow />
        <StageChip
          tone={!walk.entry || !walk.entry.present ? 'bad' : 'neutral'}
          label={`PTE lookup - table index ${walk.tableIndex}`}
          value={
            walk.frame !== null
              ? `frame ${toHex(walk.frame, 2)} - page starts at ${toHex((walk.frame << 12) >>> 0, 6)}`
              : 'PTE marked not-present'
          }
        />
        <FlowArrow />
        <StageChip
          tone={walk.ok ? 'good' : 'bad'}
          label={walk.ok ? 'Translation complete' : 'Translation failed'}
          value={
            walk.ok
              ? `physical address ${toHex(walk.physical ?? 0)}  (${toHex(((walk.frame ?? 0) << 12) >>> 0, 6)} | offset ${toHex(offset, 3)})`
              : walk.reason
          }
        />
      </div>

      <p className="mt-3 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
        Try 0x00401000, 0xFFC00000 or 0x00832FFF - some directories and PTEs are deliberately unmapped.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <header className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-zinc-950">
            <Cpu size={20} />
          </span>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">OS Internals Playground</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              Watch {PROCESS_DEFS.length} processes fight for the CPU under FCFS, SJF and Round Robin - then walk a virtual address down the page tables.
            </p>
          </div>
        </header>

        <SectionCard title="Process scheduler" icon={Cpu} accent="bg-amber-500">
          <SchedulerPanel />
        </SectionCard>

        <SectionCard title="Page-table walk" icon={MemoryStick} accent="bg-amber-600">
          <PageWalkPanel />
        </SectionCard>

        <footer className="pb-4 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          Same workload, different policy, very different waiting times - that is the whole game of scheduling.
        </footer>
      </div>
    </div>
  );
}
