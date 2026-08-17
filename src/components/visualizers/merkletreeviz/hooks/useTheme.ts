'use client';

import { useTheme as useGlobalTheme } from '@/context/useTheme';
import { useEffect, useState } from 'react';

export const useTheme = () => {
  const { theme, setTheme } = useGlobalTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted
    ? (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
    : theme === 'dark';

  return {
    theme: (isDark ? 'dark' : 'light') as 'dark' | 'light',
    rawTheme: theme,
    toggleTheme: () => setTheme(isDark ? 'light' : 'dark'),
  };
};

