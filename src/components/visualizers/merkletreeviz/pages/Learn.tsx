import { motion } from 'framer-motion';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { BookOpen, Hash, MousePointer2, GitBranch, Binary, CheckCircle2, BarChart3, Globe, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useSound } from '../hooks/useSound';

const topics = [
  { id: 'why-integrity', title: 'Why Data Integrity Matters', icon: BookOpen, desc: 'Understand the "Why" behind the math.' },
  { id: 'hashing-recap', title: 'Hashing Recap', icon: Hash, desc: 'The chaotic blender of cryptographic security.' },
  { id: 'leaf-nodes', title: 'Leaf Nodes', icon: MousePointer2, desc: 'Individual data commitments at the base.' },
  { id: 'internal-nodes', title: 'Internal Nodes', icon: GitBranch, desc: 'The middle managers of verification.' },
  { id: 'merkle-root', title: 'Merkle Root', icon: Binary, desc: 'The single master fingerprint of truth.' },
  { id: 'binary-tree-structure', title: 'Binary Tree Structure', icon: GitBranch, desc: 'The O(log n) magic of recursive pairing.' },
  { id: 'merkle-proofs', title: 'Merkle Proofs', icon: CheckCircle2, desc: 'Partial data proof without full disclosure.' },
  { id: 'efficiency', title: 'Efficiency & Scalability', icon: BarChart3, desc: 'How to scale to billions of transactions.' },
  { id: 'blockchains', title: 'Merkle Trees in Blockchains', icon: Globe, desc: 'The core architecture of decentralized trust.' },
];

const Learn = () => {
  const { playHover, playClick } = useSound();

  return (
    <div className="max-w-7xl mx-auto space-y-24 py-20 px-4">
      {/* 1. CINEMATIC HEADER */}
      <div className="text-center space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm text-[10px] font-black tracking-[0.3em] uppercase text-accent"
        >
          <Sparkles className="w-3 h-3" />
          The Cryptographic Path
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black font-display tracking-tight leading-none"
        >
          MASTER THE <br />
          <span className="text-foreground/70">PROTOCOL</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
        >
          A cinematic journey from raw data shards to the cryptographic summit of trust.
        </motion.p>

        {/* PROGRESS GAUGE (SIMULATED) */}
        <div className="flex justify-center pt-4">
            <div className="flex items-center gap-6 bg-card border border-card-border px-8 py-4 rounded-3xl shadow-xl">
                <div className="flex flex-col items-start">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted">Protocol Mastery</span>
                    <span className="text-2xl font-black">0%</span>
                </div>
                <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "5%" }}
                        className="h-full bg-accent"
                    />
                </div>
                <ShieldCheck className="w-6 h-6 text-muted/20" />
            </div>
        </div>
      </div>

      {/* 2. THE PATH LAYOUT */}
      <div className="relative max-w-5xl mx-auto">
        {/* SVG Path Connector (Visible on Large Screens) */}
        <svg className="absolute left-[2.25rem] top-0 w-1 h-full hidden lg:block overflow-visible" preserveAspectRatio="none">
            <motion.path 
                d="M 0 0 V 2000"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="12 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                opacity="0.1"
            />
        </svg>

        <div className="space-y-12">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.05 }}
              className="relative flex items-center gap-8 group"
            >
              {/* Index Indicator */}
              <div className="hidden lg:flex flex-shrink-0 w-12 h-12 rounded-2xl bg-card border border-card-border items-center justify-center font-black text-xs text-muted-foreground z-10 group-hover:border-accent group-hover:text-accent transition-colors">
                0{index + 1}
              </div>

              <Link
                to={`/learn/${topic.id}`}
                onMouseEnter={playHover}
                onClick={playClick}
                className="flex-grow glass-panel p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-accent/30 group/card"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:opacity-10 transition-opacity">
                  <topic.icon className="w-32 h-32 -rotate-12 transform translate-x-8 -translate-y-8" />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-accent/5 flex items-center justify-center text-accent group-hover/card:scale-110 group-hover/card:bg-accent group-hover/card:text-white transition-all duration-500">
                      <topic.icon className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">Module 0{index + 1}</span>
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight group-hover/card:text-accent transition-colors">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{topic.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted">Estimated Time</span>
                        <span className="text-xs font-bold text-foreground">4 mins</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl border-2 border-muted/10 flex items-center justify-center group-hover/card:border-accent/50 group-hover/card:bg-accent/5 transition-all">
                        <ArrowRight className="w-5 h-5 text-muted group-hover/card:text-accent group-hover/card:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. FOOTER CTA */}
      <div className="max-w-4xl mx-auto p-12 rounded-[3rem] bg-neutral-950 text-white text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 refinery-grid opacity-10" />
          <h2 className="text-3xl font-black tracking-tighter relative z-10">FINISHED THE PATH?</h2>
          <p className="text-sm text-white/60 relative z-10">Take your knowledge to the Refinery and forge real-time cryptographic structures.</p>
          <div className="flex justify-center relative z-10">
            <Link 
                to="/playground"
                onClick={playClick}
                className="px-10 py-4 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
            >
                Launch Playground
            </Link>
          </div>
      </div>
    </div>
  );
};

export default Learn;