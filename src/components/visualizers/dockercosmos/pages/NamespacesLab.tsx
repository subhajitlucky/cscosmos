'use client';

import React from 'react';
import { LinuxNamespacesVisualizer } from '../components/LinuxNamespacesVisualizer';

export default function NamespacesLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Linux Namespaces Isolation Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of PID, NET, MNT, UTS, IPC, and USER isolation boundaries.
        </p>
      </div>

      <LinuxNamespacesVisualizer />
    </div>
  );
}
