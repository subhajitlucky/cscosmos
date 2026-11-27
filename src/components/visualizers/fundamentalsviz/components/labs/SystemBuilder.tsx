'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, Check, Cpu, HardDrive, MemoryStick, Monitor } from 'lucide-react';

type CPU = 'basic' | 'mid' | 'pro';
type RAM = '8' | '16' | '32';
type Storage = 'hdd' | 'ssd' | 'nvme';
type GPU = 'integrated' | 'entry' | 'pro';
type Workload = 'office' | 'gaming' | 'video';

const CPU_OPTIONS: { id: CPU; label: string; score: number; price: number }[] = [
  { id: 'basic', label: '4-core · everyday', score: 3, price: 80 },
  { id: 'mid', label: '8-core · multitasking', score: 6, price: 180 },
  { id: 'pro', label: '12-core · heavy work', score: 9, price: 350 },
];
const RAM_OPTIONS: { id: RAM; label: string; score: number; price: number }[] = [
  { id: '8', label: '8 GB', score: 3, price: 35 },
  { id: '16', label: '16 GB', score: 6, price: 70 },
  { id: '32', label: '32 GB', score: 9, price: 140 },
];
const STORAGE_OPTIONS: { id: Storage; label: string; score: number; price: number }[] = [
  { id: 'hdd', label: '1 TB hard disk', score: 2, price: 45 },
  { id: 'ssd', label: '1 TB SATA SSD', score: 6, price: 90 },
  { id: 'nvme', label: '1 TB NVMe SSD', score: 9, price: 140 },
];
const GPU_OPTIONS: { id: GPU; label: string; score: number; price: number }[] = [
  { id: 'integrated', label: 'Integrated graphics', score: 2, price: 0 },
  { id: 'entry', label: 'Entry discrete GPU', score: 5, price: 180 },
  { id: 'pro', label: 'Workstation GPU', score: 9, price: 520 },
];
const WORKLOADS: Record<Workload, { label: string; target: { cpu: number; ram: number; storage: number; gpu: number } }> = {
  office: { label: 'Office & browsing', target: { cpu: 4, ram: 4, storage: 5, gpu: 1 } },
  gaming: { label: 'Gaming', target: { cpu: 6, ram: 6, storage: 7, gpu: 8 } },
  video: { label: 'Video editing', target: { cpu: 8, ram: 8, storage: 8, gpu: 5 } },
};

function find<T extends string, O extends { id: T }>(options: O[], id: T): O {
  return options.find((option) => option.id === id) ?? options[0];
}

