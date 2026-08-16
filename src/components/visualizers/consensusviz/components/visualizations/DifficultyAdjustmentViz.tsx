import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gauge, TrendingUp, Activity, Crosshair, Zap } from 'lucide-react';
import { clsx } from 'clsx';

const DifficultyAdjustmentViz: React.FC = () => {
  const [hashrate, setHashrate] = useState(50);
  
  const targetSize = Math.max(8, 100 - (hashrate * 0.85));
  const attemptsCount = 150;

  const [hashAttempts] = useState(() => {
    return Array.from({ length: attemptsCount }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 350,
      y: (Math.random() - 0.5) * 220,
      delay: Math.random() * 2
    }));
  });

  const visibleAttempts = hashAttempts.slice(0, Math.floor(hashrate * 1.5));

  return (
    <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden p-6 sm:p-8 font-mono min-h-[450px] flex flex-col justify-between transition-colors">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 space-y-8">
        {/* HUD Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl space-y-1 transition-colors">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Gauge size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-blue-400">Global Hashrate</span>
            </div>
            <div className="text-lg font-black text-gray-800 dark:text-slate-200">{hashrate}.4 <span className="text-[10px] text-gray-400 dark:text-slate-500">TH/s</span></div>
          </div>
          
          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl space-y-1 transition-colors">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <TrendingUp size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-indigo-400">Adj. Factor</span>
            </div>
            <div className="text-lg font-black text-gray-800 dark:text-slate-200">x{(hashrate / 12.5).toFixed(2)}</div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl space-y-1 hidden sm:block transition-colors">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Activity size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-emerald-400">Block Time</span>
            </div>
            <div className="text-lg font-black text-gray-800 dark:text-slate-200">10.0 <span className="text-[10px] text-gray-400 dark:text-slate-500">min</span></div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 p-3 rounded-xl space-y-1 hidden sm:block transition-colors">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Zap size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-amber-400">Stability</span>
            </div>
            <div className="text-lg font-black text-gray-800 dark:text-slate-200 uppercase">Optimal</div>
          </div>
        </div>

        {/* The Targeting Radar */}
        <div className="relative h-[280px] w-full border border-gray-100 dark:border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden bg-gray-50/30 dark:bg-slate-950 shadow-inner transition-colors">
           {/* Radar Lines */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] dark:opacity-20">
              <div className="w-[1px] h-full bg-blue-500/50" />
              <div className="h-[1px] w-full bg-blue-500/50" />
              <div className="absolute w-[200px] h-[200px] border border-blue-500/20 rounded-full" />
              <div className="absolute w-[100px] h-[100px] border border-blue-500/20 rounded-full" />
           </div>

           {/* The Target "Probability" Box */}
           <motion.div
             initial={{ width: '50%', height: '50%' }}
             animate={{
               width: `${targetSize}%`,
               height: `${targetSize}%`,
             }}
             transition={{ type: 'spring', stiffness: 50, damping: 20 }}
             className="relative border-2 border-emerald-500 bg-emerald-500/5 rounded-2xl flex items-center justify-center z-20 shadow-lg shadow-emerald-500/10"
           >
              <div className="absolute inset-0 bg-emerald-400/10 blur-xl animate-pulse" />
              <Crosshair size={24} className="text-emerald-500/30 rotate-45" />
              <div className="absolute -top-6 whitespace-nowrap text-[8px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em]">
                Target Range
              </div>
           </motion.div>

           {/* Inbound Hashes */}
           {visibleAttempts.map((attempt) => (
             <motion.div
               key={attempt.id}
               initial={{ x: attempt.x, y: attempt.y, opacity: 0, scale: 0 }}
               animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity, delay: attempt.delay }}
               className="absolute w-1 h-1 bg-blue-500 dark:bg-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"
             />
           ))}

           <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-widest">Scanning Search Space...</span>
           </div>
        </div>

        {/* Input Controls */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-end">
             <div className="space-y-1">
                <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest">Inject Network Power</h4>
                <p className="text-[8px] text-gray-400 dark:text-slate-600 font-bold">Simulate miners joining or leaving the network</p>
             </div>
             <div className="text-right">
                <span className={clsx(
                  "text-[10px] font-black transition-colors uppercase tracking-widest",
                  hashrate > 80 ? "text-red-500 dark:text-red-400" : hashrate > 50 ? "text-amber-500 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"
                )}>
                  {hashrate > 80 ? 'Critical Load' : hashrate > 50 ? 'High Load' : 'Nominal'}
                </span>
             </div>
          </div>
          
          <div className="relative py-2">
            <input
              type="range"
              min="5"
              max="100"
              value={hashrate}
              onChange={(e) => setHashrate(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-100 dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/50 rounded-xl text-[10px] text-gray-400 dark:text-slate-500 leading-relaxed italic transition-colors">
         Note: As power (blue dots) increases, the protocol shrinks the target zone (emerald box) to keep blocks appearing exactly every 10 minutes.
      </div>
    </div>
  );
};

export default DifficultyAdjustmentViz;
