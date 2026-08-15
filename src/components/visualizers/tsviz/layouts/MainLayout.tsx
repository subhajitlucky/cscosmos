'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Github, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/context/useTheme';
import { Button } from '@/components/ui/button';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto max-w-7xl flex h-14 items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-6 md:gap-8">
                        <Link href="/tsviz" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                                <Code2 className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">
                                TSViz
                            </span>
                        </Link>
                        <nav className="flex items-center gap-6 text-sm font-medium">
                            <Link
                                href="/tsviz/concepts"
                                className={`transition-colors hover:text-foreground ${
                                    pathname.startsWith('/tsviz/concepts') ? 'text-foreground font-semibold' : 'text-muted-foreground'
                                }`}
                            >
                                Concepts
                            </Link>
                            <Link
                                href="/tsviz/problems"
                                className={`transition-colors hover:text-foreground ${
                                    pathname.startsWith('/tsviz/problems') ? 'text-foreground font-semibold' : 'text-muted-foreground'
                                }`}
                            >
                                Problems
                            </Link>
                            <Link
                                href="/tsviz/playground"
                                className={`transition-colors hover:text-foreground ${
                                    pathname.startsWith('/tsviz/playground') ? 'text-foreground font-semibold' : 'text-muted-foreground'
                                }`}
                            >
                                Playground
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/topics"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border rounded-full transition-all"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            CSCosmos
                        </Link>
                        <a
                            href="https://github.com/subhajitlucky/tsviz"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                            aria-label="GitHub Repository"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-9 w-9 text-muted-foreground hover:text-foreground"
                            aria-label="Toggle Theme"
                        >
                            {mounted && (theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-blue-600" />)}
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 w-full">
                {children}
            </main>
            <footer className="py-6 border-t border-border/60 mt-auto">
                <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 sm:px-8">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Master TypeScript by Visualizing It. Standalone visualizer absorbed natively in CSCosmos.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Link href="/tsviz/concepts" className="hover:text-foreground transition-colors">Concepts</Link>
                        <Link href="/tsviz/problems" className="hover:text-foreground transition-colors">Problems</Link>
                        <Link href="/tsviz/playground" className="hover:text-foreground transition-colors">Playground</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
