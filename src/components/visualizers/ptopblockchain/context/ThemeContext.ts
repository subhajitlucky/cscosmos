import { useTheme as useCosmosTheme } from '@/context/useTheme';

export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * Adapter over the app-wide theme provider (bug FS-39).
 *
 * This engine used to keep a *second* theme preference under the storage key
 * `'theme'` — the app's key is `'cscosmos-ui-theme'` — which
 * `context/ThemeProvider.tsx` read from a `useState` initialiser, i.e. on the
 * render path, together with `window.document`. Two consequences: `window` was
 * touched while rendering, which is why this engine could not be pre-rendered and
 * every route sat behind `dynamic(..., { ssr: false })`, and toggling here
 * silently disagreed with the site-wide switch (the provider also repainted
 * `<html>` and `<body>` classes the shared provider owns).
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
