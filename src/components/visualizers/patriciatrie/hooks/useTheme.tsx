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
 * This engine used to keep a *second* theme preference under the storage key
 * `'theme'` — the app's key is `'cscosmos-ui-theme'` — adopted in an effect and
 * then written back, while also repainting the `<html>` classes the shared
 * provider owns. Because `/patriciatrie` mounts this provider, toggling here
 * silently disagreed with the site-wide switch.
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
 * Kept only so this engine's standalone `App.tsx` and the route shell still
 * compile — the shared provider in the root layout is the single owner of the
 * theme now (see `useTheme` above). It renders nothing and touches no browser
 * API.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
