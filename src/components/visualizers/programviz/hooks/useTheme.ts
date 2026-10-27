'use client';

import { useTheme as useCSCosmosTheme } from "@/context/useTheme";

export function useTheme() {
  // `resolvedTheme` is already the concrete "light" | "dark" the provider painted
  // onto <html>. Resolving "system" here with matchMedia would read the browser
  // during render (server and dark-OS client would disagree) — see AGENTS.md §1.
  const { resolvedTheme, setTheme } = useCSCosmosTheme();

  return {
    theme: resolvedTheme,
    toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
  };
}
