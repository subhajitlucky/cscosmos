'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Binary,
  BookOpen,
  Braces,
  CheckCircle2,
  Code2,
  Cpu,
  FlaskConical,
  Layers,
  MemoryStick,
  Terminal,
} from 'lucide-react';
import { cChapters } from '../data/curriculum';
import { useCBasePath } from '../components/CShell';

const CURRENT_CHAPTERS = cChapters.length;
const CURRENT_PROBLEMS = 41;

export function Home() {
  const basePath = useCBasePath();

  return (
    <div className="cviz-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                borderColor: 'var(--c-border-strong)',
                color: 'var(--c-accent)',
                backgroundColor: 'var(--c-accent-soft)',
              }}
            >
              <Terminal className="h-3.5 w-3.5" />
              C Programming · Visual Workbench
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              C, from source
              <span className="block" style={{ color: 'var(--c-primary)' }}>
                to memory.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--c-muted)' }}>
              A visual C curriculum. Trace pointers, inspect structs, walk the heap, and predict
              output — 35 lessons organized as one interactive workbench.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`${basePath}/learn`}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: 'var(--c-primary)' }}
              >
                <BookOpen className="h-4 w-4" />
                Start the curriculum
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`${basePath}/lab`}
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition-colors"
                style={{
                  borderColor: 'var(--c-border-strong)',
                  backgroundColor: 'var(--c-surface)',
                  color: 'var(--c-text)',
                }}
              >
                <FlaskConical className="h-4 w-4" style={{ color: 'var(--c-primary)' }} />
                Open the memory lab
              </Link>
            </div>

            <dl className="grid max-w-lg grid-cols-3 gap-3 pt-3">
              {[
                { label: 'Chapters', value: CURRENT_CHAPTERS, icon: Layers },
                { label: 'Practice drills', value: CURRENT_PROBLEMS, icon: Code2 },
                { label: 'Lab modes', value: 2, icon: Cpu },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border p-3"
                    style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}
                  >
                    <Icon className="mb-2 h-4 w-4" style={{ color: 'var(--c-primary)' }} />
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--c-muted)' }}>
                      {stat.label}
                    </dt>
                    <dd className="font-mono text-2xl font-black">{stat.value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <div
            className="rounded-2xl border p-5 shadow-sm"
            style={{ borderColor: 'var(--c-border-strong)', backgroundColor: 'var(--c-surface)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--c-muted)' }}>
                memory sketch
              </span>
              <span className="cviz-kbd">x86_64</span>
            </div>

            <div className="cviz-code p-4">
              <code>{`int x = 42;       /* stack: 0x7ffc1000 */
int *p = &x;      /* stack: 0x7ffc1008 */
int **pp = &p;    /* stack: 0x7ffc1010 */

printf("%d", **pp);  /* 42 */`}</code>
            </div>

            <div className="mt-4 space-y-2 font-mono text-xs" style={{ color: 'var(--c-muted)' }}>
              {[
                ['x', '42', '#0b5cad'],
                ['p', '&x → 0x7ffc1000', '#b45309'],
                ['pp', '&p → 0x7ffc1008', '#157347'],
              ].map(([name, value, color]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                  style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}
                >
                  <span className="font-bold" style={{ color }}>
                    {name}
                  </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              Every chapter pairs the language rule with the memory picture, so syntax stops being
              something you memorise and becomes something you can see.
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-3">
          {[
            {
              icon: MemoryStick,
              title: 'Memory first',
              text: 'Pointers, arrays, structs, and the heap are shown as addresses and bytes, not hand-waving diagrams.',
            },
            {
              icon: CheckCircle2,
              title: 'Practice honest',
              text: 'Every chapter is mapped to the C language, with output-prediction drills that test real code reading.',
            },
            {
              icon: Braces,
              title: 'No magic',
              text: 'You will read declarations, trace scope, and calculate pointer arithmetic. The compiler stops being a black box.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border p-5"
                style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}
              >
                <span
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                  style={{
                    borderColor: 'var(--c-border)',
                    backgroundColor: 'var(--c-primary-soft)',
                    color: 'var(--c-primary)',
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mb-1.5 text-sm font-bold">{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                  {item.text}
                </p>
              </div>
            );
          })}
        </section>

        <section
          className="mt-16 rounded-2xl border p-6 sm:mt-20 sm:p-8"
          style={{ borderColor: 'var(--c-border-strong)', backgroundColor: 'var(--c-surface)' }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--c-accent)' }}>
                next step
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">Read one chapter, then break it in the lab.</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                Start with C Fundamentals, then use the pointer workbench to see why an address is not a value.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`${basePath}/learn/c-fundamentals`}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: 'var(--c-primary)' }}
              >
                <BookOpen className="h-4 w-4" /> Chapter 01
              </Link>
              <Link
                href={`${basePath}/problems`}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold"
                style={{ borderColor: 'var(--c-border-strong)', color: 'var(--c-text)' }}
              >
                <Binary className="h-4 w-4" /> Practice
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
