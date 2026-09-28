'use client';

import { Search } from "lucide-react"
import type { InputHTMLAttributes } from "react"
import { cn } from "../lib/utils"

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export function SearchBar({ className, ...props }: SearchBarProps) {
    return (
        <div className={cn("relative w-full", className)}>
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
                type="search"
                aria-label={props["aria-label"] ?? "Search topics"}
                className="flex h-12 w-full rounded-xl border border-border/80 bg-secondary/30 px-10 pr-16 py-2.5 text-sm font-sans text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-foreground/40 focus:bg-background focus:outline-none"
                placeholder="Search topics, algorithms, systems..."
                {...props}
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 rounded border border-border/80 bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground pointer-events-none">
                /
            </kbd>
        </div>
    )
}
