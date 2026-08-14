'use client';

import React from 'react';
import { GraphqlResolverVisualizer } from '../components/GraphqlResolverVisualizer';

export default function GraphqlLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          GraphQL Field Resolvers &amp; AST Pipeline Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of recursive field resolver execution, parent object delegation, and JSON serialization.
        </p>
      </div>

      <GraphqlResolverVisualizer />
    </div>
  );
}
