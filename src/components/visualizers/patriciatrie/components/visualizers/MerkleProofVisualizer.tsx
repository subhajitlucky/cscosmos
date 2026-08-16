import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MerklePatriciaTrie } from '../../utils/mpt';
import { ShieldCheck, Fingerprint, Lock, Search } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

const MerkleProofVisualizer: React.FC = () => {
  const trie = useMemo(() => {
    const t = new MerklePatriciaTrie();
    t.insert('apple', 'red');
    t.insert('banana', 'yellow');
    t.insert('apricot', 'orange');
    return t;
  }, []);

  const [searchKey, setSearchKey] = useState('apple');
  const proof = useMemo(() => trie.getProof(searchKey), [trie, searchKey]);

  return (
    <div className="w-full h-full flex flex-col gap-6 sm:gap-10">
      {/* Premium Verification Input */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 opacity-20 blur-xl"></div>
        <div className="relative p-5 sm:p-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-[28px] sm:rounded-[32px] shadow-2xl flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Search size={18} />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Proof Engine</h4>
              <p className="text-[8px] text-neutral-500 font-bold uppercase">Generate Inclusion Proofs</p>
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
            <input 
              type="text" 
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value.toLowerCase())}
              placeholder="Key..."
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-xl pl-10 pr-4 py-3 font-mono text-sm sm:text-base focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Verification Chain */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary" size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500">Path</h3>
          </div>
          <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
            {proof.length} Nodes
          </span>
        </div>
        
        <div className="flex flex-col gap-1.5">
          {proof.map((node, i) => (
            <React.Fragment key={i}>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center gap-3 sm:gap-4"
              >
                <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[8px] font-black text-neutral-400 border border-neutral-200 dark:border-neutral-700 shrink-0">
                  {i}
                </div>

                <div className="flex-1 min-w-0 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm flex items-center justify-between gap-4 group-hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <Fingerprint size={14} className={node ? 'text-primary' : 'text-red-500'} />
                    <div className="min-w-0 flex flex-col">
                      <Tooltip content="Node Hash">
                        <p className="font-mono text-[10px] text-neutral-600 dark:text-neutral-300 truncate font-bold cursor-help">
                          {node ? node.hash : 'MISSING'}
                        </p>
                      </Tooltip>
                      <Tooltip content="Node Type">
                        <p className="text-[7px] font-black text-neutral-400 uppercase tracking-widest cursor-help">
                          {node?.type || 'NULL'}
                        </p>
                      </Tooltip>
                    </div>
                  </div>
                  
                  {node && (
                    <div className="flex flex-col items-end shrink-0">
                       <Tooltip content="Verified Node">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] cursor-help" />
                       </Tooltip>
                    </div>
                  )}
                </div>
              </motion.div>

              {i < proof.length - 1 && (
                <div className="flex ml-3">
                   <div className="w-px h-4 bg-neutral-200 dark:border-neutral-800" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence>
          {proof.length > 0 && proof[proof.length - 1] && (
             <motion.div 
               initial={{ scale: 0.98, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="mt-8 p-6 bg-neutral-900 dark:bg-black rounded-[32px] text-white border border-neutral-800 shadow-xl relative overflow-hidden"
             >
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shrink-0">
                    <ShieldCheck size={28} className="text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-sm font-black mb-1 uppercase tracking-widest">Verified</h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Cryptography proves <span className="text-emerald-400 font-bold">"{searchKey}"</span> exists in the trie.
                    </p>
                  </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MerkleProofVisualizer;
