'use client';
import { cn } from '@/components/visualizers/cssviz/utils/cn'

type SectionHeaderProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  align?: 'left' | 'center'
  className?: string
  /**
   * Heading level. Defaults to h2 because most usages are in-page sections.
   * Page-level usages must pass "h1" — /css-cosmos/visualizers and
   * /css-cosmos/concepts previously rendered their page title as an h2, so those
   * documents shipped with no top-level heading at all.
   */
  level?: 'h1' | 'h2'
}

// Assuming 'cn' utility is available, e.g., from '@/components/visualizers/cssviz/lib/utils'
// import { cn } from '@/components/visualizers/cssviz/lib/utils';

const SectionHeader = ({ title, subtitle, eyebrow, align = 'left', className, level = 'h2' }: SectionHeaderProps) => {
  const Heading = level
  return (
    <div className={cn('space-y-2', align === 'center' && 'text-center', className)}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
      <Heading className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{title}</Heading>
      {subtitle && <p className="max-w-2xl text-slate-600 dark:text-slate-300">{subtitle}</p>}
    </div>
  )
}

export default SectionHeader
