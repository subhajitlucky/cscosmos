'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MoveRight } from 'lucide-react';
import { dbmsCategories, dbmsChapters } from '../data/curriculum';
import { DBMS_PROBLEM_COUNT } from '../data/mcq/counts';
import { useDBMSBasePath } from '../components/DBMSShell';

const MOVEMENTS = [
  {
    number: 'I',
    title: 'Model',
    chapters: '01–07',
    text: 'Turn a messy domain into entities, relationships, and a schema that can survive change.',
  },
  {
    number: 'II',
    title: 'Query',
    chapters: '08–15',
    text: 'Reason in relations, keys, and algebra before you write a single line of SQL.',
  },
  {
    number: 'III',
    title: 'Normalize',
    chapters: '16–20',
    text: 'Find the dependency, name the anomaly, and decompose with a reason — not a rule of thumb.',
  },
  {
    number: 'IV',
    title: 'Protect',
    chapters: '21–32',
    text: 'Make transactions durable, schedules serializable, and distribution honest about its trade-offs.',
  },
];

const LABS = [
  {
    number: '01',
    title: 'Map the cardinality',
    text: 'Switch a relationship between 1:1, 1:N, and M:N. Watch the foreign key and junction table appear.',
    href: '/lab?lab=erd',
  },
  {
    number: '02',
    title: 'Run the algebra',
    text: 'Apply selection, projection, and join to live relations. See exactly which tuples survive.',
    href: '/lab?lab=algebra',
  },
  {
    number: '03',
    title: 'Break the table',
    text: 'Start with a table that repeats facts, then decompose it through 1NF, 2NF, and 3NF.',
    href: '/lab?lab=normalization',
  },
];

