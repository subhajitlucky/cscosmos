import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Activity, Database, TowerControl, Swords, Crown, Flag, RefreshCcw } from 'lucide-react';
import { clsx } from 'clsx';

type GeneralStatus = 'idle' | 'messaging' | 'attacking';

interface General {
  id: 'N' | 'E' | 'S' | 'W';
  label: string;
  isTraitor: boolean;
  color: string;
  emoji: string;
}

const ConsensusIntroViz: React.FC = () => {
  const [status, setStatus] = useState<GeneralStatus>('idle');
  const [hasTraitor, setHasTraitor] = useState(false);
  const [consensus, setConsensus] = useState<boolean | null>(null);
  const [distance, setDistance] = useState(110);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setDistance(80);
      } else {
        setDistance(110);
      }
    };
    
    const rafHandle = requestAnimationFrame(() => {
      handleResize();
    });
    
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(rafHandle);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const generals: General[] = [
    { id: 'N', label: 'Gen_N', isTraitor: hasTraitor, color: '#3b82f6', emoji: '💂‍♂️' },
    { id: 'E', label: 'Gen_E', isTraitor: false, color: '#a855f7', emoji: '💂‍♀️' },
    { id: 'S', label: 'Gen_S', isTraitor: false, color: '#f97316', emoji: '💂‍♂️' },
    { id: 'W', label: 'Gen_W', isTraitor: false, color: '#ec4899', emoji: '💂‍♀️' },
  ];

  const [animationDelays] = useState(() => generals.map(() => Math.random()));

  const getPos = (id: string) => {
    switch (id) {
      case 'N': return { x: 0, y: -distance };
      case 'S': return { x: 0, y: distance };
      case 'E': return { x: distance, y: 0 };
      case 'W': return { x: -distance, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  const getBubbleStyle = (id: 'N' | 'E' | 'S' | 'W') => {
    const isSmall = window.innerWidth < 480;
    const offset = isSmall ? "12" : "14";
    switch (id) {
      case 'N': return `-top-${offset} left-1/2 -translate-x-1/2`; 
      case 'S': return `-bottom-${offset} left-1/2 -translate-x-1/2`; 
      case 'E': return "top-1/2 -translate-y-1/2 -right-2 translate-x-full"; 
      case 'W': return "top-1/2 -translate-y-1/2 -left-2 -translate-x-full"; 
      default: return "";
    }
  };

  const getArrowStyle = (id: 'N' | 'E' | 'S' | 'W') => {
    switch (id) {
      case 'N': return "-bottom-1 left-1/2 -translate-x-1/2 rotate-45 border-r border-b"; 
      case 'S': return "-top-1 left-1/2 -translate-x-1/2 rotate-45 border-l border-t"; 
      case 'E': return "top-1/2 -translate-y-1/2 -left-1 rotate-45 border-l border-b"; 
      case 'W': return "top-1/2 -translate-y-1/2 -right-1 rotate-45 border-r border-t"; 
      default: return "";
    }
  };

  const startSim = (traitor: boolean) => {
    setHasTraitor(traitor);
    setStatus('messaging');
    setConsensus(null);
  };

  useEffect(() => {
    if (status === 'messaging') {
      const timer = setTimeout(() => {
        setStatus('attacking');
        setConsensus(!hasTraitor);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, hasTraitor]);

  const reset = () => {
    setStatus('idle');
    setConsensus(null);
  };

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl p-3 sm:p-6 font-mono min-h-[600px] flex flex-col justify-between transition-colors text-left text-gray-900 dark:text-white">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none rounded-2xl overflow-hidden" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-6">
        {/* HUD Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl flex flex-col justify-between h-20 transition-colors">
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase">
                <Crown size={12} className="text-yellow-500" />
                <span className="text-[9px] tracking-widest">Decree</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-lg font-black uppercase transition-colors tracking-tighter">Siege_City</div>
                <div className="text-[7px] text-blue-500 font-black">09:00</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl flex flex-col justify-between h-20 transition-colors text-left">
             <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold uppercase">
                <Activity size={12} />
                <span className="text-[9px] tracking-widest">Quorum</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-xl font-black text-gray-800 dark:text-slate-200 transition-colors tracking-tighter">
                   {status === 'attacking' ? (consensus ? '100' : '75') : '0'}<span className="text-[9px] text-gray-400 dark:text-slate-500">%</span>
                </div>
                <div className="text-[7px] font-black text-slate-500 uppercase tracking-tighter tracking-tighter">Agreement</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-2.5 rounded-xl overflow-hidden h-20 transition-colors text-left">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1 font-bold uppercase">
                <Database size={12} />
                <span className="text-[9px] tracking-widest">Command Logs</span>
             </div>
             <div className="space-y-0.5">
                <div className={clsx("text-[7px] truncate font-bold", status === 'idle' ? "text-gray-400" : "text-blue-500 animate-pulse")}>
                   {status === 'idle' ? '> Standby for command...' : status === 'messaging' ? '> MESSENGERS: DEPLOYED' : '> FORCES: COMMITTED'}
                </div>
                <div className="text-[7px] text-gray-400 dark:text-slate-600 truncate uppercase">
                   {status !== 'idle' && (hasTraitor ? '> SPY_ACTIVITY: DETECTED' : '> ALLY_STATUS: FAITHFUL')}
                </div>
             </div>
          </div>
        </div>

        {/* Battlefield */}
        <div className="relative h-[420px] sm:h-[380px] w-full border border-gray-100 dark:border-slate-800 rounded-3xl flex items-center justify-center bg-gray-50/30 dark:bg-slate-950 shadow-inner transition-colors">
           <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none opacity-[0.05] dark:opacity-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-[240px] h-[240px] border border-blue-500 rounded-full" />
                <div className="absolute w-[120px] h-[120px] border border-blue-500 rounded-full" />
              </div>
           </div>

           {/* Palace */}
           <motion.div 
             className="z-30 relative"
             initial={{ x: 0, y: 0 }}
             animate={status === 'attacking' && !consensus ? { x: [-1, 1, -1, 1, 0] } : { x: 0, y: 0 }}
             transition={{ repeat: Infinity, duration: 0.3 }}
           >
             <div className={clsx(
               "w-16 h-16 rounded-[1.5rem] border-2 flex flex-col items-center justify-center gap-0.5 shadow-xl transition-all duration-700",
               status === 'attacking' ? (consensus ? 'bg-emerald-500/10 border-emerald-500' : 'bg-red-500/10 border-red-500') : 'bg-amber-100/50 dark:bg-amber-950/30 border-amber-500'
             )}>
                <div className="absolute -top-4 flex flex-col items-center">
                   <Flag size={14} className="text-red-600 animate-bounce" fill="currentColor" />
                </div>
                <TowerControl className={clsx("w-8 h-8 transition-colors duration-700", status === 'attacking' ? (consensus ? 'text-emerald-500' : 'text-red-500') : 'text-amber-600')} />
                <span className={clsx("text-[6px] font-black uppercase tracking-widest", status === 'attacking' ? (consensus ? 'text-emerald-500' : 'text-red-500') : 'text-amber-600')}>Palace</span>
             </div>
           </motion.div>

           <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 420">
             <g transform="translate(200, 210)">
               {generals.map((g) => {
                 const pos = getPos(g.id);
                 return (
                   <React.Fragment key={`svg-${g.id}`}>
                     {status === 'messaging' && (
                       <motion.circle cx="0" cy="0" r={distance} fill="none" stroke={g.color} strokeWidth="1" strokeDasharray="4 6" initial={{ rotate: 0, opacity: 0 }} animate={{ rotate: 360, opacity: 0.3 }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }} />
                     )}
                     {status === 'attacking' && !g.isTraitor && (
                       <motion.g initial={{ x: pos.x, y: pos.y, scale: 0, opacity: 0 }} animate={{ x: 0, y: 0, scale: 1, opacity: 1 }} transition={{ repeat: Infinity, duration: 2, ease: "easeIn", delay: animationDelays[generals.indexOf(g)] }}>
                          <foreignObject x={-5} y={-5} width={10} height={10}><Swords size={10} style={{ color: g.color }} className="drop-shadow-sm" /></foreignObject>
                       </motion.g>
                     )}
                   </React.Fragment>
                 );
               })}
             </g>
           </svg>

           {/* Generals */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {generals.map((g) => {
               const pos = getPos(g.id);
               return (
                 <motion.div key={g.id} className="absolute pointer-events-auto" initial={false} animate={{ x: pos.x, y: pos.y }}>
                   <div className="relative flex flex-col items-center gap-1">
                     <motion.div 
                       className={clsx(
                         "w-12 h-12 rounded-xl border-[1.5px] flex flex-col items-center justify-center shadow-lg transition-all duration-500 relative",
                         status === 'idle' ? 'bg-white dark:bg-slate-900' : g.isTraitor ? 'bg-red-500/10 border-red-500' : 'bg-blue-500/10 border-blue-500'
                       )}
                       style={{ borderColor: status === 'idle' ? g.color : '#3b82f600' }}
                     >
                       <span className="text-2xl z-10">{g.emoji}</span>
                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-1.5 -top-1.5 z-20 transition-colors" style={{ color: g.color }}><Swords size={14} className="drop-shadow-sm" /></motion.div>
                       {status !== 'idle' && (
                         <div className="absolute -bottom-1 -right-1 z-30">
                            {g.isTraitor ? <ShieldAlert size={10} className="text-red-500" /> : <Shield size={10} className="text-blue-500" />}
                         </div>
                       )}
                     </motion.div>
                     <div className="text-[6px] font-black uppercase text-gray-400 dark:text-slate-600 tracking-tighter transition-colors" style={{ color: status === 'idle' ? g.color : undefined }}>{g.label}</div>
                     <AnimatePresence>
                       {status !== 'idle' && (
                         <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} className={clsx("absolute whitespace-nowrap z-[100]", getBubbleStyle(g.id))}>
                           <div className={clsx(
                             "px-2 py-1 rounded-lg text-[6px] sm:text-[7px] font-black uppercase border shadow-xl transition-all duration-500",
                             g.isTraitor ? 'bg-red-600 border-red-400 text-white shadow-red-500/20' : 'bg-blue-600 border-blue-400 text-white shadow-blue-500/20'
                           )}>
                             {status === 'messaging' ? 'Voting...' : (g.isTraitor ? 'RETREAT' : 'ATTACK 09:00')}
                             <div className={clsx("absolute w-1.5 h-1.5 transition-colors duration-500", getArrowStyle(g.id), g.isTraitor ? 'bg-red-600' : 'bg-blue-600')} />
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 </motion.div>
               );
             })}
           </div>
        </div>

        {/* Narrative */}
        <div className="min-h-[80px] text-left">
           <AnimatePresence mode="wait">
              <motion.div key={status} initial={{ opacity: 0, x: 10, y: 0 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-1">
                 <h3 className={clsx("text-xs font-black uppercase tracking-widest", status === 'attacking' ? (consensus ? 'text-emerald-500' : 'text-red-500') : 'text-blue-500')}>
                    {status === 'idle' ? 'The coordination problem' : status === 'messaging' ? 'Exchanging Mesengers' : (consensus ? 'Consensus Success' : 'Consensus Failure')}
                 </h3>
                 <p className="text-[10px] text-gray-600 dark:text-slate-400 font-bold uppercase leading-tight tracking-tighter transition-colors">
                    {status === 'idle' && "Nodes must agree on one truth without a leader. Can they win if some nodes lie?"}
                    {status === 'messaging' && "Generals exchange signed messages to confirm the plan and detect traitors."}
                    {status === 'attacking' && (consensus ? "Success! All honest nodes coordinated perfectly." : "Failure! The spy caused honest nodes to de-sync.")}
                 </p>
              </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-slate-900/50 text-left">
        <div className="flex gap-2 w-full sm:w-auto">
          {status === 'idle' ? (
            <>
              <button onClick={() => startSim(false)} className="flex-1 sm:flex-none py-3 px-6 bg-blue-600 border-blue-800 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl border-b-4 active:scale-95 transition-all outline-none">Honest_Net</button>
              <button onClick={() => startSim(true)} className="flex-1 sm:flex-none py-3 px-6 bg-red-600 border-red-800 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl border-b-4 active:scale-95 transition-all outline-none">Spy_Detect</button>
            </>
          ) : (
            <button onClick={reset} className="flex-1 sm:flex-none py-3 px-10 bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] border-b-4 active:scale-95 transition-all flex items-center justify-center gap-2 outline-none">
              <RefreshCcw size={16} /> Reset_Battle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsensusIntroViz;