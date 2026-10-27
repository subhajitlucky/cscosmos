import React from 'react';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { Network, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { useTheme } from '@/context/useTheme';

export const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  // FS-40: the engine's persisted store no longer keeps a second theme
  // preference, and nothing here writes the <html> class — the shared provider
  // owns it. Branch on `resolvedTheme` (the concrete "light" | "dark" already
  // painted), never on `theme`, which can be the raw "system" preference.
  const { resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "border-b glass py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-6 md:px-10 lg:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-zinc-950 dark:bg-zinc-800 border border-zinc-200/10 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <Network className="h-5 w-5 text-white dark:text-zinc-100" />
          </div>
          <span className="font-bold text-lg tracking-tight">LoadBalancer<span className="text-zinc-400 font-medium">.lab</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/concepts">
            <Button variant="ghost" className="text-sm font-medium px-4">Concepts</Button>
          </Link>
          <Link to="/lab">
            <Button variant="ghost" className="text-sm font-medium px-4">Interactive Lab</Button>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full w-9 h-9 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
          <Button size="sm" asChild className="rounded-full px-5 h-9 font-medium shadow-xl shadow-zinc-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]">
             <Link to="/lab">Launch Simulation</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
