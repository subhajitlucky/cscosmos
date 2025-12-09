import { createContext } from "react"

export type Theme = "dark" | "light" | "system"

export type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const ThemeProviderContext = createContext<ThemeProviderState>({
    theme: "system",
    setTheme: () => null,
})

export function combineTheme(theme: Theme | null): Theme | null {
    if (theme === "dark" || theme === "light" || theme === "system") return theme
    return null
}

