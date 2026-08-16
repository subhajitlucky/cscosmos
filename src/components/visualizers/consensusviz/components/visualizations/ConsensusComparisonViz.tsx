import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Leaf, Scale, Cpu, Wallet, Zap, Globe, Activity, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';

interface Metric {
  id: string;
  label: string;
  icon: React.ReactNode;
  pow: {
    value: string;
    score: number; // 1-10
    detail: string;
  };
  pos: {
    value: string;
    score: number; // 1-10
    detail: string;
  };
}

const ConsensusComparisonViz: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<string>('energy');

  const metrics: Metric[] = [
    { 
      id: 'energy',
      label: "Energy Efficiency", 
      icon: <Leaf className="w-4 h-4" />,
      pow: { value: "Extreme", score: 1, detail: "Requires global-scale electricity to maintain hashrate security." },
      pos: { value: "Minimal", score: 10, detail: "Reduces energy footprint by 99.9%—comparable to a standard server." }
    },
    { 
      id: 'security',
      label: "Security Type", 
      icon: <Shield className="w-4 h-4" />,
      pow: { value: "Physical", score: 9, detail: "Security is anchored in physical energy expenditure (unforgeable work)." },
      pos: { value: "Economic", score: 8, detail: "Security is anchored in financial capital at risk (slashing deterrent)." }
    },
    { 
      id: 'hardware',
      label: "Hardware Req.", 
      icon: <Cpu className="w-4 h-4" />,
      pow: { value: "ASIC/GPU", score: 3, detail: "Requires specialized, expensive industrial-grade computing rigs." },
      pos: { value: "Standard", score: 9, detail: "Can run on standard consumer-grade servers or cloud instances." }
    },
    { 
      id: 'entry',
      label: "Entry Barrier", 
      icon: <Wallet className="w-4 h-4" />,
      pow: { value: "Hardware", score: 4, detail: "Cost of entry is physical equipment and cheap electricity access." },
      pos: { value: "Staked Capital", score: 5, detail: "Cost of entry is acquiring and locking a significant amount of native tokens." }
    }
  ];

  const current = metrics.find(m => m.id === activeMetric) || metrics[0];

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[600px] flex flex-col justify-between transition-colors text-left text-gray-900 dark:text-white">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* HUD Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Zap size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-blue-400">PoW Strength</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-xl font-black text-gray-800 dark:text-slate-200 uppercase tracking-tighter">Physical</div>
                <div className="text-[8px] text-blue-500 font-black uppercase tracking-tighter">Decentralized</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Globe size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-indigo-400">PoS Strength</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-xl font-black text-gray-800 dark:text-slate-200 uppercase tracking-tighter">Scalable</div>
                <div className="text-[8px] text-indigo-500 font-black uppercase tracking-tighter">Efficiency</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Activity size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-emerald-400">Network Goal</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-xl font-black text-gray-800 dark:text-slate-200 uppercase tracking-tighter">Consensus</div>
                <div className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Global Sync</div>
             </div>
          </div>
        </div>

        {/* Matrix Comparison Table */}
        <div className="bg-gray-50/30 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-inner transition-colors">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 transition-colors">
                <th className="p-4 sm:p-6 text-[9px] font-black uppercase tracking-widest text-gray-400">Analytics Matrix</th>
                <th className="p-4 sm:p-6 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Proof_Work</th>
                <th className="p-4 sm:p-6 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Proof_Stake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50 dark:divide-slate-800/50">
              {metrics.map((m) => (
                <tr 
                  key={m.id}
                  onClick={() => setActiveMetric(m.id)}
                  className={clsx(
                    "cursor-pointer transition-all duration-300",
                    activeMetric === m.id ? "bg-blue-50/30 dark:bg-blue-900/10" : "hover:bg-gray-50/50 dark:hover:bg-slate-900/30"
                  )}
                >
                  <td className="p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "p-2 rounded-lg transition-colors",
                        activeMetric === m.id ? "bg-white dark:bg-slate-800 text-blue-500 shadow-sm" : "text-gray-400"
                      )}>
                        {m.icon}
                      </div>
                      <span className={clsx("text-xs font-bold transition-colors", activeMetric === m.id ? "text-gray-900 dark:text-white" : "text-gray-500")}>
                        {m.label}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-6">
                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">{m.pow.value}</div>
                      <div className="h-1 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${m.pow.score * 10}%` }}
                          className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 sm:p-6">
                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">{m.pos.value}</div>
                      <div className="h-1 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${m.pos.score * 10}%` }}
                          className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Insight HUD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMetric}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 transition-colors">
               <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                  <BarChart3 size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">PoW Detailed Insight</span>
               </div>
               <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed font-bold italic transition-colors">
                 "{current.pow.detail}"
               </p>
            </div>
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 transition-colors">
               <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                  <BarChart3 size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">PoS Detailed Insight</span>
               </div>
               <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed font-bold italic transition-colors">
                 "{current.pos.detail}"
               </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50 transition-colors">
        <div className="flex items-start gap-3 max-w-lg text-left">
           <div className="p-2 bg-gray-100 dark:bg-slate-900 rounded-lg flex-shrink-0 transition-colors">
              <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
           </div>
           <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase tracking-tight transition-colors">
              <span className="text-blue-600 dark:text-blue-400 uppercase mr-1">Final Verdict:</span>
              PoW prioritizing physical unforgeability and maximum decentralization. PoS prioritizing economic efficiency, scalability, and instant finality. Both are valid paths to trustless agreement.
           </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-4 py-2 rounded-xl transition-colors">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-[9px] text-gray-400 dark:text-slate-600 font-black uppercase tracking-[0.2em]">Matrix_Live_v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default ConsensusComparisonViz;