'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  FlaskConical, 
  Code2, 
  HelpCircle, 
  Menu, 
  X,
  ArrowLeft,
  Flame
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { 
      name: 'Concepts', 
      href: '/rustviz/concepts', 
      icon: BookOpen,
      badge: '100 Lessons'
    },
    { 
      name: 'Lab', 
      href: '/rustviz/lab', 
      icon: FlaskConical,
      badge: 'Experiment'
    },
    { 
      name: 'Problems', 
      href: '/rustviz/problems', 
      icon: Code2,
      badge: '100 LeetCode'
    },
    { 
      name: 'Interview Questions', 
      href: '/rustviz/interview', 
      icon: HelpCircle,
      badge: '100 Q&A'
    },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/rustviz/concepts') {
      return pathname.startsWith('/rustviz/concepts');
    }
    if (href === '/rustviz/lab') {
      return (
        pathname.startsWith('/rustviz/lab') ||
        pathname === '/rustviz/ownership-lab' ||
        pathname === '/rustviz/borrow-checker' ||
        pathname === '/rustviz/lifetimes-lab' ||
        pathname === '/rustviz/smart-pointers' ||
        pathname === '/rustviz/concurrency-lab'
      );
    }
    if (href === '/rustviz/problems') {
      return pathname.startsWith('/rustviz/problems');
    }
    if (href === '/rustviz/interview') {
      return pathname.startsWith('/rustviz/interview');
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--rust-border)] bg-[var(--rust-surface-95)] backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & CSCosmos Hub Return */}
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
              <p className="text-[10px] text-[var(--rust-muted)] font-mono hidden sm:block">Backend Internals &amp; Memory Engine</p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Items: 4 Core Sections */}
        <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] shadow-sm'
                    : 'text-[var(--rust-muted)] hover:bg-[var(--rust-surface-2)] hover:text-[var(--rust-text)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Mobile Menu */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface-2)] text-[var(--rust-text)] md:hidden hover:border-[var(--rust-primary-border)] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[var(--rust-border)] bg-[var(--rust-surface)] px-4 py-4 md:hidden">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl p-3 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)]'
                      : 'text-[var(--rust-muted)] hover:bg-[var(--rust-surface-2)] hover:text-[var(--rust-text)]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="h-4 w-4 text-[var(--rust-primary)] shrink-0" />
                    <span>{link.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--rust-muted)] px-2 py-0.5 rounded bg-[var(--rust-surface-2)]">
                    {link.badge}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
