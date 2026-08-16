import { Link, useLocation } from '@/components/visualizers/shared/RouterShim';
import { ModeToggle } from '../mode-toggle';
import { cn } from '../../lib/utils';

export const Header = () => {
  const location = useLocation();
  
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-screen-xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-4 h-4 bg-background rounded-sm" />
          </div>
          <h1 className="font-bold text-xl tracking-tighter">BlockViz</h1>
        </Link>
        
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link 
                to="/" 
                className={cn("hover:text-primary transition-colors", location.pathname === "/" && "text-primary")}
            >
                Home
            </Link>
             <Link 
                to="/concepts" 
                className={cn("hover:text-primary transition-colors", location.pathname === "/concepts" && "text-primary")}
            >
                Concepts
            </Link>
            <Link 
                to="/playground" 
                className={cn("hover:text-primary transition-colors", location.pathname === "/playground" && "text-primary")}
            >
                Playground
            </Link>
          </div>
          <div className="h-6 w-px bg-border hidden md:block" />
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
};
