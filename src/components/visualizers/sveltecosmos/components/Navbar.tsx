'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Flame, Sparkles, Binary, Cpu, BookOpen, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Concept Map', href: '/sveltecosmos/learn', icon: BookOpen },
    { label: 'Runes Sandbox', href: '/sveltecosmos/runes', icon: Sparkles },
    { label: 'Compiler AST Lab', href: '/sveltecosmos/compiler', icon: Cpu },
    { label: 'Architecture', href: '/sveltecosmos/about', icon: Binary },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--svelte-border-subtle)] bg-[var(--svelte-bg)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-6">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[var(--svelte-muted)] hover:text-[var(--svelte-primary)] border border-transparent hover:border-[var(--svelte-border)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> CSCosmos
          </Link>
          
          <Link href="/sveltecosmos" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--svelte-primary)]/10 border border-[var(--svelte-primary)]/30 flex items-center justify-center text-[var(--svelte-primary)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,62,0,0.2)]">
              <Flame className="w-4 h-4 fill-[var(--svelte-primary)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-[var(--svelte-text)] flex items-center gap-1">
                SVELTE<span className="text-[var(--svelte-primary)] font-mono">::COSMOS</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--svelte-muted)] tracking-wider uppercase -mt-1">
                Svelte 5 Runes & Compiler Engine
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/sveltecosmos' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--svelte-primary)]/10 text-[var(--svelte-primary)] border border-[var(--svelte-border)]'
                    : 'text-[var(--svelte-muted)] hover:text-[var(--svelte-text)] hover:bg-[var(--svelte-surface)]'
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
            className="md:hidden p-2 rounded-lg border border-[var(--svelte-border-subtle)] text-[var(--svelte-muted)] hover:text-[var(--svelte-text)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[var(--svelte-border-subtle)] bg-[var(--svelte-surface)] px-6 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-[var(--svelte-muted)] hover:text-[var(--svelte-primary)] hover:bg-[var(--svelte-surface-2)]"
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
