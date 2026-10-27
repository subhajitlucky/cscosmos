'use client';

import React from "react"
import { useTheme as useCosmosTheme } from "@/context/useTheme"

export type Theme = "dark" | "light" | "system"

/**
 * Backed directly by the app-wide theme provider (`@/context/useTheme`).
 *
 * This module previously defined its own theme context. Its `useState`
 * initialiser read `localStorage` and its effect read `matchMedia`, so mounting
 * it would have made the engine un-renderable on the server, and the storage key
 * it used (`vite-ui-theme` by default, `solidityviz-theme` from `App.tsx`) is one
 * nothing else in CSCosmos reads or writes, so the engine's toggle could never
 * agree with the site toggle. (The provider was only ever mounted by `App.tsx`,
 * which nothing imports, so while the route sat behind `dynamic(..., { ssr:
 * false })` this stayed a latent blocker rather than an active crash. Removing it
 * is still required before the engine can be pre-rendered, and it is what makes
 * the editor follow the site theme.)
 *
 * The local `ThemeProvider` export is kept as a pass-through so existing call
 * sites such as `App.tsx` do not need to change. Nothing in the Next route
 * mounts it: `src/app/layout.tsx` already provides the app-wide provider, and
 * `useTheme()` below reads from that one, so the engine's toggle now drives the
 * site theme (and vice versa) instead of desyncing from it.
 */
export function ThemeProvider({ children }: {
    children?: React.ReactNode
    /** Accepted for backwards compatibility; the app-wide provider owns this. */
    defaultTheme?: Theme
    /** Accepted for backwards compatibility; the app-wide provider owns this. */
    storageKey?: string
}) {
    return <>{children}</>
}

export function useTheme() {
    const { resolvedTheme, setTheme } = useCosmosTheme()

    // `resolvedTheme` is the concrete "light" | "dark" painted on <html>, never
    // "system", so consumers can branch on it safely during a server render.
    return {
        theme: resolvedTheme,
        setTheme,
    }
}
