'use client';

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, Menu, X, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);

    const navLinks = [
        { name: 'Architecture', path: '/redisviz/architecture' },
        { name: 'Data Structures', path: '/redisviz/data-structures' },
        { name: 'Execution', path: '/redisviz/execution' },
        { name: 'Memory', path: '/redisviz/memory' },
        { name: 'Persistence', path: '/redisviz/persistence' },
    ];

    const advancedLinks = [
        { name: 'Replication', path: '/redisviz/replication' },
        { name: 'Sentinel', path: '/redisviz/sentinel' },
        { name: 'Cluster', path: '/redisviz/cluster' },
        { name: 'Performance', path: '/redisviz/performance' },
        { name: 'Use Cases', path: '/redisviz/use-cases' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto max-w-7xl px-6 md:px-8 flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/topics"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/80 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">CSCosmos</span>
                    </Link>

                    <Link href="/redisviz" className="flex items-center gap-2 group">
                        <div className="bg-rose-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform text-white">
                            <Database className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-foreground">
                            Redis<span className="text-rose-600 dark:text-rose-500">Viz</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-rose-600 dark:hover:text-rose-400",
                                pathname === link.path
                                    ? "text-rose-600 dark:text-rose-500 font-bold"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-rose-600 p-0 h-auto">
                                Advanced
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {advancedLinks.map((link) => (
                                <DropdownMenuItem key={link.path} asChild>
                                    <Link
                                        href={link.path}
                                        className={cn(
                                            "w-full cursor-pointer",
                                            pathname === link.path ? "text-rose-600 font-bold" : ""
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ThemeToggle />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                        className="rounded-full"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden border-t bg-background px-4 py-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "block py-2 text-base font-medium",
                                pathname === link.path
                                    ? "text-rose-600 dark:text-rose-500 font-bold"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-2 pb-1 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Advanced</div>
                    {advancedLinks.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "block py-2 text-base font-medium pl-4",
                                pathname === link.path
                                    ? "text-rose-600 dark:text-rose-500 font-bold"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
