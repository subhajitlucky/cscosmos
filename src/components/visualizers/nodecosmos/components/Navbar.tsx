'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle2, FlaskConical, Server } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Concepts', href: '/nodecosmos/concepts', icon: BookOpen },
    { label: 'Lab', href: '/nodecosmos/lab', icon: FlaskConical },
    { label: 'Problems', href: '/nodecosmos/problems', icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Hub backlink & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">CSCosmos</span>
          </Link>

          <Link href="/nodecosmos" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Server className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-foreground">
              NodeCosmos
            </span>
          </Link>
        </div>

        {/* Center: Nav links (Only Concepts, Lab, Problems) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-4 h-4" />
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
