import React from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { Play, Pause, Plus, Server, Pickaxe, Zap, Database, Share2, GitFork, RefreshCw, Activity, Terminal, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BlockViz from '../components/visualizations/BlockViz';
import NetworkViz from '../components/visualizations/NetworkViz';
import { clsx } from 'clsx';

const Playground: React.FC = () => {
  const { nodes, mempool, messages, isRunning, toggleSimulation, addNode, toggleMining, triggerFork } = useSimulation();

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-10 px-4 font-mono transition-colors">
      
      {/* Simulation Command Center Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl gap-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 space-y-2 text-left">
           <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Terminal size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command_Center_v2.0</span>
           </div>
           <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
             CONSENSUS_LAB
           </h1>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <div className={clsx("w-1.5 h-1.5 rounded-full", isRunning ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                 <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{isRunning ? 'Simulation_Running' : 'Engine_Standby'}</span>
              </div>
              <div className="w-[1px] h-3 bg-gray-200 dark:bg-slate-800" />
              <div className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{nodes.length} Active_Nodes</div>
           </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3 w-full lg:w-auto">
          <button 
            onClick={toggleSimulation}
            className={clsx(
              "flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 border-b-4",
              isRunning 
                ? "bg-amber-500 border-amber-700 text-white shadow-lg shadow-amber-500/20" 
                : "bg-blue-600 border-blue-800 text-white shadow-lg shadow-blue-500/20"
            )}
          >
            {isRunning ? <><Pause size={14} /> Pause_Engine</> : <><Play size={14} fill="currentColor" /> Initialize_Engine</>}
          </button>
          
          <button 
            onClick={() => addNode(`Node-${nodes.length + 1}`)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <Plus size={14} /> Add_Terminal
          </button>

          <button 
            onClick={triggerFork}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 border-b-4 border-purple-800 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
          >
            <GitFork size={14} /> Inject_Fork
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Network Topology & Mempool HUD */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Global Network HUD */}
          <section className="bg-white dark:bg-slate-950 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            
            <div className="relative z-10 flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Share2 size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Global_Topology</h3>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                 <Activity size={10} className="text-emerald-500 animate-pulse" />
                 <span className="text-[8px] font-bold">P2P_HANDSHAKE_OK</span>
              </div>
            </div>

            <div className="relative flex-1 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-900 shadow-inner">
               <NetworkViz nodes={nodes} messages={messages} />
            </div>

            <div className="relative z-10 mt-6 grid grid-cols-2 gap-4">
               <div className="p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl">
                  <div className="text-[7px] font-black text-gray-400 dark:text-slate-600 uppercase mb-1">Inbound_Bandwidth</div>
                  <div className="text-xs font-black">14.2 <span className="text-gray-400 uppercase text-[8px]">Mbps</span></div>
               </div>
               <div className="p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl">
                  <div className="text-[7px] font-black text-gray-400 dark:text-slate-600 uppercase mb-1">Latency_Avg</div>
                  <div className="text-xs font-black">24 <span className="text-gray-400 uppercase text-[8px]">ms</span></div>
               </div>
            </div>
          </section>

          {/* Mempool Data Stream */}
          <section className="bg-white dark:bg-slate-950 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="relative z-10 flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Database size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Inbound_Stream</h3>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400">{mempool.length} TXs</span>
              </div>
            </div>

            <div className="relative flex-1 flex flex-wrap content-start gap-2.5 p-6 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-900 shadow-inner overflow-hidden">
              {/* Background HUD for Mempool */}
              <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                 <Database size={120} className="text-gray-200 dark:text-slate-900" />
              </div>
              
              <AnimatePresence>
                {mempool.map(tx => (
                  <motion.div
                    key={tx.id}
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: -40, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-3.5 h-3.5 rounded-lg shadow-lg relative group z-10"
                    style={{ backgroundColor: tx.color }}
                  >
                     <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                  </motion.div>
                ))}
              </AnimatePresence>
              {mempool.length === 0 && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-30">
                   <Activity size={24} />
                   <span className="text-[8px] font-black uppercase tracking-widest">Awaiting_Data...</span>
                </div>
              )}
            </div>

            <p className="relative z-10 text-[8px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-tight mt-4 text-center">
              Incoming transactions waiting for validator selection
            </p>
          </section>
        </div>

        {/* Right: Node Control Terminals */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
          {nodes.map(node => (
            <motion.div 
              key={node.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden relative group transition-colors"
            >
              {/* Glass Effect Highlight */}
              <div className={clsx(
                "absolute inset-0 opacity-[0.03] transition-opacity duration-1000",
                node.isMining ? "opacity-[0.08] dark:opacity-20 bg-gradient-to-br from-amber-500 to-transparent" : "bg-gradient-to-br from-blue-500 to-transparent"
              )} />

              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 border-2",
                    node.isMining 
                      ? "bg-amber-500 border-amber-400 text-white shadow-amber-500/20 animate-pulse" 
                      : "bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  )}>
                    <Server size={24} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                       <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{node.id}</h3>
                       <div className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                          <span className="text-[7px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">OS: v2.4</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                       <div className="flex items-center gap-1.5">
                          <Database size={10} className="text-gray-400 dark:text-gray-500" />
                          <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Blocks: {node.chain.length}</span>
                       </div>
                       <div className="w-[1px] h-2 bg-gray-200 dark:bg-slate-800" />
                       <div className="flex items-center gap-1.5">
                          <ShieldCheck size={10} className={node.isMining ? "text-amber-500" : "text-emerald-500"} />
                          <span className={clsx("text-[9px] font-black uppercase tracking-widest", node.isMining ? "text-amber-500 animate-pulse" : "text-emerald-500")}>
                             {node.isMining ? 'STATUS: COMPUTING' : 'STATUS: SYNCED'}
                          </span>
                       </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleMining(node.id)}
                  className={clsx(
                    "flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 border-b-4",
                    node.isMining 
                      ? "bg-amber-500 border-amber-700 text-white shadow-lg shadow-amber-500/20" 
                      : "bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 shadow-sm"
                  )}
                >
                  {node.isMining ? <><RefreshCw size={14} className="animate-spin" /> Halt_Process</> : <><Pickaxe size={14} /> Eng_Compute</>}
                </button>
              </div>

              <div className="relative z-10 bg-gray-50/50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-900 p-4 shadow-inner overflow-hidden">
                 <div className="flex gap-4 overflow-x-auto pb-4 pt-2 custom-scrollbar scroll-smooth">
                   {node.chain.slice().reverse().map((block, i) => (
                     <div key={block.id} className="flex-shrink-0">
                       <BlockViz block={block} isHead={i === 0} />
                     </div>
                   ))}
                   {node.isMining && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="flex-shrink-0 w-32 h-44 border-2 border-dashed border-amber-500/30 rounded-2xl flex flex-col items-center justify-center gap-3 bg-amber-500/[0.02]"
                     >
                        <RefreshCw size={24} className="text-amber-500/40 animate-spin" />
                        <span className="text-[8px] font-black text-amber-500/40 uppercase tracking-[0.2em]">Forging...</span>
                     </motion.div>
                   )}
                 </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
          
          {nodes.length === 0 && (
            <div className="py-20 text-center space-y-4 bg-gray-50 dark:bg-slate-950/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
               <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-slate-900 text-gray-400 dark:text-gray-500">
                  <Plus size={32} />
               </div>
               <div className="space-y-1">
                  <h4 className="text-lg font-black text-gray-500 dark:text-gray-400 uppercase">No active terminals</h4>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Initialize a node to begin simulation</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* System Footer Info */}
      <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Database size={14} className="text-blue-500" />
               <span className="text-[8px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Protocol: Nakamoto_PoW_Standard</span>
            </div>
            <div className="flex items-center gap-2">
               <Zap size={14} className="text-amber-500" />
               <span className="text-[8px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Diff_Target: Fixed_v1.0</span>
            </div>
         </div>
         <div className="text-[8px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-[0.3em]">Visual_Consensus_Environment_v2.0.4</div>
      </div>
    </div>
  );
};

export default Playground;