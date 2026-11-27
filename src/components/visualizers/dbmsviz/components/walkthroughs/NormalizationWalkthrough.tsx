'use client';

import React, { useMemo } from 'react';
import { Table2 } from 'lucide-react';
import { StepPlayer, type DBMSWalkthroughStep } from './StepPlayer';

type Form = '1NF' | '2NF' | '3NF';

interface TableData {
  name: string;
  columns: string[];
  rows: (string | number)[][];
}

function Table({ table }: { table: TableData }) {
  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
      <div className="flex items-center gap-2 border-b px-2.5 py-1.5" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
        <Table2 className="h-3 w-3" style={{ color: 'var(--db-primary)' }} />
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider">{table.name}</span>
      </div>
      <table className="w-full text-left text-[9px]">
        <thead>
          <tr className="font-mono uppercase" style={{ color: 'var(--db-muted)' }}>
            {table.columns.map((column) => <th key={column} className="border-b px-2 py-1" style={{ borderColor: 'var(--db-border)' }}>{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, index) => (
            <tr key={index} className="border-b last:border-b-0" style={{ borderColor: 'var(--db-border)' }}>
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-2 py-1 font-mono">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const EXAMPLES: Record<Form, { problem: string; rule: string; before: TableData; after: TableData[] }> = {
  '1NF': {
    rule: 'Atomic values',
    problem: 'The phones column contains a list. Split it into a child table with one phone per row.',
    before: { name: 'Student (not 1NF)', columns: ['id', 'name', 'phones'], rows: [[1, 'Ada', '555-0100, 555-0101'], [2, 'Grace', '555-0200']] },
    after: [
      { name: 'Student', columns: ['id', 'name'], rows: [[1, 'Ada'], [2, 'Grace']] },
      { name: 'StudentPhone', columns: ['student_id', 'phone'], rows: [[1, '555-0100'], [1, '555-0101'], [2, '555-0200']] },
    ],
  },
  '2NF': {
    rule: 'No partial dependency',
    problem: 'student_name depends only on student_id; course_name depends only on course_id. Split them out.',
    before: { name: 'Enrollment (1NF, not 2NF)', columns: ['student_id', 'course_id', 'student_name', 'course_name', 'grade'], rows: [[1, 'C1', 'Ada', 'DBMS', 'A'], [1, 'C2', 'Ada', 'OS', 'B'], [2, 'C1', 'Grace', 'DBMS', 'A']] },
    after: [
      { name: 'Student', columns: ['student_id', 'student_name'], rows: [[1, 'Ada'], [2, 'Grace']] },
      { name: 'Course', columns: ['course_id', 'course_name'], rows: [['C1', 'DBMS'], ['C2', 'OS']] },
      { name: 'Enrollment', columns: ['student_id', 'course_id', 'grade'], rows: [[1, 'C1', 'A'], [1, 'C2', 'B'], [2, 'C1', 'A']] },
    ],
  },
  '3NF': {
    rule: 'No transitive dependency',
    problem: 'advisor_id determines advisor_name, and student_id determines advisor_id. Move the advisor out.',
    before: { name: 'Student (2NF, not 3NF)', columns: ['student_id', 'student_name', 'advisor_id', 'advisor_name'], rows: [[1, 'Ada', 'A1', 'Dr. Hopper'], [2, 'Grace', 'A1', 'Dr. Hopper'], [3, 'Linus', 'A2', 'Dr. Turing']] },
    after: [
      { name: 'Student', columns: ['student_id', 'student_name', 'advisor_id'], rows: [[1, 'Ada', 'A1'], [2, 'Grace', 'A1'], [3, 'Linus', 'A2']] },
      { name: 'Advisor', columns: ['advisor_id', 'advisor_name'], rows: [['A1', 'Dr. Hopper'], ['A2', 'Dr. Turing']] },
    ],
  },
};

export function NormalizationWalkthrough({ form }: { form: Form }) {
  const steps = useMemo<DBMSWalkthroughStep[]>(() => {
    const example = EXAMPLES[form];
    return [
      {
        title: `Start with the ${form === '1NF' ? 'unnormalized' : `${form} target`} table`,
        description: `The table violates ${form}: ${example.rule.toLowerCase()}.`,
        content: <Table table={example.before} />,
      },
      {
        title: `The ${form} problem`,
        description: example.problem,
        content: (
          <div className="rounded-lg border p-3 text-[11px] leading-relaxed" style={{ borderColor: 'var(--db-danger)', backgroundColor: 'var(--db-danger-soft)', color: 'var(--db-danger)' }}>
            {example.problem}
          </div>
        ),
      },
      {
        title: `Decompose into ${form}`,
        description: `The decomposition stores each fact once. The result has ${example.after.length} relations.`,
        content: (
          <div className="grid gap-2 sm:grid-cols-2">
            {example.after.map((table) => <Table key={table.name} table={table} />)}
          </div>
        ),
      },
    ];
  }, [form]);

  return <StepPlayer steps={steps} />;
}
