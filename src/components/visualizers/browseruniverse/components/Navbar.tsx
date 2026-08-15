'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rocket, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { cn } from '../utils/cn';

const links = [
  { href: '/browseruniverse', label: 'Home' },
  { href: '/browseruniverse/topics', label: 'Topics' },
  { href: '/browseruniverse/tour', label: 'Interactive Tour' },
  { href: '/browseruniverse/sandbox', label: 'Sandbox' },
  { href: '/browseruniverse/about', label: 'About' },
];

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = href === '/browseruniverse' ? pathname === '/browseruniverse' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        'rounded-full px-3 py-1 text-sm transition-colors',
        isActive ? 'bg-accent/20 text-white' : 'text-slate-300 hover:text-white',
      )}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-base/80 backdrop-blur">
      <div className="page-container flex items-center justify-between py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <Link href="/browseruniverse" className="flex items-center gap-2 rounded-full bg-card/60 px-3 py-1 shadow-inset">
            <Rocket className="text-accent" size={18} />
            <span className="text-sm font-semibold text-white">BrowserUniverse</span>
          </Link>
          <span className="hidden text-[11px] uppercase tracking-[0.2rem] text-slate-400 sm:inline">
            DOM & Browser Internals
          </span>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full border border-border bg-card/70 px-2 py-1 shadow-sm shadow-indigo-950/30 lg:flex">
          {links.map((link) => (
            <NavItem key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-sm text-slate-300 shadow-sm shadow-indigo-950/30 sm:flex">
            <Search size={14} />
            <input
              aria-label="Search topics"
              className="w-32 bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
              placeholder="Quick search..."
              defaultValue=""
              readOnly
            />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
