'use client';

import React, { useMemo } from 'react';
import { ThemeContext } from './ThemeContextCore';
import { useTheme as useCosmosTheme } from '@/context/useTheme';

/**
 * Backed directly by the app-wide theme provider (`@/context/useTheme`).
 *
 * This module used to own a `'theme'` storage key and read `localStorage` plus
 * `matchMedia` inside a `useState` initialiser. That makes the whole tree below it
 * un-renderable on the server and can never agree with the site toggle in
 * `src/app/layout.tsx`. (It was only ever mounted by `App.tsx`, which nothing
 * imports, so while the route sat behind `dynamic(..., { ssr: false })` this was
 * a latent blocker rather than the immediate cause of the empty shells. It is
 * still what has to go before the engine can be pre-rendered.)
 *
 * The local context shape (`theme`, `toggleTheme`, `isNightMode`) is kept so
 * `hooks/useTheme.ts` and `components/layout/Navbar.tsx` need no changes; the
 * values now come from the shared provider's `resolvedTheme`, which is the
 * concrete "light" | "dark" painted on <html> and is safe to read while
 * rendering on the server.
 *
 * Note for future wiring: this provider is mounted by `App.tsx`, which nothing
 * imports — the Next route shell renders `pages/*` directly, so no component on
 * that path calls `hooks/useTheme()`. If `components/layout/Navbar.tsx` is ever
 * rendered from the shell, it must stay inside this provider (that hook throws
 * when the context is missing), or be switched to `@/context/useTheme` directly.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme, setTheme } = useCosmosTheme();

  const value = useMemo(() => ({
    theme: resolvedTheme,
    toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    isNightMode: resolvedTheme === 'dark',
  }), [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
