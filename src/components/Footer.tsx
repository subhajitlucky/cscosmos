import Link from "next/link"
import { Code2, Github, Heart } from "lucide-react"
import { siteConfig } from "../config/site"

const COLUMNS = [
    {
        title: "Learn",
        links: [
            { href: "/topics", label: "Topics" },
            { href: "/interview", label: "Interview" },
            { href: "/roadmap", label: "Roadmap" },
            { href: "/review", label: "Review" },
            { href: "/exercises", label: "Exercises" },
        ],
    },
    {
        title: "Practice",
        links: [
            { href: "/mock-interview", label: "Mock interview" },
            { href: "/tutor", label: "AI tutor" },
            { href: "/leaderboard", label: "Leaderboard" },
        ],
    },
    {
        title: "Account",
        links: [
            { href: "/progress", label: "Progress" },
            { href: "/bookmarks", label: "Bookmarks" },
            { href: "/login", label: "Sign in" },
        ],
    },
    {
        title: "Project",
        links: [
            { href: "/about", label: "About" },
            { href: "/developers", label: "API" },
            { href: "/support", label: "Support" },
        ],
    },
]

export function Footer() {
    return (
        <footer className="border-t border-border/60 bg-background">
            <div className="page-container py-12">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-8">
                    <div className="max-w-sm space-y-3">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-primary" aria-hidden="true" />
                            <span className="text-base font-semibold">{siteConfig.name}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {siteConfig.description}
                        </p>
                        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                            Free & open source
                        </p>
                    </div>

                    {COLUMNS.map((column) => (
                        <div key={column.title}>
                            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                {column.title}
                            </h2>
                            <ul className="mt-3 space-y-2.5">
                                {column.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-1.5">
                        Built with
                        <Heart className="h-3 w-3 fill-red-500 text-red-500" aria-hidden="true" />
                        <span className="sr-only">love</span>
                        for curious CS explorers.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <a
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Github className="h-3.5 w-3.5" aria-hidden="true" />
                            GitHub
                        </a>
                        <a
                            href={`${siteConfig.links.github}/blob/main/LICENSE`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            MIT License
                        </a>
                        <span suppressHydrationWarning>
                            &copy; {new Date().getFullYear()} {siteConfig.name}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
