'use client';

import { Link } from '@/components/visualizers/shared/RouterShim';
import { COMPONENTS, STRIDE, THREATS } from '../data';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600 dark:text-orange-400">Security Engineering</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Threat Modeling with STRIDE</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Learn to see a system the way an attacker does. Six questions, four elements,
          twenty-four modeled threats - and a method you can run on any architecture.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link to="/learn" className="rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700">Start learning</Link>
          <Link to="/playground" className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-orange-500 hover:text-orange-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-orange-400 dark:hover:text-orange-400">Open the lab</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-5 pb-12 text-center">
        {[
          { n: String(COMPONENTS.length), label: 'system elements' },
          { n: '6', label: 'STRIDE categories' },
          { n: String(THREATS.length), label: 'modeled threats' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-3xl font-black text-orange-600 dark:text-orange-400">{s.n}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <h2 className=
          "mb-4 text-center text-sm font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400"
        >
          The six questions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STRIDE.map((s) => (
            <Link
              key={s.key}
              to="/learn/stride-overview"
              className="group rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-400"
            >
              <span className="flex h-9 w-9 mx-auto items-center justify-center rounded-lg bg-rose-100 text-lg font-black text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">
                {s.letter}
              </span>
              <p className="mt-2 text-sm font-semibold">{s.name}</p>
              <p className="mt-1 hidden text-[11px] leading-snug text-zinc-500 group-hover:block dark:text-zinc-400">{s.question}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}