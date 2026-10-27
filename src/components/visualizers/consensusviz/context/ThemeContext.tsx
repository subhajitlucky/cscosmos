import React from 'react';
import { useTheme as useCosmosTheme } from '@/context/useTheme';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * Adapter over the app-wide theme provider (bug FS-39).
 *
 * This used to be a private provider that kept a *second* theme preference under
 * the storage key `'theme'` — the app's key is `'cscosmos-ui-theme'` — and read it
 * from a `useState` initialiser, i.e. on the render path, together with
 * `window.matchMedia`. Two consequences: `window` was touched while rendering,
 * which is why this engine could not be pre-rendered and every route sat behind
 * `dynamic(..., { ssr: false })`, and toggling here silently disagreed with the
 * site-wide switch.
 *
 * The shared provider owns the `<html>` class and the storage key, and exposes
 * `resolvedTheme`, the concrete `"light" | "dark"` already painted. Reading it is
 * deterministic on the server and on the client's first render.
 */
export const useTheme = (): ThemeContextType => {
  const { resolvedTheme, setTheme } = useCosmosTheme();

  return {
    theme: resolvedTheme,
    toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
  };
};

/**
 * Kept only so this engine's standalone `App.tsx` still compiles — nothing on
 * the `/consensusviz` route mounts it, and the shared provider in the root layout
 * is the single owner of the theme now. It intentionally renders nothing and
 * touches no browser API.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
