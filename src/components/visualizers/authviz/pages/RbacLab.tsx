'use client';

import React from 'react';
import { RbacAbacVisualizer } from '../components/RbacAbacVisualizer';

export default function RbacLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          RBAC vs ABAC Policy Evaluation Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of static Role-Based permissions vs dynamic Attribute-Based contextual authorization.
        </p>
      </div>

      <RbacAbacVisualizer />
    </div>
  );
}
