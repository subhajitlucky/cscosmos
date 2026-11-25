'use client';

// Presentation primitives shared by the concept widgets. Hooks are only used
// inside components, so this module is safe to import during SSG.

import { useId, type ReactNode } from 'react';
import type { Concept } from '../../data/concepts';

export interface WidgetProps {
  concept: Concept;
}

const BUTTON_BASE =
  'rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:outline-sky-400';
const BUTTON_IDLE =
  'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700';
const BUTTON_ACTIVE =
  'border-sky-500 bg-sky-100 text-sky-950 dark:border-sky-400 dark:bg-sky-950 dark:text-sky-50';

export function WidgetPanel({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="rounded-lg border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{subtitle}</p>
        </div>
        <span className="rounded-full border border-sky-300 bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-800 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-200">
          {badge}
        </span>
      </div>
      {children}
    </section>
  );
}

export function WidgetButton({
  label,
  onClick,
  children,
  active = false,
  pressed,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  children?: ReactNode;
  active?: boolean;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      disabled={disabled}
      className={`${BUTTON_BASE} ${active || pressed ? BUTTON_ACTIVE : BUTTON_IDLE}`}
    >
      {children ?? label}
    </button>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <WidgetButton
          key={option.value}
          label={option.label}
          pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </WidgetButton>
      ))}
    </div>
  );
}

export function WidgetSlider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  hint,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  hint?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="min-w-[11rem] flex-1">
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
      >
        <span>{label}</span>
        <span className="font-mono text-slate-900 dark:text-slate-100">
          {value}
          {suffix}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${value}${suffix}`}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full accent-sky-600 dark:accent-sky-400"
      />
      {hint && <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

export function WidgetToggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="flex max-w-xs cursor-pointer items-start gap-2 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 dark:border-slate-600 dark:bg-slate-800"
    >
      <input
        id={id}
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-sky-600 dark:accent-sky-400"
      />
      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
        {label}
        {hint && (
          <span className="mt-0.5 block text-[11px] font-normal text-slate-600 dark:text-slate-400">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

const STAT_TONES = {
  neutral: 'text-slate-900 dark:text-slate-100',
  good: 'text-emerald-800 dark:text-emerald-300',
  warn: 'text-amber-800 dark:text-amber-200',
  bad: 'text-rose-800 dark:text-rose-300',
} as const;

export function WidgetStat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: keyof typeof STAT_TONES;
}) {
  return (
    <div className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800/60">
      <div className="text-[10px] uppercase tracking-wide text-slate-600 dark:text-slate-400">
        {label}
      </div>
      <div className={`font-mono text-sm font-bold ${STAT_TONES[tone]}`}>{value}</div>
    </div>
  );
}

export function ipv4ToInt(ip: string): number {
  return ip.split('.').reduce((value, octet) => (value << 8) + Number(octet), 0) >>> 0;
}

export function intToIpv4(value: number): string {
  return [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join('.');
}

export function prefixMask(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}