export function Home() {
  const basePath = useDBMSBasePath();
  const firstChapter = dbmsChapters[0];
  const tracks = dbmsCategories
    .filter((category) => category !== 'All')
    .map((category) => {
      const chapters = dbmsChapters.filter((chapter) => chapter.category === category);
      return {
        category,
        count: chapters.length,
        range: `${String(chapters[0].number).padStart(2, '0')}–${String(chapters[chapters.length - 1].number).padStart(2, '0')}`,
        start: chapters[0].id,
      };
    });

  return (
    <div className="dbmsviz-frame mx-auto w-full max-w-[1240px]">
      <section className="border-b" style={{ borderColor: 'var(--db-border)' }}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3 sm:px-8" style={{ borderColor: 'var(--db-border)' }}>
          <span className="db-kicker" style={{ color: 'var(--db-muted)' }}>
            Vol. 01 · Database systems · A field manual
          </span>
          <span className="db-mono text-[10px]" style={{ color: 'var(--db-muted)' }}>
            CSCOSMOS / CORE CS
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.28fr_0.72fr]">
          <div className="px-5 py-10 sm:px-8 sm:py-16 lg:py-20">
            <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>
              From first ERD to distributed analytics
            </p>

            <h1 className="db-display mt-5 max-w-[760px] text-[clamp(4rem,10vw,8.2rem)]">
              Make data
              <br />
              behave.
            </h1>

            <p className="mt-7 max-w-[560px] text-[15px] leading-[1.8] sm:text-base" style={{ color: 'var(--db-muted)' }}>
              A rigorous, visual field manual for the database layer. Thirty-two chapters move from
              domain modeling to durable, concurrent, distributed data — with worked examples,
              annotated schemas, a thousand-question drill book, and instruments you can operate.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={`${basePath}/learn`} className="db-btn db-btn-accent">
                Read the manual
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href={`${basePath}/lab`} className="db-btn db-btn-quiet">
                Open the workbench
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="db-stat-strip mt-12 max-w-[620px]">
              {[
                { value: dbmsChapters.length, label: 'Chapters' },
                { value: DBMS_PROBLEM_COUNT, label: 'Drills' },
                { value: 3, label: 'Instruments' },
                { value: 8, label: 'Tracks' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="db-num text-3xl">{String(stat.value).padStart(2, '0')}</div>
                  <div className="db-kicker mt-2 text-[8px]" style={{ color: 'var(--db-muted)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t px-5 py-10 sm:px-8 sm:py-14 lg:border-l lg:border-t-0" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>
                  Specimen 01
                </p>
                <h2 className="db-display-tight mt-2 text-3xl">A schema after normalization.</h2>
              </div>
              <span className="dbmsviz-kbd">3NF</span>
            </div>

            <div className="mt-8 space-y-3">
              <div className="border" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-bg)' }}>
                <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: 'var(--db-border)' }}>
                  <span className="db-mono text-[11px] font-bold">STUDENT</span>
                  <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>parent</span>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>
                      <th className="border-b px-3 py-1.5 font-normal" style={{ borderColor: 'var(--db-border)' }}>id</th>
                      <th className="border-b px-3 py-1.5 font-normal" style={{ borderColor: 'var(--db-border)' }}>name</th>
                      <th className="border-b px-3 py-1.5 font-normal" style={{ borderColor: 'var(--db-border)' }}>advisor_id</th>
                    </tr>
                  </thead>
                  <tbody className="db-mono text-[10px]">
                    <tr>
                      <td className="px-3 py-1.5">1</td>
                      <td className="px-3 py-1.5">Ada</td>
                      <td className="px-3 py-1.5">A1</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5">2</td>
                      <td className="px-3 py-1.5">Grace</td>
                      <td className="px-3 py-1.5">A1</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-3 pl-4">
                <span className="h-5 w-px" style={{ backgroundColor: 'var(--db-border-strong)' }} />
                <span className="db-mono text-[9px]" style={{ color: 'var(--db-primary)' }}>
                  advisor_id → ADVISOR.id · 1:N
                </span>
              </div>

              <div className="border" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-bg)' }}>
                <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: 'var(--db-border)' }}>
                  <span className="db-mono text-[11px] font-bold">ADVISOR</span>
                  <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>referenced</span>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>
                      <th className="border-b px-3 py-1.5 font-normal" style={{ borderColor: 'var(--db-border)' }}>id</th>
                      <th className="border-b px-3 py-1.5 font-normal" style={{ borderColor: 'var(--db-border)' }}>name</th>
                    </tr>
                  </thead>
                  <tbody className="db-mono text-[10px]">
                    <tr>
                      <td className="px-3 py-1.5">A1</td>
                      <td className="px-3 py-1.5">Dr. Hopper</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-bg)' }}>
                <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: 'var(--db-border)' }}>
                  <span className="db-mono text-[11px] font-bold">ENROLLMENT</span>
                  <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>junction</span>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>
                      <th className="border-b px-3 py-1.5 font-normal" style={{ borderColor: 'var(--db-border)' }}>student_id</th>
                      <th className="border-b px-3 py-1.5 font-normal" style={{ borderColor: 'var(--db-border)' }}>course_id</th>
                      <th className="border-b px-3 py-1.5 font-normal" style={{ borderColor: 'var(--db-border)' }}>grade</th>
                    </tr>
                  </thead>
                  <tbody className="db-mono text-[10px]">
                    <tr>
                      <td className="px-3 py-1.5">1</td>
                      <td className="px-3 py-1.5">C1</td>
                      <td className="px-3 py-1.5">A</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5">1</td>
                      <td className="px-3 py-1.5">C2</td>
                      <td className="px-3 py-1.5">B</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-5 border-t pt-4 text-[11px] leading-relaxed" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }}>
              Each fact lives once. The key carries the relationship. The schema is the argument.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b" style={{ borderColor: 'var(--db-border)' }}>
        <div className="grid md:grid-cols-4">
          {MOVEMENTS.map((movement, index) => (
            <div
              key={movement.number}
              className={`px-5 py-7 sm:px-7 ${index < MOVEMENTS.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''}`}
              style={{ borderColor: 'var(--db-border)' }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="db-num text-2xl" style={{ color: 'var(--db-primary)' }}>{movement.number}</span>
                <span className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>{movement.chapters}</span>
              </div>
              <h2 className="db-display-tight mt-4 text-2xl">{movement.title}</h2>
              <p className="mt-2 text-[12px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>
                {movement.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="border-b px-5 py-10 sm:px-8 sm:py-14 lg:border-b-0 lg:border-r" style={{ borderColor: 'var(--db-border)' }}>
          <div className="flex items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--db-border)' }}>
            <div>
              <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>The index</p>
              <h2 className="db-display-tight mt-2 text-4xl">Eight tracks. One argument.</h2>
            </div>
            <span className="db-mono hidden text-[10px] sm:block" style={{ color: 'var(--db-muted)' }}>
              32 chapters
            </span>
          </div>

          <div>
            {tracks.map((track, index) => (
              <Link
                key={track.category}
                href={`${basePath}/learn/${track.start}`}
                className="db-index-row grid grid-cols-[36px_1fr_auto] items-center gap-3 border-b px-1 py-4 sm:grid-cols-[44px_1fr_120px_auto]"
                style={{ borderColor: 'var(--db-border)' }}
              >
                <span className="db-num text-xl" style={{ color: 'var(--db-muted)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{track.category}</span>
                  <span className="db-mono mt-0.5 block text-[9px] sm:hidden" style={{ color: 'var(--db-muted)' }}>{track.range}</span>
                </span>
                <span className="db-mono hidden text-[10px] sm:block" style={{ color: 'var(--db-muted)' }}>
                  {track.range}
                </span>
                <span className="flex items-center gap-2">
                  <span className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>{track.count} ch</span>
                  <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--db-primary)' }} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-5 py-10 sm:px-8 sm:py-14">
          <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>The workbench</p>
          <h2 className="db-display-tight mt-2 text-4xl">Do not just read it.</h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--db-muted)' }}>
            Three instruments for the parts of a DBMS that are easiest to memorize and hardest to see.
          </p>

          <div className="mt-7 border-t" style={{ borderColor: 'var(--db-border-strong)' }}>
            {LABS.map((lab) => (
              <Link
                key={lab.number}
                href={`${basePath}${lab.href}`}
                className="db-index-row grid grid-cols-[40px_1fr_auto] gap-3 border-b py-4"
                style={{ borderColor: 'var(--db-border)' }}
              >
                <span className="db-num text-xl" style={{ color: 'var(--db-primary)' }}>{lab.number}</span>
                <span>
                  <span className="block text-sm font-semibold">{lab.title}</span>
                  <span className="mt-1 block text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{lab.text}</span>
                </span>
                <ArrowUpRight className="mt-1 h-3.5 w-3.5" style={{ color: 'var(--db-muted)' }} />
              </Link>
            ))}
          </div>

          <div className="mt-8 border p-4" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-surface)' }}>
            <p className="db-kicker" style={{ color: 'var(--db-muted)' }}>Reading rule</p>
            <p className="db-serif mt-2 text-xl leading-snug">
              “Name the rule, then show the table that breaks it.”
            </p>
          </div>
        </div>
      </section>

      <section className="border-t px-5 py-10 sm:px-8 sm:py-12" style={{ borderColor: 'var(--db-border)' }}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>Begin</p>
            <h2 className="db-display-tight mt-2 max-w-xl text-4xl">
              Start with the question a database exists to answer.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--db-muted)' }}>
              Chapter 01 establishes the contract between an application and its data. Everything else
              is a consequence of that contract.
            </p>
          </div>
          <Link href={`${basePath}/learn/${firstChapter.id}`} className="db-btn db-btn-solid shrink-0">
            Chapter 01 · {firstChapter.title}
            <MoveRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
