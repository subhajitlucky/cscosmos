'use client';

'use client';

import { ArrowRight, Database, Zap, Cpu, Network, Binary } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative flex flex-col items-start text-left">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full space-y-32"
      >
        {/* Technical Hero */}
        <div className="space-y-16">
          <motion.div variants={item} className="flex items-center gap-6">
            <div className="h-px w-16 bg-emerald-500" />
            <div className="px-4 py-2 border-2 border-emerald-500 text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] bg-emerald-500/5 shadow-[0_0_20px_rgba(0,237,100,0.1)] italic">
              STORAGE_PROTOCOL_INIT_V3.5
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-10">
            <h1 className="text-8xl md:text-[10rem] font-black tracking-[calc(-0.05em)] leading-[0.8] uppercase italic">
              Deconstruct <br/> 
              <span className="text-emerald-400 text-glow font-black">MongoDB</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-400/60 max-w-2xl font-bold leading-relaxed uppercase border-l-8 border-emerald-500/20 pl-10 italic">
              A high-fidelity diagnostic terminal for architecting distributed document stores. Stop querying. Start understanding.
            </p>
          </motion.div>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-8">
            <Link 
              href="/mongocosmos/learn"
              className="h-20 px-16 bg-emerald-500 text-black font-black text-sm tracking-[0.3em] uppercase hover:bg-emerald-400 transition-all flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(0,237,100,0.3)] active:scale-95 italic"
            >
              ACCESS_KERNEL
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link 
              href="/mongocosmos/playground"
              className="h-20 px-16 border-4 border-emerald-500/20 text-emerald-400/60 font-black text-sm tracking-[0.3em] uppercase hover:border-emerald-500/40 hover:text-emerald-400 transition-all flex items-center justify-center gap-4 italic"
            >
              QUERY_PROBE
              <Binary className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Real-time Architecture Breakdown */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
          <div className="p-12 border-4 border-emerald-500/10 dark:bg-black/40 bg-white/60 space-y-6 relative overflow-hidden group hover:border-emerald-500 transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-32 h-32 text-emerald-400" />
            </div>
            <div className="w-12 h-12 border-2 border-emerald-500/20 flex items-center justify-center bg-emerald-500/5">
              <Cpu className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">WiredTiger Engine</h3>
            <p className="text-xs font-bold text-emerald-400/40 uppercase leading-relaxed">
              B-Tree index concurrency and lock-free cache algorithms.
            </p>
          </div>

          <div className="p-12 border-4 border-emerald-500/10 dark:bg-black/40 bg-white/60 space-y-6 relative overflow-hidden group hover:border-emerald-500 transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
              <Network className="w-32 h-32 text-emerald-400" />
            </div>
            <div className="w-12 h-12 border-2 border-emerald-500/20 flex items-center justify-center bg-emerald-500/5">
              <Network className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Replica Consensus</h3>
            <p className="text-xs font-bold text-emerald-400/40 uppercase leading-relaxed">
              Raft-like election mechanisms with write-concern durability.
            </p>
          </div>

          <div className="p-12 border-4 border-emerald-500/10 dark:bg-black/40 bg-white/60 space-y-6 relative overflow-hidden group hover:border-emerald-500 transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
              <Database className="w-32 h-32 text-emerald-400" />
            </div>
            <div className="w-12 h-12 border-2 border-emerald-500/20 flex items-center justify-center bg-emerald-500/5">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Sharded Clusters</h3>
            <p className="text-xs font-bold text-emerald-400/40 uppercase leading-relaxed">
              Horizontal data partitioning via range and hashed shard keys.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
