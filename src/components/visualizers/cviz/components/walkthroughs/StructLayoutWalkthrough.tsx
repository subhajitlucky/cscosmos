'use client';

import React, { useMemo } from 'react';
import { StepPlayer, type CWalkthroughStep } from './StepPlayer';

interface Field {
  name: string;
  type: string;
  offset: number;
  size: number;
}

interface Padding {
  offset: number;
  size: number;
}

export function StructLayoutWalkthrough({
  name,
  fields,
  totalSize,
  padding = [],
}: {
  name: string;
  fields: Field[];
  totalSize: number;
  padding?: Padding[];
}) {
  const steps = useMemo<CWalkthroughStep[]>(() => {
    const bytes = Array.from({ length: totalSize }, (_, offset) => {
      const field = fields.find((item) => offset >= item.offset && offset < item.offset + item.size);
      const pad = padding.find((item) => offset >= item.offset && offset < item.offset + item.size);
      return { offset, field, pad };
    });

    const grid = (visibleFields: string[], showPadding: boolean, highlight?: string) => (
      <div className="grid grid-cols-8 gap-1">
        {bytes.map((byte) => {
          const active = highlight
            ? byte.field?.name === highlight
            : byte.field ? visibleFields.includes(byte.field.name) : showPadding && byte.pad;
          const label = byte.field?.name ?? (byte.pad ? 'pad' : '');
          return (
            <div
              key={byte.offset}
              className="flex aspect-square flex-col items-center justify-center rounded-md border font-mono text-[9px] font-bold"
              style={{
                borderColor: active ? 'var(--c-primary)' : 'var(--c-border)',
                backgroundColor: active ? 'var(--c-primary-soft)' : byte.pad ? 'var(--c-accent-soft)' : 'var(--c-surface-2)',
                color: active ? 'var(--c-primary)' : byte.pad ? 'var(--c-accent)' : 'var(--c-muted)',
              }}
            >
              <span>{byte.offset}</span>
              <span className="text-[7px] opacity-75">{label}</span>
            </div>
          );
        })}
      </div>
    );

    return [
      {
        title: `Declare struct ${name}`,
        description: `The compiler lays out the members in declaration order, inserting padding where alignment requires it.`,
        content: (
          <div className="space-y-3">
            <div className="rounded-lg border p-3 font-mono text-[10px]" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
              struct {name} {'{'}
              {fields.map((field) => ` ${field.type} ${field.name};`).join('')}
              {' };'}
            </div>
            {grid([], false)}
          </div>
        ),
      },
      ...fields.map((field) => ({
        title: `${field.type} ${field.name} at offset ${field.offset}`,
        description: `${field.name} occupies ${field.size} byte${field.size === 1 ? '' : 's'}, starting at offset ${field.offset}.`,
        content: (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border p-2 font-mono text-[10px]" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
                <div style={{ color: 'var(--c-muted)' }}>member</div>
                <div className="font-bold">{field.name}</div>
              </div>
              <div className="rounded-lg border p-2 font-mono text-[10px]" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
                <div style={{ color: 'var(--c-muted)' }}>offset</div>
                <div className="font-bold">{field.offset}</div>
              </div>
              <div className="rounded-lg border p-2 font-mono text-[10px]" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
                <div style={{ color: 'var(--c-muted)' }}>size</div>
                <div className="font-bold">{field.size} bytes</div>
              </div>
            </div>
            {grid([field.name], true, field.name)}
          </div>
        ),
      })),
      ...(padding.length > 0
        ? [
            {
              title: 'Padding keeps members aligned',
              description: `The compiler inserts ${padding.reduce((sum, item) => sum + item.size, 0)} padding byte${padding.reduce((sum, item) => sum + item.size, 0) === 1 ? '' : 's'} so the next member starts at an aligned offset.`,
              content: grid(fields.map((field) => field.name), true),
            },
          ]
        : []),
      {
        title: `sizeof(struct ${name}) = ${totalSize}`,
        description: `The struct is ${totalSize} bytes, including any padding. Always use sizeof instead of assuming the sum of the member sizes.`,
        content: (
          <div className="space-y-3">
            <div className="rounded-lg border p-3 font-mono text-lg font-black" style={{ borderColor: 'var(--c-primary)', backgroundColor: 'var(--c-primary-soft)', color: 'var(--c-primary)' }}>
              {totalSize} bytes
            </div>
            {grid(fields.map((field) => field.name), true)}
          </div>
        ),
      },
    ];
  }, [fields, name, padding, totalSize]);

  return <StepPlayer steps={steps} />;
}
