'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Braces,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Cpu,
  FileCode,
  ListTree,
  Pause,
  Play,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';
import {
  AST_EDGES,
  AST_NODES,
  BYTECODE,
  EXEC_STEPS,
  EXPRESSION,
  FINAL_RESULT,
  PHASES,
  TOKENS,
  phaseTotal,
  type AstNodeDef,
  type TokenKind,
} from './data';

const NODE_MAP: Map<string, AstNodeDef> = new Map(AST_NODES.map((n) => [n.id, n]));

const PHASE_ICONS: Record<string, LucideIcon> = {
  lex: Braces,
  parse: ListTree,
  codegen: FileCode,
  exec: Cpu,
};

interface StageProps {
  reveal: number;
}

/* ---------------------------------- stages --------------------------------- */

function tokenClass(kind: TokenKind, fresh: boolean): string {
  let cls =
    'flex h-11 min-w-[52px] items-center justify-center rounded-lg border px-3 font-mono text-base font-semibold transition-all duration-300 ';
  if (kind === 'number') {
    cls += 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 ';
  } else if (kind === 'operator') {
    cls += 'border-amber-400 bg-transparent text-amber-700 dark:text-amber-300 ';
  } else {
    cls +=
      'border-zinc-300 bg-transparent text-zinc-500 dark:border-zinc-700 dark:text-zinc-400 ';
  }
  return cls + (fresh ? 'ring-2 ring-amber-500/50' : '');
}