export function SystemBuilder() {
  const [cpu, setCpu] = useState<CPU>('mid');
  const [ram, setRam] = useState<RAM>('16');
  const [storage, setStorage] = useState<Storage>('ssd');
  const [gpu, setGpu] = useState<GPU>('entry');
  const [workload, setWorkload] = useState<Workload>('office');

  const result = useMemo(() => {
    const selected = {
      cpu: find(CPU_OPTIONS, cpu),
      ram: find(RAM_OPTIONS, ram),
      storage: find(STORAGE_OPTIONS, storage),
      gpu: find(GPU_OPTIONS, gpu),
    };
    const target = WORKLOADS[workload].target;
    const parts = [
      { key: 'cpu' as const, label: 'CPU', score: selected.cpu.score, target: target.cpu, icon: Cpu, price: selected.cpu.price },
      { key: 'ram' as const, label: 'Memory', score: selected.ram.score, target: target.ram, icon: MemoryStick, price: selected.ram.price },
      { key: 'storage' as const, label: 'Storage', score: selected.storage.score, target: target.storage, icon: HardDrive, price: selected.storage.price },
      { key: 'gpu' as const, label: 'Graphics', score: selected.gpu.score, target: target.gpu, icon: Monitor, price: selected.gpu.price },
    ];
    const bottlenecks = parts.filter((part) => part.score < part.target);
    const price = parts.reduce((total, part) => total + part.price, 0);
    return { parts, bottlenecks, price, target };
  }, [cpu, gpu, ram, storage, workload]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Workload', node: <select value={workload} onChange={(event) => setWorkload(event.target.value as Workload)} className="it-select" aria-label="Workload">{(Object.keys(WORKLOADS) as Workload[]).map((id) => <option key={id} value={id}>{WORKLOADS[id].label}</option>)}</select> },
          { label: 'CPU', node: <select value={cpu} onChange={(event) => setCpu(event.target.value as CPU)} className="it-select" aria-label="CPU">{CPU_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select> },
          { label: 'Memory', node: <select value={ram} onChange={(event) => setRam(event.target.value as RAM)} className="it-select" aria-label="Memory">{RAM_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select> },
          { label: 'Storage', node: <select value={storage} onChange={(event) => setStorage(event.target.value as Storage)} className="it-select" aria-label="Storage">{STORAGE_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select> },
          { label: 'Graphics', node: <select value={gpu} onChange={(event) => setGpu(event.target.value as GPU)} className="it-select" aria-label="Graphics">{GPU_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select> },
        ].map((field) => (
          <label key={field.label} className="block border p-3" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
            <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>{field.label}</span>
            <span className="mt-1 block">{field.node}</span>
          </label>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="border" style={{ borderColor: 'var(--it-border)' }}>
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
            <h3 className="text-sm font-bold">Fit against {WORKLOADS[workload].label.toLowerCase()}</h3>
            <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{result.bottlenecks.length === 0 ? 'balanced' : `${result.bottlenecks.length} bottleneck${result.bottlenecks.length === 1 ? '' : 's'}`}</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--it-border)' }}>
            {result.parts.map((part) => {
              const Icon = part.icon;
              const percent = Math.min(100, (part.score / part.target) * 100);
              const short = part.score < part.target;
              return (
                <div key={part.key} className="grid gap-2 px-4 py-4 sm:grid-cols-[130px_1fr_70px]" style={{ borderColor: 'var(--it-border)' }}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: short ? 'var(--it-warn)' : 'var(--it-ok)' }} />
                    <span className="text-[12px] font-semibold">{part.label}</span>
                  </div>
                  <div className="self-center">
                    <div className="it-progress-track">
                      <div className="it-progress-fill" style={{ width: `${percent}%`, backgroundColor: short ? 'var(--it-warn)' : 'var(--it-ok)' }} />
                    </div>
                  </div>
                  <div className="it-mono text-right text-[9px]" style={{ color: short ? 'var(--it-warn)' : 'var(--it-ok)' }}>{part.score} / {part.target}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="border p-4" style={{ borderColor: 'var(--it-border-strong)', backgroundColor: 'var(--it-surface)' }}>
            <p className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Estimated build</p>
            <div className="it-num mt-1 text-4xl">${result.price}</div>
            <p className="mt-2 text-[11px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>Component cost only; case, power supply, and assembly are extra.</p>
          </div>

          <div className="border p-4" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
            <div className="flex items-center gap-2">
              {result.bottlenecks.length === 0 ? <Check className="h-4 w-4" style={{ color: 'var(--it-ok)' }} /> : <AlertTriangle className="h-4 w-4" style={{ color: 'var(--it-warn)' }} />}
              <h3 className="text-sm font-bold">Verdict</h3>
            </div>
            {result.bottlenecks.length === 0 ? (
              <p className="mt-2 text-[11px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>This build meets every target for the selected workload. Spending more will not remove a limiting component.</p>
            ) : (
              <>
                <p className="mt-2 text-[11px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>The limiting component is <strong style={{ color: 'var(--it-text)' }}>{result.bottlenecks[0].label}</strong>. Upgrade that before adding capacity elsewhere.</p>
                <ul className="mt-2 space-y-1">
                  {result.bottlenecks.map((part) => <li key={part.key} className="it-mono text-[9px]" style={{ color: 'var(--it-warn)' }}>↑ {part.label}</li>)}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
