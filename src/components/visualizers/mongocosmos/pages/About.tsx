'use client';

import { motion } from 'framer-motion'
import { ShieldAlert, Database, Binary, Zap } from 'lucide-react'

export function About() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="max-w-5xl space-y-32 pb-32">
      {/* Header */}
      <div className="space-y-10">
        <div className="flex items-center gap-6">
          <div className="w-4 h-4 bg-primary shadow-[0_0_20px_rgba(0,237,100,0.5)]" />
          <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">System_Mission</h1>
        </div>
        <p className="text-primary/40 text-xl font-bold uppercase tracking-widest max-w-2xl leading-relaxed border-l-8 border-primary/10 pl-10 italic">
          MongoCosmos is an industrial-grade educational terminal designed to bridge the gap between simple CRUD operations and high-performance database architecture.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-24"
      >
        {/* Core Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-primary/10 border-2 border-primary/10 shadow-2xl">
          <motion.div variants={item} className="p-16 bg-background space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
            <div className="flex items-center gap-4 text-primary">
              <Zap className="w-8 h-8" />
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Execution_Fidelity</h2>
            </div>
            <p className="text-sm font-bold text-primary/40 leading-relaxed uppercase tracking-widest italic">
              We prioritize physical intuition. Instead of reading about B-Trees or Replica elections, you observe the data-plane transition in real-time through high-fidelity state simulations.
            </p>
          </motion.div>

          <motion.div variants={item} className="p-16 bg-background space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
            <div className="flex items-center gap-4 text-primary">
              <Database className="w-8 h-8" />
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Atlas_Architecture</h2>
            </div>
            <p className="text-sm font-bold text-primary/40 leading-relaxed uppercase tracking-widest italic">
              Forged as a personal masterclass in distributed systems. All logic is executed on the client-side to ensure maximum transparency and performance diagnostics.
            </p>
          </motion.div>
        </div>

        {/* Disclaimer Warning */}
        <motion.div variants={item} className="p-16 border-4 border-amber-500/20 bg-amber-500/5 space-y-10 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldAlert className="w-48 h-48 text-amber-500" />
          </div>
          <div className="flex items-center gap-6 text-amber-500 relative z-10">
            <ShieldAlert className="w-10 h-10" />
            <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">System_Protocol_Warning</h2>
          </div>
          <div className="space-y-6 text-xs font-black text-amber-500/40 uppercase tracking-[0.2em] leading-relaxed relative z-10 max-w-2xl italic">
            <p>1. [SIMULATION_NOTICE] This terminal is a high-fidelity model and does not initiate external network traffic to MongoDB Atlas.</p>
            <p>2. [RESEARCH_ONLY] Designed strictly for architectural research, performance benchmarking, and educational deconstruction.</p>
            <p>3. [DETERMINISTIC_MODELS] All request-response flows are based on the WiredTiger storage engine and official MongoDB server behaviors.</p>
          </div>
        </motion.div>

        {/* Closing Status */}
        <motion.div variants={item} className="flex justify-center py-20 border-t-4 border-primary/5">
          <div className="flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity duration-1000">
            <Binary className="w-16 h-16 text-primary animate-pulse" />
            <div className="text-[10px] font-black text-primary uppercase tracking-[0.8em]">
              END_OF_MANIFEST_V1
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
