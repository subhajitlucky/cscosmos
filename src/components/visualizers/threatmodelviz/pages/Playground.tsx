'use client';

import { useMemo, useState } from 'react';
import { COMPONENTS, STRIDE, THREATS } from '../data';

const NODE_POS: Record<string, { x: number; y: number; w: number }> = {
  user: { x: 24, y: 118, w: 104 },
  webapp: { x: 176, y: 118, w: 116 },
  api: { x: 356, y: 52, w: 116 },
  database: { x: 356, y: 196, w: 116 },
};

const EDGES: Array<[string, string]> = [['user', 'webapp'], ['webapp', 'api'], ['api', 'database']];

export default function Playground() {
  const [selected, setSelected] = useState(COMPONENTS[2].id);
  const [showMitigations, setShowMitigations] = useState(false);
  const component = COMPONENTS.find((c) => c.id === selected) ?? COMPONENTS[0];
  const rows = useMemo(
    () => STRIDE.map((s) => ({ stride: s, entry: THREATS.find((t) => t.component === selected && t.stride === s.key) })),
    [selected]
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
        <h1 className="text-xl font-black tracking-tight">Lab · model any element</h1>
        <button type="button" onClick={() => setShowMitigations((v) => !v)} aria-pressed={showMitigations}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${showMitigations ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border border-zinc-300 text-zinc-700 hover:border-emerald-500 dark:border-zinc-700 dark:text-zinc-300'}`}>
          {showMitigations ? 'Defenses ON' : 'Show defenses'}
        </button>
      </header>
      <main className="mx-auto grid max-w-6xl gap-5 px-5 lg:grid-cols-[minmax(300px,480px)_1fr]">
        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <svg viewBox="0 0 520 300" role="img" className="w-full">
            <rect x="332" y="26" width="172" height="258" rx="14" fill="none" strokeWidth="2" strokeDasharray="7 6" className="stroke-orange-500/70 dark:stroke-orange-400/70" />
            <text x="342" y="20" className="fill-zinc-500 text-[11px] dark:fill-zinc-400">Trust boundary</text>
            {EDGES.map(([a, b]) => {
              const na = NODE_POS[a]; const nb = NODE_POS[b];
              return <line key={a + b} x1={na.x + na.w} y1={na.y + 35} x2={nb.x} y2={nb.y + 35} strokeWidth="2" className="stroke-zinc-400 dark:stroke-zinc-600" />;
            })}
            {COMPONENTS.map((c) => {
              const p = NODE_POS[c.id]; const isSel = c.id === selected;
              return (
                <g key={c.id} onClick={() => setSelected(c.id)} className="cursor-pointer" role="button" aria-label={`Select ${c.label}`}>
                  <rect x={p.x} y={p.y} width={p.w} height="70" rx="10" strokeWidth={isSel ? 2.5 : 1.5}
                    className={isSel ? 'fill-orange-50 stroke-orange-600 dark:fill-orange-500/10 dark:stroke-orange-400' : 'fill-white stroke-zinc-400 dark:fill-zinc-900 dark:stroke-zinc-600'} />
                  <text x={p.x + p.w / 2} y={p.y + 32} textAnchor="middle" className="fill-zinc-800 text-[13px] font-semibold dark:fill-zinc-100">{c.label}</text>
                  <text x={p.x + p.w / 2} y={p.y + 51} textAnchor="middle" className="fill-zinc-500 text-[10px] dark:fill-zinc-400">{c.role}</text>
                </g>
              );
            })}
          </svg>
        </section>
        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold">{component.label}</h2>
          <ul className="mt-3 space-y-2">
            {rows.map(({ stride, entry }) => (
              <li key={stride.key} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <p className="text-sm font-bold"><span className="mr-1.5 text-rose-600 dark:text-rose-400">{stride.letter}</span>{stride.name}</p>
                {entry && <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{entry.attack}</p>}
                {entry && showMitigations && (
                  <p className="mt-1 rounded-md bg-emerald-50 p-2 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"><strong>Defense:</strong> {entry.mitigation}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}