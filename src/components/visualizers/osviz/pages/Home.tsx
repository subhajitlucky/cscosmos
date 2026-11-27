'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Database,
  FlaskConical,
  Gauge,
  Layers,
  ListChecks,
  MemoryStick,
  Terminal,
} from 'lucide-react';
import { osChapters } from '../data/curriculum';
import { osProblems } from '../data/problems';
import { useOSBasePath } from '../components/OSShell';

export function Home() {
  const basePath = useOSBasePath();

  return (
    <div className="osviz-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                borderColor: 'var(--os-border-strong)',
                color: 'var(--os-primary)',
                backgroundColor: 'var(--os-primary-soft)',
              }}
            >
              <Terminal className="h-3.5 w-3.5" />
              Operating Systems · Kernel Workbench
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              The kernel,
              <span className="block" style={{ color: 'var(--os-primary)' }}>
                made visible.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--os-muted)' }}>
              Schedules, page tables, interrupts, and file chains. Twelve lessons and three labs that show
              what the operating system is actually doing between your program and the hardware.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`${basePath}/learn`}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: 'var(--os-primary)' }}
              >
                <BookOpen className="h-4 w-4" />
                Start the curriculum
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`${basePath}/lab`}
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition-colors"
                style={{
                  borderColor: 'var(--os-border-strong)',
                  backgroundColor: 'var(--os-surface)',
                  color: 'var(--os-text)',
                }}
              >
                <FlaskConical className="h-4 w-4" style={{ color: 'var(--os-primary)' }} />
                Open the kernel lab
              </Link>
            </div>

            <dl className="grid max-w-lg grid-cols-3 gap-3 pt-3">
              {[
                { label: 'Lessons', value: osChapters.length, icon: Layers },
                { label: 'Practice drills', value: osProblems.length, icon: ListChecks },
                { label: 'Labs', value: 3, icon: Cpu },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border p-3"
                    style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}
                  >
                    <Icon className="mb-2 h-4 w-4" style={{ color: 'var(--os-primary)' }} />
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--os-muted)' }}>
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
            style={{ borderColor: 'var(--os-border-strong)', backgroundColor: 'var(--os-surface)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-muted)' }}>
                scheduler sketch
              </span>
              <span className="osviz-kbd">RR · q=2</span>
            </div>

            <div className="flex h-12 overflow-hidden rounded-lg border" style={{ borderColor: 'var(--os-border)' }}>
              {[
                { label: 'P1', width: 22, color: '#0f766e' },
                { label: 'P2', width: 18, color: '#b45309' },
                { label: 'P3', width: 12, color: '#2563eb' },
                { label: 'P1', width: 22, color: '#0f766e' },
                { label: 'P2', width: 14, color: '#b45309' },
                { label: 'P1', width: 12, color: '#0f766e' },
              ].map((slice, index) => (
                <div
                  key={`${slice.label}-${index}`}
                  className="flex items-center justify-center border-r border-white/20 font-mono text-[10px] font-bold text-white last:border-r-0"
                  style={{ width: `${slice.width}%`, backgroundColor: slice.color }}
                >
                  {slice.label}
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 font-mono text-xs" style={{ color: 'var(--os-muted)' }}>
              {[
                ['arrival', '0, 1, 2'],
                ['burst', '5, 3, 1'],
                ['avg wait', '4.33'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                  style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}
                >
                  <span>{label}</span>
                  <span className="font-bold" style={{ color: 'var(--os-text)' }}>{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
              Change the policy and watch the same process set produce a different Gantt chart, waiting
              time, and turnaround time.
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-3">
          {[
            {
              icon: Gauge,
              title: 'Scheduler first',
              text: 'Compare FCFS, Round Robin, and priority on one process set. See why the convoy effect and starvation happen.',
            },
            {
              icon: MemoryStick,
              title: 'Memory honest',
              text: 'Walk page tables, trigger faults, and watch the TLB cache translations instead of memorising block diagrams.',
            },
            {
              icon: Database,
              title: 'Files end-to-end',
              text: 'Follow a FAT chain, compare it with indexed allocation, and see the real cost of random access.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border p-5"
                style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}
              >
                <span
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                  style={{
                    borderColor: 'var(--os-border)',
                    backgroundColor: 'var(--os-primary-soft)',
                    color: 'var(--os-primary)',
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mb-1.5 text-sm font-bold">{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--os-muted)' }}>
                  {item.text}
                </p>
              </div>
            );
          })}
        </section>

        <section
          className="mt-16 rounded-2xl border p-6 sm:mt-20 sm:p-8"
          style={{ borderColor: 'var(--os-border-strong)', backgroundColor: 'var(--os-surface)' }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--os-accent)' }}>
                next step
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
                Read one lesson, then run the scheduler.
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--os-muted)' }}>
                Start with what the kernel does, then compare three scheduling policies on the same
                workload.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`${basePath}/learn/os-fundamentals`}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: 'var(--os-primary)' }}
              >
                <BookOpen className="h-4 w-4" /> Chapter 01
              </Link>
              <Link
                href={`${basePath}/lab`}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold"
                style={{ borderColor: 'var(--os-border-strong)', color: 'var(--os-text)' }}
              >
                <FlaskConical className="h-4 w-4" /> Scheduler lab
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
