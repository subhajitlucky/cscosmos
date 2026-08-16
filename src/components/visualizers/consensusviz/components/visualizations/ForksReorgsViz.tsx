import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitFork, RefreshCcw, CheckCircle2, AlertTriangle, Database, Activity, Layout } from 'lucide-react';
import { clsx } from 'clsx';

const ForksReorgsViz: React.FC = () => {
  const [stage, setStage] = useState(0); // 0: stable, 1: fork, 2: reorg

  const next = () => setStage((s) => (s + 1) % 3);

  const blocks = {
    base: [
      { id: '100', x: 60, y: 150 },
      { id: '101', x: 140, y: 150 },
    ],
    chainA: [
      { id: '102A', x: 220, y: 100 },
      { id: '103A', x: 300, y: 100 },
    ],
    chainB: [
      { id: '102B', x: 220, y: 200 },
      { id: '103B', x: 300, y: 200 },
      { id: '104B', x: 380, y: 200 },
    ]
  };

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[500px] flex flex-col justify-between transition-colors text-left text-gray-900 dark:text-white">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* HUD Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Layout size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-blue-400">Network Status</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-xl font-black text-gray-800 dark:text-slate-200 uppercase tracking-tighter transition-colors">
                   {stage === 0 ? 'Synchronized' : stage === 1 ? 'Contention' : 'Reorganized'}
                </div>
                <div className={clsx("w-2 h-2 rounded-full transition-all duration-500", stage === 0 ? "bg-emerald-500" : stage === 1 ? "bg-amber-500 animate-pulse" : "bg-blue-500")} />
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <GitFork size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-amber-500">Fork Analysis</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-lg font-black text-gray-800 dark:text-slate-200 uppercase transition-colors">
                   {stage === 0 ? 'None Detected' : 'Split Detected'}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-tighter">Depth: {stage === 0 ? '0' : '2'}</span>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Activity size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-indigo-400">Global Sync</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-gray-800 dark:text-slate-200 transition-colors">{stage === 2 ? '100' : stage === 1 ? '48' : '100'}<span className="text-[10px] text-gray-400 dark:text-slate-500">%</span></div>
                <div className="text-[8px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Propagation</div>
             </div>
          </div>
        </div>

        {/* Visualizer Stage */}
        <div className="relative bg-gray-50/30 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 overflow-hidden min-h-[300px] flex items-center justify-center transition-colors">
           <svg viewBox="0 0 450 300" className="w-full h-full max-w-[500px]">
              {/* Connection Lines */}
              <g className="opacity-20 dark:opacity-40">
                 {/* Base Lines */}
                 <line x1={60} y1={150} x2={140} y2={150} stroke="#3b82f6" strokeWidth="2" />
                 
                 <AnimatePresence>
                    {stage >= 1 && (
                       <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {/* Fork Branches */}
                          <line x1={140} y1={150} x2={220} y2={100} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
                          <line x1={140} y1={150} x2={220} y2={200} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
                          
                          {/* Chain A Lines */}
                          <line x1={220} y1={100} x2={300} y2={100} stroke="#3b82f6" strokeWidth="2" />
                          
                          {/* Chain B Lines */}
                          <line x1={220} y1={200} x2={300} y2={200} stroke="#3b82f6" strokeWidth="2" />
                          {stage === 2 && <line x1={300} y1={200} x2={380} y2={200} stroke="#3b82f6" strokeWidth="2" />}
                       </motion.g>
                    )}
                 </AnimatePresence>
              </g>

              {/* Blocks */}
              {/* Genesis & Base */}
              {blocks.base.map((b) => (
                <g key={b.id}>
                  <rect x={b.x - 25} y={b.y - 25} width="50" height="50" rx="12" className="fill-white dark:fill-slate-900 stroke-blue-500/30" strokeWidth="2" />
                  <text x={b.x} y={b.y + 5} textAnchor="middle" className="text-[10px] font-black fill-gray-800 dark:fill-white">#{b.id}</text>
                </g>
              ))}

              {/* Chain A (Potential Orphans) */}
              {stage >= 1 && blocks.chainA.map((b) => (
                <motion.g key={b.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: stage === 2 ? 0.2 : 1 }}>
                  <rect x={b.x - 25} y={b.y - 25} width="50" height="50" rx="12" className={clsx(
                    "fill-white dark:fill-slate-900 transition-colors duration-500",
                    stage === 2 ? "stroke-red-500/20" : "stroke-blue-500/30"
                  )} strokeWidth="2" />
                  <text x={b.x} y={b.y + 5} textAnchor="middle" className="text-[10px] font-black fill-gray-800 dark:fill-white">#{b.id}</text>
                  {stage === 2 && (
                    <text x={b.x} y={b.y + 40} textAnchor="middle" className="text-[7px] font-black fill-red-500 uppercase tracking-tighter">Orphaned</text>
                  )}
                </motion.g>
              ))}

              {/* Chain B (The Winner) */}
              {stage >= 1 && blocks.chainB.map((b, i) => (
                <motion.g 
                  key={b.id} 
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ 
                    scale: (b.id === '104B' && stage < 2) ? 0 : 1,
                    opacity: (b.id === '104B' && stage < 2) ? 0 : 1
                  }}
                >
                  <rect x={b.x - 25} y={b.y - 25} width="50" height="50" rx="12" className={clsx(
                    "transition-all duration-700",
                    stage === 2 ? "fill-emerald-500/10 stroke-emerald-500 shadow-lg shadow-emerald-500/20" : "fill-white dark:fill-slate-900 stroke-blue-500/30"
                  )} strokeWidth="2" />
                  <text x={b.x} y={b.y + 5} textAnchor="middle" className="text-[10px] font-black fill-gray-800 dark:fill-white">#{b.id}</text>
                  {stage === 2 && i === 2 && (
                    <motion.foreignObject x={b.x + 15} y={b.y - 35} width="20" height="20" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                       <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    </motion.foreignObject>
                  )}
                </motion.g>
              ))}
           </svg>

           {/* Feedback Badge */}
           <div className="absolute top-6 right-6">
              <AnimatePresence mode="wait">
                 {stage === 1 && (
                   <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm transition-colors">
                      <AlertTriangle size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Branching Conflict</span>
                   </motion.div>
                 )}
                 {stage === 2 && (
                   <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm transition-colors">
                      <RefreshCcw size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Reorg Complete</span>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50">
        <div className="flex items-start gap-3 max-w-md text-left">
           <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex-shrink-0 transition-colors">
              <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
           </div>
           <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold">
              {stage === 0 && "Current network is synchronized. Block production is stable and sequential."}
              {stage === 1 && "Fork detected! Two pools found blocks at the same time. The network is split between Chain A and Chain B."}
              {stage === 2 && "Consensus reached. Pool Bravo mined a longer chain (#104B). The network reorganization (reorg) automatically orphaned Chain A."}
           </p>
        </div>

        <button 
          onClick={next}
          className={clsx(
            "group relative px-10 py-4 rounded-xl overflow-hidden transition-all active:scale-95 border-b-4 font-black uppercase tracking-widest text-[10px] flex items-center gap-2",
            stage === 2 
              ? "bg-slate-800 border-slate-950 text-white" 
              : "bg-blue-600 border-blue-800 text-white shadow-lg shadow-blue-500/20"
          )}
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative flex items-center gap-2">
            {stage === 2 ? <RefreshCcw size={14} /> : <Activity size={14} />}
            {stage === 0 ? 'Simulate Fork' : stage === 1 ? 'Resolve Conflict' : 'Reset Monitor'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ForksReorgsViz;