'use client';
import { type ReactNode } from 'react'
import { cn } from '@/components/visualizers/cssviz/utils/cn'

type GlassCardProps = {
  children: ReactNode
  className?: string
}

const GlassCard = ({ children, className }: GlassCardProps) => (
  <div
    className={cn(
      'glass relative overflow-hidden rounded-2xl border transition-colors duration-300',
      'bg-surface border-glass shadow-glass', // Use semantic mapped tokens
      className,
    )}
  >
    {/* Shine effect - visible only in dark mode via opacity var */}
    <div
      className="glass-overlay pointer-events-none absolute inset-0 transition-opacity duration-300"
      style={{ opacity: 'var(--overlay-opacity)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary/10" />
    </div>
    <div className="relative z-10">{children}</div>
  </div>
)

export default GlassCard


