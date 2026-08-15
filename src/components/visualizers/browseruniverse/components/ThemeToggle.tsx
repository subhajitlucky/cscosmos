'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

type Props = {
  className?: string;
};

export default function ThemeToggle({ className }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition hover:border-accent/50 hover:text-white',
        className,
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun size={16} />
          Light
        </>
      ) : (
        <>
          <Moon size={16} />
          Dark
        </>
      )}
    </button>
  );
}
