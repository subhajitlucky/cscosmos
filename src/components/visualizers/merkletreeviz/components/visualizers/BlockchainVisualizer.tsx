import { useState } from 'react';
import { AlertTriangle, ShieldCheck, XCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BlockchainVisualizer = () => {
  const [hacked, setHacked] = useState(false);

  return (
    <div className="flex flex-col items-center w-full h-full py-6 space-y-8">
      <div className="flex flex-col items-center space-y-4 text-center max-w-lg">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          {hacked ? <span className="text-red-500 flex items-center gap-2"><AlertTriangle className="w-6 h-6"/> CHAIN BROKEN</span> : <span className="text-green-500 flex items-center gap-2"><ShieldCheck className="w-6 h-6"/> CHAIN SECURE</span>}
        </h3>
        <p className="text-sm text-muted-foreground">
          Blockchains link blocks together using hashes. The <strong className="text-primary">Merkle Root</strong> summarizes all transactions. 
          If you change one transaction, the Root changes, breaking the link to the next block.
        </p>
        
        <button
          onClick={() => setHacked(!hacked)}
          className={`px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg transition-all transform hover:scale-105 ${
            hacked 
              ? "bg-green-500 text-white shadow-green-500/20" 
              : "bg-red-500 text-white shadow-red-500/20"
          }`}
        >
          {hacked ? "Repair Ledger" : "Attempt Hack"}
        </button>
      </div>

      <div className="w-full max-w-4xl overflow-x-auto pb-8">
        <div className="relative min-w-max flex items-center justify-center gap-4 md:gap-8 px-4 mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-2 bg-muted/10 -z-10" />

        <div className="relative group">
          <motion.div 
            animate={{ 
              borderColor: hacked ? "#ef4444" : "#e2e8f0", 
              boxShadow: hacked ? "0 0 30px rgba(239, 68, 68, 0.2)" : "none"
            }}
            className="w-48 bg-card border-2 rounded-2xl p-4 flex flex-col gap-3 shadow-xl z-10"
          >
            <div className="flex justify-between items-center border-b border-muted/20 pb-2">
              <span className="text-[10px] font-black text-muted uppercase">Block #100</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            
            <div className="bg-secondary/50 p-2 rounded-lg text-center">
              <div className="text-[8px] font-bold text-muted uppercase mb-1">Merkle Root</div>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={hacked ? "bad-root" : "good-root"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-mono text-[10px] font-bold ${hacked ? "text-red-500" : "text-primary"}`}
                >
                  {hacked ? "0xDEAD...BEEF" : "0x7A91...3F2C"}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] p-1.5 rounded bg-muted/10">
                <span className="text-muted-foreground">Tx_1: Alice → Bob</span>
              </div>
              <motion.div 
                animate={{ backgroundColor: hacked ? "rgba(239, 68, 68, 0.1)" : "rgba(100, 116, 139, 0.1)" }}
                className="flex items-center justify-between text-[10px] p-1.5 rounded border border-transparent"
              >
                <span className={hacked ? "text-red-500 font-bold" : "text-muted-foreground"}>
                  {hacked ? "Tx_2: Alice → EVE" : "Tx_2: Alice → Charlie"}
                </span>
                {hacked && <AlertTriangle className="w-3 h-3 text-red-500" />}
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center w-12">
           <motion.div 
             animate={{ 
               backgroundColor: hacked ? "#ef4444" : "#22c55e",
               rotate: hacked ? 45 : 0,
               y: hacked ? 10 : 0
             }}
             className="w-8 h-2 rounded-full"
           />
           {hacked && (
             <motion.div 
               initial={{ scale: 0 }} animate={{ scale: 1 }}
               className="absolute -top-6 text-[8px] font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full whitespace-nowrap"
             >
               LINK BROKEN
             </motion.div>
           )}
        </div>

        <div className="relative opacity-90">
          <motion.div 
            animate={{ 
              opacity: hacked ? 0.5 : 1,
              scale: hacked ? 0.95 : 1
            }}
            className="w-48 bg-card border-2 border-border rounded-2xl p-4 flex flex-col gap-3 shadow-lg"
          >
            <div className="flex justify-between items-center border-b border-muted/20 pb-2">
              <span className="text-[10px] font-black text-muted uppercase">Block #101</span>
              {hacked ? <XCircle className="w-3 h-3 text-red-500" /> : <CheckCircle className="w-3 h-3 text-green-500" />}
            </div>

            <div className="p-2 rounded-lg border border-dashed border-muted relative overflow-hidden text-center">
               <div className="text-[8px] font-bold text-muted uppercase mb-1">Previous Hash</div>
               <div className={`font-mono text-[10px] font-bold ${hacked ? "text-red-500 line-through" : "text-green-600"}`}>
                 0x7A91...3F2C
               </div>
               {hacked && (
                 <div className="text-[8px] font-bold text-red-500 mt-1">
                   MISMATCH!
                 </div>
               )}
            </div>

            <div className="bg-secondary/50 p-2 rounded-lg text-center opacity-50">
              <div className="text-[8px] font-bold text-muted uppercase text-[8px]">Merkle Root</div>
              <div className="font-mono text-[10px] text-muted-foreground">0xB2C1...9A8D</div>
            </div>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center w-12 opacity-50">
           <div className={`w-8 h-2 rounded-full ${hacked ? "bg-muted" : "bg-green-500"}`} />
        </div>

        <div className="relative opacity-60">
          <motion.div 
            animate={{ 
              opacity: hacked ? 0.3 : 1,
              scale: hacked ? 0.9 : 1
            }}
            className="w-48 bg-card border-2 border-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm"
          >
            <div className="flex justify-between items-center border-b border-muted/20 pb-2">
              <span className="text-[10px] font-black text-muted uppercase">Block #102</span>
              {hacked && <XCircle className="w-3 h-3 text-red-500" />}
            </div>
            <div className="p-2 rounded-lg border border-dashed border-muted text-center">
               <div className="text-[8px] font-bold text-muted uppercase">Previous Hash</div>
               <div className="font-mono text-[10px] text-muted-foreground">0xB2C1...9A8D</div>
            </div>
            <div className="bg-secondary/50 p-2 rounded-lg text-center">
              <div className="text-[8px] font-bold text-muted uppercase text-[8px]">Merkle Root</div>
              <div className="font-mono text-[10px] text-muted-foreground">0xE5F4...1C2B</div>
            </div>
          </motion.div>
        </div>

        </div>
      </div>
    </div>
  );
};
