'use client';

import { useId } from 'react';
import type { FaultKind } from '../data/concepts';

export interface FaultInjectorProps {
  value: FaultKind;
  onChange: (f: FaultKind) => void;
  disabled?: boolean;
}

const FAULTS: { value: FaultKind; label: string; hint: string }[] = [
  { value: 'none', label: 'No fault', hint: 'Baseline packet journey' },
  { value: 'loss', label: 'Packet loss', hint: 'Drop the reply and trigger retransmission' },
  { value: 'arpSpoof', label: 'ARP spoofing', hint: 'Redirect the frame to a forged MAC' },
  { value: 'mtu', label: 'MTU limit', hint: 'Fragmentation or ICMP fragmentation-needed' },
  { value: 'loop', label: 'Routing loop', hint: 'Cycle the packet until its TTL expires' },
];

export function FaultInjector({ value, onChange, disabled = false }: FaultInjectorProps) {
  const groupId = useId();

  return (
    <fieldset disabled={disabled} className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <legend id={`${groupId}-legend`} className="px-1 text-sm font-bold text-slate-900 dark:text-slate-100">
        Inject a fault
      </legend>
      <div role="radiogroup" aria-labelledby={`${groupId}-legend`} className="grid gap-2 sm:grid-cols-2">
        {FAULTS.map((fault) => (
          <div key={fault.value} className="flex items-start gap-2">
            <input
              type="radio"
              id={`${groupId}-${fault.value}`}
              name={groupId}
              value={fault.value}
              checked={value === fault.value}
              onChange={() => onChange(fault.value)}
              className="peer mt-1 h-4 w-4 shrink-0 accent-sky-600 dark:accent-sky-400"
            />
            <label
              htmlFor={`${groupId}-${fault.value}`}
              className="cursor-pointer rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-800 transition-colors motion-reduce:transition-none peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-600 peer-checked:border-sky-500 peer-checked:bg-sky-100 peer-checked:font-semibold peer-checked:text-sky-950 disabled:cursor-not-allowed dark:border-slate-600 dark:text-slate-200 dark:peer-focus-visible:outline-sky-400 dark:peer-checked:border-sky-400 dark:peer-checked:bg-sky-950 dark:peer-checked:text-sky-50"
            >
              <span className="block">{fault.label}</span>
              <span className="block text-xs opacity-90">{fault.hint}</span>
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
