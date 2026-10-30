'use client';

import React, { useState } from 'react';
import { ArrowRight, Database, Key, Table } from 'lucide-react';

interface ColumnSchema {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  references?: string;
  nullable: boolean;
}

interface TableSchema {
  name: string;
  description: string;
  columns: ColumnSchema[];
  rows: Record<string, string | number>[];
}

const SCHEMAS: TableSchema[] = [
  {
    name: 'users',
    description: 'Core user profiles with balance and role assignments.',
    columns: [
      { name: 'id', type: 'BIGINT', isPk: true, nullable: false },
      { name: 'name', type: 'VARCHAR(50)', nullable: false },
      { name: 'email', type: 'VARCHAR(255)', nullable: false },
      { name: 'role', type: 'VARCHAR(20)', nullable: false },
      { name: 'balance', type: 'NUMERIC(10, 2)', nullable: false },
    ],
    rows: [
      { id: 1, name: 'Alice', email: 'alice@test.com', role: 'developer', balance: 1450.0 },
      { id: 2, name: 'Bob', email: 'bob@test.com', role: 'designer', balance: 820.5 },
      { id: 3, name: 'Charlie', email: 'charlie@test.com', role: 'manager', balance: 3200.0 },
      { id: 4, name: 'David', email: 'david@test.com', role: 'developer', balance: 950.0 },
    ],
  },
  {
    name: 'orders',
    description: 'Transaction records referencing the purchasing user.',
    columns: [
      { name: 'id', type: 'BIGINT', isPk: true, nullable: false },
      { name: 'user_id', type: 'BIGINT', isFk: true, references: 'users(id)', nullable: false },
      { name: 'product', type: 'VARCHAR(100)', nullable: false },
      { name: 'total', type: 'NUMERIC(10, 2)', nullable: false },
      { name: 'status', type: 'VARCHAR(20)', nullable: false },
    ],
    rows: [
      { id: 101, user_id: 1, product: 'Mechanical Keyboard', total: 140.0, status: 'completed' },
      { id: 102, user_id: 1, product: '4K Monitor', total: 450.0, status: 'completed' },
      { id: 103, user_id: 2, product: 'Ergonomic Mouse', total: 85.0, status: 'completed' },
      { id: 104, user_id: 3, product: 'Standing Desk', total: 600.0, status: 'pending' },
    ],
  },
];

export function SchemaErVisualizer() {
  const [selectedTable, setSelectedTable] = useState<string>('users');

  const currentTable = SCHEMAS.find((t) => t.name === selectedTable) || SCHEMAS[0];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-muted-foreground">
              Schema Architecture
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Relational Schema &amp; Foreign Key Entity Diagram
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          Interactive Schema Explorer
        </span>
      </div>

      {/* ER Diagram Link Visualizer */}
      <div className="grid md:grid-cols-2 gap-4">
        {SCHEMAS.map((table) => {
          const isSelected = selectedTable === table.name;
          return (
            <div
              key={table.name}
              onClick={() => setSelectedTable(table.name)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-foreground/50 bg-muted/30 shadow-xs'
                  : 'border-border bg-card hover:bg-muted/20'
              }`}
            >
              <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono font-bold text-sm text-foreground">{table.name}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {table.rows.length} rows
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {table.columns.map((col) => (
                  <div key={col.name} className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5">
                      {col.isPk && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[9px]">
                          PK
                        </span>
                      )}
                      {col.isFk && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[9px]">
                          FK
                        </span>
                      )}
                      <span className="text-foreground">{col.name}</span>
                    </div>
                    <span className="text-zinc-500 text-[11px]">{col.type}</span>
                  </div>
                ))}
              </div>

              {table.name === 'orders' && (
                <div className="mt-3 pt-2 border-t border-border/60 flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  <span>Relationship:</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>orders.user_id references users(id)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Table Data Viewer */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-muted-foreground border-b border-border pb-2">
          <span>Active Table Data Preview: <strong>{currentTable.name}</strong></span>
          <span className="text-[11px]">{currentTable.description}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-zinc-950 text-zinc-100 dark:bg-black p-4">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                {currentTable.columns.map((col) => (
                  <th key={col.name} className="p-2">
                    {col.name}
                    {col.isPk && <span className="text-amber-400 ml-1 text-[9px]">(PK)</span>}
                    {col.isFk && <span className="text-emerald-400 ml-1 text-[9px]">(FK)</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTable.rows.map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                  {currentTable.columns.map((col) => (
                    <td key={col.name} className="p-2 text-zinc-200">
                      {String(row[col.name])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
