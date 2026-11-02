'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Database,
  HelpCircle,
  Menu,
  Terminal,
  X,
  FileCode2,
  Layers,
  Server,
  Network,
  Cpu
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [labsDropdownOpen, setLabsDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Concepts', href: '/mongocosmos/concepts', icon: BookOpen },
    { label: 'Playground', href: '/mongocosmos/playground', icon: Terminal },
    { label: 'Problems', href: '/mongocosmos/problems', icon: CheckCircle2 },
    { label: 'Interview Questions', href: '/mongocosmos/flashcards', icon: HelpCircle },
    { label: 'Cheatsheet', href: '/mongocosmos/cheatsheet', icon: FileCode2 },
  ];

  const labs = [
    { label: 'WiredTiger Engine Lab', href: '/mongocosmos/wiredtiger-lab', icon: Cpu },
    { label: 'Aggregation Pipeline Lab', href: '/mongocosmos/agg-lab', icon: Layers },
    { label: 'Replica Consensus Lab', href: '/mongocosmos/replica-lab', icon: Server },
    { label: 'Sharding Cluster Lab', href: '/mongocosmos/sharding-lab', icon: Network },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Hub backlink & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/80 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSCosmos</span>
          </Link>

          <Link href="/mongocosmos" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs transition-colors">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1">
                MongoCosmos
              </span>
              <span className="text-[10px] font-mono text-muted-foreground -mt-0.5">Document &amp; Storage Engine</span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-foreground text-background font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Interactive Labs Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLabsDropdownOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname?.includes('-lab')
                  ? 'bg-foreground text-background font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Engine Labs</span>
            </button>

            {labsDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl z-50 space-y-1 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setLabsDropdownOpen(false)}
              >
                {labs.map((lab) => {
                  const LabIcon = lab.icon;
                  const isLabActive = pathname === lab.href;
                  return (
                    <Link
                      key={lab.href}
                      href={lab.href}
                      onClick={() => setLabsDropdownOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                        isLabActive
                          ? 'bg-muted text-foreground font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <LabIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{lab.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Theme Toggle & Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/80 bg-background/98 px-4 py-3 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-foreground text-background font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-border/60">
            <div className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Interactive Labs
            </div>
            {labs.map((lab) => {
              const LabIcon = lab.icon;
              const isLabActive = pathname === lab.href;
              return (
                <Link
                  key={lab.href}
                  href={lab.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isLabActive
                      ? 'bg-foreground text-background font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <LabIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{lab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
