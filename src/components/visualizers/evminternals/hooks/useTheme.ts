import { useMemo } from 'react';
import { useTheme as useAppTheme } from '@/context/useTheme';

type Theme = 'light' | 'dark';

interface EvmThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isNightMode: boolean;
}

/**
 * Adapter over the app-wide theme provider (FS-85 / FS-81).
 *
 * This hook used to read `evminternals/context/ThemeContextCore` and throw
 * `useTheme must be used within a ThemeProvider` whenever that local context was
 * missing. The only component that consumes it is `components/layout/Navbar.tsx`,
 * and the local provider is mounted in `evminternals/App.tsx` — which nothing
 * imports, because `src/app/evminternals/[[...slug]]/EngineMount.tsx` renders
 * `pages/*` directly. So on the shipped route the hook was either never rendered
 * or, the moment the Navbar is wired in (FS-84), a hard crash.
 *
 * `src/context/useTheme` is the single source of truth: the root layout always
 * mounts that `ThemeProvider`, and it exposes `resolvedTheme`, the concrete
 * `"light" | "dark"` already painted on <html>. Reading it is deterministic on the
 * server and on the client's first render, so no local provider is required and
 * nothing here touches `localStorage` / `matchMedia`. The local `theme` /
 * `toggleTheme` / `isNightMode` shape is kept so Navbar needs no change.
 */
export const useTheme = (): EvmThemeContextType => {
  const { resolvedTheme, setTheme } = useAppTheme();

  return useMemo(
    () => ({
      theme: resolvedTheme,
      isNightMode: resolvedTheme === 'dark',
      toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    }),
    [resolvedTheme, setTheme],
  );
};
