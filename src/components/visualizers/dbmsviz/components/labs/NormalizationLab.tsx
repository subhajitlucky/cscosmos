'use client';

import React, { useState } from 'react';
import { ArrowRight, Table2 } from 'lucide-react';

type Form = '1NF' | '2NF' | '3NF';

interface TableData {
  name: string;
  columns: string[];
  rows: (string | number)[][];
}

const EXAMPLES: Record<
  Form,
  { rule: string; note: string; before: TableData; after: TableData[] }
> = {
  '1NF': {
    rule: 'Atomic values, no repeating groups',
    note: 'The phone list is multivalued. Move it to a child table keyed by student_id and phone.',
    before: {
      name: 'Student (not 1NF)',
      columns: ['id', 'name', 'phones'],
      rows: [
        [1, 'Ada', '555-0100, 555-0101'],
        [2, 'Grace', '555-0200'],
      ],
    },
    after: [
      { name: 'Student', columns: ['id', 'name'], rows: [[1, 'Ada'], [2, 'Grace']] },
      { name: 'StudentPhone', columns: ['student_id', 'phone'], rows: [[1, '555-0100'], [1, '555-0101'], [2, '555-0200']] },
    ],
  },
  '2NF': {
    rule: 'No partial dependency on a composite key',
    note: 'student_name depends only on student_id; course_name depends only on course_id. Split them out.',
    before: {
      name: 'Enrollment (1NF, not 2NF)',
      columns: ['student_id', 'course_id', 'student_name', 'course_name', 'grade'],
      rows: [
        [1, 'C1', 'Ada', 'DBMS', 'A'],
        [1, 'C2', 'Ada', 'OS', 'B'],
        [2, 'C1', 'Grace', 'DBMS', 'A'],
      ],
    },
    after: [
      { name: 'Student', columns: ['student_id', 'student_name'], rows: [[1, 'Ada'], [2, 'Grace']] },
      { name: 'Course', columns: ['course_id', 'course_name'], rows: [['C1', 'DBMS'], ['C2', 'OS']] },
      { name: 'Enrollment', columns: ['student_id', 'course_id', 'grade'], rows: [[1, 'C1', 'A'], [1, 'C2', 'B'], [2, 'C1', 'A']] },
    ],
  },
  '3NF': {
    rule: 'No transitive dependency among non-key attributes',
    note: 'advisor_id determines advisor_name, and student_id determines advisor_id. Move the advisor into its own table.',
    before: {
      name: 'Student (2NF, not 3NF)',
      columns: ['student_id', 'student_name', 'advisor_id', 'advisor_name'],
      rows: [
        [1, 'Ada', 'A1', 'Dr. Hopper'],
        [2, 'Grace', 'A1', 'Dr. Hopper'],
        [3, 'Linus', 'A2', 'Dr. Turing'],
      ],
    },
    after: [
      { name: 'Student', columns: ['student_id', 'student_name', 'advisor_id'], rows: [[1, 'Ada', 'A1'], [2, 'Grace', 'A1'], [3, 'Linus', 'A2']] },
      { name: 'Advisor', columns: ['advisor_id', 'advisor_name'], rows: [['A1', 'Dr. Hopper'], ['A2', 'Dr. Turing']] },
    ],
  },
};

function TableCard({ table }: { table: TableData }) {
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
      <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
        <Table2 className="h-3.5 w-3.5" style={{ color: 'var(--db-primary)' }} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{table.name}</span>
      </div>
      <table className="w-full text-left text-[10px]">
        <thead>
          <tr className="font-mono uppercase tracking-wider" style={{ color: 'var(--db-muted)' }}>
            {table.columns.map((column) => (
              <th key={column} className="border-b px-2 py-1.5" style={{ borderColor: 'var(--db-border)' }}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, index) => (
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

export function NormalizationLab() {
  const [form, setForm] = useState<Form>('1NF');
  const example = EXAMPLES[form];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(['1NF', '2NF', '3NF'] as Form[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setForm(item)}
            className="rounded-lg border px-3 py-2 text-xs font-bold"
            style={{
              borderColor: form === item ? 'var(--db-primary)' : 'var(--db-border)',
              backgroundColor: form === item ? 'var(--db-primary-soft)' : 'var(--db-surface)',
              color: form === item ? 'var(--db-primary)' : 'var(--db-muted)',
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <TableCard table={example.before} />
          <div className="flex items-center justify-center gap-2 font-mono text-[10px]" style={{ color: 'var(--db-muted)' }}>
            <span>decompose</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span>{example.after.length} relation{example.after.length === 1 ? '' : 's'}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {example.after.map((table) => <TableCard key={table.name} table={table} />)}
          </div>
        </div>

        <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-surface)' }}>
          <h3 className="text-sm font-bold">{form}</h3>
          <p className="mt-1 font-mono text-[10px] font-bold" style={{ color: 'var(--db-primary)' }}>{example.rule}</p>
          <p className="mt-2 text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{example.note}</p>
        </div>
      </div>
    </div>
  );
}
