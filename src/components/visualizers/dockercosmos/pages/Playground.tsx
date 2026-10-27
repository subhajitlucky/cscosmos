'use client';

import React from 'react';
import { DockerCliPlayground } from '../components/DockerCliPlayground';

export default function Playground() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Docker &amp; Kubernetes CLI Simulator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Explore recorded docker and kubectl output in an in-browser terminal simulator — no real CLI runs and no cluster is contacted.
        </p>
      </div>

      <DockerCliPlayground />
    </div>
  );
}
