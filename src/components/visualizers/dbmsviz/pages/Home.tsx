'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Database,
  FlaskConical,
  GitBranch,
  Layers,
  ListChecks,
  Network,
  ShieldCheck,
  Table2,
  Terminal,
} from 'lucide-react';
import { dbmsChapters } from '../data/curriculum';
import { dbmsProblems } from '../data/problems';
import { useDBMSBasePath } from '../components/DBMSShell';

export function Home() {
  const basePath = useDBMSBasePath();

  return (
    <div className="dbmsviz-grid">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ borderColor: 'var(--db-border-strong)', color: 'var(--db-primary)', backgroundColor: 'var(--db-primary-soft)' }}
            >
              <Terminal className="h-3.5 w-3.5" />
              DBMS · Data Workbench
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              From domain
              <span className="block" style={{ color: 'var(--db-primary)' }}>
                to durable data.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--db-muted)' }}>
              Model the domain, normalize the schema, query with relational algebra, and protect the data
              with transactions. Thirty-two focused lessons and three interactive labs.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`${basePath}/learn`}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: 'var(--db-primary)' }}
              >
                <BookOpen className="h-4 w-4" />
                Start the curriculum
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`${basePath}/lab`}
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold"
                style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-surface)', color: 'var(--db-text)' }}
              >
                <FlaskConical className="h-4 w-4" style={{ color: 'var(--db-primary)' }} />
                Open the data lab
              </Link>
            </div>

            <dl className="grid max-w-lg grid-cols-3 gap-3 pt-3">
              {[
                { label: 'Lessons', value: dbmsChapters.length, icon: Layers },
                { label: 'Practice drills', value: dbmsProblems.length, icon: ListChecks },
                { label: 'Labs', value: 3, icon: Database },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-xl border p-3" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
                    <Icon className="mb-2 h-4 w-4" style={{ color: 'var(--db-primary)' }} />
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--db-muted)' }}>{stat.label}</dt>
                    <dd className="font-mono text-2xl font-black">{stat.value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <div className="rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-surface)' }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--db-muted)' }}>
                schema sketch
              </span>
              <span className="dbmsviz-kbd">3NF</span>
            </div>

            <div className="space-y-2 font-mono text-[10px]">
              {[
                { name: 'Student', columns: 'id · name · advisor_id', color: 'var(--db-primary)' },
                { name: 'Advisor', columns: 'advisor_id · name', color: 'var(--db-accent)' },
                { name: 'Enroll', columns: 'student_id · course_id · grade', color: 'var(--db-ok)' },
              ].map((table) => (
                <div key={table.name} className="rounded-lg border p-2.5" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: table.color }}>{table.name}</span>
                    <Table2 className="h-3 w-3" style={{ color: 'var(--db-muted)' }} />
                  </div>
                  <div className="mt-1" style={{ color: 'var(--db-muted)' }}>{table.columns}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border p-3 font-mono text-[10px]" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
              <div style={{ color: 'var(--db-muted)' }}>relational algebra</div>
              <div className="mt-1" style={{ color: 'var(--db-primary)' }}>π_name(σ_age ≥ 21(Student))</div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>
              Each lesson turns a concept into a table, a rule, or a query you can inspect.
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-3">
          {[
            {
              icon: Network,
              title: 'Model the domain',
              text: 'Entities, relationships, cardinality, and the ERD-to-table mapping — including weak entities and junction tables.',
            },
            {
              icon: GitBranch,
              title: 'Normalize with reasons',
              text: 'Functional dependencies, anomalies, 1NF, 2NF, and 3NF. See exactly which dependency each decomposition removes.',
            },
            {
              icon: ShieldCheck,
              title: 'Protect the data',
              text: 'ACID, transaction states, logs, checkpoints, locking, MVCC, and the concurrency anomalies they prevent.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border p-5" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-primary-soft)', color: 'var(--db-primary)' }}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mb-1.5 text-sm font-bold">{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--db-muted)' }}>{item.text}</p>
              </div>
            );
          })}
        </section>

        <section className="mt-16 rounded-2xl border p-6 sm:mt-20 sm:p-8" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-surface)' }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--db-accent)' }}>next step</p>
              <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">Start with the domain, then normalize it.</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--db-muted)' }}>
                Read what a DBMS does, then build an ERD and watch the tables appear.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`${basePath}/learn/dbms-introduction`} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: 'var(--db-primary)' }}>
                <BookOpen className="h-4 w-4" /> Lesson 01
              </Link>
              <Link href={`${basePath}/lab`} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold" style={{ borderColor: 'var(--db-border-strong)', color: 'var(--db-text)' }}>
                <FlaskConical className="h-4 w-4" /> ERD lab
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
