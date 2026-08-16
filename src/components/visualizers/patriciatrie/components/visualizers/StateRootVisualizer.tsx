import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MerklePatriciaTrie } from '../../utils/mpt';
import { ShieldCheck, Box, Fingerprint, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

const StateRootVisualizer: React.FC = () => {
  const [isTampered, setIsTampered] = useState(false);
  
  const trie = useMemo(() => {
    const t = new MerklePatriciaTrie();
    t.insert('acc1', '100 ETH');
    t.insert('acc2', '50 ETH');
    return t;
  }, []);

  const rootHash = isTampered ? '0x' + 'f'.repeat(8) : trie.rootHash;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 p-4 sm:p-0">
      {/* Block Header Simulation */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-xl group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative p-6 sm:p-8 bg-neutral-900 text-white rounded-[40px] border border-neutral-800 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Box size={150} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary">
                <Box size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Mainnet Block Header</h4>
                <p className="text-sm font-bold">Block #19,283,741</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                   <Tooltip content="The 32-byte Merkle Root of the global state trie">
                     <div className="flex items-center gap-2 cursor-help">
                        <Fingerprint size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">State Root (stateRoot)</span>
                     </div>
                   </Tooltip>
                   <AnimatePresence mode="wait">
                     <motion.div 
                       key={isTampered ? 'invalid' : 'valid'}
                       initial={{ opacity: 0, x: 10 }}
                       animate={{ opacity: 1, x: 0 }}
                       className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase ${isTampered ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}
                     >
                       {isTampered ? <AlertCircle size={10} /> : <ShieldCheck size={10} />}
                       {isTampered ? 'Integrity Compromised' : 'Verified State'}
                     </motion.div>
                   </AnimatePresence>
                </div>
                <Tooltip content={isTampered ? "Invalid Hash (Tampered)" : "Valid Keccak-256 Hash"}>
                  <p className={`font-mono text-lg sm:text-2xl font-black break-all transition-colors duration-500 cursor-help ${isTampered ? 'text-red-500' : 'text-primary'}`}>
                    {rootHash}
                  </p>
                </Tooltip>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 opacity-40">
                 <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold">Parent Hash</div>
                 <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold">Gas Limit</div>
                 <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold">Timestamp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Integrity Test */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
        <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[40px] flex flex-col justify-between gap-6 shadow-sm">
           <div>
              <h5 className="font-black text-sm mb-2 text-neutral-900 dark:text-neutral-100">Simulate State Corruption</h5>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Manually change a single value deep within the trie. Observe how the cryptographic commitment chain immediately invalidates the Root Hash.
              </p>
           </div>
           
           <button 
             onClick={() => setIsTampered(!isTampered)}
             className={`
               w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 cursor-pointer
               ${isTampered 
                 ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' 
                 : 'bg-red-500 text-white shadow-lg shadow-red-500/30 active:scale-95'}
             `}
           >
             {isTampered ? <RefreshCw size={16} /> : <Zap size={16} />}
             {isTampered ? 'Restore State Integrity' : 'Tamper with acc1'}
           </button>
        </div>

        <div className="p-8 bg-primary text-white rounded-[40px] shadow-xl shadow-primary/20 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
           <div className="relative z-10 h-full flex flex-col justify-center">
              <h5 className="font-black text-sm mb-4 uppercase tracking-widest opacity-80">The Result</h5>
              <p className="text-lg font-bold leading-snug">
                {isTampered 
                  ? "Because the Root is invalid, the network will REJECT this block. State cannot be faked."
                  : "The Root Hash is the only piece of data required to prove the validity of any account."}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StateRootVisualizer;
