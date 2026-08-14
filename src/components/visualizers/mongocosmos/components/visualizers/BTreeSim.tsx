'use client';

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

export function BTreeSim() {
  const [nodes] = useState<{ id: string; keys: number[]; children?: string[] }[]>([
    { id: 'root', keys: [50], children: ['left', 'right'] },
    { id: 'left', keys: [25, 30] },
    { id: 'right', keys: [75, 80] }
  ])
  const [activeKey, setActiveKey] = useState<number | null>(null)
  const [traversed, setActiveTraversed] = useState<string[]>([])

  const search = (target: number) => {
    setActiveKey(target)
    setActiveTraversed(['root'])
    
    // Simulate search logic
    setTimeout(() => {
      if (target < 50) {
        setActiveTraversed(['root', 'left'])
      } else {
        setActiveTraversed(['root', 'right'])
      }
      setTimeout(() => setActiveTraversed([]), 2000)
    }, 800)
  }

  return (
    <div className="flex flex-col h-full dark:bg-black/40 bg-white/60 border-2 border-primary/10 rounded-sm overflow-hidden">
      {/* Simulation HUD */}
      <div className="p-6 border-b-2 border-primary/10 flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-4">
          <Database className="w-5 h-5 text-primary" />
          <span className="text-xs font-black uppercase tracking-widest italic">B-TREE_INDEX_INTERNAL</span>
        </div>
        <div className="flex gap-4">
          {[25, 50, 80].map(k => (
            <button 
              key={k}
              onClick={() => search(k)}
              className="px-4 py-1.5 border border-primary/20 hover:border-primary text-[10px] font-black text-primary/60 hover:text-primary transition-all uppercase"
            >
              FIND_{k}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow relative p-12 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        
        {/* The Tree Root */}
        <div className="space-y-24 w-full flex flex-col items-center relative z-10">
          <Node 
            node={nodes.find(n => n.id === 'root')!} 
            active={traversed.includes('root')}
          />
          
          <div className="flex justify-around w-full max-w-4xl relative">
            {/* Connection Lines */}
            <svg className="absolute -top-24 left-0 w-full h-24 pointer-events-none overflow-visible">
              <line x1="50%" y1="0" x2="25%" y2="100%" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
              <line x1="50%" y1="0" x2="75%" y2="100%" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
            </svg>
            
            <Node 
              node={nodes.find(n => n.id === 'left')!} 
              active={traversed.includes('left')}
            />
            <Node 
              node={nodes.find(n => n.id === 'right')!} 
              active={traversed.includes('right')}
            />
          </div>
        </div>

        {/* Algorithm Insight */}
        <div className="absolute bottom-8 left-8 right-8 p-6 dark:bg-black/60 bg-white/80 border border-primary/10 rounded-sm">
          <div className="flex items-center gap-3 mb-2 text-primary/40">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Execution_Insight</span>
          </div>
          <p className="text-[9px] font-bold text-primary/20 uppercase tracking-widest leading-relaxed">
            {traversed.length > 0 
              ? `PROBING_NODE [ID:${traversed[traversed.length-1].toUpperCase()}]. COMPARING_SEARCH_KEY(${activeKey}) AGAINST NODE_VALUES...`
              : 'IDLE. SYSTEM_READY_FOR_INDEX_TRAVERSAL_COMMAND.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function Node({ node, active }: { node: any; active: boolean }) {
  return (
    <motion.div 
      animate={{ 
        scale: active ? 1.1 : 1,
        borderColor: active ? 'rgba(0,237,100,1)' : 'rgba(0,237,100,0.2)',
      }}
      className={cn(
        "p-1 border-2 transition-colors duration-500 shadow-2xl",
        active ? "bg-primary/10" : "dark:bg-black/60 bg-white/60"
      )}
    >
      <div className="flex gap-1">
        {node.keys.map((k: number, i: number) => (
          <div key={i} className="w-16 h-16 flex flex-col items-center justify-center border-2 border-primary/10 bg-primary/5">
            <span className="text-[8px] font-black text-primary/30 uppercase mb-1">KEY</span>
            <span className="text-xl font-black italic">{k}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
