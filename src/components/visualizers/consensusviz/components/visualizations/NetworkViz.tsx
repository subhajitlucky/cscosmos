import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Node, NetworkMessage } from '../../simulation/types';

interface NetworkVizProps {
  nodes: Node[];
  messages: NetworkMessage[];
}

const NetworkViz: React.FC<NetworkVizProps> = ({ nodes, messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    let observer: ResizeObserver;
    const rafHandle = requestAnimationFrame(() => {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });
      observer.observe(container);
    });

    return () => {
      cancelAnimationFrame(rafHandle);
      if (observer) observer.disconnect();
    };
  }, []);

  const getPos = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
    return {
      x: dimensions.width / 2 + radius * Math.cos(angle),
      y: dimensions.height / 2 + radius * Math.sin(angle),
    };
  };

  const nodePositions = nodes.reduce((acc, node, i) => {
    acc[node.id] = getPos(i, nodes.length);
    return acc;
  }, {} as Record<string, { x: number; y: number }>);

  return (
    <div ref={containerRef} className="relative w-full h-[300px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
      <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-10 h-full w-full">
              {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-blue-500/20" />
              ))}
          </div>
      </div>

      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        {/* Connections */}
        {nodes.map(node => 
          node.peers.map(peerId => {
            const start = nodePositions[node.id];
            const end = nodePositions[peerId];
            if (!start || !end) return null;
            return (
              <line
                key={`${node.id}-${peerId}`}
                x1={start.x} y1={start.y}
                x2={end.x} y2={end.y}
                stroke="#1e293b"
                strokeWidth="1"
              />
            );
          })
        )}

        {/* Moving Messages */}
        <AnimatePresence>
          {messages.map((msg) => {
            const start = nodePositions[msg.senderId];
            const end = nodePositions[msg.receiverId];
            if (!start || !end) return null;
            
            const x = start.x + (end.x - start.x) * msg.progress;
            const y = start.y + (end.y - start.y) * msg.progress;

            return (
              <motion.circle
                key={msg.id}
                initial={{ r: 0 }}
                animate={{ r: 4 }}
                exit={{ r: 0 }}
                cx={x} cy={y}
                fill="#3b82f6"
                className="shadow-lg shadow-blue-500"
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return null;
        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none"
            style={{ left: pos.x, top: pos.y }}
          >
            <motion.div
              initial={{ scale: 1, borderColor: '#3b82f6' }}
              animate={{ 
                scale: node.isMining ? [1, 1.1, 1] : 1,
                borderColor: node.isMining ? '#f59e0b' : '#3b82f6'
              }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-10 h-10 rounded-full bg-slate-800 border-2 flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
            >
              {node.id.substring(0, 2)}
            </motion.div>
            <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">{node.id}</span>
          </div>
        );
      })}
    </div>
  );
};

export default NetworkViz;