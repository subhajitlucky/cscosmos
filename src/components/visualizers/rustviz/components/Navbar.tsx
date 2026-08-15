'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
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
  Sun, 
  Moon, 
  Menu, 
  X,
  ArrowLeft,
  Flame
} from 'lucide-react';
import { useTheme } from '@/context/useTheme';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Concepts', href: '/rustviz/concepts', icon: BookOpen },
    { name: 'Ownership Lab', href: '/rustviz/ownership-lab', icon: Layers },
    { name: 'Borrow Checker', href: '/rustviz/borrow-checker', icon: ShieldCheck },
    { name: 'Lifetimes', href: '/rustviz/lifetimes-lab', icon: Clock },
    { name: 'Smart Pointers', href: '/rustviz/smart-pointers', icon: Cpu },
    { name: 'Concurrency', href: '/rustviz/concurrency-lab', icon: GitBranch },
    { name: 'Pitfalls', href: '/rustviz/pitfalls', icon: AlertTriangle },
    { name: 'Flashcards', href: '/rustviz/flashcards', icon: Bookmark },
    { name: 'Cheat Sheet', href: '/rustviz/cheatsheet', icon: Terminal },
  ];

  const isActive = (href: string) => {
    if (href === '/rustviz/concepts' && pathname.startsWith('/rustviz/concepts')) return true;
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--rust-border)] bg-[var(--rust-surface)]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Hub Link */}
        <div className="flex items-center space-x-4">
          <a
            href="/"
            className="flex items-center text-xs font-medium text-[var(--rust-muted)] hover:text-[var(--rust-text)] transition-colors"
            title="Return to CSCosmos Hub"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">CSCosmos</span>
          </a>
          <div className="h-4 w-[1px] bg-[var(--rust-border)]" />
          <a href="/rustviz" className="flex items-center space-x-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--rust-primary-light)] border border-[var(--rust-primary-border)] text-[var(--rust-primary)] transition-transform group-hover:scale-105">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-bold tracking-tight text-[var(--rust-text)]">RustViz</span>
                <span className="rounded bg-[var(--rust-primary)] px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  v1.85
                </span>
              </div>
              <p className="text-[10px] text-[var(--rust-muted)] font-mono">Backend Internals & Memory Engine</p>
            </div>
          </a>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <a
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] font-semibold'
                    : 'text-[var(--rust-muted)] hover:bg-[var(--rust-surface-2)] hover:text-[var(--rust-text)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Mobile Menu Trigger */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-text)] hover:border-[var(--rust-primary)] hover:text-[var(--rust-primary)] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-text)] xl:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[var(--rust-border)] bg-[var(--rust-surface)] px-4 py-4 xl:hidden">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 rounded-lg p-2.5 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)]'
                      : 'text-[var(--rust-muted)] hover:bg-[var(--rust-surface-2)] hover:text-[var(--rust-text)]'
                  }`}
                >
                  <Icon className="h-4 w-4 text-[var(--rust-primary)]" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
