'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ArrowLeft, Bookmark, BookOpen, Calculator, ChevronDown, Cpu, Database, Gauge, GitFork, HelpCircle, Layers, Network, Server, ShieldCheck, Sparkles, Terminal, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);

  const primaryLinks = [
    { label: 'Concepts', href: '/systemdesignviz/concepts', icon: BookOpen },
    { label: 'Consistent Hashing', href: '/systemdesignviz/hashing-lab', icon: Network },
    { label: 'Raft Consensus', href: '/systemdesignviz/raft-lab', icon: GitFork },
    { label: 'Rate Limiting', href: '/systemdesignviz/rate-limit-lab', icon: Gauge },
    { label: 'CAP & Sharding', href: '/systemdesignviz/sharding-lab', icon: Database },
    { label: 'Capacity Calculator', href: '/systemdesignviz/calculator-lab', icon: Calculator },
  ];

  const toolsLinks = [
    { label: 'Staff Architect Flashcards', href: '/systemdesignviz/flashcards', icon: HelpCircle },
    { label: 'System Design Patterns Cheat Sheet', href: '/systemdesignviz/cheatsheet', icon: Bookmark },
  ];

  const isToolsActive = toolsLinks.some(
    (t) => pathname === t.href || pathname?.startsWith(t.href + '/')
  );

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

          <Link href="/systemdesignviz" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-mono font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Server className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-foreground flex items-center gap-1">
                SystemDesignCosmos <Sparkles className="w-3 h-3 text-indigo-500" />
              </span>
              <span className="text-[10px] font-mono text-muted-foreground -mt-0.5">Distributed Systems &amp; Scale</span>
            </div>
          </Link>
        </div>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {primaryLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsOpen((prev) => !prev)}
              onBlur={() => setTimeout(() => setToolsOpen(false), 200)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isToolsActive
                  ? 'bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <span>Practice &amp; Tools</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {toolsOpen && (
              <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-card border border-border shadow-xl space-y-1 z-50 animate-in fade-in slide-in-from-top-1">
                {toolsLinks.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = pathname === tool.href;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tool.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Theme Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
