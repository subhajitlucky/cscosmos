import { motion } from 'framer-motion';

export const InternalNodeVisualizer = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        className="mb-8 p-4 bg-primary text-primary-foreground rounded-xl shadow-xl z-10"
      >
        <div className="text-[10px] font-mono font-bold">PARENT HASH</div>
        <div className="text-[8px] opacity-75">Hash(Left + Right)</div>
      </motion.div>

      <div className="relative w-full max-w-xs h-32">
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 320 160" preserveAspectRatio="xMidYMid meet">
          <motion.path 
             d="M 50 120 C 50 60, 160 120, 160 40" 
             fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/30"
             initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
          />
          <motion.path 
             d="M 270 120 C 270 60, 160 120, 160 40" 
             fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/30"
             initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
          />
        </svg>

        <motion.div 
          className="absolute bottom-0 left-0 p-3 bg-secondary border border-muted rounded-lg w-20 md:w-24 text-center text-[10px] font-mono"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        >
          Left Hash
        </motion.div>
        
        <motion.div 
          className="absolute bottom-0 right-0 p-3 bg-secondary border border-muted rounded-lg w-20 md:w-24 text-center text-[10px] font-mono"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
        >
          Right Hash
        </motion.div>
      </div>
    </div>
  );
};
