'use client';

import { motion } from 'framer-motion';
import { learningPath } from '../data/learning-path';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Binary, Lock, CheckCircle2 } from 'lucide-react';

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-[#d6f5f5]">Concept_Map</h1>
        </div>
        <p className="text-cyan-400/40 text-sm font-bold uppercase tracking-widest max-w-xl leading-relaxed">
          The hierarchical grid of API design principles. Navigate through domains to master the architecture of the modern web.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
      >
        {learningPath.map((domain) => (
          <motion.div key={domain.id} variants={item} className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] opacity-40">Domain::{domain.id}</span>
              <h2 className="text-2xl font-black uppercase tracking-tight italic border-b-2 border-cyan-400/10 pb-4 text-[#d6f5f5]">{domain.name}</h2>
            </div>

            <div className="space-y-4">
              {domain.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={topic.status === 'active' ? `/apiviz/learn/${topic.id}` : '#'}
                  className={cn(
                    "block p-6 border-2 transition-all group relative overflow-hidden",
                    topic.status === 'active' 
                      ? "border-cyan-400/10 bg-black/40 hover:border-cyan-400 hover:bg-cyan-400/5 active:scale-95"
                      : "border-white/5 bg-black/20 cursor-not-allowed grayscale opacity-50"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[9px] font-black tracking-widest text-cyan-400/40 group-hover:text-cyan-400 transition-colors uppercase">
                      SYS_ID: 0x{topic.id.length}A
                    </span>
                    {topic.status === 'active' ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  <h3 className="text-lg font-black tracking-tight text-[#d6f5f5] group-hover:text-cyan-400 transition-colors uppercase italic mb-2">
                    {topic.name}
                  </h3>

                  <p className="text-xs font-bold text-cyan-400/40 uppercase leading-relaxed line-clamp-2">
                    {topic.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-cyan-400/10">
                    <span className="text-[8px] font-black tracking-widest text-cyan-400/20 uppercase">
                      STATUS::{topic.status.toUpperCase()}
                    </span>
                    <span className="text-[8px] font-black tracking-widest text-cyan-400 group-hover:translate-x-1 transition-transform uppercase">
                      {topic.status === 'active' ? 'ACCESS_NODE ->' : 'LOCKED'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
