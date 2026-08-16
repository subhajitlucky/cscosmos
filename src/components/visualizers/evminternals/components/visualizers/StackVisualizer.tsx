import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowDown } from 'lucide-react';

interface StackVisualizerProps {
  stack: string[];
}

const StackVisualizer: React.FC<StackVisualizerProps> = ({ stack }) => {
  const reversedStack = [...stack].reverse();

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Stack</h3>
          <span className="text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono">
            LIFO
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 dark:text-neutral-600">
          <Layers size={14} />
          {stack.length} / 1024
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 flex flex-col justify-start min-h-0 scrollbar-hide pt-2">
        <AnimatePresence initial={false}>
          {reversedStack.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-400 dark:text-neutral-600 text-center">
              <div className="text-sm italic mb-1">Stack is empty</div>
              <p className="text-[10px] max-w-[150px]">Most opcodes pop their arguments from here.</p>
            </div>
          ) : (
            reversedStack.map((word, index) => {
              const actualIndex = reversedStack.length - 1 - index;
              return (
                <motion.div
                  key={`${actualIndex}-${word}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 50 }}
                  className="group relative"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-[10px] font-mono font-bold ${index === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400 dark:text-neutral-600'} text-right`}>
                      {actualIndex}
                    </span>
                    <div className={`
                      flex-1 font-mono text-xs p-3 rounded-xl border transition-all truncate relative
                      ${index === 0 
                        ? 'bg-blue-500/10 border-blue-500/30 dark:border-blue-500/50 text-blue-600 dark:text-blue-400 shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)]' 
                        : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-400 group-hover:border-neutral-300 dark:group-hover:border-neutral-600 shadow-sm'
                      }
                    `}>
                      {word}
                      {index === 0 && (
                        <div className="absolute top-0 right-0 p-1">
                          <ArrowDown size={10} className="animate-bounce" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      
      {stack.length > 0 && (
         <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800/50 text-center">
           <div className="text-[9px] text-neutral-400 dark:text-neutral-600 uppercase font-black tracking-widest">
             Top of Stack
           </div>
         </div>
      )}
    </div>
  );
};

export default StackVisualizer;
