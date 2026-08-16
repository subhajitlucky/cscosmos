import { useState } from 'react';
import { Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const EfficiencyVisualizer = () => {
  const [sliderValue, setSliderValue] = useState(17); 
  const maxItems = 1000000;
  
  const items = Math.max(1, Math.round(Math.pow(10, (sliderValue / 100) * 6)));
  const logValue = Math.ceil(Math.log2(items));
  const maxLog = Math.ceil(Math.log2(maxItems));
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col items-center w-full h-full max-w-xl py-6 space-y-10">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">The Power of Logarithms</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          See how Merkle Trees save bandwidth. Compare downloading the 
          <span className="text-red-500 font-bold"> entire history </span> 
          vs just the 
          <span className="text-green-500 font-bold"> tiny proof </span> 
          needed to verify one transaction.
        </p>
      </div>

      <div className="w-full bg-secondary/30 backdrop-blur-sm p-8 rounded-[2rem] border border-muted/20 shadow-xl space-y-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="flex justify-between items-end relative z-10">
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 ml-1">Total Transactions</div>
            <div className="text-4xl font-black text-foreground font-mono tracking-tight flex items-baseline">
              {items.toLocaleString()}
              <span className="text-sm text-muted-foreground ml-2 font-normal">items</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 mr-1">Hashes Needed</div>
            <div className="text-4xl font-black text-green-500 font-mono tracking-tight flex items-baseline justify-end">
              {logValue}
              <span className="text-sm text-green-500/70 ml-2 font-normal">hashes</span>
            </div>
          </div>
        </div>
        
        <div className="relative w-full h-10 flex items-center select-none touch-none group/slider">
          <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderValue}
              onChange={handleSliderChange}
              className="absolute w-full h-full opacity-0 cursor-pointer z-20 focus:outline-none peer"
              aria-label="Adjust total transactions to see efficiency gains"
          />

          <div className="absolute w-full h-4 bg-muted/20 rounded-full overflow-hidden shadow-inner border border-muted/10 peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20 transition-all">
             <div 
                className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-100 ease-out" 
                style={{ width: `${sliderValue}%` }}
             />
          </div>

          <div 
              className="absolute h-8 w-8 bg-background border-[3px] border-primary rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)] transform -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none transition-transform duration-100 ease-out group-hover/slider:scale-110 peer-focus-visible:scale-125 peer-focus-visible:border-accent"
              style={{ left: `${sliderValue}%` }}
          >
              <div className="w-2 h-2 bg-primary rounded-full" />
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground/70 px-1">
          <span>1 Transaction</span>
          <span>1 Million Transactions</span>
        </div>
      </div>

      <div className="w-full grid gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-red-500 flex items-center">
              <Database className="w-4 h-4 mr-2" /> Without Merkle Tree
            </span>
            <span className="text-xs font-mono font-bold text-muted-foreground">Download {items.toLocaleString()} items</span>
          </div>
          <div className="h-14 w-full bg-muted/10 rounded-xl overflow-hidden relative border border-muted/20">
            <motion.div 
              className="h-full bg-gradient-to-r from-red-500/80 to-red-600"
              initial={{ width: 0 }}
              animate={{ width: `${(items / maxItems) * 100}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-70">
               <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mix-blend-overlay">
                 Linear Growth O(n)
               </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-green-500 flex items-center">
              <Zap className="w-4 h-4 mr-2" /> With Merkle Proof
            </span>
            <span className="text-xs font-mono font-bold text-muted-foreground">Download {logValue} hashes</span>
          </div>
          <div className="h-14 w-full bg-muted/10 rounded-xl overflow-hidden relative border border-muted/20">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-500/80 to-green-600"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, (logValue / maxLog) * 100)}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
            <div className="absolute inset-0 flex items-center justify-start pl-4 opacity-70">
               <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mix-blend-overlay">
                 Logarithmic Scale (O(log n))
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
