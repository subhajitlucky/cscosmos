import { Link } from '@/components/visualizers/shared/RouterShim';
import { Button } from '../components/ui/button';
import { ArrowRight, Box, Zap, Activity, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

const FloatingPrimitive = ({ delay, x, y, icon: Icon }: { delay: number, x: string, y: string, icon: React.ElementType }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
            opacity: [0.1, 0.3, 0.1],
            y: [0, -40, 0],
            rotate: [0, 10, -10, 0]
        }}
        transition={{ 
            duration: 10, 
            delay, 
            repeat: Infinity,
            ease: "easeInOut" 
        }}
        style={{ left: x, top: y }}
        className="absolute z-0 pointer-events-none hidden md:block"
    >
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-3xl shadow-2xl">
            <Icon className="w-12 h-12 text-primary/20" />
        </div>
    </motion.div>
);

export const LandingPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center overflow-hidden bg-background">
      
      {/* --- ELITE BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {/* Technical Grid */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{ backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        
        {/* Atmospheric Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        
        {/* Floating Primitives */}
        <FloatingPrimitive x="15%" y="20%" delay={0} icon={Box} />
        <FloatingPrimitive x="80%" y="15%" delay={2} icon={Lock} />
        <FloatingPrimitive x="10%" y="70%" delay={4} icon={Zap} />
        <FloatingPrimitive x="85%" y="65%" delay={1} icon={Globe} />
      </div>

      {/* --- HERO CONTENT --- */}
      <section className="relative z-10 w-full flex-1 flex flex-col items-center justify-start text-center px-6 pt-12 md:pt-24 pb-20 md:pb-32">
        <div className="container max-w-screen-xl mx-auto">
            
            {/* Upper Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-primary mb-10 shadow-xl shadow-primary/5 backdrop-blur-md"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Protocol v1.0 Live
            </motion.div>

            {/* Main Headline */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
            >
                <h1 className="text-6xl font-black tracking-[-0.04em] sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/40">
                    Architect Your <br />
                    <span className="text-primary italic font-serif pr-4">Knowledge</span> Graph.
                </h1>
                
                <p className="mx-auto max-w-[750px] text-muted-foreground text-lg md:text-2xl font-medium leading-relaxed tracking-tight">
                    Beyond simple blocks. Peer into the <span className="text-foreground font-bold underline decoration-primary/30 underline-offset-4">cryptographic core</span> of decentralized state machines. Execute transitions, resolve forks, and witness immutability in real-time.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-10">
                    <Link to="/concepts">
                        <Button className="h-16 px-10 text-lg font-black uppercase tracking-widest gap-3 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                            Start Journey <ArrowRight className="w-6 h-6" />
                        </Button>
                    </Link>
                    <Link to="/playground">
                        <Button variant="outline" className="h-16 px-10 text-lg font-black uppercase tracking-widest rounded-2xl border-2 hover:bg-secondary/50 backdrop-blur-md transition-all active:scale-95">
                            Playground
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-20 flex flex-col items-center gap-2 opacity-30"
            >
                <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Explore Systems</span>
            </motion.div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="relative z-10 w-full bg-secondary/5 border-t border-border/50 py-32 backdrop-blur-sm">
        <div className="container max-w-screen-xl mx-auto px-6 md:px-8">
            <div className="grid md:grid-cols-3 gap-16">
                {[
                    { title: "Deterministic State", icon: Box, text: "Visualize the S_{n} → S_{n+1} transition function. Understand why consensus is mathematical certainty." },
                    { title: "Asymmetric Proofs", icon: Lock, text: "Interact with ECDSA and Schnorr primitives. Forge signatures and witness verification math." },
                    { title: "Gossip Integrity", icon: Activity, text: "Observe asynchronous packet propagation. Learn how distributed nodes resolve the CAP theorem." }
                ].map((feature, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -10 }}
                        className="flex flex-col items-center text-center space-y-6 group"
                    >
                        <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-500 shadow-2xl">
                            <feature.icon className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-black uppercase tracking-tighter">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                                {feature.text}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
