'use client';

import React from 'react';
import { useTheme as useCSCosmosTheme } from "@/context/useTheme";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useTheme = () => {
  const { theme, setTheme } = useCSCosmosTheme();
  const effectiveTheme = theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  return {
    theme: effectiveTheme as 'light' | 'dark',
    toggleTheme: () => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark'),
    setTheme: (t: 'light' | 'dark') => setTheme(t),
  };
};
