'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Clock, 
  GitBranch, 
  Cpu, 
  AlertTriangle, 
  BookOpen, 
  Bookmark, 
  Menu, 
  X,
  ArrowLeft,
  Flame,
  ChevronDown
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const primaryLinks = [
    { name: 'Concepts', href: '/rustviz/concepts', icon: BookOpen },
    { name: 'Ownership Lab', href: '/rustviz/ownership-lab', icon: Layers },
    { name: 'Borrow Checker', href: '/rustviz/borrow-checker', icon: ShieldCheck },
    { name: 'Lifetimes', href: '/rustviz/lifetimes-lab', icon: Clock },
  ];

  const toolsLinks = [
    { name: 'Smart Pointers (Rc/Arc)', href: '/rustviz/smart-pointers', icon: Cpu, desc: 'Box, Rc, Arc, & RefCell heaps' },
    { name: 'Tokio & Channels Lab', href: '/rustviz/concurrency-lab', icon: GitBranch, desc: 'MPSC queues & thread safety' },
    { name: 'Top Compiler Pitfalls', href: '/rustviz/pitfalls', icon: AlertTriangle, desc: 'E0382, E0502 diagnostics' },
    { name: 'Memory Flashcards', href: '/rustviz/flashcards', icon: Bookmark, desc: 'Spaced repetition drills' },
    { name: 'Cheat Sheet', href: '/rustviz/cheatsheet', icon: Terminal, desc: 'Quick syntax & CLI reference' },
  ];

  const allLinks = [...primaryLinks, ...toolsLinks];

  const isPrimaryActive = (href: string) => {
    if (href === '/rustviz/concepts') {
      return pathname.startsWith('/rustviz/concepts');
    }
    return pathname === href;
  };

  const isToolsActive = toolsLinks.some((link) => pathname === link.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--rust-border)] bg-[var(--rust-surface)]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & CSCosmos Hub Link */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href="/topics"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--rust-border)] text-xs font-semibold text-[var(--rust-muted)] hover:text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)] transition-colors"
            title="Return to CSCosmos Hub"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">CSCosmos</span>
          </Link>
          
          <div className="h-4 w-[1px] bg-[var(--rust-border)]" />
          
          <Link href="/rustviz" className="flex items-center space-x-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--rust-primary-light)] border border-[var(--rust-primary-border)] text-[var(--rust-primary)] transition-transform group-hover:scale-105">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm sm:text-base font-bold tracking-tight text-[var(--rust-text)]">RustViz</span>
                <span className="rounded bg-[var(--rust-primary)] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider">
                  v1.85
                </span>
              </div>
              <p className="text-[10px] text-[var(--rust-muted)] font-mono hidden sm:block">Backend Internals & Memory Engine</p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-1.5">
          {primaryLinks.map((link) => {
            const Icon = link.icon;
            const active = isPrimaryActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] font-semibold shadow-sm'
                    : 'text-[var(--rust-muted)] hover:bg-[var(--rust-surface-2)] hover:text-[var(--rust-text)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {/* Tools & Labs Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsDropdownOpen((prev) => !prev)}
              onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isToolsActive
                  ? 'bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] font-semibold'
                  : 'text-[var(--rust-muted)] hover:bg-[var(--rust-surface-2)] hover:text-[var(--rust-text)]'
              }`}
            >
              <span>Labs &amp; Tools</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 p-2 rounded-xl bg-[var(--rust-surface)] border border-[var(--rust-border)] shadow-2xl space-y-1 z-50">
                {toolsLinks.map((tool) => {
                  const Icon = tool.icon;
                  const active = pathname === tool.href;
                  return (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                        active
                          ? 'bg-[var(--rust-primary-light)] text-[var(--rust-primary)] font-semibold'
                          : 'text-[var(--rust-text)] hover:bg-[var(--rust-surface-2)]'
                      }`}
                    >
                      <Icon className="h-4 w-4 mt-0.5 text-[var(--rust-primary)] shrink-0" />
                      <div>
                        <div className="font-semibold leading-tight">{tool.name}</div>
                        <div className="text-[10px] text-[var(--rust-muted)] leading-tight mt-0.5">{tool.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions: Theme Toggle & Mobile Menu */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-text)] lg:hidden hover:border-[var(--rust-primary-border)] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[var(--rust-border)] bg-[var(--rust-surface)] px-4 py-4 lg:hidden max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allLinks.map((link) => {
              const Icon = link.icon;
              const active = isPrimaryActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 rounded-lg p-2.5 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] font-semibold'
                      : 'text-[var(--rust-muted)] hover:bg-[var(--rust-surface-2)] hover:text-[var(--rust-text)]'
                  }`}
                >
                  <Icon className="h-4 w-4 text-[var(--rust-primary)] shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
