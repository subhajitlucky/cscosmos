import { createContext } from "react"

export type Theme = "dark" | "light" | "system"

/** The concrete theme applied to <html>. Never "system". */
export type ResolvedTheme = "dark" | "light"

export type ThemeProviderState = {
    /** The stored user *preference*. May be "system". */
    theme: Theme
    /**
     * The theme actually painted on the document. Components that swap Tailwind
     * classes based on the theme MUST branch on this rather than on `theme`,
     * otherwise a "system" preference resolves to the wrong branch.
     */
    resolvedTheme: ResolvedTheme
    /** False during the server render and during the first client render. */
    mounted: boolean
    setTheme: (theme: Theme) => void
}

export const ThemeProviderContext = createContext<ThemeProviderState>({
    theme: "system",
    resolvedTheme: "dark",
    mounted: false,
    setTheme: () => null,
})

export function combineTheme(theme: Theme | null): Theme | null {
    if (theme === "dark" || theme === "light" || theme === "system") return theme
    return null
}
