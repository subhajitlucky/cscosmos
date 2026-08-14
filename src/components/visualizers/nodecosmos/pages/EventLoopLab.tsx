'use client';

import React from 'react';
import { LibuvEventLoopStepper } from '../components/LibuvEventLoopStepper';

export default function EventLoopLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Libuv 6-Phase Event Loop Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of Timers, Pending Callbacks, Poll, and Check phases with VIP microtask draining.
        </p>
      </div>

      <LibuvEventLoopStepper />
    </div>
  );
}
