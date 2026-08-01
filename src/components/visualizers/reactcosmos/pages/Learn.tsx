'use client';
import { TOPICS, type Category } from '../data/topics';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { ArrowDown, CheckCircle2 } from 'lucide-react';

const categoryColors: Record<Category, string> = {
  fundamentals: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  rendering: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  hooks: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  internals: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  performance: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  patterns: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  concurrent: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
};

const Learn = () => {
  const orderedTopics = [];
  let currentId: string | undefined = 'what-is-react';
  const visited = new Set();

  while (currentId && !visited.has(currentId)) {
    const topic = TOPICS.find(t => t.id === currentId);
    if (topic) {
      orderedTopics.push(topic);
      visited.add(currentId);
      currentId = topic.nextTopicId;
    } else {
      break;
    }
  }

  TOPICS.forEach(t => {
    if (!visited.has(t.id)) orderedTopics.push(t);
  });

  return (
    <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
      <header className="mb-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black mb-6"
        >
          The Odyssey Pathway
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-500"
        >
          A sequential journey from the basic building blocks of UI to the advanced concurrent engine. 
          Follow the light.
        </motion.p>
      </header>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-react/50 via-purple-500/50 to-amber-500/50 opacity-20 hidden md:block" />

        <div className="space-y-12">
          {orderedTopics.map((topic, index) => (
            <motion.div 
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-0 md:pl-20"
            >
              <div className="absolute left-0 top-6 hidden md:flex items-center justify-center w-16 h-16 -ml-8 z-10">
                <div className="w-full h-full rounded-full bg-surface border-4 border-react/30 flex items-center justify-center shadow-lg">
                  <span className="text-react font-bold font-mono">{index + 1}</span>
                </div>
              </div>

              <Link 
                href={`/reactcosmos/topic/${topic.id}`}
                className="block p-8 rounded-3xl bg-card border border-border hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,216,255,0.1)] transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-8xl font-black uppercase tracking-tighter">{topic.category}</span>
                </div>

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={clsx("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border", categoryColors[topic.category])}>
                      {topic.category}
                    </span>
                    <span className={clsx(
                      "text-[9px] px-2 py-0.5 rounded border uppercase font-bold tracking-widest",
                      topic.difficulty === 'beginner' ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" :
                      topic.difficulty === 'intermediate' ? "border-amber-500/30 text-amber-500 bg-amber-500/5" :
                      topic.difficulty === 'advanced' ? "border-rose-500/30 text-rose-500 bg-rose-500/5" :
                      "border-purple-500/30 text-purple-500 bg-purple-500/5"
                    )}>
                      {topic.difficulty}
                    </span>
                    {index === 0 && (
                      <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <CheckCircle2 className="w-3 h-3" /> Recommended Start
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl font-bold mb-3 group-hover:text-react transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed mb-6">
                    {topic.summary}
                  </p>

                  <div className="flex items-center gap-4 text-sm font-bold text-react group-hover:gap-6 transition-all">
                    Explore Visualizer <ArrowDown className="w-4 h-4 -rotate-90" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;
