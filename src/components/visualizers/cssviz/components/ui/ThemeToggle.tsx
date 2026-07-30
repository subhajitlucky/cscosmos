'use client';
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/visualizers/cssviz/theme/ThemeProvider'
import { cn } from '@/components/visualizers/cssviz/utils/cn'

type ThemeToggleProps = {
  className?: string
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold shadow-glow transition',
        'border-glass bg-surface/50 text-body-text hover:bg-surface hover:border-slate-300 dark:hover:border-white/30',
        className,
      )}
      aria-label="Toggle color theme"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'} mode</span>
    </button>
  )
}

export default ThemeToggle

