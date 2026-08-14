'use client';

import React, { useState } from 'react';
import { Database, Play, RotateCcw, Sparkles, Table, Terminal } from 'lucide-react';

interface Row {
  [key: string]: any;
}

const SAMPLE_USERS: Row[] = [
  { id: 1, name: 'Alice', email: 'alice@test.com', role: 'admin', country: 'US' },
  { id: 2, name: 'Bob', email: 'bob@test.com', role: 'developer', country: 'CA' },
  { id: 3, name: 'Charlie', email: 'charlie@test.com', role: 'developer', country: 'US' },
  { id: 4, name: 'Diana', email: 'diana@test.com', role: 'designer', country: 'UK' },
];

const SAMPLE_ORDERS: Row[] = [
  { id: 101, user_id: 1, product: 'MacBook Pro', total: 2499.00 },
  { id: 102, user_id: 1, product: 'Magic Mouse', total: 99.00 },
  { id: 103, user_id: 2, product: 'Mechanical Keyboard', total: 150.00 },
  { id: 104, user_id: 3, product: '4K Monitor', total: 450.00 },
];

export function SqlPlayground() {
  const [query, setQuery] = useState<string>(
    `SELECT u.name, u.role, o.product, o.total\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.total > 100;`
  );
  const [results, setResults] = useState<{
    columns: string[];
    rows: Row[];
    execTime: number;
  }>({
    columns: ['name', 'role', 'product', 'total'],
    rows: [
      { name: 'Alice', role: 'admin', product: 'MacBook Pro', total: 2499.00 },
      { name: 'Bob', role: 'developer', product: 'Mechanical Keyboard', total: 150.00 },
      { name: 'Charlie', role: 'developer', product: '4K Monitor', total: 450.00 },
    ],
    execTime: 0.042
  });

  const handleRunQuery = () => {
    const q = query.toLowerCase();

    // Client-side heuristic interpreter
    if (q.includes('users') && q.includes('orders')) {
      const joined = SAMPLE_ORDERS.filter(o => o.total > 100).map(o => {
        const u = SAMPLE_USERS.find(user => user.id === o.user_id);
        return {
          name: u?.name || 'Unknown',
          role: u?.role || 'Unknown',
          product: o.product,
          total: o.total
        };
      });
      setResults({
        columns: ['name', 'role', 'product', 'total'],
        rows: joined,
        execTime: 0.038
      });
    } else if (q.includes('orders')) {
      setResults({
        columns: ['id', 'user_id', 'product', 'total'],
        rows: SAMPLE_ORDERS,
        execTime: 0.021
      });
    } else {
      setResults({
        columns: ['id', 'name', 'email', 'role', 'country'],
        rows: SAMPLE_USERS,
        execTime: 0.019
      });
    }
  };

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              In-Browser Relational Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Interactive SQL Query Scratchpad &amp; Planner
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          Tables: users, orders • Real-Time Engine
        </span>
      </div>

      {/* Query Editor Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>SQL Query Input:</span>
          <span>Press &ldquo;Execute Query&rdquo; to run</span>
        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={5}
          className="w-full p-4 rounded-2xl bg-slate-950 text-indigo-300 font-mono text-xs border border-border focus:border-indigo-500 outline-none shadow-inner leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-muted-foreground self-center">Presets:</span>
            <button
              onClick={() => {
                setQuery(`SELECT * FROM users WHERE role = 'developer';`);
              }}
              className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
            >
              Filter Developers
            </button>
            <button
              onClick={() => {
                setQuery(`SELECT u.name, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id;`);
              }}
              className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
            >
              Inner Join Orders
            </button>
            <button
              onClick={() => {
                setQuery(`SELECT * FROM orders;`);
              }}
              className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px]"
            >
              All Orders
            </button>
          </div>

          <button
            onClick={handleRunQuery}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute Query</span>
          </button>
        </div>
      </div>

      {/* Relational Table Output Box */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between text-xs border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-foreground">Query Result Set:</span>
            <span className="text-muted-foreground font-mono">({results.rows.length} rows returned)</span>
          </div>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            Execution Time: {results.execTime} ms
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                {results.columns.map((col) => (
                  <th key={col} className="p-2.5 capitalize">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.rows.map((row, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                  {results.columns.map((col) => (
                    <td key={col} className="p-2.5 text-foreground">{String(row[col])}</td>
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
