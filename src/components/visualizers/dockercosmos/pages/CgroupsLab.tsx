'use client';

import React from 'react';
import { CgroupsV2Visualizer } from '../components/CgroupsV2Visualizer';

export default function CgroupsLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          cgroups v2 &amp; OOM Killer Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of CPU CFS quotas, memory.max limits, and Linux Kernel Exit Code 137 OOM termination.
        </p>
      </div>

      <CgroupsV2Visualizer />
    </div>
  );
}
