import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Globe, Database, Cpu as Chip, Trophy, Server, Activity } from 'lucide-react';

const PoWOverviewViz: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'mining' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  const startMining = () => {
    setStatus('mining');
    setProgress(0);
  };

  useEffect(() => {
    let interval: number;
    if (status === 'mining') {
      interval = window.setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('success');
            return 100;
          }
          return p + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[500px] flex flex-col justify-between transition-colors">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        
        {/* Left Col: Input Feed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Database size={14} className={status === 'mining' ? 'animate-pulse' : ''} />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-blue-400">Mempool Stream</h4>
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/50 p-2 rounded-lg flex items-center justify-between text-[9px] text-gray-500 dark:text-slate-500 group hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                   <div className={`w-1 h-1 rounded-full ${status === 'mining' ? 'bg-blue-500 dark:bg-blue-400 animate-pulse' : 'bg-gray-300 dark:bg-slate-700'}`} />
                   <span>TX_0x{i}F{i+2}A...</span>
                </div>
                <span className="text-blue-500/30 dark:text-blue-500/60 font-bold">PENDING</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center Col: The Forge */}
        <div className="flex flex-col items-center justify-center relative min-h-[250px]">
          <AnimatePresence>
            {status === 'mining' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.3, 0], scale: [1, 1.5, 2] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-48 h-48 rounded-full border-2 border-blue-500/20" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Concentric Rotating Rings */}
            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-gray-100 dark:border-slate-800 rounded-full"
            />
            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border border-blue-500/5 rounded-full"
            />
            <motion.div 
              initial={{ rotate: 0, scale: 1 }}
              animate={status === 'mining' ? { rotate: 360, scale: [1, 1.05, 1] } : { rotate: 0, scale: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute inset-8 border-2 rounded-full flex items-center justify-center transition-colors duration-700 ${
                status === 'success' ? 'border-emerald-500/40' : status === 'mining' ? 'border-blue-500/40' : 'border-gray-100 dark:border-slate-800'
              }`}
            >
               <div className={`w-full h-full rounded-full ${status === 'mining' ? 'border-t-2 border-blue-500 dark:border-blue-400 animate-spin' : ''}`} />
            </motion.div>
            
            {/* Core Engine Node */}
            <motion.div 
              layout
              className={`relative z-20 w-28 h-28 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 transition-all duration-700 shadow-xl dark:shadow-2xl overflow-hidden ${
                status === 'success' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-emerald-500/20' : 
                status === 'mining' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-blue-500/20' : 
                'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 dark:from-white/5 to-transparent pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                >
                  {status === 'success' ? (
                    <Trophy className="text-emerald-600 dark:text-emerald-500 w-8 h-8" />
                  ) : (
                    <Chip className={`w-8 h-8 ${status === 'mining' ? 'text-blue-600 dark:text-blue-400 animate-pulse' : 'text-gray-300 dark:text-slate-600'}`} />
                  )}
                </motion.div>
              </AnimatePresence>
              
              <div className="flex flex-col items-center">
                <span className={`text-[8px] font-black tracking-[0.2em] ${status === 'success' ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-400 dark:text-slate-500'}`}>
                  {status === 'success' ? 'VALIDATED' : status === 'mining' ? 'FORGING' : 'STANDBY'}
                </span>
                {status === 'mining' && (
                  <span className="text-[7px] text-blue-600/60 dark:text-blue-400/60 mt-1 font-bold">NONCE: {Math.floor(progress * 1234.5)}</span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Progress HUD */}
          <div className="mt-12 w-full max-w-[240px] space-y-3">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <div className="text-[7px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Search Space</div>
                 <div className="text-[10px] font-bold text-gray-600 dark:text-slate-300">Target: 0000x...</div>
              </div>
              <div className="text-right">
                 <div className="text-[7px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Progress</div>
                 <div className={`text-[10px] font-bold ${status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                   {Math.floor(progress)}%
                 </div>
              </div>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-900 rounded-full overflow-hidden border border-gray-200 dark:border-slate-800 p-[1px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full rounded-full transition-colors duration-500 ${status === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`} 
              />
            </div>
          </div>
        </div>

        {/* Right Col: Network Nodes */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Globe size={14} className={status === 'success' ? 'animate-spin-slow' : ''} />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-indigo-400">Global Relay</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             {[1, 2, 3, 4].map(i => (
               <motion.div 
                 key={i}
                 initial={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}
                 animate={status === 'success' ? { 
                   borderColor: ['#e2e8f0', '#10b981', '#e2e8f0'],
                   backgroundColor: ['#f8fafc', 'rgba(16,185,129,0.05)', '#f8fafc']
                 } : {}}
                 transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                 className="h-16 bg-gray-50/50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors"
               >
                 <Server size={12} className={status === 'success' ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-300 dark:text-slate-700'} />
                 <span className="text-[7px] text-gray-400 dark:text-slate-600 font-bold uppercase">Node_{i}</span>
                 {status === 'success' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1 h-1 rounded-full bg-emerald-500" />
                 )}
               </motion.div>
             ))}
          </div>

          <div className="p-3 bg-gray-50 dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-800/50">
             <div className="text-[7px] font-black text-gray-400 dark:text-slate-500 uppercase mb-2">Network Logs</div>
             <div className="space-y-1">
                <div className="text-[8px] text-gray-500 dark:text-slate-400 flex justify-between">
                   <span>P2P_HANDSHAKE</span>
                   <span className="text-emerald-600 dark:text-emerald-500/50 uppercase font-bold">OK</span>
                </div>
                <div className="text-[8px] text-gray-500 dark:text-slate-400 flex justify-between">
                   <span>DIFF_TARGET</span>
                   <span className="font-bold">0x0000...</span>
                </div>
                {status === 'success' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[8px] text-emerald-600 dark:text-emerald-400 font-black tracking-tight">
                    NEW_BLOCK_PROPAGATED
                  </motion.div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Footer System Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50">
        <div className="flex gap-10">
           <div className="space-y-1">
              <div className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">Energy Load</div>
              <div className="text-xs font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                <Zap size={10} className={status === 'mining' ? 'text-amber-500 animate-pulse' : 'text-gray-300 dark:text-slate-700'} />
                <span className="font-mono">{status === 'mining' ? '842.12 kW' : '0.00 kW'}</span>
              </div>
           </div>
           <div className="space-y-1">
              <div className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">Computation Power</div>
              <div className="text-xs font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                <Activity size={10} className={status === 'mining' ? 'text-blue-600 dark:text-blue-500 animate-bounce' : 'text-gray-300 dark:text-slate-700'} />
                <span className="font-mono">14.28 PH/s</span>
              </div>
           </div>
        </div>

        <button 
          onClick={status === 'success' ? () => setStatus('idle') : startMining}
          disabled={status === 'mining'}
          className={`group relative px-10 py-4 rounded-xl overflow-hidden transition-all active:scale-95 border-b-4 ${
            status === 'success' 
              ? 'bg-emerald-600 border-emerald-800 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.3)] dark:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)]' 
              : 'bg-blue-600 border-blue-800 shadow-[0_10px_20px_-10px_rgba(59,130,246,0.3)] dark:shadow-[0_10px_20px_-10px_rgba(59,130,246,0.5)]'
          } disabled:opacity-50 disabled:translate-y-0.5 disabled:border-b-0`}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
            {status === 'success' ? 'Reset System' : 'Initialize Mining'}
          </span>
        </button>
      </div>

      {/* Narrative HUD */}
      <div className="absolute top-4 right-4 text-[7px] text-gray-300 dark:text-slate-800 text-right space-y-0.5 pointer-events-none hidden sm:block">
         <div>CORE_VERSION: v1.0.4-LTS</div>
         <div>SATELLITE_LINK: ACTIVE</div>
         <div>SECURITY_LAYER: ENC_AES_256</div>
      </div>
    </div>
  );
};

export default PoWOverviewViz;
