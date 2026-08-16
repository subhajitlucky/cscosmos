import { Outlet } from '@/components/visualizers/shared/RouterShim'
import { Navbar } from "./Navbar"

export function Layout() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground antialiased flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>
            <footer className="py-6 md:px-8 md:py-0 border-t border-border">
                <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built for educational purposes.
                    </p>
                </div>
            </footer>
        </div>
    )
}
