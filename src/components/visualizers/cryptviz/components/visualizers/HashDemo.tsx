import React, { useState, useEffect } from 'react';
import { sha256 } from '../../utils/crypto';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { RefreshCw, Play, X, Sparkles } from 'lucide-react';

export const HashDemo: React.FC = () => {
  const [input, setInput] = useState('Hello World');
  const [hash, setHash] = useState('');
  const [prevHash, setPrevHash] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);

  useEffect(() => {
    const compute = async () => {
      const h = await sha256(input);
      setHash(currentHash => {
        setPrevHash(currentHash);
        return h;
      });
      setIsChanging(true);
      setTimeout(() => setIsChanging(false), 300);
    };
    compute();
  }, [input]);

  // Generate a color from the hash (use first 6 chars)
  const hashColor = hash ? `#${hash.substring(0, 6)}` : '#e2e8f0';

  const renderHash = () => {
    if (!hash) return null;
    return (
      <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 font-mono text-xs break-all">
        {hash.split('').map((char, i) => {
          const isDiff = prevHash[i] !== char;
          return (
            <motion.div
              key={`${i}-${char}`}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className={clsx(
                "h-7 w-full flex items-center justify-center rounded font-bold transition-colors duration-300",
                // Light Mode: Pure white bg, solid black text, subtle border
                "bg-white text-slate-950 border border-slate-200 shadow-sm",
                // Dark Mode: Dark slate bg, light text
                "dark:bg-slate-800 dark:text-slate-200 dark:border-transparent dark:shadow-none",
                // Highlight (Change): 
                isDiff && "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-brand-900/50 dark:text-brand-100 dark:border-brand-500/50 ring-1 ring-indigo-500/30 dark:ring-brand-500/50"
              )}
            >
              {char}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const startTour = () => {
    setInput("Hello");
    setIsTourActive(true);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl overflow-hidden transition-colors duration-300">
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <RefreshCw className={clsx("w-5 h-5 text-indigo-600 dark:text-brand-400", isChanging && "animate-spin")} />
          SHA-256 Hasher
        </h3>
        <div className="flex items-center gap-2">
            {!isTourActive ? (
                <button onClick={startTour} className="flex items-center gap-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-brand-600 dark:hover:bg-brand-500 text-white rounded-full text-xs font-bold transition-colors shadow-sm">
                    <Play className="w-3 h-3" /> Start Tour
                </button>
            ) : (
                <button onClick={() => setIsTourActive(false)} className="flex items-center gap-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs transition-colors border border-slate-200 dark:border-transparent">
                    <X className="w-3 h-3" /> End Tour
                </button>
            )}
            <span className="text-xs text-slate-500 font-mono uppercase hidden sm:inline">Deterministic</span>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Simple Tour Banner */}
        {isTourActive && (
             <div className="p-3 bg-indigo-50 dark:bg-brand-900/20 border border-indigo-100 dark:border-brand-800 rounded-lg flex items-start gap-3">
                 <Sparkles className="w-5 h-5 text-indigo-600 dark:text-brand-600 flex-shrink-0 mt-0.5" />
                 <div>
                     <p className="text-sm font-bold text-indigo-900 dark:text-brand-100">
                         See the magic happening?
                     </p>
                     <p className="text-xs text-indigo-700 dark:text-brand-300">
                         Try changing a single character in the box below. Notice how the entire hash fingerprint changes completely.
                     </p>
                 </div>
             </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Input Section */}
            <div className="md:col-span-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2">Input Data (Your "Ingredients")</label>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-brand-500 focus:border-indigo-500 transition-all resize-none font-mono shadow-inner"
                placeholder="Type anything here..."
            />
            </div>

            {/* Visual Identity (Color Hash) */}
            <div className="md:col-span-1 flex flex-col">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Unique Identity</label>
                <div 
                    className="flex-grow rounded-lg shadow-inner border border-slate-200 dark:border-slate-800 transition-colors duration-300 flex items-center justify-center relative group"
                    style={{ backgroundColor: hashColor }}
                >
                    <div className="bg-white/90 dark:bg-slate-900/90 p-2 rounded text-[10px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute">
                        {hashColor}
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center leading-tight">
                    This color is unique to your text. Change one letter, get a new color!
                </p>
            </div>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-400">Hash Output (The "Fingerprint")</label>
            <span className="text-xs text-slate-500 font-medium">{hash.length * 4} bits</span>
          </div>
          
          <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
             {renderHash()}
          </div>
        </div>
      </div>
    </div>
  );
};