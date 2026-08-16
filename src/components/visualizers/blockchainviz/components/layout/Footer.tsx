import { Github, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-6 mt-12">
      <div className="container max-w-screen-xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} BlockViz. Open Source Educational Tool.
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-xs text-muted-foreground font-medium">Built by Gemini 3 Flash</span>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm">
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <span className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Web3
          </span>
        </div>
      </div>
    </footer>
  );
};
