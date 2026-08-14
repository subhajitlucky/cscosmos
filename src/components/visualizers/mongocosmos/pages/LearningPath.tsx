'use client';

'use client';

import { motion } from 'framer-motion';
import { learningPath } from '../data/learning-path';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { Binary, Lock, ChevronRight } from 'lucide-react';

export function LearningPath() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-32 pb-32">
      {/* Header */}
      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <div className="w-4 h-4 bg-emerald-500 shadow-[0_0_15px_rgba(0,237,100,0.5)]" />
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none text-emerald-400">Concept_Map</h1>
        </div>
        <p className="text-emerald-400/40 text-lg font-bold uppercase tracking-widest max-w-xl leading-relaxed border-l-4 border-emerald-500/10 pl-8">
          A hierarchical traversal of the MongoDB ecosystem. Navigate through the data-plane to deconstruct the system internals.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16"
      >
        {learningPath.map((path) => (
          <motion.div key={path.id} variants={item} className="space-y-10 group/path">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] opacity-30 group-hover/path:opacity-100 transition-opacity duration-500">Path::{path.id}</span>
              <h2 className="text-3xl font-black uppercase tracking-tight italic border-b-4 border-emerald-500/10 pb-6">{path.name}</h2>
            </div>

            <div className="space-y-6">
              {path.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={topic.status === 'active' ? `/mongocosmos/learn/${topic.id}` : '#'}
                  className={cn(
                    "block p-8 border-2 transition-all duration-500 relative overflow-hidden group/topic",
                    topic.status === 'active' 
                      ? "border-emerald-500/10 dark:bg-black/40 bg-white/60 hover:border-emerald-500 hover:bg-emerald-500/5 active:scale-95 shadow-lg"
                      : "border-white/5 dark:bg-black/20 bg-white/30 cursor-not-allowed opacity-40"
                  )}
                >
                  {topic.status === 'active' && (
                    <div className="absolute top-0 right-0 p-2 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase">Active</div>
                  )}
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-2">
                      <h3 className={cn(
                        "font-black text-lg uppercase tracking-widest transition-colors",
                        topic.status === 'active' ? "text-emerald-400/60 group-hover/topic:text-emerald-400 group-hover/topic:text-glow" : "text-white/20"
                      )}>
                        {topic.name}
                      </h3>
                      <p className="text-[10px] font-bold text-emerald-400/20 uppercase leading-relaxed max-w-[240px] group-hover/topic:text-emerald-400/40">
                        {topic.description}
                      </p>
                    </div>
                    {topic.status === 'active' ? (
                      <div className="w-10 h-10 border-2 border-emerald-500/20 flex items-center justify-center group-hover/topic:border-emerald-500 transition-colors">
                        <ChevronRight className="w-5 h-5 text-emerald-400 opacity-40 group-hover/topic:opacity-100" />
                      </div>
                    ) : (
                      <Lock className="w-5 h-5 text-white/10" />
                    )}
                  </div>
                  
                  {topic.status === 'active' && (
                    <div className="absolute -bottom-4 -right-4 p-4 opacity-5 rotate-12 transition-all group-hover/topic:opacity-20 group-hover/topic:rotate-0 group-hover/topic:scale-110">
                      <Binary className="w-20 h-20 text-emerald-400" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
