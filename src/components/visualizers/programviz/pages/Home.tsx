'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cpu, Database, Keyboard, PlayCircle, ArrowRight } from 'lucide-react';
import { steps } from '../data/learningPath';

export const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-6xl font-extrabold tracking-tight text-foreground"
        >
          How Programs <span className="text-blue-500">Execute</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl max-w-2xl text-muted-foreground"
        >
          A visual, step-by-step guide to understanding the journey of a program from source code to CPU instructions, memory management, and I/O.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Cpu, title: "CPU Execution", desc: "How the processor fetches and runs instructions." },
          { icon: Database, title: "Memory Usage", desc: "How data is stored and organized in RAM." },
          { icon: Keyboard, title: "Input / Output", desc: "How programs interact with the outside world." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-6 border border-border/80 rounded-xl bg-card shadow-sm"
          >
            <item.icon className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Learning Path</h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
            >
              <Link 
                href={step.path}
                className="group flex items-center justify-between p-4 border border-border/80 rounded-lg bg-card/60 hover:bg-card transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold bg-muted group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {step.step}
                  </span>
                  <div>
                    <h4 className="font-bold text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.masteryGoal}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="pt-8">
        <Link 
          href="/program-cosmos/what-is-a-program"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-colors shadow-lg shadow-blue-500/20"
        >
          <PlayCircle className="w-6 h-6" />
          Start Learning
        </Link>
      </div>
    </div>
  );
};
