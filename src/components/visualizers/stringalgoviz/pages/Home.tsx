import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Layers, Cpu, Minus } from 'lucide-react';
import { Link } from '@/components/visualizers/shared/RouterShim';

export const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
      {/* Technical Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-32"
      >
        <div className="flex items-center gap-3 text-brand-500 font-bold text-xs uppercase tracking-[0.3em] mb-8">
          <Minus size={20} /> String Algorithms Visualized
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 max-w-5xl leading-[0.95]">
          Master text logic with <span className="text-slate-400 dark:text-slate-500 italic font-medium font-serif text-5xl md:text-7xl">frame-by-frame</span> precision.
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-12 font-medium">
          A high-fidelity simulator designed to expose the mechanics of string matching, 
          encoding, and data compression through movement.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/learn"
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20"
          >
            Explore Curriculum <ArrowRight size={14} />
          </Link>
          <Link
            to="/playground"
            className="px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-2 border-slate-100 dark:border-slate-800 rounded-lg font-bold text-xs transition-all hover:border-brand-500 shadow-sm"
          >
            Algorithm Playground
          </Link>
        </div>
      </motion.section>

      {/* Bento Grid Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 overflow-hidden rounded-[2rem] mb-32 shadow-sm">
        <FeatureBlock 
          icon={<Zap className="text-brand-500" size={24} />}
          title="Visual-First"
          description="Every algorithm is an active execution. Observe pointer movement and state changes in real-time."
        />
        <FeatureBlock 
          icon={<Layers className="text-indigo-500" size={24} />}
          title="Encoding Deep-Dives"
          description="Understand the bridge between visual characters and memory bytes with interactive hex inspections."
        />
        <FeatureBlock 
          icon={<Cpu className="text-emerald-500" size={24} />}
          title="Complexity Metrics"
          description="Visualize the time and space trade-offs of different approaches side-by-side."
        />
      </section>

      {/* Technical Overview Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center border-t border-slate-100 dark:border-slate-800 pt-32">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">System Rationale</h2>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Strings are the DNA of <br />digital information.
          </h3>
          <div className="space-y-6 text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            <p>
              Modern engineering requires more than just knowing a string is an array. 
              Efficiency depends on understanding UTF-8 boundaries, failure functions, 
              and rolling hash mathematics.
            </p>
            <p>
              StringCosmos provides the environment to build that intuition, transforming 
              black-box libraries into transparent, logical processes.
            </p>
          </div>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-950 rounded-3xl p-16 border border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden group">
           <div className="flex gap-3 relative z-10 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
              {"LOGIC".split('').map((c, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -12, 0],
                    borderColor: ['rgba(226, 232, 240, 1)', 'rgba(14, 165, 233, 1)', 'rgba(226, 232, 240, 1)']
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  className="w-14 h-14 flex items-center justify-center rounded-xl border-2 bg-slate-50 dark:bg-slate-800 font-mono font-black text-slate-900 dark:text-white shadow-sm"
                >
                  {c}
                </motion.div>
              ))}
           </div>
           {/* Background Grid Pattern */}
           <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.2] pointer-events-none bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      </section>
    </div>
  );
};

const FeatureBlock: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-slate-950 p-10 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
    <div className="mb-8">{icon}</div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
      {description}
    </p>
  </div>
);
export default Home;
