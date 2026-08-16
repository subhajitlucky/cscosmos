import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Layers, Database, Cpu, ChevronRight, Info } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

const NODE_DATA = {
  branch: {
    title: 'Branch',
    icon: Share2,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    desc: '17-slot array for path divergence.',
    memory: '544 bytes (raw)',
    logic: 'The search nibble (0-F) acts as the direct index into this array.'
  },
  extension: {
    title: 'Extension',
    icon: Layers,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    desc: 'Optimization for shared paths.',
    memory: 'Partial Path + Child Hash',
    logic: 'Collapses 10+ empty branches into one single lookup operation.'
  },
  leaf: {
    title: 'Leaf',
    icon: Database,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    desc: 'Terminal node with state data.',
    memory: 'Suffix + RLP Data',
    logic: 'The cryptographic end-of-path where the search key finally resolves.'
  }
};

const NodeArchetypeVisualizer: React.FC = () => {
  const [activeType, setActiveType] = useState<'branch' | 'extension' | 'leaf'>('branch');
  const active = NODE_DATA[activeType];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8">
      {/* Archetype Selector */}
      <div className="flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-inner overflow-x-auto relative z-10">
        {(['branch', 'extension', 'leaf'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`
              flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer relative z-20
              ${activeType === type 
                ? 'bg-white dark:bg-neutral-800 text-primary shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}
            `}
          >
            {React.createElement(NODE_DATA[type].icon, { size: 12 })}
            <span>{NODE_DATA[type].title}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        {/* Visual Mockup */}
        <div className="lg:col-span-3 min-h-[300px] sm:min-h-[350px] bg-white dark:bg-neutral-950 rounded-[32px] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="relative z-10 w-full flex flex-col items-center p-4 sm:p-8"
            >
              {activeType === 'branch' && (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2 max-w-xs sm:max-w-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <Tooltip key={i} content={`Nibble Index: ${i.toString(16).toUpperCase()}`}>
                      <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 cursor-help transition-all hover:bg-blue-500/20">
                        {i.toString(16).toUpperCase()}
                      </div>
                    </Tooltip>
                  ))}
                  <div className="col-span-4 sm:col-span-8 py-2 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-[9px] font-black uppercase tracking-widest cursor-help">
                    <Tooltip content="Stores the value for the key ending at this node (if any)">
                       <span>Value Field</span>
                    </Tooltip>
                  </div>
                </div>
              )}

              {activeType === 'extension' && (
                <div className="flex flex-col items-center gap-4">
                  <Tooltip content="The shared nibble sequence compressed into this node">
                    <div className="px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center gap-1 cursor-help">
                      <span className="text-[8px] font-black text-amber-600 uppercase">Path</span>
                      <p className="text-xl font-mono font-black text-amber-700 dark:text-amber-400 tracking-widest">0x1A2B</p>
                    </div>
                  </Tooltip>
                  <div className="w-0.5 h-6 bg-neutral-200 dark:bg-neutral-800" />
                  <Tooltip content="Pointer to the next node">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg cursor-help">
                      <ChevronRight size={20} />
                    </div>
                  </Tooltip>
                </div>
              )}

              {activeType === 'leaf' && (
                <div className="w-full max-w-[240px] p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Database className="text-emerald-500" size={20} />
                      <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Storage</span>
                    </div>
                    <Tooltip content="Remaining key suffix">
                      <div className="bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-emerald-500/20 cursor-help">
                        <span className="text-[7px] font-black text-neutral-400 uppercase block mb-0.5">Suffix</span>
                        <p className="font-mono text-[10px] font-bold text-emerald-600 truncate">...f3a2c1</p>
                      </div>
                    </Tooltip>
                    <Tooltip content="RLP Encoded Account State">
                      <div className="bg-neutral-900 text-white p-3 rounded-xl shadow-xl cursor-help">
                        <span className="text-[7px] font-black opacity-50 uppercase block mb-0.5">RLP Value</span>
                        <p className="font-bold text-xs truncate">1,250.00 ETH</p>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Technical Data */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className={`p-5 rounded-[28px] ${active.bg} border ${active.border} flex flex-col gap-3`}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-neutral-900 flex items-center justify-center shadow-sm">
                <Cpu size={14} className={active.color} />
              </div>
              <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Node Logic</h4>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              {active.logic}
            </p>
          </div>

          <div className="p-5 bg-neutral-900 dark:bg-neutral-950 rounded-[28px] text-white flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-primary">
                <Info size={14} />
              </div>
              <h4 className="text-[9px] font-black uppercase tracking-widest opacity-50">Payload</h4>
            </div>
            <div>
              <span className="text-[7px] font-black opacity-30 uppercase block mb-0.5">Memory Profile</span>
              <p className="text-[11px] font-bold text-primary">{active.memory}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeArchetypeVisualizer;