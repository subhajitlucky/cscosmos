'use client';
import { cn } from '@/components/visualizers/cssviz/utils/cn'

type ToggleGroupProps = {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

const ToggleGroup = ({ label, options, value, onChange }: ToggleGroupProps) => (
  <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'rounded-lg px-3 py-2 text-sm transition border',
            value === option
              ? 'bg-amber-400 text-slate-900 font-semibold border-amber-500 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:bg-surface dark:text-slate-200 dark:border-white/10 dark:hover:bg-white/10',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
)

export default ToggleGroup

