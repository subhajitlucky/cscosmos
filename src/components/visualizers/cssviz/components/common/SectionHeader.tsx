'use client';
import { cn } from '@/components/visualizers/cssviz/utils/cn'

type SectionHeaderProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  align?: 'left' | 'center'
  className?: string
}

// Assuming 'cn' utility is available, e.g., from '@/components/visualizers/cssviz/lib/utils'
// import { cn } from '@/components/visualizers/cssviz/lib/utils';

const SectionHeader = ({ title, subtitle, eyebrow, align = 'left', className }: SectionHeaderProps) => (
  <div className={cn('space-y-2', align === 'center' && 'text-center', className)}>
    {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{title}</h2>
    {subtitle && <p className="max-w-2xl text-slate-600 dark:text-slate-300">{subtitle}</p>}
  </div>
)

export default SectionHeader
