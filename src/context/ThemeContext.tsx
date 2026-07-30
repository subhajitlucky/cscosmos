'use client';

import { useEffect, useState } from "react"
import { ThemeProviderContext, combineTheme, type Theme } from "./theme-context"

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
    const [theme, setTheme] = useState<Theme>(defaultTheme)

    useEffect(() => {
        const stored = localStorage.getItem(storageKey) as Theme;
        if (stored) {
            setTheme(combineTheme(stored) || defaultTheme);
        }
    }, [defaultTheme, storageKey]);

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (nextTheme: Theme) => {
            localStorage.setItem(storageKey, nextTheme)
            setTheme(nextTheme)
        },
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}
