import React from 'react';
import type { Block } from '../../simulation/types';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Database, Hash, Lock, ShieldCheck } from 'lucide-react';

interface BlockVizProps {
  block: Block;
  isHead?: boolean;
}

const BlockViz: React.FC<BlockVizProps> = ({ block, isHead }) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, x: 20 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      className={clsx(
        'w-44 p-4 rounded-2xl border-2 flex flex-col gap-3 font-mono text-[9px] transition-all duration-500 relative overflow-hidden',
        isHead 
          ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 shadow-xl shadow-blue-500/10' 
          : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
      )}
    >
      {/* Chain Head Indicator */}
      {isHead && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse" />
      )}

      <div className="flex justify-between items-center border-b pb-2 border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500">
           <Database size={10} />
           <span className="font-black uppercase tracking-widest">Block</span>
        </div>
        <span className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[7px] font-black text-gray-600 dark:text-slate-400 uppercase tracking-tighter">
          #{block.id.substring(0, 6)}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-gray-400 dark:text-slate-600">
             <Lock size={8} />
             <span className="font-bold uppercase">Prev</span>
          </div>
          <span className="text-gray-600 dark:text-slate-400 font-bold">{block.prevHash.substring(0, 8)}...</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-gray-400 dark:text-slate-600">
             <Hash size={8} />
             <span className="font-bold uppercase">Nonce</span>
          </div>
          <span className="text-blue-600 dark:text-blue-400 font-black tracking-tight">{block.nonce.toLocaleString()}</span>
        </div>
      </div>

      <div className="py-2.5 border-t border-gray-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-2">
           <span className="text-[7px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">Payload</span>
           <span className="text-[7px] font-bold text-gray-400">{block.transactions.length} TXs</span>
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[16px]">
          {block.transactions.map((tx, idx) => (
            <div 
              key={`${block.id}-tx-${idx}`} 
              className="w-2.5 h-2.5 rounded shadow-lg border border-white/10" 
              style={{ backgroundColor: tx.color }}
              title={`TX_ID: ${tx.id.substring(0, 8)}`}
            />
          ))}
          {block.transactions.length === 0 && <span className="text-[7px] text-gray-300 dark:text-slate-800 font-black uppercase italic">Null_Buffer</span>}
        </div>
      </div>

      <div className="mt-auto pt-2 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-1 text-emerald-500">
           <ShieldCheck size={10} />
           <span className="text-[7px] font-black uppercase tracking-tighter">Verified</span>
        </div>
        <span className="text-[7px] font-bold text-gray-300 dark:text-slate-700 uppercase tracking-widest">{block.minerId.substring(0, 8)}</span>
      </div>
    </motion.div>
  );
};

export default BlockViz;