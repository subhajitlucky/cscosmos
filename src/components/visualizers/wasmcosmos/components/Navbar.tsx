'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Cpu, Layers, Activity, BookOpen, Menu, X, Binary, Code2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Concept Map', href: '/wasmcosmos/learn', icon: BookOpen },
    { label: 'Stack Machine Lab', href: '/wasmcosmos/stack-lab', icon: Activity },
    { label: 'WAT Bytecode Explorer', href: '/wasmcosmos/wat-compiler', icon: Binary },
    { label: 'Architecture', href: '/wasmcosmos/about', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--wasm-border-subtle)] bg-[var(--wasm-bg)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-6">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[var(--wasm-muted)] hover:text-[var(--wasm-primary)] border border-transparent hover:border-[var(--wasm-border)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> CSCosmos
          </Link>
          
          <Link href="/wasmcosmos" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--wasm-primary)]/10 border border-[var(--wasm-primary)]/30 flex items-center justify-center text-[var(--wasm-primary)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(101,79,240,0.25)]">
              <Cpu className="w-4 h-4 text-[var(--wasm-primary)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-[var(--wasm-text)] flex items-center gap-1">
                WASM<span className="text-[var(--wasm-primary)] font-mono">::COSMOS</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--wasm-muted)] tracking-wider uppercase -mt-1">
                WebAssembly &amp; Linear Memory Engine
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/wasmcosmos' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--wasm-primary)]/10 text-[var(--wasm-primary)] border border-[var(--wasm-border)]'
                    : 'text-[var(--wasm-muted)] hover:text-[var(--wasm-text)] hover:bg-[var(--wasm-surface)]'
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
            className="md:hidden p-2 rounded-lg border border-[var(--wasm-border-subtle)] text-[var(--wasm-muted)] hover:text-[var(--wasm-text)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[var(--wasm-border-subtle)] bg-[var(--wasm-surface)] px-6 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-[var(--wasm-muted)] hover:text-[var(--wasm-primary)] hover:bg-[var(--wasm-surface-2)]"
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
