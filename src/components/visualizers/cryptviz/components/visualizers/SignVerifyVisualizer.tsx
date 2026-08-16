import React, { useState } from 'react';
import { generateKeyPair, signMessage, verifySignature } from '../../utils/crypto';
import type { KeyPair } from '../../utils/crypto';
import { motion } from 'framer-motion';
import { User, Key, Unlock, ShieldCheck, PenTool, RefreshCw, AlertCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

export const SignVerifyVisualizer: React.FC = () => {
  const [keys, setKeys] = useState<KeyPair | null>(null);
  const [message, setMessage] = useState('Transfer 1.5 BTC to Bob');
  const [signature, setSignature] = useState('');
  
  // Bob's side
  const [receivedMessage, setReceivedMessage] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Simulation Stages: 0: Setup, 1: Alice Signs, 2: Bob Verifies
  const [stage, setStage] = useState(0);

  const handleGenKeys = async () => {
      const k = await generateKeyPair();
      setKeys(k);
      setStage(1);
  };

  const handleSign = async () => {
      if (!keys) return;
      const sig = await signMessage(message, keys.privateKey);
      setSignature(sig);
      setReceivedMessage(message);
      setStage(2);
  };

  const handleVerify = async () => {
      if (!keys || !signature) return;
      setIsVerifying(true);
      setTimeout(async () => {
          const isValid = await verifySignature(receivedMessage, signature, keys.publicKey);
          setVerificationResult(isValid);
          setIsVerifying(false);
      }, 1500);
  };

  const tamper = () => {
      setReceivedMessage(prev => prev + " "); // Add a space to tamper
      setVerificationResult(null);
  };

  const reset = () => {
      setStage(0);
      setKeys(null);
      setSignature('');
      setVerificationResult(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      
      {/* Educational Context */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin-slow" />
          </div>
          <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg">The Asymmetric Handshake</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Signing happens in <strong>Private</strong>. Verification happens in <strong>Public</strong>. 
                  Bob can verify the signature using Alice's <strong>Public Key</strong> without ever knowing her <strong>Private Key</strong>. 
                  This is the fundamental breakthrough of modern cryptography.
              </p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-4 border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-950 shadow-2xl">
          
          {/* ALICE'S WORLD (PRIVATE) */}
          <div className="p-8 lg:border-r-4 border-slate-200 dark:border-slate-800 relative">
              <div className="absolute top-0 left-0 bg-rose-500 text-white px-6 py-1 rounded-br-2xl text-[10px] font-black uppercase tracking-widest">Alice's Secure Space</div>
              
              <div className="space-y-8 mt-6">
                  {/* Identity */}
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <User className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                              <div className="font-bold text-slate-900 dark:text-white">Alice (Sender)</div>
                              <div className="text-[10px] text-slate-500 font-mono uppercase">Private Owner</div>
                          </div>
                      </div>
                      {stage === 0 && (
                          <button onClick={handleGenKeys} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                              Generate Keys
                          </button>
                      )}
                  </div>

                  {/* Keys Area */}
                  <div className="grid grid-cols-2 gap-4">
                      <div className={clsx("p-4 rounded-2xl border-2 transition-all duration-500", keys ? "border-rose-500/30 bg-rose-50 dark:bg-rose-900/10" : "border-slate-100 dark:border-slate-900 opacity-20")}>
                          <div className="flex items-center gap-2 mb-2 text-rose-600">
                              <Key className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase">Private Key</span>
                          </div>
                          <div className="text-[10px] font-mono text-rose-800 dark:text-rose-400 break-all leading-tight">
                              {keys ? keys.privateKeyHex.substring(0, 32) : "••••••••••••"}
                          </div>
                      </div>
                      <div className={clsx("p-4 rounded-2xl border-2 transition-all duration-500", keys ? "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10" : "border-slate-100 dark:border-slate-900 opacity-20")}>
                          <div className="flex items-center gap-2 mb-2 text-emerald-600">
                              <Unlock className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase">Public Key</span>
                          </div>
                          <div className="text-[10px] font-mono text-emerald-800 dark:text-emerald-400 break-all leading-tight">
                              {keys ? keys.publicKeyHex.substring(0, 32) : "••••••••••••"}
                          </div>
                      </div>
                  </div>

                  {/* Message & Signing */}
                  <div className={clsx("space-y-4 transition-all duration-500", stage >= 1 ? "opacity-100" : "opacity-20 pointer-events-none grayscale")}>
                       <div>
                           <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">1. Message to Sign</label>
                           <textarea 
                             value={message}
                             onChange={(e) => { setMessage(e.target.value); setSignature(''); }}
                             className="w-full h-24 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-mono focus:border-indigo-500 transition-all resize-none shadow-inner"
                           />
                       </div>

                       {!signature ? (
                           <button onClick={handleSign} className="w-full p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3">
                               <PenTool className="w-4 h-4" /> Sign Message
                           </button>
                       ) : (
                           <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                               <div className="flex items-center gap-2 mb-2 text-slate-500">
                                   <ShieldCheck className="w-4 h-4" />
                                   <span className="text-[10px] font-black uppercase">Message Signed!</span>
                               </div>
                               <div className="text-[8px] font-mono text-slate-400 break-all leading-tight">
                                   SIG: {signature.substring(0, 64)}...
                               </div>
                           </div>
                       )}
                  </div>
              </div>
          </div>

          {/* BOB'S WORLD (PUBLIC) */}
          <div className="p-8 bg-slate-50/50 dark:bg-slate-900/30 relative flex flex-col">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">Bob's Verification Space</div>
              
              <div className={clsx("space-y-8 mt-6 flex-grow transition-all duration-500", stage >= 2 ? "opacity-100" : "opacity-20 pointer-events-none grayscale")}>
                   {/* Identity */}
                   <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                           <User className="w-6 h-6 text-slate-400" />
                       </div>
                       <div>
                           <div className="font-bold text-slate-900 dark:text-white">Bob (Receiver)</div>
                           <div className="text-[10px] text-slate-500 font-mono uppercase">Public Verifier</div>
                       </div>
                   </div>

                   {/* Verification Panel */}
                   <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex-grow">
                        <div className="space-y-6">
                             <div>
                                 <div className="flex justify-between items-center mb-2">
                                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">2. Received Message</label>
                                     <button onClick={tamper} className="text-[8px] font-black bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded uppercase hover:bg-rose-200 transition-colors flex items-center gap-1">
                                         <AlertCircle className="w-2.5 h-2.5" /> Tamper Data
                                     </button>
                                 </div>
                                 <div className={clsx(
                                     "p-4 rounded-xl border-2 font-mono text-sm min-h-[80px] break-all transition-colors",
                                     receivedMessage !== message ? "border-rose-500 bg-rose-50 dark:bg-rose-900/10 text-rose-900 dark:text-rose-100" : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                                 )}>
                                     {receivedMessage}
                                 </div>
                             </div>

                             <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                                 <div className="flex items-center gap-2 mb-2 text-emerald-600">
                                     <Unlock className="w-3 h-3" />
                                     <span className="text-[10px] font-black uppercase">Using Alice's Public Key</span>
                                 </div>
                                 <p className="text-[10px] text-emerald-700/70 dark:text-emerald-400/70 leading-relaxed italic">
                                     Bob uses the Public Key (available to everyone) to run the math against the signature.
                                 </p>
                             </div>

                             {verificationResult === null ? (
                                 <button 
                                    onClick={handleVerify}
                                    disabled={isVerifying}
                                    className="w-full p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                                 >
                                     {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                     {isVerifying ? "Running Math..." : "Verify Identity"}
                                 </button>
                             ) : (
                                 <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    className={clsx(
                                        "p-6 rounded-2xl border-4 text-center flex flex-col items-center gap-2",
                                        verificationResult ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"
                                    )}
                                 >
                                     {verificationResult ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                                     <div className="font-black text-xl uppercase tracking-tighter">
                                         {verificationResult ? "Authentic" : "Tampered / Fake"}
                                     </div>
                                     <p className="text-[10px] font-bold opacity-80 leading-tight">
                                         {verificationResult 
                                            ? "Mathematical proof confirms this message came from Alice." 
                                            : "The signature does not match the data. Trust rejected."}
                                     </p>
                                     <button onClick={() => setVerificationResult(null)} className="mt-2 text-[10px] underline uppercase font-black opacity-40 hover:opacity-100 transition-opacity">Clear Result</button>
                                 </motion.div>
                             )}
                        </div>
                   </div>
              </div>

              {stage === 2 && (
                  <button onClick={reset} className="mt-8 mx-auto text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                      <RotateCcw className="w-3 h-3" /> Start New Simulation
                  </button>
              )}
          </div>

      </div>

      {/* Formula Cheat Sheet */}
      <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck className="w-64 h-64" />
          </div>
          <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-brand-500" />
              Technical Logic for Senior Devs
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">1. The Signing Step</div>
                  <div className="p-4 bg-slate-800 rounded-2xl font-mono text-sm border border-slate-700">
                      <span className="text-rose-400">Signature</span> = <span className="text-indigo-400">Encrypt</span>( <span className="text-brand-400">Hash</span>(message), <span className="text-rose-400">Private_Key</span> )
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                      We don't sign the message itself (too slow). We sign the small <strong>Hash</strong>. If the message changes by one bit, the hash changes, and the signature will no longer match.
                  </p>
              </div>
              <div className="space-y-4">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">2. The Verification Step</div>
                  <div className="p-4 bg-slate-800 rounded-2xl font-mono text-sm border border-slate-700">
                      <span className="text-emerald-400">Decrypted_Hash</span> = <span className="text-indigo-400">Decrypt</span>( <span className="text-rose-400">Signature</span>, <span className="text-emerald-400">Public_Key</span> )
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                      Bob decrypts the signature to see the original hash. He then calculates the hash of the message he received. If <strong>Calculated_Hash === Decrypted_Hash</strong>, the message is 100% authentic.
                  </p>
              </div>
          </div>
      </div>

    </div>
  );
};