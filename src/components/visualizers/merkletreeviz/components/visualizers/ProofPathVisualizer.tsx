import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldCheck, Hash, Database, Zap } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

export const ProofPathVisualizer = () => {
  const [step, setStep] = useState(0);
  const { playClick, playSuccess, playHover } = useSound();
  
  const coords = {
    root: { x: 200, y: 50 },
    l1: [
      { x: 100, y: 150 }, 
      { x: 300, y: 150 }  
    ],
    l2: [
      { x: 50, y: 250 },  
      { x: 150, y: 250 }, 
      { x: 250, y: 250 }, 
      { x: 350, y: 250 }  
    ]
  };

  const next = () => {
    setStep(s => {
      const nextStep = (s + 1) % 5;
      if (nextStep === 4) {
        playSuccess();
      } else {
        playClick();
      }
      return nextStep;
    });
  };

  const reset = () => {
    playClick();
    setStep(0);
  };

  return (
    <div className="flex flex-col items-center w-full h-full max-w-2xl py-2 space-y-6">
      {/* 1. Header State - Ultra Premium */}
      <div className="flex items-center justify-between w-full px-8 py-4 bg-secondary/30 backdrop-blur-xl rounded-[2rem] border border-muted/20 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
        
        <div className="flex flex-col relative z-10">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-1">Verification Pipeline</span>
          <div className="flex items-center gap-3">
            <div className={step === 4 ? "text-green-500" : "text-primary"}>
              {step === 4 ? <CheckCircle className="w-5 h-5 animate-bounce" /> : <Zap className="w-5 h-5 animate-pulse" />}
            </div>
            <span className={`text-lg font-black tracking-tight transition-colors ${step === 4 ? "text-green-500" : "text-foreground"}`}>
              {step === 0 && "Select Target Leaf"}
              {step === 1 && "Data Hashed"}
              {step === 2 && "Sibling #1 Coupled"}
              {step === 3 && "Sibling #2 Coupled"}
              {step === 4 && "Root Verified"}
            </span>
          </div>
        </div>

        <button 
          onClick={step === 4 ? reset : next}
          onMouseEnter={playHover}
          className="relative z-10 px-8 py-3 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all group/btn"
        >
          <span className="relative z-10">{step === 4 ? "Restart" : step === 0 ? "Begin" : "Next Step"}</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity rounded-2xl" />
        </button>
      </div>

      {/* 2. Unified SVG Simulation */}
      <div className="relative w-full flex-grow aspect-[4/3] bg-secondary/5 rounded-[3rem] border border-muted/10 shadow-inner overflow-visible p-4">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 300">
          <defs>
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="siblingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          
          {/* --- Connections (Paths) --- */}
          <g opacity="0.1" stroke="currentColor" strokeWidth="1.5" fill="none">
            <path d={`M ${coords.l1[0].x} ${coords.l1[0].y} L ${coords.root.x} ${coords.root.y}`} />
            <path d={`M ${coords.l1[1].x} ${coords.l1[1].y} L ${coords.root.x} ${coords.root.y}`} />
            <path d={`M ${coords.l2[0].x} ${coords.l2[0].y} L ${coords.l1[0].x} ${coords.l1[0].y}`} />
            <path d={`M ${coords.l2[1].x} ${coords.l2[1].y} L ${coords.l1[0].x} ${coords.l1[0].y}`} />
            <path d={`M ${coords.l2[2].x} ${coords.l2[2].y} L ${coords.l1[1].x} ${coords.l1[1].y}`} />
            <path d={`M ${coords.l2[3].x} ${coords.l2[3].y} L ${coords.l1[1].x} ${coords.l1[1].y}`} />
          </g>

          <motion.path 
            d={`M ${coords.l2[2].x} ${coords.l2[2].y} L ${coords.l1[1].x} ${coords.l1[1].y}`}
            stroke="var(--primary)" strokeWidth="3" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: step >= 1 ? 1 : 0, 
              stroke: step >= 4 ? "var(--success)" : "var(--primary)",
              opacity: step >= 1 ? 1 : 0 
            }}
          />
          <motion.path 
            d={`M ${coords.l1[1].x} ${coords.l1[1].y} L ${coords.root.x} ${coords.root.y}`}
            stroke="var(--primary)" strokeWidth="3" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: step >= 3 ? 1 : 0, 
              stroke: step >= 4 ? "var(--success)" : "var(--primary)",
              opacity: step >= 3 ? 1 : 0 
            }}
          />

          {/* --- Nodes --- */}
          
          <motion.g 
            animate={{ scale: step === 4 ? 1.2 : 1, y: step === 4 ? -5 : 0 }}
            style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
          >
            <circle cx={coords.root.x} cy={coords.root.y} r="24" className="fill-background stroke-muted/20" strokeWidth="2" />
            <motion.circle 
              cx={coords.root.x} cy={coords.root.y} r="24" 
              fill={step === 4 ? "var(--success)" : "transparent"}
              stroke={step === 4 ? "var(--success)" : "var(--primary)"}
              strokeWidth="2"
              animate={{ 
                opacity: step >= 4 ? 1 : 0.3,
                strokeDasharray: step === 4 ? "0" : "4 4"
              }}
            />
            {step === 4 ? (
              <CheckCircle className="text-white w-8 h-8" x={coords.root.x - 16} y={coords.root.y - 16} />
            ) : (
              <ShieldCheck className="text-muted-foreground/30 w-8 h-8" x={coords.root.x - 16} y={coords.root.y - 16} />
            )}
            <text x={coords.root.x} y={coords.root.y - 35} textAnchor="middle" className="text-[10px] font-black fill-muted-foreground uppercase tracking-wider">Merkle Root</text>
          </motion.g>

          {coords.l1.map((c, i) => {
            const isActive = (i === 1 && step >= 2) || (i === 0 && step === 3);
            const isSibling = i === 0 && step === 3;
            const isProcessing = (i === 1 && step === 2) || (i === 0 && step === 3);

            return (
              <motion.g 
                key={`l1-${i}`} 
                animate={{ scale: isActive ? 1.1 : 1 }}
                style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
              >
                <circle cx={c.x} cy={c.y} r="20" className="fill-background stroke-muted/20" strokeWidth="2" />
                <motion.circle 
                  cx={c.x} cy={c.y} r="20" 
                  fill={isSibling ? "url(#siblingGradient)" : isActive ? "url(#nodeGradient)" : "transparent"}
                  stroke={isSibling ? "#d97706" : isActive ? "var(--primary)" : "transparent"}
                  strokeWidth={2}
                  animate={{ 
                    opacity: isActive ? 1 : 0,
                    scale: isProcessing ? [1, 1.05, 1] : 1
                  }}
                  transition={{ scale: { repeat: Infinity, duration: 2 } }}
                />
                <Hash className={`${isActive ? "text-primary-foreground" : "text-muted-foreground/20"} w-6 h-6 transition-colors duration-300`} x={c.x - 12} y={c.y - 12} />
                {isSibling && (
                  <motion.text 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    x={c.x} y={c.y + 40} textAnchor="middle" className="fill-amber-500 text-[10px] font-black uppercase tracking-widest"
                  >
                    Sibling #2
                  </motion.text>
                )}
              </motion.g>
            );
          })}

          {coords.l2.map((c, i) => {
            const isTarget = i === 2;
            const isSibling = i === 3;
            const isActive = (isTarget && step >= 1) || (isSibling && step >= 2);
            const isCurrentStep = (isTarget && step === 1) || (isSibling && step === 2);
            
            return (
              <motion.g 
                key={`l2-${i}`} 
                onClick={() => isTarget && step === 0 && next()} 
                className={isTarget && step === 0 ? "cursor-pointer group/leaf" : ""}
                whileHover={isTarget && step === 0 ? { scale: 1.05 } : {}}
                style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
              >
                <rect x={c.x - 25} y={c.y - 25} width="50" height="50" fill="transparent" />
                <rect x={c.x - 20} y={c.y - 20} width="40" height="40" rx="12" className="fill-background stroke-muted/20" strokeWidth="2" />
                <motion.rect 
                  x={c.x - 20} y={c.y - 20} width="40" height="40" rx="12"
                  fill={isSibling ? "url(#siblingGradient)" : isTarget && step >= 1 ? "url(#nodeGradient)" : "transparent"}
                  stroke={isSibling ? "#d97706" : isTarget && step >= 1 ? "var(--primary)" : "transparent"}
                  strokeWidth={2}
                  animate={{ 
                    opacity: isActive ? 1 : 0,
                    scale: isCurrentStep ? [1, 1.03, 1] : 1
                  }}
                  transition={{ scale: { repeat: Infinity, duration: 2 } }}
                />
                {isTarget ? (
                  <Database className={`${step >= 1 ? "text-primary-foreground" : "text-primary"} w-6 h-6 transition-all duration-300`} x={c.x - 12} y={c.y - 12} />
                ) : (
                  <Hash className={`${isSibling && step >= 2 ? "text-primary-foreground" : "text-muted-foreground/10"} w-6 h-6 transition-all duration-300`} x={c.x - 12} y={c.y - 12} />
                )}
                
                {isTarget && step === 0 && (
                  <motion.text 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    x={c.x} y={c.y + 45} textAnchor="middle" className="fill-primary text-[10px] font-black uppercase tracking-tighter"
                  >
                    Target (Click)
                  </motion.text>
                )}
                {isSibling && step === 2 && (
                  <motion.text 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    x={c.x} y={c.y + 45} textAnchor="middle" className="fill-amber-500 text-[10px] font-black uppercase tracking-widest"
                  >
                    Sibling #1
                  </motion.text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full bg-secondary/30 backdrop-blur-md p-6 rounded-[2.5rem] border border-muted/10 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
          <p className="text-center text-base text-foreground/80 font-medium leading-relaxed italic">
            {step === 0 && "To verify data without downloading the whole tree, we only need a specific logarithmic path."}
            {step === 1 && "We hash the target data locally. This provides the first piece of our cryptographic puzzle."}
            {step === 2 && "We don't need the other 1,000,000 leaves—only this specific sibling hash to move up one level."}
            {step === 3 && "By combining the intermediate result with the next sibling, we recompute the tree root."}
            {step === 4 && "The result matches! We've proved inclusion using only 3 pieces of data instead of the full set."}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};