import React from 'react';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Cpu, BarChart3, ChevronRight, Play, BookOpen, Globe, Database, Activity } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="relative overflow-hidden font-mono selection:bg-blue-500/30">
      {/* Premium Background Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-blue-500/[0.03] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">Protocol v2.0 Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tighter"
          >
            DECODE THE <span className="text-emerald-600 dark:text-emerald-400 uppercase">Consensus</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-base md:text-lg text-gray-500 dark:text-gray-400 font-bold leading-relaxed uppercase tracking-tight"
          >
            A high-fidelity visual exploration of how decentralized networks reach agreement through mathematics and game theory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/learn"
              className="group relative px-8 py-4 bg-blue-600 border-b-4 border-blue-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <BookOpen size={18} />
              Start Learning Path
            </Link>
            <Link
              to="/playground"
              className="group relative px-8 py-4 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center gap-3 shadow-sm"
            >
              <Play size={18} fill="currentColor" />
              Open Playground
            </Link>
          </motion.div>
        </div>
      </section>

      {/* High-Fidelity Preview Section */}
      <section className="relative z-10 py-20 px-4 bg-gray-50/50 dark:bg-slate-900/30 border-y border-gray-100 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                VISUAL-FIRST <br />MECHANICS
              </h2>
              <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
            </div>
            
            <div className="grid gap-6">
              {[
                { title: 'Physical Security', desc: 'Watch PoW convert electricity into unforgeable history through high-tech mining forges.', icon: <Zap size={20} className="text-amber-500" /> },
                { title: 'Economic Finality', desc: 'Explore PoS through validator terminals, staking loops, and penalty enforcement consoles.', icon: <ShieldCheck size={20} className="text-indigo-500" /> },
                { title: 'Network Topology', desc: 'Simulate P2P gossip and watch how global agreement emerges from local interactions.', icon: <Globe size={20} className="text-blue-500" /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm group hover:border-blue-500/30 transition-all">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xs uppercase text-gray-900 dark:text-white tracking-widest">{item.title}</h4>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-slate-500 leading-normal uppercase">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Mock HUD Preview */}
            <div className="relative aspect-square rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-6 overflow-hidden">
               <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
               
               <div className="relative h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <div className="text-[8px] font-black text-blue-500 uppercase tracking-widest">System_Monitor</div>
                        <div className="text-lg font-black text-slate-200">CONSENSUS_STABLE</div>
                     </div>
                     <Activity size={24} className="text-blue-500 animate-pulse" />
                  </div>

                  <div className="flex items-center justify-center flex-1">
                     <div className="relative w-32 h-32">
                        <motion.div 
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-2 border-dashed border-blue-500/20 rounded-full"
                        />
                        <div className="absolute inset-4 border border-blue-500/10 rounded-full flex items-center justify-center">
                           <Database size={32} className="text-blue-500/50" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between text-[7px] font-black text-slate-600 uppercase">
                        <span>Sync_Progress</span>
                        <span>100%</span>
                     </div>
                     <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-blue-600 shadow-[0_0_10px_#2563eb]" />
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Floating Accents */}
            <div className="absolute -top-10 -right-10 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl hidden md:block">
               <Cpu size={32} className="text-blue-500" />
            </div>
            <div className="absolute -bottom-10 -left-10 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl hidden md:block">
               <BarChart3 size={32} className="text-indigo-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Path */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Ready to dive in?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">Choose your entry point into the world of blockchain mechanics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/learn" className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 text-left space-y-6 hover:border-blue-500 transition-all shadow-sm">
               <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BookOpen size={24} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Theory & Visuals</h4>
                  <p className="text-xs text-gray-500 font-bold uppercase leading-relaxed">Step-by-step interactive lessons covering everything from Mining to Finality.</p>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest pt-4">
                  Initialize Path <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </Link>

            <Link to="/playground" className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 text-left space-y-6 hover:border-indigo-500 transition-all shadow-sm">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Play size={24} fill="currentColor" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Simulated Labs</h4>
                  <p className="text-xs text-gray-500 font-bold uppercase leading-relaxed">Real-time simulation environment. Build chains, trigger forks, and test consensus.</p>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest pt-4">
                  Access Terminal <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </Link>
          </div>
        </div>
      </section>

      {/* System Footer Decoration */}
      <div className="relative z-10 pb-10 px-4 text-center">
         <div className="inline-flex items-center gap-4 bg-gray-50 dark:bg-slate-900/50 px-6 py-3 rounded-2xl border border-gray-100 dark:border-slate-800">
            <span className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.3em]">Encrypted_Consensus_Environment_v2.0</span>
         </div>
      </div>
    </div>
  );
};

export default Home;
