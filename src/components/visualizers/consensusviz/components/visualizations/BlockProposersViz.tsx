import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Activity, Database, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

interface Validator {
  id: number;
  name: string;
  stake: number;
  color: string;
  angle: number; // Start angle in degrees
  arc: number;   // Size in degrees
}

const BlockProposersViz: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Validator | null>(null);
  const [seed, setSeed] = useState("0x7a2...4f9");
  const controls = useAnimation();

  const validators: Validator[] = [
    { id: 1, name: "Alpha_Node", stake: 50, color: "#3b82f6", angle: 0, arc: 180 },
    { id: 2, name: "Bravo_Node", stake: 25, color: "#6366f1", angle: 180, arc: 90 },
    { id: 3, name: "Charlie_Node", stake: 15, color: "#a855f7", angle: 270, arc: 54 },
    { id: 4, name: "Delta_Node", stake: 10, color: "#10b981", angle: 324, arc: 36 },
  ];

  const spin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    setSeed(`0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 5)}`);
    
    // Add multiple rotations (at least 4 full circles) plus a random final landing
    const extraRotation = Math.random() * 360;
    const totalRotation = 1440 + extraRotation;
    
    await controls.start({
      rotate: totalRotation,
      transition: { duration: 4, ease: [0.12, 0, 0.39, 0] } // Custom cubic-bezier for "heavy" wheel feel
    });
    
    setIsSpinning(false);
    
    // Determine winner based on the pointer (at 0 degrees / top)
    // The wheel rotated clockwise, so the pointer effectively moves counter-clockwise relative to the wheel
    const finalRotation = (360 - (extraRotation % 360)) % 360;
    
    const foundWinner = validators.find(v => 
      finalRotation >= v.angle && finalRotation < (v.angle + v.arc)
    );
    
    setWinner(foundWinner || validators[0]);
  };

  const reset = () => {
    controls.set({ rotate: 0 });
    setWinner(null);
    setIsSpinning(false);
  };

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-4 sm:p-8 font-mono min-h-[600px] flex flex-col justify-between transition-colors text-left text-gray-900 dark:text-white">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* HUD Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Database size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-blue-400">Selection Seed</span>
             </div>
             <div className="flex items-end justify-between overflow-hidden">
                <div className="text-sm font-black text-gray-800 dark:text-slate-200 truncate pr-2 uppercase">{seed}</div>
                <div className="text-[8px] text-blue-500 font-black uppercase tracking-tighter whitespace-nowrap">Verified_VRF</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Activity size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-indigo-400">Consensus Slot</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-xl font-black text-gray-800 dark:text-slate-200">#8,421,092</div>
                <div className="text-[10px] text-indigo-500 font-black uppercase tracking-tighter">Epoch_263</div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between h-24 transition-colors">
             <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Zap size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-emerald-400">Entropy Source</span>
             </div>
             <div className="flex items-end justify-between">
                <div className="text-lg font-black text-gray-800 dark:text-slate-200 uppercase tracking-tight">Beacon_Chain</div>
                <div className={clsx("w-2 h-2 rounded-full transition-colors duration-500", isSpinning ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
             </div>
          </div>
        </div>

        {/* Selection Stage */}
        <div className="relative h-[320px] w-full border border-gray-100 dark:border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden bg-gray-50/30 dark:bg-slate-950 shadow-inner transition-colors">
           {/* Radar Crosshair */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] dark:opacity-20">
              <div className="absolute w-[280px] h-[280px] border border-indigo-500/20 rounded-full" />
              <div className="absolute w-[140px] h-[140px] border border-indigo-500/20 rounded-full" />
              <div className="w-[1px] h-full bg-indigo-500/20" />
              <div className="h-[1px] w-full bg-indigo-500/20" />
           </div>

           {/* The Selection Wheel */}
           <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Pointer Indicator (Fixed at TOP) */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                 <div className="w-4 h-6 bg-indigo-600 dark:bg-indigo-400 clip-path-triangle" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
                 <div className="w-1 h-32 bg-gradient-to-b from-indigo-600/50 dark:from-indigo-400/50 to-transparent absolute top-6" />
              </div>

              <motion.svg
                viewBox="0 0 100 100"
                animate={controls}
                className="w-full h-full drop-shadow-2xl z-20"
              >
                {/* Alice 50% */}
                <path d="M 50 50 L 50 0 A 50 50 0 0 1 50 100 Z" fill={validators[0].color} fillOpacity="0.8" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                {/* Bob 25% */}
                <path d="M 50 50 L 50 100 A 50 50 0 0 1 0 50 Z" fill={validators[1].color} fillOpacity="0.8" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                {/* Charlie 15% */}
                <path d="M 50 50 L 0 50 A 50 50 0 0 1 20.6 9.5 Z" fill={validators[2].color} fillOpacity="0.8" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                {/* Dave 10% */}
                <path d="M 50 50 L 20.6 9.5 A 50 50 0 0 1 50 0 Z" fill={validators[3].color} fillOpacity="0.8" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                
                <circle cx="50" cy="50" r="2" fill="white" />
              </motion.svg>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
           </div>

           {/* Winner Badge Overlay */}
           <AnimatePresence>
             {winner && !isSpinning && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 1.1 }}
                 className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-emerald-500 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 w-[90%] sm:w-auto"
               >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                     <Sparkles size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="text-[8px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest truncate">Selected Proposer</div>
                     <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase truncate">{winner.name}</div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Validator Roster */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {validators.map((v) => (
            <div 
              key={v.id}
              className={clsx(
                "p-3 rounded-xl border-2 transition-all duration-500 flex flex-col gap-2",
                winner?.id === v.id && !isSpinning
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.02] shadow-sm opacity-100' 
                  : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 opacity-60'
              )}
            >
              <div className="flex items-center justify-between">
                 <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: v.color }} />
                 <span className="text-[8px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Weight: {v.stake}%</span>
              </div>
              <div className="text-[10px] font-bold truncate tracking-tight uppercase">{v.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-900/50">
        <div className="flex items-start gap-3 max-w-md text-left">
           <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0 transition-colors">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
           </div>
           <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
              <span className="text-blue-600 dark:text-blue-400 mr-1 uppercase">Selection Protocol:</span>
              The lottery uses verifiable randomness (VRF) to keep selection unpredictable. While randomized, win probability is proportional to stake weight.
           </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={spin}
            disabled={isSpinning}
            className={clsx(
              "flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-xl border-b-4",
              isSpinning 
                ? "bg-amber-500 border-amber-700 text-white" 
                : "bg-blue-600 border-blue-800 text-white disabled:opacity-50 disabled:translate-y-0.5 disabled:border-b-0 shadow-blue-500/20"
            )}
          >
            {isSpinning ? <Activity size={16} className="animate-pulse" /> : <Play size={16} fill="currentColor" />}
            {isSpinning ? 'Selecting...' : 'Scan Proposer'}
          </button>
          
          <button
            onClick={reset}
            className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 rounded-xl transition-all shadow-sm"
            title="Reset Simulation"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockProposersViz;