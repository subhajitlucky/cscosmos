'use client';
type SliderControlProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  suffix?: string
}

const SliderControl = ({ label, value, min, max, step = 1, onChange, suffix }: SliderControlProps) => (
  <label className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
    <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-slate-900 dark:text-white">
        {value}
        {suffix}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="accent-primary"
    />
  </label>
)

export default SliderControl

