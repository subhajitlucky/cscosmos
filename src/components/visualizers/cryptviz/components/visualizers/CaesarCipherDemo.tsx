import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ArrowRight, Eye } from 'lucide-react';

export const CaesarCipherDemo: React.FC = () => {
  const [input, setInput] = useState('HELLO');
  const [shift, setShift] = useState(3);
  
  // Simple Caesar Cipher Logic
  const processText = (text: string, shiftAmount: number) => {
    return text.toUpperCase().split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shiftAmount) % 26) + 65);
      }
      return char;
    }).join('');
  };

  const output = processText(input, shift);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Educational Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-4">
        <div className="p-2 bg-indigo-600 rounded-lg text-white mt-1">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 dark:text-indigo-200">The "Secret Decoder Ring" Concept</h4>
          <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed">
             Cryptography is about transforming data so it looks like nonsense to everyone except the person with the <strong>Key</strong>. 
             In this simple example, the "Key" is the shift number.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 items-center justify-center">
             {/* Shift Control (The Key) */}
             <div className="flex flex-col items-center gap-2 z-10">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">The Key (Shift)</label>
                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-2 rounded-full border border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => setShift(s => Math.max(1, s - 1))}
                        className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-colors"
                    >-</button>
                    <span className="w-8 text-center font-mono font-bold text-lg text-indigo-600 dark:text-brand-400">{shift}</span>
                    <button 
                        onClick={() => setShift(s => Math.min(25, s + 1))}
                        className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-colors"
                    >+</button>
                </div>
             </div>
        </div>

        {/* Visualization Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center relative">
             
             {/* Input */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Unlock className="w-3 h-3 text-emerald-500" /> 
                    Plaintext (Readable)
                </label>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z ]/g, ''))}
                    className="w-full text-center text-2xl font-mono font-bold p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-emerald-800/20"
                    placeholder="HELLO"
                    maxLength={10}
                />
             </div>

             {/* Transformation Arrow */}
             <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20"></div>
                    <ArrowRight className="w-8 h-8 relative z-10" />
                </div>
                <div className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
                    + {shift} positions
                </div>
             </div>

             {/* Output */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Lock className="w-3 h-3 text-rose-500" /> 
                    Ciphertext (Secret)
                </label>
                <div className="w-full text-center text-2xl font-mono font-bold p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-400 break-all relative overflow-hidden group">
                     <AnimatePresence mode='popLayout'>
                        {output.split('').map((char, i) => (
                            <motion.span
                                key={`${i}-${char}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="inline-block"
                            >
                                {char}
                            </motion.span>
                        ))}
                     </AnimatePresence>
                     {input.length === 0 && <span className="opacity-20 text-rose-800 dark:text-rose-400">-</span>}
                </div>
             </div>

        </div>

        {/* Detailed Explanation */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-2">History & Honor</h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    This technique is named after <span className="font-bold text-indigo-600 dark:text-brand-400">Julius Caesar</span> (100 BC – 44 BC), who used it to communicate secret military messages. 
                    If the message was intercepted, enemies would only see gibberish. 
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 text-xs text-amber-800 dark:text-amber-200 italic">
                    "Experience is the teacher of all things." — Julius Caesar
                </div>
            </div>
            <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-2">What is happening?</h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    We are shifting every letter by <strong>{shift}</strong> spots in the alphabet. 
                    <br/><br/>
                    Example: 'A' + 1 = 'B'.
                    <br/>
                    This is a <span className="font-bold text-indigo-600 dark:text-brand-400">Substitution Cipher</span>. 
                    Modern cryptography (like what secures your bank) uses complex math instead of simple shifting, but the principle is the same: 
                    <br/>
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Message + Key = Secret</span>
                </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <span>Alphabet Mapping</span>
                </div>
                <div className="font-mono text-sm space-y-1">
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>...</span>
                    </div>
                    <div className="flex justify-center py-1">
                        <ArrowRight className="w-3 h-3 text-slate-300 rotate-90" />
                    </div>
                    <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold">
                        <span>{String.fromCharCode(65 + shift)}</span>
                        <span>{String.fromCharCode(66 + shift)}</span>
                        <span>{String.fromCharCode(67 + shift)}</span>
                        <span>{String.fromCharCode(68 + shift)}</span>
                        <span>{String.fromCharCode(69 + shift)}</span>
                        <span>...</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};