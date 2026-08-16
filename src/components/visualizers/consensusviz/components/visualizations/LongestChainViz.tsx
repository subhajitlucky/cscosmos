import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitFork, Trophy, Activity, Database, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface Block {
  id: string;
  chain: 'A' | 'B';
  height: number;
  timestamp: string;
}

const LongestChainViz: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '100', chain: 'A', height: 0, timestamp: '12:00:01' },
    { id: '101', chain: 'A', height: 1, timestamp: '12:10:05' },
  ]);
  const [logs, setLogs] = useState<string[]>(['Network initialized.', 'Genesis block #100 synced.']);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      const rafHandle = requestAnimationFrame(() => {
        el.scrollLeft = el.scrollWidth;
      });
      return () => cancelAnimationFrame(rafHandle);
    }
  }, [blocks]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const addBlock = (chain: 'A' | 'B') => {
    const chainBlocks = blocks.filter(b => b.chain === chain);
    
    const lastBlock = chainBlocks[chainBlocks.length - 1];
    const newHeight = lastBlock ? lastBlock.height + 1 : 1;
    const newId = (100 + blocks.length + 1).toString();
    const now = new Date().toLocaleTimeString([], { hour12: false });

    let newBlocks: Block[];
    if (chain === 'B' && !blocks.some(b => b.chain === 'B')) {
      // Branching from #100
      newBlocks = [...blocks, { id: '101b', chain: 'B', height: 1, timestamp: now }];
      addLog(`Branch detected! Block #101b found by Pool B.`);
    } else {
      newBlocks = [...blocks, { id: newId, chain, height: newHeight, timestamp: now }];
      addLog(`New block #${newId} found by Pool ${chain}.`);
    }

    // Check for reorg
    const newChainLen = newBlocks.filter(b => b.chain === chain).length;
    const otherChainLen = newBlocks.filter(b => b.chain !== chain).length;
    
    if (newChainLen > otherChainLen && otherChainLen > 0) {
       addLog(`Nodes resolving to Pool ${chain} (Longest Chain).`);
    }

    setBlocks(newBlocks);
  };

  const chainA = blocks.filter(b => b.chain === 'A');
  const chainB = blocks.filter(b => b.chain === 'B');
  const maxA = chainA.length;
  const maxB = chainB.length;
  
  const activeChain = maxA >= maxB ? 'A' : 'B';
  const isForked = maxB > 0;

  const reset = () => {
    setBlocks([
      { id: '100', chain: 'A', height: 0, timestamp: '12:00:01' },
      { id: '101', chain: 'A', height: 1, timestamp: '12:10:05' },
    ]);
    setLogs(['Network reset.', 'Chain state normalized.']);
  };

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[550px] flex flex-col justify-between transition-colors text-left">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* HUD Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24">
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Database size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Chain Statistics</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-gray-800 dark:text-slate-200">{blocks.length} <span className="text-[10px] text-gray-400 dark:text-slate-600 uppercase">Total Blocks</span></div>
                <div className="text-[10px] text-blue-500 font-black">HEAD: #{blocks[blocks.length-1].id}</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24">
             <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <GitFork size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Network Topology</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-gray-800 dark:text-slate-200">{isForked ? '2' : '1'} <span className="text-[10px] text-gray-400 dark:text-slate-600 uppercase">Active Branches</span></div>
                <div className={clsx("text-[10px] font-black uppercase", isForked ? "text-amber-500" : "text-emerald-500")}>
                   {isForked ? 'Branch Contention' : 'Stable State'}
                </div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl overflow-hidden h-24">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <Activity size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-left">Consensus Feed</span>
             </div>
             <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={clsx("text-[8px] truncate", i === 0 ? "text-blue-500 font-bold" : "text-gray-400 dark:text-slate-600")}>
                    {`> ${log}`}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Chain Visualizer Area */}
        <div className="relative bg-gray-50/30 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 overflow-hidden shadow-inner transition-colors">
           <div className="flex flex-col gap-12 relative overflow-x-auto custom-scrollbar pb-8" ref={scrollRef}>
              
              {/* Pool A */}
              <div className="flex items-center gap-6">
                 <div className="flex-shrink-0 w-24 h-16 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm">
                    <div className={clsx("w-2 h-2 rounded-full", activeChain === 'A' ? "bg-emerald-500 animate-pulse" : "bg-gray-300 dark:bg-slate-700")} />
                    <span className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Pool Alpha</span>
                    <span className="text-[10px] font-bold text-gray-800 dark:text-slate-300">{maxA} Blocks</span>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <AnimatePresence>
                       {chainA.map((b, i) => (
                         <motion.div
                           key={b.id}
                           initial={{ scale: 0, x: -20, opacity: 0 }}
                           animate={{ 
                             scale: 1, 
                             x: 0,
                             opacity: activeChain === 'A' ? 1 : 0.3,
                             borderColor: activeChain === 'A' ? '#3b82f6' : 'rgba(226, 232, 240, 0.5)'
                           }}
                           className="flex-shrink-0 w-16 h-16 border-2 rounded-2xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-1 shadow-sm transition-colors"
                         >
                            <span className="text-[8px] font-black text-gray-400">#{b.id}</span>
                            {activeChain === 'A' && i === chainA.length - 1 && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <Trophy className="w-4 h-4 text-amber-500" />
                              </motion.div>
                            )}
                            <div className="text-[7px] text-gray-300 dark:text-slate-700">{b.timestamp}</div>
                         </motion.div>
                       ))}
                    </AnimatePresence>
                    
                    <button 
                      onClick={() => addBlock('A')}
                      className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-all group"
                    >
                       <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       <span className="text-[7px] font-black uppercase">Mine</span>
                    </button>
                 </div>
              </div>

              {/* Pool B */}
              <div className="flex items-center gap-6">
                 <div className="flex-shrink-0 w-24 h-16 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm">
                    <div className={clsx("w-2 h-2 rounded-full", activeChain === 'B' ? "bg-emerald-500 animate-pulse" : "bg-gray-300 dark:bg-slate-700")} />
                    <span className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Pool Bravo</span>
                    <span className="text-[10px] font-bold text-gray-800 dark:text-slate-300">{maxB} Blocks</span>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    {/* Placeholder for fork alignment */}
                    <div className="flex-shrink-0 w-16 h-16 invisible" />
                    
                    <AnimatePresence>
                       {chainB.map((b, i) => (
                         <motion.div
                           key={b.id}
                           initial={{ scale: 0, x: -20, opacity: 0 }}
                           animate={{ 
                             scale: 1, 
                             x: 0,
                             opacity: activeChain === 'B' ? 1 : 0.3,
                             borderColor: activeChain === 'B' ? '#3b82f6' : 'rgba(226, 232, 240, 0.5)'
                           }}
                           className="flex-shrink-0 w-16 h-16 border-2 rounded-2xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-1 shadow-sm transition-colors"
                         >
                            <span className="text-[8px] font-black text-gray-400">#{b.id}</span>
                            {activeChain === 'B' && i === chainB.length - 1 && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <Trophy className="w-4 h-4 text-amber-500" />
                              </motion.div>
                            )}
                            <div className="text-[7px] text-gray-300 dark:text-slate-700">{b.timestamp}</div>
                         </motion.div>
                       ))}
                    </AnimatePresence>
                    
                    <button 
                      onClick={() => addBlock('B')}
                      className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-all group"
                    >
                       <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       <span className="text-[7px] font-black uppercase">Mine</span>
                    </button>
                 </div>
              </div>

              {/* Fork Connector SVG */}
              {isForked && (
                <svg className="absolute left-[120px] top-1/2 -translate-y-1/2 pointer-events-none w-20 h-24 overflow-visible z-0 opacity-20 dark:opacity-40">
                   <motion.path 
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     d="M 0 12 L 20 12 L 20 60 L 40 60"
                     fill="transparent"
                     stroke="#3b82f6"
                     strokeWidth="2"
                     strokeDasharray="4 4"
                   />
                </svg>
              )}
           </div>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50">
        <div className="flex items-start gap-3 max-w-md">
           <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
           </div>
           <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed text-left font-bold">
              <span className="text-blue-600 dark:text-blue-400 uppercase mr-1">Consensus Rule:</span>
              The network always follows the chain with the most work (highest block count). Try mining on Pool Bravo until it's longer than Pool Alpha to see a reorganization.
           </p>
        </div>

        <button 
          onClick={reset}
          className="px-8 py-4 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-800 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2"
        >
          <RefreshCw size={12} /> Reset Simulation
        </button>
      </div>
    </div>
  );
};

export default LongestChainViz;