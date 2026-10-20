'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ThemeToggle } from "./ThemeToggle"
import { Code2, Github, Menu, X } from "lucide-react"
import { cn } from "../lib/utils"
import { siteConfig } from "../config/site"

const PRIMARY_LINKS = [
    { href: "/topics", label: "Topics" },
    { href: "/interview", label: "Interview" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/progress", label: "Progress" },
    { href: "/about", label: "About" },
    { href: "/support", label: "Support" },
]

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const getLinkClass = (path: string) =>
        cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === path || pathname.startsWith(`${path}/`)
                ? "bg-secondary/60 text-foreground"
                : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
        );

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="page-container flex h-16 items-center justify-between gap-4">
                <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
                    <Code2 className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold tracking-tight">{siteConfig.name}</span>
                </Link>

                <div className="hidden items-center gap-1 lg:flex">
                    {PRIMARY_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className={getLinkClass(link.href)}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <a
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground sm:flex"
                    >
                        <Github className="h-4 w-4" />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        aria-label={open ? "Close menu" : "Open menu"}
                    >
                        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {open && (
                <div id="mobile-nav" className="border-t border-border bg-background lg:hidden">
                    <div className="page-container grid gap-1 py-3 sm:grid-cols-2">
                        {PRIMARY_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={cn(getLinkClass(link.href), "px-3 py-2.5")}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <a
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}
