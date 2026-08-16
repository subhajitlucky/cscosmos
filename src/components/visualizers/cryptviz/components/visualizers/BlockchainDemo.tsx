import React, { useState, useEffect } from 'react';
import { sha256 } from '../../utils/crypto';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, AlertTriangle, CheckCircle, RefreshCw, Layers, Database, History, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

interface BlockData {
  id: number;
  data: string;
  prevHash: string;
  hash: string;
  isValid: boolean;
}

const Block = ({ 
  block, 
  onChange,
  isRecalculating 
}: { 
  block: BlockData; 
  onChange: (id: number, data: string) => void;
  isRecalculating: boolean;
}) => {
  return (
    <div className={clsx(
      "relative p-5 rounded-3xl border-2 transition-all duration-500 shadow-xl flex flex-col h-full",
      block.isValid 
        ? "bg-white dark:bg-slate-900 border-emerald-500/30 ring-4 ring-emerald-500/5 shadow-emerald-500/5" 
        : "bg-rose-50 dark:bg-rose-950/20 border-rose-500 ring-4 ring-rose-500/10 shadow-rose-500/10"
    )}>
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
            <div className={clsx("p-1.5 rounded-lg", block.isValid ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-rose-100 dark:bg-rose-900/30 text-rose-600")}>
                <Layers className="w-4 h-4" />
            </div>
            <span className="font-black text-xs text-slate-400 uppercase tracking-widest">Block #{block.id}</span>
        </div>
        {block.isValid ? (
           <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
             <CheckCircle className="w-3 h-3" /> Linked
           </div>
        ) : (
           <div className="flex items-center gap-1 text-[10px] font-black text-rose-600 uppercase tracking-tighter animate-pulse">
             <AlertTriangle className="w-3 h-3" /> Broken
           </div>
        )}
      </div>

      <div className="space-y-4 flex-grow">
        {/* Data Input */}
        <div className="relative">
          <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block flex items-center gap-1">
              <Database className="w-3 h-3" /> Ledger Data
          </label>
          <textarea
            value={block.data}
            onChange={(e) => onChange(block.id, e.target.value)}
            className={clsx(
              "w-full h-20 p-3 text-xs rounded-xl border-2 transition-all font-mono resize-none focus:ring-0 outline-none shadow-inner",
              block.isValid 
                ? "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 focus:border-emerald-500/50"
                : "bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-100 focus:border-rose-500"
            )}
            placeholder="Tx: Alice -> Bob $50"
          />
          {isRecalculating && (
              <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                  <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
              </div>
          )}
        </div>

        {/* Previous Hash */}
        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
             <History className="w-3 h-3" /> Prev Hash
           </label>
           <div className={clsx(
             "text-[9px] font-mono p-2 rounded-lg truncate transition-colors border",
             block.id === 1 
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700" // Genesis
                : block.isValid 
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                    : "bg-rose-100/50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-bold border-rose-200 dark:border-rose-900/50"
           )}>
             {block.prevHash}
           </div>
        </div>

        {/* Current Hash */}
        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-slate-400">Fingerprint (Hash)</label>
           <div className={clsx(
               "text-[9px] font-mono p-2 rounded-lg border transition-colors break-all",
               block.isValid 
                ? "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500"
                : "bg-rose-50 dark:bg-slate-950 border-rose-500/50 text-rose-400 line-through"
           )}>
             {block.hash}
           </div>
        </div>
      </div>

      {/* Connection Indicator */}
      {block.id > 1 && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <Link2 className={clsx("w-5 h-5 transition-colors", block.isValid ? "text-emerald-500" : "text-rose-500")} />
          </div>
      )}
    </div>
  );
};

export const BlockchainDemo: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([
    { id: 1, data: 'Genesis Block', prevHash: '0000000000000000', hash: '', isValid: true },
    { id: 2, data: 'Alice -> Bob: $100', prevHash: '', hash: '', isValid: true },
    { id: 3, data: 'Bob -> Charlie: $40', prevHash: '', hash: '', isValid: true },
  ]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Effect to handle manual tampering
  const handleDataChange = async (id: number, newData: string) => {
    const newBlocks = [...blocks];
    const index = id - 1;
    newBlocks[index].data = newData;

    // Recalculate only the edited block's hash
    const raw = newBlocks[index].id + newBlocks[index].data + newBlocks[index].prevHash;
    newBlocks[index].hash = await sha256(raw);

    // Invalidate everything after it
    for (let i = index + 1; i < newBlocks.length; i++) {
        newBlocks[i].isValid = false;
        // The chain is broken because the next block's prevHash NO LONGER matches this block's hash
    }

    // Check validity of the chain
    for (let i = 0; i < newBlocks.length; i++) {
        if (i === 0) {
            newBlocks[i].isValid = true; // Genesis is base truth
        } else {
            newBlocks[i].isValid = newBlocks[i].prevHash === newBlocks[i-1].hash && newBlocks[i-1].isValid;
        }
    }

    setBlocks(newBlocks);
  };

  const repairChain = async () => {
      setIsCalculating(true);
      const repaired = [...blocks];
      for (let i = 0; i < repaired.length; i++) {
          if (i > 0) repaired[i].prevHash = repaired[i-1].hash;
          const raw = repaired[i].id + repaired[i].data + repaired[i].prevHash;
          repaired[i].hash = await sha256(raw);
          repaired[i].isValid = true;
      }
      setBlocks(repaired);
      setIsCalculating(false);
  };

  useEffect(() => {
     repairChain();
     
  }, []);

  const isChainBroken = blocks.some(b => !b.isValid);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      
      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 rounded-xl text-white">
                      <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">The Immutability Link</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  In a blockchain, every block includes the <strong>Fingerprint (Hash)</strong> of the previous block. 
                  This creates a mathematical chain. If you change even one letter in the past, the fingerprints no longer match, 
                  and the <strong>entire chain breaks</strong> instantly.
              </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                {isChainBroken ? (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center text-center">
                        <AlertTriangle className="w-12 h-12 text-rose-500 mb-2 animate-bounce" />
                        <h4 className="font-bold text-rose-600 uppercase text-xs mb-4">Chain Integrity Compromised!</h4>
                        <button 
                            onClick={repairChain}
                            className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-all"
                        >
                            <RefreshCw className={clsx("w-3 h-3", isCalculating && "animate-spin")} />
                            Recalculate (Mine) Chain
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mb-2" />
                        <h4 className="font-bold text-emerald-600 uppercase text-xs">Chain is Secure & Honest</h4>
                        <p className="text-[10px] text-slate-500 mt-2">Try editing any block to see it break.</p>
                    </div>
                )}
          </div>
      </div>

      {/* The Chain Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative pb-12">
         {/* Connecting Line (Desktop) */}
         <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2" />

         <AnimatePresence mode='popLayout'>
            {blocks.map((block) => (
              <motion.div 
                key={block.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full"
              >
                <Block 
                  block={block} 
                  onChange={handleDataChange}
                  isRecalculating={isCalculating}
                />
              </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* Senior Dev Note */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
              <Layers className="w-32 h-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Technically...</div>
                  <h5 className="font-bold text-emerald-400">Hashed Linking</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                      Every block's input includes <code>prev_hash</code>. This makes the hash of Block N dependent on Block N-1.
                  </p>
              </div>
              <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Why it's Secure</div>
                  <h5 className="font-bold text-indigo-400">Immutability</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                      Changing a block requires re-calculating (mining) every single block that comes after it. This is computationally impossible to do quickly.
                  </p>
              </div>
              <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">In Real Life</div>
                  <h5 className="font-bold text-amber-400">Consensus</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                      Thousands of computers check these links every second. If your chain doesn't match the majority, it's rejected.
                  </p>
              </div>
          </div>
      </div>

    </div>
  );
};