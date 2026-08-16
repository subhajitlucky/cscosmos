import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Flame, Wallet, AlertTriangle, ShieldCheck, Activity, RefreshCw, Zap, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

const SlashingViz: React.FC = () => {
  const [status, setStatus] = useState<'honest' | 'detecting' | 'slashing' | 'penalized'>('honest');
  const [stake, setStake] = useState(32.0);
  const [logs, setLogs] = useState<string[]>(['Security monitor active.', 'Node reputation: 100%']);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 4));
  };

  const [particles] = useState(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
      delay: Math.random() * 1
    }));
  });

  const triggerAttack = async () => {
    if (status !== 'honest') return;
    
    setStatus('detecting');
    addLog('CRITICAL: Conflicting signatures detected!');
    
    await new Promise(r => setTimeout(r, 2000));
    setStatus('slashing');
    addLog('PROTOCOL_VIOLATION: Double-signing verified.');
    addLog('EXECUTING_PENALTY: Burning 50% of collateral...');
    
    const interval = window.setInterval(() => {
      setStake(s => {
        if (s <= 16.05) {
          window.clearInterval(interval);
          return 16.0;
        }
        return s - 0.4;
      });
    }, 50);

    await new Promise(r => setTimeout(r, 2500));
    setStatus('penalized');
    addLog('NODE_STATUS: Forced exit. Reputation reset.');
  };

  const reset = () => {
    setStake(32.0);
    setStatus('honest');
    setLogs(['Security monitor active.', 'Node reputation: 100%']);
  };

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[580px] flex flex-col justify-between transition-colors text-left text-gray-900 dark:text-white">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* HUD Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={clsx(
            "p-4 rounded-xl border flex flex-col justify-between h-24 transition-all duration-500",
            status === 'honest' ? "bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800" : "bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          )}>
             <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold uppercase">
                <ShieldAlert size={14} />
                <span className="text-[10px] tracking-widest">Security Status</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-xl font-black uppercase tracking-tighter transition-colors">
                   {status === 'honest' ? 'Secure' : status === 'detecting' ? 'Breach' : 'Compromised'}
                </div>
                <div className={clsx("w-2 h-2 rounded-full transition-all duration-500", status === 'honest' ? "bg-emerald-500" : "bg-red-500 animate-ping")} />
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase">
                <Wallet size={14} />
                <span className="text-[10px] tracking-widest">Active Collateral</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-2xl font-black text-gray-800 dark:text-slate-200 transition-all">{stake.toFixed(1)} <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase">ETH</span></div>
                <div className={clsx("text-[8px] font-black uppercase tracking-tighter", status === 'honest' ? "text-blue-500" : "text-red-500")}>
                   {status === 'honest' ? 'Fully Vested' : 'Penalty Applied'}
                </div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl overflow-hidden h-24 transition-colors">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2 font-bold uppercase">
                <Activity size={14} />
                <span className="text-[10px] tracking-widest">Evidence Log</span>
             </div>
             <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={clsx("text-[8px] truncate uppercase font-bold", i === 0 && status !== 'honest' ? "text-red-500 animate-pulse" : "text-gray-400 dark:text-slate-600")}>
                    {`> ${log}`}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Central Enforcement Stage */}
        <div className={clsx(
          "relative h-[300px] w-full border-2 rounded-3xl flex items-center justify-center overflow-hidden transition-all duration-700 shadow-inner",
          status === 'honest' ? "bg-gray-50/30 dark:bg-slate-950 border-gray-100 dark:border-slate-800" : "bg-red-500/5 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
        )}>
           {/* Scan Overlay */}
           {status === 'detecting' && (
             <motion.div 
               initial={{ top: '0%' }}
               animate={{ top: '100%' }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="absolute left-0 right-0 h-[2px] bg-red-500/50 z-30 shadow-[0_0_15px_#ef4444]"
             />
           )}

           <div className="relative w-48 h-48 flex items-center justify-center">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={status}
                   initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
                   animate={status === 'slashing' ? { 
                     scale: [1, 1.1, 0.95, 1.05, 1],
                     rotate: [0, -2, 2, -2, 0],
                     opacity: 1
                   } : { scale: 1, opacity: 1, rotate: 0 }}
                   transition={status === 'slashing' ? { duration: 0.2, repeat: Infinity } : { type: 'spring' }}
                   className={clsx(
                     "relative z-20 w-32 h-32 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-3 shadow-2xl transition-all duration-700",
                     status === 'honest' ? "bg-blue-500/10 border-blue-500 shadow-blue-500/20" : 
                     status === 'penalized' ? "bg-slate-800 border-slate-700 opacity-50 shadow-none" :
                     "bg-red-500/10 border-red-500 shadow-red-500/30"
                   )}
                 >
                    {status === 'honest' ? (
                      <ShieldCheck className="text-blue-600 dark:text-blue-400 w-10 h-10" />
                    ) : status === 'penalized' ? (
                      <XCircle className="text-slate-500 w-10 h-10" />
                    ) : (
                      <Flame className="text-red-500 animate-bounce w-10 h-10" />
                    )}
                    <div className="flex flex-col items-center text-center px-2">
                       <span className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 mb-1 uppercase">Reputation</span>
                       <span className={clsx("text-[9px] font-black uppercase tracking-wider", status === 'honest' ? "text-emerald-500" : "text-red-500")}>
                          {status === 'honest' ? 'TRUSTED' : status === 'penalized' ? 'EVICTED' : 'CORRUPTED'}
                       </span>
                    </div>
                 </motion.div>
              </AnimatePresence>

              {/* Slashing Particles */}
              <AnimatePresence>
                {(status === 'slashing' || status === 'penalized') && particles.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      x: p.x * 2, 
                      y: p.y - 100,
                      scale: 0
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: p.delay }}
                    className="absolute w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] z-10"
                  />
                ))}
              </AnimatePresence>

              {/* Decorative Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] dark:opacity-20">
                 <div className={clsx("absolute w-[240px] h-[240px] border-2 border-dashed rounded-full transition-colors duration-1000", status === 'honest' ? "border-blue-500/20" : "border-red-500/20 animate-spin-slow")} />
                 <div className="absolute w-[120px] h-[120px] border border-dotted border-gray-500/20 rounded-full" />
              </div>
           </div>

           {/* Emergency HUD */}
           <div className="absolute top-6 right-6 flex items-center gap-2">
              <div className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", status === 'honest' ? "bg-emerald-500" : "bg-red-500")} />
              <span className="text-[9px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-widest">
                {status === 'honest' ? 'Protocol Monitor' : 'Enforcement Active'}
              </span>
           </div>
        </div>

        {/* Action Description */}
        <div className="min-h-[100px] max-w-2xl text-left">
           <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-2"
              >
                 <h3 className={clsx("text-sm font-black uppercase tracking-widest", status === 'honest' ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400")}>
                    {status === 'honest' ? 'Honest Participant' : status === 'detecting' ? 'Evidence Verification' : status === 'slashing' ? 'Slashing Execution' : 'Penalty Finalized'}
                 </h3>
                 <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-bold">
                    {status === 'honest' && "This validator node is currently secure. Its 32 ETH collateral is fully vested and earning consensus rewards."}
                    {status === 'detecting' && "ALARM: Conflicting block signatures detected. The protocol is performing a cryptographic audit to verify malicious intent."}
                    {status === 'slashing' && "VIOLATION CONFIRMED: Executing deterministic penalty. Half of the staked collateral is being permanently destroyed (burned)."}
                    {status === 'penalized' && "PENALTY COMPLETE: Node reputation has been wiped. Forced exit executed. Remaining 16 ETH is locked for a forced withdrawal period."}
                 </p>
              </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50">
        <div className="flex items-start gap-3 max-w-md text-left">
           <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg flex-shrink-0 transition-colors">
              <Zap className="w-4 h-4 text-red-600 dark:text-red-400" />
           </div>
           <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
              <span className="text-red-600 dark:text-red-400 uppercase mr-1 uppercase">Deterrence:</span>
              Slashing prevents "Nothing-at-Stake" attacks by making it mathematically expensive to act dishonestly. You lose real money for lying.
           </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {status === 'honest' ? (
            <button
              onClick={triggerAttack}
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] bg-red-600 border-red-800 text-white shadow-xl shadow-red-500/20 border-b-4 active:scale-95 transition-all outline-none"
            >
              <AlertTriangle size={16} /> Simulate Double-Sign
            </button>
          ) : (
            <button
              onClick={reset}
              disabled={status === 'detecting' || status === 'slashing'}
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 border-b-4 active:scale-95 transition-all disabled:opacity-50 outline-none"
            >
              <RefreshCw size={16} /> Reset Terminal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlashingViz;