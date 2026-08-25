import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';
import { topics } from '../lib/topics';
import { ChevronRight, ShieldCheck } from 'lucide-react';

const LearningPath = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 relative min-h-screen">

      <header className="mb-12 md:mb-24 relative">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-mono font-black uppercase tracking-[0.3em] text-primary">Neural_Link_Connected</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-black tracking-tighter text-main mb-4 md:mb-6">
            TRAINING_MODULES
          </h1>
          <div className="h-1 w-16 md:w-24 bg-amber-500/70" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={`/learn/${topic.id}`}
              className="premium-panel group flex flex-col p-6 md:p-8 hover:bg-primary/[0.03] hover:border-primary/40 transition-all duration-500 h-full"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-10">
                <div className="font-mono text-4xl font-black text-primary/10 group-hover:text-primary/20 transition-colors tracking-tighter">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_20px_var(--primary-dim)] transition-all">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Body */}
              <div className="mt-auto">
                <h2 className="text-xl font-display font-bold text-main group-hover:text-primary transition-colors tracking-tight mb-3">
                  {topic.title.toUpperCase()}
                </h2>
                <p className="text-sm text-text-muted font-medium leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                  {topic.shortDescription}
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-border-dim">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Available</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <ShieldCheck className="w-3 h-3 text-primary/40" />
                    <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Verified</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Decorative background elements */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default LearningPath;