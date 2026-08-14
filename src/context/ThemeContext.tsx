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
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(storageKey) as Theme;
            if (stored) return combineTheme(stored) || defaultTheme;
        }
        return defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        const effectiveTheme = theme === "system"
            ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
            : theme;

        root.classList.add(effectiveTheme)
        root.setAttribute("data-theme", effectiveTheme)
        root.setAttribute("data-mode", effectiveTheme)
    }, [theme])

    const value = {
        theme,
        setTheme: (nextTheme: Theme) => {
            if (typeof window !== "undefined") {
                localStorage.setItem(storageKey, nextTheme)
            }
            setTheme(nextTheme)
        },
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}
