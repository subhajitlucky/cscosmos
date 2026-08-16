import React from 'react';
import { motion } from 'framer-motion';
import { type Node } from '../lib/merkle';
import { clsx } from 'clsx';
import { ShieldCheck, Database, Cpu } from 'lucide-react';

interface TreeVisualizerProps {
  levels: Node[][];
  highlightedIds?: Set<string>;
  brokenIds?: Set<string>;
  tamperedLeafIndex?: number | null;
  onNodeClick?: (node: Node) => void;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ 
  levels, 
  highlightedIds = new Set(), 
  brokenIds = new Set(),
  tamperedLeafIndex = null,
  onNodeClick
}) => {
  if (levels.length === 0) return null;

  // Compact layout constants
  const maxNodes = levels[0].length;
  const baseWidth = Math.max(500, maxNodes * 100); 
  const verticalSpacing = 80; // Reduced from 100
  const height = (levels.length * verticalSpacing) + 40;

  return (
    <div className="relative w-full overflow-x-auto overflow-y-hidden p-2 sm:p-4 bg-card border border-card-border rounded-[2rem] shadow-sm min-h-[350px] lg:min-h-[450px] flex justify-center custom-scrollbar refinery-grid">
      <div className="min-w-full h-full flex justify-center items-center">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${baseWidth} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="overflow-visible relative z-10 max-w-3xl"
        >
          {/* 1. CIRCUIT WIRES (Connections) */}
          {levels.map((level, lIndex) => {
            if (lIndex === levels.length - 1) return null;
            return level.map((node, nIndex) => {
              if (!node.parentId) return null;
              const parentLevel = levels[lIndex + 1];
              const parentIndex = Math.floor(nIndex / 2);
              
              const x1 = (nIndex + 0.5) * (baseWidth / level.length);
              const y1 = height - (lIndex + 1) * verticalSpacing;
              const x2 = (parentIndex + 0.5) * (baseWidth / parentLevel.length);
              const y2 = height - (lIndex + 2) * verticalSpacing;

              const isPathActive = highlightedIds.has(node.id) && highlightedIds.has(parentLevel[parentIndex].id);
              const isBroken = brokenIds.has(node.id) && brokenIds.has(parentLevel[parentIndex].id);
              const isCorrupted = node.isLeaf && tamperedLeafIndex === nIndex;

              return (
                <g key={`wire-${node.id}`}>
                  <path
                    d={`M ${x1} ${y1} L ${x2} ${y2}`}
                    fill="none"
                    className="stroke-muted/20"
                    strokeWidth="1"
                  />
                  
                  <motion.path
                    d={`M ${x1} ${y1} L ${x2} ${y2}`}
                    fill="none"
                    stroke={isCorrupted || isBroken ? "#ef4444" : isPathActive ? "var(--accent)" : "transparent"}
                    strokeWidth={isPathActive || isBroken ? 2 : 1}
                    strokeDasharray="8, 12"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </g>
              );
            });
          })}

          {/* 2. NODES */}
          {levels.map((level, lIndex) => (
            level.map((node, nIndex) => {
              const x = (nIndex + 0.5) * (baseWidth / level.length);
              const y = height - (lIndex + 1) * verticalSpacing;
              const isHighlighted = highlightedIds.has(node.id);
              const isBroken = brokenIds.has(node.id);
              const isTampered = node.isLeaf && tamperedLeafIndex === nIndex;
              const isRoot = lIndex === levels.length - 1;

              return (
                <motion.g 
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => onNodeClick?.(node)}
                  className="cursor-pointer group"
                >
                  <motion.rect
                    x={x - 40} y={y - 18} width={80} height={36} rx={8}
                    animate={{ 
                      stroke: isTampered || isBroken ? '#ef4444' : isHighlighted ? 'var(--accent)' : 'var(--card-border)',
                      fill: isBroken ? '#ef4444' : isHighlighted ? 'var(--accent)' : 'var(--card)',
                      strokeWidth: isHighlighted || isTampered || isBroken ? 2 : 1
                    }}
                    className="transition-colors duration-300 shadow-sm"
                  />

                  <foreignObject x={x - 34} y={y - 12} width={16} height={16} className="pointer-events-none">
                    <div className="flex items-center justify-center h-full w-full">
                      {isRoot ? <ShieldCheck className={clsx("w-3 h-3", isHighlighted || isBroken ? "text-white" : "text-accent")} /> :
                       lIndex === 0 ? <Database className={clsx("w-2.5 h-2.5", isHighlighted || isBroken ? "text-white" : "text-muted")} /> :
                       <Cpu className={clsx("w-2.5 h-2.5", isHighlighted || isBroken ? "text-white" : "text-muted/40")} />}
                    </div>
                  </foreignObject>

                  <text 
                    x={x + 10} y={y - 2}
                    textAnchor="middle"
                    className={clsx(
                      "text-[9px] font-mono font-bold tracking-tighter pointer-events-none",
                      isHighlighted || isBroken ? "fill-white" : "fill-foreground"
                    )}
                  >
                    {node.hash.substring(0, 6)}
                  </text>

                  <text 
                    x={x + 10} y={y + 10} 
                    textAnchor="middle"
                    className={clsx("text-[6px] font-black uppercase tracking-[0.2em] pointer-events-none", isHighlighted || isBroken ? "fill-white/80" : "fill-muted")}
                  >
                    {isRoot ? 'SUMMIT' : node.isLeaf ? `BLOCK ${nIndex}` : `L${lIndex}`}
                  </text>

                  {(isTampered || isBroken) && (
                     <circle cx={x - 36} cy={y + 10} r={2} className="fill-red-200 animate-ping" />
                  )}
                </motion.g>
              );
            })
          ))}
        </svg>
      </div>
    </div>
  );
};

export default TreeVisualizer;