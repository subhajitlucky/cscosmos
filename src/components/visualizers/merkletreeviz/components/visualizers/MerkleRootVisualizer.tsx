import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Hash, Database, Lock, Unlock, HelpCircle, Fingerprint, Activity } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { ParticlePath } from '../ui/ParticlePath';

export const MerkleRootVisualizer = () => {
  const [tamperedIndex, setTamperedIndex] = useState<number | null>(null);
  const [isAnalogyMode, setIsAnalogyMode] = useState(false);
  const { playClick, playError, playHover } = useSound();

  const toggleTamper = (index: number) => {
    const isNewTamper = tamperedIndex !== index;
    if (isNewTamper) {
      playError();
    } else {
      playClick();
    }
    setTamperedIndex(isNewTamper ? index : null);
  };

  const isTampered = tamperedIndex !== null;

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 space-y-2 select-none">
      {/* 0. Analogy Toggle - 10x Clarity */}
      <div className="flex justify-center mb-6">
        <button 
          onClick={() => { playClick(); setIsAnalogyMode(!isAnalogyMode); }}
          onMouseEnter={playHover}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all font-bold text-[10px] uppercase tracking-widest ${
            isAnalogyMode 
              ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" 
              : "bg-secondary/50 border-muted/20 text-muted-foreground hover:border-primary/40"
          }`}
        >
          {isAnalogyMode ? <Fingerprint className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
          {isAnalogyMode ? "Technically Minded" : "Explain Like I'm 5"}
        </button>
      </div>

      {/* Container to align everything - Responsive max width */}
      <div className="relative w-full max-w-[800px] flex flex-col items-center px-4 md:px-0">
        
        {/* 1. The Root */}
        <div className="relative z-20 mb-[-4px]">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    {isAnalogyMode ? "The Master Identity" : "The Merkle Root"}
                </span>
            </div>
            <motion.div 
              animate={{ 
                backgroundColor: isTampered ? "#ef4444" : "#3b82f6", 
                scale: isTampered ? 1.05 : 1,
                boxShadow: "0 0 0 transparent" 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-2xl text-white relative border-4 border-background overflow-hidden z-10"
              style={{ willChange: "transform, background-color" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <AnimatePresence mode="wait">
                {isTampered ? (
                  <motion.div
                    key="alert"
                    initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                  >
                    <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="secure"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                  >
                    {isAnalogyMode ? <Activity className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" /> : <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
        </div>

        {/* 2. Connection Layer (SVG + Intermediate Nodes) */}
        <div className="relative w-full aspect-[5/1]">
             <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 800 160" preserveAspectRatio="none">
                <ParticlePath 
                  d="M 200 80 C 200 40, 400 40, 400 0" 
                  active={true}
                  color={isTampered && tamperedIndex! < 2 ? "#ef4444" : "rgba(163, 163, 163, 0.4)"}
                />
                 <ParticlePath 
                  d="M 600 80 C 600 40, 400 40, 400 0" 
                  active={true}
                  color={isTampered && tamperedIndex! >= 2 ? "#ef4444" : "rgba(163, 163, 163, 0.4)"}
                />

                {[0, 1, 2, 3].map(i => {
                  const parentX = i < 2 ? 200 : 600;
                  const childX = 100 + (i * 200);
                  const active = tamperedIndex === i;
                  
                  return (
                    <ParticlePath 
                      key={`path-${i}`}
                      d={`M ${childX} 160 C ${childX} 120, ${parentX} 120, ${parentX} 80`}
                      active={true}
                      color={active ? "#ef4444" : "rgba(163, 163, 163, 0.4)"}
                    />
                  );
                })}
             </svg>

             <div className="absolute inset-0 grid grid-cols-2 place-items-center pointer-events-none">
                 {[0, 1].map(group => (
                    <motion.div 
                        key={group}
                        animate={{
                            borderColor: isTampered && Math.floor(tamperedIndex! / 2) === group ? "#ef4444" : "rgba(163, 163, 163, 0.2)",
                            backgroundColor: isTampered && Math.floor(tamperedIndex! / 2) === group ? "rgba(239, 68, 68, 0.05)" : "var(--card)",
                            color: isTampered && Math.floor(tamperedIndex! / 2) === group ? "#ef4444" : "rgba(163, 163, 163, 0.4)"
                        }}
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-xl border-2 flex items-center justify-center shadow-sm z-10"
                    >
                        {isAnalogyMode ? <Fingerprint className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /> : <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />}
                    </motion.div>
                 ))}
             </div>
        </div>

        {/* 3. Data Blocks Layer */}
        <div className="relative w-full grid grid-cols-4 place-items-center mt-[-10px]">
            {[0, 1, 2, 3].map(i => (
                  <motion.button
                    key={i}
                    onClick={() => toggleTamper(i)}
                    onMouseEnter={playHover}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        backgroundColor: tamperedIndex === i ? "#ef4444" : "var(--card)",
                        borderColor: tamperedIndex === i ? "#ef4444" : "rgba(163, 163, 163, 0.2)",
                        color: tamperedIndex === i ? "#ffffff" : "var(--muted-foreground)",
                        boxShadow: "none" 
                    }}
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-3 relative group overflow-hidden"
                    style={{ willChange: "transform, background-color" }}
                  >
                        <motion.div 
                            animate={{ backgroundColor: tamperedIndex === i ? "rgba(255, 255, 255, 0.2)" : "var(--secondary)" }}
                            className="p-1.5 sm:p-2 rounded-lg"
                        >
                            <Database className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter hidden sm:block">
                            {isAnalogyMode ? `Chapter ${i+1}` : `Data ${i+1}`}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-tighter sm:hidden">
                            {isAnalogyMode ? `C${i+1}` : `D${i+1}`}
                        </span>
                        
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                            {tamperedIndex === i ? <Unlock className="w-2 h-2 sm:w-3 sm:h-3 opacity-50" /> : <Lock className="w-2 h-2 sm:w-3 sm:h-3 opacity-20 group-hover:opacity-40" />}
                        </div>
                  </motion.button>
            ))}
        </div>

      </div>

      {/* 4. Dynamic Feedback Panel - 10x Pedagogy */}
      <div className="w-full max-w-md pt-8 min-h-[120px] px-4 md:px-0">
        <AnimatePresence mode="wait">
          {isTampered ? (
            <motion.div 
              key="alert-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 shadow-sm"
            >
              <div className="bg-red-500 p-2 rounded-xl text-white">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-black text-red-600 uppercase tracking-widest">
                    {isAnalogyMode ? "Tamper Detected!" : "Chain Reaction!"}
                </h5>
                <p className="text-[10px] text-red-500/80 leading-tight mt-0.5 font-medium">
                    {isAnalogyMode 
                        ? `You changed a single word in Chapter ${tamperedIndex! + 1}. This corrupted its fingerprint, which then broke the Master Identity.` 
                        : `Changing Data ${tamperedIndex! + 1} corrupted the branch hashes and invalidated the Root.`}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="info-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-secondary/30 p-6 rounded-[2rem] text-center border border-muted/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-accent/20" />
              <p className="text-sm text-foreground/80 font-medium leading-relaxed italic relative z-10">
                {isAnalogyMode 
                    ? "Think of the Merkle Root as a Master Signature. If you change even one comma in any chapter below, the entire signature becomes invalid instantly."
                    : "The Merkle Root is a single 32-byte cryptographic commitment that represents the integrity of every leaf in the tree."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};