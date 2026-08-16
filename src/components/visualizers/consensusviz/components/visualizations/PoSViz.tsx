import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, ShieldAlert, Zap, Activity, Server, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

interface Validator {
  id: string;
  name: string;
  stake: number;
  status: 'idle' | 'selected' | 'slashed';
  uptime: number;
}

const PoSViz: React.FC = () => {
  const [validators, setValidators] = useState<Validator[]>([
    { id: '1', name: 'Validator_Alpha', stake: 500, status: 'idle', uptime: 99.9 },
    { id: '2', name: 'Validator_Bravo', stake: 300, status: 'idle', uptime: 98.5 },
    { id: '3', name: 'Validator_Charlie', stake: 150, status: 'idle', uptime: 100 },
    { id: '4', name: 'Validator_Delta', stake: 50, status: 'idle', uptime: 94.2 },
  ]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [blocks, setBlocks] = useState<{ id: number; proposer: string; reward: string }[]>([]);
  const [logs, setLogs] = useState<string[]>(['Consensus engine active.', 'Validators synced to beacon chain.']);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 4));
  };

  const selectValidator = () => {
    if (isSelecting) return;
    setIsSelecting(true);
    addLog('Initiating proposer selection (RANDAO)...');
    
    // Reset statuses
    setValidators(prev => prev.map(v => v.status === 'slashed' ? v : { ...v, status: 'idle' }));

    setTimeout(() => {
      const activeValidators = validators.filter(v => v.status !== 'slashed');
      if (activeValidators.length === 0) {
        setIsSelecting(false);
        addLog('ERROR: No active validators available.');
        return;
      }

      const totalStake = activeValidators.reduce((acc, v) => acc + v.stake, 0);
      let random = Math.random() * totalStake;
      
      let selectedValidator = activeValidators[0];
      for (const v of activeValidators) {
        if (random < v.stake) {
          selectedValidator = v;
          break;
        }
        random -= v.stake;
      }

      setValidators(prev => prev.map(v => v.id === selectedValidator.id ? { ...v, status: 'selected' } : v));
      
      const newBlockId = blocks.length + 1;
      setBlocks(prev => [{ 
        id: newBlockId, 
        proposer: selectedValidator.name.split('_')[1],
        reward: '0.042 ETH'
      }, ...prev].slice(0, 10));
      
      addLog(`Block #${newBlockId} proposed by ${selectedValidator.name}.`);
      setIsSelecting(false);
    }, 1500);
  };

  const slashValidator = (id: string) => {
    const validator = validators.find(v => v.id === id);
    if (!validator || validator.status === 'slashed') return;

    setValidators(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'slashed', stake: Math.floor(v.stake * 0.5) } : v
    ));
    addLog(`SLASHING: ${validator.name} penalized for double-signing.`);
  };

  const totalStake = validators.reduce((acc, v) => acc + v.stake, 0);
  const activeCount = validators.filter(v => v.status !== 'slashed').length;

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[600px] flex flex-col justify-between transition-colors text-left text-gray-900 dark:text-white">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* HUD Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Coins size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-indigo-400">Network Liquidity</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-gray-800 dark:text-slate-200">{totalStake} <span className="text-[10px] text-gray-400 dark:text-slate-600 uppercase">ETH Staked</span></div>
                <div className="text-[10px] text-indigo-500 font-black tracking-tighter">POOL_CAP: 100%</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Server size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-blue-400">Validator Set</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-gray-800 dark:text-slate-200">{activeCount} / {validators.length}</div>
                <div className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">Active Nodes</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl overflow-hidden h-24 transition-colors">
             <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <Activity size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-emerald-400">Consensus Log</span>
             </div>
             <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={clsx("text-[8px] truncate", i === 0 ? "text-indigo-500 font-bold" : "text-gray-400 dark:text-slate-600")}>
                    {`> ${log}`}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Validator Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {validators.map((v) => (
            <motion.div
              key={v.id}
              layout
              initial={{ scale: 1, borderColor: 'rgba(0,0,0,0)' }}
              animate={{ 
                scale: v.status === 'selected' ? 1.02 : 1,
                borderColor: v.status === 'selected' ? '#6366f1' : v.status === 'slashed' ? '#ef4444' : 'rgba(0,0,0,0)'
              }}
              className={clsx(
                "relative p-4 border-2 rounded-2xl transition-all duration-500 overflow-hidden group",
                v.status === 'slashed' ? "bg-red-50 dark:bg-red-900/10 shadow-inner" : "bg-gray-50 dark:bg-slate-900 shadow-sm"
              )}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-lg transition-colors",
                    v.status === 'slashed' ? "bg-red-500" : "bg-indigo-600"
                  )}>
                    {v.name.charAt(10)}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight truncate max-w-[120px]">{v.name}</div>
                    <div className={clsx("text-[8px] font-bold uppercase tracking-widest", v.status === 'slashed' ? "text-red-500" : "text-emerald-500")}>
                      {v.status === 'slashed' ? 'PENALIZED' : 'HEALTHY'}
                    </div>
                  </div>
                </div>
                
                {v.status !== 'slashed' && (
                  <button 
                    onClick={() => slashValidator(v.id)}
                    className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all sm:opacity-0 group-hover:opacity-100 shadow-sm"
                    title="Slash Validator"
                  >
                    <ShieldAlert size={14} />
                  </button>
                )}
              </div>

              {/* Card Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[7px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Stake Weight</div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={10} className="text-indigo-500" />
                    <span className="text-[10px] font-bold">{((v.stake / totalStake) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[7px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Node Uptime</div>
                  <div className="flex items-center gap-1.5">
                    <Activity size={10} className="text-emerald-500" />
                    <span className="text-[10px] font-bold">{v.uptime}%</span>
                  </div>
                </div>
              </div>

              {/* Visual Flair */}
              {v.status === 'selected' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute top-0 right-0 p-2 text-indigo-600 dark:text-indigo-400"
                >
                  <UserCheck size={16} className="animate-bounce" />
                </motion.div>
              )}
              {v.status === 'slashed' && (
                <div className="absolute inset-0 bg-red-500/5 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
                   <div className="rotate-[-12deg] border-4 border-red-500 text-red-500 px-4 py-1 font-black text-xl uppercase tracking-widest opacity-20">SLASHED</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button 
            onClick={selectValidator}
            disabled={isSelecting || activeCount === 0}
            className={clsx(
              "flex-1 w-full sm:w-auto flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-xl border-b-4",
              isSelecting 
                ? "bg-indigo-500 border-indigo-700 text-white" 
                : "bg-indigo-600 border-indigo-800 text-white disabled:opacity-50 disabled:translate-y-0.5 disabled:border-b-0 shadow-indigo-500/20"
            )}
          >
            {isSelecting ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
            {isSelecting ? 'Selecting Proposer...' : 'Initiate Next Slot'}
          </button>

          <div className="flex-shrink-0 flex gap-2 overflow-x-auto custom-scrollbar max-w-full pb-2 sm:pb-0 px-1">
            <AnimatePresence>
              {blocks.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ scale: 0, x: 20, opacity: 0 }}
                  animate={{ scale: 1, x: 0, opacity: 1 }}
                  className="flex-shrink-0 w-12 h-12 bg-white dark:bg-slate-900 border-2 border-indigo-500/20 dark:border-indigo-500/40 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-sm"
                >
                  <span className="text-[7px] font-black text-gray-400 dark:text-slate-600">#{b.id}</span>
                  <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase">{b.proposer}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {isSelecting && (
              <div className="flex-shrink-0 w-12 h-12 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Footer Explanation */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50">
        <div className="flex items-start gap-3 max-w-lg">
           <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex-shrink-0 transition-colors">
              <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
           </div>
           <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed text-left font-bold uppercase tracking-tight">
              <span className="text-indigo-600 dark:text-indigo-400 mr-1">Selection Logic:</span>
              In PoS, you don't mine; you're selected. The more ETH you stake, the higher your "weight" in the lottery. If you behave maliciously (like double-signing), you get slashed and lose your stake.
           </p>
        </div>

        <div className="text-[9px] text-gray-300 dark:text-slate-700 font-black uppercase tracking-[0.2em] whitespace-nowrap">
           Validator_Term_v2.1
        </div>
      </div>
    </div>
  );
};

export default PoSViz;