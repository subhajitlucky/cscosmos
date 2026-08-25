import React from 'react';
import { Link, useLocation } from '@/components/visualizers/shared/RouterShim';
import { Network, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Mission Control', path: '/' },
    { name: 'Training Modules', path: '/learn' },
    { name: 'War Room', path: '/playground' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border-dim bg-bg-app/80 backdrop-blur-xl transition-all duration-500">
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-amber-500/50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 border border-primary/30 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-all shadow-[0_0_15px_var(--primary-dim)]">
              <Network className="w-6 h-6 text-primary" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--primary)]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-black text-base tracking-widest text-main uppercase">P2P_VIZ</span>
              <span className="text-[9px] text-primary/60 font-mono tracking-[0.2em] uppercase">Kernel.v2.4.0</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 bg-primary/5 p-1 rounded-2xl border border-primary/10 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative px-6 py-2 font-display text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-xl overflow-hidden group",
                  location.pathname === item.path 
                    ? "text-primary shadow-[0_0_20px_var(--primary-dim)]" 
                    : "text-text-muted hover:text-main"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {location.pathname === item.path && (
                    <motion.div 
                      layoutId="active-nav-dot" 
                      className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" 
                    />
                  )}
                  {item.name}
                </span>
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="navbar-active-bg"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all active:scale-90 group relative"
              aria-label="Toggle Vision Mode"
            >
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
            </button>

            <div className="hidden lg:flex items-center gap-3 border-l border-border-dim pl-4 py-1">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-primary/40 uppercase tracking-widest leading-none mb-1">Status</span>
                <span className="text-[10px] font-mono text-green-500 font-bold tracking-widest flex items-center gap-1.5">
                  OPTIMAL <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                </span>
              </div>
            </div>

            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2.5 text-primary border border-primary/20 rounded-xl bg-primary/5 transition-all active:scale-95"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="md:hidden border-b border-border-dim bg-bg-app/95 backdrop-blur-2xl px-4 py-8 space-y-3 overflow-hidden shadow-2xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-5 px-6 py-5 rounded-2xl border transition-all font-display text-sm font-bold uppercase tracking-[0.2em]",
                  location.pathname === item.path 
                    ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_20px_var(--primary-dim)]" 
                    : "border-transparent text-text-muted hover:bg-primary/5"
                )}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all", 
                  location.pathname === item.path ? "bg-primary shadow-[0_0_10px_var(--primary)]" : "bg-primary/20"
                )} />
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;