import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCcw, Trash2, Hash, Database, Search, Fingerprint } from 'lucide-react';
import { MerklePatriciaTrie } from '../utils/mpt';
import type { TrieNode } from '../types/trie';
import TrieNodeVisualizer from '../components/visualizers/TrieNodeVisualizer';
import Tooltip from '../components/ui/Tooltip';

const Playground: React.FC = () => {
  const [trie, setTrie] = useState(() => new MerklePatriciaTrie());
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [trackedKeys, setTrackedKeys] = useState<{key: string, value: string}[]>([]);
  const [selectedNode, setSelectedNode] = useState<TrieNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // Matching the lg breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInsertWithTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key || !value) return;
    
    trie.insert(key, value);
    setTrie(trie.clone());
    
    setTrackedKeys(prev => {
      const filtered = prev.filter(k => k.key !== key);
      return [...filtered, { key, value }];
    });
    
    setLastAction(`Inserted ${key} -> ${value}`);
    setKey('');
    setValue('');
  };

  const handleDeleteWithTracking = (keyToDelete: string) => {
    trie.delete(keyToDelete);
    setTrie(trie.clone());
    setTrackedKeys(prev => prev.filter(k => k.key !== keyToDelete));
    setLastAction(`Deleted ${keyToDelete}`);
  };

  const resetTrie = () => {
    const newTrie = new MerklePatriciaTrie();
    setTrie(newTrie);
    setTrackedKeys([]);
    setSelectedNode(null);
    setLastAction('Trie reset');
  };

  return (
    <div className="relative flex flex-col lg:grid lg:grid-cols-[320px_1fr_300px] gap-6 lg:h-[calc(100vh-160px)] min-h-screen lg:min-h-0">
      {/* Sidebar Controls */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 flex flex-col gap-6 lg:overflow-hidden shadow-sm">
        <div>
          <h2 className="text-lg font-bold mb-1">State Controls</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs">Manage the trie state.</p>
        </div>

        <form onSubmit={handleInsertWithTracking} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Key</label>
            <input 
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. apple"
              className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none transition-colors dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Value</label>
            <input 
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. red"
              className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none transition-colors dark:text-white"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus size={16} /> Insert
          </button>
        </form>

        <div className="flex-1 lg:overflow-auto space-y-2 min-h-0 pr-2 custom-scrollbar">
          <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">Stored Keys</h3>
          {trackedKeys.length === 0 ? (
            <p className="text-neutral-400 dark:text-neutral-600 text-[10px] italic">No keys stored yet.</p>
          ) : (
            trackedKeys.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl group">
                <div className="overflow-hidden min-w-0 flex-1 mr-2">
                  {item.key.length > 20 ? (
                    <Tooltip content={item.key} className="block truncate">
                      <span className="font-mono text-xs text-primary truncate block cursor-help">{item.key}</span>
                    </Tooltip>
                  ) : (
                    <div className="block truncate">
                      <span className="font-mono text-xs text-primary truncate block">{item.key}</span>
                    </div>
                  )}
                  
                  {item.value.length > 20 ? (
                    <Tooltip content={item.value} className="block truncate">
                      <span className="text-neutral-500 dark:text-neutral-400 text-[10px] truncate block cursor-help">{item.value}</span>
                    </Tooltip>
                  ) : (
                    <div className="block truncate">
                      <span className="text-neutral-500 dark:text-neutral-400 text-[10px] truncate block">{item.value}</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => handleDeleteWithTracking(item.key)}
                  className="p-1 text-neutral-400 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
          <button 
            onClick={resetTrie}
            className="w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <RefreshCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl relative overflow-hidden flex flex-col shadow-sm min-h-[500px] lg:min-h-0">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <Hash size={16} className="text-neutral-500 dark:text-neutral-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">State Root</span>
              <p className="font-mono text-sm text-primary font-bold">{trie.rootHash || '0x00000000'}</p>
            </div>
          </div>
          <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest hidden sm:block">Click a node to inspect</p>
        </div>

        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] custom-scrollbar">
           {trie.rootHash ? (
             <div className="min-w-max flex justify-center transform scale-[0.75] sm:scale-[0.85] lg:scale-100 origin-top transition-transform">
               <TrieNodeVisualizer 
                nodeHash={trie.rootHash} 
                getTrieNode={(h) => trie.getNode(h)} 
                affectedNodes={trie.affectedNodes}
                onNodeClick={setSelectedNode}
               />
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-16 h-16 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl mb-4" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">The Trie is empty.</p>
             </div>
           )}
        </div>

        {lastAction && (
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto w-fit p-2 px-4 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold backdrop-blur-md shadow-lg"
            >
              {lastAction}
            </motion.div>
          </div>
        )}
      </div>

      {/* Desktop Node Inspector Sidebar */}
      <div className="hidden lg:flex bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 flex-col gap-4 shadow-sm lg:overflow-hidden">
        <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-2">
          <Database size={12} /> Node Inspector
        </h3>
        
        {selectedNode ? (
          <div className="flex-1 flex flex-col gap-4 lg:overflow-hidden">
            <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Node Hash</span>
              <p className="font-mono text-[10px] text-primary break-all">{selectedNode.hash}</p>
            </div>

            <div className="flex-1 flex flex-col bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-neutral-400 p-3 pb-1 block">Raw Structure</span>
              <div className="flex-1 lg:overflow-auto p-3 pt-0 custom-scrollbar">
                <pre className="text-[10px] text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
                  {JSON.stringify(selectedNode, null, 2)}
                </pre>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-[10px] font-bold text-neutral-400 hover:text-primary transition-colors py-1 cursor-pointer"
            >
              Clear Inspector
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400">
            <Search size={24} className="mb-3 opacity-20" />
            <p className="text-[10px] leading-relaxed">Select a node in the visualizer<br/>to view its internal state.</p>
          </div>
        )}
      </div>

      {/* Mobile Node Inspector Bottom Sheet */}
      <AnimatePresence>
        {isMobile && selectedNode && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 rounded-t-[32px] p-6 shadow-2xl max-h-[60vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-inherit z-10 pb-2">
              <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <Database size={12} /> Node Inspector
              </h3>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-2 -mr-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                 <div className="flex items-center gap-2 text-neutral-400 mb-2">
                    <Fingerprint size={14} />
                    <span className="text-[10px] font-bold uppercase">Hash Signature</span>
                 </div>
                 <p className="font-mono text-xs break-all bg-neutral-100 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 leading-relaxed">
                   {selectedNode.hash}
                 </p>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <span className="text-[8px] font-black text-neutral-400 uppercase block mb-1">Type</span>
                <p className="text-xs font-bold text-primary">{selectedNode.type}</p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden">
                <span className="text-[9px] uppercase font-bold text-neutral-400 p-3 pb-1 block">Raw Structure</span>
                <div className="p-3 pt-0">
                  <pre className="text-[10px] text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed overflow-x-auto">
                    {JSON.stringify(selectedNode, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Playground;
