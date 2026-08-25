'use client';

import { useMemo, useState } from 'react';
import {
  COMPONENTS,
  STRIDE,
  THREATS,
  BOUNDARY_MEMBERS,
  type ComponentId,
} from './data';

const NODE_POS: Record<ComponentId, { x: number; y: number; w: number }> = {
  user: { x: 24, y: 118, w: 104 },
  webapp: { x: 176, y: 118, w: 116 },
  api: { x: 356, y: 52, w: 116 },
  database: { x: 356, y: 196, w: 116 },
};

const EDGES: Array<[ComponentId, ComponentId]> = [
  ['user', 'webapp'],
  ['webapp', 'api'],
  ['api', 'database'],
];

export default function ThreatModelWorkshop() {
  const [selected, setSelected] = useState<ComponentId>('api');
  const [showMitigations, setShowMitigations] = useState(false);

  const component = COMPONENTS.find((c) => c.id === selected) ?? COMPONENTS[0];
  const threatsForSelection = useMemo(
    () => STRIDE.map((s) => ({ stride: s, entry: THREATS.find((t) => t.component === selected && t.stride === s.key) })),
    [selected]
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">Security Engineering</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Threat Modeling with STRIDE</h1>
            <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Pick any element of the system. Six questions later, you know how it gets attacked - and how it gets defended.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowMitigations((v) => !v)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              showMitigations
                ? 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                : 'border-zinc-300 bg-transparent text-zinc-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400'
            }`}
            aria-pressed={showMitigations}
          >
            {showMitigations ? 'Defenses ON' : 'Show defenses'}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-7 lg:grid-cols-[minmax(320px,520px)_1fr]">
        {/* Diagram */}
        <section aria-label="System diagram" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <svg viewBox="0 0 520 300" role="img" className="w-full select-none">
            {/* trust boundary */}
            <rect
              x="332"
              y="26"
              width="172"
              height="258"
              rx="14"
              fill="none"
              strokeWidth="2"
              strokeDasharray="7 6"
              className="stroke-orange-500/70 dark:stroke-orange-400/70"
            />
            <text x="342" y="20" className="fill-zinc-500 text-[11px] dark:fill-zinc-400">Trust boundary</text>

            {/* edges */}
            {EDGES.map(([a, b]) => {
              const na = NODE_POS[a];
              const nb = NODE_POS[b];
              const x1 = na.x + na.w;
              const y1 = na.y + 35;
              const x2 = nb.x;
              const y2 = nb.y + 35;
              return (
                <line
                  key={`${a}-${b}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth="2"
                  className="stroke-zinc-400 dark:stroke-zinc-600"
                />
              );
            })}

            {/* nodes */}
            {COMPONENTS.map((c) => {
              const p = NODE_POS[c.id];
              const isSel = c.id === selected;
              return (
                <g
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className="cursor-pointer"
                  role="button"
                  aria-label={`Select ${c.label}`}
                >
                  <rect
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height="70"
                    rx="10"
                    strokeWidth={isSel ? 2.5 : 1.5}
                    className={isSel
                      ? 'fill-orange-50 stroke-orange-600 dark:fill-orange-500/10 dark:stroke-orange-400'
                      : 'fill-white stroke-zinc-400 dark:fill-zinc-900 dark:stroke-zinc-600'}
                  />
                  <text
                    x={p.x + p.w / 2}
                    y={p.y + 32}
                    textAnchor="middle"
                    className="fill-zinc-800 text-[13px] font-semibold dark:fill-zinc-100"
                  >
                    {c.label}
                  </text>
                  <text
                    x={p.x + p.w / 2}
                    y={p.y + 51}
                    textAnchor="middle"
                    className="fill-zinc-500 text-[10px] dark:fill-zinc-400"
                  >
                    {c.role}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="mt-2 rounded-lg bg-orange-50 p-3 text-xs leading-relaxed text-zinc-700 dark:bg-orange-500/10 dark:text-zinc-300">
            <span className="font-semibold text-orange-700 dark:text-orange-400">{component.label}:</span>{' '}
            {component.trustNote}
          </div>
        </section>

        {/* Threat panel */}
        <section aria-label="STRIDE threats" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold">Six questions for {component.label}</h2>
          <ul className="mt-3 space-y-2">
            {threatsForSelection.map(({ stride, entry }) => (
              <li key={stride.key} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-100 text-sm font-bold text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">
                    {stride.letter}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{stride.name}</p>
                    <p className="text-xs italic text-zinc-500 dark:text-zinc-400">{stride.question}</p>
                  </div>
                </div>
                {entry && (
                  <div className="mt-2 space-y-1.5 pl-9 text-sm">
                    <p className="text-zinc-700 dark:text-zinc-300">
                      <span className="font-medium text-rose-700 dark:text-rose-400">Attack: </span>
                      {entry.attack}
                    </p>
                    {showMitigations && (
                      <p className="text-zinc-700 dark:text-zinc-300">
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">Defense: </span>
                        {entry.mitigation}
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Coverage matrix */}
      <section aria-label="Coverage matrix" className="mx-auto max-w-6xl px-5 pb-10">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold">Coverage matrix</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            A filled cell means the model has an answer for that threat against that element.
          </p>
          <table className="mt-3 w-full max-w-md border-collapse text-center text-sm">
            <thead>
              <tr>
                <th className="border border-zinc-200 p-2 text-left dark:border-zinc-800" scope="col">Element</th>
                {STRIDE.map((s) => (
                  <th key={s.key} className="border border-zinc-200 p-2 dark:border-zinc-800" scope="col" title={s.name}>
                    {s.letter}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPONENTS.map((c) => (
                <tr key={c.id}>
                  <th className="border border-zinc-200 p-2 text-left font-medium dark:border-zinc-800" scope="row">{c.label}</th>
                  {STRIDE.map((s) => {
                    const covered = THREATS.some((t) => t.component === c.id && t.stride === s.key);
                    return (
                      <td key={s.key} className="border border-zinc-200 p-2 dark:border-zinc-800">
                        {covered ? (
                          <span aria-label="covered" className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                        ) : (
                          <span aria-label="gap" className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}