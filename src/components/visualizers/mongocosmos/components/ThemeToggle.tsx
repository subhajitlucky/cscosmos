'use client';

import { useEffect } from 'react'
import { useThemeStore } from '../store/themeStore'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return (
    <button
      onClick={toggleTheme}
      className="p-3 border-2 border-primary/20 text-primary/60 hover:text-primary hover:border-primary transition-all active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
