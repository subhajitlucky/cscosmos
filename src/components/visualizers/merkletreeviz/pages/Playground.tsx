import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MerkleTree, type Node } from '../lib/merkle';
import TreeVisualizer from '../components/TreeVisualizer';
import { ChallengeMode } from '../components/ChallengeMode';
import { Plus, Trash2, Search, Database, Info, RefreshCw, Zap, ShieldCheck, Gamepad2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useSound } from '../hooks/useSound';

type ContextMode = 'default' | 'bitcoin' | 'git' | 'spotify';

const Playground = () => {
  const [items, setItems] = useState<string[]>(['TX_ALPHA', 'TX_BETA', 'TX_GAMMA', 'TX_DELTA']);
  const [tree, setTree] = useState<MerkleTree>(new MerkleTree());
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [selectedLeafIndex, setSelectedLeafIndex] = useState<number | null>(null);
  const [tamperedIndex, setTamperedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contextMode, setContextMode] = useState<ContextMode>('default');
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  
  const { playClick, playHover, playSuccess } = useSound();

  const updateTree = useCallback(async (data: string[]) => {
    setIsProcessing(true);
    const newTree = new MerkleTree();
    await new Promise(resolve => setTimeout(resolve, 400));
    await newTree.build(data);
    setTree(newTree);
    setIsProcessing(false);
    
    if (tamperedIndex !== null) {
      const ids = new Set<string>();
      let currIdx = tamperedIndex;
      for (let i = 0; i < newTree.levels.length; i++) {
        if (newTree.levels[i][currIdx]) {
          ids.add(newTree.levels[i][currIdx].id);
        }
        currIdx = Math.floor(currIdx / 2);
      }
      setHighlightedIds(ids);
    }
  }, [tamperedIndex]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (active) await updateTree(items);
    };
    run();
    return () => { active = false; };
  }, [items, updateTree]);

  const generateItem = (mode: ContextMode, index: number) => {
    switch(mode) {
      case 'bitcoin': return `Tx: ${Math.random().toString(16).slice(2, 10)}`;
      case 'git': return `blob: ${Math.random().toString(36).slice(2, 8)}.ts`;
      case 'spotify': return `Chunk: 0x${Math.random().toString(16).slice(2, 6)}`;
      default: return `TX_${String.fromCharCode(65 + index)}`;
    }
  };

  const handleContextChange = (mode: ContextMode) => {
    playClick();
    setContextMode(mode);
    const newItems = Array(4).fill(0).map((_, i) => generateItem(mode, i));
    setItems(newItems);
    setTamperedIndex(null);
    setHighlightedIds(new Set());
  };

  const addItem = () => {
    if (items.length >= 8) return;
    playClick();
    setItems([...items, generateItem(contextMode, items.length)]);
  };

  const removeItem = (index: number) => {
    playClick();
    setItems(items.filter((_, i) => i !== index));
    setTamperedIndex(null);
    setHighlightedIds(new Set());
  };

  const updateItem = (index: number, value: string) => {
    setTamperedIndex(index);
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const generateProof = (index: number) => {
    playSuccess();
    const ids = new Set<string>();
    let currIdx = index;
    for (let i = 0; i < tree.levels.length; i++) {
      const level = tree.levels[i];
      if (level[currIdx]) {
        ids.add(level[currIdx].id);
        const isRight = currIdx % 2 === 1;
        const sibIdx = isRight ? currIdx - 1 : currIdx + 1;
        if (sibIdx < level.length) {
          ids.add(level[sibIdx].id);
        }
      }
      currIdx = Math.floor(currIdx / 2);
    }
    setHighlightedIds(ids);
    setSelectedLeafIndex(index);
  };

  const handleNodeClick = (node: Node) => {
    playClick();
    if (node.isLeaf) {
      const index = tree.levels[0].findIndex(n => n.id === node.id);
      if (index !== -1) generateProof(index);
    } else {
      const ids = new Set<string>();
      let current: Node | undefined = node;
      while (current) {
        ids.add(current.id);
        const parentId: string | undefined = current.parentId;
        current = parentId ? tree.nodes.get(parentId) : undefined;
      }
      setHighlightedIds(ids);
      setSelectedLeafIndex(null);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 overflow-x-hidden pt-0">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            Merkle Refinery
            {isProcessing && <RefreshCw className="w-5 h-5 text-primary animate-spin" />}
          </h1>
          <p className="text-xs sm:text-sm text-muted font-medium max-w-xl">
            Forge data at the base. Watch hashes flow upward until they reach the 
            <span className="text-primary font-bold"> Cryptographic Summit</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            {/* Context Switcher */}
            <div className="flex bg-card border border-card-border p-1 rounded-2xl shadow-sm">
                {(['default', 'bitcoin', 'git', 'spotify'] as ContextMode[]).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => handleContextChange(mode)}
                        onMouseEnter={playHover}
                        className={clsx(
                            "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                            contextMode === mode ? "bg-primary text-primary-foreground shadow-sm" : "text-muted hover:text-foreground hover:bg-secondary"
                        )}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-card border border-card-border p-2 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 px-3 py-1 border-r border-card-border">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted">Integrity Flow</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted">Data Tamper</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* Input Floor (Sidebar) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="bg-card border border-card-border rounded-[2rem] p-6 shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-widest text-muted flex items-center gap-2">
                <Database className="w-4 h-4" />
                Forge Floor
              </h3>
              <button 
                onClick={addItem}
                onMouseEnter={playHover}
                className="p-2 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                title="Add New Entry"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {items.map((item, idx) => (
                  <motion.div
                    key={`${idx}-${item}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={clsx(
                      "group p-4 rounded-2xl border-2 transition-all relative overflow-hidden",
                      selectedLeafIndex === idx ? "border-primary bg-primary/5 shadow-sm" : "border-card-border bg-background",
                      tamperedIndex === idx ? "border-red-500/50 bg-red-500/5" : ""
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black text-muted/40 uppercase">
                          {contextMode === 'bitcoin' ? 'Transaction' : contextMode === 'git' ? 'File Blob' : contextMode === 'spotify' ? 'Audio Chunk' : 'Data Entry'} #{idx}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => generateProof(idx)} className="p-1.5 hover:bg-primary/10 text-primary rounded-lg">
                          <Search className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeItem(idx)} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <input
                      value={item}
                      onChange={(e) => updateItem(idx, e.target.value)}
                      className="w-full bg-transparent font-mono text-sm font-bold outline-none text-foreground"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-accent/5 border border-accent/10 space-y-4 shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
              <Info className="w-4 h-4" />
              Refinery Stats
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-2xl border border-card-border shadow-sm">
                <div className="text-[9px] text-muted uppercase font-bold mb-1">Total Nodes</div>
                <div className="text-2xl font-black text-foreground">{tree.nodes.size}</div>
              </div>
              <div className="p-4 bg-card rounded-2xl border border-card-border shadow-sm">
                <div className="text-[9px] text-muted uppercase font-bold mb-1">Height</div>
                <div className="text-2xl font-black text-foreground">{tree.levels.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* The Visualizer (Main Floor) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6 flex flex-col">
          <div className="relative group min-h-[400px] lg:min-h-[600px] flex flex-col order-1">
            <TreeVisualizer 
              levels={tree.levels} 
              highlightedIds={highlightedIds}
              tamperedLeafIndex={tamperedIndex}
              onNodeClick={handleNodeClick}
            />
            
            {/* Holographic Root Display - Responsive Positioning */}
            <div className="order-first lg:order-none mb-4 lg:mb-0 relative lg:absolute lg:top-6 lg:right-6 w-full lg:w-56 p-5 bg-card/90 backdrop-blur-xl border border-card-border rounded-3xl shadow-xl pointer-events-none transition-all border-t-primary/20">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck className="w-4 h-4 text-success" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-muted">Summit Hash</span>
               </div>
               <div className="font-mono text-[10px] break-all leading-tight text-foreground font-bold">
                 {tree.levels.length > 0 ? tree.levels[tree.levels.length - 1][0].hash : 'FORGING...'}
               </div>
            </div>
          </div>

          {/* Educational Cards */}
          <div className="order-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Vertical Forge",
                desc: "Data enters at Layer 0 and is distilled upwards. Every change at the base ripples to the Summit.",
                icon: Database
              },
              {
                title: "Interactive Flow",
                desc: "Click any node to see its contribution to the final integrity. Watch the data packets flow.",
                icon: RefreshCw
              },
              {
                title: "Light & Fast",
                desc: "The Merkle Proof (the blue path) is all you need to prove a single entry among millions.",
                icon: Zap
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-card border border-card-border rounded-3xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-sm mb-2 text-foreground">{feature.title}</h5>
                <p className="text-[11px] text-muted leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Challenge Mode CTA - Moved to bottom of simulation on small screens, and prominent on large */}
          <div className="order-3 p-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 shadow-lg relative overflow-hidden group cursor-pointer hover:border-indigo-500/40 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Gamepad2 className="w-16 h-16" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Gamified Repair</h4>
              <p className="text-xs font-medium text-foreground/70 mb-4">Can you find the corrupted shard in O(log n) clicks using binary search principles?</p>
              <button 
                className="w-full sm:w-auto px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/20"
                onClick={() => {
                  playClick();
                  setIsChallengeActive(true);
                }}
              >
                  Start Challenge
              </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isChallengeActive && (
          <ChallengeMode onClose={() => setIsChallengeActive(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Playground;