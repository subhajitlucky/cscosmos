'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useTheme as useCosmosTheme } from '@/context/useTheme';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (value: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Use the resolved theme so a "system" preference maps to the theme that is
  // actually painted, rather than silently falling back to dark.
  const { resolvedTheme, setTheme } = useCosmosTheme();

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      setTheme: (val: Theme) => setTheme(val),
      toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    }),
    [resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: 'dark' as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return ctx;
}
