'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import {
  GUESS_BUFFER_ADDR,
  INSTRUCTIONS,
  MAX_GUESS_LEN,
  SECRET,
  SECRET_BASE,
  SECTION_LABELS,
  STACK_TOP,
  type RegName,
} from './data';

type Outcome = 'granted' | 'denied';

interface MachineState {
  ip: number;
  regs: Record<RegName, number>;
  zf: boolean;
  steps: number;
  outcome: Outcome | null;
}

const REG_LIST: RegName[] = ['RIP', 'RAX', 'RBX', 'RCX', 'RSI', 'RDI', 'RSP'];

function toBytes(s: string): number[] {
  return [...s].map((c) => c.charCodeAt(0) & 0xff).concat(0);
}

const SECRET_BYTES = toBytes(SECRET);

function initialState(): MachineState {
  return {
    ip: 0,
    regs: {
      RIP: parseInt(INSTRUCTIONS[0].addr, 16),
      RAX: 0,
      RBX: 0,
      RCX: 0,
      RSI: 0,
      RDI: GUESS_BUFFER_ADDR,
      RSP: STACK_TOP,
    },
    zf: false,
    steps: 0,
    outcome: null,
  };
}

function formatHex(n: number): string {
  return '0x' + n.toString(16).toUpperCase();
}

function asciiOf(b: number): string {
  return b >= 32 && b <= 126 ? "'" + String.fromCharCode(b) + "'" : '';
}

function stepMachine(prev: MachineState, guessBytes: number[]): MachineState {
  if (prev.outcome !== null) return prev;
  const instr = INSTRUCTIONS[prev.ip];
  if (!instr) return prev;
  const regs = { ...prev.regs };
  let zf = prev.zf;
  let ip = prev.ip + 1;
  switch (instr.op.kind) {
    case 'init-secret':
      regs.RSI = SECRET_BASE;
      break;
    case 'zero-counter':
      regs.RCX = 0;
      break;
    case 'load-guess-byte': {
      const idx = Math.min(regs.RCX, guessBytes.length - 1);
      regs.RAX = guessBytes[idx] ?? 0;
      break;
    }
    case 'load-secret-byte': {
      const idx = Math.min(regs.RCX, SECRET_BYTES.length - 1);
      regs.RBX = SECRET_BYTES[idx] ?? 0;
      break;
    }
    case 'compare':
      zf = (regs.RAX & 0xff) === (regs.RBX & 0xff);
      break;
    case 'jump-ne-fail':
      if (!zf) ip = instr.op.target;
      break;
    case 'test-nul':
      zf = (regs.RAX & 0xff) === 0;
      break;
    case 'jump-e-success':
      if (zf) ip = instr.op.target;
      break;
    case 'inc-counter':
      regs.RCX += 1;
      break;
    case 'jmp-loop':
      ip = instr.op.target;
      break;
    case 'set-return':
      regs.RAX = instr.op.value;
      break;
    case 'ret':
      ip = prev.ip;
      break;
  }
  const nextInstr = INSTRUCTIONS[ip];
  regs.RIP = nextInstr ? parseInt(nextInstr.addr, 16) : regs.RIP;
  const outcome: Outcome | null =
    instr.op.kind === 'ret' ? (regs.RAX === 1 ? 'granted' : 'denied') : null;
  return { ip, regs, zf, steps: prev.steps + 1, outcome };
}

const LOOP_OPS = new Set([
  'load-guess-byte',
  'load-secret-byte',
  'compare',
  'jump-ne-fail',
  'test-nul',
  'jump-e-success',
]);

interface ByteStripProps {
  label: string;
  bytes: number[];
  activeIndex: number | null;
  tone: 'accent' | 'muted';
}

