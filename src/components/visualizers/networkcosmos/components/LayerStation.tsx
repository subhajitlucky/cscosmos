'use client';

import type * as React from 'react';
import { isPassiveLayer, simLayerToOsi } from './layers';

export interface LayerStationProps {
  layer: string;
  active: boolean;
  children?: React.ReactNode;
  note?: string;
}

export function LayerStation({ layer, active, children, note }: LayerStationProps) {
  const label = simLayerToOsi(layer);
  const passive = isPassiveLayer(label);

  return (
    <div
      role="group"
      aria-label={`${label} layer${passive ? ', passive' : ''}${active ? ', active' : ''}`}
      aria-current={active ? 'step' : undefined}
      className={`rounded-md border p-2 transition-colors duration-200 motion-reduce:transition-none ${
        active
          ? 'border-sky-500 bg-sky-100 text-sky-950 dark:border-sky-400 dark:bg-sky-950 dark:text-sky-50'
          : passive
            ? 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400'
            : 'border-slate-300 bg-white text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-1">
        <span className="text-sm font-bold">{label}</span>
        {passive && <span className="text-xs font-medium">passive</span>}
        {active && <span className="text-xs font-bold">active</span>}
      </div>
      {note && <p className="mt-0.5 text-xs leading-snug opacity-90">{note}</p>}
      {children}
    </div>
  );
}
