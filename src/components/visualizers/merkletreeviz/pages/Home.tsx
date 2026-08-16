import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { ShieldCheck, Zap, Layers, ArrowRight, Fingerprint, Database, Cpu } from 'lucide-react';
import { useSound } from '../hooks/useSound';

const Home = () => {
  const { playHover, playClick } = useSound();
  const { scrollY } = useScroll();
  
  // Parallax and scroll effects
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y1Spring = useSpring(y1, springConfig);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* 1. QUANTUM GRID BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--muted) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />
        {/* Perspective Lines */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-accent/10 to-transparent perspective-[1000px]">
            <div 
                className="w-[200%] h-full ml-[-50%] rotate-x-[60deg] refinery-grid opacity-20"
                style={{ transform: 'rotateX(60deg)' }}
            />
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-32 px-4 max-w-7xl mx-auto z-10">
        <motion.div 
          style={{ y: y1Spring, opacity, scale }}
          className="flex flex-col items-center text-center space-y-8 mb-24"
        >
          {/* Version/Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group px-4 py-1.5 rounded-full border border-muted/20 bg-card/50 backdrop-blur-md text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-3"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Protocols Active: v2.0.26
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[10rem] font-black leading-[0.85] tracking-tighter"
          >
            THE SUMMIT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-accent to-accent/40">OF TRUST</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl text-muted-foreground font-medium leading-relaxed"
          >
            Experience the geometric elegance of Merkle Trees. From raw data shards to a single, immutable cryptographic fingerprint. 
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link 
              to="/playground"
              onMouseEnter={playHover}
              onClick={playClick}
              className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
            >
              Enter the Refinery
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/learn"
              onMouseEnter={playHover}
              onClick={playClick}
              className="px-10 py-5 bg-card border border-muted/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all"
            >
              Theory & Proofs
            </Link>
          </motion.div>
        </motion.div>

        {/* 3. THE SUMMIT VISUALIZER (BENTO STYLE) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[200px]">
            {/* Main Reconstruction Box */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-8 md:row-span-3 bg-card border border-muted/10 rounded-[3rem] relative overflow-hidden group p-12 flex items-center justify-center shadow-2xl"
            >
                <div className="absolute inset-0 refinery-grid opacity-10" />
                <div className="relative z-10 w-full max-w-lg">
                    {/* Abstract Tree Assembly Animation */}
                    <div className="flex flex-col items-center gap-12">
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-24 h-24 bg-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-accent/40"
                        >
                            <ShieldCheck className="text-white w-12 h-12" />
                        </motion.div>
                        
                        <div className="grid grid-cols-4 gap-4 w-full">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-4">
                                    <div className="w-1 h-12 bg-gradient-to-b from-accent/50 to-transparent" />
                                    <motion.div 
                                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1, 0.9] }}
                                        transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                                        className="w-full aspect-square bg-secondary rounded-xl border border-muted/20 flex items-center justify-center"
                                    >
                                        <Database className="w-4 h-4 text-muted" />
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-8 left-12 flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Active Reconstruction</span>
                    <span className="text-xs text-muted-foreground">Merkle Root verification in progress...</span>
                </div>
            </motion.div>

            {/* Micro-Card 1: Immutable */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-4 md:row-span-1 bg-accent/5 border border-accent/10 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:bg-accent/10 transition-colors"
            >
                <Fingerprint className="text-accent w-8 h-8" />
                <div>
                    <h3 className="font-bold text-lg leading-tight uppercase tracking-tighter">Immutable Identity</h3>
                    <p className="text-xs text-muted-foreground">Every leaf is a unique cryptographic commitment.</p>
                </div>
            </motion.div>

            {/* Micro-Card 2: Efficiency */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-4 md:row-span-2 bg-card border border-muted/10 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden"
            >
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                    <Zap className="text-primary w-6 h-6" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold text-2xl uppercase tracking-tighter">Logarithmic Speed</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Verify a single transaction among billions with just a handful of hashes. True O(log n) efficiency.</p>
                </div>
                <div className="pt-4 border-t border-muted/10 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-accent/20 border-2 border-background" />)}
                    </div>
                    Verified Scalability
                </div>
            </motion.div>
        </div>
      </section>

      {/* 4. THE CORE ARCHITECTURE SECTION */}
      <section className="py-32 px-4 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 px-4">
            <div className="max-w-2xl space-y-4">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">Powering the <br /> <span className="text-muted/40">Next Generation</span></h2>
                <p className="text-muted-foreground font-medium italic">"Merkle trees are the core architecture powering Bitcoin, Ethereum, and Git. Distributed trust, visualized."</p>
            </div>
            <Link to="/learn" className="text-xs font-black uppercase tracking-[0.3em] text-accent flex items-center gap-2 group">
                Explore the Protocol
                <div className="w-8 h-px bg-accent/30 group-hover:w-12 transition-all" />
            </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {[
                { icon: Layers, title: "Binary Integrity", desc: "Binary pairing ensures that every piece of data is accounted for in the final root." },
                { icon: Cpu, title: "Hardware Optimized", desc: "Designed for parallel processing and rapid verification across distributed nodes." },
                { icon: ShieldCheck, title: "Zero Trust", desc: "Verify everything, trust nothing. The math is the only authority you need." }
            ].map((item, i) => (
                <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="p-10 bg-card/50 backdrop-blur-sm border border-muted/10 rounded-[3rem] space-y-6 hover:border-accent/30 transition-all shadow-lg"
                >
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                        <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-xl uppercase tracking-tighter">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 px-4 max-w-5xl mx-auto text-center">
        <div className="bg-neutral-950 dark:bg-neutral-900 p-12 md:p-24 rounded-[4rem] text-white space-y-8 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-white/5">
            <div className="absolute inset-0 refinery-grid opacity-10 pointer-events-none" />
            <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="text-4xl md:text-7xl font-black leading-none tracking-tighter relative z-10"
            >
                READY TO FORGE <br /> YOUR OWN TREE?
            </motion.h2>
            <div className="flex justify-center relative z-10">
                <Link 
                    to="/playground"
                    onClick={playClick}
                    className="px-12 py-6 bg-accent text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-accent/30"
                >
                    Launch Playground
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;