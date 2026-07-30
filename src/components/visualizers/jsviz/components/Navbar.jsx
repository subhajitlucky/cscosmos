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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-black border-b border-brand-border h-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        {/* Logo & CSCosmos Catalog link */}
        <div className="flex items-center space-x-4">
          <Link href="/topics" className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 border border-brand-border px-3 py-1.5 rounded-md transition-colors">
            <ArrowLeft size={14} />
            <span>CSCosmos</span>
          </Link>
          <Link href="/jsviz" className="flex items-center space-x-2 group">
            <div className="bg-brand-lime text-brand-black p-1 rounded-sm">
              <Terminal size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white dark:text-white group-hover:text-brand-lime transition-colors">
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
                  : 'text-gray-400 hover:text-white'
                }`}
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
            className="p-2 text-gray-400 hover:text-brand-lime transition-colors border border-brand-border rounded-sm"
            aria-label="Toggle Theme"
          >
            {effectiveTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-brand-black border-b border-brand-border">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-bold tracking-widest ${isActive(link.path) ? 'text-brand-lime' : 'text-gray-400'
                  }`}
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
