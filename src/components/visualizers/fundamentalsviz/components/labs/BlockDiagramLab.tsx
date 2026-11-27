'use client';

import React, { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Cpu, HardDrive, Monitor, MousePointer2, Sigma } from 'lucide-react';

const UNITS = [
  {
    id: 'input',
    title: 'Input unit',
    icon: MousePointer2,
    text: 'Takes data and instructions from the outside world and converts them into a form the computer can process.',
    examples: 'Keyboard · mouse · scanner · microphone',
  },
  {
    id: 'memory',
    title: 'Memory unit',
    icon: HardDrive,
    text: 'Stores the program and its data while the computer runs. It holds both instructions and values, which is the stored-program idea.',
    examples: 'Registers · cache · RAM · secondary storage',
  },
  {
    id: 'alu',
    title: 'ALU',
    icon: Sigma,
    text: 'Performs arithmetic and logical operations: add, subtract, compare, AND, OR, and shift. It works on values supplied by registers.',
    examples: 'Addition · comparison · bitwise logic',
  },
  {
    id: 'control',
    title: 'Control unit',
    icon: Cpu,
    text: 'Fetches each instruction, decodes it, and sends control signals to the other units. It is the conductor, not the calculator.',
    examples: 'Program counter · instruction register · control signals',
  },
  {
    id: 'output',
    title: 'Output unit',
    icon: Monitor,
    text: 'Converts the result into a form people or other systems can use: text on a screen, a printed page, sound, or a saved file.',
    examples: 'Monitor · printer · speaker · file',
  },
];

export function BlockDiagramLab() {
  const [active, setActive] = useState('control');
  const selected = UNITS.find((unit) => unit.id === active) ?? UNITS[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="grid gap-2">
          {['input', 'memory'].map((id) => {
            const unit = UNITS.find((item) => item.id === id)!;
            const Icon = unit.icon;
            return (
              <button key={id} type="button" onClick={() => setActive(id)} className="flex items-center gap-3 border px-3 py-3 text-left" style={{ borderColor: active === id ? 'var(--it-primary)' : 'var(--it-border)', backgroundColor: active === id ? 'var(--it-primary-soft)' : 'var(--it-surface)' }}>
                <Icon className="h-4 w-4" style={{ color: active === id ? 'var(--it-primary)' : 'var(--it-muted)' }} />
                <span className="text-[13px] font-semibold">{unit.title}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden flex-col items-center gap-1 sm:flex" aria-hidden="true">
          <ArrowRight className="h-4 w-4" style={{ color: 'var(--it-border-strong)' }} />
          <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>bus</span>
          <ArrowLeft className="h-4 w-4" style={{ color: 'var(--it-border-strong)' }} />
        </div>

        <div className="grid gap-2">
          {['alu', 'control'].map((id) => {
            const unit = UNITS.find((item) => item.id === id)!;
            const Icon = unit.icon;
            return (
              <button key={id} type="button" onClick={() => setActive(id)} className="flex items-center gap-3 border px-3 py-3 text-left" style={{ borderColor: active === id ? 'var(--it-primary)' : 'var(--it-border)', backgroundColor: active === id ? 'var(--it-primary-soft)' : 'var(--it-surface)' }}>
                <Icon className="h-4 w-4" style={{ color: active === id ? 'var(--it-primary)' : 'var(--it-muted)' }} />
                <span className="text-[13px] font-semibold">{unit.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center" aria-hidden="true">
        <ArrowDown className="h-4 w-4" style={{ color: 'var(--it-border-strong)' }} />
      </div>

      <button type="button" onClick={() => setActive('output')} className="flex w-full items-center justify-center gap-3 border px-3 py-3" style={{ borderColor: active === 'output' ? 'var(--it-primary)' : 'var(--it-border)', backgroundColor: active === 'output' ? 'var(--it-primary-soft)' : 'var(--it-surface)' }}>
        <Monitor className="h-4 w-4" style={{ color: active === 'output' ? 'var(--it-primary)' : 'var(--it-muted)' }} />
        <span className="text-[13px] font-semibold">Output unit</span>
      </button>

      <div className="border p-4" style={{ borderColor: 'var(--it-border-strong)', backgroundColor: 'var(--it-surface)' }}>
        <p className="it-kicker text-[10px]" style={{ color: 'var(--it-primary)' }}>{selected.title}</p>
        <p className="mt-2 text-[14px] leading-relaxed">{selected.text}</p>
        <p className="it-mono mt-2 text-[10px]" style={{ color: 'var(--it-muted)' }}>{selected.examples}</p>
      </div>

      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
        The <strong>control unit</strong> fetches and decodes; the <strong>ALU</strong> computes; <strong>memory</strong> holds
        instructions and data; input and output connect the machine to the world. The buses carry addresses, data, and
        control signals between them.
      </p>
    </div>
  );
}
