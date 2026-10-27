'use client';

import { useTheme as useCSCosmosTheme } from '@/context/useTheme'
import { Moon, Sun } from 'lucide-react'

/**
 * Uses the app-wide theme provider rather than its own persisted theme store.
 * A local store meant mongocosmos kept a second, desynced preference (its own
 * storage key), so the site toggle and this button fought each other — and
 * zustand's persist rehydration runs before the first paint, which risks a
 * server/client mismatch. The provider already paints <html>, so the local
 * class-writing effect is gone with it.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useCSCosmosTheme()

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-3 border-2 border-primary/20 text-primary/60 hover:text-primary hover:border-primary transition-all active:scale-95"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
