import React from 'react';
import Navbar from './Navbar';
import { Outlet, Link, useLocation } from '@/components/visualizers/shared/RouterShim';
import { Github, Twitter, Globe, Cpu, Database, Activity, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-500 font-mono">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full relative">
        {/* HUD Decoration Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gray-100 dark:border-slate-900 pointer-events-none -translate-x-2 -translate-y-2 hidden md:block" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gray-100 dark:border-slate-900 pointer-events-none translate-x-2 translate-y-2 hidden md:block" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-900 pt-20 pb-12 transition-colors">
        {/* Background Grid for Footer */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            
            {/* System Identity */}
            <div className="md:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-xl tracking-tighter text-gray-900 dark:text-white uppercase">
                      Consensus<span className="text-blue-600 dark:text-blue-400">Term</span>
                    </span>
                    <div className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.3em] mt-0.5">Automated_Logic_Stream</div>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-slate-500 text-xs font-bold uppercase leading-relaxed tracking-tight max-w-sm">
                  An advanced cryptographic simulation engine designed to decompose and visualize 
                  distributed agreement protocols through high-fidelity interactivity.
                </p>
              </div>

              {/* Real-time System Metrics HUD */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-blue-500">
                       <Terminal size={12} />
                       <span className="text-[8px] font-black uppercase tracking-widest">Environment</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 dark:text-slate-300">RUNTIME_V8_JS</span>
                 </div>
                 <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-emerald-500">
                       <ShieldCheck size={12} />
                       <span className="text-[8px] font-black uppercase tracking-widest">Security</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 dark:text-slate-300">ENC_SIGNED_SHA</span>
                 </div>
              </div>
            </div>
            
            {/* System Map */}
            <div className="md:col-span-3 space-y-6">
              <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <Layers size={14} className="text-blue-500" /> System_Map
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'Root_Index', path: '/' },
                  { label: 'Curriculum_Tree', path: '/learn' },
                  { label: 'Laboratory_Sim', path: '/playground' }
                ].map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-[10px] font-black text-gray-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest transition-colors flex items-center gap-2 group">
                      <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-slate-800 group-hover:bg-blue-500 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Network Connect */}
            <div className="md:col-span-4 space-y-6">
              <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <Database size={14} className="text-indigo-500" /> Inbound_Channels
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Github size={16} />, label: 'Git_Repo', href: '#' },
                  { icon: <Twitter size={16} />, label: 'Dev_Feed', href: '#' },
                  { icon: <Globe size={16} />, label: 'Node_Map', href: '#' },
                  { icon: <Activity size={16} />, label: 'Sys_Status', href: '#' }
                ].map((social, i) => (
                  <a 
                    key={i}
                    href={social.href} 
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all group shadow-sm"
                  >
                    <div className="group-hover:scale-110 transition-transform">{social.icon}</div>
                    <span className="text-[9px] font-black uppercase tracking-tighter">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* System Integrity Line */}
          <div className="border-t border-gray-100 dark:border-slate-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest">Protocol_Integrity: Verified</span>
               </div>
               <div className="w-[1px] h-3 bg-gray-200 dark:bg-slate-800" />
               <p className="text-[9px] font-bold text-gray-600 dark:text-slate-300 uppercase tracking-tighter">
                 © {new Date().getFullYear()} ConsensusTerm_LTS. Built for cryptographic education.
               </p>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="text-[9px] font-black text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest transition-colors">Privacy_Protocol</a>
              <a href="#" className="text-[9px] font-black text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest transition-colors">Usage_Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;