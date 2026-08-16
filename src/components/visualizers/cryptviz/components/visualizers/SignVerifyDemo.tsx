import React, { useState, useRef } from 'react';
import { generateKeyPair, signMessage, verifySignature } from '../../utils/crypto';
import type { KeyPair } from '../../utils/crypto';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, PenTool, ShieldCheck, AlertTriangle, Lock, Unlock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

interface Coords {
    x: number;
    y: number;
}

interface Packet {
    id: number;
    from: Coords;
    to: Coords;
    color: string;
    delay?: number;
}

// Simple component for animated data packet
const DataPacket = ({ from, to, delay = 0, color = "bg-brand-500", onComplete }: { from: Coords, to: Coords, delay?: number, color?: string, onComplete: () => void }) => {
    return (
        <motion.div
            initial={{ left: from.x, top: from.y, opacity: 1, scale: 0 }}
            animate={{ left: to.x, top: to.y, opacity: 0, scale: 1 }}
            transition={{ duration: 0.8, delay, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
            className={`absolute w-3 h-3 rounded-full ${color} shadow-lg shadow-${color}/50 z-50 pointer-events-none`}
        />
    );
};

export const SignVerifyDemo: React.FC = () => {
  const [keys, setKeys] = useState<KeyPair | null>(null);
  const [message, setMessage] = useState('Pay $500 to Alice');
  const [signature, setSignature] = useState<string | null>(null);
  const [verifyMsg, setVerifyMsg] = useState('Pay $500 to Alice');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Animation States
  const [packets, setPackets] = useState<Packet[]>([]);
  
  // Refs for coordinate tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const privKeyRef = useRef<HTMLDivElement>(null);
  const pubKeyRef = useRef<HTMLDivElement>(null);
  const msgInputRef = useRef<HTMLTextAreaElement>(null);
  const sigOutputRef = useRef<HTMLDivElement>(null);
  const verifyBtnRef = useRef<HTMLButtonElement>(null);
  const verifyInputRef = useRef<HTMLTextAreaElement>(null);

  const getCoords = (ref: React.RefObject<HTMLElement | null>) => {
      if (!ref.current || !containerRef.current) return { x: 0, y: 0 };
      const rect = ref.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
      };
  };

  const handleGenerateKeys = async () => {
    const k = await generateKeyPair();
    setKeys(k);
    setSignature(null);
    setVerificationResult(null);
  };

  const handleSign = async () => {
    if (!keys) return;
    
    const msgCoords = getCoords(msgInputRef);
    const keyCoords = getCoords(privKeyRef);
    const sigCoords = getCoords(sigOutputRef);

    setPackets([
        // Darker packet for light mode visibility
        { id: Date.now() + 1, from: msgCoords, to: sigCoords, color: "bg-slate-600 dark:bg-slate-200" },
        { id: Date.now() + 2, from: keyCoords, to: sigCoords, color: "bg-rose-500", delay: 0.1 }
    ]);

    setTimeout(async () => {
        const sig = await signMessage(message, keys.privateKey);
        setSignature(sig);
        setVerifyMsg(message);
        setVerificationResult(null);
    }, 600);
  };

  const handleVerify = async () => {
    if (!keys || !signature) return;
    setIsVerifying(true);
    
    const msgCoords = getCoords(verifyInputRef);
    const sigCoords = getCoords(sigOutputRef);
    const keyCoords = getCoords(pubKeyRef);
    const btnCoords = getCoords(verifyBtnRef);

    setPackets([
        { id: Date.now() + 3, from: msgCoords, to: btnCoords, color: "bg-slate-600 dark:bg-slate-200" },
        { id: Date.now() + 4, from: sigCoords, to: btnCoords, color: "bg-indigo-500 dark:bg-brand-400", delay: 0.1 },
        { id: Date.now() + 5, from: keyCoords, to: btnCoords, color: "bg-emerald-500", delay: 0.2 }
    ]);

    setTimeout(async () => {
      const isValid = await verifySignature(verifyMsg, signature, keys.publicKey);
      setVerificationResult(isValid);
      setIsVerifying(false);
    }, 800);
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto space-y-8 relative">
      
      {packets.map(p => (
          <DataPacket 
            key={p.id} 
            from={p.from} 
            to={p.to} 
            color={p.color} 
            delay={p.delay} 
            onComplete={() => setPackets(prev => prev.filter(i => i.id !== p.id))} 
          />
      ))}

      {/* 1. KEY GENERATION */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 relative overflow-hidden transition-colors duration-300 shadow-lg dark:shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Key className="w-5 h-5 text-indigo-600 dark:text-brand-400" />
            1. Digital Identity
          </h3>
          <button
            onClick={handleGenerateKeys}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-brand-600 dark:hover:bg-brand-500 text-white rounded-lg text-sm font-bold transition-colors shadow-md shadow-indigo-500/20"
          >
            {keys ? 'Regenerate Keys' : 'Generate Key Pair'}
          </button>
        </div>

        {!keys ? (
          <div className="h-32 flex items-center justify-center text-slate-500 font-medium border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/50">
            Generate keys to start
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              ref={privKeyRef}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg relative"
            >
              <div className="flex items-center gap-2 mb-2 text-rose-700 dark:text-rose-400 font-bold text-sm uppercase">
                <Lock className="w-4 h-4" /> Private Key
              </div>
              <p className="text-xs text-rose-600 dark:text-rose-200/50 mb-2 font-medium">Used for Signing (Input)</p>
              <code className="block p-3 bg-white dark:bg-slate-950 rounded text-xs font-mono text-rose-700 dark:text-rose-300 break-all h-20 overflow-hidden border border-rose-100 dark:border-transparent shadow-sm">
                {keys.privateKeyHex}
              </code>
              <div className="absolute -right-3 top-1/2 w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-500/50" />
            </motion.div>
            
            <motion.div 
              ref={pubKeyRef}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-lg relative"
            >
              <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm uppercase">
                <Unlock className="w-4 h-4" /> Public Key
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-200/50 mb-2 font-medium">Used for Verification (Input)</p>
              <code className="block p-3 bg-white dark:bg-slate-950 rounded text-xs font-mono text-emerald-700 dark:text-emerald-300 break-all h-20 overflow-hidden border border-emerald-100 dark:border-transparent shadow-sm">
                {keys.publicKeyHex}
              </code>
               <div className="absolute -left-3 top-1/2 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
            </motion.div>
          </div>
        )}
      </section>

      {/* 2. SIGNING */}
      <section className={clsx("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-all duration-500 relative shadow-lg dark:shadow-sm", !keys && "opacity-50 pointer-events-none grayscale")}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <PenTool className="w-5 h-5 text-indigo-600 dark:text-brand-400" />
            2. Sign Message
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2">Message</label>
            <textarea
              ref={msgInputRef}
              value={message}
              onChange={(e) => {
                  setMessage(e.target.value);
                  setSignature(null);
                  setVerificationResult(null);
              }}
              className="w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-brand-500 transition-all font-mono shadow-inner"
            />
          </div>

          <div className="md:col-span-2 flex flex-col items-center justify-center relative">
             <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 dark:bg-slate-800 -z-10" />
            <button
              onClick={handleSign}
              disabled={!keys}
              className="group flex flex-col items-center gap-2 p-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10 border-4 border-white dark:border-slate-900 shadow-md"
            >
              <div className="p-2 bg-white dark:bg-slate-950 rounded-full group-hover:scale-110 transition-transform">
                <PenTool className="w-6 h-6 text-slate-700 dark:text-slate-200" />
              </div>
            </button>
             <span className="text-xs font-bold text-slate-500 mt-2 bg-white dark:bg-slate-900 px-2 rounded">Click to Sign</span>
          </div>

          <div className="md:col-span-5 relative">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2">Digital Signature</label>
            <div 
              ref={sigOutputRef}
              className={clsx(
                "w-full h-32 bg-slate-50 dark:bg-slate-950 border rounded-lg p-3 text-xs font-mono break-all overflow-y-auto transition-colors relative shadow-inner",
                signature 
                  ? "text-indigo-800 dark:text-brand-300 border-indigo-200 dark:border-brand-900 bg-indigo-50/50 dark:bg-transparent font-medium" 
                  : "text-slate-400 dark:text-slate-600 border-slate-300 dark:border-slate-700"
              )}
            >
              {signature || "Waiting for signature..."}
            </div>
          </div>
        </div>
      </section>

      {/* 3. VERIFICATION */}
      <section className={clsx("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-all duration-500 shadow-lg dark:shadow-sm", !signature && "opacity-50 pointer-events-none grayscale")}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-brand-400" />
            3. Verification
          </h3>
          <div className="text-sm text-slate-500">
            Receiver checks: <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">Verify(Msg, Sig, PubKey)</span>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            
            <div className="flex-grow w-full">
               <div className="flex justify-between mb-2">
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-400">Received Message</label>
                 {verifyMsg !== message && (
                   <span className="text-xs text-rose-700 font-bold flex items-center gap-1 bg-rose-100 dark:bg-rose-900/20 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                     <AlertTriangle className="w-3 h-3" /> TAMPERED
                   </span>
                 )}
               </div>
               <textarea
                ref={verifyInputRef}
                value={verifyMsg}
                onChange={(e) => {
                    setVerifyMsg(e.target.value);
                    setVerificationResult(null);
                }}
                className={clsx(
                  "w-full h-24 bg-white dark:bg-slate-900 border rounded-lg p-3 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-brand-500 transition-all font-mono shadow-inner",
                  verifyMsg !== message ? "border-rose-400 focus:border-rose-500 ring-rose-200 dark:ring-rose-900" : "border-slate-300 dark:border-slate-700"
                )}
              />
            </div>

            <div className="flex flex-col items-center justify-center min-w-[150px] space-y-4">
               <button
                 ref={verifyBtnRef}
                 onClick={handleVerify}
                 disabled={isVerifying}
                 className={clsx(
                   "w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2",
                   verificationResult === true ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" :
                   verificationResult === false ? "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20" :
                   "bg-indigo-600 hover:bg-indigo-500 dark:bg-brand-600 dark:hover:bg-brand-500 shadow-indigo-500/20"
                 )}
               >
                 {isVerifying ? (
                   <RefreshCw className="w-5 h-5 animate-spin" />
                 ) : (
                   <ShieldCheck className="w-5 h-5" />
                 )}
                 {verificationResult === null ? "Verify Signature" : "Verify Again"}
               </button>

               <AnimatePresence mode='wait'>
                 {verificationResult === true && (
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                     className="flex flex-col items-center text-emerald-600 dark:text-emerald-400"
                   >
                     <CheckCircle className="w-12 h-12 mb-1" />
                     <span className="font-bold">VALID</span>
                   </motion.div>
                 )}
                 {verificationResult === false && (
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                     className="flex flex-col items-center text-rose-600 dark:text-rose-400"
                   >
                     <XCircle className="w-12 h-12 mb-1" />
                     <span className="font-bold">INVALID</span>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
