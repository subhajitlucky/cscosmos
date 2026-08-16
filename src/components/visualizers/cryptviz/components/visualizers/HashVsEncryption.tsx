import React, { useState, useEffect } from 'react';
import { sha256 } from '../../utils/crypto';
import { motion } from 'framer-motion';
import { Hash, Lock, Unlock, ArrowRight, CheckCircle, Key, FileText, Ghost } from 'lucide-react';

export const HashVsEncryption: React.FC = () => {
  const [input, setInput] = useState('MySecret123');
  const [hash, setHash] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);

  useEffect(() => {
    const update = async () => {
      const h = await sha256(input);
      setHash(h.substring(0, 24));
      
      // Pseudo-encryption for demo
      const enc = btoa(input).split('').reverse().join('');
      setEncrypted(enc);
      setIsDecrypted(false);
    };
    update();
  }, [input]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      
      {/* Intro Context */}
      <div className="text-center max-w-2xl mx-auto">
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            The most common confusion in security: <span className="font-bold text-slate-900 dark:text-white">Hashing</span> is for verifying identity, 
            while <span className="font-bold text-slate-900 dark:text-white">Encryption</span> is for hiding conversations.
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT: HASHING (THE SMOOTHIE) */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-brand-600 rounded text-white">
                        <Hash className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">Hashing</h3>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">ONE-WAY</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Input (The Fruit)</label>
                        <input 
                            value={input} onChange={(e) => setInput(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 transition-all shadow-inner"
                        />
                    </div>

                    <div className="flex justify-center py-2">
                        <div className="relative">
                             <ArrowRight className="w-8 h-8 text-slate-200 dark:text-slate-800" />
                             <motion.div 
                                animate={{ opacity: [0, 1, 0], x: [-10, 20] }} 
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-0 flex items-center justify-center"
                             >
                                 <div className="w-2 h-2 bg-brand-500 rounded-full" />
                             </motion.div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Output (The Smoothie)</label>
                        <div className="w-full p-4 bg-slate-100 dark:bg-slate-800 border-2 border-brand-500/20 rounded-xl font-mono text-sm text-brand-700 dark:text-brand-400 break-all min-h-[80px] flex items-center justify-center text-center">
                            {hash}...
                        </div>
                    </div>

                    <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex flex-col items-center">
                        <Ghost className="w-8 h-8 text-rose-300 dark:text-rose-900 mb-2" />
                        <h5 className="font-bold text-rose-700 dark:text-rose-400 text-xs uppercase mb-1">Irreversible</h5>
                        <p className="text-[10px] text-rose-600/70 dark:text-rose-400/50 text-center leading-tight">
                            You can't "un-smoothie" the fruit. There is no key to get your text back from this hash.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT: ENCRYPTION (THE SAFE) */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-600 rounded text-white">
                        <Lock className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">Encryption</h3>
                </div>
                <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">TWO-WAY</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-6">
                    <div className="flex items-end gap-3">
                        <div className="flex-grow">
                             <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Input (The Message)</label>
                             <div className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-lg text-slate-400">
                                {input}
                             </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                             <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm">
                                <Key className="w-5 h-5" />
                             </div>
                             <span className="text-[8px] font-black text-amber-600 uppercase">Key Required</span>
                        </div>
                    </div>

                    <div className="flex justify-center py-2">
                         <div className="relative">
                             <ArrowRight className="w-8 h-8 text-slate-200 dark:text-slate-800" />
                             <motion.div 
                                animate={{ opacity: [0, 1, 0], x: [-10, 20] }} 
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.75 }}
                                className="absolute inset-0 flex items-center justify-center"
                             >
                                 <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                             </motion.div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Output (The Locked Safe)</label>
                        <div className="w-full p-4 bg-slate-100 dark:bg-slate-950 border-2 border-indigo-500/20 rounded-xl font-mono text-sm text-indigo-700 dark:text-indigo-400 break-all min-h-[80px] flex items-center justify-center text-center">
                            {encrypted}
                        </div>
                    </div>

                    <div className="pt-2">
                         {!isDecrypted ? (
                            <button 
                                onClick={() => setIsDecrypted(true)}
                                className="w-full p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                            >
                                <Unlock className="w-4 h-4" /> REVERSE WITH KEY
                            </button>
                         ) : (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }} 
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center"
                            >
                                <CheckCircle className="w-8 h-8 text-emerald-500 mb-1" />
                                <h5 className="font-bold text-emerald-700 dark:text-emerald-400 text-xs uppercase mb-1">Message Restored!</h5>
                                <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">"{input}"</p>
                            </motion.div>
                         )}
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Decision Matrix */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
              <Ghost className="w-32 h-32" />
          </div>
          
          <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-500" />
              Senior Dev's Decision Matrix
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Purpose</div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Hash</p>
                          <p className="text-sm font-bold text-brand-400">Integrity</p>
                          <p className="text-[10px] text-slate-400 mt-1">Is this the same file?</p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Encryption</p>
                          <p className="text-sm font-bold text-indigo-400">Privacy</p>
                          <p className="text-[10px] text-slate-400 mt-1">Can anyone else read this?</p>
                      </div>
                  </div>
              </div>

              <div className="space-y-3">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Storage</div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Hash</p>
                          <p className="text-sm font-bold text-slate-200">Passwords</p>
                          <p className="text-[10px] text-slate-400 mt-1">Store hashes, not text.</p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Encryption</p>
                          <p className="text-sm font-bold text-slate-200">Messages</p>
                          <p className="text-[10px] text-slate-400 mt-1">Lock data to send it.</p>
                      </div>
                  </div>
              </div>

              <div className="space-y-3">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest">The "Key" Rule</div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                      <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                          <Ghost className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                          Hashing <span className="text-white font-bold">never</span> needs a key. If you need a key to get data back, you are doing <span className="text-white font-bold">Encryption</span>.
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};