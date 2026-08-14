'use client';

import React from 'react';
import { UtilityTypesLab } from '../components/UtilityTypesLab';

export default function UtilityLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          TypeScript Utility Types Interactive Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Explore and test built-in standard utility types with live before-and-after type transformations.
        </p>
      </div>

      <UtilityTypesLab />
    </div>
  );
}
