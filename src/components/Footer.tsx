import Link from "next/link"
import { Code2, Github, Heart } from "lucide-react"
import { siteConfig } from "../config/site"

const EXPLORE_LINKS = [
    { href: "/topics", label: "Topics" },
    { href: "/tracks", label: "Tracks" },
    { href: "/interview", label: "Interview" },
    { href: "/about", label: "About" },
]

const SOURCE_LINKS = [
    { href: siteConfig.links.github, label: "GitHub", external: true },
    { href: `${siteConfig.links.github}/blob/main/LICENSE`, label: "MIT License", external: true },
]

export function Footer() {
    return (
        <footer className="border-t border-border/60 bg-background">
            <div className="page-container py-10 md:py-12">
                <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-16">
                    <div className="max-w-sm space-y-3">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-primary" aria-hidden="true" />
                            <span className="font-semibold">{siteConfig.name}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {siteConfig.description}
                        </p>
                    </div>

                    <nav aria-label="Footer">
                        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            Explore
                        </h2>
                        <ul className="mt-3 space-y-1 text-sm">
                            {EXPLORE_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="inline-flex min-h-6 items-center rounded text-muted-foreground transition-colors hover:text-foreground focus-ring"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            Open Source
                        </h2>
                        <ul className="mt-3 space-y-1 text-sm">
                            {SOURCE_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex min-h-6 items-center gap-1.5 rounded text-muted-foreground transition-colors hover:text-foreground focus-ring"
                                    >
                                        {link.label}
                                        {link.label === "GitHub" && (
                                            <Github className="h-3.5 w-3.5" aria-hidden="true" />
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        Built with{" "}
                        <Heart className="mx-0.5 inline h-3 w-3 fill-red-500 text-red-500 align-[-1px]" aria-hidden="true" />
                        <span className="sr-only">love</span> for curious CS explorers.
                    </p>
                    <p suppressHydrationWarning>
                        &copy; {new Date().getFullYear()} {siteConfig.name} &middot; {siteConfig.slogan}
                    </p>
                </div>
            </div>
        </footer>
    )
}
