'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Server, Layers, Activity, BookOpen, Menu, X, GitFork, Cpu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Concept Map', href: '/fastapicosmos/learn', icon: BookOpen },
    { label: 'DI Graph Lab', href: '/fastapicosmos/di-graph', icon: GitFork },
    { label: 'AsyncIO Lab', href: '/fastapicosmos/async-lab', icon: Activity },
    { label: 'Architecture', href: '/fastapicosmos/about', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-bg)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-6">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[var(--fastapi-muted)] hover:text-[var(--fastapi-teal)] border border-transparent hover:border-[var(--fastapi-border)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> CSCosmos
          </Link>
          
          <Link href="/fastapicosmos" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--fastapi-teal)]/10 border border-[var(--fastapi-teal)]/30 flex items-center justify-center text-[var(--fastapi-teal)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Server className="w-4 h-4 text-[var(--fastapi-teal)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-[var(--fastapi-text)] flex items-center gap-1">
                FASTAPI<span className="text-[var(--fastapi-teal)] font-mono">::COSMOS</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--fastapi-muted)] tracking-wider uppercase -mt-1">
                AsyncIO &bull; Pydantic V2 &bull; Dependency Injection
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/fastapicosmos' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--fastapi-teal)]/10 text-[var(--fastapi-teal)] border border-[var(--fastapi-border)]'
                    : 'text-[var(--fastapi-muted)] hover:text-[var(--fastapi-text)] hover:bg-[var(--fastapi-surface)]'
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
            className="md:hidden p-2 rounded-lg border border-[var(--fastapi-border-subtle)] text-[var(--fastapi-muted)] hover:text-[var(--fastapi-text)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[var(--fastapi-border-subtle)] bg-[var(--fastapi-surface)] px-6 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-[var(--fastapi-muted)] hover:text-[var(--fastapi-teal)] hover:bg-[var(--fastapi-surface-2)]"
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
