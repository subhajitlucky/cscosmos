'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, BookOpen, Bug, Code2, Cpu, Sparkles, Wrench } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Concepts', href: '/tsviz/concepts', icon: BookOpen },
    { label: 'Utility Types', href: '/tsviz/utility-lab', icon: Wrench },
    { label: 'Compiler Pipeline', href: '/tsviz/compiler-pipeline', icon: Cpu },
    { label: 'Error Debugger', href: '/tsviz/errors', icon: Bug },
    { label: 'Playground', href: '/tsviz/playground', icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Hub backlink & Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/80 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSCosmos</span>
          </Link>

          <Link href="/tsviz" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-extrabold flex items-center justify-center text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              TS
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-foreground flex items-center gap-1">
                TSViz <Sparkles className="w-3 h-3 text-blue-500" />
              </span>
              <span className="text-[10px] font-mono text-muted-foreground -mt-0.5">TypeScript 5.x</span>
            </div>
          </Link>
        </div>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
