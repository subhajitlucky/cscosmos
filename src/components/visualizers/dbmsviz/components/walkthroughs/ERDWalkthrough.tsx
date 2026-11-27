'use client';

import React, { useMemo } from 'react';
import { ArrowRight, Table2 } from 'lucide-react';
import { StepPlayer, type DBMSWalkthroughStep } from './StepPlayer';

type Cardinality = '1:1' | '1:N' | 'M:N';

function Table({ name, columns, rows }: { name: string; columns: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
      <div className="flex items-center gap-2 border-b px-2.5 py-1.5" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
        <Table2 className="h-3 w-3" style={{ color: 'var(--db-primary)' }} />
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider">{name}</span>
      </div>
      <table className="w-full text-left text-[9px]">
        <thead>
          <tr className="font-mono uppercase" style={{ color: 'var(--db-muted)' }}>
            {columns.map((column) => <th key={column} className="border-b px-2 py-1" style={{ borderColor: 'var(--db-border)' }}>{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b last:border-b-0" style={{ borderColor: 'var(--db-border)' }}>
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-2 py-1 font-mono">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ERDWalkthrough({ cardinality }: { cardinality: Cardinality }) {
  const steps = useMemo<DBMSWalkthroughStep[]>(() => {
    const mapping =
      cardinality === '1:1'
        ? 'Add a unique foreign key to one side: Student.profile_id → Profile.id.'
        : cardinality === '1:N'
          ? 'Add a foreign key to the many side: Student.course_id → Course.id.'
          : 'Create a junction table: Enroll(student_id, course_id).';

    const tables =
      cardinality === '1:1' ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <Table name="Student" columns={['id', 'name', 'profile_id (FK)']} rows={[['1', 'Ada', 'P1'], ['2', 'Grace', 'P2']]} />
          <Table name="Profile" columns={['id', 'bio']} rows={[['P1', '...'], ['P2', '...']]} />
        </div>
      ) : cardinality === '1:N' ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <Table name="Student" columns={['id', 'name', 'course_id (FK)']} rows={[['1', 'Ada', 'C1'], ['2', 'Grace', 'C1'], ['3', 'Linus', 'C2']]} />
          <Table name="Course" columns={['id', 'title']} rows={[['C1', 'DBMS'], ['C2', 'OS']]} />
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-3">
          <Table name="Student" columns={['id', 'name']} rows={[['1', 'Ada'], ['2', 'Grace']]} />
          <Table name="Enroll" columns={['student_id', 'course_id']} rows={[['1', 'C1'], ['1', 'C2'], ['2', 'C1']]} />
          <Table name="Course" columns={['id', 'title']} rows={[['C1', 'DBMS'], ['C2', 'OS']]} />
        </div>
      );

    return [
      {
        title: 'Identify the entities',
        description: 'The domain has two strong entities: Student and Course. Each has an independent key.',
        content: (
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="rounded-lg border px-3 py-2 font-bold" style={{ borderColor: 'var(--db-primary)', color: 'var(--db-primary)' }}>Student</span>
            <span className="rounded-lg border px-3 py-2 font-bold" style={{ borderColor: 'var(--db-accent)', color: 'var(--db-accent)' }}>Course</span>
          </div>
        ),
      },
      {
        title: 'Add the relationship',
        description: 'Students enroll in courses, so the relationship is Enrolls with cardinality ' + cardinality + '.',
        content: (
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
            <span className="rounded-lg border px-3 py-2 font-bold" style={{ borderColor: 'var(--db-primary)', color: 'var(--db-primary)' }}>Student</span>
            <span className="text-[10px]" style={{ color: 'var(--db-muted)' }}>— enrolls —</span>
            <span className="rounded-lg border px-3 py-2 font-bold" style={{ borderColor: 'var(--db-accent)', color: 'var(--db-accent)' }}>Course</span>
            <span className="rounded-full border px-2 py-0.5 text-[9px] font-bold" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }}>{cardinality}</span>
          </div>
        ),
      },
      {
        title: 'Map the relationship to tables',
        description: mapping,
        content: tables,
      },
    ];
  }, [cardinality]);

  return <StepPlayer steps={steps} />;
}
