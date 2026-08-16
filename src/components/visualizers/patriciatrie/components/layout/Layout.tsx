import React, { useState } from 'react';
import { Link, useLocation } from '@/components/visualizers/shared/RouterShim';
import { Network, Github, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import ThemeToggle from '../ui/ThemeToggle';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/learn', label: 'Learn' },
    { path: '/playground', label: 'Playground' },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-primary/30 transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Network size={20} className="text-white" />
            </div>
            <span>Patricia<span className="text-primary">Trie</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            
            <div className="hidden sm:flex items-center gap-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={cn(
                        "block px-4 py-3 rounded-2xl text-base font-bold transition-all",
                        isActive 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between px-4">
                   <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Social</span>
                   <div className="flex items-center gap-4">
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary transition-colors flex items-center gap-2">
                        <span className="text-xs font-bold">GitHub</span>
                        <Github size={18} />
                      </a>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-24 pb-12 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 pt-16 pb-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Network size={20} className="text-white" />
                </div>
                <span>Patricia<span className="text-primary">Trie</span></span>
              </Link>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-sm font-medium">
                An advanced educational platform dedicated to visualizing the cryptographic structures that power the Ethereum Virtual Machine. Built for developers, students, and blockchain enthusiasts.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary transition-colors">
                  <Github size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white mb-6">Navigation</h4>
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-sm text-neutral-500 hover:text-primary transition-colors font-medium">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white mb-6">Stack</h4>
              <ul className="space-y-4">
                <li className="text-sm text-neutral-500 font-medium">React 19</li>
                <li className="text-sm text-neutral-500 font-medium">Tailwind CSS 4</li>
                <li className="text-sm text-neutral-500 font-medium">Framer Motion</li>
                <li className="text-sm text-neutral-500 font-medium">Vite Engine</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-xs font-medium">
              © {new Date().getFullYear()} PatriciaTrie Visualizer. Open Source Educational Tool.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Status: All Systems Nominal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
