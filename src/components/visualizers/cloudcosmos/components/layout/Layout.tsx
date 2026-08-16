import { Link, useLocation } from '@/components/visualizers/shared/RouterShim';
import { cn } from "@/lib/utils";
import { 
  Cloud, 
  Sun, 
  Moon, 
  Github,
  LayoutDashboard,
  Library,
  Terminal as LabIcon,
  Menu,
  X
} from "lucide-react";
import { useTheme } from '@/context/useTheme';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Architecture Library', href: '/concepts', icon: Library },
  { name: 'Cloud Lab', href: '/lab', icon: LabIcon },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 blueprint-grid pointer-events-none z-0" />
      
      {/* Navbar */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent border-transparent"
      )}>
        <nav className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Cloud className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                CloudCosmos
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
                    location.pathname === item.href 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden sm:block text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
            </a>

            <button 
              className="md:hidden p-2 rounded-lg hover:bg-accent" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-16 z-40 bg-background border-b md:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg text-base font-medium",
                    location.pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex-1 pt-4">
        {children}
      </main>

      <footer className="relative z-10 border-t bg-background">
        <div className="container mx-auto max-w-7xl py-12 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col gap-3 items-center md:items-start">
               <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                 <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                   <Cloud className="h-5 w-5" />
                 </div>
                 CloudCosmos
               </div>
               <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left leading-relaxed">
                 The premium visual-first educational platform for mastering modern cloud architecture.
               </p>
            </div>
            
            <div className="flex gap-10 text-sm font-semibold">
               <Link to="/concepts" className="text-muted-foreground hover:text-primary transition-colors">Library</Link>
               <Link to="/lab" className="text-muted-foreground hover:text-primary transition-colors">Cloud Lab</Link>
               <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground/80">© 2025 CloudCosmos.</span>
              <span>All rights reserved.</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Built with excellence by</span>
              <span className="font-bold text-primary px-3 py-1 rounded-full bg-primary/5 border border-primary/10">Gemini 3 Flash</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
