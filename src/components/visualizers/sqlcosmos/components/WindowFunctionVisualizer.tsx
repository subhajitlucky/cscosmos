'use client';

import React, { useState } from 'react';
import { Table } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  dept: string;
  salary: number;
}

const EMPLOYEES: Employee[] = [
  { id: 1, name: 'Alice', dept: 'Engineering', salary: 120000 },
  { id: 2, name: 'Bob', dept: 'Engineering', salary: 120000 },
  { id: 3, name: 'Charlie', dept: 'Engineering', salary: 95000 },
  { id: 4, name: 'Diana', dept: 'Marketing', salary: 90000 },
  { id: 5, name: 'Ethan', dept: 'Marketing', salary: 85000 },
];

type WindowMode = 'ranking' | 'lag' | 'running-sum';

export function WindowFunctionVisualizer() {
  const [mode, setMode] = useState<WindowMode>('ranking');
  const [selectedRowId, setSelectedRowId] = useState<number>(2);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-muted-foreground">
              Analytical query processing
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Window Functions &amp; Frame Partitions Visualizer
            </h3>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          OVER (PARTITION BY dept ORDER BY salary DESC)
        </span>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'ranking' as const, name: '1. Ranking Functions', sub: 'ROW_NUMBER vs RANK vs DENSE_RANK' },
          { id: 'lag' as const, name: '2. LAG() / LEAD()', sub: 'Fetch previous row without self-joins' },
          { id: 'running-sum' as const, name: '3. Cumulative Running Total', sub: 'ROWS BETWEEN UNBOUNDED PRECEDING' },
        ].map((item) => {
          const isSelected = mode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`p-3.5 rounded-lg border text-left font-mono text-xs transition-colors ${
                isSelected
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                  : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
              }`}
            >
              <div className="font-bold">{item.name}</div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-background/80' : 'text-muted-foreground'}`}>
                {item.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Table with Partition Visual Highlight */}
      <div className="p-6 rounded-2xl bg-zinc-950 text-zinc-100 dark:bg-black border border-border/80 space-y-4 shadow-inner">
        <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-3">
          <span className="font-semibold text-zinc-300">Click any row to inspect its partition window frame:</span>
          <span className="text-emerald-400 font-mono font-semibold">
            Active: Row #{selectedRowId}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="p-2.5">Name</th>
                <th className="p-2.5">Department</th>
                <th className="p-2.5">Salary</th>
                {mode === 'ranking' && (
                  <>
                    <th className="p-2.5 text-zinc-200">ROW_NUMBER()</th>
                    <th className="p-2.5 text-zinc-200">RANK()</th>
                    <th className="p-2.5 text-emerald-400">DENSE_RANK()</th>
                  </>
                )}
                {mode === 'lag' && (
                  <th className="p-2.5 text-emerald-400">LAG(salary, 1)</th>
                )}
                {mode === 'running-sum' && (
                  <th className="p-2.5 text-emerald-400">Running Sum (Dept)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.map((emp, idx) => {
                const isSelected = emp.id === selectedRowId;

                return (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedRowId(emp.id)}
                    className={`border-b border-zinc-800/60 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-zinc-800/90 text-white font-bold'
                        : 'hover:bg-zinc-900/60 text-zinc-300'
                    }`}
                  >
                    <td className="p-2.5 font-medium">{emp.name}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-zinc-700 bg-zinc-900 text-zinc-300">
                        {emp.dept}
                      </span>
                    </td>
                    <td className="p-2.5">${emp.salary.toLocaleString()}</td>

                    {mode === 'ranking' && (
                      <>
                        <td className="p-2.5 text-zinc-300">
                          {idx === 0 ? '1' : idx === 1 ? '2' : idx === 2 ? '3' : idx === 3 ? '1' : '2'}
                        </td>
                        <td className="p-2.5 text-zinc-300">
                          {idx === 0 ? '1' : idx === 1 ? '1 (Tie)' : idx === 2 ? '3 (Gap)' : idx === 3 ? '1' : '2'}
                        </td>
                        <td className="p-2.5 text-emerald-400 font-semibold">
                          {idx === 0 ? '1' : idx === 1 ? '1 (Tie)' : idx === 2 ? '2 (No Gap)' : idx === 3 ? '1' : '2'}
                        </td>
                      </>
                    )}

                    {mode === 'lag' && (
                      <td className="p-2.5 text-emerald-400">
                        {idx === 0 || idx === 3 ? 'NULL (First in Dept)' : idx === 1 ? '$120,000' : idx === 2 ? '$120,000' : '$90,000'}
                      </td>
                    )}

                    {mode === 'running-sum' && (
                      <td className="p-2.5 text-emerald-400 font-semibold">
                        {idx === 0 ? '$120,000' : idx === 1 ? '$240,000' : idx === 2 ? '$335,000' : idx === 3 ? '$90,000' : '$175,000'}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
