'use client';
type SwitchControlProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const SwitchControl = ({ label, checked, onChange }: SwitchControlProps) => (
  <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
    <span>{label}</span>
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`relative flex h-7 w-12 items-center rounded-full border transition ${
        checked
          ? 'border-primary/60 bg-primary/15'
          : 'border-slate-200 bg-slate-100 hover:border-slate-300 dark:border-white/20 dark:bg-white/5 dark:hover:border-white/40'
      }`}
    >
      <span
        className={`absolute left-1 h-5 w-5 rounded-full shadow transition ${
          checked ? 'translate-x-5 bg-primary' : 'bg-white'
        }`}
      />
    </button>
  </label>
)

export default SwitchControl

