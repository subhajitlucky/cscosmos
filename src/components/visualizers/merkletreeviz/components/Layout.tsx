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
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Return to CSCosmos & Brand */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <NextLink
            href="/web3"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 text-xs font-semibold text-muted hover:text-foreground hover:bg-secondary transition-colors"
            title="Return to CSCosmos Web3 Hub"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">CSCosmos</span>
          </NextLink>

          <div className="h-4 w-px bg-border/40" />

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20 group-hover:scale-105 transition-transform">
              <TreeDeciduous className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              MerkleTreeViz
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const active = isItemActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "text-foreground bg-secondary font-semibold"
                    : "text-muted hover:text-foreground hover:bg-secondary/60"
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Theme Toggle & GitHub */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border/40 hover:border-border text-muted hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
            title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
          <a
            href="https://github.com/subhajitlucky/cscosmos"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-border/40 hover:border-border text-muted hover:text-foreground hover:bg-secondary transition-colors"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "block px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors",
                    active
                      ? "bg-accent/10 text-accent font-bold"
                      : "text-muted hover:text-foreground hover:bg-secondary"
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
    <div className="merkletree-theme min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <footer className="border-t border-border/40 py-8 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} MerkleTreeViz. Part of CSCosmos Interactive Learning Platform.</p>
          <div className="flex items-center space-x-4">
            <NextLink href="/topics" className="hover:text-foreground transition-colors">All Topics</NextLink>
            <span>•</span>
            <NextLink href="/web3" className="hover:text-foreground transition-colors">Web3 Domain</NextLink>
          </div>
        </div>
      </footer>
    </div>
  );
};