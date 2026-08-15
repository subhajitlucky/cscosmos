'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Github } from 'lucide-react';
import { ModeToggle } from '../components/mode-toggle';
import '../styles.css';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="tsviz-root min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-6 md:gap-10">
                        <Link href="/tsviz" className="flex items-center space-x-2">
                            <Code2 className="h-6 w-6" />
                            <span className="hidden font-bold sm:inline-block">
                                TSViz
                            </span>
                        </Link>
                        <nav className="flex gap-6 text-sm font-medium">
                            <Link
                                href="/tsviz/concepts"
                                className={`transition-colors hover:text-foreground/80 ${
                                    pathname.startsWith('/tsviz/concepts') ? 'text-foreground' : 'text-foreground/60'
                                }`}
                            >
                                Concepts
                            </Link>
                            <Link
                                href="/tsviz/problems"
                                className={`transition-colors hover:text-foreground/80 ${
                                    pathname.startsWith('/tsviz/problems') ? 'text-foreground' : 'text-foreground/60'
                                }`}
                            >
                                Problems
                            </Link>
                            <Link
                                href="/tsviz/playground"
                                className={`transition-colors hover:text-foreground/80 ${
                                    pathname.startsWith('/tsviz/playground') ? 'text-foreground' : 'text-foreground/60'
                                }`}
                            >
                                Playground
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <nav className="flex items-center space-x-2">
                            <a
                                href="https://github.com/subhajitlucky/tsviz"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                                    <Github className="h-4 w-4" />
                                    <span className="sr-only">GitHub</span>
                                </div>
                            </a>
                            <ModeToggle />
                        </nav>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
            <footer className="py-6 md:px-8 md:py-0">
                <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
                    <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                        Built by{" "}
                        <span className="font-medium">Antigravity</span>
                        . The source code is available on{" "}
                        <a
                            href="https://github.com/subhajitlucky/tsviz"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            GitHub
                        </a>
                        .
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default MainLayout;
