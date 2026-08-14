'use client';

import type { ReactNode } from 'react';
import { Home as HomeIcon, Map, Terminal, ChevronRight, Play, Info, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'OVERVIEW', path: '/apiviz' },
    { id: 'learn', icon: Map, label: 'LEARNING_PATH', path: '/apiviz/learn' },
    { id: 'playground', icon: Play, label: 'PLAYGROUND', path: '/apiviz/playground' },
    { id: 'about', icon: Info, label: 'SYSTEM_MISSION', path: '/apiviz/about' },
  ];

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#05070f] text-[#d6f5f5] font-mono crt grid-bg relative selection:bg-cyan-500 selection:text-black">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="flex-shrink-0 z-40 border-r-2 border-cyan-500/20 bg-black/70 backdrop-blur-md flex flex-col min-h-screen"
          >
            <div className="p-8 border-b-2 border-cyan-500/20 bg-cyan-500/5">
              <Link href="/apiviz" className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 border-2 border-cyan-400 flex items-center justify-center bg-cyan-400/10 shadow-[0_0_15px_rgba(0,255,255,0.2)] group-hover:scale-110 transition-transform">
                  <Terminal className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <span className="font-black text-2xl tracking-tighter text-cyan-400 text-glow leading-none">API_VIZ</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-[0.2em]">PROTOCOL_READY</span>
                  </div>
                </div>
              </Link>
            </div>

            <nav className="flex-grow px-4 space-y-1 py-8 overflow-y-auto custom-scrollbar">
              <div className="px-4 mb-6 text-[10px] font-black text-cyan-400/40 uppercase tracking-[0.3em]">
                System_Access
              </div>
              {navItems.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/apiviz' && pathname?.startsWith(item.path));
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-4 transition-all duration-200 group relative overflow-hidden",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400"
                        : "text-slate-400 hover:bg-cyan-500/5 hover:text-cyan-400/80"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" : "text-slate-400"
                    )} />
                    <span className="font-bold text-xs tracking-widest">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 border-t-2 border-cyan-500/20 bg-cyan-500/5 flex flex-col gap-3">
              <Link 
                href="/topics"
                className="flex items-center justify-between p-3 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest transition-all"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  CSCosmos Hub
                </span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              </Link>
              <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400/30 uppercase tracking-widest">
                <span>V1.0_PROD</span>
                <span>STATUS::OK</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-20 border-b-2 border-cyan-500/20 px-8 flex items-center justify-between bg-black/20 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 border border-cyan-500/20 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
            >
              <ChevronRight className={cn("w-4 h-4 transition-transform text-cyan-400", isSidebarOpen && "rotate-180")} />
            </button>
            <div className="h-4 w-px bg-cyan-500/20" />
            <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400/40 uppercase tracking-[0.2em]">
              <span>CORE</span>
              <span>/</span>
              <span className="text-cyan-400 font-black">{pathname?.replace('/apiviz', '').replace('/', '') || 'OVERVIEW'}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 border border-cyan-500/20 bg-cyan-500/5 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              NETWORK_SYNC_ACTIVE
            </div>
          </div>
        </header>

        <main className="flex-grow p-8 md:p-16 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
