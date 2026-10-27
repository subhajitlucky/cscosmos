'use client';

import React from 'react';
import { SqlPlayground } from '../components/SqlPlayground';

export default function Playground() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Interactive SQL Playground
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Write SQL against the in-memory users and orders tables and see exactly which rows this small
          evaluator returns — no database server is involved.
        </p>
      </div>

      <SqlPlayground />
    </div>
  );
}
