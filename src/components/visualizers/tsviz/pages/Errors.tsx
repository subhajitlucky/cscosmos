'use client';

import React from 'react';
import { TsErrorDebugger } from '../components/TsErrorDebugger';

export default function Errors() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          TypeScript Error Debugger
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Understand why cryptic TypeScript errors occur and how to resolve them with type-safe patterns.
        </p>
      </div>

      <TsErrorDebugger />
    </div>
  );
}
