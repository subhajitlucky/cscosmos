import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2, Zap, Search, ArrowDown, Database, LayoutGrid } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

const STEPS = [
  { id: 0, label: 'Raw Trie', icon: LayoutGrid, color: 'bg-blue-500' },
  { id: 1, label: 'Pattern Analysis', icon: Search, color: 'bg-amber-500' },
  { id: 2, label: 'Radix Optimization', icon: Zap, color: 'bg-emerald-500' },
];

const PathCompressionVisualizer: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [pathInput, setPathInput] = useState('01a');

  // Validate and sanitize input (hex only)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^0-9a-f]/g, '').slice(0, 4);
    setPathInput(val);
  };

  const nibbles = pathInput.split('');

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Controls & Stepper */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] shadow-sm">
        {/* Input Control */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-1">Target Path</label>
          <div className="relative group">
            <input 
              type="text" 
              value={pathInput}
              onChange={handleInputChange}
              className="w-full md:w-48 bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2 font-mono text-lg font-bold focus:border-primary outline-none transition-all uppercase"
              placeholder="Ex: 01A"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-neutral-300 pointer-events-none">HEX</div>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-950 p-1.5 rounded-2xl overflow-x-auto max-w-full relative z-10">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id as 0 | 1 | 2)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer relative z-20
                ${step === s.id 
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-md' 
                  : 'text-neutral-500 hover:bg-white/50 dark:hover:bg-neutral-800/50'}
              `}
            >
              <s.icon size={14} className={step === s.id ? s.color.replace('bg-', 'text-') : ''} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualization Stage */}
      <div className="relative min-h-[500px] bg-neutral-50/50 dark:bg-neutral-950/50 rounded-[40px] border border-neutral-200 dark:border-neutral-800 p-8 flex flex-col items-center justify-start overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
        
        <AnimatePresence mode="wait">
          {/* ROOT NODE (Always Present) */}
          <motion.div layout className="z-10 mb-2">
             <div className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl">Root</div>
          </motion.div>

          <motion.div layout className="z-10 mb-4 text-neutral-300">
            <ArrowDown size={16} />
          </motion.div>

          {/* DYNAMIC CONTENT */}
          {step === 2 ? (
            // COMPRESSED VIEW
            <motion.div 
              key="compressed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[32px] blur-xl" />
                <div className="relative w-64 p-6 bg-white dark:bg-neutral-900 border-2 border-emerald-500 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <Minimize2 size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Extension Node</span>
                  </div>
                  
                  <div className="w-full bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/30">
                    <span className="text-[8px] font-black text-emerald-400 uppercase block mb-1">Shared Path</span>
                    <div className="flex justify-center gap-1 font-mono text-xl font-black text-emerald-700 dark:text-emerald-400 tracking-widest">
                       {nibbles.map((n, i) => (
                         <span key={i} className="bg-white dark:bg-neutral-800 px-2 rounded-md shadow-sm border border-emerald-200 dark:border-emerald-800/50">
                           {n}
                         </span>
                       ))}
                    </div>
                  </div>
                  
                  <div className="text-[9px] text-neutral-400 font-medium text-center">
                    Collapses {nibbles.length} lookups into 1 atomic operation.
                  </div>
                </div>
              </div>
              
              <div className="h-12 w-0.5 bg-emerald-500/30 my-2" />
              
              <LeafNode />
            </motion.div>
          ) : (
            // UNCOMPRESSED / ANALYSIS VIEW
            <motion.div 
              key="uncompressed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center w-full"
            >
              <div className={`
                relative flex flex-col items-center transition-all duration-500 p-6 rounded-[40px]
                ${step === 1 ? 'bg-amber-500/5 border-2 border-dashed border-amber-500/30' : ''}
              `}>
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm z-20"
                  >
                    Linear Sequence Detected
                  </motion.div>
                )}

                {nibbles.length === 0 ? (
                  <div className="text-neutral-400 text-sm font-medium italic">Enter a path above...</div>
                ) : (
                  nibbles.map((nibble, index) => (
                    <React.Fragment key={index}>
                      <BranchNode nibble={nibble} index={index} isHighlight={step === 1} />
                      {index < nibbles.length - 1 && (
                         <div className={`h-8 w-0.5 ${step === 1 ? 'bg-amber-500' : 'bg-neutral-200 dark:bg-neutral-800'} transition-colors duration-500`} />
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
              
              <div className="h-8 w-0.5 bg-neutral-200 dark:bg-neutral-800" />
              <LeafNode />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Legend / Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          label="Lookup Cost" 
          value={step === 2 ? 'O(1)' : `O(${Math.max(1, nibbles.length)})`} 
          sub="Disk Reads"
          color={step === 2 ? 'text-emerald-500' : 'text-blue-500'}
        />
        <MetricCard 
          label="Storage Efficiency" 
          value={step === 2 ? 'High' : 'Low'} 
          sub={step === 2 ? 'Minimal nodes stored' : `${Math.max(0, nibbles.length - 1)} redundant nodes`}
          color={step === 2 ? 'text-emerald-500' : 'text-amber-500'}
        />
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center gap-4 shadow-sm">
           <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              <Database size={20} className="text-neutral-500" />
           </div>
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Nodes</div>
              <div className="text-xl font-black text-neutral-900 dark:text-white">
                 {step === 2 ? (nibbles.length > 0 ? 2 : 1) : nibbles.length + 1}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const BranchNode = ({ nibble, index, isHighlight }: { nibble: string, index: number, isHighlight: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`
      relative w-48 p-3 bg-white dark:bg-neutral-900 border rounded-2xl shadow-sm transition-all duration-500
      ${isHighlight ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-200 dark:border-neutral-800'}
    `}
  >
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-1.5">
        <LayoutGrid size={12} className={isHighlight ? 'text-amber-500' : 'text-blue-500'} />
        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Branch Node</span>
      </div>
      <span className="text-[9px] font-mono text-neutral-300">Level {index}</span>
    </div>
    
    {/* Visual Grid of 16 slots */}
    <div className="grid grid-cols-8 gap-1">
      {Array.from({ length: 16 }).map((_, i) => {
        const hex = i.toString(16);
        const isActive = hex === nibble;
        return (
          <Tooltip key={i} content={isActive ? `Active Path: ${hex.toUpperCase()}` : 'Empty Slot'}>
            <div className={`
              h-3 rounded-sm text-[7px] flex items-center justify-center font-mono font-bold transition-all
              ${isActive 
                ? (isHighlight ? 'bg-amber-500 text-white scale-110 shadow-sm' : 'bg-blue-500 text-white scale-110 shadow-sm') 
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-700'}
            `}>
              {hex}
            </div>
          </Tooltip>
        );
      })}
    </div>
  </motion.div>
);

const LeafNode = () => (
  <motion.div layout className="w-32 p-3 bg-neutral-900 text-white rounded-xl flex items-center justify-center gap-2 shadow-xl z-10">
    <Database size={14} className="text-emerald-400" />
    <span className="text-[10px] font-black uppercase tracking-widest">Value</span>
  </motion.div>
);

const MetricCard = ({ label, value, sub, color }: { label: string, value: string, sub: string, color: string }) => (
  <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col gap-1 shadow-sm">
    <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</div>
    <div className={`text-2xl font-black ${color}`}>{value}</div>
    <div className="text-[10px] font-medium text-neutral-500">{sub}</div>
  </div>
);

export default PathCompressionVisualizer;