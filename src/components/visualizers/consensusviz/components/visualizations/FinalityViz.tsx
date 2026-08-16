import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Lock, Unlock, Database, Activity, ShieldCheck, Plus, RefreshCcw } from 'lucide-react';
import { clsx } from 'clsx';

interface Block {
  id: number;
  status: 'pending' | 'justified' | 'finalized';
  confirmations: number;
}

const FinalityViz: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 100, status: 'finalized', confirmations: 4 },
    { id: 101, status: 'finalized', confirmations: 3 },
    { id: 102, status: 'justified', confirmations: 2 },
    { id: 103, status: 'pending', confirmations: 1 },
  ]);

  const addBlock = () => {
    setBlocks(prev => {
      const newId = prev[prev.length - 1].id + 1;
      const nextBlocks = [...prev, { id: newId, status: 'pending' as const, confirmations: 0 }];
      
      // Update statuses based on depth (Simulating PoS finality logic)
      return nextBlocks.map((b, idx) => {
        const depth = nextBlocks.length - 1 - idx;
        let status = b.status;
        if (depth >= 3) status = 'finalized';
        else if (depth >= 1) status = 'justified';
        else status = 'pending';
        
        return { ...b, status, confirmations: depth };
      });
    });
  };

  const reset = () => {
    setBlocks([
      { id: 100, status: 'finalized', confirmations: 4 },
      { id: 101, status: 'finalized', confirmations: 3 },
      { id: 102, status: 'justified', confirmations: 2 },
      { id: 103, status: 'pending', confirmations: 1 },
    ]);
  };

  const targetBlock = blocks.find(b => b.id === 102);
  const safetyLevel = targetBlock ? (targetBlock.status === 'finalized' ? 100 : targetBlock.status === 'justified' ? 66 : 20) : 0;

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[550px] flex flex-col justify-between transition-colors text-left text-gray-900 dark:text-white">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* HUD Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Database size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-blue-400">Settlement Status</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-xl font-black text-gray-800 dark:text-slate-200 uppercase tracking-tighter transition-colors">
                   {targetBlock?.status || 'Searching...'}
                </div>
                <div className={clsx("w-2 h-2 rounded-full transition-all duration-500", targetBlock?.status === 'finalized' ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-amber-500">Immutability Score</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-gray-800 dark:text-slate-200 transition-colors">{safetyLevel}<span className="text-[10px] text-gray-400 dark:text-slate-500">%</span></div>
                <span className="text-[8px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Confidence</span>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Activity size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-indigo-400">Validator Quorum</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-lg font-black text-gray-800 dark:text-slate-200 uppercase transition-colors tracking-tight">Supermajority</div>
                <div className="text-[8px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">Reached</div>
             </div>
          </div>
        </div>

        {/* Blockchain Stage */}
        <div className="relative bg-gray-50/30 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 overflow-hidden transition-colors shadow-inner min-h-[220px]">
           <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar pb-6 pt-2">
              <AnimatePresence mode="popLayout">
                 {blocks.map((b) => (
                   <motion.div
                     key={b.id}
                     layout
                     initial={{ scale: 0.8, opacity: 0, x: 20 }}
                     animate={{ scale: 1, opacity: 1, x: 0 }}
                     className={clsx(
                       "relative flex-shrink-0 w-24 h-36 border-2 rounded-2xl transition-all duration-500 flex flex-col items-center justify-center gap-3 group shadow-sm",
                       b.id === 102 ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 z-20 scale-105" : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900",
                       b.status === 'finalized' ? "border-emerald-500/30 dark:border-emerald-500/20 shadow-emerald-500/5" : ""
                     )}
                   >
                      <div className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.2em]">Block</div>
                      <div className={clsx("text-sm font-black transition-colors", b.id === 102 ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-slate-300")}>#{b.id}</div>
                      
                      {b.id === 102 && (
                        <div className="absolute -top-3 bg-blue-600 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/30">
                           Your TX
                        </div>
                      )}

                      <div className="flex flex-col items-center gap-1">
                         {b.status === 'finalized' ? (
                           <>
                             <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 transition-colors">
                               <Lock size={14} />
                             </div>
                             <span className="text-[7px] font-black text-emerald-600 dark:text-emerald-500 uppercase">Finalized</span>
                           </>
                         ) : b.status === 'justified' ? (
                           <>
                             <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 transition-colors">
                               <CheckCircle2 size={14} />
                             </div>
                             <span className="text-[7px] font-black text-indigo-600 dark:text-indigo-500 uppercase">Justified</span>
                           </>
                         ) : (
                           <>
                             <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 animate-pulse transition-colors">
                               <Unlock size={14} />
                             </div>
                             <span className="text-[7px] font-black text-amber-600 dark:text-amber-500 uppercase animate-pulse">Proposed</span>
                           </>
                         )}
                      </div>

                      <div className="absolute bottom-2 text-[6px] font-black text-gray-300 dark:text-slate-700 uppercase tracking-tighter transition-colors">
                         Depth: {b.confirmations}
                      </div>
                   </motion.div>
                 ))}
              </AnimatePresence>

              <button 
                onClick={addBlock}
                className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-emerald-500 hover:text-emerald-500 transition-all group outline-none"
              >
                 <Plus size={20} className="group-hover:scale-110 transition-transform" />
                 <span className="text-[7px] font-black uppercase">Block</span>
              </button>
           </div>

           <div className="absolute top-6 right-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-widest">Settlement active</span>
           </div>
        </div>

        {/* Analytics Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-3 transition-colors">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2 text-orange-500">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Reversal Probability</span>
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 transition-colors">{Math.max(0, 100 - safetyLevel)}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.max(0, 100 - safetyLevel)}%` }}
                   className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                 />
              </div>
           </div>

           <div className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-3 transition-colors">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2 text-emerald-500">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Safety Threshold</span>
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 transition-colors">{safetyLevel}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${safetyLevel}%` }}
                   className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                 />
              </div>
           </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50">
        <div className="flex items-start gap-3 max-w-lg text-left">
           <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex-shrink-0 transition-colors">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
           </div>
           <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
              <span className="text-emerald-600 dark:text-emerald-400 uppercase mr-1">Economic Finality:</span>
              Once finalized, a block cannot be reverted without burning at least 1/3rd of the total staked ETH. This provides deterministic settlement.
           </p>
        </div>

        <button 
          onClick={reset}
          className="px-8 py-4 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-800 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 shadow-sm outline-none"
        >
          <RefreshCcw size={12} /> Reset Simulation
        </button>
      </div>
    </div>
  );
};

export default FinalityViz;