function ByteStrip({ label, bytes, activeIndex, tone }: ByteStripProps) {
  return (
    <div>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-1" aria-label={label}>
        {bytes.map((b, i) => {
          const isActive = activeIndex === i;
          const base =
            'flex h-9 w-9 flex-col items-center justify-center rounded border font-mono text-[10px] leading-none transition-colors ';
          const cls = isActive
            ? tone === 'accent'
              ? base +
                'border-cyan-600 bg-cyan-100 text-cyan-900 dark:border-cyan-400 dark:bg-cyan-500/20 dark:text-cyan-100'
              : base +
                'border-amber-600 bg-amber-100 text-amber-900 dark:border-amber-400 dark:bg-amber-500/20 dark:text-amber-100'
            : base +
              'border-zinc-300 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
          return (
            <span key={i} className={cls}>
              <span className="font-semibold">{b === 0 ? '\0' : String.fromCharCode(b)}</span>
              <span className="opacity-70">{b.toString(16).padStart(2, '0')}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function ReverseEngineeringLab() {
  const [guess, setGuess] = useState('s3cr3X');
  const [machine, setMachine] = useState<MachineState>(initialState);
  const [running, setRunning] = useState(false);

  const guessBytes = useMemo(() => toBytes(guess), [guess]);
  const halted = machine.outcome !== null;
  const currentInstr = INSTRUCTIONS[machine.ip] ?? INSTRUCTIONS[0];
  const inLoop = LOOP_OPS.has(currentInstr.op.kind);
  const compareIndex = Math.min(
    machine.regs.RCX,
    Math.max(guessBytes.length, SECRET_BYTES.length) - 1
  );

  const reset = useCallback(() => {
    setMachine(initialState());
    setRunning(false);
  }, []);

  const handleGuess = (value: string) => {
    setGuess(value.slice(0, MAX_GUESS_LEN));
    setMachine(initialState());
    setRunning(false);
  };

  const doStep = useCallback(() => {
    setMachine((s) => (s.outcome !== null ? s : stepMachine(s, toBytes(guess))));
  }, [guess]);

  useEffect(() => {
    if (!running || halted) return;
    const t = setTimeout(doStep, 700);
    return () => clearTimeout(t);
  }, [running, halted, machine, doStep]);

  const regNotes: Record<RegName, string> = {
    RIP: 'instruction pointer',
    RAX: asciiOf(machine.regs.RAX & 0xff) || 'scratch / return',
    RBX: asciiOf(machine.regs.RBX & 0xff) || 'secret byte',
    RCX: 'loop index i = ' + machine.regs.RCX,
    RSI: machine.regs.RSI === SECRET_BASE ? '&SECRET (.data)' : 'not loaded yet',
    RDI: '&guess buffer',
    RSP: 'top of stack',
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
            Reverse Engineering · Assembly
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Password Check, Instruction by Instruction
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Step through an x86-64 routine that compares your guess against a stored secret -
            and watch every flag, register, and shortcut a reverser would abuse.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-7">
        {/* Controls + input + byte strips */}
        <section
          aria-label="Controls"
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex flex-wrap items-end gap-3">
            <button
              type="button"
              onClick={doStep}
              disabled={halted}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-600 bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SkipForward className="h-4 w-4" aria-hidden />
              Step
            </button>
            <button
              type="button"
              onClick={() => setRunning((v) => !v)}
              disabled={halted}
              aria-pressed={running}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-cyan-500 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-cyan-500 dark:hover:text-cyan-400"
            >
              {running ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              {running ? 'Pause' : 'Auto-run'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
            <div className="ml-auto">
              <label
                htmlFor="guess-input"
                className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                Your guess (editing resets)
              </label>
              <input
                id="guess-input"
                type="text"
                value={guess}
                maxLength={MAX_GUESS_LEN}
                onChange={(e) => handleGuess(e.target.value)}
                className="mt-1 w-56 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="try to match the secret"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ByteStrip
              label="Your input buffer [rdi]"
              bytes={guessBytes}
              activeIndex={inLoop ? compareIndex : null}
              tone="accent"
            />
            <ByteStrip
              label="Stored secret [rsi] - dumped via strings"
              bytes={SECRET_BYTES}
              activeIndex={inLoop ? compareIndex : null}
              tone="muted"
            />
          </div>

          {machine.outcome && (
            <div
              role="status"
              className={
                'mt-4 rounded-lg p-3 text-sm font-medium ' +
                (machine.outcome === 'granted'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300')
              }
            >
              {machine.outcome === 'granted'
                ? 'ACCESS GRANTED - ret returned 1 after ' + machine.steps + ' executed instructions.'
                : 'ACCESS DENIED - ret returned 0 after ' + machine.steps + ' executed instructions.'}{' '}
              <span className="font-normal opacity-80">
                A reverser times this: each matching prefix adds instructions to the count, leaking the
                password one character at a time.
              </span>
            </div>
          )}
        </section>

        {/* Three panels */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT: code */}
          <section
            aria-label="Disassembly"
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="font-mono text-sm font-bold">check_password</h2>
            <ul className="mt-3 space-y-0.5 font-mono text-[13px]">
              {INSTRUCTIONS.map((instr, i) => {
                const isCurrent = i === machine.ip && !halted;
                const label = SECTION_LABELS[i];
                return (
                  <li key={instr.addr}>
                    {label && (
                      <p className="pt-2 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">{label}</p>
                    )}
                    <div
                      aria-current={isCurrent || undefined}
                      className={
                        'flex gap-2 rounded-r border-l-4 py-1 pl-2 pr-1 transition-colors ' +
                        (isCurrent
                          ? 'border-cyan-600 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-500/10'
                          : halted && instr.op.kind === 'ret'
                            ? 'border-transparent opacity-60'
                            : 'border-transparent')
                      }
                    >
                      <span className="shrink-0 text-zinc-400 dark:text-zinc-500">{instr.addr}</span>
                      <span className={isCurrent ? 'font-semibold' : ''}>{instr.text}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* MIDDLE: registers */}
          <section
            aria-label="CPU registers"
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-sm font-bold">Registers</h2>
            <table className="mt-3 w-full text-left font-mono text-[13px]">
              <tbody>
                {REG_LIST.map((reg) => (
                  <tr key={reg} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                    <th scope="row" className="py-1.5 pr-2 font-semibold text-cyan-700 dark:text-cyan-400">
                      {reg}
                    </th>
                    <td className="py-1.5 pr-2 tabular-nums">{formatHex(machine.regs[reg])}</td>
                    <td className="py-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">{regNotes[reg]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Flags:</span>
              <span
                className={
                  'rounded px-2 py-0.5 font-mono font-semibold ' +
                  (machine.zf
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300')
                }
              >
                ZF={machine.zf ? '1' : '0'}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">(equal / zero)</span>
            </div>
            <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400">
              Instructions executed:{' '}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-200">{machine.steps}</span>
            </p>
          </section>

          {/* RIGHT: explanation */}
          <section
            aria-label="Explanation"
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-sm font-bold">What just happened</h2>
            <p className="mt-3 rounded-lg bg-zinc-100 p-3 font-mono text-[13px] dark:bg-zinc-800">
              {currentInstr.text}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {currentInstr.explain}
            </p>
            <div className="mt-4 rounded-lg border-l-4 border-cyan-600 bg-cyan-50 p-3 dark:border-cyan-400 dark:bg-cyan-500/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                RE insight
              </p>
              <p className="mt-1 text-sm italic leading-relaxed text-zinc-700 dark:text-zinc-300">
                {currentInstr.reInsight}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
