import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { GitMerge, GitBranch, Database, Activity, Search } from 'lucide-react';

// --- Types ---
interface TrieNode {
  id: string;
  label: string;
  isWord?: boolean;
  children?: TrieNode[];
}

interface Dataset {
  name: string;
  words: string[];
  trie: TrieNode;
  patricia: TrieNode;
}

// --- Data ---
const DATASETS: Record<string, Dataset> = {
  COMPLEX: {
    name: "Bear & Bell",
    words: ['bear', 'bell', 'bid', 'bull', 'buy'],
    trie: {
      id: 'root', label: 'root',
      children: [
        {
          id: 'b', label: 'b',
          children: [
            {
              id: 'be', label: 'e',
              children: [
                { id: 'bea', label: 'a', children: [{ id: 'bear', label: 'r', isWord: true }] },
                { id: 'bel', label: 'l', children: [{ id: 'bell', label: 'l', isWord: true }] }
              ]
            },
            { id: 'bi', label: 'i', children: [{ id: 'bid', label: 'd', isWord: true }] },
            {
              id: 'bu', label: 'u',
              children: [
                { id: 'bul', label: 'l', children: [{ id: 'bull', label: 'l', isWord: true }] },
                { id: 'buy', label: 'y', children: [{ id: 'buys', label: 'y', isWord: true }] }
              ]
            }
          ]
        }
      ]
    },
    patricia: {
      id: 'root', label: 'root',
      children: [
        {
          id: 'b', label: 'b',
          children: [
            {
              id: 'be', label: 'e',
              children: [
                { id: 'bear', label: 'ar', isWord: true },
                { id: 'bell', label: 'll', isWord: true }
              ]
            },
            { id: 'bid', label: 'id', isWord: true },
            {
              id: 'bu', label: 'u',
              children: [
                { id: 'bull', label: 'll', isWord: true },
                { id: 'buy', label: 'y', isWord: true }
              ]
            }
          ]
        }
      ]
    }
  },
  SIMPLE: {
    name: "Car & Cat",
    words: ['car', 'cat'],
    trie: {
      id: 'root', label: 'root',
      children: [
        {
          id: 'c', label: 'c',
          children: [
            {
              id: 'ca', label: 'a',
              children: [
                { id: 'car', label: 'r', isWord: true },
                { id: 'cat', label: 't', isWord: true }
              ]
            }
          ]
        }
      ]
    },
    patricia: {
      id: 'root', label: 'root',
      children: [
        {
          id: 'ca', label: 'ca',
          children: [
            { id: 'car', label: 'r', isWord: true },
            { id: 'cat', label: 't', isWord: true }
          ]
        }
      ]
    }
  }
};

const findPathToNode = (root: TrieNode, targetId: string): string[] | null => {
  if (root.id === targetId) return [root.id];
  if (!root.children) return null;
  for (const child of root.children) {
    const path = findPathToNode(child, targetId);
    if (path) return [root.id, ...path];
  }
  return null;
};

