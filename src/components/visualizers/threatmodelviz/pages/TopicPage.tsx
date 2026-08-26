'use client';

import { ComponentType, useContext, useState } from 'react';
import { RouteContext } from '@/components/visualizers/shared/RouterShim';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { COMPONENTS, STRIDE, THREATS, LESSONS } from '../data';

function StrideCards() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {STRIDE.map((s) => (
        <div key={s.key} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <p className="text-sm font-bold"><span className="mr-1.5 text-rose-600 dark:text-rose-400">{s.letter}</span>{s.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{s.question}</p>
        </div>
      ))}
    </div>
  );
}

function ThreatTable() {
  const [comp, setComp] = useState(COMPONENTS[2].id);
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {COMPONENTS.map((c) => (
          <button key={c.id} type="button" onClick={() => setComp(c.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${comp === c.id ? 'bg-orange-600 text-white' : 'border border-zinc-300 text-zinc-600 hover:border-orange-400 dark:border-zinc-700 dark:text-zinc-300'}`}>
            {c.label}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {THREATS.filter((t) => t.component === comp).map((t) => {
          const meta = STRIDE.find((s) => s.key === t.stride)!;
          return (
            <li key={t.stride} className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
              <span className="font-bold text-rose-600 dark:text-rose-400">{meta.letter} · {meta.name}:</span>{' '}
              <span className="text-zinc-700 dark:text-zinc-300">{t.attack}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MitigationPairs() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="space-y-2">
      {THREATS.slice(0, 12).map((t) => {
        const meta = STRIDE.find((s) => s.key === t.stride)!;
        const id = t.component + t.stride;
        const isOpen = open === id;
        return (
          <li key={id}>
            <button type="button" onClick={() => setOpen(isOpen ? null : id)}
              className="w-full rounded-lg border border-zinc-200 p-3 text-left text-sm transition-colors hover:border-emerald-500 dark:border-zinc-800">
              <span className="font-semibold">{meta.name} on {COMPONENTS.find((c) => c.id === t.component)?.label}:</span>{' '}
              <span className="text-zinc-600 dark:text-zinc-400">{t.attack}</span>
              {isOpen && (
                <p className="mt-2 rounded-md bg-emerald-50 p-2 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <strong>Defense:</strong> {t.mitigation}
                </p>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function CoverageMatrix() {
  return (
    <table className="w-full max-w-md border-collapse text-center text-sm">
      <thead><tr>
        <th className="border border-zinc-200 p-2 text-left dark:border-zinc-800" scope="col">Element</th>
        {STRIDE.map((s) => (<th key={s.key} title={s.name} className="border border-zinc-200 p-2 dark:border-zinc-800" scope="col">{s.letter}</th>))}
      </tr></thead>
      <tbody>
        {COMPONENTS.map((c) => (
          <tr key={c.id}>
            <th scope="row" className="border border-zinc-200 p-2 text-left font-medium dark:border-zinc-800">{c.label}</th>
            {STRIDE.map((s) => {
              const covered = THREATS.some((t) => t.component === c.id && t.stride === s.key);
              return <td key={s.key} className="border border-zinc-200 p-2 dark:border-zinc-800">
                <span aria-label={covered ? 'covered' : 'gap'} className={`inline-block h-2.5 w-2.5 rounded-full ${covered ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
              </td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const VIZ: Record<string, ComponentType> = {
  'stride-overview': StrideCards,
  'threat-enumeration': ThreatTable,
  'mitigation-mapping': MitigationPairs,
  'coverage-matrix': CoverageMatrix,
};

export default function TopicPage() {
  const { params } = useContext(RouteContext);
  const id = params?.topicId ?? '';
  const lesson = LESSONS.find((l) => l.id === id);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-zinc-50 px-5 pt-20 text-center dark:bg-zinc-950">
        <h1 className="text-2xl font-black">Lesson not found</h1>
        <Link to="/learn" className="mt-4 inline-block text-sm font-semibold text-orange-600 hover:underline dark:text-orange-400">Back to course</Link>
      </div>
    );
  }

  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS[idx + 1];
  const VizSlice = VIZ[lesson.id];

  return (
    <div className="min-h-screen bg-zinc-50 pb-16 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="mx-auto max-w-3xl px-5 pt-12">
        <Link to="/learn" className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600 hover:underline dark:text-orange-400">&larr; All lessons</Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">Lesson {idx + 1} of {LESSONS.length} · {lesson.minutes} min</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{lesson.title}</h1>
      </header>
      <main className="mx-auto max-w-3xl px-5">
        {lesson.body.map((para, i) => (
          <p key={i} className="mt-5 text-base leading-relaxed text-zinc-700 first-of-type:mt-6 dark:text-zinc-300">{para}</p>
        ))}
        <section aria-label="Interactive diagram" className="mt-8 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Interactive</h2>
          {VizSlice ? <VizSlice /> : <StrideCards />}
        </section>
        <nav className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
          {next ? (
            <Link to={`/learn/${next.id}`} className="text-sm font-semibold text-orange-600 hover:underline dark:text-orange-400">Next: {next.title} &rarr;</Link>
          ) : (
            <Link to="/playground" className="text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400">Finish: open the lab &rarr;</Link>
          )}
        </nav>
      </main>
    </div>
  );
}