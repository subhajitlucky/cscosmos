import React, { useState } from 'react';
import { generateKeyPair } from '../../utils/crypto';
import type { KeyPair } from '../../utils/crypto';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Key, Lock, Unlock, PenTool, ArrowRight, FileText, RefreshCw, ChevronRight, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

// --- Components ---

const KeyIcon = ({ type, owner, color }: { type: 'public' | 'private', owner: string, color: string }) => (
    <div className={clsx("flex flex-col items-center gap-1", color)}>
        <div className={clsx("p-2 rounded-lg border-2 bg-white dark:bg-slate-900 shadow-sm", color.replace('text-', 'border-'))}>
            {type === 'private' ? <Key className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
        </div>
        <span className="text-[10px] font-black uppercase whitespace-nowrap">{owner} {type === 'private' ? 'Priv' : 'Pub'}</span>
    </div>
);

export const EncryptionFlow: React.FC = () => {
  const [aliceKeys, setAliceKeys] = useState<KeyPair | null>(null);
  const [bobKeys, setBobKeys] = useState<KeyPair | null>(null);
  
  // 0: Setup, 1: Sign, 2: Encrypt, 3: Transmit, 4: Decrypt, 5: Verify
  const [step, setStep] = useState(0);

  const handleGenKeys = async (actor: 'alice' | 'bob') => {
      const k = await generateKeyPair();
      if (actor === 'alice') setAliceKeys(k);
      else setBobKeys(k);
  };

  const nextStep = () => {
      setStep(prev => (prev + 1) % 6);
  };

  const reset = () => {
      setStep(0);
  };

  const ready = aliceKeys && bobKeys;

  const steps = [
    { label: 'Sign', color: 'text-rose-600' },
    { label: 'Encrypt', color: 'text-emerald-600' },
    { label: 'Send', color: 'text-indigo-600' },
    { label: 'Decrypt', color: 'text-emerald-600' },
    { label: 'Verify', color: 'text-rose-600' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 md:space-y-12 pb-8 md:pb-0">
      
      {/* 1. SETUP PHASE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* ALICE */}
          <div className={clsx(
              "p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all duration-500",
              step <= 2 ? "bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/50 shadow-xl" : "bg-slate-50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-50"
          )}>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                          <User className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                          <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Alice</h3>
                          <div className="text-[9px] md:text-[10px] font-black text-rose-500 uppercase tracking-widest">Sender</div>
                      </div>
                  </div>
                  {!aliceKeys && (
                    <button 
                        onClick={() => handleGenKeys('alice')} 
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm"
                    >
                        Create Identity
                    </button>
                  )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                      <div className="text-[8px] md:text-[10px] uppercase font-bold text-slate-400 mb-2">Signature Engine</div>
                      {aliceKeys ? <KeyIcon type="private" owner="Alice" color="text-rose-500" /> : <div className="h-10 w-10 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />}
                  </div>
                  <div className="p-2 md:p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                      <div className="text-[8px] md:text-[10px] uppercase font-bold text-slate-400 mb-2">Origin Verifier</div>
                      {aliceKeys ? <KeyIcon type="public" owner="Alice" color="text-rose-500" /> : <div className="h-10 w-10 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />}
                  </div>
              </div>
          </div>

          {/* BOB */}
          <div className={clsx(
              "p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all duration-500",
              (step === 0 || step >= 3) ? "bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/50 shadow-xl" : "bg-slate-50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-50"
          )}>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                          <User className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                          <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Bob</h3>
                          <div className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest">Receiver</div>
                      </div>
                  </div>
                  {!bobKeys && (
                    <button 
                        onClick={() => handleGenKeys('bob')} 
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm"
                    >
                        Create Identity
                    </button>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                      <div className="text-[8px] md:text-[10px] uppercase font-bold text-slate-400 mb-2">Decryption Unit</div>
                      {bobKeys ? <KeyIcon type="private" owner="Bob" color="text-emerald-500" /> : <div className="h-10 w-10 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />}
                  </div>
                  <div className="p-2 md:p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                      <div className="text-[8px] md:text-[10px] uppercase font-bold text-slate-400 mb-2">Public Encrypter</div>
                      {bobKeys ? <KeyIcon type="public" owner="Bob" color="text-emerald-500" /> : <div className="h-10 w-10 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />}
                  </div>
              </div>
          </div>
      </div>

      {/* 2. THE STAGE */}
      <div className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl md:rounded-[2.5rem] p-4 md:p-8 min-h-[450px] md:min-h-[500px] flex flex-col items-center justify-center overflow-hidden shadow-2xl">
          
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          {/* Step Indicator - Responsive */}
          <div className="absolute top-4 md:top-8 left-0 w-full flex justify-center px-4">
              <div className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 md:px-6 py-2 md:py-3 rounded-full shadow-sm flex items-center gap-1.5 md:gap-4 overflow-x-auto max-w-full no-scrollbar">
                  {steps.map((s, idx) => (
                    <React.Fragment key={idx}>
                        <div className="flex flex-col items-center">
                            <span className={clsx(
                                "text-[8px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest transition-colors duration-300", 
                                step === idx + 1 ? s.color : "text-slate-300 dark:text-slate-700"
                            )}>
                                {idx + 1}. {s.label}
                            </span>
                            {step === idx + 1 && (
                                <motion.div layoutId="stepDot" className={clsx("w-1 h-1 rounded-full mt-0.5", s.color.replace('text-', 'bg-'))} />
                            )}
                        </div>
                        {idx < steps.length - 1 && (
                            <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-200 dark:text-slate-800 flex-shrink-0" />
                        )}
                    </React.Fragment>
                  ))}
              </div>
          </div>

          {/* MAIN ANIMATION CONTAINER */}
          <div className="relative z-10 w-full flex items-center justify-center h-64 md:h-80 mt-12">
              
              {/* THE DATA PACKET */}
              <AnimatePresence mode="wait">
                  <motion.div
                    key={step === 3 ? 'transmit' : 'idle'}
                    className="relative"
                    initial={{ x: step === 3 ? -150 : 0, opacity: 0, scale: 0.8 }}
                    animate={{ x: step === 3 ? 150 : 0, opacity: 1, scale: 1 }}
                    transition={{ 
                        x: { duration: 2, repeat: step === 3 ? Infinity : 0, ease: "linear" },
                        opacity: { duration: 0.5 }
                    }}
                  >
                        {/* Outer Box (Encryption Layer) */}
                        <motion.div 
                            layout
                            className={clsx(
                                "w-48 h-36 md:w-64 md:h-48 rounded-2xl border-2 md:border-4 flex items-center justify-center relative transition-all duration-700",
                                step >= 2 && step <= 4 
                                    ? "bg-slate-900 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]" 
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                            )}
                        >
                            {/* Inner Document (Message) */}
                            <AnimatePresence>
                                {!(step >= 2 && step <= 4) && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div className="relative">
                                            <FileText className="w-10 h-10 md:w-16 md:h-16 text-slate-200 dark:text-slate-800" />
                                            <motion.div 
                                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <div className="w-4 md:w-6 h-0.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                            </motion.div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Secret Plans</div>
                                            <div className="text-[8px] md:text-[9px] font-bold text-slate-400">ENCRYPTED_TUNNEL.DAT</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* SIGNATURE STAMP (Alice's Seal) */}
                            <AnimatePresence>
                                {step >= 1 && (
                                    <motion.div 
                                        initial={{ scale: 2, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-30"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-rose-600 border-2 border-rose-400 text-white flex items-center justify-center shadow-lg">
                                                <PenTool className="w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                            {step === 1 && (
                                                <motion.div 
                                                    initial={{y:5, opacity:0}} 
                                                    animate={{y:0, opacity:1}} 
                                                    className="absolute top-10 md:top-12 whitespace-nowrap bg-rose-600 text-white text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded shadow-sm"
                                                >
                                                    Alice's Seal
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ENCRYPTION LOCK (Bob's Lock) */}
                            <AnimatePresence>
                                {step >= 2 && step <= 4 && (
                                    <motion.div 
                                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                        className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/40 rounded-xl z-20"
                                    >
                                        <motion.div
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Lock className="w-10 h-10 md:w-16 md:h-16 text-emerald-400 mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                        </motion.div>
                                        <div className="text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Bob's Key Required</div>
                                        {step === 2 && (
                                            <motion.div initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} className="mt-2 bg-emerald-400 text-emerald-950 text-[8px] font-black uppercase px-2 py-0.5 rounded">
                                                Active Armor
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* VERIFICATION SUCCESS */}
                            <AnimatePresence>
                                {step === 5 && (
                                    <motion.div 
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute -top-4 -left-4 md:-top-6 md:-left-6 z-40 bg-emerald-500 text-white p-2 md:p-3 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-white dark:border-slate-900"
                                    >
                                        <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest hidden sm:block">Origin Verified</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </motion.div>
                  </motion.div>
              </AnimatePresence>

              {/* ACTION: KEYS FLYING IN - Responsive positions */}
              <AnimatePresence>
                  {step === 1 && (
                      <motion.div 
                        initial={{ x: -200, y: -50, opacity: 0 }} animate={{ x: -100, y: -80, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute left-1/2 ml-[-12px] md:ml-[-100px] z-30 pointer-events-none md:scale-125"
                      >
                          <KeyIcon type="private" owner="Alice" color="text-rose-500" />
                      </motion.div>
                  )}
                  {step === 2 && (
                      <motion.div 
                        initial={{ x: 200, y: -50, opacity: 0 }} animate={{ x: 100, y: -80, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute left-1/2 ml-[-12px] md:ml-[-100px] z-30 pointer-events-none md:scale-125"
                      >
                          <KeyIcon type="public" owner="Bob" color="text-emerald-500" />
                      </motion.div>
                  )}
                  {step === 4 && (
                      <motion.div 
                        initial={{ x: 200, y: -50, opacity: 0 }} animate={{ x: 100, y: -80, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute left-1/2 ml-[-12px] md:ml-[-100px] z-30 pointer-events-none md:scale-125"
                      >
                          <KeyIcon type="private" owner="Bob" color="text-emerald-500" />
                      </motion.div>
                  )}
                  {step === 5 && (
                      <motion.div 
                        initial={{ x: -200, y: -50, opacity: 0 }} animate={{ x: -100, y: -80, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute left-1/2 ml-[-12px] md:ml-[-100px] z-30 pointer-events-none md:scale-125"
                      >
                          <KeyIcon type="public" owner="Alice" color="text-rose-500" />
                      </motion.div>
                  )}
              </AnimatePresence>

          </div>

          {/* 3. EXPLANATION & CONTROL */}
          <div className="w-full max-w-lg mx-auto mt-4 md:mt-8 flex flex-col items-center">
              <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 dark:border-slate-800 mb-6 min-h-[120px] md:min-h-[140px] flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-20" />
                  <AnimatePresence mode="wait">
                    <motion.p 
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed text-center"
                    >
                        {step === 0 && "Alice wants to send a secret document to Bob. She also wants to prove it's from her."}
                        {step === 1 && "Alice signs the document with her PRIVATE Key. This creates a unique 'seal' that only her public key can verify."}
                        {step === 2 && "Alice encrypts the document with Bob's PUBLIC Key. Now, ONLY Bob's private key can unlock it."}
                        {step === 3 && "The packet is sent through the public web. To anyone else, it looks like random, unreadable noise."}
                        {step === 4 && "Bob receives the packet and uses his PRIVATE Key to unlock it. The original document is revealed."}
                        {step === 5 && "Bob verifies Alice's seal using her PUBLIC Key. Since it matches, he knows the data is authentic."}
                    </motion.p>
                  </AnimatePresence>
              </div>

              {!ready ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/10 rounded-full border border-rose-100 dark:border-rose-900/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Initialization Required</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter text-center px-4">Generate keys for both Alice and Bob to start the simulation</p>
                  </div>
              ) : (
                  <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0">
                      {step < 5 ? (
                          <button 
                            onClick={nextStep} 
                            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                              Next Phase <ChevronRight className="w-4 h-4" />
                          </button>
                      ) : (
                          <button 
                            onClick={reset} 
                            className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                          >
                              <RefreshCw className="w-4 h-4" /> Reset Cycle
                          </button>
                      )}
                  </div>
              )}
          </div>

      </div>
    </div>
  );
};