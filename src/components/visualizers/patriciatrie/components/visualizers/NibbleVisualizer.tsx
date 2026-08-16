import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stringToNibbles } from '../../utils/mpt';
import { Cpu, ArrowRight, Fingerprint, Scissors, Layers } from 'lucide-react';

// --- SUB-COMPONENTS ---

const GuideStep = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex gap-4 items-start shadow-sm">
     <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-xs shrink-0">{number}</div>
     <div>
        <h4 className="font-bold text-xs text-neutral-900 dark:text-white uppercase mb-1">{title}</h4>
        <p className="text-[10px] text-neutral-500 leading-tight">{desc}</p>
     </div>
  </div>
);

interface StatBoxProps {
  label: string;
  value: number;
  highlight?: boolean;
}

const StatBox = ({ label, value, highlight }: StatBoxProps) => (
  <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 ${highlight ? 'bg-primary/5 border-primary/20' : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-100 dark:border-neutral-800'}`}>
     <span className={`text-2xl font-black ${highlight ? 'text-primary' : 'text-neutral-900 dark:text-white'}`}>{value}</span>
     <span className="text-[9px] font-bold uppercase text-neutral-400">{label}</span>
  </div>
);

interface NibbleCardProps {
  value: number;
  label: string;
  color: string;
}

const NibbleCard = ({ value, label, color }: NibbleCardProps) => (
  <div className="flex flex-col items-center gap-1">
     <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white font-mono font-bold text-sm shadow-md`}>
        {value.toString(16).toUpperCase()}
     </div>
     <span className="text-[8px] font-black text-neutral-400 uppercase">{label}</span>
  </div>
);

// --- MAIN COMPONENT ---

type NodeType = 'leaf' | 'extension';

const NibbleVisualizer: React.FC = () => {
  const [text, setText] = useState('ABC');
  const [nodeType, setNodeType] = useState<NodeType>('leaf');

  const nibbles = useMemo(() => stringToNibbles(text), [text]);
  const isOdd = nibbles.length % 2 !== 0;
  const prefixNibble = (nodeType === 'extension' ? 0 : 2) + (isOdd ? 1 : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 6);
    setText(val);
  };

  // Animation variants for staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* 1. LEARNING GUIDE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <GuideStep 
           number="1" 
           title="Input" 
           desc="Type a key. Computers see 'A' as the number 65 (Hex 0x41)." 
         />
         <GuideStep 
           number="2" 
           title="Split" 
           desc="The trie 'cuts' the 8-bit byte into two 4-bit Nibbles: 4 and 1." 
         />
         <GuideStep 
           number="3" 
           title="Prefix" 
           desc="We add a special flag (0-3) so the DB knows how to read the path." 
         />
      </div>

      {/* 2. INPUT STAGE */}
      <div className="bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center gap-8">
         <div className="flex-1 w-full space-y-4">
            <div className="flex items-center gap-2 text-neutral-400">
               <Cpu size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Data Input Buffer</span>
            </div>
            <input 
              type="text" 
              value={text}
              onChange={handleInputChange}
              className="w-full bg-neutral-100 dark:bg-neutral-950 border-2 border-transparent focus:border-primary rounded-2xl px-6 py-4 text-3xl font-mono font-bold outline-none transition-all text-neutral-900 dark:text-white placeholder:text-neutral-300"
              placeholder="Type ABC..."
            />
         </div>
         
         <div className="hidden md:flex text-neutral-300">
            <ArrowRight size={32} />
         </div>

         {/* Stats */}
         <div className="flex gap-4">
            <StatBox label="Bytes" value={text.length} />
            <StatBox label="Nibbles" value={nibbles.length} highlight />
         </div>
      </div>

      {/* 3. DECOMPOSITION CONVEYOR */}
      <div className="relative min-h-[300px] bg-neutral-50 dark:bg-neutral-950 rounded-[40px] border border-neutral-200 dark:border-neutral-800 p-8 overflow-hidden shadow-inner">
         <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col gap-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                 <Scissors size={14} className="text-orange-500" /> Nibble Splitting Process
               </h3>
            </div>

            <motion.div 
              key={text} // Force re-animation when text changes
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-4"
            >
               <AnimatePresence mode="popLayout">
                 {text.split('').map((char, i) => {
                   const code = char.charCodeAt(0);
                   const n1 = (code >> 4) & 0xF;
                   const n2 = code & 0xF;

                   return (
                     <motion.div 
                       key={`${i}-${char}`}
                       variants={itemVariants}
                       layout
                       className="flex items-center gap-4 sm:gap-8 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm"
                     >
                        {/* Source */}
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-black text-lg shrink-0 border border-neutral-200 dark:border-neutral-700">
                           {char}
                        </div>
                        
                        {/* Split Animation */}
                        <div className="flex-1 flex items-center gap-2 relative h-8">
                           <div className="w-full h-0.5 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 p-1 rounded-full border border-neutral-200 dark:border-neutral-800">
                              <Scissors size={12} className="text-orange-500" />
                           </div>
                        </div>

                        {/* Resulting Nibbles */}
                        <div className="flex gap-2">
                           <NibbleCard value={n1} label="HI" color="bg-blue-500" />
                           <NibbleCard value={n2} label="LO" color="bg-indigo-500" />
                        </div>
                     </motion.div>
                   );
                 })}
               </AnimatePresence>
               
               {text.length === 0 && (
                 <div className="h-24 flex items-center justify-center text-neutral-400 text-sm font-medium italic">
                    Enter text to watch the decomposition...
                 </div>
               )}
            </motion.div>
         </div>
      </div>

      {/* 4. HEX PREFIX ENCODING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="p-6 bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-200 dark:border-neutral-800 shadow-lg">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
               <Layers size={14} /> Path Context
            </h3>
            
            <div className="flex flex-col gap-4">
               <div className="flex p-1 bg-neutral-100 dark:bg-neutral-950 rounded-xl">
                  <button 
                    onClick={() => setNodeType('leaf')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${nodeType === 'leaf' ? 'bg-white dark:bg-neutral-800 shadow-sm text-emerald-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                  >
                    Leaf Node
                  </button>
                  <button 
                    onClick={() => setNodeType('extension')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${nodeType === 'extension' ? 'bg-white dark:bg-neutral-800 shadow-sm text-blue-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                  >
                    Extension
                  </button>
               </div>

               <div className="p-4 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-500">Path Length</span>
                  <span className={`text-sm font-mono font-black ${isOdd ? 'text-orange-500' : 'text-neutral-900 dark:text-white'}`}>
                     {isOdd ? 'ODD' : 'EVEN'} ({nibbles.length})
                  </span>
               </div>
            </div>
         </div>

         <div className="p-6 bg-neutral-900 text-white rounded-[32px] border border-neutral-800 shadow-2xl flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <Fingerprint size={80} />
            </div>
            
            <div className="relative z-10 text-center">
               <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Final Encoded Path</div>
               <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex flex-col gap-1">
                     <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-2xl font-black font-mono shadow-lg shadow-orange-500/20">
                        {prefixNibble.toString(16).toUpperCase()}
                     </div>
                     <span className="text-[8px] font-black uppercase tracking-wider opacity-60">Prefix</span>
                  </div>
                  
                  {isOdd ? (
                     <div className="flex flex-col gap-1">
                        <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center text-2xl font-black font-mono text-neutral-400">
                           {nibbles[0]?.toString(16).toUpperCase() || '0'}
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-wider opacity-60">Nibble 1</span>
                     </div>
                  ) : (
                     <div className="flex flex-col gap-1">
                        <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center text-2xl font-black font-mono text-neutral-500">
                           0
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-wider opacity-60">Padding</span>
                     </div>
                  )}
                  
                  <div className="h-0.5 w-4 bg-neutral-700 mx-1" />
                  
                  <div className="flex flex-col gap-1">
                     <div className="h-12 px-4 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center text-lg font-mono text-neutral-400">
                        ...Remaining Nibbles
                     </div>
                  </div>
               </div>
               
               <p className="text-xs text-neutral-400 max-w-[80%] mx-auto leading-relaxed">
                  The prefix <span className="text-white font-bold">0x{prefixNibble}</span> tells the protocol this is a <span className={`font-bold ${nodeType === 'leaf' ? 'text-emerald-400' : 'text-blue-400'}`}>{nodeType.toUpperCase()}</span> node with an <span className="text-white font-bold">{isOdd ? 'ODD' : 'EVEN'}</span> path length.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default NibbleVisualizer;
