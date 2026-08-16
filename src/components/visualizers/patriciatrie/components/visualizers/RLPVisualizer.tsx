import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Binary, Box, ArrowRight, ArrowDown } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

const RLPVisualizer: React.FC = () => {
  const [input, setInput] = useState('cat');
  
  const getRLP = (str: string) => {
    if (str.length === 1 && str.charCodeAt(0) < 0x80) return `0x${str.charCodeAt(0).toString(16)}`;
    const prefix = (0x80 + str.length).toString(16);
    const hex = str.split('').map(c => c.charCodeAt(0).toString(16)).join('');
    return `0x${prefix}${hex}`;
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 sm:gap-8 p-2 sm:p-4">
      <div className="bg-white dark:bg-neutral-900 p-5 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-neutral-200 dark:border-neutral-800 shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 sm:gap-8">
           <div className="flex-1 space-y-3 min-w-0">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">Input Data</label>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={12}
                className="w-full bg-neutral-100 dark:bg-neutral-950 p-4 rounded-2xl font-mono text-xl focus:ring-2 ring-primary border-none outline-none dark:text-white"
                placeholder="cat..."
              />
           </div>
           
           <div className="hidden lg:block">
              <ArrowRight className="text-neutral-300" size={32} />
           </div>
           <div className="lg:hidden flex justify-center">
              <ArrowDown className="text-neutral-300" size={24} />
           </div>

           <div className="flex-1 space-y-3 min-w-0">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">RLP Result</label>
              <Tooltip content="Recursive Length Prefix Encoded Hex">
                <div className="w-full bg-neutral-900 p-4 rounded-2xl font-mono text-xl text-primary break-all min-h-[64px] flex items-center shadow-inner cursor-help">
                   {getRLP(input)}
                </div>
              </Tooltip>
           </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] bg-neutral-950 rounded-[32px] sm:rounded-[40px] border border-neutral-800 p-6 sm:p-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full justify-center">
           <motion.div 
             animate={{ scale: [1, 1.02, 1] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="p-6 sm:p-8 bg-neutral-900 border-2 border-primary/30 rounded-3xl flex flex-col items-center gap-3 shadow-2xl max-w-full"
           >
              <Box className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              <Tooltip content="Raw String Input">
                 <span className="font-mono text-sm text-white font-bold truncate max-w-[120px] sm:max-w-[200px] cursor-help">{input || 'empty'}</span>
              </Tooltip>
           </motion.div>
           
           <div className="w-1 h-8 sm:w-16 sm:h-1 bg-gradient-to-b sm:bg-gradient-to-r from-primary to-violet-500 opacity-50" />

           <motion.div 
             className="p-6 sm:p-8 bg-violet-500/10 border-2 border-violet-500/30 rounded-3xl flex flex-col items-center gap-3 shadow-2xl max-w-full"
           >
              <Binary className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" />
              <Tooltip content="Encoded Output">
                 <span className="font-mono text-sm text-violet-400 font-bold truncate max-w-[120px] sm:max-w-[200px] cursor-help">{getRLP(input)}</span>
              </Tooltip>
           </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
         {[
           { label: 'Minimal', desc: 'No "key": "value" pairs. Just raw bytes.' },
           { label: 'Prefix', desc: 'First byte defines length and type.' },
           { label: 'Standard', desc: 'Same input always = same bytes.' }
         ].map((item, i) => (
           <div key={i} className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col gap-1">
              <h5 className="text-[9px] font-black text-primary uppercase">{item.label}</h5>
              <p className="text-[11px] text-neutral-500 font-medium leading-tight">{item.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default RLPVisualizer;