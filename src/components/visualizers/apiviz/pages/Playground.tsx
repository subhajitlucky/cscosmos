'use client';

import React from 'react';
import { ApiPlayground } from '../components/ApiPlayground';

export default function Playground() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          API Request Client Sandbox
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive query builder and mock API runner for GraphQL and REST endpoint execution.
        </p>
      </div>

      <ApiPlayground />
    </div>
  );
}
