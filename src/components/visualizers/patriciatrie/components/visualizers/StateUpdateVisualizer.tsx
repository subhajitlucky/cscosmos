import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MerklePatriciaTrie } from '../../utils/mpt';
import TrieNodeVisualizer from './TrieNodeVisualizer';
import { RefreshCcw, Zap, Hash, Activity, History } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

const StateUpdateVisualizer: React.FC = () => {
  const [trie, setTrie] = useState(() => {
    const t = new MerklePatriciaTrie();
    t.insert('car', 'vroom');
    return t;
  });

  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<{ step: number, hash: string, val: string }[]>([]);

  const updateTrie = useCallback(() => {
    const newVal = step % 2 === 0 ? 'fast' : 'slow';
    trie.insert('car', newVal);
    const newTrie = trie.clone();
    setTrie(newTrie);
    setStep(s => s + 1);
    setHistory(prev => [{ step: step + 1, hash: newTrie.rootHash!, val: newVal }, ...prev].slice(0, 3));
  }, [step, trie]);

  return (
    <div className="w-full h-full flex flex-col gap-6 lg:gap-8">
      {/* Premium Control Header */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-500 opacity-10 blur-xl"></div>
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner shrink-0">
              <Hash size={24} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-1">Active State Root</span>
              <Tooltip content="The current cryptographic root hash of the trie">
                <p className="font-mono text-sm sm:text-base font-black text-primary truncate max-w-[180px] sm:max-w-[250px] cursor-help">{trie.rootHash}</p>
              </Tooltip>
            </div>
          </div>
          
          <button 
            onClick={updateTrie}
            className="group relative px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-primary/25 active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Zap size={16} className="group-hover:animate-pulse" />
            Update 'car' State
          </button>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative min-h-[400px] sm:min-h-[500px] bg-neutral-50 dark:bg-neutral-950 rounded-[40px] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-12 overflow-hidden flex items-center justify-center shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] dark:opacity-[0.05]" />
        
        <div className="w-full h-full overflow-auto custom-scrollbar flex items-center justify-center">
          <div className="min-w-max p-8 transform scale-[0.8] sm:scale-[0.9] lg:scale-100 origin-center transition-transform">
            <TrieNodeVisualizer 
              nodeHash={trie.rootHash!} 
              getTrieNode={(h) => trie.getNode(h)} 
              affectedNodes={trie.affectedNodes}
            />
          </div>
        </div>

        {/* Real-time Event Toast */}
        <AnimatePresence>
          {trie.affectedNodes.size > 0 && (
            <motion.div 
              key={step}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute bottom-6 right-6 p-4 bg-emerald-500 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 z-30 max-w-[90vw]"
            >
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <RefreshCcw size={16} className="animate-spin" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 truncate">Path Shadowing</p>
                <p className="text-xs font-bold truncate">State Transition Verified</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Concept Engine */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[40px] shadow-sm">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Activity size={20} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Transition Engine</h4>
           </div>
           <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
             Notice the <span className="text-primary font-bold italic">"Hash Ripple"</span>. When a value changes, only the nodes on the direct path to the root are recalculated. This allows the trie to maintain a permanent history of every state without duplicating the entire database.
           </p>
        </div>

        {/* Delta History */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-neutral-900 dark:bg-neutral-900 text-white rounded-[40px] border border-neutral-800 shadow-xl">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                 <History size={20} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-50">State Delta Log</h4>
           </div>
           
           <div className="space-y-3">
              {history.length === 0 && <p className="text-xs text-neutral-500 italic">No transitions recorded yet.</p>}
              {history.map((h) => (
                <motion.div 
                  key={h.step}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-black opacity-30 shrink-0">#{h.step}</span>
                    <span className="text-xs font-bold text-primary truncate">car: {h.val}</span>
                  </div>
                  <Tooltip content={h.hash}>
                    <span className="font-mono text-[10px] opacity-50 truncate max-w-[100px] cursor-help">{h.hash}</span>
                  </Tooltip>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StateUpdateVisualizer;