'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Box, Layers, Activity, BookOpen, Menu, X, ShieldCheck, Cpu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Concept Map', href: '/lldcosmos/learn', icon: BookOpen },
    { label: 'SOLID Lab', href: '/lldcosmos/solid-lab', icon: ShieldCheck },
    { label: 'GoF Patterns Lab', href: '/lldcosmos/patterns-lab', icon: Cpu },
    { label: 'Architecture', href: '/lldcosmos/about', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--lld-border-subtle)] bg-[var(--lld-bg)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-6">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[var(--lld-muted)] hover:text-[var(--lld-primary)] border border-transparent hover:border-[var(--lld-border)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> CSCosmos
          </Link>
          
          <Link href="/lldcosmos" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--lld-primary)]/10 border border-[var(--lld-primary)]/30 flex items-center justify-center text-[var(--lld-primary)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.25)]">
              <Box className="w-4 h-4 text-[var(--lld-primary)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-[var(--lld-text)] flex items-center gap-1">
                LLD<span className="text-[var(--lld-primary)] font-mono">::COSMOS</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--lld-muted)] tracking-wider uppercase -mt-1">
                SOLID Principles &bull; Design Patterns &bull; Clean Architecture
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/lldcosmos' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--lld-primary)]/10 text-[var(--lld-primary)] border border-[var(--lld-border)]'
                    : 'text-[var(--lld-muted)] hover:text-[var(--lld-text)] hover:bg-[var(--lld-surface)]'
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
            className="md:hidden p-2 rounded-lg border border-[var(--lld-border-subtle)] text-[var(--lld-muted)] hover:text-[var(--lld-text)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] px-6 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-[var(--lld-muted)] hover:text-[var(--lld-primary)] hover:bg-[var(--lld-surface-2)]"
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
