import React, { useState } from 'react';
import { Link, useLocation } from '@/components/visualizers/shared/RouterShim';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Network, Menu, X, Activity, Globe, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'System_Home', path: '/' },
    { label: 'Learning_Path', path: '/learn' },
    { label: 'Sim_Terminal', path: '/playground' },
  ];

  return (
    <nav className="border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl relative z-50 font-mono transition-colors">
      {/* HUD Background Decoration */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                   <Network className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse" />
              </div>
              <span className="font-black text-sm tracking-tighter text-gray-900 dark:text-white uppercase leading-none">
                Consensus<span className="text-blue-600 dark:text-blue-400">Term</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center gap-4 mr-6 px-4 py-1.5 rounded-full bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/50 transition-colors">
               <div className="flex items-center gap-1.5">
                  <Globe size={10} className="text-blue-500 animate-spin-slow" />
                  <span className="text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Mainnet_Active</span>
               </div>
               <div className="w-px h-2.5 bg-gray-200 dark:bg-slate-800" />
               <div className="flex items-center gap-1.5">
                  <Activity size={10} className="text-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Latency: 24ms</span>
               </div>
            </div>

            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'relative px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center group/nav',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-200'
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800/50 -z-0"
                    />
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-blue-500 group-hover/nav:w-1/2 transition-all duration-300 rounded-full" />
                </Link>
              );
            })}
            
            <div className="w-px h-4 bg-gray-200 dark:bg-slate-800 mx-3" />

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-800 shadow-inner"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 dark:text-slate-500 border border-gray-100 dark:border-slate-800"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl text-gray-500 dark:text-slate-500 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 transition-all active:scale-90"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl"
          >
            <div className="px-4 py-8 space-y-4">
              <div className="grid gap-3">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={clsx(
                        'flex items-center justify-between p-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all border-2',
                        isActive
                          ? 'bg-blue-600 border-blue-800 text-white shadow-xl shadow-blue-500/20'
                          : 'text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-900 border-transparent'
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={16} className={clsx(isActive ? "text-white" : "text-gray-400")} />
                    </Link>
                  );
                })}
              </div>
              
              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-900 flex items-center justify-between px-2">
                 <div className="space-y-1">
                    <div className="text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Network_Status</div>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">Production_LTS</span>
                    </div>
                 </div>
                 <div className="text-[8px] font-black text-gray-600 dark:text-gray-300 uppercase text-right tracking-[0.2em]">
                    Term_OS_v2.4
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;