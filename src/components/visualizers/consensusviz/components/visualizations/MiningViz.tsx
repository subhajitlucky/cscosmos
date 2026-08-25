import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateBlockHash } from '../../utils/hash';
import { Play, Pause, RefreshCw, CheckCircle, Settings, Zap, Hash, Database, Lock } from 'lucide-react';
import { clsx } from 'clsx';

const MiningViz: React.FC = () => {
  // Block Header State
  const [blockHeight] = useState(1052);
  const [prevHash] = useState('0000a456b7c8d9e0f1...');
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000));
  const [data, setData] = useState('Transaction: Alice -> Bob 50 BTC');
  const [nonce, setNonce] = useState(0);

  // Mining State
  const [isMining, setIsMining] = useState(false);
  const [difficulty, setDifficulty] = useState(3);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const [recentHashes, setRecentHashes] = useState<string[]>([]);

  // Derived
  const hash = calculateBlockHash(blockHeight, prevHash, timestamp, data, nonce);
  const targetPrefix = '0'.repeat(difficulty);
  const isFound = hash.startsWith(targetPrefix);

  const miningRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const nonceRef = useRef(nonce);

  useEffect(() => { nonceRef.current = nonce; }, [nonce]);

  useEffect(() => {
    if (isMining && !isFound) {
      if (!startTime) {
        
        const now = Date.now();
        setStartTime(now);
      }

      const mine = (time: number) => {
        let currentNonce = nonceRef.current;
        const batchSize = 40; 
        let found = false;
        const batchHashes: string[] = [];

        for (let i = 0; i < batchSize; i++) {
          currentNonce++;
          const tempHash = calculateBlockHash(blockHeight, prevHash, timestamp, data, currentNonce);
          if (i % 10 === 0) batchHashes.push(tempHash);
          if (tempHash.startsWith(targetPrefix)) {
            found = true;
            break;
          }
        }

        setNonce(currentNonce);
        setRecentHashes(h => [batchHashes[0], ...h].slice(0, 5));
        
        if (time - lastUpdateRef.current > 100) {
            const now = Date.now();
            setElapsedTime((now - (startTime || now)) / 1000);
            setHashRate(Math.floor(batchSize * 60)); 
            lastUpdateRef.current = time;
        }

        if (found) {
          setIsMining(false);
          const now = Date.now();
          setElapsedTime((now - (startTime || now)) / 1000);
        } else {
          miningRef.current = requestAnimationFrame(mine);
        }
      };
      
      miningRef.current = requestAnimationFrame(mine);
    } else {
        setHashRate(0);
    }

    return () => {
      if (miningRef.current) cancelAnimationFrame(miningRef.current);
    };
  }, [isMining, isFound, targetPrefix, data, timestamp, blockHeight, prevHash, startTime]);

  const resetBlock = () => {
    setIsMining(false);
    setNonce(0);
    setTimestamp(Math.floor(Date.now() / 1000));
    setElapsedTime(0);
    setStartTime(null);
    setHashRate(0);
    setRecentHashes([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 font-mono bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-xl dark:shadow-2xl transition-colors">
      {/* HUD Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between transition-colors">
           <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 mb-2">
              <Settings size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Mining Parameters</span>
           </div>
           <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl p-2 border border-gray-100 dark:border-slate-800">
              <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 ml-2 uppercase">Difficulty</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(d => (
                  <button
                    key={d}
                    onClick={() => { setDifficulty(d); resetBlock(); }}
                    className={clsx(
                      "w-7 h-7 rounded-lg text-[10px] font-black transition-all",
                      difficulty === d ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
           </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between h-24 transition-colors">
           <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <Zap size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Computation Load</span>
           </div>
           <div className="flex items-end justify-between">
              <div className="text-2xl font-black text-gray-800 dark:text-slate-200">{hashRate.toLocaleString()} <span className="text-[10px] text-gray-400 dark:text-slate-600">H/s</span></div>
              <div className="text-[10px] text-gray-400 dark:text-slate-500 font-bold">{elapsedTime.toFixed(1)}s</div>
           </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between h-24 overflow-hidden transition-colors">
           <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-500 mb-2">
              <Hash size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Hash Stream</span>
           </div>
           <div className="space-y-0.5">
              {recentHashes.map((h, i) => (
                <div key={i} className="text-[7px] text-gray-400 dark:text-slate-700 truncate font-mono">{h}</div>
              ))}
              {recentHashes.length === 0 && <div className="text-[8px] text-gray-300 dark:text-slate-800 italic">Awaiting hash generation...</div>}
           </div>
        </div>
      </div>

      {/* The Block Forge */}
      <div className={clsx(
        "relative bg-gray-50 dark:bg-slate-950 border-2 rounded-[2.5rem] p-1 transition-all duration-700 overflow-hidden",
        isFound ? "border-emerald-500 shadow-xl shadow-emerald-500/10 dark:shadow-emerald-500/20" : "border-gray-100 dark:border-slate-800"
      )}>
        {/* Animated Interior Glow */}
        <div className={clsx(
          "absolute inset-0 opacity-[0.05] dark:opacity-20 transition-opacity duration-1000",
          isMining ? "opacity-30 dark:opacity-30 bg-amber-500/15" : "",
          isFound ? "opacity-40 dark:opacity-40 bg-emerald-500/10" : ""
        )} />

        <div className="relative z-10 bg-white/80 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[2.3rem] p-6 sm:p-10 space-y-8 shadow-sm">
           {/* Block Header Stats */}
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-gray-100 dark:border-slate-800/50">
              <div className="flex gap-8">
                <div className="space-y-1">
                   <div className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase">Block Identifier</div>
                   <div className="text-sm font-bold text-gray-800 dark:text-slate-200">#00{blockHeight}</div>
                </div>
                <div className="space-y-1">
                   <div className="text-[8px] font-black text-gray-400 dark:text-slate-600 uppercase">Prev Signature</div>
                   <div className="text-[10px] font-mono text-gray-400 dark:text-slate-500">{prevHash.substring(0, 16)}...</div>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={isFound ? 'found' : 'invalid'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={clsx(
                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2",
                    isFound ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/30" : "bg-gray-100 text-gray-400 border-gray-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700"
                  )}
                >
                  {isFound ? <CheckCircle size={12} /> : <div className={clsx("w-1.5 h-1.5 rounded-full bg-red-500", isMining && "animate-pulse")} />}
                  {isFound ? 'Signature Valid' : 'Seal Broken'}
                </motion.div>
              </AnimatePresence>
           </div>

           {/* Input Data Section */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400 dark:text-slate-400">
                  <Database size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Payload Data</span>
                </div>
                <div className="relative group">
                  <textarea 
                    value={data}
                    onChange={(e) => { setData(e.target.value); if (isFound) setIsMining(false); }}
                    className="w-full h-32 bg-gray-50/50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-medium text-gray-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all resize-none shadow-inner"
                    placeholder="Enter transaction data..."
                  />
                  <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Lock size={12} className="text-gray-400 dark:text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-gray-400 dark:text-slate-400">
                      <Zap size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Mutable Nonce</span>
                   </div>
                   <div className="bg-gray-50/50 dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 flex items-center justify-between shadow-inner">
                      <div className="text-3xl font-black text-blue-600 dark:text-blue-500 font-mono tracking-tighter">
                         {nonce.toLocaleString()}
                      </div>
                      <div className="text-[8px] text-gray-400 dark:text-slate-600 font-bold uppercase rotate-90 origin-right translate-x-4">Iterating</div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-gray-400 dark:text-slate-400">
                      <Hash size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Generated Signature</span>
                   </div>
                   <div className={clsx(
                     "p-4 rounded-2xl border font-mono text-[10px] break-all transition-all duration-500 h-20 flex items-center shadow-inner",
                     isFound ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400" : "bg-gray-50 dark:bg-slate-950 border-gray-100 dark:border-slate-800 text-gray-400 dark:text-slate-500"
                   )}>
                      <span className="font-black text-gray-900 dark:text-white">{hash.substring(0, isFound ? difficulty : 0)}</span>
                      {hash.substring(isFound ? difficulty : 0)}
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => {
            if (isMining) setIsMining(false);
            else { setIsMining(true); if (!startTime) {
              const now = Date.now();
              setStartTime(now);
            } }
          }}
          disabled={isFound}
          className={clsx(
            "flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-xl border-b-4",
            isMining 
              ? "bg-amber-500 border-amber-700 text-white" 
              : "bg-blue-600 border-blue-800 text-white disabled:opacity-50 disabled:translate-y-0.5 disabled:border-b-0"
          )}
        >
          {isMining ? <Pause size={18} /> : isFound ? <CheckCircle size={18} /> : <Play size={18} />}
          {isMining ? 'Halt Engine' : isFound ? 'Signature Forged' : 'Engage Mining'}
        </button>
        
        <button
          onClick={resetBlock}
          className="px-8 py-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} /> Reset
        </button>
      </div>

      <div className="text-center pt-2">
         <p className="text-[9px] text-gray-300 dark:text-slate-600 uppercase tracking-[0.3em] font-black">Secure Hash Forge v2.0</p>
      </div>
    </div>
  );
};

export default MiningViz;