import { Link, useLocation } from '@/components/visualizers/shared/RouterShim'
import { ThemeToggle } from "./ThemeToggle"
import { cn } from "../../lib/utils"
import { Code2, BookOpen, Terminal, Layers } from "lucide-react"

export function Navbar() {
    const location = useLocation()

    const navItems = [
        { label: "Home", path: "/", icon: Layers },
        { label: "Learn", path: "/learn", icon: BookOpen },
        { label: "Playground", path: "/playground", icon: Terminal },
        { label: "About", path: "/about", icon: Code2 }, // Using Code2 as a placeholder for about/source
    ]

    return (
        <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 font-bold text-xl hover:opacity-80 transition-opacity">
                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">SolidityViz</span>
                </Link>

                <div className="flex items-center space-x-6">
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                                        isActive ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                    <div className="h-6 w-px bg-border hidden md:block" />
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}
