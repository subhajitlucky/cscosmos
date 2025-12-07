import { Link } from "react-router-dom"
import { ThemeToggle } from "./ThemeToggle"
import { Code2, Github } from "lucide-react"

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center space-x-2">
                        <Code2 className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight hidden sm:inline-block">CSCosmos</span>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
                        About
                    </Link>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}
