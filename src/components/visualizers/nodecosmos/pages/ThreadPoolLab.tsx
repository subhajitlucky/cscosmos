'use client';

import React from 'react';
import { ThreadPoolVisualizer } from '../components/ThreadPoolVisualizer';
import { ClusterVsWorkerLab } from '../components/ClusterVsWorkerLab';

export default function ThreadPoolLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Libuv Thread Pool &amp; Concurrency Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of UV_THREADPOOL_SIZE worker thread dispatching, multi-process clustering, and worker threads.
        </p>
      </div>

      <ThreadPoolVisualizer />
      <ClusterVsWorkerLab />
    </div>
  );
}
