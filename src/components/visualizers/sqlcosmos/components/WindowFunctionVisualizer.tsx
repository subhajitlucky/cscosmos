'use client';

import React, { useState } from 'react';
import { Database, Filter, Layers, Play, Sparkles, Table, Zap } from 'lucide-react';

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
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Advanced Analytical SQL
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Window Functions &amp; Frame Partitions Visualizer
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          OVER (PARTITION BY dept ORDER BY salary DESC)
        </span>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'ranking' as const, name: '1. Ranking Functions', sub: 'ROW_NUMBER vs RANK vs DENSE_RANK' },
          { id: 'lag' as const, name: '2. LAG() / LEAD()', sub: 'Fetch previous row without self-joins' },
          { id: 'running-sum' as const, name: '3. Cumulative Running Total', sub: 'ROWS BETWEEN UNBOUNDED PRECEDING' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              mode === item.id
                ? 'bg-indigo-600 text-white shadow-md border-indigo-500 font-bold'
                : 'bg-card border-border text-foreground hover:border-indigo-500'
            }`}
          >
            <div className="font-bold">{item.name}</div>
            <div className={`text-[10px] ${mode === item.id ? 'text-indigo-100' : 'text-muted-foreground'}`}>
              {item.sub}
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Table with Partition Visual Highlight */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between text-xs border-b border-border pb-3">
          <span className="font-bold text-foreground">Click any row to inspect its partition window frame:</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">
            Active: Row #{selectedRowId}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="p-2.5">Name</th>
                <th className="p-2.5">Department</th>
                <th className="p-2.5">Salary</th>
                {mode === 'ranking' && (
                  <>
                    <th className="p-2.5 text-indigo-500">ROW_NUMBER()</th>
                    <th className="p-2.5 text-purple-500">RANK()</th>
                    <th className="p-2.5 text-emerald-500">DENSE_RANK()</th>
                  </>
                )}
                {mode === 'lag' && (
                  <th className="p-2.5 text-emerald-500">LAG(salary, 1)</th>
                )}
                {mode === 'running-sum' && (
                  <th className="p-2.5 text-emerald-500">Running Sum (Dept)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.map((emp, idx) => {
                const isSelected = emp.id === selectedRowId;
                const isEng = emp.dept === 'Engineering';

                return (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedRowId(emp.id)}
                    className={`border-b border-border/50 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-600/15 font-bold'
                        : isEng
                        ? 'bg-blue-500/5 hover:bg-blue-500/10'
                        : 'bg-amber-500/5 hover:bg-amber-500/10'
                    }`}
                  >
                    <td className="p-2.5 text-foreground">{emp.name}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isEng ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      }`}>
                        {emp.dept}
                      </span>
                    </td>
                    <td className="p-2.5 text-foreground">${emp.salary.toLocaleString()}</td>

                    {mode === 'ranking' && (
                      <>
                        <td className="p-2.5 text-indigo-600 dark:text-indigo-400">
                          {idx === 0 ? '1' : idx === 1 ? '2' : idx === 2 ? '3' : idx === 3 ? '1' : '2'}
                        </td>
                        <td className="p-2.5 text-purple-600 dark:text-purple-400">
                          {idx === 0 ? '1' : idx === 1 ? '1 (Tie)' : idx === 2 ? '3 (Gap)' : idx === 3 ? '1' : '2'}
                        </td>
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400">
                          {idx === 0 ? '1' : idx === 1 ? '1 (Tie)' : idx === 2 ? '2 (No Gap)' : idx === 3 ? '1' : '2'}
                        </td>
                      </>
                    )}

                    {mode === 'lag' && (
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400">
                        {idx === 0 || idx === 3 ? 'NULL (First in Dept)' : idx === 1 ? '$120,000' : idx === 2 ? '$120,000' : '$90,000'}
                      </td>
                    )}

                    {mode === 'running-sum' && (
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
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
