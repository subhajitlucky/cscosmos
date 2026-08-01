'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme as useCSCosmosTheme } from '@/context/useTheme';
import { Moon, Sun, Menu, X, Terminal, ArrowLeft } from 'lucide-react';

const Navbar = () => {
  const { theme, setTheme } = useCSCosmosTheme();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const effectiveTheme = theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path) => path === '/jsviz' ? pathname === '/jsviz' : pathname.startsWith(path);

  const navLinks = [
    { name: 'HOME', path: '/jsviz' },
    { name: 'LEARN', path: '/jsviz/learn' },
    { name: 'PRACTICE', path: '/jsviz/practice' },
    { name: 'PLAYGROUND', path: '/jsviz/playground' },
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 border-b h-16 transition-colors duration-300 backdrop-blur-md"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-main)' }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        {/* Logo & CSCosmos Catalog link */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/topics" 
            className="text-xs font-semibold flex items-center gap-1.5 border px-3 py-1.5 rounded-md transition-all opacity-80 hover:opacity-100"
            style={{ borderColor: 'var(--border-main)', color: 'var(--text-main)', backgroundColor: 'var(--bg-main)' }}
            title="Return to CSCosmos Catalog"
          >
            <ArrowLeft size={14} />
            <span>CSCosmos</span>
          </Link>
          <Link href="/jsviz" className="flex items-center space-x-2 group">
            <div className="bg-brand-lime text-black p-1 rounded-sm shadow-sm">
              <Terminal size={20} strokeWidth={3} />
            </div>
            <span 
              className="text-xl font-bold tracking-tighter group-hover:text-brand-lime transition-colors"
              style={{ color: 'var(--text-main)' }}
            >
              JS_VIZ
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-sm font-bold tracking-widest transition-colors relative py-1 ${isActive(link.path)
                  ? 'text-brand-lime font-black'
                  : 'hover:text-brand-lime'
                }`}
              style={{ color: isActive(link.path) ? undefined : 'var(--text-muted)' }}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-lime"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 transition-colors border rounded-sm hover:border-brand-lime"
            style={{ borderColor: 'var(--border-main)', color: 'var(--text-main)', backgroundColor: 'var(--bg-main)' }}
            aria-label="Toggle Theme"
          >
            {effectiveTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
              style={{ color: 'var(--text-main)' }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden absolute top-16 left-0 right-0 border-b shadow-xl"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-main)' }}
        >
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-bold tracking-widest ${isActive(link.path) ? 'text-brand-lime' : ''}`}
                style={{ color: isActive(link.path) ? undefined : 'var(--text-muted)' }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
