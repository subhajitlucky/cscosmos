'use client';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FiberNode {
  id: string;
  name: string;
  type: 'component' | 'dom';
  status: 'idle' | 'updating' | 'rendered';
  children?: FiberNode[];
}

const FiberNodeComponent = ({ node }: { node: FiberNode }) => {
  const isUpdating = node.status === 'updating';
  
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={isUpdating ? { 
          backgroundColor: ['var(--card)', 'rgba(0,216,255,0.05)', 'var(--card)'],
          borderColor: ['var(--border)', '#00d8ff', 'var(--border)'],
          boxShadow: ['0 0 0px rgba(0,0,0,0)', '0 0 20px rgba(0,216,255,0.1)', '0 0 0px rgba(0,0,0,0)']
        } : {}}
        transition={{ repeat: isUpdating ? Infinity : 0, duration: 2 }}
        className={cn(
          "px-4 py-2 rounded-lg border text-[11px] font-mono transition-premium min-w-[90px] text-center shadow-sm",
          node.type === 'component' 
            ? "bg-card border-border font-bold text-foreground" 
            : "bg-muted/50 border-border text-muted-foreground"
        )}
      >
        {node.name}
      </motion.div>
      
      {node.children && (
        <div className="flex gap-12 mt-10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-10 bg-border -mt-10 opacity-30" />
          {node.children.map((child) => (
            <FiberNodeComponent key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const FiberVisualizer = ({ tree }: { tree: FiberNode }) => {
  return (
    <div className="p-10 bg-card border border-border rounded-xl h-full overflow-auto flex flex-col items-center shadow-sm transition-premium">
      <div className="w-full flex items-center gap-2 mb-16 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em]">
        <Layers className="w-3.5 h-3.5 text-react" />
        Fiber Reconciliation Topology
      </div>
      <div className="mt-4 pb-12">
        <FiberNodeComponent node={tree} />
      </div>
    </div>
  );
};

export default FiberVisualizer;
