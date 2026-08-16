import { Link, useLocation } from '@/components/visualizers/shared/RouterShim';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '../../stores/store';

export function Navbar() {
  const location = useLocation();
  const { theme, setTheme } = useStore();

  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const CurrentIcon = theme === 'dark' ? Sun : Moon;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <path d="M12 3v3m0 12v3m9-9h-3m-12 0H3m15.364-6.364l-2.121 2.121M7.757 16.243l-2.121 2.121M16.243 7.757l2.121 2.121M5.636 18.364l2.121-2.121"/>
              <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/>
            </svg>
            <span className="font-bold text-xl">K8s Scheduler</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/concepts"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/concepts') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Concepts
            </Link>
            <Link
              to="/lab"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/lab') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Scheduler Lab
            </Link>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            <CurrentIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
