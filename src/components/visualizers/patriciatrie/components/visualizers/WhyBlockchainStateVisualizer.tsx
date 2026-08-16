import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

const WhyBlockchainStateVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState(5);
  const [isExploding, setIsExploding] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (isExploding) {
      const timer = setInterval(() => {
        setNodes(n => Math.min(n + 10, 500));
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isExploding]);

  return (
    <div className="w-full h-full flex flex-col gap-8 p-4">
      {/* Simulation Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white dark:bg-neutral-900 p-6 rounded-[32px] border border-neutral-200 dark:border-neutral-800 shadow-xl">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
            <Database size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">State Size</span>
            <Tooltip content="Simulated number of global accounts">
               <p className="font-mono text-xl font-black text-neutral-900 dark:text-white cursor-help">{nodes}k Accounts</p>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button 
            onClick={() => { setIsExploding(!isExploding); setShowSolution(false); }}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${isExploding ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'} shadow-lg active:scale-95 flex items-center gap-2`}
          >
            <Zap size={16} />
            {isExploding ? 'Stop Explosion' : 'Simulate Growth'}
          </button>
          
          <button 
            onClick={() => { setShowSolution(true); setIsExploding(false); }}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-primary/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Shield size={16} />
            Apply Trie Solution
          </button>
        </div>
      </div>

      {/* Visual Workspace */}
      <div className="flex-1 min-h-[400px] relative bg-neutral-900 rounded-[40px] border border-neutral-800 overflow-hidden flex items-center justify-center p-4 sm:p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        {!showSolution ? (
          <div className="relative w-full h-full flex flex-wrap gap-2 justify-center content-center overflow-hidden">
            <AnimatePresence>
              {Array.from({ length: Math.min(nodes, 200) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${isExploding ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-neutral-700'}`}
                />
              ))}
            </AnimatePresence>
            
            {isExploding && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-rose-950/40 backdrop-blur-[2px]"
              >
                <div className="text-center p-8 bg-neutral-900 border border-rose-500/50 rounded-3xl shadow-2xl mx-4">
                  <AlertTriangle size={48} className="text-rose-500 mx-auto mb-4 animate-bounce" />
                  <Tooltip content="Exponential growth of unverified data">
                    <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter cursor-help">State Explosion!</h4>
                  </Tooltip>
                  <p className="text-rose-200/60 text-sm font-medium">Nodes can't keep up with verification.</p>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center z-10"
          >
            <div className="relative inline-block mb-8">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute -inset-8 bg-gradient-to-r from-primary via-emerald-500 to-primary opacity-20 blur-3xl rounded-full"
               />
               <div className="relative w-32 h-32 bg-neutral-900 border-4 border-primary rounded-[40px] flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                  <CheckCircle2 size={64} className="text-primary" />
               </div>
            </div>
            <Tooltip content="The ultimate source of truth">
               <h3 className="text-3xl font-black text-white mb-4 cursor-help">The State Root</h3>
            </Tooltip>
            <p className="text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Billions of accounts condensed into a <span className="text-primary font-bold">single 32-byte cryptographic anchor</span>. Efficient, verifiable, and scalable.
            </p>
          </motion.div>
        )}
      </div>

      {/* Insight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px]">
           <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">The Problem</h4>
           <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
             In a flat database, verifying the entire state requires reading every single entry. As users grow, the time to reach consensus explodes.
           </p>
        </div>
        <div className="p-6 bg-primary text-white rounded-[32px] shadow-xl shadow-primary/20">
           <h4 className="text-xs font-black opacity-60 uppercase tracking-widest mb-4 text-white">The Trie Solution</h4>
           <p className="text-sm leading-relaxed font-medium">
             The Merkle Patricia Trie creates a structural dependency between all data points, allowing us to represent the global state with a single hash.
           </p>
        </div>
      </div>
    </div>
  );
};

export default WhyBlockchainStateVisualizer;
