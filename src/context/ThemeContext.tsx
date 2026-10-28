'use client';

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { ThemeProviderContext, combineTheme, type ResolvedTheme, type Theme } from "./theme-context"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

// Layout effects do not run on the server. This keeps the server render and the
// first client render on `defaultTheme`, while the first client paint already
// uses the preference that the pre-paint script in src/app/layout.tsx applied.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

function resolveTheme(theme: Theme, query: MediaQueryList): ResolvedTheme {
    if (theme === "system") return query.matches ? "dark" : "light"
    return theme
}

function paintTheme(theme: ResolvedTheme) {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    root.setAttribute("data-theme", theme)
    root.setAttribute("data-mode", theme)
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "cscosmos-ui-theme",
}: ThemeProviderProps) {
    // The server cannot know the visitor's stored preference, so both the server
    // render and the client's FIRST render must use `defaultTheme`. Reading
    // localStorage in a state initializer would make the client's first pass
    // disagree with the server HTML and raise a React hydration mismatch.
    // The pre-paint script in src/app/layout.tsx has already applied the stored
    // theme to <html>; the layout effect below adopts it before the first paint.
    const fallbackResolved: ResolvedTheme = defaultTheme === "light" ? "light" : "dark"

    const [theme, setTheme] = useState<Theme>(defaultTheme)
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(fallbackResolved)
    const [mounted, setMounted] = useState(false)
    const themeRef = useRef<Theme>(defaultTheme)

    const applyTheme = useCallback((nextTheme: Theme) => {
        const query = window.matchMedia("(prefers-color-scheme: dark)")
        const nextResolved = resolveTheme(nextTheme, query)

        themeRef.current = nextTheme
        paintTheme(nextResolved)
        setTheme(nextTheme)
        setResolvedTheme(nextResolved)
    }, [])

    // Adopt the persisted preference synchronously, before the browser paints.
    // Reading it in a passive effect would let the default (dark) theme paint
    // for a frame first — the light -> dark -> light flash on every cold load.
    useIsomorphicLayoutEffect(() => {
        const stored = combineTheme(window.localStorage.getItem(storageKey) as Theme | null)
        applyTheme(stored ?? defaultTheme)
        setMounted(true)
    }, [applyTheme, defaultTheme, storageKey])

    // Keep "system" in step with the OS. The listener stays mounted, but it only
    // repaints while the stored preference is still "system"; an explicit
    // light/dark choice must not be overwritten by an OS theme change.
    useEffect(() => {
        const query = window.matchMedia("(prefers-color-scheme: dark)")
        const onChange = () => {
            if (themeRef.current === "system") {
                const nextResolved = resolveTheme("system", query)
                paintTheme(nextResolved)
                setResolvedTheme(nextResolved)
            }
        }

        query.addEventListener("change", onChange)
        return () => query.removeEventListener("change", onChange)
    }, [])

    const setThemePreference = useCallback(
        (nextTheme: Theme) => {
            window.localStorage.setItem(storageKey, nextTheme)
            applyTheme(nextTheme)
        },
        [applyTheme, storageKey],
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
