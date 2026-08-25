'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, BookOpen, Terminal, Trophy, Sun, Moon, Menu, X, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { useTheme as useCSCosmosTheme } from '@/context/useTheme';

const NavLink = ({ href, icon: Icon, children, className, onClick }) => {
    const pathname = usePathname();
    const isActive = href === '/html-cosmos' ? pathname === '/html-cosmos' : pathname.startsWith(href);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300",
                className,
                isActive
                    ? "bg-lime-400 text-slate-950 shadow-[0_0_15px_rgba(163,230,53,0.4)]"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
            )}
        >
            <Icon size={16} strokeWidth={2.5} />
            <span className="font-display tracking-wide">{children}</span>
        </Link>
    );
};

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const { theme, setTheme } = useCSCosmosTheme();

    React.useEffect(() => {
        setMounted(true);
        setIsMenuOpen(false);
    }, [pathname]);

    const isDark = mounted 
        ? (theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches))
        : false;

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo & Catalog Back Link */}
                <div className="flex items-center gap-4">
                    <Link href="/topics" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full transition-all hover:border-lime-400/50">
                        <ArrowLeft size={14} />
                        <span>CSCosmos</span>
                    </Link>
                    <Link href="/html-cosmos" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-[#E34F26] flex items-center justify-center shadow-[0_0_20px_rgba(227,79,38,0.3)] group-hover:scale-105 transition-transform">
                            <Code2 className="text-slate-950" size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-lime-500 transition-colors">
                                HTML<span className="text-lime-500 dark:text-lime-400">Cosmos</span>
                            </span>
                            <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 -mt-1">
                                Accessibility & Semantics
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Nav Items */}
                <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200 dark:border-slate-800/80">
                    <NavLink href="/html-cosmos/learn" icon={BookOpen}>Learn</NavLink>
                    <NavLink href="/html-cosmos/playground" icon={Terminal}>Playground</NavLink>
                    <NavLink href="/html-cosmos/problems" icon={Trophy}>Problems</NavLink>
                </div>

                {/* Theme Toggle & Mobile Menu */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
                        aria-label="Toggle Theme"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col gap-2 animate-in slide-in-from-top-2">
                    <NavLink href="/html-cosmos/learn" icon={BookOpen}>Learn</NavLink>
                    <NavLink href="/html-cosmos/playground" icon={Terminal}>Playground</NavLink>
                    <NavLink href="/html-cosmos/problems" icon={Trophy}>Problems</NavLink>
                </div>
            )}
        </nav>
    );
}
