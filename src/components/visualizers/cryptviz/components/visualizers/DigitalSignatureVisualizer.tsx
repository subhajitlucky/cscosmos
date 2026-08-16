import React, { useState } from 'react';
import { sha256, generateKeyPair, signMessage } from '../../utils/crypto';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Hash, Key, CheckCircle, ShieldCheck, Lock, Play, ChevronRight, RotateCcw, Box, ArrowRight, ArrowDown } from 'lucide-react';
import clsx from 'clsx';

// Horizontal connector pipe
const PipeHorizontal = ({ active, color }: { active: boolean, color: string }) => (
    <div className="flex items-center w-8 md:w-12 relative">
        <div className={clsx("h-1 w-full transition-colors duration-500", active ? color : "bg-slate-200 dark:bg-slate-800")} />
    </div>
);

export const DigitalSignatureVisualizer: React.FC = () => {
  const [message, setMessage] = useState('Pay Alice $100');
  
  // Stages:
  // 0: Idle
  // 1: Hashing (Data -> Hash)
  // 2: Key Fetch (Wallet -> Private Key)
  // 3: Encryption (Hash + PrivKey -> Signature)
  // 4: Complete
  const [stage, setStage] = useState(0);

  // Simulation State
  const [simData, setSimData] = useState<{
      hash: string;
      privKey: string;
      signature: string;
  }>({ hash: '', privKey: '', signature: '' });

  const startSimulation = async () => {
      // Pre-calculate
      const k = await generateKeyPair();
      const h = await sha256(message);
      const s = await signMessage(message, k.privateKey);
      
      setSimData({
          hash: h,
          privKey: k.privateKeyHex,
          signature: s
      });
      setStage(1);
  };

  const nextStep = () => {
      setStage(prev => Math.min(4, prev + 1));
  };

  const reset = () => {
      setStage(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* Control Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1">
                 <div className={clsx("w-3 h-3 rounded-full transition-colors", stage >= 1 ? "bg-brand-500" : "bg-slate-200 dark:bg-slate-800")} />
                 <span className={clsx("text-xs font-bold uppercase", stage === 1 ? "text-brand-600" : "text-slate-400")}>Hash</span>
             </div>
             <ArrowRight className="w-4 h-4 text-slate-300" />
             <div className="flex items-center gap-1">
                 <div className={clsx("w-3 h-3 rounded-full transition-colors", stage >= 2 ? "bg-rose-500" : "bg-slate-200 dark:bg-slate-800")} />
                 <span className={clsx("text-xs font-bold uppercase", stage === 2 ? "text-rose-600" : "text-slate-400")}>Key</span>
             </div>
             <ArrowRight className="w-4 h-4 text-slate-300" />
             <div className="flex items-center gap-1">
                 <div className={clsx("w-3 h-3 rounded-full transition-colors", stage >= 3 ? "bg-purple-500" : "bg-slate-200 dark:bg-slate-800")} />
                 <span className={clsx("text-xs font-bold uppercase", stage === 3 ? "text-purple-600" : "text-slate-400")}>Sign</span>
             </div>
          </div>

          <div className="flex items-center gap-2">
              {stage === 0 ? (
                  <button onClick={startSimulation} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold flex items-center gap-2">
                      <Play className="w-4 h-4" /> Start
                  </button>
              ) : stage < 4 ? (
                  <button onClick={nextStep} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse shadow-lg shadow-emerald-500/20">
                      Next Step <ChevronRight className="w-4 h-4" />
                  </button>
              ) : (
                  <button onClick={reset} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" /> Reset
                  </button>
              )}
          </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-0 min-h-[500px] border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-950/30">
          
          {/* COLUMN 1: INPUTS */}
          <div className="flex-1 p-6 flex flex-col gap-6 relative">
              
              {/* Message Input */}
              <div className={clsx(
                  "bg-white dark:bg-slate-900 border-2 rounded-2xl p-4 transition-all duration-500 z-10",
                  stage === 1 ? "border-brand-500 shadow-xl scale-105" : "border-slate-200 dark:border-slate-800"
              )}>
                  <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase">1. Message Data</h4>
                  </div>
                  <textarea 
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); reset(); }}
                    disabled={stage > 0}
                    className="w-full h-16 bg-slate-50 dark:bg-slate-950 border-none resize-none font-mono text-xs focus:ring-0 p-2 rounded-lg"
                  />
              </div>

              {/* Private Key */}
              <div className={clsx(
                  "bg-white dark:bg-slate-900 border-2 rounded-2xl p-4 transition-all duration-500 z-10 mt-auto",
                  stage === 2 ? "border-rose-500 shadow-xl scale-105" : "border-slate-200 dark:border-slate-800 opacity-60"
              )}>
                  <div className="flex items-center gap-2 mb-2">
                      <Key className="w-4 h-4 text-slate-400" />
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase">2. Private Key</h4>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-400">
                       {simData.privKey ? "**************" : "Wallet Locked"}
                  </div>
              </div>

              {/* Connecting Pipes (Desktop: Rightwards) */}
              <div className="absolute right-0 top-[20%] w-8 h-1 hidden lg:block">
                  <PipeHorizontal active={stage >= 1} color="bg-brand-500" />
              </div>
              <div className="absolute right-0 bottom-[20%] w-8 h-1 hidden lg:block">
                  <PipeHorizontal active={stage >= 2} color="bg-rose-500" />
              </div>

          </div>

          {/* COLUMN 2: PROCESSOR */}
          <div className="flex-none w-full lg:w-64 bg-slate-100 dark:bg-slate-900 border-y-2 lg:border-y-0 lg:border-x-2 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 relative">
              
              {/* Input Ports (Mobile: Top) */}
              <div className="absolute top-0 w-full flex justify-around lg:hidden">
                   <ArrowDown className={clsx("w-6 h-6", stage >= 1 ? "text-brand-500" : "text-slate-300")} />
                   <ArrowDown className={clsx("w-6 h-6", stage >= 2 ? "text-rose-500" : "text-slate-300")} />
              </div>

              {/* Central CPU */}
              <div className="w-48 h-48 bg-slate-800 rounded-3xl border-4 border-slate-700 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                  
                  {/* Status Light */}
                  <div className="absolute top-3 right-3 flex gap-1">
                      <div className={clsx("w-2 h-2 rounded-full", stage > 0 ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                  </div>

                  {/* Animation Screen */}
                  <AnimatePresence mode='wait'>
                      {stage === 0 && (
                          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-slate-500">
                              <Box className="w-12 h-12 mb-2 opacity-50" />
                              <span className="text-[10px] font-mono uppercase tracking-widest">Awaiting Input</span>
                          </motion.div>
                      )}
                      {stage === 1 && (
                          <motion.div key="hash" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex flex-col items-center text-brand-400">
                              <Hash className="w-12 h-12 mb-2 animate-spin-slow" />
                              <span className="text-[10px] font-mono font-bold">Hashing...</span>
                          </motion.div>
                      )}
                      {stage === 2 && (
                          <motion.div key="key" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="flex flex-col items-center text-rose-400">
                              <Key className="w-12 h-12 mb-2" />
                              <span className="text-[10px] font-mono font-bold">Fetching Key...</span>
                          </motion.div>
                      )}
                      {stage === 3 && (
                          <motion.div key="sign" className="flex flex-col items-center relative">
                               <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-purple-500 rounded-full border-t-transparent w-20 h-20 -m-2" />
                               <Lock className="w-16 h-16 text-purple-400 mb-1" />
                               <span className="text-[10px] font-mono font-bold text-purple-300">Signing...</span>
                          </motion.div>
                      )}
                      {stage === 4 && (
                          <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} className="flex flex-col items-center text-emerald-400">
                              <CheckCircle className="w-16 h-16 mb-1" />
                              <span className="text-[10px] font-mono font-bold">Generated</span>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>

              {/* Output Pipe (Desktop: Right) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-1 hidden lg:block">
                  <PipeHorizontal active={stage >= 4} color="bg-emerald-500" />
              </div>

          </div>

          {/* COLUMN 3: OUTPUT */}
          <div className="flex-1 p-6 flex items-center justify-center bg-white dark:bg-slate-900 relative">
              
              <div className={clsx(
                  "w-full bg-slate-50 dark:bg-slate-950 border-2 rounded-2xl p-6 transition-all duration-500 min-h-[200px] flex flex-col items-center justify-center text-center",
                  stage === 4 ? "border-emerald-500 shadow-xl ring-4 ring-emerald-500/10" : "border-slate-200 dark:border-slate-800 opacity-50"
              )}>
                  <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck className={clsx("w-5 h-5", stage === 4 ? "text-emerald-500" : "text-slate-400")} />
                      <h4 className={clsx("font-bold text-sm uppercase", stage === 4 ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400")}>Digital Signature</h4>
                  </div>

                  {stage === 4 ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                      >
                           <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 mb-4">
                                <div className="font-mono text-[10px] text-emerald-800 dark:text-emerald-300 break-all leading-tight">
                                    {simData.signature.substring(0, 128)}...
                                </div>
                           </div>
                           <p className="text-[10px] text-slate-500">
                               This unique code proves <strong>YOU</strong> sent <strong>"{message}"</strong>.
                           </p>
                      </motion.div>
                  ) : (
                      <span className="text-xs text-slate-400 italic">Waiting for simulation...</span>
                  )}
              </div>

          </div>

      </div>
    </div>
  );
};