'use client';

import React from 'react';
import { OverlayFsLayersVisualizer } from '../components/OverlayFsLayersVisualizer';

export default function OverlayFsLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          OverlayFS Layered Storage Driver Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive simulation of lowerdir image layers, upperdir container layers, and Copy-on-Write (CoW).
        </p>
      </div>

      <OverlayFsLayersVisualizer />
    </div>
  );
}
