import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sha256 } from '../../lib/merkle';

export const AvalancheSimulation = () => {
  const [input, setInput] = useState("Merkle");
  const [bits, setBits] = useState<number[]>([]);
  const [diffPercent, setDiffPercent] = useState(0);
  const prevBitsRef = useRef<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      sha256(input).then(h => {
        const hexSubset = h.substring(0, 16);
        const newBits: number[] = [];
        for (let i = 0; i < hexSubset.length; i++) {
          const val = parseInt(hexSubset[i], 16);
          newBits.push((val >> 3) & 1);
          newBits.push((val >> 2) & 1);
          newBits.push((val >> 1) & 1);
          newBits.push((val >> 0) & 1);
        }
        
        const prevBits = prevBitsRef.current;
        if (prevBits.length > 0) {
          let diffs = 0;
          newBits.forEach((b, i) => {
            if (b !== prevBits[i]) diffs++;
          });
          setDiffPercent(Math.round((diffs / newBits.length) * 100));
        }
        
        setBits(newBits); 
        prevBitsRef.current = newBits;
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
      <div className="w-full space-y-3">
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-background border-2 border-primary rounded-xl p-4 font-mono text-center text-lg text-foreground shadow-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            aria-label="Input data to hash"
          />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-md pointer-events-none">
            Edit This Data
          </div>
        </div>
        <p className="text-center text-xs text-muted font-medium">
          See how the hash changes with every keystroke
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-8 gap-1 p-4 bg-card rounded-xl border border-muted/20 shadow-inner">
          {bits.map((bit, i) => {
            const isFlipped = prevBitsRef.current[i] !== undefined && prevBitsRef.current[i] !== bit;
            return (
              <motion.div
                key={`${i}-${bit}-${input}`}
                initial={{ scale: 0.5, opacity: 0.5, backgroundColor: isFlipped ? '#f59e0b' : (bit ? '#3b82f6' : '#e2e8f0') }}
                animate={{ scale: 1, opacity: 1, backgroundColor: bit ? '#3b82f6' : '#e2e8f0' }}
                transition={{ duration: 0.5, delay: i * 0.002 }}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-sm`}
                title={`Bit ${i}: ${bit}`}
              />
            );
          })}
        </div>
        {diffPercent > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={input}
            className="absolute -right-16 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-lg shadow-lg"
          >
            {diffPercent}% FLIP
          </motion.div>
        )}
      </div>

      <div className="text-xs text-center text-muted max-w-[240px]">
        The "Avalanche Effect": <br/>
        <span className="text-primary font-bold">1 input bit change ≈ 50% output flip</span>
      </div>
    </div>
  );
};
