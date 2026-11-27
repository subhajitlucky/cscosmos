'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, Sigma, Table2 } from 'lucide-react';

type Operation = 'selection' | 'projection' | 'join';

const STUDENTS = [
  { id: 1, name: 'Ada', age: 21 },
  { id: 2, name: 'Grace', age: 22 },
  { id: 3, name: 'Linus', age: 20 },
];
const ENROLL = [
  { student_id: 1, course_id: 'C1', grade: 'A' },
  { student_id: 1, course_id: 'C2', grade: 'B' },
  { student_id: 2, course_id: 'C1', grade: 'A' },
];

const OPS: { id: Operation; label: string; expression: string; note: string }[] = [
  {
    id: 'selection',
    label: 'Selection σ',
    expression: 'σ_age ≥ 21 (Student)',
    note: 'Selection keeps the rows that satisfy the predicate. The schema is unchanged.',
  },
  {
    id: 'projection',
    label: 'Projection π',
    expression: 'π_name (Student)',
    note: 'Projection keeps the chosen columns. Because a relation is a set, duplicate rows disappear.',
  },
  {
    id: 'join',
    label: 'Join ⋈',
    expression: 'Student ⋈ Student.id = Enroll.student_id Enroll',
    note: 'The join pairs matching rows and combines their columns. The join condition decides which pairs survive.',
  },
];

function ResultTable({ title, columns, rows }: { title: string; columns: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
      <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
        <Table2 className="h-3.5 w-3.5" style={{ color: 'var(--db-primary)' }} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{title}</span>
      </div>
      <table className="w-full text-left text-[10px]">
        <thead>
          <tr className="font-mono uppercase tracking-wider" style={{ color: 'var(--db-muted)' }}>
            {columns.map((column) => (
              <th key={column} className="border-b px-2 py-1.5" style={{ borderColor: 'var(--db-border)' }}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b last:border-b-0" style={{ borderColor: 'var(--db-border)' }}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-2 py-1.5 font-mono">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RelationalAlgebraLab() {
  const [operation, setOperation] = useState<Operation>('selection');
  const selected = OPS.find((op) => op.id === operation) ?? OPS[0];

  const result = useMemo(() => {
    if (operation === 'selection') {
      return {
        columns: ['id', 'name', 'age'],
        rows: STUDENTS.filter((student) => student.age >= 21).map((student) => [student.id, student.name, student.age]),
      };
    }
    if (operation === 'projection') {
      return {
        columns: ['name'],
        rows: Array.from(new Set(STUDENTS.map((student) => student.name))).map((name) => [name]),
      };
    }
    return {
      columns: ['id', 'name', 'course_id', 'grade'],
      rows: ENROLL.map((enrollment) => {
        const student = STUDENTS.find((item) => item.id === enrollment.student_id);
        return [student?.id ?? '', student?.name ?? '', enrollment.course_id, enrollment.grade];
      }),
    };
  }, [operation]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {OPS.map((op) => (
          <button
            key={op.id}
            type="button"
            onClick={() => setOperation(op.id)}
            className="rounded-lg border px-3 py-2 text-xs font-bold"
            style={{
              borderColor: operation === op.id ? 'var(--db-primary)' : 'var(--db-border)',
              backgroundColor: operation === op.id ? 'var(--db-primary-soft)' : 'var(--db-surface)',
              color: operation === op.id ? 'var(--db-primary)' : 'var(--db-muted)',
            }}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultTable title="Student" columns={['id', 'name', 'age']} rows={STUDENTS.map((student) => [student.id, student.name, student.age])} />
            <ResultTable title="Enroll" columns={['student_id', 'course_id', 'grade']} rows={ENROLL.map((item) => [item.student_id, item.course_id, item.grade])} />
          </div>

          <div className="flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[11px]" style={{ borderColor: 'var(--db-primary)', backgroundColor: 'var(--db-primary-soft)', color: 'var(--db-primary)' }}>
            <Sigma className="h-3.5 w-3.5" />
            {selected.expression}
            <ArrowRight className="ml-auto h-3.5 w-3.5" />
          </div>

          <ResultTable title="Result" columns={result.columns} rows={result.rows} />
        </div>

        <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-surface)' }}>
          <h3 className="text-sm font-bold">What happened</h3>
          <p className="mt-2 text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{selected.note}</p>
          <div className="mt-3 rounded-lg border p-2.5 font-mono text-[10px]" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
            rows in result: {result.rows.length}
          </div>
        </div>
      </div>
    </div>
  );
}
