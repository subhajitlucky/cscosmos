import { Network, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from '@/components/visualizers/shared/RouterShim';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/20 py-16 mt-20 relative z-10">
      <div className="container mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-zinc-950 dark:bg-zinc-800 border border-zinc-200/10 rounded-xl group-hover:scale-105 transition-transform">
                <Network className="h-5 w-5 text-white dark:text-zinc-100" />
              </div>
              <span className="font-bold text-lg tracking-tight">LoadBalancer<span className="text-zinc-400 font-medium">.lab</span></span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed font-medium">
              An open-source research environment for traffic engineering and distributed systems analysis. 
              Designed for educational clarity and technical accuracy.
            </p>
            <div className="flex gap-3 pt-2">
               <a href="#" className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-100 transition-all">
                 <Github className="h-4 w-4 text-zinc-400" />
               </a>
               <a href="#" className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-100 transition-all">
                 <Twitter className="h-4 w-4 text-zinc-400" />
               </a>
               <a href="#" className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-100 transition-all">
                 <Linkedin className="h-4 w-4 text-zinc-400" />
               </a>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100">Resources</h4>
            <ul className="space-y-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <li><Link to="/concepts" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Documentation</Link></li>
              <li><Link to="/lab" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Simulation Lab</Link></li>
              <li><Link to="/" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Architecture</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100">Community</h4>
            <ul className="space-y-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Discussions</a></li>
              <li><a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Contribute</a></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-6">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100">Newsletter</h4>
            <div className="relative">
                <input 
                    type="email" 
                    placeholder="Engineering updates..."
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 transition-all"
                />
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
          <p>© {new Date().getFullYear()} LOADBALANCER LAB. Built by Gemini 3 Flash. MIT LICENSE.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Telemetry</a>
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
