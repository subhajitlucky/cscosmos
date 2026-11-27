'use client';

import React, { useState } from 'react';
import { ArrowRight, Database, Table2 } from 'lucide-react';

type Cardinality = '1:1' | '1:N' | 'M:N';

const CARDS: { id: Cardinality; label: string; mapping: string; note: string }[] = [
  {
    id: '1:1',
    label: '1 : 1',
    mapping: 'Add the foreign key to one side',
    note: 'Each student has at most one profile, and each profile belongs to one student. Put profile_id on Student, or student_id on Profile, and add a UNIQUE constraint.',
  },
  {
    id: '1:N',
    label: '1 : N',
    mapping: 'Add the foreign key to the many side',
    note: 'One course has many students; each student takes at most one course in this simplified model. Put course_id on Student. No junction table is needed.',
  },
  {
    id: 'M:N',
    label: 'M : N',
    mapping: 'Create a junction table',
    note: 'Many students take many courses. Create Enroll(student_id, course_id) with foreign keys to both sides. The composite key prevents duplicate enrollments.',
  },
];

function TableCard({
  name,
  columns,
  rows,
  highlight,
}: {
  name: string;
  columns: string[];
  rows: string[][];
  highlight?: string[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
      <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
        <Table2 className="h-3.5 w-3.5" style={{ color: 'var(--db-primary)' }} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{name}</span>
      </div>
      <table className="w-full text-left text-[10px]">
        <thead>
          <tr className="font-mono uppercase tracking-wider" style={{ color: 'var(--db-muted)' }}>
            {columns.map((column) => (
              <th
                key={column}
                className="border-b px-2 py-1.5"
                style={{
                  borderColor: 'var(--db-border)',
                  backgroundColor: highlight?.includes(column) ? 'var(--db-primary-soft)' : 'transparent',
                  color: highlight?.includes(column) ? 'var(--db-primary)' : 'var(--db-muted)',
                }}
              >
                {column}
              </th>
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

export function CardinalityLab() {
  const [cardinality, setCardinality] = useState<Cardinality>('M:N');
  const selected = CARDS.find((card) => card.id === cardinality) ?? CARDS[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setCardinality(card.id)}
            className="rounded-lg border px-3 py-2 text-xs font-bold"
            style={{
              borderColor: cardinality === card.id ? 'var(--db-primary)' : 'var(--db-border)',
              backgroundColor: cardinality === card.id ? 'var(--db-primary-soft)' : 'var(--db-surface)',
              color: cardinality === card.id ? 'var(--db-primary)' : 'var(--db-muted)',
            }}
          >
            {card.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
            <div className="mb-3 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
              <span className="rounded-lg border px-3 py-2 font-bold" style={{ borderColor: 'var(--db-primary)', color: 'var(--db-primary)' }}>Student</span>
              <span className="text-[10px]" style={{ color: 'var(--db-muted)' }}>— enrolls —</span>
              <span className="rounded-lg border px-3 py-2 font-bold" style={{ borderColor: 'var(--db-accent)', color: 'var(--db-accent)' }}>Course</span>
              <span className="rounded-full border px-2 py-0.5 text-[9px] font-bold" style={{ borderColor: 'var(--db-border)', color: 'var(--db-muted)' }}>{selected.label}</span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{selected.note}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {cardinality === '1:1' && (
              <>
                <TableCard name="Student" columns={['id', 'name', 'profile_id (FK, UNIQUE)']} rows={[['1', 'Ada', 'P1'], ['2', 'Grace', 'P2']]} highlight={['profile_id (FK, UNIQUE)']} />
                <TableCard name="Profile" columns={['id', 'bio']} rows={[['P1', '...'], ['P2', '...']]} />
              </>
            )}
            {cardinality === '1:N' && (
              <>
                <TableCard name="Student" columns={['id', 'name', 'course_id (FK)']} rows={[['1', 'Ada', 'C1'], ['2', 'Grace', 'C1'], ['3', 'Linus', 'C2']]} highlight={['course_id (FK)']} />
                <TableCard name="Course" columns={['id', 'title']} rows={[['C1', 'DBMS'], ['C2', 'OS']]} />
              </>
            )}
            {cardinality === 'M:N' && (
              <>
                <TableCard name="Student" columns={['id', 'name']} rows={[['1', 'Ada'], ['2', 'Grace']]} />
                <TableCard name="Enroll" columns={['student_id (FK)', 'course_id (FK)']} rows={[['1', 'C1'], ['1', 'C2'], ['2', 'C1']]} highlight={['student_id (FK)', 'course_id (FK)']} />
                <TableCard name="Course" columns={['id', 'title']} rows={[['C1', 'DBMS'], ['C2', 'OS']]} />
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--db-border-strong)', backgroundColor: 'var(--db-surface)' }}>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" style={{ color: 'var(--db-primary)' }} />
              <h3 className="text-sm font-bold">Relational mapping</h3>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{selected.mapping}</p>
            <div className="mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[10px]" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)' }}>
              <span>ERD</span>
              <ArrowRight className="h-3 w-3" style={{ color: 'var(--db-muted)' }} />
              <span>tables</span>
            </div>
          </div>
          <div className="rounded-2xl border p-4 text-[11px] leading-relaxed" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface-2)', color: 'var(--db-muted)' }}>
            <strong style={{ color: 'var(--db-text)' }}>Rule:</strong> a 1:N relationship becomes a foreign key on the many side; an M:N relationship becomes a junction table.
          </div>
        </div>
      </div>
    </div>
  );
}
