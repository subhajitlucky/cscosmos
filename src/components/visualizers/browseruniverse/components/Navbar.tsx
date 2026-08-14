'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Compass, Layers, Activity, BookOpen, Menu, X, Cpu, Eye } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Concept Map', href: '/browseruniverse/learn', icon: BookOpen },
    { label: 'CRP & Reflow Lab', href: '/browseruniverse/crp-lab', icon: Eye },
    { label: 'V8 JIT Lab', href: '/browseruniverse/v8-lab', icon: Cpu },
    { label: 'Architecture', href: '/browseruniverse/about', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--bu-border-subtle)] bg-[var(--bu-bg)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-6">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[var(--bu-muted)] hover:text-[var(--bu-primary)] border border-transparent hover:border-[var(--bu-border)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> CSCosmos
          </Link>
          
          <Link href="/browseruniverse" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--bu-primary)]/10 border border-[var(--bu-primary)]/30 flex items-center justify-center text-[var(--bu-primary)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Compass className="w-4 h-4 text-[var(--bu-primary)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-[var(--bu-text)] flex items-center gap-1">
                BROWSER<span className="text-[var(--bu-primary)] font-mono">::UNIVERSE</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--bu-muted)] tracking-wider uppercase -mt-1">
                DOM &bull; CSSOM &bull; V8 JIT &bull; Event Loop &bull; Multi-Process
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/browseruniverse' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--bu-primary)]/10 text-[var(--bu-primary)] border border-[var(--bu-border)]'
                    : 'text-[var(--bu-muted)] hover:text-[var(--bu-text)] hover:bg-[var(--bu-surface)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg border border-[var(--bu-border-subtle)] text-[var(--bu-muted)] hover:text-[var(--bu-text)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[var(--bu-border-subtle)] bg-[var(--bu-surface)] px-6 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-[var(--bu-muted)] hover:text-[var(--bu-primary)] hover:bg-[var(--bu-surface-2)]"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
