'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Sparkles, Layers, BookOpen, Menu, X, Bot, Network, Cpu, BrainCircuit, Activity } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Concepts', href: '/aicosmos/learn', icon: BookOpen },
    { label: 'Neural Net & Backprop', href: '/aicosmos/nn-lab', icon: BrainCircuit },
    { label: 'Transformer Attention', href: '/aicosmos/attention-lab', icon: Cpu },
    { label: 'RAG Lab', href: '/aicosmos/rag-lab', icon: Network },
    { label: 'Agent Lab', href: '/aicosmos/agent-lab', icon: Bot },
    { label: 'Architecture', href: '/aicosmos/about', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--ai-border-subtle)] bg-[var(--ai-bg)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-primary)] border border-transparent hover:border-[var(--ai-border)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> CSCosmos
          </Link>
          
          <Link href="/aicosmos" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--ai-primary)]/10 border border-[var(--ai-primary)]/30 flex items-center justify-center text-[var(--ai-primary)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              <Sparkles className="w-4 h-4 text-[var(--ai-primary)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[var(--ai-text)] flex items-center gap-1">
                AI<span className="text-[var(--ai-primary)] font-mono">::COSMOS</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--ai-muted)] tracking-wider uppercase -mt-1 hidden sm:block">
                Neural Networks &bull; Transformers &bull; RAG &bull; Agents
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/aicosmos' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--ai-primary)]/15 text-[var(--ai-primary)] border border-[var(--ai-border)] font-semibold shadow-sm'
                    : 'text-[var(--ai-muted)] hover:text-[var(--ai-text)] hover:bg-[var(--ai-surface)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg border border-[var(--ai-border-subtle)] text-[var(--ai-muted)] hover:text-[var(--ai-text)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] px-6 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/aicosmos' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--ai-primary)]/15 text-[var(--ai-primary)] border border-[var(--ai-border)]'
                    : 'text-[var(--ai-muted)] hover:text-[var(--ai-text)] hover:bg-[var(--ai-surface-2)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
