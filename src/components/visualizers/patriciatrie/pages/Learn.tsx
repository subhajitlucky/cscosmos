import React from 'react';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ChevronRight, Database, CheckCircle2, RotateCcw, Lock } from 'lucide-react';
import { allTopics } from '../utils/topicContent';
import { useProgress } from '../hooks/useProgress';

const Learn: React.FC = () => {
  const { completedTopics, isCompleted } = useProgress();
  const progressPercentage = Math.round((completedTopics.length / allTopics.length) * 100);
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 300], [0, 100]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  const clearProgress = () => {
    localStorage.removeItem('pt-progress');
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen pb-32">
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0 bg-[url('https://grainy-gradients.vercel.org/noise.svg')]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Parallax Header */}
        <motion.header 
          style={{ y: headerY, opacity: headerOpacity }}
          className="pt-20 sm:pt-32 mb-24 relative"
        >
          <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="space-y-6 max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/5 dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-md"
              >
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase text-neutral-600 dark:text-neutral-300">
                  Interactive Curriculum
                </span>
              </motion.div>
              
              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-neutral-900 dark:text-white leading-[0.9]">
                Protocol <br />
                <span className="text-orange-600 dark:text-amber-500">Mastery</span>
              </h1>
              
              <p className="text-xl text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed max-w-2xl">
                From raw bytes to global consensus. A visual journey through the Ethereum state machine.
              </p>
            </div>

            {/* HUD Progress Widget */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-white/10 p-6 rounded-[32px] shadow-2xl relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-amber-500/5" />
               <div className="relative z-10 space-y-4">
                 <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Progress</span>
                      <span className="text-4xl font-black text-neutral-900 dark:text-white">{progressPercentage}%</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 size={20} />
                    </div>
                 </div>
                 
                 <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-amber-500"
                    />
                 </div>
                 
                 <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-bold text-neutral-500">{completedTopics.length} of {allTopics.length} Modules</span>
                    {completedTopics.length > 0 && (
                      <button 
                        onClick={clearProgress}
                        className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        <RotateCcw size={10} /> Reset
                      </button>
                    )}
                 </div>
               </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Timeline Grid */}
        <div className="relative space-y-8">
          {/* Connecting Line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

          {allTopics.map((topic, i) => {
            const completed = isCompleted(topic.id);
            const isNext = !completed && (i === 0 || isCompleted(allTopics[i - 1].id));
            const locked = !completed && !isNext;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-0 sm:pl-24"
              >
                {/* Timeline Node */}
                <div className={`
                  absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] z-10 hidden sm:block bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500
                  ${completed ? 'border-emerald-500 bg-emerald-500' : isNext ? 'border-orange-500 animate-pulse' : 'border-neutral-300 dark:border-neutral-700'}
                `} />

                <SpotlightCard 
                  to={`/learn/${topic.id}`} 
                  disabled={false} // Allowing exploration regardless of lock for this demo, usually would be `locked`
                  className={`group relative overflow-hidden rounded-[32px] border transition-all duration-500 ${
                    completed 
                      ? 'border-emerald-500/30 bg-emerald-500/[0.02]' 
                      : isNext 
                        ? 'border-orange-500/50 bg-orange-500/[0.02] shadow-2xl shadow-orange-500/10' 
                        : 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 grayscale-[0.5] opacity-80'
                  }`}
                >
                  <div className="relative z-10 flex flex-col sm:flex-row gap-8 p-8 items-center">
                    {/* Icon Box */}
                    <div className={`
                      relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform duration-500 group-hover:scale-110
                      ${completed ? 'bg-emerald-500 text-white' : isNext ? 'bg-orange-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'}
                    `}>
                      {topic.icon && <topic.icon size={32} />}
                      {completed && (
                        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-neutral-900 text-emerald-500 p-1 rounded-full border-2 border-emerald-500">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                        <span className={`text-xs font-black uppercase tracking-widest ${isNext ? 'text-orange-500' : 'text-neutral-400'}`}>
                          Module 0{i + 1}
                        </span>
                        {locked && <Lock size={12} className="text-neutral-400" />}
                      </div>
                      <h3 className="text-3xl font-black text-neutral-900 dark:text-white mb-3 group-hover:text-orange-500 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    <div className={`
                      hidden sm:flex w-14 h-14 rounded-full border-2 items-center justify-center transition-all duration-500
                      ${isNext ? 'border-orange-500 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' : 'border-neutral-200 dark:border-neutral-800 text-neutral-300'}
                    `}>
                      <ChevronRight size={24} />
                    </div>
                  </div>

                  {/* Watermark Number */}
                  <div className="absolute -right-4 -bottom-12 text-[12rem] font-black text-neutral-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none">
                    {i + 1}
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 relative rounded-[48px] overflow-hidden bg-neutral-900 dark:bg-neutral-950 text-white p-12 sm:p-24 text-center border border-neutral-800"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.2),transparent_70%)]" />
          <div className="relative z-10 flex flex-col items-center gap-8">
            <Database size={64} className="text-orange-500 animate-bounce" />
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight">Ready to build?</h2>
            <p className="text-xl text-neutral-400 max-w-2xl">
              Take your knowledge to the sandbox. Experiment with live Merkle Patricia Tries in a risk-free environment.
            </p>
            <Link 
              to="/playground"
              className="mt-8 px-12 py-5 bg-white text-neutral-900 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-white/20"
            >
              Open Playground
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Spotlight Card Component ---

const SpotlightCard = ({ children, to, className = "", disabled }: { children: React.ReactNode, to: string, className?: string, disabled?: boolean }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <Link
      to={disabled ? '#' : to}
      className={`block relative ${className}`}
      onMouseMove={handleMouseMove}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(249, 115, 22, 0.15),
              transparent 80%
            )
          `
        }}
      />
      <div>{children}</div>
    </Link>
  );
};

export default Learn;
