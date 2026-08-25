import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { TOPICS } from '../lib/evm/topics';
import { Book, ChevronRight } from 'lucide-react';

const Learn: React.FC = () => {
  return (
    <div className="py-8">
      <header className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-2.5 rounded-xl bg-evm-accent/10 text-evm-accent mb-5"
        >
          <Book size={24} />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-neutral-900 dark:text-white">Learning Path</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-500 max-w-xl mx-auto">
          A structured journey from EVM basics to complex execution contexts and gas optimization.
        </p>
      </header>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800 z-0 hidden md:block" />

        <div className="space-y-4 relative z-10">
          {TOPICS.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/learn/${topic.id}`}
                className="group flex flex-col md:flex-row items-start gap-4 p-1.5 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-all"
              >
                <div className="hidden md:flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-white dark:bg-neutral-950 border-2 border-neutral-100 dark:border-neutral-900 z-10 shadow-sm transition-colors">
                  <span className="text-xs font-bold text-neutral-400 dark:text-neutral-700 group-hover:text-evm-accent transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-all flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2.5">
                       <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-evm-accent transition-colors">{topic.title}</h3>
                       {topic.bytecode && (
                         <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-semibold uppercase tracking-wider">Interactive</span>
                       )}
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 max-w-xl leading-relaxed">{topic.description}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:bg-evm-accent group-hover:text-neutral-950 transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-12 p-8 rounded-2xl bg-evm-accent/10 border border-evm-accent/20 text-center">
         <h2 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">Ready for the deep end?</h2>
         <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-sm mx-auto">Skip the lessons and head straight to the playground to write your own raw EVM bytecode.</p>
         <Link to="/playground" className="inline-flex items-center gap-2 px-6 py-3 bg-evm-accent text-neutral-950 font-semibold rounded-lg hover:scale-[1.02] transition-all">
           Go to Playground <ChevronRight size={16} />
         </Link>
      </div>
    </div>
  );
};

export default Learn;