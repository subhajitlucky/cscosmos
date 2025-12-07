import { Search } from "lucide-react"
import type { InputHTMLAttributes } from "react"
import { cn } from "../lib/utils"

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export function SearchBar({ className, ...props }: SearchBarProps) {
    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="search"
                aria-label={props["aria-label"] ?? "Search topics"}
                className="flex h-11 w-full rounded-full border border-input/80 bg-white/85 dark:bg-white/[0.06] backdrop-blur px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/80 focus-ring shadow-[0_10px_30px_-22px_rgba(0,0,0,0.75)] dark:shadow-[0_12px_34px_-24px_rgba(0,0,0,0.85)]"
                placeholder="Search for a topic..."
                {...props}
            />
        </div>
    )
}
