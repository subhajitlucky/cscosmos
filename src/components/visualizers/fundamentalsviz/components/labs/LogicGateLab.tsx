'use client';

import React, { useMemo, useState } from 'react';

type Gate = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

const GATES: Gate[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

function evaluate(gate: Gate, a: boolean, b: boolean): boolean {
  if (gate === 'AND') return a && b;
  if (gate === 'OR') return a || b;
  if (gate === 'NOT') return !a;
  if (gate === 'NAND') return !(a && b);
  if (gate === 'NOR') return !(a || b);
  if (gate === 'XOR') return a !== b;
  return a === b;
}

const EXPRESSION: Record<Gate, string> = {
  AND: 'Y = A · B',
  OR: 'Y = A + B',
  NOT: 'Y = A′',
  NAND: 'Y = (A · B)′',
  NOR: 'Y = (A + B)′',
  XOR: 'Y = A ⊕ B',
  XNOR: 'Y = (A ⊕ B)′',
};

export function LogicGateLab() {
  const [gate, setGate] = useState<Gate>('AND');
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);

  const output = evaluate(gate, a, b);
  const rows = useMemo(() => {
    const inputs = gate === 'NOT' ? [[false, false], [true, false]] : [[false, false], [false, true], [true, false], [true, true]];
    return inputs.map(([left, right]) => ({
      a: left,
      b: right,
      y: evaluate(gate, left, right),
    }));
  }, [gate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {GATES.map((item) => (
          <button key={item} type="button" onClick={() => setGate(item)} className="border px-3 py-2 text-[12px] font-bold" style={{ borderColor: gate === item ? 'var(--it-primary)' : 'var(--it-border)', backgroundColor: gate === item ? 'var(--it-primary-soft)' : 'var(--it-surface)', color: gate === item ? 'var(--it-primary)' : 'var(--it-muted)' }}>
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="border p-4" style={{ borderColor: 'var(--it-border-strong)', backgroundColor: 'var(--it-surface)' }}>
          <div className="it-mono text-center text-[15px] font-bold" style={{ color: 'var(--it-primary)' }}>{EXPRESSION[gate]}</div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="text-center">
              <button type="button" onClick={() => setA((value) => !value)} className="it-node h-14 w-14 text-xl" aria-label="Toggle input A" aria-pressed={a}>{a ? '1' : '0'}</button>
              <div className="it-label mt-2 text-[11px]">A</div>
            </div>
            {gate !== 'NOT' && (
              <>
                <div className="it-mono text-[18px]" style={{ color: 'var(--it-border-strong)' }}>→</div>
                <div className="text-center">
                  <button type="button" onClick={() => setB((value) => !value)} className="it-node h-14 w-14 text-xl" aria-label="Toggle input B" aria-pressed={b}>{b ? '1' : '0'}</button>
                  <div className="it-label mt-2 text-[11px]">B</div>
                </div>
              </>
            )}
            <div className="it-mono text-[18px]" style={{ color: 'var(--it-border-strong)' }}>→</div>
            <div className="border px-4 py-3 text-center" style={{ borderColor: output ? 'var(--it-ok)' : 'var(--it-border)', backgroundColor: output ? 'var(--it-ok-soft)' : 'var(--it-surface-2)' }}>
              <div className="it-mono text-2xl font-bold" style={{ color: output ? 'var(--it-ok)' : 'var(--it-muted)' }}>{output ? '1' : '0'}</div>
              <div className="it-label mt-1 text-[10px]">Y</div>
            </div>
          </div>
          <p className="mt-5 text-center text-[12px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
            Click A{gate === 'NOT' ? '' : ' and B'} to change the inputs. The output updates immediately.
          </p>
        </div>

        <div className="border" style={{ borderColor: 'var(--it-border)' }}>
          <div className="border-b px-3 py-2" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
            <p className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>Truth table · {gate}</p>
          </div>
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="it-mono" style={{ color: 'var(--it-muted)' }}>
                <th className="border-b px-3 py-2 font-normal" style={{ borderColor: 'var(--it-border)' }}>A</th>
                {gate !== 'NOT' && <th className="border-b px-3 py-2 font-normal" style={{ borderColor: 'var(--it-border)' }}>B</th>}
                <th className="border-b px-3 py-2 font-normal" style={{ borderColor: 'var(--it-border)' }}>Y</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const activeRow = gate === 'NOT' ? row.a === a : row.a === a && row.b === b;
                return (
                  <tr key={index} style={{ backgroundColor: activeRow ? 'var(--it-primary-soft)' : 'transparent', color: activeRow ? 'var(--it-primary)' : 'var(--it-text)' }}>
                    <td className="border-b px-3 py-2 font-mono" style={{ borderColor: 'var(--it-border)' }}>{row.a ? '1' : '0'}</td>
                    {gate !== 'NOT' && <td className="border-b px-3 py-2 font-mono" style={{ borderColor: 'var(--it-border)' }}>{row.b ? '1' : '0'}</td>}
                    <td className="border-b px-3 py-2 font-mono font-bold" style={{ borderColor: 'var(--it-border)' }}>{row.y ? '1' : '0'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
        AND needs both inputs true. OR needs either. NOT inverts. NAND and NOR are inverted AND/OR. XOR is true when the
        inputs differ; XNOR is true when they match.
      </p>
    </div>
  );
}
