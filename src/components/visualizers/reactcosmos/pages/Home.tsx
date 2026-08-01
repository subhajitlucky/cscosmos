'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Layers, Cpu, Radio } from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      <section className="text-center mb-40">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-[10px] font-bold tracking-[0.2em] uppercase mb-10 text-muted-foreground"
        >
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          Synchronizing with Fiber Engine
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-8xl font-bold mb-10 text-foreground"
        >
          Navigate the <br /> 
          <span className="text-muted-foreground opacity-50">Virtual Void.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto mb-14 font-medium leading-relaxed"
        >
          Deconstruct the internal mechanics of the world's most powerful UI engine. 
          From the first reconciliation to the final commit, witness the 
          orchestration of state across the React continuum.
        </motion.p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/reactcosmos/learn" className="px-8 py-3 bg-foreground text-background font-bold rounded-md hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm shadow-xl">
            Enter the Pathway <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/reactcosmos/playground" className="px-8 py-3 bg-background border border-border hover:bg-muted transition-all font-bold rounded-md text-sm flex items-center justify-center">
            Launch Simulation Lab
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
        {[
          { 
            icon: Terminal, 
            title: "Quantum Rendering", 
            desc: "Watch JSX disintegrate into its atomic createElement forms before assembling into the Virtual DOM." 
          },
          { 
            icon: Layers, 
            title: "Fiber Topology", 
            desc: "Trace the interruptible work-loop as it traverses the Fiber tree, prioritizing the fabric of the UI." 
          },
          { 
            icon: Cpu, 
            title: "State Persistence", 
            desc: "Probe the internal linked-lists where hooks reside, shielded from the entropy of re-renders." 
          }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-premium group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-react/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
            <feat.icon className="w-10 h-10 text-foreground mb-8 opacity-40 group-hover:opacity-100 group-hover:text-react transition-all" />
            <h3 className="text-lg font-bold mb-4 tracking-tight">{feat.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </div>

      <section className="glass-panel rounded-3xl p-12 overflow-hidden relative border-dashed">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,216,255,0.1),transparent)]" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="text-[10px] font-bold text-react uppercase tracking-[0.3em] mb-4">Phase Synchronization</div>
            <h2 className="text-4xl font-bold mb-8">The Event Loop of UI.</h2>
            <p className="text-muted-foreground mb-10 leading-relaxed text-base">
              Rendering is not a single event; it is a cycle of entropy. 
              The <span className="text-foreground font-bold">Render Phase</span> computes the future in the shadows, 
              while the <span className="text-react font-bold">Commit Phase</span> manifests that future into the physical DOM.
            </p>
            <div className="space-y-6">
              {[
                { label: 'Trigger', sub: 'Entropy change detected' },
                { label: 'Render', sub: 'Fiber tree diffing' },
                { label: 'Commit', sub: 'DOM manifestation' }
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground font-mono text-xs border border-border">
                    0{i + 1}
                  </div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wide">{step.label}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{step.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-80 bg-background rounded-2xl border border-border flex items-center justify-center shadow-inner overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             <div className="flex gap-12 relative z-10">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }} 
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="w-24 h-24 rounded-2xl bg-muted border-2 border-border flex flex-col items-center justify-center"
                >
                  <div className="text-[10px] font-bold opacity-30 mb-1">V-VOID</div>
                  <Layers className="w-8 h-8 text-react" />
                </motion.div>
                
                <div className="flex items-center">
                  <div className="w-20 h-px bg-gradient-to-r from-react/50 to-transparent relative">
                    <motion.div 
                      animate={{ x: [0, 80] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute -top-1 w-2 h-2 rounded-full bg-react shadow-[0_0_10px_#00d8ff]"
                    />
                  </div>
                </div>

                <motion.div 
                   animate={{ 
                    scale: [1, 1.02, 1],
                   }} 
                   transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                   className="w-24 h-24 rounded-2xl bg-foreground flex flex-col items-center justify-center shadow-2xl"
                >
                  <div className="text-[10px] font-bold text-background/30 mb-1">REALITY</div>
                  <Cpu className="w-8 h-8 text-background" />
                </motion.div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
