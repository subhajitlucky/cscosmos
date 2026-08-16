import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { TOPICS, CATEGORIES } from '../data/topics';
import { ChevronRight } from 'lucide-react';

export const Learn: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Learning Paths</h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400">
          Explore string algorithms from fundamentals to advanced techniques.
        </p>
      </header>

      <div className="space-y-12 sm:space-y-16">
        {CATEGORIES.map((category) => {
          const categoryTopics = TOPICS.filter(t => t.category === category);
          if (categoryTopics.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-3">
                <span className="w-1 h-6 sm:h-8 bg-brand-500 rounded-full"></span>
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {categoryTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={topic.path}
                      className="group block p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-all hover:shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-mono text-slate-500 dark:text-slate-400">
                          {topic.complexity.time}
                        </span>
                        <ChevronRight className="text-slate-300 group-hover:text-brand-500 transition-colors" size={20} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-500 transition-colors">{topic.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {topic.description}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Learn;
