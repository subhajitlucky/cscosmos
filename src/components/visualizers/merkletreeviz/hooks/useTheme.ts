'use client';

import { useTheme as useCosmosTheme } from '@/context/useTheme';

/**
 * Thin adapter over the app-wide theme provider.
 *
 * The previous implementation shadowed the shared provider with its own
 * `mounted` state and resolved "system" itself by calling
 * `window.matchMedia('(prefers-color-scheme: dark)')` *during render*. Two
 * problems: it read `window` on the render path (so this engine could not be
 * pre-rendered and every route sat behind `dynamic(..., { ssr: false })`), and it
 * branched on the raw *preference* (`theme`), so a visitor whose preference was
 * "system" with a light OS got the dark icon until a second render.
 *
 * The shared provider already resolves all of that and exposes `resolvedTheme`,
 * the concrete `"light" | "dark"` painted on `<html>`. Reading it here is
 * deterministic: the provider starts both the server render and the client's
 * first render at the same value and only adopts the stored preference in an
 * effect, so hydration matches.
 */
export const useTheme = () => {
  const { resolvedTheme, setTheme } = useCosmosTheme();

  return {
    theme: resolvedTheme,
    toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
  };
};
