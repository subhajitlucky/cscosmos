import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Hash, ArrowRight, Fingerprint, ShieldCheck, Zap } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

export const LeafConstruction = () => {
  const [step, setStep] = useState(0);
  const { playClick, playHash, playSuccess } = useSound();

  const rawData = {
    id: "tx_8842",
    from: "Alice",
    to: "Bob",
    amount: "1.25 BTC",
    timestamp: "2026-01-17 14:30:05"
  };

  const leafHash = "0x7f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a";

  useEffect(() => {
    if (step === 1) {
      playHash();
    } else if (step === 3) {
      playSuccess();
    }
  }, [step, playHash, playSuccess]);

  const next = () => {
    playClick();
    setStep((s) => (s + 1) % 4);
  };
  const reset = () => {
    playClick();
    setStep(0);
  };

  return (
    <div className="flex flex-col items-center w-full h-full max-w-2xl py-4 space-y-4 sm:space-y-8">
      {/* 1. Header - Interactive Progress */}
      <div className="flex items-center justify-between w-full px-4 sm:px-8 py-3 sm:py-4 bg-secondary/30 backdrop-blur-xl rounded-[2rem] border border-muted/20 shadow-xl">
        <div className="flex flex-col">
          <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-1">Leaf Node Lifecycle</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={step === 3 ? { rotate: 360 } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-primary"
            >
              {step === 0 && <Database className="w-4 h-4 sm:w-5 sm:h-5" />}
              {step === 1 && <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />}
              {step === 2 && <Fingerprint className="w-4 h-4 sm:w-5 sm:h-5" />}
              {step === 3 && <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            </motion.div>
            <span className="text-sm sm:text-lg font-black tracking-tight">
              {step === 0 && "Raw Data Block"}
              {step === 1 && "Cryptographic Hashing"}
              {step === 2 && "The Merkle Leaf"}
              {step === 3 && "Integrity Verified"}
            </span>
          </div>
        </div>

        <button 
          onClick={step === 3 ? reset : next}
          className="px-4 sm:px-8 py-2 sm:py-3 bg-primary text-primary-foreground text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          {step === 3 ? "Reset" : "Next"}
        </button>
      </div>

      {/* 2. Main Visualization Workspace */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center bg-secondary/5 rounded-[2rem] sm:rounded-[3rem] border border-muted/10 shadow-inner overflow-hidden p-4 sm:p-8">
        
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] border border-dashed border-primary/20 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] border border-primary/10 rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          {/* Stage 0: The "Full Node" - Raw Transaction Data */}
          {step === 0 && (
            <motion.div
              key="stage-0"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              className="w-full max-w-[280px] sm:max-w-sm bg-card border-2 border-primary/20 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Database className="w-16 h-16 sm:w-24 sm:h-24" />
              </div>
              <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-muted/20 pb-2 sm:pb-4">
                <span className="text-[10px] sm:text-xs font-black text-muted uppercase tracking-widest">Full Data Node</span>
                <span className="text-[9px] sm:text-[10px] font-mono bg-primary/10 text-primary px-2 py-1 rounded">ID: {rawData.id}</span>
              </div>
              <div className="space-y-2 sm:space-y-4 font-mono">
                {Object.entries(rawData).filter(([k]) => k !== 'id').map(([key, val]) => (
                  <div key={key} className="flex justify-between items-baseline gap-2 sm:gap-4">
                    <span className="text-[8px] sm:text-[10px] text-muted uppercase">{key}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-foreground break-all text-right">{val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 sm:mt-6 pt-2 sm:pt-4 border-t border-muted/10 flex justify-center text-[9px] sm:text-[10px] text-muted-foreground italic">
                Total size: 256 bytes
              </div>
            </motion.div>
          )}

          {/* Stage 1: The Transformation - Hashing Animation */}
          {step === 1 && (
            <motion.div
              key="stage-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-8 sm:space-y-12 w-full"
            >
              <div className="flex items-center gap-4 sm:gap-8">
                {/* Collapsing Data */}
                <motion.div 
                  animate={{ 
                    scale: [1, 0.8, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 sm:w-24 sm:h-24 bg-card border-2 border-primary/20 rounded-2xl flex items-center justify-center shadow-xl opacity-50"
                >
                  <Database className="w-6 h-6 sm:w-10 sm:h-10 text-primary" />
                </motion.div>

                <div className="relative">
                  <motion.div
                    animate={{ x: [0, 20, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12 text-primary/40" />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-accent animate-pulse" />
                  </div>
                </div>

                {/* Emerging Hash */}
                <motion.div 
                  animate={{ 
                    scale: [0.8, 1, 0.8],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 sm:w-24 sm:h-24 bg-primary/10 border-2 border-primary rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.2)]"
                >
                  <Hash className="w-6 h-6 sm:w-10 sm:h-10 text-primary" />
                </motion.div>
              </div>

              <div className="w-full max-w-[280px] sm:max-w-md bg-secondary/30 p-3 sm:p-4 rounded-2xl border border-muted/20 relative">
                <div className="text-[8px] sm:text-[10px] font-bold text-muted uppercase mb-2 tracking-[0.2em] text-center">Hashing Engine (SHA-256)</div>
                <div className="h-1.5 sm:h-2 w-full bg-muted/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
                  />
                </div>
                <div className="mt-2 sm:mt-3 font-mono text-[8px] text-primary/60 break-all text-center">
                  Calculating cryptographic digest...
                </div>
              </div>
            </motion.div>
          )}

          {/* Stage 2: The Leaf Node - Cryptographic Commitment */}
          {step === 2 && (
            <motion.div
              key="stage-2"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-6 sm:space-y-8"
            >
              <div className="relative group">
                <motion.div 
                  animate={{ 
                    boxShadow: ["0 0 20px rgba(var(--primary),0.1)", "0 0 40px rgba(var(--primary),0.3)", "0 0 20px rgba(var(--primary),0.1)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 sm:w-32 sm:h-32 bg-primary text-primary-foreground rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl relative z-10"
                >
                  <Fingerprint className="w-10 h-10 sm:w-16 sm:h-16" />
                </motion.div>
                {/* Decorative Aura */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 group-hover:bg-primary/30 transition-colors" />
              </div>

              <div className="text-center space-y-2 sm:space-y-4 max-w-[280px] sm:max-w-sm">
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-primary">The Leaf Hash</h4>
                <div className="p-2 sm:p-4 bg-background/80 backdrop-blur-sm border border-muted/20 rounded-xl sm:rounded-2xl font-mono text-[8px] sm:text-[10px] break-all leading-relaxed shadow-sm">
                  {leafHash}
                </div>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground italic leading-relaxed">
                  This 64-character string is the <span className="text-foreground font-bold">cryptographic commitment</span> to the entire data block above.
                </p>
              </div>
            </motion.div>
          )}

          {/* Stage 3: Verification & Tree Position */}
          {step === 3 && (
            <motion.div
              key="stage-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center space-y-6 sm:space-y-10 w-full"
            >
              <div className="relative w-full max-w-md h-32 sm:h-40">
                {/* Simplified Tree Context */}
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <g opacity="0.2" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M 200 20 L 100 80" />
                    <path d="M 200 20 L 300 80" />
                    <path d="M 100 80 L 50 140" />
                    <path d="M 100 80 L 150 140" />
                    <path d="M 300 80 L 250 140" />
                    <path d="M 300 80 L 350 140" />
                  </g>
                  {/* Highlighted Leaf Position */}
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.5 }}
                  >
                    <rect x="130" y="125" width="40" height="30" rx="8" className="fill-primary stroke-primary" />
                    <Hash className="text-primary-foreground w-4 h-4" x="142" y="132" />
                    <motion.rect 
                      x="125" y="120" width="50" height="40" rx="10" 
                      className="fill-none stroke-primary" 
                      strokeWidth="2"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.g>
                  <text x="150" y="180" textAnchor="middle" className="text-[10px] font-black fill-primary uppercase tracking-widest">Leaf Node 2</text>
                </svg>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 p-4 sm:p-6 rounded-[2rem] flex items-center gap-4 sm:gap-6 max-w-[280px] sm:max-w-md shadow-lg">
                <div className="bg-green-500 p-2 sm:p-3 rounded-2xl shadow-lg shadow-green-500/20">
                  <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs font-black text-green-600 uppercase tracking-widest">Immutable commitment</span>
                  <p className="text-[9px] sm:text-[11px] text-muted-foreground leading-relaxed mt-1">
                    The leaf node effectively "locks" the raw data. Even a single changed bit in the transaction would result in a completely different leaf hash.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Education Card */}
      <div className="w-full bg-secondary/30 p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-muted/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        <p className="text-center text-xs sm:text-sm text-foreground/80 font-medium leading-relaxed italic relative z-10">
          {step === 0 && "Every piece of information in a system (like a transaction or file block) starts as a 'Full Data Node'."}
          {step === 1 && "The system passes this bulky data through a one-way blender called a Hash Function."}
          {step === 2 && "The result is a fixed-size 'Fingerprint'. This is the Leaf Node that actually enters the Merkle Tree."}
          {step === 3 && "Leaf nodes sit at the base of the tree, providing the foundation for all cryptographic proofs."}
        </p>
      </div>
    </div>
  );
};