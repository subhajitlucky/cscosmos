'use client';
type SelectControlProps = {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
}

const SelectControl = ({ label, value, options, onChange }: SelectControlProps) => (
  <label className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
    <span>{label}</span>
    <select
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary/60 dark:border-white/10 dark:bg-surface dark:text-slate-100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
)

export default SelectControl

