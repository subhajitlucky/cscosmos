'use client';

import { ArrowRight, Layers, Server, Database, Globe, Network } from 'lucide-react';
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative flex flex-col items-start text-left">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full space-y-24"
      >
        {/* Technical Hero */}
        <div className="space-y-12">
          <motion.div variants={item} className="flex items-center gap-4">
            <div className="h-px w-12 bg-cyan-400" />
            <div className="px-3 py-1 border border-cyan-400 text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] bg-cyan-400/5 shadow-[0_0_10px_rgba(0,255,255,0.1)]">
              API_DESIGN_SYSTEM_ANALYSIS_V1.0
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-8">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic text-[#d6f5f5]">
              Visual <br/> 
              <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)] font-black">API_Design</span>
            </h1>
            <p className="text-lg md:text-xl text-cyan-400/60 max-w-2xl font-bold leading-relaxed uppercase border-l-4 border-cyan-400/20 pl-8">
              A visual-first educational terminal dedicated to deconstructing request-response lifecycles, schema evolution, and modern API architecture.
            </p>
          </motion.div>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-6">
            <Link 
              href="/apiviz/learn"
              className="h-16 px-12 bg-cyan-400 text-black font-black text-sm tracking-[0.2em] uppercase hover:bg-cyan-300 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,255,0.3)] active:scale-95"
            >
              INITIALIZE_PATH
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/apiviz/playground"
              className="h-16 px-12 border-2 border-cyan-400/20 text-cyan-400/60 font-black text-sm tracking-[0.2em] uppercase hover:border-cyan-400/40 hover:text-cyan-400 transition-all flex items-center justify-center gap-3"
            >
              OPEN_PLAYGROUND
            </Link>
          </motion.div>
        </div>

        {/* REST vs GraphQL High-Level Comparison */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t-2 border-cyan-400/10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-black uppercase tracking-tighter italic text-cyan-400">REST_Architecture</h2>
            </div>
            <div className="aspect-video bg-black/40 border-2 border-cyan-400/10 p-8 relative overflow-hidden group">
              <div className="absolute inset-0 grid-bg opacity-10" />
              <div className="relative z-10 flex flex-col justify-center h-full space-y-6">
                <div className="flex justify-between items-center px-4">
                  <div className="w-12 h-12 border border-cyan-400/40 flex items-center justify-center bg-cyan-400/5 text-cyan-400 text-[10px] font-black">CLIENT</div>
                  <div className="flex-grow h-px bg-cyan-400/20 mx-4 relative">
                    <motion.div 
                      animate={{ x: ["0%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,1)]"
                    />
                  </div>
                  <div className="w-12 h-12 border border-cyan-400/40 flex items-center justify-center bg-cyan-400/5 text-cyan-400 text-[10px] font-black">SERVER</div>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-black text-cyan-400/40 uppercase">Multiple Endpoints / Overfetching</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-black uppercase tracking-tighter italic text-purple-400">GraphQL_Gateway</h2>
            </div>
            <div className="aspect-video bg-black/40 border-2 border-purple-400/20 p-8 relative overflow-hidden group">
              <div className="absolute inset-0 grid-bg opacity-10" />
              <div className="relative z-10 flex flex-col justify-center h-full space-y-6">
                <div className="flex justify-between items-center px-4">
                  <div className="w-12 h-12 border border-purple-400/40 flex items-center justify-center bg-purple-400/5 text-purple-400 text-[10px] font-black">CLIENT</div>
                  <div className="flex-grow h-px bg-purple-400/20 mx-4 relative">
                    <motion.div 
                      animate={{ x: ["0%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,1)]"
                    />
                  </div>
                  <div className="w-12 h-12 border border-purple-400/40 flex items-center justify-center bg-purple-400/5 text-purple-400 text-[10px] font-black">GATEWAY</div>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-black text-purple-400/40 uppercase">Single Endpoint / Precise Fetching</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Trace Breakdown */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y-2 border-cyan-400/10 bg-cyan-400/5 px-12">
          <div className="space-y-4">
            <Server className="w-8 h-8 text-cyan-400/40" />
            <h3 className="font-black text-sm uppercase tracking-widest text-cyan-400">Scalable_Modeling</h3>
            <p className="text-[10px] font-bold text-cyan-400/40 uppercase leading-relaxed">Designing resources that withstand the pressure of industrial-scale traffic.</p>
          </div>
          <div className="space-y-4">
            <Network className="w-8 h-8 text-cyan-400/40" />
            <h3 className="font-black text-sm uppercase tracking-widest text-cyan-400">Protocol_Integrity</h3>
            <p className="text-[10px] font-bold text-cyan-400/40 uppercase leading-relaxed">Ensuring safety and idempotency across complex network traversals.</p>
          </div>
          <div className="space-y-4">
            <Database className="w-8 h-8 text-cyan-400/40" />
            <h3 className="font-black text-sm uppercase tracking-widest text-cyan-400">Schema_Evolution</h3>
            <p className="text-[10px] font-bold text-cyan-400/40 uppercase leading-relaxed">Managing backward compatibility through surgical versioning strategies.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
