import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

export const BinaryStructureVisualizer = () => {
  const [depth, setDepth] = useState(3);
  const [hoveredNode, setHoveredNode] = useState<{level: number, index: number} | null>(null);

  const isPathActive = (level: number, index: number) => {
    if (!hoveredNode) return false;
    if (level > hoveredNode.level) return false;
    const shift = hoveredNode.level - level;
    return (hoveredNode.index >> shift) === index;
  };

  return (
    <div className="flex flex-col items-center w-full h-full max-w-2xl mx-auto py-4">
      {/* Controls Header - Compact & Premium */}
      <div className="flex items-center justify-between w-full max-w-xs bg-secondary/40 backdrop-blur-sm p-2 px-4 rounded-2xl border border-muted/20 z-30 mb-8 shadow-sm">
        <button 
          onClick={() => setDepth(Math.max(1, depth - 1))}
          disabled={depth <= 1}
          className="p-2 rounded-xl bg-background border border-muted/20 hover:border-primary hover:text-primary transition-all disabled:opacity-20 active:scale-95"
          aria-label="Decrease depth"
        >
          <Minus className="w-3 h-3" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Tree Depth</span>
          <span className="text-lg font-black text-primary leading-none">{depth}</span>
        </div>
        <button 
          onClick={() => setDepth(Math.min(4, depth + 1))}
          disabled={depth >= 4}
          className="p-2 rounded-xl bg-background border border-muted/20 hover:border-primary hover:text-primary transition-all disabled:opacity-20 active:scale-95"
          aria-label="Increase depth"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Main Visualization Area */}
      <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible">
        <svg className="w-full h-full max-h-[400px] overflow-visible" viewBox="0 0 400 300">
          
          {/* 1. Connections */}
          {Array.from({ length: depth - 1 }).map((_, level) => (
            Array.from({ length: Math.pow(2, level) }).map((__, i) => {
              const y1 = (level / (depth - 1 || 1)) * 220 + 40;
              const x1 = ((i + 0.5) / Math.pow(2, level)) * 400;
              
              const y2 = ((level + 1) / (depth - 1 || 1)) * 220 + 40;
              const xLeft = ((i * 2 + 0.5) / Math.pow(2, level + 1)) * 400;
              const xRight = ((i * 2 + 1 + 0.5) / Math.pow(2, level + 1)) * 400;

              const isLeftActive = isPathActive(level, i) && isPathActive(level + 1, i * 2);
              const isRightActive = isPathActive(level, i) && isPathActive(level + 1, i * 2 + 1);

              return (
                <g key={`lines-${level}-${i}`}>
                  {/* Left Connection */}
                  <motion.path 
                    d={`M ${x1} ${y1} C ${x1} ${y1 + (y2-y1)/2}, ${xLeft} ${y2 - (y2-y1)/2}, ${xLeft} ${y2}`}
                    fill="none"
                    stroke={isLeftActive ? "var(--primary)" : "currentColor"}
                    strokeWidth={isLeftActive ? "3" : "1.5"}
                    strokeOpacity={isLeftActive ? 1 : 0.15}
                    className="transition-all duration-300"
                  />
                  {/* Right Connection */}
                  <motion.path 
                    d={`M ${x1} ${y1} C ${x1} ${y1 + (y2-y1)/2}, ${xRight} ${y2 - (y2-y1)/2}, ${xRight} ${y2}`}
                    fill="none"
                    stroke={isRightActive ? "var(--primary)" : "currentColor"}
                    strokeWidth={isRightActive ? "3" : "1.5"}
                    strokeOpacity={isRightActive ? 1 : 0.15}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })
          ))}

          {/* 2. Nodes */}
          {Array.from({ length: depth }).map((_, level) => (
            Array.from({ length: Math.pow(2, level) }).map((__, i) => {
              const cx = ((i + 0.5) / Math.pow(2, level)) * 400;
              const cy = (level / (depth - 1 || 1)) * 220 + 40;
              const isActive = isPathActive(level, i);
              const r = level === 0 ? 12 : level === 1 ? 10 : level === 2 ? 8 : 7;

              return (
                <g 
                  key={`node-group-${level}-${i}`}
                  onMouseEnter={() => setHoveredNode({ level, index: i })}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer"
                >
                  {/* Larger hit area for better UX */}
                  <circle cx={cx} cy={cy} r={r + 5} fill="transparent" />
                  
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="var(--background)"
                    stroke={isActive ? "var(--primary)" : "currentColor"}
                    strokeWidth={isActive ? "3" : "1.5"}
                    strokeOpacity={isActive ? 1 : 0.3}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    className="transition-colors duration-300"
                  />
                  {isActive && (
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={r * 0.5}
                      fill="var(--primary)"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                      pointerEvents="none"
                    />
                  )}
                </g>
              );
            })
          ))}
        </svg>
      </div>

      {/* Stats Footer - Refined */}
      <div className="flex justify-center gap-8 w-full mt-8">
        {[
          { label: 'Nodes', value: Math.pow(2, depth) - 1 },
          { label: 'Leaves', value: Math.pow(2, depth - 1) },
          { label: 'Log(N)', value: (depth - 1).toFixed(0) }
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</span>
            <span className="text-sm font-black text-primary font-mono">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
