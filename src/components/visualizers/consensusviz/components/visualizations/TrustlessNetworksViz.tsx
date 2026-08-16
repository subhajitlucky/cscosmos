import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, User, ShieldCheck, Send, CheckCircle2, X, Database, Layout, Globe } from 'lucide-react';
import { clsx } from 'clsx';

const TrustlessNetworksViz: React.FC = () => {
  const [mode, setMode] = useState<'centralized' | 'decentralized'>('centralized');
  const [isTransacting, setIsTransacting] = useState(false);
  const [verifyingNodes, setVerifyingNodes] = useState<number[]>([]);

  const users = [
    { id: 1, pos: { x: 50, y: 100 }, label: 'Node_01' },
    { id: 2, pos: { x: 250, y: 100 }, label: 'Node_02' },
    { id: 3, pos: { x: 50, y: 250 }, label: 'Node_03' },
    { id: 4, pos: { x: 250, y: 250 }, label: 'Node_04' },
  ];

  const triggerTransaction = async () => {
    if (isTransacting) return;
    setIsTransacting(true);
    setVerifyingNodes([]);

    if (mode === 'centralized') {
      // Step 1: User 1 sends to server
      await new Promise(r => setTimeout(r, 800));
      setVerifyingNodes([0]); // The server "verifies"
      // Step 2: Server updates, sends to others
      await new Promise(r => setTimeout(r, 800));
    } else {
      // Step 1: User 1 broadcasts to all neighbors
      await new Promise(r => setTimeout(r, 800));
      // Step 2: Nodes verify independently
      for (let i = 1; i <= users.length; i++) {
        await new Promise(r => setTimeout(r, 200));
        setVerifyingNodes(prev => [...prev, i]);
      }
    }

    await new Promise(r => setTimeout(r, 2000));
    setIsTransacting(false);
    setVerifyingNodes([]);
  };

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[600px] flex flex-col justify-between transition-colors text-left text-gray-900 dark:text-white">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* Network HUD Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase">
                <Layout size={14} />
                <span className="text-[10px] tracking-widest">Topology Mode</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-xl font-black uppercase tracking-tighter transition-colors">{mode === 'centralized' ? 'Star_Net' : 'P2P_Mesh'}</div>
                <div className="text-[8px] text-blue-500 font-black uppercase tracking-widest">Config: v1.2</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold uppercase">
                <Globe size={14} />
                <span className="text-[10px] tracking-widest">Trust Model</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-lg font-black text-gray-800 dark:text-slate-200 uppercase transition-colors">{mode === 'centralized' ? 'Mediated' : 'Trustless'}</div>
                <div className={clsx("text-[8px] font-black uppercase tracking-widest", mode === 'centralized' ? "text-amber-500" : "text-emerald-500")}>
                   {mode === 'centralized' ? 'Authority_Needed' : 'Direct_Verification'}
                </div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl overflow-hidden h-24 transition-colors">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2 font-bold uppercase">
                <Database size={14} />
                <span className="text-[10px] tracking-widest">Verification Status</span>
             </div>
             <div className="space-y-1">
                <div className={clsx("text-[8px] truncate font-bold", isTransacting ? "text-blue-500 animate-pulse" : "text-gray-400")}>
                   {isTransacting ? `> SYNCHRONIZING: ${verifyingNodes.length} OK` : '> STANDBY: WAITING_FOR_TX'}
                </div>
                <div className="text-[8px] text-gray-400 dark:text-slate-600 truncate uppercase tracking-tighter">
                   {`> GLOBAL_CONSENSUS: ${verifyingNodes.length === (mode === 'centralized' ? 1 : 4) ? 'SETTLED' : 'IDLE'}`}
                </div>
             </div>
          </div>
        </div>

        {/* Network Stage */}
        <div className="relative h-[350px] w-full border border-gray-100 dark:border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden bg-gray-50/30 dark:bg-slate-950 shadow-inner transition-colors">
           {/* Radar Lines */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] dark:opacity-20">
              <div className="absolute w-[280px] h-[280px] border border-blue-500/20 rounded-full" />
              <div className="w-[1px] h-full bg-blue-500/20" />
              <div className="h-[1px] w-full bg-blue-500/20" />
           </div>

           <svg viewBox="0 0 300 350" className="w-full h-full max-w-[350px]">
              {/* Static Connections */}
              <g className="opacity-20 dark:opacity-40 transition-opacity">
                 {mode === 'centralized' ? (
                   users.map((u) => (
                     <line key={`l-${u.id}`} x1={150} y1={175} x2={u.pos.x} y2={u.pos.y} stroke="currentColor" strokeWidth="1.5" className="text-blue-500" />
                   ))
                 ) : (
                   users.map((u, i) => users.slice(i + 1).map((v) => (
                     <line key={`l-${u.id}-${v.id}`} x1={u.pos.x} y1={u.pos.y} x2={v.pos.x} y2={v.pos.y} stroke="currentColor" strokeWidth="1" className="text-indigo-500" />
                   )))
                 )}
              </g>

              {/* Animated Message Flow */}
              <AnimatePresence>
                {isTransacting && mode === 'centralized' && (
                  <>
                    <motion.circle
                      initial={{ cx: 50, cy: 100, r: 0 }}
                      animate={{ cx: 150, cy: 175, r: 4 }}
                      transition={{ duration: 0.8 }}
                      className="fill-blue-500 shadow-lg shadow-blue-500/50"
                    />
                    {verifyingNodes.includes(0) && users.slice(1).map(u => (
                      <motion.circle
                        key={`flow-${u.id}`}
                        initial={{ cx: 150, cy: 175, r: 4 }}
                        animate={{ cx: u.pos.x, cy: u.pos.y, r: 4 }}
                        transition={{ duration: 0.8 }}
                        className="fill-blue-500 shadow-lg shadow-blue-500/50"
                      />
                    ))}
                  </>
                )}

                {isTransacting && mode === 'decentralized' && (
                  <>
                    {users.slice(1).map(u => (
                      <motion.circle
                        key={`p2p-${u.id}`}
                        initial={{ cx: 50, cy: 100, r: 0 }}
                        animate={{ cx: u.pos.x, cy: u.pos.y, r: 4 }}
                        transition={{ duration: 0.8 }}
                        className="fill-indigo-500 shadow-lg shadow-indigo-500/50"
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* Center Authority Server */}
              {mode === 'centralized' && (
                <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <circle cx="150" cy="175" r="25" className={clsx("transition-colors duration-500 shadow-xl", verifyingNodes.includes(0) ? "fill-emerald-500/20 stroke-emerald-500" : "fill-blue-500/20 stroke-blue-500")} strokeWidth="2" />
                  <foreignObject x="138" y="163" width="24" height="24">
                    <Server className={clsx("w-6 h-6 transition-colors duration-500", verifyingNodes.includes(0) ? "text-emerald-500" : "text-blue-500")} />
                  </foreignObject>
                  <text x="150" y="215" textAnchor="middle" className="text-[7px] font-black fill-gray-400 uppercase tracking-widest transition-opacity">Authority</text>
                </motion.g>
              )}

              {/* Node Terminals */}
              {users.map((u) => (
                <g key={u.id}>
                  <circle 
                    cx={u.pos.x} cy={u.pos.y} r="20" 
                    className={clsx(
                      "transition-all duration-500 shadow-lg",
                      verifyingNodes.includes(u.id) 
                        ? 'fill-emerald-500/10 stroke-emerald-500' 
                        : 'fill-white dark:fill-slate-900 stroke-gray-200 dark:stroke-slate-800'
                    )} 
                    strokeWidth="2" 
                  />
                  <foreignObject x={u.pos.x - 10} y={u.pos.y - 10} width="20" height="20">
                    <User className={clsx("w-5 h-5 transition-colors duration-500", verifyingNodes.includes(u.id) ? 'text-emerald-500' : 'text-gray-400')} />
                  </foreignObject>
                  <text x={u.pos.x} y={u.pos.y + 35} textAnchor="middle" className="text-[7px] font-black fill-gray-400 dark:text-slate-600 uppercase tracking-tighter">{u.label}</text>
                  
                  {verifyingNodes.includes(u.id) && mode === 'decentralized' && (
                    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <foreignObject x={u.pos.x + 8} y={u.pos.y - 30} width="16" height="16">
                        <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                      </foreignObject>
                    </motion.g>
                  )}
                </g>
              ))}
           </svg>

           {/* Feedback Badges */}
           <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
              <div className={clsx(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm transition-all duration-500",
                mode === 'centralized' ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-800" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-800"
              )}>
                 {mode === 'centralized' ? <div className="flex items-center gap-1.5"><X size={12} /> Single_Point_of_Failure</div> : <div className="flex items-center gap-1.5"><ShieldCheck size={12} /> Distributed_Resilience</div>}
              </div>
           </div>
        </div>

        {/* Narrative Panel */}
        <div className="min-h-[100px] max-w-2xl text-left">
           <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-2"
              >
                 <h3 className={clsx("text-sm font-black uppercase tracking-widest", mode === 'centralized' ? "text-amber-600 dark:text-amber-400" : "text-indigo-600 dark:text-indigo-400")}>
                    {mode === 'centralized' ? 'Centralized (Star) Topology' : 'Decentralized (P2P Mesh) Topology'}
                 </h3>
                 <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                    {mode === 'centralized' ? "All communication flows through a single server. You must 'trust' the server owner. If it fails, or chooses to lie, you lose access to the truth." : "Every node connects directly to every other node. There is no boss. You don't need to trust anyone because your node verifies the math for every transaction independently."}
                 </p>
              </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Control Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50 transition-colors">
        <div className="flex bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => { setMode('centralized'); setVerifyingNodes([]); }}
            className={clsx(
              "px-6 py-3 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all",
              mode === 'centralized' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
            )}
          >
            Centralized
          </button>
          <button
            onClick={() => { setMode('decentralized'); setVerifyingNodes([]); }}
            className={clsx(
              "px-6 py-3 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all",
              mode === 'decentralized' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
            )}
          >
            Trustless
          </button>
        </div>

        <button
          onClick={triggerTransaction}
          disabled={isTransacting}
          className={clsx(
            "group relative px-10 py-4 rounded-xl overflow-hidden transition-all active:scale-95 border-b-4 font-black uppercase tracking-widest text-[10px] flex items-center gap-3",
            mode === 'centralized' 
              ? "bg-blue-600 border-blue-800 text-white shadow-lg shadow-blue-500/20" 
              : "bg-indigo-600 border-indigo-800 text-white shadow-lg shadow-indigo-500/20"
          )}
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative flex items-center gap-2">
            <Send size={14} />
            {isTransacting ? 'Propagating...' : 'Broadcast TX'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TrustlessNetworksViz;
