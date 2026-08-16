import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Network, Hash, ArrowRight, Search, Activity, Cpu } from 'lucide-react';

// --- SHARED TYPES ---
interface VisualNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  children?: VisualNode[];
  isFound?: boolean; // Mark if this is the target
}

// --- DATASETS ---

// 1. BST DATA
const TREE_DATA: VisualNode = {
  id: 'dog', label: 'dog',
  children: [
    {
      id: 'car', label: 'car',
      children: [
        { id: 'cat', label: 'cat', isFound: true } 
      ]
    },
    {
      id: 'elf', label: 'elf', isFound: false
    }
  ]
};

// 2. TRIE DATA
const TRIE_DATA: VisualNode = {
  id: 'root', label: 'root',
  children: [
    {
      id: 'c', label: 'c',
      children: [
        {
          id: 'ca', label: 'a',
          children: [
            { id: 'car', label: 'r', isFound: false },
            { id: 'cat', label: 't', isFound: true }
          ]
        }
      ]
    },
    {
      id: 'd', label: 'd',
      children: [
        {
          id: 'do', label: 'o',
          children: [
            { id: 'dog', label: 'g', isFound: false }
          ]
        }
      ]
    }
  ]
};

// 3. MAP DATA
const MAP_BUCKETS = Array.from({ length: 6 }).map((_, i) => ({ id: `b${i}`, label: `0x0${i}` }));


// --- MAIN CONTAINER ---
const TrieComparisonVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tree' | 'trie' | 'map'>('tree');
  const [isAnimating, setIsAnimating] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [activePath, setActivePath] = useState<string[]>([]);
  
  useEffect(() => {
    setActivePath([]);
    setIsAnimating(false);
    setStatus('Ready to Simulate');
  }, [activeTab]);

  const handleSimulate = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActivePath([]);
    setStatus('Initializing...');

    if (activeTab === 'tree') simulateTree();
    if (activeTab === 'trie') simulateTrie();
    if (activeTab === 'map') simulateMap();
  };

  const simulateTree = () => {
    const path = ['dog', 'car', 'cat'];
    let step = 0;
    const next = () => {
      if (step >= path.length) {
        setStatus('Found "cat"!');
        setTimeout(() => setIsAnimating(false), 1500);
        return;
      }
      const node = path[step];
      setActivePath(prev => [...prev, node]);
      if (node === 'cat') setStatus('Match Found!');
      else if (node === 'dog') setStatus('"cat" < "dog" → Left');
      else if (node === 'car') setStatus('"cat" > "car" → Right');
      step++;
      setTimeout(next, 1000);
    };
    next();
  };

  const simulateTrie = () => {
    const path = ['root', 'c', 'ca', 'cat'];
    let step = 0;
    const next = () => {
      if (step >= path.length) {
        setStatus('Found "cat"!');
        setTimeout(() => setIsAnimating(false), 1500);
        return;
      }
      const node = path[step];
      setActivePath(prev => [...prev, node]);
      if (node === 'root') setStatus('Start at Root');
      else setStatus(`Follow '${node.slice(-1)}' edge...`);
      step++;
      setTimeout(next, 800);
    };
    next();
  };

  const simulateMap = () => {
    setStatus('Hashing "cat"...');
    setActivePath(['hash']);
    setTimeout(() => {
      setStatus('Hash: 0x94... (Index 3)');
      setActivePath(['hash', 'beam']);
      setTimeout(() => {
        setStatus('Direct Access: Bucket 3');
        setActivePath(['hash', 'beam', 'b3']);
        setTimeout(() => setIsAnimating(false), 1500);
      }, 800);
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex p-1 bg-neutral-100 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <TabButton id="tree" icon={Network} label="BST Tree" active={activeTab} onClick={setActiveTab} />
          <TabButton id="trie" icon={GitBranch} label="Trie" active={activeTab} onClick={setActiveTab} />
          <TabButton id="map" icon={Hash} label="Hash Map" active={activeTab} onClick={setActiveTab} />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="flex-1 md:flex-none text-right">
              <div className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Target Key</div>
              <div className="font-mono font-bold text-xl text-neutral-800 dark:text-neutral-200">"cat"</div>
           </div>
           <button
             onClick={handleSimulate}
             disabled={isAnimating}
             className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${isAnimating ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed' : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 shadow-lg'}`}
           >
             {isAnimating ? <Activity className="animate-spin" size={14} /> : <Search size={14} />}
             {isAnimating ? 'Running...' : 'Visualize Search'}
           </button>
        </div>
      </div>

      <div className="relative w-full min-h-[500px] bg-white dark:bg-neutral-950 rounded-[40px] border border-neutral-200 dark:border-neutral-800 p-8 md:p-12 flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:32px_32px] opacity-50 pointer-events-none" />
         
         <div className="absolute top-6 left-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-2xl shadow-xl z-30 max-w-[200px] md:max-w-xs">
            <div className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-1">Process Log</div>
            <div className="font-mono text-xs md:text-sm font-bold text-orange-500 truncate">{status}</div>
         </div>

         <div className="relative z-10 w-full h-full flex items-center justify-center">
            {activeTab === 'tree' && <TreeEngine data={TREE_DATA} activePath={activePath} />}
            {activeTab === 'trie' && <TreeEngine data={TRIE_DATA} activePath={activePath} isTrie />}
            {activeTab === 'map' && <MapEngine buckets={MAP_BUCKETS} activePath={activePath} />}
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <InfoCard label="Complexity" value={activeTab === 'tree' ? 'O(log N)' : activeTab === 'trie' ? 'O(k)' : 'O(1)'} desc={activeTab === 'tree' ? 'Depends on data size' : activeTab === 'trie' ? 'Depends on key length' : 'Instant access'} />
         <InfoCard label="Structure" value={activeTab === 'tree' ? 'Binary Tree' : activeTab === 'trie' ? 'Prefix Tree' : 'Hash Table'} desc={activeTab === 'tree' ? 'Sorted by comparison' : activeTab === 'trie' ? 'Stored by path' : 'Stored by index'} />
         <InfoCard label="Blockchain Fit" value={activeTab === 'trie' ? 'Perfect' : 'Poor'} desc={activeTab === 'trie' ? 'Deterministic & Merkle-friendly' : 'Hard to verify cryptographically'} highlight={activeTab === 'trie'} />
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

interface TabButtonProps {
  id: 'tree' | 'trie' | 'map';
  icon: React.ElementType;
  label: string;
  active: 'tree' | 'trie' | 'map';
  onClick: (id: 'tree' | 'trie' | 'map') => void;
}

const TabButton = ({ id, icon: Icon, label, active, onClick }: TabButtonProps) => (
  <button onClick={() => onClick(id)} className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active === id ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}>
    <Icon size={14} /> <span className="hidden md:inline">{label}</span>
  </button>
);

interface InfoCardProps {
  label: string;
  value: string;
  desc: string;
  highlight?: boolean;
}

const InfoCard = ({ label, value, desc, highlight }: InfoCardProps) => (
  <div className={`p-5 rounded-2xl border ${highlight ? 'bg-orange-500/5 border-orange-500/20' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'}`}>
     <div className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-1">{label}</div>
     <div className={`text-xl font-black mb-1 ${highlight ? 'text-orange-600 dark:text-orange-400' : 'text-neutral-900 dark:text-white'}`}>{value}</div>
     <div className="text-xs font-medium text-neutral-500">{desc}</div>
  </div>
);

// --- ENGINES ---

const TreeEngine = ({ data, activePath, isTrie = false }: { data: VisualNode, activePath: string[], isTrie?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Map<string, {x:number, y:number}>>(new Map());

  const updatePositions = useCallback(() => {
    if (!containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const newNodes = new Map();
    containerRef.current.querySelectorAll('[data-id]').forEach(el => {
      const rect = el.getBoundingClientRect();
      newNodes.set(el.getAttribute('data-id'), {
        x: rect.left - parentRect.left + rect.width/2,
        y: rect.top - parentRect.top + rect.height/2
      });
    });
    setNodes(newNodes);
  }, []); // Remove 'data' dependency

  useLayoutEffect(() => {
    const timer = requestAnimationFrame(() => updatePositions());
    window.addEventListener('resize', updatePositions);
    return () => {
      window.removeEventListener('resize', updatePositions);
      cancelAnimationFrame(timer);
    };
  }, [updatePositions]);

  return (
    <div className="w-full h-full overflow-auto custom-scrollbar flex items-center justify-center">
      <div ref={containerRef} className="relative p-4 md:p-8 flex items-center justify-center min-w-max origin-center">
         <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible -z-10">
            <RecursiveLines node={data} nodes={nodes} activePath={activePath} isTrie={isTrie} />
         </svg>
         <div className="relative z-10">
            <RecursiveNode node={data} activePath={activePath} isTrie={isTrie} />
         </div>
      </div>
    </div>
  );
};

interface RecursiveNodeProps {
  node: VisualNode;
  activePath: string[];
  isTrie?: boolean;
}

const RecursiveNode = ({ node, activePath, isTrie }: RecursiveNodeProps) => {
  const isActive = activePath.includes(node.id);
  const isTarget = node.isFound && isActive && activePath[activePath.length - 1] === node.id;

  return (
    <div className="flex flex-row items-center gap-8 md:gap-24">
      <div data-id={node.id} className="relative">
         <motion.div
           animate={{ scale: isActive ? 1.1 : 1, borderColor: isActive ? (isTrie ? '#ec4899' : '#3b82f6') : '#e5e5e5' }}
           className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center font-mono font-bold text-[10px] md:text-sm shadow-sm ${isActive ? 'bg-neutral-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'} ${isActive ? (isTrie ? 'text-pink-600 dark:text-pink-400 border-pink-500' : 'text-blue-600 dark:text-blue-400 border-blue-500') : 'text-neutral-500 dark:text-neutral-400'} ${isTarget ? '!bg-emerald-500 !border-emerald-500 !text-white' : ''}`}
         >
           {node.label}
         </motion.div>
         {isTarget && <div className="absolute -bottom-5 md:-bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap">Target</div>}
      </div>
      {node.children && (
        <div className="flex flex-col gap-4 md:gap-12">
          {node.children.map((child: VisualNode) => (
            <RecursiveNode key={child.id} node={child} activePath={activePath} isTrie={isTrie} />
          ))}
        </div>
      )}
    </div>
  );
};

interface RecursiveLinesProps {
  node: VisualNode;
  nodes: Map<string, { x: number, y: number }>;
  activePath: string[];
  isTrie?: boolean;
}

const RecursiveLines = ({ node, nodes, activePath, isTrie }: RecursiveLinesProps) => {
  if (!node.children) return null;
  return (
    <>
      {node.children.map((child: VisualNode) => {
        const start = nodes.get(node.id);
        const end = nodes.get(child.id);
        if (!start || !end) return null;
        const d = `M ${start.x} ${start.y} C ${start.x + 30} ${start.y}, ${end.x - 30} ${end.y}, ${end.x} ${end.y}`;
        const isActive = activePath.includes(child.id);
        return (
          <g key={child.id}>
            <path d={d} strokeWidth="2" fill="none" className="stroke-neutral-300 dark:stroke-neutral-700" />
            {isActive && <motion.path d={d} stroke={isTrie ? '#ec4899' : '#3b82f6'} strokeWidth="3" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />}
            <RecursiveLines node={child} nodes={nodes} activePath={activePath} isTrie={isTrie} />
          </g>
        );
      })}
    </>
  );
};

interface MapEngineProps {
  buckets: { id: string; label: string }[];
  activePath: string[];
}

const MapEngine = ({ buckets, activePath }: MapEngineProps) => {
  const isHashing = activePath.includes('hash');
  const isFound = activePath.includes('b3');
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16 w-full justify-center py-8">
       <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-center font-mono font-black text-sm md:text-lg shadow-sm">"cat"</div>
          <span className="text-[10px] font-black uppercase text-neutral-400">Key</span>
       </div>
       <div className="text-neutral-300 dark:text-neutral-700 rotate-90 md:rotate-0"><ArrowRight size={20} className="md:w-6 md:h-6" /></div>
       <div className="relative">
          <motion.div animate={{ scale: isHashing ? 1.1 : 1, borderColor: isHashing ? '#f97316' : '#e5e5e5' }} className={`w-20 h-20 md:w-32 md:h-32 rounded-full border-4 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 z-10 relative transition-colors ${isHashing ? 'border-orange-500' : 'border-neutral-200 dark:border-neutral-800'}`}>
             <Cpu size={24} className={`md:w-8 md:h-8 ${isHashing ? 'text-orange-500' : 'text-neutral-300'}`} />
             <span className="text-[8px] md:text-[10px] font-black uppercase mt-2 text-neutral-500">Hash Fn</span>
          </motion.div>
       </div>
       <div className="text-neutral-300 dark:text-neutral-700 rotate-90 md:rotate-0"><ArrowRight size={20} className="md:w-6 md:h-6" /></div>
       <div className="grid grid-cols-2 md:grid-cols-1 gap-2 w-full max-w-[280px] md:max-w-[200px]">
          {buckets.map((b: { id: string; label: string }) => (
             <motion.div key={b.id} animate={{ scale: b.id === 'b3' && isFound ? 1.05 : 1, borderColor: b.id === 'b3' && isFound ? '#10b981' : '' }} className={`w-full p-2 rounded-lg border-2 border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-3 md:px-4 bg-white dark:bg-neutral-900 transition-colors ${b.id === 'b3' && isFound ? '!border-emerald-500 !bg-emerald-50 dark:!bg-emerald-900/20 text-emerald-600' : 'text-neutral-500'}`}>
                <span className="font-mono text-[10px] md:text-xs font-bold">{b.label}</span>
                {b.id === 'b3' && isFound ? <span className="font-black text-[8px] md:text-xs">VALUE</span> : <span className="text-[8px] md:text-[10px] opacity-50">Empty</span>}
             </motion.div>
          ))}
       </div>
    </div>
  );
};

export default TrieComparisonVisualizer;