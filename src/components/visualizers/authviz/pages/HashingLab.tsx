'use client';

import React from 'react';
import { PasswordHashingVisualizer } from '../components/PasswordHashingVisualizer';

export default function HashingLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Password Hashing &amp; GPU Resistance Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of memory-hard Argon2id, bcrypt salts, and GPU cluster brute-force resistance.
        </p>
      </div>

      <PasswordHashingVisualizer />
    </div>
  );
}
