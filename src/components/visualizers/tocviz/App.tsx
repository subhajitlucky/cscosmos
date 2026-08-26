'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Flag,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Shapes,
  Sigma,
  Star,
  StepForward,
  Table,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import {
  BOARD_H,
  BOARD_W,
  STATE_R,
  buildGrowthPaths,
  dfaIssues,
  formatBig,
  isAccepting,
  presetEndsAb,
  presetEvenAs,
  stepMachine,
  withAddedState,
  withAlphabetAdd,
  withAlphabetRemove,
  withMovedState,
  withNewStart,
  withRemovedState,
  withToggledFinal,
  withToggledTransition,
  type Machine,
  type StateNode,
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
        <Icon className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden />
        <div>
          <h2 className="text-sm font-bold leading-tight">{title}</h2>
          <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

interface EdgeView {
  key: string;
  from: StateNode;
  to: StateNode;
  syms: string[];
}

function buildEdges(m: Machine): EdgeView[] {
  const map = new Map<string, EdgeView>();
  for (const st of m.states) {
    const row = m.delta[st.id];
    if (!row) continue;
    for (const sym of Object.keys(row)) {
      for (const to of row[sym]) {
        const target = m.states.find((s) => s.id === to);
        if (!target) continue;
        const key = st.id + '>' + to;
        const existing = map.get(key);
        if (existing) {
          if (!existing.syms.includes(sym)) existing.syms.push(sym);
        } else {
          map.set(key, { key, from: st, to: target, syms: [sym] });
        }
      }
    }
  }
  return Array.from(map.values());
}

const CURVE_CLASS: Record<string, string> = {
  const: 'stroke-sky-300 dark:stroke-sky-700',
  log: 'stroke-sky-400 dark:stroke-sky-500',
  linear: 'stroke-sky-500 dark:stroke-sky-400',
  linlog: 'stroke-sky-600 dark:stroke-sky-300',
  quad: 'stroke-sky-800 dark:stroke-sky-200',
  exp: 'stroke-rose-500',
};

export default function AutomataLab() {
  /* ------------------------------ machine state ------------------------------ */
  const [machine, setMachine] = useState<Machine>(presetEvenAs);
  const [selected, setSelected] = useState<number | null>(0);
  const [letterInput, setLetterInput] = useState('');

  /* -------------------------------- run state -------------------------------- */
  const [input, setInput] = useState('abba');
  const [pos, setPos] = useState(-1);
  const [current, setCurrent] = useState<number[]>([presetEvenAs().start]);
  const [autoPlay, setAutoPlay] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  /* ------------------------------ growth corner ------------------------------ */
  const [growN, setGrowN] = useState(64);
  const [logScale, setLogScale] = useState(false);

  const issues = useMemo(() => dfaIssues(machine), [machine]);
  const edges = useMemo(() => buildEdges(machine), [machine]);
  const paths = useMemo(() => buildGrowthPaths(growN, 96, 470, 196, logScale), [growN, logScale]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ id: number; dx: number; dy: number } | null>(null);

  const resetRun = (m: Machine) => {
    setPos(-1);
    setCurrent([m.start]);
    setLog([]);
    setAutoPlay(false);
  };

  const applyEdit = (next: Machine) => {
    setMachine(next);
    resetRun(next);
  };

  const sanitized = [...input].filter((ch) => machine.alphabet.includes(ch)).join('');

  const changeInput = (v: string) => {
    const clean = [...v].filter((ch) => machine.alphabet.includes(ch)).slice(0, 24).join('');
    setInput(clean);
    setPos(-1);
    setCurrent([machine.start]);
    setLog([]);
    setAutoPlay(false);
  };

  const started = pos >= 0;
  const dead = started && current.length === 0;
  const finished = started && pos >= sanitized.length;
  const accepted = finished && isAccepting(machine, current);
  const status: 'idle' | 'running' | 'dead' | 'accepted' | 'rejected' = !started
    ? 'idle'
    : dead
      ? 'dead'
      : finished
        ? accepted
          ? 'accepted'
          : 'rejected'
        : 'running';

  const doStep = () => {
    if (finished || dead || autoPlay) return;
    const sym = sanitized[pos];
    if (sym === undefined) return;
    const next = stepMachine(machine, current.length === 0 ? [] : current, sym);
    setLog((prev) => ['q{' + (current.length === 0 ? '∅' : current.join(',')) + '} --' + sym + '--> q{' + next.join(',') + '}', ...prev].slice(0, 6));
    setCurrent(next);
    setPos(pos + 1);
  };

  useEffect(() => {
    if (!autoPlay) return;
    if (pos >= sanitized.length || current.length === 0) {
      setAutoPlay(false);
      return;
    }
    const t = setTimeout(() => {
      const sym = sanitized[pos];
      if (sym === undefined) {
        setAutoPlay(false);
        return;
      }
      const next = stepMachine(machine, current, sym);
      setLog((prev) => ['q{' + current.join(',') + '} --' + sym + '--> q{' + next.join(',') + '}', ...prev].slice(0, 6));
      setCurrent(next);
      setPos(pos + 1);
    }, 620);
    return () => clearTimeout(t);
  }, [autoPlay, pos, sanitized, current, machine]);

  /* ------------------------------ svg dragging ------------------------------- */
  const svgPoint = (e: React.PointerEvent): [number, number] => {
    const rect = svgRef.current ? svgRef.current.getBoundingClientRect() : null;
    if (!rect) return [0, 0];
    const x = ((e.clientX - rect.left) / rect.width) * BOARD_W;
    const y = ((e.clientY - rect.top) / rect.height) * BOARD_H;
    return [x, y];
  };

  const onStatePointerDown = (e: React.PointerEvent, st: StateNode) => {
    e.preventDefault();
    const [px, py] = svgPoint(e);
    dragRef.current = { id: st.id, dx: st.x - px, dy: st.y - py };
    setSelected(st.id);
  };

  const onSvgPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const [px, py] = svgPoint(e);
    const snap = (v: number) => Math.round(v / 20) * 20;
    const x = Math.min(BOARD_W - STATE_R - 6, Math.max(STATE_R + 6, snap(px + drag.dx)));
    const y = Math.min(BOARD_H - STATE_R - 6, Math.max(STATE_R + 6, snap(py + drag.dy)));
    setMachine((m) => withMovedState(m, drag.id, x, y));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  /* ------------------------------ alphabet edit ------------------------------ */
  const addLetter = () => {
    const ch = letterInput.trim().toLowerCase();
    if (!/^[a-z]$/.test(ch)) return;
    applyEdit(withAlphabetAdd(machine, ch));
    setLetterInput('');
  };

  /* ------------------------------ growth values ------------------------------ */
  const growthRows = useMemo(
    () =>
      Array.from(GROWTH_ROW_SOURCES.entries()).map(([key, fn]) => ({
        key,
        value: fn(growN),
      })),
    [growN]
  );
  const maxGrowthRaw = Math.max(...growthRows.map((r) => r.value));

  const verdictCls =
    status === 'accepted'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
      : status === 'rejected' || status === 'dead'
        ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300'
        : 'border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300';

  const verdictText =
    status === 'idle'
      ? 'Type an input over the alphabet, then step or autoplay.'
      : status === 'running'
        ? 'Reading symbol ' + (sanitized[pos] ?? '') + ' - ' + current.length + ' live state branch' + (current.length === 1 ? '' : 'es') + '.'
        : status === 'dead'
          ? 'REJECTED: every branch fell into the trap - no transition matched.'
          : accepted
            ? 'ACCEPTED: input exhausted with an accepting state alive.'
            : 'REJECTED: input exhausted outside any accepting state.';

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <style>{'@keyframes tokenpulse{0%,100%{opacity:.9}50%{opacity:.45}}' +
        '.tokenpulse{animation:tokenpulse 1.2s ease-in-out infinite}'}</style>

      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
            Theory · Theory of Computation · Automata &amp; Complexity
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Automata Workbench</h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Build a DFA or NFA right on the grid: drag states, wire transitions in the table, then feed it input and
            watch tokens travel state to state until the verdict lands. The complexity corner charts why acceptance
            procedures are judged by how they grow.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-5 py-7">
        {/* ---------------------------- workbench board ---------------------------- */}
        <SectionCard icon={Shapes} title="Machine editor" sub="drag circles · click to select · double ring marks accepting states">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyEdit(withAddedState(machine))}
              className="inline-flex items-center gap-1 rounded-lg border border-sky-600 bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add state
            </button>
            <button
              type="button"
              disabled={selected === null}
              onClick={() => {
                if (selected !== null) applyEdit(withToggledFinal(machine, selected));
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200"
            >
              <Star className="h-4 w-4" aria-hidden />
              Toggle accepting
            </button>
            <button
              type="button"
              disabled={selected === null}
              onClick={() => {
                if (selected !== null) applyEdit(withNewStart(machine, selected));
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200"
            >
              <Flag className="h-4 w-4" aria-hidden />
              Make start
            </button>
            <button
              type="button"
              disabled={selected === null}
              onClick={() => {
                if (selected !== null) applyEdit(withRemovedState(machine, selected));
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-500/50 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete state
            </button>
            <span className="ml-auto flex flex-wrap items-center gap-1.5">
              {machine.alphabet.map((ch) => (
                <span
                  key={ch}
                  className="inline-flex items-center gap-1 rounded-full border border-sky-400 bg-sky-50 px-2 py-0.5 font-mono text-xs font-bold text-sky-700 dark:border-sky-500/50 dark:bg-sky-500/10 dark:text-sky-300"
                >
                  {ch}
                  <button
                    type="button"
                    aria-label={'remove symbol ' + ch}
                    onClick={() => applyEdit(withAlphabetRemove(machine, ch))}
                    className="text-sky-400 hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              <span className="inline-flex items-center gap-1">
                <input
                  value={letterInput}
                  onChange={(e) => setLetterInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addLetter();
                  }}
                  maxLength={1}
                  aria-label="new alphabet symbol"
                  className="w-10 rounded border border-zinc-300 bg-white px-1 py-0.5 text-center font-mono text-xs dark:border-zinc-700 dark:bg-zinc-950"
                />
                <button
                  type="button"
                  onClick={addLetter}
                  aria-label="add symbol"
                  className="rounded border border-zinc-300 p-1 text-zinc-600 hover:border-sky-400 dark:border-zinc-700 dark:text-zinc-300"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                </button>
              </span>
            </span>
          </div>

          <svg
            ref={svgRef}
            viewBox={'0 0 ' + BOARD_W + ' ' + BOARD_H}
            role="img"
            aria-label="state diagram"
            className="mt-3 h-auto w-full cursor-default touch-none select-none rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60"
            onPointerMove={onSvgPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            <defs>
              <pattern id="grid40" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="rgba(113,113,122,0.18)" strokeWidth="1" />
              </pattern>
              <marker id="arrowhead" markerWidth="7" markerHeight="6" refX="6.5" refY="3" orient="auto">
                <polygon points="0 0, 7 3, 0 6" className="fill-zinc-400 dark:fill-zinc-500" />
              </marker>
            </defs>
            <rect x="0" y="0" width={BOARD_W} height={BOARD_H} fill="url(#grid40)" />

            {edges.map((edge) => {
              const label = edge.syms.join(',');
              if (edge.from.id === edge.to.id) {
                const lx = edge.from.x;
                const ly = edge.from.y - STATE_R;
                const d =
                  'M ' + (lx - 16) + ' ' + ly +
                  ' C ' + (lx - 30) + ' ' + (ly - 30) + ', ' + (lx + 30) + ' ' + (ly - 30) + ', ' + (lx + 16) + ' ' + ly;
                return (
                  <g key={edge.key}>
                    <path d={d} fill="none" strokeWidth={1.6} className="stroke-zinc-400 dark:stroke-zinc-500" markerEnd="url(#arrowhead)" />
                    <text x={lx} y={ly - 32} textAnchor="middle" className="fill-sky-700 font-mono text-[11px] font-bold dark:fill-sky-300">
                      {label}
                    </text>
                  </g>
                );
              }
              const dx = edge.to.x - edge.from.x;
              const dy = edge.to.y - edge.from.y;
              const len = Math.max(1, Math.hypot(dx, dy));
              const ux = dx / len;
              const uy = dy / len;
              const x1 = edge.from.x + ux * (STATE_R + 2);
              const y1 = edge.from.y + uy * (STATE_R + 2);
              const x2 = edge.to.x - ux * (STATE_R + 7);
              const y2 = edge.to.y - uy * (STATE_R + 7);
              const mx = (x1 + x2) / 2 - uy * 13;
              const my = (y1 + y2) / 2 + ux * 13;
              return (
                <g key={edge.key}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={1.6} className="stroke-zinc-400 dark:stroke-zinc-500" markerEnd="url(#arrowhead)" />
                  <rect x={mx - label.length * 3.6 - 3} y={my - 9} width={label.length * 7.2 + 6} height={15} rx={4} className="fill-zinc-50/90 dark:fill-zinc-900/90" />
                  <text x={mx} y={my + 2} textAnchor="middle" className="fill-sky-700 font-mono text-[11px] font-bold dark:fill-sky-300">
                    {label}
                  </text>
                </g>
              );
            })}

            <g>
              {(() => {
                const startSt = machine.states.find((s) => s.id === machine.start);
                if (!startSt) return null;
                const ax = startSt.x - STATE_R - 26;
                return (
                  <>
                    <line x1={ax} y1={startSt.y} x2={startSt.x - STATE_R - 4} y2={startSt.y} strokeWidth={2} className="stroke-sky-500 dark:stroke-sky-400" markerEnd="url(#arrowhead)" />
                    <text x={ax - 4} y={startSt.y + 4} textAnchor="end" className="fill-sky-700 font-mono text-[10px] font-bold dark:fill-sky-300">
                      start
                    </text>
                  </>
                );
              })()}
            </g>

            {machine.states.map((st) => {
              const isSelected = selected === st.id;
              return (
                <g
                  key={st.id}
                  onPointerDown={(e) => onStatePointerDown(e, st)}
                  className="cursor-grab"
                  aria-label={'state q' + st.id}
                >
                  {st.final && (
                    <circle cx={st.x} cy={st.y} r={STATE_R + 5} fill="none" strokeWidth={1.6} className="stroke-zinc-500 dark:stroke-zinc-400" />
                  )}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={STATE_R}
                    strokeWidth={isSelected ? 3 : 1.6}
                    className={
                      isSelected
                        ? 'fill-white stroke-sky-500 dark:fill-zinc-800 dark:stroke-sky-400'
                        : 'fill-white stroke-zinc-400 dark:fill-zinc-800 dark:stroke-zinc-500'
                    }
                  />
                  <text x={st.x} y={st.y + 4} textAnchor="middle" className="fill-zinc-700 font-mono text-[12px] font-bold dark:fill-zinc-100">
                    q{st.id}
                  </text>
                </g>
              );
            })}

            {current.map((id) => {
              const st = machine.states.find((s) => s.id === id);
              if (!st) return null;
              return (
                <g
                  key={'tok' + id}
                  style={{ transform: 'translate(' + st.x + 'px,' + st.y + 'px)', transition: 'transform .45s ease' }}
                >
                  <circle
                    r={STATE_R + 9}
                    fill="none"
                    strokeWidth={3}
                    strokeDasharray="7 5"
                    className="tokenpulse stroke-sky-500 dark:stroke-sky-400"
                  />
                </g>
              );
            })}
          </svg>
          <p className="mt-1.5 text-[11px] italic text-zinc-500 dark:text-zinc-400">
            dashed rings are the live token set - NFAs carry several at once; drag any state to re-layout.
          </p>
        </SectionCard>

        {/* ------------------------- transition table + run ------------------------ */}
        <SectionCard icon={Table} title="Transitions &amp; execution" sub="click a chip inside a cell to toggle that target on or off">
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[420px] border-collapse text-left text-xs">
              <thead>
                <tr className="bg-zinc-50 text-[10px] uppercase tracking-wider text-zinc-500 dark:bg-zinc-900/80 dark:text-zinc-400">
                  <th className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">state</th>
                  {machine.alphabet.map((ch) => (
                    <th key={ch} className="border-b border-zinc-200 px-3 py-2 font-mono dark:border-zinc-800">
                      {ch}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {machine.states.map((st) => (
                  <tr key={st.id} className={selected === st.id ? 'bg-sky-50/60 dark:bg-sky-500/5' : ''}>
                    <td className="border-b border-zinc-100 px-3 py-1.5 dark:border-zinc-800/70">
                      <button
                        type="button"
                        onClick={() => setSelected(st.id)}
                        className="font-mono font-bold text-zinc-700 hover:text-sky-600 dark:text-zinc-200 dark:hover:text-sky-400"
                      >
                        q{st.id}
                      </button>
                      {machine.start === st.id && <span className="ml-1 text-[9px] font-bold uppercase text-sky-600 dark:text-sky-400">start</span>}
                      {st.final && <span className="ml-1 text-[9px] font-bold uppercase text-zinc-400">accept</span>}
                    </td>
                    {machine.alphabet.map((ch) => {
                      const targets = machine.delta[st.id] ? machine.delta[st.id][ch] ?? [] : [];
                      return (
                        <td key={ch} className="border-b border-zinc-100 px-2 py-1.5 dark:border-zinc-800/70">
                          <span className="flex flex-wrap gap-1">
                            {machine.states.map((t) => {
                              const active = targets.includes(t.id);
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  title={'q' + st.id + ' --' + ch + '-- q' + t.id}
                                  onClick={() => setMachine(withToggledTransition(machine, st.id, ch, t.id))}
                                  className={
                                    'rounded px-1.5 py-0.5 font-mono text-[10px] font-bold transition-colors ' +
                                    (active
                                      ? 'bg-sky-500 text-white'
                                      : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-700')
                                  }
                                >
                                  q{t.id}
                                </button>
                              );
                            })}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-2 space-y-0.5 text-[11px] leading-snug">
            {issues.map((iss, i) => (
              <li key={i} className={iss.kind === 'nondet' ? 'font-semibold text-amber-700 dark:text-amber-300' : 'italic text-zinc-500 dark:text-zinc-400'}>
                {iss.kind === 'nondet' ? '◆ ' : '· '}
                {iss.text}
              </li>
            ))}
            {issues.length === 0 && <li className="italic text-zinc-500 dark:text-zinc-400">complete and deterministic - a proper DFA.</li>}
          </ul>

          <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="run-input" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                input
              </label>
              <input
                id="run-input"
                value={input}
                onChange={(e) => changeInput(e.target.value)}
                placeholder={'symbols: ' + machine.alphabet.join(' ')}
                className="w-44 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              <button
                type="button"
                onClick={() => setAutoPlay(true)}
                disabled={autoPlay || finished || dead}
                className="inline-flex items-center gap-1.5 rounded-lg border border-sky-600 bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Play className="h-4 w-4" aria-hidden />
                Auto
              </button>
              <button
                type="button"
                onClick={() => setAutoPlay(false)}
                disabled={!autoPlay}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200"
              >
                <Pause className="h-4 w-4" aria-hidden />
                Pause
              </button>
              <button
                type="button"
                onClick={doStep}
                disabled={finished || dead || autoPlay}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200"
              >
                <StepForward className="h-4 w-4" aria-hidden />
                Step
              </button>
              <button
                type="button"
                onClick={() => resetRun(machine)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Rewind
              </button>
              <span className="ml-auto flex gap-1.5">
                <button
                  type="button"
                  onClick={() => applyEdit(presetEvenAs())}
                  className="rounded-full border border-zinc-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:border-sky-400 dark:border-zinc-700 dark:text-zinc-300"
                >
                  preset: even a-count
                </button>
                <button
                  type="button"
                  onClick={() => applyEdit(presetEndsAb())}
                  className="rounded-full border border-zinc-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:border-sky-400 dark:border-zinc-700 dark:text-zinc-300"
                >
                  preset: ends in ab
                </button>
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1 font-mono text-sm">
              {[...sanitized].map((ch, i) => (
                <span
                  key={i}
                  className={
                    'flex h-7 w-7 items-center justify-center rounded border font-bold ' +
                    (i < pos
                      ? 'border-zinc-300 bg-zinc-200 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                      : i === pos
                        ? 'border-sky-500 bg-sky-500 text-white'
                        : 'border-dashed border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400')
                  }
                >
                  {ch}
                </span>
              ))}
              <span className="ml-3 text-[11px] font-sans font-semibold text-zinc-500 dark:text-zinc-400">live states:</span>
              {current.length === 0 ? (
                <span className="rounded bg-rose-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">trap ∅</span>
              ) : (
                current.map((id) => (
                  <span key={id} className="rounded bg-sky-500 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                    q{id}
                  </span>
                ))
              )}
            </div>

            <div role="status" className={'mt-3 rounded-lg p-3 text-sm font-semibold leading-snug ' + verdictCls}>
              {verdictText}
            </div>

            {log.length > 0 && (
              <ol className="mt-2 space-y-0.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                {log.map((entry, i) => (
                  <li key={i}>{entry}</li>
                ))}
              </ol>
            )}
          </div>
        </SectionCard>

        {/* --------------------------- complexity corner --------------------------- */}
        <SectionCard icon={Sigma} title="Complexity corner - growth curves" sub="same machines, wildly different price tags - slide n and compare">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="grow-range" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              n =
              <span className="ml-1 inline-block w-12 rounded bg-zinc-100 px-1 text-center font-mono text-sm font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                {growN}
              </span>
            </label>
            <input
              id="grow-range"
              type="range"
              min={8}
              max={512}
              step={4}
              value={growN}
              onChange={(e) => setGrowN(Number(e.target.value))}
              className="w-56 accent-sky-500"
            />
            <button
              type="button"
              role="switch"
              aria-checked={logScale}
              onClick={() => setLogScale(!logScale)}
              className={
                'rounded-full border px-3 py-1 text-xs font-bold transition-colors ' +
                (logScale
                  ? 'border-sky-500 bg-sky-500 text-white'
                  : 'border-zinc-300 text-zinc-600 hover:border-sky-400 dark:border-zinc-700 dark:text-zinc-300')
              }
            >
              log scale
            </button>
          </div>

          <svg viewBox="0 0 520 232" role="img" aria-label="growth curves" className="mt-3 h-auto w-full rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60">
            <g transform="translate(34,14)">
              <line x1="0" y1="196" x2="470" y2="196" strokeWidth="1.5" className="stroke-zinc-300 dark:stroke-zinc-700" />
              <line x1="0" y1="0" x2="0" y2="196" strokeWidth="1.5" className="stroke-zinc-300 dark:stroke-zinc-700" />
              {paths.curves.map((c) => (
                <polyline key={c.key} points={c.points} fill="none" strokeWidth={c.key === 'exp' ? 2.4 : 1.8} strokeLinecap="round" className={CURVE_CLASS[c.key]} />
              ))}
              <text x="468" y="212" textAnchor="end" className="fill-zinc-500 font-mono text-[10px] dark:fill-zinc-400">
                n = {growN}
              </text>
              <text x="-6" y="8" textAnchor="end" className="fill-zinc-500 font-mono text-[10px] dark:fill-zinc-400">
                f(n){logScale ? ' (log)' : ''}
              </text>
            </g>
          </svg>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from(GROWTH_CURVE_META.entries()).map(([key, meta]) => {
              const row = growthRows.find((r) => r.key === key);
              const v = row ? row.value : 0;
              const scaled = logScale ? Math.log2(1 + v) / Math.log2(1 + maxGrowthRaw) : v / Math.max(1, maxGrowthRaw);
              return (
                <div key={key} className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className={'inline-block h-2.5 w-2.5 rounded-full ' + meta.dot} />
                      {meta.label}
                    </span>
                    <span className="font-mono">{formatBig(v)}</span>
                  </p>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div className={'h-full rounded-full transition-all duration-150 ' + meta.bar} style={{ width: Math.min(100, scaled * 100) + '%' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs leading-snug text-zinc-600 dark:text-zinc-300">
            Linear scale tells the brutal story: exponentials leave everything behind almost immediately. Flip the log
            switch to see the polite curves breathe. Deciding membership for regular languages stays linear in the
            input - which is exactly why automata power lexical analysis everywhere.
          </p>
        </SectionCard>
      </main>
    </div>
  );
}

/* lookup tables kept outside the component so identity stays stable */

const GROWTH_CURVE_META: Map<string, { label: string; dot: string; bar: string }> = new Map([
  ['const', { label: 'O(1)', dot: 'bg-sky-300', bar: 'bg-sky-300' }],
  ['log', { label: 'O(log n)', dot: 'bg-sky-400', bar: 'bg-sky-400' }],
  ['linear', { label: 'O(n)', dot: 'bg-sky-500', bar: 'bg-sky-500' }],
  ['linlog', { label: 'O(n log n)', dot: 'bg-sky-600', bar: 'bg-sky-600' }],
  ['quad', { label: 'O(n^2)', dot: 'bg-sky-800', bar: 'bg-sky-800' }],
  ['exp', { label: 'O(2^n)', dot: 'bg-rose-500', bar: 'bg-rose-500' }],
]);

const GROWTH_ROW_SOURCES: Map<string, (n: number) => number> = new Map([
  ['const', () => 1],
  ['log', (n: number) => Math.log2(Math.max(2, n))],
  ['linear', (n: number) => n],
  ['linlog', (n: number) => n * Math.log2(Math.max(2, n))],
  ['quad', (n: number) => n * n],
  ['exp', (n: number) => Math.pow(2, Math.min(n, 512))],
]);

