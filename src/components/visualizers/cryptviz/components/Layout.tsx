import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from '@/components/visualizers/shared/RouterShim';
import { Shield, Github, ArrowRight, ExternalLink, ArrowUp, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ThemeToggle } from './ThemeToggle';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const Layout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/learn', label: 'Learn' },
    { path: '/playground', label: 'Playground' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white transition-colors duration-300">
      <ScrollToTop />
      
      {/* Premium Navbar */}
      <header className="sticky top-0 z-[100] w-full border-b border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-slate-950/80 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 group outline-none relative z-[110]">
            <div className="p-2.5 bg-brand-600/10 dark:bg-brand-400/20 rounded-xl group-hover:bg-brand-600/20 dark:group-hover:bg-brand-400/30 transition-all duration-500 group-hover:rotate-[-5deg] dark:shadow-glow-brand">
              <Shield className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
              Crypt<span className="text-brand-600 dark:text-brand-400">Viz</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4 md:space-x-8">
            <nav className="hidden md:flex items-center space-x-1 p-1 bg-slate-900/5 dark:bg-white/5 rounded-2xl border border-slate-900/5 dark:border-white/5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden',
                      isActive
                        ? 'text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                    )}
                  >
                    {isActive && (
                        <motion.div 
                            layoutId="navPill"
                            className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center space-x-2 md:space-x-4">
              <a
                href="https://github.com/subhajitlucky/cryptviz"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-800" />
              <ThemeToggle />
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors relative z-[110]"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile Navigation Overlay - Moved out of header for better stacking */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl z-[200] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-slate-900 shadow-2xl z-[210] md:hidden flex flex-col border-l border-slate-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-500 rounded-lg text-white">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase">
                    CryptViz
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow flex flex-col py-6 px-6 space-y-2 overflow-y-auto">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-4">Navigation</div>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        'flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all',
                        isActive 
                          ? 'bg-brand-600/10 text-brand-600 dark:bg-brand-400/10 dark:text-brand-400' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                      )}
                    >
                      {item.label}
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                    </Link>
                  );
                })}
                
                <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-4">Community</div>
                  <a
                    href="https://github.com/subhajitlucky/cryptviz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-sm font-black uppercase tracking-widest">Repository</span>
                  </a>
                </div>
              </div>
              
              <div className="p-8 mt-auto">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3 text-[10px] text-rose-500 font-black uppercase tracking-tighter">
                          <Shield className="w-4 h-4" />
                          <span>Strictly Educational</span>
                      </div>
                  </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col relative">
        <div className="relative z-10 flex-grow flex flex-col">
          <Outlet />
        </div>
      </main>

      {/* Premium Architectural Footer */}
      <footer className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.08] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-12 md:mb-20">
            
            {/* Branding Column */}
            <div className="md:col-span-5 space-y-6 md:space-y-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-brand-500 rounded-xl text-white dark:shadow-glow-brand">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white uppercase">
                  CryptViz
                </span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-md font-medium">
                The definitive visual guide to the mathematical primitives of the secure web. Built for pioneers of digital trust.
              </p>
              <div className="flex gap-4">
                  <a href="https://github.com/subhajitlucky/cryptviz" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all group">
                      <Github className="w-5 h-5 text-slate-400 group-hover:text-brand-500" />
                  </a>
                  <a href="#" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all group">
                      <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-brand-500" />
                  </a>
              </div>
            </div>

            {/* Platform Links */}
            <div className="md:col-span-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 md:mb-8">Platform Architecture</h4>
              <ul className="flex flex-wrap gap-x-8 gap-y-4 md:flex-col md:gap-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-bold transition-all flex items-center group text-sm md:text-base">
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all hidden md:block" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources/Legal */}
            <div className="md:col-span-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 md:mb-8">Protocol Details</h4>
              <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-[10px] md:text-xs">
                      <span className="text-slate-400 font-bold uppercase">Simulation Engine</span>
                      <span className="text-emerald-500 font-black tracking-widest uppercase">v1.0.4 Stable</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] md:text-xs">
                      <span className="text-slate-400 font-bold uppercase">License</span>
                      <span className="text-slate-900 dark:text-white font-black tracking-widest uppercase">MIT Open Source</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-[10px] text-rose-500 font-black uppercase tracking-tighter">
                          <Shield className="w-3 h-3" />
                          <span>Strictly for educational simulations</span>
                      </div>
                  </div>
              </div>
            </div>
          </div>

          <div className="pt-8 md:pt-12 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center md:text-left relative">
            <p>
              &copy; 2026 CRYPTVIZ ENGINE. ALL MATHEMATICAL RIGHTS RESERVED.
            </p>
            
            <div className="flex items-center gap-8">
                <div className="flex gap-6 md:gap-8">
                    <a href="#" className="hover:text-brand-500 transition-colors">Privacy Protocol</a>
                    <a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a>
                </div>
                
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="md:hidden p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-brand-500 transition-all active:scale-90"
                  aria-label="Back to top"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};