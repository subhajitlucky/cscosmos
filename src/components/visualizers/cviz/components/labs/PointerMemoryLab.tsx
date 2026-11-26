'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, CornerDownRight, RotateCcw, Zap } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';

const X_ADDR = '0x7ffc1000';
const P_ADDR = '0x7ffc1004';
const PP_ADDR = '0x7ffc1008';

const ARRAY = [10, 20, 30, 40];
const ARRAY_BASE = 0x7ffc2000;
const INT_SIZE = 4;

type LogEntry = { kind: 'ok' | 'error'; text: string };

export function PointerMemoryLab() {
  const [x, setX] = useState(42);
  const [pPointsToX, setPPointsToX] = useState(true);
  const [ppPointsToP, setPPointsToP] = useState(true);
  const [log, setLog] = useState<LogEntry[]>([
    { kind: 'ok', text: 'int x = 42;' },
    { kind: 'ok', text: 'int *p = &x;' },
    { kind: 'ok', text: 'int **pp = &p;' },
  ]);

  const push = (entry: LogEntry) => setLog((current) => [entry, ...current].slice(0, 8));

  const run = (source: string, action: () => void, error?: string) => {
    if (error) {
      push({ kind: 'error', text: `${source}  // ${error}` });
      return;
    }
    action();
    push({ kind: 'ok', text: source });
  };

  const pValue = pPointsToX ? X_ADDR : 'NULL';
  const ppValue = ppPointsToP ? P_ADDR : 'NULL';
  const chainValid = ppPointsToP && pPointsToX;

  const reset = () => {
    setX(42);
    setPPointsToX(true);
    setPPointsToP(true);
    setLog([{ kind: 'ok', text: 'reset: x = 42; p = &x; pp = &p;' }]);
  };

  /* ------------------------------- array walk ------------------------------- */
  const [offset, setOffset] = useState(0);
  const currentAddress = ARRAY_BASE + offset * INT_SIZE;
  const currentValue = ARRAY[offset];

  const arrayRows = useMemo(
    () =>
      ARRAY.map((value, index) => ({
        index,
        value,
        address: `0x${(ARRAY_BASE + index * INT_SIZE).toString(16)}`,
      })),
    [],
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Pointer chain</h3>
                <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>
                  Every pointer is a box holding an address.
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold"
                style={{ borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}
              >
                <RotateCcw className="h-3 w-3" /> reset
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { name: 'pp', type: 'int **', address: PP_ADDR, value: ppValue, color: 'var(--c-ok)' },
                { name: 'p', type: 'int *', address: P_ADDR, value: pValue, color: 'var(--c-accent)' },
                { name: 'x', type: 'int', address: X_ADDR, value: String(x), color: 'var(--c-primary)' },
              ].map((cell) => (
                <div key={cell.name} className="rounded-xl border p-3" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black" style={{ color: cell.color }}>
                      {cell.name}
                    </span>
                    <span className="font-mono text-[9px]" style={{ color: 'var(--c-muted)' }}>
                      {cell.type}
                    </span>
                  </div>
                  <div className="mt-2 font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
                    {cell.address}
                  </div>
                  <div className="mt-1 break-all font-mono text-sm font-bold">{cell.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[10px]" style={{ borderColor: chainValid ? 'var(--c-ok)' : 'var(--c-danger)', backgroundColor: chainValid ? 'var(--c-ok-soft)' : 'var(--c-danger-soft)', color: chainValid ? 'var(--c-ok)' : 'var(--c-danger)' }}>
              <span>pp</span>
              <ArrowRight className="h-3 w-3" />
              <span>{ppPointsToP ? 'p' : 'NULL'}</span>
              <ArrowRight className="h-3 w-3" />
              <span>{pPointsToX ? 'x' : 'NULL'}</span>
              <span className="ml-auto">{chainValid ? '**pp is valid' : '**pp would crash'}</span>
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
            <h3 className="mb-3 text-sm font-bold">Operate on memory</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                {
                  label: 'x++',
                  action: () => run('x++;', () => setX((value) => value + 1)),
                },
                {
                  label: '*p = 99',
                  action: () =>
                    run('*p = 99;', () => setX(99), pPointsToX ? undefined : 'p is NULL'),
                },
                {
                  label: '**pp = 7',
                  action: () =>
                    run(
                      '**pp = 7;',
                      () => setX(7),
                      !ppPointsToP ? 'pp is NULL' : !pPointsToX ? '*pp (p) is NULL' : undefined,
                    ),
                },
                {
                  label: 'p = &x',
                  action: () => run('p = &x;', () => setPPointsToX(true)),
                },
                {
                  label: 'p = NULL',
                  action: () => run('p = NULL;', () => setPPointsToX(false)),
                },
                {
                  label: 'pp = &p',
                  action: () => run('pp = &p;', () => setPPointsToP(true)),
                },
                {
                  label: 'pp = NULL',
                  action: () => run('pp = NULL;', () => setPPointsToP(false)),
                },
                {
                  label: 'print **pp',
                  action: () =>
                    run(
                      'printf("%d", **pp);',
                      () => push({ kind: 'ok', text: `output: ${x}` }),
                      chainValid ? undefined : 'cannot dereference a NULL pointer',
                    ),
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="rounded-lg border px-3 py-2 text-left font-mono text-[11px] font-bold transition-colors hover:border-[var(--c-primary)]"
                  style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)', color: 'var(--c-text)' }}
                >
                  <Zap className="mr-1.5 inline h-3 w-3" style={{ color: 'var(--c-primary)' }} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <CodeBlock
            caption="pointer-chain.c"
            code={`int x = 42;
int *p = &x;
int **pp = &p;

/* p stores the address of x */
/* pp stores the address of p */
printf("%d", **pp);`}
          />

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
            <h3 className="mb-2 text-sm font-bold">Memory log</h3>
            <div className="max-h-52 space-y-1.5 overflow-y-auto font-mono text-[10px]">
              {log.map((entry, index) => (
                <div
                  key={`${entry.text}-${index}`}
                  className="rounded-md border px-2 py-1.5"
                  style={{
                    borderColor: entry.kind === 'ok' ? 'var(--c-border)' : 'var(--c-danger)',
                    backgroundColor: entry.kind === 'ok' ? 'var(--c-surface-2)' : 'var(--c-danger-soft)',
                    color: entry.kind === 'ok' ? 'var(--c-muted)' : 'var(--c-danger)',
                  }}
                >
                  <CornerDownRight className="mr-1 inline h-3 w-3" />
                  {entry.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold">Pointer arithmetic: walk an array</h3>
            <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>
              int is 4 bytes here. Adding 1 to an int pointer advances 4 bytes, not 1.
            </p>
          </div>
          <span className="font-mono text-[10px]" style={{ color: 'var(--c-primary)' }}>
            q = a + {offset}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {arrayRows.map((row) => {
              const active = row.index === offset;
              return (
                <button
                  key={row.index}
                  type="button"
                  onClick={() => setOffset(row.index)}
                  className="rounded-xl border p-3 text-left transition-colors"
                  style={{
                    borderColor: active ? 'var(--c-primary)' : 'var(--c-border)',
                    backgroundColor: active ? 'var(--c-primary-soft)' : 'var(--c-surface-2)',
                  }}
                >
                  <div className="font-mono text-[9px]" style={{ color: 'var(--c-muted)' }}>
                    a[{row.index}] · {row.address}
                  </div>
                  <div className="mt-1 font-mono text-xl font-black">{row.value}</div>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border p-3" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
            <div className="font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
              q points to
            </div>
            <div className="mt-1 font-mono text-sm font-bold">0x{currentAddress.toString(16)}</div>
            <div className="mt-3 font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
              *q
            </div>
            <div className="font-mono text-2xl font-black" style={{ color: 'var(--c-primary)' }}>
              {currentValue}
            </div>
            <div className="mt-3 border-t pt-2 font-mono text-[10px]" style={{ borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}>
              q + 1 → 0x{(currentAddress + INT_SIZE).toString(16)}
            </div>
            <div className="mt-1 font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
              *(q + 1) → {ARRAY[offset + 1] ?? 'out of bounds'}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOffset((value) => Math.max(0, value - 1))}
            className="rounded-lg border px-3 py-1.5 text-xs font-bold"
            style={{ borderColor: 'var(--c-border)' }}
          >
            ← q--
          </button>
          <button
            type="button"
            onClick={() => setOffset((value) => Math.min(ARRAY.length - 1, value + 1))}
            className="rounded-lg border px-3 py-1.5 text-xs font-bold"
            style={{ borderColor: 'var(--c-border)' }}
          >
            q++ →
          </button>
          <span className="ml-auto font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
            a[i] ≡ *(a + i)
          </span>
        </div>
      </div>
    </div>
  );
}
