'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Glasses, Layers, Activity, BookOpen, Menu, X, Hand, Box } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Concept Map', href: '/xrcosmos/learn', icon: BookOpen },
    { label: 'Spatial 3D Lab', href: '/xrcosmos/spatial-lab', icon: Box },
    { label: 'Hand Tracking', href: '/xrcosmos/hand-tracker', icon: Hand },
    { label: 'Architecture', href: '/xrcosmos/about', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--xr-border-subtle)] bg-[var(--xr-bg)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-6">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[var(--xr-muted)] hover:text-[var(--xr-primary)] border border-transparent hover:border-[var(--xr-border)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> CSCosmos
          </Link>
          
          <Link href="/xrcosmos" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--xr-primary)]/10 border border-[var(--xr-primary)]/30 flex items-center justify-center text-[var(--xr-primary)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.25)]">
              <Glasses className="w-4 h-4 text-[var(--xr-primary)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-[var(--xr-text)] flex items-center gap-1">
                XR<span className="text-[var(--xr-primary)] font-mono">::COSMOS</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--xr-muted)] tracking-wider uppercase -mt-1">
                Spatial Computing &amp; WebXR
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/xrcosmos' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--xr-primary)]/10 text-[var(--xr-primary)] border border-[var(--xr-border)]'
                    : 'text-[var(--xr-muted)] hover:text-[var(--xr-text)] hover:bg-[var(--xr-surface)]'
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
            className="md:hidden p-2 rounded-lg border border-[var(--xr-border-subtle)] text-[var(--xr-muted)] hover:text-[var(--xr-text)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[var(--xr-border-subtle)] bg-[var(--xr-surface)] px-6 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-[var(--xr-muted)] hover:text-[var(--xr-primary)] hover:bg-[var(--xr-surface-2)]"
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
