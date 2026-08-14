'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme as useCSCosmosTheme } from '@/context/useTheme';
import { Globe, Map, Terminal, Moon, Sun, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useCSCosmosTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Sub-site Brand & CSCosmos Back Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
            title="Return to CSCosmos Catalog"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>CSCosmos</span>
          </Link>

          <Link href="/webprotocols" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500">
              <Globe className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              WebProtocols
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/webprotocols"
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2",
              pathname === "/webprotocols"
                ? "bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Globe className="w-4 h-4" />
            <span>Overview</span>
          </Link>

          <Link
            href="/webprotocols/path"
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2",
              pathname === "/webprotocols/path"
                ? "bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Map className="w-4 h-4" />
            <span>Learning Path</span>
          </Link>

          <Link
            href="/webprotocols/playground"
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2",
              pathname === "/webprotocols/playground"
                ? "bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Terminal className="w-4 h-4" />
            <span>HTTP Playground</span>
          </Link>
        </nav>

        {/* Right: Theme Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}