function TokenStage({ reveal }: StageProps) {
  return (
    <div aria-label="Lexer output">
      <p className="font-mono text-sm tracking-[0.35em] text-zinc-400 line-through decoration-zinc-300 dark:text-zinc-600 dark:decoration-zinc-700">
        {EXPRESSION}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {TOKENS.map((t, i) =>
          i < reveal ? (
            <span key={i} className={tokenClass(t.kind, i === reveal - 1)}>
              {t.text}
            </span>
          ) : null
        )}
        {reveal === 0 && (
          <span className="text-sm italic text-zinc-500 dark:text-zinc-400">
            press Run - characters stream in as typed tokens
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-zinc-500 dark:text-zinc-400">
        <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-amber-500" />number literal</span>
        <span><span className="mr-1 inline-block h-2 w-2 rounded-sm border border-amber-400" />operator</span>
        <span><span className="mr-1 inline-block h-2 w-2 rounded-sm border border-zinc-400" />parenthesis</span>
      </div>
    </div>
  );
}

function edgePoints(a: AstNodeDef, b: AstNodeDef) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const pad = 30;
  return {
    x1: ((a.x + (dx / len) * pad) / 800) * 100,
    y1: ((a.y + (dy / len) * pad) / 430) * 100,
    x2: ((b.x - (dx / len) * pad) / 800) * 100,
    y2: ((b.y - (dy / len) * pad) / 430) * 100,
  };
}

function TreeStage({ reveal }: StageProps) {
  const currentId = reveal > 0 && reveal <= AST_NODES.length ? AST_NODES[reveal - 1].id : null;
  return (
    <div aria-label="Parser output - abstract syntax tree under construction">
      <div className="relative mx-auto aspect-[800/430] w-full max-w-3xl text-zinc-300 dark:text-zinc-700">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {AST_EDGES.map((e) => {
            const p = NODE_MAP.get(e.parent);
            const c = NODE_MAP.get(e.child);
            if (!p || !c) return null;
            const pi = AST_NODES.findIndex((n) => n.id === e.parent);
            const ci = AST_NODES.findIndex((n) => n.id === e.child);
            if (pi >= reveal || ci >= reveal) return null;
            const pts = edgePoints(p, c);
            return (
              <line
                key={e.parent + '-' + e.child}
                x1={pts.x1}
                y1={pts.y1}
                x2={pts.x2}
                y2={pts.y2}
                stroke="currentColor"
                strokeWidth={0.45}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {AST_NODES.map((n, i) => {
          const shown = i < reveal;
          const fresh = n.id === currentId;
          let cls =
            'absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border px-3 py-1.5 font-mono text-lg font-bold shadow-sm transition-all duration-500 ';
          if (n.kind === 'op') {
            cls += 'border-amber-500 bg-white text-amber-700 dark:bg-zinc-900 dark:text-amber-300 ';
          } else {
            cls += 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 ';
          }
          cls += shown ? 'scale-100 opacity-100' : 'scale-75 opacity-0';
          if (fresh) cls += ' ring-2 ring-amber-500/60 animate-pulse';
          return (
            <span
              key={n.id}
              className={cls}
              style={{ left: (n.x / 800) * 100 + '%', top: (n.y / 430) * 100 + '%' }}
            >
              {n.label}
            </span>
          );
        })}
      </div>
      <p className="mt-2 text-center text-xs italic text-zinc-500 dark:text-zinc-400">
        construction order: operands first, operators once their children exist, root last
      </p>
    </div>
  );
}

function BytecodeStage({ reveal }: StageProps) {
  return (
    <div aria-label="Emitted bytecode listing" className="mx-auto max-w-xl">
      {BYTECODE.map((ins, i) => {
        const shown = i < reveal;
        const fresh = i === reveal - 1;
        return (
          <div
            key={i}
            className={
              'flex items-baseline gap-3 rounded-md px-3 py-1.5 font-mono text-sm transition-colors duration-300 ' +
              (fresh
                ? 'border-l-2 border-amber-500 bg-amber-500/10'
                : shown
                  ? 'border-l-2 border-transparent'
                  : 'opacity-0')
            }
          >
            <span className="w-9 shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
              {(i * 4).toString().padStart(4, '0')}
            </span>
            <span className="w-14 shrink-0 font-bold">{ins.op}</span>
            <span className="w-8 shrink-0">{ins.arg !== undefined ? ins.arg : ''}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">; {ins.note}</span>
          </div>
        );
      })}
      {reveal === 0 && (
        <p className="px-3 py-1.5 text-sm italic text-zinc-500 dark:text-zinc-400">
          post-order walk of the AST emits flat instructions
        </p>
      )}
    </div>
  );
}

function StackStage({ reveal }: StageProps) {
  const total = EXEC_STEPS.length;
  const cur = reveal > 0 ? EXEC_STEPS[reveal - 1] : null;
  const done = reveal >= total;
  return (
    <div aria-label="Stack machine execution">
      <div className="grid gap-6 md:grid-cols-[1fr_170px]">
        <div>
          {EXEC_STEPS.map((s, i) => {
            const active = cur !== null && s.pc === cur.pc;
            const executed = i < reveal;
            return (
              <div
                key={s.pc}
                className={
                  'rounded-md px-3 py-1.5 font-mono text-sm transition-colors duration-300 ' +
                  (active
                    ? 'bg-amber-500/15 font-bold text-amber-800 dark:text-amber-300'
                    : executed
                      ? 'text-zinc-700 dark:text-zinc-300'
                      : 'text-zinc-400 dark:text-zinc-600')
                }
              >
                <span className="mr-3 text-xs text-zinc-400 dark:text-zinc-500">
                  pc={(s.pc * 4).toString().padStart(4, '0')}
                </span>
                {s.label}
              </div>
            );
          })}
        </div>
        <div>
          <p className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            operand stack <span>top \u2191</span>
          </p>
          <div className="flex min-h-[220px] flex-col-reverse justify-start gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/60">
            {(cur !== null ? cur.stackAfter : []).map((v, i, arr) => (
              <div
                key={arr.length - i}
                className={
                  'rounded-md border py-1.5 text-center font-mono text-base font-bold transition-all duration-300 ' +
                  (i === arr.length - 1
                    ? 'border-amber-500 bg-amber-500 text-white'
                    : 'border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-200')
                }
              >
                {v}
              </div>
            ))}
            {cur === null && (
              <p className="self-center text-xs italic text-zinc-400 dark:text-zinc-500">empty</p>
            )}
          </div>
        </div>
      </div>
      {cur !== null && !done && (
        <div role="status" className="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <span className="font-mono font-bold">{cur.label}</span>
          <span className="ml-2">{cur.explain}</span>
          {cur.popped.length === 2 && cur.pushed !== null && (
            <span className="ml-2 font-mono text-xs">
              [pop {cur.popped[1]}, pop {cur.popped[0]} \u2192 push {cur.pushed}]
            </span>
          )}
        </div>
      )}
      {done && (
        <div role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
          HALT - stack holds one value: the expression evaluates to {FINAL_RESULT}.
        </div>
      )}
    </div>
  );
}

function BreakPanel({ idx }: { idx: number }) {
  const meta = PHASES[idx];
  return (
    <aside aria-label={'What breaks without the ' + meta.title} className="mt-5 rounded-xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-500/30 dark:bg-rose-500/5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-rose-800 dark:text-rose-300">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        What breaks without the {meta.title.toLowerCase()}
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-snug text-rose-900/90 dark:text-rose-200/90">
        {meta.breaks.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </aside>
  );
}

/* ---------------------------------- shell ---------------------------------- */

export default function CompilerPipelinePlayground() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [reveal, setReveal] = useState(0);
  const [running, setRunning] = useState(false);
  const [doneMap, setDoneMap] = useState<Record<number, boolean>>({});

  const meta = PHASES[phaseIdx];
  const total = phaseTotal(phaseIdx);
  const phaseDone = reveal >= total;

  useEffect(() => {
    if (!running) return;
    if (reveal >= total) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setReveal((r) => r + 1), phaseIdx === 3 ? 850 : 550);
    return () => clearTimeout(t);
  }, [running, reveal, total, phaseIdx]);

  useEffect(() => {
    if (reveal >= total) {
      setDoneMap((prev) => (prev[phaseIdx] ? prev : { ...prev, [phaseIdx]: true }));
    }
  }, [reveal, total, phaseIdx]);

  const gotoPhase = (idx: number) => {
    setPhaseIdx(idx);
    setReveal(0);
    setRunning(false);
  };

  const nextStep = () => {
    if (reveal < total) setReveal((r) => r + 1);
  };

  const resetAll = () => {
    setPhaseIdx(0);
    setReveal(0);
    setRunning(false);
    setDoneMap({});
  };

  const StageBody = phaseIdx === 0 ? TokenStage : phaseIdx === 1 ? TreeStage : phaseIdx === 2 ? BytecodeStage : StackStage;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            Systems · Compilers &amp; Runtime Internals
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">From Expression to Execution</h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Watch <span className="font-mono">{EXPRESSION}</span> flow through all four compiler phases -
            lexing, parsing, code generation, and execution on a stack machine.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-5 py-7">
        {/* Pipeline ribbon */}
        <nav aria-label="Compiler pipeline overview" className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          {PHASES.map((p, i) => (
            <span key={p.id} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-4 w-4" aria-hidden />}
              <span
                className={
                  'rounded-full border px-3 py-1 ' +
                  (i === phaseIdx
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                    : 'border-zinc-200 dark:border-zinc-800')
                }
              >
                {p.step} · {p.title}
              </span>
            </span>
          ))}
        </nav>

        {/* Controls */}
        <section aria-label="Playback controls" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              disabled={phaseDone}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-600 bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {running ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              {running ? 'Pause' : phaseDone ? 'Phase complete' : 'Run'}
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={running || phaseDone}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
              Step +1
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => gotoPhase(Math.max(0, phaseIdx - 1))}
                disabled={phaseIdx === 0}
                aria-label="Previous phase"
                className="rounded-lg border border-zinc-300 p-2 text-zinc-700 transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => gotoPhase(phaseIdx + 1)}
                disabled={phaseIdx === PHASES.length - 1}
                className="inline-flex items-center gap-1 rounded-lg border border-amber-500 px-3 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-amber-300 dark:hover:bg-amber-500/10"
              >
                Next: {PHASES[Math.min(phaseIdx + 1, PHASES.length - 1)].title}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={resetAll}
                aria-label="Reset playground"
                className="rounded-lg border border-zinc-300 p-2 text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          {/* Phase tabs */}
          <div role="tablist" aria-label="Pipeline phases" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PHASES.map((p, i) => {
              const Icon = PHASE_ICONS[p.id];
              const active = i === phaseIdx;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => gotoPhase(i)}
                  className={
                    'flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ' +
                    (active
                      ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-300'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700')
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{p.title}</span>
                    <span className="block truncate text-[11px] opacity-70">{p.tagline}</span>
                  </span>
                  {doneMap[i] && <CircleCheck className="ml-auto h-4 w-4 shrink-0 text-emerald-500" aria-hidden />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Active stage */}
        <section aria-label={meta.step + ': ' + meta.title} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold">
              {meta.step} · {meta.title}
            </h2>
            <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {Math.min(reveal, total)} / {total}
            </span>
          </div>
          <StageBody reveal={reveal} />
          <BreakPanel idx={phaseIdx} />
        </section>
      </main>
    </div>
  );
}
