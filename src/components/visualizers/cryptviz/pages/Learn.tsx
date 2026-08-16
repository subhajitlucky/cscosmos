import React from 'react';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';
import { TOPICS } from '../data/topics';
import { ArrowRight, BookOpen, Clock, Zap } from 'lucide-react';

const BackgroundAtmosphere = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-brand-500/5 blur-[100px] rounded-full" />
    <div 
      className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]" 
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }}
    />
  </div>
);

export const Learn: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col pb-20">
      <BackgroundAtmosphere />
      
      <div className="max-w-5xl mx-auto w-full p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <BookOpen className="w-3 h-3" />
            <span>Structured Curriculum</span>
          </div>
          <h1 className="text-5xl font-black mb-6 text-slate-900 dark:text-white tracking-tighter">The Learning Path</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
            A meticulously designed journey through the architectural layers of digital security. Master each primitive to understand the whole.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Central Track Line */}
          <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <div className="grid gap-8">
            {TOPICS.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link 
                    to={`/learn/${topic.id}`}
                    className="group relative flex items-start gap-8"
                  >
                    {/* Step Node */}
                    <div className="hidden md:flex flex-none w-24 items-center justify-center relative z-10">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-950 border-4 border-slate-100 dark:border-slate-900 flex items-center justify-center transition-all duration-500 group-hover:border-brand-500 shadow-sm">
                            <span className="text-xs font-black text-slate-400 group-hover:text-brand-500">{index + 1}</span>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="flex-grow p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2rem] transition-all duration-500 group-hover:border-brand-500/50 group-hover:shadow-2xl group-hover:shadow-brand-500/5 group-hover:-translate-y-1 relative overflow-hidden">
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                <Icon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                            </div>
                            
                            <div className="flex-grow">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] font-black uppercase tracking-widest text-slate-500">Module {index + 1}</span>
                                    {index === 0 && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest">Recommended Start</span>}
                                    {topic.id === 'blockchain' && <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-widest">Mastery Level</span>}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors tracking-tight mb-2">
                                    {topic.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
                                    {topic.description}
                                </p>
                            </div>

                            <div className="flex-none flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-500 group-hover:border-brand-500 group-hover:text-white">
                                    <ArrowRight className="w-5 h-5 transform translate-x-[-2px] group-hover:translate-x-0 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* Concept Footprint */}
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap gap-6 text-[10px] font-bold text-slate-400">
                            <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-brand-500" />
                                <span>Interactive Visualizer Included</span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <Clock className="w-3 h-3" />
                                <span>5-8 min session</span>
                            </div>
                        </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Learn;
