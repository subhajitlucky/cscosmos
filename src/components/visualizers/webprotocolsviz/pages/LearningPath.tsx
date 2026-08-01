'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { topics } from '../data/topics';

const LearningPath = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex flex-col gap-2 mb-12">
        <div className="flex items-center gap-3">
          <Link href="/topics" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground bg-card border border-border px-3 py-1 rounded-full transition-all hover:border-primary/50">
            ← CSCosmos
          </Link>
          <Link href="/webprotocols" className="text-xs font-semibold text-primary hover:underline">
            Web Protocols Home
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Your Learning Roadmap</h1>
        <p className="text-muted-foreground text-lg">Follow this guided path to master web protocols from scratch.</p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border/80" />

        <div className="space-y-12 relative">
          {topics.map((topic, index) => (
            <motion.div 
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-8 group"
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-background transition-colors ${
                  index === 0 ? 'bg-primary text-white' : 'bg-card text-muted-foreground group-hover:border-primary/20'
                }`}>
                  {index === 0 ? <BookOpen size={20} /> : <span className="font-bold">{index + 1}</span>}
                </div>
              </div>

              <Link 
                href={`/webprotocols${topic.path}`}
                className="flex-1 bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex items-center justify-between group-hover:-translate-y-1"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-foreground">{topic.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-1">
                    {topic.content.definition}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <ArrowRight size={20} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mt-16 p-8 bg-card border border-border/80 rounded-3xl text-foreground text-center transition-colors shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Ready to reach the end?</h3>
        <p className="text-muted-foreground mb-6">Complete all 12 modules to earn your mastery of HTTP headers and caching.</p>
        <Link 
          href={`/webprotocols${topics[0].path}`}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
        >
          Start with "{topics[0].name}"
        </Link>
      </div>
    </div>
  );
};

export default LearningPath;
