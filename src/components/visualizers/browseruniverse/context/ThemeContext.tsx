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
  const { theme, setTheme } = useCosmosTheme();

  const value = useMemo(
    () => ({
      theme: (theme === 'light' ? 'light' : 'dark') as Theme,
      setTheme: (val: Theme) => setTheme(val),
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, setTheme],
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
