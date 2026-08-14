'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Menu, Play, Search, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '@/context/useTheme';

const navItems = [
  ['Learn', '/vuecosmos/learn'],
  ['Playground', '/vuecosmos/playground'],
  ['About', '/vuecosmos/about'],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vuecosmos/learn?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchQuery('');
    setSearchOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="site-header">
      <div className="nav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/topics"
            className="brand"
            style={{ opacity: 0.7, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            <ArrowLeft size={13} /> CSCosmos
          </Link>
          <Link href="/vuecosmos" className="brand" aria-label="Vue Visualizer home">
            <span className="brand-mark">
              <span />
              <span />
              <span />
            </span>
            <span>vue<span className="brand-dot">:</span>visualizer</span>
          </Link>
        </div>

        <nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {navItems.map(([label, path]) => {
            const isActive = pathname === path || (path !== '/vuecosmos' && pathname?.startsWith(path));
            return (
              <Link
                key={path}
                href={path}
                className={isActive ? 'active' : ''}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          <Link className="nav-play" href="/vuecosmos/playground" onClick={() => setOpen(false)}>
            <Play size={13} fill="currentColor" /> Try the sandbox
          </Link>
        </nav>

        <div className="nav-actions">
          {searchOpen ? (
            <form className="nav-search" onSubmit={submitSearch}>
              <Search size={15} />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search concepts"
                aria-label="Search concepts"
              />
              <button
                type="button"
                className="nav-search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="icon-button desktop-search"
              onClick={() => setSearchOpen(true)}
              aria-label="Search topics"
            >
              <Search size={17} />
            </button>
          )}

          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Switch theme`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            type="button"
            className="icon-button mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
    </header>
  );
}
