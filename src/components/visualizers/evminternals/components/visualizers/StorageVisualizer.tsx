import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Hash, Archive } from 'lucide-react';

interface StorageVisualizerProps {
  storage: Record<string, string>;
}

const StorageVisualizer: React.FC<StorageVisualizerProps> = ({ storage }) => {
  const entries = Object.entries(storage);

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-colors duration-300 shadow-sm">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Storage</h3>
          <span className="text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-500 font-mono">
            Persistent
          </span>
        </div>
        <Database size={14} className="text-amber-600 dark:text-amber-500" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
        <AnimatePresence initial={false}>
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-neutral-400 dark:text-neutral-600 text-center">
              <Archive size={24} className="mb-2 opacity-20" />
              <div className="text-xs italic">Storage is empty</div>
              <p className="text-[10px] mt-1 max-w-[150px]">Use SSTORE to persist data across transactions.</p>
            </div>
          ) : (
            entries.map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500/30 transition-all shadow-sm"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-tighter">
                      <Hash size={10} /> Slot / Key
                    </div>
                    <span className="text-[9px] text-neutral-400 dark:text-neutral-600 font-mono">256-bit</span>
                  </div>
                  <div className="text-[11px] font-mono text-amber-600 dark:text-amber-500/80 break-all bg-neutral-50 dark:bg-black/30 p-1.5 rounded border border-neutral-100 dark:border-neutral-700/50">
                    {key}
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-tighter mt-1">
                    Value
                  </div>
                  <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 break-all font-bold">
                    {value}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800/50">
        <div className="text-[9px] text-neutral-500 dark:text-neutral-600 leading-tight">
          Storage is a key-value store. In Solidity, variables are mapped to slots (0, 1, 2...) or hashed for mappings/arrays.
        </div>
      </div>
    </div>
  );
};

export default StorageVisualizer;
