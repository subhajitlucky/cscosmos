'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"
import { Code2, Github } from "lucide-react"
import { cn } from "../lib/utils"
import { siteConfig } from "../config/site"

export function Navbar() {
    const pathname = usePathname();

    const getLinkClass = (path: string) =>
        cn(
            "text-sm font-medium transition-all pb-1 border-b-2 border-transparent hover:text-primary",
            pathname === path && "text-primary border-primary"
        );

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="page-container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <Code2 className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight hidden sm:inline-block">{siteConfig.name}</span>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/topics" className={getLinkClass("/topics")}>
                        Topics
                    </Link>
                    <Link href="/tracks" className={getLinkClass("/tracks")}>
                        Tracks
                    </Link>
                    <Link href="/about" className={getLinkClass("/about")}>
                        About
                    </Link>
                    <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}
