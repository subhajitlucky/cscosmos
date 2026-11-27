'use client';

import React, { useMemo } from 'react';
import { Table2 } from 'lucide-react';
import { StepPlayer, type DBMSWalkthroughStep } from './StepPlayer';

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

function Table({ name, columns, rows, highlight }: { name: string; columns: string[]; rows: (string | number)[][]; highlight?: number[] }) {
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
            <tr
              key={index}
              className="border-b last:border-b-0"
              style={{
                borderColor: 'var(--db-border)',
                backgroundColor: highlight?.includes(index) ? 'var(--db-primary-soft)' : 'transparent',
                color: highlight?.includes(index) ? 'var(--db-primary)' : 'var(--db-text)',
              }}
            >
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-2 py-1 font-mono">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AlgebraWalkthrough({ operation }: { operation: Operation }) {
  const steps = useMemo<DBMSWalkthroughStep[]>(() => {
    if (operation === 'selection') {
      return [
        {
          title: 'Start with Student',
          description: 'Selection keeps the rows that satisfy a predicate. The schema stays the same.',
          content: <Table name="Student" columns={['id', 'name', 'age']} rows={STUDENTS.map((student) => [student.id, student.name, student.age])} />,
        },
        {
          title: 'Apply σ_age ≥ 21',
          description: 'Ada and Grace satisfy the predicate; Linus does not.',
          content: <Table name="σ_age ≥ 21 (Student)" columns={['id', 'name', 'age']} rows={STUDENTS.map((student) => [student.id, student.name, student.age])} highlight={[0, 1]} />,
        },
        {
          title: 'Result',
          description: 'The result has fewer tuples but the same columns.',
          content: <Table name="Result" columns={['id', 'name', 'age']} rows={STUDENTS.filter((student) => student.age >= 21).map((student) => [student.id, student.name, student.age])} />,
        },
      ];
    }

    if (operation === 'projection') {
      return [
        {
          title: 'Start with Student',
          description: 'Projection chooses a subset of columns.',
          content: <Table name="Student" columns={['id', 'name', 'age']} rows={STUDENTS.map((student) => [student.id, student.name, student.age])} />,
        },
        {
          title: 'Keep only name',
          description: 'The id and age columns disappear. The rows now contain only names.',
          content: <Table name="π_name (Student)" columns={['name']} rows={STUDENTS.map((student) => [student.name])} />,
        },
        {
          title: 'Result',
          description: 'A relation is a set, so duplicate names would be removed. Here all three names are distinct.',
          content: <Table name="Result" columns={['name']} rows={Array.from(new Set(STUDENTS.map((student) => student.name))).map((name) => [name])} />,
        },
      ];
    }

    return [
      {
        title: 'Start with both relations',
        description: 'A join pairs rows from two relations and keeps the pairs that satisfy the join condition.',
        content: (
          <div className="grid gap-2 sm:grid-cols-2">
            <Table name="Student" columns={['id', 'name']} rows={STUDENTS.map((student) => [student.id, student.name])} />
            <Table name="Enroll" columns={['student_id', 'course_id', 'grade']} rows={ENROLL.map((item) => [item.student_id, item.course_id, item.grade])} />
          </div>
        ),
      },
      {
        title: 'Match Student.id = Enroll.student_id',
        description: 'Ada matches two enrollment rows; Grace matches one; Linus has no enrollment.',
        content: (
          <div className="grid gap-2 sm:grid-cols-2">
            <Table name="Student" columns={['id', 'name']} rows={STUDENTS.map((student) => [student.id, student.name])} highlight={[0, 1]} />
            <Table name="Enroll" columns={['student_id', 'course_id', 'grade']} rows={ENROLL.map((item) => [item.student_id, item.course_id, item.grade])} highlight={[0, 1, 2]} />
          </div>
        ),
      },
      {
        title: 'Result',
        description: 'The joined rows combine student and enrollment data.',
        content: (
          <Table
            name="Student ⋈ Enroll"
            columns={['id', 'name', 'course_id', 'grade']}
            rows={ENROLL.map((item) => {
              const student = STUDENTS.find((candidate) => candidate.id === item.student_id);
              return [student?.id ?? '', student?.name ?? '', item.course_id, item.grade];
            })}
          />
        ),
      },
    ];
  }, [operation]);

  return <StepPlayer steps={steps} />;
}
