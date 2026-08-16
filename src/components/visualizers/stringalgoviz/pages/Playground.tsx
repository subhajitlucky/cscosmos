import React, { useState, useMemo } from 'react';
import { AlgorithmVisualizer } from '../components/visualizers/AlgorithmVisualizer';
import { StringRow } from '../components/visualizers/StringBox';
import { naiveMatch } from '../algorithms/naiveMatching';
import { kmpMatch } from '../algorithms/kmp';
import { zMatch } from '../algorithms/zAlgorithm';
import { rabinKarpMatch } from '../algorithms/rabinKarp';
import { boyerMooreMatch } from '../algorithms/boyerMoore';
import { Settings2, Table as TableIcon, Binary, BarChart3, ArrowDown, Check, X, Info, List } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Playground: React.FC = () => {
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABCABAB");
  const [algorithm, setAlgorithm] = useState("naive");

  const result = useMemo(() => {
    switch (algorithm) {
      case 'naive': return naiveMatch(text, pattern);
      case 'kmp': return kmpMatch(text, pattern);
      case 'z': return zMatch(text, pattern);
      case 'rabinkarp': return rabinKarpMatch(text, pattern);
      case 'boyermoore': return boyerMooreMatch(text, pattern);
      default: return { steps: [], finalResult: [] };
    }
  }, [text, pattern, algorithm]);

  const byteStream = useMemo(() => {
    const encoder = new TextEncoder();
    return Array.from(encoder.encode(text));
  }, [text]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-8">
        {/* Row 1: Config, Stats & History side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-sm font-black mb-8 flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400">
              <Settings2 size={16} className="text-brand-500" />
              Simulator Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Algorithm</label>
                <select 
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-brand-500 transition-all font-bold text-sm"
                >
                  <option value="naive">Naive Brute-Force</option>
                  <option value="kmp">KMP (Prefix Jump)</option>
                  <option value="z">Z-Algorithm (LCP)</option>
                  <option value="rabinkarp">Rabin-Karp (Hash)</option>
                  <option value="boyermoore">Boyer-Moore (Right-to-Left)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Source Text</label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:border-brand-500 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Search Pattern</label>
                <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:border-brand-500 transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-center">
            <h2 className="text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400"><BarChart3 size={16} className="text-emerald-500" /> Live Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[8px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Matches</span>
                <span className="font-black text-brand-500 text-3xl">{result.finalResult.length || 0}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[8px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Iterations</span>
                <span className="font-black text-slate-700 dark:text-slate-200 text-3xl">{result.steps.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col">
            <h2 className="text-[10px] font-black mb-4 flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400">
              <List size={14} className="text-indigo-500" />
              Decision History
            </h2>
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[120px] custom-scrollbar pr-2">
               {result.steps.slice(0, 50).map((s, idx) => (
                 <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 text-[9px] font-medium text-slate-500 flex items-start gap-2">
                    <span className="text-brand-500 font-bold">#{idx+1}</span>
                    <span>{s.description}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Row 2: Dedicated Full-Width Animation Row */}
        <div className="w-full">
          <AlgorithmVisualizer 
            steps={result.steps}
            speed={350}
            renderStep={(step) => {
              const isComparing = step.state.phase === 'compare' || step.state.type === 'compare';
              const isMatch = step.state.phase === 'match-char' || step.state.phase === 'match-full' || step.state.type === 'match';
              const isMismatch = step.state.phase === 'mismatch' || step.state.type === 'mismatch';

              return (
                <div className="flex flex-col gap-4 w-full items-start min-w-max px-4">
                  <div className="flex flex-col gap-16 w-full items-start relative py-12">
                    {/* Visual Pointer Labels (i) */}
                    {step.highlightedIndices.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute top-0 flex flex-col items-center gap-0.5 transition-all duration-300"
                        style={{ left: `${Math.min(...step.highlightedIndices) * 28 + 2}px` }}
                      >
                        <span className="text-[8px] font-black text-brand-500 bg-brand-50 dark:bg-brand-900/30 px-1 rounded border border-brand-200">i</span>
                        <ArrowDown size={10} className="text-brand-500" />
                      </motion.div>
                    )}

                    <StringRow label="Input Memory Buffer (T)" text={text} highlightedIndices={algorithm === 'z' ? [] : step.highlightedIndices} matchedIndices={step.matches} />
                    
                    {/* Comparison Result Overlay */}
                    <AnimatePresence>
                      {(isComparing || isMatch || isMismatch) && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className="absolute z-50 pointer-events-none"
                          style={{ 
                            left: `${(step.index + (step.innerIndex || 0)) * 28 + 14}px`,
                            top: '45%',
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2",
                            isMismatch ? "bg-rose-500 border-rose-200 text-white" : 
                            isMatch ? "bg-emerald-500 border-emerald-200 text-white" : 
                            "bg-white dark:bg-slate-800 border-brand-500 text-brand-500"
                          )}>
                            {isMismatch ? <X size={12} strokeWidth={4} /> : isMatch ? <Check size={12} strokeWidth={4} /> : <div className="animate-ping w-1 h-1 bg-brand-500 rounded-full" />}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode='wait'>
                      <motion.div 
                        key={algorithm} 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="transition-all duration-500 ease-in-out relative"
                        style={{ marginLeft: algorithm === 'naive' || algorithm === 'rabinkarp' || algorithm === 'boyermoore' ? `${step.index * 28}px` : algorithm === 'kmp' ? `${(step.index - (step.innerIndex || 0)) * 28}px` : '0px' }}
                      >
                        {/* Visual Pointer Labels (j) */}
                        {step.secondaryHighlightedIndices && step.secondaryHighlightedIndices.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute -top-6 flex flex-col items-center gap-0.5 transition-all duration-300"
                            style={{ left: `${Math.min(...step.secondaryHighlightedIndices) * 28 + 2}px` }}
                          >
                            <span className="text-[8px] font-black text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-1 rounded border border-amber-200 shadow-sm">j</span>
                            <ArrowDown size={10} className="text-amber-500 rotate-180" />
                          </motion.div>
                        )}

                        {algorithm !== 'z' ? <StringRow label="Pattern Pointer (P)" text={pattern} highlightedIndices={step.secondaryHighlightedIndices} /> : <StringRow label="Concatenated String (P + $ + T)" text={pattern + "$" + text} highlightedIndices={step.highlightedIndices} secondaryHighlightedIndices={step.secondaryHighlightedIndices} />}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Thinking Bubble / Real-time Logic Callout */}
                  <div className="w-full flex justify-center pb-4">
                    <div className="bg-brand-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-brand-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-none">
                        <Info size={16} />
                      </div>
                      <span className="font-bold text-sm leading-tight tracking-tight">{step.description}</span>
                    </div>
                  </div>

                  {/* Internal Logic View (Synced with current step) */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-slate-50/50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><TableIcon size={14} /> Local Step State</h3>
                        {algorithm === 'kmp' && step.state.pi && (
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Pi Table</span>
                            <div className="flex gap-1">{step.state.pi.map((v: number, i: number) => (
                              <div key={i} className={cn("w-8 h-8 flex items-center justify-center border-2 rounded-lg font-mono text-xs font-bold transition-all", i === step.innerIndex ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm" : "border-slate-100 dark:border-slate-800 text-slate-400")}>{v}</div>
                            ))}</div>
                          </div>
                        )}
                        {algorithm === 'rabinkarp' && (
                          <div className="flex gap-4">
                            <div className="flex-1 p-4 bg-white dark:bg-slate-900 rounded-2xl border flex flex-col items-center">
                              <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Pattern Hash</span>
                              <div className="text-xl font-black text-brand-500 font-mono">{step.state.p}</div>
                            </div>
                            <div className={cn("flex-1 p-4 rounded-2xl border-2 flex flex-col items-center", step.state.p === step.state.t ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800")}>
                              <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Window Hash</span>
                              <div className="text-xl font-black font-mono">{step.state.t}</div>
                            </div>
                          </div>
                        )}
                        {algorithm === 'z' && step.state.z && (
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Z-Array</span>
                            <div className="flex gap-1">{step.state.z.map((v: number, i: number) => (
                              <div key={i} className={cn("w-8 h-8 flex items-center justify-center border-2 rounded-lg font-mono text-xs font-bold transition-all", i === step.index ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm" : (i >= step.state.l && i <= step.state.r) ? "border-amber-200 bg-amber-50" : "border-slate-100 dark:border-slate-800 text-slate-400")}>{v}</div>
                            ))}</div>
                          </div>
                        )}
                        {!['kmp', 'z', 'rabinkarp'].includes(algorithm) && <div className="text-center text-slate-300 italic text-sm py-4">No specific auxiliary state for this algorithm.</div>}
                    </div>
                    
                    <div className="bg-slate-50/50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Binary size={14} /> Memory Inspection</h3>
                        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                          {byteStream.map((byte, i) => (
                            <div key={i} className={cn("flex flex-col items-center p-1 rounded-lg border transition-all", step.highlightedIndices.includes(i) ? "bg-brand-500 border-brand-600 text-white shadow-sm" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 opacity-40")}>
                              <span className="text-[8px] font-mono font-bold">0x{byte.toString(16).toUpperCase()}</span>
                            </div>
                          ))}
                        </div>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Playground;
