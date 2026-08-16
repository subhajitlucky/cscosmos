import React from 'react';
import { motion } from 'framer-motion';
import { Github, ArrowUpRight, Minus } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 lg:py-32">
      {/* Header - Typography First */}
      <motion.header 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-32"
      >
        <div className="flex items-center gap-3 text-brand-500 font-bold text-xs uppercase tracking-[0.3em] mb-6">
          <Minus size={20} /> Project Overview
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 max-w-4xl leading-[1.1]">
          Engineering intuition for <span className="text-slate-400 dark:text-slate-500 italic font-medium font-serif">string algorithms.</span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          StringCosmos is a minimalist simulation environment designed to expose the underlying 
          mechanics of text processing through precise visual movement.
        </p>
      </motion.header>

      {/* Philosophy Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 border-t border-slate-100 dark:border-slate-800 pt-16">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Pedagogical Mission</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">
            We prioritize movement over static definitions. By visualizing incremental shifts and 
            bit-level transformations, we bridge the gap between abstract theory and low-level memory.
          </p>
        </div>
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Technical Accuracy</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">
            Every simulation is a frame-by-frame execution of the actual algorithm in your browser. 
            We reflect the true complexity—from UTF-8 byte boundaries to multi-pattern automata.
          </p>
        </div>
      </section>

      {/* Tech Stack - Neat & Clean */}
      <section className="mb-32">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-12">Core Architecture</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 overflow-hidden rounded-2xl">
          <TechField label="Runtime" value="React 19" />
          <TechField label="Logic" value="TypeScript" />
          <TechField label="Styling" value="Tailwind v4" />
          <TechField label="Animation" value="Framer Motion" />
        </div>
      </section>

      {/* Footer Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-100 dark:border-slate-800 pt-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 text-amber-500 font-bold text-[10px] uppercase tracking-widest mb-4">
            Safety & Performance
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
            StringCosmos is a visual learning environment. Production-grade tools (like GNU Grep) 
            utilize hardware acceleration and SIMD optimizations that exceed standard browser performance. 
            All simulations run locally in your browser memory.
          </p>
        </div>
        <div className="flex flex-col items-start lg:items-end justify-start">
          <a 
            href="#" 
            className="group inline-flex items-center gap-3 px-5 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all hover:bg-black dark:hover:bg-slate-700 shadow-sm"
          >
            <Github size={16} />
            GitHub
            <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </a>
          <span className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Open Source Intent</span>
        </div>
      </div>
    </div>
  );
};

const TechField: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="bg-white dark:bg-slate-950 p-8">
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</div>
    <div className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{value}</div>
  </div>
);

export default About;
