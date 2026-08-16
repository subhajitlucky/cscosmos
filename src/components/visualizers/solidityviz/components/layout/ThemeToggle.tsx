import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../lib/theme"
import { cn } from "../../lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme()

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
                "p-2 rounded-full transition-colors duration-200",
                "hover:bg-accent text-muted-foreground hover:text-foreground",
                className
            )}
            aria-label="Toggle Theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 -mt-5" />
        </button>
    )
}
