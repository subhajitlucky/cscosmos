import React from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCcw } from 'lucide-react';

interface GasMeterProps {
  totalUsed: number;
  lastCost: number;
  remaining: number;
  refund: number;
}

const GasMeter: React.FC<GasMeterProps> = ({ totalUsed, lastCost, remaining, refund }) => {
  const initialGas = totalUsed + remaining;
  const usedPercentage = (totalUsed / initialGas) * 100;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-colors duration-300 shadow-sm">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Gas Meter</h3>
        <Zap size={14} className="text-evm-gas" />
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500">
            <span>Consumed</span>
            <span>{totalUsed.toLocaleString()} / {initialGas.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-evm-gas"
              initial={{ width: 0 }}
              animate={{ width: `${usedPercentage}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 shadow-sm">
            <div className="text-[9px] text-neutral-400 dark:text-neutral-500 uppercase font-bold">Last Op Cost</div>
            <motion.div 
              key={lastCost}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-sm font-mono font-bold text-[var(--color-viz-active)]"
            >
              -{lastCost}
            </motion.div>
          </div>
          <div className="p-2 rounded bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 shadow-sm">
            <div className="text-[9px] text-neutral-400 dark:text-neutral-500 uppercase font-bold">Refund</div>
            <div className="flex items-center gap-1 text-sm font-mono font-bold text-[var(--color-viz-secondary)]">
              <RefreshCcw size={10} /> {refund}
            </div>
          </div>
        </div>

        <div className="pt-2">
           <div className="text-[9px] text-neutral-500 dark:text-neutral-600 italic">
             * Gas prevents infinite loops and DDoS. SSTORE is the most expensive opcode (20,000 gas for new slots).
           </div>
        </div>
      </div>
    </div>
  );
};

export default GasMeter;