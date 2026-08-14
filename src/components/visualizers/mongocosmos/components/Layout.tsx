'use client';

'use client';

import type { ReactNode } from 'react';
import { Home as HomeIcon, Map, Github, Terminal, Activity, ChevronRight, Play, Database, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'TERMINAL_HOME', path: '/mongocosmos' },
    { id: 'learn', icon: Map, label: 'CONCEPT_MAP', path: '/mongocosmos/learn' },
    { id: 'playground', icon: Play, label: 'QUERY_SIMULATOR', path: '/mongocosmos/playground' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-mono crt grid-bg">
      <div className="scanline-effect" />
      
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="flex-shrink-0 z-40 border-r-2 border-emerald-500/20 dark:bg-black/60 bg-white/80 backdrop-blur-xl flex flex-col"
          >
            <div className="p-8 border-b-2 border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center justify-between mb-4">
                <Link 
                  href="/topics"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-emerald-500/30 text-[9px] font-black text-emerald-500/70 hover:text-emerald-400 hover:border-emerald-400 transition-colors uppercase tracking-widest"
                >
                  <ArrowLeft className="w-3 h-3" /> CSCosmos
                </Link>
              </div>

              <Link href="/mongocosmos" className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10 shadow-[0_0_20px_rgba(0,237,100,0.2)] group-hover:scale-110 transition-transform">
                  <Database className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <span className="font-black text-2xl tracking-tighter text-emerald-400 text-glow leading-none block italic">MONGO_COSMOS</span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-400/60 uppercase tracking-[0.2em]">STORAGE_ENGINE_UP</span>
                  </div>
                </div>
              </Link>
            </div>

            <nav className="flex-grow px-4 space-y-1 py-8 overflow-y-auto custom-scrollbar">
              <div className="px-4 mb-6 text-[9px] font-black text-emerald-400/30 uppercase tracking-[0.4em]">
                System_Access
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-5 transition-all duration-200 group relative overflow-hidden",
                    pathname === item.path
                      ? "bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500"
                      : "text-emerald-400/40 hover:bg-emerald-500/5 hover:text-emerald-400/80"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                    pathname === item.path ? "text-emerald-400 shadow-[0_0_10px_rgba(0,237,100,0.5)]" : "text-emerald-400/40"
                  )} />
                  <span className="font-black text-xs tracking-widest">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-8 border-t-2 border-emerald-500/10 dark:bg-black/40 bg-white/60 mt-auto">
              <div className="flex items-center justify-between mb-4 text-[9px] font-black text-emerald-400/40 uppercase tracking-widest">
                <span>Wired_Tiger_Status</span>
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[8px] font-black text-emerald-400/30 uppercase">
                  <span>Cache_Size</span>
                  <span className="text-emerald-400/60">4.2GB_ALLOC</span>
                </div>
                <div className="flex justify-between text-[8px] font-black text-emerald-400/30 uppercase">
                  <span>Op_Log_Rate</span>
                  <span className="text-emerald-400/60">124_OPS/S</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        <header className="h-20 border-b-2 border-emerald-500/10 dark:bg-black/40 bg-white/80 flex items-center justify-between px-10 backdrop-blur-md z-30">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 border-2 border-emerald-500/20 text-emerald-400/60 hover:text-emerald-400 hover:border-emerald-500 transition-all active:scale-95"
            >
              <Terminal className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-emerald-500/10 hidden md:block" />
            <div className="hidden md:flex items-center gap-3 text-[10px] font-black tracking-widest text-emerald-400/40 uppercase">
              <Link href="/mongocosmos" className="hover:text-emerald-400 transition-colors italic">ROOT_MANIFEST</Link>
              {pathname?.split('/').filter(Boolean).map((part, i) => (
                <div key={i} className="flex items-center gap-3 italic">
                  <ChevronRight className="w-4 h-4 text-emerald-400/20" />
                  <span className="text-emerald-400/60 tracking-tighter">{part}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-8 font-black">
            <ThemeToggle />
            <Link href="/mongocosmos/about" className="text-[10px] text-emerald-400/40 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">SYS_ABOUT</Link>
            <a 
              href="https://github.com/subhajitlucky/cscosmos" 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-500/20 text-[10px] text-emerald-400/60 hover:text-emerald-400 hover:border-emerald-500 transition-all group"
            >
              <Github className="w-4 h-4 transition-transform group-hover:rotate-12" />
              CLONE_SOURCE
            </a>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-12 lg:p-24 relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
