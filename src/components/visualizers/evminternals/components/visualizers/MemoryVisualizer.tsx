import React from 'react';
import { motion } from 'framer-motion';

interface MemoryVisualizerProps {
  memory: Uint8Array;
}

const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({ memory }) => {
  // Group memory into 32-byte chunks (EVM words)
  const chunks = [];
  for (let i = 0; i < memory.length; i += 32) {
    chunks.push(memory.slice(i, i + 32));
  }

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Memory</h3>
          <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-400 font-mono">
            {memory.length} bytes
          </span>
        </div>
        <div className="flex gap-4 text-[10px] text-neutral-400 dark:text-neutral-600 font-mono">
          <span>00-07</span>
          <span>08-15</span>
          <span>16-23</span>
          <span>24-31</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 font-mono text-xs scrollbar-hide">
        {chunks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-400 dark:text-neutral-600">
            <div className="text-sm italic mb-2">Memory is uninitialized</div>
            <div className="text-[10px] max-w-[200px] text-center leading-relaxed">
              Memory is byte-addressable and volatile. It expands as you write to new offsets.
            </div>
          </div>
        ) : (
          chunks.map((chunk, chunkIdx) => (
            <motion.div 
              key={chunkIdx} 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-600 font-bold">
                  WORD {chunkIdx} (Offset: 0x{(chunkIdx * 32).toString(16).padStart(2, '0')})
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  32 bytes
                </span>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {Array.from(chunk).map((byte, i) => (
                  <div 
                    key={i}
                    className={`
                      relative group/byte
                      p-1.5 rounded text-center transition-all duration-300 border
                      ${byte === 0 
                        ? 'text-neutral-300 dark:text-neutral-800 bg-white dark:bg-neutral-950/50 border-transparent dark:border-neutral-800/50' 
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 dark:border-red-500/30 font-bold'
                      }
                    `}
                  >
                    {byte.toString(16).padStart(2, '0')}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 dark:bg-black text-[8px] text-white rounded opacity-0 group-hover/byte:opacity-100 pointer-events-none whitespace-nowrap z-10 border border-neutral-700">
                      Offset: 0x{(chunkIdx * 32 + i).toString(16)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoryVisualizer;
