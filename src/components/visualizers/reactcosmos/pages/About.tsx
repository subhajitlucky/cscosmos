'use client';
import { motion } from 'framer-motion';
import { Info, ShieldCheck, Zap, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
          <Info className="w-3.5 h-3.5" />
          Mission Briefing
        </div>
        <h1 className="text-4xl font-bold mb-6 tracking-tight">Demystifying the Magic.</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          React is often taught as a set of rules. We believe it should be understood as a system. 
          React Cosmos is a high-fidelity simulator that peels back the UI layer to reveal 
          the deterministic engine of Trees, Linked Lists, and Schedulers underneath.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {[
          { 
            icon: ShieldCheck, 
            title: "Accuracy First", 
            desc: "All visualizations are derived from the official React Fiber source code. No 'fake' magic—just the actual logic simulated." 
          },
          { 
            icon: Zap, 
            title: "Performance Focus", 
            desc: "Understand exactly why a component re-renders. We visualize the diffing process so you can optimize with confidence." 
          },
          { 
            icon: Globe, 
            title: "Open Education", 
            desc: "A community-driven effort to improve React education. Completely frontend-only, transparent, and open-source." 
          },
          { 
            icon: Info, 
            title: "Educational Disclaimer", 
            desc: "This is a learning tool. While it simulates internals accurately, it is not the actual React engine running your browser." 
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <item.icon className="w-6 h-6 mb-4 text-foreground opacity-80" />
            <h3 className="text-sm font-bold mb-2 uppercase tracking-wide">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-8 rounded-2xl bg-muted border border-border">
        <h4 className="text-xs font-bold uppercase tracking-widest mb-4">System Status</h4>
        <div className="flex gap-8 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            VIRTUAL DOM: ACTIVE
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            FIBER ENGINE: NOMINAL
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            CONCURRENT MODE: SIMULATED
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
