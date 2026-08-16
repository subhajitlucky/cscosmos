import React from 'react';
import { Link, useLocation } from '@/components/visualizers/shared/RouterShim';
import { Cpu, BookOpen, Play, Box, Sun, Moon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../../hooks/useTheme';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home', icon: Box },
    { path: '/learn', label: 'Learn', icon: BookOpen },
    { path: '/playground', label: 'Playground', icon: Play },
  ];

  return (
    <nav className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-md bg-evm-accent/10 text-evm-accent group-hover:bg-evm-accent/20 transition-colors">
            <Cpu size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline-block text-neutral-900 dark:text-white">
            EVM<span className="text-evm-accent">Viz</span>
          </span>
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1.5 border-r border-neutral-200 dark:border-neutral-800 pr-1.5 sm:pr-3 mr-1 sm:mr-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                    isActive
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  )}
                >
                  <Icon size={14} className={isActive ? "text-evm-accent" : ""} />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all"
            aria-label="Toggle Night Mode"
            title={theme === 'light' ? "Switch to Night Mode" : "Switch to Day Mode"}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;