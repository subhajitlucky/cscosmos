'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme as useCSCosmosTheme } from '@/context/useTheme';
import { Atom, Map, FlaskConical, Info, Moon, Sun, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useCSCosmosTheme();

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const navItems = [
    { path: '/reactcosmos', label: 'Nexus', icon: Atom },
    { path: '/reactcosmos/learn', label: 'Pathway', icon: Map },
    { path: '/reactcosmos/playground', label: 'Lab', icon: FlaskConical },
    { path: '/reactcosmos/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-md border-b border-border z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/topics"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 bg-card border border-border px-3 py-1 rounded-full transition-all hover:border-cyan-400/50"
          >
            <ArrowLeft size={14} />
            <span>CSCosmos</span>
          </Link>
          <Link href="/reactcosmos" className="flex items-center gap-2 font-bold text-sm tracking-tight group">
            <div className="w-6 h-6 bg-foreground rounded-md flex items-center justify-center transition-all group-hover:rotate-12">
              <Atom className="w-4 h-4 text-background" />
            </div>
            <span className="hidden sm:block">React Cosmos</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex bg-muted p-1 rounded-lg border border-border">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/reactcosmos'
                ? pathname === '/reactcosmos'
                : pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all",
                    isActive
                      ? "bg-background text-foreground shadow-sm border border-border font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:block">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="w-px h-4 bg-border mx-2" />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
