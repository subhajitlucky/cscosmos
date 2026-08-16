import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Unlock, Mail, User, ArrowRight, Shield } from 'lucide-react';
import clsx from 'clsx';

export const PublicKeyDemo: React.FC = () => {
  const [activeView, setActiveView] = useState<'public' | 'private'>('public');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      
      {/* Intro Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-600 rounded-lg text-white">
                 <Key className="w-5 h-5" />
             </div>
             <h4 className="font-bold text-lg text-indigo-900 dark:text-indigo-200">The Power of Two Keys</h4>
          </div>
          <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed max-w-3xl">
              Symmetric encryption (like the Caesar Cipher) has a flaw: you have to share the secret key. 
              <strong> Public Key Cryptography</strong> solves this by using TWO keys: one for locking (Public) and one for unlocking (Private).
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* PUBLIC KEY CARD */}
          <div 
            onClick={() => setActiveView('public')}
            className={clsx(
              "cursor-pointer group relative p-8 rounded-3xl border-2 transition-all duration-300 overflow-hidden",
              activeView === 'public' 
                ? "bg-white dark:bg-slate-900 border-emerald-500 shadow-xl scale-105 z-10" 
                : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
            )}
          >
              <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600">
                      <Unlock className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">Share with Everyone</span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Public Key</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Your "Mailbox Address". Anyone can use this to send you a message or verify your signature.
              </p>

              {/* Visual Metaphor */}
              <div className="h-32 bg-emerald-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center relative">
                  <User className="w-8 h-8 text-slate-300 absolute left-4" />
                  <ArrowRight className="w-6 h-6 text-emerald-400" />
                  <div className="w-16 h-20 bg-emerald-200 dark:bg-emerald-800 rounded-t-full rounded-b-lg border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg mx-4">
                      <div className="w-8 h-1 bg-emerald-900/20 rounded-full" />
                  </div>
                  <User className="w-8 h-8 text-slate-300 absolute right-4" />
              </div>
          </div>

          {/* PRIVATE KEY CARD */}
          <div 
            onClick={() => setActiveView('private')}
            className={clsx(
              "cursor-pointer group relative p-8 rounded-3xl border-2 transition-all duration-300 overflow-hidden",
              activeView === 'private' 
                ? "bg-white dark:bg-slate-900 border-rose-500 shadow-xl scale-105 z-10" 
                : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
            )}
          >
              <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl text-rose-600">
                      <Key className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-black text-rose-600 uppercase tracking-widest bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full">Keep Secret</span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Private Key</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Your "Mailbox Key". Only you have this. It opens messages sent to your public address and signs documents.
              </p>

              {/* Visual Metaphor */}
              <div className="h-32 bg-rose-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-rose-200 dark:border-rose-800/50 flex items-center justify-center relative">
                  <div className="w-16 h-20 bg-rose-200 dark:bg-rose-800 rounded-t-full rounded-b-lg border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg relative">
                      <div className="absolute -right-8 top-8">
                          <Key className="w-8 h-8 text-rose-500 -rotate-45" />
                      </div>
                      <div className="text-[10px] font-bold text-rose-800 dark:text-rose-200 uppercase">You</div>
                  </div>
              </div>
          </div>

      </div>

      {/* Interactive Explanation */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield className="w-64 h-64" />
          </div>

          <div className="relative z-10">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  {activeView === 'public' ? <Unlock className="w-6 h-6 text-emerald-400" /> : <Key className="w-6 h-6 text-rose-400" />}
                  {activeView === 'public' ? 'The Public Key Role' : 'The Private Key Role'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                          {activeView === 'public' 
                            ? "Think of this like your email address or your home address. You WANT people to have it so they can find you. It is mathematically generated from your private key, but you can't work backwards to find the secret."
                            : "This is the master key to your digital life. If someone steals this, they can read your messages and impersonate you. In blockchain, your Private Key IS your money."
                          }
                      </p>
                      <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Capabilities</div>
                          <ul className="space-y-2 text-sm">
                              {activeView === 'public' ? (
                                  <>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Verify Signatures (Check authenticity)</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Encrypt Messages (Send to owner)</li>
                                  </>
                              ) : (
                                  <>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-rose-500" /> Sign Transactions (Prove identity)</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-rose-500" /> Decrypt Messages (Read inbox)</li>
                                  </>
                              )}
                          </ul>
                      </div>
                  </div>

                  <div className="flex items-center justify-center">
                      <AnimatePresence mode='wait'>
                          {activeView === 'public' ? (
                              <motion.div 
                                key="public-anim"
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-emerald-500/10 p-6 rounded-full border-2 border-emerald-500/50"
                              >
                                  <Mail className="w-24 h-24 text-emerald-400" />
                              </motion.div>
                          ) : (
                              <motion.div 
                                key="private-anim"
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-rose-500/10 p-6 rounded-full border-2 border-rose-500/50"
                              >
                                  <Key className="w-24 h-24 text-rose-400" />
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};

// Helper for check icons
const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);