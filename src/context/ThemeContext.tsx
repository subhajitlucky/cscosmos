'use client';

import { useCallback, useEffect, useMemo, useState } from "react"
import { ThemeProviderContext, combineTheme, type ResolvedTheme, type Theme } from "./theme-context"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "cscosmos-ui-theme",
}: ThemeProviderProps) {
    // The server cannot know the visitor's stored preference, so both the server
    // render and the client's FIRST render must use `defaultTheme`. Reading
    // localStorage here instead would make the client's first pass disagree with
    // the server HTML and raise a React hydration mismatch (AGENTS.md §1).
    // The pre-paint script in src/app/layout.tsx has already applied the stored
    // theme to <html>, so this provider only has to agree with it after mount.
    const fallbackResolved: ResolvedTheme = defaultTheme === "light" ? "light" : "dark";

    const [theme, setTheme] = useState<Theme>(defaultTheme)
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(fallbackResolved)
    const [mounted, setMounted] = useState(false)

    // Adopt the persisted preference once we are on the client.
    useEffect(() => {
        const stored = combineTheme(window.localStorage.getItem(storageKey) as Theme | null)
        if (stored) setTheme((current) => (current === stored ? current : stored))
    }, [storageKey])

    // Paint the resolved theme onto <html> and keep "system" in step with the OS.
    useEffect(() => {
        const query = window.matchMedia("(prefers-color-scheme: dark)")

        const apply = () => {
            const next: ResolvedTheme =
                theme === "system" ? (query.matches ? "dark" : "light") : theme
            const root = window.document.documentElement

            root.classList.remove("light", "dark")
            root.classList.add(next)
            root.setAttribute("data-theme", next)
            root.setAttribute("data-mode", next)
            setResolvedTheme(next)
        }

        apply()
        setMounted(true)

        if (theme !== "system") return
        query.addEventListener("change", apply)
        return () => query.removeEventListener("change", apply)
    }, [theme])

    const setThemePreference = useCallback(
        (nextTheme: Theme) => {
            window.localStorage.setItem(storageKey, nextTheme)
            setTheme(nextTheme)
        },
        [storageKey],
    )

    const value = useMemo(
        () => ({ theme, resolvedTheme, mounted, setTheme: setThemePreference }),
        [theme, resolvedTheme, mounted, setThemePreference],
    )

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}
