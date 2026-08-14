'use client';

import React from 'react';
import { SessionVsTokenVisualizer } from '../components/SessionVsTokenVisualizer';

export default function SessionLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          HttpOnly Cookies vs LocalStorage Tokens Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of XSS token theft vectors vs browser-enforced HttpOnly SameSite cookie defenses.
        </p>
      </div>

      <SessionVsTokenVisualizer />
    </div>
  );
}
