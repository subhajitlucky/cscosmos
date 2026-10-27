'use client';

import { useTheme as useCosmosTheme } from '@/context/useTheme';

/**
 * Backed directly by the app-wide theme provider.
 *
 * This module previously defined its own context with its own `'gitcosmos-theme'`
 * storage key and read `localStorage` + `matchMedia` inside a `useState`
 * initialiser. Two consequences: the engine's toggle desynced from the site
 * toggle, and the components could not render on the server — which is why the
 * route was wrapped in `dynamic(..., { ssr: false })` and shipped 36 pages with
 * no pre-rendered content.
 *
 * The local `ThemeProvider` export is kept as a pass-through so existing call
 * sites do not need to change, but nothing needs to mount it any more — and that
 * matters, because nothing ever did: `useTheme()` was called by `Layout.jsx` and
 * `ConceptPage.jsx` while no provider was mounted anywhere in this engine, so the
 * old implementation would have thrown.
 */
export function ThemeProvider({ children }) {
  return children;
}

export function useTheme() {
  const { resolvedTheme, setTheme } = useCosmosTheme();

  return {
    theme: resolvedTheme,
    setTheme,
    toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
  };
}
