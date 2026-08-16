import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { NodeType } from '../../types/trie';
import type { TrieNode } from '../../types/trie';
import { nibblesToHex } from '../../utils/mpt';
import { Share2, Database, Layers } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

interface TrieNodeVisualizerProps {
  nodeHash: string;
  getTrieNode: (hash: string) => TrieNode | null;
  affectedNodes?: Set<string>;
  onNodeClick?: (node: TrieNode) => void;
  depth?: number;
}

const TrieNodeVisualizer: React.FC<TrieNodeVisualizerProps> = ({ 
  nodeHash, 
  getTrieNode, 
  affectedNodes,
  onNodeClick,
  depth = 0 
}) => {
  const node = getTrieNode(nodeHash);
  const isAffected = affectedNodes?.has(nodeHash);

  if (!node) return <div className="text-red-500 text-xs">Missing: {nodeHash.substring(0,6)}</div>;

  const containerVariants: Variants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
    }
  };

  const renderNodeContent = () => {
    const commonClasses = `
      transition-all duration-300 min-w-[120px] sm:min-w-[160px] border-2 cursor-pointer group/node relative text-left cursor-pointer
      ${isAffected 
        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-105 z-10' 
        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'}
    `;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onNodeClick?.(node);
    };

    switch (node.type) {
      case NodeType.LEAF:
        return (
          <button type="button" onClick={handleClick} className={`${commonClasses} rounded-xl p-2.5 shadow-sm z-10`}>
            <div className="flex justify-between items-start mb-1.5 relative">
              <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <Database size={10} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Leaf</span>
              </div>
              <Tooltip content="Node Hash (Keccak-256)">
                <span className="text-[8px] font-mono text-neutral-400 font-medium hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  {node.hash.substring(0, 6)}
                </span>
              </Tooltip>
            </div>
            <div className="space-y-1.5 relative">
              <div className="bg-emerald-50/50 dark:bg-emerald-500/10 p-1 rounded-lg border border-emerald-100/50 dark:border-emerald-500/20">
                <span className="text-[7px] text-emerald-800/60 dark:text-emerald-400/60 uppercase font-bold block mb-0.5">Path</span>
                <Tooltip content="Compact Encoded Path">
                  <p className="font-mono text-[10px] text-emerald-900 dark:text-emerald-300 font-bold truncate">
                    {nibblesToHex(node.path)}
                  </p>
                </Tooltip>
              </div>
              <div className="px-0.5">
                <span className="text-[7px] text-neutral-500 dark:text-neutral-400 uppercase font-bold block mb-0.5">Value</span>
                <Tooltip content="RLP Encoded Value">
                  <p className="font-bold text-[10px] truncate text-neutral-900 dark:text-white">{node.value}</p>
                </Tooltip>
              </div>
            </div>
          </button>
        );

      case NodeType.EXTENSION:
        return (
          <div className="flex flex-col items-center relative">
            <button type="button" onClick={handleClick} className={`${commonClasses} rounded-xl p-2.5 shadow-sm z-10`}>
              <div className="flex justify-between items-start mb-1.5 relative">
                <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                  <Layers size={10} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Ext</span>
                </div>
                <Tooltip content="Node Hash (Keccak-256)">
                  <span className="text-[8px] font-mono text-neutral-400 font-medium hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                    {node.hash.substring(0, 6)}
                  </span>
                </Tooltip>
              </div>
              <div className="bg-amber-50/50 dark:bg-amber-500/10 p-1 rounded-lg border border-amber-100/50 dark:border-amber-500/20 relative">
                <span className="text-[7px] text-amber-800/60 dark:text-amber-400/60 uppercase font-bold block mb-0.5">Shared</span>
                <Tooltip content="Shared Nibble Path">
                  <p className="font-mono text-[10px] text-amber-900 dark:text-amber-300 font-bold">
                    {nibblesToHex(node.path)}
                  </p>
                </Tooltip>
              </div>
            </button>
            
            {/* Connector Line */}
            <div className={`w-[2px] h-6 -mt-1 transition-colors duration-500 ${affectedNodes?.has(node.nextNodeHash) ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-800'}`} />
            
            <TrieNodeVisualizer 
              nodeHash={node.nextNodeHash} 
              getTrieNode={getTrieNode} 
              affectedNodes={affectedNodes}
              onNodeClick={onNodeClick}
              depth={depth + 1} 
            />
          </div>
        );

      case NodeType.BRANCH: {
        const childIndices = node.branches.map((b, i) => b ? i : null).filter(i => i !== null) as number[];
        
        return (
          <div className="flex flex-col items-center relative">
            <button type="button" onClick={handleClick} className={`${commonClasses} rounded-xl p-2.5 shadow-sm z-10`}>
              <div className="flex justify-between items-start mb-2 relative">
                <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400">
                  <Share2 size={10} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Branch</span>
                </div>
                <Tooltip content="Node Hash (Keccak-256)">
                  <span className="text-[8px] font-mono text-neutral-400 font-medium hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                    {node.hash.substring(0, 6)}
                  </span>
                </Tooltip>
              </div>
              <div className="grid grid-cols-8 gap-0.5">
                {Array.from({ length: 16 }).map((_, i) => {
                  const hasChild = node.branches[i] !== null;
                  return (
                    <div 
                      key={i} 
                      className={`
                        w-3.5 h-3.5 sm:w-4 sm:h-4 rounded flex items-center justify-center text-[7px] sm:text-[8px] font-mono border transition-all
                        ${hasChild 
                          ? 'bg-primary text-white font-bold border-primary shadow-sm' 
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-700'}
                      `}
                    >
                      {i.toString(16).toUpperCase()}
                    </div>
                  );
                })}
              </div>
            </button>
            
            <div className="flex gap-3 sm:gap-10 mt-6 relative">
              {/* Horizontal Connector Bar */}
              {childIndices.length > 1 && (
                <div className="absolute top-0 left-[12px] right-[12px] h-[2px] bg-neutral-200 dark:bg-neutral-800 -translate-y-[24px]" />
              )}
              
              {node.branches.map((branchHash, i) => (
                branchHash && (
                  <div key={i} className="flex flex-col items-center relative">
                    {/* Vertical connector to horizontal bar */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[24px] w-[2px] h-[24px] bg-neutral-200 dark:bg-neutral-800" />
                    
                    {/* Active highlight for vertical connector */}
                    {affectedNodes?.has(branchHash) && (
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[24px] w-[2px] h-[24px] bg-primary z-20" />
                    )}

                    <div className="flex flex-col items-center mb-3">
                       <div className={`
                         w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold border z-20 transition-all
                         ${affectedNodes?.has(branchHash) 
                           ? 'bg-primary text-white border-primary shadow-lg' 
                           : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-700'}
                       `}>
                          {i.toString(16).toUpperCase()}
                       </div>
                    </div>
                    <TrieNodeVisualizer 
                      nodeHash={branchHash} 
                      getTrieNode={getTrieNode} 
                      affectedNodes={affectedNodes}
                      onNodeClick={onNodeClick}
                      depth={depth + 1} 
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center"
    >
      {renderNodeContent()}
    </motion.div>
  );
};

export default TrieNodeVisualizer;