// --- Main Component ---
const PatriciaTrieVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'trie' | 'patricia'>('trie');
  const [datasetKey, setDatasetKey] = useState<string>('COMPLEX');
  const [activePath, setActivePath] = useState<string[]>([]);
  const [animatingNode, setAnimatingNode] = useState<string | null>(null);
  const [stepCount, setStepCount] = useState(0);
  const [status, setStatus] = useState<string>('Ready');
  const [isAnimating, setIsAnimating] = useState(false);
  const [nodes, setNodes] = useState<Map<string, { x: number, y: number }>>(new Map());

  const currentDataset = DATASETS[datasetKey];
  const currentTree = mode === 'trie' ? currentDataset.trie : currentDataset.patricia;
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Position Tracking Logic
  const updateNodePositions = useCallback(() => {
    if (!wrapperRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const newNodes = new Map<string, { x: number, y: number }>();

    const elements = wrapperRef.current.querySelectorAll('[data-node-id]');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const id = el.getAttribute('data-node-id');
      if (id) {
        newNodes.set(id, {
          x: rect.left - wrapperRect.left + rect.width / 2,
          y: rect.top - wrapperRect.top + rect.height / 2,
        });
      }
    });

    setNodes(newNodes);
  }, []);

  useLayoutEffect(() => {
    updateNodePositions();
    if (!wrapperRef.current) return;
    
    const observer = new ResizeObserver(() => {
      updateNodePositions();
    });
    observer.observe(wrapperRef.current);
    
    return () => observer.disconnect();
  }, [updateNodePositions]);

  const handleWordClick = useCallback((wordId: string) => {
    if (isAnimating) return;
    const path = findPathToNode(currentTree, wordId);
    if (!path) return;

    setIsAnimating(true);
    setActivePath(path);
    setStepCount(0);
    setStatus('Initializing...');

    let idx = 0;
    const animateNext = () => {
      if (idx >= path.length) {
        setStatus(`Found "${wordId}"!`);
        setTimeout(() => {
          setIsAnimating(false);
          setAnimatingNode(null);
        }, 2000);
        return;
      }

      const nodeId = path[idx];
      setAnimatingNode(nodeId);
      setStepCount(idx);
      setStatus(idx === 0 ? 'Start at Root' : `Jump to "${nodeId}"`);
      idx++;
      setTimeout(animateNext, 800);
    };
    animateNext();
  }, [currentTree, isAnimating]);

  useEffect(() => {
    setActivePath([]);
    setAnimatingNode(null);
    setStepCount(0);
    setStatus('Ready');
    setIsAnimating(false);
  }, [mode, datasetKey]);

  return (
    <div className="w-full flex flex-col gap-8 items-center">
      {/* Controls HUD */}
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <button onClick={() => setMode('trie')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'trie' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-md' : 'text-neutral-500'}`}>
              <GitBranch size={14} /> Standard
            </button>
            <button onClick={() => setMode('patricia')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'patricia' ? 'bg-pink-500 text-white shadow-lg' : 'text-neutral-500'}`}>
              <GitMerge size={14} /> Patricia
            </button>
          </div>
          <div className="flex p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
            {Object.keys(DATASETS).map((key) => (
              <button key={key} onClick={() => setDatasetKey(key)} className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${datasetKey === key ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>
                {DATASETS[key].name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 text-white p-6 rounded-[32px] border border-neutral-800 flex flex-col justify-between shadow-xl">
           <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Live Status</span>
              <Activity size={16} className={isAnimating ? 'text-orange-500 animate-pulse' : 'text-neutral-700'} />
           </div>
           <div className="text-lg font-bold font-mono text-orange-400 mt-2 mb-2 truncate">
              {status}
           </div>
           <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tabular-nums">{stepCount}</span>
              <span className="text-xs font-bold text-neutral-500 uppercase">Hops</span>
           </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {currentDataset.words.map((word) => (
          <button 
            key={word} 
            onClick={() => handleWordClick(word)}
            disabled={isAnimating}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold border-2 transition-all flex items-center gap-2 ${activePath[activePath.length - 1] === word ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:border-orange-500'}`}
          >
            <Search size={12} /> {word}
          </button>
        ))}
      </div>

      {/* Main Simulation Container */}
      <div 
        ref={containerRef}
        className="w-full min-h-[400px] md:min-h-[600px] bg-white dark:bg-neutral-950 rounded-[48px] border border-neutral-200 dark:border-neutral-800 p-4 md:p-12 overflow-auto custom-scrollbar flex items-center justify-center"
      >
        <div className="relative isolate" ref={wrapperRef}>
           <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#171717_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none -z-20" />

           {/* --- THE GLOBAL SVG OVERLAY --- */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible">
              <TreeEdges 
                node={currentTree} 
                nodesMap={nodes} 
                activePath={activePath} 
                animatingNode={animatingNode}
                isPatricia={mode === 'patricia'}
              />
           </svg>

           {/* --- THE NODE TREE --- */}
           <div className="relative z-10 min-w-max">
              <TreeNodeComponent 
                node={currentTree} 
                isPatricia={mode === 'patricia'} 
                activePath={activePath} 
                animatingNode={animatingNode}
              />
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Recursive component that draws lines based on the Map of coordinates ---
interface TreeEdgesProps {
  node: TrieNode;
  nodesMap: Map<string, { x: number, y: number }>;
  activePath: string[];
  animatingNode: string | null;
  isPatricia: boolean;
}

const TreeEdges = ({ node, nodesMap, activePath, animatingNode, isPatricia }: TreeEdgesProps) => {
  if (!node.children) return null;

  return (
    <>
      {node.children.map((child: TrieNode) => {
        const start = nodesMap.get(node.id);
        const end = nodesMap.get(child.id);

        if (!start || !end) return null;

        const curve = 25;
        const d = `M ${start.x} ${start.y} C ${start.x + curve} ${start.y}, ${end.x - curve} ${end.y}, ${end.x} ${end.y}`;
        
        const isActive = activePath.includes(child.id);
        const isVisited = isActive && (activePath.indexOf(child.id) <= activePath.indexOf(animatingNode || ''));

        return (
          <g key={`${node.id}-${child.id}`}>
            {/* SOLID VISIBLE GRAY LINE */}
            <path d={d} stroke="currentColor" className="text-neutral-300 dark:text-neutral-600" strokeWidth="3" fill="none" />
            
            {/* ACTIVE COLORED LINE */}
            {isActive && (
              <motion.path
                d={d}
                stroke={isPatricia ? '#ec4899' : '#3b82f6'}
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isVisited ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
            )}
            <TreeEdges node={child} nodesMap={nodesMap} activePath={activePath} animatingNode={animatingNode} isPatricia={isPatricia} />
          </g>
        );
      })}
    </>
  );
};

interface TreeNodeComponentProps {
  node: TrieNode;
  isPatricia: boolean;
  activePath: string[];
  animatingNode: string | null;
}

const TreeNodeComponent = ({ node, isPatricia, activePath, animatingNode }: TreeNodeComponentProps) => {
  const isRoot = node.label === 'root';
  const isCompressed = node.label.length > 1 && !isRoot;
  const isActive = activePath.includes(node.id);
  const isVisited = isActive && (activePath.indexOf(node.id) <= activePath.indexOf(animatingNode || ''));
  const isCurrent = animatingNode === node.id;

  return (
    <div className="flex flex-row items-center gap-8 md:gap-24">
      {/* Node Circle */}
      <div className="relative group" data-node-id={node.id}>
        <motion.div
          animate={{
            scale: isCurrent ? 1.2 : 1,
            borderColor: isVisited ? (isPatricia ? '#ec4899' : '#3b82f6') : '#e5e5e5',
            boxShadow: isCurrent ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none'
          }}
          className={`
            relative z-10 flex items-center justify-center font-mono font-black transition-all duration-300
            ${isRoot ? 'w-10 h-10 md:w-14 md:h-14 bg-neutral-900 text-white rounded-full shadow-xl' : ''}
            ${!isRoot && !isCompressed ? 'w-8 h-8 md:w-10 md:h-10 border-2 bg-white dark:bg-neutral-900 rounded-full text-[10px] md:text-xs' : ''}
            ${isCompressed ? 'h-8 md:h-10 px-3 md:px-4 border-2 bg-pink-50 dark:bg-neutral-900 text-pink-600 dark:text-pink-400 rounded-full text-[10px] md:text-xs' : ''}
            ${node.isWord && !isRoot ? 'ring-2 ring-emerald-500/20 !border-emerald-500 !text-emerald-600' : ''}
             
             ${isActive ? (isPatricia ? 'border-pink-500' : 'border-blue-500') : 'border-neutral-200 dark:border-neutral-600'}
           `}
        >
          {isRoot ? <Database size={14} className="md:w-[18px] md:h-[18px]" /> : node.label}
          
          {isCompressed && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm">
              Zip
            </div>
          )}
          
          {node.isWord && !isRoot && (
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-emerald-500 whitespace-nowrap">
                Value
             </div>
          )}
        </motion.div>
      </div>

      {/* Recursive Children Column */}
      {node.children && node.children.length > 0 && (
        <div className="flex flex-col gap-3 md:gap-8">
          {node.children.map((child) => (
            <TreeNodeComponent 
              key={child.id} 
              node={child} 
              isPatricia={isPatricia} 
              activePath={activePath} 
              animatingNode={animatingNode} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatriciaTrieVisualizer;