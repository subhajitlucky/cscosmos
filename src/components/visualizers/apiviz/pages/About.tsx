'use client';

import { motion } from 'framer-motion';
import { Info, ShieldAlert, Cpu, Globe, Share2 } from 'lucide-react';

export function About() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl space-y-24 pb-32">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-[#d6f5f5]">System_Mission</h1>
        </div>
        <p className="text-cyan-400/40 text-sm font-bold uppercase tracking-widest max-w-xl leading-relaxed">
          API_VIZ is an industrial-grade educational terminal designed to bridge the gap between calling an API and architecting one.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-20"
      >
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-10 border-2 border-cyan-400/10 bg-black/40 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Cpu className="w-24 h-24 text-cyan-400" />
            </div>
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-[#d6f5f5]">Protocol_Objectives</h2>
            </div>
            <p className="text-xs font-bold text-cyan-400/40 leading-relaxed uppercase tracking-wide">
              We prioritize visual intuition. Instead of reading about the N+1 problem or cache revalidation, you observe them through high-fidelity state simulations.
            </p>
          </div>

          <div className="p-10 border-2 border-purple-400/10 bg-black/40 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Globe className="w-24 h-24 text-purple-400" />
            </div>
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-purple-400">Open_Architecture</h2>
            </div>
            <p className="text-xs font-bold text-purple-400/40 leading-relaxed uppercase tracking-wide">
              Forged as a personal masterclass in API design. All logic is executed on the client-side to ensure maximum transparency and performance.
            </p>
          </div>
        </motion.div>

        <motion.div variants={item} className="p-12 border-2 border-amber-500/20 bg-amber-500/5 space-y-8">
          <div className="flex items-center gap-4">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-amber-500">System_Disclaimer</h2>
          </div>
          <div className="space-y-4 text-xs font-bold text-amber-500/40 uppercase tracking-widest leading-relaxed">
            <p>1. This terminal is a high-fidelity simulation and does not perform actual network traversals unless specified.</p>
            <p>2. Designed strictly for architectural research and educational purposes.</p>
            <p>3. All request-response flows are deterministic models representing real-world patterns.</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="flex justify-center py-12 border-t-2 border-cyan-400/5">
          <div className="text-[10px] font-black text-cyan-400/20 uppercase tracking-[0.5em]">
            END_OF_MANIFEST
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
