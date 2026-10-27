'use client';

import React from 'react';
import { useTheme as useCSCosmosTheme } from "@/context/useTheme";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useTheme = () => {
  // `resolvedTheme` is already the concrete theme applied to <html>; resolving
  // "system" here would read matchMedia during render (AGENTS.md §1).
  const { resolvedTheme, setTheme } = useCSCosmosTheme();

  return {
    theme: resolvedTheme,
    toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    setTheme: (t: 'light' | 'dark') => setTheme(t),
  };
};
