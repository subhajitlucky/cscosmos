import React, { useState } from 'react';
import NextLink from 'next/link';
import { Link, useLocation } from '@/components/visualizers/shared/RouterShim';
import { Sun, Moon, TreeDeciduous, Github, Menu, X, ArrowLeft } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/learn', label: 'Learn' },
    { path: '/playground', label: 'Playground' },
  ];

  const isItemActive = (path: string) => {
    const p = location.pathname || '';
    if (path === '/') {
      return p === '/' || p === '' || p === '/merkletreeviz';
    }
    return p.startsWith(path) || p.startsWith(`/merkletreeviz${path}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-muted/20 bg-background/80 backdrop-blur-md transform-gpu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NextLink
            href="/web3"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-muted/20 text-xs font-semibold text-muted hover:text-foreground hover:bg-secondary transition-colors"
            title="Return to CSCosmos Web3 Hub"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">CSCosmos</span>
          </NextLink>

          <div className="h-4 w-px bg-muted/20" />

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 -ml-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center space-x-2">
            <TreeDeciduous className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground hidden sm:inline-block">
              MerkleTreeViz
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = isItemActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary font-semibold" : "text-muted"
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
            title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <a
            href="https://github.com/subhajitlucky/cscosmos"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            title="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-muted/20 bg-background">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = isItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    isActive ? "bg-primary/10 text-primary font-bold" : "hover:bg-secondary text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="merkletree-theme min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-sans">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        {children}
      </main>
      <footer className="border-t border-muted/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted text-sm">
          <p>© {new Date().getFullYear()} MerkleTreeViz. Built for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
};