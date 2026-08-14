'use client';

import React from 'react';
import { DockerCliPlayground } from '../components/DockerCliPlayground';

export default function Playground() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Docker &amp; Kubernetes CLI Sandbox
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Execute Docker commands and kubectl cluster queries in an in-browser sandbox terminal.
        </p>
      </div>

      <DockerCliPlayground />
    </div>
  );
}
