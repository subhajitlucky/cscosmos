import { Link, NavLink } from "react-router-dom"
import { ThemeToggle } from "./ThemeToggle"
import { Code2, Github } from "lucide-react"
import { cn } from "../lib/utils"

export function Navbar() {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        cn(
            "text-sm font-medium transition-all pb-1 border-b-2 border-transparent hover:text-primary",
            isActive && "text-primary border-primary"
        )

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/70 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
            <div className="page-container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center space-x-2">
                        <Code2 className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight hidden sm:inline-block">CSCosmos</span>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <NavLink to="/topics" className={navLinkClass}>
                        Topics
                    </NavLink>
                    <NavLink to="/about" className={navLinkClass}>
                        About
                    </NavLink>
                    <a href="https://github.com/subhajitlucky/cscosmos" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}
